"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Dimensions,
  Alert,
  Modal,
  Platform,
  Image,
  Animated,
  Easing,
  StyleSheet,
  Share,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useIsFocused } from "@react-navigation/native"
import { useTheme } from "../ThemeContext"
import getStyles from "./Styles/stylesHistorial"
import translationsHistorial from "./translations/translationsHistorial"
import * as RNLocalize from "react-native-localize"
import DateTimePicker from "@react-native-community/datetimepicker"
import { launchImageLibrary } from "react-native-image-picker"
import { request, PERMISSIONS, RESULTS } from "react-native-permissions"
import PushNotification from "react-native-push-notification"

const screenWidth = Dimensions.get("window").width
const { width, height } = Dimensions.get("window")

const HistoryScreen = ({ navigation }) => {
  const { theme } = useTheme()
  const styles = getStyles(theme)

  // Estados existentes...
  const [history, setHistory] = useState([])
  const [completedItems, setCompletedItems] = useState({})
  const [editingIndex, setEditingIndex] = useState(null)
  const [editingText, setEditingText] = useState("")
  const [modalVisible, setModalVisible] = useState(false)
  const [currentList, setCurrentList] = useState([])
  const [currentListName, setCurrentListName] = useState("")
  const [currentListIndex, setCurrentListIndex] = useState(null)
  const [reminderModalVisible, setReminderModalVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [showPicker, setShowPicker] = useState(true)
  const [reminders, setReminders] = useState({})
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [expandedCardIndex, setExpandedCardIndex] = useState(null)
  const [previousCounts, setPreviousCounts] = useState({
    favorites1: 0,
    favorites2: 0,
    favorites3: 0,
    favorites4: 0,
    favorites5: 0,
  })
  const isFocused = useIsFocused()
  const flatListRef = useRef(null)
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  const currentLabels = translationsHistorial[deviceLanguage] || translationsHistorial["en"]
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedListIndex, setSelectedListIndex] = useState(0)
  const thumbnailListRef = useRef(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [historyModalVisible, setHistoryModalVisible] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [favoritesModalVisible, setFavoritesModalVisible] = useState(false)
  const scrollY = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(0)).current
  const [favorites1, setFavorites1] = useState([])
  const [favorites2, setFavorites2] = useState([])
  const [favorites3, setFavorites3] = useState([])
  const [favoritesModalVisible1, setFavoritesModalVisible1] = useState(false)
  const [favoritesModalVisible2, setFavoritesModalVisible2] = useState(false)
  const [favoritesModalVisible3, setFavoritesModalVisible3] = useState(false)
  const [favorites4, setFavorites4] = useState([])
  const [favorites5, setFavorites5] = useState([])
  const [favoritesModalVisible4, setFavoritesModalVisible4] = useState(false)
  const [favoritesModalVisible5, setFavoritesModalVisible5] = useState(false)
  const [showUploadIcon, setShowUploadIcon] = useState(false)
  const [favoriteTitles, setFavoriteTitles] = useState({
    food: currentLabels.food,
    stationery: currentLabels.stationery,
    pharmacy: currentLabels.pharmacy,
    hardware: currentLabels.hardware,
    gifts: currentLabels.gifts,
  })
  const [isEditingFavoriteTitle, setIsEditingFavoriteTitle] = useState(false)
  const [newFavoriteTitle, setNewFavoriteTitle] = useState("")
  const [currentFavoriteCategory, setCurrentFavoriteCategory] = useState("")
  const [predefinedImagesModalVisible, setPredefinedImagesModalVisible] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [favoModalVisible, setFavoModalVisible] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [activeFavoriteCategory, setActiveFavoriteCategory] = useState(null)

  // Configurar notificaciones push
  useEffect(() => {
    PushNotification.configure({
      onRegister: (token) => {
        console.log("TOKEN:", token)
      },
      onNotification: (notification) => {
        console.log("NOTIFICATION:", notification)
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    })

    PushNotification.createChannel(
      {
        channelId: "shopping-reminders",
        channelName: "Shopping Reminders",
        channelDescription: "Notifications for shopping list reminders",
        soundName: "default",
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`),
    )
  }, [])

  // Animaciones para las categorías
  const categoryAnimations = useRef({
    food: new Animated.Value(1),
    stationery: new Animated.Value(1),
    pharmacy: new Animated.Value(1),
    hardware: new Animated.Value(1),
    gifts: new Animated.Value(1),
  }).current

  const handleAddFavorite = (index, favorites, setFavorites, storageKey) => {
    toggleFavorite(index, favorites, setFavorites, storageKey)
    setFavoModalVisible(false)
  }

  const imageHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [200, 50],
    extrapolate: "clamp",
  })

  const imageWidth = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [width, 50],
    extrapolate: "clamp",
  })

  const titleFontSize = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [24, 16],
    extrapolate: "clamp",
  })

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "..."
    }
    return text
  }

  // Función para verificar si un item está en favoritos
  const isItemInFavorites = (index) => {
    return (
      favorites1.includes(index) ||
      favorites2.includes(index) ||
      favorites3.includes(index) ||
      favorites4.includes(index) ||
      favorites5.includes(index)
    )
  }

  // Función para obtener la categoría de favoritos de un item
  const getFavoriteCategory = (index) => {
    if (favorites1.includes(index)) return "food"
    if (favorites2.includes(index)) return "stationery"
    if (favorites3.includes(index)) return "pharmacy"
    if (favorites4.includes(index)) return "hardware"
    if (favorites5.includes(index)) return "gifts"
    return null
  }

  // Función para remover de favoritos
  const removeFromFavorites = (index) => {
    const category = getFavoriteCategory(index)
    if (!category) return

    switch (category) {
      case "food":
        toggleFavorite(index, favorites1, setFavorites1, "@favorites1")
        break
      case "stationery":
        toggleFavorite(index, favorites2, setFavorites2, "@favorites2")
        break
      case "pharmacy":
        toggleFavorite(index, favorites3, setFavorites3, "@favorites3")
        break
      case "hardware":
        toggleFavorite(index, favorites4, setFavorites4, "@favorites4")
        break
      case "gifts":
        toggleFavorite(index, favorites5, setFavorites5, "@favorites5")
        break
    }
  }

  // Animación para categorías
  const animateCategory = (category) => {
    Animated.sequence([
      Animated.timing(categoryAnimations[category], {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(categoryAnimations[category], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const renderEmptyComponent = () => (
    <View style={modernStyles.emptyContainer}>
      <View style={modernStyles.emptyIconContainer}>
        <Ionicons name="heart-outline" size={64} color="#e2e8f0" />
      </View>
      <Text style={modernStyles.emptyText}>{currentLabels.noFavorites}</Text>
    </View>
  )

  const [favoriteImages, setFavoriteImages] = useState({
    food: require("../assets/images/favoritos/food2.png"),
    stationery: require("../assets/images/favoritos/papeleria2.png"),
    pharmacy: require("../assets/images/favoritos/farmacia2.png"),
    hardware: require("../assets/images/favoritos/tornillo1.png"),
    gifts: require("../assets/images/favoritos/compras1.png"),
  })

  const [selectedImage, setSelectedImage] = useState({
    food: require("../assets/images/favoritos/food2.png"),
    stationery: require("../assets/images/favoritos/papeleria2.png"),
    pharmacy: require("../assets/images/favoritos/farmacia2.png"),
    hardware: require("../assets/images/favoritos/tornillo1.png"),
    gifts: require("../assets/images/favoritos/compras1.png"),
  })

  const [predefinedImages, setPredefinedImages] = useState({
    food: [require("../assets/images/favoritos/food1.png"), require("../assets/images/favoritos/food2.png")],
    stationery: [
      require("../assets/images/favoritos/papeleria.png"),
      require("../assets/images/favoritos/papeleria2.png"),
    ],
    pharmacy: [
      require("../assets/images/favoritos/fammacia1.png"),
      require("../assets/images/favoritos/farmacia2.png"),
    ],
    hardware: [
      require("../assets/images/favoritos/tornillo1.png"),
      require("../assets/images/favoritos/tornillo2.png"),
    ],
    gifts: [require("../assets/images/favoritos/compras1.png"), require("../assets/images/favoritos/compras2.png")],
  })

  // Funciones de notificaciones push corregidas
  const scheduleNotification = (listName, date, listIndex) => {
    const notificationId = `reminder_${listIndex}_${Date.now()}`

    PushNotification.localNotificationSchedule({
      id: notificationId,
      channelId: "shopping-reminders",
      title: "🛒 List Reminder",
      message: `It's time to go shopping: ${listName}`,
      date: new Date(date),
      allowWhileIdle: true,
      repeatType: "time",
      actions: ["View List", "Postpone"],
      userInfo: { listIndex, listName },
    })

    const newReminders = { ...reminders, [listIndex]: { date, notificationId } }
    setReminders(newReminders)
    saveReminders(newReminders)
    setSuccessModalVisible(true)
  }

  const cancelNotification = (listIndex) => {
    if (reminders[listIndex]) {
      PushNotification.cancelLocalNotifications({ id: reminders[listIndex].notificationId })
      const newReminders = { ...reminders }
      delete newReminders[listIndex]
      setReminders(newReminders)
      saveReminders(newReminders)
    }
  }

  // Todas las funciones existentes...
  const openPredefinedImagesModal = (category) => {
    setSelectedCategory(category)
    setPredefinedImagesModalVisible(true)
  }

  const selectPredefinedImage = (image) => {
    const newImages = { ...favoriteImages, [selectedCategory]: image }
    setFavoriteImages(newImages)
    setSelectedImage({ ...selectedImage, [selectedCategory]: image })
    AsyncStorage.setItem("@favorite_images", JSON.stringify(newImages))
    setPredefinedImagesModalVisible(false)
  }

  const requestPermission = async () => {
    if (Platform.OS === "ios") {
      const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY)
      return result === RESULTS.GRANTED
    } else {
      const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
      return result === RESULTS.GRANTED
    }
  }

  const selectImage = async (category) => {
    const hasPermission = await requestPermission()
    if (!hasPermission) {
      Alert.alert("Permission required", "Permission is required to access your photo library.")
      return
    }

    const options = { mediaType: "photo" }
    launchImageLibrary(options, (response) => {
      if (response.assets && response.assets.length > 0) {
        const source = { uri: response.assets[0].uri }
        const newImages = { ...favoriteImages, [category]: source }
        setFavoriteImages(newImages)
        setSelectedImage({ ...selectedImage, [category]: source })
        AsyncStorage.setItem("@favorite_images", JSON.stringify(newImages))

        const updatedPredefinedImages = { ...predefinedImages }
        updatedPredefinedImages[category] = [...updatedPredefinedImages[category], source]
        setPredefinedImages(updatedPredefinedImages)
        AsyncStorage.setItem("@predefined_images", JSON.stringify(updatedPredefinedImages))

        setTimeout(() => {
          flatListRef.current.scrollToEnd({ animated: true })
        }, 100)
      }
    })
  }

  const loadFavoriteImages = async () => {
    try {
      const savedImages = await AsyncStorage.getItem("@favorite_images")
      if (savedImages) {
        setFavoriteImages(JSON.parse(savedImages))
      }
    } catch (e) {
      console.error("Error loading favorite images: ", e)
    }
  }

  const loadPredefinedImages = async () => {
    try {
      const savedPredefinedImages = await AsyncStorage.getItem("@predefined_images")
      if (savedPredefinedImages) {
        setPredefinedImages(JSON.parse(savedPredefinedImages))
      }
    } catch (e) {
      console.error("Error loading predefined images: ", e)
    }
  }

  const saveFavoriteTitle = async () => {
    const newTitles = { ...favoriteTitles, [currentFavoriteCategory]: newFavoriteTitle }
    setFavoriteTitles(newTitles)
    await AsyncStorage.setItem("@favorite_titles", JSON.stringify(newTitles))
    setIsEditingFavoriteTitle(false)
  }

  useEffect(() => {
    const loadFavoriteTitles = async () => {
      try {
        const savedTitles = await AsyncStorage.getItem("@favorite_titles")
        if (savedTitles) {
          setFavoriteTitles(JSON.parse(savedTitles))
        }
      } catch (e) {
        console.error("Error loading favorite titles: ", e)
      }
    }
    loadFavoriteTitles()
    loadFavoriteImages()
    loadPredefinedImages()
  }, [])

  const FavoriteCountBadge = ({ count }) => {
    if (count === 0) return null
    return (
      <View style={modernStyles.badgeContainer}>
        <Text style={modernStyles.badgeText}>{count}</Text>
      </View>
    )
  }

  // Resto de useEffects y funciones existentes...
  useEffect(() => {
    if (history.length > 0 && favorites.length > 0) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start()
    }
  }, [history, favorites])

  // Funciones de carga y guardado
  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem("@shopping_history")
      if (savedHistory !== null) {
        let parsedHistory = JSON.parse(savedHistory)

        parsedHistory = parsedHistory.map((item) => {
          if (!Array.isArray(item.list)) {
            let correctedList = []
            if (typeof item.list === "string") {
              correctedList = item.list
                .split("\n")
                .map((i) => i.trim())
                .filter((i) => i !== "")
            }
            return { ...item, list: correctedList }
          }
          return item
        })

        setHistory(parsedHistory)
      }
    } catch (e) {
      console.error("Error loading history:", e)
    }
  }

  const saveHistory = async (newHistory) => {
    try {
      await AsyncStorage.setItem("@shopping_history", JSON.stringify(newHistory.reverse()))
      setHistory(newHistory)
    } catch (e) {
      console.error("Error saving history: ", e)
    }
  }

  const loadCompletedItems = async () => {
    try {
      const savedCompletedItems = await AsyncStorage.getItem("@completed_items")
      if (savedCompletedItems !== null) {
        setCompletedItems(JSON.parse(savedCompletedItems))
      }
    } catch (e) {
      console.error("Error loading completed items: ", e)
    }
  }

  const saveCompletedItems = async (newCompletedItems) => {
    try {
      await AsyncStorage.setItem("@completed_items", JSON.stringify(newCompletedItems))
      setCompletedItems(newCompletedItems)
    } catch (e) {
      console.error("Error saving completed items: ", e)
    }
  }

  const loadReminders = async () => {
    try {
      const savedReminders = await AsyncStorage.getItem("@reminders")
      if (savedReminders !== null) {
        setReminders(JSON.parse(savedReminders))
      }
    } catch (e) {
      console.error("Error loading reminders: ", e)
    }
  }

  const saveReminders = async (newReminders) => {
    try {
      await AsyncStorage.setItem("@reminders", JSON.stringify(newReminders))
    } catch (e) {
      console.error("Error saving reminders: ", e)
    }
  }

  // Funciones de favoritos CORREGIDAS
  const toggleFavorite = (index, favorites, setFavorites, key) => {
    const newFavorites = [...favorites]
    if (newFavorites.includes(index)) {
      newFavorites.splice(newFavorites.indexOf(index), 1)
    } else {
      newFavorites.push(index)
    }
    setFavorites(newFavorites)
    saveFavorites(newFavorites, key)
  }

  const saveFavorites = async (newFavorites, key) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(newFavorites))
    } catch (e) {
      console.error("Error saving favorites: ", e)
    }
  }

  const loadFavorites = async (key, setFavorites) => {
    try {
      const savedFavorites = await AsyncStorage.getItem(key)
      if (savedFavorites !== null) {
        setFavorites(JSON.parse(savedFavorites))
      }
    } catch (e) {
      console.error("Error loading favorites: ", e)
    }
  }

  // Funciones de modal y edición
  const openModal = (index) => {
    setFavoritesModalVisible(false)
    setCurrentList(history[index].list)
    setCurrentListName(history[index].name)
    setCurrentListIndex(index)
    setModalVisible(true)
    setExpandedCardIndex(null)
  }

  const updateList = (index, newText) => {
    const newList = [...currentList]
    newList[index] = newText
    setCurrentList(newList)
  }

  const addItemToList = () => {
    setCurrentList([...currentList, ""])
  }

  const saveCurrentList = async () => {
    const newHistory = [...history]
    newHistory[currentListIndex] = {
      ...newHistory[currentListIndex],
      list: currentList,
      name: currentListName,
    }
    await saveHistory(newHistory)
    setModalVisible(false)
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: 0 })
    }
    setCurrentIndex(0)
  }

  // Funciones de elementos completados
  const toggleItemCompletion = (listIndex, itemIndex) => {
    const newCompletedItems = { ...completedItems }
    if (!newCompletedItems[listIndex]) {
      newCompletedItems[listIndex] = []
    }
    if (newCompletedItems[listIndex].includes(itemIndex)) {
      newCompletedItems[listIndex] = newCompletedItems[listIndex].filter((i) => i !== itemIndex)
    } else {
      newCompletedItems[listIndex].push(itemIndex)
    }
    saveCompletedItems(newCompletedItems)
  }

  // Funciones de compartir e imprimir
  const shareShoppingList = async (list) => {
    const listString = list.join("\n")
    try {
      await Share.share({
        message: listString,
        title: "Shopping List",
      })
    } catch (error) {
      console.error("Error sharing shopping list: ", error)
      Alert.alert("Error", "Could not share the shopping list.")
    }
  }



  // Funciones de recordatorios CORREGIDAS
  const openReminderModal = (index) => {
    setCurrentListIndex(index)
    setCurrentListName(history[index].name)
    checkNotificationPermissions()
    setExpandedCardIndex(null)
    setFavoritesModalVisible(false)
  }

  const checkNotificationPermissions = () => {
    if (Platform.OS === "android") {
      PushNotification.requestPermissions()
    }
    setReminderModalVisible(true)
  }

  const isReminderPassed = (date) => {
    return new Date(date) < new Date()
  }

  // Funciones de eliminación
  const removeListFromHistory = async (index) => {
    const newHistory = [...history]
    newHistory.splice(index, 1)

    const newFavorites1 = favorites1.filter((favIndex) => favIndex !== index)
    const newFavorites2 = favorites2.filter((favIndex) => favIndex !== index)
    const newFavorites3 = favorites3.filter((favIndex) => favIndex !== index)
    const newFavorites4 = favorites4.filter((favIndex) => favIndex !== index)
    const newFavorites5 = favorites5.filter((favIndex) => favIndex !== index)

    const adjustFavorites = (favorites) => favorites.map((favIndex) => (favIndex > index ? favIndex - 1 : favIndex))
    const adjustedFavorites1 = adjustFavorites(newFavorites1)
    const adjustedFavorites2 = adjustFavorites(newFavorites2)
    const adjustedFavorites3 = adjustFavorites(newFavorites3)
    const adjustedFavorites4 = adjustFavorites(newFavorites4)
    const adjustedFavorites5 = adjustFavorites(newFavorites5)

    setHistory(newHistory)
    setFavorites1(adjustedFavorites1)
    setFavorites2(adjustedFavorites2)
    setFavorites3(adjustedFavorites3)
    setFavorites4(adjustedFavorites4)
    setFavorites5(adjustedFavorites5)

    setFavoritesModalVisible(false)

    try {
      await AsyncStorage.setItem("@shopping_history", JSON.stringify(newHistory))
      await AsyncStorage.setItem("@favorites1", JSON.stringify(adjustedFavorites1))
      await AsyncStorage.setItem("@favorites2", JSON.stringify(adjustedFavorites2))
      await AsyncStorage.setItem("@favorites3", JSON.stringify(adjustedFavorites3))
      await AsyncStorage.setItem("@favorites4", JSON.stringify(adjustedFavorites4))
      await AsyncStorage.setItem("@favorites5", JSON.stringify(adjustedFavorites5))
    } catch (e) {
      console.error("Error removing from history: ", e)
    }
  }

  const confirmRemoveListFromHistory = (index) => {
    setFavoritesModalVisible(false)
    Alert.alert(
      currentLabels.confirmDelete,
      currentLabels.areYouSure,
      [
        {
          text: currentLabels.cancel,
          style: "cancel",
        },
        {
          text: currentLabels.delete,
          onPress: () => removeListFromHistory(index),
        },
      ],
      { cancelable: false },
    )
  }

  const handleExpandAndToggleFavorite = (index) => {
    const allFavorites = [favorites1, favorites2, favorites3, favorites4, favorites5]
    const allSetFavorites = [setFavorites1, setFavorites2, setFavorites3, setFavorites4, setFavorites5]
    const allKeys = ["@favorites1", "@favorites2", "@favorites3", "@favorites4", "@favorites5"]

    let currentFavoriteIndex = -1
    allFavorites.forEach((favorites, i) => {
      if (favorites.includes(index)) {
        currentFavoriteIndex = i
      }
    })

    if (currentFavoriteIndex !== -1) {
      const newFavorites = [...allFavorites[currentFavoriteIndex]]
      newFavorites.splice(newFavorites.indexOf(index), 1)
      allSetFavorites[currentFavoriteIndex](newFavorites)
      saveFavorites(newFavorites, allKeys[currentFavoriteIndex])
    } else {
      const firstAvailableIndex = allFavorites.findIndex((favorites) => !favorites.includes(index))
      if (firstAvailableIndex !== -1) {
        const newFavorites = [index]
        allSetFavorites[firstAvailableIndex](newFavorites)
        saveFavorites(newFavorites, allKeys[firstAvailableIndex])
      }
    }

    setExpandedCardIndex(index)
    setFavoritesModalVisible(false)
  }

  // Función para abrir el modal de favoritos con el índice correcto
  const openFavoriteModal = (index) => {
    setSelectedIndex(index)
    setFavoModalVisible(true)
  }

  // Función para mostrar modal de favoritos específico
  const showFavoritesModal = (category) => {
    setActiveFavoriteCategory(category)
    animateCategory(category)

    switch (category) {
      case "food":
        setFavoritesModalVisible1(true)
        break
      case "stationery":
        setFavoritesModalVisible2(true)
        break
      case "pharmacy":
        setFavoritesModalVisible3(true)
        break
      case "hardware":
        setFavoritesModalVisible4(true)
        break
      case "gifts":
        setFavoritesModalVisible5(true)
        break
    }
  }

  // Función para renderizar items de favoritos
  const renderFavoriteItem = ({ item, index: favIndex }, categoryFavorites, categoryKey) => {
    const historyIndex = item
    const historyItem = history[historyIndex]

    if (!historyItem) return null

    return (
      <View style={modernStyles.favoriteItemCard}>
        <View style={modernStyles.favoriteItemHeader}>
          <Text style={modernStyles.favoriteItemTitle}>{historyItem.name}</Text>
          <TouchableOpacity
            onPress={() => {
              const newFavorites = categoryFavorites.filter((_, i) => i !== favIndex)
              switch (categoryKey) {
                case "@favorites1":
                  setFavorites1(newFavorites)
                  break
                case "@favorites2":
                  setFavorites2(newFavorites)
                  break
                case "@favorites3":
                  setFavorites3(newFavorites)
                  break
                case "@favorites4":
                  setFavorites4(newFavorites)
                  break
                case "@favorites5":
                  setFavorites5(newFavorites)
                  break
              }
              saveFavorites(newFavorites, categoryKey)
            }}
            style={modernStyles.removeFavoriteButton}
          >
            <Ionicons name="heart-dislike" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>

        <ScrollView style={modernStyles.favoriteItemList} showsVerticalScrollIndicator={false}>
          {historyItem.list.slice(0, 3).map((listItem, listIndex) => (
            <Text key={listIndex} style={modernStyles.favoriteItemText}>
              • {listItem}
            </Text>
          ))}
          {historyItem.list.length > 3 && (
            <Text style={modernStyles.favoriteItemMore}>+{historyItem.list.length - 3} more...</Text>
          )}
        </ScrollView>

        <View style={modernStyles.favoriteItemActions}>


          <TouchableOpacity
            onPress={() => shareShoppingList(historyItem.list)}
            style={modernStyles.favoriteActionButton}
          >
            <Ionicons name="share-outline" size={18} color="#8b5cf6" />
            <Text style={modernStyles.favoriteActionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  // Agregar los useEffects necesarios
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadHistory()
      loadCompletedItems()
      loadReminders()
      loadFavorites("@favorites1", setFavorites1)
      loadFavorites("@favorites2", setFavorites2)
      loadFavorites("@favorites3", setFavorites3)
      loadFavorites("@favorites4", setFavorites4)
      loadFavorites("@favorites5", setFavorites5)
    })

    return unsubscribe
  }, [navigation])

  useEffect(() => {
    if (isFocused) {
      loadHistory()
      loadCompletedItems()
      loadReminders()
    }
  }, [isFocused])

  useEffect(() => {
    loadFavorites("@favorites1", setFavorites1)
    loadFavorites("@favorites2", setFavorites2)
    loadFavorites("@favorites3", setFavorites3)
    loadFavorites("@favorites4", setFavorites4)
    loadFavorites("@favorites5", setFavorites5)
  }, [])

  useEffect(() => {
    let timer
    if (successModalVisible) {
      timer = setTimeout(() => {
        setSuccessModalVisible(false)
      }, 2000)
    }
    return () => clearTimeout(timer)
  }, [successModalVisible])

  const renderHistoryItem = ({ item, index }) => (
    <View style={modernStyles.historyCard}>
      <View style={modernStyles.cardHeader}>
        {!favoritesModalVisible && editingIndex === index ? (
          <View style={modernStyles.editingContainer}>
            <TextInput
              style={modernStyles.editingInput}
              value={editingText}
              onChangeText={setEditingText}
              onSubmitEditing={() => {
                const newHistory = [...history]
                newHistory[index].name = editingText
                saveHistory(newHistory)
                setEditingIndex(null)
              }}
            />
            <TouchableOpacity
              onPress={() => {
                const newHistory = [...history]
                newHistory[index].name = editingText
                saveHistory(newHistory)
                setEditingIndex(null)
              }}
              style={modernStyles.confirmButton}
            >
              <Ionicons name="checkmark" size={24} color="#10b981" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={modernStyles.titleContainer}>
            <Text style={modernStyles.cardTitle}>{item.name}</Text>
            <View style={modernStyles.titleActions}>
              {isItemInFavorites(index) && (
                <TouchableOpacity onPress={() => removeFromFavorites(index)} style={modernStyles.favoriteIndicator}>
                  <Ionicons name="heart" size={20} color="#ef4444" />
                </TouchableOpacity>
              )}
              {!favoritesModalVisible1 &&
                !favoritesModalVisible2 &&
                !favoritesModalVisible3 &&
                !favoritesModalVisible4 &&
                !favoritesModalVisible5 &&
                screenWidth > 380 && (
                  <TouchableOpacity
                    onPress={() => {
                      setEditingIndex(index)
                      setEditingText(item.name)
                    }}
                    style={modernStyles.editButton}
                  >
                    <Ionicons name="pencil" size={18} color="#3b82f6" />
                  </TouchableOpacity>
                )}
            </View>
          </View>
        )}
      </View>

      {!favoritesModalVisible1 &&
        !favoritesModalVisible2 &&
        !favoritesModalVisible3 &&
        !favoritesModalVisible4 &&
        !favoritesModalVisible5 && (
          <View style={modernStyles.actionButtonsRow}>
            <TouchableOpacity
              onPress={() => confirmRemoveListFromHistory(index)}
              style={[modernStyles.actionButton, modernStyles.deleteButton]}
            >
              <Ionicons name="trash-outline" size={18} color="#ef4444" />
            </TouchableOpacity>

                          {!isItemInFavorites(index) && (
            <TouchableOpacity
             onPress={() => openFavoriteModal(index)}
              style={[modernStyles.actionButton, modernStyles.printButton]}
            >
              <Ionicons name="heart-outline" size={18} color="#e91e63" />
            </TouchableOpacity>
  )}


            <TouchableOpacity
              onPress={() => shareShoppingList(item.list)}
              style={[modernStyles.actionButton, modernStyles.shareButton]}
            >
              <Ionicons name="share-outline" size={18} color="#8b5cf6" />
            </TouchableOpacity>


            <TouchableOpacity
              onPress={() => openModal(index)}
              style={[modernStyles.actionButton, modernStyles.addButton]}
            >
              <Ionicons name="add-sharp" size={18} color="#3b82f6" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openReminderModal(index)}
              style={[modernStyles.actionButton, modernStyles.reminderButton]}
            >
              <Ionicons name="notifications-outline" size={19} color="white" />
            </TouchableOpacity>
          
          </View>
        )}

      {reminders[index] && !isReminderPassed(reminders[index].date || reminders[index]) && (
        <View style={modernStyles.reminderContainer}>
          <View style={modernStyles.reminderIcon}>
            <Ionicons name="notifications" size={16} color="#f59e0b" />
          </View>
          <Text style={modernStyles.reminderText}>
            {new Date(reminders[index].date || reminders[index]).toLocaleDateString()} {currentLabels.time}:{" "}
            {new Date(reminders[index].date || reminders[index]).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <TouchableOpacity onPress={() => cancelNotification(index)} style={modernStyles.cancelReminderButton}>
            <Ionicons name="close" size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={modernStyles.listContent}>
        {item.list.map((listItem, listItemIndex) => (
          <TouchableOpacity key={listItemIndex} onPress={() => toggleItemCompletion(index, listItemIndex)}>
            <View style={modernStyles.listItemContainer}>
              <View
                style={[
                  modernStyles.listItemBullet,
                  completedItems[index]?.includes(listItemIndex) && modernStyles.completedBullet,
                ]}
              />
              <Text
                style={[
                  modernStyles.listItemText,
                  completedItems[index]?.includes(listItemIndex) && modernStyles.completedItemText,
                ]}
              >
                {listItem}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>


    </View>
  )

  return (
    <SafeAreaView style={modernStyles.container}>
      {/* Header de favoritos modernizado */}
      <View style={modernStyles.favoritesHeader}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={modernStyles.categoriesScrollContainer}
        >
          {[
            { key: "food", favorites: favorites1, count: favorites1.length },
            { key: "stationery", favorites: favorites2, count: favorites2.length },
            { key: "pharmacy", favorites: favorites3, count: favorites3.length },
            { key: "hardware", favorites: favorites4, count: favorites4.length },
            { key: "gifts", favorites: favorites5, count: favorites5.length },
          ].map((category, index) => (
            <TouchableOpacity
              key={category.key}
              onPress={() => showFavoritesModal(category.key)}
              style={modernStyles.categoryChip}
            >
              <Animated.View
                style={[
                  modernStyles.categoryChipContent,
                  { transform: [{ scale: categoryAnimations[category.key] }] },
                  category.count > 0 && modernStyles.categoryChipActive,
                ]}
              >
                <Image source={favoriteImages[category.key]} style={modernStyles.categoryChipImage} />
                <Text
                  style={[modernStyles.categoryChipText, category.count > 0 && modernStyles.categoryChipTextActive]}
                >
                  {truncateText(favoriteTitles[category.key], 8)}
                </Text>
                <FavoriteCountBadge count={category.count} />
              </Animated.View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {history.length === 0 ? (
        <View style={modernStyles.emptyStateContainer}>
          <View style={modernStyles.emptyStateContent}>
            <View style={modernStyles.emptyIconWrapper}>
              <Image source={require("../assets/images/disminuyendo.png")} style={modernStyles.emptyStateImage} />
            </View>
            <Text style={modernStyles.emptyStateTitle}>{currentLabels.noHistory}</Text>
            <TouchableOpacity style={modernStyles.createListButton} onPress={() => navigation.navigate("HomeScreen")}>
              <Ionicons name="mic" size={24} color="white" />
              <Text style={modernStyles.createListButtonText}>{currentLabels.createShoppingList}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={modernStyles.historyList}
          contentContainerStyle={modernStyles.historyListContainer}
          ref={flatListRef}
          getItemLayout={(data, index) => ({ length: width, offset: width * index, index })}
          onScroll={(event) => {
            const offsetX = event.nativeEvent.contentOffset.x
            const index = Math.round(offsetX / width)
            setCurrentIndex(index)
          }}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(event) => {
            const offsetX = event.nativeEvent.contentOffset.x
            const index = Math.round(offsetX / width)
            setSelectedListIndex(index)
          }}
          onScrollToIndexFailed={(info) => {
            flatListRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: true })
            setTimeout(() => {
              flatListRef.current?.scrollToIndex({ index: info.index, animated: true })
            }, 100)
          }}
        />
      )}

      {/* Modales de favoritos mejorados */}
      {[
        {
          visible: favoritesModalVisible1,
          setVisible: setFavoritesModalVisible1,
          favorites: favorites1,
          category: "food",
          key: "@favorites1",
        },
        {
          visible: favoritesModalVisible2,
          setVisible: setFavoritesModalVisible2,
          favorites: favorites2,
          category: "stationery",
          key: "@favorites2",
        },
        {
          visible: favoritesModalVisible3,
          setVisible: setFavoritesModalVisible3,
          favorites: favorites3,
          category: "pharmacy",
          key: "@favorites3",
        },
        {
          visible: favoritesModalVisible4,
          setVisible: setFavoritesModalVisible4,
          favorites: favorites4,
          category: "hardware",
          key: "@favorites4",
        },
        {
          visible: favoritesModalVisible5,
          setVisible: setFavoritesModalVisible5,
          favorites: favorites5,
          category: "gifts",
          key: "@favorites5",
        },
      ].map((modal, index) => (
        <Modal
          key={index}
          visible={modal.visible}
          animationType="slide"
          onRequestClose={() => modal.setVisible(false)}
          transparent={true}
        >
          <View style={modernStyles.modalOverlay}>
            <View style={modernStyles.favoritesModalContainer}>
              <View style={modernStyles.favoritesModalHeader}>
                <View style={modernStyles.modalCategoryIcon}>
                  <Image source={favoriteImages[modal.category]} style={modernStyles.modalCategoryImage} />
                </View>
                <Text style={modernStyles.favoritesModalTitle}>{favoriteTitles[modal.category]}</Text>
                <TouchableOpacity onPress={() => modal.setVisible(false)} style={modernStyles.modalCloseButton}>
                  <Ionicons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>

              {modal.favorites.length === 0 ? (
                renderEmptyComponent()
              ) : (
                <FlatList
                  data={modal.favorites}
                  renderItem={(item) => renderFavoriteItem(item, modal.favorites, modal.key)}
                  keyExtractor={(item, index) => index.toString()}
                  style={modernStyles.favoritesList}
                  contentContainerStyle={modernStyles.favoritesListContent}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          </View>
        </Modal>
      ))}

      {/* Todos los modales existentes con estilos mejorados */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
        transparent={true}
      >
        <View style={modernStyles.modalOverlay}>
          <View style={modernStyles.modalContainer}>
            <View style={modernStyles.modalHeader}>
              <TextInput
                style={modernStyles.modalTitleInput}
                value={currentListName}
                onChangeText={setCurrentListName}
                placeholder="List name"
                placeholderTextColor="#9ca3af"
              />
              <TouchableOpacity
                onPress={() => {
                  saveCurrentList()
                  setModalVisible(false)
                }}
                style={modernStyles.saveButton}
              >
                <Ionicons name="checkmark-circle" size={32} color="#10b981" />
              </TouchableOpacity>
            </View>
            <ScrollView style={modernStyles.modalContent}>
              {currentList.map((item, index) => (
                <TextInput
                  key={index}
                  style={modernStyles.modalItemInput}
                  value={item}
                  onChangeText={(text) => updateList(index, text)}
                  placeholder="New List Item"
                  placeholderTextColor="#9ca3af"
                />
              ))}
              <TouchableOpacity style={modernStyles.addItemButton} onPress={addItemToList}>
                <Ionicons name="add-circle" size={32} color="#6b7280" />
                <Text style={modernStyles.addItemText}></Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de recordatorio mejorado */}
      <Modal
        visible={reminderModalVisible}
        animationType="slide"
        onRequestClose={() => setReminderModalVisible(false)}
        transparent={true}
      >
        <View style={modernStyles.modalOverlay}>
          <View style={modernStyles.reminderModalContainer}>
            <View style={modernStyles.reminderIconContainer}>
              <Ionicons name="notifications" size={48} color="#f59e0b" />
            </View>
            <Text style={modernStyles.reminderModalTitle}>{currentLabels.programNotification}</Text>
            <Text style={modernStyles.reminderModalText}>{currentLabels.selectDateTime}</Text>

            <View style={modernStyles.datePickerContainer}>
              {showPicker && (
                <DateTimePicker
                  value={selectedDate || new Date()}
                  mode="datetime"
                  display="default"
                  onChange={(event, selectedDate) => {
                    const currentDate = selectedDate || new Date()
                    setShowPicker(Platform.OS === "ios")
                    setSelectedDate(currentDate)
                  }}
                />
              )}
            </View>

            <View style={modernStyles.reminderButtonsContainer}>
              <TouchableOpacity
                style={[modernStyles.reminderButton, !selectedDate && modernStyles.disabledButton]}
                onPress={() => {
                  if (selectedDate) {
                    setReminderModalVisible(false)
                    scheduleNotification(currentListName, selectedDate, currentListIndex)
                  }
                }}
                disabled={!selectedDate}
              >
                <Text style={modernStyles.reminderButtonText}>{currentLabels.setNotification}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={modernStyles.cancelButton} onPress={() => setReminderModalVisible(false)}>
                <Text style={modernStyles.cancelButtonText}>{currentLabels.cancel}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de éxito mejorado */}
      <Modal
        visible={successModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={modernStyles.modalOverlay}>
          <View style={modernStyles.successModalContainer}>
            <View style={modernStyles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={64} color="#10b981" />
            </View>
            <Text style={modernStyles.successTitle}>{currentLabels.success}</Text>
            <Text style={modernStyles.successText}>{currentLabels.reminderSet}</Text>
          </View>
        </View>
      </Modal>

      {/* Modal de selección de favoritos CORREGIDO */}
      <Modal visible={favoModalVisible} transparent={true} animationType="fade">
        <View style={modernStyles.modalBackdrop}>
          <View style={modernStyles.favoriteSelector}>
            <View style={modernStyles.selectorHeader}>
     
              <TouchableOpacity onPress={() => setFavoModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>



            <View style={modernStyles.categoriesGrid}>
              <TouchableOpacity
                onPress={() => {
                  if (selectedIndex !== null) {
                    toggleFavorite(selectedIndex, favorites1, setFavorites1, "@favorites1")
                    setFavoModalVisible(false)
                  }
                }}
                style={[
                  modernStyles.categoryCard,
                  selectedIndex !== null && favorites1.includes(selectedIndex) && modernStyles.categoryCardSelected,
                ]}
              >
                <Image source={favoriteImages.food} style={modernStyles.categoryCardImage} />
                <Text
                  style={[
                    modernStyles.categoryCardText,
                    selectedIndex !== null &&
                      favorites1.includes(selectedIndex) &&
                      modernStyles.categoryCardTextSelected,
                  ]}
                >
                  {truncateText(favoriteTitles.food, 12)}
                </Text>
                {selectedIndex !== null && favorites1.includes(selectedIndex) && (
                  <View style={modernStyles.selectedBadge}>
                    <Ionicons name="checkmark" size={16} color="white" />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (selectedIndex !== null) {
                    toggleFavorite(selectedIndex, favorites2, setFavorites2, "@favorites2")
                    setFavoModalVisible(false)
                  }
                }}
                style={[
                  modernStyles.categoryCard,
                  selectedIndex !== null && favorites2.includes(selectedIndex) && modernStyles.categoryCardSelected,
                ]}
              >
                <Image source={favoriteImages.stationery} style={modernStyles.categoryCardImage} />
                <Text
                  style={[
                    modernStyles.categoryCardText,
                    selectedIndex !== null &&
                      favorites2.includes(selectedIndex) &&
                      modernStyles.categoryCardTextSelected,
                  ]}
                >
                  {truncateText(favoriteTitles.stationery, 12)}
                </Text>
                {selectedIndex !== null && favorites2.includes(selectedIndex) && (
                  <View style={modernStyles.selectedBadge}>
                    <Ionicons name="checkmark" size={16} color="white" />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (selectedIndex !== null) {
                    toggleFavorite(selectedIndex, favorites3, setFavorites3, "@favorites3")
                    setFavoModalVisible(false)
                  }
                }}
                style={[
                  modernStyles.categoryCard,
                  selectedIndex !== null && favorites3.includes(selectedIndex) && modernStyles.categoryCardSelected,
                ]}
              >
                <Image source={favoriteImages.pharmacy} style={modernStyles.categoryCardImage} />
                <Text
                  style={[
                    modernStyles.categoryCardText,
                    selectedIndex !== null &&
                      favorites3.includes(selectedIndex) &&
                      modernStyles.categoryCardTextSelected,
                  ]}
                >
                  {truncateText(favoriteTitles.pharmacy, 12)}
                </Text>
                {selectedIndex !== null && favorites3.includes(selectedIndex) && (
                  <View style={modernStyles.selectedBadge}>
                    <Ionicons name="checkmark" size={16} color="white" />
                  </View>
                )}
              </TouchableOpacity>

              {screenWidth > 380 && (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      if (selectedIndex !== null) {
                        toggleFavorite(selectedIndex, favorites4, setFavorites4, "@favorites4")
                        setFavoModalVisible(false)
                      }
                    }}
                    style={[
                      modernStyles.categoryCard,
                      selectedIndex !== null && favorites4.includes(selectedIndex) && modernStyles.categoryCardSelected,
                    ]}
                  >
                    <Image source={favoriteImages.hardware} style={modernStyles.categoryCardImage} />
                    <Text
                      style={[
                        modernStyles.categoryCardText,
                        selectedIndex !== null &&
                          favorites4.includes(selectedIndex) &&
                          modernStyles.categoryCardTextSelected,
                      ]}
                    >
                      {truncateText(favoriteTitles.hardware, 12)}
                    </Text>
                    {selectedIndex !== null && favorites4.includes(selectedIndex) && (
                      <View style={modernStyles.selectedBadge}>
                        <Ionicons name="checkmark" size={16} color="white" />
                      </View>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      if (selectedIndex !== null) {
                        toggleFavorite(selectedIndex, favorites5, setFavorites5, "@favorites5")
                        setFavoModalVisible(false)
                      }
                    }}
                    style={[
                      modernStyles.categoryCard,
                      selectedIndex !== null && favorites5.includes(selectedIndex) && modernStyles.categoryCardSelected,
                    ]}
                  >
                    <Image source={favoriteImages.gifts} style={modernStyles.categoryCardImage} />
                    <Text
                      style={[
                        modernStyles.categoryCardText,
                        selectedIndex !== null &&
                          favorites5.includes(selectedIndex) &&
                          modernStyles.categoryCardTextSelected,
                      ]}
                    >
                      {truncateText(favoriteTitles.gifts, 12)}
                    </Text>
                    {selectedIndex !== null && favorites5.includes(selectedIndex) && (
                      <View style={modernStyles.selectedBadge}>
                        <Ionicons name="checkmark" size={16} color="white" />
                      </View>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

// Estilos modernos CORREGIDOS
const modernStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e7ead2",
  },

  // Header de favoritos modernizado
  favoritesHeader: {
    backgroundColor: "#e7ead2",
    paddingVertical: 16,

    elevation: 2,
  },

  categoriesScrollContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },

  categoryChip: {
    marginRight: 4,
  },

  categoryChipContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
    marginTop:10,
  },

  categoryChipActive: {
    backgroundColor: "#eff6ff",
    borderColor: "#3b82f6",
    shadowColor: "#3b82f6",
    shadowOpacity: 0.15,
  },

  categoryChipImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },

  categoryChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },

  categoryChipTextActive: {
    color: "#3b82f6",
  },

  badgeContainer: {
    position: "absolute",
    top: -1,
    right: -6,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
  },

  badgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },

  // Tarjetas de historial
  historyCard: {
    width: width - 32,
    backgroundColor: "white",
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: "#e7ead2",
  },

  cardHeader: {
    marginBottom: 16,
  },

  editingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  editingInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    borderBottomWidth: 2,
    borderBottomColor: "#3b82f6",
    paddingVertical: 8,
  },

  confirmButton: {
    backgroundColor: "#ecfdf5",
    padding: 8,
    borderRadius: 8,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    flex: 1,
  },

  titleActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  favoriteIndicator: {
    backgroundColor: "#fef2f2",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fecaca",
  },

  editButton: {
    backgroundColor: "#eff6ff",
    padding: 8,
    borderRadius: 8,
  },

  // Botones de acción
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 8,
  },

  actionButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  deleteButton: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
  },

  shareButton: {
    backgroundColor: "#faf5ff",
    borderWidth: 1,
    borderColor: "#e9d5ff",
  },

  printButton: {
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },

  addButton: {
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },

  reminderButton: {
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fed7aa",
  },

  expandButton: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  // Recordatorio
  reminderContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fffbeb",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },

  reminderIcon: {
    marginRight: 8,
  },

  reminderText: {
    flex: 1,
    fontSize: 14,
    color: "#92400e",
    fontWeight: "500",
  },

  cancelReminderButton: {
    backgroundColor: "#fef2f2",
    padding: 6,
    borderRadius: 6,
  },

  // Contenido de la lista
  listContent: {
    maxHeight: 200,
    marginBottom: 16,
  },

  listItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },

  listItemBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#93b0b0",
    marginRight: 12,
  },

  completedBullet: {
    backgroundColor: "#10b981",
  },

  listItemText: {
    fontSize: 16,
    color: "#374151",
    flex: 1,
  },

  completedItemText: {
    textDecorationLine: "line-through",
    color: "#9ca3af",
  },

  // Botón de favorito
  favoriteButton: {
    alignSelf: "flex-end",
  },

  favoriteIconContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  addFavoriteIcon: {
    position: "absolute",
    top: -4,
    right: -4,
  },

  // Estado vacío
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },

  emptyStateContent: {
    alignItems: "center",
  },

  emptyIconWrapper: {
    width: 120,
    height: 120,
    backgroundColor: "#f1f5f9",
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  emptyStateImage: {
    width: 80,
    height: 80,
    tintColor: "#6b7280",
  },

  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 32,
  },

  createListButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93b0b0",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },

  createListButtonText: {
    marginLeft: 12,
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Lista de historial
  historyList: {
    flex: 1,
  },

  historyListContainer: {
    paddingVertical: 16,
  },

  // Modales de favoritos - COMPLETAMENTE REDISEÑADOS
  favoritesModalContainer: {
    backgroundColor: "white",
    borderRadius: 24,
    margin: 16,
    maxHeight: "85%",
    minHeight: height * 0.6,
    width: width - 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 16,
  },

  favoritesModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    minHeight: 80,
  },

  modalCategoryIcon: {
    width: 56,
    height: 56,
    backgroundColor: "#f8fafc",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  modalCategoryImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },

  favoritesModalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
    flex: 1,
  },

  modalCloseButton: {
    padding: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
  },

  favoritesList: {
    flex: 1,
    minHeight: height * 0.4,
  },

  favoritesListContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Estado vacío mejorado y más grande
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
    minHeight: height * 0.35,
  },

  emptyIconContainer: {
    width: 100,
    height: 100,
    backgroundColor: "#f1f5f9",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  emptyText: {
    fontSize: 18,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 26,
    maxWidth: width * 0.7,
  },

  // Items de favoritos más grandes
  favoriteItemCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    minHeight: 120,
  },

  favoriteItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  favoriteItemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    flex: 1,
  },

  removeFavoriteButton: {
    backgroundColor: "#fef2f2",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fecaca",
  },

  favoriteItemList: {
    maxHeight: 100,
    marginBottom: 16,
  },

  favoriteItemText: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 6,
    lineHeight: 22,
  },

  favoriteItemMore: {
    fontSize: 14,
    color: "#9ca3af",
    fontStyle: "italic",
  },

  favoriteItemActions: {
    flexDirection: "row",
    gap: 16,
  },

  favoriteActionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  favoriteActionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },

  // Modales generales
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    margin: 20,
    maxHeight: "80%",
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },

  modalTitleInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    borderBottomWidth: 2,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 8,
  },

  saveButton: {
    backgroundColor: "#ecfdf5",
    padding: 8,
    borderRadius: 8,
  },

  modalContent: {
    maxHeight: 400,
  },

  modalItemInput: {
    fontSize: 16,
    color: "#374151",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 12,
    marginBottom: 8,
  },

  addItemButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginTop: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
  },

  addItemText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },

  // Modal de recordatorio
  reminderModalContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 32,
    margin: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },

  reminderIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#fffbeb",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  reminderModalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 12,
  },

  reminderModalText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },

  datePickerContainer: {
    marginBottom: 32,
  },

  reminderButtonsContainer: {
    width: "100%",
    gap: 12,
  },

  reminderButton: {
    backgroundColor: "#f59e0b",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  reminderButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  disabledButton: {
    backgroundColor: "#d1d5db",
  },

  cancelButton: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  cancelButtonText: {
    color: "#6b7280",
    fontSize: 16,
    fontWeight: "600",
  },

  // Modal de éxito
  successModalContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 32,
    margin: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },

  successIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#ecfdf5",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 12,
  },

  successText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },

  // Modal de selección de favoritos CORREGIDO
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  favoriteSelector: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },

  selectorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  selectorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },

  selectorSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
  },

  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },

  categoryCard: {
    width: "48%",
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  categoryCardSelected: {
    backgroundColor: "#eff6ff",
    borderColor: "#93b0b0",
    shadowColor: "#93b0b0",
    shadowOpacity: 0.2,
  },

  categoryCardImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
  },

  categoryCardText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },

  categoryCardTextSelected: {
    color: "#93b0b0",
  },

  selectedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#10b981",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
})

export default HistoryScreen
