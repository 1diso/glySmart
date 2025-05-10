export interface User {
  id: string;
  email: string;
  name: string;
}

export interface GlucoseRecord {
  id: string;
  userId: string;
  value: number;
  timestamp: string;
  notes?: string;
}

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  description: string;
  time: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  active: boolean;
}

export interface Alert {
  id: string;
  userId: string;
  type: 'high' | 'low' | 'medication' | 'appointment';
  message: string;
  timestamp: string;
  read: boolean;
} 