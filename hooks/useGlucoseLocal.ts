import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type GlucoseRecord = {
  id: string;
  value: number;
  timestamp: number;
  notes?: string;
};

export function useGlucoseLocal() {
  const saveRecord = useCallback(async (record: Omit<GlucoseRecord, 'id'>) => {
    try {
      const id = uuidv4();
      const newRecord: GlucoseRecord = { ...record, id };
      const stored = await AsyncStorage.getItem('glucose_records');
      const records: GlucoseRecord[] = stored ? JSON.parse(stored) : [];
      records.push(newRecord);
      await AsyncStorage.setItem('glucose_records', JSON.stringify(records));
      return newRecord;
    } catch (error) {
      console.error('Error al guardar registro:', error);
      throw error;
    }
  }, []);

  const getRecords = useCallback(async (): Promise<GlucoseRecord[]> => {
    const stored = await AsyncStorage.getItem('glucose_records');
    return stored ? JSON.parse(stored) : [];
  }, []);

  const deleteRecord = useCallback(async (id: string) => {
    const stored = await AsyncStorage.getItem('glucose_records');
    const records: GlucoseRecord[] = stored ? JSON.parse(stored) : [];
    const filtered = records.filter(r => r.id !== id);
    await AsyncStorage.setItem('glucose_records', JSON.stringify(filtered));
  }, []);

  return { saveRecord, getRecords, deleteRecord };
} 