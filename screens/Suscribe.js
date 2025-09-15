import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, Image, StyleSheet, Modal, ScrollView, Linking, Easing, Animated, ImageBackground, Dimensions, ActivityIndicator, Platform, LinearGradient } from 'react-native';
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
import suscribeAlerts from './translations/suscribeAlerts';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 768;
const isSmallIPhone = Platform.OS === 'ios' && (screenWidth <= 375 || screenHeight <= 667);

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

const basePriceUSD = 2.99;
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

// Estilos modernos y responsivos
const getResponsiveStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme?.background || '#f8f9fa',
  },
  
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.05,
  },
  
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: isTablet ? 60 : 20,
    paddingVertical: isTablet ? 40 : 30,
  },

  headerSection: {
    alignItems: 'center',
    marginBottom: isTablet ? 50 : 40,
    marginTop: isTablet ? 30 : 20,
  },

  appIconContainer: {
    marginBottom: isTablet ? 30 : 25,
    padding: 5,
    borderRadius: isTablet ? 45 : 40,
    backgroundColor: 'transparent',
    shadowColor: '#9b59b6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
    marginTop: isTablet ? -40 : -50,
  },

  appIcon: {
    width: isTablet ? 140 : isSmallIPhone ? 90 : 160,
    height: isTablet ? 140 : isSmallIPhone ? 90 : 160,
    borderRadius: isTablet ? 40 : isSmallIPhone ? 25 : 35,
  },

  titleText: {
    fontSize: isTablet ? 36 : isSmallIPhone ? 26 : 32,
    fontWeight: '600',
    color: theme?.text || '#2c3e50f6',
    textAlign: 'center',
    marginBottom: isSmallIPhone ? 6 : 10,
    letterSpacing: 0.5,
  },

  subtitleText: {
    fontSize: isTablet ? 20 : isSmallIPhone ? 15 : 18,
    color: theme?.text ? theme.text + '99' : '#666666',
    textAlign: 'center',
    marginBottom: isSmallIPhone ? 5 : 8,
    fontWeight: '300',
    letterSpacing: 0.3,
  },

  priceContainer: {
    backgroundColor: 'rgba(155, 89, 182, 0.15)',
    paddingHorizontal: isSmallIPhone ? 18 : 25,
    paddingVertical: isSmallIPhone ? 8 : 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 182, 0.3)',
    marginBottom: isTablet ? 35 : isSmallIPhone ? 20 : 30,
  },

  priceText: {
    fontSize: isTablet ? 20 : 18,
    color: '#2c29dbb7',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  featuresSection: {
    width: '100%',
    maxWidth: isTablet ? 600 : 400,
    marginBottom: isTablet ? 45 : 35,
    alignSelf: 'center',
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme?.background || 'white',
    padding: isTablet ? 22 : 18,
    marginVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme?.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#9b59b6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },

  featureIconContainer: {
    width: isTablet ? 50 : 45,
    height: isTablet ? 50 : 45,
    borderRadius: 15,
    backgroundColor: 'rgba(155, 89, 182, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  featureIcon: {
    width: isTablet ? 30 : 28,
    height: isTablet ? 30 : 28,
    tintColor: '#9b59b6',
  },

  featureText: {
    flex: 1,
    fontSize: isTablet ? 17 : 15,
    color: theme?.text || '#2c3e50',
    fontWeight: '600',
    lineHeight: isTablet ? 24 : 22,
    letterSpacing: 0.3,
  },

  buttonSection: {
    width: '100%',
    maxWidth: isTablet ? 450 : 350,
    alignItems: 'center',
    marginBottom: isTablet ? 30 : 25,
    alignSelf: 'center',
    marginTop: isTablet ? -30 : -40,
  },

  subscribeButtonGradient: {
    borderRadius: 30,
    marginBottom: 20,
    backgroundColor: 'rgba(44, 41, 219, 0.15)', // Azul semitransparente moderno
    borderWidth: 2,
    borderColor: 'rgba(44, 41, 219, 0.3)',
    shadowColor: '#2c29db',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },

  subscribeButton: {
    paddingVertical: isTablet ? 20 : isSmallIPhone ? 14 : 18,
    paddingHorizontal: isTablet ? 70 : isSmallIPhone ? 45 : 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  subscribeButtonText: {
    color: '#2c29db', // Azul intenso, mismo color que el fondo pero fuerte
    fontSize: isTablet ? 19 : isSmallIPhone ? 15 : 17,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  restoreButton: {
    backgroundColor: 'rgba(155, 89, 182, 0.1)',
    paddingVertical: isTablet ? 16 : isSmallIPhone ? 10 : 14,
    paddingHorizontal: isTablet ? 35 : isSmallIPhone ? 22 : 30,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 182, 0.3)',
  },

  restoreButtonText: {
    color: '#9b59b6',
    fontSize: isTablet ? 16 : isSmallIPhone ? 12 : 14,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  linksContainer: {
    flexDirection: 'row',

    justifyContent: 'center',
    alignItems: 'center',
    marginTop: isTablet ? 35 : 25,
    paddingHorizontal: 20,

  },

  linkButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: isTablet ? 15 : 12,
    paddingVertical: isTablet ? 8 : 6,
    margin: 2,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: theme?.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
  },

  linkText: {
    color: theme?.text ? theme.text + '99' : '#8e8e93',
    fontSize: isTablet ? 14 : 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  subscribedContainer: {
    backgroundColor: 'rgba(46, 213, 115, 0.1)',
    paddingVertical: isTablet ? 28 : 24,
    paddingHorizontal: isTablet ? 50 : 40,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 2,
    borderColor: 'rgba(46, 213, 115, 0.4)',
    shadowColor: '#2ed573',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
    position: 'relative',
    overflow: 'hidden',
  },

  subscribedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#2ed573',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2ed573',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  subscribedText: {
    color: '#2ed573',
    fontSize: isTablet ? 20 : 18,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(46, 213, 115, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  subscribedSubtext: {
    color: '#00cec9',
    fontSize: isTablet ? 15 : 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.8,
    letterSpacing: 0.5,
  },

  premiumFeatures: {
    marginTop: 20,
    width: '100%',
  },

  premiumFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginVertical: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#2ed573',
  },

  premiumFeatureText: {
    color: theme?.text || '#2c3e50',
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },

  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: isTablet ? 23 : isSmallIPhone ? 18 : 20, // Misma altura que el texto
  },

  modalView: {
    margin: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 25,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },

  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: theme?.text || '#2c3e50',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },

  buttonDisabled: {
    backgroundColor: 'rgba(155, 89, 182, 0.2)',
    paddingVertical: isTablet ? 20 : 18,
    paddingHorizontal: isTablet ? 70 : 60,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 182, 0.3)',
  },

  shimmerEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },

  premiumBadge: {
    backgroundColor: 'rgba(155, 89, 182, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 182, 0.4)',
  },

  premiumBadgeText: {
    color: '#9b59b6',
    fontSize: isTablet ? 14 : 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

export default function Suscribe({ onClose }) {
  const { theme } = useTheme();
  const styles = getResponsiveStyles(theme);
  
  const [offerings, setOfferings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const systemLanguage = RNLocalize.getLocales()[0]?.languageCode || 'en';
  const alertTexts = suscribeAlerts[systemLanguage] || suscribeAlerts['en'];
  const [isPrivacyModalVisible, setIsPrivacyModalVisible] = useState(false);
  const [isEULAModalVisible, setIsEULAModalVisible] = useState(false);
  const [isGDPRModalVisible, setIsGDPRModalVisible] = useState(false);
  const [currencyCode, setCurrencyCode] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const benefitTitles = benefitTitleTranslations[systemLanguage] || benefitTitleTranslations['en'];
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

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
    animateButtonPress();
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
            alertTexts.success,
            `${alertTexts.purchaseRestored} ${new Date(expirationDate).toLocaleDateString()}.`,
            [{
              text: alertTexts.ok,
              onPress: () => {
                RNRestart.Restart();
              }
            }]
          );
        } else {
          Alert.alert(alertTexts.restorePurchase, alertTexts.noPreviousPurchases);
        }
      } catch (error) {
        Alert.alert(alertTexts.errorRestoring, alertTexts.errorOccurred);
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
        <ActivityIndicator size="large" color="#9b59b6" />
        <Text style={[styles.priceText, { marginTop: 20 }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <Animated.View style={[
          styles.headerSection,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}>
   
          <View style={styles.appIconContainer}>
            <Image 
              source={require('../assets/images/App-Icon-1024x1024@1x copia.png')} 
              style={styles.appIcon} 
            />
          </View>
          
          <Text style={[styles.titleText, isSmallIPhone && {fontSize: 28}]}>BuyVoice</Text>
          <Text style={[styles.subtitleText, isSmallIPhone && {fontSize: 14}]}>Unlock Full Potential</Text>
          
          <View style={[styles.priceContainer, isSmallIPhone && {marginBottom: 15}]}>
            <Text style={[styles.priceText, isSmallIPhone && {fontSize: 16}]}>
              {`${contentTranslations[systemLanguage] || contentTranslations['en']} ${getPriceForCurrency(currencyCode)}`}
            </Text>
          </View>
        </Animated.View>


        {/* Button Section */}
        <Animated.View style={[
          styles.buttonSection,
          {
            opacity: fadeAnim,
            transform: [{ scale: buttonScale }]
          }
        ]}>
          {isSubscribed ? (
            <View style={styles.subscribedContainer}>
              {/* Badge de suscripción premium */}
              <View style={styles.subscribedBadge}>
                <Ionicons name="checkmark" size={14} color="white" />
              </View>
              
              {/* Icono premium principal */}
              <View style={{ marginBottom: 12 }}>
                <Ionicons name="diamond" size={32} color="#2ed573" />
              </View>
              
              {/* Texto principal */}
              <Text style={styles.subscribedText}>
                Premium Active
              </Text>
              <Text style={styles.subscribedSubtext}>
                Enjoy unlimited features
              </Text>
              
              {/* Lista de características premium desbloqueadas */}
              <View style={styles.premiumFeatures}>
                <View style={styles.premiumFeatureRow}>
                  <Ionicons name="infinite" size={18} color="#2ed573" />
                  <Text style={styles.premiumFeatureText}>Unlimited voice recordings</Text>
                </View>
                <View style={styles.premiumFeatureRow}>
                  <Ionicons name="eye" size={18} color="#00cec9" />
                  <Text style={styles.premiumFeatureText}>AI Image Analysis</Text>
                </View>
                <View style={styles.premiumFeatureRow}>
                  <Ionicons name="calculator" size={18} color="#fd79a8" />
                  <Text style={styles.premiumFeatureText}>Price Estimation</Text>
                </View>
                <View style={styles.premiumFeatureRow}>
                  <Ionicons name="restaurant" size={18} color="#fdcb6e" />
                  <Text style={styles.premiumFeatureText}>Recipe Suggestions</Text>
                </View>
              </View>
              
              {/* Botón principal para continuar usando la app */}
              <TouchableOpacity 
                onPress={() => RNRestart.Restart()}
                style={{
                  backgroundColor: '#2ed573',
                  paddingVertical: isTablet ? 16 : isSmallIPhone ? 12 : 14,
                  paddingHorizontal: isTablet ? 40 : isSmallIPhone ? 28 : 35,
                  borderRadius: 25,
                  marginTop: 20,
                  width: '100%',
                  alignItems: 'center',
                  shadowColor: '#2ed573',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 8,
                }}
                activeOpacity={0.8}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="arrow-forward" size={20} color="white" style={{ marginRight: 8 }} />
                  <Text style={{
                    color: 'white',
                    fontSize: isTablet ? 18 : 16,
                    fontWeight: '800',
                    letterSpacing: 0.5,
                  }}>
                    {accessButtonTextTranslations[systemLanguage] || accessButtonTextTranslations['en']}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            offerings && offerings.availablePackages.map((pkg, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => purchaseSubscription(pkg)}
                disabled={isSubscribing}
                activeOpacity={0.9}
                style={styles.subscribeButtonGradient}
              >
                <View style={styles.subscribeButton}>
                  {isSubscribing ? (
                    <View style={styles.loaderContainer}>
                      <ActivityIndicator size="small" color='#2c29db' />
                    </View>
                  ) : (
                    <>
                      <Text style={[styles.subscribeButtonText, isSmallIPhone && {fontSize: 16}]}>Get Started →</Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}

          <TouchableOpacity 
            onPress={restorePurchases} 
            style={styles.restoreButton}
            activeOpacity={0.7}
          >
            <Text style={styles.restoreButtonText}>
              {isSubscribed 
                ? (accessButtonTextTranslations[systemLanguage] || accessButtonTextTranslations['en'])
                : (restoreButtonTextTranslations[systemLanguage] || restoreButtonTextTranslations['en'])
              }
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Links Section */}
        <Animated.View style={[
          styles.linksContainer,
          { opacity: fadeAnim }
        ]}>
          <TouchableOpacity 
            onPress={handlePrivacyPress} 
            style={styles.linkButton}
            activeOpacity={0.7}
          >
            <Text style={styles.linkText}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleEULAPress} 
            style={styles.linkButton}
            activeOpacity={0.7}
          >
            <Text style={styles.linkText}>EULA</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleGDPRPress} 
            style={styles.linkButton}
            activeOpacity={0.7}
          >
            <Text style={styles.linkText}>Terms</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleContactPress} 
            style={styles.linkButton}
            activeOpacity={0.7}
          >
            <Text style={styles.linkText}>Support</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Modals */}
        <PrivacyModal visible={isPrivacyModalVisible} onClose={() => setIsPrivacyModalVisible(false)} />
        <EULAModal visible={isEULAModalVisible} onClose={() => setIsEULAModalVisible(false)} />
        <GDPRModal visible={isGDPRModalVisible} onClose={() => setIsGDPRModalVisible(false)} />
      </ScrollView>
    </View>
  );
}