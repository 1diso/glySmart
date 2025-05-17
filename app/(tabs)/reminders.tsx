import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Button, Card, Modal, Portal, Text, TextInput } from 'react-native-paper';
import { LogoHeader } from '../../components/LogoHeader';
import { Reminder, useRemindersLocal } from '../../hooks/useRemindersLocal';

export default function RemindersScreen() {
  const { saveReminder, getReminders, deleteReminder } = useRemindersLocal();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    const data = await getReminders();
    setReminders(data.sort((a, b) => a.time - b.time));
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      alert('El título es obligatorio');
      return;
    }
    await saveReminder({
      title,
      description,
      time: date.getTime(),
    });
    setVisible(false);
    setTitle('');
    setDescription('');
    setDate(new Date());
    loadReminders();
  };

  const handleDelete = async (id: string) => {
    await deleteReminder(id);
    loadReminders();
  };

  const getRemindersByStatus = () => {
    const now = Date.now();
    return {
      active: reminders.filter(r => r.time > now),
      completed: reminders.filter(r => r.time <= now)
    };
  };

  const { active, completed } = getRemindersByStatus();

  return (
    <View style={styles.container}>
      <LogoHeader />
      
      <Text variant="headlineMedium" style={styles.title}>Recordatorios</Text>
      <Button 
        mode="contained" 
        onPress={() => setVisible(true)} 
        style={styles.addButton}
        buttonColor="#1565C0"
      >
        Crear recordatorio
      </Button>

      <View style={styles.remindersContainer}>
        {active.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Próximos recordatorios</Text>
            {active.map((reminder) => (
              <Card key={reminder.id} style={styles.card}>
                <Card.Content>
                  <Text style={styles.reminderTitle}>{reminder.title}</Text>
                  {reminder.description && (
                    <Text style={styles.reminderDescription}>{reminder.description}</Text>
                  )}
                  <Text style={styles.reminderTime}>
                    {new Date(reminder.time).toLocaleString()}
                  </Text>
                </Card.Content>
                <Card.Actions>
                  <Button 
                    onPress={() => handleDelete(reminder.id)} 
                    textColor="#F44336"
                  >
                    Eliminar
                  </Button>
                </Card.Actions>
              </Card>
            ))}
          </View>
        )}

        {completed.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recordatorios cumplidos</Text>
            {completed.map((reminder) => (
              <Card key={reminder.id} style={[styles.card, styles.completedCard]}>
                <Card.Content>
                  <Text style={[styles.reminderTitle, styles.completedText]}>{reminder.title}</Text>
                  {reminder.description && (
                    <Text style={[styles.reminderDescription, styles.completedText]}>{reminder.description}</Text>
                  )}
                  <Text style={[styles.reminderTime, styles.completedText]}>
                    {new Date(reminder.time).toLocaleString()}
                  </Text>
                </Card.Content>
                <Card.Actions>
                  <Button 
                    onPress={() => handleDelete(reminder.id)} 
                    textColor="#F44336"
                  >
                    Eliminar
                  </Button>
                </Card.Actions>
              </Card>
            ))}
          </View>
        )}

        {reminders.length === 0 && (
          <Text style={styles.emptyText}>No hay recordatorios</Text>
        )}
      </View>

      <Portal>
        <Modal 
          visible={visible} 
          onDismiss={() => setVisible(false)} 
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>Nuevo recordatorio</Text>
          <TextInput
            label="Título"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            mode="outlined"
            activeOutlineColor="#1565C0"
            outlineColor="#2196F3"
          />
          <TextInput
            label="Descripción (opcional)"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            mode="outlined"
            activeOutlineColor="#1565C0"
            outlineColor="#2196F3"
            multiline
            numberOfLines={3}
          />
          <Button 
            mode="outlined" 
            onPress={() => setShowDate(true)} 
            style={styles.input}
            textColor="#1565C0"
          >
            Fecha: {date.toLocaleDateString()}
          </Button>
          <Button 
            mode="outlined" 
            onPress={() => setShowTime(true)} 
            style={styles.input}
            textColor="#1565C0"
          >
            Hora: {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Button>
          {showDate && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, selected) => {
                setShowDate(false);
                if (selected) setDate(new Date(date.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate())));
              }}
              minimumDate={new Date()}
            />
          )}
          {showTime && (
            <DateTimePicker
              value={date}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, selected) => {
                setShowTime(false);
                if (selected) setDate(new Date(date.setHours(selected.getHours(), selected.getMinutes())));
              }}
            />
          )}
          <Button 
            mode="contained" 
            onPress={handleCreate} 
            style={styles.saveButton}
            buttonColor="#1565C0"
          >
            Guardar
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
    backgroundColor: '#fff',
  },
  title: {
    color: '#1565C0',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 28,
  },
  addButton: {
    marginBottom: 20,
    width: '80%',
    alignSelf: 'center',
  },
  remindersContainer: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
  },
  card: {
    marginBottom: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
  },
  reminderTitle: {
    color: '#1565C0',
    fontSize: 18,
    fontWeight: 'bold',
  },
  reminderDescription: {
    color: '#666',
    marginTop: 5,
    fontSize: 16,
  },
  reminderTime: {
    color: '#2196F3',
    marginTop: 5,
    fontSize: 14,
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  modalTitle: {
    color: '#1565C0',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  saveButton: {
    marginTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#1565C0',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 5,
  },
  completedCard: {
    backgroundColor: '#F5F5F5',
    opacity: 0.8,
  },
  completedText: {
    color: '#666',
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
}); 