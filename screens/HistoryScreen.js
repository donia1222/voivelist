import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, TextInput, ScrollView, Dimensions, Share, Alert, Modal, Button, Platform, Image, ImageBackground, Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import getStyles from './Styles/stylesHistorial';
import translationsHistorial from './translations/translationsHistorial';
import * as RNLocalize from 'react-native-localize';
import DateTimePicker from '@react-native-community/datetimepicker';
import PushNotification from 'react-native-push-notification';
import RNPrint from 'react-native-print'; // Importamos react-native-print
import { Linking } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import Purchases from 'react-native-purchases';
import PagedModal from './HistoryModal';
import { launchImageLibrary } from 'react-native-image-picker';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

const screenWidth = Dimensions.get('window').width;



const { width, height } = Dimensions.get('window');
const HistoryScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [history, setHistory] = useState([]);
  const [completedItems, setCompletedItems] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentList, setCurrentList] = useState([]);
  const [currentListName, setCurrentListName] = useState('');
  const [currentListIndex, setCurrentListIndex] = useState(null);
  const [reminderModalVisible, setReminderModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPicker, setShowPicker] = useState(true);
  const [reminders, setReminders] = useState({});
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);
  const [previousCounts, setPreviousCounts] = useState({ favorites1: 0, favorites2: 0, favorites3: 0, favorites4: 0, favorites5: 0 });
  const isFocused = useIsFocused();
  const flatListRef = useRef(null);
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
  const currentLabels = translationsHistorial[deviceLanguage] || translationsHistorial['en'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedListIndex, setSelectedListIndex] = useState(0);
  const thumbnailListRef = useRef(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [favoritesModalVisible, setFavoritesModalVisible] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current; 
  const slideAnim = useRef(new Animated.Value(0)).current; // Valor inicial fuera de la pantalla
  const [favorites1, setFavorites1] = useState([]);
  const [favorites2, setFavorites2] = useState([]);
  const [favorites3, setFavorites3] = useState([]);
  const [favoritesModalVisible1, setFavoritesModalVisible1] = useState(false);
  const [favoritesModalVisible2, setFavoritesModalVisible2] = useState(false);
  const [favoritesModalVisible3, setFavoritesModalVisible3] = useState(false);
  const [favorites4, setFavorites4] = useState([]);
const [favorites5, setFavorites5] = useState([]);
const [favoritesModalVisible4, setFavoritesModalVisible4] = useState(false);
const [favoritesModalVisible5, setFavoritesModalVisible5] = useState(false);
const [showUploadIcon, setShowUploadIcon] = useState(false);
const [favoriteTitles, setFavoriteTitles] = useState({
  food: currentLabels.food,
  stationery: currentLabels.stationery,
  pharmacy: currentLabels.pharmacy,
  hardware: currentLabels.hardware,
  gifts: currentLabels.gifts,
});
const [isEditingFavoriteTitle, setIsEditingFavoriteTitle] = useState(false);
const [newFavoriteTitle, setNewFavoriteTitle] = useState('');
const [currentFavoriteCategory, setCurrentFavoriteCategory] = useState('');
const [predefinedImagesModalVisible, setPredefinedImagesModalVisible] = useState(false);
const [selectedCategory, setSelectedCategory] = useState('');

const imageHeight = scrollY.interpolate({
  inputRange: [0, 200],
  outputRange: [200, 50],
  extrapolate: 'clamp',
});

const imageWidth = scrollY.interpolate({
  inputRange: [0, 200],
  outputRange: [width, 50],
  extrapolate: 'clamp',
});

const titleFontSize = scrollY.interpolate({
  inputRange: [0, 200],
  outputRange: [24, 16],
  extrapolate: 'clamp',
});

const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};
const renderEmptyComponent = () => (
  <View style={{ padding: 20 }}>
    <Text style={[styles.nofav]}>{currentLabels.noFavorites}</Text>
  </View>
);


const [favoriteImages, setFavoriteImages] = useState({
  food: require('../assets/images/favoritos/food2.png'),
  stationery: require('../assets/images/favoritos/papeleria2.png'),
  pharmacy: require('../assets/images/favoritos/farmacia2.png'),
  hardware: require('../assets/images/favoritos/tornillo1.png'),
  gifts: require('../assets/images/favoritos/compras1.png'),
});

const [selectedImage, setSelectedImage] = useState({
  food: require('../assets/images/favoritos/food2.png'),
  stationery: require('../assets/images/favoritos/papeleria2.png'),
  pharmacy: require('../assets/images/favoritos/farmacia2.png'),
  hardware: require('../assets/images/favoritos/tornillo1.png'),
  gifts: require('../assets/images/favoritos/compras1.png'),
});



const [predefinedImages, setPredefinedImages] = useState({
  food: [
    require('../assets/images/favoritos/food1.png'),
    require('../assets/images/favoritos/food2.png'),
  ],
  stationery: [
    require('../assets/images/favoritos/papeleria.png'),
    require('../assets/images/favoritos/papeleria2.png'),
  ],
  pharmacy: [
    require('../assets/images/favoritos/fammacia1.png'),
    require('../assets/images/favoritos/farmacia2.png'),

  ],
  hardware: [
    require('../assets/images/favoritos/tornillo1.png'),
    require('../assets/images/favoritos/tornillo2.png'),

  ],
  gifts: [
    require('../assets/images/favoritos/compras1.png'),
    require('../assets/images/favoritos/compras2.png'),

  ],
});



const openPredefinedImagesModal = (category) => {
  setSelectedCategory(category);
  setPredefinedImagesModalVisible(true);
};
const selectPredefinedImage = (image) => {
  const newImages = { ...favoriteImages, [selectedCategory]: image };
  setFavoriteImages(newImages);
  setSelectedImage({ ...selectedImage, [selectedCategory]: image });
  AsyncStorage.setItem('@favorite_images', JSON.stringify(newImages));
  setPredefinedImagesModalVisible(false);
};

const requestPermission = async () => {
  if (Platform.OS === 'ios') {
    const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    return result === RESULTS.GRANTED;
  } else {
    const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    return result === RESULTS.GRANTED;
  }
};

const selectImage = async (category) => {
  const hasPermission = await requestPermission();
  if (!hasPermission) {
    Alert.alert('Permission required', 'Permission is required to access your photo library.');
    return;
  }

  const options = { mediaType: 'photo' };
  launchImageLibrary(options, (response) => {
    if (response.assets && response.assets.length > 0) {
      const source = { uri: response.assets[0].uri };
      const newImages = { ...favoriteImages, [category]: source };
      setFavoriteImages(newImages);
      setSelectedImage({ ...selectedImage, [category]: source });
      AsyncStorage.setItem('@favorite_images', JSON.stringify(newImages));

      // Añadir la imagen subida a las imágenes predefinidas
      const updatedPredefinedImages = { ...predefinedImages };
      updatedPredefinedImages[category] = [...updatedPredefinedImages[category], source];
      setPredefinedImages(updatedPredefinedImages);
      AsyncStorage.setItem('@predefined_images', JSON.stringify(updatedPredefinedImages));

      // Hacer scroll al final después de añadir la nueva imagen
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  });
};

const loadFavoriteImages = async () => {
  try {
    const savedImages = await AsyncStorage.getItem('@favorite_images');
    if (savedImages) {
      setFavoriteImages(JSON.parse(savedImages));
    }
  } catch (e) {
    console.error('Error loading favorite images: ', e);
  }
};


const loadPredefinedImages = async () => {
  try {
    const savedPredefinedImages = await AsyncStorage.getItem('@predefined_images');
    if (savedPredefinedImages) {
      setPredefinedImages(JSON.parse(savedPredefinedImages));
    }
  } catch (e) {
    console.error('Error loading predefined images: ', e);
  }
};


const saveFavoriteTitle = async () => {
  const newTitles = { ...favoriteTitles, [currentFavoriteCategory]: newFavoriteTitle };
  setFavoriteTitles(newTitles);
  await AsyncStorage.setItem('@favorite_titles', JSON.stringify(newTitles));
  setIsEditingFavoriteTitle(false);
};


useEffect(() => {
  const loadFavoriteTitles = async () => {
    try {
      const savedTitles = await AsyncStorage.getItem('@favorite_titles');
      if (savedTitles) {
        setFavoriteTitles(JSON.parse(savedTitles));
      }
    } catch (e) {
      console.error('Error loading favorite titles: ', e);
    }
  };
  loadFavoriteTitles();
  loadFavoriteImages();
  loadPredefinedImages();
}, []);



const FavoriteCountBadge = ({ count }) => {


  return (
    <Animated.View style={[styles.badgeContainer]}>
      <Text style={styles.badgeText}>{count}</Text>
    </Animated.View>
  );
};
  
  useEffect(() => {
    if (history.length > 0 && favorites.length > 0) {
      // Animación de entrada
      Animated.timing(slideAnim, {
        toValue: 0, // Valor final (posición original)
        duration: 300, // Duración de la animación
        easing: Easing.ease, // Easing para la animación
        useNativeDriver: true, // Mejor rendimiento en dispositivos móviles
      }).start();
    } else {
      // Animación de salida
      Animated.timing(slideAnim, {
        toValue: -100, // Valor final (fuera de la pantalla)
        duration: 300, // Duración de la animación
        easing: Easing.ease, // Easing para la animación
        useNativeDriver: true, // Mejor rendimiento en dispositivos móviles
      }).start();
    }
  }, [history, favorites]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadHistory();
      loadCompletedItems();
      loadReminders();
      loadFavorites();
    });
  
    return unsubscribe;
  }, [navigation]);
  

  const toggleFavorite = (index, favorites, setFavorites, key) => {
    const newFavorites = [...favorites];
    if (newFavorites.includes(index)) {
      newFavorites.splice(newFavorites.indexOf(index), 1);
    } else {
      newFavorites.push(index);
    }
    setFavorites(newFavorites);
    saveFavorites(newFavorites, key);
  };
  
  const saveFavorites = async (newFavorites, key) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(newFavorites));
    } catch (e) {
      console.error("Error saving favorites: ", e);
    }
  };
  
  
  const loadFavorites = async (key, setFavorites) => {
    try {
      const savedFavorites = await AsyncStorage.getItem(key);
      if (savedFavorites !== null) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (e) {
      console.error("Error loading favorites: ", e);
    }
  };
  
  useEffect(() => {
    loadFavorites('@favorites1', setFavorites1);
    loadFavorites('@favorites2', setFavorites2);
    loadFavorites('@favorites3', setFavorites3);
    loadFavorites('@favorites4', setFavorites4);
    loadFavorites('@favorites5', setFavorites5);
  }, []);
  

  useEffect(() => {
      const checkFirstLaunch = async () => {
          try {
              const hasLaunched = await AsyncStorage.getItem('hasLaunched');
              if (hasLaunched === null) {
                  setHistoryModalVisible(true);
                  await AsyncStorage.setItem('hasLaunched', 'true');
              }
          } catch (error) {
              console.error('Error checking first launch', error);
          }
      };

      checkFirstLaunch();
  }, []);

  const handleCloseModal = () => {
      setHistoryModalVisible(false);
  };
  
  const getItemLayout = (data, index) => (
    { length: width, offset: width * index, index }
  );
  
  const listener = Purchases.addCustomerInfoUpdateListener((customerInfo) => {
    console.log('Información del cliente actualizada:', customerInfo);
    if (customerInfo.entitlements.active['12981']) {
      console.log('Usuario ya suscrito');
      setIsSubscribed(true);
    } else {
      console.log('Usuario no suscrito');
      setIsSubscribed(false);
    }
  });

  useEffect(() => {
    const initializePurchases = async () => {
      try {
        await Purchases.setDebugLogsEnabled(true);
        await Purchases.configure({ apiKey: 'appl_bHxScLAZLsKxfggiOiqVAZTXjJX' });

        const customerInfo = await Purchases.getCustomerInfo();
        console.log('Información del cliente:', customerInfo);

        if (customerInfo.entitlements.active['12981']) {
          console.log('Usuario ya suscrito');
          setIsSubscribed(true);
        } else {
          console.log('Usuario no suscrito');
          setIsSubscribed(false);
        }
      } catch (error) {
        console.log('Error al obtener la información del comprador:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleCustomerInfoUpdate = (info) => {
      console.log('Información del cliente actualizada:', info);
      if (info.entitlements.active['12981']) {
        console.log('Usuario ya suscrito');
        setIsSubscribed(true);
      } else {
        console.log('Usuario no suscrito');
        setIsSubscribed(false);
      }
    };

    initializePurchases();

    return () => {
      Purchases.removeCustomerInfoUpdateListener(handleCustomerInfoUpdate);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadReminders();
    });
  
    return unsubscribe;
  }, [navigation]);

  const openReminderModal = (index) => {
    setCurrentListIndex(index);
    setCurrentListName(history[index].name);
    checkNotificationPermissions();
    setExpandedCardIndex(null);
    setFavoritesModalVisible(false)
  };
  const handleExpandAndToggleFavorite = (index) => {
    const allFavorites = [favorites1, favorites2, favorites3, favorites4, favorites5];
    const allSetFavorites = [setFavorites1, setFavorites2, setFavorites3, setFavorites4, setFavorites5];
    const allKeys = ['@favorites1', '@favorites2', '@favorites3', '@favorites4', '@favorites5'];
  
    let currentFavoriteIndex = -1;
    allFavorites.forEach((favorites, i) => {
      if (favorites.includes(index)) {
        currentFavoriteIndex = i;
      }
    });
  
    // Si ya está en favoritos, eliminarlo
    if (currentFavoriteIndex !== -1) {
      const newFavorites = [...allFavorites[currentFavoriteIndex]];
      newFavorites.splice(newFavorites.indexOf(index), 1);
      allSetFavorites[currentFavoriteIndex](newFavorites);
      saveFavorites(newFavorites, allKeys[currentFavoriteIndex]);
    } else {
      // Si no está en favoritos, agregarlo al primer espacio disponible
      const firstAvailableIndex = allFavorites.findIndex(favorites => !favorites.includes(index));
      if (firstAvailableIndex !== -1) {
        const newFavorites = [index];
        allSetFavorites[firstAvailableIndex](newFavorites);
        saveFavorites(newFavorites, allKeys[firstAvailableIndex]);
      }
    }
  
    setExpandedCardIndex(index);
    setFavoritesModalVisible(false);
  };
  
  
  const checkNotificationPermissions = () => {
    PushNotification.checkPermissions((permissions) => {
      if (!permissions.alert || !permissions.badge || !permissions.sound) {
        Alert.alert(
          currentLabels.notificationsDisabledTittle, // Título de la alerta traducido
          currentLabels.notificationsDisabled, // Mensaje de la alerta traducido
          [
            { text: currentLabels.cancel, style: "cancel" },
            { text: currentLabels.active, onPress: () => Linking.openSettings() }
          ],
          { cancelable: false }
        );
      } else {
        setReminderModalVisible(true);
      }
    });
  };

  useEffect(() => {
    let timer;
    if (successModalVisible) {
      timer = setTimeout(() => {
        setSuccessModalVisible(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [successModalVisible]);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  const handleExpandedScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setExpandedCardIndex(index);
  };

  const closes = async () => {
    saveCurrentList();
    setModalVisible(false);
  };

  useEffect(() => {
    if (isFocused) {
      loadHistory();
      loadCompletedItems();
      loadReminders();
    }
  }, [isFocused]);

  const loadCompletedItems = async () => {
    try {
      const savedCompletedItems = await AsyncStorage.getItem('@completed_items');
      if (savedCompletedItems !== null) {
        setCompletedItems(JSON.parse(savedCompletedItems));
      }
    } catch (e) {
      console.error("Error loading completed items: ", e);
    }
  };

  const saveCompletedItems = async (newCompletedItems) => {
    try {
      await AsyncStorage.setItem('@completed_items', JSON.stringify(newCompletedItems));
      setCompletedItems(newCompletedItems);
    } catch (e) {
      console.error("Error saving completed items: ", e);
    }
  };

  const toggleItemCompletion = (listIndex, itemIndex) => {
    const newCompletedItems = { ...completedItems };
    if (!newCompletedItems[listIndex]) {
      newCompletedItems[listIndex] = [];
    }
    if (newCompletedItems[listIndex].includes(itemIndex)) {
      newCompletedItems[listIndex] = newCompletedItems[listIndex].filter(i => i !== itemIndex);
    } else {
      newCompletedItems[listIndex].push(itemIndex);
    }
    saveCompletedItems(newCompletedItems);
  };

  const shareShoppingList = async (list) => {
    const listString = list.join('\n');
    try {
      await Share.share({
        message: listString,
        title: 'Shopping List'
      });
    } catch (error) {
      console.error("Error sharing shopping list: ", error);
      Alert.alert("Error", "Could not share the shopping list.");
    }
  };

  const printShoppingList = async (list) => {
    const listString = list.join('<br/>');
    try {
      await RNPrint.print({
        html: `<html><body><h1>Shopping List</h1><p>${listString}</p></body></html>`
      });
    } catch (error) {
      console.error("Error printing shopping list: ", error);
      Alert.alert("Error", "Could not print the shopping list.");
    }
  };

  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('@shopping_history');
      if (savedHistory !== null) {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
      }
    } catch (e) {
      console.error("Error loading history: ", e);
    }
  };

  const saveHistory = async (newHistory) => {
    try {
      await AsyncStorage.setItem('@shopping_history', JSON.stringify(newHistory.reverse()));
      setHistory(newHistory); // Actualizar el estado local después de guardar
    } catch (e) {
      console.error("Error saving history: ", e);
    }
  };

  const removeListFromHistory = async (index) => {
    const newHistory = [...history];
    newHistory.splice(index, 1);
  
    // Actualizar las listas de favoritos
    const newFavorites1 = favorites1.filter(favIndex => favIndex !== index);
    const newFavorites2 = favorites2.filter(favIndex => favIndex !== index);
    const newFavorites3 = favorites3.filter(favIndex => favIndex !== index);
    const newFavorites4 = favorites4.filter(favIndex => favIndex !== index);
    const newFavorites5 = favorites5.filter(favIndex => favIndex !== index);
  
    // Ajustar los índices en las listas de favoritos para que sean consistentes con el nuevo history
    const adjustFavorites = (favorites) => favorites.map(favIndex => (favIndex > index ? favIndex - 1 : favIndex));
    const adjustedFavorites1 = adjustFavorites(newFavorites1);
    const adjustedFavorites2 = adjustFavorites(newFavorites2);
    const adjustedFavorites3 = adjustFavorites(newFavorites3);
    const adjustedFavorites4 = adjustFavorites(newFavorites4);
    const adjustedFavorites5 = adjustFavorites(newFavorites5);
  
    setHistory(newHistory);
    setFavorites1(adjustedFavorites1);
    setFavorites2(adjustedFavorites2);
    setFavorites3(adjustedFavorites3);
    setFavorites4(adjustedFavorites4);
    setFavorites5(adjustedFavorites5);
  
    setFavoritesModalVisible(false);
  
    try {
      await AsyncStorage.setItem('@shopping_history', JSON.stringify(newHistory));
      await AsyncStorage.setItem('@favorites1', JSON.stringify(adjustedFavorites1));
      await AsyncStorage.setItem('@favorites2', JSON.stringify(adjustedFavorites2));
      await AsyncStorage.setItem('@favorites3', JSON.stringify(adjustedFavorites3));
      await AsyncStorage.setItem('@favorites4', JSON.stringify(adjustedFavorites4));
      await AsyncStorage.setItem('@favorites5', JSON.stringify(adjustedFavorites5));
    } catch (e) {
      console.error("Error removing from history: ", e);
    }
  };
  
  

  const cancelNotification = (listIndex) => {
    if (reminders[listIndex]) {
      PushNotification.cancelLocalNotification(`${listIndex}`); // Usa el método correcto
      const newReminders = { ...reminders };
      delete newReminders[listIndex];
      setReminders(newReminders);
      saveReminders(newReminders);
    }
  };
  
  

  const scheduleNotification = (listName, date, listIndex) => {
    PushNotification.localNotificationSchedule({
      id: `${listIndex}`, // Añade esta línea para establecer un ID único
      title: currentLabels.reminderTitle,
      message: `${currentLabels.reminderMessage} ${listName}`,
      date: date,
      allowWhileIdle: true,
    });
  
    const newReminders = { ...reminders, [listIndex]: date };
    setReminders(newReminders);
    saveReminders(newReminders);
  
    setSuccessModalVisible(true);
  };
  
  


  const saveReminders = async (newReminders) => {
    try {
      await AsyncStorage.setItem('@reminders', JSON.stringify(newReminders));
    } catch (e) {
      console.error("Error saving reminders: ", e);
    }
  };

  const loadReminders = async () => {
    try {
      const savedReminders = await AsyncStorage.getItem('@reminders');
      if (savedReminders !== null) {
        setReminders(JSON.parse(savedReminders));
      }
    } catch (e) {
      console.error("Error loading reminders: ", e);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowPicker(Platform.OS === 'ios');
    setSelectedDate(currentDate);
  };

  const openModal = (index) => {
    setFavoritesModalVisible(false)
    setCurrentList(history[index].list);
    setCurrentListName(history[index].name);
    setCurrentListIndex(index);
    setModalVisible(true);
    setExpandedCardIndex(null);
    
    
  };

  const updateList = (index, newText) => {
    const newList = [...currentList];
    newList[index] = newText;
    setCurrentList(newList);
  };

  const addItemToList = () => {
    setCurrentList([...currentList, '']);
  };

  const saveCurrentList = async () => {
    const newHistory = [...history];
    newHistory[currentListIndex] = {
      ...newHistory[currentListIndex],
      list: currentList,
      name: currentListName,
    };
    await saveHistory(newHistory);
    setModalVisible(false);
    flatListRef.current.scrollToIndex({ index: 0 }); // Cambiar a índice 0 para moverse al primer elemento
    setCurrentIndex(0); // Establecer el índice actual a 0
  };
  
  const isReminderPassed = (date) => {
    return new Date(date) < new Date();
  };

  const handleMomentumScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setSelectedListIndex(index);
  };


 // Actualiza la función de confirmación de eliminación
const confirmRemoveListFromHistory = (index) => {
  setFavoritesModalVisible(false);
  Alert.alert(
    currentLabels.confirmDelete, // Título de la alerta traducido
    currentLabels.areYouSure, // Mensaje de la alerta traducido
    [
      {
        text: currentLabels.cancel, // Texto del botón de cancelar traducido
        style: 'cancel',
      },
      {
        text: currentLabels.delete, // Texto del botón de eliminar traducido
        onPress: () => removeListFromHistory(index),
      },
    ],
    { cancelable: false }
  );
};
  


  const headerHeight = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [40, 20],
    extrapolate: 'clamp'
  });

  const headerFontSize = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [24, 14],
    extrapolate: 'clamp'
  });


  const renderHistoryItem = ({ item, index }) => (
    <View style={[styles.card, { width: width - 40 }]}>
      <View style={styles.cardHeader}>
        {!favoritesModalVisible && editingIndex === index ? (
          <>
            <TextInput
              style={styles.historyItemInput}
              value={editingText}
              onChangeText={setEditingText}
              onSubmitEditing={() => {
                const newHistory = [...history];
                newHistory[index].name = editingText;
                saveHistory(newHistory);
                setEditingIndex(null);
              }}
            />
            <TouchableOpacity onPress={() => {
              const newHistory = [...history];
              newHistory[index].name = editingText;
              saveHistory(newHistory);
              setEditingIndex(null);
            }}>
              <Ionicons name="checkmark" size={26} color="#009688" style={styles.pencilIcon} />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.cardTitle}>{item.name}</Text>
            {!favoritesModalVisible1 && !favoritesModalVisible2 && !favoritesModalVisible3 && !favoritesModalVisible4 && !favoritesModalVisible5 && screenWidth > 380 && (
              <TouchableOpacity onPress={() => {
                setEditingIndex(index);
                setEditingText(item.name);
              }}>
                <Ionicons name="pencil" size={21} color="#009688" style={styles.pencilIcon} />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
      
    {!favoritesModalVisible1 && !favoritesModalVisible2 && !favoritesModalVisible3 && !favoritesModalVisible4 && !favoritesModalVisible5 && (
      <View style={styles.cardIcons}>
        <TouchableOpacity onPress={() => confirmRemoveListFromHistory(index)} style={styles.headerIconi}>
          <Ionicons name="trash-outline" size={21} color="#e91e63" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => shareShoppingList(item.list)} style={styles.headerIconi}>
          <Ionicons name="share-outline" size={22} color="#673ab7" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => printShoppingList(item.list)} style={styles.headerIconi}>
          <Ionicons name="print-outline" size={22} color="#009688" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openModal(index)} style={styles.headerIconi}>
          <Ionicons name="add-sharp" size={22} color="#2196f3" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openReminderModal(index)} style={styles.headerIconi}>
          <Ionicons name="notifications-outline" size={22} color="#ff5722" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleExpandAndToggleFavorite(index)} style={styles.headerIconi}>
          <Ionicons name="expand" size={22} color="#795548" />
        </TouchableOpacity>
      </View>
    )}

    {reminders[index] && !isReminderPassed(reminders[index]) && (
      <View style={styles.notofi}>
        <Image
          source={require('../assets/images/activo.png')}
          style={[styles.emptyListImagenotifi]}
        />
        <Text style={[styles.reminderText]}>
          {new Date(reminders[index]).toLocaleDateString()} {currentLabels.time}: {new Date(reminders[index]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <TouchableOpacity onPress={() => cancelNotification(index)} style={styles.headerIconis}>
          <Ionicons name="trash" size={21} color='#3f51b5' />
        </TouchableOpacity>
      </View>
    )}

    <ScrollView style={styles.cardContent}>
      {item.list.map((listItem, listItemIndex) => (
        <TouchableOpacity key={listItemIndex} onPress={() => toggleItemCompletion(index, listItemIndex)}>
          <Text style={[styles.listItemText, completedItems[index]?.includes(listItemIndex) && styles.completedItem]}>
            {listItem}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>

    {!favoritesModalVisible1 && !favoritesModalVisible2 && !favoritesModalVisible3 && !favoritesModalVisible4 && !favoritesModalVisible5 && (
      <View style={styles.favoritesIconsContainer}>
        <View style={styles.row}>
          <TouchableOpacity 
            onPress={() => toggleFavorite(index, favorites1, setFavorites1, '@favorites1')} 
            style={[styles.chip, favorites1.includes(index) && styles.chipSelected]}
            disabled={favorites2.includes(index) || favorites3.includes(index) || favorites4.includes(index) || favorites5.includes(index)}
          >
            <Text style={[styles.chipText, favorites1.includes(index) && styles.chipTextSelected]}>
              {favorites1.includes(index) && (
                <Ionicons 
                  name="remove-circle-outline" 
                  size={18} 
                  color="#fe4e8a" 
                  onPress={() => toggleFavorite(index, favorites1, setFavorites1, '@favorites1')} 
                  style={{alignSelf: 'center' }}
                />
              )}
              {truncateText(favoriteTitles.food, 6)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => toggleFavorite(index, favorites2, setFavorites2, '@favorites2')} 
            style={[styles.chip, favorites2.includes(index) && styles.chipSelected]}
            disabled={favorites1.includes(index) || favorites3.includes(index) || favorites4.includes(index) || favorites5.includes(index)}
          >
            <Text style={[styles.chipText, favorites2.includes(index) && styles.chipTextSelected]}>
              {favorites2.includes(index) && (
                <Ionicons 
                  name="remove-circle-outline" 
                  size={18} 
                  color="#fe4e8a"  
                  onPress={() => toggleFavorite(index, favorites2, setFavorites2, '@favorites2')} 
                  style={{alignSelf: 'center' }}
                />
              )}
              {truncateText(favoriteTitles.stationery, 6)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => toggleFavorite(index, favorites3, setFavorites3, '@favorites3')} 
            style={[styles.chip, favorites3.includes(index) && styles.chipSelected]}
            disabled={favorites1.includes(index) || favorites2.includes(index) || favorites4.includes(index) || favorites5.includes(index)}
          >
            <Text style={[styles.chipText, favorites3.includes(index) && styles.chipTextSelected]}>
              {favorites3.includes(index) && (
                <Ionicons 
                  name="remove-circle-outline" 
                  size={18} 
                  color="#fe4e8a" 
                  onPress={() => toggleFavorite(index, favorites3, setFavorites3, '@favorites3')} 
                  style={{alignSelf: 'center' }}
                />
              )}
              {truncateText(favoriteTitles.pharmacy, 6)}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          {screenWidth > 380 && (
            <>
              <TouchableOpacity 
                onPress={() => toggleFavorite(index, favorites4, setFavorites4, '@favorites4')} 
                style={[styles.chip, favorites4.includes(index) && styles.chipSelected]}
                disabled={favorites1.includes(index) || favorites2.includes(index) || favorites3.includes(index) || favorites5.includes(index)}
              >
                <Text style={[styles.chipText, favorites4.includes(index) && styles.chipTextSelected]}>
                  {favorites4.includes(index) && (
                    <Ionicons 
                      name="remove-circle-outline" 
                      size={18} 
                      color="#fe4e8a" 
                      onPress={() => toggleFavorite(index, favorites4, setFavorites4, '@favorites4')} 
                      style={{alignSelf: 'center' }}
                    />
                  )}
                  {truncateText(favoriteTitles.hardware, 6)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => toggleFavorite(index, favorites5, setFavorites5, '@favorites5')} 
                style={[styles.chip, favorites5.includes(index) && styles.chipSelected]}
                disabled={favorites1.includes(index) || favorites2.includes(index) || favorites3.includes(index) || favorites4.includes(index)}
              >
                <Text style={[styles.chipText, favorites5.includes(index) && styles.chipTextSelected]}>
                  {favorites5.includes(index) && (
                    <Ionicons 
                      name="remove-circle-outline" 
                      size={18} 
                      color="#fe4e8a" 
                      onPress={() => toggleFavorite(index, favorites5, setFavorites5, '@favorites5')} 
                      style={{alignSelf: 'center' }}
                    />
                  )}
                  {truncateText(favoriteTitles.gifts, 6)}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    )}

    {(favoritesModalVisible1 || favoritesModalVisible2 || favoritesModalVisible3 || favoritesModalVisible4 || favoritesModalVisible5) && (
      <View style={styles.favoritesIconsContainer}>
        <View style={styles.row}>
          {favorites1.includes(index) && favoritesModalVisible1 && (
            <TouchableOpacity 
              onPress={() => toggleFavorite(index, favorites1, setFavorites1, '@favorites1')} 
              style={[styles.chip, favorites1.includes(index) && styles.chipSelected]}
              disabled={favorites2.includes(index) || favorites3.includes(index) || favorites4.includes(index) || favorites5.includes(index)}
            >
              <Text style={[styles.chipText, favorites1.includes(index) && styles.chipTextSelected]}>
                {favorites1.includes(index) && (
                  <Ionicons 
                    name="remove-circle-outline" 
                    size={18} 
                    color="#fe4e8a" 
                    onPress={() => toggleFavorite(index, favorites1, setFavorites1, '@favorites1')} 
                    style={{alignSelf: 'center' }}
                  />
                )}
                {currentLabels.removeFromFavorites}
              </Text>
            </TouchableOpacity>
          )}
          {favorites2.includes(index) && favoritesModalVisible2 && (
            <TouchableOpacity 
              onPress={() => toggleFavorite(index, favorites2, setFavorites2, '@favorites2')} 
              style={[styles.chip, favorites2.includes(index) && styles.chipSelected]}
              disabled={favorites1.includes(index) || favorites3.includes(index) || favorites4.includes(index) || favorites5.includes(index)}
            >
              <Text style={[styles.chipText, favorites2.includes(index) && styles.chipTextSelected]}>
                {favorites2.includes(index) && (
                  <Ionicons 
                    name="remove-circle-outline" 
                    size={18} 
                    color="#fe4e8a"  
                    onPress={() => toggleFavorite(index, favorites2, setFavorites2, '@favorites2')} 
                    style={{alignSelf: 'center' }}
                  />
                )}
               {currentLabels.removeFromFavorites}
              </Text>
            </TouchableOpacity>
          )}
          {favorites3.includes(index) && favoritesModalVisible3 && (
            <TouchableOpacity 
              onPress={() => toggleFavorite(index, favorites3, setFavorites3, '@favorites3')} 
              style={[styles.chip, favorites3.includes(index) && styles.chipSelected]}
              disabled={favorites1.includes(index) || favorites2.includes(index) || favorites4.includes(index) || favorites5.includes(index)}
            >
              <Text style={[styles.chipText, favorites3.includes(index) && styles.chipTextSelected]}>
                {favorites3.includes(index) && (
                  <Ionicons 
                    name="remove-circle-outline" 
                    size={18} 
                    color="#fe4e8a" 
                    onPress={() => toggleFavorite(index, favorites3, setFavorites3, '@favorites3')} 
                    style={{alignSelf: 'center' }}
                  />
                )}
               {currentLabels.removeFromFavorites}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.row}>
          {screenWidth > 380 && (
            <>
              {favorites4.includes(index) && favoritesModalVisible4 && (
                <TouchableOpacity 
                  onPress={() => toggleFavorite(index, favorites4, setFavorites4, '@favorites4')} 
                  style={[styles.chip, favorites4.includes(index) && styles.chipSelected]}
                  disabled={favorites1.includes(index) || favorites2.includes(index) || favorites3.includes(index) || favorites5.includes(index)}
                >
                  <Text style={[styles.chipText, favorites4.includes(index) && styles.chipTextSelected]}>
                    {favorites4.includes(index) && (
                      <Ionicons 
                        name="remove-circle-outline" 
                        size={18} 
                        color="#fe4e8a" 
                        onPress={() => toggleFavorite(index, favorites4, setFavorites4, '@favorites4')} 
                        style={{alignSelf: 'center' }}
                      />
                    )}
                    {currentLabels.removeFromFavorites}
                  </Text>
                </TouchableOpacity>
              )}
              {favorites5.includes(index) && favoritesModalVisible5 && (
                <TouchableOpacity 
                  onPress={() => toggleFavorite(index, favorites5, setFavorites5, '@favorites5')} 
                  style={[styles.chip, favorites5.includes(index) && styles.chipSelected]}
                  disabled={favorites1.includes(index) || favorites2.includes(index) || favorites3.includes(index) || favorites4.includes(index)}
                >
                  <Text style={[styles.chipText, favorites5.includes(index) && styles.chipTextSelected]}>
                    {favorites5.includes(index) && (
                      <Ionicons 
                        name="remove-circle-outline" 
                        size={18} 
                        color="#fe4e8a" 
                        onPress={() => toggleFavorite(index, favorites5, setFavorites5, '@favorites5')} 
                        style={{alignSelf: 'center' }}
                      />
                    )}
                   {currentLabels.removeFromFavorites}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    )}

    <View style={styles.publicidad}>
      {!isSubscribed && (
        <>
          <TouchableOpacity style={styles.touchable} onPress={() => navigation.navigate('SuscripcionScreeen')}>
            <Text>{currentLabels.subscribe}</Text>
          </TouchableOpacity>
          {Platform.OS === 'ios' && (
            <BannerAd
              unitId="ca-app-pub-9855080864816987/1292375998"
              size={BannerAdSize.BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
              onAdLoaded={() => {
                console.log('Ad Banner loaded successfully');
              }}
              onAdFailedToLoad={(error) => {
                console.error('Ad Banner failed to load: ', error);
              }}
              onAdOpened={() => {
                console.log('Ad Banner opened');
              }}
              onAdClosed={() => {
                console.log('Ad Banner closed');
              }}
              onAdLeftApplication={() => {
                console.log('Ad Banner left application');
              }}
            />
          )}
        </>
      )}
    </View>
  </View>
);


  const renderHistoryItemes = ({ item, index }) => (
    <View style={[styles.cardespan, { width: width - 40 }]}>
      <Text style={styles.cardTitlespanes}>{item.name}</Text>
      <View style={styles.cardHeader}>
        {editingIndex === index ? (
          <TextInput
            style={styles.historyItemInput}
            value={editingText}
            onChangeText={setEditingText}
            onSubmitEditing={() => {
              const newHistory = [...history];
              newHistory[index].name = editingText;
              saveHistory(newHistory);
              setEditingIndex(null);
            }}
          />
        ) : (
          <Text style={styles.cardTitldde}></Text>
        )}

      </View>

      {reminders[index] && !isReminderPassed(reminders[index]) && (
        <View style={styles.notofi}>
          <Image
            source={require('../assets/images/activo.png')}
            style={[styles.emptyListImagenotifi]}
          />
          <Text style={[styles.reminderText]}>
            {currentLabels.date}: {new Date(reminders[index]).toLocaleDateString()} {currentLabels.time}: {new Date(reminders[index]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <TouchableOpacity onPress={() => cancelNotification(index)} style={styles.headerIconi}>
            <Ionicons name="trash" size={22} color="red" />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.cardContent}>
        {item.list.map((listItem, listItemIndex) => (
          <TouchableOpacity key={listItemIndex} onPress={() => toggleItemCompletion(index, listItemIndex)}>
            <Text style={[styles.listItemTextspan, completedItems[index]?.includes(listItemIndex) && styles.completedItem]}>
              {listItem}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.cardIcons}>

<TouchableOpacity onPress={() => openModal(index)} style={styles.headerIconi}>
  <Ionicons name="add-sharp" size={22} color="#2196f3" />
</TouchableOpacity>


</View>
    </View>
  );

  
  const renderThumbnail = ({ item, index }) => {
    if (screenWidth > 380) {
      return (
        <TouchableOpacity onPress={() => {
          flatListRef.current.scrollToIndex({ index });
          setSelectedListIndex(index);
        }}>
          <View style={[styles.thumbnailContainer, index === selectedListIndex && styles.selectedThumbnail]}>
            <Text style={[styles.thumbnailText, index === selectedListIndex && styles.selectedThumbnailText]}>
              {item.name}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
    return null; // No renderizar nada si la pantalla es menor o igual a 600 píxeles
  };

  return (
    <SafeAreaView style={styles.container}>

<View style={styles.favoritesContainer}>
      <TouchableOpacity
        onPress={() => setFavoritesModalVisible1(true)}
        style={styles.headerIconiav}
      >
        <Animated.View style={[styles.iconContainer, { transform: [{ translateX: slideAnim }] }]}>
          <Image source={favoriteImages.food} style={styles.thumbnailImage} />
          <FavoriteCountBadge count={favorites1.length} previousCount={previousCounts.favorites1} />
        </Animated.View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setFavoritesModalVisible2(true)}
        style={styles.headerIconiav}
      >
        <Animated.View style={[styles.iconContainer, { transform: [{ translateX: slideAnim }] }]}>
          <Image source={favoriteImages.stationery} style={styles.thumbnailImage} />
          <FavoriteCountBadge count={favorites2.length} previousCount={previousCounts.favorites2} />
        </Animated.View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setFavoritesModalVisible3(true)}
        style={styles.headerIconiav}
      >
        <Animated.View style={[styles.iconContainer, { transform: [{ translateX: slideAnim }] }]}>
          <Image source={favoriteImages.pharmacy} style={styles.thumbnailImage} />
          <FavoriteCountBadge count={favorites3.length} previousCount={previousCounts.favorites3} />
        </Animated.View>
      </TouchableOpacity>

      {screenWidth > 380 && (
        <>
          <TouchableOpacity
            onPress={() => setFavoritesModalVisible4(true)}
            style={styles.headerIconiav}
          >
            <Animated.View style={[styles.iconContainer, { transform: [{ translateX: slideAnim }] }]}>
              <Image source={favoriteImages.hardware} style={styles.thumbnailImage} />
              <FavoriteCountBadge count={favorites4.length} previousCount={previousCounts.favorites4} />
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFavoritesModalVisible5(true)}
            style={styles.headerIconiav}
          >
            <Animated.View style={[styles.iconContainer, { transform: [{ translateX: slideAnim }] }]}>
              <Image source={favoriteImages.gifts} style={styles.thumbnailImage} />
              <FavoriteCountBadge count={favorites5.length} previousCount={previousCounts.favorites5} />
            </Animated.View>
          </TouchableOpacity>
        </>
      )}
    </View>




  <Modal
        visible={favoritesModalVisible1}
        animationType="slide"
        onRequestClose={() => setFavoritesModalVisible1(false)}
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <FlatList
              ListHeaderComponent={
                <>
                  <Animated.View>
                  <TouchableOpacity onPress={() => openPredefinedImagesModal('food')}>
  <Image source={favoriteImages.food} style={styles.thumbnailImageModal} />
  {showUploadIcon && (
    <View style={styles.uploadIconContainer}>
      <MaterialCommunityIcons name="image-plus" size={28} color= "#009688" />
    </View>
  )}
</TouchableOpacity>
                  </Animated.View>
                  {isEditingFavoriteTitle && currentFavoriteCategory === 'food' ? (
                    <View style={styles.editTitleContainer}>
                      <TextInput
                        style={styles.modalTitleInput}
                        value={newFavoriteTitle}
                        onChangeText={setNewFavoriteTitle}
                      />
                      <TouchableOpacity onPress={() => {
                        saveFavoriteTitle();
                        setShowUploadIcon(false);
                      }}>
                        <Ionicons name="checkmark" size={36} color="#009688" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Animated.View style={styles.titleContainer}>
                      <Animated.Text style={[styles.modalTitle, { fontSize: titleFontSize }]}>
                        {favoriteTitles.food}
                      </Animated.Text>
                      <TouchableOpacity onPress={() => {
                        setIsEditingFavoriteTitle(true);
                        setCurrentFavoriteCategory('food');
                        setNewFavoriteTitle(favoriteTitles.food);
                        setShowUploadIcon(true);
                      }}>
                        <Ionicons name="pencil" size={21} color="#009688" />
                      </TouchableOpacity>
                    </Animated.View>
                  )}
                </>
              }
              data={favorites1.map(index => history[index])}
              renderItem={renderHistoryItem}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={renderEmptyComponent}
            />
            <TouchableOpacity onPress={() => setFavoritesModalVisible1(false)} style={styles.modalButtoncloses}>
              <Ionicons name="close" size={32} color={theme.text} />
            </TouchableOpacity>
          </View>
          <Modal
  visible={predefinedImagesModalVisible}
  animationType="slide"
  onRequestClose={() => setPredefinedImagesModalVisible(false)}
  transparent={true}
>
  <View style={styles.modalOverlayt}>
    <View style={styles.modalContainert}>
      <FlatList
        ref={flatListRef}
        data={predefinedImages[selectedCategory]}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => selectPredefinedImage(item)} style={styles.imageContainer}>
            <Image source={item} style={styles.thumbnailImageModale} />
            {selectedImage[selectedCategory] === item && (
              <MaterialCommunityIcons name="check-circle" size={28} color="#009688" style={styles.checkIcon} />
            )}
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity onPress={() => setPredefinedImagesModalVisible(false)} style={styles.modalButtoncloses}>
        <Ionicons name="close" size={32} color={theme.text} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => selectImage(selectedCategory)} style={styles.modalUploadButton}>
        <Ionicons name="cloud-upload-outline" size={26} color="#009688" />
      </TouchableOpacity>
    </View>
  </View>
</Modal>


        </View>

      </Modal>

      <Modal
  visible={favoritesModalVisible2}
  animationType="slide"
  onRequestClose={() => setFavoritesModalVisible2(false)}
  transparent={true}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <FlatList
        ListHeaderComponent={
          <>
            <Animated.View>
              <TouchableOpacity onPress={() => openPredefinedImagesModal('stationery')}>
                <Image source={favoriteImages.stationery} style={styles.thumbnailImageModal} />
                {showUploadIcon && (
                  <View style={styles.uploadIconContainer}>
                    <MaterialCommunityIcons name="image-plus" size={28} color= "#009688" />
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
            {isEditingFavoriteTitle && currentFavoriteCategory === 'stationery' ? (
              <View style={styles.editTitleContainer}>
                <TextInput
                  style={styles.modalTitleInput}
                  value={newFavoriteTitle}
                  onChangeText={setNewFavoriteTitle}
                />
                <TouchableOpacity onPress={() => {
                  saveFavoriteTitle();
                  setShowUploadIcon(false);
                }}>
                  <Ionicons name="checkmark" size={36} color="#009688" />
                </TouchableOpacity>
              </View>
            ) : (
              <Animated.View style={styles.titleContainer}>
                <Animated.Text style={[styles.modalTitle, { fontSize: titleFontSize }]}>
                  {favoriteTitles.stationery}
                </Animated.Text>
                <TouchableOpacity onPress={() => {
                  setIsEditingFavoriteTitle(true);
                  setCurrentFavoriteCategory('stationery');
                  setNewFavoriteTitle(favoriteTitles.stationery);
                  setShowUploadIcon(true);
                }}>
                  <Ionicons name="pencil" size={21} color="#009688" />
                </TouchableOpacity>
              </Animated.View>
            )}
          </>
        }
        data={favorites2.map(index => history[index])}
        renderItem={renderHistoryItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={renderEmptyComponent}
      />
      <TouchableOpacity onPress={() => setFavoritesModalVisible2(false)} style={styles.modalButtoncloses}>
        <Ionicons name="close" size={32} color={theme.text} />
      </TouchableOpacity>
    </View>
    <Modal
      visible={predefinedImagesModalVisible}
      animationType="slide"
      onRequestClose={() => setPredefinedImagesModalVisible(false)}
      transparent={true}
    >
      <View style={styles.modalOverlayt}>
        <View style={styles.modalContainert}>
          <FlatList
            ref={flatListRef}
            data={predefinedImages[selectedCategory]}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => selectPredefinedImage(item)} style={styles.imageContainer}>
                <Image source={item} style={styles.thumbnailImageModale} />
                {selectedImage[selectedCategory] === item && (
                  <MaterialCommunityIcons name="check-circle" size={28} color="#009688" style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableOpacity onPress={() => setPredefinedImagesModalVisible(false)} style={styles.modalButtoncloses}>
            <Ionicons name="close" size={32} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => selectImage(selectedCategory)} style={styles.modalUploadButton}>
            <Ionicons name="cloud-upload-outline" size={26} color="#009688" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  </View>
</Modal>

<Modal
  visible={favoritesModalVisible3}
  animationType="slide"
  onRequestClose={() => setFavoritesModalVisible3(false)}
  transparent={true}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <FlatList
        ListHeaderComponent={
          <>
            <Animated.View>
              <TouchableOpacity onPress={() => openPredefinedImagesModal('pharmacy')}>
                <Image source={favoriteImages.pharmacy} style={styles.thumbnailImageModal} />
                {showUploadIcon && (
                  <View style={styles.uploadIconContainer}>
                      <MaterialCommunityIcons name="image-plus" size={28} color= "#009688" /> 
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
            {isEditingFavoriteTitle && currentFavoriteCategory === 'pharmacy' ? (
              <View style={styles.editTitleContainer}>
                <TextInput
                  style={styles.modalTitleInput}
                  value={newFavoriteTitle}
                  onChangeText={setNewFavoriteTitle}
                />
                <TouchableOpacity onPress={() => {
                  saveFavoriteTitle();
                  setShowUploadIcon(false);
                }}>
                  <Ionicons name="checkmark" size={36} color="#009688" />
                </TouchableOpacity>
              </View>
            ) : (
              <Animated.View style={styles.titleContainer}>
                <Animated.Text style={[styles.modalTitle, { fontSize: titleFontSize }]}>
                  {favoriteTitles.pharmacy}
                </Animated.Text>
                <TouchableOpacity onPress={() => {
                  setIsEditingFavoriteTitle(true);
                  setCurrentFavoriteCategory('pharmacy');
                  setNewFavoriteTitle(favoriteTitles.pharmacy);
                  setShowUploadIcon(true);
                }}>
                  <Ionicons name="pencil" size={21} color="#009688" />
                </TouchableOpacity>
              </Animated.View>
            )}
          </>
        }
        data={favorites3.map(index => history[index])}
        renderItem={renderHistoryItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={renderEmptyComponent}
      />
      <TouchableOpacity onPress={() => setFavoritesModalVisible3(false)} style={styles.modalButtoncloses}>
        <Ionicons name="close" size={32} color={theme.text} />
      </TouchableOpacity>
    </View>
    <Modal
      visible={predefinedImagesModalVisible}
      animationType="slide"
      onRequestClose={() => setPredefinedImagesModalVisible(false)}
      transparent={true}
    >
      <View style={styles.modalOverlayt}>
        <View style={styles.modalContainert}>
          <FlatList
           ref={flatListRef}
            data={predefinedImages[selectedCategory]}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => selectPredefinedImage(item)} style={styles.imageContainer}>
                <Image source={item} style={styles.thumbnailImageModale} />
                {selectedImage[selectedCategory] === item && (
                  <MaterialCommunityIcons name="check-circle" size={28} color="#009688" style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableOpacity onPress={() => setPredefinedImagesModalVisible(false)} style={styles.modalButtoncloses}>
            <Ionicons name="close" size={32} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => selectImage(selectedCategory)} style={styles.modalUploadButton}>
            <Ionicons name="cloud-upload-outline" size={26} color="#009688" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  </View>
</Modal>

<Modal
  visible={favoritesModalVisible4}
  animationType="slide"
  onRequestClose={() => setFavoritesModalVisible4(false)}
  transparent={true}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <FlatList
        ListHeaderComponent={
          <>
            <Animated.View>
              <TouchableOpacity onPress={() => openPredefinedImagesModal('hardware')}>
                <Image source={favoriteImages.hardware} style={styles.thumbnailImageModal} />
                {showUploadIcon && (
                  <View style={styles.uploadIconContainer}>
                     <MaterialCommunityIcons name="image-plus" size={28} color= "#009688" />
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
            {isEditingFavoriteTitle && currentFavoriteCategory === 'hardware' ? (
              <View style={styles.editTitleContainer}>
                <TextInput
                  style={styles.modalTitleInput}
                  value={newFavoriteTitle}
                  onChangeText={setNewFavoriteTitle}
                />
                <TouchableOpacity onPress={() => {
                  saveFavoriteTitle();
                  setShowUploadIcon(false);
                }}>
                  <Ionicons name="checkmark" size={36} color="#009688" />
                </TouchableOpacity>
              </View>
            ) : (
              <Animated.View style={styles.titleContainer}>
                <Animated.Text style={[styles.modalTitle, { fontSize: titleFontSize }]}>
                  {favoriteTitles.hardware}
                </Animated.Text>
                <TouchableOpacity onPress={() => {
                  setIsEditingFavoriteTitle(true);
                  setCurrentFavoriteCategory('hardware');
                  setNewFavoriteTitle(favoriteTitles.hardware);
                  setShowUploadIcon(true);
                }}>
                  <Ionicons name="pencil" size={21} color="#009688" />
                </TouchableOpacity>
              </Animated.View>
            )}
          </>
        }
        data={favorites4.map(index => history[index])}
        renderItem={renderHistoryItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={renderEmptyComponent}
      />
      <TouchableOpacity onPress={() => setFavoritesModalVisible4(false)} style={styles.modalButtoncloses}>
        <Ionicons name="close" size={32} color={theme.text} />
      </TouchableOpacity>
    </View>
    <Modal
      visible={predefinedImagesModalVisible}
      animationType="slide"
      onRequestClose={() => setPredefinedImagesModalVisible(false)}
      transparent={true}
    >
      <View style={styles.modalOverlayt}>
        <View style={styles.modalContainert}>
          <FlatList
           ref={flatListRef}
            data={predefinedImages[selectedCategory]}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => selectPredefinedImage(item)} style={styles.imageContainer}>
                <Image source={item} style={styles.thumbnailImageModale} />
                {selectedImage[selectedCategory] === item && (
                  <MaterialCommunityIcons name="check-circle" size={28} color="#009688" style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableOpacity onPress={() => setPredefinedImagesModalVisible(false)} style={styles.modalButtoncloses}>
            <Ionicons name="close" size={32} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => selectImage(selectedCategory)} style={styles.modalUploadButton}>
            <Ionicons name="cloud-upload-outline" size={26} color="#009688" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  </View>
</Modal>

<Modal
  visible={favoritesModalVisible5}
  animationType="slide"
  onRequestClose={() => setFavoritesModalVisible5(false)}
  transparent={true}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <FlatList
        ListHeaderComponent={
          <>
            <Animated.View>
              <TouchableOpacity onPress={() => openPredefinedImagesModal('gifts')}>
                <Image source={favoriteImages.gifts} style={styles.thumbnailImageModal} />
                {showUploadIcon && (
                  <View style={styles.uploadIconContainer}>
                     <MaterialCommunityIcons name="image-plus" size={28} color= "#009688" />
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
            {isEditingFavoriteTitle && currentFavoriteCategory === 'gifts' ? (
              <View style={styles.editTitleContainer}>
                <TextInput
                  style={styles.modalTitleInput}
                  value={newFavoriteTitle}
                  onChangeText={setNewFavoriteTitle}
                />
                <TouchableOpacity onPress={() => {
                  saveFavoriteTitle();
                  setShowUploadIcon(false);
                }}>
                  <Ionicons name="checkmark" size={36} color="#009688" />
                </TouchableOpacity>
              </View>
            ) : (
              <Animated.View style={styles.titleContainer}>
                <Animated.Text style={[styles.modalTitle, { fontSize: titleFontSize }]}>
                  {favoriteTitles.gifts}
                </Animated.Text>
                <TouchableOpacity onPress={() => {
                  setIsEditingFavoriteTitle(true);
                  setCurrentFavoriteCategory('gifts');
                  setNewFavoriteTitle(favoriteTitles.gifts);
                  setShowUploadIcon(true);
                }}>
                  <Ionicons name="pencil" size={21} color="#009688" />
                </TouchableOpacity>
              </Animated.View>
            )}
          </>
        }
        data={favorites5.map(index => history[index])}
        renderItem={renderHistoryItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={renderEmptyComponent}
      />
      <TouchableOpacity onPress={() => setFavoritesModalVisible5(false)} style={styles.modalButtoncloses}>
        <Ionicons name="close" size={32} color={theme.text} />
      </TouchableOpacity>
    </View>
    <Modal
      visible={predefinedImagesModalVisible}
      animationType="slide"
      onRequestClose={() => setPredefinedImagesModalVisible(false)}
      transparent={true}
    >
      <View style={styles.modalOverlayt}>
        <View style={styles.modalContainert}>
          <FlatList
           ref={flatListRef}
            data={predefinedImages[selectedCategory]}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => selectPredefinedImage(item)} style={styles.imageContainer}>
                <Image source={item} style={styles.thumbnailImageModale} />
                {selectedImage[selectedCategory] === item && (
                  <MaterialCommunityIcons name="check-circle" size={28} color="#009688" style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableOpacity onPress={() => setPredefinedImagesModalVisible(false)} style={styles.modalButtoncloses}>
            <Ionicons name="close" size={32} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => selectImage(selectedCategory)} style={styles.modalUploadButton}>
            <Ionicons name="cloud-upload-outline" size={26} color="#009688" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  </View>
</Modal>


    <PagedModal visible={historyModalVisible} onClose={handleCloseModal} />


       <ImageBackground source={theme.backgroundImage} style={styles.background}>

       {history.length === 0 ? (
    <View style={styles.emptyContainer}>
      <Image
            source={require('../assets/images/disminuyendo.png')}
            style={[styles.emptyListImageImagen]}
          />

      <Text style={styles.emptyText}>{currentLabels.noHistory}</Text>
      <TouchableOpacity 
        style={styles.homeButton} 
        onPress={() => navigation.navigate('HomeScreen')}
      >
        <Text style={styles.homeButtonText}>{currentLabels.createShoppingList}</Text>
        <Ionicons name="mic" size={32} color="white" style={styles.pencilIcone} />
      </TouchableOpacity>
    </View>
  ) : (
    <>

    <FlatList
  data={history}
  renderItem={renderHistoryItem}
  keyExtractor={(item, index) => index.toString()}
  horizontal
  pagingEnabled
  showsHorizontalScrollIndicator={false}
  style={styles.historyList}
  contentContainerStyle={styles.historyListContainer}
  ref={flatListRef}
  getItemLayout={getItemLayout} // Añadir esta línea
  onScroll={handleScroll}
  scrollEventThrottle={16}
  onMomentumScrollEnd={handleMomentumScrollEnd}
  onScrollToIndexFailed={(info) => {
    flatListRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: true });
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
    }, 100);
  }}
/>
    </>
  )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TextInput
                style={styles.modalTitleInput}
                value={currentListName}
                onChangeText={setCurrentListName}
              />
              <TouchableOpacity onPress={() => closes()}>
                <Ionicons name="checkmark-circle" size={36} color='#009688' />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              {currentList.map((item, index) => (
                <TextInput
                  key={index}
                  style={styles.modalItemInput}
                  value={item}
                  onChangeText={(text) => updateList(index, text)}
                />
              ))}
              <TouchableOpacity style={styles.addButtonadditem} onPress={addItemToList}>
              <Ionicons name="add-circle" size={36} color='grey' />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={reminderModalVisible}
        animationType="slide"
        onRequestClose={() => setReminderModalVisible(false)}
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
          <Image
            source={require('../assets/images/activo.png')}
            style={[styles.emptyListImagenotificacionmodal]}
          />
            <Text style={styles.modalTitle}>{currentLabels.programNotification}</Text>
            <Text style={styles.modalText}>{currentLabels.selectDateTime}</Text>
            <View style={styles.modalContainerpiker}>
              {showPicker && (
                <DateTimePicker
                  value={selectedDate || new Date()}
                  mode="datetime"
                  display="default"
                  onChange={handleDateChange}
                  
                />
              )}
     
            <TouchableOpacity
              style={[styles.modalButton, !selectedDate && styles.disabledButton]}
              onPress={() => {
                if (selectedDate) {
                  setReminderModalVisible(false);
                  scheduleNotification(currentListName, selectedDate, currentListIndex);
                }
              }}
              disabled={!selectedDate}
            >
              <Text style={styles.modalButtonText}>{currentLabels.setNotification}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButtonclose}
              onPress={() => setReminderModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>{currentLabels.cancel}</Text>
            </TouchableOpacity>

            </View>

          </View>
        </View>
      </Modal>

      <Modal
        visible={successModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContainer}>
            <Image
              source={require('../assets/images/activo.png')}
              style={[styles.emptyListImage]}
            />
            <Text style={styles.successText}>{currentLabels.success}</Text>
            <Text style={styles.successText}>{currentLabels.reminderSet}</Text>
          </View>
        </View>
      </Modal>

      <Modal
        visible={expandedCardIndex !== null}
        animationType="slide"
        onRequestClose={() => setExpandedCardIndex(null)}
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainerespa}>
            <TouchableOpacity onPress={() => setExpandedCardIndex(null)} style={styles.closeExpandedCardButton}>
              <Ionicons name="close" size={32} color={theme.text} />
            </TouchableOpacity>
     
      {!isSubscribed && (
        <>
          <TouchableOpacity style={styles.touchable} onPress={() => navigation.navigate('SuscripcionScreeen')}>
            <Text>{currentLabels.subscribe}</Text>
          </TouchableOpacity>
          {Platform.OS === 'ios' && (
            <BannerAd
              unitId="ca-app-pub-9855080864816987/1292375998" // Asegúrate de usar el ID real de tu bloque de anuncios
              size={BannerAdSize.BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
              onAdLoaded={() => {
                console.log('Ad Banner loaded successfully');
              }}
              onAdFailedToLoad={(error) => {
                console.error('Ad Banner failed to load: ', error);
              }}
              onAdOpened={() => {
                console.log('Ad Banner opened');
              }}
              onAdClosed={() => {
                console.log('Ad Banner closed');
              }}
              onAdLeftApplication={() => {
                console.log('Ad Banner left application');
              }}
            />
          )}
        </>
      )}

            <Text style={styles.successTextoe}></Text>
            {expandedCardIndex !== null && renderHistoryItemes({ item: history[expandedCardIndex], index: expandedCardIndex })}
          </View>
          
        </View>
      </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default HistoryScreen;