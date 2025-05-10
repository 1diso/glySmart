import DateTimePicker from '@react-native-community/datetimepicker';
import { Timestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Modal, Portal, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { useAuth } from '../../hooks/useAuth';
import { Reminder, useReminders } from '../../hooks/useReminders';
import { validateReminder } from '../../hooks/useValidation';

export default function RemindersScreen() {
  const { user } = useAuth();
  const { 
    reminders, 
    loading, 
    createReminder, 
    updateReminder, 
    deleteReminder,
    getUpcomingReminders,
    getRemindersByFrequency,
    toggleReminder
  } = useReminders(user?.uid || '');
  
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState(new Date());
  const [frequency, setFrequency] = useState<Reminder['frequency']>('once');
  const [errors, setErrors] = useState<string[]>([]);
  const [filter, setFilter] = useState<Reminder['frequency'] | 'all'>('all');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleCreateReminder = async () => {
    const validationErrors = validateReminder({ title, time, frequency });
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await createReminder({
        title,
        description,
        time: Timestamp.fromDate(new Date(time)),
        frequency,
        active: true
      });
      setVisible(false);
      resetForm();
    } catch (error) {
      setErrors(['Error al crear el recordatorio']);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTime(new Date());
    setFrequency('once');
    setErrors([]);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setTime(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newTime = new Date(time);
      newTime.setHours(selectedTime.getHours());
      newTime.setMinutes(selectedTime.getMinutes());
      setTime(newTime);
    }
  };

  const filteredReminders = filter === 'all' 
    ? getUpcomingReminders()
    : getRemindersByFrequency(filter);

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Recordatorios</Text>
      
      <Button 
        mode="contained" 
        onPress={() => setVisible(true)}
        style={styles.addButton}
      >
        Agregar Recordatorio
      </Button>

      <SegmentedButtons
        value={filter}
        onValueChange={value => setFilter(value as Reminder['frequency'] | 'all')}
        buttons={[
          { value: 'all', label: 'Todos' },
          { value: 'daily', label: 'Diarios' },
          { value: 'weekly', label: 'Semanales' },
          { value: 'monthly', label: 'Mensuales' },
        ]}
        style={styles.filter}
      />

      <ScrollView>
        {filteredReminders.map((reminder) => (
          <Card key={reminder.id} style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">{reminder.title}</Text>
              <Text variant="bodyMedium">{reminder.description}</Text>
              <Text variant="bodySmall">
                {new Date(reminder.time.seconds * 1000).toLocaleString()}
              </Text>
              <Text variant="bodySmall">Frecuencia: {reminder.frequency}</Text>
            </Card.Content>
            <Card.Actions>
              <Button 
                onPress={() => updateReminder(reminder.id, { active: !reminder.active })}
              >
                {reminder.active ? 'Desactivar' : 'Activar'}
              </Button>
              <Button 
                onPress={() => deleteReminder(reminder.id)}
                textColor="red"
              >
                Eliminar
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => {
            setVisible(false);
            resetForm();
          }}
          contentContainerStyle={styles.modal}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>
            Nuevo Recordatorio
          </Text>
          
          {errors.length > 0 && (
            <View style={styles.errorContainer}>
              {errors.map((error, index) => (
                <Text key={index} style={styles.errorText}>
                  {error}
                </Text>
              ))}
            </View>
          )}

          <TextInput
            label="Título"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            error={errors.includes('El título es requerido')}
          />
          
          <TextInput
            label="Descripción"
            value={description}
            onChangeText={setDescription}
            multiline
            style={styles.input}
          />

          <View style={styles.dateTimeContainer}>
            <Button 
              mode="outlined" 
              onPress={() => setShowDatePicker(true)}
              style={styles.dateTimeButton}
            >
              Fecha: {time.toLocaleDateString()}
            </Button>
            
            <Button 
              mode="outlined" 
              onPress={() => setShowTimePicker(true)}
              style={styles.dateTimeButton}
            >
              Hora: {time.toLocaleTimeString()}
            </Button>
          </View>

          {(showDatePicker || Platform.OS === 'ios') && (
            <DateTimePicker
              value={time}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          {(showTimePicker || Platform.OS === 'ios') && (
            <DateTimePicker
              value={time}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleTimeChange}
            />
          )}

          <SegmentedButtons
            value={frequency}
            onValueChange={value => setFrequency(value as Reminder['frequency'])}
            buttons={[
              { value: 'once', label: 'Una vez' },
              { value: 'daily', label: 'Diario' },
              { value: 'weekly', label: 'Semanal' },
              { value: 'monthly', label: 'Mensual' },
            ]}
            style={styles.frequencyButtons}
          />

          <Button 
            mode="contained" 
            onPress={handleCreateReminder}
            style={styles.modalButton}
          >
            Crear Recordatorio
          </Button>
        </Modal>
      </Portal>
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
  addButton: {
    marginBottom: 20,
  },
  card: {
    marginBottom: 10,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  modalButton: {
    marginTop: 10,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 4,
    marginBottom: 15,
  },
  errorText: {
    color: '#c62828',
    marginBottom: 5,
  },
  filter: {
    marginBottom: 15,
  },
  frequencyButtons: {
    marginBottom: 15,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateTimeButton: {
    flex: 1,
    marginHorizontal: 5,
  },
}); 