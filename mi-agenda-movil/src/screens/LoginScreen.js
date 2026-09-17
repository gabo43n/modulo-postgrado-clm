import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { clmService } from '../api/clmService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = async () => {
    if (!user || !pass) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      console.log('Intentando login con:', user, pass);
      const data = await clmService.login(user, pass);
      console.log('Respuesta del servidor:', data);

      if (data.ok || data.token) {
        if (data.token) {
          await AsyncStorage.setItem('clmToken', data.token);
        }
        navigation.replace('Home');
      } else {
        Alert.alert('Error', 'El servidor aceptó el login pero no envió un token');
      }
    } catch (error) {
      console.log('Error detallado:', error);
      if (error.response) {
        Alert.alert('Error del Servidor', error.response.data.message || 'Credenciales incorrectas');
      } else {
        Alert.alert('Error de Conexión', 'No se pudo conectar con el servidor. Verifica la IP.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acceso CLM</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={user}
        onChangeText={setUser}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={pass}
        onChangeText={setPass}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar al Sistema</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f2f5'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#1a2a6c'
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  button: {
    backgroundColor: '#1a2a6c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
});
