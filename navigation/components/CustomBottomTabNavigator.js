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
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useTheme } from "../../ThemeContext"
import * as RNLocalize from "react-native-localize"
import { translations } from "../../translations"
import DeviceInfo from "react-native-device-info"
import PrivacyModal from "../../screens/links/PrivacyModal"

import HomeScreen from "../../screens/HomeScreen"
import ImageListScreen from "../../screens/ImageListScreen"
import HistoryScreen from "../../screens/HistoryScreen"
import Suscribe from "../../screens/Suscribe"
import MySubscriptionScreen from "../../screens/MySubscriptionScreen"
import InformationScreen from "../../screens/InformationScreen"

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
      descriptions: {
        "star": "Gestiona tu suscripción",
        "star-outline": "Desbloquea todas las funciones",
        "information-circle-outline": "Acerca de la aplicación",
        "share-social-outline": "Comparte con amigos",
        "mail-outline": "Contáctanos para soporte",
        "shield-outline": "Lee nuestra política",
      }
    },
    en: {
      menuTitle: "Menu",
      menuSubtitle: "Additional options",
      closeButton: "Close",
      descriptions: {
        "star": "Manage your subscription",
        "star-outline": "Unlock all features",
        "information-circle-outline": "About the app",
        "share-social-outline": "Share with friends",
        "mail-outline": "Contact us for support",
        "shield-outline": "Read our policy",
      }
    },
    de: {
      menuTitle: "Menü",
      menuSubtitle: "Zusätzliche Optionen",
      closeButton: "Schließen",
      descriptions: {
        "star": "Verwalte dein Abonnement",
        "star-outline": "Alle Funktionen freischalten",
        "information-circle-outline": "Über die App",
        "share-social-outline": "Mit Freunden teilen",
        "mail-outline": "Kontaktiere uns für Support",
        "shield-outline": "Lies unsere Richtlinien",
      }
    },
    fr: {
      menuTitle: "Menu",
      menuSubtitle: "Options supplémentaires",
      closeButton: "Fermer",
      descriptions: {
        "star": "Gérez votre abonnement",
        "star-outline": "Débloquez toutes les fonctionnalités",
        "information-circle-outline": "À propos de l'app",
        "share-social-outline": "Partagez avec des amis",
        "mail-outline": "Contactez-nous pour le support",
        "shield-outline": "Lisez notre politique",
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
  const currentTranslations = getCurrentTranslations()
  const menuTexts = getMenuTexts()
  const [activeTab, setActiveTab] = useState(initialTab)
  const [isMenuModalVisible, setMenuModalVisible] = useState(false)
  
  // Debug modal state
  useEffect(() => {
    console.log("Menu modal visible:", isMenuModalVisible)
  }, [isMenuModalVisible])
  const [isPrivacyModalVisible, setPrivacyModalVisible] = useState(false)
  
  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current
  const rotateAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

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

  // Ensure activeTab is set to initialTab
  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

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
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
          </Stack.Navigator>
        )
      case "Images":
        return (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen 
              name="ImageListScreen" 
              component={ImageListScreen}
              initialParams={{ isSubscribed: isSubscribed }}
            />
          </Stack.Navigator>
        )
      case "History":
        return (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
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
      case "Information":
        return (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="InformationScreen" component={InformationScreen} />
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
              backgroundColor: "#4a6bff20",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <Ionicons 
              name={activeTab === "Home" ? "storefront" : activeTab === "Images" ? "image" : "bookmark"} 
              size={24} 
              color="#4a6bff" 
            />
          </View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: theme.text,
            }}
          >
            {activeTab === "Home" ? "Voice Grocery" : 
             activeTab === "Images" ? currentTranslations.imageList : 
             currentTranslations.saved}
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={() => {
            console.log("Menu button pressed")
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
            <Ionicons name="menu" size={24} color={theme.backgroundtres} />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        {isMenuScreen ? renderMenuScreen() : renderActiveScreen()}
      </View>

      {/* Custom Bottom Tab Bar */}
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
                  size={24}
                  color={tabColor}
                />
                <Text
                  style={{
                    color: tabColor,
                    fontSize: 12,
                    fontWeight: isActive ? "600" : "400",
                    marginTop: 4,
                    textAlign: "center",
                  }}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>
              </View>
            </TouchableOpacity>
          )
        })}
      </View>

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
            backgroundColor: "rgba(74, 107, 255, 0.15)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 30,
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
              maxHeight: "75%",
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
                  backgroundColor: "#4a6bff",
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
                  color: "#4a6bff",
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
                backgroundColor: "#4a6bff",
                paddingVertical: 12,
                paddingHorizontal: 30,
                borderRadius: 25,
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <Text
                style={{
                  color: theme.text,
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
    </View>
  )
}

export default CustomBottomTabNavigator