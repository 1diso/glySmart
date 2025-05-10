import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { useAuth } from '../../hooks/useAuth';
import { useGlucose } from '../../hooks/useGlucose';

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { records, loading } = useGlucose(user?.uid || '');

  const getLatestGlucose = () => {
    if (!records.length) return 'No hay registros';
    return `${records[0].value} mg/dL`;
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Dashboard</Text>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Último registro</Text>
          <Text variant="displaySmall" style={styles.glucoseValue}>
            {getLatestGlucose()}
          </Text>
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Button 
          mode="contained" 
          onPress={() => router.push('/glucose')}
          style={styles.button}
        >
          Registrar Glucosa
        </Button>
        
        <Button 
          mode="contained" 
          onPress={() => router.push('/history')}
          style={styles.button}
        >
          Ver Historial
        </Button>
        
        <Button 
          mode="contained" 
          onPress={() => router.push('/alerts')}
          style={styles.button}
        >
          Alertas
        </Button>
        
        <Button 
          mode="contained" 
          onPress={() => router.push('/reminders')}
          style={styles.button}
        >
          Recordatorios
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    marginBottom: 20,
  },
  glucoseValue: {
    textAlign: 'center',
    marginTop: 10,
  },
  actions: {
    gap: 10,
  },
  button: {
    marginVertical: 5,
  },
}); 