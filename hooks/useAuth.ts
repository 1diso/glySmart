import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState } from 'react';

export type User = {
  id: string;
  email: string;
  name?: string;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  const signIn = useCallback(async (email: string, password: string) => {
    // Simulación de autenticación local
    const user: User = {
      id: 'local-user',
      email,
      name: email.split('@')[0]
    };
    await AsyncStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    return user;
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
  }, []);

  const checkAuth = useCallback(async () => {
    const stored = await AsyncStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return { user, signIn, signOut, checkAuth };
} 