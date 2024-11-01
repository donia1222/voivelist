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

  const slideAnim = useRef(new Animated.Value(-100)).current; // Valor inicial fuera de la pantalla
  const [favorites1, setFavorites1] = useState([]);
  const [favorites2, setFavorites2] = useState([]);
  const [favorites3, setFavorites3] = useState([]);
  const [favoritesModalVisible1, setFavoritesModalVisible1] = useState(false);
  const [favoritesModalVisible2, setFavoritesModalVisible2] = useState(false);
  const [favoritesModalVisible3, setFavoritesModalVisible3] = useState(false);
  

  const FavoriteCountBadge = ({ count }) => (
    <View style={styles.badgeContainer}>
      <Text style={styles.badgeText}>{count}</Text>
    </View>
  );

  
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
    const newFavorites = [...favorites];
    if (newFavorites.includes(index)) {
      newFavorites.splice(newFavorites.indexOf(index), 1);
    } else {
      newFavorites.push(index);
    }
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
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
  
    const newFavorites = favorites.filter(favIndex => favIndex !== index);
  
    // Ajustar los índices en newFavorites para que sean consistentes con el nuevo history
    const adjustedFavorites = newFavorites.map(favIndex => (favIndex > index ? favIndex - 1 : favIndex));
  
    setHistory(newHistory);
    setFavorites(adjustedFavorites);
    setFavoritesModalVisible(false);
  
    try {
      await AsyncStorage.setItem('@shopping_history', JSON.stringify(newHistory));
      await AsyncStorage.setItem('@favorites', JSON.stringify(adjustedFavorites));
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
    thumbnailListRef.current.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5, // Asegura que la miniatura esté centrada
    });
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
  

  
  
  const removeFromFavorites = (index) => {
    const newFavorites = [...favorites];
    newFavorites.splice(newFavorites.indexOf(index), 1);
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
    if (newFavorites.length === 0) {
      setFavoritesModalVisible(false);
    }
  };

  const scrollY = useRef(new Animated.Value(0)).current;
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
            {!favoritesModalVisible && (
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
      {!favoritesModalVisible && (
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
      {!favoritesModalVisible ? (
        <View style={styles.favoritesIconsContainer}>
          <TouchableOpacity onPress={() => toggleFavorite(index, favorites1, setFavorites1, '@favorites1')} style={styles.headerIconifaco}>
            <Ionicons name={favorites1.includes(index) ? "heart" : "heart-outline"} size={28} color="#3f51b5" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleFavorite(index, favorites2, setFavorites2, '@favorites2')} style={styles.headerIconifaco}>
            <Ionicons name={favorites2.includes(index) ? "heart" : "heart-outline"} size={28} color="#3f51b5" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleFavorite(index, favorites3, setFavorites3, '@favorites3')} style={styles.headerIconifaco}>
            <Ionicons name={favorites3.includes(index) ? "heart" : "heart-outline"} size={28} color="#3f51b5" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={() => removeFromFavorites(index)} style={styles.headerIconifaco}>
          <View style={styles.iconTextContainer}>
            <Ionicons name="remove-circle-outline" size={18} color='grey' />
            <Text style={styles.elimkanrfavo}>{currentLabels.removeFromFavorites}</Text>
          </View>
        </TouchableOpacity>
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
    if (screenWidth > 380) {  // Solo muestra el componente si el ancho de la pantalla es mayor a 600
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


{history.length > 0 && (
  <View style={styles.favoritesContainer}>
    <TouchableOpacity
      onPress={() => setFavoritesModalVisible1(true)}
      style={styles.headerIconiav}
    >
      <Animated.View style={[styles.iconContainer, { transform: [{ translateX: slideAnim }] }]}>
        <Ionicons name="heart" size={32} color="#3f51b5" />
        {favorites1.length > 0 && <FavoriteCountBadge count={favorites1.length} />}
      </Animated.View>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => setFavoritesModalVisible2(true)}
      style={styles.headerIconiav}
    >
      <Animated.View style={[styles.iconContainer, { transform: [{ translateX: slideAnim }] }]}>
        <Ionicons name="heart" size={32} color="#3f51b5" />
        {favorites2.length > 0 && <FavoriteCountBadge count={favorites2.length} />}
      </Animated.View>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => setFavoritesModalVisible3(true)}
      style={styles.headerIconiav}
    >
      <Animated.View style={[styles.iconContainer, { transform: [{ translateX: slideAnim }] }]}>
        <Ionicons name="heart" size={32} color="#3f51b5" />
        {favorites3.length > 0 && <FavoriteCountBadge count={favorites3.length} />}
      </Animated.View>
    </TouchableOpacity>
  </View>
)}

 <Modal
      visible={favoritesModalVisible1}
      animationType="slide"
      onRequestClose={() => setFavoritesModalVisible1(false)}
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Favorites 1</Text>
          <FlatList
            data={favorites1.map(index => history[index])}
            renderItem={renderHistoryItem}
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableOpacity onPress={() => setFavoritesModalVisible1(false)} style={styles.modalButtoncloses}>
            <Ionicons name="close" size={28} color={theme.text} />
          </TouchableOpacity>
        </View>
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
          <Text style={styles.modalTitle}>Favorites 2</Text>
          <FlatList
            data={favorites2.map(index => history[index])}
            renderItem={renderHistoryItem}
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableOpacity onPress={() => setFavoritesModalVisible2(false)} style={styles.modalButtoncloses}>
            <Ionicons name="close" size={28} color={theme.text} />
          </TouchableOpacity>
        </View>
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
          <Text style={styles.modalTitle}>Favorites 3</Text>
          <FlatList
            data={favorites3.map(index => history[index])}
            renderItem={renderHistoryItem}
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableOpacity onPress={() => setFavoritesModalVisible3(false)} style={styles.modalButtoncloses}>
            <Ionicons name="close" size={28} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>


      <Modal
        visible={favoritesModalVisible}
        animationType="slide"
        onRequestClose={() => setFavoritesModalVisible(false)}
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Animated.Text style={[styles.modalTitle, { fontSize: headerFontSize, height: headerHeight }]}>
              {currentLabels.favoriteLists}
            </Animated.Text>
            <Animated.FlatList
              data={favorites.map(index => history[index])}
              renderItem={renderHistoryItem}
              keyExtractor={(item, index) => index.toString()}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
              )}
            />
            <TouchableOpacity onPress={() => setFavoritesModalVisible(false)} style={styles.modalButtoncloses}>
              <Ionicons name="close" size={28} color= {theme.text} />
            </TouchableOpacity>
          </View>
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
        renderItem={renderThumbnail}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.thumbnailList}
        contentContainerStyle={styles.thumbnailListContainer}
        ref={thumbnailListRef}

      />
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