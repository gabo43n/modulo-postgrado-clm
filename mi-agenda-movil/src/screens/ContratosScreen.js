import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { clmService } from '../api/clmService';

export default function ContratosScreen({ route, navigation }) {
  const { empresa } = route.params;
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await clmService.getContratos(empresa.id_empresa);
      setContratos(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      load();
    }, [empresa.id_empresa])
  );

  const handleDelete = (id) => {
    Alert.alert(
      'Eliminar Contrato',
      '¿Estás seguro de que deseas eliminar este contrato? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await clmService.deleteContrato(id);
              Alert.alert('Éxito', 'Contrato eliminado correctamente');
              load();
            } catch (e) {
              Alert.alert('Error', 'No se pudo eliminar el contrato');
            }
          }
        },
      ]
    );
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#1a2a6c" />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Contratos</Text>
            <Text style={styles.subtitle}>{empresa.razon_social}</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddContrato', { empresa })}
          >
            <Text style={styles.addButtonText}>+ Nuevo</Text>
          </TouchableOpacity>
        </View>

        {contratos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay contratos registrados para esta empresa.</Text>
          </View>
        ) : (
          <FlatList
            data={contratos}
            keyExtractor={(item) => item.id_contrato}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <TouchableOpacity
                  style={styles.cardBody}
                  onPress={() => navigation.navigate('Clausulas', { contrato: item })}
                >
                  <Text style={styles.name}>{item.titulo}</Text>
                  <View style={styles.badgeContainer}>
                    <View style={[styles.badge, { backgroundColor: item.estado === 'Borrador' ? '#eee' : '#d1e7dd' }]}>
                      <Text style={styles.badgeText}>{item.estado}</Text>
                    </View>
                  </View>
                  <Text style={styles.details}>📅 {item.fecha_inicio_vigencia || 'No def.'} - {item.fecha_fin_vigencia || 'No def.'}</Text>
                </TouchableOpacity>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('EditContrato', { contrato: item })}
                  >
                    <Text style={styles.actionText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.id_contrato)}
                  >
                    <Text style={styles.actionText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
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
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  cardBody: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  badgeContainer: { flexDirection: 'row', marginBottom: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5 },
  badgeText: { fontSize: 12, color: '#555', fontWeight: '600' },
  details: { fontSize: 14, color: '#666' },
  actions: { flexDirection: 'row', alignItems: 'center' },
  editButton: { padding: 10, marginRight: 5 },
  deleteButton: { padding: 10 },
  actionText: { fontSize: 18 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  emptyText: { textAlign: 'center', color: '#888', fontSize: 16 },
});
