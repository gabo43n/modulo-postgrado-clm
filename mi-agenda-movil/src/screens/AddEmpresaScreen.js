import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { clmService } from '../api/clmService';

export default function AddEmpresaScreen({ navigation }) {
  const [form, setForm] = useState({ razon_social: '', nit: '', pais: '', direccion_fiscal: '', activo: true });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!form.razon_social || !form.nit || !form.pais) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      await clmService.createEmpresa(form);
      Alert.alert('Éxito', 'Empresa creada correctamente');
      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo crear la empresa. Verifica los datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Text style={styles.title}>Nueva Empresa Cliente</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Razón Social *</Text>
          <TextInput
            style={styles.input}
            value={form.razon_social}
            onChangeText={(t) => setForm({...form, razon_social: t})}
            placeholder="Ej. Constructora Andina S.A."
          />

          <Text style={styles.label}>NIT *</Text>
          <TextInput
            style={styles.input}
            value={form.nit}
            onChangeText={(t) => setForm({...form, nit: t})}
            placeholder="Ej. 123456789"
            keyboardType="numeric"
          />

          <Text style={styles.label}>País *</Text>
          <TextInput
            style={styles.input}
            value={form.pais}
            onChangeText={(t) => setForm({...form, pais: t})}
            placeholder="Ej. Bolivia"
          />

          <Text style={styles.label}>Dirección Fiscal</Text>
          <TextInput
            style={styles.input}
            value={form.direccion_fiscal}
            onChangeText={(t) => setForm({...form, direccion_fiscal: t})}
            placeholder="Opcional"
          />

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Empresa Activa</Text>
            <Switch
              value={form.activo}
              onValueChange={(v) => setForm({...form, activo: v})}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Guardar Empresa</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f0f2f5' },
  container: { flex: 1, padding: 25 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, color: '#1a2a6c', textAlign: 'center' },
  form: { flex: 1 },
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
