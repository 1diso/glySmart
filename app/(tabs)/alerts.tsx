import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, IconButton, SegmentedButtons, Text } from 'react-native-paper';
import { Alert, useAlerts } from '../../hooks/useAlerts';
import { useAuth } from '../../hooks/useAuth';

export default function AlertsScreen() {
  const { user } = useAuth();
  const { alerts, loading, markAsRead, getUnreadCount, getAlertsByType } = useAlerts(user?.uid || '');
  const [filter, setFilter] = useState<Alert['type'] | 'all'>('all');

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : getAlertsByType(filter);

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'high':
        return 'arrow-up-circle';
      case 'low':
        return 'arrow-down-circle';
      case 'medication':
        return 'pill';
      case 'appointment':
        return 'calendar';
      default:
        return 'alert';
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Alertas</Text>
      
      <View style={styles.stats}>
        <Text variant="titleMedium">
          Alertas no leídas: {getUnreadCount()}
        </Text>
      </View>

      <SegmentedButtons
        value={filter}
        onValueChange={value => setFilter(value as Alert['type'] | 'all')}
        buttons={[
          { value: 'all', label: 'Todas' },
          { value: 'high', label: 'Altas' },
          { value: 'low', label: 'Bajas' },
          { value: 'medication', label: 'Medicación' },
        ]}
        style={styles.filter}
      />

      <ScrollView>
        {filteredAlerts.map((alert) => (
          <Card 
            key={alert.id} 
            style={[styles.card, alert.read && styles.readCard]}
          >
            <Card.Content style={styles.cardContent}>
              <IconButton
                icon={getAlertIcon(alert.type)}
                size={24}
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <Text variant="titleMedium">{alert.message}</Text>
                <Text variant="bodySmall">
                  {new Date(alert.timestamp.seconds * 1000).toLocaleString()}
                </Text>
              </View>
              {!alert.read && (
                <IconButton
                  icon="check"
                  onPress={() => markAsRead(alert.id)}
                  style={styles.checkButton}
                />
              )}
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
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
  card: {
    marginBottom: 10,
  },
  readCard: {
    opacity: 0.7,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    margin: 0,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  checkButton: {
    margin: 0,
  },
  stats: {
    marginBottom: 15,
  },
  filter: {
    marginBottom: 15,
  },
}); 