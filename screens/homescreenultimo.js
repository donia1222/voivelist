import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, FlatList, PermissionsAndroid, Platform, Alert, Animated, Modal, TextInput, Image, Share, ActivityIndicator,Dimensions} from 'react-native';
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
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
Sound.setCategory('Playback');
const screenHeight = Dimensions.get('window').height;
const API_KEY_ANALIZE = process.env.API_KEY_ANALIZE;

const API_KEY_CHAT = process.env.API_KEY_CHAT;



 // Agrega esto en tu archivo de prompts o donde manejes los textos internacionalizados.
export const costEstimatePrompts = {
  en: "You are an assistant that calculates the estimated cost of a shopping list in ${country}. Respond with the total cost.",
  es: "Eres un asistente que calcula el costo estimado de una lista de compras en ${country}. Responde siempre con el costo total o aproximado.",
  // Añade otros idiomas según sea necesario
};



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


const suscripcion = {
  en: "Subscription Active",
  de: "Abonnement aktiv",
  es: "Suscripción Activa",
  it: "Abbonamento attivo",
  fr: "Abonnement actif",
  tr: "Abonelik Aktif",
  pt: "Assinatura Ativa",
  ru: "Подписка активна",
  ar: "الاشتراك نشط",
  hu: "Előfizetés aktív",
  ja: "サブスクリプションがアクティブ",
  hi: "सदस्यता सक्रिय",
  nl: "Abonnement Actief",
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




const dishNamePatterns = {
  es: [
    /para hacer (.+)$/i,
    /una receta de (.+)$/i,
    /preparar (.+)$/i
  ],
  en: [
    /to make (.+)$/i,
    /a recipe for (.+)$/i,
    /prepare (.+)$/i
  ],
  fr: [
    /pour faire (.+)$/i,
    /une recette de (.+)$/i,
    /préparer (.+)$/i
  ],
  de: [
    /zu machen (.+)$/i,
    /ein Rezept für (.+)$/i,
    /zubereiten (.+)$/i
  ],
  // Agrega más idiomas y patrones aquí
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
    model: 'gpt-4o',
    messages: [{ role: 'user', content: promptMessage }],
    max_tokens: 100,
  });
};




const HomeScreen = () => {
  const { theme } = useTheme(); // Usa el contexto del tema
  const styles = getStyles(theme); // Obtén los estilos basados en el tema
  const navigation = useNavigation();
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
  const welcomeModalRef = useRef(null);
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
  const [country, setCountry] = useState(null);
  const [estimatedCost, setEstimatedCost] = useState(null);
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [isCountryEmpty, setIsCountryEmpty] = useState(true);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [showCreatingMessage, setShowCreatingMessage] = useState(false);
  const colorAnim = useRef(new Animated.Value(0)).current;
  const [highlightedWords, setHighlightedWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
          toValue: 1.04,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnime, {
          toValue: 1,
          duration: 1000,
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


    const checkWelcomeMessageShown = async () => {
      try {
        const shown = await AsyncStorage.getItem('@welcome_shown');
        if (shown === null) {
          welcomeModalRef.current?.open();
        }
      } catch (e) {
        console.error("Error checking welcome message: ", e);
      }
    };

    initializePressCount();
    checkWelcomeMessageShown();

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

    if (Platform.OS === 'android') {
      requestMicrophonePermission();
    }

    if (prompt) {
      handleSendPrompt(prompt);
    }
    if (closeModal) {
      welcomeModalRef.current?.close();
    }

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [prompt]);

  const requestMicrophonePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'This app needs access to your microphone to recognize your voice.',
          buttonNeutral: 'Ask me later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Microphone permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const detectDishName = (message, language) => {
    const patterns = dishNamePatterns[language] || [];
    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
    return null;
  };

  
  const handleSendPrompt = async (message) => {
    try {
      setLoading(true);
      const response = await sendMessage(message);
      const generatedList = response.data.choices[0].message.content.split('\n').map(item => item.trim());
      const newList = [...shoppingList, ...generatedList];
      setShoppingList(newList);
      saveShoppingList(newList);
  
      const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
      const detectedDishName = detectDishName(message, deviceLanguage);
      if (detectedDishName) {
        navigation.setParams({ dishName: detectedDishName });
      }
  
      setLastResponse(response.data.choices[0].message.content);
  
      setTimeout(() => {
        setShowResults(true);
        setLoading(false);
      }, 200);
  
    } catch (error) {
      console.error("Error sending the message: ", error);
      Alert.alert("Error", "Could not send the message.");
      setLoading(false);
    }
  };
  
  
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
  
      setShoppingList((prevList) => [...prevList, ...generatedList.filter(item => !prevList.includes(item))]);
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
          toValue: 1.5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const renderItem = ({ item, index }) => {
    if (item === currentLabels.costdelalista) {
      return (
        <TouchableOpacity onPress={() => setCountryModalVisible(true)}>
          <View style={styles.costButtonContainer}>
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
  

  const ConfirmationModal = () => (
    <Modal
      visible={confirmationModalVisible}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.confirmationModalContainer}>
        <View style={styles.confirmationModalContent}>
          <Image source={require('../assets/images/checked.png')} style={styles.confirmationImage} />
          <Text style={styles.confirmationText}>Lista guardada correctamente</Text>
        </View>
      </View>
    </Modal>
  );
  
  
  

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

  
  
  const renderVoiceButton = () => (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: started ? '#e91e63' : theme.buttonBackground }]}
      onPress={started ? stopRecognizing : startRecognizing}
    >
      {started ? (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]}>
          </Animated.View>
          <Text style={styles.buttonText}>{currentLabels.stopRecording}</Text>
        </View>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="mic" size={32} color="#fff" />
          <Text style={styles.buttonText}>{currentLabels.crearshoppingList}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
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
          unitId="ca-app-pub-3940256099942544/2934735716" // Asegúrate de usar el ID real de tu bloque de anuncios
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
{!isSubscribed && (
<Text style={styles.emptyListTextsuscribe}>{currentLabels.suscribete}</Text>
  )}
  
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
          <Animated.Image
            source={require('../assets/images/voicecopia.png')}
            style={[styles.emptyListImage, { transform: [{ scale: pulseAnime }] }]}
          />


          <Text style={styles.emptyListText}>{currentLabels.pressAndSpeak}</Text>
        </View>
      )}

  
      {!loading && showCreatingMessage && (
        <View style={styles.creatingMessageContainer}>
          <Animated.Text style={[styles.creatingMessageText, { color: textColor }]}>
            {currentLabels.pressAndSpeaktext}
          </Animated.Text>
          {renderLiveResults()}
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
  
      {shoppingList.length > 0 && !started && (
        <View style={styles.headerSaveContainer}>
          <TouchableOpacity onPress={saveToHistory} style={styles.headerIconSave}>
            <Ionicons name="checkmark-circle-outline" size={24} color='#009688' />
            <Text style={styles.saveText}>{currentLabels.saveList}</Text>
          </TouchableOpacity>
        </View>
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
  
      <Modalize ref={listModalRef} adjustToContentHeight>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{currentLabels.createShoppingList}</Text>
          <TextInput
            style={styles.modalInput}
            placeholder={currentLabels.writeItems}
            placeholderTextColor="#b8b8b8ab"
            multiline
            value={editingText}
            onChangeText={setEditingText}
          />
          <TouchableOpacity
            style={styles.modalButtonpencil}
            onPress={() => {
              const newList = editingText.split('\n').map(item => item.trim()).filter(item => item);
              setShoppingList(newList);
              saveShoppingList(newList);
              setEditingText('');
              listModalRef.current?.close();
            }}
          >
            <Text style={styles.modalButtonText}>{currentLabels.save}</Text>
          </TouchableOpacity>
        </View>
      </Modalize>
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
  
      <Modalize
        ref={welcomeModalRef}
        adjustToContentHeight
        modalTopOffset={50}
        onClosed={async () => {
          await AsyncStorage.setItem('@welcome_shown', 'true');
        }}
      >
        <View style={styles.welcomeContainer}>
          <TouchableOpacity onPress={() => welcomeModalRef.current?.close()} style={styles.closeIconContainer}>
            <Ionicons name="close-circle-outline" size={32} color="#9f9f9f" />
          </TouchableOpacity>
          <Image source={require('../assets/images/lista.jpeg')} style={styles.welcomeImage} />
          <Text style={styles.welcomeText}>{currentLabels.welcomeMessagePart1}</Text>
          <Text style={styles.welcomeTextw}>{currentLabels.welcomeMessagePart2}</Text>
        </View>
      </Modalize>
    </SafeAreaView>
  );  
};

export default HomeScreen;