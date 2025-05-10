import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useAuth } from '../../hooks/useAuth';
import { useGlucose } from '../../hooks/useGlucose';

export default function GlucoseScreen() {
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const { user } = useAuth();
  const { addRecord } = useGlucose(user?.uid || '');

  const handleSubmit = async () => {
    if (!value) return;
    
    try {
      await addRecord(Number(value), notes);
      setValue('');
      setNotes('');
    } catch (error) {
      console.error('Error al guardar registro:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Registrar Glucosa</Text>
      <TextInput
        label="Nivel de glucosa (mg/dL)"
        value={value}
        onChangeText={setValue}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        label="Notas (opcional)"
        value={notes}
        onChangeText={setNotes}
        multiline
        style={styles.input}
      />
      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        Guardar Registro
      </Button>
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
    marginBottom: 30,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
}); 