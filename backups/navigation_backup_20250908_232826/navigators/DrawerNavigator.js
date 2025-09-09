import React, { useRef, useEffect, useState } from "react"
import {
  View,
  Animated,
  Easing,
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
    configurePushNotifications()
  }

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await Purchases.setDebugLogsEnabled(true)
        await Purchases.configure({ apiKey: "appl_bHxScLAZLsKxfggiOiqVAZTXjJX" })

        await checkSubscription()
        await checkFirstTimeOpen()
        configurePushNotifications()
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
        <Drawer.Navigator
          drawerContent={(props) => <CustomDrawerContent {...props} isSubscribed={isSubscribed} />}
          drawerPosition="right"
          screenOptions={({ route }) => {
            let iconColor = "#4a6bff"

            if (route.name === currentTranslations.information) {
              iconColor = "#5856d6"
            }

            return {
              headerShown: false,
              drawerStyle: {
                backgroundColor: theme.background,
                width: 280,
                borderTopLeftRadius: 15,
                borderBottomLeftRadius: 15,
              },
              drawerActiveBackgroundColor: `${iconColor}20`,
              drawerActiveTintColor: iconColor,
              drawerInactiveTintColor: theme.text,
              drawerLabelStyle: {
                fontSize: 16,
                fontWeight: "500",
                fontFamily: "Poppins-Regular",
              },
              drawerItemStyle: styles.drawerItem,
            }
          }}
          screenListeners={{
            state: (e) => {
              checkSubscription()
            },
          }}
        >
          <Drawer.Screen
            name={currentTranslations.home}
            children={(props) => <TabletTopTabNavigator {...props} isSubscribed={isSubscribed} />}
            options={{
              drawerIcon: ({ focused, size }) => (
                <Ionicons name="home-outline" color={focused ? "#4a6bff" : "#8e8e93"} size={24} />
              ),
            }}
          />
          <Drawer.Screen
            name={currentTranslations.information}
            component={InformationStackNavigator}
            options={{
              drawerIcon: ({ focused, size }) => (
                <Ionicons name="information-circle-outline" color={focused ? "#5856d6" : "#8e8e93"} size={24} />
              ),
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    )
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} isSubscribed={isSubscribed} />}
        drawerPosition="right"
        screenOptions={({ route }) => {
          let iconColor
          const labelStyle = {
            fontSize: 16,
            fontWeight: "500",
            color: theme.text,
            fontFamily: "Poppins-Regular",
          }

          switch (route.name) {
            case screenText.createList:
              iconColor = "#4a6bff"
              break
            case screenText.imageList:
              iconColor = "#ff9500"
              break
            case screenText.textList:
              iconColor = "#ff9500"
              break
            case screenText.saved:
              iconColor = "#34c759"
              break
            case screenText.subscribe:
              iconColor = "#ff375f"
              break
            case screenText.information:
              iconColor = "#5856d6"
              break
            case "RecipesScreen":
              iconColor = "#af52de"
              break
            default:
              iconColor = "#8e8e93"
              break
          }

          return {
            headerShown: false,
            drawerStyle: {
              backgroundColor: theme.background,
              width: 280,
              borderTopLeftRadius: 15,
              borderBottomLeftRadius: 15,
            },
            drawerActiveBackgroundColor: `${iconColor}20`,
            drawerActiveTintColor: iconColor,
            drawerInactiveTintColor: theme.text,
            drawerLabelStyle: labelStyle,
            drawerItemStyle: styles.drawerItem,
            drawerIcon: ({ focused, size }) => {
              let iconName
              switch (route.name) {
                case screenText.createList:
                  iconName = "mic-outline"
                  break
                case screenText.imageList:
                  iconName = "image-outline"
                  break
                case screenText.textList:
                  iconName = "text-outline"
                  break
                case screenText.saved:
                  iconName = "bookmark-outline"
                  break
                case screenText.subscribe:
                  iconName = "star-outline"
                  break
                case screenText.information:
                  iconName = "information-circle-outline"
                  break
                case "RecipesScreen":
                  iconName = "book-outline"
                  break
                default:
                  iconName = "person-outline"
                  break
              }
              return <Ionicons name={iconName} color={focused ? iconColor : "#8e8e93"} size={size} />
            },
          }
        }}
        screenListeners={{
          state: (e) => {
            checkSubscription()
          },
        }}
      >
        <Drawer.Screen
          name={screenText.createList}
          component={HomeStackNavigator}
          initialParams={{ screen: initialRoute }}
        />
        <Drawer.Screen name={screenText.imageList} component={ImageListStackNavigator} />
        <Drawer.Screen name={screenText.saved} component={HistoryStackNavigator} />
        {!isSubscribed && <Drawer.Screen name={screenText.subscribe} component={SuscribeScreen} />}
        {isSubscribed && (
          <Drawer.Screen name={currentTranslations.mySubscription} component={MySubscriptionStackNavigator} />
        )}
        <Drawer.Screen name={screenText.information} component={InformationStackNavigator} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

export default AppContent