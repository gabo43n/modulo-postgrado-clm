import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { clmService } from '../api/clmService';

export default function ClausulasScreen({ route, navigation }) {
  const { contrato } = route.params;
  const [clausulas, setClausulas] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await clmService.getClausulas(contrato.id_contrato);
      setClausulas(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      load();
    }, [contrato.id_contrato])
  );

  const handleDelete = (id) => {
    Alert.alert(
      'Eliminar Cláusula',
      '¿Estás seguro de que deseas eliminar esta cláusula? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await clmService.deleteClausula(id);
              Alert.alert('Éxito', 'Cláusula eliminada correctamente');
              load();
            } catch (e) {
              Alert.alert('Error', 'No se pudo eliminar la cláusula');
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
            <Text style={styles.title}>Cláusulas</Text>
            <Text style={styles.subtitle}>{contrato.titulo}</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddClausula', { contrato })}
          >
            <Text style={styles.addButtonText}>+ Nueva</Text>
          </TouchableOpacity>
        </View>

        {clausulas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay cláusulas registradas para este contrato.</Text>
          </View>
        ) : (
          <FlatList
            data={clausulas}
            keyExtractor={(item) => item.id_clausula}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardMain}>
                  <View style={styles.cardHeader}>
                    <View style={styles.orderBadge}>
                      <Text style={styles.orderText}>{item.orden}</Text>
                    </View>
                    <Text style={styles.typeText}>{item.tipo_clausula}</Text>
                  </View>
                  <Text style={styles.name}>{item.titulo}</Text>
                  <Text style={styles.content}>Contenido de la cláusula legal detallada...</Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.versionText}>Versión {item.version}</Text>
                  </View>
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('EditClausula', { clausula: item })}
                  >
                    <Text style={styles.actionText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.id_clausula)}
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
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#1a2a6c',
  },
  cardMain: { flex: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  orderBadge: { backgroundColor: '#e0e4e8', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  orderText: { fontSize: 12, fontWeight: 'bold', color: '#555' },
  typeText: { fontSize: 12, color: '#aaa', textTransform: 'uppercase', fontWeight: '600' },
  name: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  content: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 10 },
  cardFooter: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 8, alignItems: 'flex-end' },
  versionText: { fontSize: 12, color: '#999', fontStyle: 'italic' },
  actions: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
  editButton: { padding: 10, marginRight: 5 },
  deleteButton: { padding: 10 },
  actionText: { fontSize: 18 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  emptyText: { textAlign: 'center', color: '#888', fontSize: 16 },
});
