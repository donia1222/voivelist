import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, FlatList, Platform, Alert, Animated, Modal, TextInput, Image, Share,Button, ActivityIndicator,Dimensions,ScrollView, Linking} from 'react-native';
import Voice from '@react-native-community/voice';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import { useNavigation, useRoute } from '@react-navigation/native';
import Purchases from 'react-native-purchases';
import { Modalize } from 'react-native-modalize';
import prompts from './translations/prompts'; // Importa los prompts
import { useTheme } from '../ThemeContext'; // Importa el hook useTheme
import getStyles from './Styles/HomeScreenStyles';
import texts from './translations/texts'; // Importa los textos traducidos
import Sound from 'react-native-sound';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RateAppModal from './RateAppModal'; 
Sound.setCategory('Playback');
const screenHeight = Dimensions.get('window').height;
const API_KEY_ANALIZE = process.env.API_KEY_ANALIZE;

const API_KEY_CHAT = process.env.API_KEY_CHAT;

const screenWidth = Dimensions.get('window').width;


const modalTexts = {
  en: {
    title: "Select or take a photo",
    gallery: "Select from gallery",
    takePhoto: "Take a photo",
    cancel: "Cancel"
  },
  de: {
    title: "Foto auswählen oder machen",
    gallery: "Aus der Galerie auswählen",
    takePhoto: "Ein Foto machen",
    cancel: "Abbrechen"
  },
  es: {
    title: "Seleccionar o tomar una foto",
    gallery: "Seleccionar de la galería",
    takePhoto: "Tomar una foto",
    cancel: "Cancelar"
  },
  it: {
    title: "Seleziona o scatta una foto",
    gallery: "Seleziona dalla galleria",
    takePhoto: "Scatta una foto",
    cancel: "Annulla"
  },
  fr: {
    title: "Sélectionner ou prendre une photo",
    gallery: "Sélectionner dans la galerie",
    takePhoto: "Prendre une photo",
    cancel: "Annuler"
  },
  pt: {
    title: "Selecionar ou tirar uma foto",
    gallery: "Selecionar da galeria",
    takePhoto: "Tirar uma foto",
    cancel: "Cancelar"
  },
  nl: {
    title: "Selecteer of maak een foto",
    gallery: "Selecteer uit galerij",
    takePhoto: "Maak een foto",
    cancel: "Annuleren"
  },
  sv: {
    title: "Välj eller ta ett foto",
    gallery: "Välj från galleriet",
    takePhoto: "Ta ett foto",
    cancel: "Avbryt"
  },
  da: {
    title: "Vælg eller tag et foto",
    gallery: "Vælg fra galleriet",
    takePhoto: "Tag et foto",
    cancel: "Annuller"
  },
  fi: {
    title: "Valitse tai ota kuva",
    gallery: "Valitse galleriasta",
    takePhoto: "Ota kuva",
    cancel: "Peruuta"
  },
  no: {
    title: "Velg eller ta et bilde",
    gallery: "Velg fra galleri",
    takePhoto: "Ta et bilde",
    cancel: "Avbryt"
  },
  ru: {
    title: "Выбрать или сделать фото",
    gallery: "Выбрать из галереи",
    takePhoto: "Сделать фото",
    cancel: "Отмена"
  },
  zh: {
    title: "选择或拍照",
    gallery: "从图库中选择",
    takePhoto: "拍照",
    cancel: "取消"
  },
  ja: {
    title: "写真を選択または撮影",
    gallery: "ギャラリーから選択",
    takePhoto: "写真を撮る",
    cancel: "キャンセル"
  },
  ko: {
    title: "사진 선택 또는 촬영",
    gallery: "갤러리에서 선택",
    takePhoto: "사진 촬영",
    cancel: "취소"
  },
  ar: {
    title: "اختر أو التقط صورة",
    gallery: "اختر من المعرض",
    takePhoto: "التقط صورة",
    cancel: "إلغاء"
  },
  he: {
    title: "בחר או צלם תמונה",
    gallery: "בחר מהגלריה",
    takePhoto: "צלם תמונה",
    cancel: "ביטול"
  }
};


const languageNames = {
  en: "English",
  es: "Español",
  de: "Deutsch",
  it: "Italiano",
  fr: "Français",
  tr: "Türkçe",
  pt: "Português",
  ru: "Говори по-русски",
  ar: "تحدث بالعربية",
  hu: "Beszélj Magyarul",
  ja: "日本語で話す",
  he: "דבר בעברית"
};

const primerModal = {
  en: {
    title: "Voice Recognition",
    step1: "Press the 'Create New List' button and grant permission for voice recognition.",
    step2: "Then, just say out loud what you need to buy, for example:",
    step2Example: "'I need to buy 1 kilo of tomatoes, 200 grams of chicken, some lettuce, and a bit of chocolate'.",
    step3: "When you're done, press 'View List' to review your shopping list.",
    createList: "Create New List",
    nowNot: "Close"
  },
  es: {
    title: "Reconocimiento de Voz",
    step1: "Presiona el botón 'Crear Nueva Lista' y otorga permiso para el reconocimiento de voz.",
    step2: "Luego, simplemente di en voz alta lo que necesitas comprar, por ejemplo:",
    step2Example: "'Necesito comprar 1 kilo de tomates, 200 gramos de pollo, algo de lechuga y un poco de chocolate'.",
    step3: "Cuando hayas terminado, presiona 'Ver Lista' para revisar tu lista de compras.",
    createList: "Crear Nueva Lista",
    nowNot: "Cerrar"
  },
  de: {
    title: "Spracherkennung",
    step1: "Drücken Sie die Schaltfläche 'Neue Liste erstellen' und geben Sie die Erlaubnis für die Spracherkennung.",
    step2: "Sagen Sie dann einfach laut, was Sie kaufen müssen, zum Beispiel:",
    step2Example: "'Ich muss 1 Kilo Tomaten, 200 Gramm Hähnchen, etwas Salat und etwas Schokolade kaufen'.",
    step3: "Wenn Sie fertig sind, drücken Sie 'Liste anzeigen', um Ihre Einkaufsliste zu überprüfen.",
    createList: "Neue Liste erstellen",
    nowNot: "Schließen"
  },
  it: {
    title: "Riconoscimento Vocale",
    step1: "Premi il pulsante 'Crea nuova lista' e concede il permesso per il riconoscimento vocale.",
    step2: "Poi, dì ad alta voce ciò che devi comprare, per esempio:",
    step2Example: "'Devo comprare 1 chilo di pomodori, 200 grammi di pollo, un po' di lattuga e un po' di cioccolato'.",
    step3: "Quando hai finito, premi 'Visualizza lista' per rivedere la tua lista della spesa.",
    createList: "Crea nuova lista",
    nowNot: "Chiudi"
  },
  fr: {
    title: "Reconnaissance Vocale",
    step1: "Appuyez sur le bouton 'Créer une nouvelle liste' et accordez l'autorisation de reconnaissance vocale.",
    step2: "Ensuite, dites simplement à voix haute ce que vous devez acheter, par exemple:",
    step2Example: "'J'ai besoin d'acheter 1 kilo de tomates, 200 grammes de poulet, de la laitue et un peu de chocolat'.",
    step3: "Lorsque vous avez terminé, appuyez sur 'Voir la liste' pour vérifier votre liste de courses.",
    createList: "Créer une nouvelle liste",
    nowNot: "Fermer"
  },
  tr: {
    title: "Ses Tanıma",
    step1: "'Yeni Liste Oluştur' düğmesine basın ve ses tanıma için izin verin.",
    step2: "Sonra, ne almanız gerektiğini yüksek sesle söyleyin, örneğin:",
    step2Example: "'1 kilo domates, 200 gram tavuk, biraz marul ve biraz çikolata almam gerekiyor'.",
    step3: "İşiniz bittiğinde, alışveriş listenizi gözden geçirmek için 'Listeyi Görüntüle'ye basın.",
    createList: "Yeni Liste Oluştur",
    nowNot: "Kapat"
  },
  pt: {
    title: "Reconhecimento de Voz",
    step1: "Pressione o botão 'Criar Nova Lista' e conceda permissão para o reconhecimento de voz.",
    step2: "Em seguida, basta dizer em voz alta o que você precisa comprar, por exemplo:",
    step2Example: "'Preciso comprar 1 quilo de tomates, 200 gramas de frango, um pouco de alface e um pouco de chocolate'.",
    step3: "Quando terminar, pressione 'Ver Lista' para revisar sua lista de compras.",
    createList: "Criar Nova Lista",
    nowNot: "Fechar"
  },
  ru: {
    title: "Распознавание Голоса",
    step1: "Нажмите кнопку 'Создать новый список' и предоставьте разрешение на распознавание голоса.",
    step2: "Затем просто скажите вслух, что вам нужно купить, например:",
    step2Example: "'Мне нужно купить 1 кг помидоров, 200 грамм курицы, немного салата и немного шоколада'.",
    step3: "Когда закончите, нажмите 'Просмотреть список', чтобы просмотреть ваш список покупок.",
    createList: "Создать новый список",
    nowNot: "Закрыть"
  },
  ar: {
    title: "التعرف على الصوت",
    step1: "اضغط على زر 'إنشاء قائمة جديدة' ومنح الإذن للتعرف على الصوت.",
    step2: "ثم قل بصوت عالٍ ما تحتاج إلى شرائه، على سبيل المثال:",
    step2Example: "'أحتاج لشراء 1 كيلو من الطماطم، 200 جرام من الدجاج، بعض الخس وبعض الشوكولاتة'.",
    step3: "عند الانتهاء، اضغط على 'عرض القائمة' لمراجعة قائمة التسوق الخاصة بك.",
    createList: "إنشاء قائمة جديدة",
    nowNot: "إغلاق"
  },
  hu: {
    title: "Hangfelismerés",
    step1: "Nyomja meg az 'Új lista létrehozása' gombot és adja meg a hangfelismeréshez szükséges engedélyt.",
    step2: "Ezután mondja el hangosan, hogy mit kell vásárolnia, például:",
    step2Example: "'Vásárolnom kell 1 kg paradicsomot, 200 gramm csirkét, egy kis salátát és egy kis csokoládét'.",
    step3: "Ha végzett, nyomja meg a 'Lista megtekintése' gombot a bevásárlólista áttekintéséhez.",
    createList: "Új lista létrehozása",
    nowNot: "Bezárás"
  },
  ja: {
    title: "音声認識",
    step1: "'新しいリストを作成'ボタンを押して音声認識の許可を付与します。",
    step2: "次に、購入する必要があるものを声に出して言います。例えば:",
    step2Example: "'トマト1キロ、鶏肉200グラム、レタス、チョコレートを買う必要があります'。",
    step3: "終わったら、「リストを見る」ボタンを押して買い物リストを確認します。",
    createList: "新しいリストを作成",
    nowNot: "閉じる"
  },
  hi: {
    title: "आवाज पहचान:",
    step1: "'नई सूची बनाएं' बटन दबाएं और आवाज पहचान के लिए अनुमति दें।",
    step2: "फिर, जो आपको खरीदना है, उसे ज़ोर से कहें, उदाहरण के लिए:",
    step2Example: "'मुझे 1 किलो टमाटर, 200 ग्राम चिकन, थोड़ी सी सलाद और थोड़ी सी चॉकलेट खरीदनी है'।",
    step3: "जब आप समाप्त कर लें, तो अपनी खरीदारी की सूची की समीक्षा करने के लिए 'सूची देखें' दबाएं।",
    createList: "नई सूची बनाएं",
    nowNot: "अभी नहीं"
  },
  nl: {
    title: "Spraakherkenning",
    step1: "Druk op de knop 'Nieuwe lijst maken' en geef toestemming voor spraakherkenning.",
    step2: "Zeg dan hardop wat je moet kopen, bijvoorbeeld:",
    step2Example: "'Ik moet 1 kilo tomaten, 200 gram kip, wat sla en een beetje chocolade kopen'.",
    step3: "Druk op 'Lijst bekijken' om je boodschappenlijst te bekijken.",
    createList: "Nieuwe lijst maken",
    nowNot: "Close"
  }
};



const settingsModalTexts = {
  en: {
    title: "Oops!",
    message: "No words detected. Perhaps you didn't say anything or you may need to give permission for voice recognition in settings.",
    goSettings: "Go to Phone Settings",
    cancel: "Close"
  },
  es: {
    title: "¡Upss!",
    message: "No hemos detectado palabras. Puede que no hayas dicho nada o quizás debas dar permiso de reconocimiento de voz en ajustes.",
    goSettings: "Ir a Ajustes del teléfono",
    cancel: "Cerrar"
  },
  de: {
    title: "Hoppla!",
    message: "Keine Worte erkannt. Vielleicht haben Sie nichts gesagt oder Sie müssen die Erlaubnis für die Spracherkennung in den Einstellungen erteilen.",
    goSettings: "Zu den Telefoneinstellungen",
    cancel: "Schließen"
  },
  it: {
    title: "Ops!",
    message: "Nessuna parola rilevata. Forse non hai detto nulla o potrebbe essere necessario dare il permesso per il riconoscimento vocale nelle impostazioni.",
    goSettings: "Vai alle Impostazioni del telefono",
    cancel: "Chiudere"
  },
  fr: {
    title: "Oups!",
    message: "Aucun mot détecté. Peut-être que vous n'avez rien dit ou que vous devez donner la permission pour la reconnaissance vocale dans les paramètres.",
    goSettings: "Aller aux Paramètres du téléphone",
    cancel: "Fermer"
  },
  tr: {
    title: "Hata!",
    message: "Hiçbir kelime algılanmadı. Belki bir şey söylemediniz ya da ayarlarda ses tanıma izni vermeniz gerekiyor olabilir.",
    goSettings: "Telefon Ayarlarına Git",
    cancel: "Kapat"
  },
  pt: {
    title: "Ops!",
    message: "Nenhuma palavra detectada. Talvez você não tenha dito nada ou talvez seja necessário dar permissão para o reconhecimento de voz nas configurações.",
    goSettings: "Ir para Configurações do telefone",
    cancel: "Fechar"
  },
  ru: {
    title: "Упс!",
    message: "Слова не распознаны. Возможно, вы ничего не сказали, или вам нужно дать разрешение на распознавание речи в настройках.",
    goSettings: "Перейти к Настройкам телефона",
    cancel: "Закрыть"
  },
  ar: {
    title: "عفوًا!",
    message: "لم يتم اكتشاف أي كلمات. ربما لم تقل شيئًا أو قد تحتاج إلى منح الإذن للتعرف على الصوت في الإعدادات.",
    goSettings: "اذهب إلى إعدادات الهاتف",
    cancel: "إغلاق"
  },
  hu: {
    title: "Hoppá!",
    message: "Nem érzékelt szavakat. Talán nem mondott semmit, vagy engedélyeznie kell a hangfelismerést a beállításokban.",
    goSettings: "Menj a telefon beállításaihoz",
    cancel: "Bezárás"
  },
  ja: {
    title: "おっと！",
    message: "言葉が検出されませんでした。何も言わなかったか、設定で音声認識の許可を与える必要があるかもしれません。",
    goSettings: "電話の設定に移動",
    cancel: "閉じる"
  },
  hi: {
    title: "उफ़!",
    message: "कोई शब्द नहीं मिला। हो सकता है कि आपने कुछ नहीं कहा हो या आपको सेटिंग्स में वॉयस रिकग्निशन की अनुमति देने की आवश्यकता हो सकती है।",
    goSettings: "फ़ोन सेटिंग्स पर जाएं",
    cancel: "बंद करे"
  },
  nl: {
    title: "Oeps!",
    message: "Geen woorden gedetecteerd. Misschien heb je niets gezegd of moet je toestemming geven voor spraakherkenning in de instellingen.",
    goSettings: "Ga naar Telefooninstellingen",
    cancel: "Sluiten"
  },
};

const rateAppTexts = {
  en: {
    rateTitle: "Do you like this App?",
    rateMessage: "It would really help us if you could give us a good rating!",
    rateButton: "Rate Us",
    notNowButton: "Not Now"
  },
  es: {
    rateTitle: "¿Te gusta esta App?",
    rateMessage: "Nos ayudaría mucho si pudieras darnos una buena puntuación!",
    rateButton: "Valorar",
    notNowButton: "Ahora no"
  },
  de: {
    rateTitle: "Gefällt Ihnen diese App?",
    rateMessage: "Es würde uns sehr helfen, wenn Sie uns eine gute Bewertung geben könnten!",
    rateButton: "Bewerten",
    notNowButton: "Nicht jetzt"
  },
  it: {
    rateTitle: "Ti piace questa app?",
    rateMessage: "Ci aiuterebbe molto se potessi darci una buona valutazione!",
    rateButton: "Valutaci",
    notNowButton: "Non ora"
  },
  fr: {
    rateTitle: "Aimez-vous cette application ?",
    rateMessage: "Cela nous aiderait vraiment si vous pouviez nous donner une bonne note !",
    rateButton: "Notez-nous",
    notNowButton: "Pas maintenant"
  },
  pt: {
    rateTitle: "Você gosta deste app?",
    rateMessage: "Realmente nos ajudaria se você pudesse nos dar uma boa avaliação!",
    rateButton: "Avalie-nos",
    notNowButton: "Agora não"
  },
  ru: {
    rateTitle: "Вам нравится это приложение?",
    rateMessage: "Это действительно поможет нам, если вы оставите хороший отзыв!",
    rateButton: "Оценить",
    notNowButton: "Не сейчас"
  },
  ar: {
    rateTitle: "هل تحب هذا التطبيق؟",
    rateMessage: "سيساعدنا كثيرًا إذا قمت بتقييمنا بشكل جيد!",
    rateButton: "قيمنا",
    notNowButton: "ليس الآن"
  },
  hu: {
    rateTitle: "Tetszik ez az alkalmazás?",
    rateMessage: "Nagyon segítene nekünk, ha jó értékelést adna nekünk!",
    rateButton: "Értékeljen minket",
    notNowButton: "Nem most"
  },
  ja: {
    rateTitle: "このアプリは気に入りましたか？",
    rateMessage: "良い評価をいただけると大変助かります！",
    rateButton: "評価する",
    notNowButton: "今はしない"
  },
  nl: {
    rateTitle: "Vind je deze app leuk?",
    rateMessage: "Het zou ons echt helpen als je ons een goede beoordeling zou kunnen geven!",
    rateButton: "Beoordeel ons",
    notNowButton: "Niet nu"
  }
};

export const costEstimatePrompts = {
  en: "You are an assistant that calculates the estimated cost of a shopping list in ${country}. Respond with the total cost.",
  es: "Eres un asistente que calcula el costo estimado de una lista de compras en ${country}. Responde siempre con el costo total o aproximado.",
  de: "Sie sind ein Assistent, der die geschätzten Kosten einer Einkaufsliste in ${country} berechnet. Geben Sie die Gesamtkosten an.",
  it: "Sei un assistente che calcola il costo stimato di una lista della spesa in ${country}. Rispondi con il costo totale.",
  fr: "Vous êtes un assistant qui calcule le coût estimé d'une liste de courses en ${country}. Répondez avec le coût total.",
  tr: "${country} içindeki bir alışveriş listesinin tahmini maliyetini hesaplayan bir asistansınız. Toplam maliyeti ile yanıt verin.",
  pt: "Você é um assistente que calcula o custo estimado de uma lista de compras em ${country}. Responda com o custo total.",
  ru: "Вы ассистент, который рассчитывает примерную стоимость списка покупок в ${country}. Укажите общую стоимость.",
  ar: "أنت مساعد يقوم بحساب التكلفة التقديرية لقائمة التسوق في ${country}. الرد بالتكلفة الإجمالية.",
  hu: "Ön egy segéd, aki kiszámítja a bevásárlólista becsült költségét ${country} területen. Válaszoljon a teljes költséggel.",
  ja: "${country} の買い物リストの見積もりコストを計算するアシスタントです。総費用で回答してください。",
  hi: "${country} में एक ऐसिस्टेंट हैं जो खरीदारी सूची की अनुमानित लागत की गणना करते हैं। कुल लागत के साथ उत्तर दें।",
  nl: "U bent een assistent die de geschatte kosten van een boodschappenlijst in ${country} berekent. Antwoord met de totale kosten.",
};

const apiClient = axios.create({
  baseURL: API_KEY_CHAT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const sendMessage = (message) => {
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
  const promptLanguage = prompts[deviceLanguage] || prompts['en'];

  const promptMessage = `${promptLanguage} "${message}"`;

  return apiClient.post('/', {
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: promptMessage }],
    max_tokens: 100,
  });
};




const HomeScreen  = ({ navigation }) => {
  const { theme } = useTheme(); // Usa el contexto del tema
  const styles = getStyles(theme); // Obtén los estilos basados en el tema
  const route = useRoute();
  const prompt = route.params?.prompt; // Recibir el prompt pasado desde Diet.js
  const initialList = route.params?.initialList; // Recibir la lista inicial pasada desde HistoryScreen.js
  const [recognized, setRecognized] = useState('');
  const [started, setStarted] = useState(false);
  const [results, setResults] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [history, setHistory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [listModalVisible, setListModalVisible] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseAnime = useRef(new Animated.Value(1)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
  const currentLabels = texts[deviceLanguage] || texts['en']; // Usa los textos traducidos
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [pressCount, setPressCount] = useState(0);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [titleFontSize, setTitleFontSize] = useState(23);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const dishName = route.params?.dishName; // Recibir el nombre del plato
  const closeModal = route.params?.closeModal;
  const [showEmptyListText, setShowEmptyListText] = useState(true);
  const [listType, setListType] = useState('voice'); // Tipo de lista seleccionada
  const [expandMenu, setExpandMenu] = useState(true); // Controla la expansión del menú
  const listModalRef = useRef(null);
  const modalText = modalTexts[deviceLanguage] || modalTexts['en'];
  const animationValue = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const [lastResponse, setLastResponse] = useState('');
  const [country, setCountry] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(null);
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [isCountryEmpty, setIsCountryEmpty] = useState(true);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [showCreatingMessage, setShowCreatingMessage] = useState(false);
  const colorAnim = useRef(new Animated.Value(0)).current;
  const [highlightedWords, setHighlightedWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editModalVisibleadd, setEditModalVisibleadd] = useState(false);
  const languageName = languageNames[deviceLanguage] || "English 🇺🇸";
  const [isIdiomasModalVisible, setIsIdiomasModalVisible] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [hasSeenSubscribeMessage, setHasSeenSubscribeMessage] = useState(false);
  const currentLabelse = primerModal[deviceLanguage] || primerModal['en'];
  const [primerModalVisible, setPrimerModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [showRateButton, setShowRateButton] = useState(false);
  const rateTexts = rateAppTexts[deviceLanguage] || rateAppTexts['en'];

  useEffect(() => {
    const updateAppOpenCount = async () => {
      const currentCountString = await AsyncStorage.getItem('appOpenCount');
      const appOpenCount = parseInt(currentCountString || '0', 10);
      const hasRated = await AsyncStorage.getItem('hasRated');
      
      if (!hasRated && appOpenCount === 2) { // Se prepara para mostrar en la tercera apertura
        await AsyncStorage.setItem('appOpenCount', (appOpenCount + 1).toString());
        setModalVisible(true);
      } else if (!hasRated) {
        await AsyncStorage.setItem('appOpenCount', (appOpenCount + 1).toString());
      }
    };

    updateAppOpenCount();
  }, []);

  const handleRateApp = async () => {
    const url = Platform.select({
      ios: 'itms-apps://itunes.apple.com/app/id6505125372?action=write-review',
      android: 'market://details?id=YOUR_ANDROID_PACKAGE_NAME'
    });

    try {
      await Linking.openURL(url);
      await AsyncStorage.setItem('hasRated', 'true');
      setModalVisible(false); // Cerrar el modal después de valorar
    } catch (error) {
      console.error('Error opening app store:', error);
    }
  };

  const NumberCircle = ({ number }) => (
    <View style={styles.circle}>
      <Text style={styles.circleText}>{number}</Text>
    </View>
  );
  
  useEffect(() => {
    const startPulsing = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    startPulsing();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const hasShownModal = await AsyncStorage.getItem('modalShown');
        if (!hasShownModal) {
          setPrimerModalVisible(true);
        }
      } catch (e) {
        console.error('Error reading AsyncStorage:', e);
      }
    })();
  }, []);


  const handleCloseprimerModal = async () => {
    try {
      await AsyncStorage.setItem('modalShown', 'true');
      setPrimerModalVisible(false);
      startRecognizing();
    } catch (e) {
      console.error('Error saving to AsyncStorage:', e);
    }
  };

  const handleCloseprimerModalCerrar = async () => {
    try {
      await AsyncStorage.setItem('modalShown', 'true');
      setPrimerModalVisible(false);
    } catch (e) {
      console.error('Error saving to AsyncStorage:', e);
    }
  };



  useEffect(() => {
    const checkSubscribeMessage = async () => {
      const hasSeen = await AsyncStorage.getItem('hasSeenSubscribeMessage');
      if (!hasSeen) {
        setHasSeenSubscribeMessage(true);
      }
    };
    checkSubscribeMessage();
  }, []);

  const handleSubscribePress = async () => {
    await AsyncStorage.setItem('hasSeenSubscribeMessage', 'true');
    setHasSeenSubscribeMessage(false);
    navigation.navigate('Suscribe');
  };
  useEffect(() => {
    const checkVisibility = async () => {
      const value = await AsyncStorage.getItem('isContentVisible');
      if (value !== null) {
        setIsContentVisible(JSON.parse(value));
      }
    };

    checkVisibility();
  }, []);




      // Escucha las actualizaciones de la información del cliente.
      const listener = Purchases.addCustomerInfoUpdateListener((customerInfo) => {
        console.log('Información del cliente actualizada:', customerInfo);
        if (customerInfo.entitlements.active['12981']) {
          console.log('Usuario ya suscrito');
          setIsSubscribed(true);
        } else {
          console.log('Usuario no suscrito');
          setIsSubscribed(false);
        }
      });
  
  
  useEffect(() => {
    const initializePurchases = async () => {
      try {
        await Purchases.setDebugLogsEnabled(true);
        await Purchases.configure({ apiKey: 'appl_bHxScLAZLsKxfggiOiqVAZTXjJX' });
  
        const customerInfo = await Purchases.getCustomerInfo();
        console.log('Información del cliente:', customerInfo);
  
        if (customerInfo.entitlements.active['12981']) {
          console.log('Usuario ya suscrito');
          setIsSubscribed(true);
        } else {
          console.log('Usuario no suscrito');
          setIsSubscribed(false);
        }
      } catch (error) {
        console.log('Error al obtener la información del comprador:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleCustomerInfoUpdate = (info) => {
      console.log('Información del cliente actualizada:', info);
      if (info.entitlements.active['12981']) {
        console.log('Usuario ya suscrito');
        setIsSubscribed(true);
      } else {
        console.log('Usuario no suscrito');
        setIsSubscribed(false);
      }
    };
  
  
    initializePurchases();

  
    return () => {
      Purchases.removeCustomerInfoUpdateListener(handleCustomerInfoUpdate);
    };
  }, []);

  
  const textColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FF0000', '#0000FF'] // Cambia entre rojo y azul
  });

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(colorAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [colorAnim]);
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadHistory(); // Recargar el historial cuando `HomeScreen` se enfoque
    });
  
    return unsubscribe;
  }, [navigation]);
  
  
  useEffect(() => {
    const loadCountry = async () => {
      try {
        const savedCountry = await AsyncStorage.getItem('@country');
        if (savedCountry !== null) {
          setCountry(savedCountry);
          setIsCountryEmpty(savedCountry.trim() === '');
        }
      } catch (error) {
        console.error('Error loading country: ', error);
      }
    };

    loadCountry();
  }, []);

  const handleCountryChange = (text) => {
    setCountry(text);
    setIsCountryEmpty(text.trim() === '');
  };

  const handleSaveCountry = async () => {
    if (!isCountryEmpty) {
      try {
        await AsyncStorage.setItem('@country', country);
        setCountryModalVisible(false);
        await fetchEstimatedCost();
  
        setTimeout(() => {
          if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }, 200);
        
      } catch (error) {
        console.error('Error saving country: ', error);
      }
    }
  };
  

  const flatListRef = useRef(null);
  useEffect(() => {
    if (flatListRef.current && estimatedCost) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [estimatedCost]);

  const fetchEstimatedCost = async () => {
    setLoading(true);
    if (!country) {
      Alert.alert("Error", "Please enter a country.");
      return;
    }

    const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
    const estimatePrompt = costEstimatePrompts[deviceLanguage] || costEstimatePrompts['en'];

    try {
      const response = await axios.post(API_KEY_ANALIZE, {
        model: "gpt-4o-mini",
        max_tokens: 200,
        messages: [
          {
            role: "system",
            content: estimatePrompt.replace("${country}", country),
          },
          {
            role: "user",
            content: shoppingList.join(", "),
          },
        ],
      });
      const estimatedCostResponse = response.data.choices[0].message.content;
      setEstimatedCost(`${estimatedCostResponse}`);
      setLoading(false);

      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    } catch (error) {
      console.error("Error fetching estimated cost: ", error);
      Alert.alert("Error", "Could not fetch the estimated cost.");
      setLoading(false);
    }
  };

  useEffect(() => {
    Animated.timing(animationValue, {
      toValue: expandMenu ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [expandMenu]);

  useEffect(() => {
    setShoppingList([]);
    setShowEmptyListText(true);
  }, [listType]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const historyData = await AsyncStorage.getItem('@shopping_history');
        if (historyData !== null) {
          setHistory(JSON.parse(historyData));
        }
      } catch (error) {
        console.error('Failed to fetch history', error);
      }
    };

    if (modalVisible) {
      fetchHistory();
    }
  }, [modalVisible]);

  useEffect(() => {
    if (initialList) {
      setShoppingList(initialList);
      setShowResults(true);
      setShowEmptyListText(false);
    }
  }, [initialList]);

  const startPulseAnimatione = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnime, {
          toValue: 1.09,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnime, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    if (showEmptyListText) {
      startPulseAnimatione();
    }
  }, [showEmptyListText]);

  useEffect(() => {
    if (shoppingList.length > 0) {
      setShowEmptyListText(false);
    } else {
      setShowEmptyListText(true);
    }
  }, [shoppingList]);

  useEffect(() => {
    if (history.length > 0 || shoppingList.length > 0) {
      setTitleFontSize(16);
    } else {
      setTitleFontSize(23);
    }
  }, [history, shoppingList]);

  useEffect(() => {
    const initializePressCount = async () => {
      try {
        const count = await AsyncStorage.getItem('@press_count');
        if (count !== null) {
          setPressCount(parseInt(count));
        }
      } catch (e) {
        console.error("Error loading press count: ", e);
      }
    };


 
    const listener = Purchases.addCustomerInfoUpdateListener((customerInfo) => {
      if (customerInfo.entitlements.active['semana16']) {
        setIsSubscribed(true);
      } else {
        setIsSubscribed(false);
      }
    });

    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    loadHistory();
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [prompt]);


  
const onSpeechStart = () => {
  setStarted(true);
  setShowEmptyListText(false);
  setShowWelcomeMessage(false);
  setShowResults(false);
  setLoading(false);
  setShowCreatingMessage(true); 
  startPulseAnimation();
  setEstimatedCost(null);
};


  const onSpeechRecognized = () => {
    setRecognized('√');
  };

  const onSpeechResults = async (e) => {
    const items = e.value;
    setResults(items); // Actualizar los resultados en tiempo real
  
    try {
      const response = await sendMessage(items.join(', '));
      const generatedList = response.data.choices[0].message.content.split('\n').map(item => item.trim());
      console.log('Generated List:', generatedList); // Añade este log para ver los elementos generados
  
      // Extraer solo las palabras seleccionadas
      const selectedWords = generatedList.flatMap(item => item.split(' ').map(word => word.toLowerCase()));
      setHighlightedWords(selectedWords);
      saveShoppingList(generatedList);
    } catch (error) {
      console.error("Error sending the message: ", error);
      Alert.alert("Error", "Could not send the message.");
    }
  };
  
  
  const renderLiveResults = () => {
    return (
      <View style={styles.liveResultsContainer}>
        {results.map((item, index) => (
          <Text key={index} style={styles.liveResultText}>
            {item.split(' ').map((word, idx) => {
              const cleanedWord = word.replace(/[.,!?]/g, '').toLowerCase(); // Limpiar la palabra de puntuación
              return (
                <Text key={idx} style={highlightedWords.includes(cleanedWord) ? styles.highlightedText : styles.normalText}>
                  {word}{' '}
                </Text>
              );
            })}
          </Text>
        ))}
      </View>
    );
  };
  

  const languageMap = {
    en: 'en-US',
    es: 'es-ES',
    de: 'de-DE',
    fr: 'fr-FR',
    it: 'it-IT',
    pt: 'pt-PT',
    nl: 'nl-NL',
    sv: 'sv-SE',
    da: 'da-DK',
    fi: 'fi-FI',
    no: 'no-NO',
    ru: 'ru-RU',
    zh: 'zh-CN',
    ja: 'ja-JP',
    ko: 'ko-KR',
    ar: 'ar-SA',
    he: 'he-IL',
  };

  const startRecognizing = async () => {
    const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
    const recognitionLanguage = languageMap[deviceLanguage] || 'en-US';

    if (started) {
      try {
        await Voice.stop();
        setStarted(false);
        setShowEmptyListText(true);
      } catch (e) {
        console.error(e);
        Alert.alert("Error", "Error stopping voice recognition.");
      }
    } else {
      try {
        await Voice.start(recognitionLanguage);
        setRecognized('');
        setResults([]);
        setStarted(true);
        if (!isSubscribed) {
          const newPressCount = pressCount + 1;
          setPressCount(newPressCount);
          await AsyncStorage.setItem('@press_count', newPressCount.toString());
        }
      } catch (e) {
        console.error(e);
        Alert.alert("Error", `Error starting voice recognition in ${recognitionLanguage}.`);
      }
    }
  };
  const openAppSettings = () => {
    Linking.openSettings();
  };

  const stopRecognizing = async () => {
    try {
      setLoading(true);
      setShowCreatingMessage(false);
    
      setTimeout(async () => {
        await Voice.stop();
        setStarted(false);
    
        if (results.length === 0) {
          setShowEmptyListText(true);
          setShowResults(false);
          setLoading(false);
          setSettingsModalVisible(true); // Mostrar el modal de configuración
          return;
        }
    
        const detectedDishName = results.find(item => item.toLowerCase().includes('para hacer')) || null;
        const cleanedDishName = detectedDishName
          ? detectedDishName.replace(/.*para hacer\s*/i, '').trim()
          : null;
    
        if (cleanedDishName) {
          navigation.setParams({ dishName: cleanedDishName });
        }
    
        const response = await sendMessage(results.join(', '));
        const generatedList = response.data.choices[0].message.content.split('\n').map(item => item.trim());
        setShoppingList(generatedList);
        saveShoppingList(generatedList);
    
        setLastResponse(response.data.choices[0].message.content);
    
        if (generatedList.length > 0) {
          setShowEmptyListText(false);
          setShowResults(true);
        } else {
          setShowEmptyListText(true);
          setShowResults(false);
        }
    
        setLoading(false);
      }, 500);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Error stopping voice recognition.");
      setLoading(false);
    }
  };
  

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const saveEditedItem = () => {
    const newList = [...shoppingList];
    newList[editingIndex] = editingText;
    setShoppingList(newList);
    saveShoppingList(newList);
    setEditingText('');
    setEditModalVisible(false);
  };

  
  const saveEditedItemadd = () => {
    if (editingText.trim() !== '') {
      const newList = [...shoppingList, editingText];
      setShoppingList(newList);
      saveShoppingList(newList);
    }
    setEditingText('');
    setEditModalVisibleadd(false);
  };
  
  const closeEditModalAdd = () => {
    setEditingText('');
    setEditModalVisibleadd(false);
  };
  
  const editItem = (index) => {
    setEditingIndex(index);
    setEditingText(shoppingList[index]);
    setEditModalVisible(true);
    setEstimatedCost(null);
  };

  
  
  const renderItem = ({ item, index }) => {
    if (item === currentLabels.costdelalista) {
      return (
        <TouchableOpacity onPress={() => setCountryModalVisible(true)}>
          <View style={styles.costButtonContaineriumage}>
            <Text style={styles.costButtonText}>{estimatedCost || item}</Text>
          </View>
        </TouchableOpacity>
        
      );
    }

      // Si es el último ítem de la lista, muestra el ícono "+"
      if (index === shoppingList.length) {
        return (
          <TouchableOpacity onPress={() => addNewItem()}>
            <View style={styles.addButtonContainer}>
              <Ionicons name="add-circle" size={32} color='grey' />
            </View>
          </TouchableOpacity>
        );
      }
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{item}</Text>
        <View style={styles.iconsContainer}>
          <TouchableOpacity onPress={() => editItem(index)}>
            <Ionicons name="pencil" size={24} style={styles.editIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => removeItem(index)}>
            <Ionicons name="close" size={28} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>
        
      </View>
      
    );
  };
  

  const addNewItem = () => {
    setEditingText('');
    setEditModalVisibleadd(true);
    setEstimatedCost(null);
  };
  

  const clearShoppingList = () => {
    setShoppingList([]);
    saveShoppingList([]);
  };
  
  
  const removeItem = (index) => {
    const newList = [...shoppingList];
    newList.splice(index, 1);
    setShoppingList(newList);
    saveShoppingList(newList);
    setEstimatedCost(null);
  };
  const saveShoppingList = async (list) => {
    try {
      await AsyncStorage.setItem('@shopping_list', JSON.stringify(list));
    } catch (e) {
      console.error("Error saving shopping list: ", e);
    }
  };

  const generateGenericListName = () => {
    const existingNumbers = history
      .map(item => {
        const match = item.name.match(/^.* (\d+)$/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter(number => number !== null);
  
    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    return `${currentLabels.list} ${nextNumber}`;
  };
  
  
  const saveToHistory = async () => {
    if (shoppingList.length === 0) return;
  
    const providedDishName = route.params?.dishName; // Recibir el nombre del plato proporcionado en la ruta
    const newDishName = providedDishName || generateGenericListName(); // Usar el nombre proporcionado o uno por defecto
    const newHistory = [...history, { list: shoppingList, name: newDishName }];
  
    try {
      await AsyncStorage.setItem('@shopping_history', JSON.stringify(newHistory));
      setHistory(newHistory);
      setShoppingList([]);
      await AsyncStorage.setItem('@shopping_list', JSON.stringify([]));
      setModalVisible(false);
      setConfirmationModalVisible(true);
      navigation.setParams({ dishName: null }); // Limpiar el nombre del plato después de guardar
      setTimeout(() => setConfirmationModalVisible(false), 2000); // Mostrar el modal de confirmación por 2 segundos
    } catch (e) {
      console.error("Error saving to history: ", e);
    }
  };
  
  const handlePress = () => {
    setIsIdiomasModalVisible(true);
    setIsContentVisible(false);
    AsyncStorage.setItem('isContentVisible', JSON.stringify(false));
  };

  const handleCloseModal = () => {
    setIsIdiomasModalVisible(false);
    setIsContentVisible(false);
  };


  const ConfirmationModal = () => (
    <Modal
      visible={confirmationModalVisible}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.confirmationModalContainer}>
        <View style={styles.confirmationModalContent}>
          <Image source={require('../assets/images/checked.png')} style={styles.confirmationImage} />
          <Text style={styles.confirmationText}>{currentLabels.listSaved}</Text>
        </View>
      </View>
    </Modal>
  );
  
  const SettingsModal = ({ visible, onClose, onOpenSettings }) => {
    const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
    const currentLabels = settingsModalTexts[deviceLanguage] || settingsModalTexts['en'];
  
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.primermodalView}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Image
              source={require('../assets/images/error.png')}
              style={[styles.emptyListImagenotifisetttins]}
            />
            <View style={styles.modalView}>
              <Text style={styles.modalTitleprimermodal}>{currentLabels.title}</Text>
              <Text style={styles.modalText}>{currentLabels.message}</Text>
            </View>
            <TouchableOpacity
              style={styles.modalButtonSettins}
              onPress={onOpenSettings}
            >
              <Text style={styles.modalButtonTextSettins}>{currentLabels.goSettings}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButtonno}
              onPress={onClose}
            >
              <Ionicons name="close" size={32} color='#e91e63' style={styles.icon} />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    );
  };
  

  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('@shopping_history');
      if (savedHistory !== null) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Error loading history: ", e);
    }
  };
  
  // Llama a `loadHistory` cuando el componente se monta
  useEffect(() => {
    loadHistory();
  }, []);

  

  const renderVoiceButton = () => {
    if (shoppingList.length > 0) {
      return (
        
        <View style={styles.headerSaveContainereliminar}>

          {shoppingList.length > 0 && !started && !loading && (
<TouchableOpacity
style={[styles.headerIconSave]}
onPress={clearShoppingList}
>
<Ionicons name="trash-outline" size={22} color='#e91e63' />
<Text style={styles.eliminarlista}>{currentLabels.deleteList}</Text>
</TouchableOpacity>

)}
  {shoppingList.length > 0 && !started && !loading && (
          <TouchableOpacity onPress={() => addNewItem()}>
              <Ionicons name="add-circle" size={32} color='grey' style={[styles.headerIconSaveplus]} />
          </TouchableOpacity>
)}
  {shoppingList.length > 0 && !started && !loading && (
          <TouchableOpacity onPress={saveToHistory} style={styles.headerIconSavedelete}>
      <Ionicons name="checkmark-circle-outline" size={25} color='#009688' />
      <Text style={styles.saveText}>{currentLabels.saveList}</Text>
    </TouchableOpacity>
)}


        </View>
      );
    } else {
      return (
        
        <TouchableOpacity
        style={[styles.button, { backgroundColor: started ? 'transparent' : 'transparent' }]}
        onPress={started ? stopRecognizing : startRecognizing}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]}>
            {started ? (
              <View style={styles.innerCirclered}>
                 <Ionicons name="stop" size={30} color="white" />
              </View>
            ) : (
              <View style={styles.innerCircle}>
                <Ionicons name="mic-outline" size={32} color="white" />
              </View>
            )}
          </Animated.View>

        </View>
      </TouchableOpacity>

        
      );
    }
  };
  
  
  return (
    <SafeAreaView style={styles.container}>
            <View style={styles.publicidad}>
           {
  !isSubscribed && (
    <>
       <TouchableOpacity
            style={styles.touchable}
            onPress={() => navigation.navigate('SuscripcionScreeen')}
          >
          </TouchableOpacity>
           {Platform.OS === 'ios' && (
        <BannerAd
          unitId="ca-app-pub-9855080864816987/1292375998" // Asegúrate de usar el ID real de tu bloque de anuncios
          size={BannerAdSize.BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          onAdLoaded={() => {
            console.log('Ad Banner loaded successfully');
          }}
          onAdFailedToLoad={(error) => {
            console.error('Ad Banner failed to load: ', error);
          }}
          onAdOpened={() => {
            console.log('Ad Banner opened');
          }}
          onAdClosed={() => {
            console.log('Ad Banner closed');
          }}
          onAdLeftApplication={() => {
            console.log('Ad Banner left application');
          }}
        />
      )}
    </>
  )
}


        
{!isSubscribed && hasSeenSubscribeMessage && screenWidth > 600 && ( 
      <TouchableOpacity
        onPress={handleSubscribePress}
        style={[styles.buttonCustomer]}
      >
        <Text style={styles.emptyListTextsuscribe}>{currentLabels.suscribete}</Text>
      </TouchableOpacity>
    )}

<SettingsModal 
      visible={settingsModalVisible} 
      onClose={() => setSettingsModalVisible(false)} 
      onOpenSettings={openAppSettings} 
    />
    
</View>
      {loading && (
        <View style={styles.overlay}>
          <View style={styles.loaderContainer}>
            
            <ActivityIndicator size="large" color={theme.buttonBackground} />
          </View>
          
        </View>
      )}
  
      {!loading && showEmptyListText && !showCreatingMessage && (
        <View style={styles.emptyListContainer}>
        <Image
          source={require('../assets/images/App-Icon-1024x1024@1x copia.png')}
          style={[styles.emptyListImage]}
        />


        <Text style={styles.emptyListTextvoz}>{currentLabels.voiceLists}</Text>
        
        {isContentVisible && (
        <View style={styles.containeridiomas}>

          <TouchableOpacity onPress={handlePress}>
          <View style={styles.innerContainer}>
              <Ionicons name="globe-outline" size={18} color='#009688' style={styles.icon} />
              <Text style={styles.emptyListTextsubtitle}>{currentLabels.welcomeMessage} {languageName}</Text>
              </View>
          </TouchableOpacity>
        </View>
      )}

      </View>
      )}

  
<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalViewo}>
          <Image
        source={require('../assets/images/calificacion-de-cinco-estrellas.png')} // Asegúrate de cambiar esto por la ruta real de tu imagen
        style={styles.modalImageestre}
        resizeMode="contain"
      />
            <Text style={styles.rateTitle}>{rateTexts.rateTitle}</Text>
            <Text style={styles.modalMessage}>{rateTexts.rateMessage}</Text>
            <Button
              title={rateTexts.rateButton}
              onPress={handleRateApp}
              color="#1e90ff"

            />
            <Button
              title={rateTexts.notNowButton}
              onPress={() => setModalVisible(false)}
              color="#6c757d"
            />
          </View>
        </View>
      </Modal>


{!loading && showCreatingMessage && (
  <View style={styles.creatingMessageContainer}>
    {results.length === 0 && (
      <Animated.Text style={[styles.creatingMessageText, { color: textColor }]}>
        {currentLabels.pressAndSpeaktext}
      </Animated.Text>
    )}

    {renderLiveResults()}

    {results.length > 0 && (
      <Text style={styles.emptyListTextsuscribetes}>{currentLabels.creandoLista}</Text>
    )}

    {results.length > 0 && (
      <TouchableOpacity onPress={stopRecognizing} style={styles.headerIconver}>
        <Ionicons name="cart-outline" size={24} color='#009688' />
        <Text style={styles.saveText}>{currentLabels.mostarlista}</Text>
      </TouchableOpacity>
    )}
  </View>
)}

  
      {!loading && showResults && (
        <FlatList
          ref={flatListRef}
          data={shoppingList.length > 0 ? [...shoppingList, currentLabels.costdelalista] : []}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.messageList}
          contentContainerStyle={{ paddingBottom: 10 }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        />
      )}
  
    
  
      {renderVoiceButton()}
      <ConfirmationModal />
      <Modal
        visible={listModalVisible}
        animationType="slide"
        onRequestClose={() => setListModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{currentLabels.createShoppingList}</Text>
          <TextInput
            style={styles.modalInput}
            placeholder={currentLabels.writeItems}
            multiline
            value={editingText}
            onChangeText={setEditingText}
          />
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              const newList = editingText.split('\n').map(item => item.trim()).filter(item => item);
              setShoppingList(newList);
              saveShoppingList(newList);
              setEditingText('');
              setListModalVisible(false);
            }}
          >
            <Text style={styles.modalButtonText}>{currentLabels.save}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
  

      <Modal
        visible={countryModalVisible}
        animationType="slide"
        onRequestClose={() => setCountryModalVisible(false)}
        transparent={true}
      >
        <View style={styles.modalContaineri}>
          <TouchableOpacity
            style={styles.closeIconContainer}
            onPress={() => setCountryModalVisible(false)}
          >
            <Ionicons name="close-circle" size={32} color="#9f9f9f" />
          </TouchableOpacity>
          <Text style={styles.modalTitlecurrency}>{currentLabels.selectCountry}</Text>
          <TextInput
            style={styles.modalInput}
            placeholder={currentLabels.cityNamePlaceholder}
            placeholderTextColor="#b8b8b8ab"
            value={country}
            onChangeText={handleCountryChange}
          />
          <TouchableOpacity
            style={[styles.modalButton, isCountryEmpty && { backgroundColor: '#ccc' }]}
            onPress={handleSaveCountry}
            disabled={isCountryEmpty}
          >
            <Text style={styles.modalButtonText}>
              {`${currentLabels.viewCost} ${country}`}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
        <Modal
  visible={editModalVisible}
  animationType="slide"
  onRequestClose={() => setEditModalVisible(false)}
  transparent={true}
>
<View style={styles.modalContaineris}>
    <Text style={styles.modalTitle}>{currentLabels.editItem}</Text>
    <TextInput
      style={styles.modalInput}
      placeholder={currentLabels.writeItems}
      placeholderTextColor="#b8b8b8ab"
      multiline
      value={editingText}
      onChangeText={setEditingText}
    />
    <TouchableOpacity
      style={styles.modalButton}
      onPress={saveEditedItem}
    >
      <Text style={styles.modalButtonText}>{currentLabels.save}</Text>
    </TouchableOpacity>
  </View>
</Modal>

<Modal
  visible={editModalVisibleadd}
  animationType="slide"
  onRequestClose={closeEditModalAdd}
  transparent={true}
>
  <View style={styles.modalContaineris}>
    <Text style={styles.modalTitle}>{currentLabels.addNewItem}</Text>
    <TextInput
      style={styles.modalInput}
      placeholder={currentLabels.writeHereWhatToAdd}
      placeholderTextColor="#b8b8b8ab"
      multiline
      value={editingText}
      onChangeText={setEditingText}
    />
    <TouchableOpacity
      style={styles.modalButton}
      onPress={saveEditedItemadd}
    >
      <Text style={styles.modalButtonText}>{currentLabels.addNewItembutton}</Text>
    </TouchableOpacity>

  </View>
</Modal>
<Modal
        visible={isIdiomasModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContaineridiomas}>
          <View style={styles.modalContentidiomas}>
          <Text style={styles.modalButtonTexteidi}>{languageName}</Text>
            <Image
              source={require('../assets/images/microfono.png')} // Asegúrate de que la ruta sea correcta
              style={styles.modalImage}
            />
            <Text style={styles.modalButtonTexte}>{currentLabels.changeLanguage}</Text>
   
  
            <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
            <Ionicons name="close" size={32} color={theme.text} />
            </TouchableOpacity>
  
          </View>
        </View>
      </Modal>
      <Modal
      animationType="slide"
      transparent={true}
      visible={primerModalVisible}
      onRequestClose={() => {
        setPrimerModalVisible(!primerModalVisible);
      }}
    >
      <View style={styles.primermodalView}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitleprimermodal}>{currentLabelse.title}</Text>
            <View style={styles.stepContainer}>
              <NumberCircle number="1" />
              <Text style={styles.modalText}>{currentLabelse.step1}</Text>
            </View>
            <View style={styles.stepContainer}>
              <NumberCircle number="2" />
              <Text style={styles.modalText}>{currentLabelse.step2}</Text>
            </View>
            <Text style={styles.modalTextex}>{currentLabelse.step2Example}</Text>
            <View style={styles.stepContainer}>
              <NumberCircle number="3" />
              <Text style={styles.modalText}>{currentLabelse.step3}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={handleCloseprimerModal}
          >
            <Icon name="mic" size={25} color="white" style={styles.icon} />
            <Text style={styles.modalButtonText}>{currentLabelse.createList}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButtonnos}
            onPress={handleCloseprimerModalCerrar}
          >
            <Icon name="close" size={25} color="white" style={styles.icon} />
            <Text style={styles.modalButtonText}>{currentLabelse.nowNot}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>


    </SafeAreaView>
  );  
};

export default HomeScreen;