import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Modal, Portal, Snackbar, Text, TextInput } from 'react-native-paper';
import { LogoHeader } from '../../components/LogoHeader';
import { useGlucoseLocal } from '../../hooks/useGlucoseLocal';

export default function GlucoseScreen() {
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { saveRecord } = useGlucoseLocal();

  const validateGlucose = (value: string): boolean => {
    const num = Number(value);
    if (isNaN(num)) {
      setError('Por favor ingrese un número válido');
      return false;
    }
    if (num < 20 || num > 600) {
      setError('El valor debe estar entre 20 y 600 mg/dL');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError('');
    if (!value) {
      setError('Por favor ingrese un valor de glucosa');
      return;
    }
    
    if (!validateGlucose(value)) {
      return;
    }
    
    try {
      await saveRecord({
        value: Number(value),
        notes: notes.trim(),
        timestamp: Date.now()
      });
      setValue('');
      setNotes('');
      setSuccess(true);
    } catch (error) {
      console.error('Error al guardar registro:', error);
      setError('Error al guardar el registro. Por favor intente nuevamente.');
    }
  };

  return (
    <View style={styles.container}>
      <LogoHeader />

      <Text variant="headlineMedium" style={styles.title}>Registrar Glucosa</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Nivel de glucosa</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            value={value}
            onChangeText={(text) => {
              setValue(text);
              setError('');
            }}
            keyboardType="numeric"
            style={styles.input}
            error={!!error}
            mode="outlined"
            activeOutlineColor="#1565C0"
            outlineColor="#2196F3"
            textColor="#000"
            placeholder="Ingrese el valor"
            placeholderTextColor="#90CAF9"
            contentStyle={styles.inputContent}
          />
          <Text style={styles.unitText}>mg/dL</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Notas</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          style={styles.input}
          mode="outlined"
          activeOutlineColor="#1565C0"
          outlineColor="#2196F3"
          textColor="#000"
          placeholder="Agregue notas adicionales (opcional)"
          placeholderTextColor="#90CAF9"
          contentStyle={styles.inputContent}
          textAlignVertical="center"
        />
      </View>

      <Button 
        mode="contained" 
        onPress={handleSubmit} 
        style={styles.button}
        disabled={!value}
        buttonColor="#1565C0"
        textColor="#fff"
        contentStyle={styles.buttonContent}
      >
        Guardar Registro
      </Button>

      <Portal>
        <Modal
          visible={!!error}
          onDismiss={() => setError('')}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.errorText}>{error}</Text>
            <Button 
              mode="contained" 
              onPress={() => setError('')}
              style={styles.modalButton}
              buttonColor="#1565C0"
            >
              OK
            </Button>
          </View>
        </Modal>
      </Portal>

      <Snackbar
        visible={success}
        onDismiss={() => setSuccess(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSuccess(false),
        }}
        style={styles.successSnackbar}
        textColor="#fff"
      >
        Registro guardado exitosamente
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#1565C0',
    fontWeight: 'bold',
    fontSize: 28,
  },
  inputContainer: {
    marginBottom: 25,
  },
  inputTitle: {
    color: '#1565C0',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    fontSize: 18,
  },
  inputContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    textAlignVertical: 'center',
  },
  unitText: {
    color: '#1565C0',
    fontSize: 18,
    fontWeight: '500',
    paddingRight: 16,
    paddingLeft: 8,
  },
  button: {
    marginTop: 20,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  errorSnackbar: {
    backgroundColor: 'rgba(211, 47, 47, 0.9)',
    borderRadius: 8,
    marginHorizontal: 20,
  },
  snackbarWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  successSnackbar: {
    backgroundColor: '#1565C0',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    elevation: 5,
  },
  modalContent: {
    alignItems: 'center',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    width: 100,
  },
}); 