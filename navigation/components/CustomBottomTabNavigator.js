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
  TextInput,
  Platform,
  Dimensions,
} from "react-native"
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import ReanimatedAnimated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated'
import { Modalize } from 'react-native-modalize'
import { Ionicons } from "@expo/vector-icons"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useTheme } from "../../ThemeContext"
import { useRecording } from "../../RecordingContext"
import * as RNLocalize from "react-native-localize"
import { translations } from "../../translations"
import texts from "../../screens/translations/texts"
import mealPlannerTranslations from "../../screens/translations/mealPlannerTranslations"
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
import ContactScreen from "../../screens/ContactScreen"
import HandwrittenListScreen from "../../screens/HandwrittenListScreen"
import RecommendationsScreen from "../../screens/RecommendationsScreen"
import SeasonalRecommendationsScreen from "../../screens/SeasonalRecommendationsScreen"
import MealPlannerScreen from "../../screens/MealPlannerScreen"

const Stack = createNativeStackNavigator()

const getCurrentTranslations = () => {
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  return translations[deviceLanguage] || translations["en"]
}

const getMealPlannerTranslations = () => {
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  return mealPlannerTranslations[deviceLanguage] || mealPlannerTranslations["en"]
}

const getMenuTexts = () => {
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  const menuTexts = {
    es: {
      menuTitle: "Menú",
      menuSubtitle: "Opciones adicionales",
      closeButton: "Cerrar",
      settings: "Ajustes",
      error: "Error",
      errorSavingList: "No se pudo guardar la lista",
      recommendations: "Recomendaciones",
      languageModalTitle: "Idioma",
      languageModalDescription: "Para cambiar el idioma de la aplicación, ve a la configuración de tu dispositivo.",
      languageModalInfo: "La interfaz de la aplicación está disponible en tu idioma seleccionado. El reconocimiento de voz entiende productos en 13 idiomas.",
      understood: "¡Entendido!",
      goToSettings: "Ir a Ajustes",
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
        "create-outline": "Crea listas manualmente",
        "pencil": "Escribe tus listas a mano",
        "bulb": "Ideas de productos recomendados",
        "restaurant-outline": "Planifica tus menús semanales",
      }
    },
    en: {
      menuTitle: "Menu",
      menuSubtitle: "Additional options",
      closeButton: "Close",
      settings: "Settings",
      error: "Error",
      errorSavingList: "Could not save the list",
      recommendations: "Recommendations",
      languageModalTitle: "Language",
      languageModalDescription: "To change the app language, go to your device settings.",
      languageModalInfo: "The app interface is available in your selected language. Voice recognition understands products in 13 languages.",
      understood: "Got it!",
      goToSettings: "Go to Settings",
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
        "create-outline": "Create lists manually",
        "pencil": "Write your lists by hand",
        "bulb": "Recommended product ideas",
        "restaurant-outline": "Plan your weekly menus",
      }
    },
    de: {
      menuTitle: "Menü",
      menuSubtitle: "Zusätzliche Optionen",
      closeButton: "Schließen",
      settings: "Einstellungen",
      error: "Fehler",
      errorSavingList: "Liste konnte nicht gespeichert werden",
      recommendations: "Empfehlungen",
      languageModalTitle: "Sprache",
      languageModalDescription: "Um die App-Sprache zu ändern, gehen Sie zu Ihren Geräteeinstellungen.",
      languageModalInfo: "Die App-Oberfläche ist in Ihrer gewählten Sprache verfügbar. Die Spracherkennung versteht Produkte in 13 Sprachen.",
      understood: "Verstanden!",
      goToSettings: "Zu Einstellungen gehen",
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
        "create-outline": "Listen manuell erstellen",
        "pencil": "Schreiben Sie Ihre Listen von Hand",
        "bulb": "Empfohlene Produktideen",
        "restaurant-outline": "Plane deine wöchentlichen Menüs",
      }
    },
    fr: {
      menuTitle: "Menu",
      menuSubtitle: "Options supplémentaires",
      closeButton: "Fermer",
      settings: "Paramètres",
      error: "Erreur",
      errorSavingList: "Impossible d'enregistrer la liste",
      recommendations: "Recommandations",
      languageModalTitle: "Langue",
      languageModalDescription: "Pour changer la langue de l'application, allez dans les paramètres de votre appareil.",
      languageModalInfo: "L'interface de l'application est disponible dans votre langue sélectionnée. La reconnaissance vocale comprend les produits en 13 langues.",
      understood: "Compris!",
      goToSettings: "Aller aux Paramètres",
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
        "calendar-outline": "Planifiez vos achats hebdomadaires",
        "create-outline": "Créer des listes manuellement",
        "pencil": "Écrivez vos listes à la main",
        "bulb": "Idées de produits recommandés",
        "restaurant-outline": "Planifiez vos menus hebdomadaires",
      }
    },
    it: {
      menuTitle: "Menu",
      menuSubtitle: "Opzioni aggiuntive",
      closeButton: "Chiudi",
      settings: "Impostazioni",
      error: "Errore",
      errorSavingList: "Impossibile salvare la lista",
      recommendations: "Raccomandazioni",
      languageModalTitle: "Lingua",
      languageModalDescription: "Per cambiare la lingua dell'app, vai alle impostazioni del tuo dispositivo.",
      languageModalInfo: "L'interfaccia dell'app è disponibile nella tua lingua selezionata. Il riconoscimento vocale comprende prodotti in 13 lingue.",
      understood: "Capito!",
      goToSettings: "Vai alle Impostazioni",
      descriptions: {
        "star": "Gestisci il tuo abbonamento",
        "star-outline": "Sblocca tutte le funzionalità",
        "calculator": "Calcola i prezzi delle liste",
        "information-circle-outline": "Informazioni sull'app",
        "share-social-outline": "Condividi con gli amici",
        "mail-outline": "Contattaci per supporto",
        "shield-outline": "Leggi la nostra politica",
        "document-text-outline": "Leggi i nostri termini",
        "settings-outline": "Impostazioni dell'app",
        "calendar-outline": "Pianifica la tua spesa settimanale",
        "create-outline": "Crea liste manualmente",
        "pencil": "Scrivi le tue liste a mano",
        "bulb": "Idee di prodotti consigliati",
        "restaurant-outline": "Pianifica i tuoi menu settimanali",
      }
    },
    tr: {
      menuTitle: "Menü",
      menuSubtitle: "Ek seçenekler",
      closeButton: "Kapat",
      settings: "Ayarlar",
      error: "Hata",
      errorSavingList: "Liste kaydedilemedi",
      recommendations: "Öneriler",
      languageModalTitle: "Dil",
      languageModalDescription: "Uygulama dilini değiştirmek için cihaz ayarlarınıza gidin.",
      languageModalInfo: "Uygulama arayüzü seçtiğiniz dilde kullanılabilir. Ses tanıma 13 dilde ürünleri anlar.",
      understood: "Anladım!",
      goToSettings: "Ayarlara Git",
      descriptions: {
        "star": "Aboneliğinizi yönetin",
        "star-outline": "Tüm özellikleri kilidini açın",
        "calculator": "Liste fiyatlarını hesapla",
        "information-circle-outline": "Uygulama hakkında",
        "share-social-outline": "Arkadaşlarınızla paylaşın",
        "mail-outline": "Destek için bize ulaşın",
        "shield-outline": "Politikamızı okuyun",
        "document-text-outline": "Şartlarımızı okuyun",
        "settings-outline": "Uygulama ayarları",
        "calendar-outline": "Haftalık alışverişinizi planlayın",
        "create-outline": "Manuel olarak listeler oluşturun",
        "pencil": "Listelerinizi elle yazın",
        "bulb": "Önerilen ürün fikirleri",
        "restaurant-outline": "Haftalık menülerinizi planlayın",
      }
    },
    pt: {
      menuTitle: "Menu",
      menuSubtitle: "Opções adicionais",
      closeButton: "Fechar",
      settings: "Configurações",
      error: "Erro",
      errorSavingList: "Não foi possível salvar a lista",
      recommendations: "Recomendações",
      languageModalTitle: "Idioma",
      languageModalDescription: "Para alterar o idioma do aplicativo, vá para as configurações do seu dispositivo.",
      languageModalInfo: "A interface do aplicativo está disponível no seu idioma selecionado. O reconhecimento de voz entende produtos em 13 idiomas.",
      understood: "Entendi!",
      goToSettings: "Ir para Configurações",
      descriptions: {
        "star": "Gerencie sua assinatura",
        "star-outline": "Desbloqueie todos os recursos",
        "calculator": "Calcule preços de listas",
        "information-circle-outline": "Sobre o app",
        "share-social-outline": "Compartilhe com amigos",
        "mail-outline": "Entre em contato para suporte",
        "shield-outline": "Leia nossa política",
        "document-text-outline": "Leia nossos termos",
        "settings-outline": "Configurações do app",
        "calendar-outline": "Planeje suas compras semanais",
        "create-outline": "Criar listas manualmente",
        "pencil": "Escreva suas listas à mão",
        "bulb": "Ideias de produtos recomendados",
        "restaurant-outline": "Planeje seus menus semanais",
      }
    },
    ru: {
      menuTitle: "Меню",
      menuSubtitle: "Дополнительные опции",
      closeButton: "Закрыть",
      settings: "Настройки",
      error: "Ошибка",
      errorSavingList: "Не удалось сохранить список",
      recommendations: "Рекомендации",
      languageModalTitle: "Язык",
      languageModalDescription: "Чтобы изменить язык приложения, перейдите в настройки вашего устройства.",
      languageModalInfo: "Интерфейс приложения доступен на выбранном вами языке. Распознавание голоса понимает продукты на 13 языках.",
      understood: "Понятно!",
      goToSettings: "Перейти в Настройки",
      descriptions: {
        "star": "Управляйте подпиской",
        "star-outline": "Разблокируйте все функции",
        "calculator": "Рассчитать цены списка",
        "information-circle-outline": "О приложении",
        "share-social-outline": "Поделиться с друзьями",
        "mail-outline": "Связаться с поддержкой",
        "shield-outline": "Прочитайте нашу политику",
        "document-text-outline": "Прочитайте наши условия",
        "settings-outline": "Настройки приложения",
        "calendar-outline": "Планируйте еженедельные покупки",
        "create-outline": "Создавайте списки вручную",
        "pencil": "Пишите свои списки от руки",
        "bulb": "Рекомендуемые идеи продуктов",
        "restaurant-outline": "Планируйте еженедельные меню",
      }
    },
    ar: {
      menuTitle: "القائمة",
      menuSubtitle: "خيارات إضافية",
      closeButton: "إغلاق",
      settings: "الإعدادات",
      error: "خطأ",
      errorSavingList: "تعذر حفظ القائمة",
      recommendations: "التوصيات",
      languageModalTitle: "اللغة",
      languageModalDescription: "لتغيير لغة التطبيق، انتقل إلى إعدادات جهازك.",
      languageModalInfo: "واجهة التطبيق متاحة باللغة التي اخترتها. يفهم التعرف على الصوت المنتجات بـ 13 لغة.",
      understood: "فهمت!",
      goToSettings: "انتقل إلى الإعدادات",
      descriptions: {
        "star": "إدارة اشتراكك",
        "star-outline": "فتح جميع الميزات",
        "calculator": "حساب أسعار القوائم",
        "information-circle-outline": "حول التطبيق",
        "share-social-outline": "شارك مع الأصدقاء",
        "mail-outline": "اتصل بنا للدعم",
        "shield-outline": "اقرأ سياستنا",
        "document-text-outline": "اقرأ شروطنا",
        "settings-outline": "إعدادات التطبيق",
        "calendar-outline": "خطط لتسوقك الأسبوعي",
        "create-outline": "إنشاء قوائم يدويًا",
        "pencil": "اكتب قوائمك بخط اليد",
        "bulb": "أفكار المنتجات الموصى بها",
        "restaurant-outline": "خطط لقوائمك الأسبوعية",
      }
    },
    hu: {
      menuTitle: "Menü",
      menuSubtitle: "További opciók",
      closeButton: "Bezárás",
      settings: "Beállítások",
      error: "Hiba",
      errorSavingList: "Nem sikerült menteni a listát",
      recommendations: "Ajánlások",
      languageModalTitle: "Nyelv",
      languageModalDescription: "Az alkalmazás nyelvének megváltoztatásához lépjen az eszköz beállításaiba.",
      languageModalInfo: "Az alkalmazás kezelőfelülete a kiválasztott nyelven érhető el. A hangfelismerés 13 nyelven érti a termékeket.",
      understood: "Értem!",
      goToSettings: "Ugrás a Beállításokhoz",
      descriptions: {
        "star": "Előfizetés kezelése",
        "star-outline": "Összes funkció feloldása",
        "calculator": "Listaárak kiszámítása",
        "information-circle-outline": "Az alkalmazásról",
        "share-social-outline": "Megosztás barátokkal",
        "mail-outline": "Kapcsolatfelvétel támogatásért",
        "shield-outline": "Olvassa el irányelveinket",
        "document-text-outline": "Olvassa el feltételeinket",
        "settings-outline": "Alkalmazás beállítások",
        "calendar-outline": "Tervezze meg heti bevásárlását",
        "create-outline": "Listák manuális létrehozása",
        "pencil": "Írja kézzel a listáit",
        "bulb": "Ajánlott termékötletek",
        "restaurant-outline": "Tervezze meg heti menüit",
      }
    },
    ja: {
      menuTitle: "メニュー",
      menuSubtitle: "追加オプション",
      closeButton: "閉じる",
      settings: "設定",
      error: "エラー",
      errorSavingList: "リストを保存できませんでした",
      recommendations: "推奨事項",
      languageModalTitle: "言語",
      languageModalDescription: "アプリの言語を変更するには、デバイスの設定に移動してください。",
      languageModalInfo: "アプリのインターフェースは選択した言語で利用できます。音声認識は13言語の製品を理解します。",
      understood: "わかりました！",
      goToSettings: "設定に移動",
      descriptions: {
        "star": "サブスクリプションを管理",
        "star-outline": "すべての機能をロック解除",
        "calculator": "リスト価格を計算",
        "information-circle-outline": "アプリについて",
        "share-social-outline": "友達と共有",
        "mail-outline": "サポートに連絡",
        "shield-outline": "ポリシーを読む",
        "document-text-outline": "利用規約を読む",
        "settings-outline": "アプリ設定",
        "calendar-outline": "週間ショッピングを計画",
        "create-outline": "手動でリストを作成",
        "pencil": "リストを手書きで作成",
        "bulb": "おすすめ商品アイデア",
        "restaurant-outline": "週間メニューを計画",
      }
    },
    hi: {
      menuTitle: "मेनू",
      menuSubtitle: "अतिरिक्त विकल्प",
      closeButton: "बंद करें",
      settings: "सेटिंग्स",
      error: "त्रुटि",
      errorSavingList: "सूची सहेजी नहीं जा सकी",
      recommendations: "सिफारिशें",
      languageModalTitle: "भाषा",
      languageModalDescription: "ऐप की भाषा बदलने के लिए, अपने डिवाइस की सेटिंग्स पर जाएं।",
      languageModalInfo: "ऐप का इंटरफेस आपकी चुनी गई भाषा में उपलब्ध है। आवाज़ पहचान 13 भाषाओं में उत्पादों को समझती है।",
      understood: "समझ गया!",
      goToSettings: "सेटिंग्स पर जाएं",
      descriptions: {
        "star": "अपनी सदस्यता प्रबंधित करें",
        "star-outline": "सभी सुविधाएं अनलॉक करें",
        "calculator": "सूची मूल्य की गणना करें",
        "information-circle-outline": "ऐप के बारे में",
        "share-social-outline": "दोस्तों के साथ साझा करें",
        "mail-outline": "समर्थन के लिए संपर्क करें",
        "shield-outline": "हमारी नीति पढ़ें",
        "document-text-outline": "हमारी शर्तें पढ़ें",
        "settings-outline": "ऐप सेटिंग्स",
        "calendar-outline": "अपनी साप्ताहिक खरीदारी की योजना बनाएं",
        "create-outline": "मैन्युअल रूप से सूचियाँ बनाएं",
        "pencil": "अपनी सूचियाँ हाथ से लिखें",
        "bulb": "अनुशंसित उत्पाद विचार",
        "restaurant-outline": "अपनी साप्ताहिक मेनू की योजना बनाएं",
      }
    },
    nl: {
      menuTitle: "Menu",
      menuSubtitle: "Extra opties",
      closeButton: "Sluiten",
      settings: "Instellingen",
      error: "Fout",
      errorSavingList: "Kon lijst niet opslaan",
      recommendations: "Aanbevelingen",
      languageModalTitle: "Taal",
      languageModalDescription: "Om de app-taal te wijzigen, ga naar de instellingen van uw apparaat.",
      languageModalInfo: "De app-interface is beschikbaar in uw geselecteerde taal. Spraakherkenning begrijpt producten in 13 talen.",
      understood: "Begrepen!",
      goToSettings: "Ga naar Instellingen",
      descriptions: {
        "star": "Beheer uw abonnement",
        "star-outline": "Ontgrendel alle functies",
        "calculator": "Bereken lijstprijzen",
        "information-circle-outline": "Over de app",
        "share-social-outline": "Deel met vrienden",
        "mail-outline": "Neem contact op voor ondersteuning",
        "shield-outline": "Lees ons beleid",
        "document-text-outline": "Lees onze voorwaarden",
        "settings-outline": "App-instellingen",
        "calendar-outline": "Plan uw wekelijkse boodschappen",
        "create-outline": "Maak handmatig lijsten",
        "pencil": "Schrijf je lijsten met de hand",
        "bulb": "Aanbevolen productideeën",
        "restaurant-outline": "Plan uw wekelijkse menu's",
      }
    }
  }
  return menuTexts[deviceLanguage] || menuTexts["en"]
}

const getMenuItemDescription = (icon) => {
  const menuTexts = getMenuTexts()
  return menuTexts.descriptions[icon] || menuTexts.menuSubtitle
}

function CustomBottomTabNavigator({ navigation, isSubscribed, initialTab = "Home" }) {
  const { theme } = useTheme()
  const { isRecording } = useRecording()
  const currentTranslations = getCurrentTranslations()
  const menuTexts = getMenuTexts()
  const mealPlannerTexts = getMealPlannerTranslations()
  const modernStyles = getModernStyles()
  const [activeTab, setActiveTab] = useState(initialTab)
  const [isMenuModalVisible, setMenuModalVisible] = useState(false)
  const [showNewBadge, setShowNewBadge] = useState(false)
  const iconScaleAnim = useRef(new Animated.Value(1)).current
  const modalizeRef = useRef(null)

  // Detectar iPhone SE (pantalla pequeña)
  const { width, height } = Dimensions.get('window')
  const isSmallIPhone = Platform.OS === 'ios' && (width <= 375 || height <= 667)

  // Shared value for swipe animation
  const translateX = useSharedValue(0)
  const screenWidth = useSharedValue(Dimensions.get('window').width)
  
  // Get current language labels for success modal
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  const currentLabels = texts[deviceLanguage] || texts["en"]

  // Check if should show NEW badge on recommendations
  useEffect(() => {
    const checkNewBadge = async () => {
      try {
        const hasSeenRecommendations = await AsyncStorage.getItem("@has_seen_recommendations_badge")
        setShowNewBadge(hasSeenRecommendations !== "true")
      } catch (error) {
        console.error("Error checking badge status:", error)
      }
    }
    checkNewBadge()
  }, [])

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
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false)
  const [showLanguageButton, setShowLanguageButton] = useState(true)
  const [hasActiveList, setHasActiveList] = useState(false) // Estado para lista activa
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [nameModalVisible, setNameModalVisible] = useState(false)
  const [listName, setListName] = useState("") // Modal de éxito
  
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
          // Generate default name and show modal
          const defaultName = `${currentTranslations.list || "Lista"} ${parsedHistory.length + 1}`
          setListName(defaultName)
          setNameModalVisible(true)
        }
      }
    } catch (error) {
      console.error("Error saving to history:", error)
      Alert.alert(menuTexts.error || "Error", menuTexts.errorSavingList || "Could not save the list")
    }
  }

  const confirmSaveWithName = async () => {
    try {
      const list = await AsyncStorage.getItem("@shopping_list")
      const history = await AsyncStorage.getItem("@shopping_history") || "[]"

      if (list) {
        const parsedList = JSON.parse(list)
        const parsedHistory = JSON.parse(history)

        const newHistoryItem = {
          list: parsedList,
          name: listName || `${currentTranslations.list || "Lista"} ${parsedHistory.length + 1}`,
          date: new Date().toISOString()
        }

        parsedHistory.push(newHistoryItem)
        await AsyncStorage.setItem("@shopping_history", JSON.stringify(parsedHistory))
        await AsyncStorage.setItem("@shopping_list", JSON.stringify([]))
        await AsyncStorage.setItem("@trigger_reset_home", "true")
        await AsyncStorage.setItem("@show_newest_list", "true")

        // Close name modal
        setNameModalVisible(false)
        setHasActiveList(false)

        // Show success modal
        setShowSuccessModal(true)
        setTimeout(() => {
          setShowSuccessModal(false)
          setActiveTab('History')
        }, 2000)
      }
    } catch (error) {
      console.error("Error saving to history:", error)
      Alert.alert(menuTexts.error || "Error", menuTexts.errorSavingList || "Could not save the list")
    }
  }

  // Primeros 3 botones de lista
  const topActionTabs = [
    {
      key: "clear",
      label: currentTranslations.delete || "Borrar",
      icon: "trash-outline",
      color: "#ef4444",
      onPress: clearShoppingList,
    },
    {
      key: "add",
      label: currentTranslations.add || "Añadir",
      icon: "add-circle",
      color: "#4a6bff",
      onPress: addNewItem,
    },
    {
      key: "save",
      label: currentTranslations.save || "Guardar",
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
      label: currentTranslations.analyzeList || currentTranslations.imageList,
      icon: "scan",
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
    modalizeRef.current?.close()
    setActiveTab("Contact")
  }

  const handleSettingsPress = () => {
    modalizeRef.current?.close()
    setSettingsModalVisible(true)
  }

  const openAppSettings = () => {
    Linking.openSettings()
    setSettingsModalVisible(false)
  }

  const openDeviceSettings = () => {
    Linking.openSettings()
    setLanguageModalVisible(false)
  }

  const closeLanguageModal = async () => {
    setLanguageModalVisible(false)
    setShowLanguageButton(false)
    try {
      await AsyncStorage.setItem('hasSeenLanguageModal', 'true')
    } catch (error) {
      console.log('Error saving language modal state:', error)
    }
  }

  // Ensure activeTab is set to initialTab
  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  // Cargar estado del botón de idiomas desde AsyncStorage
  useEffect(() => {
    const loadLanguageButtonState = async () => {
      try {
        const hasSeenLanguageModal = await AsyncStorage.getItem('hasSeenLanguageModal')
        if (hasSeenLanguageModal === 'true') {
          setShowLanguageButton(false)
        }
      } catch (error) {
        console.log('Error loading language button state:', error)
      }
    }
    loadLanguageButtonState()
  }, [])

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
      } else if (url?.includes('voicelist://history')) {
        console.log('📜 Switching to History tab from widget history link')
        setActiveTab('History')
      } else if (url?.includes('voicelist://favorites')) {
        console.log('⭐ Switching to History tab from widget favorites link')
        setActiveTab('History')
      } else if (url?.includes('voicelist://calculate')) {
        console.log('🧮 Switching to PriceCalculator tab from widget calculate link')
        setActiveTab('PriceCalculator')
      } else if (url?.includes('voicelist://calendar')) {
        console.log('📅 Switching to Calendar tab from widget calendar link')
        setActiveTab('Calendar')
      } else if (url?.includes('voicelist://toggle-item/')) {
        console.log('✅ Widget item toggle request:', url)
        // Extract listIndex and itemIndex from URL
        const matches = url.match(/voicelist:\/\/toggle-item\/(\d+)\/(\d+)/)
        if (matches) {
          const listIndex = parseInt(matches[1])
          const itemIndex = parseInt(matches[2])
          console.log('📝 Toggle item - List:', listIndex, 'Item:', itemIndex)
          
          // Navigate to History tab and trigger item toggle immediately
          setActiveTab('History')
          
          // Process the toggle immediately with a small delay to ensure History screen loads
          setTimeout(async () => {
            try {
              // Load current history and completed items
              const historyData = await AsyncStorage.getItem("@shopping_history")
              const completedItemsData = await AsyncStorage.getItem("@completed_items")
              
              if (historyData) {
                const history = JSON.parse(historyData) // Keep original order (oldest first)
                const completedItems = completedItemsData ? JSON.parse(completedItemsData) : {}
                
                // Widget shows newest list first (index 0), so we need to map to the actual index
                // Since history is oldest-first and widget shows newest-first, we need to convert the index
                const actualHistoryIndex = history.length - 1 - listIndex
                
                console.log('🔄 Processing toggle - History length:', history.length)
                console.log('🔄 Widget sent listIndex:', listIndex, 'itemIndex:', itemIndex)
                console.log('🔄 Converted to actualHistoryIndex:', actualHistoryIndex)
                console.log('🔄 Current completed items:', completedItems)
                
                if (history.length > 0 && actualHistoryIndex >= 0 && actualHistoryIndex < history.length) {
                  // Use the converted index that maps widget display to actual history array
                  const actualListIndex = actualHistoryIndex
                  
                  const newCompletedItems = { ...completedItems }
                  if (!newCompletedItems[actualListIndex]) {
                    newCompletedItems[actualListIndex] = []
                  }
                  
                  // Toggle the item
                  if (newCompletedItems[actualListIndex].includes(itemIndex)) {
                    newCompletedItems[actualListIndex] = newCompletedItems[actualListIndex].filter((i) => i !== itemIndex)
                    console.log('✅ Item UNCHECKED:', itemIndex)
                  } else {
                    newCompletedItems[actualListIndex].push(itemIndex)
                    console.log('✅ Item CHECKED:', itemIndex)
                  }
                  
                  console.log('💾 Saving new completed items:', newCompletedItems)
                  
                  // Save the updated completed items
                  await AsyncStorage.setItem("@completed_items", JSON.stringify(newCompletedItems))
                  
                  // Set flag for HistoryScreen to reload
                  await AsyncStorage.setItem('@widget_toggle_processed', JSON.stringify({
                    timestamp: Date.now(),
                    listIndex: actualListIndex,
                    itemIndex: itemIndex
                  }))
                }
              }
            } catch (error) {
              console.error('❌ Error processing widget toggle:', error)
            }
          }, 500) // Small delay to ensure History screen loads
        }
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

  const getTabIndex = (tabKey) => {
    'worklet'
    return mainTabs.findIndex(tab => tab.key === tabKey)
  }

  const handleTabPress = (tab) => {
    setActiveTab(tab.key)
  }

  const changeTab = (newTabKey) => {
    setActiveTab(newTabKey)
  }

  // Animated style for smooth swipe
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }]
    }
  })

  // Gesture handler for swipe navigation
  const panGesture = Gesture.Pan()
    .activeOffsetX([-30, 30])
    .failOffsetY([-30, 30])
    .onUpdate((event) => {
      // Only handle swipe for main tabs
      if (!["Home", "Images", "History", "PriceCalculator"].includes(activeTab)) {
        return
      }
      // Update position as finger moves
      translateX.value = event.translationX
    })
    .onEnd((event) => {
      'worklet'
      const currentIndex = getTabIndex(activeTab)
      const threshold = 50
      const velocity = event.velocityX
      const distance = event.translationX

      // Only handle swipe for main tabs
      if (!["Home", "Images", "History", "PriceCalculator"].includes(activeTab)) {
        translateX.value = withTiming(0, { duration: 200 })
        return
      }

      // Swipe right (dedo va derecha) -> pantalla ANTERIOR (izquierda)
      if ((distance > threshold || velocity > 500) && currentIndex > 0) {
        const prevTab = mainTabs[currentIndex - 1]
        if (prevTab) {
          translateX.value = withTiming(screenWidth.value, { duration: 200 }, () => {
            runOnJS(changeTab)(prevTab.key)
            translateX.value = 0
          })
        } else {
          translateX.value = withTiming(0, { duration: 200 })
        }
      }
      // Swipe left (dedo va izquierda) -> pantalla SIGUIENTE (derecha)
      else if ((distance < -threshold || velocity < -500) && currentIndex < mainTabs.length - 1) {
        const nextTab = mainTabs[currentIndex + 1]
        if (nextTab) {
          translateX.value = withTiming(-screenWidth.value, { duration: 200 }, () => {
            runOnJS(changeTab)(nextTab.key)
            translateX.value = 0
          })
        } else {
          translateX.value = withTiming(0, { duration: 200 })
        }
      }
      // Not enough distance, snap back
      else {
        translateX.value = withTiming(0, { duration: 200 })
      }
    })

  const renderActiveScreen = () => {
    switch (activeTab) {
      case "Home":
        return (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              initialParams={{
                onNavigateToSubscribe: () => setActiveTab("Subscribe"),
                onNavigateToHistory: () => setActiveTab("History"),
                onNavigateToHandwrittenList: () => setActiveTab("HandwrittenList"),
                onNavigateToRecommendations: () => setActiveTab("Recommendations")
              }}
            />
            <Stack.Screen
              name="Recommendations"
              component={RecommendationsScreen}
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
                onNavigateToSubscribe: () => setActiveTab("Subscribe"),
                onNavigateToHistory: () => setActiveTab("History")
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

  // Descripciones para los 3 ítems principales - 13 idiomas
  const mainItemDescriptions = {
    handwritten: {
      es: "Escribe tus listas a mano o añade productos escaneando códigos QR",
      en: "Write your lists by hand or add products by scanning QR codes",
      de: "Schreiben Sie Ihre Listen von Hand oder fügen Sie Produkte durch Scannen von QR-Codes hinzu",
      fr: "Écrivez vos listes à la main ou ajoutez des produits en scannant des codes QR",
      it: "Scrivi le tue liste a mano o aggiungi prodotti scansionando codici QR",
      tr: "Listelerinizi elle yazın veya QR kodları tarayarak ürün ekleyin",
      pt: "Escreva suas listas à mão ou adicione produtos escaneando códigos QR",
      ru: "Пишите списки вручную или добавляйте товары, сканируя QR-коды",
      zh: "手写您的清单或通过扫描二维码添加产品",
      ja: "リストを手書きするか、QRコードをスキャンして商品を追加",
      sv: "Skriv dina listor för hand eller lägg till produkter genom att skanna QR-koder",
      hu: "Írja le listáit kézzel, vagy adjon hozzá termékeket QR-kódok beolvasásával",
      ar: "اكتب قوائمك يدويًا أو أضف المنتجات عن طريق مسح رموز QR"
    },
    recommendations: {
      es: "Recibe recomendaciones de productos por historial, temporada o por dieta",
      en: "Get product recommendations by history, season or diet",
      de: "Erhalten Sie Produktempfehlungen nach Verlauf, Saison oder Diät",
      fr: "Recevez des recommandations de produits par historique, saison ou régime",
      it: "Ricevi raccomandazioni di prodotti per cronologia, stagione o dieta",
      tr: "Geçmişe, sezona veya diyete göre ürün önerileri alın",
      pt: "Receba recomendações de produtos por histórico, temporada ou dieta",
      ru: "Получайте рекомендации товаров по истории, сезону или диете",
      zh: "根据历史记录、季节或饮食获取产品推荐",
      ja: "履歴、季節、または食事に基づいて商品の推奨を受け取る",
      sv: "Få produktrekommendationer baserat på historik, säsong eller diet",
      hu: "Kapjon termékajánlásokat előzmények, évszak vagy étrend alapján",
      ar: "احصل على توصيات المنتجات حسب السجل أو الموسم أو النظام الغذائي"
    },
    mealPlanner: {
      es: "Planifica tus menús y genera listas automáticas",
      en: "Plan your menus and generate shopping lists",
      de: "Planen Sie Ihre Menüs und Einkaufslisten",
      fr: "Planifiez vos menus et générez vos listes",
      it: "Pianifica i tuoi menù e genera liste automatiche",
      tr: "Menülerinizi planlayın ve listeler oluşturun",
      pt: "Planeje seus menus e gere listas automáticas",
      ru: "Планируйте меню и создавайте списки",
      zh: "规划菜单并生成购物清单",
      ja: "メニューを計画し、リストを生成",
      sv: "Planera menyer och generera listor",
      hu: "Tervezze meg menüit és listákat",
      ar: "خطط قوائمك وأنشئ قوائم التسوق"
    },
    shoppingCalendar: {
      es: "Planea todas tus compras con antelación",
      en: "Plan all your shopping in advance",
      de: "Planen Sie alle Ihre Einkäufe im Voraus",
      fr: "Planifiez tous vos achats à l'avance",
      it: "Pianifica tutti i tuoi acquisti in anticipo",
      tr: "Tüm alışverişlerinizi önceden planlayın",
      pt: "Planeje todas as suas compras com antecedência",
      ru: "Планируйте все покупки заранее",
      zh: "提前计划您的所有购物",
      ja: "すべての買い物を事前に計画",
      sv: "Planera alla dina inköp i förväg",
      hu: "Tervezze meg előre minden vásárlását",
      ar: "خطط لجميع مشترياتك مسبقًا"
    }
  };

  // Traducciones para el banner de "Disponible a partir de Noviembre"
  const comingSoonTexts = {
    es: "¡Disponible a partir de Noviembre!",
    en: "Available from November!",
    de: "Verfügbar ab November!",
    fr: "Disponible à partir de novembre!",
    it: "Disponibile da novembre!",
    tr: "Kasım'dan itibaren mevcut!",
    pt: "Disponível a partir de novembro!",
    ru: "Доступно с ноября!",
    ar: "متاح من نوفمبر!",
    hu: "Novembertől elérhető!",
    ja: "11月から利用可能！",
    hi: "नवंबर से उपलब्ध!",
    nl: "Beschikbaar vanaf november!"
  };

  const mainMenuItems = [
    {
      label: currentTranslations.manualList || "Manual List",
      description: mainItemDescriptions.handwritten[deviceLanguage] || mainItemDescriptions.handwritten['en'],
      icon: "pencil",
      color: "#8B5CF6",
      tabKey: "HandwrittenList",
      onPress: () => {
        modalizeRef.current?.close()
        setActiveTab("HandwrittenList")
      }
    },
    {
      label: menuTexts.recommendations || "Recomendaciones",
      description: mainItemDescriptions.recommendations[deviceLanguage] || mainItemDescriptions.recommendations['en'],
      icon: "bulb",
      color: "#8B5CF6",
      tabKey: "Recommendations",
      onPress: async () => {
        if (showNewBadge) {
          await AsyncStorage.setItem("@has_seen_recommendations_badge", "true")
          setShowNewBadge(false)
        }
        modalizeRef.current?.close()
        setActiveTab("Recommendations")
      }
    },
    {
      label: mealPlannerTexts.title,
      description: mainItemDescriptions.mealPlanner[deviceLanguage] || mainItemDescriptions.mealPlanner['en'],
      icon: "restaurant-outline",
      color: "#8B5CF6",
      tabKey: "MealPlanner",
      onPress: () => {
        modalizeRef.current?.close()
        setActiveTab("MealPlanner")
      }
    },
    {
      label: currentTranslations.shoppingCalendar || "Shopping Calendar",
      description: mainItemDescriptions.shoppingCalendar[deviceLanguage] || mainItemDescriptions.shoppingCalendar['en'],
      icon: "calendar-outline",
      color: "#8B5CF6",
      tabKey: "CalendarPlanner",
      onPress: () => {
        modalizeRef.current?.close()
        setActiveTab("CalendarPlanner")
      }
    },
  ];

  const footerMenuItems = [
    ...(isSubscribed
      ? [
          {
            label: currentTranslations.mySubscription,
            icon: "star",
            color: "#ff375f",
            onPress: () => {
              modalizeRef.current?.close()
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
              modalizeRef.current?.close()
              setActiveTab("Subscribe")
            }
          },
        ]),
    {
      label: currentTranslations.information,
      icon: "information-circle-outline",
      color: "#5856d6",
      onPress: () => {
        modalizeRef.current?.close()
        setActiveTab("Information")
      }
    },
    {
      label: currentTranslations.share,
      icon: "share-social-outline",
      color: "#4a6bff",
      onPress: () => {
        modalizeRef.current?.close()
        shareAppLink()
      }
    },
    {
      label: currentTranslations.contactUs,
      icon: "mail-outline",
      color: "#ff9500",
      onPress: () => {
        modalizeRef.current?.close()
        handleContactPress()
      }
    },
    {
      label: currentTranslations.privacyPolicy,
      icon: "shield-outline",
      color: "#34c759",
      onPress: () => {
        modalizeRef.current?.close()
        setPrivacyModalVisible(true)
      }
    },
    {
      label: currentTranslations.termsAndConditions,
      icon: "document-text-outline",
      color: "#9b59b6",
      onPress: () => {
        modalizeRef.current?.close()
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
            <Stack.Screen name="InformationScreen">
              {(props) => <InformationScreen {...props} onNavigateHome={() => setActiveTab('Home')} />}
            </Stack.Screen>
          </Stack.Navigator>
        )
      case "PriceCalculator":
        return (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PriceCalculatorScreen" component={PriceCalculatorScreen} />
          </Stack.Navigator>
        )
      case "Contact":
        return (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ContactScreen" component={ContactScreen} />
          </Stack.Navigator>
        )
      case "HandwrittenList":
        return (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="HandwrittenListScreen"
              component={HandwrittenListScreen}
              initialParams={{
                onNavigateToHistory: () => setActiveTab("History")
              }}
            />
          </Stack.Navigator>
        )
      case "Recommendations":
        return (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="RecommendationsScreen"
              component={RecommendationsScreen}
              initialParams={{
                onNavigateToHome: () => setActiveTab("Home"),
                onNavigateToSubscribe: () => setActiveTab("Subscribe")
              }}
            />
            <Stack.Screen name="SeasonalRecommendationsScreen" component={SeasonalRecommendationsScreen} />
          </Stack.Navigator>
        )
      case "MealPlanner":
        return (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="MealPlannerScreen"
              component={MealPlannerScreen}
              initialParams={{
                onNavigateToHistory: () => setActiveTab("History"),
                onNavigateToSubscribe: () => setActiveTab("Subscribe")
              }}
            />
          </Stack.Navigator>
        )
      case "CalendarPlanner":
        return (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="CalendarPlannerScreen" component={CalendarPlannerScreen} />
          </Stack.Navigator>
        )
      default:
        return null
    }
  }

  const isMenuScreen = ["Subscribe", "Subscription", "Information", "Contact", "HandwrittenList", "Recommendations", "MealPlanner", "CalendarPlanner"].includes(activeTab)

  // Screens that should open menu modal on back, not go to Home
  const menuModalScreens = ["HandwrittenList", "Recommendations", "MealPlanner", "CalendarPlanner"]
  const shouldOpenMenuOnBack = menuModalScreens.includes(activeTab)

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: isSmallIPhone ? 15 : 20,
          paddingTop: isSmallIPhone ? 45 : 50,
          paddingBottom: isSmallIPhone ? 10 : 15,
          backgroundColor: theme.background,
        }}
      >
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
        }}>

          {/* Icon for all screens including menu screens */}
          <View
            style={{
              width: isSmallIPhone ? 32 : 40,
              height: isSmallIPhone ? 32 : 40,
              borderRadius: isSmallIPhone ? 8 : 10,
              backgroundColor: activeTab === "Images" ? "#ff950020" :
                              activeTab === "History" ? "#34c75920" :
                              activeTab === "Calendar" ? "#6B728020" :
                              activeTab === "PriceCalculator" ? "#dc262620" :
                              activeTab === "HandwrittenList" ? "#8B5CF620" :
                              activeTab === "Recommendations" ? "#4a6bff20" :
                              activeTab === "MealPlanner" ? "#34c75920" :
                              activeTab === "CalendarPlanner" ? "#6B728020" :
                              "#4a6bff20",
              justifyContent: "center",
              alignItems: "center",
              marginRight: isSmallIPhone ? 8 : 12,
            }}
          >
            {activeTab === "Home" ? (
              <Animated.View style={{ transform: [{ scale: iconScaleAnim }] }}>
                <Image
                  source={require("../../assets/images/icono34.png")}
                  style={{ width: isSmallIPhone ? 24 : 30, height: isSmallIPhone ? 24 : 30 }}
                />
              </Animated.View>
            ) : activeTab === "Images" ? (
              <View style={{ position: 'relative' }}>
                <Ionicons
                  name="scan"
                  size={isSmallIPhone ? 20 : 24}
                  color="#ff9500"
                />
                <View style={{
                  position: 'absolute',
                  top: -4,
                  right: -6,
                  backgroundColor: '#ff9500',
                  borderRadius: 8,
                  padding: 2,
                }}>
                  <Ionicons
                    name="image"
                    size={10}
                    color="white"
                  />
                </View>
              </View>
            ) : activeTab === "History" ? (
              <View style={{ position: 'relative' }}>
                <Ionicons
                  name="list"
                  size={isSmallIPhone ? 20 : 24}
                  color="#34c759"
                />
                <View style={{
                  position: 'absolute',
                  top: -4,
                  right: -6,
                  backgroundColor: '#34c759',
                  borderRadius: 8,
                  padding: 2,
                }}>
                  <Ionicons
                    name="checkmark"
                    size={10}
                    color="white"
                  />
                </View>
              </View>
            ) : activeTab === "Calendar" ? (
              <View style={{ position: 'relative' }}>
                <Ionicons
                  name="calendar"
                  size={isSmallIPhone ? 20 : 24}
                  color="#6B7280"
                />
                <View style={{
                  position: 'absolute',
                  top: -4,
                  right: -6,
                  backgroundColor: '#6B7280',
                  borderRadius: 8,
                  padding: 2,
                }}>
                  <Ionicons
                    name="cart"
                    size={10}
                    color="white"
                  />
                </View>
              </View>
            ) : activeTab === "PriceCalculator" ? (
              <View style={{ position: 'relative' }}>
                <Ionicons
                  name="calculator"
                  size={isSmallIPhone ? 20 : 24}
                  color="#dc2626"
                />
                <View style={{
                  position: 'absolute',
                  top: -4,
                  right: -6,
                  backgroundColor: '#dc2626',
                  borderRadius: 8,
                  padding: 2,
                }}>
                  <Text style={{ fontSize: 10, color: "white", fontWeight: "bold" }}>$</Text>
                </View>
              </View>
            ) : activeTab === "HandwrittenList" ? (
              <Ionicons
                name="pencil"
                size={isSmallIPhone ? 20 : 24}
                color="#8B5CF6"
              />
            ) : activeTab === "Recommendations" ? (
              <Ionicons
                name="bulb"
                size={isSmallIPhone ? 20 : 24}
                color="#4a6bff"
              />
            ) : activeTab === "MealPlanner" ? (
              <Ionicons
                name="restaurant-outline"
                size={isSmallIPhone ? 20 : 24}
                color="#34c759"
              />
            ) : activeTab === "CalendarPlanner" ? (
              <Ionicons
                name="calendar-outline"
                size={isSmallIPhone ? 20 : 24}
                color="#6B7280"
              />
            ) : (
              <Ionicons
                name="storefront"
                size={isSmallIPhone ? 16 : 18}
                color="#4a6bff"
              />
            )}
          </View>
          <Text
            style={{
              fontSize: isSmallIPhone ? 16 : 21,
              fontWeight: "bold",
              color: theme.text,
              flex: 1,
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {activeTab === "Home" ? "BuyVoice" :
             activeTab === "Images" ? (currentTranslations.analyzeList || currentTranslations.imageList) :
             activeTab === "Calendar" ? currentTranslations.calendar :
             activeTab === "History" ? currentTranslations.saved :
             activeTab === "Subscribe" ? currentTranslations.subscribe :
             activeTab === "Subscription" ? currentTranslations.mySubscription :
             activeTab === "Information" ? currentTranslations.information :
             activeTab === "Contact" ? currentTranslations.contactUs :
             activeTab === "PriceCalculator" ? (currentTranslations.priceCalculatorTitle || "Calculate Prices") :
             activeTab === "HandwrittenList" ? (currentTranslations.manualList || "Manual List") :
             activeTab === "Recommendations" ? (menuTexts.recommendations || "Recomendaciones") :
             activeTab === "MealPlanner" ? mealPlannerTexts.title :
             activeTab === "CalendarPlanner" ? (currentTranslations.shoppingCalendar || "Shopping Calendar") :
             "BuyVoice"}
          </Text>

        </View>
      </View>

      {/* Content */}
      <GestureDetector gesture={panGesture}>
        <ReanimatedAnimated.View style={[{ flex: 1 }, animatedStyle]}>
          {isMenuScreen ? renderMenuScreen() : renderActiveScreen()}
        </ReanimatedAnimated.View>
      </GestureDetector>

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
            paddingBottom: isSmallIPhone ? 15 : 20,
            paddingTop: isSmallIPhone ? 6 : 10,
            paddingHorizontal: isSmallIPhone ? 10 : 20,
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
                  paddingVertical: isSmallIPhone ? 4 : 8,
                }}
              >
                <View
                  style={{
                    backgroundColor: isActive ? tab.color + "20" : "transparent",
                    paddingHorizontal: isSmallIPhone ? 12 : 16,
                    paddingVertical: isSmallIPhone ? 6 : 8,
                    borderRadius: isSmallIPhone ? 16 : 20,
                    minWidth: isSmallIPhone ? 40 : 50,
                    alignItems: "center",
                    position: 'relative',
                  }}
                >
                  <Ionicons
                    name={tab.icon}
                    size={isSmallIPhone ? 22 : 28}
                    color={tabColor}
                  />
                </View>
              </TouchableOpacity>
            )
          })}

          {/* Menu button in bottom tab bar */}
          <TouchableOpacity
            onPress={() => {
              console.log("Menu button pressed from bottom tab")
              animateMenuBars()
              modalizeRef.current?.open()
            }}
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: isSmallIPhone ? 4 : 8,
            }}
          >
            <View
              style={{
                paddingHorizontal: isSmallIPhone ? 12 : 16,
                paddingVertical: isSmallIPhone ? 6 : 8,
                borderRadius: isSmallIPhone ? 16 : 20,
                minWidth: isSmallIPhone ? 40 : 50,
                alignItems: "center",
              }}
            >
              <View style={{
                width: isSmallIPhone ? 20 : 24,
                height: isSmallIPhone ? 16 : 20,
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}>
                <Animated.View style={{
                  width: bar1Anim.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: isSmallIPhone ? [20, 16, 18] : [24, 20, 22]
                  }),
                  height: isSmallIPhone ? 2 : 2.5,
                  backgroundColor: isMenuScreen ? "#8B5CF6" : theme.backgroundtres,
                  borderRadius: 2,
                  transform: [{
                    translateX: bar1Anim.interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: [0, -2, 2]
                    })
                  }]
                }} />
                <Animated.View style={{
                  width: bar2Anim.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: isSmallIPhone ? [14, 16, 18] : [18, 20, 22]
                  }),
                  height: isSmallIPhone ? 2 : 2.5,
                  backgroundColor: isMenuScreen ? "#8B5CF6" : theme.backgroundtres,
                  borderRadius: 2,
                  alignSelf: 'flex-end',
                  transform: [{
                    translateX: bar2Anim.interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: [0, -4, -2]
                    })
                  }]
                }} />
                <Animated.View style={{
                  width: bar3Anim.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: isSmallIPhone ? [16, 18, 14] : [20, 22, 18]
                  }),
                  height: isSmallIPhone ? 2 : 2.5,
                  backgroundColor: isMenuScreen ? "#8B5CF6" : theme.backgroundtres,
                  borderRadius: 2,
                  transform: [{
                    translateX: bar3Anim.interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: [0, 2, -1]
                    })
                  }]
                }} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}

    

      {/* Privacy Modal */}
      <Modal
        visible={isPrivacyModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setPrivacyModalVisible(false)}
      >
        <View style={{ flex: 1 }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: Platform.OS === 'ios' ? 50 : 20,
            paddingBottom: 10,
            backgroundColor: '#f8f9ff',
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb',
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#111827'
            }}>Privacy Policy</Text>
            <TouchableOpacity onPress={() => setPrivacyModalVisible(false)}>
              <Ionicons name="close" size={28} color="#111827" />
            </TouchableOpacity>
          </View>
          <PrivacyModal visible={true} onClose={() => setPrivacyModalVisible(false)} />
        </View>
      </Modal>

      {/* Terms & Conditions Modal */}
      <Modal
        visible={isEulaModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setEulaModalVisible(false)}
      >
        <View style={{ flex: 1 }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: Platform.OS === 'ios' ? 50 : 20,
            paddingBottom: 10,
            backgroundColor: '#f0f4ff',
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb',
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#111827'
            }}>Terms of Service</Text>
            <TouchableOpacity onPress={() => setEulaModalVisible(false)}>
              <Ionicons name="close" size={28} color="#111827" />
            </TouchableOpacity>
          </View>
          <EulaModal visible={true} onClose={() => setEulaModalVisible(false)} />
        </View>
      </Modal>

      {/* Language Modal */}
      <Modal
        visible={isLanguageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeLanguageModal}
      >
        <View style={modernStyles.modalOverlay}>
          <View style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 24,
            padding: 32,
            marginHorizontal: 20,
            maxWidth: 400,
            alignSelf: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 10,
            backdropFilter: 'blur(20px)',
          }}>
            {/* Close Button */}
            <TouchableOpacity
              onPress={closeLanguageModal}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                backgroundColor: 'rgba(107, 114, 128, 0.1)',
                borderRadius: 20,
                padding: 8,
                zIndex: 10,
              }}
            >
              <Ionicons name="close" size={20} color="#6b7280" />
            </TouchableOpacity>

            {/* Header with Icon */}
            <View style={{
              alignItems: 'center',
              marginBottom: 24,
            }}>
              <View style={{
                backgroundColor: 'rgba(74, 107, 255, 0.15)',
                borderRadius: 20,
                padding: 16,
                marginBottom: 16,
                shadowColor: '#4a6bff',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
              }}>
                <Ionicons name="globe-outline" size={32} color="#4a6bff" />
              </View>
              <Text style={{
                fontSize: 20,
                fontWeight: '700',
                color: '#1f2937',
                textAlign: 'center',
                marginBottom: 8,
              }}>{menuTexts.languageModalTitle}</Text>
            </View>

            {/* Content */}
            <View style={{
              alignItems: 'center',
              marginBottom: 24,
            }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#374151',
                textAlign: 'center',
                marginBottom: 16,
                lineHeight: 24,
              }}>{menuTexts.languageModalDescription}</Text>

              <Text style={{
                fontSize: 14,
                color: '#6b7280',
                textAlign: 'center',
                lineHeight: 20,
                paddingHorizontal: 16,
              }}>{menuTexts.languageModalInfo}</Text>
            </View>

            {/* Bottom Action Buttons */}
            <View style={{
              gap: 12,
            }}>
              {/* Go to Settings Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: 'rgba(74, 107, 255, 0.1)',
                  borderWidth: 2,
                  borderColor: 'rgba(74, 107, 255, 0.3)',
                  borderRadius: 16,
                  paddingVertical: 14,
                  paddingHorizontal: 24,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
                onPress={openDeviceSettings}
                activeOpacity={0.8}
              >
                <Ionicons name="settings-outline" size={20} color="#4a6bff" style={{ marginRight: 8 }} />
                <Text style={{
                  color: '#4a6bff',
                  fontWeight: '600',
                  fontSize: 16,
                }}>{menuTexts.goToSettings}</Text>
              </TouchableOpacity>

              {/* Understood Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: 'rgba(74, 107, 255, 0.9)',
                  borderRadius: 16,
                  paddingVertical: 14,
                  paddingHorizontal: 24,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
                onPress={closeLanguageModal}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-circle" size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={{
                  color: 'white',
                  fontWeight: '600',
                  fontSize: 16,
                }}>{menuTexts.understood}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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

      {/* Name Modal */}
      <Modal
        visible={nameModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setNameModalVisible(false)}
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
            padding: 20,
            width: '90%',
            maxWidth: 400,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 15,
          }}>
            <View style={{ marginBottom: 20 }}>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#1f2937',
                textAlign: 'center',
                marginBottom: 8,
              }}>
                {currentTranslations.listName || "List Name"}
              </Text>
              <Text style={{
                fontSize: 14,
                color: '#6b7280',
                textAlign: 'center',
              }}>
                {currentTranslations.enterListName || "Enter list name"}
              </Text>
            </View>

            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 12,
                padding: 12,
                fontSize: 16,
                marginBottom: 20,
                backgroundColor: '#f9fafb',
              }}
              value={listName}
              onChangeText={setListName}
              placeholder={currentTranslations.list || "List"}
              placeholderTextColor="#9ca3af"
              autoFocus
              selectTextOnFocus
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 12,
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderWidth: 1,
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                }}
                onPress={() => setNameModalVisible(false)}
              >
                <Ionicons name="close" size={20} color="#ef4444" style={{ marginRight: 8 }} />
                <Text style={{ color: '#ef4444', fontSize: 16, fontWeight: '600' }}>
                  {currentTranslations.cancel || "Cancel"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 12,
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  borderWidth: 1,
                  borderColor: 'rgba(16, 185, 129, 0.3)',
                }}
                onPress={confirmSaveWithName}
              >
                <Ionicons name="checkmark" size={20} color="#10b981" style={{ marginRight: 8 }} />
                <Text style={{ color: '#10b981', fontSize: 16, fontWeight: '600' }}>
                  {currentTranslations.save || "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>



        {/* Better Menu Modal */}
      <Modalize
        ref={modalizeRef}
        adjustToContentHeight
        modalStyle={{
          backgroundColor: "#e7ead2",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
        overlayStyle={{
          backgroundColor: 'rgba(0,0,0,0.3)',
        }}
        closeOnOverlayTap={false}
        panGestureEnabled={false}
        withHandle={false}
        HeaderComponent={
          <View
            style={{
              backgroundColor: "#e7ead2",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              paddingTop: 12,
              paddingBottom: 10,
            }}
          >
            {/* Language Button */}
            {showLanguageButton && (
              <TouchableOpacity
                key="language-button"
                onPress={() => {
                  setLanguageModalVisible(true)
                }}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 12,
                  backgroundColor: "#4a6bff15",
                  borderWidth: 1,
                  borderColor: "#4a6bff30",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="globe-outline" size={18} color="#4a6bff" />
              </TouchableOpacity>
            )}

            {/* Spacer */}
            <View style={{ flex: 1 }} />

            {/* Close Button */}
            <TouchableOpacity
              onPress={() => modalizeRef.current?.close()}
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: "rgba(107, 114, 128, 0.12)",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(107, 114, 128, 0.2)",
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        }
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
          contentContainerStyle: {
            paddingBottom: 40,
          }
        }}
      >
        {/* Menu Items */}
        <View
          style={{
            paddingTop: 4,
          }}
        >
              {/* Main Items - 3 principales estilo header full width */}
              {mainMenuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    item.onPress()
                  }}
                  style={{
                    paddingVertical: 22,
                    paddingHorizontal: 20,
                    marginBottom: 0,
                    backgroundColor: 'transparent',
                    borderTopWidth: index === 0 ? 1 : 0,
                    borderBottomWidth: 1,
                    borderColor: '#d4d8c0',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  disabled={item.comingSoon}
                  activeOpacity={0.7}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        backgroundColor: item.color + "15",
                        padding: 14,
                        borderRadius: 16,
                        marginRight: 16,
                        borderWidth: 1.5,
                        borderColor: item.color + '30',
                      }}
                    >
                      <Ionicons
                        name={item.icon}
                        size={28}
                        color={item.color}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                          style={{
                            color: "#1f2937",
                            fontSize: 17,
                            fontWeight: "700",
                            marginBottom: 6,
                            letterSpacing: -0.3,
                          }}
                        >
                          {item.label}
                        </Text>
                        {/* Badge "New" for MealPlanner */}
                        {item.tabKey === "MealPlanner" && (
                          <View
                            style={{
                              backgroundColor: '#8B5CF6',
                              borderRadius: 6,
                              paddingHorizontal: 6,
                              paddingVertical: 2,
                              marginLeft: 8,
                              marginBottom: 4,
                            }}
                          >
                            <Text
                              style={{
                                color: '#FFFFFF',
                                fontSize: 9,
                                fontWeight: '800',
                                letterSpacing: 0.5,
                              }}
                            >
                              NEW
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text
                        style={{
                          color: "#6b7280",
                          fontSize: 13,
                          fontWeight: "500",
                          lineHeight: 19,
                          marginBottom: item.comingSoon ? 6 : 0,
                        }}
                      >
                        {item.description}
                      </Text>

                      {/* Banner "Disponible a partir de Noviembre" */}
                      {item.comingSoon && (
                        <View
                          style={{
                            backgroundColor: '#f3f4f6',
                            borderRadius: 8,
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            marginTop: 4,
                            alignSelf: 'flex-start',
                            borderWidth: 1,
                            borderColor: '#e5e7eb',
                          }}
                        >
                          <Text
                            style={{
                              color: '#6b7280',
                              fontSize: 10,
                              fontWeight: '700',
                              letterSpacing: 0.3,
                            }}
                          >
                            {comingSoonTexts[deviceLanguage] || comingSoonTexts['en']}
                          </Text>
                        </View>
                      )}
                    </View>
                    {!item.comingSoon && (
                      item.tabKey && activeTab === item.tabKey ? (
                        <View
                          style={{
                            backgroundColor: item.color + '15',
                            borderRadius: 20,
                            padding: 8,
                            marginLeft: 8,
                            borderWidth: 1.5,
                            borderColor: item.color + '30',
                          }}
                        >
                          <Ionicons
                            name="checkmark"
                            size={20}
                            color={item.color}
                          />
                        </View>
                      ) : (
                        <Ionicons
                          name="chevron-forward"
                          size={22}
                          color="#9ca3af"
                          style={{ marginLeft: 8 }}
                        />
                      )
                    )}
                  </View>
                </TouchableOpacity>
              ))}

              {/* Footer Items Container - Grid 3x2 */}
              <View
                style={{
                  backgroundColor: 'transparent',
                  borderRadius: 16,
                  padding: 12,
                  marginTop: 8,
                }}
              >
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  {footerMenuItems.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        item.onPress()
                      }}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 10,
                        paddingHorizontal: 12,
                        borderRadius: 12,
                        backgroundColor: 'rgba(0,0,0,0.03)',
                        width: '47.5%',
                      }}
                    >
                      <Ionicons name={item.icon} size={20} color={item.color} style={{ marginRight: 10 }} />
                      <Text
                        style={{
                          color: "#4b5563",
                          fontSize: 14,
                          fontWeight: "600",
                          letterSpacing: -0.1,
                        }}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Version */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 5,
                marginBottom: 20,
                gap: 6,
              }}>
                <Text style={{
                  color: '#9ca3af',
                  fontSize: 13,
                  fontWeight: '700',
                  letterSpacing: 0.3,
                }}>
                  BuyVoice
                </Text>
                <Text style={{
                  color: '#9ca3af',
                  fontSize: 12,
                  fontWeight: '500',
                }}>
                  v2.0.1
                </Text>
              </View>
        </View>
      </Modalize>


    </View>
  )
}

export default CustomBottomTabNavigator