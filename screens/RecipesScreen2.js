import React, { useRef, useEffect, useState } from 'react';
import { AppRegistry, View, TouchableOpacity, Animated, Easing, Linking, StyleSheet, Alert, Text, Share, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, useDrawerStatus, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './screens/HomeScreen';
import Suscribe from './screens/Suscribe';
import HistoryScreen from './screens/HistoryScreen';
import InformationScreen from './screens/InformationScreen';
import ImageListScreen from './screens/ImageListScreen';
import MySubscriptionScreen from './screens/MySubscriptionScreen';
import Purchases from 'react-native-purchases';
import { ThemeProvider, useTheme } from './ThemeContext';
import * as RNLocalize from 'react-native-localize';
import screenNames from './screens/translations/languagesApp';
import configurePushNotifications, { requestNotificationPermission } from './screens/components/PushNotification';
import NotificationPermissionModal from './NotificationPermissionModal';
import { NotificationProvider } from './NotificationContext';
import DeviceInfo from 'react-native-device-info';
import PrivacyModal from './screens/links/PrivacyModal';
import FavoritesScreen from './screens/FavoritesScreen'; 
import appsFlyer from 'react-native-appsflyer'
import RecipesScreen from './screens/RecipesScreen'; 

const supportedLanguages = [
  'en', 'es', 'de', 'it', 'fr', 'tr', 'pt', 'ru', 'ar', 'hu', 'ja', 'hi', 'nl'
];

const translations = {
  en: {
    contactUs: "Contact Us",
    mode: "Mode",
    privacyPolicy: "Privacy Policy",
    share: "Recommend",
    shareMessage: "Check out this amazing app! Download it here: https://apps.apple.com/app/voice-shopping-list/id6505125372",
    recipes: "List by Recipes",
    createList: "Create List",
    saved: "Saved",
    imageList: "Image List",
    subscribe: "Subscribe",
    mySubscription: "My Subscription",
    information: "Information"
  },
  es: {
    contactUs: "Contáctenos",
    mode: "Modo",
    privacyPolicy: "Política de privacidad",
    share: "Recomendar",
    shareMessage: "¡Mira esta increíble aplicación! Descárgala aquí: https://apps.apple.com/app/voice-shopping-list/id6505125372",
    recipes: "Lista por recetas",
    createList: "Crear lista",
    saved: "Guardado",
    imageList: "Lista de imágenes",
    subscribe: "Suscribirse",
    mySubscription: "Mi suscripción",
    information: "Información"
  },
  de: {
    contactUs: "Kontaktiere uns",
    mode: "Modus",
    privacyPolicy: "Datenschutz",
    share: "App empfehlen",
    shareMessage: "Schau dir diese unglaubliche App an! Lade sie hier herunter: https://apps.apple.com/app/voice-shopping-list/id6505125372",
    recipes: "Liste nach Rezepten",
    createList: "Liste erstellen",
    saved: "Gespeichert",
    imageList: "Bilderliste",
    subscribe: "Abonnieren",
    mySubscription: "Mein Abonnement",
    information: "Information"
  },
  it: {
    contactUs: "Contattaci",
    mode: "Modalità",
    privacyPolicy: "Informativa sulla privacy",
    share: "Consiglia App",
    shareMessage: "Scopri questa incredibile app! Scaricala qui: https://apps.apple.com/app/voice-shopping-list/id6505125372",
    recipes: "Lista per ricette",
    createList: "Crea lista",
    saved: "Salvato",
    imageList: "Lista di immagini",
    subscribe: "Iscriviti",
    mySubscription: "Il mio abbonamento",
    information: "Informazioni"
  },
  fr: {
    contactUs: "Contactez-nous",
    mode: "Mode",
    privacyPolicy: "Politique de confidentialité",
    share: "Recommander l'App",
    shareMessage: "Découvrez cette incroyable application ! Téléchargez-la ici : https://apps.apple.com/app/voice-shopping-list/id6505125372",
    recipes: "Liste par recettes",
    createList: "Créer une liste",
    saved: "Enregistré",
    imageList: "Liste d'images",
    subscribe: "S'abonner",
    mySubscription: "Mon abonnement",
    information: "Information"
  },
  pt: {
    contactUs: "Contate-Nos",
    mode: "Modo",
    privacyPolicy: "Política de Privacidade",
    share: "Recomendar App",
    shareMessage: "Confira este aplicativo incrível! Baixe aqui: https://apps.apple.com/app/voice-shopping-list/id6505125372",
    recipes: "Lista por receitas",
    createList: "Criar lista",
    saved: "Salvo",
    imageList: "Lista de imagens",
    subscribe: "Assine",
    mySubscription: "Minha assinatura",
    information: "Informação"
  },
  ru: {
    contactUs: "Свяжитесь с нами",
    mode: "Режим",
    privacyPolicy: "Политика конфиденциальности",
    share: "Рекомендовать приложение",
    shareMessage: "Посмотрите на это удивительное приложение! Загрузите его здесь: https://apps.apple.com/app/voice-shopping-list/id6505125372",
    recipes: "Список по рецептам",
    createList: "Создать список",
    saved: "Сохранено",
    imageList: "Список изображений",
    subscribe: "Подписаться",
    mySubscription: "Моя подписка",
    information: "Информация"
  },
  ar: {
    contactUs: "اتصل بنا",
    mode: "الوضع",
    privacyPolicy: "سياسة الخصوصية",
    share: "توصية بالتطبيق",
    shareMessage: "تحقق من هذا التطبيق المذهل! قم بتنزيله هنا: https://apps.apple.com/app/voice-shopping-list/id6505125372",
    recipes: "قائمة حسب الوصفات",
    createList: "إنشاء قائمة",
    saved: "تم الحفظ",
    imageList: "قائمة الصور",
    subscribe: "الإشتراك",
    mySubscription: "إشتراكي",
    information: "معلومات"
  },
  ja: {
    contactUs: "お問い合わせ",
    mode: "モード",
    privacyPolicy: "プライバシーポリシー",
    share: "アプリを推薦",
    shareMessage: "この素晴らしいアプリをチェックしてください！ ここからダウンロードしてください: https://apps.apple.com/app/voice-shopping-list/id6505125372",
    recipes: "レシピ別リスト",
    createList: "リストを作成",
    saved: "保存済み",
    imageList: "画像リスト",
    subscribe: "サブスクライブ",
    mySubscription: "私のサブスクリプション",
    information: "情報"
  },
  zh: {
    contactUs: "联系我们",
    mode: "模式",
    privacyPolicy: "隐私政策",
    share: "推荐应用",
    shareMessage: "查看这个神奇的应用！ 在此处下载：https://apps.apple.com/app/voice-shopping-list/id6505125372",
    recipes: "按食谱列表",
    createList: "创建列表",
    saved: "已保存",
    imageList: "图片列表",
    subscribe: "订阅",
    mySubscription: "我的订阅",
    information: "信息"
  }
};




const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { theme, toggleTheme } = useTheme();
  const { isSubscribed } = props;
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
  const currentTranslations = translations[deviceLanguage] || translations['en'];
  const [isPrivacyModalVisible, setIsPrivacyModalVisible] = useState(false);
  const shareMessage = translations[deviceLanguage]?.shareMessage || translations['en'].shareMessage; 
  
  const shareAppLink = async () => {
    try {
      const result = await Share.share({
        message: shareMessage,
      });
      if (result.action === Share.sharedAction) {
        console.log('Shared');
      }
    } catch (error) {
      console.error('Error al compartir', error.message);
    }
  };

  const handlePrivacyPress = () => {
    setIsPrivacyModalVisible(true);
  };

  const handleContactPress = () => {
    const emailBody = `Device Model: ${DeviceInfo.getModel()}\nOS Version: ${DeviceInfo.getSystemVersion()}\n`;
    const mailtoURL = `mailto:info@lweb.ch?subject=Contact&body=${encodeURIComponent(emailBody)}`;
    Linking.openURL(mailtoURL).catch(err => console.error('Failed to open mail app:', err));
  };



  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />

      <DrawerItem
        label={currentTranslations.share}
        onPress={shareAppLink}
        icon={({ color, size }) => (
          <Ionicons
            name="share-social-outline"
            size={24}
            color={'grey'}
          />
        )}
        labelStyle={{ color: theme.textdos }}
      />
      <View style={styles.contactItem}>
        <DrawerItem
          label={currentTranslations.contactUs}
          onPress={handleContactPress}
          icon={({ color, size }) => (
            <Ionicons
              name="mail-outline"
              size={24}
              color={'grey'}
            />
          )}
          labelStyle={{ color: theme.textdos }}
        />
        <DrawerItem
          label={currentTranslations.privacyPolicy}
          onPress={handlePrivacyPress}
          icon={({ color, size }) => (
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={'grey'}
            />
          )}
          labelStyle={{ color: theme.textdos }}
        />
      </View>
      <PrivacyModal 
        visible={isPrivacyModalVisible} 
        onClose={() => setIsPrivacyModalVisible(false)} 
      />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  contactItem: {
    marginTop: 0, // Ajusta el margen superior según sea necesario
    labelStyle: 21,
  },
  
});

function HomeStackNavigator({ navigation }) {
  const isDrawerOpen = useDrawerStatus() === 'open';
  const { theme } = useTheme();

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
          headerTintColor: '#a2a2a200',
          headerTitleStyle: {},
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons name={isDrawerOpen ? "close" : "ellipsis-horizontal"} size={42} color={theme.backgroundtresapp} style={{ marginLeft: 15 }} />
            </TouchableOpacity>
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
          
        }}
      />
      <Stack.Screen
        name="HistoryScreen"
        component={HistoryScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: '#a2a2a200',
          headerShadowVisible: false,
          headerTitleStyle: {},
          headerTitle: ''
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
          headerTitle: ''
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
          
        }}
      />
      <Stack.Screen
        name="MySubscriptionScreen"
        component={MySubscriptionScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: theme.text,
          headerTitleStyle: {},
        }}
      />
    </Stack.Navigator>
  );
}

function SuscribeScreen({ navigation }) {
  const isDrawerOpen = useDrawerStatus() === 'open';
  const { theme } = useTheme();

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
          headerTintColor: '#a2a2a200',
          headerTitleStyle: {},
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons name={isDrawerOpen ? "close" : "ellipsis-horizontal"} size={42} color={theme.backgroundtresapp} style={{ marginLeft: 15 }} />
            </TouchableOpacity>
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
          headerTintColor: '#a2a2a200',
          headerShadowVisible: false,
          headerTitleStyle: {},
        }}
      />
    </Stack.Navigator>
  );
}

function HistoryStackNavigator({ navigation }) {
  const isDrawerOpen = useDrawerStatus() === 'open';
  const { theme } = useTheme();

  return (
    <Stack.Navigator initialRouteName="HistoryScreen">
      <Stack.Screen
        name="HistoryScreen"
        component={HistoryScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerShadowVisible: false,
          headerTintColor: '#a2a2a200',
          headerTitleStyle: {},
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons name={isDrawerOpen ? "close" : "ellipsis-horizontal"} size={42} color={theme.backgroundtresapp} style={{ marginLeft: 15 }} />
            </TouchableOpacity>
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
          headerTintColor: '#a2a2a200',
          headerTitleStyle: {},
        }}
      />
    </Stack.Navigator>
  );
}

function InformationStackNavigator({ navigation }) {
  const isDrawerOpen = useDrawerStatus() === 'open';
  const { theme, toggleTheme } = useTheme();

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
          headerTintColor: '#a2a2a200',
          headerTitleStyle: {},
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons name={isDrawerOpen ? "close" : "ellipsis-horizontal"} size={42} color={theme.backgroundtresapp} style={{ marginLeft: 15 }} />
            </TouchableOpacity>
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
          headerTintColor: '#a2a2a200',
          headerTitleStyle: {},
        }}
      />
    </Stack.Navigator>
  );
}


function FavoritesStackNavigator({ navigation }) {
  const isDrawerOpen = useDrawerStatus() === 'open';
  const { theme } = useTheme();

  return (
    <Stack.Navigator initialRouteName="FavoritesScreen">
      <Stack.Screen
        name="FavoritesScreen"
        component={FavoritesScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: '#a2a2a200',
          headerShadowVisible: false,
          headerTitleStyle: {},
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons name={isDrawerOpen ? "close" : "ellipsis-horizontal"} size={42} color={theme.backgroundtresapp} style={{ marginLeft: 15 }} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('FavoritesScreen')}>
              <Ionicons name="heart-outline" size={26} color={theme.backgroundtresapp} style={{ marginRight: 15 }} />
            </TouchableOpacity>
          ),
        }}
      />
            <Stack.Screen
        name="FavoritesScreen"
        component={FavoritesScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: '#a2a2a200',
          headerShadowVisible: false,
          headerTitleStyle: {},
        }}
      />
    </Stack.Navigator>
  );
}



function ImageListStackNavigator({ navigation }) {
  const isDrawerOpen = useDrawerStatus() === 'open';
  const { theme } = useTheme();

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
          headerTintColor: '#a2a2a200',
          headerTitleStyle: {},
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons name={isDrawerOpen ? "close" : "ellipsis-horizontal"} size={42} color={theme.backgroundtresapp} style={{ marginLeft: 15 }} />
            </TouchableOpacity>
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
          headerTintColor: '#a2a2a200',
          headerTitleStyle: {},
        }}
      />
    </Stack.Navigator>
  );
}

function MySubscriptionStackNavigator({ navigation }) {
  const isDrawerOpen = useDrawerStatus() === 'open';
  const { theme } = useTheme();

  return (
    <Stack.Navigator initialRouteName="MySubscriptionScreen">
      <Stack.Screen
        name="MySubscriptionScreen"
        component={MySubscriptionScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerShadowVisible: false,
          headerTintColor: '#a2a2a200',
          headerTitleStyle: {},
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons name={isDrawerOpen ? "close" : "ellipsis-horizontal"} size={42} color={theme.backgroundtresapp} style={{ marginLeft: 15 }} />
            </TouchableOpacity>
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
          headerTintColor: '#a2a2a200',
          headerTitleStyle: {},
        }}
      />
    </Stack.Navigator>
  );
}

function RecipesStackNavigator({ navigation }) {
  const isDrawerOpen = useDrawerStatus() === 'open';
  const { theme } = useTheme();

  return (
    <Stack.Navigator initialRouteName="RecipesScreen">
      <Stack.Screen
        name="RecipesScreen"
        component={RecipesScreen}
        options={{
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
          headerShadowVisible: false,
          headerTintColor: '#a2a2a200',
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name={isDrawerOpen ? "close" : "ellipsis-horizontal"} size={42} color={theme.backgroundtresapp} style={{ marginLeft: 15 }} />
          </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
}


export default function App() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('HomeScreen');
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode; // Detecta el idioma del dispositivo
  const currentTranslations = translations[deviceLanguage] || translations['en']; // Usa el idioma o 'en' como predeterminado
  const screenText = screenNames[deviceLanguage] || screenNames['en'];
  const [isPermissionModalVisible, setPermissionModalVisible] = useState(false);
  const [permissionModalText, setPermissionModalText] = useState(permissionModalTextTranslations[deviceLanguage] || permissionModalTextTranslations['en']);

  useEffect(() => {
    // Aquí puedes agregar tu lógica de inicialización (omitiendo el código redundante)
    setIsLoading(false);
  }, []);


  useEffect(() => {
    const options = {
      devKey: 'TyLNVRNgxgybW8Lake8uzE',
      isDebug: true, 
      appId: '6EEA3ED5-9E78-46D4-AED2-902AE793808B', // Solo si es una app iOS
    };

    appsFlyer.initSdk(
      options,
      (result) => {
        console.log(result);
      },
      (error) => {
        console.error(error);
      }
    );

    // Agregar listeners para conversion data
    appsFlyer.onInstallConversionData((data) => {
      if (data) {
        console.log('Conversion Data:', data);
      } else {
        console.log('No Conversion Data Received');
      }
    });

    return () => {
      // Limpiar listeners al desmontar el componente
      appsFlyer.onInstallConversionData((data) => {});
    };
  }, []);


  useEffect(() => {
    const checkLanguageSupport = async () => {
      const hasShownAlert = await AsyncStorage.getItem('hasShownLanguageAlert');
      if (!hasShownAlert) {
        const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
        if (!supportedLanguages.includes(deviceLanguage)) {
          Alert.alert(
            "Language Not Supported",
            "This app only supports the following languages: English, Spanish, German, Italian, French, Turkish, Portuguese, Russian, Arabic, Hungarian, Japanese, Hindi, Dutch. Please change your device language to one of these supported languages.",
            [{ text: "OK" }]
          );
          await AsyncStorage.setItem('hasShownLanguageAlert', 'true');
        }
      }
    };

    checkLanguageSupport();
  }, []);

  const checkSubscription = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      if (customerInfo.entitlements.active['12981']) {
        console.log('Usuario ya suscrito');
        setIsSubscribed(true);
      } else {
        console.log('Usuario no suscrito');
        setIsSubscribed(false);
      }
    } catch (error) {
      console.log('Error al obtener la información del comprador:', error);
      setIsSubscribed(false);
    }
  };

  const checkFirstTimeOpen = async () => {
    const firstTimeOpen = await AsyncStorage.getItem('firstTimeOpen');
    if (firstTimeOpen === null) {
      await AsyncStorage.setItem('firstTimeOpen', 'false');
      setPermissionModalVisible(true); // Mostrar modal si es la primera vez
      setInitialRoute('InformationScreen');
    } else {
      setInitialRoute('HomeScreen'); // Establece la ruta inicial a HomeScreen después de la primera vez
    }
  };

  const handleAcceptPermission = async () => {
    setPermissionModalVisible(false); // Cierra el modal primero
    await requestNotificationPermission(); // Solicita permisos
    configurePushNotifications(); // Configura notificaciones push
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await Purchases.setDebugLogsEnabled(true);
        await Purchases.configure({ apiKey: 'appl_bHxScLAZLsKxfggiOiqVAZTXjJX' });

        await checkSubscription();
        await checkFirstTimeOpen();
        configurePushNotifications(); // Asegúrate de configurar PushNotifications al iniciar la aplicación
      } catch (error) {
        console.log('Error al inicializar la aplicación:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Crear una animación de escala para el icono de micrófono
  const micAnimation = useRef(new Animated.Value(1)).current;

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
      ])
    ).start();
  }, []);

  if (isLoading) {
    return null; // o un componente de carga
  }

  return (
    <ThemeProvider>
      <NotificationProvider>
        <NavigationContainer>
          <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} isSubscribed={isSubscribed} />}
            screenOptions={({ route }) => {
              const { theme } = useTheme();
              let iconColor;
              let labelStyle = { fontSize: 17, color: theme.text, fontFamily: 'Poppins-Regular' };

              switch (route.name) {
                case 'CreateList':
                  iconColor = '#3f51b5';
                  break;
                case 'ImageList':
                  iconColor = 'orange';
                  break;
                case 'TextList':
                  iconColor = 'orange';
                  break;
                case 'Saved':
                  iconColor = '#009688';
                  labelStyle = { fontSize: 17, color: '#009688', fontFamily: 'Poppins-Regular', fontWeight: 'bold' };
     
                  break;
                case 'Subscribe':
                  iconColor = 'grey';
                  break;
                case 'Information':
                  iconColor = 'grey';
                  break;
                case 'RecipesScreen':
                  iconColor = 'purple';
                  break;
                default:
                  iconColor = 'grey';
                  break;
              }
              return {
                headerShown: false,
                drawerStyle: {
                  backgroundColor: theme.background,
                },
                drawerLabelStyle: labelStyle,
                drawerIcon: ({ size }) => {
                  let iconName;
                  switch (route.name) {
                    case 'CreateList':
                      iconName = 'mic-outline';
                      break;
                    case 'ImageList':
                      iconName = 'image-outline';
                      break;
                    case 'TextList':
                      iconName = 'text-outline';
                      break;
                    case 'Saved':
                      iconName = 'checkmark-circle';
                      break;
                    case 'Subscribe':
                      iconName = 'gift-outline';
                      break;
                    case 'Information':
                      iconName = 'happy-outline';
                      break;
                    case 'RecipesScreen':
                      iconName = 'book-outline';
                      break;
                    default:
                      iconName = 'person-add-outline';
                      break;
                  }
                  return <Ionicons name={iconName} color={iconColor} size={size} />;
                }
              };
            }}
          >
                  <Drawer.Screen 
    name="CreateList" 
    component={HomeStackNavigator} 
    options={{ drawerLabel: currentTranslations.createList }} 
  />

  <Drawer.Screen 
    name="RecipesScreen" 
    component={RecipesStackNavigator} 
    options={{ drawerLabel: currentTranslations.recipes }} 
  />



<Drawer.Screen 
    name="ImageList" 
    component={ImageListStackNavigator} 
    options={{ drawerLabel: currentTranslations.imageList }} 
  />

<Drawer.Screen 
    name="Saved" 
    component={HistoryStackNavigator} 
    options={{ drawerLabel: currentTranslations.saved }} 
  />

  {!isSubscribed && (
    <Drawer.Screen 
      name="Subscribe" 
      component={SuscribeScreen} 
      options={{ drawerLabel: currentTranslations.subscribe }} 
    />
  )}

  {isSubscribed && (
    <Drawer.Screen 
      name="MySubscription" 
      component={MySubscriptionStackNavigator} 
      options={{ drawerLabel: currentTranslations.mySubscription }} 
    />
  )}





  <Drawer.Screen 
    name="Information" 
    component={InformationStackNavigator} 
    options={{ drawerLabel: currentTranslations.information }} 
  />
</Drawer.Navigator>
        </NavigationContainer>
        <NotificationPermissionModal
          visible={isPermissionModalVisible}
          onAccept={handleAcceptPermission}
          onDecline={() => setPermissionModalVisible(false)}
        />
      </NotificationProvider>
    </ThemeProvider>
  );
}