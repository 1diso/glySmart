import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, TextInput as RNTextInput, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Divider, Modal, Portal, Snackbar } from 'react-native-paper';
import { LogoHeader } from '../../components/LogoHeader';
import { useGlucoseLocal } from '../../hooks/useGlucoseLocal';

// Tipos para el formulario
type MeasurementType = 'fasting' | 'postprandial' | 'random' | 'bedtime';
type MealSize = 'small' | 'medium' | 'large';
type MedicationType = 'rapidInsulin' | 'basalInsulin' | 'oral' | 'none';

export default function GlucoseScreen() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { saveRecord } = useGlucoseLocal();
  
  // Estados para el formulario
  const [glucoseValue, setGlucoseValue] = useState('');
  const [notes, setNotes] = useState('');

  // 1. Tipo de medición
  const [measurementType, setMeasurementType] = useState<MeasurementType>('fasting');
  
  // 2. Hora de la toma
  const [timestamp, setTimestamp] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // 3. Estado alimenticio
  const [hasEaten, setHasEaten] = useState(false);
  const [firstMealOfDay, setFirstMealOfDay] = useState(false);
  const [timeSinceLastMeal, setTimeSinceLastMeal] = useState('0');
  const [mealTypes, setMealTypes] = useState<string[]>([]);
  const [mealSize, setMealSize] = useState<MealSize>('medium');
  
  // 4. Síntomas
  const [symptoms, setSymptoms] = useState<string[]>([]);
  
  // 5. Medicación
  const [medicationTaken, setMedicationTaken] = useState(false);
  const [medicationType, setMedicationType] = useState<MedicationType>('none');
  const [medicationDose, setMedicationDose] = useState('');
  const [lastDoseTime, setLastDoseTime] = useState(new Date());
  const [showDoseTimePicker, setShowDoseTimePicker] = useState(false);

  // Opciones para seleccionar
  const mealTypeOptions = [
    { label: 'Rico en carbohidratos', value: 'highCarb' },
    { label: 'Rico en grasas', value: 'highFat' },
    { label: 'Rico en fibra', value: 'highFiber' },
    { label: 'Comida procesada', value: 'processed' }
  ];
  
  const symptomOptions = [
    { label: 'Hormigueo en manos o pies', value: 'tingling' },
    { label: 'Entumecimiento', value: 'numbness' },
    { label: 'Ardor en pies o manos', value: 'burning' },
    { label: 'Picazón en la piel', value: 'itching' },
    { label: 'Sangrado de encías', value: 'gumBleeding' },
    { label: 'Calambres', value: 'cramps' },
    { label: 'Mente nublada', value: 'foggyMind' },
    { label: 'Dolor de cabeza', value: 'headache' },
    { label: 'Fatiga', value: 'fatigue' },
    { label: 'Mareo', value: 'dizziness' }
  ];

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

  const toggleMealType = (value: string) => {
    if (mealTypes.includes(value)) {
      setMealTypes(mealTypes.filter(t => t !== value));
    } else {
      setMealTypes([...mealTypes, value]);
    }
  };

  const toggleSymptom = (value: string) => {
    if (symptoms.includes(value)) {
      setSymptoms(symptoms.filter(s => s !== value));
    } else {
      setSymptoms([...symptoms, value]);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setTimestamp(selectedDate);
    }
  };

  const handleDoseTimeChange = (event: any, selectedDate?: Date) => {
    setShowDoseTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setLastDoseTime(selectedDate);
    }
  };

  const handleSubmit = async () => {
    setError('');
    if (!glucoseValue) {
      setError('Por favor ingrese un valor de glucosa');
      return;
    }
    
    if (!validateGlucose(glucoseValue)) {
      return;
    }
    
    try {
      // Guardar registro
      await saveRecord({
        value: Number(glucoseValue),
        timestamp: timestamp.getTime(),
        notes: notes.trim()
      });
      
      // Limpiar formulario
      setGlucoseValue('');
      setNotes('');
      setSuccess(true);
      
      // Después de 2 segundos, redirigir al inicio para ver el nuevo registro
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error('Error al guardar registro:', error);
      setError('Error al guardar el registro. Por favor intente nuevamente.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LogoHeader />

      <Text style={styles.title}>Registrar Glucosa</Text>
      
      {/* 1. Valor de glucosa */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nivel de glucosa</Text>
        <View style={styles.inputWrapper}>
          <RNTextInput
            value={glucoseValue}
            onChangeText={(text) => {
              setGlucoseValue(text);
              setError('');
            }}
            keyboardType="numeric"
            style={styles.input}
            placeholder="Ingrese el valor"
          />
          <Text style={styles.unitText}>mg/dL</Text>
        </View>
      </View>
      
      <View style={styles.dividerContainer}>
        <Divider />
      </View>
      
      {/* Botón de guardar más grande y destacado */}
      <View style={styles.saveButtonContainer}>
        <Button 
          mode="contained" 
          onPress={handleSubmit} 
          style={styles.saveButton}
          disabled={!glucoseValue}
          buttonColor="#4CAF50"
          textColor="#fff"
          icon="content-save"
          labelStyle={styles.saveButtonLabel}
        >
          GUARDAR REGISTRO
        </Button>
      </View>

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
      >
        Registro guardado exitosamente
      </Snackbar>
      
      {/* Espacio al final del ScrollView */}
      <View style={{ height: 40 }} />
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
    fontWeight: 'bold',
    fontSize: 28,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#1565C0',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  dividerContainer: {
    width: '100%',
    paddingVertical: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    fontSize: 16,
    padding: 12,
  },
  unitText: {
    color: '#1565C0',
    fontSize: 16,
    fontWeight: '500',
    paddingRight: 16,
    paddingLeft: 8,
  },
  inputLabel: {
    color: '#1565C0',
    fontSize: 16,
    marginBottom: 6,
    marginTop: 6,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
  switchOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  saveButtonContainer: {
    marginVertical: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  saveButton: {
    width: '100%',
    height: 60,
    borderRadius: 10,
    elevation: 5,
  },
  saveButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
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