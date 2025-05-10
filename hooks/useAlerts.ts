import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../constants/Firebase';

export interface Alert {
  id: string;
  userId: string;
  type: 'high' | 'low' | 'medication' | 'appointment';
  message: string;
  timestamp: Timestamp;
  read: boolean;
}

export const useAlerts = (userId: string) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const createAlert = async (type: Alert['type'], message: string) => {
    try {
      const docRef = await addDoc(collection(db, 'alerts'), {
        userId,
        type,
        message,
        timestamp: Timestamp.now(),
        read: false
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  };

  const markAsRead = async (alertId: string) => {
    try {
      await updateDoc(doc(db, 'alerts', alertId), {
        read: true
      });
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, read: true } : alert
      ));
    } catch (error) {
      throw error;
    }
  };

  const fetchAlerts = async () => {
    try {
      const q = query(
        collection(db, 'alerts'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const alerts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Alert[];
      
      setAlerts(alerts);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const checkGlucoseLevels = async (glucoseValue: number) => {
    try {
      // Obtener configuración del usuario
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userData = userDoc.data();
      const { min, max } = userData?.settings?.glucoseRange || { min: 70, max: 180 };

      if (glucoseValue < min) {
        await createAlert('low', `Nivel de glucosa bajo: ${glucoseValue} mg/dL`);
      } else if (glucoseValue > max) {
        await createAlert('high', `Nivel de glucosa alto: ${glucoseValue} mg/dL`);
      }
    } catch (error) {
      console.error('Error al verificar niveles de glucosa:', error);
    }
  };

  const getUnreadCount = () => {
    return alerts.filter(alert => !alert.read).length;
  };

  const getAlertsByType = (type: Alert['type']) => {
    return alerts.filter(alert => alert.type === type);
  };

  useEffect(() => {
    if (userId) {
      fetchAlerts();
    }
  }, [userId]);

  return {
    alerts,
    loading,
    createAlert,
    markAsRead,
    fetchAlerts,
    checkGlucoseLevels,
    getUnreadCount,
    getAlertsByType
  };
}; 