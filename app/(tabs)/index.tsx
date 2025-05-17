import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { LogoHeader } from '../../components/LogoHeader';
import { GlucoseRecord, useGlucoseLocal } from '../../hooks/useGlucoseLocal';

function getCategory(value: number) {
  if (value < 100) return { label: 'Normal', color: '#2196F3' };
  if (value < 126) return { label: 'Pre-diabetes', color: '#FFC107' };
  return { label: 'Diabetes', color: '#F44336' };
}

export default function HomeScreen() {
  const router = useRouter();
  const { getRecords } = useGlucoseLocal();
  const [records, setRecords] = useState<GlucoseRecord[]>([]);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    const data = await getRecords();
    setRecords(data);
  };

  const getLatestGlucose = () => {
    if (!records.length) return { value: 'No hay registros', category: { label: '', color: '#666' } };
    const latest = records[0];
    return {
      value: `${latest.value} mg/dL`,
      category: getCategory(latest.value)
    };
  };

  const getAverageGlucose = () => {
    if (!records.length) return 'No hay registros';
    const sum = records.reduce((acc, curr) => acc + curr.value, 0);
    return `${Math.round(sum / records.length)} mg/dL`;
  };

  const getLastWeekRecords = () => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return records.filter(r => r.timestamp >= oneWeekAgo).length;
  };

  return (
    <ScrollView style={styles.container}>
      <LogoHeader />
      
      <Text variant="headlineMedium" style={styles.title}>Bienvenido a GlySmart</Text>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>Último registro</Text>
          <Text variant="displaySmall" style={[styles.glucoseValue, { color: getLatestGlucose().category.color }]}>
            {getLatestGlucose().value}
          </Text>
          {getLatestGlucose().category.label && (
            <Text style={[styles.category, { color: getLatestGlucose().category.color }]}>
              {getLatestGlucose().category.label}
            </Text>
          )}
        </Card.Content>
      </Card>

      <View style={styles.statsContainer}>
        <Card style={styles.statsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>Promedio</Text>
            <Text variant="headlineSmall" style={styles.statsValue}>
              {getAverageGlucose()}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>Registros esta semana</Text>
            <Text variant="headlineSmall" style={styles.statsValue}>
              {getLastWeekRecords()}
            </Text>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.actions}>
        <Button 
          mode="contained" 
          onPress={() => router.push('/glucose')}
          style={styles.button}
          buttonColor="#2196F3"
        >
          Registrar Glucosa
        </Button>
        
        <Button 
          mode="contained" 
          onPress={() => router.push('/history')}
          style={styles.button}
          buttonColor="#2196F3"
        >
          Ver Historial
        </Button>

        <Button 
          mode="contained" 
          onPress={() => router.push('/reminders')}
          style={styles.button}
          buttonColor="#2196F3"
        >
          Gestionar Recordatorios
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#1565C0',
  },
  card: {
    marginBottom: 20,
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
    borderWidth: 1,
  },
  cardTitle: {
    color: '#1565C0',
  },
  glucoseValue: {
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
  category: {
    textAlign: 'center',
    marginTop: 5,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statsCard: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
    borderWidth: 1,
  },
  statsValue: {
    textAlign: 'center',
    marginTop: 5,
    color: '#1565C0',
  },
  actions: {
    gap: 10,
  },
  button: {
    marginVertical: 5,
  },
});
