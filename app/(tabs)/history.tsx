import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { LogoHeader } from '../../components/LogoHeader';
import { GlucoseRecord, useGlucoseLocal } from '../../hooks/useGlucoseLocal';

export default function HistoryScreen() {
  const { getRecords } = useGlucoseLocal();
  const [records, setRecords] = useState<GlucoseRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Usar useFocusEffect para recargar los datos cada vez que la pantalla recibe el foco
  useFocusEffect(
    React.useCallback(() => {
      loadRecords();
      return () => {};
    }, [])
  );

  const loadRecords = async () => {
    try {
      setLoading(true);
      const data = await getRecords();
      // Ordenar por fecha, del más reciente al más antiguo
      data.sort((a, b) => b.timestamp - a.timestamp);
      setRecords(data);
    } catch (error) {
      console.error('Error al cargar registros:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategory = (value: number) => {
    if (value < 70) return { label: 'Bajo', color: '#FFC107' };
    if (value > 180) return { label: 'Alto', color: '#F44336' };
    return { label: 'Normal', color: '#4CAF50' };
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <LogoHeader />
        <Text variant="headlineMedium" style={styles.title}>Historial</Text>
      </View>

      <ScrollView style={styles.content}>
        {loading && records.length === 0 ? (
          <Text style={styles.loadingText}>Cargando registros...</Text>
        ) : records.length > 0 ? (
          records.map((record) => {
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
                  {record.notes && (
                    <Text style={styles.notes}>
                      Notas: {record.notes}
                    </Text>
                  )}
                </Card.Content>
              </Card>
            );
          })
        ) : (
          <Text style={styles.emptyText}>No hay registros</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    color: '#1565C0',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: 'bold',
    fontSize: 28,
  },
  card: {
    marginBottom: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    elevation: 3,
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
  notes: {
    color: '#666',
    marginTop: 5,
    fontSize: 14,
    fontStyle: 'italic',
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  loadingText: {
    color: '#1565C0',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
}); 