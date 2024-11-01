import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, Dimensions, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';
import * as RNLocalize from 'react-native-localize';
import LinearGradient from 'react-native-linear-gradient';
const { width } = Dimensions.get('window');

const primerModal = {
    en: {
      title: "Delete List",
      step1: "Share List",
      step2: "Print List",
      step2Example: "Edit List",
      step3: "Notify List",
      createList: "Expand List",
    },
    es: {
      title: "Eliminar Lista",
      step1: "Compartir Lista",
      step2: "Imprimir Lista",
      step2Example: "Editar Lista",
      step3: "Notificar Lista",
      createList: "Expandir Lista",
    },
    de: {
      title: "Liste löschen",
      step1: "Liste teilen",
      step2: "Liste drucken",
      step2Example: "Liste bearbeiten",
      step3: "Liste benachrichtigen",
      createList: "Liste erweitern",
    },
    it: {
      title: "Elimina Lista",
      step1: "Condividi Lista",
      step2: "Stampa Lista",
      step2Example: "Modifica Lista",
      step3: "Notifica Lista",
      createList: "Espandi Lista",
    },
    fr: {
      title: "Supprimer Liste",
      step1: "Partager Liste",
      step2: "Imprimer Liste",
      step2Example: "Modifier Liste",
      step3: "Notifier Liste",
      createList: "Étendre Liste",
    },
    tr: {
      title: "Listeyi Sil",
      step1: "Listeyi Paylaş",
      step2: "Listeyi Yazdır",
      step2Example: "Listeyi Düzenle",
      step3: "Listeyi Bildir",
      createList: "Listeyi Genişlet",
    },
    pt: {
      title: "Eliminar Lista",
      step1: "Compartilhar Lista",
      step2: "Imprimir Lista",
      step2Example: "Editar Lista",
      step3: "Notificar Lista",
      createList: "Expandir Lista",
    },
    ru: {
      title: "Удалить Список",
      step1: "Поделиться Списком",
      step2: "Напечатать Список",
      step2Example: "Редактировать Список",
      step3: "Уведомить о Списке",
      createList: "Расширить Список",
    },
    ar: {
      title: "حذف القائمة",
      step1: "مشاركة القائمة",
      step2: "طباعة القائمة",
      step2Example: "تحرير القائمة",
      step3: "إخطار القائمة",
      createList: "توسيع القائمة",
    },
    hu: {
      title: "Lista Törlése",
      step1: "Lista Megosztása",
      step2: "Lista Nyomtatása",
      step2Example: "Lista Szerkesztése",
      step3: "Lista Értesítése",
      createList: "Lista Kibővítése",
    },
    ja: {
      title: "リストを削除する",
      step1: "リストを共有する",
      step2: "リストを印刷する",
      step2Example: "リストを編集する",
      step3: "リストを通知する",
      createList: "リストを拡張する",
    },
    hi: {
      title: "सूची हटाएं",
      step1: "सूची साझा करें",
      step2: "सूची प्रिंट करें",
      step2Example: "सूची संपादित करें",
      step3: "सूची सूचित करें",
      createList: "सूची विस्तारित करें",
    },
    nl: {
      title: "Lijst Verwijderen",
      step1: "Lijst Delen",
      step2: "Lijst Afdrukken",
      step2Example: "Lijst Bewerken",
      step3: "Lijst Melden",
      createList: "Lijst Uitbreiden",
    }
  };
  const HistoryModal = ({ visible, onClose }) => {
    const { theme } = useTheme();
    const styles = getStyles(theme); // Obtain styles based on the theme
    const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
    const currentLabels = primerModal[deviceLanguage] || primerModal['en'];
    const [currentPage, setCurrentPage] = useState(0);

    const pages = [
        { id: '1', icon: 'trash-outline', text: currentLabels.title },
        { id: '2', icon: 'share-outline', text: currentLabels.step1 },
        { id: '3', icon: 'print-outline', text: currentLabels.step2 },
        { id: '4', icon: 'add-sharp', text: currentLabels.step2Example },
        { id: '5', icon: 'notifications-outline', text: currentLabels.step3 },
        { id: '6', icon: 'expand', text: currentLabels.createList },
    ];

    useEffect(() => {
        let timer;
        if (currentPage === pages.length - 1) {
            timer = setTimeout(() => {
                onClose();
            }, 2000); // 3 seconds delay
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [currentPage, onClose, pages.length]);

    const handleScroll = (event) => {
        const width = Dimensions.get('window').width * 0.8;
        const pageIndex = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentPage(pageIndex);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <GestureHandlerRootView style={styles.container}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
                        <Ionicons name="close" size={30} color="black" />
                    </TouchableOpacity>
                    <FlatList
                        data={pages}
                        horizontal
                        pagingEnabled
                        renderItem={({ item }) => (
                            <View style={styles.page}>
                                <LinearGradient
                                    colors={['#009688', '#3f51b5']} // Gradient colors
                                    style={styles.iconContainer}
                                >
                                    <Ionicons name={item.icon} size={150} color="white" style={styles.icon} />
                                </LinearGradient>
                                <Text style={styles.text}>{item.text}</Text>
                            </View>
                        )}
                        keyExtractor={(item) => item.id}
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        style={styles.flatList} // Ensure the FlatList takes up full width
                    />
                    <View style={styles.dotContainer}>
                        {pages.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    { backgroundColor: currentPage === index ? 'black' : 'gray' }
                                ]}
                            />
                        ))}
                    </View>
                </View>
            </GestureHandlerRootView>
        </Modal>
    );
};


const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        height: '50%',
        width: '80%',
        backgroundColor: theme.background,
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    page: {
        width: Dimensions.get('window').width * 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20, // Ensure the container is round
        padding:15,
        marginBottom: 20,
    },
  
    text: {
        fontSize: 21,
        textAlign: 'center',
        fontFamily: 'Poppins-Bold',
        color: theme.textdos,
    },
    dotContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 10,
    },
    dot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        margin: 5,
    },
    flatList: {
        flexGrow: 0,
    },
});

export default HistoryModal;