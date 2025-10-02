import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import mealPlannerTranslations from '../translations/mealPlannerTranslations';

const ListSelectionModal = ({ visible, onClose, onCreateNew, onSelectExisting }) => {
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
  const t = mealPlannerTranslations[deviceLanguage] || mealPlannerTranslations['en'];
  const [historyLists, setHistoryLists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadHistoryLists();
    }
  }, [visible]);

  const loadHistoryLists = async () => {
    try {
      setLoading(true);
      const savedHistoryJson = await AsyncStorage.getItem('@shopping_history');
      const lists = savedHistoryJson ? JSON.parse(savedHistoryJson) : [];
      setHistoryLists(lists);
    } catch (error) {
      console.error('Error al cargar listas:', error);
      setHistoryLists([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectList = (list, index) => {
    onSelectExisting(list, index);
    onClose();
  };

  const handleCreateNew = () => {
    onCreateNew();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{t.shoppingListTitle || 'Lista de la Compra'}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Botón Crear Nueva Lista */}
          <TouchableOpacity
            style={styles.createNewButton}
            onPress={handleCreateNew}
          >
            <View style={styles.createNewIcon}>
              <Ionicons name="add-circle" size={28} color="#10B981" />
            </View>
            <View style={styles.createNewText}>
              <Text style={styles.createNewTitle}>{t.createNewList || 'Crear nueva lista'}</Text>
              <Text style={styles.createNewSubtitle}>{t.saveAsNewList || 'Guardar como una lista nueva'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {/* Separador */}
          {historyLists.length > 0 && (
            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>{t.addToExistingList || 'O añadir a lista existente'}</Text>
              <View style={styles.separatorLine} />
            </View>
          )}

          {/* Lista de listas guardadas */}
          <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
            {loading ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>{t.loading || 'Cargando...'}</Text>
              </View>
            ) : historyLists.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="list-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>{t.noSavedLists || 'No hay listas guardadas'}</Text>
                <Text style={styles.emptySubtext}>{t.createFirstList || 'Crea tu primera lista arriba'}</Text>
              </View>
            ) : (
              historyLists.map((list, index) => (
                <TouchableOpacity
                  key={list.id || index}
                  style={styles.listItem}
                  onPress={() => handleSelectList(list, index)}
                >
                  <Ionicons
                    name="list"
                    size={22}
                    color="#8B5CF6"
                    style={styles.listIcon}
                  />
                  <View style={styles.listInfo}>
                    <Text style={styles.listName}>{list.name}</Text>
                    <Text style={styles.listItemCount}>
                      {Array.isArray(list.list) ? list.list.length : 0} {
                        Array.isArray(list.list) && list.list.length === 1
                          ? (t.product || 'producto')
                          : (t.products || 'productos')
                      }
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          {/* Botón Cancelar */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>{t.cancel || 'Cancelar'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 34,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  createNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: 16,
  },
  createNewIcon: {
    marginRight: 12,
  },
  createNewText: {
    flex: 1,
  },
  createNewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
  },
  createNewSubtitle: {
    fontSize: 13,
    color: '#059669',
    marginTop: 2,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 16,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  separatorText: {
    fontSize: 12,
    color: '#999',
    marginHorizontal: 12,
    fontWeight: '500',
  },
  listContainer: {
    maxHeight: 300,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#bbb',
    marginTop: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  listIcon: {
    marginRight: 12,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  listItemCount: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  cancelButton: {
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});

export default ListSelectionModal;
