import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, FlatList,  Platform, Alert, Animated, Modal, TextInput, Image, Share, ActivityIndicator,Dimensions} from 'react-native';
import Voice from '@react-native-community/voice';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import { useNavigation, useRoute } from '@react-navigation/native';
import Suscribe from './Suscribe';
import Purchases from 'react-native-purchases';
import { Modalize } from 'react-native-modalize';
import styles from './Styles/HomeScreenStyles'; // Importa los estilos
import prompts from './translations/prompts'; // Importa los prompts
import labels from './translations/translations'; // Importa las traducciones
import { useTheme } from '../ThemeContext'; // Importa el hook useTheme
import getStyles from './Styles/HomeScreenStyles';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import texts from './translations/texts'; // Importa los textos traducidos
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';
import OpenAI from 'openai';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
const screenWidth = Dimensions.get('window').width;

Sound.setCategory('Playback');
const screenHeight = Dimensions.get('window').height;
const API_KEY_ANALIZE = process.env.API_KEY_ANALIZE;

const API_KEY_CHAT = process.env.API_KEY_CHAT;

const openai = new OpenAI({
  apiKey: '',  // Reemplaza 'YOUR_API_KEY' con tu clave de API de OpenAI
});

let hasPlayedPrompt = false;




const promptsAnalize = {
  en: "You are a helpful assistant that analyzes images of shopping lists. Respond in English and do not comment on anything, just add the items seen in the shopping list, and if the image does not contain items to generate a list, always look for the texts to make a list, if it is in another language, translate the products to the language you are asked.",
  de: "Du bist ein hilfreicher Assistent, der Einkaufslisten analysiert. Antworte auf Deutsch und kommentiere nichts, füge nur die in der Einkaufsliste gesehenen Artikel hinzu, und wenn das Bild keine Artikel enthält, um eine Liste zu erstellen, suche immer nach den Texten, um eine Liste zu erstellen, und wenn es in einer anderen Sprache ist, übersetze die Produkte in die Sprache, nach der du gefragt wirst.",
  es: "Eres un asistente útil que analiza imágenes de listas de compras. Responde en español y no comentes nada, solo añade los items vistos en la lista de la compra, y si la imagen no contiene items para generar una lista, busca siempre los textos para hacer una lista, si está en otro idioma traduce los productos al idioma que se te ha preguntado.",
  it: "Sei un assistente utile che analizza le immagini delle liste della spesa. Rispondi in italiano e non commentare nulla, aggiungi solo gli articoli visti nella lista della spesa, e se l'immagine non contiene articoli per generare una lista, cerca sempre i testi per fare una lista, se è in un'altra lingua traduci i prodotti nella lingua che ti viene chiesta.",
  fr: "Vous êtes un assistant utile qui analyse les images des listes de courses. Répondez en français et ne commentez rien, ajoutez simplement les articles vus dans la liste de courses, et si l'image ne contient pas d'articles pour générer une liste, cherchez toujours les textes pour faire une liste, si c'est dans une autre langue, traduisez les produits dans la langue demandée.",
  pt: "Você é um assistente útil que analisa imagens de listas de compras. Responda em português e não comente nada, apenas adicione os itens vistos na lista de compras, e se a imagem não contiver itens para gerar uma lista, sempre procure os textos para fazer uma lista, se estiver em outro idioma, traduza os produtos para o idioma solicitado.",
  nl: "Je bent een behulpzame assistent die afbeeldingen van boodschappenlijsten analyseert. Reageer in het Nederlands en geef geen commentaar, voeg gewoon de items toe die op de boodschappenlijst staan, en als de afbeelding geen items bevat om een lijst te maken, zoek dan altijd naar de teksten om een lijst te maken, en als het in een andere taal is, vertaal de producten naar de taal die je wordt gevraagd.",
  sv: "Du är en hjälpsam assistent som analyserar bilder av inköpslistor. Svara på svenska och kommentera inte något, lägg bara till de saker som syns i inköpslistan, och om bilden inte innehåller saker för att skapa en lista, leta alltid efter texterna för att göra en lista, och om det är på ett annat språk, översätt produkterna till det språk som du frågas.",
  da: "Du er en hjælpsom assistent, der analyserer billeder af indkøbslister. Svar på dansk og kommenter ikke noget, tilføj blot de varer, der ses på indkøbslisten, og hvis billedet ikke indeholder varer til at lave en liste, skal du altid kigge efter teksterne for at lave en liste, og hvis det er på et andet sprog, oversæt varerne til det sprog, du bliver spurgt.",
  fi: "Olet hyödyllinen avustaja, joka analysoi ostoslistojen kuvia. Vastaa suomeksi ja älä kommentoi mitään, lisää vain ostoslistalla näkyvät tuotteet, ja jos kuva ei sisällä tuotteita luettelon luomiseen, etsi aina tekstit tehdäksesi luettelon, ja jos se on toisella kielellä, käännä tuotteet kielelle, jota sinulta kysytään.",
  no: "Du er en hjelpsom assistent som analyserer bilder av handlelister. Svar på norsk og kommenter ingenting, bare legg til elementene som er sett på handlelisten, og hvis bildet ikke inneholder elementer for å lage en liste, se alltid etter tekstene for å lage en liste, og hvis det er på et annet språk, oversett produktene til språket du blir spurt.",
  ru: "Вы полезный помощник, который анализирует изображения списков покупок. Отвечайте на русском и ничего не комментируйте, просто добавьте элементы, увиденные в списке покупок, и если на изображении нет элементов для создания списка, всегда ищите тексты, чтобы составить список, и если это на другом языке, переведите продукты на язык, о котором вас спрашивают.",
  zh: "你是一个有帮助的助手，可以分析购物清单的图像。用中文回答，不要发表评论，只需添加购物清单中看到的项目，如果图像不包含生成清单的项目，请始终查找文本以制作清单，如果是其他语言，请将产品翻译成询问你的语言。",
  ja: "あなたは買い物リストの画像を分析する役立つアシスタントです。日本語で回答し、何もコメントせず、買い物リストに見られる項目を追加するだけで、リストを作成するための項目が画像に含まれていない場合は、常にリストを作成するためのテキストを探し、それが他の言語の場合は、尋ねられた言語に製品を翻訳してください。",
  ko: "당신은 쇼핑 목록의 이미지를 분석하는 유용한 도우미입니다. 한국어로 응답하고 아무 것도 언급하지 말고 쇼핑 목록에 표시된 항목만 추가하십시오. 이미지에 목록을 생성할 항목이 포함되어 있지 않은 경우 항상 목록을 작성하기 위해 텍스트를 찾고 다른 언어로 된 경우 요청받은 언어로 제품을 번역하십시오。",
  ar: "أنت مساعد مفيد يحلل صور قوائم التسوق. رد باللغة العربية ولا تعلق على أي شيء، فقط أضف العناصر التي شوهدت في قائمة التسوق، وإذا كانت الصورة لا تحتوي على عناصر لإنشاء قائمة، فابحث دائمًا عن النصوص لإنشاء قائمة، وإذا كانت بلغة أخرى، فترجم المنتجات إلى اللغة التي طلبت منك.",
  he: "אתה עוזר מועיל שמנתח תמונות של רשימות קניות. השב בעברית ואל תעיר דבר, רק הוסף את הפריטים שנראו ברשימת הקניות, ואם התמונה לא מכילה פריטים ליצירת רשימה, חפש תמיד את הטקסטים כדי ליצור רשימה, ואם זה בשפה אחרת, תרגם את המוצרים לשפה שנשאלת."
};

const promptsSpeak = {
  en: "This is your shopping list, you can save your shopping list to share or set a reminder!",
  de: "Dies ist Ihre Einkaufsliste, Sie können Ihre Einkaufsliste speichern, um sie zu teilen oder eine Erinnerung einzustellen!",
  es: "Esta es tu lista de la compra, puedes guardar tu lista de la compra para compartirla o programar un aviso!",
  it: "Questa è la tua lista della spesa, puoi salvare la tua lista della spesa per condividerla o impostare un promemoria!",
  fr: "Ceci est votre liste de courses, vous pouvez enregistrer votre liste de courses pour la partager ou définir un rappel!",
  pt: "Esta é a sua lista de compras, você pode salvar sua lista de compras para compartilhar ou definir um lembrete!",
  nl: "Dit is uw boodschappenlijst, u kunt uw boodschappenlijst opslaan om te delen of een herinnering instellen!",
  sv: "Detta är din inköpslista, du kan spara din inköpslista för att dela eller ställa in en påminnelse!",
  da: "Dette er din indkøbsliste, du kan gemme din indkøbsliste for at dele eller sætte en påmindelse!",
  fi: "Tämä on ostoslistasi, voit tallentaa ostoslistasi jakamista varten tai asettaa muistutuksen!",
  no: "Dette er handlelisten din, du kan lagre handlelisten din for å dele eller sette en påminnelse!",
  ru: "Это ваш список покупок, вы можете сохранить свой список покупок, чтобы поделиться им или установить напоминание!",
  zh: "这是你的购物清单，你可以保存你的购物清单以分享或设置提醒!",
  ja: "これはあなたの買い物リストです。買い物リストを保存して共有したり、リマインダーを設定したりできます！",
  ko: "이것은 당신의 쇼핑 목록입니다. 쇼핑 목록을 저장하여 공유하거나 알림을 설정할 수 있습니다!",
  ar: "هذه هي قائمة التسوق الخاصة بك، يمكنك حفظ قائمة التسوق الخاصة بك لمشاركتها أو تعيين تذكير!",
  he: "זו רשימת הקניות שלך, אתה יכול לשמור את רשימת הקניות שלך לשיתוף או לקבוע תזכורת!"
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


const nosuscripcion = {
  en: "Not Subscribed",
  de: "Nicht abonniert",
  es: "No Suscrito",
  it: "Non abbonato",
  fr: "Non abonné",
  tr: "Abone Değil",
  pt: "Não Assinado",
  ru: "Не подписан",
  ar: "غير مشترك",
  hu: "Nem előfizetett",
  ja: "未登録",
  hi: "सदस्यता नहीं है",
  nl: "Niet geabonneerd",
};


const modalTexts = {
  en: {
    title: "Select or take a photo of your shopping list",
    gallery: "Select from gallery",
    takePhoto: "Take a photo",
    cancel: "Cancel"
  },
  de: {
    title: "Foto Ihrer Einkaufsliste auswählen oder machen",
    gallery: "Aus der Galerie auswählen",
    takePhoto: "Ein Foto machen",
    cancel: "Abbrechen"
  },
  es: {
    title: "Seleccionar o tomar una foto de tu lista de compras",
    gallery: "Seleccionar de la galería",
    takePhoto: "Tomar una foto",
    cancel: "Cancelar"
  },
  it: {
    title: "Seleziona o scatta una foto della tua lista della spesa",
    gallery: "Seleziona dalla galleria",
    takePhoto: "Scatta una foto",
    cancel: "Annulla"
  },
  fr: {
    title: "Sélectionner ou prendre une photo de votre liste de courses",
    gallery: "Sélectionner dans la galerie",
    takePhoto: "Prendre une photo",
    cancel: "Annuler"
  },
  pt: {
    title: "Selecionar ou tirar uma foto da sua lista de compras",
    gallery: "Selecionar da galeria",
    takePhoto: "Tirar uma foto",
    cancel: "Cancelar"
  },
  nl: {
    title: "Selecteer of maak een foto van uw boodschappenlijst",
    gallery: "Selecteer uit galerij",
    takePhoto: "Maak een foto",
    cancel: "Annuleren"
  },
  sv: {
    title: "Välj eller ta ett foto av din inköpslista",
    gallery: "Välj från galleriet",
    takePhoto: "Ta ett foto",
    cancel: "Avbryt"
  },
  da: {
    title: "Vælg eller tag et foto af din indkøbsliste",
    gallery: "Vælg fra galleriet",
    takePhoto: "Tag et foto",
    cancel: "Annuller"
  },
  fi: {
    title: "Valitse tai ota kuva ostoslistastasi",
    gallery: "Valitse galleriasta",
    takePhoto: "Ota kuva",
    cancel: "Peruuta"
  },
  no: {
    title: "Velg eller ta et bilde av handlelisten din",
    gallery: "Velg fra galleri",
    takePhoto: "Ta et bilde",
    cancel: "Avbryt"
  },
  ru: {
    title: "Выбрать или сделать фото вашего списка покупок",
    gallery: "Выбрать из галереи",
    takePhoto: "Сделать фото",
    cancel: "Отмена"
  },
  zh: {
    title: "选择或拍摄您的购物清单照片",
    gallery: "从图库中选择",
    takePhoto: "拍照",
    cancel: "取消"
  },
  ja: {
    title: "買い物リストの写真を選択または撮影する",
    gallery: "ギャラリーから選択",
    takePhoto: "写真を撮る",
    cancel: "キャンセル"
  },
  ko: {
    title: "쇼핑 목록 사진 선택 또는 촬영",
    gallery: "갤러리에서 선택",
    takePhoto: "사진 촬영",
    cancel: "취소"
  },
  ar: {
    title: "اختر أو التقط صورة لقائمة التسوق الخاصة بك",
    gallery: "اختر من المعرض",
    takePhoto: "التقط صورة",
    cancel: "إلغاء"
  },
  he: {
    title: "בחר או צלם תמונה של רשימת הקניות שלך",
    gallery: "בחר מהגלריה",
    takePhoto: "צלם תמונה",
    cancel: "ביטול"
  }
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
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: promptMessage }],
    max_tokens: 200,
  });
};
const ImageListScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const route = useRoute();
  const initialList = route.params?.initialList;
  const [shoppingList, setShoppingList] = useState([]);
  const [history, setHistory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [listModalVisible, setListModalVisible] = useState(false);
  const [editingText, setEditingText] = useState('');
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
  const currentLabels = texts[deviceLanguage] || texts['en'];
  const modalText = modalTexts[deviceLanguage] || modalTexts['en'];
  const [loading, setLoading] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(null);
  const flatListRef = useRef(null);
  const [country, setCountry] = useState('');
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [isCountryEmpty, setIsCountryEmpty] = useState(true);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);


  
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
  if (info.entitlements.active['semana16']) {
    console.log('Usuario ya suscrito');
    setIsSubscribed(true);
  } else {
    console.log('Usuario no suscrito');
    setIsSubscribed(false);
  }
};


initializePurchases();

const loadPressCounts = async () => {
  const cameraCount = await AsyncStorage.getItem('cameraPressCount');
  const rollCount = await AsyncStorage.getItem('rollPressCount');
  if (cameraCount !== null) {
    setCameraPressCount(parseInt(cameraCount));
  }
  if (rollCount !== null) {
    setRollPressCount(parseInt(rollCount));
  }
};

loadPressCounts();

return () => {
  Purchases.removeCustomerInfoUpdateListener(handleCustomerInfoUpdate);
};
}, []);


  const startBounceAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -30,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };
  

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
        model: "gpt-3.5-turbo",
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
      setEstimatedCost(`Costo estimado: ${estimatedCostResponse}`);
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

  const analyzeImage = async (imageUri) => {
    setLoading(true);
    startBounceAnimation();
    setEstimatedCost(null);
    try {
      const base64Image = await convertImageToBase64(imageUri);
      const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
      const promptMessage = promptsAnalize[deviceLanguage] || promptsAnalize['en'];

      const headers = {
        'Content-Type': 'application/json',
      };

      const body = {
        model: "gpt-4o-mini",
        max_tokens: 800,
        messages: [
          {
            role: "system",
            content: promptMessage,
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  "url": `data:image/jpeg;base64,${base64Image}`,
                  "detail": "low",
                },
              },
            ],
          },
        ],
      };

      const response = await axios.post(API_KEY_ANALIZE, body, { headers });
      console.log('API Response:', JSON.stringify(response.data, null, 2));

      const content = response.data.choices[0].message.content;
      if (content) {
        const items = content.split('\n').map(item => item.trim());
        setShoppingList(items);
        saveShoppingList(items);
      } else {
        console.error('No valid analysis received.');
        Alert.alert("Error", "No valid analysis received.");
      }
    } catch (error) {
      console.error("Error analyzing the image: ", error);
      if (error.response) {
        Alert.alert("Error", `Could not analyze the image. Status code: ${error.response.status}`);
      } else {
        Alert.alert("Error", "Could not analyze the image.");
      }
    } finally {
      setLoading(false);
    }
  };


  const requestCameraPermission = async () => {
    try {
      const result = await request(
        Platform.select({
          android: PERMISSIONS.ANDROID.CAMERA,
          ios: PERMISSIONS.IOS.CAMERA,
        })
      );
  
      if (result === RESULTS.GRANTED) {
        return true;
      } else {
        Alert.alert('Permiso de cámara denegado');
        return false;
      }
    } catch (error) {
      console.error('Failed to request camera permission', error);
      return false;
    }
  };
  
  const requestGalleryPermission = async () => {
    try {
      const result = await request(
        Platform.select({
          android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
        })
      );
  
      if (result === RESULTS.GRANTED) {
        return true;
      } else {
        Alert.alert('Permiso de galería denegado');
        return false;
      }
    } catch (error) {
      console.error('Failed to request gallery permission', error);
      return false;
    }
  };


  const convertImageToBase64 = (uri) => {
    return new Promise((resolve, reject) => {
      RNFS.readFile(uri, 'base64')
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  };
  const handleChoosePhoto = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;
  
    const options = {
      noData: true,
    };
    launchImageLibrary(options, response => {
      if (response.assets) {
        const uri = response.assets[0].uri;
        setImageUri(uri);
        setImageModalVisible(false);
        analyzeImage(uri);
      }
    });
  };
  
  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;
  
    const options = {
      noData: true,
    };
  
    launchCamera(options, response => {
      if (response.assets) {
        const uri = response.assets[0].uri;
        setImageUri(uri);
        setImageModalVisible(false);
        analyzeImage(uri);
      }
    });
  };

  const renderImageModal = () => (
    <Modal
      visible={imageModalVisible}
      animationType="slide"
      onRequestClose={() => setImageModalVisible(false)}
    >
      <View style={styles.modalContainer}>
      <Image
            source={require('../assets/images/lista-de-quehaceres.png')}
            style={[styles.emptyListImageImagenes]}
          />
        <Text style={styles.modalTitleimagen}>{modalText.title}</Text>
        <TouchableOpacity style={styles.modalButtonimane} onPress={handleChoosePhoto}>
          <Ionicons name="image-outline" size={25} color="white" style={styles.menuIcon} />
          <Text style={styles.modalButtonTextimanet}>{modalText.gallery}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalButtonimane} onPress={handleTakePhoto}>
          <Ionicons name="camera-outline" size={25} color="white" style={styles.menuIcon} />
          <Text style={styles.modalButtonTextimanet}>{modalText.takePhoto}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalButtoncerrar} onPress={() => setImageModalVisible(false)}>
          <Ionicons name="close-circle-outline" size={25} color="white" style={styles.menuIcon} />
          <Text style={styles.modalButtonTextcerar}>{modalText.cancel}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

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
    }
  }, [initialList]);

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
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{item}</Text>
        <TouchableOpacity onPress={() => removeItem(index)}>
          <Ionicons name="close" size={28} style={styles.closeIcon} />
        </TouchableOpacity>
      </View>
    );
  };

  const removeItem = (index) => {
    const newList = [...shoppingList];
    newList.splice(index, 1);
    setShoppingList(newList);
    saveShoppingList(newList);
    setEstimatedCost(null);
  };

  const saveShoppingList = async (newList) => {
    try {
      const existingLists = await AsyncStorage.getItem('@shopping_history');
      let updatedLists = [];
  
      if (existingLists !== null) {
        updatedLists = JSON.parse(existingLists);
      }
  
      updatedLists.push({
        list: newList,
        name: generateGenericListName(), // Genera un nuevo nombre para la lista
      });
  
      await AsyncStorage.setItem('@shopping_history', JSON.stringify(updatedLists));
      setShoppingList(newList);
    } catch (e) {
      console.error("Error saving shopping list: ", e);
    }
  };
  
  const generateGenericListName = () => {
    const currentLanguage = deviceLanguage || 'en';
    const prefix = texts[currentLanguage]?.imageListPrefix || 'Lista por Imagen';
  
    const existingNumbers = history
      .map(item => item.name.match(new RegExp(`^${prefix} (\\d+)$`)))
      .filter(match => match !== null)
      .map(match => parseInt(match[1], 10));
  
    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    return `${prefix} ${nextNumber}`;
  };
  
  
  const saveToHistory = async () => {
    if (shoppingList.length === 0) return;
  
    try {
      const existingLists = await AsyncStorage.getItem('@shopping_history');
      let updatedLists = [];
  
      if (existingLists !== null) {
        updatedLists = JSON.parse(existingLists);
      }
  
      // Generar nuevo nombre de lista
      const newDishName = generateGenericListName();
      const newHistory = [...updatedLists, { list: shoppingList, name: newDishName }];
  
      await AsyncStorage.setItem('@shopping_history', JSON.stringify(newHistory));
      setHistory(newHistory);
      setShoppingList([]);
      setModalVisible(false);
      setConfirmationModalVisible(true);
      console.log("Modal de confirmación visible"); // Depuración
      setTimeout(() => {
        setConfirmationModalVisible(false);
  
        // Verificar si hay duplicados y eliminarlos después de mostrar el modal de confirmación
        const uniqueHistory = newHistory.filter(
          (item, index, self) => 
            index === self.findIndex((t) => (
              JSON.stringify(t.list) === JSON.stringify(item.list)
            ))
        );
        if (uniqueHistory.length !== newHistory.length) {
          AsyncStorage.setItem('@shopping_history', JSON.stringify(uniqueHistory));
          setHistory(uniqueHistory);
        }
      }, 2000);
    } catch (e) {
      console.error("Error saving to history: ", e);
    }
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
  


  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    startPulseAnimation();
  }, []);

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
</View>


{loading && (
  <View style={styles.overlay}>
<Text style={styles.emptyListTextImagen}>{currentLabels.creandoLista}</Text>
    
    {imageUri && (
      <Image source={{ uri: imageUri }} style={styles.selectedImage} />
    )}
    <Animated.View style={[styles.bouncingImageContainer, { transform: [{ translateY: bounceAnim }] }]}>
      <Image source={require('../assets/images/lupa.png')} style={styles.bouncingImage} />
    </Animated.View>
  </View>
)}





       {!loading && shoppingList.length === 0 && (
      <View style={styles.emptyListContainer}>
        {screenWidth > 380 && (  // Ajusta el valor de 600 según tu criterio para pantallas pequeñas
          <Image
            source={require('../assets/images/upload-file-2.png')}
            style={[styles.emptyListImageImagen]}
          />
        )}
        <Text style={styles.emptyListText}>{currentLabels.uploadImage}</Text>
      </View>
    )}


      {!loading && shoppingList.length > 0 && (
        <FlatList
          ref={flatListRef}
          data={shoppingList.length > 0 ? [...shoppingList, currentLabels.costdelalista] : []}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.messageList}
          contentContainerStyle={{ paddingBottom: 10 }}
          scrollEventThrottle={16}
        />
      )}



      {renderImageModal()}
      <ConfirmationModal />

      {!loading && (
        <TouchableOpacity
        style={[styles.button, { backgroundColor: 'transparent' }]}
          onPress={() => setImageModalVisible(true)}
        >
              <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]}>
              <View style={styles.innerCircleredimagen}>
          <Ionicons name="cloud-upload-outline" size={36} color="#fff" />
             </View>
          </Animated.View>
 
        </TouchableOpacity>
      )}

      <Modal visible={listModalVisible} animationType="slide" onRequestClose={() => setListModalVisible(false)}>
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
      {shoppingList.length > 0 && !loading &&(

          <TouchableOpacity onPress={saveToHistory} style={styles.headerIconSaveImagene}>
            <Ionicons name="checkmark-circle-outline" size={24} color='#009688' />
            <Text style={styles.saveText}>{currentLabels.saveList}</Text>
          </TouchableOpacity>
        
      )}
    </SafeAreaView>
  );
};

export default ImageListScreen;