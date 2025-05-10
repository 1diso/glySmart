import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useAuth } from '../../hooks/useAuth';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();
  const { register } = useAuth();

  const handleRegister = async () => {
    try {
      await register(email, password, name);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error al registrarse:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Crear Cuenta</Text>
      <TextInput
        label="Nombre"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Registrarse
      </Button>
      <Button 
        mode="text" 
        onPress={() => router.push('/login')}
        style={styles.button}
      >
        ¿Ya tienes cuenta? Inicia sesión
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
  button: {
    marginTop: 10,
  },
}); 