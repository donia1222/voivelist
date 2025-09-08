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
    '12981': texts.monthly,
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
      const restoredPurchases = await Purchases.restorePurchases();
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
        if (customerInfo.entitlements.active['12981']) {
          const subscription = customerInfo.entitlements.active['12981'];
          subscription.purchaseDate = customerInfo.allPurchaseDates['12981'];
          subscription.expirationDate = customerInfo.allExpirationDates['12981'];
          setSubscriptionInfo(subscription);
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
            <Text style={styles.badgeText}> {texts.subscriptionActive}</Text>
          </View>

          <Image 
            source={require('../assets/images/checked3.png')} 
            style={styles.image} 
            resizeMode="contain"
          />
        </View>

        {subscriptionInfo ? (
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{texts.userId}:</Text>
              <Text style={styles.infoValue}>{userId}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{texts.activeSubscription}:</Text>
              <Text style={styles.infoValue}>{productNames[subscriptionInfo.productIdentifier] || subscriptionInfo.productIdentifier}</Text>
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

        <Text style={styles.footerText}>
          {texts.autoRenewal}
        </Text>

        <View style={styles.linksContainer}>
          <TouchableOpacity onPress={handlePrivacyPress} style={styles.linkButton}>
            <Text style={styles.linkText}>Privacy Policy</Text>
          </TouchableOpacity>
          <View style={styles.linkDivider} />
          
          <TouchableOpacity onPress={handleEULAPress} style={styles.linkButton}>
            <Text style={styles.linkText}>EULA</Text>
          </TouchableOpacity>
          <View style={styles.linkDivider} />
          
          <TouchableOpacity onPress={handleGDPRPress} style={styles.linkButton}>
            <Text style={styles.linkText}>T&C</Text>
          </TouchableOpacity>
          <View style={styles.linkDivider} />
          
          <TouchableOpacity onPress={handleSupportPress} style={styles.linkButton}>
            <Text style={styles.linkText}>Support</Text>
          </TouchableOpacity>
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
    backgroundColor:'#e7ead2',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-SemiBold',
    color: theme.buttonBackground,
    marginBottom: 15,
    textAlign: 'center',
  },
  badgeContainer: {
    backgroundColor: theme.buttonBackground,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  badgeText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
  },
  image: {
    width: 80,
    height: 80,
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  infoLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: theme.text,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: theme.text,
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  noSubscriptionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  noSubscriptionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: theme.text,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(88, 88, 88, 0.8)',
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 20,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  linkButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  linkText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: theme.buttonBackground,
    textAlign: 'center',
  },
  linkDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(88, 88, 88, 0.5)',
  },
});

export default MySubscriptionScreen;