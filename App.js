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
import appsFlyer from 'react-native-appsflyer';
const supportedLanguages = [
  'en', 'es', 'de', 'it', 'fr', 'tr', 'pt', 'ru', 'ar', 'hu', 'ja', 'hi', 'nl'
];

const translations = {
  en: {
    contactUs: "Contact Us",
    mode: "Mode",
    privacyPolicy: "Privacy Policy",
    share: "Recommend",
    shareMessage: "Check out this amazing app! Download it here: https://apps.apple.com/app/voice-shopping-list/id6505125372"
  },
  es: {
    contactUs: "Contáctenos",
    mode: "Modo",
    privacyPolicy: "Política de privacidad",
    share: "Recomendar",
    shareMessage: "¡Mira esta increíble aplicación! Descárgala aquí: https://apps.apple.com/app/voice-shopping-list/id6505125372"
  },
  de: {
    contactUs: "Kontaktiere uns",
    mode: "Modus",
    privacyPolicy: "Datenschutz",
    share: "App empfehlen",
    shareMessage: "Schau dir diese unglaubliche App an! Lade sie hier herunter: https://apps.apple.com/app/voice-shopping-list/id6505125372"
  },
  it: {
    contactUs: "Contattaci",
    mode: "Modalità",
    privacyPolicy: "Informativa sulla privacy",
    share: "Consiglia App",
    shareMessage: "Scopri questa incredibile app! Scaricala qui: https://apps.apple.com/app/voice-shopping-list/id6505125372"
  },
  fr: {
    contactUs: "Contactez-nous",
    mode: "Mode",
    privacyPolicy: "Politique de confidentialité",
    share: "Recommander l'App",
    shareMessage: "Découvrez cette incroyable application ! Téléchargez-la ici : https://apps.apple.com/app/voice-shopping-list/id6505125372"
  },
  pt: {
    contactUs: "Contate-Nos",
    mode: "Modo",
    privacyPolicy: "Política de Privacidade",
    share: "Recomendar App",
    shareMessage: "Confira este aplicativo incrível! Baixe aqui: https://apps.apple.com/app/voice-shopping-list/id6505125372"
  },
  ru: {
    contactUs: "Свяжитесь с нами",
    mode: "Режим",
    privacyPolicy: "Политика конфиденциальности",
    share: "Рекомендовать приложение",
    shareMessage: "Посмотрите на это удивительное приложение! Загрузите его здесь: https://apps.apple.com/app/voice-shopping-list/id6505125372"
  },
  ar: {
    contactUs: "اتصل بنا",
    mode: "الوضع",
    privacyPolicy: "سياسة الخصوصية",
    share: "توصية بالتطبيق",
    shareMessage: "تحقق من هذا التطبيق المذهل! قم بتنزيله هنا: https://apps.apple.com/app/voice-shopping-list/id6505125372"
  },
  ja: {
    contactUs: "お問い合わせ",
    mode: "モード",
    privacyPolicy: "プライバシーポリシー",
    share: "アプリを推薦",
    shareMessage: "この素晴らしいアプリをチェックしてください！ ここからダウンロードしてください: https://apps.apple.com/app/voice-shopping-list/id6505125372"
  },
  zh: {
    contactUs: "联系我们",
    mode: "模式",
    privacyPolicy: "隐私政策",
    share: "推荐应用",
    shareMessage: "查看这个神奇的应用！ 在此处下载：https://apps.apple.com/app/voice-shopping-list/id6505125372"
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
        if (result.activityType) {
          console.log('Shared with activity type of', result.activityType);
        } else {
          console.log('Shared');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Dismissed');
      }
    } catch (error) {
      console.error('Error al compartir', error.message);
    }
  };
  
  const handlePrivacyPress = () => {
    setIsPrivacyModalVisible(true);
  };



  const handleContactPress = () => {
    const emailBody = `
      Device Model: ${DeviceInfo.getModel()}\n
      OS Version: ${DeviceInfo.getSystemVersion()}\n
    `;

    const mailtoURL = `mailto:info@lweb.ch?subject=Contact&body=${encodeURIComponent(emailBody)}`;
    Linking.openURL(mailtoURL).catch(err => console.error('Failed to open mail app:', err));
  };



  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
         label={currentTranslations.mode}
        onPress={toggleTheme}
        icon={({ color, size }) => (
          <Ionicons
            name={theme.dark ? "sunny" : "moon"}
            size={24}
            color={'grey'}
          />
        )}
        labelStyle={{ color: theme.textdos }}
      />
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
    
<Drawer.Screen 
  name="Favorites" 
  component={FavoritesStackNavigator} 
  options={{
    drawerIcon: ({ focused, size }) => (
      <Ionicons
        name="heart-outline"
        size={size}
        color={focused ? '#7cc' : '#ccc'}
      />
    ),
  }}
/>


 <Text style={{ 
  fontSize: 14,          // Tamaño de fuente
  color: theme.textcuatro ,         // Color del texto
  textAlign: 'center',  // Alineación del texto
  marginTop: 20,        // Margen superior
  marginBottom: 10,     // Margen inferior
  fontFamily: 'Poppins-Regular',
  marginTop:100,
}}>Powered by Chat GPT
</Text>
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
export default function App() {
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
  const screenText = screenNames[deviceLanguage] || screenNames['en'];
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('HomeScreen');
  const [isPermissionModalVisible, setPermissionModalVisible] = useState(false);

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
              let labelStyle = { fontSize: 17, color: theme.text,fontFamily: 'Poppins-Regular',  }; // Estilo por defecto para los labels

              switch (route.name) {
                case screenText.createList:
                  iconColor = '#3f51b5';
                  break;
                case screenText.imageList:
                  iconColor = 'orange';
                  break;
                case screenText.textList:
                  iconColor = 'orange';
                  break;
                case screenText.saved:
                  iconColor = '#009688';
                  labelStyle.color = '#009688'; // Color específico para "listas guardadas"
                  break;
                case screenText.subscribe:
                  iconColor = 'grey';
                  break;
                case screenText.information:
                  iconColor = 'grey';
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
                drawerLabelStyle: labelStyle, // Usa el estilo definido
                drawerIcon: ({ size, color }) => {
                  let iconName;
                  switch (route.name) {
                    case screenText.createList:
                      iconName = 'mic-outline';
                      break;
                    case screenText.imageList:
                      iconName = 'image-outline';
                      break;
                    case screenText.textList:
                      iconName = 'text-outline';
                      break;
                    case screenText.saved:
                      iconName = 'checkmark-circle-outline';
                      break;
                    case screenText.subscribe:
                      iconName = 'gift-outline';
                      break;
                    case screenText.information:
                      iconName = 'happy-outline';
                      break;
                    default:
                      iconName = 'person-add-outline';
                      break;
                  }
                  return <Ionicons name={iconName} color={iconColor} size={size} />;
                }
              };
            }}
            screenListeners={{
              state: (e) => {
                checkSubscription();
              },
            }}
          >
            <Drawer.Screen name={screenText.createList} component={HomeStackNavigator} initialParams={{ screen: initialRoute }} />
            <Drawer.Screen name={screenText.saved} component={HistoryStackNavigator} />
            <Drawer.Screen name={screenText.imageList} component={ImageListStackNavigator} />
            {!isSubscribed && (
              <Drawer.Screen name={screenText.subscribe} component={SuscribeScreen} />
            )}
            {isSubscribed && (
              <Drawer.Screen name="Mi Suscripción" component={MySubscriptionStackNavigator} />
            )}
            <Drawer.Screen name={screenText.information} component={InformationStackNavigator} />
      
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
