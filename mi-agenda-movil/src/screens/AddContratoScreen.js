import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { clmService } from '../api/clmService';

export default function AddContratoScreen({ route, navigation }) {
  const { empresa } = route.params;
  const [form, setForm] = useState({
    id_empresa: empresa.id_empresa,
    titulo: '',
    contraparte_nombre: '',
    estado: 'Borrador',
    fecha_inicio_vigencia: '',
    fecha_fin_vigencia: '',
    valor_contrato: '',
    moneda: 'BOB'
  });
  const [loading, setLoading] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const formatDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formatted = `${year}-${month}-${day}`;
    console.log('Fecha formateada:', formatted);
    return formatted;
  };

  const onStartDateChange = (event, selectedDate) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      setForm({ ...form, fecha_inicio_vigencia: formatDate(selectedDate) });
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
      setForm({ ...form, fecha_fin_vigencia: formatDate(selectedDate) });
    }
  };

  const handleSave = async () => {
    if (!form.titulo || !form.contraparte_nombre) {
      Alert.alert('Error', 'Por favor completa el título y la contraparte');
      return;
    }

    setLoading(true);
    try {
      const data = {
        ...form,
        valor_contrato: form.valor_contrato ? parseFloat(form.valor_contrato) : null
      };
      const newContrato = await clmService.createContrato(data);
      Alert.alert('Éxito', 'Contrato creado correctamente');
      navigation.navigate('Clausulas', { contrato: newContrato });
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo crear el contrato. Verifica que las fechas sean correctas (AAAA-MM-DD).');
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
          <Text style={styles.title}>Nuevo Contrato</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Asociado a: {empresa.razon_social}</Text>
          </View>

          <Text style={styles.label}>Título del Contrato *</Text>
          <TextInput
            style={styles.input}
            value={form.titulo}
            onChangeText={(t) => setForm({...form, titulo: t})}
            placeholder="Ej. Contrato de Suministros 2026"
          />

          <Text style={styles.label}>Nombre de Contraparte *</Text>
          <TextInput
            style={styles.input}
            value={form.contraparte_nombre}
            onChangeText={(t) => setForm({...form, contraparte_nombre: t})}
            placeholder="Ej. Proveedor Global S.A."
          />

          <View style={styles.row}>
            <View style={{flex: 1, marginRight: 10}}>
              <Text style={styles.label}>Fecha Inicio</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowStartPicker(true)}
              >
                <Text style={{color: form.fecha_inicio_vigencia ? '#333' : '#aaa'}}>
                  {form.fecha_inicio_vigencia || 'Seleccionar fecha'}
                </Text>
              </TouchableOpacity>
              {showStartPicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={onStartDateChange}
                />
              )}
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.label}>Fecha Fin</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowEndPicker(true)}
              >
                <Text style={{color: form.fecha_fin_vigencia ? '#333' : '#aaa'}}>
                  {form.fecha_fin_vigencia || 'Seleccionar fecha'}
                </Text>
              </TouchableOpacity>
              {showEndPicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  onChange={onEndDateChange}
                />
              )}
            </View>
          </View>

          <Text style={styles.label}>Estado</Text>
          <TextInput
            style={styles.input}
            value={form.estado}
            onChangeText={(t) => setForm({...form, estado: t})}
            placeholder="Borrador, Negociacion, etc."
          />

          <View style={styles.row}>
            <View style={{flex: 2, marginRight: 10}}>
              <Text style={styles.label}>Valor</Text>
              <TextInput
                style={styles.input}
                value={form.valor_contrato}
                onChangeText={(t) => setForm({...form, valor_contrato: t})}
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.label}>Moneda</Text>
              <TextInput
                style={styles.input}
                value={form.moneda}
                onChangeText={(t) => setForm({...form, moneda: t})}
                placeholder="BOB"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Guardar Contrato</Text>}
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
