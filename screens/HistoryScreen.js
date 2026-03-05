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
  KeyboardAvoidingView,
  AppState,
} from "react-native"
import DraggableFlatList from 'react-native-draggable-flatlist'
import AsyncStorage from "@react-native-async-storage/async-storage"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useIsFocused } from "@react-navigation/native"
import { useTheme } from "../ThemeContext"
import getStyles from "./Styles/stylesHistorial"
import getModernStyles from "./Styles/HistoryScreenModernStyles"
import translationsHistorial from "./translations/translationsHistorial"
import * as RNLocalize from "react-native-localize"
import DateTimePicker from "@react-native-community/datetimepicker"
import { launchImageLibrary } from "react-native-image-picker"
import { request, PERMISSIONS, RESULTS } from "react-native-permissions"
import PushNotification from "react-native-push-notification"
import WidgetService from "../services/WidgetService"
import ExpandedListModal from "../components/ExpandedListModal"
import { productTranslations } from "../services/SeasonalProductsData"
import Voice from "@react-native-community/voice"
import axios from "axios"
import { realTimeAnalysisPrompts } from "./translations/homeScreenTranslations"

const API_KEY_ANALIZE = process.env.API_KEY_ANALIZE

const analyzeTextRealTime = async (text) => {
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  const analysisPrompt = realTimeAnalysisPrompts[deviceLanguage] || realTimeAnalysisPrompts["en"]

  try {
    const response = await axios.post(API_KEY_ANALIZE, {
      model: "gpt-4.1",
      messages: [{ role: "user", content: `${analysisPrompt} "${text}"` }],
      max_tokens: 50,
    })

    const result = response.data.choices[0].message.content.trim()
    if (result === 'NONE' || result === '') {
      return []
    }

    return result.split(',').map(item => item.trim().toLowerCase())
  } catch (error) {
    console.error("Error analyzing text:", error)
    return []
  }
}

const screenWidth = Dimensions.get("window").width
const { width, height } = Dimensions.get("window")
const isSmallIPhone = Platform.OS === 'ios' && (screenWidth <= 375 || height <= 667)

const HistoryScreen = ({ navigation, route }) => {
  const onNavigateToHome = route?.params?.onNavigateToHome;
  const registerToggleFavorites = route?.params?.registerToggleFavorites;
  const { theme } = useTheme()
  const styles = getStyles(theme)
  const modernStyles = getModernStyles(theme)

  // Funciones para manejar categorías
  const extractItemName = (item) => {
    const itemText = typeof item === 'string' ? item : item.text || item.name || String(item)

    if (itemText.includes(' - ')) {
      const parts = itemText.split(' - ')
      if (parts.length >= 2) {
        let itemName = parts.slice(1).join(' - ')
        itemName = itemName.replace(/\s*\([^)]*\)\s*/g, '')
        itemName = itemName.replace(/\s*-\s*\$[\d.,]+\s*/g, '')
        itemName = itemName.replace(/\s*🏪\s*$/, '')
        return itemName.trim()
      }
    }
    return itemText
  }

  const extractCategoryName = (item) => {
    const itemText = typeof item === 'string' ? item : item.text || item.name || String(item)

    if (itemText.includes(' - ')) {
      const parts = itemText.split(' - ')
      return parts[0].trim()
    }
    return null
  }

  const groupItemsByCategory = (list) => {
    if (!list) return { categorized: {}, uncategorized: [] }

    const categorized = {}
    const uncategorized = []

    list.forEach((item, index) => {
      const categoryName = extractCategoryName(item)

      if (categoryName) {
        if (!categorized[categoryName]) {
          categorized[categoryName] = []
        }
        categorized[categoryName].push({ item, index })
      } else {
        uncategorized.push({ item, index })
      }
    })

    return { categorized, uncategorized }
  }

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
  const [flatListHeight, setFlatListHeight] = useState(0)
  const [selectedListIndex, setSelectedListIndex] = useState(0)
  const [actionsModalVisible, setActionsModalVisible] = useState(false)
  const [selectedItemIndex, setSelectedItemIndex] = useState(0)
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
  const [favoritesFilterVisible, setFavoritesFilterVisible] = useState(true) // Default abierto
  const favoritesFilterAnim = useRef(new Animated.Value(1)).current // Empezar abierto
  const micPulseAnim = useRef(new Animated.Value(1)).current
  const [historyListSelectorVisible, setHistoryListSelectorVisible] = useState(false)
  const [selectedFavoriteCategory, setSelectedFavoriteCategory] = useState('')
  const [selectedFavoriteCategoryKey, setSelectedFavoriteCategoryKey] = useState('')
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
  const [expandedLists, setExpandedLists] = useState({})
  const [expandedModalVisible, setExpandedModalVisible] = useState(false)
  const [expandedListData, setExpandedListData] = useState({ list: [], name: '', index: null })
  const [autoOpenAddModal, setAutoOpenAddModal] = useState(false)
  const [editingItemIndex, setEditingItemIndex] = useState(null)
  const [editingListIndex, setEditingListIndex] = useState(null)
  const [editingItemText, setEditingItemText] = useState("")

  // Voice add states
  const [addMethodModalVisible, setAddMethodModalVisible] = useState(false)
  const [addMethodIndex, setAddMethodIndex] = useState(null)
  const [voiceAddModalVisible, setVoiceAddModalVisible] = useState(false)
  const [voiceStarted, setVoiceStarted] = useState(false)
  const [voiceDetectedItems, setVoiceDetectedItems] = useState([])
  const [voiceResults, setVoiceResults] = useState([])
  const voiceAnalysisTimeoutRef = useRef(null)
  const voicePulseAnim = useRef(new Animated.Value(1)).current

  // Configurar notificaciones push (solo iOS)
  useEffect(() => {
    if (Platform.OS === "ios") {
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
        requestPermissions: false,
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
    }
  }, [])

  // DISABLED: This reordering was causing issues with widget touch functionality
  // The widget should always show the first (most recent) list, not reorder based on currentIndex
  /*
  useEffect(() => {
    if (!isFocused) return

    if (history.length > 0 && currentIndex >= 0 && currentIndex < history.length) {
      const reorderedHistory = [history[currentIndex], ...history.filter((_, index) => index !== currentIndex)]
      const reorderedCompletedItems = {
        0: completedItems[currentIndex] || []
      }
      setTimeout(() => {
        WidgetService.updateWidgetShoppingLists(reorderedHistory, reorderedCompletedItems)
      }, 500)
    }
  }, [currentIndex, history.length, isFocused])
  */

  // Define syncWidgetChanges function outside of useEffect to reuse it
  const syncWidgetChanges = async () => {
    try {
      const changes = await WidgetService.syncWidgetChangesToApp()

      // Handle array of changes
      if (changes && Array.isArray(changes)) {
        console.log('🔄 Processing', changes.length, 'widget changes')

        // Create a completely new object to avoid mutation issues
        const newCompletedItems = {}

        // Copy all existing completed items
        Object.keys(completedItems).forEach(key => {
          newCompletedItems[key] = [...(completedItems[key] || [])]
        })

        let hasChanges = false

        // Process each change
        for (const change of changes) {
          if (change && change.type === 'itemToggle') {
            const { listIndex, itemIndex, isCompleted, timestamp } = change

            // Only process recent changes (within last 60 seconds)
            if (Date.now() - (timestamp * 1000) < 60000) {
              // Map widget listIndex 0 to current visible list index
              const actualListIndex = currentIndex

              console.log('🔄 Syncing widget change to app - Widget List:', listIndex, 'Actual List:', actualListIndex, 'Item:', itemIndex, 'Completed:', isCompleted)
              hasChanges = true

              // Initialize array if needed
              if (!newCompletedItems[actualListIndex]) {
                newCompletedItems[actualListIndex] = []
              }

              if (isCompleted) {
                // Add to completed if not already there
                if (!newCompletedItems[actualListIndex].includes(itemIndex)) {
                  newCompletedItems[actualListIndex] = [...newCompletedItems[actualListIndex], itemIndex]
                }
              } else {
                // Remove from completed
                newCompletedItems[actualListIndex] = newCompletedItems[actualListIndex].filter(i => i !== itemIndex)
              }
            }
          }
        }

        if (hasChanges) {
          console.log('✅ Updated completed items from widget:', newCompletedItems)
          setCompletedItems(newCompletedItems)

          // Save to AsyncStorage
          await AsyncStorage.setItem("@completed_items", JSON.stringify(newCompletedItems))

          // Update widget with the updated completed items
          setTimeout(() => {
            WidgetService.updateWidgetShoppingLists(history, newCompletedItems)
          }, 100)
        }
      }
    } catch (error) {
      console.error('Error syncing widget changes:', error)
    }
  }

  // Listen for widget changes when tab is focused
  useEffect(() => {
    // Sync when tab becomes focused
    if (isFocused) {
      syncWidgetChanges()
    }
  }, [isFocused])

  // Pulse animation for mic icon when history is empty
  useEffect(() => {
    if (history.length === 0) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(micPulseAnim, {
            toValue: 1.15,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(micPulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      )
      pulse.start()
      return () => pulse.stop()
    }
  }, [history.length, micPulseAnim])

  // Listen for app state changes (foreground/background)
  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      console.log('🔄 App state changed to:', nextAppState)
      if (nextAppState === 'active') {
        // App came to foreground, sync widget changes
        console.log('📱 App came to foreground, syncing widget changes...')
        syncWidgetChanges()
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        // App going to background, ensure widget is updated with latest data
        console.log('📤 App going to background, updating widget with latest data...')
        try {
          await WidgetService.updateWidgetShoppingLists(history, completedItems)
          console.log('✅ Widget updated before backgrounding')
        } catch (error) {
          console.error('Error updating widget on background:', error)
        }
      }
    }

    // Subscribe to app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange)

    // Cleanup
    return () => {
      subscription.remove()
    }
  }, [currentIndex, history, completedItems])

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

  // Función para obtener el nombre traducido de la categoría
  const getCategoryDisplayName = (index) => {
    const category = getFavoriteCategory(index)
    if (!category) return null
    return favoriteTitles[category] || currentLabels[category]
  }


  // Función para guardar la edición del item
  const saveItemEdit = async () => {
    if (editingListIndex !== null && editingItemIndex !== null) {
      const newHistory = [...history]
      const originalItem = newHistory[editingListIndex].list[editingItemIndex]

      // Mantener la categoría si existe
      const categoryName = extractCategoryName(originalItem)
      const newItemText = categoryName
        ? `${categoryName} - ${editingItemText}`
        : editingItemText

      newHistory[editingListIndex].list[editingItemIndex] = newItemText

      // Si estamos en el modal expandido, actualizar también sus datos
      if (expandedListData.index === editingListIndex) {
        setExpandedListData({
          ...expandedListData,
          list: newHistory[editingListIndex].list
        })
      }

      await saveHistory(newHistory)

      // Limpiar estados de edición
      setEditingListIndex(null)
      setEditingItemIndex(null)
      setEditingItemText("")
    }
  }

  // Función para cancelar la edición
  const cancelItemEdit = () => {
    setEditingListIndex(null)
    setEditingItemIndex(null)
    setEditingItemText("")
  }

  // Función para eliminar un item de la lista
  const deleteListItem = async (listIndex, itemIndex) => {
    const newHistory = [...history]
    newHistory[listIndex].list.splice(itemIndex, 1)
    
    // Actualizar datos del modal expandido si estamos en él
    if (expandedListData.index === listIndex) {
      setExpandedListData({
        ...expandedListData,
        list: newHistory[listIndex].list
      })
    }
    
    // Actualizar estados de items completados
    const newCompletedItems = { ...completedItems }
    if (newCompletedItems[listIndex]) {
      // Remover el item eliminado de completados
      newCompletedItems[listIndex] = newCompletedItems[listIndex].filter(index => index !== itemIndex)
      // Ajustar indices de items que estaban después del eliminado
      newCompletedItems[listIndex] = newCompletedItems[listIndex].map(index => 
        index > itemIndex ? index - 1 : index
      )
    }
    setCompletedItems(newCompletedItems)
    saveCompletedItems(newCompletedItems)
    
    await saveHistory(newHistory)
    
    // Limpiar estados de edición si estamos editando el item eliminado
    if (editingListIndex === listIndex && editingItemIndex === itemIndex) {
      cancelItemEdit()
    }
  }

  // Función para agregar un nuevo item a la lista expandida
  const addNewItemToExpandedList = async (itemText) => {
    if (expandedListData.index !== null) {
      const newHistory = [...history]
      const newItemIndex = newHistory[expandedListData.index].list.length

      // Si itemText viene con contenido, agregarlo directamente
      // Si no, agregar un item vacío y entrar en modo edición
      if (itemText && itemText.trim()) {
        newHistory[expandedListData.index].list.push(itemText)
      } else {
        newHistory[expandedListData.index].list.push("")
      }

      // Actualizar los datos del modal expandido ANTES de guardar
      const updatedExpandedData = {
        ...expandedListData,
        list: newHistory[expandedListData.index].list
      }
      setExpandedListData(updatedExpandedData)

      // Asegurar que el nuevo item NO esté marcado como completado
      const newCompletedItems = { ...completedItems }
      if (newCompletedItems[expandedListData.index]) {
        // Remover el índice del nuevo item de completados si existe
        newCompletedItems[expandedListData.index] = newCompletedItems[expandedListData.index].filter(
          index => index !== newItemIndex
        )
      }
      setCompletedItems(newCompletedItems)
      saveCompletedItems(newCompletedItems)

      // Guardar en storage
      await saveHistory(newHistory)

      // Solo entrar en modo edición si no se proporcionó texto
      if (!itemText || !itemText.trim()) {
        setEditingListIndex(expandedListData.index)
        setEditingItemIndex(newItemIndex)
        setEditingItemText("")
      }
    }
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

  // Función para mostrar/ocultar filtro de favoritos
  const toggleFavoritesFilter = async () => {
    const newState = !favoritesFilterVisible
    const toValue = newState ? 1 : 0
    setFavoritesFilterVisible(newState)

    // Guardar estado en AsyncStorage
    try {
      await AsyncStorage.setItem('@favorites_filter_visible', JSON.stringify(newState))
    } catch (error) {
      console.error('Error saving favorites filter state:', error)
    }

    Animated.timing(favoritesFilterAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }

  // Registrar función de toggle favoritos para el header
  useEffect(() => {
    if (registerToggleFavorites) {
      registerToggleFavorites(() => {
        const newState = !favoritesFilterVisible
        const toValue = newState ? 1 : 0
        setFavoritesFilterVisible(newState)

        AsyncStorage.setItem('@favorites_filter_visible', JSON.stringify(newState))

        Animated.timing(favoritesFilterAnim, {
          toValue,
          duration: 300,
          useNativeDriver: false,
        }).start()
      })
    }
  }, [registerToggleFavorites, favoritesFilterVisible, favoritesFilterAnim])

  // Función para cargar el estado del filtro de favoritos
  const loadFavoritesFilterState = async () => {
    try {
      const savedState = await AsyncStorage.getItem('@favorites_filter_visible')
      if (savedState !== null) {
        const isVisible = JSON.parse(savedState)
        setFavoritesFilterVisible(isVisible)
        favoritesFilterAnim.setValue(isVisible ? 1 : 0)
      }
    } catch (error) {
      console.error('Error loading favorites filter state:', error)
    }
  }

  const renderEmptyComponent = (category, categoryKey) => (
    <View style={modernStyles.emptyContainer}>
      <View style={modernStyles.emptyIconContainer}>
        <Ionicons name="heart-outline" size={80} color="#9ca3af" />
      </View>
      <Text style={modernStyles.emptyText}>{currentLabels.noFavorites}</Text>

      {history.length > 0 && (
        <TouchableOpacity
          style={modernStyles.addFavoriteFromEmptyButton}
          onPress={() => {
            console.log('🔍 DEBUG: Button pressed, category:', category, 'key:', categoryKey)

            // Cerrar todos los modales de favoritos primero
            setFavoritesModalVisible1(false)
            setFavoritesModalVisible2(false)
            setFavoritesModalVisible3(false)
            setFavoritesModalVisible4(false)
            setFavoritesModalVisible5(false)

            // Guardar la categoría seleccionada
            setSelectedFavoriteCategory(category)
            setSelectedFavoriteCategoryKey(categoryKey)

            // Abrir el selector con un pequeño delay para que se cierre el modal anterior
            setTimeout(() => {
              setHistoryListSelectorVisible(true)
              console.log('🔍 DEBUG: Set historyListSelectorVisible to true')
            }, 100)
          }}
        >
          <Ionicons name="add-circle-outline" size={24} color="#3b82f6" />
          <Text style={modernStyles.addFavoriteFromEmptyText}>
            {currentLabels.addFromHistory || 'Agregar desde historial'}
          </Text>
        </TouchableOpacity>
      )}
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

  // Funciones de notificaciones push corregidas (solo iOS)
  const scheduleNotification = (listName, date, listIndex) => {
    if (Platform.OS !== "ios") {
      // Skip notifications on Android
      setSuccessModalVisible(true)
      return
    }

    const notificationId = `reminder_${listIndex}_${Date.now()}`

    PushNotification.localNotificationSchedule({
      id: notificationId,
      channelId: "shopping-reminders",
      title: "🛒 List Reminder",
      message: `It's time to go shopping: ${listName}`,
      date: new Date(date),
      allowWhileIdle: true,
      repeatType: "time",
      actions: [currentLabels.viewList, currentLabels.postpone],
      userInfo: { listIndex, listName },
    })

    const newReminders = { ...reminders, [listIndex]: { date, notificationId } }
    setReminders(newReminders)
    saveReminders(newReminders)
    setSuccessModalVisible(true)
  }

  const cancelNotification = (listIndex) => {
    if (Platform.OS !== "ios" || !reminders[listIndex]) {
      return
    }

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
      Alert.alert(currentLabels.permissionRequired, currentLabels.permissionPhotoLibrary)
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

          // Migración: Convertir objetos {item, quantity, unit} a strings
          const migratedList = item.list.map(listItem => {
            if (typeof listItem === 'string') {
              return listItem;
            }
            // Si es objeto con item, quantity, unit
            if (listItem && listItem.item) {
              const qty = listItem.quantity && listItem.quantity !== 'NaN' ? listItem.quantity : '';
              const unit = listItem.unit || '';
              if (qty && unit) {
                return `${listItem.item} (${qty} ${unit})`;
              } else if (qty) {
                return `${listItem.item} (${qty})`;
              } else {
                return listItem.item || '';
              }
            }
            return String(listItem);
          }).filter(item => item.trim() !== '');

          return { ...item, list: migratedList }
        })

        // Guardar la migración de vuelta al storage
        await AsyncStorage.setItem("@shopping_history", JSON.stringify(parsedHistory))

        // Reverse to show newest lists first (most recent at index 0)
        const reversedHistory = parsedHistory.reverse()
        setHistory(reversedHistory)

        // Load completed items before updating widget
        let loadedCompletedItems = {}
        try {
          const savedCompletedItems = await AsyncStorage.getItem("@completed_items")
          if (savedCompletedItems !== null) {
            loadedCompletedItems = JSON.parse(savedCompletedItems)
          }
        } catch (e) {
          console.error("Error loading completed items for widget: ", e)
        }

        // Update widget with shopping lists and completed items
        console.log('Updating widget with history:', reversedHistory.length, 'lists and completed items')
        await WidgetService.updateWidgetShoppingLists(reversedHistory, loadedCompletedItems)
        console.log('Widget update completed')
      }
    } catch (e) {
      console.error("Error loading history:", e)
    }
  }

  const saveHistory = async (newHistory) => {
    try {
      // Save reversed for storage, but keep original order for widget
      const reversedForStorage = [...newHistory].reverse()
      await AsyncStorage.setItem("@shopping_history", JSON.stringify(reversedForStorage))
      setHistory(newHistory)

      // Update widget with shopping lists (original order - most recent first)
      await WidgetService.updateWidgetShoppingLists(newHistory, completedItems)
    } catch (e) {
      console.error("Error saving history: ", e)
    }
  }

  const handleDragEnd = ({ data }) => {
    setHistory(data)
    // Guardar el nuevo orden en AsyncStorage
    const reversedForStorage = [...data].reverse()
    AsyncStorage.setItem("@shopping_history", JSON.stringify(reversedForStorage))
      .then(() => {
        // Update widget with shopping lists (original order - most recent first)
        WidgetService.updateWidgetShoppingLists(data, completedItems)
      })
      .catch((e) => console.error("Error saving reordered history: ", e))
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
      
      // Sync favorites with widget
      if (key === "@favorites1" && newFavorites.length > 0) {
        const favoriteItems = []
        for (const index of newFavorites) {
          if (history[index] && history[index].list) {
            // Add first few items from the favorite list
            const items = history[index].list.slice(0, 5).map(item => 
              typeof item === 'string' ? item : item.text || item.name || String(item)
            )
            favoriteItems.push(...items)
          }
        }
        await WidgetService.updateWidgetFavorites(favoriteItems.slice(0, 10))
      }
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
    setExpandedListData({
      list: history[index].list,
      name: history[index].name,
      index: index
    })
    setExpandedModalVisible(true)
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

  // Función para limpiar estados de completados inválidos
  const cleanInvalidCompletedItems = () => {
    const newCompletedItems = {}
    let hasChanges = false
    
    Object.keys(completedItems).forEach(listIndexKey => {
      const listIndex = parseInt(listIndexKey)
      if (history[listIndex] && history[listIndex].list) {
        // Filtrar solo los índices válidos para esta lista
        const validItems = completedItems[listIndexKey].filter(itemIndex => 
          itemIndex >= 0 && itemIndex < history[listIndex].list.length
        )
        if (validItems.length !== completedItems[listIndexKey].length) {
          hasChanges = true
        }
        if (validItems.length > 0) {
          newCompletedItems[listIndexKey] = validItems
        }
      } else {
        // Lista no existe, eliminar completamente
        hasChanges = true
      }
    })
    
    if (hasChanges) {
      setCompletedItems(newCompletedItems)
      saveCompletedItems(newCompletedItems)
    }
  }

  // Funciones de elementos completados
  const toggleItemCompletion = async (listIndex, itemIndex) => {
    // Create a completely new object to avoid Hermes property mutation issues
    const newCompletedItems = {}
    
    // Copy all existing properties
    Object.keys(completedItems).forEach(key => {
      newCompletedItems[key] = [...completedItems[key]]
    })
    
    // Initialize array if it doesn't exist
    if (!newCompletedItems[listIndex]) {
      newCompletedItems[listIndex] = []
    }
    
    // Toggle item completion
    if (newCompletedItems[listIndex].includes(itemIndex)) {
      newCompletedItems[listIndex] = newCompletedItems[listIndex].filter((i) => i !== itemIndex)
    } else {
      newCompletedItems[listIndex] = [...newCompletedItems[listIndex], itemIndex]
    }
    
    console.log('🔄 DEBUG: toggleItemCompletion - List:', listIndex, 'Item:', itemIndex, 'New state:', newCompletedItems)
    
    saveCompletedItems(newCompletedItems)
    
    // IMPORTANT: Update widget immediately when marking items in app
    console.log('📤 Updating widget after toggle in app')
    await WidgetService.updateWidgetShoppingLists(history, newCompletedItems)
  }

  // Funciones de compartir e imprimir
  const shareShoppingList = async (list) => {
    const listString = list.join("\n")
    try {
      await Share.share({
        message: listString,
        title: currentLabels.shoppingListTitle,
      })
    } catch (error) {
      console.error("Error sharing shopping list: ", error)
      Alert.alert(currentLabels.shareError, currentLabels.shareErrorMessage)
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
    // Notifications disabled for Android - only works on iOS
    if (Platform.OS === "ios") {
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

    // Ajustar completedItems - eliminar la lista eliminada y ajustar índices
    const newCompletedItems = {}
    Object.keys(completedItems).forEach(listIndexKey => {
      const listIndex = parseInt(listIndexKey)
      if (listIndex < index) {
        // Listas antes de la eliminada mantienen sus índices
        newCompletedItems[listIndexKey] = completedItems[listIndexKey]
      } else if (listIndex > index) {
        // Listas después de la eliminada reducen su índice en 1
        newCompletedItems[listIndex - 1] = completedItems[listIndexKey]
      }
      // Si listIndex === index, no se copia (se elimina)
    })

    setHistory(newHistory)
    setFavorites1(adjustedFavorites1)
    setFavorites2(adjustedFavorites2)
    setFavorites3(adjustedFavorites3)
    setFavorites4(adjustedFavorites4)
    setFavorites5(adjustedFavorites5)
    setCompletedItems(newCompletedItems)

    setFavoritesModalVisible(false)

    try {
      await AsyncStorage.setItem("@shopping_history", JSON.stringify(newHistory))
      await AsyncStorage.setItem("@favorites1", JSON.stringify(adjustedFavorites1))
      await AsyncStorage.setItem("@favorites2", JSON.stringify(adjustedFavorites2))
      await AsyncStorage.setItem("@favorites3", JSON.stringify(adjustedFavorites3))
      await AsyncStorage.setItem("@favorites4", JSON.stringify(adjustedFavorites4))
      await AsyncStorage.setItem("@favorites5", JSON.stringify(adjustedFavorites5))
      await AsyncStorage.setItem("@completed_items", JSON.stringify(newCompletedItems))
      
      // Update widget after removing list
      console.log('Updating widget after removing list:', newHistory.length, 'lists remaining')
      await WidgetService.updateWidgetShoppingLists(newHistory, newCompletedItems)
      console.log('Widget update completed after removal')
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

  // Función para abrir modal de lista expandida
  const openExpandedListModal = (index) => {
    setExpandedListData({
      list: history[index].list,
      name: history[index].name,
      index: index
    })
    setExpandedModalVisible(true)
  }

  // === Voice add functions ===
  const languageMap = {
    en: "en-US", es: "es-ES", de: "de-DE", fr: "fr-FR", it: "it-IT",
    pt: "pt-PT", nl: "nl-NL", ru: "ru-RU", ja: "ja-JP", ar: "ar-SA",
    tr: "tr-TR", hu: "hu-HU", hi: "hi-IN",
  }

  const showAddMethodModal = (index) => {
    setAddMethodIndex(index)
    setAddMethodModalVisible(true)
  }

  const handleWrittenOption = () => {
    setAddMethodModalVisible(false)
    setAutoOpenAddModal(true)
    openExpandedListModal(addMethodIndex)
  }

  const handleSpokenOption = () => {
    setAddMethodModalVisible(false)
    setVoiceDetectedItems([])
    setVoiceResults([])
    setVoiceAddModalVisible(true)
    startVoiceRecognition()
  }

  const startVoiceRecognition = async () => {
    const lang = RNLocalize.getLocales()[0].languageCode
    const recognitionLanguage = languageMap[lang] || "en-US"

    // Limpiar listeners y estado previo antes de iniciar
    try {
      await Voice.destroy()
      Voice.removeAllListeners()
    } catch (e) {}

    Voice.onSpeechStart = () => {
      setVoiceStarted(true)
      startVoicePulseAnimation()
    }

    Voice.onSpeechRecognized = () => {}

    Voice.onSpeechError = (e) => {
      console.error("Voice error:", e)
      setVoiceStarted(false)
      voicePulseAnim.setValue(1)
    }

    Voice.onSpeechResults = async (e) => {
      const items = e.value
      setVoiceResults(items)

      if (voiceAnalysisTimeoutRef.current) {
        clearTimeout(voiceAnalysisTimeoutRef.current)
      }

      voiceAnalysisTimeoutRef.current = setTimeout(async () => {
        if (items.length > 0) {
          const latestText = items[items.length - 1]
          const identifiedItems = await analyzeTextRealTime(latestText)

          setVoiceDetectedItems(prevWords => {
            const newWords = [...prevWords]

            identifiedItems.forEach(newItem => {
              const newItemLower = newItem.toLowerCase().trim()

              const existingSimilar = newWords.find(existing => {
                const existingLower = existing.toLowerCase().trim()

                if (existingLower === newItemLower) return true

                if (existingLower.includes(newItemLower) || newItemLower.includes(existingLower)) {
                  return true
                }

                if (Math.abs(existingLower.length - newItemLower.length) <= 2) {
                  let differences = 0
                  const maxLen = Math.max(existingLower.length, newItemLower.length)
                  for (let i = 0; i < maxLen; i++) {
                    if (existingLower[i] !== newItemLower[i]) differences++
                  }
                  if (differences <= 2) return true
                }

                return false
              })

              if (!existingSimilar) {
                newWords.push(newItem)
              } else {
                const existingIndex = newWords.findIndex(existing =>
                  existing.toLowerCase().trim() === existingSimilar.toLowerCase().trim()
                )
                if (newItemLower.length > existingSimilar.toLowerCase().trim().length) {
                  newWords[existingIndex] = newItem
                }
              }
            })

            return newWords
          })
        }
      }, 150)
    }

    try {
      await Voice.start(recognitionLanguage)
    } catch (e) {
      console.error("Error starting voice:", e)
    }
  }

  const startVoicePulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(voicePulseAnim, {
          toValue: 1.3,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(voicePulseAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start()
  }

  const stopVoiceAndAddItems = async () => {
    try {
      await Voice.stop()
      Voice.removeAllListeners()
    } catch (e) {
      console.error("Error stopping voice:", e)
    }

    setVoiceStarted(false)
    voicePulseAnim.setValue(1)

    if (voiceDetectedItems.length > 0 && addMethodIndex !== null) {
      const newHistory = [...history]
      voiceDetectedItems.forEach(item => {
        newHistory[addMethodIndex].list.push(item)
      })
      await saveHistory(newHistory)
    }

    setVoiceAddModalVisible(false)
    setVoiceDetectedItems([])
    setVoiceResults([])

    if (voiceAnalysisTimeoutRef.current) {
      clearTimeout(voiceAnalysisTimeoutRef.current)
    }
  }

  const closeVoiceModal = async () => {
    try {
      await Voice.stop()
      Voice.removeAllListeners()
    } catch (e) {}
    setVoiceStarted(false)
    voicePulseAnim.setValue(1)
    setVoiceAddModalVisible(false)
    setVoiceDetectedItems([])
    setVoiceResults([])
    if (voiceAnalysisTimeoutRef.current) {
      clearTimeout(voiceAnalysisTimeoutRef.current)
    }
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
          <Text style={[modernStyles.favoriteItemTitle, isSmallIPhone && {fontSize: 16}]}>{historyItem.name}</Text>
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
            <Ionicons name="heart-dislike" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={modernStyles.favoriteItemList} showsVerticalScrollIndicator={false}>
          {historyItem.list.slice(0, 3).map((listItem, listIndex) => (
            <Text key={listIndex} style={[modernStyles.favoriteItemText, isSmallIPhone && {fontSize: 13}]}>
              • {listItem}
            </Text>
          ))}
          {historyItem.list.length > 3 && (
            <Text style={modernStyles.favoriteItemMore}>+{historyItem.list.length - 3} more...</Text>
          )}
        </ScrollView>

        <View style={modernStyles.favoriteItemActions}>
          <TouchableOpacity
            onPress={() => {
              // First set up the expanded list data
              setExpandedListData({
                list: historyItem.list,
                name: historyItem.name,
                index: historyIndex
              })
              
              // Close the current favorites modal based on which one is open
              if (favoritesModalVisible1) setFavoritesModalVisible1(false)
              if (favoritesModalVisible2) setFavoritesModalVisible2(false)
              if (favoritesModalVisible3) setFavoritesModalVisible3(false)
              if (favoritesModalVisible4) setFavoritesModalVisible4(false)
              if (favoritesModalVisible5) setFavoritesModalVisible5(false)
              
              // Use a small delay to ensure the favorites modal closes first
              setTimeout(() => {
                setExpandedModalVisible(true)
              }, 200)
            }}
            style={modernStyles.favoriteActionButton}
          >
            <Ionicons name="expand-outline" size={18} color="#2d3748" />
            <Text style={modernStyles.favoriteActionText}>{currentLabels.expand}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => shareShoppingList(historyItem.list)}
            style={modernStyles.favoriteActionButton}
          >
            <Ionicons name="share-outline" size={18} color="#2d3748" />
            <Text style={modernStyles.favoriteActionText}>{currentLabels.share}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  // Agregar los useEffects necesarios
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      console.log('📱 HistoryScreen focused - loading data...')

      // Load history and completed items first
      await loadHistory()
      await loadCompletedItems()

      // Force widget update with fresh data after both are loaded
      setTimeout(async () => {
        console.log('🔄 Forcing widget update after screen focus')
        if (history.length > 0) {
          await WidgetService.updateWidgetShoppingLists(history, completedItems)
        }
      }, 500)

      loadReminders()
      loadFavorites("@favorites1", setFavorites1)
      loadFavorites("@favorites2", setFavorites2)
      loadFavorites("@favorites3", setFavorites3)
      loadFavorites("@favorites4", setFavorites4)
      loadFavorites("@favorites5", setFavorites5)
      
      // Check if we should scroll to newest list
      try {
        const showNewestList = await AsyncStorage.getItem("@show_newest_list")
        if (showNewestList === "true") {
          // Clear the flag
          await AsyncStorage.removeItem("@show_newest_list")
          // Scroll to first item (newest list) with a small delay
          setTimeout(() => {
            if (flatListRef.current) {
              flatListRef.current.scrollToIndex({ index: 0, animated: true })
              setCurrentIndex(0)
            }
          }, 300)
        }
      } catch (error) {
        console.error("Error checking show newest list flag:", error)
      }
      
      // Check for widget changes to sync
      try {
        const widgetChanges = await WidgetService.syncWidgetChangesToApp()
        if (widgetChanges && Array.isArray(widgetChanges)) {
          console.log('🔄 DEBUG: HistoryScreen - Processing', widgetChanges.length, 'widget changes')
          
          let newCompletedItems = { ...completedItems }
          
          // Process each change
          widgetChanges.forEach(change => {
            if (change.type === 'itemToggle') {
              const { listIndex, itemIndex, isCompleted } = change
              
              // Widget always sends listIndex: 0, but we need to map it to the current visible list
              // Use currentIndex to determine which list the user is actually viewing
              const actualListIndex = currentIndex
              
              console.log('📝 Processing toggle - Widget listIndex:', listIndex, 'Item:', itemIndex, 'Completed:', isCompleted)
              console.log('📝 History length:', history.length, 'Using actualListIndex:', actualListIndex)
              
              if (!newCompletedItems[actualListIndex]) {
                newCompletedItems[actualListIndex] = []
              }
              
              if (isCompleted) {
                // Add to completed if not already there
                if (!newCompletedItems[actualListIndex].includes(itemIndex)) {
                  newCompletedItems[actualListIndex] = [...newCompletedItems[actualListIndex], itemIndex]
                  console.log('✅ Added item', itemIndex, 'to completed for list', actualListIndex)
                }
              } else {
                // Remove from completed
                newCompletedItems[actualListIndex] = newCompletedItems[actualListIndex].filter(i => i !== itemIndex)
                console.log('❌ Removed item', itemIndex, 'from completed for list', actualListIndex)
              }
            }
          })
          
          console.log('📋 Final newCompletedItems:', JSON.stringify(newCompletedItems))
          
          setCompletedItems(newCompletedItems)
          saveCompletedItems(newCompletedItems)
          
          console.log('✅ DEBUG: HistoryScreen - All widget changes synced successfully')
          
          // Update widget with new completed state
          console.log('📤 Updating widget with synced completed items')
          await WidgetService.updateWidgetShoppingLists(history, newCompletedItems)
        } else if (widgetChanges) {
          // Handle single change for backwards compatibility
          console.log('🔄 DEBUG: HistoryScreen - Processing single widget change')
          if (widgetChanges.type === 'itemToggle') {
            const { listIndex, itemIndex, isCompleted } = widgetChanges
            const actualListIndex = currentIndex // Map widget listIndex to current visible list
            
            const newCompletedItems = { ...completedItems }
            if (!newCompletedItems[actualListIndex]) {
              newCompletedItems[actualListIndex] = []
            }
            
            if (isCompleted) {
              if (!newCompletedItems[actualListIndex].includes(itemIndex)) {
                newCompletedItems[actualListIndex] = [...newCompletedItems[actualListIndex], itemIndex]
              }
            } else {
              newCompletedItems[actualListIndex] = newCompletedItems[actualListIndex].filter(i => i !== itemIndex)
            }
            
            setCompletedItems(newCompletedItems)
            saveCompletedItems(newCompletedItems)
          }
        }
      } catch (error) {
        console.error("Error syncing widget changes:", error)
      }
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
    loadFavoritesFilterState() // Cargar estado del filtro
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
    <View style={{ width: width, height: height - 340 }}>
    <View style={[modernStyles.historyCard, { flex: 1 }]}>
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
              <Ionicons name="checkmark" size={28} color="#6b7280" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={modernStyles.titleContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>

              <Text style={[modernStyles.cardTitle, isSmallIPhone && {fontSize: 16}, { flex: 1 }]}>{item.name}</Text>
            </View>
            <TouchableOpacity
                onPress={() => {
                  setSelectedItemIndex(index)
                  setActionsModalVisible(true)
                }}
                style={modernStyles.menuButton}
              >
                <Ionicons name="ellipsis-horizontal-sharp" size={20} color="#4b5563" />
              </TouchableOpacity>
          </View>
        )}
      </View>

      {!favoritesModalVisible1 &&
        !favoritesModalVisible2 &&
        !favoritesModalVisible3 &&
        !favoritesModalVisible4 &&
        !favoritesModalVisible5 && (
          <View style={modernStyles.singleMenuButtonContainer}>
     
          </View>
        )}

      {reminders[index] && !isReminderPassed(reminders[index].date || reminders[index]) && (
        <View style={modernStyles.reminderContainer}>
          <View style={modernStyles.reminderIcon}>
            <Ionicons name="notifications" size={18} color="#92400e" />
          </View>
          <Text style={modernStyles.reminderText}>
            {new Date(reminders[index].date || reminders[index]).toLocaleDateString()} {currentLabels.time}:{" "}
            {new Date(reminders[index].date || reminders[index]).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <TouchableOpacity onPress={() => cancelNotification(index)} style={modernStyles.cancelReminderButton}>
            <Ionicons name="close" size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>
      )}

      {(() => {
        // Verificar si la lista tiene metadatos de categorías o si es una lista reordenada manualmente
        const isManuallyReordered = item.metadata?.type === 'manual' || !item.metadata || item.metadata?.manuallyReordered

        let allItems = []

        if (isManuallyReordered) {
          // Para listas manuales o reordenadas, mantener el orden exacto de item.list
          // pero intentar detectar categorías para mostrar títulos
          allItems = item.list.map((listItem, idx) => {
            // Intentar detectar la categoría del item
            let detectedCategory = null
            if (listItem.includes('Hogar y Limpieza') || listItem.includes('Home')) {
              detectedCategory = currentLabels.homeAndCleaning || 'Hogar y Limpieza'
            } else if (listItem.includes('Mascotas') || listItem.includes('Pets')) {
              detectedCategory = currentLabels.pets || 'Mascotas'
            } else if (listItem.includes('Supermercado') || listItem.includes('Supermarket')) {
              detectedCategory = currentLabels.supermarket || 'Supermercado'
            } else if (listItem.includes('Farmacia') || listItem.includes('Pharmacy')) {
              detectedCategory = currentLabels.pharmacy || 'Farmacia'
            } else if (listItem.includes('Electrónica') || listItem.includes('Electronics')) {
              detectedCategory = currentLabels.electronics || 'Electrónica'
            } else if (listItem.includes('Bebidas') || listItem.includes('Beverages')) {
              detectedCategory = currentLabels.beverages || 'Bebidas'
            } else if (listItem.includes('Carnicería') || listItem.includes('Butcher')) {
              detectedCategory = currentLabels.butcher || 'Carnicería'
            }

            return {
              key: `item-${idx}`,
              listItem,
              listItemIndex: idx,
              category: detectedCategory,
              displayIndex: idx
            }
          })
        } else {
          // Para listas con categorías automáticas, usar el agrupamiento
          const { categorized, uncategorized } = groupItemsByCategory(item.list)

          // Definir orden de categorías usando las traducciones
          const categoryOrder = [
            currentLabels.supermarket || 'Supermercado',
            currentLabels.pharmacy || 'Farmacia',
            currentLabels.electronics || 'Electrónica',
            currentLabels.homeAndCleaning || 'Hogar y Limpieza',
            currentLabels.beverages || 'Bebidas',
            currentLabels.butcher || 'Carnicería'
          ]

          // Ordenar categorías según el orden definido
          const sortedCategories = Object.keys(categorized).sort((a, b) => {
            const indexA = categoryOrder.indexOf(a)
            const indexB = categoryOrder.indexOf(b)
            if (indexA === -1 && indexB === -1) return 0
            if (indexA === -1) return 1
            if (indexB === -1) return -1
            return indexA - indexB
          })

          let globalIndex = 0

          // Primero agregar items sin categoría
          uncategorized.forEach(({ item: listItem, index: listItemIndex }) => {
            allItems.push({
              key: `item-${globalIndex}`,
              listItem,
              listItemIndex,
              category: null,
              displayIndex: globalIndex
            })
            globalIndex++
          })

          // Luego agregar items por categoría en orden
          sortedCategories.forEach(category => {
            categorized[category].forEach(({ item: listItem, index: listItemIndex }) => {
              allItems.push({
                key: `item-${globalIndex}`,
                listItem,
                listItemIndex,
                category,
                displayIndex: globalIndex
              })
              globalIndex++
            })
          })
        }


        const renderItem = ({ item: dragItem, drag, isActive }) => {
          const { listItem, listItemIndex, category } = dragItem
          const idx = allItems.findIndex(i => i.key === dragItem.key)

          // Mostrar título de categoría si es el primer item de esa categoría
          const showCategoryTitle = category && (
            idx === 0 ||
            allItems[idx - 1].category !== category
          )

          return (
            <View style={[isActive && { opacity: 0.8 }]}>

              {editingListIndex === index && editingItemIndex === listItemIndex ? (
                // Modo edición
                <View style={modernStyles.listItemEditContainer}>
                  <TouchableOpacity
                    onPress={() => toggleItemCompletion(index, listItemIndex)}
                    style={[
                      modernStyles.listItemCheckbox,
                      completedItems[index]?.includes(listItemIndex) && modernStyles.listItemCheckboxCompleted
                    ]}
                  >
                    {completedItems[index]?.includes(listItemIndex) && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </TouchableOpacity>
                  <TextInput
                    style={[modernStyles.listItemEditInput, isSmallIPhone && {fontSize: 14}]}
                    value={editingItemText}
                    onChangeText={setEditingItemText}
                    onSubmitEditing={saveItemEdit}
                    autoFocus
                    selectTextOnFocus
                  />
                  <TouchableOpacity
                    onPress={saveItemEdit}
                    style={modernStyles.saveItemButton}
                  >
                    <Ionicons name="checkmark" size={20} color="#10b981" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      deleteListItem(index, listItemIndex)
                      cancelItemEdit()
                    }}
                    style={modernStyles.cancelItemButton}
                  >
                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ) : (
                // Modo normal
                <TouchableOpacity
                  style={modernStyles.listItemContainer}
                  onLongPress={drag}
                  onPress={() => toggleItemCompletion(index, listItemIndex)}
                  delayLongPress={500}
                >
                  <View style={modernStyles.listItemMainArea}>
                    <View style={[
                      modernStyles.listItemCheckbox,
                      completedItems[index]?.includes(listItemIndex) && modernStyles.listItemCheckboxCompleted
                    ]}>
                      {completedItems[index]?.includes(listItemIndex) && (
                        <Ionicons name="checkmark" size={16} color="white" />
                      )}
                    </View>
                    <View style={modernStyles.listItemTextContainer}>
                      <Text
                        style={[
                          modernStyles.listItemText,
                          isSmallIPhone && {fontSize: 14},
                          completedItems[index]?.includes(listItemIndex) && modernStyles.completedItemText,
                        ]}
                      >
                        {extractItemName(listItem)}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation()
                      setEditingListIndex(index)
                      setEditingItemIndex(listItemIndex)
                      setEditingItemText(extractItemName(listItem))
                    }}
                    style={modernStyles.editIconButton}
                  >
                    <Ionicons name="pencil" size={14} color="#6b7280" />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
            </View>
          )
        }

        const onDragEnd = async ({ data }) => {
          try {
            // Crear nueva lista reordenada
            const reorderedList = data.map(dragItem => dragItem.listItem)

            // Verificar si realmente cambió
            const hasChanged = JSON.stringify(item.list) !== JSON.stringify(reorderedList)

            if (!hasChanged) {
              return
            }

            // Actualizar el estado local manteniendo el nuevo orden
            const updatedHistory = [...history]
            updatedHistory[index] = {
              ...updatedHistory[index],
              list: reorderedList,
              metadata: updatedHistory[index].metadata ? {
                ...updatedHistory[index].metadata,
                manuallyReordered: true, // Marcar como reordenada manualmente
              } : { manuallyReordered: true }
            }

            setHistory(updatedHistory)

            // Guardar el nuevo orden en AsyncStorage (reversado como el resto del código)
            const reversedForStorage = [...updatedHistory].reverse()
            await AsyncStorage.setItem("@shopping_history", JSON.stringify(reversedForStorage))

            // Actualizar el widget con el orden correcto
            await WidgetService.updateWidgetShoppingLists(updatedHistory, completedItems)
          } catch (error) {
            console.error('Error saving reordered list:', error)
          }
        }

        return (
          <DraggableFlatList
            data={allItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.key}
            onDragEnd={onDragEnd}
            style={modernStyles.listContent}
            contentContainerStyle={{ paddingBottom: 60 }}
            showsVerticalScrollIndicator={false}
          />
        )
      })()}



    </View>
    </View>
  )

  return (
    <SafeAreaView style={modernStyles.container}>
      
      {/* Header de favoritos colapsable */}
      <View style={modernStyles.favoritesHeader}>
        {/* Filtros colapsables */}
        <Animated.View
          style={[
            modernStyles.favoritesFilterContainer,
            {
              height: favoritesFilterAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 80], // Altura cuando está expandido
              }),
              opacity: favoritesFilterAnim,
            }
          ]}
        >
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
        </Animated.View>
      </View>

      {history.length === 0 ? (
        <View style={modernStyles.emptyStateContainer}>
          <TouchableOpacity
            style={modernStyles.createListBanner}
            onPress={() => onNavigateToHome && onNavigateToHome()}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[
                modernStyles.micIconContainer,
                { transform: [{ scale: micPulseAnim }] }
              ]}
            >
              <Ionicons name="mic" size={24} color="#2E7D32" />
            </Animated.View>
            <View style={modernStyles.createListBannerTextContainer}>
              <Text style={modernStyles.createListBannerTitle}>{currentLabels.noHistory}</Text>
              <Text style={modernStyles.createListBannerSubtitle}>{currentLabels.createShoppingList}</Text>
            </View>
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
          style={modernStyles.historyList}
          contentContainerStyle={modernStyles.historyListContainer}
          ref={flatListRef}
          onLayout={(e) => setFlatListHeight(e.nativeEvent.layout.height)}
          getItemLayout={(data, index) => ({ length: width, offset: width * index, index })}
          onScroll={(event) => {
            const offsetX = event.nativeEvent.contentOffset.x
            const index = Math.round(offsetX / width)
            setCurrentIndex(index)
          }}
          scrollEventThrottle={16}
          onMomentumScrollEnd={async (event) => {
            const offsetX = event.nativeEvent.contentOffset.x
            const index = Math.round(offsetX / width)
            setSelectedListIndex(index)

            // Update widget to show the currently visible list
            if (history.length > 0 && index >= 0 && index < history.length) {
              // Reorder history to put current list first for widget
              const reorderedHistory = [
                history[index],
                ...history.filter((_, i) => i !== index)
              ]

              // Reorder completed items to match
              const reorderedCompletedItems = {
                0: completedItems[index] || [],
                ...Object.keys(completedItems)
                  .filter(key => parseInt(key) !== index)
                  .reduce((acc, key, newIndex) => {
                    acc[newIndex + 1] = completedItems[key]
                    return acc
                  }, {})
              }

              console.log('📱 Updating widget to show list at index:', index)
              await WidgetService.updateWidgetShoppingLists(reorderedHistory, reorderedCompletedItems)
            }
          }}
          onScrollToIndexFailed={(info) => {
            flatListRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: true })
            setTimeout(() => {
              flatListRef.current?.scrollToIndex({ index: info.index, animated: true })
            }, 100)
          }}
        />

        </>
      )}

      {/* Botones de acción */}
      {history.length > 0 && (
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 6,
          paddingHorizontal: 20,
          gap: 10,
        }}>
          <TouchableOpacity
            onPress={() => showAddMethodModal(currentIndex)}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              borderRadius: 12,
              paddingVertical: 10,
              paddingHorizontal: 14,
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle-outline" size={18} color="#6366f1" style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#6366f1' }} numberOfLines={1}>
              {currentLabels.addItems || 'Add products'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => confirmRemoveListFromHistory(currentIndex)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              borderRadius: 12,
              paddingVertical: 10,
              paddingHorizontal: 14,
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={18} color="#ef4444" style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#ef4444' }} numberOfLines={1}>
              {currentLabels.deleteShort || 'Delete'}
            </Text>
          </TouchableOpacity>
        </View>
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
                  <Ionicons name="close" size={28} color="#6b7280" />
                </TouchableOpacity>
              </View>

              {modal.favorites.length === 0 ? (
                renderEmptyComponent(modal.category, modal.key)
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

      {/* Modal selector de historial para agregar a favoritos */}
      <Modal
        visible={historyListSelectorVisible}
        animationType="slide"
        onRequestClose={() => {
          console.log('🔍 DEBUG: Modal close requested')
          setHistoryListSelectorVisible(false)
        }}
        transparent={true}
      >
        <View style={modernStyles.modalOverlay}>
          <View style={modernStyles.favoritesModalContainer}>
            {console.log('🔍 DEBUG: Modal is rendering, visible:', historyListSelectorVisible)}
            <View style={modernStyles.favoritesModalHeader}>
              <View style={modernStyles.modalCategoryIcon}>
                <Ionicons name="list-outline" size={40} color="#3b82f6" />
              </View>
              <Text style={modernStyles.favoritesModalTitle}>
                {currentLabels.selectFromHistory || 'Seleccionar del historial'}
              </Text>
              <TouchableOpacity
                onPress={() => setHistoryListSelectorVisible(false)}
                style={modernStyles.modalCloseButton}
              >
                <Ionicons name="close" size={28} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={history}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={modernStyles.historyListItem}
                  onPress={() => {
                    // Agregar a favoritos según la categoría seleccionada
                    switch (selectedFavoriteCategoryKey) {
                      case "@favorites1":
                        handleAddFavorite(index, favorites1, setFavorites1, "@favorites1")
                        break
                      case "@favorites2":
                        handleAddFavorite(index, favorites2, setFavorites2, "@favorites2")
                        break
                      case "@favorites3":
                        handleAddFavorite(index, favorites3, setFavorites3, "@favorites3")
                        break
                      case "@favorites4":
                        handleAddFavorite(index, favorites4, setFavorites4, "@favorites4")
                        break
                      case "@favorites5":
                        handleAddFavorite(index, favorites5, setFavorites5, "@favorites5")
                        break
                    }
                    setHistoryListSelectorVisible(false)
                  }}
                >
                  <View style={modernStyles.historyListItemContent}>
                    <Text style={modernStyles.historyListItemTitle}>{item.name}</Text>
                    <Text style={modernStyles.historyListItemCount}>
                      {item.list.length} {currentLabels.items || 'artículos'}
                    </Text>
                    <View style={modernStyles.historyListPreview}>
                      <Text style={modernStyles.previewText}>
                        {item.list.slice(0, 3).join(', ')}
                        {item.list.length > 3 && (
                          <Text style={modernStyles.previewMore}>
                            {' '}+{item.list.length - 3} más...
                          </Text>
                        )}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              style={modernStyles.favoritesList}
              contentContainerStyle={modernStyles.favoritesListContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

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
                placeholder={currentLabels.listNamePlaceholder}
                placeholderTextColor="#9ca3af"
              />
              <TouchableOpacity
                onPress={() => {
                  saveCurrentList()
                  setModalVisible(false)
                }}
                style={modernStyles.saveButton}
              >
                <Ionicons name="checkmark-circle" size={36} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <ScrollView style={modernStyles.modalContent}>
              {currentList.map((item, index) => (
                <TextInput
                  key={index}
                  style={modernStyles.modalItemInput}
                  value={item}
                  onChangeText={(text) => updateList(index, text)}
                  placeholder={currentLabels.newListItemPlaceholder}
                  placeholderTextColor="#9ca3af"
                />
              ))}
              <TouchableOpacity style={modernStyles.addItemButton} onPress={addItemToList}>
                <Ionicons name="add-circle" size={32} color="#4a5568" />
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
              <Ionicons name="notifications" size={56} color="#d1d5db" />
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
                style={[modernStyles.modalReminderButton, !selectedDate && modernStyles.disabledButton]}
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
              <Ionicons name="checkmark-circle" size={72} color="#9ca3af" />
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
                <Ionicons name="close" size={28} color="#6b7280" />
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
                    <Ionicons name="checkmark" size={18} color="white" />
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
                    <Ionicons name="checkmark" size={18} color="white" />
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
                    <Ionicons name="checkmark" size={18} color="white" />
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
                        <Ionicons name="checkmark" size={18} color="white" />
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
                        <Ionicons name="checkmark" size={18} color="white" />
                      </View>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de lista expandida usando el componente reutilizable */}
      <ExpandedListModal
        visible={expandedModalVisible}
        onClose={() => {
          setExpandedModalVisible(false)
          setAutoOpenAddModal(false)
        }}
        autoOpenAddModal={autoOpenAddModal}
        listData={expandedListData}
        completedItems={completedItems[expandedListData.index] || []}
        markedLists={(() => {
          // Obtener todas las listas disponibles (todas las del historial)
          const allMarkedLists = []

          // Primero agregar la lista actual
          if (expandedListData.index !== null && history[expandedListData.index]) {
            allMarkedLists.push({
              ...history[expandedListData.index],
              index: expandedListData.index,
              category: null
            })
          }

          // Luego agregar todas las demás listas del historial
          history.forEach((list, index) => {
            // No duplicar la lista actual
            if (index !== expandedListData.index) {
              allMarkedLists.push({
                ...list,
                index: index,
                category: null
              })
            }
          })

          console.log('Prepared markedLists for modal:', allMarkedLists.length, 'lists')
          return allMarkedLists
        })()}
        onSwitchList={(newList) => {
          // Cambiar a la nueva lista seleccionada
          setExpandedListData({
            list: newList.list,
            name: newList.name,
            index: newList.index
          })
        }}
        onToggleItem={(itemIndex) => {
          if (expandedListData.index !== null) {
            toggleItemCompletion(expandedListData.index, itemIndex)
          }
        }}
        onSaveItem={async (itemIndex, newText) => {
          if (expandedListData.index !== null) {
            const newHistory = [...history]
            newHistory[expandedListData.index].list[itemIndex] = newText

            // Actualizar datos del modal expandido
            setExpandedListData({
              ...expandedListData,
              list: newHistory[expandedListData.index].list
            })

            await saveHistory(newHistory)
          }
        }}
        onDeleteItem={async (itemIndex) => {
          if (expandedListData.index !== null) {
            await deleteListItem(expandedListData.index, itemIndex)
          }
        }}
        onAddItem={addNewItemToExpandedList}
        onDeleteList={() => {
          if (expandedListData.index !== null) {
            setExpandedModalVisible(false)
            confirmRemoveListFromHistory(expandedListData.index)
          }
        }}
      />

      {/* Actions Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={actionsModalVisible}
        onRequestClose={() => setActionsModalVisible(false)}
      >
        <View style={modernStyles.modalBackdrop}>
          <View style={modernStyles.actionsModal}>
            <View style={modernStyles.actionsModalHeader}>
              <Text style={modernStyles.actionsModalTitle}>{currentLabels.actions}</Text>
              <TouchableOpacity
                onPress={() => setActionsModalVisible(false)}
                style={modernStyles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={modernStyles.actionsModalContent}>
              {/* Edit Action */}
              <TouchableOpacity
                style={modernStyles.actionModalButton}
                onPress={() => {
                  setEditingIndex(selectedItemIndex)
                  setEditingText(history[selectedItemIndex]?.name || '')
                  setActionsModalVisible(false)
                }}
              >
                <View style={[modernStyles.actionModalIcon, { backgroundColor: '#e0f2fe' }]}>
                  <Ionicons name="pencil" size={20} color="#0284c7" />
                </View>
                <View style={modernStyles.actionModalTextContainer}>
                  <Text style={modernStyles.actionModalButtonText}>{currentLabels.editName}</Text>
                  <Text style={modernStyles.actionModalButtonSubtext}>{currentLabels.editNameDesc}</Text>
                </View>
              </TouchableOpacity>

              {/* Add to Favorites / Already in Favorites */}
              <TouchableOpacity
                style={[
                  modernStyles.actionModalButton,
                  isItemInFavorites(selectedItemIndex) && { opacity: 0.6 }
                ]}
                onPress={() => {
                  if (isItemInFavorites(selectedItemIndex)) {
                    removeFromFavorites(selectedItemIndex)
                  } else {
                    openFavoriteModal(selectedItemIndex)
                  }
                  setActionsModalVisible(false)
                }}
              >
                <View style={[
                  modernStyles.actionModalIcon, 
                  { backgroundColor: isItemInFavorites(selectedItemIndex) ? '#f3f4f6' : '#fecaca' }
                ]}>
                  <Ionicons 
                    name={isItemInFavorites(selectedItemIndex) ? "heart" : "heart-outline"} 
                    size={20} 
                    color={isItemInFavorites(selectedItemIndex) ? "#6b7280" : "#dc2626"} 
                  />
                </View>
                <View style={modernStyles.actionModalTextContainer}>
                  <Text style={modernStyles.actionModalButtonText}>
                    {isItemInFavorites(selectedItemIndex) 
                      ? currentLabels.alreadyInFavorites 
                      : currentLabels.addToFavorites}
                  </Text>
                  <Text style={modernStyles.actionModalButtonSubtext}>
                    {isItemInFavorites(selectedItemIndex) 
                      ? `${currentLabels.savedInCategory}: ${getCategoryDisplayName(selectedItemIndex)}`
                      : currentLabels.addToFavoritesDesc}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Set Reminder - Solo iOS */}
              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={modernStyles.actionModalButton}
                  onPress={() => {
                    openReminderModal(selectedItemIndex)
                    setActionsModalVisible(false)
                  }}
                >
                  <View style={[modernStyles.actionModalIcon, { backgroundColor: '#e9d5ff' }]}>
                    <Ionicons name="notifications-outline" size={20} color="#9333ea" />
                  </View>
                  <View style={modernStyles.actionModalTextContainer}>
                    <Text style={modernStyles.actionModalButtonText}>{currentLabels.createNotification}</Text>
                    <Text style={modernStyles.actionModalButtonSubtext}>{currentLabels.createNotificationDesc}</Text>
                  </View>
                </TouchableOpacity>
              )}

              {/* Share */}
              <TouchableOpacity
                style={modernStyles.actionModalButton}
                onPress={() => {
                  shareShoppingList(history[selectedItemIndex]?.list || [])
                  setActionsModalVisible(false)
                }}
              >
                <View style={[modernStyles.actionModalIcon, { backgroundColor: '#dcfce7' }]}>
                  <Ionicons name="share-outline" size={20} color="#16a34a" />
                </View>
                <View style={modernStyles.actionModalTextContainer}>
                  <Text style={modernStyles.actionModalButtonText}>{currentLabels.shareList}</Text>
                  <Text style={modernStyles.actionModalButtonSubtext}>{currentLabels.shareListDesc}</Text>
                </View>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de selección: Escrito / Hablado */}
      <Modal
        visible={addMethodModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAddMethodModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
            borderRadius: 20,
            padding: 24,
            width: '80%',
            maxWidth: 320,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: theme === 'dark' ? '#f3f4f6' : '#1f2937',
              textAlign: 'center',
              marginBottom: 20,
            }}>
              {currentLabels.addMethod || 'Add method'}
            </Text>

            {/* Written option */}
            <TouchableOpacity
              onPress={handleWrittenOption}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
                borderRadius: 14,
                padding: 16,
                marginBottom: 12,
              }}
              activeOpacity={0.7}
            >
              <View style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 14,
              }}>
                <Ionicons name="pencil" size={22} color="#6366f1" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: theme === 'dark' ? '#f3f4f6' : '#1f2937',
                }}>
                  {currentLabels.writtenOption || 'Written'}
                </Text>
                <Text style={{
                  fontSize: 13,
                  color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                  marginTop: 2,
                }}>
                  {currentLabels.writtenOptionDesc || 'Type products manually'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Spoken option */}
            <TouchableOpacity
              onPress={handleSpokenOption}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
                borderRadius: 14,
                padding: 16,
                marginBottom: 12,
              }}
              activeOpacity={0.7}
            >
              <View style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 14,
              }}>
                <Ionicons name="mic" size={22} color="#ef4444" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: theme === 'dark' ? '#f3f4f6' : '#1f2937',
                }}>
                  {currentLabels.spokenOption || 'Spoken'}
                </Text>
                <Text style={{
                  fontSize: 13,
                  color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                  marginTop: 2,
                }}>
                  {currentLabels.spokenOptionDesc || 'Add products by voice'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Cancel */}
            <TouchableOpacity
              onPress={() => setAddMethodModalVisible(false)}
              style={{
                alignItems: 'center',
                paddingVertical: 12,
              }}
              activeOpacity={0.7}
            >
              <Text style={{
                fontSize: 15,
                color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                fontWeight: '600',
              }}>
                {currentLabels.cancel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de voz para añadir productos */}
      <Modal
        visible={voiceAddModalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={closeVoiceModal}
      >
        <SafeAreaView style={{
          flex: 1,
          backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
        }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: theme === 'dark' ? '#374151' : '#e5e7eb',
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: theme === 'dark' ? '#f3f4f6' : '#1f2937',
              flex: 1,
            }} numberOfLines={1}>
              {addMethodIndex !== null && history[addMethodIndex]
                ? history[addMethodIndex].name
                : ''}
            </Text>
            <TouchableOpacity onPress={closeVoiceModal} style={{ padding: 4 }}>
              <Ionicons name="close" size={24} color={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
            </TouchableOpacity>
          </View>

          {/* Current list items */}
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: theme === 'dark' ? '#9ca3af' : '#6b7280',
              marginTop: 16,
              marginBottom: 8,
            }}>
              {currentLabels.viewList || 'Current list'}
            </Text>
            <ScrollView style={{
              maxHeight: 180,
              marginBottom: 12,
            }}>
              {addMethodIndex !== null && history[addMethodIndex] && history[addMethodIndex].list.map((item, idx) => {
                const itemText = typeof item === 'string' ? item : item.text || item.name || String(item)
                return (
                  <View key={idx} style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                  }}>
                    <View style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: theme === 'dark' ? '#6b7280' : '#9ca3af',
                      marginRight: 10,
                    }} />
                    <Text style={{
                      fontSize: 15,
                      color: theme === 'dark' ? '#d1d5db' : '#374151',
                    }}>
                      {itemText}
                    </Text>
                  </View>
                )
              })}
            </ScrollView>

            {/* Separator */}
            <View style={{
              height: 1,
              backgroundColor: theme === 'dark' ? '#374151' : '#e5e7eb',
              marginVertical: 12,
            }} />

            {/* Listening section */}
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <Animated.View style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                alignItems: 'center',
                justifyContent: 'center',
                transform: [{ scale: voicePulseAnim }],
              }}>
                <View style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: '#ef4444',
                }} />
              </Animated.View>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#ef4444',
                marginTop: 12,
              }}>
                {currentLabels.listening || 'Listening...'}
              </Text>
            </View>

            {/* Detected items */}
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: theme === 'dark' ? '#9ca3af' : '#6b7280',
              marginBottom: 8,
            }}>
              {currentLabels.voiceDetectedItems || 'Detected items'}
            </Text>
            <ScrollView style={{ flex: 1, marginBottom: 16 }}>
              {voiceDetectedItems.length === 0 ? (
                <Text style={{
                  fontSize: 14,
                  color: theme === 'dark' ? '#6b7280' : '#9ca3af',
                  textAlign: 'center',
                  paddingVertical: 20,
                  fontStyle: 'italic',
                }}>
                  {currentLabels.noItemsDetected || 'No items detected yet'}
                </Text>
              ) : (
                voiceDetectedItems.map((item, idx) => (
                  <View key={idx} style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderRadius: 10,
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    marginBottom: 6,
                  }}>
                    <Ionicons name="checkmark-circle" size={18} color="#6366f1" style={{ marginRight: 10 }} />
                    <Text style={{
                      fontSize: 15,
                      fontWeight: '500',
                      color: theme === 'dark' ? '#c7d2fe' : '#4338ca',
                    }}>
                      {item}
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>

          {/* Stop and add button */}
          <View style={{
            paddingHorizontal: 20,
            paddingBottom: 20,
          }}>
            <TouchableOpacity
              onPress={stopVoiceAndAddItems}
              style={{
                backgroundColor: voiceDetectedItems.length > 0 ? '#6366f1' : '#9ca3af',
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: 'center',
              }}
              activeOpacity={0.7}
            >
              <Text style={{
                fontSize: 16,
                fontWeight: '700',
                color: '#fff',
              }}>
                {currentLabels.stopAndAdd || 'Stop and add'} {voiceDetectedItems.length > 0 ? `(${voiceDetectedItems.length})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

export default HistoryScreen
