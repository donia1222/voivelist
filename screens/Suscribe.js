import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, Image, StyleSheet, Modal, ScrollView, Linking, Easing, Animated, ImageBackground, Dimensions, ActivityIndicator, Platform } from 'react-native';
import * as RNLocalize from "react-native-localize";
import RNRestart from 'react-native-restart';
import PrivacyModal from './links/PrivacyModal';
import EULAModal from './links/EulaModal';
import GDPRModal from './links/GDPRModal';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import TypingText from './components/TypingText';
import Purchases from 'react-native-purchases';
import Carousel from './components/Carousel';
import TextoAnimado from './components/TextoAnimadoSuscribese';
import { useTheme } from '../ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

// Mantén todas las traducciones existentes...
const restoreButtonTextTranslations = {
  en: "Restore Purchase",
  es: "Restaurar Compra",
  de: "Kauf wiederherstellen",
  fr: "Restaurer l'achat",
  it: "Ripristina acquisto",
  tr: "Satın Alma İşlemini Geri Yükle",
  pt: "Restaurar Compra",
  ru: "Восстановить покупку",
  zh: "恢复购买",
  ja: "購入を復元する",
  sv: "Återställ köp",
  hu: "Vásárlás visszaállítása",
  ar: "استعادة الشراء",
  hi: "खरीद बहाल करें",
  el: "Επαναφορά αγοράς"
};

const accessButtonTextTranslations = {
  en: "PRESS HERE TO ENTER →",
  es: "PRESIONA AQUÍ PARA ENTRAR →",
  de: "HIER DRÜCKEN, UM EINZUTRETEN →",
  fr: "APPUYEZ ICI POUR ENTRER →",
  it: "PREMI QUI PER ENTRARE →",
  tr: "GİRMEK İÇİN BURAYA BASIN →",
  pt: "PRESSIONE AQUI PARA ENTRAR →",
  ru: "НАЖМИТЕ ЗДЕСЬ, ЧТОБЫ ВОЙТИ →",
  zh: "按此进入 →",
  ja: "ここを押して入る →",
  sv: "TRYCK HÄR FÖR ATT GÅ IN →",
  hu: "IDE KATTINTS A BELÉPÉSHEZ →",
  ar: "اضغط هنا للدخول →",
  hi: "प्रवेश करने के लिए यहाँ दबाएँ →",
  el: "ΠΑΤΉΣΤΕ ΕΔΏ ΓΙΑ ΝΑ ΕΙΣΈΛΘΕΤΕ →",
};
const benefitTitleTranslations = {
  es: [
    { title: "✔️ Analiza imágenes con GPT4 VISION", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
    { title: "✔️ Obtiene Recetas con GPT4.1", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
    { title: "✔️ Calcula el precio de tus compras GPT4.1", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
  ],
  en: [
    { title: "✔️ Analyze images with GPT4 VISION", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
    { title: "✔️ Get recipes with GPT4.1", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
    { title: "✔️ Estimate your shopping cost with GPT4.1", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
  ],
  de: [
    { title: "✔️ Bilder analysieren mit GPT4 VISION", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
    { title: "✔️ Rezepte erhalten mit GPT4.1", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
    { title: "✔️ Einkaufskosten berechnen mit GPT4.1", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
  ],
  it: [
    { title: "✔️ Analizza immagini con GPT4 VISION", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
    { title: "✔️ Ottieni ricette con GPT4.1", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
    { title: "✔️ Calcola il costo della spesa con GPT4.1", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
  ],
  fr: [
    { title: "✔️ Analyser des images avec GPT4 VISION", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
    { title: "✔️ Obtenir des recettes avec GPT4.1", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
    { title: "✔️ Estimer le coût de vos achats avec GPT4.1", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
  ],
  tr: [
    { title: "✔️ GPT4 VISION ile görselleri analiz et", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
    { title: "✔️ GPT4.1 ile tarifler al", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
    { title: "✔️ GPT4.1 ile alışveriş maliyetini hesapla", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
  ],
  pt: [
    { title: "✔️ Analise imagens com GPT4 VISION", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
    { title: "✔️ Obtenha receitas com GPT4.1", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
    { title: "✔️ Calcule o custo das suas compras com GPT4.1", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
  ],
  ru: [
    { title: "✔️ Анализируйте изображения с GPT4 VISION", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
    { title: "✔️ Получайте рецепты с GPT4.1", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
    { title: "✔️ Рассчитайте стоимость покупок с GPT4.1", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
  ],
  ar: [
    { title: "✔️ تحليل الصور باستخدام GPT4 VISION", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
    { title: "✔️ احصل على وصفات باستخدام GPT4.1", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
    { title: "✔️ احسب تكلفة مشترياتك باستخدام GPT4.1", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
  ],
  hi: [
    { title: "✔️ GPT4 VISION के साथ छवियों का विश्लेषण करें", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
    { title: "✔️ GPT4.1 के साथ रेसिपी प्राप्त करें", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
    { title: "✔️ GPT4.1 के साथ अपनी खरीदारी की लागत का अनुमान लगाएं", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
  ],
  ja: [
    { title: "✔️ GPT4 VISIONで画像を分析", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
    { title: "✔️ GPT4.1でレシピを取得", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
    { title: "✔️ GPT4.1で買い物の費用を見積もる", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
  ],
  nl: [
    { title: "✔️ Analyseer afbeeldingen met GPT4 VISION", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
    { title: "✔️ Ontvang recepten met GPT4.1", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
    { title: "✔️ Bereken je boodschappen kosten met GPT4.1", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
  ],
};


const contentTranslations = {
  en: "Enjoy all features for",
  es: "Disfruta de todas las funciones por",
  de: "Genießen Sie alle Funktionen für",
  fr: "Profitez de toutes les fonctionnalités pour",
  it: "Goditi tutte le funzionalità per",
  tr: "Tüm özelliklerin keyfini çıkar",
  pt: "Aproveite todos os recursos por",
  ru: "Наслаждайтесь всеми функциями за",
  zh: "享受所有功能",
  ja: "すべての機能をお楽しみください",
  pl: "Ciesz się wszystkimi funkcjami za",
  sv: "Njut av alla funktioner för",
  hu: "Élvezze az összes funkciót",
  ar: "استمتع بجميع الميزات مقابل",
  hi: "सभी सुविधाओं का आनंद लें",
  el: "Απολαύστε όλες τις λειτουργίες για"
};

const currencySymbols = {
  USD: '$',
  EUR: '€',
  TRY: '₺',
  RUB: '₽',
  CNY: '¥',
  JPY: '¥',
  PLN: 'zł',
  SEK: 'kr',
  HUF: 'Ft',
  AED: 'د.إ',
  INR: '₹',
  CHF: 'CHF'
};

const basePriceUSD = 2.00;
const conversionRates = {
  USD: 1, EUR: 1, TRY: 1, RUB: 1, CNY: 1, JPY: 1, PLN: 1, SEK: 1, HUF: 1, AED: 1, INR: 1, CHF: 1
};

const monthTranslations = {
  en: "month Auto-renewable, cancel anytime.",
  es: "mes Auto-renovable, cancela en cualquier momento.",
  de: "Monat automatisch erneuerbar, jederzeit kündbar.",
  fr: "mois renouvellement automatique, annulez à tout moment.",
  it: "mese rinnovabile automaticamente, cancella in qualsiasi momento.",
  tr: "ay otomatik yenilenebilir, istediğiniz zaman iptal edin.",
  pt: "mês renovação automática, cancele a qualquer momento.",
  ru: "месяц автоматического продления, отмена в любое время.",
  zh: "月 自动续订, 随时取消.",
  ja: "月 自動更新, いつでもキャンセル可能.",
  pl: "miesiąc z automatycznym odnawianiem, anuluj w dowolnym momencie.",
  sv: "månad med automatisk förnyelse, avbryt när som helst.",
  hu: "hónap automatikus megújulással, bármikor lemondható.",
  ar: "شهر تجديد تلقائي, الإلغاء في أي وقت",
  hi: "महीना स्वचालित नवीनीकरण, किसी भी समय रद्द करें",
  el: "Μήνας με αυτόματη ανανέωση, ακύρωση ανά πάσα στιγμή."
};

// Estilos mejorados y responsivos
const getResponsiveStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme?.background || '#f8f9fa',
    paddingHorizontal: isTablet ? 60 : 20,
    paddingVertical: isTablet ? 40 : 20,
  },
  
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerSection: {
    alignItems: 'center',
    marginBottom: isTablet ? 40 : 30,
  },

  appIcon: {
    width: isTablet ? 120 : 180,
    height: isTablet ? 120 : 180,
    marginBottom: isTablet ? 20 : 30,
    borderRadius: isTablet ? 25 : 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  titleText: {
    fontSize: isTablet ? 28 : 24,
    fontWeight: 'bold',
    color: theme?.text || '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Poppins-Bold',
  },

  priceText: {
    fontSize: isTablet ? 18 : 16,
    color: '#34c759',
    textAlign: 'center',
    marginBottom: isTablet ? 40 : 30,
    fontWeight: '600',
    paddingHorizontal: 20,
    lineHeight: isTablet ? 24 : 22,
  },

  featuresSection: {
    width: '100%',
    maxWidth: isTablet ? 600 : 350,
    marginBottom: isTablet ? 40 : 30,
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: isTablet ? 20 : 16,
    marginVertical: 8,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  featureIcon: {
    width: isTablet ? 40 : 35,
    height: isTablet ? 40 : 35,
    marginRight: 15,
    borderRadius: 8,
  },

  featureText: {
    flex: 1,
    fontSize: isTablet ? 16 : 14,
    color: theme?.text || '#2c3e50',
    fontWeight: '500',
    lineHeight: isTablet ? 22 : 20,
  },

  buttonSection: {
    width: '100%',
    maxWidth: isTablet ? 400 : 300,
    alignItems: 'center',
    marginBottom: isTablet ? 30 : 20,
  },

  subscribeButton: {
    backgroundColor: '#ff375f',
    paddingVertical: isTablet ? 18 : 16,
    paddingHorizontal: isTablet ? 60 : 50,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#ff375f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 20,
  },

  subscribeButtonText: {
    color: 'white',
    fontSize: isTablet ? 18 : 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  restoreButton: {
    paddingVertical: isTablet ? 15 : 12,
    paddingHorizontal: isTablet ? 30 : 25,
  },

  restoreButtonText: {
    color: '#34c759',
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  linksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: isTablet ? 30 : 20,
    paddingHorizontal: 20,
  },

  linkButton: {
    paddingHorizontal: isTablet ? 15 : 12,
    paddingVertical: isTablet ? 10 : 8,
    margin: 5,
  },

  linkText: {
    color: '#8e8e93',
    fontSize: isTablet ? 14 : 12,
    fontWeight: '500',
  },

  subscribedContainer: {
    backgroundColor: '#34c759',
    paddingVertical: isTablet ? 20 : 18,
    paddingHorizontal: isTablet ? 40 : 30,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },

  subscribedText: {
    color: 'white',
    fontSize: isTablet ? 18 : 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  loaderContainer: {
    paddingVertical: 10,
  },

  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  buttonDisabled: {
    backgroundColor: '#cccccc',
    paddingVertical: isTablet ? 18 : 16,
    paddingHorizontal: isTablet ? 60 : 50,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default function Suscribe({ onClose }) {
  const { theme } = useTheme();
  const styles = getResponsiveStyles(theme);
  
  const [offerings, setOfferings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const systemLanguage = RNLocalize.getLocales()[0]?.languageCode || 'en';
  const [isPrivacyModalVisible, setIsPrivacyModalVisible] = useState(false);
  const [isEULAModalVisible, setIsEULAModalVisible] = useState(false);
  const [isGDPRModalVisible, setIsGDPRModalVisible] = useState(false);
  const [currencyCode, setCurrencyCode] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const benefitTitles = benefitTitleTranslations[systemLanguage] || benefitTitleTranslations['en'];

  useEffect(() => {
    const checkSubscription = async () => {
      if (Platform.OS === 'ios') {
        Purchases.setDebugLogsEnabled(true);
        await Purchases.configure({ apiKey: 'appl_bHxScLAZLsKxfggiOiqVAZTXjJX' });

        try {
          const purchaserInfo = await Purchases.getPurchaserInfo();
          if (purchaserInfo && purchaserInfo.entitlements.active['12981']) {
            setIsSubscribed(true);
          }
        } catch (error) {
          console.log('Error al obtener la información del comprador:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkSubscription();
  }, []);

  const getPriceForCurrency = (currencyCode) => {
    if (!currencyCode || !conversionRates[currencyCode]) {
      return `${currencySymbols['USD']}${basePriceUSD}/${monthTranslations['en']}`;
    }

    const convertedPrice = basePriceUSD * conversionRates[currencyCode];
    return `${currencySymbols[currencyCode]}${convertedPrice.toFixed(2)}/${monthTranslations[systemLanguage] || monthTranslations['en']}`;
  }

  useEffect(() => {
    const fetchCurrencyCode = async () => {
      try {
        const response = await axios.get('https://ipapi.co/currency/');
        setCurrencyCode(response.data);
      } catch (error) {
        console.error("Error fetching currency code: ", error);
      }
    };

    fetchCurrencyCode();
  }, []);

  useEffect(() => {
    const initializePurchases = async () => {
      if (Platform.OS === 'ios') {
        Purchases.setDebugLogsEnabled(true);
        await Purchases.configure({ apiKey: 'appl_bHxScLAZLsKxfggiOiqVAZTXjJX' });

        try {
          const purchaserInfo = await Purchases.getPurchaserInfo();
          if (purchaserInfo && purchaserInfo.entitlements.active['12981']) {
            console.log('Usuario ya suscrito');
            onClose(true);
            return;
          }
        } catch (error) {
          console.log('Error al obtener la información del comprador:', error);
        }

        try {
          const response = await Purchases.getOfferings();
          setOfferings(response.current);
        } catch (error) {
          console.log('Error al obtener ofertas:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializePurchases();
  }, []);

  const purchaseSubscription = async (pkg) => {
    setIsSubscribing(true);
    try {
      const purchaseMade = await Purchases.purchasePackage(pkg);
      if (purchaseMade && purchaseMade.customerInfo.entitlements.active['12981']) {
        console.log('Successful purchase');
        handleClose();
      }
    } catch (error) {
      console.log('Error making purchase:', error);
    } finally {
      setIsSubscribing(false);
    }
  };

  const restorePurchases = async () => {
    if (isSubscribed) {
      RNRestart.Restart();
    } else {
      setIsSubscribing(true);

      try {
        const restoredPurchases = await Purchases.restorePurchases();
        console.log('Restored Purchases:', restoredPurchases);

        if (restoredPurchases && restoredPurchases.entitlements.active['12981']) {
          console.log('Successful restoration');
          const expirationDate = restoredPurchases.allExpirationDates['12981'];
          Alert.alert(
            'Success',
            `Your purchase has been restored. The subscription will expire on ${new Date(expirationDate).toLocaleDateString()}.`,
            [{
              text: 'OK',
              onPress: () => {
                RNRestart.Restart();
              }
            }]
          );
        } else {
          Alert.alert('Restore Purchase', 'No previous purchases found to restore.');
        }
      } catch (error) {
        Alert.alert('Error Restoring', 'An error occurred while restoring the purchase.');
        console.log('Error restoring purchase:', error);
      } finally {
        setIsSubscribing(false);
      }
    }
  };

  const handleClose = () => {
    RNRestart.Restart();
  };

  const handlePrivacyPress = () => setIsPrivacyModalVisible(true);
  const handleEULAPress = () => setIsEULAModalVisible(true);
  const handleGDPRPress = () => setIsGDPRModalVisible(true);

  const handleContactPress = async () => {
    const deviceModel = DeviceInfo.getModel();
    const systemVersion = DeviceInfo.getSystemVersion();
    const emailBody = `Device Information:\nDevice Model: ${deviceModel}\niOS Version: ${systemVersion}`;
    const mailtoURL = `mailto:info@lweb.ch?body=${encodeURIComponent(emailBody)}`;
    Linking.openURL(mailtoURL).catch(err => console.error('Failed to open mail app:', err));
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#ff375f" />
        <Text style={styles.priceText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Image 
          source={require('../assets/images/App-Icon-1024x1024@1x copia.png')} 
          style={styles.appIcon} 
        />
        <Text style={styles.titleText}>Voice Grocery Premium</Text>
        <Text style={styles.priceText}>
          {`${contentTranslations[systemLanguage] || contentTranslations['en']} ${getPriceForCurrency(currencyCode)}`}
        </Text>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        {benefitTitles.map((benefit, index) => (
          <View key={index} style={styles.featureItem}>
            <Image source={{ uri: benefit.imageUrl }} style={styles.featureIcon} />
            <Text style={styles.featureText}>{benefit.title}</Text>
          </View>
        ))}
      </View>

      {/* Button Section */}
      <View style={styles.buttonSection}>
        {isSubscribed ? (
          <View style={styles.subscribedContainer}>
            <Text style={styles.subscribedText}>
              {accessButtonTextTranslations[systemLanguage] || accessButtonTextTranslations['en']}
            </Text>
          </View>
        ) : (
          offerings && offerings.availablePackages.map((pkg, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => purchaseSubscription(pkg)}
              disabled={isSubscribing}
              style={isSubscribing ? styles.buttonDisabled : styles.subscribeButton}
            >
              {isSubscribing ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color='#009688' />
                </View>
              ) : (
                <Text style={styles.subscribeButtonText}>SUBSCRIBE NOW</Text>
              )}
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity onPress={restorePurchases} style={styles.restoreButton}>
          <Text style={styles.restoreButtonText}>
            {isSubscribed 
              ? (accessButtonTextTranslations[systemLanguage] || accessButtonTextTranslations['en'])
              : (restoreButtonTextTranslations[systemLanguage] || restoreButtonTextTranslations['en'])
            }
          </Text>
        </TouchableOpacity>
      </View>

      {/* Links Section */}
      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={handlePrivacyPress} style={styles.linkButton}>
          <Text style={styles.linkText}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleEULAPress} style={styles.linkButton}>
          <Text style={styles.linkText}>EULA</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleGDPRPress} style={styles.linkButton}>
          <Text style={styles.linkText}>(T&C)</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleContactPress} style={styles.linkButton}>
          <Text style={styles.linkText}>Contact</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <PrivacyModal visible={isPrivacyModalVisible} onClose={() => setIsPrivacyModalVisible(false)} />
      <EULAModal visible={isEULAModalVisible} onClose={() => setIsEULAModalVisible(false)} />
      <GDPRModal visible={isGDPRModalVisible} onClose={() => setIsGDPRModalVisible(false)} />
    </ScrollView>
  );
}