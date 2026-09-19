import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { clmService } from '../api/clmService';

export default function CLMHomeScreen({ navigation }) {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await clmService.getEmpresas();
      setEmpresas(data);
    } catch (e) { console.log(e); }
    setLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert(
      'Eliminar Empresa',
      '¿Estás seguro de que deseas eliminar esta empresa? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await clmService.deleteEmpresa(id);
              Alert.alert('Éxito', 'Empresa eliminada correctamente');
              load();
            } catch (e) {
              Alert.alert('Error', 'No se pudo eliminar la empresa');
            }
          }
        },
      ]
    );
  };

  if (loading) return <ActivityIndicator style={{flex: 1}} size="large" color="#1a2a6c" />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Gestión CLM</Text>
            <Text style={styles.subtitle}>Empresas Cliente</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddEmpresa')}
          >
            <Text style={styles.addButtonText}>+ Nueva</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={empresas}
          keyExtractor={(item) => item.id_empresa}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.cardBody}
                onPress={() => navigation.navigate('Contratos', { empresa: item })}
              >
                <Text style={styles.name}>{item.razon_social}</Text>
                <Text style={styles.info}>{item.pais} • {item.nit}</Text>
              </TouchableOpacity>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => navigation.navigate('EditEmpresa', { empresa: item })}
                >
                  <Text style={styles.actionText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id_empresa)}
                >
                  <Text style={styles.actionText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f0f2f5' },
  container: { flex: 1, paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 25
  },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1a2a6c' },
  subtitle: { fontSize: 16, color: '#666', fontWeight: '500' },
  addButton: {
    backgroundColor: '#1a2a6c',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    elevation: 3,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  listContent: { paddingBottom: 20 },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  cardBody: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  info: { fontSize: 14, color: '#666' },
  actions: { flexDirection: 'row', alignItems: 'center' },
  editButton: { padding: 10, marginRight: 5 },
  deleteButton: { padding: 10 },
  actionText: { fontSize: 18 },
});
