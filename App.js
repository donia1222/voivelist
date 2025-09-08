"use client"

import { useRef, useEffect, useState } from "react"
import {
  View,
  TouchableOpacity,
  Animated,
  Easing,
  Linking,
  StyleSheet,
  Text,
  Share,
  Image,
  Dimensions,
  ScrollView,
} from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import {
  createDrawerNavigator,
  useDrawerStatus,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
// Asegúrate de que estas importaciones estén presentes
import HomeScreen from "./screens/HomeScreen"
import Suscribe from "./screens/Suscribe"
import HistoryScreen from "./screens/HistoryScreen"
import InformationScreen from "./screens/InformationScreen"
import ImageListScreen from "./screens/ImageListScreen"
import MySubscriptionScreen from "./screens/MySubscriptionScreen"
import Purchases from "react-native-purchases"
import { ThemeProvider, useTheme } from "./ThemeContext"
import * as RNLocalize from "react-native-localize"
import screenNames from "./screens/translations/languagesApp"
import configurePushNotifications, { requestNotificationPermission } from "./screens/components/PushNotification"
import { NotificationProvider } from "./NotificationContext"
import DeviceInfo from "react-native-device-info"
import PrivacyModal from "./screens/links/PrivacyModal"
import FavoritesScreen from "./screens/FavoritesScreen"

// Device detection
const { width: screenWidth } = Dimensions.get("window")
const isTablet = screenWidth >= 768

const supportedLanguages = ["en", "es", "de", "it", "fr", "tr", "pt", "ru", "ar", "hu", "ja", "hi", "nl", "zh"]

const translations = {
  en: {
    contactUs: "Contact Us",
    mode: "Mode",
    privacyPolicy: "Privacy Policy",
    share: "Recommend",
    shareMessage:
      "Check out this amazing app! Download it here: https://apps.apple.com/app/voice-shopping-list/id6505125372",
    recipes: "List by Recipes",
    createList: "Voice List",
    saved: "Saved",
    imageList: "Image List",
    subscribe: "Subscribe",
    mySubscription: "My Subscription",
    information: "Information",
    home: "Home", // Added home translation
    // Header titles
    voiceGrocery: "Voice Grocery",
    history: "History",
    savedLists: "Saved Lists",
    favorites: "Favorites",
  },
  es: {
    contactUs: "Contáctenos",
    mode: "Modo",
    privacyPolicy: "Política de privacidad",
    share: "Recomendar",
    shareMessage:
      "¡Mira esta increíble aplicación! Descárgala aquí: https://apps.apple.com/app/voice-shopping-list/id6505125372",
    recipes: "Lista por recetas",
    createList: "Lista por voz",
    saved: "Guardado",
    imageList: "Lista de imágenes",
    subscribe: "Suscribirse",
    mySubscription: "Mi suscripción",
    information: "Información",
    home: "Inicio", // Added home translation
    // Header titles
    voiceGrocery: "Lista de Voz",
    history: "Historial",
    savedLists: "Listas Guardadas",
    favorites: "Favoritos",
  },
  de: {
    contactUs: "Kontaktiere uns",
    mode: "Modus",
    privacyPolicy: "Datenschutz",
    share: "App empfehlen",
    shareMessage:
      "Schau dir diese unglaubliche App an! Lade sie hier herunter: https://apps.apple.com/app/voice-shopping-list/id6505125372",
    recipes: "Liste nach Rezepten",
    createList: "Sprachliste",
    saved: "Gespeichert",
    imageList: "Bilderliste",
    subscribe: "Abonnieren",
    mySubscription: "Mein Abonnement",
    information: "Information",
    home: "Startseite", // Added home translation
    // Header titles
    voiceGrocery: "Sprach-Einkauf",
    history: "Verlauf",
    savedLists: "Gespeicherte Listen",
    favorites: "Favoriten",
  },
  it: {
    contactUs: "Contattaci",
    mode: "Modalità",
    privacyPolicy: "Informativa sulla privacy",
    share: "Consiglia App",
    shareMessage:
      "Scopri questa incredibile app! Scaricala qui: https://apps.apple.com/app/voice-shopping-list/id6505125372",
    recipes: "Lista per ricette",
    createList: "Lista vocale",
    saved: "Salvato",
    imageList: "Lista di immagini",
    subscribe: "Iscriviti",
    mySubscription: "Il mio abbonamento",
    information: "Informazioni",
    home: "Casa", // Added home translation
    // Header titles
    voiceGrocery: "Lista Vocale",
    history: "Cronologia",
    savedLists: "Liste Salvate",
    favorites: "Preferiti",
  },
  fr: {
    contactUs: "Contactez-nous",
    mode: "Mode",
    privacyPolicy: "Politique de confidentialité",
    share: "Recommander l'App",
    shareMessage:
      "Découvrez cette incroyable application ! Téléchargez-la ici : https://apps.apple.com/app/voice-shopping-list/id6505125372",
    recipes: "Liste par recettes",
    createList: "Liste vocale",
    saved: "Enregistré",
    imageList: "Liste d'images",
    subscribe: "S'abonner",
    mySubscription: "Mon abonnement",
    information: "Information",
    home: "Accueil", // Added home translation
    // Header titles
    voiceGrocery: "Liste Vocale",
    history: "Historique",
    savedLists: "Listes Sauvegardées",
    favorites: "Favoris",
  },
  pt: {
    contactUs: "Contate-Nos",
    mode: "Modo",
    privacyPolicy: "Política de Privacidade",
    share: "Recomendar App",
    shareMessage:
      "Confira este aplicativo incrível! Baixe aqui: https://apps.apple.com/app/voice-shopping-list/id6505125372",
    recipes: "Lista por receitas",
    createList: "Lista por voz",
    saved: "Salvo",
    imageList: "Lista de imagens",
    subscribe: "Assine",
    mySubscription: "Minha assinatura",
    information: "Informação",
    home: "Início", // Added home translation
    // Header titles
    voiceGrocery: "Lista de Voz",
    history: "Histórico",
    savedLists: "Listas Salvas",
    favorites: "Favoritos",
  },
  ru: {
    contactUs: "Свяжитесь с нами",
    mode: "Режим",
    privacyPolicy: "Политика конфиденциальности",
    share: "Рекомендовать приложение",
    shareMessage:
      "Посмотрите на это удивительное приложение! Загрузите его здесь: https://apps.apple.com/app/voice-shopping-list/id6505125372",
    recipes: "Список по рецептам",
    createList: "Голосовой список",
    saved: "Сохранено",
    imageList: "Список изображений",
    subscribe: "Подписаться",
    mySubscription: "Моя подписка",
    information: "Информация",
    home: "Главная", // Added home translation
    // Header titles
    voiceGrocery: "Голосовой Список",
    history: "История",
    savedLists: "Сохраненные Списки",
    favorites: "Избранное",
  },
  ar: {
    contactUs: "اتصل بنا",
    mode: "الوضع",
    privacyPolicy: "سياسة الخصوصية",
    share: "توصية بالتطبيق",
    shareMessage:
      "تحقق من هذا التطبيق المذهل! قم بتنزيله هنا: https://apps.apple.com/app/voice-shopping-list/id6505125372",
    recipes: "قائمة حسب الوصفات",
    createList: "قائمة صوتية",
    saved: "تم الحفظ",
    imageList: "قائمة الصور",
    subscribe: "الاشتراك",
    mySubscription: "اشتراكي",
    information: "معلومات",
    home: "الرئيسية", // Added home translation
    // Header titles
    voiceGrocery: "قائمة التسوق الصوتية",
    history: "التاريخ",
    savedLists: "القوائم المحفوظة",
    favorites: "المفضلة",
  },
  ja: {
    contactUs: "お問い合わせ",
    mode: "モード",
    privacyPolicy: "プライバシーポリシー",
    share: "アプリを推薦",
    shareMessage:
      "この素晴らしいアプリをチェックしてください！ ここからダウンロードしてください: https://apps.apple.com/app/voice-shopping-list/id6505125372",
    recipes: "レシピ別リスト",
    createList: "音声リスト",
    saved: "保存済み",
    imageList: "画像リスト",
    subscribe: "サブスクライブ",
    mySubscription: "私のサブスクリプション",
    information: "情報",
    home: "ホーム", // Added home translation
    // Header titles
    voiceGrocery: "音声ショッピング",
    history: "履歴",
    savedLists: "保存されたリスト",
    favorites: "お気に入り",
  },
  zh: {
    contactUs: "联系我们",
    mode: "模式",
    privacyPolicy: "隐私政策",
    share: "推荐应用",
    shareMessage: "查看这个神奇的应用！ 在此处下载：https://apps.apple.com/app/voice-shopping-list/id6505125372",
    recipes: "按食谱列表",
    createList: "语音列表",
    saved: "已保存",
    imageList: "图片列表",
    subscribe: "订阅",
    mySubscription: "我的订阅",
    information: "信息",
    home: "主页", // Added home translation
    // Header titles
    voiceGrocery: "语音购物",
    history: "历史",
    savedLists: "已保存的列表",
    favorites: "收藏夹",
  },
}

const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator()

// Helper function to get current translations
const getCurrentTranslations = () => {
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  return translations[deviceLanguage] || translations["en"]
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 16,
    paddingTop: 30,
    alignItems: "center",
    marginBottom: 10,
  },
  drawerLogo: {
    width: 80,
    height: 80,
    borderRadius: 35,
    marginBottom: -10,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Poppins-SemiBold",
    color: "#333",
  },
  drawerItem: {
    borderRadius: 8,
    marginHorizontal: 12,
    marginVertical: 4,
  },
  drawerItemActive: {
    backgroundColor: "#e6f7ff",
  },
  drawerItemLabel: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  separator: {
    height: 1,
    backgroundColor: "#e9ecef",
    marginVertical: 10,
    marginHorizontal: 16,
  },
  drawerFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#6c757d",
    fontFamily: "Poppins-Regular",
  },
  contactItem: {
    marginTop: 0,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 15,
  },
  headerLogoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    width: 52,
    height: 52,
    marginLeft: -10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
    marginLeft: 10,
    fontFamily: "Poppins-Regular",
  },
  headerMenuButton: {
    padding: 5,
    marginRight: 20,
  },
  // New styles for tablet top navigation
  tabletContainer: {
    flex: 1,
  },
  tabletHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  tabletLogoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabletLogo: {
    width: 40,
    height: 40,
  },
  tabletTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#444",
    marginLeft: 10,
    fontFamily: "Poppins-Regular",
  },
  tabletMenuButton: {
    padding: 8,
  },
  tabletTabsContainer: {
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  tabletTabsScrollView: {
    paddingHorizontal: 10,
  },
  tabletTabsContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    justifyContent: "center", // Add this line to center the tabs
    minWidth: "100%", // Add this to ensure full width
  },
  tabletTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 25,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabletTabActive: {
    backgroundColor: "#4a6bff",
    shadowColor: "#4a6bff",
    shadowOpacity: 0.3,
  },
  tabletTabIcon: {
    marginRight: 8,
  },
  tabletTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  tabletTabTextActive: {
    color: "white",
  },
  tabletContent: {
    flex: 1,
  },
})

function CustomDrawerContent(props) {
  const { theme, toggleTheme } = useTheme()
  const { isSubscribed } = props
  const currentTranslations = getCurrentTranslations()
  const [isPrivacyModalVisible, setIsPrivacyModalVisible] = useState(false)

  const shareMessage = currentTranslations.shareMessage
  const shareAppLink = async () => {
    try {
      const result = await Share.share({
        message: shareMessage,
      })

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with activity type of", result.activityType)
        } else {
          console.log("Shared")
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Dismissed")
      }
    } catch (error) {
      console.error("Error al compartir", error.message)
    }
  }

  const handlePrivacyPress = () => {
    setIsPrivacyModalVisible(true)
  }

  const handleContactPress = () => {
    const emailBody = `
      Device Model: ${DeviceInfo.getModel()}\n
      OS Version: ${DeviceInfo.getSystemVersion()}\n
    `

    const mailtoURL = `mailto:info@lweb.ch?subject=Contact&body=${encodeURIComponent(emailBody)}`
    Linking.openURL(mailtoURL).catch((err) => console.error("Failed to open mail app:", err))
  }

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Image
          source={require("./assets/images/App-Icon-1024x1024@1x copia.png")}
          style={styles.drawerLogo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.separator} />

      {/* Show all drawer items including Information for both tablet and phone */}
      <DrawerItemList {...props} itemStyle={styles.drawerItem} labelStyle={styles.drawerItemLabel} />

      <View style={styles.separator} />

      <DrawerItem
        label={currentTranslations.share}
        onPress={shareAppLink}
        icon={({ color, size }) => <Ionicons name="share-social-outline" size={24} color={"#4a6bff"} />}
        labelStyle={[styles.drawerItemLabel, { color: theme.textdos }]}
        style={styles.drawerItem}
      />

      <DrawerItem
        label={currentTranslations.contactUs}
        onPress={handleContactPress}
        icon={({ color, size }) => <Ionicons name="mail-outline" size={24} color={"#ff9500"} />}
        labelStyle={[styles.drawerItemLabel, { color: theme.textdos }]}
        style={styles.drawerItem}
      />

      <DrawerItem
        label={currentTranslations.privacyPolicy}
        onPress={handlePrivacyPress}
        icon={({ color, size }) => <Ionicons name="shield-outline" size={24} color={"#34c759"} />}
        labelStyle={[styles.drawerItemLabel, { color: theme.textdos }]}
        style={styles.drawerItem}
      />

      <View style={styles.drawerFooter}>
        <Text style={styles.footerText}>Powered by Chat GPT</Text>
      </View>

      <PrivacyModal visible={isPrivacyModalVisible} onClose={() => setIsPrivacyModalVisible(false)} />
    </DrawerContentScrollView>
  )
}

// Custom Top Tab Navigator for Tablets
function TabletTopTabNavigator({ navigation, isSubscribed }) {
  const { theme } = useTheme()
  const currentTranslations = getCurrentTranslations()
  const [activeTab, setActiveTab] = useState("VoiceList")

  // Removed Information from tabs since it's now only in the drawer menu
  const tabs = [
    {
      key: "VoiceList",
      label: currentTranslations.createList,
      icon: "mic-outline",
      color: "#4a6bff",
    },
    {
      key: "ImageList",
      label: currentTranslations.imageList,
      icon: "image-outline",
      color: "#ff9500",
    },
    {
      key: "SavedLists",
      label: currentTranslations.saved,
      icon: "bookmark-outline",
      color: "#34c759",
    },
    ...(isSubscribed
      ? [
          {
            key: "MySubscription",
            label: currentTranslations.mySubscription,
            icon: "star",
            color: "#ff375f",
          },
        ]
      : [
          {
            key: "Subscribe",
            label: currentTranslations.subscribe,
            icon: "star-outline",
            color: "#ff375f",
          },
        ]),
  ]

  const handleTabPress = (tab) => {
    setActiveTab(tab.key)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "VoiceList":
        return <HomeScreen navigation={navigation} />
      case "ImageList":
        return <ImageListScreen navigation={navigation} />
      case "SavedLists":
        return <HistoryScreen navigation={navigation} />
      case "Subscribe":
        return <Suscribe navigation={navigation} />
      case "MySubscription":
        return <MySubscriptionScreen navigation={navigation} />
      default:
        return <HomeScreen navigation={navigation} />
    }
  }

  return (
    <View style={[styles.tabletContainer, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.tabletHeader, { backgroundColor: theme.background }]}>
        <View style={styles.tabletLogoContainer}>
          <Image
            source={require("./assets/images/App-Icon-1024x1024@1x copia.png")}
            style={styles.tabletLogo}
            resizeMode="contain"
          />
          <Text style={[styles.tabletTitle, { color: theme.text }]}>Voice Grocery</Text>
        </View>

        {/* Changed from ellipsis-horizontal to menu (hamburger icon) */}
        <TouchableOpacity style={styles.tabletMenuButton} onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={28} color={theme.backgroundtresapp} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={[styles.tabletTabsContainer, { backgroundColor: theme.background }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabletTabsScrollView}
          contentContainerStyle={[styles.tabletTabsContent, tabs.length <= 5 && { justifyContent: "center", flex: 1 }]}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabletTab,
                activeTab === tab.key && [styles.tabletTabActive, { backgroundColor: tab.color }],
              ]}
              onPress={() => handleTabPress(tab)}
            >
              <Ionicons
                name={tab.icon}
                size={20}
                color={activeTab === tab.key ? "white" : tab.color}
                style={styles.tabletTabIcon}
              />
              <Text
                style={[
                  styles.tabletTabText,
                  activeTab === tab.key && styles.tabletTabTextActive,
                  { color: activeTab === tab.key ? "white" : theme.text },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <View style={styles.tabletContent}>{renderTabContent()}</View>
    </View>
  )
}

// Updated HeaderWithLogo component for phones
function HeaderWithLogo({ navigation, isDrawerOpen, theme, title }) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerLogoContainer}>
        <Image
          source={require("./assets/images/App-Icon-1024x1024@1x copia.png")}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        {title && <Text style={styles.headerTitle}>{title}</Text>}
      </View>

      {/* Changed from ellipsis-horizontal to menu for phones too */}
      <TouchableOpacity style={styles.headerMenuButton} onPress={() => navigation.openDrawer()}>
        <Ionicons name={isDrawerOpen ? "close" : "menu"} size={36} color={theme.backgroundtresapp} />
      </TouchableOpacity>
    </View>
  )
}

// NEW: Header component specifically for tablets when showing Information screen
function TabletHeaderWithMenu({ navigation, theme, title }) {
  return (
    <View style={[styles.tabletHeader, { backgroundColor: theme.background }]}>
      <View style={styles.tabletLogoContainer}>
        <Image
          source={require("./assets/images/App-Icon-1024x1024@1x copia.png")}
          style={styles.tabletLogo}
          resizeMode="contain"
        />
        <Text style={[styles.tabletTitle, { color: theme.text }]}>{title}</Text>
      </View>

      <TouchableOpacity style={styles.tabletMenuButton} onPress={() => navigation.openDrawer()}>
        <Ionicons name="menu" size={28} color={theme.backgroundtresapp} />
      </TouchableOpacity>
    </View>
  )
}

// Stack Navigators (keeping existing ones)
function HomeStackNavigator({ navigation }) {
  const isDrawerOpen = useDrawerStatus() === "open"
  const { theme } = useTheme()
  const currentTranslations = getCurrentTranslations()

  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerShadowVisible: false,
          headerTintColor: "#a2a2a200",
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.voiceGrocery}
              />
            ) : (
              <View />
            ),
        }}
      />

      <Stack.Screen
        name="Suscribe"
        component={Suscribe}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerShadowVisible: false,
          headerTintColor: theme.text,
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.subscribe}
              />
            ) : (
              <View />
            ),
        }}
      />

      <Stack.Screen
        name="HistoryScreen"
        component={HistoryScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: "#a2a2a200",
          headerShadowVisible: false,
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.history}
              />
            ) : (
              <View />
            ),
        }}
      />

      <Stack.Screen
        name="InformationScreen"
        component={InformationScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: theme.text,
          headerTitleStyle: {},
          headerShadowVisible: false,
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.information}
              />
            ) : (
              <View />
            ),
        }}
      />

      <Stack.Screen
        name="ImageListScreen"
        component={ImageListScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: theme.text,
          headerTitleStyle: {},
          headerShadowVisible: false,
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.imageList}
              />
            ) : (
              <View />
            ),
        }}
      />

      <Stack.Screen
        name="MySubscriptionScreen"
        component={MySubscriptionScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: "#a2a2a200",
          headerShadowVisible: false,
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.mySubscription}
              />
            ) : (
              <View />
            ),
        }}
      />
    </Stack.Navigator>
  )
}

function SuscribeScreen({ navigation }) {
  const isDrawerOpen = useDrawerStatus() === "open"
  const { theme } = useTheme()
  const currentTranslations = getCurrentTranslations()

  return (
    <Stack.Navigator initialRouteName="Suscribe">
      <Stack.Screen
        name="Suscribe"
        component={Suscribe}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerShadowVisible: false,
          headerTintColor: "#a2a2a200",
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.subscribe}
              />
            ) : (
              <View />
            ),
        }}
      />

      <Stack.Screen
        name="HistoryScreen"
        component={HistoryScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: "#a2a2a200",
          headerShadowVisible: false,
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.history}
              />
            ) : (
              <View />
            ),
        }}
      />
    </Stack.Navigator>
  )
}

function HistoryStackNavigator({ navigation }) {
  const isDrawerOpen = useDrawerStatus() === "open"
  const { theme } = useTheme()
  const currentTranslations = getCurrentTranslations()

  return (
    <Stack.Navigator initialRouteName="HistoryScreen">
      <Stack.Screen
        name="HistoryScreen"
        component={HistoryScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: "#a2a2a200",
          headerShadowVisible: false,
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.history}
              />
            ) : (
              <View />
            ),
        }}
      />

      <Stack.Screen
        name="Suscribe"
        component={Suscribe}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: "#a2a2a200",
          headerShadowVisible: false,
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.subscribe}
              />
            ) : (
              <View />
            ),
        }}
      />
    </Stack.Navigator>
  )
}

// MODIFIED: InformationStackNavigator now shows header for tablets too
function InformationStackNavigator({ navigation }) {
  const { theme, toggleTheme } = useTheme()
  const currentTranslations = getCurrentTranslations()
  const isDrawerOpen = useDrawerStatus() === "open"

  return (
    <Stack.Navigator initialRouteName="InformationScreen">
      <Stack.Screen
        name="InformationScreen"
        component={InformationScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerShadowVisible: false,
          headerTintColor: "#a2a2a200",
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.information}
              />
            ) : (
              <TabletHeaderWithMenu navigation={navigation} theme={theme} title={currentTranslations.information} />
            ),
        }}
      />

      <Stack.Screen
        name="Suscribe"
        component={Suscribe}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: "#a2a2a200",
          headerShadowVisible: false,
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.subscribe}
              />
            ) : (
              <TabletHeaderWithMenu navigation={navigation} theme={theme} title={currentTranslations.subscribe} />
            ),
        }}
      />
    </Stack.Navigator>
  )
}

function FavoritesStackNavigator({ navigation }) {
  const isDrawerOpen = useDrawerStatus() === "open"
  const { theme } = useTheme()
  const currentTranslations = getCurrentTranslations()

  return (
    <Stack.Navigator initialRouteName="FavoritesScreen">
      <Stack.Screen
        name="FavoritesScreen"
        component={FavoritesScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: "#a2a2a200",
          headerShadowVisible: false,
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.favorites}
              />
            ) : (
              <View />
            ),
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate("FavoritesScreen")}>
              <Ionicons name="heart" size={26} color="#ff375f" style={{ marginRight: 15 }} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  )
}

function ImageListStackNavigator({ navigation }) {
  const isDrawerOpen = useDrawerStatus() === "open"
  const { theme } = useTheme()
  const currentTranslations = getCurrentTranslations()

  return (
    <Stack.Navigator initialRouteName="ImageListScreen">
      <Stack.Screen
        name="ImageListScreen"
        component={ImageListScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerShadowVisible: false,
          headerTintColor: "#a2a2a200",
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.imageList}
              />
            ) : (
              <View />
            ),
        }}
      />

      <Stack.Screen
        name="Suscribe"
        component={Suscribe}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: "#a2a2a200",
          headerShadowVisible: false,
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.subscribe}
              />
            ) : (
              <View />
            ),
        }}
      />
    </Stack.Navigator>
  )
}

function MySubscriptionStackNavigator({ navigation }) {
  const isDrawerOpen = useDrawerStatus() === "open"
  const { theme } = useTheme()
  const currentTranslations = getCurrentTranslations()

  return (
    <Stack.Navigator initialRouteName="MySubscriptionScreen">
      <Stack.Screen
        name="MySubscriptionScreen"
        component={MySubscriptionScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: "#a2a2a200",
          headerShadowVisible: false,
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.mySubscription}
              />
            ) : (
              <View />
            ),
        }}
      />

      <Stack.Screen
        name="Suscribe"
        component={Suscribe}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: "#a2a2a200",
          headerShadowVisible: false,
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.subscribe}
              />
            ) : (
              <View />
            ),
        }}
      />
    </Stack.Navigator>
  )
}

// Create a separate component for the main app content that uses the theme
function AppContent() {
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  const screenText = screenNames[deviceLanguage] || screenNames["en"]
  const currentTranslations = getCurrentTranslations()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [initialRoute, setInitialRoute] = useState("HomeScreen")
  const [isPermissionModalVisible, setPermissionModalVisible] = useState(false)
  const micAnimation = useRef(new Animated.Value(1)).current

  // NOW this is inside ThemeProvider, so useTheme will work
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

  // Render different navigation structures based on device type
  if (isTablet) {
    return (
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={(props) => <CustomDrawerContent {...props} isSubscribed={isSubscribed} />}
          drawerPosition="right"
          screenOptions={({ route }) => {
            let iconColor = "#4a6bff" // Default color for Home

            // Set specific color for Information
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
          {/* CHANGED: MainTabs is now "Home" with home icon */}
          <Drawer.Screen
            name={currentTranslations.home}
            children={(props) => <TabletTopTabNavigator {...props} isSubscribed={isSubscribed} />}
            options={{
              drawerIcon: ({ focused, size }) => (
                <Ionicons name="home-outline" color={focused ? "#4a6bff" : "#8e8e93"} size={24} />
              ),
            }}
          />
          {/* Add Information screen to drawer for tablets */}
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

  // Phone navigation (original structure)
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

// Main App component that wraps everything in providers
export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </ThemeProvider>
  )
}
