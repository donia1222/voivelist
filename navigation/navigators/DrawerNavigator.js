import React, { useRef, useEffect, useState } from "react"
import {
  Animated,
  Easing,
  Platform,
} from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Purchases from "react-native-purchases"
import { useTheme } from "../../ThemeContext"
import * as RNLocalize from "react-native-localize"
import screenNames from "../../screens/translations/languagesApp"
import { translations } from "../../translations"
import { styles, isTablet } from "../../styles/AppStyles"
import configurePushNotifications, { requestNotificationPermission } from "../../screens/components/PushNotification"

import CustomDrawerContent from "../components/CustomDrawerContent"
import TabletTopTabNavigator from "../components/TabletTopTabNavigator"
import CustomBottomTabNavigator from "../components/CustomBottomTabNavigator"
import {
  HomeStackNavigator,
  SuscribeScreen,
  HistoryStackNavigator,
  InformationStackNavigator,
  ImageListStackNavigator,
  MySubscriptionStackNavigator,
} from "./StackNavigators"

const Drawer = createDrawerNavigator()

const getCurrentTranslations = () => {
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  return translations[deviceLanguage] || translations["en"]
}

function AppContent() {
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  const screenText = screenNames[deviceLanguage] || screenNames["en"]
  const currentTranslations = getCurrentTranslations()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [initialRoute, setInitialRoute] = useState("HomeScreen")
  const [isPermissionModalVisible, setPermissionModalVisible] = useState(false)
  const micAnimation = useRef(new Animated.Value(1)).current

  const { theme } = useTheme()

  const checkSubscription = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo()
      if (customerInfo.entitlements.active["12981"]) {
        console.log("Usuario ya suscrito")
        setIsSubscribed(true)
      } else {
        console.log("Usuario no suscrito")
        setIsSubscribed(false)
      }
    } catch (error) {
      console.log("Error al obtener la información del comprador:", error)
      setIsSubscribed(false)
    }
  }

  const checkFirstTimeOpen = async () => {
    const firstTimeOpen = await AsyncStorage.getItem("firstTimeOpen")
    if (firstTimeOpen === null) {
      await AsyncStorage.setItem("firstTimeOpen", "false")
      setPermissionModalVisible(true)
      setInitialRoute("InformationScreen")
    } else {
      setInitialRoute("HomeScreen")
    }
  }

  const handleAcceptPermission = async () => {
    setPermissionModalVisible(false)
    await requestNotificationPermission()
    configurePushNotifications(null)
  }

  useEffect(() => {
    const initializeApp = async () => {
      try {
        Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG)

        // Configurar API key según plataforma
        const apiKey = Platform.OS === 'ios'
          ? "appl_bHxScLAZLsKxfggiOiqVAZTXjJX"  // iOS API key
          : "goog_PLACEHOLDER_ANDROID_KEY";      // Android API key (reemplazar cuando esté disponible)

        Purchases.configure({
          apiKey: apiKey,
          appUserID: null
        })

        await checkSubscription()
        await checkFirstTimeOpen()
        configurePushNotifications(null)
      } catch (error) {
        console.log("Error al inicializar la aplicación:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [])

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(micAnimation, {
          toValue: 1.2,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(micAnimation, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }, [])

  if (isLoading) {
    return null
  }

  if (isTablet) {
    return (
      <NavigationContainer>
        <CustomBottomTabNavigator
          isSubscribed={isSubscribed}
          initialTab={initialRoute === "HomeScreen" ? "Home" : "Home"}
        />
      </NavigationContainer>
    )
  }

  return (
    <NavigationContainer>
      <CustomBottomTabNavigator
        isSubscribed={isSubscribed}
        initialTab={initialRoute === "HomeScreen" ? "Home" : "Home"}
      />
    </NavigationContainer>
  )
}

export default AppContent