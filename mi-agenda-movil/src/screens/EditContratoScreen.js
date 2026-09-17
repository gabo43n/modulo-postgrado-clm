import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { clmService } from '../api/clmService';

export default function EditContratoScreen({ route, navigation }) {
  const { contrato } = route.params;
  const [form, setForm] = useState({
    id_empresa: contrato.id_empresa,
    titulo: contrato.titulo,
    contraparte_nombre: contrato.contraparte_nombre,
    estado: contrato.estado || 'Borrador',
    fecha_inicio_vigencia: contrato.fecha_inicio_vigencia || '',
    fecha_fin_vigencia: contrato.fecha_fin_vigencia || '',
    valor_contrato: contrato.valor_contrato?.toString() || '',
    moneda: contrato.moneda || 'BOB'
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!form.titulo || !form.contraparte_nombre) {
      Alert.alert('Error', 'Por favor completa el título y la contraparte');
      return;
    }

    setLoading(true);
    try {
      const data = { ...form, valor_contrato: form.valor_contrato ? parseFloat(form.valor_contrato) : null };
      await clmService.updateContrato(contrato.id_contrato, data);
      Alert.alert('Éxito', 'Contrato actualizado correctamente');
      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo actualizar el contrato. Verifica que las fechas sean correctas (AAAA-MM-DD).');
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
          <Text style={styles.title}>Editar Contrato</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Asociado a: {contrato.id_empresa}</Text>
          </View>

          <Text style={styles.label}>Título del Contrato *</Text>
          <TextInput
            style={styles.input}
            value={form.titulo}
            onChangeText={(t) => setForm({...form, titulo: t})}
          />

          <Text style={styles.label}>Nombre de Contraparte *</Text>
          <TextInput
            style={styles.input}
            value={form.contraparte_nombre}
            onChangeText={(t) => setForm({...form, contraparte_nombre: t})}
          />

          <View style={styles.row}>
            <View style={{flex: 1, marginRight: 10}}>
              <Text style={styles.label}>Fecha Inicio</Text>
              <TextInput
                style={styles.input}
                value={form.fecha_inicio_vigencia}
                onChangeText={(t) => setForm({...form, fecha_inicio_vigencia: t})}
                placeholder="AAAA-MM-DD"
              />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.label}>Fecha Fin</Text>
              <TextInput
                style={styles.input}
                value={form.fecha_fin_vigencia}
                onChangeText={(t) => setForm({...form, fecha_fin_vigencia: t})}
                placeholder="AAAA-MM-DD"
              />
            </View>
          </View>

          <Text style={styles.label}>Estado</Text>
          <TextInput
            style={styles.input}
            value={form.estado}
            onChangeText={(t) => setForm({...form, estado: t})}
          />

          <View style={styles.row}>
            <View style={{flex: 2, marginRight: 10}}>
              <Text style={styles.label}>Valor</Text>
              <TextInput
                style={styles.input}
                value={form.valor_contrato}
                onChangeText={(t) => setForm({...form, valor_contrato: t})}
                keyboardType="numeric"
              />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.label}>Moneda</Text>
              <TextInput
                style={styles.input}
                value={form.moneda}
                onChangeText={(t) => setForm({...form, moneda: t})}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Actualizar Contrato</Text>}
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
  row: { flexDirection: 'row', justifyContent: 'space-between' },
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
