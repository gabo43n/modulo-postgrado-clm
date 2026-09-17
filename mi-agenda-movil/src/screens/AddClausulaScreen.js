import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { clmService } from '../api/clmService';

export default function AddClausulaScreen({ route, navigation }) {
  const { contrato } = route.params;
  const [form, setForm] = useState({
    id_contrato: contrato.id_contrato,
    orden: '1',
    titulo: '',
    contenido: '',
    tipo_clausula: 'estandar',
    es_modificable: true
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!form.titulo || !form.contenido) {
      Alert.alert('Error', 'Por favor completa el título y el contenido de la cláusula');
      return;
    }

    setLoading(true);
    try {
      const data = { ...form, orden: parseInt(form.orden) };
      await clmService.createClausula(data);
      Alert.alert('Éxito', 'Cláusula creada correctamente');
      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo crear la cláusula.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container}>
          <Text style={styles.title}>Nueva Cláusula</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Contrato: {contrato.titulo}</Text>
          </View>

          <Text style={styles.label}>Orden (Número) *</Text>
          <TextInput
            style={styles.input}
            value={form.orden}
            onChangeText={(t) => setForm({...form, orden: t})}
            placeholder="1"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Título de la Cláusula *</Text>
          <TextInput
            style={styles.input}
            value={form.titulo}
            onChangeText={(t) => setForm({...form, titulo: t})}
            placeholder="Ej. Cláusula de Confidencialidad"
          />

          <Text style={styles.label}>Contenido de la Cláusula *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.contenido}
            onChangeText={(t) => setForm({...form, contenido: t})}
            placeholder="Escriba el texto legal aquí..."
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />

          <Text style={styles.label}>Tipo de Cláusula</Text>
          <TextInput
            style={styles.input}
            value={form.tipo_clausula}
            onChangeText={(t) => setForm({...form, tipo_clausula: t})}
            placeholder="estandar"
          />

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Permitir Modificaciones</Text>
            <Switch
              value={form.es_modificable}
              onValueChange={(v) => setForm({...form, es_modificable: v})}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Guardar Cláusula</Text>}
          </TouchableOpacity>
          <View style={{height: 40}} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f0f2f5' },
  container: { flex: 1, padding: 25 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#1a2a6c', textAlign: 'center' },
  infoBox: { backgroundColor: '#eef2f7', padding: 12, borderRadius: 10, marginBottom: 25, borderWidth: 1, borderColor: '#d1d9e6' },
  infoText: { fontSize: 14, color: '#555', textAlign: 'center', fontWeight: '500' },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 8, color: '#444' },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 1,
  },
  textArea: { height: 120 },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  switchLabel: { fontSize: 16, color: '#333', fontWeight: '500' },
  button: {
    backgroundColor: '#1a2a6c',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
