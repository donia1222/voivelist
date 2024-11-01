import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../ThemeContext'; // Importa el hook useTheme

const RateAppModal = ({ visible, onAccept, onDecline }) => {
  const { theme } = useTheme();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onDecline}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: theme.background }]}>
          <Text style={[styles.modalText, { color: theme.text }]}>¿Te gusta nuestra app?</Text>
          <Text style={[styles.modalSubText, { color: theme.textdos }]}>Por favor, considera valorarnos en la tienda de aplicaciones.</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonRate]}
              onPress={onAccept}
            >
              <Text style={styles.textStyle}>Valóranos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonLater]}
              onPress={onDecline}
            >
              <Text style={styles.textStyle}>Ahora no</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
  modalSubText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonRate: {
    backgroundColor: '#2196F3',
  },
  buttonLater: {
    backgroundColor: '#f0f0f0',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});

export default RateAppModal;
