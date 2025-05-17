import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type Reminder = {
  id: string;
  title: string;
  description?: string;
  time: number;
};

// Configuración de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useRemindersLocal() {
  // Guarda un recordatorio
  const saveReminder = useCallback(async (reminder: Omit<Reminder, 'id'>) => {
    const id = uuidv4();
    const newReminder: Reminder = { ...reminder, id };
    const stored = await AsyncStorage.getItem('reminders');
    const reminders: Reminder[] = stored ? JSON.parse(stored) : [];
    reminders.push(newReminder);
    await AsyncStorage.setItem('reminders', JSON.stringify(reminders));
    return newReminder;
  }, []);

  // Obtiene todos los recordatorios
  const getReminders = useCallback(async (): Promise<Reminder[]> => {
    const stored = await AsyncStorage.getItem('reminders');
    return stored ? JSON.parse(stored) : [];
  }, []);

  // Elimina un recordatorio por id
  const deleteReminder = useCallback(async (id: string) => {
    const stored = await AsyncStorage.getItem('reminders');
    const reminders: Reminder[] = stored ? JSON.parse(stored) : [];
    const filtered = reminders.filter(r => r.id !== id);
    await AsyncStorage.setItem('reminders', JSON.stringify(filtered));
  }, []);

  return { saveReminder, getReminders, deleteReminder };
} 