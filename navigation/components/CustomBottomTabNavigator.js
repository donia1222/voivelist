import React, { useState, useRef, useEffect } from "react"
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  ScrollView,
  Share,
  Linking,
  Animated,
  Easing,
  Alert,
  Image,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useTheme } from "../../ThemeContext"
import { useRecording } from "../../RecordingContext"
import * as RNLocalize from "react-native-localize"
import { translations } from "../../translations"
import texts from "../../screens/translations/texts"
import DeviceInfo from "react-native-device-info"
import AsyncStorage from "@react-native-async-storage/async-storage"
import PrivacyModal from "../../screens/links/PrivacyModal"
import EulaModal from "../../screens/links/EulaModal"
import getModernStyles from "../../screens/Styles/HomeScreenModernStyles"

import HomeScreen from "../../screens/HomeScreen"
import ImageListScreen from "../../screens/ImageListScreen"
import HistoryScreen from "../../screens/HistoryScreen"
import Suscribe from "../../screens/Suscribe"
import MySubscriptionScreen from "../../screens/MySubscriptionScreen"
import InformationScreen from "../../screens/InformationScreen"
import CalendarPlannerScreen from "../../screens/CalendarPlannerScreen"
import PriceCalculatorScreen from "../../screens/PriceCalculatorScreen"

const Stack = createNativeStackNavigator()

const getCurrentTranslations = () => {
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  return translations[deviceLanguage] || translations["en"]
}

const getMenuTexts = () => {
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  const menuTexts = {
    es: {
      menuTitle: "Menú",
      menuSubtitle: "Opciones adicionales",
      closeButton: "Cerrar",
      settings: "Ajustes",
      descriptions: {
        "star": "Gestiona tu suscripción",
        "star-outline": "Desbloquea todas las funciones",
        "calculator": "Calcula precios de listas",
        "information-circle-outline": "Acerca de la aplicación",
        "share-social-outline": "Comparte con amigos",
        "mail-outline": "Contáctanos para soporte",
        "shield-outline": "Lee nuestra política",
        "document-text-outline": "Lee nuestros términos",
        "settings-outline": "Configuraciones de la app",
        "calendar-outline": "Planifica tus compras semanales",
      }
    },
    en: {
      menuTitle: "Menu",
      menuSubtitle: "Additional options",
      closeButton: "Close",
      settings: "Settings",
      descriptions: {
        "star": "Manage your subscription",
        "star-outline": "Unlock all features",
        "calculator": "Calculate list prices",
        "information-circle-outline": "About the app",
        "share-social-outline": "Share with friends",
        "mail-outline": "Contact us for support",
        "shield-outline": "Read our policy",
        "document-text-outline": "Read our terms",
        "settings-outline": "App settings",
        "calendar-outline": "Plan your weekly shopping",
      }
    },
    de: {
      menuTitle: "Menü",
      menuSubtitle: "Zusätzliche Optionen",
      closeButton: "Schließen",
      settings: "Einstellungen",
      descriptions: {
        "star": "Verwalte dein Abonnement",
        "star-outline": "Alle Funktionen freischalten",
        "calculator": "Listenpreise berechnen",
        "information-circle-outline": "Über die App",
        "share-social-outline": "Mit Freunden teilen",
        "mail-outline": "Kontaktiere uns für Support",
        "shield-outline": "Lies unsere Richtlinien",
        "document-text-outline": "Lies unsere Bedingungen",
        "settings-outline": "App-Einstellungen",
        "calendar-outline": "Plane deine wöchentlichen Einkäufe",
      }
    },
    fr: {
      menuTitle: "Menu",
      menuSubtitle: "Options supplémentaires",
      closeButton: "Fermer",
      settings: "Paramètres",
      descriptions: {
        "star": "Gérez votre abonnement",
        "star-outline": "Débloquez toutes les fonctionnalités",
        "calculator": "Calculer les prix des listes",
        "information-circle-outline": "À propos de l'app",
        "share-social-outline": "Partagez avec des amis",
        "mail-outline": "Contactez-nous pour le support",
        "shield-outline": "Lisez notre politique",
        "document-text-outline": "Lisez nos conditions",
        "settings-outline": "Paramètres de l'app",
      }
    }
  }
  return menuTexts[deviceLanguage] || menuTexts["en"]
}

const getMenuItemDescription = (icon) => {
  const menuTexts = getMenuTexts()
  return menuTexts.descriptions[icon] || "More options"
}

function CustomBottomTabNavigator({ navigation, isSubscribed, initialTab = "Home" }) {
  const { theme } = useTheme()
  const { isRecording } = useRecording()
  const currentTranslations = getCurrentTranslations()
  const menuTexts = getMenuTexts()
  const modernStyles = getModernStyles()
  const [activeTab, setActiveTab] = useState(initialTab)
  const [isMenuModalVisible, setMenuModalVisible] = useState(false)
  const iconScaleAnim = useRef(new Animated.Value(1)).current
  
  // Get current language labels for success modal
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  const currentLabels = texts[deviceLanguage] || texts["en"]
  
  // Debug modal state
  useEffect(() => {
    console.log("Menu modal visible:", isMenuModalVisible)
  }, [isMenuModalVisible])

  // Animate icon when recording
  useEffect(() => {
    if (isRecording) {
      // Continuous pulse animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(iconScaleAnim, {
            toValue: 1.2,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(iconScaleAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      )
      pulseAnimation.start()
      return () => pulseAnimation.stop()
    } else {
      Animated.timing(iconScaleAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start()
    }
  }, [isRecording])

  // Monitorear lista activa
  useEffect(() => {
    const checkActiveList = async () => {
      try {
        const list = await AsyncStorage.getItem("@shopping_list")
        if (list) {
          const parsedList = JSON.parse(list)
          setHasActiveList(parsedList.length > 0)
        } else {
          setHasActiveList(false)
        }
      } catch (error) {
        setHasActiveList(false)
      }
    }

    // Verificar inicialmente
    checkActiveList()
    
    // Verificar cada 500ms cuando estemos en Home
    const interval = activeTab === "Home" ? setInterval(checkActiveList, 500) : null
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [activeTab])
  const [isPrivacyModalVisible, setPrivacyModalVisible] = useState(false)
  const [isEulaModalVisible, setEulaModalVisible] = useState(false)
  const [isSettingsModalVisible, setSettingsModalVisible] = useState(false)
  const [hasActiveList, setHasActiveList] = useState(false) // Estado para lista activa
  const [showSuccessModal, setShowSuccessModal] = useState(false) // Modal de éxito
  
  // Función para obtener colores basados en la pestaña activa
  const getTabColors = () => {
    switch (activeTab) {
      case "Home":
        return {
          primary: "#4a6bff",
          background: "rgba(74, 107, 255, 0.15)"
        }
      case "Images":
        return {
          primary: "#ff9500",
          background: "rgba(255, 149, 0, 0.15)"
        }
      case "History":
        return {
          primary: "#34c759",
          background: "rgba(52, 199, 89, 0.15)"
        }
      case "Calendar":
        return {
          primary: "#6B7280",
          background: "rgba(107, 114, 128, 0.15)"
        }
      case "PriceCalculator":
        return {
          primary: "#dc2626",
          background: "rgba(220, 38, 38, 0.15)"
        }
      default:
        return {
          primary: "#4a6bff",
          background: "rgba(74, 107, 255, 0.15)"
        }
    }
  }
  
  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current
  const rotateAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  
  // Menu bars animations
  const [menuPressed, setMenuPressed] = useState(0) // 0, 1, 2 para diferentes posiciones
  const bar1Anim = useRef(new Animated.Value(0)).current
  const bar2Anim = useRef(new Animated.Value(0)).current
  const bar3Anim = useRef(new Animated.Value(0)).current

  // Función para animar las barras del menú
  const animateMenuBars = () => {
    const nextState = (menuPressed + 1) % 3 // Cicla entre 0, 1, 2
    setMenuPressed(nextState)
    
    // Animaciones para las barras
    Animated.parallel([
      Animated.timing(bar1Anim, {
        toValue: nextState,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(bar2Anim, {
        toValue: nextState,
        duration: 350,
        useNativeDriver: false,
      }),
      Animated.timing(bar3Anim, {
        toValue: nextState,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start()
  }

  // Funciones para los botones de lista
  const clearShoppingList = async () => {
    try {
      await AsyncStorage.setItem("@shopping_list", JSON.stringify([]))
      await AsyncStorage.setItem("@trigger_reset_home", "true")
      setHasActiveList(false)
    } catch (error) {
      console.error("Error clearing list:", error)
    }
  }

  const addNewItem = async () => {
    // Activar modal de añadir enviando señal a HomeScreen
    try {
      await AsyncStorage.setItem("@trigger_add_modal", "true")
      console.log("Add new item pressed - modal triggered")
    } catch (error) {
      console.error("Error triggering add modal:", error)
    }
  }


  const saveToHistory = async () => {
    try {
      const list = await AsyncStorage.getItem("@shopping_list")
      const history = await AsyncStorage.getItem("@shopping_history") || "[]"
      
      if (list) {
        const parsedList = JSON.parse(list)
        const parsedHistory = JSON.parse(history)
        
        if (parsedList.length > 0) {
          const newHistoryItem = {
            list: parsedList,
            name: `Lista ${parsedHistory.length + 1}`,
            date: new Date().toISOString()
          }
          
          parsedHistory.push(newHistoryItem)
          await AsyncStorage.setItem("@shopping_history", JSON.stringify(parsedHistory))
          await AsyncStorage.setItem("@shopping_list", JSON.stringify([]))
          await AsyncStorage.setItem("@trigger_reset_home", "true")
          setHasActiveList(false)
          
          setShowSuccessModal(true)
          setTimeout(() => setShowSuccessModal(false), 2000)
        }
      }
    } catch (error) {
      console.error("Error saving to history:", error)
      Alert.alert("Error", "No se pudo guardar la lista")
    }
  }

  // Primeros 3 botones de lista
  const topActionTabs = [
    {
      key: "clear",
      label: "Borrar",
      icon: "trash-outline",
      color: "#ef4444",
      onPress: clearShoppingList,
    },
    {
      key: "add",
      label: "Añadir",
      icon: "add-circle",
      color: "#4a6bff", 
      onPress: addNewItem,
    },
    {
      key: "save",
      label: "Guardar",
      icon: "checkmark-circle-outline",
      color: "#10b981",
      onPress: saveToHistory,
    },
  ]


  const mainTabs = [
    {
      key: "Home",
      label: currentTranslations.createList,
      icon: "mic",
      color: "#4a6bff",
      screen: HomeScreen,
    },
    {
      key: "Images",
      label: currentTranslations.imageList,
      icon: "image",
      color: "#ff9500",
      screen: ImageListScreen,
    },
    {
      key: "History",
      label: currentTranslations.saved,
      icon: "bookmark",
      color: "#34c759",
      screen: HistoryScreen,
    },
    {
      key: "Calendar",
      label: currentTranslations.calendar,
      icon: "calendar",
      color: "#6B7280",
      screen: CalendarPlannerScreen,
    },
    {
      key: "PriceCalculator",
      label: currentTranslations.priceCalculator || "Price Calculator",
      icon: "calculator",
      color: "#dc2626",
      screen: PriceCalculatorScreen,
    },
  ]

  const shareAppLink = async () => {
    try {
      const result = await Share.share({
        message: currentTranslations.shareMessage,
      })
    } catch (error) {
      console.error("Error al compartir", error.message)
    }
  }

  const handleContactPress = () => {
    const emailBody = `
      Device Model: ${DeviceInfo.getModel()}\n
      OS Version: ${DeviceInfo.getSystemVersion()}\n
    `
    const mailtoURL = `mailto:info@lweb.ch?subject=Contact&body=${encodeURIComponent(emailBody)}`
    Linking.openURL(mailtoURL).catch((err) => console.error("Failed to open mail app:", err))
  }

  const handleSettingsPress = () => {
    setMenuModalVisible(false)
    setSettingsModalVisible(true)
  }

  const openAppSettings = () => {
    Linking.openSettings()
    setSettingsModalVisible(false)
  }

  // Ensure activeTab is set to initialTab
  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  // Handle deep links for widget navigation
  useEffect(() => {
    const handleDeepLink = (event) => {
      const { url } = event
      console.log('🔗 CustomBottomTabNavigator received deep link:', url)
      
      if (url?.includes('voicelist://upload')) {
        console.log('📤 Switching to Images tab from widget upload link')
        setActiveTab('Images')
      } else if (url?.includes('voicelist://home')) {
        console.log('🏠 Switching to Home tab from widget home link')
        setActiveTab('Home')
      } else if (url?.includes('voicelist://favorites')) {
        console.log('⭐ Switching to History tab from widget favorites link')
        setActiveTab('History')
      } else if (url?.includes('voicelist://calculate')) {
        console.log('🧮 Switching to PriceCalculator tab from widget calculate link')
        setActiveTab('PriceCalculator')
      }
    }

    // Handle initial URL when app is opened from widget
    Linking.getInitialURL().then(url => {
      if (url) {
        console.log('📱 CustomBottomTabNavigator - App opened with initial URL:', url)
        handleDeepLink({ url })
      }
    })

    // Listen for URL changes while app is open
    const subscription = Linking.addEventListener('url', handleDeepLink)

    return () => {
      subscription?.remove()
    }
  }, [])

  // Initialize pulse animation
  useEffect(() => {
    const startPulsing = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start()
    }
    startPulsing()
  }, [])

  // Modal animations
  useEffect(() => {
    if (isMenuModalVisible) {
      // Start entrance animations
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.elastic(1.2),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      // Reset animations
      scaleAnim.setValue(0)
      fadeAnim.setValue(0)
      rotateAnim.setValue(0)
    }
  }, [isMenuModalVisible])

  const handleTabPress = (tab) => {
    setActiveTab(tab.key)
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case "Home":
        return (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen 
              name="HomeScreen" 
              component={HomeScreen}
              initialParams={{ 
                onNavigateToSubscribe: () => setActiveTab("Subscribe")
              }}
            />
          </Stack.Navigator>
        )
      case "Images":
        return (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen 
              name="ImageListScreen" 
              component={ImageListScreen}
              initialParams={{ 
                isSubscribed: isSubscribed,
                onNavigateToSubscribe: () => setActiveTab("Subscribe")
              }}
            />
          </Stack.Navigator>
        )
      case "History":
        return (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
          </Stack.Navigator>
        )
      case "Calendar":
        return (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="CalendarPlannerScreen" component={CalendarPlannerScreen} />
          </Stack.Navigator>
        )
      case "PriceCalculator":
        return (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen 
              name="PriceCalculatorScreen" 
              component={PriceCalculatorScreen}
              initialParams={{
                onNavigateToSubscribe: () => setActiveTab("Subscribe")
              }}
            />
          </Stack.Navigator>
        )
      default:
        return (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
          </Stack.Navigator>
        )
    }
  }

  const headerMenuItems = [
    ...(isSubscribed
      ? [

          {
            label: currentTranslations.mySubscription,
            icon: "star",
            color: "#ff375f",
            onPress: () => {
              setMenuModalVisible(false)
              setActiveTab("Subscription")
            }
          },
          
        ]
      : [
          {
            label: currentTranslations.subscribe,
            icon: "star-outline",
            color: "#ff375f",
            onPress: () => {
              setMenuModalVisible(false)
              setActiveTab("Subscribe")
            }
          },
        ]),
    {
      label: currentTranslations.information,
      icon: "information-circle-outline",
      color: "#5856d6",
      onPress: () => {
        setMenuModalVisible(false)
        setActiveTab("Information")
      }
    },
    {
      label: currentTranslations.share,
      icon: "share-social-outline",
      color: "#4a6bff",
      onPress: () => {
        setMenuModalVisible(false)
        shareAppLink()
      }
    },
    {
      label: currentTranslations.contactUs,
      icon: "mail-outline",
      color: "#ff9500",
      onPress: () => {
        setMenuModalVisible(false)
        handleContactPress()
      }
    },
    {
      label: currentTranslations.privacyPolicy,
      icon: "shield-outline",
      color: "#34c759",
      onPress: () => {
        setMenuModalVisible(false)
        setPrivacyModalVisible(true)
      }
    },
    {
      label: currentTranslations.termsAndConditions,
      icon: "document-text-outline",
      color: "#9b59b6",
      onPress: () => {
        setMenuModalVisible(false)
        setEulaModalVisible(true)
      }
    },

  ]

  const renderMenuScreen = () => {
    switch (activeTab) {
      case "Subscribe":
        return (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Suscribe" component={Suscribe} />
          </Stack.Navigator>
        )
      case "Subscription":
        return (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MySubscriptionScreen" component={MySubscriptionScreen} />
          </Stack.Navigator>
        )
      case "Calendar":
        return (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="CalendarPlannerScreen" component={CalendarPlannerScreen} />
          </Stack.Navigator>
        )
      case "Information":
        return (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="InformationScreen" component={InformationScreen} />
          </Stack.Navigator>
        )
      case "PriceCalculator":
        return (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PriceCalculatorScreen" component={PriceCalculatorScreen} />
          </Stack.Navigator>
        )
      default:
        return null
    }
  }

  const isMenuScreen = ["Subscribe", "Subscription", "Information"].includes(activeTab)

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: 50,
          paddingBottom: 15,
          backgroundColor: theme.background,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: activeTab === "Images" ? "#ff950020" : 
                              activeTab === "History" ? "#34c75920" : 
                              activeTab === "Calendar" ? "#6B728020" : 
                              activeTab === "Subscribe" ? "#ff375f20" :
                              activeTab === "Subscription" ? "#ff375f20" :
                              activeTab === "Information" ? "#5856d620" :
                              activeTab === "PriceCalculator" ? "#dc262620" : "#4a6bff20",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            {activeTab === "Home" ? (
              <Animated.View style={{ transform: [{ scale: iconScaleAnim }] }}>
                <Image
                  source={require("../../assets/images/icono34.png")}
                  style={{ width: 30, height: 30 }}
                />
              </Animated.View>
            ) : (
              <Ionicons 
                name={activeTab === "Images" ? "image" : 
                      activeTab === "Calendar" ? "calendar" : 
                      activeTab === "History" ? "bookmark" :
                      activeTab === "Subscribe" ? "star-outline" :
                      activeTab === "Subscription" ? "star" :
                      activeTab === "Information" ? "information-circle-outline" :
                      activeTab === "PriceCalculator" ? "calculator" : "storefront"} 
                size={24} 
                color={activeTab === "Images" ? "#ff9500" : 
                       activeTab === "History" ? "#34c759" : 
                       activeTab === "Calendar" ? "#6B7280" :
                       activeTab === "Subscribe" ? "#ff375f" :
                       activeTab === "Subscription" ? "#ff375f" :
                       activeTab === "Information" ? "#5856d6" :
                       activeTab === "PriceCalculator" ? "#dc2626" : "#4a6bff"} 
              />
            )}
          </View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: theme.text,
            }}
          >
            {activeTab === "Home" ? "Voice Grocery" : 
             activeTab === "Images" ? currentTranslations.imageList : 
             activeTab === "Calendar" ? currentTranslations.calendar :
             activeTab === "History" ? currentTranslations.saved :
             activeTab === "Subscribe" ? currentTranslations.subscribe :
             activeTab === "Subscription" ? currentTranslations.mySubscription :
             activeTab === "Information" ? currentTranslations.information :
             activeTab === "PriceCalculator" ? (currentTranslations.priceCalculator || "Price Calculator") :
             "Voice Grocery"}
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={() => {
            console.log("Menu button pressed")
            animateMenuBars() // Animar las barras
            setMenuModalVisible(true)
          }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: theme.backgroundtres + "40",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <Animated.View
            style={{
              transform: [{ scale: pulseAnim }],
            }}
          >
            {/* Modern animated hamburger menu */}
            <View style={{
              width: 24,
              height: 18,
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
              <Animated.View style={{
                width: bar1Anim.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: [24, 18, 21]
                }),
                height: 2.5,
                backgroundColor: theme.text,
                borderRadius: 2,
                transform: [{
                  translateX: bar1Anim.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [0, -3, 3]
                  })
                }]
              }} />
              <Animated.View style={{
                width: bar2Anim.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: [18, 21, 24]
                }),
                height: 2.5,
                backgroundColor: theme.text,
                borderRadius: 2,
                alignSelf: 'flex-end',
                transform: [{
                  translateX: bar2Anim.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [0, -6, -3]
                  })
                }]
              }} />
              <Animated.View style={{
                width: bar3Anim.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: [21, 24, 18]
                }),
                height: 2.5,
                backgroundColor: theme.text,
                borderRadius: 2,
                transform: [{
                  translateX: bar3Anim.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [0, 3, -2]
                  })
                }]
              }} />
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        {isMenuScreen ? renderMenuScreen() : renderActiveScreen()}
      </View>

      {/* Custom Bottom Tab Bar */}
      {activeTab === "Home" && hasActiveList ? (
        // Barra de botones de acción con estilo moderno
        <View style={modernStyles.actionButtonsContainer}>
          {/* Primeros 3 botones en fila */}
          <View style={[modernStyles.buttonRow, { marginBottom: 20 }]}>
            {topActionTabs.map((tab, index) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  tab.key === "clear" ? modernStyles.deleteButton :
                  tab.key === "add" ? modernStyles.addButton :
                  modernStyles.saveButton
                ]}
                onPress={tab.onPress}
              >
                <Ionicons name={tab.icon} size={20} color={tab.color} />
                <Text 
                  style={[
                    tab.key === "clear" ? modernStyles.deleteButtonText :
                    tab.key === "add" ? modernStyles.addButtonText :
                    modernStyles.saveButtonText
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        // Barra de navegación normal
        <View
          style={{
            flexDirection: "row",
            backgroundColor: theme.background,
            paddingBottom: 20,
            paddingTop: 10,
            paddingHorizontal: 20,
            borderTopWidth: 1,
            borderTopColor: theme.backgroundtres + "20",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          {mainTabs.map((tab, index) => {
            const isActive = tab.key === activeTab
            const tabColor = isActive ? tab.color : theme.backgroundtres

            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => handleTabPress(tab)}
                style={{
                  flex: 1,
                  alignItems: "center",
                  paddingVertical: 8,
                }}
              >
                <View
                  style={{
                    backgroundColor: isActive ? tab.color + "20" : "transparent",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    minWidth: 50,
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name={tab.icon}
                    size={28}
                    color={tabColor}
                  />
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
      )}

      {/* Better Menu Modal */}
      <Modal
        visible={isMenuModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMenuModalVisible(false)}
      >
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: getTabColors().background,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
            opacity: fadeAnim,
          }}
        >
          <Animated.View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: 25,
              paddingVertical: 20,
              paddingHorizontal: 20,
              width: "100%",
              maxWidth: 400,
              height: "75%",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 15,
              },
              shadowOpacity: 0.35,
              shadowRadius: 25,
              elevation: 30,
              transform: [{ scale: scaleAnim }],
            }}
          >
            {/* Header */}
            <View
              style={{
                alignItems: "center",
                paddingBottom: 15,
                borderBottomWidth: 1,
                borderBottomColor: theme.backgroundtres + "15",
                marginBottom: 15,
              }}
            >
              <Animated.View
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: getTabColors().primary,
                  borderRadius: 25,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 10,
                  transform: [
                    { 
                      rotate: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg']
                      })
                    }
                  ],
                }}
              >
                <Ionicons name="apps" size={25} color="white" />
              </Animated.View>
              <Text
                style={{
                  color: getTabColors().primary,
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {menuTexts.menuTitle}
              </Text>
              <Text
                style={{
                  color: "#ff9500",
                  fontSize: 14,
                  textAlign: "center",
                  marginTop: 5,
                }}
              >
                {menuTexts.menuSubtitle}
              </Text>
            </View>

            {/* Menu Items */}
            <ScrollView 
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: "60%" }}
            >
              {headerMenuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    item.onPress()
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 12,
                    paddingHorizontal: 15,
                    marginBottom: 8,
                    backgroundColor: item.color + "08",
                    borderRadius: 18,
                    borderLeftWidth: 4,
                    borderLeftColor: item.color,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: item.color + "20",
                      padding: 8,
                      borderRadius: 12,
                      marginRight: 15,
                    }}
                  >
                    <Ionicons name={item.icon} size={22} color={item.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: "#2d3748",
                        fontSize: 16,
                        fontWeight: "600",
                        marginBottom: 2,
                      }}
                    >
                      {item.label}
                    </Text>
                    <Text
                      style={{
                        color: "#718096",
                        fontSize: 12,
                        fontWeight: "400",
                      }}
                    >
                      {getMenuItemDescription(item.icon)}
                    </Text>
                  </View>
                  <Ionicons 
                    name="chevron-forward" 
                    size={18} 
                    color={theme.backgroundtres + "50"} 
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setMenuModalVisible(false)}
              style={{
                marginTop: 15,
                backgroundColor: getTabColors().primary,
                paddingVertical: 12,
                paddingHorizontal: 60,
                borderRadius: 25,
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <Text
                style={{
                  color: "#ffffffff",
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                {menuTexts.closeButton}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Modal>

      {/* Privacy Modal */}
      <PrivacyModal
        visible={isPrivacyModalVisible}
        onClose={() => setPrivacyModalVisible(false)}
      />

      {/* Terms & Conditions Modal */}
      <EulaModal
        visible={isEulaModalVisible}
        onClose={() => setEulaModalVisible(false)}
      />

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 30,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            minWidth: 250,
          }}>
            <View style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: '#10b981',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
            }}>
              <Ionicons name="checkmark" size={32} color="white" />
            </View>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#1f2937',
              textAlign: 'center',
              lineHeight: 24,
            }}>
              {currentLabels.listSaved || "Lista guardada correctamente"}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default CustomBottomTabNavigator