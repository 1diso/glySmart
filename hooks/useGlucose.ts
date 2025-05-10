import {
    addDoc,
    collection,
    DocumentSnapshot,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
    Timestamp,
    where
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../constants/Firebase';

export interface GlucoseRecord {
  id: string;
  userId: string;
  value: number;
  notes?: string;
  timestamp: Timestamp;
}

export const useGlucose = (userId: string) => {
  const [records, setRecords] = useState<GlucoseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const addRecord = async (value: number, notes?: string) => {
    try {
      const docRef = await addDoc(collection(db, 'glucose_records'), {
        userId,
        value,
        notes,
        timestamp: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  };

  const fetchRecords = async (loadMore = false) => {
    try {
      let q = query(
        collection(db, 'glucose_records'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(10)
      );

      if (loadMore && lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      const newRecords = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GlucoseRecord[];

      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === 10);

      if (loadMore) {
        setRecords(prev => [...prev, ...newRecords]);
      } else {
        setRecords(newRecords);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchRecords();
    }
  }, [userId]);

  return {
    records,
    loading,
    hasMore,
    addRecord,
    fetchRecords: () => fetchRecords(true)
  };
}; 