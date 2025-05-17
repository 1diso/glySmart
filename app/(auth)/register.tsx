import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [diabetesType, setDiabetesType] = useState<'1' | '2' | undefined>();
  const router = useRouter();
  const { saveUserProfile } = useLocalStorage();

  const handleRegister = async () => {
    if (!name.trim()) {
      alert('Por favor ingresa tu nombre');
      return;
    }

    const ageNumber = parseInt(age);
    if (isNaN(ageNumber) || ageNumber <= 0) {
      alert('Por favor ingresa una edad válida');
      return;
    }

    try {
      await saveUserProfile({
        name,
        age: ageNumber,
        diabetesType
      });
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error al guardar perfil:', error);
      alert('Error al guardar el perfil');
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>GlySmart</Text>
      
      <TextInput
        label="Nombre"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        label="Edad"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text variant="bodyMedium" style={styles.label}>
        Tipo de Diabetes (Opcional)
      </Text>
      
      <SegmentedButtons
        value={diabetesType || ''}
        onValueChange={value => setDiabetesType(value as '1' | '2' | undefined)}
        buttons={[
          { value: '1', label: 'Tipo 1' },
          { value: '2', label: 'Tipo 2' },
        ]}
        style={styles.segmentedButtons}
      />

      <Button 
        mode="contained" 
        onPress={handleRegister}
        style={styles.button}
      >
        Continuar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 10,
  },
  segmentedButtons: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
}); 