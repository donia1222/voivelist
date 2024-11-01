
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, Image, StyleSheet, Modal,ScrollView, Linking ,Easing, Animated, ImageBackground, Dimensions,ActivityIndicator,Platform} from 'react-native';
import * as RNLocalize from "react-native-localize";
import RNRestart from 'react-native-restart';
import PrivacyModal from './links/PrivacyModal';
import EULAModal from './links/EulaModal';
import GDPRModal from './links/GDPRModal';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import TypingText from './components/TypingText'; // Asegúrate de que la ruta sea correcta
import Purchases from 'react-native-purchases';
import Carousel from './components/Carousel'; // Adjust the path as necessary
import TextoAnimado from './components/TextoAnimadoSuscribese'; // Asegúrate de que la ruta sea correcta
import getStyles from './Styles/StylesSuscribe'; // Importa la función de estilos dinámicos
import { useTheme } from '../ThemeContext'; 
const screenWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const restoreButtonTextTranslations = {
  en: "Restore Purchase",
  es: "Restaurar Compra",
  de: "Kauf wiederherstellen",
  fr: "Restaurer l'achat",
  it: "Ripristina acquisto",
  tr: "Satın Alma İşlemini Geri Yükle",
  pt: "Restaurar Compra", // Traducción en portugués añadida
  ru: "Восстановить покупку", // Traducción en ruso añadida
  zh: "恢复购买", // Traducción en chino añadida
  ja: "購入を復元する" ,
  sv: "Återställ köp",       // Sueco
  hu: "Vásárlás visszaállítása", // Húngaro
  ar: "استعادة الشراء",      // Árabe
  hi: "खरीद बहाल करें",     // Hindú
  el: "Επαναφορά αγοράς"     // Griego en japonés añadida
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
  // Añade más idiomas según sea necesario
};

const benefitTitleTranslations = {
  en: [
    { title: "✔️ Analyze images with GPT4 VISION", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
    { title: "✔️ Generate images with DALLE-3", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
    { title: "✔️ Get Recipes with GPT4", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
  ],
  es: [
    { title: "✔️ Analiza imágenes con GPT4 VISION", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
    { title: "✔️ Genera imágenes con DALLE-3", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
    { title: "✔️ Obtiene Recetas con GPT4", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
  ],
  de: [
    { title: "✔️ Bilder unbegrenzt analysieren mit GPT4 VISION", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
    { title: "✔️ Bilder generieren mit DALLE-3", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
    { title: "✔️ Erhalten Rezepte mit GPT4", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
  ],
  fr: [
    { title: "✔️ Analysez les images avec GPT4 VISION", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
    { title: "✔️ Générez des images avec DALLE-3", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
    { title: "✔️ Obtenez des recettes avec GPT4", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
  ],  
  
it: [
  { title: "✔️ Analizza immagini illimitatamente", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
  { title: "✔️ Genera ricette con immagini", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
  { title: "✔️ Ottieni ricette con GPT4", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
],

tr: [
  { title: "✔️ Sınırsız şekilde resim analizi yapın", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
  { title: "✔️ Resimlerle tarifler oluşturun", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
  { title: "✔️ GPT4 ile anında tarifler edinin", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
],

pt: [
  { title: "✔️ Analise imagens ilimitadamente", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
  { title: "✔️ Gere receitas com imagens", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
  { title: "✔️ Obtenha receitas com GPT4", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
],
ru: [
  { title: "✔️ Анализируйте изображения неограниченно", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
  { title: "✔️ Генерируйте рецепты с изображениями", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
  { title: "✔️ Получайте рецепты моментально с помощью GPT4", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
],
zh: [
  { title: "✔️ 无限制地分析图像", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
  { title: "✔️ 使用图像生成食谱", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
  { title: "✔️ 使用 GPT4 立即获取食谱", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
],

ja: [
  { title: "✔️ 画像を無制限に分析", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
  { title: "✔️ 画像でレシピを生成", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
  { title: "✔️ GPT4 で即座にレシピを取得", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
],

pl: [
  { title: "✔️ Analizuj obrazy nieograniczenie", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
  { title: "✔️ Generuj przepisy z obrazami", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
  { title: "✔️ Natychmiastowo uzyskaj przepisy z GPT4", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
],

sv: [
  { title: "✔️ Analysera bilder obegränsat", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
  { title: "✔️ Generera recept med bilder", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
  { title: "✔️ Få recept omedelbart med GPT4", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
],

hu: [
  { title: "✔️ Korlátlanul elemzi a képeket", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
  { title: "✔️ Képekkel recepteket generál", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
  { title: "✔️ Azonnal kapjon a GPT4 segítségével", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
],

ar: [
  { title: "✔️ قم بتحليل الصور بشكل غير محدود", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
  { title: "✔️ قم بإنشاء وصفات باستخدام الصور", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
  { title: "✔️ احصل على وصفات على الفور باستخدام GPT4", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
],
hi: [
  { title: "✔️ छवियों का अनगिनत विश्लेषण करें", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
  { title: "✔️ छवियों के साथ व्यंजन बनाएँ", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
  { title: "✔️ GPT4 के साथ तत्काल रेसिपी प्राप्त करें", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
],

el: [
  { title: "✔️ Αναλύστε εικόνες απεριόριστα", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
  { title: "✔️ Δημιουργήστε συνταγές με εικόνες", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
  { title: "✔️ Λάβετε συνταγές αμέσως με το GPT4", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
],


};

const subscribedTextTranslations = {
  en: ["SUBSCRIBED, Press here to enter!"],
  es: ["SUSCRITO, ¡Presiona aquí para entrar!"],
  de: ["ABONNIERT, Hier klicken zum Eintreten!"],
  fr: ["ABONNÉ, Cliquez ici pour entrer!"],
  it: ["ABBONATO, Premi qui per entrare!"],
  tr: ["ABONE, Giriş yapmak için buraya tıklayın!"],
  pt: ["INSCRITO, Clique aqui para entrar!"],
  ru: ["ПОДПИСАН, Нажмите здесь, чтобы войти!"],
  zh: ["已订阅，请点击这里进入！"],
  ja: ["購読済み, 入るためにここを押してください！"],
  pl: ["ZASUBSKRYBOWANY, Kliknij tutaj, aby wejść!"],
  sv: ["PÅSKRIVEN, Klicka här för att gå in!"],
  hu: ["FELIRATKOZVA, Kattints ide a belépéshez!"],
  ar: ["مشترك، اضغط هنا للدخول!"],
  hi: ["सदस्यता ली गई, यहां क्लिक करें और प्रवेश करें!"],
  el: ["ΕΓΓΡΑΦΉ, Πατήστε εδώ για είσοδο!"]
};


const cancelSubscriptionTextTranslations = {
  en: "You can cancel your subscription at any time from your user account in the App Store app.",
  es: "Puedes cancelar tu suscripción en cualquier momento desde tu cuenta de usuario en la aplicación de App Store.",
  de: "Sie können Ihr Abonnement jederzeit von Ihrem Benutzerkonto in der App Store-App kündigen.",
  fr: "Vous pouvez annuler votre abonnement à tout moment depuis votre compte utilisateur dans l'application App Store.",
  it: "Puoi annullare la tua sottoscrizione in qualsiasi momento dal tuo account utente nell'app App Store.",
  tr: "App Store uygulamasındaki kullanıcı hesabınızdan istediğiniz zaman aboneliğinizi iptal edebilirsiniz.",
  pt: "Você pode cancelar sua assinatura a qualquer momento a partir da sua conta de usuário no aplicativo da App Store.",
  ru: "Вы можете отменить подписку в любое время из своей учетной записи пользователя в приложении App Store.",
  zh: "您可以随时从App Store应用中的用户帐户取消订阅。",
  ja: "App Storeアプリ内のユーザーアカウントからいつでもサブスクリプションをキャンセルできます。",
  pl: "Możesz anulować subskrypcję w dowolnym momencie z poziomu swojego konta użytkownika w aplikacji App Store.",
  sv: "Du kan avbryta din prenumeration när som helst från ditt användarkonto i App Store-appen.",
  hu: "Bármikor lemondhatja előfizetését az App Store alkalmazás felhasználói fiókjából.",
  ar: "يمكنك إلغاء اشتراكك في أي وقت من خلال حساب المستخدم الخاص بك في تطبيق App Store.",
  hi: "आप अपने यूज़र अकाउंट से किसी भी समय App Store ऐप में अपनी सदस्यता को रद्द कर सकते हैं।",
  el: "Μπορείτε να ακυρώσετε τη συνδρομή σας ανά πάσα στιγμή από τον λογαριασμό χρήστη σας στην εφαρμογή App Store.",
};

const accessTranslations = {
  en: "Subscribe or restore to access",
  es: "Suscríbete o restaura para acceder",
  de: "Abonnieren oder wiederherstellen, um Zugang zu erhalten",
  fr: "Abonnez-vous ou restaurez pour accéder",
  it: "Iscriviti o ripristina per accedere",
  tr: "Erişmek için abone ol veya geri yükle", // Por favor, verifica esta traducción, ya que fue realizada automáticamente.
  pt: "Assine ou restaure para acessar",
  ru: "Подпишитесь или восстановите для доступа",
  zh: "订阅或恢复以访问",
  ja: "アクセスするには、購読または復元してください",
  pl: "Subskrybuj lub przywróć, aby uzyskać dostęp",
  sv: "Prenumerera eller återställ för att få tillgång",
  hu: "Fizessen elő vagy állítsa vissza a hozzáférést",
  ar: "اشترك أو استعد للوصول",
  hi: "पहुँच पाने के लिए सदस्यता लें या पुनर्स्थापित करें",
  el: "Εγγραφείτε ή επαναφέρετε για πρόσβαση"
};


const subscribeTranslations = {
  en: "SUBSCRIBE",
  es: "SUSCRÍBETE",
  de: "ABONNIEREN ",
  fr: "S'ABONNER",
  it: "ISCRIVITI",
  tr: "ABONE OL",
  pt: "ASSINAR",
  ru: "ПОДПИСАТЬСЯ",
  zh: "订阅",
  ja: "サブスクライブ", 
  pl: "SUBSKRYBUJ",
  sv: "PRENUMERERA",
  hu: "FELIRATKOZÁS",
  ar: "اشترك",
  hi: "सदस्यता लें",
  el: "ΕΓΓΡΑΦΕΙΤΕ"
};

const contentTranslations = {
  en: "Remove ads from the app for",
  es: "Elimina los anuncios de la aplicación por",
  de: "Entfernen Sie die Anzeigen aus der App für",
  fr: "Supprimez les annonces de l'application pour",
  it: "Rimuovi gli annunci dall'app per",
  tr: "Uygulamadan reklamları kaldır",
  pt: "Remova os anúncios do aplicativo por",
  ru: "Удалите рекламу из приложения за",
  zh: "从应用程序中删除广告",
  ja: "アプリから広告を削除する",
  pl: "Usuń reklamy z aplikacji za",
  sv: "Ta bort annonser från appen för",
  hu: "Távolítsa el a hirdetéseket az alkalmazásból",
  ar: "إزالة الإعلانات من التطبيق مقابل",
  hi: "एप्लिकेशन से विज्ञापन हटाएं",
  el: "Αφαιρέστε τις διαφημίσεις από την εφαρμογή για"
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
  CHF: 'CHF' // Símbolo para el franco suizo
};

const basePriceUSD = 3.00;
const conversionRates = {
  USD: 1,
  EUR: 1,
  TRY: 1,
  RUB: 1,    
  CNY: 1,   
  JPY: 1,    
  PLN: 1,    
  SEK: 1,    
  HUF: 1,    
  AED: 1,   
  INR: 1,   
  CHF: 1  // Actualización del valor del franco suizo
};
const monthTranslations = {
  en: "month Auto-renewable, cancel anytime. ",
  es: "mes Auto-renovable, cancela en cualquier momento. ",
  de: "Monat automatisch erneuerbar, jederzeit kündbar. ",
  fr: "mois renouvellement automatique, annulez à tout moment. ",
  it: "mese rinnovabile automaticamente, cancella in qualsiasi momento. ",
  tr: "ay otomatik yenilenebilir, istediğiniz zaman iptal edin. ",
  pt: "mês renovação automática, cancele a qualquer momento. ",
  ru: "месяц автоматического продления, отмена в любое время. ",
  zh: "月 自动续订, 随时取消. ",
  ja: "月 自動更新, いつでもキャンセル可能. ",
  pl: "miesiąc z automatycznym odnawianiem, anuluj w dowolnym momencie. ",
  sv: "månad med automatisk förnyelse, avbryt när som helst. ",
  hu: "hónap automatikus megújulással, bármikor lemondható. ",
  ar: "شهر تجديد تلقائي, الإلغاء في أي وقت" ,
  hi: "महीना स्वचालित नवीनीकरण, किसी भी समय रद्द करें ",
  el: "Μήνας με αυτόματη ανανέωση, ακύρωση ανά πάσα στιγμή. "
};


const loadingMessages = {
  initial: {
    en: "Loading...",
    es: "Cargando...",
    de: "Laden...",
    fr: "Chargement...",
    it: "Caricamento...",
    tr: "Yükleniyor...",
    pt: "Carregando...",
    ru: "Загрузка...",
    zh: "加载中...",
    ja: "読み込み中...",
    pl: 'Ładowanie...',
    sv: 'Laddar...',
    hu: 'Betöltés...',
    ar: 'جار التحميل...',
    hi: 'लोड हो रहा है...',
    el: 'Φόρτωση...'
  },
  connecting: {
    en: "This might take a moment",
    es: "Esto puede tardar un momento",
    de: "Dies könnte einen Moment dauern",
    fr: "Cela pourrait prendre un moment",
    it: "Questo potrebbe richiedere un momento",
    tr: "Bu biraz zaman alabilir",
    pt: "Isso pode levar um momento",
    ru: "Это может занять некоторое время",
    zh: "这可能需要一点时间",
    ja: "これには少し時間がかかるかもしれません",
    pl: 'To może chwilę zająć',
    sv: 'Detta kan ta ett ögonblick',
    hu: 'Ez egy pillanatig tarthat',
    ar: 'قد يستغرق هذا برهة',
    hi: 'इसमें एक पल का समय लग सकता है',
    el: 'Αυτό μπορεί να πάρει λίγο χρόνο'
  },
  dontClose: {  // Nueva clave añadida
    en: "Please do not close the app",
    es: "Por favor no cierres la aplicación",
    de: "Bitte schließen Sie die App nicht",
    fr: "Veuillez ne pas fermer l'application",
    it: "Per favore non chiudere l'app",
    tr: "Lütfen uygulamayı kapatmayın",
    pt: "Por favor, não feche o aplicativo",
    ru: "Пожалуйста, не закрывайте приложение",
    zh: "请不要关闭应用程序",
    ja: "アプリを閉じないでください",
    pl: 'Proszę nie zamykać aplikacji',
    sv: 'Vänligen stäng inte appen',
    hu: 'Kérjük, ne zárja be az alkalmazást',
    ar: 'يرجى عدم إغلاق التطبيق',
    hi: 'कृपया ऐप को न बंद करें',
    el: 'Παρακαλώ μην κλείσετε την εφαρμογή'
  }
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



export default function Suscribe({ onClose,  }) { 
  const { theme } = useTheme(); // Usa el contexto del tema
  const styles = getStyles(theme); // Obtén los estilos basados en el tema

  const [offerings, setOfferings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const systemLanguage = RNLocalize.getLocales()[0]?.languageCode || 'en';
  const [isPrivacyModalVisible, setIsPrivacyModalVisible] = useState(false);
  const [isEULAModalVisible, setIsEULAModalVisible] = useState(false);
  const [isGDPRModalVisible, setIsGDPRModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSubscriptionBenefitModalVisible, setIsSubscriptionBenefitModalVisible] = useState(false);
  const [isSupportModalVisible, setIsSupportModalVisible] = useState(false);
  const [currencyCode, setCurrencyCode] = useState(null);
  const supportModalMessage = supportModalMessages[systemLanguage] || supportModalMessages['en']; 
  const benefitTitles = benefitTitleTranslations[systemLanguage] || benefitTitleTranslations['en'];
  const subscribedText = subscribedTextTranslations[systemLanguage] || subscribedTextTranslations['en'];
  const cancelSubscriptionText = cancelSubscriptionTextTranslations[systemLanguage] || cancelSubscriptionTextTranslations['en'];
  const accessMessage = accessTranslations[systemLanguage] || accessTranslations['en']; 
  const [isSubscribed, setIsSubscribed] = useState(false);

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
      return `${currencySymbols['USD']}${basePriceUSD}/${monthTranslations['en']}`;  // Devuelve el precio en dólares si no hay información de conversión.
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

  const handleSupportPress = async () => {
    try {
        const restoredPurchases = await Purchases.restorePurchases();
        
        if (restoredPurchases && restoredPurchases.entitlements.active['semana16']) {
            const startDate = new Date(restoredPurchases.allPurchaseDates['semana16']).toLocaleDateString();
            const expirationDate = new Date(restoredPurchases.allExpirationDates['semana16']).toLocaleDateString();
            const userId = restoredPurchases.originalAppUserId;
            
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
        } else {
            setIsSupportModalVisible(true);
            setTimeout(() => {
                setIsSupportModalVisible(false);
            }, 2000); // Close the modal after 2 seconds
        }
    } catch (error) {
        console.log('Error:', error);
    }
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

  const handleContactPress = async () => {
    // Obtener el modelo del dispositivo
    const deviceModel = DeviceInfo.getModel();

    // Obtener la versión del sistema operativo
    const systemVersion = DeviceInfo.getSystemVersion();

    // Create the email body
    const emailBody = `Device Information:
Device Model: ${deviceModel}
iOS Version: ${systemVersion}`;

    // Crear el URL para abrir el correo
    const mailtoURL = `mailto:info@lweb.ch?body=${encodeURIComponent(emailBody)}`;

    // Intentar abrir la aplicación de correo
    Linking.openURL(mailtoURL).catch(err => console.error('Failed to open mail app:', err));
  };

  const SubscriptionBenefit = ({ benefit }) => {
    const showModal = (message) => {
      setModalMessage(message);
      setIsSubscriptionBenefitModalVisible(true);
      setTimeout(() => {
        setIsSubscriptionBenefitModalVisible(false);
      }, 1000); 
    };
    return (
      <TouchableOpacity onPress={() => showModal(accessMessage)}> 
        <View style={styles.benefitContainer}>
          <Text style={styles.benefitTitle}>{benefit.title}</Text>
          <Image 
            source={{ uri: benefit.imageUrl }} 
            style={styles.benefitImage} 
          />
        </View>
      </TouchableOpacity>
    );
  };

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
    setIsSubscribing(true); // Comienza el proceso de suscripción
    try {
      const purchaseMade = await Purchases.purchasePackage(pkg);
      if (purchaseMade && purchaseMade.customerInfo.entitlements.active['12981']) {
        console.log('Successful purchase');
        handleClose();
      }
    } catch (error) {
      console.log('Error making purchase:', error);
    } finally {
      setIsSubscribing(false); // Termina el proceso de suscripción
    }
  };

  const restorePurchases = async () => {
    if (isSubscribed) {
      // Si el usuario ya está suscrito, simplemente reinicia la app
      RNRestart.Restart();
    } else {
      // Si el usuario no está suscrito, procede con la restauración
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
                RNRestart.Restart(); // Esto reiniciará la app
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

  const scale = useRef(new Animated.Value(1)).current;  // Animación para escalar la imagen
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;  // Animación para mover la imagen

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.25,
            duration: 10000,
            useNativeDriver: true,
          }),
          Animated.timing(position, {
            toValue: { x: -50, y: -30 },
            duration: 10000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1,
            duration: 10000,
            useNativeDriver: true,
          }),
          Animated.timing(position, {
            toValue: { x: 0, y: 0 },
            duration: 10000,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  }, [scale, position]);

  const [messageKey, setMessageKey] = useState('initial');
  const spinValue = new Animated.Value(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    Animated.loop(
      Animated.timing(
        spinValue,
        {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true
        }
      )
    ).start();

    if (isLoading || isSubscribing) {
      if (!intervalId) {
        const id = setInterval(() => {
          setMessageKey(prev => {
            switch (prev) {
              case 'initial': return 'connecting';
              case 'connecting': return 'dontClose';
              default: return prev; // No cambies el valor si no estás en 'initial' o 'connecting'
            }
          });
        }, 6000);
        setIntervalId(id);
      }
    } else {
      setMessageKey('initial');
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }

  }, [isLoading, isSubscribing]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const message = loadingMessages[messageKey][systemLanguage] || loadingMessages[messageKey]['en'];

  const handleClose = () => {
    RNRestart.Restart(); // Esto reiniciará la app
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity
        onPress={handleClose}
        style={{
          position: 'absolute',
          top: -20,
          right: 10,
          zIndex: 1,
        }} 
      >
      </TouchableOpacity>

      <View style={styles.overlay} />


      <Image source={require('../assets/images/prima.png')} style={styles.bouncingImage} />
      {screenWidth > 380 && ( 
      <Carousel />
      )}

      <Text style={{...styles.priceText, textAlign: 'center'}}>
          {`${contentTranslations[systemLanguage] || contentTranslations['en']} ${getPriceForCurrency(currencyCode)}`}
        </Text>



      <View style={styles.contentContainer}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isSubscriptionBenefitModalVisible}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalMessage}</Text>
          </View>
        </Modal>

        <Modal 
          animationType="fade" 
          transparent={true} 
          visible={isSupportModalVisible} 
          onRequestClose={() => setIsSupportModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{supportModalMessage}</Text>
            </View>
          </View>
        </Modal>
        {
  isSubscribed ? (
    <View style={styles.subscribedContainer}>
      <Text style={styles.subscribedText}>
        {subscribedText}
      </Text>
    </View>
  ) : (
    offerings && offerings.availablePackages.map((pkg, index) => (
      <TouchableOpacity 
        key={index} 
        onPress={() => purchaseSubscription(pkg)} 
        disabled={isSubscribing} 
        style={isSubscribing ? styles.buttonDisabled : styles.button}
      >
        {isSubscribing ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color='#009688' /> 
          </View>
        ) : (
          <TextoAnimado />
        )}
      </TouchableOpacity>
    ))
  )
}
        <TouchableOpacity onPress={restorePurchases} style={styles.restoreButton}>
          <TypingText 
            text={isSubscribed ? accessButtonTextTranslations[systemLanguage] || accessButtonTextTranslations['en'] :
                  (isSubscribing ? 'Synchronizing...' : restoreButtonTextTranslations[systemLanguage] || restoreButtonTextTranslations['en'])} 
            style={styles.restoreButtonText} 
          />
        </TouchableOpacity>

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
          {isSubscribed ? (
            <TouchableOpacity onPress={handleSupportPress} style={styles.linkButton}>
              <Text style={styles.linkText}>Support</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleContactPress} style={styles.linkButton}>
              <Text style={styles.linkText}>Contact</Text>
            </TouchableOpacity>
          )}
        </View>

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
 </View>
    </View>
  );
}
