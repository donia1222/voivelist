import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Image, 
  TouchableOpacity, 
  Modal,
  Dimensions,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { useTheme } from '../ThemeContext';
import Purchases from 'react-native-purchases';
import * as RNLocalize from 'react-native-localize';
import localizedTexts from './translations/MySuscripcion';
import DeviceInfo from 'react-native-device-info';
import { Linking } from 'react-native';
import PrivacyModal from './links/PrivacyModal';
import EULAModal from './links/EulaModal';
import GDPRModal from './links/GDPRModal';

const screenWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const currencySymbols = {
  USD: '$',  // United States Dollar
  EUR: '€',  // Euro
  GBP: '£',  // British Pound
  JPY: '¥',  // Japanese Yen
  CNY: '¥',  // Chinese Yuan
  INR: '₹',  // Indian Rupee
  AUD: 'A$', // Australian Dollar
  CAD: 'C$', // Canadian Dollar
  CHF: 'CHF', // Swiss Franc
  KRW: '₩',  // South Korean Won
  BRL: 'R$', // Brazilian Real
  MXN: '$',  // Mexican Peso
  ZAR: 'R',  // South African Rand
  RUB: '₽',  // Russian Ruble
  SEK: 'kr', // Swedish Krona
  NOK: 'kr', // Norwegian Krone
  DKK: 'kr', // Danish Krone
  PLN: 'zł', // Polish Zloty
  TRY: '₺',  // Turkish Lira
  SGD: 'S$', // Singapore Dollar
  NZD: 'NZ$', // New Zealand Dollar
  HKD: 'HK$', // Hong Kong Dollar
  THB: '฿',  // Thai Baht
  MYR: 'RM', // Malaysian Ringgit
  IDR: 'Rp', // Indonesian Rupiah
  VND: '₫',  // Vietnamese Dong
  PHP: '₱',  // Philippine Peso
  CZK: 'Kč', // Czech Koruna
  HUF: 'Ft', // Hungarian Forint
  ILS: '₪',  // Israeli Shekel
  SAR: '﷼', // Saudi Riyal
  AED: 'د.إ', // Emirati Dirham
};

const supportModalMessages = {
  en: "You need to be subscribed to contact support.",
  es: "Necesitas estar suscrito para contactar al soporte.",
  de: "Sie müssen abonniert sein, um den Support zu kontaktieren.",
  fr: "Vous devez être abonné pour contacter le support.",
  it: "Devi essere iscritto per contattare il supporto.",
  tr: "Destek ile iletişime geçmek için abone olmanız gerekmektedir.",
  pt: "Você precisa estar inscrito para entrar em contato com o suporte.",
  ru: "Вы должны быть подписаны, чтобы связаться со службой поддержки.",
  zh: "您需要订阅才能联系支持。",
  ja: "サポートに連絡するには、登録する必要があります。",
  pl: "Musisz być zapisany, aby skontaktować się z pomocą techniczną.",
  sv: "Du måste vara prenumerant för att kontakta supporten.",
  hu: "Fel kell iratkoznia a támogatással való kapcsolatfelvételhez.",
  ar: "تحتاج إلى الاشتراك للتواصل مع الدعم.",
  hi: "सहायता से संपर्क करने के लिए आपको सदस्यता लेनी पड़ेगी।",
  el: "Πρέπει να είστε συνδρομητής για να επικοινωνήσετε με την υποστήριξη."
};

const getTextsForLocale = (locale) => {
  const languageCode = locale.languageCode;
  return localizedTexts[languageCode] || localizedTexts['en'];
};

const MySubscriptionScreen = () => {
  const { theme } = useTheme();
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const locale = RNLocalize.getLocales()[0];
  const texts = getTextsForLocale(locale);
  const currencyCode = RNLocalize.getCurrencies()[0];
  const currencySymbol = currencySymbols[currencyCode] || '$';
  const [isSupportModalVisible, setIsSupportModalVisible] = useState(false);
  const systemLanguage = RNLocalize.getLocales()[0]?.languageCode || 'en';
  const supportModalMessage = supportModalMessages[systemLanguage] || supportModalMessages['en']; 
  const [isPrivacyModalVisible, setIsPrivacyModalVisible] = useState(false);
  const [isEULAModalVisible, setIsEULAModalVisible] = useState(false);
  const [isGDPRModalVisible, setIsGDPRModalVisible] = useState(false);
  const styles = getStyles(theme);
  
  const productNames = {
    '12981': texts.monthly, // 1 mes
    'semana16': '1 Week / 1 Semana', // Suscripción de 1 semana
    '06mes': '6 Months / 6 Meses', // Suscripción de 6 meses
    'year': '1 Year / 1 Año', // Suscripción de 1 año
    'premium': 'Premium', // Fallback
    // Añadir más identificadores según aparezcan en los logs
  };

  // Función para determinar la duración basándose en el entitlement y productIdentifier
  const getSubscriptionDuration = (subscription) => {
    if (!subscription) {
      return 'Premium Subscription';
    }

    // Verificar por entitlement ID (más confiable)
    const entitlementId = subscription.identifier || subscription.entitlementId;
    console.log('🔍 DEBUG: Entitlement ID:', entitlementId);
    console.log('🔍 DEBUG: Product ID:', subscription.productIdentifier);

    // Verificar todos los tipos de suscripción
    if (entitlementId === '12981' || subscription.productIdentifier === '12981') {
      console.log('🏷️ Detectado: 1 Mes (12981)');
      return texts.monthly || '1 Month';
    }

    if (entitlementId === '06mes') {
      console.log('🏷️ Detectado: 6 Meses (06mes)');
      return '6 Months / 6 Meses';
    }

    if (entitlementId === 'year') {
      console.log('🏷️ Detectado: 1 Año (year)');
      return '1 Year / 1 Año';
    }

    if (entitlementId === 'semana16') {
      console.log('🏷️ Detectado: 1 Semana (semana16)');
      return '1 Week / 1 Semana';
    }

    if (entitlementId === 'premium') {
      console.log('🏷️ Detectado: Premium (fallback)');
      return 'Premium';
    }

    // Fallback: usar productNames o el productIdentifier
    const productId = subscription.productIdentifier;
    if (productNames[productId]) {
      console.log('🏷️ Encontrado en productNames:', productNames[productId]);
      return productNames[productId];
    }

    console.log('⚠️ Tipo de suscripción no reconocido, usando productId:', productId);
    return productId || 'Premium Subscription';
  };
  
  const handlePrivacyPress = () => {
    setIsPrivacyModalVisible(true);
  };

  const handleEULAPress = () => {
    setIsEULAModalVisible(true);
  };

  const handleGDPRPress = () => {
    setIsGDPRModalVisible(true);
  };

  const handleSupportPress = async () => {
    try {
      await Purchases.restorePurchases();
      const customerInfo = await Purchases.getCustomerInfo();
      
      const subscription = customerInfo.entitlements.active['semana16'] || {};
      const startDate = new Date(subscription.purchaseDate).toLocaleDateString();
      const expirationDate = new Date(subscription.expirationDate).toLocaleDateString();
      const userId = customerInfo.originalAppUserId;
      
      // Get the device model
      const deviceModel = DeviceInfo.getModel();
  
      // Get the OS version
      const systemVersion = DeviceInfo.getSystemVersion();
  
      const emailBody = `
        Device Model: ${deviceModel}\n
        iOS Version: ${systemVersion}\n
        Subscription Start Date: ${startDate}\n
        Subscription Expiration Date: ${expirationDate}\n
        User ID: ${userId}\n
      `;
  
      const mailtoURL = `mailto:info@lweb.ch?subject=Subscription%20Support&body=${encodeURIComponent(emailBody)}`;
  
      Linking.openURL(mailtoURL).catch(err => console.error('Failed to open mail app:', err));
    } catch (error) {
      console.log('Error:', error);
    }
  };

  useEffect(() => {
    const fetchSubscriptionInfo = async () => {
      try {
        const customerInfo = await Purchases.getCustomerInfo();

        // ✅ LOGS PARA DEBUG - ver todos los entitlements activos
        console.log('🔍 DEBUG: Todos los entitlements activos:', customerInfo.entitlements.active);
        console.log('🔍 DEBUG: Todas las fechas de compra:', customerInfo.allPurchaseDates);
        console.log('🔍 DEBUG: Todas las fechas de expiración:', customerInfo.allExpirationDates);
        console.log('🔍 DEBUG: Active subscriptions:', customerInfo.activeSubscriptions);

        // Buscar la suscripción activa más reciente
        let foundSubscription = null;
        const activeEntitlements = customerInfo.entitlements.active;

        // Obtener todas las suscripciones activas
        const allActiveSubscriptions = [];

        // Verificar cada tipo de suscripción y recopilar información
        const entitlementTypes = ['06mes', 'year', 'semana16', '12981', 'premium'];

        entitlementTypes.forEach(entitlementId => {
          if (activeEntitlements[entitlementId]) {
            const subscription = activeEntitlements[entitlementId];
            const productId = subscription.productIdentifier;

            // Obtener fechas
            subscription.purchaseDate = entitlementId === '12981'
              ? customerInfo.allPurchaseDates['12981']
              : customerInfo.allPurchaseDates[productId];
            subscription.expirationDate = entitlementId === '12981'
              ? customerInfo.allExpirationDates['12981']
              : customerInfo.allExpirationDates[productId];

            console.log(`🔍 Suscripción encontrada (${entitlementId}):`, subscription);
            console.log(`📅 Expira: ${subscription.expirationDate}`);

            allActiveSubscriptions.push({
              entitlementId,
              subscription,
              expirationDate: new Date(subscription.expirationDate)
            });
          }
        });

        // Si hay múltiples suscripciones, elegir la que expire más tarde (más reciente)
        if (allActiveSubscriptions.length > 0) {
          // Ordenar por fecha de expiración (más tardía primero)
          allActiveSubscriptions.sort((a, b) => b.expirationDate - a.expirationDate);

          const latestSubscription = allActiveSubscriptions[0];
          foundSubscription = latestSubscription.subscription;

          console.log(`✅ Suscripción activa seleccionada: ${latestSubscription.entitlementId}`);
          console.log('📅 Expira el:', latestSubscription.expirationDate);

          // Log de todas las suscripciones para debug
          console.log('📋 Todas las suscripciones activas:', allActiveSubscriptions.map(s => ({
            tipo: s.entitlementId,
            expira: s.expirationDate.toLocaleDateString()
          })));
        }

        if (foundSubscription) {
          setSubscriptionInfo(foundSubscription);
        } else {
          console.log('❌ No se encontró ninguna suscripción activa');
        }

        setUserId(customerInfo.originalAppUserId);
      } catch (error) {
        console.log('Error fetching subscription info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptionInfo();
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.buttonBackground} />
      </View>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString(locale.languageTag);
  };

  return (
    <SafeAreaView style={[styles.safeArea]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>✓ {texts.subscriptionActive}</Text>
          </View>

          <Image 
            source={require('../assets/images/checked3.png')} 
            style={styles.image} 
            resizeMode="contain"
          />
          
          <Text style={styles.welcomeText}>
            {texts.welcomeMessage || 'Welcome to Premium!'}
          </Text>
        </View>

        {subscriptionInfo ? (
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{texts.userId}:</Text>
              <Text style={styles.infoValue}>{userId}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{texts.activeSubscription}:</Text>
              <Text style={styles.infoValue}>{getSubscriptionDuration(subscriptionInfo)}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{texts.purchaseDate}:</Text>
              <Text style={styles.infoValue}>{formatDate(subscriptionInfo.purchaseDate)}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{texts.expirationDate}:</Text>
              <Text style={styles.infoValue}>{formatDate(subscriptionInfo.expirationDate)}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{texts.amountPaid}:</Text>
              <Text style={styles.infoValue}>3 {currencySymbol}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.noSubscriptionContainer}>
            <Text style={styles.noSubscriptionText}>
              {texts.noActiveSubscription}
            </Text>
          </View>
        )}


        <View style={styles.linksContainer}>
          <View style={styles.linksRow}>
            <TouchableOpacity onPress={handlePrivacyPress} style={styles.linkButton}>
              <Text style={styles.linkText}>Privacy Policy</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleEULAPress} style={styles.linkButton}>
              <Text style={styles.linkText}>EULA</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.linksRow}>
            <TouchableOpacity onPress={handleGDPRPress} style={styles.linkButton}>
              <Text style={styles.linkText}>T&C</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSupportPress} style={[styles.linkButton, styles.supportButton]}>
              <Text style={[styles.linkText, styles.supportButtonText]}>📧 Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <PrivacyModal 
        visible={isPrivacyModalVisible} 
        onClose={() => setIsPrivacyModalVisible(false)} 
      />
      <EULAModal 
        visible={isEULAModalVisible} 
        onClose={() => setIsEULAModalVisible(false)} 
      />
      <GDPRModal 
        visible={isGDPRModalVisible} 
        onClose={() => setIsGDPRModalVisible(false)} 
      />
    </SafeAreaView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#1a1a1a' :"#e7ead2",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },

  badgeContainer: {
    backgroundColor: 'rgba(34, 197, 94, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 24,
    shadowColor: 'rgba(34, 197, 94, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginTop: -20,
  },
  badgeText: {
    color: '#16a34a',
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    fontWeight: '700',
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: theme === 'dark' ? '#ffffff' : '#1f2937',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: theme === 'dark' ? '#2a2a2a' : '#ffffffad',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: theme === 'dark' ? 0.3 : 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: theme === 'dark' ? 1 : 0,
    borderColor: theme === 'dark' ? '#3a3a3a' : 'transparent',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
  },
  infoLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: theme === 'dark' ? '#a0a0a0' : '#6b7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: theme === 'dark' ? '#ffffff' : '#1f2937',
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
    fontWeight: '600',
  },
  noSubscriptionContainer: {
    backgroundColor: theme === 'dark' ? '#2a2a2a' : '#ffffff',
    borderRadius: 20,
    padding: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: theme === 'dark' ? 1 : 0,
    borderColor: theme === 'dark' ? '#3a3a3a' : 'transparent',
  },
  noSubscriptionText: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: theme === 'dark' ? '#a0a0a0' : '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  footerText: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: theme === 'dark' ? '#808080' : '#6b7280',
    textAlign: 'center',
    marginVertical: 24,
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  linksContainer: {
    flexDirection: 'column',
    width: '100%',
    marginTop: 24,
    paddingHorizontal: 16,
    gap: 12,
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  linkButton: {
    flex: 1,
    minHeight: 45,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: theme === 'dark' ? 'rgba(79, 70, 229, 0.2)' : 'rgba(79, 70, 229, 0.1)',
    borderWidth: 1,
    borderColor: theme === 'dark' ? 'rgba(79, 70, 229, 0.3)' : 'rgba(79, 70, 229, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme === 'dark' ? '#8b7df7' : '#4f46e5',
    textAlign: 'center',
  },
  supportButton: {
    backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
    borderColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)',
  },
  supportButtonText: {
    color: theme === 'dark' ? '#4ade80' : '#16a34a',
  },
});

export default MySubscriptionScreen;