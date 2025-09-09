"use client"

import { useState, useEffect, useRef } from "react"
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Platform,
  Alert,
  Animated,
  Modal,
  TextInput,
  Image,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Linking,
  StyleSheet,
} from "react-native"
import Voice from "@react-native-community/voice"
import axios from "axios"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as RNLocalize from "react-native-localize"
import { useRoute } from "@react-navigation/native"
import Purchases from "react-native-purchases"
import prompts from "./translations/prompts"
import { useTheme } from "../ThemeContext"
import getStyles from "./Styles/HomeScreenStyles"
import texts from "./translations/texts"
import getModernStyles from "./Styles/HomeScreenModernStyles"
import { 
  realTimeAnalysisPrompts, 
  modalTexts,
  languageNames,
  primerModal,
  settingsModalTexts,
  rateAppTexts,
  costEstimatePrompts
} from "./translations/homeScreenTranslations"
import Sound from "react-native-sound"
import Icon from "react-native-vector-icons/MaterialIcons"

Sound.setCategory("Playback")
const screenHeight = Dimensions.get("window").height
const API_KEY_ANALIZE = process.env.API_KEY_ANALIZE
const API_KEY_CHAT = process.env.API_KEY_CHAT
const screenWidth = Dimensions.get("window").width



const apiClient = axios.create({
  baseURL: API_KEY_CHAT,
  headers: {
    "Content-Type": "application/json",
  },
})

export const sendMessage = (message) => {
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  const promptLanguage = prompts[deviceLanguage] || prompts["en"]

  const promptMessage = `${promptLanguage} "${message}"`

  return apiClient.post("/", {
    model: "gpt-4.1",
    messages: [{ role: "user", content: promptMessage }],
    max_tokens: 100,
  })
}

// Nueva función para análisis en tiempo real
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
    
    // Dividir por comas y limpiar cada elemento
    return result.split(',').map(item => item.trim().toLowerCase())
  } catch (error) {
    console.error("Error analyzing text:", error)
    return []
  }
}

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme()
  const styles = getStyles(theme)
  const route = useRoute()
  const prompt = route.params?.prompt
  const initialList = route.params?.initialList
  const [recognized, setRecognized] = useState("")
  const [started, setStarted] = useState(false)
  const [results, setResults] = useState([])
  const [shoppingList, setShoppingList] = useState([])
  const [history, setHistory] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [editingText, setEditingText] = useState("")
  const [listModalVisible, setListModalVisible] = useState(false)
  const pulseAnim = useRef(new Animated.Value(1)).current
  const pulseAnime = useRef(new Animated.Value(1)).current
  const blinkAnim = useRef(new Animated.Value(1)).current
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  const currentLabels = texts[deviceLanguage] || texts["en"]
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [pressCount, setPressCount] = useState(0)
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true)
  const [titleFontSize, setTitleFontSize] = useState(23)
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const dishName = route.params?.dishName
  const closeModal = route.params?.closeModal
  const [showEmptyListText, setShowEmptyListText] = useState(true)
  const [listType, setListType] = useState("voice")
  const [expandMenu, setExpandMenu] = useState(true)
  const listModalRef = useRef(null)
  const modalText = modalTexts[deviceLanguage] || modalTexts["en"]
  const animationValue = useRef(new Animated.Value(0)).current
  const scrollY = useRef(new Animated.Value(0)).current
  const [lastResponse, setLastResponse] = useState("")
  const [country, setCountry] = useState("")
  const [estimatedCost, setEstimatedCost] = useState(null)
  const [countryModalVisible, setCountryModalVisible] = useState(false)
  const [isCountryEmpty, setIsCountryEmpty] = useState(true)
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false)
  const [showCreatingMessage, setShowCreatingMessage] = useState(false)
  const colorAnim = useRef(new Animated.Value(0)).current
  const [highlightedWords, setHighlightedWords] = useState([]) // Palabras identificadas por AI
  const [isLoading, setIsLoading] = useState(true)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editModalVisibleadd, setEditModalVisibleadd] = useState(false)
  const languageName = languageNames[deviceLanguage] || "English 🇺🇸"
  const [isIdiomasModalVisible, setIsIdiomasModalVisible] = useState(false)
  const [isContentVisible, setIsContentVisible] = useState(true)
  const [hasSeenSubscribeMessage, setHasSeenSubscribeMessage] = useState(false)
  const currentLabelse = primerModal[deviceLanguage] || primerModal["en"]
  const [primerModalVisible, setPrimerModalVisible] = useState(false)
  const [settingsModalVisible, setSettingsModalVisible] = useState(false)
  const [showRateButton, setShowRateButton] = useState(false)
  const rateTexts = rateAppTexts[deviceLanguage] || rateAppTexts["en"]
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Determinar si es tablet o teléfono ya movido a estilos
// Debounce para análisis en tiempo real
  const analysisTimeoutRef = useRef(null)

  // Modern styles moved to Styles/HomeScreenModernStyles.js
  const modernStyles = getModernStyles()

  // Modern styles are now imported from external file

  useEffect(() => {
    const updateAppOpenCount = async () => {
      const currentCountString = await AsyncStorage.getItem("appOpenCount")
      const appOpenCount = Number.parseInt(currentCountString || "0", 10)
      const hasRated = await AsyncStorage.getItem("hasRated")

      if (!hasRated && appOpenCount === 2) {
        await AsyncStorage.setItem("appOpenCount", (appOpenCount + 1).toString())
        setModalVisible(true)
      } else if (!hasRated) {
        await AsyncStorage.setItem("appOpenCount", (appOpenCount + 1).toString())
      }
    }

    updateAppOpenCount()
  }, [])

  const handleRateApp = async () => {
    const url = Platform.select({
      ios: "itms-apps://itunes.apple.com/app/id6505125372?action=write-review",
      android: "market://details?id=YOUR_ANDROID_PACKAGE_NAME",
    })

    try {
      await Linking.openURL(url)
      await AsyncStorage.setItem("hasRated", "true")
      setModalVisible(false)
    } catch (error) {
      console.error("Error opening app store:", error)
    }
  }

  const NumberCircle = ({ number }) => (
    <View style={modernStyles.circle}>
      <Text style={modernStyles.circleText}>{number}</Text>
    </View>
  )

  useEffect(() => {
    const startPulsing = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start()
    }
    startPulsing()
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        const hasShownModal = await AsyncStorage.getItem("modalShown")
        if (!hasShownModal) {
          setPrimerModalVisible(true)
        }
      } catch (e) {
        console.error("Error reading AsyncStorage:", e)
      }
    })()
  }, [])

  const handleCloseprimerModal = async () => {
    try {
      await AsyncStorage.setItem("modalShown", "true")
      setPrimerModalVisible(false)
      startRecognizing()
    } catch (e) {
      console.error("Error saving to AsyncStorage:", e)
    }
  }

  const handleCloseprimerModalCerrar = async () => {
    try {
      await AsyncStorage.setItem("modalShown", "true")
      setPrimerModalVisible(false)
    } catch (e) {
      console.error("Error saving to AsyncStorage:", e)
    }
  }

  useEffect(() => {
    const checkSubscribeMessage = async () => {
      const hasSeen = await AsyncStorage.getItem("hasSeenSubscribeMessage")
      if (!hasSeen) {
        setHasSeenSubscribeMessage(true)
      }
    }
    checkSubscribeMessage()
  }, [])

  const handleSubscribePress = async () => {
    await AsyncStorage.setItem("hasSeenSubscribeMessage", "true")
    setHasSeenSubscribeMessage(false)
    navigation.navigate("Suscribe")
  }

  useEffect(() => {
    const checkVisibility = async () => {
      const value = await AsyncStorage.getItem("isContentVisible")
      if (value !== null) {
        setIsContentVisible(JSON.parse(value))
      }
    }

    checkVisibility()
  }, [])

  const listener = Purchases.addCustomerInfoUpdateListener((customerInfo) => {
    console.log("Información del cliente actualizada:", customerInfo)
    if (customerInfo.entitlements.active["12981"]) {
      console.log("Usuario ya suscrito")
      setIsSubscribed(true)
    } else {
      console.log("Usuario no suscrito")
      setIsSubscribed(false)
    }
  })

  useEffect(() => {
    const initializePurchases = async () => {
      try {
        await Purchases.setDebugLogsEnabled(true)
        await Purchases.configure({ apiKey: "appl_bHxScLAZLsKxfggiOiqVAZTXjJX" })

        const customerInfo = await Purchases.getCustomerInfo()
        console.log("Información del cliente:", customerInfo)

        if (customerInfo.entitlements.active["12981"]) {
          console.log("Usuario ya suscrito")
          setIsSubscribed(true)
        } else {
          console.log("Usuario no suscrito")
          setIsSubscribed(false)
        }
      } catch (error) {
        console.log("Error al obtener la información del comprador:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const handleCustomerInfoUpdate = (info) => {
      console.log("Información del cliente actualizada:", info)
      if (info.entitlements.active["12981"]) {
        console.log("Usuario ya suscrito")
        setIsSubscribed(true)
      } else {
        console.log("Usuario no suscrito")
        setIsSubscribed(false)
      }
    }

    initializePurchases()

    return () => {
      Purchases.removeCustomerInfoUpdateListener(handleCustomerInfoUpdate)
    }
  }, [])

  const textColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#009688", "#00bcd4"],
  })

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(colorAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ]),
    ).start()
  }, [colorAnim])

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadHistory()
    })

    return unsubscribe
  }, [navigation])

  useEffect(() => {
    const loadCountry = async () => {
      try {
        const savedCountry = await AsyncStorage.getItem("@country")
        if (savedCountry !== null) {
          setCountry(savedCountry)
          setIsCountryEmpty(savedCountry.trim() === "")
        }
      } catch (error) {
        console.error("Error loading country: ", error)
      }
    }

    loadCountry()
  }, [])

  const handleCountryChange = (text) => {
    setCountry(text)
    setIsCountryEmpty(text.trim() === "")
  }

  const handleSaveCountry = async () => {
    if (!isCountryEmpty) {
      try {
        if (!isSubscribed) {
          Alert.alert("Subscription Required", "You must be subscribed to calculate the estimated cost.", [
            {
              text: "Subscribe",
              onPress: () => {
                setCountryModalVisible(false)
                navigation.navigate("Suscribe")
              },
            },
            { text: "Cancel", style: "cancel" },
          ])
          return
        }

        await AsyncStorage.setItem("@country", country)
        setCountryModalVisible(false)
        await fetchEstimatedCost()

        setTimeout(() => {
          if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true })
          }
        }, 200)
      } catch (error) {
        console.error("Error saving country: ", error)
      }
    }
  }

  const flatListRef = useRef(null)
  useEffect(() => {
    if (flatListRef.current && estimatedCost) {
      flatListRef.current.scrollToEnd({ animated: true })
    }
  }, [estimatedCost])

  const fetchEstimatedCost = async () => {
    setLoading(true)
    if (!country) {
      Alert.alert("Error", "Please enter a country.")
      return
    }

    const deviceLanguage = RNLocalize.getLocales()[0].languageCode
    const estimatePrompt = costEstimatePrompts[deviceLanguage] || costEstimatePrompts["en"]

    try {
      const response = await axios.post(API_KEY_ANALIZE, {
        model: "gpt-4.1",
        max_tokens: 200,
        messages: [
          {
            role: "system",
            content: estimatePrompt.replace("${country}", country),
          },
          {
            role: "user",
            content: shoppingList.join(", "),
          },
        ],
      })
      const estimatedCostResponse = response.data.choices[0].message.content
      setEstimatedCost(`${estimatedCostResponse}`)
      setLoading(false)

      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true })
      }
    } catch (error) {
      console.error("Error fetching estimated cost: ", error)
      Alert.alert("Error", "Could not fetch the estimated cost.")
      setLoading(false)
    }
  }

  useEffect(() => {
    Animated.timing(animationValue, {
      toValue: expandMenu ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [expandMenu])

  useEffect(() => {
    setShoppingList([])
    setShowEmptyListText(true)
  }, [listType])

  useEffect(() => {
    if (shoppingList.length > 0) {
      setShowEmptyListText(false)
    } else {
      setShowEmptyListText(true)
    }
  }, [shoppingList])

  useEffect(() => {
    if (history.length > 0 || shoppingList.length > 0) {
      setTitleFontSize(16)
    } else {
      setTitleFontSize(23)
    }
  }, [history, shoppingList])

  useEffect(() => {
    const initializePressCount = async () => {
      try {
        const count = await AsyncStorage.getItem("@press_count")
        if (count !== null) {
          setPressCount(Number.parseInt(count))
        }
      } catch (e) {
        console.error("Error loading press count: ", e)
      }
    }

    const listener = Purchases.addCustomerInfoUpdateListener((customerInfo) => {
      if (customerInfo.entitlements.active["semana16"]) {
        setIsSubscribed(true)
      } else {
        setIsSubscribed(false)
      }
    })

    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start()

    loadHistory()
    Voice.onSpeechStart = onSpeechStart
    Voice.onSpeechRecognized = onSpeechRecognized
    Voice.onSpeechResults = onSpeechResults

    return () => {
      Voice.destroy().then(Voice.removeAllListeners)
    }
  }, [prompt])

  const onSpeechStart = () => {
    setStarted(true)
    setShowEmptyListText(false)
    setShowWelcomeMessage(false)
    setShowResults(false)
    setLoading(false)
    setShowCreatingMessage(true)
    startPulseAnimation()
    setEstimatedCost(null)
    setHighlightedWords([]) // Limpiar palabras resaltadas anteriores
  }

  const onSpeechRecognized = () => {
    setRecognized("√")
  }

  const onSpeechResults = async (e) => {
    const items = e.value
    setResults(items)

    // Análisis en tiempo real con debounce
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current)
    }

    analysisTimeoutRef.current = setTimeout(async () => {
      if (items.length > 0) {
        const latestText = items[items.length - 1]
        const identifiedItems = await analyzeTextRealTime(latestText)
        setHighlightedWords(identifiedItems)
      }
    }, 500) // Esperar 500ms después de la última actualización
  }

  const renderLiveResults = () => {
    const deviceLanguage = RNLocalize.getLocales()[0].languageCode
    const primerModal = settingsModalTexts[deviceLanguage] || settingsModalTexts["en"]
    
    return (
      <View style={modernStyles.liveResultsContainer}>
        <View style={modernStyles.liveResultsCard}>
          <View style={modernStyles.listeningHeader}>
            <View style={modernStyles.pulsingDot} />
            <Text style={modernStyles.listeningText}> {primerModal.listening}</Text>
          </View>

          {results.map((item, index) => (
            <View key={index} style={modernStyles.resultItem}>
              <Text style={modernStyles.resultText}>
                {item.split(" ").map((word, idx) => {
                  const cleanedWord = word.replace(/[.,!?]/g, "").toLowerCase()
                  const isHighlighted = highlightedWords.some(highlightedWord => 
                    cleanedWord.includes(highlightedWord) || highlightedWord.includes(cleanedWord)
                  )

                  return (
                    <Text key={idx}>
                      {isHighlighted ? (
                        <Animated.Text style={[modernStyles.highlightedWord, { color: textColor }]}>
                          {word}
                        </Animated.Text>
                      ) : (
                        <Text style={modernStyles.normalWord}>{word}</Text>
                      )}{" "}
                    </Text>
                  )
                })}
              </Text>
            </View>
          ))}

          <View style={modernStyles.tipContainer}>
            <Text style={modernStyles.tipText}>{primerModal.palabras}</Text>
          </View>
        </View>
      </View>
    )
  }

  const languageMap = {
    en: "en-US",
    es: "es-ES",
    de: "de-DE",
    fr: "fr-FR",
    it: "it-IT",
    pt: "pt-PT",
    nl: "nl-NL",
    sv: "sv-SE",
    da: "da-DK",
    fi: "fi-FI",
    no: "no-NO",
    ru: "ru-RU",
    zh: "zh-CN",
    ja: "ja-JP",
    ko: "ko-KR",
    ar: "ar-SA",
    he: "he-IL",
  }

  const startRecognizing = async () => {
    const deviceLanguage = RNLocalize.getLocales()[0].languageCode
    const recognitionLanguage = languageMap[deviceLanguage] || "en-US"

    if (started) {
      try {
        await Voice.stop()
        setStarted(false)
        setShowEmptyListText(true)
        setHighlightedWords([]) // Limpiar palabras resaltadas
      } catch (e) {
        console.error(e)
        Alert.alert("Error", "Error stopping voice recognition.")
      }
    } else {
      try {
        await Voice.start(recognitionLanguage)
        setRecognized("")
        setResults([])
        setStarted(true)
        setHighlightedWords([]) // Limpiar palabras resaltadas al iniciar
        if (!isSubscribed) {
          const newPressCount = pressCount + 1
          setPressCount(newPressCount)
          await AsyncStorage.setItem("@press_count", newPressCount.toString())
        }
      } catch (e) {
        console.error(e)
        Alert.alert("Error", `Error starting voice recognition in ${recognitionLanguage}.`)
      }
    }
  }

  const openAppSettings = () => {
    Linking.openSettings()
  }

  const stopRecognizing = async () => {
    try {
      setLoading(true)
      setShowCreatingMessage(false)

      // Limpiar timeout de análisis
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current)
      }

      setTimeout(async () => {
        await Voice.stop()
        setStarted(false)

        if (results.length === 0) {
          setShowEmptyListText(true)
          setShowResults(false)
          setLoading(false)
          setSettingsModalVisible(true)
          setHighlightedWords([]) // Limpiar palabras resaltadas
          return
        }

        const detectedDishName = results.find((item) => item.toLowerCase().includes("para hacer")) || null
        const cleanedDishName = detectedDishName ? detectedDishName.replace(/.*para hacer\s*/i, "").trim() : null

        if (cleanedDishName) {
          navigation.setParams({ dishName: cleanedDishName })
        }

        const response = await sendMessage(results.join(", "))
        const generatedList = response.data.choices[0].message.content.split("\n").map((item) => item.trim())
        setShoppingList(generatedList)
        saveShoppingList(generatedList)

        setLastResponse(response.data.choices[0].message.content)

        if (generatedList.length > 0) {
          setShowEmptyListText(false)
          setShowResults(true)
        } else {
          setShowEmptyListText(true)
          setShowResults(false)
        }

        setLoading(false)
        setHighlightedWords([]) // Limpiar palabras resaltadas después de procesar
      }, 500)
    } catch (e) {
      console.error(e)
      Alert.alert("Error", "Error stopping voice recognition.")
      setLoading(false)
      setHighlightedWords([]) // Limpiar palabras resaltadas en caso de error
    }
  }

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }

  const saveEditedItem = () => {
    const newList = [...shoppingList]
    newList[editingIndex] = editingText
    setShoppingList(newList)
    saveShoppingList(newList)
    setEditingText("")
    setEditModalVisible(false)
  }

  const saveEditedItemadd = () => {
    if (editingText.trim() !== "") {
      const newList = [...shoppingList, editingText]
      setShoppingList(newList)
      saveShoppingList(newList)
    }
    setEditingText("")
    setEditModalVisibleadd(false)
  }

  const closeEditModalAdd = () => {
    setEditingText("")
    setEditModalVisibleadd(false)
  }

  const editItem = (index) => {
    setEditingIndex(index)
    setEditingText(shoppingList[index])
    setEditModalVisible(true)
    setEstimatedCost(null)
  }

  const renderItem = ({ item, index }) => {
    if (item === currentLabels.costdelalista) {
      return (
        <TouchableOpacity onPress={() => setCountryModalVisible(true)}>
          <View style={modernStyles.costButtonContaineriumage}>
            <Text style={modernStyles.costButtonText}>{estimatedCost || item}</Text>
          </View>
        </TouchableOpacity>
      )
    }

    if (index === shoppingList.length) {
      return (
        <TouchableOpacity onPress={() => addNewItem()}>
          <View style={modernStyles.addButtonContainer}>
            <Ionicons name="add-circle" size={32} color="grey" />
          </View>
        </TouchableOpacity>
      )
    }
    return (
      <View style={modernStyles.itemContainer}>
        <Text style={modernStyles.itemText}>{item}</Text>
        <View style={modernStyles.iconsContainer}>
          <TouchableOpacity onPress={() => editItem(index)}>
            <Ionicons name="pencil" size={24} style={modernStyles.editIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => removeItem(index)}>
            <Ionicons name="close" size={28} style={modernStyles.closeIcon} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const addNewItem = () => {
    setEditingText("")
    setEditModalVisibleadd(true)
    setEstimatedCost(null)
  }

  const clearShoppingList = () => {
    setShoppingList([])
    saveShoppingList([])
  }

  const removeItem = (index) => {
    const newList = [...shoppingList]
    newList.splice(index, 1)
    setShoppingList(newList)
    saveShoppingList(newList)
    setEstimatedCost(null)
  }

  const saveShoppingList = async (list) => {
    try {
      await AsyncStorage.setItem("@shopping_list", JSON.stringify(list))
    } catch (e) {
      console.error("Error saving shopping list: ", e)
    }
  }

  const generateGenericListName = () => {
    const existingNumbers = history
      .map((item) => {
        const match = item.name.match(/^.* (\d+)$/)
        return match ? Number.parseInt(match[1], 10) : null
      })
      .filter((number) => number !== null)

    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1
    return `${currentLabels.list} ${nextNumber}`
  }

  const saveToHistory = async () => {
    if (shoppingList.length === 0) return

    const providedDishName = route.params?.dishName
    const newDishName = providedDishName || generateGenericListName()
    const newHistory = [...history, { list: shoppingList, name: newDishName }]

    try {
      await AsyncStorage.setItem("@shopping_history", JSON.stringify(newHistory))
      setHistory(newHistory)
      setShoppingList([])
      await AsyncStorage.setItem("@shopping_list", JSON.stringify([]))
      setModalVisible(false)
      setConfirmationModalVisible(true)
      navigation.setParams({ dishName: null })
      setTimeout(() => setConfirmationModalVisible(false), 2000)
    } catch (e) {
      console.error("Error saving to history: ", e)
    }
  }

  const handlePress = () => {
    setIsIdiomasModalVisible(true)
    setIsContentVisible(false)
    AsyncStorage.setItem("isContentVisible", JSON.stringify(false))
  }

  const handleCloseModal = () => {
    setIsIdiomasModalVisible(false)
    setIsContentVisible(false)
  }

  const ConfirmationModal = () => (
    <Modal visible={confirmationModalVisible} transparent={true} animationType="fade">
      <View style={modernStyles.confirmationModalContainer}>
        <View style={modernStyles.confirmationModalContent}>
          <Image source={require("../assets/images/checked.png")} style={modernStyles.confirmationImage} />
          <Text style={modernStyles.confirmationText}>{currentLabels.listSaved}</Text>
        </View>
      </View>
    </Modal>
  )

  const SettingsModal = ({ visible, onClose, onOpenSettings }) => {
    const deviceLanguage = RNLocalize.getLocales()[0].languageCode
    const currentLabels = settingsModalTexts[deviceLanguage] || settingsModalTexts["en"]

    return (
      <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
        <View style={modernStyles.primermodalView}>
          <ScrollView contentContainerStyle={modernStyles.scrollViewContent}>
            <View style={modernStyles.modalView}>
              <Text style={modernStyles.modalTitleprimermodal}>{currentLabels.title}</Text>
              <Text style={modernStyles.modalText}>{currentLabels.message}</Text>
            </View>
            <TouchableOpacity style={modernStyles.modalButtonSettins} onPress={onOpenSettings}>
              <Text style={modernStyles.modalButtonTextSettins}>{currentLabels.goSettings}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={modernStyles.modalButtonno} onPress={onClose}>
              <Ionicons name="close" size={32} color="white" style={modernStyles.icon} />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    )
  }

  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem("@shopping_history")
      if (savedHistory !== null) {
        setHistory(JSON.parse(savedHistory))
      }
    } catch (e) {
      console.error("Error loading history: ", e)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  const renderVoiceButton = () => {
    if (shoppingList.length > 0) {
      return (
        <View style={modernStyles.actionButtonsContainer}>
          <View style={modernStyles.buttonRow}>
            {/* Delete Button */}
            {shoppingList.length > 0 && !started && !loading && (
              <TouchableOpacity style={modernStyles.deleteButton} onPress={clearShoppingList}>
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
                <Text style={modernStyles.deleteButtonText}>{currentLabels.deleteList}</Text>
              </TouchableOpacity>
            )}

            {/* Add Button */}
            {shoppingList.length > 0 && !started && !loading && (
              <TouchableOpacity style={modernStyles.addButton} onPress={() => addNewItem()}>
                <Ionicons name="add-circle" size={28} color="#6b7280" />
              </TouchableOpacity>
            )}

            {/* Save Button */}
            {shoppingList.length > 0 && !started && !loading && (
              <TouchableOpacity style={modernStyles.saveButton} onPress={saveToHistory}>
                <Ionicons name="checkmark-circle-outline" size={22} color="#10b981" />
                <Text style={modernStyles.saveButtonText}>{currentLabels.saveList}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )
    } else {
      return (
        <View style={modernStyles.voiceButtonContainer}>
          <TouchableOpacity
            onPress={started ? stopRecognizing : startRecognizing}
            style={modernStyles.voiceButtonWrapper}
          >
            <Animated.View
              style={[
                modernStyles.voiceButton,
                { transform: [{ scale: pulseAnim }] },
                started ? modernStyles.voiceButtonActive : modernStyles.voiceButtonInactive,
              ]}
            >
              {started ? (
                <Ionicons name="stop" size={32} color="white" />
              ) : (
                <Ionicons name="mic-outline" size={34} color="white" />
              )}
            </Animated.View>

            {!started && (
              <Text style={modernStyles.voiceButtonSubtitle}>
                {currentLabels.voiceLists}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )
    }
  }

  return (
    <SafeAreaView style={modernStyles.mainContainer}>
      <View style={modernStyles.publicidad}>
        <SettingsModal
          visible={settingsModalVisible}
          onClose={() => setSettingsModalVisible(false)}
          onOpenSettings={openAppSettings}
        />
      </View>
      
      {loading && (
        <View style={modernStyles.overlay}>
          <View style={modernStyles.loaderContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
          </View>
        </View>
      )}

      {!loading && showEmptyListText && !showCreatingMessage && (
        <View style={modernStyles.emptyStateContainer}>
          <View style={modernStyles.emptyStateContent}>
            <View style={modernStyles.iconContainer}>
              <Image
                source={require("../assets/images/56643483-cfa4-4b4e-a5ca-2e751345bad0-1.png")}
                style={modernStyles.emptyStateIcon}
              />
            </View>

            {isContentVisible && (
              <TouchableOpacity onPress={handlePress} style={modernStyles.languageButton}>
                <Ionicons name="globe-outline" size={20} color="#6366f1" />
                <Text style={modernStyles.languageButtonText}>
                  {currentLabels.welcomeMessage} {languageName}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {!loading && showCreatingMessage && (
        <View style={modernStyles.creatingContainer}>
          <View style={modernStyles.creatingHeader}>
            {results.length === 0 && (
              <View style={modernStyles.micContainer}>
                <View style={modernStyles.micIconWrapper}>
                  <Ionicons name="mic" size={28} color="white" />
                </View>
                <Animated.Text style={[modernStyles.creatingTitle, { color: textColor }]}>
                  {currentLabels.pressAndSpeaktext}
                </Animated.Text>
               
              </View>
            )}
          </View>

          {renderLiveResults()}

          {results.length > 0 && (
            <View style={modernStyles.processingContainer}>
              <View style={modernStyles.processingHeader}>
                <View style={modernStyles.processingDot} />
                <Text style={modernStyles.processingText}>{currentLabels.creandoLista}</Text>
                <View style={modernStyles.processingDot} />
              </View>

              <TouchableOpacity onPress={stopRecognizing} style={modernStyles.showListButton}>
                <Ionicons name="cart-outline" size={24} color="white" />
                <Text style={modernStyles.showListButtonText}>{currentLabels.mostarlista}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {!loading && showResults && (
        <FlatList
          ref={flatListRef}
          data={shoppingList.length > 0 ? [...shoppingList, currentLabels.costdelalista] : []}
          renderItem={({ item, index }) => {
            if (item === currentLabels.costdelalista) {
              return (
                <TouchableOpacity onPress={() => setCountryModalVisible(true)} style={modernStyles.costButtonWrapper}>
                  <View style={modernStyles.costButton}>
                    <Text style={modernStyles.costButtonText}>{estimatedCost || item}</Text>
                  </View>
                </TouchableOpacity>
              )
            }

            if (index === shoppingList.length) {
              return (
                <TouchableOpacity onPress={() => addNewItem()} style={modernStyles.addItemWrapper}>
                  <View style={modernStyles.addItemButton}>
                    <Ionicons name="add-circle" size={32} color="#6b7280" />
                    <Text style={modernStyles.addItemText}>Agregar artículo</Text>
                  </View>
                </TouchableOpacity>
              )
            }

            return (
              <View style={modernStyles.listItem}>
                <View style={modernStyles.listItemContent}>
                  <View style={modernStyles.bulletPoint} />
                  <Text style={modernStyles.listItemText}>{item}</Text>
                </View>

                <View style={modernStyles.listItemActions}>
                  <TouchableOpacity onPress={() => editItem(index)} style={modernStyles.editButton}>
                    <Ionicons name="pencil" size={18} color="#6366f1" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeItem(index)} style={modernStyles.removeButton}>
                    <Ionicons name="close" size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            )
          }}
          keyExtractor={(item, index) => index.toString()}
          style={modernStyles.flatList}
          contentContainerStyle={modernStyles.flatListContent}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        />
      )}

      {renderVoiceButton()}
      <ConfirmationModal />

      {/* Rate App Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={modernStyles.rateModalContainer}>
          <View style={modernStyles.rateModalContent}>
            <Text style={modernStyles.rateModalTitle}>{rateTexts.rateTitle}</Text>
            <Text style={modernStyles.rateModalMessage}>{rateTexts.rateMessage}</Text>
            <View style={modernStyles.rateModalButtons}>
              <TouchableOpacity style={modernStyles.rateButton} onPress={handleRateApp}>
                <Text style={modernStyles.rateButtonText}>{rateTexts.rateButton}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={modernStyles.notNowButton} onPress={() => setModalVisible(false)}>
                <Text style={modernStyles.notNowButtonText}>{rateTexts.notNowButton}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Other Modals */}
      <Modal visible={listModalVisible} animationType="slide" onRequestClose={() => setListModalVisible(false)}>
        <View style={modernStyles.modalContainer}>
          <Text style={modernStyles.modalTitle}>{currentLabels.createShoppingList}</Text>
          <TextInput
            style={modernStyles.modalInput}
            placeholder={currentLabels.writeItems}
            multiline
            value={editingText}
            onChangeText={setEditingText}
          />
          <TouchableOpacity
            style={modernStyles.modalButton}
            onPress={() => {
              const newList = editingText
                .split("\n")
                .map((item) => item.trim())
                .filter((item) => item)
              setShoppingList(newList)
              saveShoppingList(newList)
              setEditingText("")
              setListModalVisible(false)
            }}
          >
            <Text style={modernStyles.modalButtonText}>{currentLabels.save}</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        visible={countryModalVisible}
        animationType="slide"
        onRequestClose={() => setCountryModalVisible(false)}
        transparent={true}
      >
        <View style={modernStyles.modalContaineri}>
  
          {!isSubscribed && (
            <View style={modernStyles.subscriptionBanner}>
              <Ionicons name="lock-closed-outline" size={20} color="#e91e63" style={{ marginRight: 6 }} />
              <Text style={modernStyles.subscriptionBannerText}>Subscription Required</Text>
            </View>
          )}

          <TextInput
            style={modernStyles.modalInput}
            placeholder={currentLabels.cityNamePlaceholder}
            placeholderTextColor="#b8b8b8ab"
            value={country}
            onChangeText={handleCountryChange}
          />

          <TouchableOpacity
            style={[modernStyles.modalButton, isCountryEmpty && { backgroundColor: "#ccc" }]}
            onPress={handleSaveCountry}
            disabled={isCountryEmpty}
          >
            <Text style={modernStyles.modalButtonText}>{`${currentLabels.viewCost} ${country}`}</Text>
          </TouchableOpacity>
                  <TouchableOpacity style={modernStyles.closeIconContainer} onPress={() => setCountryModalVisible(false)}>
            <Ionicons name="close-circle" size={32} color="white" />
          </TouchableOpacity>

        </View>
      </Modal>

      <Modal
        visible={editModalVisible}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
        transparent={true}
      >
        <View style={modernStyles.modalContaineris}>
          <Text style={modernStyles.modalTitle}>{currentLabels.editItem}</Text>
          <TextInput
            style={modernStyles.modalInput}
            placeholder={currentLabels.writeItems}
            placeholderTextColor="#b8b8b8ab"
            multiline
            value={editingText}
            onChangeText={setEditingText}
          />
          <TouchableOpacity style={modernStyles.modalButton} onPress={saveEditedItem}>
            <Text style={modernStyles.modalButtonText}>{currentLabels.save}</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={editModalVisibleadd} animationType="slide" onRequestClose={closeEditModalAdd} transparent={true}>
        <View style={modernStyles.modalContaineris}>
      
          <TextInput
            style={modernStyles.modalInput}
            placeholder={currentLabels.writeHereWhatToAdd}
            placeholderTextColor="#b8b8b8ab"
            multiline
            value={editingText}
            onChangeText={setEditingText}
          />
          <TouchableOpacity style={modernStyles.modalButton} onPress={saveEditedItemadd}>
            <Text style={modernStyles.modalButtonText}>{currentLabels.addNewItembutton}</Text>
          </TouchableOpacity>


         
                  <TouchableOpacity style={modernStyles.closeIconContainer} onPress={saveEditedItemadd}>
            <Ionicons name="close-circle" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={isIdiomasModalVisible} transparent={true} animationType="slide" onRequestClose={handleCloseModal}>
        <View style={modernStyles.modalContaineridiomas}>
          <View style={modernStyles.modalContentidiomas}>
            <Text style={modernStyles.modalButtonTexteidi}>{languageName}</Text>
            <Image
              source={require("../assets/images/microfono.png")}
              style={modernStyles.modalImage}
            />
            <Text style={modernStyles.modalButtonTexte}>{currentLabels.changeLanguage}</Text>

            <TouchableOpacity onPress={handleCloseModal} style={modernStyles.closeButton}>
              <Ionicons name="close" size={32} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={primerModalVisible}
        onRequestClose={() => {
          setPrimerModalVisible(!primerModalVisible)
        }}
      >
        <View style={modernStyles.primermodalView}>
          <ScrollView contentContainerStyle={modernStyles.scrollViewContent}>
            <View style={modernStyles.modalView}>
              <Text style={modernStyles.modalTitleprimermodal}>{currentLabelse.title}</Text>
              <View style={modernStyles.stepContainer}>
                <NumberCircle number="1" />
                <Text style={modernStyles.modalText}>{currentLabelse.step1}</Text>
              </View>
              <View style={modernStyles.stepContainer}>
                <NumberCircle number="2" />
                <Text style={modernStyles.modalText}>{currentLabelse.step2}</Text>
              </View>
              <Text style={modernStyles.modalTextex}>{currentLabelse.step2Example}</Text>
              <View style={modernStyles.stepContainer}>
                <NumberCircle number="3" />
                <Text style={modernStyles.modalText}>{currentLabelse.step3}</Text>
              </View>
            </View>
            <TouchableOpacity style={modernStyles.modalButton} onPress={handleCloseprimerModal}>
              <Icon name="mic" size={25} color="white" style={modernStyles.icon} />
              <Text style={modernStyles.modalButtonText}>{currentLabelse.createList}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={modernStyles.modalButtonnos} onPress={handleCloseprimerModalCerrar}>
              <Icon name="close" size={25} color="white" style={modernStyles.icon} />
              <Text style={modernStyles.modalButtonText}>{currentLabelse.nowNot}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default HomeScreen