import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { LogoHeader } from '../../components/LogoHeader';
import { useGlucoseLocal } from '../../hooks/useGlucoseLocal';

type Alert = {
  id: string;
  type: 'high' | 'low';
  message: string;
  timestamp: number;
  value: number;
};

export default function AlertsScreen() {
  const { getRecords } = useGlucoseLocal();
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    const records = await getRecords();
    const newAlerts: Alert[] = records
      .filter(record => record.value < 70 || record.value > 180)
      .map(record => {
        const type = record.value < 70 ? 'low' : 'high';
        const message = record.value < 70 
          ? 'Nivel de glucosa bajo' 
          : 'Nivel de glucosa alto';

        return {
          id: record.id,
          type,
          message,
          timestamp: record.timestamp,
          value: record.value
        };
      });

    setAlerts(newAlerts.sort((a, b) => b.timestamp - a.timestamp));
  };

  const getAlertColor = (type: 'high' | 'low') => {
    return type === 'high' ? '#F44336' : '#FFC107';
  };

  const getAlertIcon = (type: 'high' | 'low') => {
    return type === 'high' ? '↑' : '↓';
  };

  return (
    <View style={styles.container}>
      <LogoHeader />
      
      <Text variant="headlineMedium" style={styles.title}>Alertas</Text>

      <View style={styles.alertsContainer}>
        {alerts.map((alert) => (
          <Card key={alert.id} style={styles.card}>
            <Card.Content>
              <View style={styles.alertHeader}>
                <View style={[styles.indicator, { backgroundColor: getAlertColor(alert.type) }]} />
                <Text style={[styles.alertType, { color: getAlertColor(alert.type) }]}>
                  {getAlertIcon(alert.type)} {alert.message}
                </Text>
              </View>
              <Text style={styles.alertValue}>
                {alert.value} mg/dL
              </Text>
              <Text style={styles.alertTime}>
                {new Date(alert.timestamp).toLocaleString()}
              </Text>
            </Card.Content>
          </Card>
        ))}

        {alerts.length === 0 && (
          <Text style={styles.emptyText}>No hay alertas</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    color: '#1565C0',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 28,
  },
  alertsContainer: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
  },
  card: {
    marginBottom: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  indicator: {
    width: 6,
    height: 24,
    borderRadius: 3,
    marginRight: 8,
  },
  alertType: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  alertValue: {
    color: '#1565C0',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  alertTime: {
    color: '#2196F3',
    fontSize: 14,
    marginTop: 4,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
}); 