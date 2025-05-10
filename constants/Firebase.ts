import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
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