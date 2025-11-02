import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, Image, StyleSheet, Modal, ScrollView, Linking, Easing, Animated, ImageBackground, Dimensions, ActivityIndicator, Platform } from 'react-native';
import * as RNLocalize from "react-native-localize";
import RNRestart from 'react-native-restart';
import PrivacyModal from './links/PrivacyModal';
import EULAModal from './links/EulaModal';
import GDPRModal from './links/GDPRModal';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import Purchases from 'react-native-purchases';
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

const comingSoonTitleTranslations = {
  en: "Coming Soon!",
  es: "¡Próximamente disponible!",
  de: "Bald verfügbar!",
  fr: "Bientôt disponible!",
  it: "Prossimamente disponibile!",
  tr: "Yakında gelecek!",
  pt: "Em breve disponível!",
  ru: "Скоро будет доступно!",
  zh: "即将推出！",
  ja: "近日公開！",
  sv: "Kommer snart!",
  hu: "Hamarosan elérhető!",
  ar: "قريبا!",
  hi: "जल्द आ रहा है!",
  el: "Έρχεται σύντομα!"
};

const comingSoonMessageTranslations = {
  en: "Premium subscriptions for Android will be available very soon. Stay tuned!",
  es: "Las suscripciones premium para Android estarán disponibles muy pronto. ¡Mantente atento!",
  de: "Premium-Abonnements für Android werden sehr bald verfügbar sein. Bleiben Sie dran!",
  fr: "Les abonnements premium pour Android seront bientôt disponibles. Restez à l'écoute!",
  it: "Gli abbonamenti premium per Android saranno disponibili molto presto. Restate sintonizzati!",
  tr: "Android için premium abonelikler çok yakında kullanılabilir olacak. Bizi takip edin!",
  pt: "As assinaturas premium para Android estarão disponíveis em breve. Fique atento!",
  ru: "Премиум-подписки для Android скоро станут доступны. Следите за обновлениями!",
  zh: "Android高级订阅即将推出。敬请期待！",
  ja: "Android向けプレミアムサブスクリプションは間もなく利用可能になります。お楽しみに！",
  sv: "Premium-prenumerationer för Android kommer snart att finnas tillgängliga. Håll utkik!",
  hu: "Az Android premium előfizetések hamarosan elérhetők lesznek. Maradjon velünk!",
  ar: "ستتوفر الاشتراكات المميزة لنظام Android قريبًا جدًا. ابق على اطلاع!",
  hi: "एंड्रॉइड के लिए प्रीमियम सदस्यता जल्द ही उपलब्ध होगी। बने रहें!",
  el: "Οι premium συνδρομές για Android θα είναι διαθέσιμες πολύ σύντομα. Μείνετε συντονισμένοι!"
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

// Traducciones para los diferentes paquetes
const packageDurationTranslations = {
  en: {
    one_month: "1 Month",
    three_months: "3 Months",
    six_months: "6 Months",
    one_year: "1 Year"
  },
  es: {
    one_month: "1 Mes",
    three_months: "3 Meses",
    six_months: "6 Meses",
    one_year: "1 Año"
  },
  de: {
    one_month: "1 Monat",
    three_months: "3 Monate",
    six_months: "6 Monate",
    one_year: "1 Jahr"
  },
  fr: {
    one_month: "1 Mois",
    three_months: "3 Mois",
    six_months: "6 Mois",
    one_year: "1 An"
  },
  it: {
    one_month: "1 Mese",
    three_months: "3 Mesi",
    six_months: "6 Mesi",
    one_year: "1 Anno"
  },
  pt: {
    one_month: "1 Mês",
    three_months: "3 Meses",
    six_months: "6 Meses",
    one_year: "1 Ano"
  }
};

const packageBadgeTranslations = {
  en: {
    basic: "Basic",
    best_value: "Best Value",
    premium: "Premium"
  },
  es: {
    basic: "Básico",
    best_value: "Mejor Valor",
    premium: "Premium"
  },
  de: {
    basic: "Basis",
    best_value: "Bester Wert",
    premium: "Premium"
  },
  fr: {
    basic: "Basique",
    best_value: "Meilleure Valeur",
    premium: "Premium"
  },
  it: {
    basic: "Base",
    best_value: "Miglior Valore",
    premium: "Premium"
  },
  pt: {
    basic: "Básico",
    best_value: "Melhor Valor",
    premium: "Premium"
  }
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

// Traducciones para los períodos de suscripción
const subscriptionPeriodsTranslations = {
  en: {
    three_months: "/3 months",
    six_months: "/6 months",
    one_year: "/year"
  },
  es: {
    three_months: "/3 meses",
    six_months: "/6 meses",
    one_year: "/año"
  },
  de: {
    three_months: "/3 Monate",
    six_months: "/6 Monate",
    one_year: "/Jahr"
  },
  fr: {
    three_months: "/3 mois",
    six_months: "/6 mois",
    one_year: "/an"
  },
  it: {
    three_months: "/3 mesi",
    six_months: "/6 mesi",
    one_year: "/anno"
  },
  tr: {
    three_months: "/3 ay",
    six_months: "/6 ay",
    one_year: "/yıl"
  },
  pt: {
    three_months: "/3 meses",
    six_months: "/6 meses",
    one_year: "/ano"
  },
  ru: {
    three_months: "/3 месяца",
    six_months: "/6 месяцев",
    one_year: "/год"
  },
  zh: {
    three_months: "/3个月",
    six_months: "/6个月",
    one_year: "/年"
  },
  ja: {
    three_months: "/3ヶ月",
    six_months: "/6ヶ月",
    one_year: "/年"
  },
  ar: {
    three_months: "/3 أشهر",
    six_months: "/6 أشهر",
    one_year: "/سنة"
  },
  hi: {
    three_months: "/3 महीने",
    six_months: "/6 महीने",
    one_year: "/साल"
  },
  el: {
    three_months: "/3 Μήνες",
    six_months: "/6 Μήνες",
    one_year: "/χρόνος"
  }
};

// Traducciones para los botones de suscripción
const subscriptionButtonTranslations = {
  en: {
    select_plan: "Select Plan",
    choose_best_option: "Choose Best Option"
  },
  es: {
    select_plan: "Seleccionar Plan",
    choose_best_option: "Elegir Mejor Opción"
  },
  de: {
    select_plan: "Plan Wählen",
    choose_best_option: "Beste Option Wählen"
  },
  fr: {
    select_plan: "Sélectionner le Plan",
    choose_best_option: "Choisir la Meilleure Option"
  },
  it: {
    select_plan: "Seleziona Piano",
    choose_best_option: "Scegli l'Opzione Migliore"
  },
  tr: {
    select_plan: "Plan Seç",
    choose_best_option: "En İyi Seçeneği Seç"
  },
  pt: {
    select_plan: "Selecionar Plano",
    choose_best_option: "Escolher Melhor Opção"
  },
  ru: {
    select_plan: "Выбрать План",
    choose_best_option: "Выбрать Лучший Вариант"
  },
  zh: {
    select_plan: "选择计划",
    choose_best_option: "选择最佳方案"
  },
  ja: {
    select_plan: "プランを選択",
    choose_best_option: "ベストオプションを選択"
  },
  ar: {
    select_plan: "اختر الخطة",
    choose_best_option: "اختر أفضل خيار"
  },
  hi: {
    select_plan: "प्लान चुनें",
    choose_best_option: "सबसे अच्छा विकल्प चुनें"
  },
  el: {
    select_plan: "Επιλογή Σχεδίου",
    choose_best_option: "Επιλογή Καλύτερης Επιλογής"
  }
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
    backgroundColor:  'rgba(237, 237, 237, 1)',
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
    fontSize: isTablet ? 31 : isSmallIPhone ? 21 : 26,
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
    borderColor: 'rgba(158, 50, 201, 0.54)',
  },

  restoreButtonText: {
    color: '#8659b6ff',
    fontSize: isTablet ? 16 : isSmallIPhone ? 12 : 14,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  androidBanner: {
    backgroundColor: 'rgba(155, 89, 182, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(155, 89, 182, 0.3)',
    borderRadius: 20,
    padding: isTablet ? 30 : 25,
    marginBottom: 25,
    alignItems: 'center',
    shadowColor: '#9b59b6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  androidBannerIcon: {
    marginBottom: 15,
  },

  androidBannerTitle: {
    color: '#9b59b6',
    fontSize: isTablet ? 24 : isSmallIPhone ? 18 : 20,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },

  androidBannerText: {
    color: theme?.text || '#666',
    fontSize: isTablet ? 16 : isSmallIPhone ? 13 : 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: isTablet ? 24 : 20,
    opacity: 0.8,
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

  // Estilos para múltiples suscripciones (adaptados del ejemplo)
  packagesContainer: {
    width: '100%',
    marginBottom: 20,
  },

  horizontalScrollContainer: {
    marginVertical: 16,
  },

  horizontalScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },

  packageCardHorizontal: {
    width: isTablet ? 320 : screenWidth * 0.72,
    maxWidth: isTablet ? 340 : undefined,
    marginRight: isTablet ? 24 : 16,
    borderRadius: isTablet ? 24 : 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },

  packageCardBest: {
    width: isTablet ? 340 : screenWidth * 0.78,
    maxWidth: isTablet ? 360 : undefined,
    marginRight: isTablet ? 24 : 16,
    borderRadius: isTablet ? 26 : 32,
    overflow: 'hidden',
    transform: [{ scale: 1 }],
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 16,
  },

  bestOptionShadow: {
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 32,
    elevation: 20,
  },

  packageCardInnerHorizontal: {
    flex: 1,
    padding: isTablet ? 28 : 24,
    alignItems: 'center',
    borderRadius: isTablet ? 24 : 28,
    minHeight: isTablet ? 280 : undefined,
  },

  packageGradientHorizontal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 28,
  },

  typeBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  typeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  packageTitleHorizontal: {
    fontSize: isTablet ? 28 : 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: isTablet ? 10 : 6,
    letterSpacing: -0.5,
  },

  packagePriceContainerHorizontal: {
    alignItems: 'center',
    marginBottom: isTablet ? 30 : 24,
  },

  packagePriceHorizontal: {
    fontSize: isTablet ? 40 : 32,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -1,
  },

  packagePricePerMonth: {
    fontSize: isTablet ? 16 : 13,
    marginTop: isTablet ? 4 : 2,
    opacity: 0.7,
  },

  subscribeButtonContainerHorizontal: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },

  subscribeButtonGradientHorizontal: {
    paddingVertical: isTablet ? 20 : 16,
    paddingHorizontal: isTablet ? 32 : 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: isTablet ? 60 : 52,
  },

  subscribeButtonTextHorizontal: {
    color: '#fff',
    fontSize: isTablet ? 18 : 16,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});

export default function Suscribe() {
  const { theme } = useTheme();
  const styles = getResponsiveStyles(theme);
  
  const [offerings, setOfferings] = useState(null);
  const [allOfferings, setAllOfferings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [loadingPackageId, setLoadingPackageId] = useState(null);
  const [isRestoring, setIsRestoring] = useState(false);
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
        try {
          const purchaserInfo = await Purchases.getCustomerInfo();
          // Verificar cualquiera de las nuevas suscripciones
          if (purchaserInfo && (purchaserInfo.entitlements.active['premium'] ||
                              purchaserInfo.entitlements.active['12981'] ||
                              Object.keys(purchaserInfo.activeSubscriptions || {}).length > 0)) {
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
      // Timeout para Android si no hay offerings configuradas
      const timeout = setTimeout(() => {
        if (Platform.OS === 'android') {
          console.log('⏱️ Timeout: No se encontraron offerings para Android');
          setIsLoading(false);
        }
      }, 8000); // 8 segundos timeout

      try {
        const purchaserInfo = await Purchases.getCustomerInfo();
        // Verificar cualquiera de las nuevas suscripciones
        if (purchaserInfo && (purchaserInfo.entitlements.active['premium'] ||
                            purchaserInfo.entitlements.active['12981'] ||
                            Object.keys(purchaserInfo.activeSubscriptions || {}).length > 0)) {
          console.log('Usuario ya suscrito');
          setIsSubscribed(true);
          // No cerrar automáticamente, mostrar estado premium
        }
      } catch (error) {
        console.log('Error al obtener la información del comprador:', error);
      }

      try {
        const response = await Purchases.getOfferings();
        console.log('📦 Todas las Offerings disponibles:', response);

        // Configurar offering actual
        setOfferings(response.current);

        // Configurar todas las offerings para mostrar múltiples opciones
        const allOfferingsData = {};
        if (response.all && Object.keys(response.all).length > 0) {
          Object.entries(response.all).forEach(([key, offering]) => {
            allOfferingsData[key] = offering;
          });
          setAllOfferings(allOfferingsData);
          console.log('✅ AllOfferings configuradas:', allOfferingsData);
        } else if (response.current) {
          // Fallback si no hay múltiples offerings
          allOfferingsData['default'] = response.current;
          setAllOfferings(allOfferingsData);
        }

        clearTimeout(timeout);
      } catch (error) {
        console.log('Error al obtener ofertas:', error);
        clearTimeout(timeout);
      } finally {
        setIsLoading(false);
      }
    };

    initializePurchases();
  }, []);

  const purchaseSubscription = async (pkg) => {
    console.log('🛍️ Iniciando compra del paquete:', pkg.product.identifier);
    animateButtonPress();
    setIsSubscribing(true);
    setLoadingPackageId(pkg.product.identifier);

    try {
      const purchaseMade = await Purchases.purchasePackage(pkg);
      console.log('📦 Resultado de compra:', purchaseMade);

      // Verificar cualquier entitlement activo o suscripción
      const hasActiveSubscription = purchaseMade?.customerInfo?.entitlements?.active?.['premium'] ||
                                   purchaseMade?.customerInfo?.entitlements?.active?.['12981'] ||
                                   Object.keys(purchaseMade?.customerInfo?.activeSubscriptions || {}).length > 0;

      if (hasActiveSubscription) {
        console.log('✅ Compra exitosa, suscripción activa');
        Alert.alert(
          alertTexts.success,
          alertTexts.purchaseComplete,
          [{
            text: alertTexts.ok,
            onPress: () => {
              setIsSubscribed(true);
              // Reiniciar para actualizar el estado en toda la app
              setTimeout(() => {
                RNRestart.Restart();
              }, 1000);
            }
          }]
        );
      }
    } catch (error) {
      console.log('❌ Error en la compra:', error);
      if (error.code !== 'PURCHASES_ERROR_PURCHASE_CANCELLED') {
        Alert.alert(
          alertTexts.error,
          alertTexts.errorOccurred
        );
      }
    } finally {
      setIsSubscribing(false);
      setLoadingPackageId(null);
    }
  };

  const restorePurchases = async () => {
    if (isSubscribed) {
      RNRestart.Restart();
    } else {
      setIsRestoring(true);

      try {
        const restoredPurchases = await Purchases.restorePurchases();
        console.log('Restored Purchases:', restoredPurchases);

        // Verificar cualquier entitlement activo o suscripción
        const hasActiveSubscription = restoredPurchases?.entitlements?.active?.['premium'] ||
                                     restoredPurchases?.entitlements?.active?.['12981'] ||
                                     Object.keys(restoredPurchases?.activeSubscriptions || {}).length > 0;

        if (hasActiveSubscription) {
          console.log('✅ Restauración exitosa');

          Alert.alert(
            alertTexts.success,
            `${alertTexts.purchaseRestored}`,
            [{
              text: alertTexts.ok,
              onPress: () => {
                setIsSubscribed(true);
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
        setIsRestoring(false);
      }
    }
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
        <Text style={[styles.priceText, { marginTop: 20 }]}>
          {Platform.OS === 'android' ? 'Cargando suscripciones...' : 'Loading...'}
        </Text>
        {Platform.OS === 'android' && (
          <TouchableOpacity
            style={{ marginTop: 30, padding: 15, backgroundColor: '#9b59b6', borderRadius: 10 }}
            onPress={() => {
              Alert.alert(
                'Suscripciones no disponibles',
                'Las suscripciones para Android aún no están configuradas. Por favor, contacta con soporte.',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              );
            }}
          >
            <Text style={{ color: 'white', fontSize: 16 }}>Volver</Text>
          </TouchableOpacity>
        )}
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
          
          <Text style={[styles.titleText, isSmallIPhone && {fontSize: 21}]}>Unlock Full Potentia!</Text>
          
      
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
                <Text style={{color: 'white', fontSize: 12, fontWeight: 'bold'}}>✓</Text>
              </View>

              {/* Icono premium principal */}
              <View style={{ marginBottom: 12 }}>
                <Text style={{fontSize: 32, color: '#2ed573'}}>💎</Text>
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
                  <Text style={{color: '#2ed573', fontSize: 18, marginRight: 12}}>∞</Text>
                  <Text style={styles.premiumFeatureText}>Unlimited voice recordings</Text>
                </View>
                <View style={styles.premiumFeatureRow}>
                  <Text style={{color: '#00cec9', fontSize: 18, marginRight: 12}}>👁</Text>
                  <Text style={styles.premiumFeatureText}>AI Image Analysis</Text>
                </View>
                <View style={styles.premiumFeatureRow}>
                  <Text style={{color: '#fd79a8', fontSize: 18, marginRight: 12}}>🧮</Text>
                  <Text style={styles.premiumFeatureText}>Price Estimation</Text>
                </View>
                <View style={styles.premiumFeatureRow}>
                  <Text style={{color: '#fdcb6e', fontSize: 18, marginRight: 12}}>🍽</Text>
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
                  <Text style={{fontSize: 20, color: 'white', marginRight: 8}}>→</Text>
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
            // Sección de múltiples suscripciones
            <View style={styles.packagesContainer}>
              {allOfferings && Object.keys(allOfferings).length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalScrollContent}
                  style={styles.horizontalScrollContainer}
                >
                  {Object.entries(allOfferings)
                    .sort(([, offeringA], [, offeringB]) => {
                      // Ordenar por precio: más barato primero
                      const priceA = offeringA.availablePackages[0]?.product?.price || 0;
                      const priceB = offeringB.availablePackages[0]?.product?.price || 0;
                      return priceA - priceB;
                    })
                    .map(([offeringKey, offering], offeringIndex) =>
                      offering.availablePackages.map((pkg, packageIndex) => {
                        // Crear un índice global único para todos los paquetes
                        let globalIndex = 0;
                        Object.entries(allOfferings).forEach(([key, off], idx) => {
                          if (idx < offeringIndex) {
                            globalIndex += off.availablePackages.length;
                          }
                        });
                        globalIndex += packageIndex;
                        // Validar el paquete
                        if (!pkg?.product?.identifier) {
                          console.warn('⚠️ Paquete sin identificador:', pkg);
                          return null;
                        }

                        // Log para diagnosticar
                        console.log('🔍 Producto:', pkg.product.identifier, 'PackageType:', pkg.packageType);

                        // Determinar el diseño según el packageType o identificador del producto
                        let iconColor = "#6366f1";
                        let duration = '';
                        let isBestOption = false;
                        let cardStyle = styles.packageCardHorizontal;
                        let badgeText = '';
                        let periodText = '';

                        // Identificar el producto por su packageType o identifier
                        if (pkg.packageType === 'MONTHLY' || pkg.product.identifier === '12981') {
                          // 1 Mes
                          iconColor = "#10b981";
                          duration = systemLanguage === 'es' ? '1 Mes' : '1 Month';
                          badgeText = systemLanguage === 'es' ? 'Básico' : 'Basic';
                          periodText = systemLanguage === 'es' ? '/mes' : '/month';
                        } else if (pkg.packageType === 'SIX_MONTH' || pkg.product.identifier === '06mes') {
                          // 6 Meses
                          iconColor = "#6366f1";
                          duration = systemLanguage === 'es' ? '6 Meses' : '6 Months';
                          badgeText = systemLanguage === 'es' ? 'Popular' : 'Popular';
                          periodText = systemLanguage === 'es' ? '/6 meses' : '/6 months';
                        } else if (pkg.packageType === 'ANNUAL' || pkg.product.identifier === 'year') {
                          // 1 Año (Best Value)
                          iconColor = "#ef7744ff";
                          duration = systemLanguage === 'es' ? '1 Año' : '1 Year';
                          isBestOption = true;
                          cardStyle = styles.packageCardBest;
                          badgeText = systemLanguage === 'es' ? 'Mejor Valor' : 'Best Value';
                          periodText = systemLanguage === 'es' ? '/año' : '/year';
                        } else {
                          // Fallback para productos no identificados
                          duration = systemLanguage === 'es' ? '1 Mes' : '1 Month';
                          badgeText = systemLanguage === 'es' ? 'Básico' : 'Basic';
                          periodText = systemLanguage === 'es' ? '/mes' : '/month';
                        }

                        // Log para verificar la asignación
                        console.log('🏷️ Asignado:', duration, 'para', pkg.product.identifier);

                        const uniqueKey = `${offeringKey}_${pkg.product.identifier}_${globalIndex}`;

                        return (
                          <TouchableOpacity
                            key={uniqueKey}
                            style={[cardStyle, isBestOption && styles.bestOptionShadow]}
                            onPress={() => purchaseSubscription(pkg)}
                            disabled={loadingPackageId !== null}
                            activeOpacity={0.8}
                          >
                            <View style={[styles.packageCardInnerHorizontal, {backgroundColor: 'rgba(255,255,255,0.05)', borderColor: iconColor + '30', borderWidth: 1}]}>
                              <View style={[styles.packageGradientHorizontal, { backgroundColor: iconColor + '10' }]} />

                              {/* Badge de tipo */}
                              <View style={[styles.typeBadge, { backgroundColor: iconColor + '20' }]}>
                                <Text style={[styles.typeBadgeText, { color: iconColor }]}>{badgeText}</Text>
                              </View>

                              <Text style={[styles.packageTitleHorizontal, { color: theme?.text || '#2c3e50', marginTop: 16 }]}>
                                {duration}
                              </Text>


                              <View style={styles.packagePriceContainerHorizontal}>
                                <Text style={[styles.packagePriceHorizontal, { color: theme?.isDark ? '#FFFFFF' : '#2c3e50' }]}>{pkg.product.priceString}</Text>
                                <Text style={[styles.packagePricePerMonth, { color: theme?.isDark ? '#CCCCCC' : '#666666' }]}>
                                  {periodText}
                                </Text>
                              </View>

                              <View style={styles.subscribeButtonContainerHorizontal}>
                                <View
                                  style={[styles.subscribeButtonGradientHorizontal, { backgroundColor: iconColor }]}
                                >
                                  {loadingPackageId === pkg.product.identifier ? (
                                    <ActivityIndicator size="small" color="white" />
                                  ) : (
                                    <Text style={styles.subscribeButtonTextHorizontal}>
                                      {isBestOption ?
                                        (subscriptionButtonTranslations[systemLanguage]?.choose_best_option || subscriptionButtonTranslations['en'].choose_best_option) :
                                        (subscriptionButtonTranslations[systemLanguage]?.select_plan || subscriptionButtonTranslations['en'].select_plan)
                                      }
                                    </Text>
                                  )}
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                        );
                      })
                    )
                  }
                </ScrollView>
              ) : (
                // Fallback si no hay múltiples ofertas, mostrar la oferta actual
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
            </View>
          )}

          {/* Banner para Android cuando no hay offerings */}
          {Platform.OS === 'android' && !offerings && !allOfferings && (
            <View style={styles.androidBanner}>
              <View style={styles.androidBannerIcon}>
                <Text style={{ fontSize: 40 }}>🚀</Text>
              </View>
              <Text style={styles.androidBannerTitle}>
                {comingSoonTitleTranslations[systemLanguage] || comingSoonTitleTranslations['en']}
              </Text>
              <Text style={styles.androidBannerText}>
                {comingSoonMessageTranslations[systemLanguage] || comingSoonMessageTranslations['en']}
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={restorePurchases}
            style={styles.restoreButton}
            activeOpacity={0.7}
            disabled={isRestoring}
          >
            {isRestoring ? (
              <ActivityIndicator size="small" color="#8659b6ff" />
            ) : (
              <Text style={styles.restoreButtonText}>
                {isSubscribed
                  ? (accessButtonTextTranslations[systemLanguage] || accessButtonTextTranslations['en'])
                  : (restoreButtonTextTranslations[systemLanguage] || restoreButtonTextTranslations['en'])
                }
              </Text>
            )}
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
