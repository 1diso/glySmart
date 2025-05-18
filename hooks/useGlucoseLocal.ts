import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';

// Reemplazar el uso de uuid con una función simple para generar IDs únicos
function generateSimpleId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export type GlucoseRecord = {
  id: string;
  value: number;
  timestamp: number;
  notes?: string;
};

export function useGlucoseLocal() {
  const saveRecord = useCallback(async (record: Omit<GlucoseRecord, 'id'>) => {
    try {
      // Usar nuestra función de generación de ID en lugar de uuidv4()
      const id = generateSimpleId();
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