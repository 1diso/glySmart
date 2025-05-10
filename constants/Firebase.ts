import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCteijLZVyf4MkXkMb5LrwFjHvsVlYl_TU",
    authDomain: "glysmart-9b2f4.firebaseapp.com",
    projectId: "glysmart-9b2f4",
    storageBucket: "glysmart-9b2f4.firebasestorage.app",
    messagingSenderId: "252264375633",
    appId: "1:252264375633:web:61e2192a837c8823cf5f70",
    measurementId: "G-5RK6BYDWP5"
  };
  

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar las instancias de autenticación y base de datos
export const auth = getAuth(app);
export const db = getFirestore(app);

// Tipos de datos para TypeScript
export interface User {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
}

export interface GlucoseRecord {
  id: string;
  userId: string;
  value: number;
  timestamp: Date;
  notes?: string;
}

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  description: string;
  time: Date;
  frequency: 'daily' | 'weekly' | 'monthly';
  active: boolean;
}

export interface Alert {
  id: string;
  userId: string;
  type: 'high' | 'low' | 'medication' | 'appointment';
  message: string;
  timestamp: Date;
  read: boolean;
} 