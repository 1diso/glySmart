import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, db } from '../constants/Firebase';
import { validateEmail, validatePassword } from './useValidation';

export class AuthError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (email: string, password: string, name: string) => {
    try {
      if (!validateEmail(email)) {
        throw new AuthError('Correo electrónico inválido', 'invalid-email');
      }
      if (!validatePassword(password)) {
        throw new AuthError('La contraseña debe tener al menos 6 caracteres', 'weak-password');
      }
      if (!name.trim()) {
        throw new AuthError('El nombre es requerido', 'invalid-name');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Actualizar el perfil del usuario
      await updateProfile(user, { displayName: name });

      // Crear documento del usuario en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        createdAt: new Date(),
        settings: {
          glucoseRange: {
            min: 70,
            max: 180
          },
          notifications: true
        }
      });

      return user;
    } catch (error: any) {
      if (error instanceof AuthError) {
        throw error;
      }
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new AuthError('El correo ya está registrado', error.code);
        case 'auth/invalid-email':
          throw new AuthError('Correo electrónico inválido', error.code);
        default:
          throw new AuthError('Error al registrar usuario', 'unknown-error');
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    loading,
    register,
    login,
    logout
  };
}; 