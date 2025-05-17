import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { LogoHeader } from '../../components/LogoHeader';
import { GlucoseRecord, useGlucoseLocal } from '../../hooks/useGlucoseLocal';

export default function HistoryScreen() {
  const { getRecords } = useGlucoseLocal();
  const [records, setRecords] = useState<GlucoseRecord[]>([]);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    const data = await getRecords();
    setRecords(data);
  };

  const getCategory = (value: number) => {
    if (value < 70) return { label: 'Bajo', color: '#FFC107' };
    if (value > 180) return { label: 'Alto', color: '#F44336' };
    return { label: 'Normal', color: '#4CAF50' };
  };

  return (
    <View style={styles.container}>
      <View style={styles.fixedHeader}>
        <LogoHeader />
        <Text variant="headlineMedium" style={styles.title}>Historial</Text>
      </View>

      <View style={styles.scrollContainer}>
        <ScrollView style={styles.content}>
          {records.map((record) => {
            const category = getCategory(record.value);
            return (
              <Card key={record.id} style={styles.card}>
                <Card.Content>
                  <View style={styles.recordHeader}>
                    <Text variant="titleLarge" style={[styles.value, { color: category.color }]}>
                      {record.value} mg/dL
                    </Text>
                    <Text style={[styles.category, { color: category.color }]}>
                      {category.label}
                    </Text>
                  </View>
                  <Text style={styles.timestamp}>
                    {new Date(record.timestamp).toLocaleString()}
                  </Text>
                </Card.Content>
              </Card>
            );
          })}

          {records.length === 0 && (
            <Text style={styles.emptyText}>No hay registros</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 10,
  },
  scrollContainer: {
    flex: 1,
    marginTop: 210,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    color: '#1565C0',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    fontSize: 28,
  },
  card: {
    marginBottom: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  value: {
    fontWeight: 'bold',
  },
  category: {
    fontWeight: '500',
  },
  timestamp: {
    color: '#2196F3',
    marginTop: 8,
    fontSize: 14,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
}); 