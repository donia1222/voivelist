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
  KeyboardAvoidingView,
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
import { useRecording } from "../RecordingContext"
import { useHaptic } from "../HapticContext"
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
  costEstimatePrompts,
  voiceInfoTexts
} from "./translations/homeScreenTranslations"
import Sound from "react-native-sound"
import DeviceService from "../services/DeviceService"
import WidgetService from "../services/WidgetService"

Sound.setCategory("Playback")
const screenHeight = Dimensions.get("window").height
const API_KEY_ANALIZE = process.env.API_KEY_ANALIZE
const API_KEY_CHAT = process.env.API_KEY_CHAT
const screenWidth = Dimensions.get("window").width


// Mini loader component for bubble loading
const BubbleLoader = () => {
  const dot1Anim = useRef(new Animated.Value(0)).current
  const dot2Anim = useRef(new Animated.Value(0)).current  
  const dot3Anim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const createDotAnimation = (anim, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      )
    }

    const animations = Animated.parallel([
      createDotAnimation(dot1Anim, 0),
      createDotAnimation(dot2Anim, 150),
      createDotAnimation(dot3Anim, 300),
    ])

    animations.start()

    return () => animations.stop()
  }, [])

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
    }}>
      {[dot1Anim, dot2Anim, dot3Anim].map((anim, index) => (
        <Animated.View
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: 'rgba(99, 102, 241, 0.7)',
            marginHorizontal: 4,
            opacity: anim,
            transform: [{ 
              scale: Animated.add(0.5, Animated.multiply(anim, 0.5)) 
            }],
          }}
        />
      ))}
    </View>
  )
}

// Floating background food icons component
const FloatingFoodIcon = ({ icon, index, delay = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const translateYAnim = useRef(new Animated.Value(0)).current
  const rotateAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Aparecer inmediatamente
    Animated.timing(fadeAnim, {
      toValue: 0.6,
      duration: 1000,
      delay: delay,
      useNativeDriver: true,
    }).start()

    // Animación continua de flotación
    const floatAnimation = () => {
      Animated.sequence([
        Animated.timing(translateYAnim, {
          toValue: -20,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 20,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]).start(() => floatAnimation())
    }

    // Animación continua de rotación
    const rotateAnimation = () => {
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]).start(() => rotateAnimation())
    }

    const floatTimeout = setTimeout(floatAnimation, delay + 500)
    const rotateTimeout = setTimeout(rotateAnimation, delay + 1000)

    return () => {
      clearTimeout(floatTimeout)
      clearTimeout(rotateTimeout)
    }
  }, [])

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '15deg'],
  })

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: `${15 + (index * 12) % 70}%`,
        top: `${5 + (index * 8) % 20}%`,
        opacity: fadeAnim,
        transform: [
          { translateY: translateYAnim },
          { rotate: rotation },
        ],
      }}
    >
      <Ionicons 
        name={icon} 
        size={28 + (index % 3) * 6} 
        color={index % 3 === 0 ? 'rgba(74, 107, 255, 0.5)' : // Azul
              index % 3 === 1 ? 'rgba(16, 185, 129, 0.5)' : // Verde
                               'rgba(239, 68, 68, 0.5)'}    // Rojo
      />
    </Animated.View>
  )
}

// Animated floating item component for detected grocery items
const AnimatedFloatingItem = ({ text, index, delay = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.3)).current
  const translateYAnim = useRef(new Animated.Value(20)).current

  useEffect(() => {
    // Solo animación de entrada - NO desaparece automáticamente
    const animations = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay: delay,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 120,
        friction: 6,
        delay: delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 300,
        delay: delay,
        useNativeDriver: true,
      }),
    ])

    animations.start()

    return () => animations.stop()
  }, [text, delay])

  const bubbleColors = [
    'rgba(99, 102, 241, 0.15)', // Blue
    'rgba(16, 185, 129, 0.15)', // Green  
    'rgba(245, 158, 11, 0.15)', // Yellow
    'rgba(239, 68, 68, 0.15)',  // Red
    'rgba(139, 92, 246, 0.15)', // Purple
  ]

  const borderColors = [
    'rgba(99, 102, 241, 0.4)',
    'rgba(16, 185, 129, 0.4)',
    'rgba(245, 158, 11, 0.4)',
    'rgba(239, 68, 68, 0.4)',
    'rgba(139, 92, 246, 0.4)',
  ]

  const colorIndex = index % bubbleColors.length

  return (
    <Animated.View
      style={[
        {
          backgroundColor: bubbleColors[colorIndex],
          borderColor: borderColors[colorIndex],
          borderWidth: 1,
          borderRadius: 16,
          paddingHorizontal: 12,
          paddingVertical: 6,
          margin: 3,
          shadowColor: borderColors[colorIndex],
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: translateYAnim },
          ],
        },
      ]}
    >
      <Text
        style={{
          color: '#1f2937',
          fontWeight: '600',
          fontSize: 14,
          textAlign: 'center',
        }}
      >
        {text}
      </Text>
    </Animated.View>
  )
}



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
  const { setIsRecording } = useRecording()
  const { triggerHaptic } = useHaptic()
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
  const secondaryPulse = useRef(new Animated.Value(1)).current
  const shimmerAnim = useRef(new Animated.Value(0)).current
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  const currentLabels = texts[deviceLanguage] || texts["en"]
  const voiceTexts = voiceInfoTexts[deviceLanguage] || voiceInfoTexts["en"]
  const [isSubscribed, setIsSubscribed] = useState(null)
  const [pressCount, setPressCount] = useState(0)
  const [voiceLimitModalVisible, setVoiceLimitModalVisible] = useState(false)
  const [deviceVoiceCount, setDeviceVoiceCount] = useState(0)
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
  const emptyStateFadeAnim = useRef(new Animated.Value(0)).current
  const [highlightedWords, setHighlightedWords] = useState([]) // Palabras identificadas por AI
  const [showBubbleLoader, setShowBubbleLoader] = useState(false) // Mini loader para burbujas
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

  // Food icons for background animation
  const foodIcons = [
    'fish-outline', 'pizza-outline', 'wine-outline', 'leaf-outline',
    'restaurant-outline', 'nutrition-outline', 'egg-outline', 'ice-cream-outline',
    'cafe-outline', 'beer-outline', 'fast-food-outline', 'basket-outline'
  ]

  const renderFloatingFoodIcons = () => {
    return (
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
      }}>
        {foodIcons.map((icon, index) => (
          <FloatingFoodIcon
            key={icon}
            icon={icon}
            index={index}
            delay={index * 500}
          />
        ))}
      </View>
    )
  }

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

  // Handle deep links from widget
  useEffect(() => {
    const handleDeepLink = (url) => {
      if (!url) return
      
      if (url.url?.includes('voicelist://create')) {
        // Start voice recording when opened from widget
        startRecording()
      } else if (url.url?.includes('voicelist://favorites')) {
        // Navigate to favorites/history screen
        navigation.navigate('History')
      }
    }

    // Handle initial URL when app is opened
    Linking.getInitialURL().then(url => {
      if (url) handleDeepLink({ url })
    })

    // Listen for URL changes while app is open
    const subscription = Linking.addEventListener('url', handleDeepLink)

    return () => {
      subscription?.remove()
    }
  }, [navigation])

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


  useEffect(() => {
    const startPulsing = () => {
      // Primary pulse animation
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

      // Secondary pulse animation (delayed and different rhythm)
      Animated.loop(
        Animated.sequence([
          Animated.timing(secondaryPulse, {
            toValue: 1.4,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(secondaryPulse, {
            toValue: 0.8,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
      ).start()

      // Shimmer animation for glass morphism
      Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
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
    
    // Inicializar device tracking
    initializeDeviceTracking()
  }, [])

  const initializeDeviceTracking = async () => {
    try {
      await DeviceService.registerDevice()
      const count = await DeviceService.getVoiceCount()
      setDeviceVoiceCount(count)
      console.log('Device initialized with voice count:', count)
    } catch (error) {
      console.error('Error initializing device tracking:', error)
    }
  }

  const handleSubscribePress = async () => {
    await AsyncStorage.setItem("hasSeenSubscribeMessage", "true")
    setHasSeenSubscribeMessage(false)
    
    // Usar callback si está disponible, sino navigation.navigate como fallback
    if (route.params?.onNavigateToSubscribe) {
      route.params.onNavigateToSubscribe()
    } else {
      navigation.navigate("Suscribe")
    }
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
    if (!loading && showEmptyListText && !showCreatingMessage) {
      Animated.timing(emptyStateFadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start()
    } else {
      emptyStateFadeAnim.setValue(0)
    }
  }, [loading, showEmptyListText, showCreatingMessage])

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
        if (isSubscribed === false) {
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
    console.log("fetchEstimatedCost called - country:", country)
    console.log("fetchEstimatedCost called - shoppingList:", shoppingList)
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
      console.log("API response for cost:", estimatedCostResponse)
      setEstimatedCost(`${estimatedCostResponse}`)
      console.log("estimatedCost state set to:", estimatedCostResponse)
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
    setIsRecording(true)
    setShowEmptyListText(false)
    setShowWelcomeMessage(false)
    setShowResults(false)
    setLoading(false)
    setShowCreatingMessage(true)
    startPulseAnimation()
    setEstimatedCost(null)
    setHighlightedWords([]) // Limpiar palabras resaltadas anteriores
    setShowBubbleLoader(true) // Mostrar loader al empezar
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
        
        // Acumular items sin duplicados con lógica mejorada
        setHighlightedWords(prevWords => {
          const newWords = [...prevWords]
          let hasNewItems = false
          
          identifiedItems.forEach(newItem => {
            const newItemLower = newItem.toLowerCase().trim()
            
            // Buscar si ya existe una palabra similar
            const existingSimilar = newWords.find(existing => {
              const existingLower = existing.toLowerCase().trim()
              
              // Exacta coincidencia
              if (existingLower === newItemLower) return true
              
              // Una palabra contiene a la otra (para evitar "lechu" y "lechuga")
              if (existingLower.includes(newItemLower) || newItemLower.includes(existingLower)) {
                return true
              }
              
              // Palabras muy similares (diferencia de 1-2 caracteres)
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
              hasNewItems = true
            } else {
              // Si la nueva palabra es más larga, reemplazar la existente
              const existingIndex = newWords.findIndex(existing => 
                existing.toLowerCase().trim() === existingSimilar.toLowerCase().trim()
              )
              if (newItemLower.length > existingSimilar.toLowerCase().trim().length) {
                newWords[existingIndex] = newItem
              }
            }
          })
          
          // Ocultar loader cuando aparezcan items
          if (hasNewItems || newWords.length > 0) {
            setShowBubbleLoader(false)
          }
          
          return newWords
        })
      }
    }, 150) // Esperar solo 150ms para respuesta más rápida
  }

  const renderLiveResults = () => {
    const deviceLanguage = RNLocalize.getLocales()[0].languageCode
    const primerModal = settingsModalTexts[deviceLanguage] || settingsModalTexts["en"]
    
    return (
      <View style={modernStyles.liveResultsContainer}>
        <View style={modernStyles.liveResultsCard}>
          {/* Glass morphism background overlay */}
          <View style={modernStyles.liveResultsGlassBg} />
          
          {/* Animated Shimmer effect */}
          <Animated.View 
            style={[
              modernStyles.liveResultsShimmer,
              {
                opacity: shimmerAnim,
                transform: [{
                  translateX: Animated.multiply(shimmerAnim, 100)
                }]
              }
            ]}
          />
          
          {/* Fixed header */}
          <View style={modernStyles.listeningHeader}>
            <Animated.View 
              style={[
                modernStyles.pulsingDot,
                { opacity: pulseAnim }
              ]}
            />
            <Text style={modernStyles.listeningText}> {primerModal.listening}</Text>
          </View>

          {/* Scrollable content area */}
          <ScrollView 
            style={modernStyles.scrollableContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={modernStyles.scrollContentContainer}
          >
            {/* Mini loader or floating animated bubbles */}
            {showBubbleLoader ? (
              <BubbleLoader />
            ) : highlightedWords.length > 0 ? (
              <View style={modernStyles.floatingItemsContainer}>
                {highlightedWords.map((item, index) => (
                  <AnimatedFloatingItem
                    key={`${item}-${index}`}
                    text={item}
                    index={index}
                    delay={0} // No delay since items are persistent now
                  />
                ))}
              </View>
            ) : null}

          </ScrollView>

          {/* Fixed pause button at bottom */}
          <View style={modernStyles.pauseButtonContainer}>
            <TouchableOpacity
              onPress={stopRecognizing}
              style={modernStyles.pauseButton}
              activeOpacity={0.8}
            >
              <Animated.View
                style={[
                  modernStyles.pauseButtonInner,
                  { 
                    opacity: pulseAnim,
                    transform: [{ scale: pulseAnim }] 
                  }
                ]}
              >
                <Ionicons name="stop" size={20} color="white" />
              </Animated.View>
            </TouchableOpacity>
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
        triggerHaptic('light')
        await Voice.stop()
        setStarted(false)
        setIsRecording(false)
        setShowEmptyListText(true)
        setHighlightedWords([]) // Limpiar palabras resaltadas
        setShowBubbleLoader(false) // Ocultar loader
      } catch (e) {
        console.error(e)
        Alert.alert("Error", "Error stopping voice recognition.")
      }
    } else {
      // Verificar límite de uso antes de comenzar la grabación
      if (isSubscribed === false) {
        const usage = await DeviceService.canUseVoiceFeature(false)
        
        if (!usage.canUse) {
          // Mostrar modal de límite alcanzado
          setVoiceLimitModalVisible(true)
          return
        }
        
        // Incrementar contador de uso
        const result = await DeviceService.incrementVoiceCount()
        
        if (!result.success) {
          console.error('Error incrementando contador:', result.error)
          // Continuar de todos modos en caso de error de red
        } else {
          setDeviceVoiceCount(result.voice_count)
          console.log('Voice count incremented to:', result.voice_count)
          
          // Si alcanzó el límite después de este uso, mostrar modal después
          if (result.has_reached_limit) {
            setTimeout(() => {
              setVoiceLimitModalVisible(true)
            }, 1000) // Pequeño delay para que termine la grabación
          }
        }
      }

      try {
        triggerHaptic('light')
        await Voice.start(recognitionLanguage)
        setRecognized("")
        setResults([])
        setStarted(true)
        setHighlightedWords([]) // Limpiar palabras resaltadas al iniciar
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
      triggerHaptic('light')
      setLoading(true)
      setShowCreatingMessage(false)

      // Limpiar timeout de análisis
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current)
      }

      setTimeout(async () => {
        await Voice.stop()
        setStarted(false)
        setIsRecording(false)

        if (results.length === 0) {
          setShowEmptyListText(true)
          setShowResults(false)
          setLoading(false)
          
          // Solo mostrar modal de configuración si no está en límite de voz
          const usage = await DeviceService.canUseVoiceFeature(isSubscribed)
          if (usage.canUse || isSubscribed) {
            setSettingsModalVisible(true)
          }
          
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
      <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
        <View style={modernStyles.modalOverlay}>
          <View style={modernStyles.settingsModalContainer}>
            <View style={modernStyles.settingsModalHeader}>
              <Ionicons name="mic-off-outline" size={48} color="#6b7280" />
              <Text style={modernStyles.settingsModalTitle}>{currentLabels.title}</Text>
            </View>
            <Text style={modernStyles.settingsModalMessage}>{currentLabels.message}</Text>
            <View style={modernStyles.settingsModalButtons}>
              <TouchableOpacity style={modernStyles.settingsButton} onPress={onOpenSettings}>
                <Ionicons name="settings-outline" size={20} color="white" />
                <Text style={modernStyles.settingsButtonText}>{currentLabels.goSettings}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={modernStyles.cancelButton} onPress={onClose}>
                <Text style={modernStyles.cancelButtonText}>
                  {deviceLanguage === 'es' ? 'Cerrar' : 'Close'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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

  // Monitorear triggers para modales desde navegador
  useEffect(() => {
    const checkModalTriggers = async () => {
      try {
        // Verificar trigger de modal añadir
        const addTrigger = await AsyncStorage.getItem("@trigger_add_modal")
        if (addTrigger === "true") {
          await AsyncStorage.removeItem("@trigger_add_modal")
          setEditModalVisibleadd(true)
        }

        // Verificar trigger de modal costes
        const costTrigger = await AsyncStorage.getItem("@trigger_cost_modal")
        if (costTrigger === "true") {
          console.log("Cost modal trigger detected - opening modal")
          await AsyncStorage.removeItem("@trigger_cost_modal")
          setCountryModalVisible(true)
        }

        // Verificar trigger de reset home
        const resetTrigger = await AsyncStorage.getItem("@trigger_reset_home")
        if (resetTrigger === "true") {
          console.log("Reset home trigger detected - resetting to initial state")
          await AsyncStorage.removeItem("@trigger_reset_home")
          setShowResults(false)
          setShowEmptyListText(true)
          setShoppingList([])
          setEstimatedCost(null)
        }
      } catch (error) {
        console.error("Error checking modal triggers:", error)
      }
    }

    const interval = setInterval(checkModalTriggers, 500)
    
    return () => clearInterval(interval)
  }, [])

  const renderVoiceButton = () => {
    if (shoppingList.length > 0) {
      return null // Los botones están ahora en el navegador de abajo
    } else {
      return (
        <View style={modernStyles.voiceButtonContainer}>
          {/* Informative text for non-subscribed users */}
          {isSubscribed === false && (
            <TouchableOpacity 
              style={modernStyles.voiceInfoContainer}
              onPress={() => {
                if (deviceVoiceCount >= 3) {
                  handleSubscribePress()
                }
              }}
              activeOpacity={deviceVoiceCount >= 3 ? 0.7 : 1}
            >
              <Text style={modernStyles.voiceInfoText}>
                {deviceVoiceCount >= 3 ? voiceTexts.limitTitle : voiceTexts.freeTitle}
              </Text>
              <Text style={[
                modernStyles.voiceInfoSubtext,
                deviceVoiceCount >= 3 && modernStyles.voiceInfoSubtextClickable
              ]}>
                {deviceVoiceCount >= 3
                  ? voiceTexts.limitSubtitle
                  : voiceTexts.freeSubtitle.replace('${remaining}', Math.max(0, 3 - deviceVoiceCount))
                }
              </Text>
            </TouchableOpacity>
          )}
          
          {/* Ultra Modern Multi-Layer Pulse Rings */}
          <View style={modernStyles.voiceFloatingContainer}>
            {started && (
              <Animated.View 
                style={[
                  modernStyles.pulseRingOuter,
                  { 
                    opacity: Animated.multiply(pulseAnim, 0.7),
                    transform: [{ scale: Animated.multiply(pulseAnim, 1.2) }] 
                  }
                ]} 
              />
            )}
            {started && (
              <Animated.View 
                style={[
                  modernStyles.pulseRingMiddle,
                  { 
                    opacity: Animated.multiply(secondaryPulse, 0.6),
                    transform: [{ scale: Animated.multiply(secondaryPulse, 0.9) }] 
                  }
                ]} 
              />
            )}
            {started && (
              <Animated.View 
                style={[
                  modernStyles.pulseRingInner,
                  { 
                    opacity: Animated.subtract(1, Animated.multiply(pulseAnim, 0.5)),
                    transform: [{ scale: Animated.add(0.8, Animated.multiply(pulseAnim, 0.3)) }] 
                  }
                ]} 
              />
            )}
            
            {/* Additional shimmer pulse ring when active */}
            {started && (
              <Animated.View 
                style={[
                  modernStyles.pulseRingOuter,
                  {
                    opacity: Animated.multiply(shimmerAnim, 0.3),
                    transform: [{ 
                      scale: Animated.add(1, Animated.multiply(shimmerAnim, 0.5))
                    }],
                    backgroundColor: 'rgba(147, 176, 176, 0.08)',
                  }
                ]} 
              />
            )}

            {/* Main Voice Button */}
            <TouchableOpacity
              onPress={started ? stopRecognizing : startRecognizing}
              style={modernStyles.voiceButtonWrapper}
              activeOpacity={0.8}
            >
              <Animated.View
                style={[
                  modernStyles.voiceButton,
                  { transform: [{ scale: started ? 1.05 : pulseAnim }] },
                  started ? modernStyles.voiceButtonActive : modernStyles.voiceButtonInactive,
                ]}
              >
                <View style={modernStyles.micIconContainer}>
                  {started ? (
                    <Ionicons name="stop" size={30} color="white" />
                  ) : (
                    <Ionicons name="mic" size={32} color="white" />
                  )}
                </View>
              </Animated.View>
            </TouchableOpacity>
          </View>

          {/* Sin texto debajo del micrófono para diseño más limpio */}
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
          {renderFloatingFoodIcons()}
                        {isContentVisible && (
              <TouchableOpacity onPress={handlePress} style={modernStyles.languageButton}>
                <Ionicons name="globe-outline" size={22} color="#4a6bff" />
                <Text style={modernStyles.languageButtonText}>
                  {currentLabels.welcomeMessage} {languageName}
                </Text>
              </TouchableOpacity>
            )}

          <Animated.View style={[modernStyles.emptyStateContent, { zIndex: 10, position: 'relative', opacity: emptyStateFadeAnim }]}>


     

            {/* Clean Hero Section - Sin círculo superior */}
            <View style={modernStyles.heroSection}>
  
              {/* Hero Subtitle */}
             <Text style={modernStyles.heroTitle}>
                {currentLabels.heroSubtitle}
              </Text>
              
              {/* Feature Highlights */}
              <View style={modernStyles.featuresContainer}>
                <View style={modernStyles.featureItem}>
                  <Ionicons name="flash" size={20} color="#ff6b35" style={modernStyles.featureIcon} />
                  <Text style={modernStyles.featureText}>{currentLabels.lightningFast}</Text>
                </View>
                
                <View style={modernStyles.featureItem}>
                  <Ionicons name="shield-checkmark" size={20} color="#4a6bff" style={modernStyles.featureIcon} />
                  <Text style={modernStyles.featureText}>{currentLabels.aiPowered}</Text>
                </View>
                
                <View style={modernStyles.featureItem}>
                  <Ionicons name="heart" size={20} color="#ff9500" style={modernStyles.featureIcon} />
                  <Text style={modernStyles.featureText}>{currentLabels.superEasy}</Text>
                </View>
              </View>
              
              {/* Call to Action - Más prominente */}
              <View style={modernStyles.ctaContainer}>
                <Text style={modernStyles.ctaText}>
                  Tap the button below to start
                </Text>
              
              </View>
            </View>

            {/* Language Selection */}
     
          </Animated.View>
        </View>
      )}

      {!loading && showCreatingMessage && (
        <View style={modernStyles.creatingContainer}>
          {/* Solo mostrar el header cuando NO está grabando y NO hay resultados */}
          {!started && results.length === 0 && (
            <View style={modernStyles.creatingHeader}>
              <View style={modernStyles.micContainer}>
                <View style={modernStyles.micIconWrapper}>
                  <Ionicons name="mic" size={28} color="white" />
                </View>
                <Animated.Text style={[modernStyles.creatingTitle, { color: textColor }]}>
                  {currentLabels.pressAndSpeaktext}
                </Animated.Text>
              </View>
            </View>
          )}

          {/* Solo mostrar resultados en vivo cuando está grabando */}
          {started && (
            <View style={modernStyles.liveContainer}>
              {renderLiveResults()}
            </View>
          )}

          {/* Solo mostrar el botón "View List" cuando NO está grabando y hay resultados */}
          {!started && results.length > 0 && (
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
          data={shoppingList.length > 0 ? [...shoppingList] : []}
          renderItem={({ item, index }) => {
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

      {/* Solo mostrar el botón de voz cuando NO está en modo "creating message" Y NO está grabando Y NO hay loading */}
      <View style={{ zIndex: 20, position: 'relative' }}>
        {!showCreatingMessage && !started && !loading && renderVoiceButton()}
      </View>
      <ConfirmationModal />


      {/* Voice Limit Modal */}
      <Modal visible={voiceLimitModalVisible} transparent={true} animationType="fade">
        <View style={modernStyles.modalOverlay}>
          <View style={modernStyles.voiceLimitModalContainer}>
            <View style={modernStyles.voiceLimitModalHeader}>
              <Ionicons name="mic-off" size={48} color="#ff6b6b" />
              <Text style={modernStyles.voiceLimitModalTitle}>
                {voiceTexts.modalTitle}
              </Text>
            </View>
            <Text style={modernStyles.voiceLimitModalMessage}>
              {voiceTexts.modalMessage.replace('${count}', deviceVoiceCount)}
            </Text>
            <View style={modernStyles.voiceLimitModalButtons}>
              <TouchableOpacity 
                style={modernStyles.subscribeButton} 
                onPress={() => {
                  setVoiceLimitModalVisible(false)
                  // Navegar a suscripción usando el mismo método que el botón subscribe existente
                  handleSubscribePress()
                }}
              >
                <Ionicons name="star" size={20} color="white" />
                <Text style={modernStyles.subscribeButtonText}>
                  {voiceTexts.subscribe}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={modernStyles.cancelButton} 
                onPress={() => setVoiceLimitModalVisible(false)}
              >
                <Text style={modernStyles.cancelButtonText}>
                  {voiceTexts.close}
                </Text>
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
          {/* CONTENEDOR MODERNO CON FONDO BLANCO Y TEXTOS TRADUCIDOS */}
          <View style={modernStyles.countryModalContent}>
            {/* Close X Button - Arriba derecha */}
            <TouchableOpacity
              onPress={() => setCountryModalVisible(false)}
              style={modernStyles.countryModalCloseButton}
            >
              <Ionicons name="close" size={20} color="#6b7280" />
            </TouchableOpacity>

            {/* Header con icono y títulos TRADUCIDOS */}
            <View style={modernStyles.countryModalHeader}>
              <View style={modernStyles.countryModalIconContainer}>
                <Ionicons name="location" size={28} color="#4a6bff" />
              </View>
              <Text style={modernStyles.countryModalTitle}>{currentLabels.selectCountry}</Text>
              <Text style={modernStyles.countryModalSubtitle}>{currentLabels.cityNamePlaceholder}</Text>
            </View>

            {isSubscribed === false && (
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
              <Ionicons name="calculator" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={modernStyles.modalButtonText}>{`${currentLabels.viewCost} ${country}`}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={editModalVisible}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
        transparent={true}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={modernStyles.modalContaineri}
        >
          {/* MODAL MODERNO PARA EDITAR PRODUCTO */}
          <View style={modernStyles.editProductModalContent}>
            {/* Close X Button - Arriba derecha */}
            <TouchableOpacity
              onPress={() => setEditModalVisible(false)}
              style={modernStyles.editProductModalCloseButton}
            >
              <Ionicons name="close" size={20} color="#6b7280" />
            </TouchableOpacity>

            {/* Header con icono y títulos */}
            <View style={modernStyles.editProductModalHeader}>
              <View style={modernStyles.editProductModalIconContainer}>
                <Ionicons name="pencil" size={35} color="#ff9500" />
              </View>
              <Text style={modernStyles.editProductModalTitle}>{currentLabels.editItem}</Text>
              <Text style={modernStyles.editProductModalSubtitle}>{currentLabels.writeItems}</Text>
            </View>

            {/* Input de texto mejorado */}
            <TextInput
              style={modernStyles.editProductModalInput}
              placeholder={currentLabels.writeItems}
              placeholderTextColor="#9ca3af"
              multiline
              value={editingText}
              onChangeText={setEditingText}
              autoFocus={true}
              returnKeyType="done"
              blurOnSubmit={true}
            />

            {/* Solo botón de guardar - sin cancelar */}
            <TouchableOpacity 
              style={modernStyles.editProductSaveButtonFull} 
              onPress={saveEditedItem}
            >
              <Ionicons name="checkmark-circle" size={22} color="white" />
              <Text style={modernStyles.editProductSaveButtonText}>{currentLabels.save}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={editModalVisibleadd} animationType="slide" onRequestClose={closeEditModalAdd} transparent={true}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={modernStyles.modalContaineri}
        >
          {/* MODAL MODERNO PARA AGREGAR PRODUCTO - SIN TECLADO TAPANDO */}
          <View style={modernStyles.addProductModalContent}>
            {/* Close X Button - Arriba derecha */}
            <TouchableOpacity
              onPress={closeEditModalAdd}
              style={modernStyles.addProductModalCloseButton}
            >
              <Ionicons name="close" size={20} color="#6b7280" />
            </TouchableOpacity>

            {/* Header con icono y títulos */}
            <View style={modernStyles.addProductModalHeader}>
              <View style={modernStyles.addProductModalIconContainer}>
                <Ionicons name="basket" size={35} color="#4a6bff" />
              </View>
              <Text style={modernStyles.addProductModalTitle}>{currentLabels.addNewItembutton}</Text>
              <Text style={modernStyles.addProductModalSubtitle}>{currentLabels.writeHereWhatToAdd}</Text>
            </View>

            {/* Input de texto mejorado para productos detallados */}
            <TextInput
              style={modernStyles.addProductModalInput}
              placeholder={currentLabels.writeHereWhatToAdd}
              placeholderTextColor="#9ca3af"
              multiline
              value={editingText}
              onChangeText={setEditingText}
              autoFocus={true}
              returnKeyType="done"
              blurOnSubmit={true}
            />

            {/* Solo botón de agregar - sin cancelar */}
            <TouchableOpacity 
              style={modernStyles.addProductSaveButtonFull} 
              onPress={saveEditedItemadd}
            >
              <Ionicons name="checkmark-circle" size={22} color="white" />
              <Text style={modernStyles.addProductSaveButtonText}>{currentLabels.addNewItembutton}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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

      {/* Modern Welcome Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={primerModalVisible}
        onRequestClose={() => {
          setPrimerModalVisible(!primerModalVisible)
        }}
      >
        <View style={modernStyles.modalOverlay}>
          <View style={modernStyles.welcomeModalContainer}>
            <View style={modernStyles.welcomeModalHeader}>
              <View style={modernStyles.welcomeIconContainer}>
                <Ionicons name="mic" size={40} color="#ff9500" />
              </View>
              <Text style={modernStyles.welcomeModalTitle}>{currentLabelse.title}</Text>
            </View>
            
            <View style={modernStyles.welcomeStepsContainer}>
              <View style={modernStyles.welcomeStep}>
                <View style={modernStyles.stepNumber}>
                  <Text style={modernStyles.stepNumberText}>1</Text>
                </View>
                <View style={modernStyles.stepContent}>
                  <Ionicons name="play-circle-outline" size={24} color="#4f46e5" />
                  <Text style={modernStyles.stepText}>{currentLabelse.step1}</Text>
                </View>
              </View>
              
              <View style={modernStyles.welcomeStep}>
                <View style={modernStyles.stepNumber}>
                  <Text style={modernStyles.stepNumberText}>2</Text>
                </View>
                <View style={modernStyles.stepContent}>
                  <Ionicons name="chatbubble-ellipses-outline" size={24} color="#10b981" />
                  <View>
                    <Text style={modernStyles.stepText}>{currentLabelse.step2}</Text>
                    <Text style={modernStyles.stepExample}>{currentLabelse.step2Example}</Text>
                  </View>
                </View>
              </View>
              
              <View style={modernStyles.welcomeStep}>
                <View style={modernStyles.stepNumber}>
                  <Text style={modernStyles.stepNumberText}>3</Text>
                </View>
                <View style={modernStyles.stepContent}>
                  <Ionicons name="checkmark-circle-outline" size={24} color="#06b6d4" />
                  <Text style={modernStyles.stepText}>{currentLabelse.step3}</Text>
                </View>
              </View>
            </View>
            
            <View style={modernStyles.welcomeModalButtons}>
              <TouchableOpacity style={modernStyles.welcomeStartButton} onPress={handleCloseprimerModal}>
                <Ionicons name="mic" size={20} color="white" />
                <Text style={modernStyles.welcomeStartButtonText}>{currentLabelse.createList}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={modernStyles.welcomeSkipButton} onPress={handleCloseprimerModalCerrar}>
                <Text style={modernStyles.welcomeSkipButtonText}>{currentLabelse.nowNot}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default HomeScreen