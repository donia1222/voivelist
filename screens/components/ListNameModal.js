import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as RNLocalize from 'react-native-localize';
import mealPlannerTranslations from '../translations/mealPlannerTranslations';

const ListNameModal = ({ visible, onClose, onConfirm, defaultName }) => {
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
  const t = mealPlannerTranslations[deviceLanguage] || mealPlannerTranslations['en'];

  const [listName, setListName] = useState('');

  useEffect(() => {
    if (visible && defaultName) {
      setListName(defaultName);
    }
  }, [visible, defaultName]);

  const handleConfirm = () => {
    if (!listName.trim()) {
      Alert.alert(
        t.error || 'Error',
        t.listNameRequired || 'Debes ingresar un nombre para la lista'
      );
      return;
    }

    onConfirm(listName.trim());
    setListName('');
    onClose();
  };

  const handleClose = () => {
    setListName('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Ionicons name="cart-outline" size={32} color="#10B981" />
            <Text style={styles.title}>{t.listNameTitle || 'Nombre de la Lista'}</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder={t.listNamePlaceholder || 'Ej: Compra semanal'}
            value={listName}
            onChangeText={setListName}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleConfirm}
          />

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>{t.cancel || 'Cancelar'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>{t.generate || 'Generar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 12,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#10B981',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
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
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#10B981',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});

export default ListNameModal;
