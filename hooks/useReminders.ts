import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../constants/Firebase';

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  description: string;
  time: Timestamp;
  frequency: 'daily' | 'weekly' | 'monthly' | 'once';
  active: boolean;
}

export const useReminders = (userId: string) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  const createReminder = async (reminder: Omit<Reminder, 'id' | 'userId'>) => {
    try {
      const docRef = await addDoc(collection(db, 'reminders'), {
        ...reminder,
        userId,
        time: Timestamp.fromDate(new Date(reminder.time.toDate()))
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  };

  const updateReminder = async (reminderId: string, updates: Partial<Reminder>) => {
    try {
      await updateDoc(doc(db, 'reminders', reminderId), updates);
      setReminders(reminders.map(reminder => 
        reminder.id === reminderId ? { ...reminder, ...updates } : reminder
      ));
    } catch (error) {
      throw error;
    }
  };

  const deleteReminder = async (reminderId: string) => {
    try {
      await deleteDoc(doc(db, 'reminders', reminderId));
      setReminders(reminders.filter(reminder => reminder.id !== reminderId));
    } catch (error) {
      throw error;
    }
  };

  const fetchReminders = async () => {
    try {
      const q = query(
        collection(db, 'reminders'),
        where('userId', '==', userId),
        orderBy('time', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      const reminders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Reminder[];
      
      setReminders(reminders);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingReminders = () => {
    const now = new Date();
    return reminders
      .filter(reminder => reminder.active && reminder.time.toDate() > now)
      .sort((a, b) => a.time.toDate().getTime() - b.time.toDate().getTime());
  };

  const getRemindersByFrequency = (frequency: Reminder['frequency']) => {
    return reminders.filter(reminder => reminder.frequency === frequency);
  };

  const toggleReminder = async (reminderId: string) => {
    const reminder = reminders.find(r => r.id === reminderId);
    if (reminder) {
      await updateReminder(reminderId, { active: !reminder.active });
    }
  };

  useEffect(() => {
    if (userId) {
      fetchReminders();
    }
  }, [userId]);

  return {
    reminders,
    loading,
    createReminder,
    updateReminder,
    deleteReminder,
    fetchReminders,
    getUpcomingReminders,
    getRemindersByFrequency,
    toggleReminder
  };
}; 