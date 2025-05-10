import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Card, Text } from 'react-native-paper';
import { useAuth } from '../../hooks/useAuth';
import { useGlucose } from '../../hooks/useGlucose';

export default function HistoryScreen() {
  const { user } = useAuth();
  const { records, loading } = useGlucose(user?.uid || '');

  const chartData = {
    labels: records.slice(0, 7).map(record => 
      new Date(record.timestamp.seconds * 1000).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })
    ).reverse(),
    datasets: [{
      data: records.slice(0, 7).map(record => record.value).reverse(),
    }],
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Historial</Text>
      
      <Card style={styles.chartCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.chartTitle}>
            Últimos 7 días
          </Text>
          <LineChart
            data={chartData}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(10, 126, 164, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      <View style={styles.recordsList}>
        {records.map((record) => (
          <Card key={record.id} style={styles.recordCard}>
            <Card.Content>
              <Text variant="titleMedium">
                {record.value} mg/dL
              </Text>
              <Text variant="bodyMedium">
                {new Date(record.timestamp.seconds * 1000).toLocaleString('es-ES')}
              </Text>
              {record.notes && (
                <Text variant="bodySmall" style={styles.notes}>
                  {record.notes}
                </Text>
              )}
            </Card.Content>
          </Card>
        ))}
      </View>
    </View>
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
  chartCard: {
    marginBottom: 20,
  },
  chartTitle: {
    textAlign: 'center',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  recordsList: {
    gap: 10,
  },
  recordCard: {
    marginBottom: 10,
  },
  notes: {
    marginTop: 5,
    fontStyle: 'italic',
  },
}); 