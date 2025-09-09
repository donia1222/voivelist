"use client"

import { useState, useEffect, useRef } from "react"
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Platform,
  Alert,
  Animated,
  Modal,
  TextInput,
  Image,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Linking,
  StyleSheet,
} from "react-native"
import Voice from "@react-native-community/voice"
import axios from "axios"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as RNLocalize from "react-native-localize"
import { useRoute } from "@react-navigation/native"
import Purchases from "react-native-purchases"
import prompts from "./translations/prompts"
import { useTheme } from "../ThemeContext"
import getStyles from "./Styles/HomeScreenStyles"
import texts from "./translations/texts"
import Sound from "react-native-sound"
import Icon from "react-native-vector-icons/MaterialIcons"

Sound.setCategory("Playback")
const screenHeight = Dimensions.get("window").height
const API_KEY_ANALIZE = process.env.API_KEY_ANALIZE
const API_KEY_CHAT = process.env.API_KEY_CHAT
const screenWidth = Dimensions.get("window").width

// Prompts para análisis en tiempo real
const realTimeAnalysisPrompts = {
  en: "Extract only the shopping items and quantities from this text. Return them as a comma-separated list. If no shopping items are found, return 'NONE'. Text:",
  es: "Extrae solo los artículos de compra y cantidades de este texto. Devuélvelos como una lista separada por comas. Si no se encuentran artículos de compra, devuelve 'NONE'. Texto:",
  de: "Extrahiere nur die Einkaufsartikel und Mengen aus diesem Text. Gib sie als kommagetrennte Liste zurück. Wenn keine Einkaufsartikel gefunden werden, gib 'NONE' zurück. Text:",
  it: "Estrai solo gli articoli della spesa e le quantità da questo testo. Restituiscili come elenco separato da virgole. Se non vengono trovati articoli della spesa, restituisci 'NONE'. Testo:",
  fr: "Extrayez uniquement les articles d'achat et les quantités de ce texte. Renvoyez-les sous forme de liste séparée par des virgules. Si aucun article d'achat n'est trouvé, renvoyez 'NONE'. Texte:",
  pt: "Extraia apenas os itens de compra e quantidades deste texto. Retorne-os como uma lista separada por vírgulas. Se nenhum item de compra for encontrado, retorne 'NONE'. Texto:",
  ru: "Извлеките только товары для покупок и количества из этого текста. Верните их в виде списка, разделенного запятыми. Если товары для покупок не найдены, верните 'NONE'. Текст:",
  ar: "استخرج فقط عناصر التسوق والكميات من هذا النص. أرجعها كقائمة مفصولة بفواصل. إذا لم يتم العثور على عناصر تسوق، أرجع 'NONE'. النص:",
  hu: "Csak a vásárlási tételeket és mennyiségeket vedd ki ebből a szövegből. Add vissza őket vesszővel elválasztott listaként. Ha nem találsz vásárlási tételeket, add vissza a 'NONE'-t. Szöveg:",
  ja: "このテキストから買い物アイテムと数量のみを抽出してください。カンマ区切りのリストとして返してください。買い物アイテムが見つからない場合は「NONE」を返してください。テキスト:",
  nl: "Haal alleen de boodschappenartikelen en hoeveelheden uit deze tekst. Geef ze terug als een door komma's gescheiden lijst. Als er geen boodschappenartikelen worden gevonden, geef dan 'NONE' terug. Tekst:",
}

const modalTexts = {
  en: {
    title: "Select or take a photo",
    gallery: "Select from gallery",
    takePhoto: "Take a photo",
    cancel: "Cancel",
  },
  de: {
    title: "Foto auswählen oder machen",
    gallery: "Aus der Galerie auswählen",
    takePhoto: "Ein Foto machen",
    cancel: "Abbrechen",
  },
  es: {
    title: "Seleccionar o tomar una foto",
    gallery: "Seleccionar de la galería",
    takePhoto: "Tomar una foto",
    cancel: "Cancelar",
  },
  it: {
    title: "Seleziona o scatta una foto",
    gallery: "Seleziona dalla galleria",
    takePhoto: "Scatta una foto",
    cancel: "Annulla",
  },
  fr: {
    title: "Sélectionner ou prendre une photo",
    gallery: "Sélectionner dans la galerie",
    takePhoto: "Prendre une photo",
    cancel: "Annuler",
  },
  pt: {
    title: "Selecionar ou tirar uma foto",
    gallery: "Selecionar da galeria",
    takePhoto: "Tirar uma foto",
    cancel: "Cancelar",
  },
  nl: {
    title: "Selecteer of maak een foto",
    gallery: "Selecteer uit galerij",
    takePhoto: "Maak een foto",
    cancel: "Annuleren",
  },
  sv: {
    title: "Välj eller ta ett foto",
    gallery: "Välj från galleriet",
    takePhoto: "Ta ett foto",
    cancel: "Avbryt",
  },
  da: {
    title: "Vælg eller tag et foto",
    gallery: "Vælg fra galleriet",
    takePhoto: "Tag et foto",
    cancel: "Annuller",
  },
  fi: {
    title: "Valitse tai ota kuva",
    gallery: "Valitse galleriasta",
    takePhoto: "Ota kuva",
    cancel: "Peruuta",
  },
  no: {
    title: "Velg eller ta et bilde",
    gallery: "Velg fra galleri",
    takePhoto: "Ta et bilde",
    cancel: "Avbryt",
  },
  ru: {
    title: "Выбрать или сделать фото",
    gallery: "Выбрать из галереи",
    takePhoto: "Сделать фото",
    cancel: "Отмена",
  },
  zh: {
    title: "选择或拍照",
    gallery: "从图库中选择",
    takePhoto: "拍照",
    cancel: "取消",
  },
  ja: {
    title: "写真を選択または撮影",
    gallery: "ギャラリーから選択",
    takePhoto: "写真を撮る",
    cancel: "キャンセル",
  },
  ko: {
    title: "사진 선택 또는 촬영",
    gallery: "갤러리에서 선택",
    takePhoto: "사진 촬영",
    cancel: "취소",
  },
  ar: {
    title: "اختر أو التقط صورة",
    gallery: "اختر من المعرض",
    takePhoto: "التقط صورة",
    cancel: "إلغاء",
  },
  he: {
    title: "בחר או צלם תמונה",
    gallery: "בחר מהגלריה",
    takePhoto: "צלם תמונה",
    cancel: "ביטול",
  },
}

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
  he: "דבר בעברית",
}

const primerModal = {
  en: {
    title: "Voice Recognition",
    step1: "Press the 'Create New List' button and grant permission for voice recognition.",
    step2: "Then, just say out loud what you need to buy, for example:",
    step2Example: "'I need to buy 1 kilo of tomatoes, 200 grams of chicken, some lettuce, and a bit of chocolate'.",
    step3: "When you're done, press 'View List' to review your shopping list.",
    createList: "Create New List",
    nowNot: "Close",
  },
  es: {
    title: "Reconocimiento de Voz",
    step1: "Presiona el botón 'Crear Nueva Lista' y otorga permiso para el reconocimiento de voz.",
    step2: "Luego, simplemente di en voz alta lo que necesitas comprar, por ejemplo:",
    step2Example: "'Necesito comprar 1 kilo de tomates, 200 gramos de pollo, algo de lechuga y un poco de chocolate'.",
    step3: "Cuando hayas terminado, presiona 'Ver Lista' para revisar tu lista de compras.",
    createList: "Crear Nueva Lista",
    nowNot: "Cerrar",
  },
  de: {
    title: "Spracherkennung",
    step1: "Drücken Sie die Schaltfläche 'Neue Liste erstellen' und geben Sie die Erlaubnis für die Spracherkennung.",
    step2: "Sagen Sie dann einfach laut, was Sie kaufen müssen, zum Beispiel:",
    step2Example: "'Ich muss 1 Kilo Tomaten, 200 Gramm Hähnchen, etwas Salat und etwas Schokolade kaufen'.",
    step3: "Wenn Sie fertig sind, drücken Sie 'Liste anzeigen', um Ihre Einkaufsliste zu überprüfen.",
    createList: "Neue Liste erstellen",
    nowNot: "Schließen",
  },
  it: {
    title: "Riconoscimento Vocale",
    step1: "Premi il pulsante 'Crea nuova lista' e concede il permesso per il riconoscimento vocale.",
    step2: "Poi, dì ad alta voce ciò che devi comprare, per esempio:",
    step2Example: "'Devo comprare 1 chilo di pomodori, 200 grammi di pollo, un po' di lattuga e un po' di cioccolato'.",
    step3: "Quando hai finito, premi 'Visualizza lista' per rivedere la tua lista della spesa.",
    createList: "Crea nuova lista",
    nowNot: "Chiudi",
  },
  fr: {
    title: "Reconnaissance Vocale",
    step1: "Appuyez sur le bouton 'Créer une nouvelle liste' et accordez l'autorisation de reconnaissance vocale.",
    step2: "Ensuite, dites simplement à voix haute ce que vous devez acheter, par exemple:",
    step2Example:
      "'J'ai besoin d'acheter 1 kilo de tomates, 200 grammes de poulet, de la laitue et un peu de chocolat'.",
    step3: "Lorsque vous avez terminé, appuyez sur 'Voir la liste' pour vérifier votre liste de courses.",
    createList: "Créer une nouvelle liste",
    nowNot: "Fermer",
  },
  tr: {
    title: "Ses Tanıma",
    step1: "'Yeni Liste Oluştur' düğmesine basın ve ses tanıma için izin verin.",
    step2: "Sonra, ne almanız gerektiğini yüksek sesle söyleyin, örneğin:",
    step2Example: "'1 kilo domates, 200 gram tavuk, biraz marul ve biraz çikolata almam gerekiyor'.",
    step3: "İşiniz bittiğinde, alışveriş listenizi gözden geçirmek için 'Listeyi Görüntüle'ye basın.",
    createList: "Yeni Liste Oluştur",
    nowNot: "Kapat",
  },
  pt: {
    title: "Reconhecimento de Voz",
    step1: "Pressione o botão 'Criar Nova Lista' e conceda permissão para o reconhecimento de voz.",
    step2: "Em seguida, basta dizer em voz alta o que você precisa comprar, por exemplo:",
    step2Example:
      "'Preciso comprar 1 quilo de tomates, 200 gramas de frango, um pouco de alface e um pouco de chocolate'.",
    step3: "Quando terminar, pressione 'Ver Lista' para revisar sua lista de compras.",
    createList: "Criar Nova Lista",
    nowNot: "Fechar",
  },
  ru: {
    title: "Распознавание Голоса",
    step1: "Нажмите кнопку 'Создать новый список' и предоставьте разрешение на распознавание голоса.",
    step2: "Затем просто скажите вслух, что вам нужно купить, например:",
    step2Example: "'Мне нужно купить 1 кг помидоров, 200 грамм курицы, немного салата и немного шоколада'.",
    step3: "Когда закончите, нажмите 'Просмотреть список', чтобы просмотреть ваш список покупок.",
    createList: "Создать новый список",
    nowNot: "Закрыть",
  },
  ar: {
    title: "التعرف على الصوت",
    step1: "اضغط على زر 'إنشاء قائمة جديدة' ومنح الإذن للتعرف على الصوت.",
    step2: "ثم قل بصوت عالٍ ما تحتاج إلى شرائه، على سبيل المثال:",
    step2Example: "'أحتاج لشراء 1 كيلو من الطماطم، 200 جرام من الدجاج، بعض الخس وبعض الشوكولاتة'.",
    step3: "عند الانتهاء، اضغط على 'عرض القائمة' لمراجعة قائمة التسوق الخاصة بك.",
    createList: "إنشاء قائمة جديدة",
    nowNot: "إغلاق",
  },
  hu: {
    title: "Hangfelismerés",
    step1: "Nyomja meg az 'Új lista létrehozása' gombot és adja meg a hangfelismeréshez szükséges engedélyt.",
    step2: "Ezután mondja el hangosan, hogy mit kell vásárolnia, például:",
    step2Example: "'Vásárolnom kell 1 kg paradicsomot, 200 gramm csirkét, egy kis salátát és egy kis csokoládét'.",
    step3: "Ha végzett, nyomja meg a 'Lista megtekintése' gombot a bevásárlólista áttekintéséhez.",
    createList: "Új lista létrehozása",
    nowNot: "Bezárás",
  },
  ja: {
    title: "音声認識",
    step1: "'新しいリストを作成'ボタンを押して音声認識の許可を付与します。",
    step2: "次に、購入する必要があるものを声に出して言います。例えば:",
    step2Example: "'トマト1キロ、鶏肉200グラム、レタス、チョコレートを買う必要があります'。",
    step3: "終わったら、「リストを見る」ボタンを押して買い物リストを確認します。",
    createList: "新しいリストを作成",
    nowNot: "閉じる",
  },
  hi: {
    title: "आवाज पहचान:",
    step1: "'नई सूची बनाएं' बटन दबाएं और आवाज पहचान के लिए अनुमति दें।",
    step2: "फिर, जो आपको खरीदना है, उसे ज़ोर से कहें, उदाहरण के लिए:",
    step2Example: "'मुझे 1 किलो टमाटर, 200 ग्राम चिकन, थोड़ी सी सलाद और थोड़ी सी चॉकलेट खरीदनी है'।",
    step3: "जब आप समाप्त कर लें, तो अपनी खरीदारी की सूची की समीक्षा करने के लिए 'सूची देखें' दबाएं।",
    createList: "नई सूची बनाएं",
    nowNot: "अभी नहीं",
  },
  nl: {
    title: "Spraakherkenning",
    step1: "Druk op de knop 'Nieuwe lijst maken' en geef toestemming voor spraakherkenning.",
    step2: "Zeg dan hardop wat je moet kopen, bijvoorbeeld:",
    step2Example: "'Ik moet 1 kilo tomaten, 200 gram kip, wat sla en een beetje chocolade kopen'.",
    step3: "Druk op 'Lijst bekijken' om je boodschappenlijst te bekijken.",
    createList: "Nieuwe lijst maken",
    nowNot: "Close",
  },
}

const settingsModalTexts = {
  en: {
    title: "Oops!",
    message:
      "No words detected. Perhaps you didn't say anything or you may need to give permission for voice recognition in settings.",
    goSettings: "Go to Phone Settings",
    cancel: "Close",
    listening: "Listening...", 
    palabras: "💡 Shopping items appear highlighted in real-time", 
  },
  es: {
    title: "¡Upss!",
    message:
      "No hemos detectado palabras. Puede que no hayas dicho nada o quizás debas dar permiso de reconocimiento de voz en ajustes.",
    goSettings: "Ir a Ajustes del teléfono",
    cancel: "Cerrar",
    listening: "Escuchando...", 
    palabras: "💡 Los artículos de compra aparecen resaltados en tiempo real",
  },
  de: {
    title: "Hoppla!",
    message:
      "Keine Wörter erkannt. Vielleicht hast du nichts gesagt oder du musst die Spracherkennung in den Einstellungen aktivieren.",
    goSettings: "Zu den Telefoneinstellungen",
    cancel: "Schließen",
    listening: "Zuhören...",
    palabras: "💡 Einkaufsartikel werden in Echtzeit hervorgehoben",
  },
  it: {
    title: "Ops!",
    message:
      "Nessuna parola rilevata. Forse non hai detto nulla o devi concedere il permesso per il riconoscimento vocale nelle impostazioni.",
    goSettings: "Vai alle Impostazioni del telefono",
    cancel: "Chiudi",
    listening: "Ascoltando...",
    palabras: "💡 Gli articoli della spesa sono evidenziati in tempo reale",
  },
  fr: {
    title: "Oups !",
    message:
      "Aucun mot détecté. Peut-être que vous n'avez rien dit ou que vous devez autoriser la reconnaissance vocale dans les paramètres.",
    goSettings: "Aller aux paramètres du téléphone",
    cancel: "Fermer",
    listening: "Écoute...",
    palabras: "💡 Les articles d'achat apparaissent en surbrillance en temps réel",
  },
  tr: {
    title: "Hoppala!",
    message:
      "Hiçbir kelime algılanmadı. Belki hiçbir şey söylemediniz ya da ayarlardan ses tanıma izni vermeniz gerekiyor.",
    goSettings: "Telefon Ayarlarına Git",
    cancel: "Kapat",
    listening: "Dinleniyor...",
    palabras: "💡 Alışveriş öğeleri gerçek zamanlı olarak vurgulanır",
  },
  ptru: {
    title: "Ops!",
    message:
      "Nenhuma palavra detectada. Talvez você não tenha dito nada ou precise conceder permissão para o reconhecimento de voz nas configurações.",
    goSettings: "Ir para Configurações do telefone",
    cancel: "Fechar",
    listening: "Ouvindo...",
    palabras: "💡 Itens de compra aparecem destacados em tempo real",
  },
  arhu: {
    title: "عذرًا!",
    message:
      "لم يتم اكتشاف كلمات. ربما لم تقل شيئًا أو قد تحتاج إلى إعطاء إذن للتعرف على الصوت في الإعدادات.",
    goSettings: "اذهب إلى إعدادات الهاتف",
    cancel: "إغلاق",
    listening: "جارٍ الاستماع...",
    palabras: "💡 عناصر التسوق تظهر مميزة في الوقت الفعلي",
  },
  jahi: {
    title: "おっと！",
    message:
      "言葉が検出されませんでした。何も話していないか、音声認識の許可が必要かもしれません。",
    goSettings: "電話の設定へ移動",
    cancel: "閉じる",
    listening: "聞き取り中...",
    palabras: "💡 ショッピングアイテムがリアルタイムでハイライトされます",
  },
  nl: {
    title: "Oeps!",
    message:
      "Geen woorden gedetecteerd. Misschien heb je niets gezegd of moet je spraakherkenning toestaan in de instellingen.",
    goSettings: "Ga naar Telefooninstellingen",
    cancel: "Sluiten",
    listening: "Luisteren...",
    palabras: "💡 Boodschappenartikelen worden in realtime gemarkeerd",
  },
}

const rateAppTexts = {
  en: {
    rateTitle: "Do you like this App?",
    rateMessage: "It would really help us if you could give us a good rating!",
    rateButton: "Rate Us",
    notNowButton: "Not Now",
  },
  es: {
    rateTitle: "¿Te gusta esta App?",
    rateMessage: "Nos ayudaría mucho si pudieras darnos una buena puntuación!",
    rateButton: "Valorar",
    notNowButton: "Ahora no",
  },
  de: {
    rateTitle: "Gefällt Ihnen diese App?",
    rateMessage: "Es würde uns sehr helfen, wenn Sie uns eine gute Bewertung geben könnten!",
    rateButton: "Bewerten",
    notNowButton: "Nicht jetzt",
  },
  it: {
    rateTitle: "Ti piace questa app?",
    rateMessage: "Ci aiuterebbe molto se potessi darci una buona valutazione!",
    rateButton: "Valutaci",
    notNowButton: "Non ora",
  },
  fr: {
    rateTitle: "Aimez-vous cette application ?",
    rateMessage: "Cela nous aiderait vraiment si vous pouviez nous donner une bonne note !",
    rateButton: "Notez-nous",
    notNowButton: "Pas maintenant",
  },
  pt: {
    rateTitle: "Você gosta deste app?",
    rateMessage: "Realmente nos ajudaria se você pudesse nos dar uma boa avaliação!",
    rateButton: "Avalie-nos",
    notNowButton: "Agora não",
  },
  ru: {
    rateTitle: "Вам нравится это приложение?",
    rateMessage: "Это действительно поможет нам, если вы оставите хороший отзыв!",
    rateButton: "Оценить",
    notNowButton: "Не сейчас",
  },
  ar: {
    rateTitle: "هل تحب هذا التطبيق؟",
    rateMessage: "سيساعدنا كثيرًا إذا قمت بتقييمنا بشكل جيد!",
    rateButton: "قيمنا",
    notNowButton: "ليس الآن",
  },
  hu: {
    rateTitle: "Tetszik ez az alkalmazás?",
    rateMessage: "Nagyon segítene nekünk, ha jó értékelést adna nekünk!",
    rateButton: "Értékeljen minket",
    notNowButton: "Nem most",
  },
  ja: {
    rateTitle: "このアプリは気に入りましたか？",
    rateMessage: "良い評価をいただけると大変助かります！",
    rateButton: "評価する",
    notNowButton: "今はしない",
  },
  nl: {
    rateTitle: "Vind je deze app leuk?",
    rateMessage: "Het zou ons echt helpen als je ons een goede beoordeling zou kunnen geven!",
    rateButton: "Beoordeel ons",
    notNowButton: "Niet nu",
  },
}

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
}

const apiClient = axios.create({
  baseURL: API_KEY_CHAT,
  headers: {
    "Content-Type": "application/json",
  },
})

export const sendMessage = (message) => {
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  const promptLanguage = prompts[deviceLanguage] || prompts["en"]

  const promptMessage = `${promptLanguage} "${message}"`

  return apiClient.post("/", {
    model: "gpt-4.1",
    messages: [{ role: "user", content: promptMessage }],
    max_tokens: 100,
  })
}

// Nueva función para análisis en tiempo real
const analyzeTextRealTime = async (text) => {
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  const analysisPrompt = realTimeAnalysisPrompts[deviceLanguage] || realTimeAnalysisPrompts["en"]

  try {
    const response = await axios.post(API_KEY_ANALIZE, {
      model: "gpt-4.1",
      messages: [{ role: "user", content: `${analysisPrompt} "${text}"` }],
      max_tokens: 50,
    })
    
    const result = response.data.choices[0].message.content.trim()
    if (result === 'NONE' || result === '') {
      return []
    }
    
    // Dividir por comas y limpiar cada elemento
    return result.split(',').map(item => item.trim().toLowerCase())
  } catch (error) {
    console.error("Error analyzing text:", error)
    return []
  }
}

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme()
  const styles = getStyles(theme)
  const route = useRoute()
  const prompt = route.params?.prompt
  const initialList = route.params?.initialList
  const [recognized, setRecognized] = useState("")
  const [started, setStarted] = useState(false)
  const [results, setResults] = useState([])
  const [shoppingList, setShoppingList] = useState([])
  const [history, setHistory] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [editingText, setEditingText] = useState("")
  const [listModalVisible, setListModalVisible] = useState(false)
  const pulseAnim = useRef(new Animated.Value(1)).current
  const pulseAnime = useRef(new Animated.Value(1)).current
  const blinkAnim = useRef(new Animated.Value(1)).current
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  const currentLabels = texts[deviceLanguage] || texts["en"]
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [pressCount, setPressCount] = useState(0)
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true)
  const [titleFontSize, setTitleFontSize] = useState(23)
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const dishName = route.params?.dishName
  const closeModal = route.params?.closeModal
  const [showEmptyListText, setShowEmptyListText] = useState(true)
  const [listType, setListType] = useState("voice")
  const [expandMenu, setExpandMenu] = useState(true)
  const listModalRef = useRef(null)
  const modalText = modalTexts[deviceLanguage] || modalTexts["en"]
  const animationValue = useRef(new Animated.Value(0)).current
  const scrollY = useRef(new Animated.Value(0)).current
  const [lastResponse, setLastResponse] = useState("")
  const [country, setCountry] = useState("")
  const [estimatedCost, setEstimatedCost] = useState(null)
  const [countryModalVisible, setCountryModalVisible] = useState(false)
  const [isCountryEmpty, setIsCountryEmpty] = useState(true)
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false)
  const [showCreatingMessage, setShowCreatingMessage] = useState(false)
  const colorAnim = useRef(new Animated.Value(0)).current
  const [highlightedWords, setHighlightedWords] = useState([]) // Palabras identificadas por AI
  const [isLoading, setIsLoading] = useState(true)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editModalVisibleadd, setEditModalVisibleadd] = useState(false)
  const languageName = languageNames[deviceLanguage] || "English 🇺🇸"
  const [isIdiomasModalVisible, setIsIdiomasModalVisible] = useState(false)
  const [isContentVisible, setIsContentVisible] = useState(true)
  const [hasSeenSubscribeMessage, setHasSeenSubscribeMessage] = useState(false)
  const currentLabelse = primerModal[deviceLanguage] || primerModal["en"]
  const [primerModalVisible, setPrimerModalVisible] = useState(false)
  const [settingsModalVisible, setSettingsModalVisible] = useState(false)
  const [showRateButton, setShowRateButton] = useState(false)
  const rateTexts = rateAppTexts[deviceLanguage] || rateAppTexts["en"]
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Determinar si es tablet o teléfono
const isTablet = screenWidth >= 768;
  // Debounce para análisis en tiempo real
  const analysisTimeoutRef = useRef(null)

  // Create modernStyles here instead of importing
  const modernStyles = StyleSheet.create({
    // Main Container with Gradient Background
    mainContainer: {
      flex: 1,
      backgroundColor: "#e7ead2",
      paddingTop: 25
    },

    // Live Results Styles
    liveResultsContainer: {
      marginHorizontal: 16,
      marginVertical: 24,
    },
    liveResultsCard: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderRadius: 20,
      padding: 24,
      shadowColor: "#6366f1",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 10,
      borderWidth: 1,
      borderColor: "rgba(99, 102, 241, 0.1)",
    },
    listeningHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    pulsingDot: {
      width: 12,
      height: 12,
      backgroundColor: "#6366f1",
      borderRadius: 6,
      marginRight: 12,
    },
    listeningText: {
      fontSize: 18,
      fontWeight: "700",
      color: "#1f2937",
      letterSpacing: 0.5,
    },
    resultItem: {
      marginBottom: 12,
    },
    resultText: {
      fontSize: 16,
      lineHeight: 24,
    },
    highlightedWord: {
      fontWeight: "800",
      fontSize: 17,
      backgroundColor: "rgba(99, 102, 241, 0.15)",
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 8,
      textShadowColor: "rgba(99, 102, 241, 0.4)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
    },
    normalWord: {
      color: "#6b7280",
      fontSize: 16,
    },
    tipContainer: {
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: "rgba(99, 102, 241, 0.2)",
    },
    tipText: {
      fontSize: 14,
      color: "#6366f1",
      fontWeight: "600",
      textAlign: "center",
    },

    // Action Buttons Styles
    actionButtonsContainer: {
      paddingHorizontal: 16,
      paddingVertical: 24,
      borderTopWidth: 1,
      borderTopColor: "rgba(99, 102, 241, 0.1)",
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    deleteButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fef2f2",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "#fecaca",
      shadowColor: "#ef4444",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    deleteButtonText: {
      marginLeft: 8,
      color: "#ef4444",
      fontWeight: "700",
      fontSize: 14,
    },
    addButton: {
      backgroundColor: "#f9fafb",
      padding: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "#e5e7eb",
      shadowColor: "#6b7280",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    saveButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#ecfdf5",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "#a7f3d0",
      shadowColor: "#10b981",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    saveButtonText: {
      marginLeft: 8,
      color: "#10b981",
      fontWeight: "700",
      fontSize: 14,
    },

    // Voice Button Styles
    voiceButtonContainer: {
      alignItems: "center",
      paddingVertical: 40,
      backgroundColor: "transparent",
    },
    voiceButtonWrapper: {
      alignItems: "center",
    },
    voiceButton: {
      width: 90,
      height: 90,
      borderRadius: 45,
      alignItems: "center",
      justifyContent: "center",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.4,
      shadowRadius: 20,
      elevation: 15,
    },
    voiceButtonActive: {
      backgroundColor: "#ef4444",
      shadowColor: "#ef4444",
    },
    voiceButtonInactive: {
      backgroundColor: "#93b0b0",
      shadowColor: "#93b0b0",
    },
    voiceButtonSubtitle: {
      marginTop: 28,
      fontSize: 14,
      color: "#6b7280",
      textAlign: "center",
      maxWidth: 300,
      lineHeight: 20,
      fontWeight: "500",
    },

    // Empty State Styles
    emptyStateContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
      backgroundColor: "transparent",
    },
    emptyStateContent: {
      alignItems: "center",
    },
    iconContainer: {
      width: 140,
      height: 140,
      borderRadius: 70,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 32,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 8,
    },
emptyStateIcon: {
  backgroundColor: "#93b0b0",
  shadowColor: "#93b0b0",
  borderWidth: 4,
  borderColor: "#93b0b0",
  marginTop: 150,
  borderRadius: 20,
  // Usar porcentajes de la pantalla
  width: screenWidth * (isTablet ? 0.5 : 0.7),    // 50% en tablet, 70% en teléfono
  height: screenHeight * (isTablet ? 0.4 : 0.35), // 40% en tablet, 35% en teléfono
},
    languageButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "rgba(99, 102, 241, 0.2)",
      shadowColor: "#6366f1",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
    languageButtonText: {
      marginLeft: 12,
      color: "#374151",
      fontWeight: "600",
      fontSize: 15,
    },

    // Creating Message Styles
    creatingContainer: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 32,
      backgroundColor: "transparent",
    },
    creatingHeader: {
      alignItems: "center",
      marginBottom: 32,
    },
    micContainer: {
      alignItems: "center",
    },
    micIconWrapper: {
      width: 80,
      height: 80,
      backgroundColor: "#6366f1",
      borderRadius: 40,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
      shadowColor: "#6366f1",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 10,
    },
    creatingTitle: {
      fontSize: 20,
      fontWeight: "700",
      textAlign: "center",
      marginBottom: 12,
      letterSpacing: 0.5,
    },
    creatingSubtitle: {
      color: "#6b7280",
      textAlign: "center",
      fontSize: 14,
      fontWeight: "500",
    },
    processingContainer: {
      alignItems: "center",
      marginTop: 32,
    },
    processingHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    processingDot: {
      width: 8,
      height: 8,
      backgroundColor: "#6366f1",
      borderRadius: 4,
      marginHorizontal: 8,
    },
    processingText: {
      fontSize: 18,
      fontWeight: "700",
      color: "#1f2937",
      letterSpacing: 0.5,
    },
    showListButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#10b981",
      paddingHorizontal: 28,
      paddingVertical: 16,
      borderRadius: 20,
      shadowColor: "#10b981",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    showListButtonText: {
      marginLeft: 12,
      color: "white",
      fontWeight: "800",
      fontSize: 16,
      letterSpacing: 0.5,
    },

    // List Item Styles
    flatList: {
      flex: 1,
      backgroundColor: "transparent",
    },
    flatListContent: {
      paddingBottom: 20,
      paddingTop: 40,
    },
    listItem: {
      marginHorizontal: 16,
      marginBottom: 12,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderRadius: 20,
      padding: 18,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      shadowColor: "#6366f1",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
      borderLeftWidth: 4,
      borderLeftColor: "#6366f1",
    },
    listItemContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    bulletPoint: {
      width: 12,
      height: 12,
      backgroundColor: "#6366f1",
      borderRadius: 6,
      marginRight: 16,
    },
    listItemText: {
      color: "#1f2937",
      fontWeight: "600",
      fontSize: 16,
      flex: 1,
      letterSpacing: 0.3,
    },
    listItemActions: {
      flexDirection: "row",
      alignItems: "center",
    },
    editButton: {
      backgroundColor: "#eff6ff",
      padding: 10,
      borderRadius: 12,
      marginRight: 8,
    },
    removeButton: {
      backgroundColor: "#fef2f2",
      padding: 10,
      borderRadius: 12,
    },

    // Cost and Add Item Styles
    costButtonWrapper: {
      marginHorizontal: 16,
      marginBottom: 16,
    },
    costButton: {
      backgroundColor: "#8b5cf6",
      padding: 18,
      borderRadius: 20,
      shadowColor: "#8b5cf6",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    costButtonText: {
      color: "white",
      fontWeight: "800",
      textAlign: "center",
      fontSize: 16,
      letterSpacing: 0.5,
    },
    addItemWrapper: {
      marginHorizontal: 16,
      marginBottom: 16,
    },
    addItemButton: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderWidth: 2,
      borderColor: "#d1d5db",
      borderStyle: "dashed",
      padding: 18,
      borderRadius: 20,
      alignItems: "center",
      shadowColor: "#6b7280",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    addItemText: {
      marginTop: 8,
      color: "#6b7280",
      fontWeight: "600",
      fontSize: 15,
    },

    // Modal Styles
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: 20,
    },
    modalContaineri: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: 20,
    
    },
    modalContaineris: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: 20,
    },
    modalContaineridiomas: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContentidiomas: {
      backgroundColor: "white",
      borderRadius: 20,
      padding: 30,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 15,
      width: "85%",
    },
    modalView: {
      backgroundColor: "white",
      borderRadius: 20,
      padding: 30,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 15,
      width: "90%",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "white",
      marginBottom: 20,
      textAlign: "center",
    },
    modalTitleprimermodal: {
      fontSize: 22,
      fontWeight: "800",
      color: "#1f2937",
      marginBottom: 24,
      textAlign: "center",
    },
    modalInput: {
      borderWidth: 1,
      borderColor: "#d1d5db",
      borderRadius: 12,
      padding: 15,
      fontSize: 16,
      backgroundColor: "#f9fafb",
      width: "100%",
      marginBottom: 20,
    },
    modalButton: {
      backgroundColor: "#6366f1",
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#6366f1",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
      marginBottom: 10,
    },
    modalButtonnos: {
      backgroundColor: "#6b7280",
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#6b7280",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    modalButtonText: {
      color: "white",
      fontWeight: "700",
      fontSize: 18,
      marginLeft: 8,
    },

    modalButtonTextclose: {
      color: "white",
      fontWeight: "700",
      fontSize: 21,



    },

    
    modalButtonTexteidi: {
      fontSize: 18,
      fontWeight: "700",
      color: "#1f2937",
      marginBottom: 20,
    },
    modalButtonTexte: {
      fontSize: 16,
      color: "#6b7280",
      textAlign: "center",
      marginTop: 20,
    },
    modalImage: {
      width: 80,
      height: 80,
      tintColor: "#6366f1",
    },
    closeButton: {
      position: "absolute",
      top: 15,
      right: 15,
      padding: 5,
    },
    modalText: {
      fontSize: 16,
      color: "#374151",
      textAlign: "center",
      lineHeight: 24,
      marginBottom: 15,
    },
    modalTextex: {
      fontSize: 14,
      color: "#6b7280",
      textAlign: "center",
      fontStyle: "italic",
      marginBottom: 20,
      paddingHorizontal: 10,
    },
    stepContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
      paddingHorizontal: 10,
    },
    circle: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: "#6366f1",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 15,
    },
    circleText: {
      color: "white",
      fontWeight: "700",
      fontSize: 14,
    },

    // Settings Modal Styles
    primermodalView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    scrollViewContent: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalButtonSettins: {
      backgroundColor: "#6366f1",
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 12,
      marginBottom: 15,
      shadowColor: "#6366f1",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
      marginTop: 20,
    },
    modalButtonTextSettins: {
      color: "white",
      fontWeight: "700",
      fontSize: 16,
      textAlign: "center",
    },
    modalButtonno: {
      backgroundColor: "#ef4444",
      padding: 12,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20
    },

    // Confirmation Modal
    confirmationModalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    confirmationModalContent: {
      backgroundColor: "white",
      borderRadius: 20,
      padding: 30,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 15,
    },
    confirmationImage: {
      width: 60,
      height: 60,
      marginBottom: 20,
      tintColor: "#10b981",
    },
    confirmationText: {
      fontSize: 18,
      fontWeight: "700",
      color: "#1f2937",
      textAlign: "center",
    },

    // Subscription Banner
    subscriptionBanner: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fef2f2",
      padding: 12,
      borderRadius: 12,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: "#fecaca",
    },
    subscriptionBannerText: {
      color: "#e91e63",
      fontWeight: "600",
      fontSize: 14,
    },

    // Close Icon
    closeIconContainer: {
      position: "absolute",
      top: 50,
      right: 30,
      zIndex: 1,
    },

    // Loading Overlay
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    loaderContainer: {
      backgroundColor: "white",
      borderRadius: 16,
      padding: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 10,
    },

    // Publicidad (if needed)
    publicidad: {
      // Add styles if needed
    },

    // Icon styles
    icon: {
      marginRight: 8,
    },

    // Legacy styles for compatibility
    itemContainer: {
      marginHorizontal: 16,
      marginBottom: 12,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderRadius: 20,
      padding: 18,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      shadowColor: "#6366f1",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
      borderLeftWidth: 4,
      borderLeftColor: "#6366f1",
    },
    itemText: {
      color: "#1f2937",
      fontWeight: "600",
      fontSize: 16,
      flex: 1,
      letterSpacing: 0.3,
    },
    iconsContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    editIcon: {
      color: "#6366f1",
      marginRight: 12,
    },
    closeIcon: {
      color: "#ef4444",
    },
    addButtonContainer: {
      marginHorizontal: 16,
      marginBottom: 16,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderWidth: 2,
      borderColor: "#d1d5db",
      borderStyle: "dashed",
      padding: 18,
      borderRadius: 20,
      alignItems: "center",
      shadowColor: "#6b7280",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    costButtonContaineriumage: {
      marginHorizontal: 16,
      marginBottom: 16,
      backgroundColor: "#8b5cf6",
      padding: 18,
      borderRadius: 20,
      shadowColor: "#8b5cf6",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },

    // Rate App Modal Styles
    rateModalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    rateModalContent: {
      backgroundColor: "white",
      borderRadius: 20,
      padding: 30,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 15,
      width: "85%",
    },
    rateModalTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "#1f2937",
      marginBottom: 16,
      textAlign: "center",
    },
    rateModalMessage: {
      fontSize: 16,
      color: "#6b7280",
      textAlign: "center",
      marginBottom: 24,
      lineHeight: 24,
    },
    rateModalButtons: {
      width: "100%",
    },
    rateButton: {
      backgroundColor: "#6366f1",
      paddingVertical: 14,
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: "#6366f1",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    rateButtonText: {
      color: "white",
      fontWeight: "700",
      fontSize: 16,
      textAlign: "center",
    },
    notNowButton: {
      backgroundColor: "#f3f4f6",
      paddingVertical: 14,
      borderRadius: 12,
    },
    notNowButtonText: {
      color: "#6b7280",
      fontWeight: "600",
      fontSize: 16,
      textAlign: "center",
    },
  })

  useEffect(() => {
    const updateAppOpenCount = async () => {
      const currentCountString = await AsyncStorage.getItem("appOpenCount")
      const appOpenCount = Number.parseInt(currentCountString || "0", 10)
      const hasRated = await AsyncStorage.getItem("hasRated")

      if (!hasRated && appOpenCount === 2) {
        await AsyncStorage.setItem("appOpenCount", (appOpenCount + 1).toString())
        setModalVisible(true)
      } else if (!hasRated) {
        await AsyncStorage.setItem("appOpenCount", (appOpenCount + 1).toString())
      }
    }

    updateAppOpenCount()
  }, [])

  const handleRateApp = async () => {
    const url = Platform.select({
      ios: "itms-apps://itunes.apple.com/app/id6505125372?action=write-review",
      android: "market://details?id=YOUR_ANDROID_PACKAGE_NAME",
    })

    try {
      await Linking.openURL(url)
      await AsyncStorage.setItem("hasRated", "true")
      setModalVisible(false)
    } catch (error) {
      console.error("Error opening app store:", error)
    }
  }

  const NumberCircle = ({ number }) => (
    <View style={modernStyles.circle}>
      <Text style={modernStyles.circleText}>{number}</Text>
    </View>
  )

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
        ]),
      ).start()
    }
    startPulsing()
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        const hasShownModal = await AsyncStorage.getItem("modalShown")
        if (!hasShownModal) {
          setPrimerModalVisible(true)
        }
      } catch (e) {
        console.error("Error reading AsyncStorage:", e)
      }
    })()
  }, [])

  const handleCloseprimerModal = async () => {
    try {
      await AsyncStorage.setItem("modalShown", "true")
      setPrimerModalVisible(false)
      startRecognizing()
    } catch (e) {
      console.error("Error saving to AsyncStorage:", e)
    }
  }

  const handleCloseprimerModalCerrar = async () => {
    try {
      await AsyncStorage.setItem("modalShown", "true")
      setPrimerModalVisible(false)
    } catch (e) {
      console.error("Error saving to AsyncStorage:", e)
    }
  }

  useEffect(() => {
    const checkSubscribeMessage = async () => {
      const hasSeen = await AsyncStorage.getItem("hasSeenSubscribeMessage")
      if (!hasSeen) {
        setHasSeenSubscribeMessage(true)
      }
    }
    checkSubscribeMessage()
  }, [])

  const handleSubscribePress = async () => {
    await AsyncStorage.setItem("hasSeenSubscribeMessage", "true")
    setHasSeenSubscribeMessage(false)
    navigation.navigate("Suscribe")
  }

  useEffect(() => {
    const checkVisibility = async () => {
      const value = await AsyncStorage.getItem("isContentVisible")
      if (value !== null) {
        setIsContentVisible(JSON.parse(value))
      }
    }

    checkVisibility()
  }, [])

  const listener = Purchases.addCustomerInfoUpdateListener((customerInfo) => {
    console.log("Información del cliente actualizada:", customerInfo)
    if (customerInfo.entitlements.active["12981"]) {
      console.log("Usuario ya suscrito")
      setIsSubscribed(true)
    } else {
      console.log("Usuario no suscrito")
      setIsSubscribed(false)
    }
  })

  useEffect(() => {
    const initializePurchases = async () => {
      try {
        await Purchases.setDebugLogsEnabled(true)
        await Purchases.configure({ apiKey: "appl_bHxScLAZLsKxfggiOiqVAZTXjJX" })

        const customerInfo = await Purchases.getCustomerInfo()
        console.log("Información del cliente:", customerInfo)

        if (customerInfo.entitlements.active["12981"]) {
          console.log("Usuario ya suscrito")
          setIsSubscribed(true)
        } else {
          console.log("Usuario no suscrito")
          setIsSubscribed(false)
        }
      } catch (error) {
        console.log("Error al obtener la información del comprador:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const handleCustomerInfoUpdate = (info) => {
      console.log("Información del cliente actualizada:", info)
      if (info.entitlements.active["12981"]) {
        console.log("Usuario ya suscrito")
        setIsSubscribed(true)
      } else {
        console.log("Usuario no suscrito")
        setIsSubscribed(false)
      }
    }

    initializePurchases()

    return () => {
      Purchases.removeCustomerInfoUpdateListener(handleCustomerInfoUpdate)
    }
  }, [])

  const textColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#009688", "#00bcd4"],
  })

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
      ]),
    ).start()
  }, [colorAnim])

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadHistory()
    })

    return unsubscribe
  }, [navigation])

  useEffect(() => {
    const loadCountry = async () => {
      try {
        const savedCountry = await AsyncStorage.getItem("@country")
        if (savedCountry !== null) {
          setCountry(savedCountry)
          setIsCountryEmpty(savedCountry.trim() === "")
        }
      } catch (error) {
        console.error("Error loading country: ", error)
      }
    }

    loadCountry()
  }, [])

  const handleCountryChange = (text) => {
    setCountry(text)
    setIsCountryEmpty(text.trim() === "")
  }

  const handleSaveCountry = async () => {
    if (!isCountryEmpty) {
      try {
        if (!isSubscribed) {
          Alert.alert("Subscription Required", "You must be subscribed to calculate the estimated cost.", [
            {
              text: "Subscribe",
              onPress: () => {
                setCountryModalVisible(false)
                navigation.navigate("Suscribe")
              },
            },
            { text: "Cancel", style: "cancel" },
          ])
          return
        }

        await AsyncStorage.setItem("@country", country)
        setCountryModalVisible(false)
        await fetchEstimatedCost()

        setTimeout(() => {
          if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true })
          }
        }, 200)
      } catch (error) {
        console.error("Error saving country: ", error)
      }
    }
  }

  const flatListRef = useRef(null)
  useEffect(() => {
    if (flatListRef.current && estimatedCost) {
      flatListRef.current.scrollToEnd({ animated: true })
    }
  }, [estimatedCost])

  const fetchEstimatedCost = async () => {
    setLoading(true)
    if (!country) {
      Alert.alert("Error", "Please enter a country.")
      return
    }

    const deviceLanguage = RNLocalize.getLocales()[0].languageCode
    const estimatePrompt = costEstimatePrompts[deviceLanguage] || costEstimatePrompts["en"]

    try {
      const response = await axios.post(API_KEY_ANALIZE, {
        model: "gpt-4.1",
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
      })
      const estimatedCostResponse = response.data.choices[0].message.content
      setEstimatedCost(`${estimatedCostResponse}`)
      setLoading(false)

      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true })
      }
    } catch (error) {
      console.error("Error fetching estimated cost: ", error)
      Alert.alert("Error", "Could not fetch the estimated cost.")
      setLoading(false)
    }
  }

  useEffect(() => {
    Animated.timing(animationValue, {
      toValue: expandMenu ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [expandMenu])

  useEffect(() => {
    setShoppingList([])
    setShowEmptyListText(true)
  }, [listType])

  useEffect(() => {
    if (shoppingList.length > 0) {
      setShowEmptyListText(false)
    } else {
      setShowEmptyListText(true)
    }
  }, [shoppingList])

  useEffect(() => {
    if (history.length > 0 || shoppingList.length > 0) {
      setTitleFontSize(16)
    } else {
      setTitleFontSize(23)
    }
  }, [history, shoppingList])

  useEffect(() => {
    const initializePressCount = async () => {
      try {
        const count = await AsyncStorage.getItem("@press_count")
        if (count !== null) {
          setPressCount(Number.parseInt(count))
        }
      } catch (e) {
        console.error("Error loading press count: ", e)
      }
    }

    const listener = Purchases.addCustomerInfoUpdateListener((customerInfo) => {
      if (customerInfo.entitlements.active["semana16"]) {
        setIsSubscribed(true)
      } else {
        setIsSubscribed(false)
      }
    })

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
      ]),
    ).start()

    loadHistory()
    Voice.onSpeechStart = onSpeechStart
    Voice.onSpeechRecognized = onSpeechRecognized
    Voice.onSpeechResults = onSpeechResults

    return () => {
      Voice.destroy().then(Voice.removeAllListeners)
    }
  }, [prompt])

  const onSpeechStart = () => {
    setStarted(true)
    setShowEmptyListText(false)
    setShowWelcomeMessage(false)
    setShowResults(false)
    setLoading(false)
    setShowCreatingMessage(true)
    startPulseAnimation()
    setEstimatedCost(null)
    setHighlightedWords([]) // Limpiar palabras resaltadas anteriores
  }

  const onSpeechRecognized = () => {
    setRecognized("√")
  }

  const onSpeechResults = async (e) => {
    const items = e.value
    setResults(items)

    // Análisis en tiempo real con debounce
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current)
    }

    analysisTimeoutRef.current = setTimeout(async () => {
      if (items.length > 0) {
        const latestText = items[items.length - 1]
        const identifiedItems = await analyzeTextRealTime(latestText)
        setHighlightedWords(identifiedItems)
      }
    }, 500) // Esperar 500ms después de la última actualización
  }

  const renderLiveResults = () => {
    const deviceLanguage = RNLocalize.getLocales()[0].languageCode
    const primerModal = settingsModalTexts[deviceLanguage] || settingsModalTexts["en"]
    
    return (
      <View style={modernStyles.liveResultsContainer}>
        <View style={modernStyles.liveResultsCard}>
          <View style={modernStyles.listeningHeader}>
            <View style={modernStyles.pulsingDot} />
            <Text style={modernStyles.listeningText}> {primerModal.listening}</Text>
          </View>

          {results.map((item, index) => (
            <View key={index} style={modernStyles.resultItem}>
              <Text style={modernStyles.resultText}>
                {item.split(" ").map((word, idx) => {
                  const cleanedWord = word.replace(/[.,!?]/g, "").toLowerCase()
                  const isHighlighted = highlightedWords.some(highlightedWord => 
                    cleanedWord.includes(highlightedWord) || highlightedWord.includes(cleanedWord)
                  )

                  return (
                    <Text key={idx}>
                      {isHighlighted ? (
                        <Animated.Text style={[modernStyles.highlightedWord, { color: textColor }]}>
                          {word}
                        </Animated.Text>
                      ) : (
                        <Text style={modernStyles.normalWord}>{word}</Text>
                      )}{" "}
                    </Text>
                  )
                })}
              </Text>
            </View>
          ))}

          <View style={modernStyles.tipContainer}>
            <Text style={modernStyles.tipText}>{primerModal.palabras}</Text>
          </View>
        </View>
      </View>
    )
  }

  const languageMap = {
    en: "en-US",
    es: "es-ES",
    de: "de-DE",
    fr: "fr-FR",
    it: "it-IT",
    pt: "pt-PT",
    nl: "nl-NL",
    sv: "sv-SE",
    da: "da-DK",
    fi: "fi-FI",
    no: "no-NO",
    ru: "ru-RU",
    zh: "zh-CN",
    ja: "ja-JP",
    ko: "ko-KR",
    ar: "ar-SA",
    he: "he-IL",
  }

  const startRecognizing = async () => {
    const deviceLanguage = RNLocalize.getLocales()[0].languageCode
    const recognitionLanguage = languageMap[deviceLanguage] || "en-US"

    if (started) {
      try {
        await Voice.stop()
        setStarted(false)
        setShowEmptyListText(true)
        setHighlightedWords([]) // Limpiar palabras resaltadas
      } catch (e) {
        console.error(e)
        Alert.alert("Error", "Error stopping voice recognition.")
      }
    } else {
      try {
        await Voice.start(recognitionLanguage)
        setRecognized("")
        setResults([])
        setStarted(true)
        setHighlightedWords([]) // Limpiar palabras resaltadas al iniciar
        if (!isSubscribed) {
          const newPressCount = pressCount + 1
          setPressCount(newPressCount)
          await AsyncStorage.setItem("@press_count", newPressCount.toString())
        }
      } catch (e) {
        console.error(e)
        Alert.alert("Error", `Error starting voice recognition in ${recognitionLanguage}.`)
      }
    }
  }

  const openAppSettings = () => {
    Linking.openSettings()
  }

  const stopRecognizing = async () => {
    try {
      setLoading(true)
      setShowCreatingMessage(false)

      // Limpiar timeout de análisis
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current)
      }

      setTimeout(async () => {
        await Voice.stop()
        setStarted(false)

        if (results.length === 0) {
          setShowEmptyListText(true)
          setShowResults(false)
          setLoading(false)
          setSettingsModalVisible(true)
          setHighlightedWords([]) // Limpiar palabras resaltadas
          return
        }

        const detectedDishName = results.find((item) => item.toLowerCase().includes("para hacer")) || null
        const cleanedDishName = detectedDishName ? detectedDishName.replace(/.*para hacer\s*/i, "").trim() : null

        if (cleanedDishName) {
          navigation.setParams({ dishName: cleanedDishName })
        }

        const response = await sendMessage(results.join(", "))
        const generatedList = response.data.choices[0].message.content.split("\n").map((item) => item.trim())
        setShoppingList(generatedList)
        saveShoppingList(generatedList)

        setLastResponse(response.data.choices[0].message.content)

        if (generatedList.length > 0) {
          setShowEmptyListText(false)
          setShowResults(true)
        } else {
          setShowEmptyListText(true)
          setShowResults(false)
        }

        setLoading(false)
        setHighlightedWords([]) // Limpiar palabras resaltadas después de procesar
      }, 500)
    } catch (e) {
      console.error(e)
      Alert.alert("Error", "Error stopping voice recognition.")
      setLoading(false)
      setHighlightedWords([]) // Limpiar palabras resaltadas en caso de error
    }
  }

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
      ]),
    ).start()
  }

  const saveEditedItem = () => {
    const newList = [...shoppingList]
    newList[editingIndex] = editingText
    setShoppingList(newList)
    saveShoppingList(newList)
    setEditingText("")
    setEditModalVisible(false)
  }

  const saveEditedItemadd = () => {
    if (editingText.trim() !== "") {
      const newList = [...shoppingList, editingText]
      setShoppingList(newList)
      saveShoppingList(newList)
    }
    setEditingText("")
    setEditModalVisibleadd(false)
  }

  const closeEditModalAdd = () => {
    setEditingText("")
    setEditModalVisibleadd(false)
  }

  const editItem = (index) => {
    setEditingIndex(index)
    setEditingText(shoppingList[index])
    setEditModalVisible(true)
    setEstimatedCost(null)
  }

  const renderItem = ({ item, index }) => {
    if (item === currentLabels.costdelalista) {
      return (
        <TouchableOpacity onPress={() => setCountryModalVisible(true)}>
          <View style={modernStyles.costButtonContaineriumage}>
            <Text style={modernStyles.costButtonText}>{estimatedCost || item}</Text>
          </View>
        </TouchableOpacity>
      )
    }

    if (index === shoppingList.length) {
      return (
        <TouchableOpacity onPress={() => addNewItem()}>
          <View style={modernStyles.addButtonContainer}>
            <Ionicons name="add-circle" size={32} color="grey" />
          </View>
        </TouchableOpacity>
      )
    }
    return (
      <View style={modernStyles.itemContainer}>
        <Text style={modernStyles.itemText}>{item}</Text>
        <View style={modernStyles.iconsContainer}>
          <TouchableOpacity onPress={() => editItem(index)}>
            <Ionicons name="pencil" size={24} style={modernStyles.editIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => removeItem(index)}>
            <Ionicons name="close" size={28} style={modernStyles.closeIcon} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const addNewItem = () => {
    setEditingText("")
    setEditModalVisibleadd(true)
    setEstimatedCost(null)
  }

  const clearShoppingList = () => {
    setShoppingList([])
    saveShoppingList([])
  }

  const removeItem = (index) => {
    const newList = [...shoppingList]
    newList.splice(index, 1)
    setShoppingList(newList)
    saveShoppingList(newList)
    setEstimatedCost(null)
  }

  const saveShoppingList = async (list) => {
    try {
      await AsyncStorage.setItem("@shopping_list", JSON.stringify(list))
    } catch (e) {
      console.error("Error saving shopping list: ", e)
    }
  }

  const generateGenericListName = () => {
    const existingNumbers = history
      .map((item) => {
        const match = item.name.match(/^.* (\d+)$/)
        return match ? Number.parseInt(match[1], 10) : null
      })
      .filter((number) => number !== null)

    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1
    return `${currentLabels.list} ${nextNumber}`
  }

  const saveToHistory = async () => {
    if (shoppingList.length === 0) return

    const providedDishName = route.params?.dishName
    const newDishName = providedDishName || generateGenericListName()
    const newHistory = [...history, { list: shoppingList, name: newDishName }]

    try {
      await AsyncStorage.setItem("@shopping_history", JSON.stringify(newHistory))
      setHistory(newHistory)
      setShoppingList([])
      await AsyncStorage.setItem("@shopping_list", JSON.stringify([]))
      setModalVisible(false)
      setConfirmationModalVisible(true)
      navigation.setParams({ dishName: null })
      setTimeout(() => setConfirmationModalVisible(false), 2000)
    } catch (e) {
      console.error("Error saving to history: ", e)
    }
  }

  const handlePress = () => {
    setIsIdiomasModalVisible(true)
    setIsContentVisible(false)
    AsyncStorage.setItem("isContentVisible", JSON.stringify(false))
  }

  const handleCloseModal = () => {
    setIsIdiomasModalVisible(false)
    setIsContentVisible(false)
  }

  const ConfirmationModal = () => (
    <Modal visible={confirmationModalVisible} transparent={true} animationType="fade">
      <View style={modernStyles.confirmationModalContainer}>
        <View style={modernStyles.confirmationModalContent}>
          <Image source={require("../assets/images/checked.png")} style={modernStyles.confirmationImage} />
          <Text style={modernStyles.confirmationText}>{currentLabels.listSaved}</Text>
        </View>
      </View>
    </Modal>
  )

  const SettingsModal = ({ visible, onClose, onOpenSettings }) => {
    const deviceLanguage = RNLocalize.getLocales()[0].languageCode
    const currentLabels = settingsModalTexts[deviceLanguage] || settingsModalTexts["en"]

    return (
      <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
        <View style={modernStyles.primermodalView}>
          <ScrollView contentContainerStyle={modernStyles.scrollViewContent}>
            <View style={modernStyles.modalView}>
              <Text style={modernStyles.modalTitleprimermodal}>{currentLabels.title}</Text>
              <Text style={modernStyles.modalText}>{currentLabels.message}</Text>
            </View>
            <TouchableOpacity style={modernStyles.modalButtonSettins} onPress={onOpenSettings}>
              <Text style={modernStyles.modalButtonTextSettins}>{currentLabels.goSettings}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={modernStyles.modalButtonno} onPress={onClose}>
              <Ionicons name="close" size={32} color="white" style={modernStyles.icon} />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    )
  }

  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem("@shopping_history")
      if (savedHistory !== null) {
        setHistory(JSON.parse(savedHistory))
      }
    } catch (e) {
      console.error("Error loading history: ", e)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  const renderVoiceButton = () => {
    if (shoppingList.length > 0) {
      return (
        <View style={modernStyles.actionButtonsContainer}>
          <View style={modernStyles.buttonRow}>
            {/* Delete Button */}
            {shoppingList.length > 0 && !started && !loading && (
              <TouchableOpacity style={modernStyles.deleteButton} onPress={clearShoppingList}>
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
                <Text style={modernStyles.deleteButtonText}>{currentLabels.deleteList}</Text>
              </TouchableOpacity>
            )}

            {/* Add Button */}
            {shoppingList.length > 0 && !started && !loading && (
              <TouchableOpacity style={modernStyles.addButton} onPress={() => addNewItem()}>
                <Ionicons name="add-circle" size={28} color="#6b7280" />
              </TouchableOpacity>
            )}

            {/* Save Button */}
            {shoppingList.length > 0 && !started && !loading && (
              <TouchableOpacity style={modernStyles.saveButton} onPress={saveToHistory}>
                <Ionicons name="checkmark-circle-outline" size={22} color="#10b981" />
                <Text style={modernStyles.saveButtonText}>{currentLabels.saveList}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )
    } else {
      return (
        <View style={modernStyles.voiceButtonContainer}>
          <TouchableOpacity
            onPress={started ? stopRecognizing : startRecognizing}
            style={modernStyles.voiceButtonWrapper}
          >
            <Animated.View
              style={[
                modernStyles.voiceButton,
                { transform: [{ scale: pulseAnim }] },
                started ? modernStyles.voiceButtonActive : modernStyles.voiceButtonInactive,
              ]}
            >
              {started ? (
                <Ionicons name="stop" size={32} color="white" />
              ) : (
                <Ionicons name="mic-outline" size={34} color="white" />
              )}
            </Animated.View>

            {!started && (
              <Text style={modernStyles.voiceButtonSubtitle}>
                {currentLabels.voiceLists}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )
    }
  }

  return (
    <SafeAreaView style={modernStyles.mainContainer}>
      <View style={modernStyles.publicidad}>
        <SettingsModal
          visible={settingsModalVisible}
          onClose={() => setSettingsModalVisible(false)}
          onOpenSettings={openAppSettings}
        />
      </View>
      
      {loading && (
        <View style={modernStyles.overlay}>
          <View style={modernStyles.loaderContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
          </View>
        </View>
      )}

      {!loading && showEmptyListText && !showCreatingMessage && (
        <View style={modernStyles.emptyStateContainer}>
          <View style={modernStyles.emptyStateContent}>
            <View style={modernStyles.iconContainer}>
              <Image
                source={require("../assets/images/56643483-cfa4-4b4e-a5ca-2e751345bad0-1.png")}
                style={modernStyles.emptyStateIcon}
              />
            </View>

            {isContentVisible && (
              <TouchableOpacity onPress={handlePress} style={modernStyles.languageButton}>
                <Ionicons name="globe-outline" size={20} color="#6366f1" />
                <Text style={modernStyles.languageButtonText}>
                  {currentLabels.welcomeMessage} {languageName}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {!loading && showCreatingMessage && (
        <View style={modernStyles.creatingContainer}>
          <View style={modernStyles.creatingHeader}>
            {results.length === 0 && (
              <View style={modernStyles.micContainer}>
                <View style={modernStyles.micIconWrapper}>
                  <Ionicons name="mic" size={28} color="white" />
                </View>
                <Animated.Text style={[modernStyles.creatingTitle, { color: textColor }]}>
                  {currentLabels.pressAndSpeaktext}
                </Animated.Text>
               
              </View>
            )}
          </View>

          {renderLiveResults()}

          {results.length > 0 && (
            <View style={modernStyles.processingContainer}>
              <View style={modernStyles.processingHeader}>
                <View style={modernStyles.processingDot} />
                <Text style={modernStyles.processingText}>{currentLabels.creandoLista}</Text>
                <View style={modernStyles.processingDot} />
              </View>

              <TouchableOpacity onPress={stopRecognizing} style={modernStyles.showListButton}>
                <Ionicons name="cart-outline" size={24} color="white" />
                <Text style={modernStyles.showListButtonText}>{currentLabels.mostarlista}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {!loading && showResults && (
        <FlatList
          ref={flatListRef}
          data={shoppingList.length > 0 ? [...shoppingList, currentLabels.costdelalista] : []}
          renderItem={({ item, index }) => {
            if (item === currentLabels.costdelalista) {
              return (
                <TouchableOpacity onPress={() => setCountryModalVisible(true)} style={modernStyles.costButtonWrapper}>
                  <View style={modernStyles.costButton}>
                    <Text style={modernStyles.costButtonText}>{estimatedCost || item}</Text>
                  </View>
                </TouchableOpacity>
              )
            }

            if (index === shoppingList.length) {
              return (
                <TouchableOpacity onPress={() => addNewItem()} style={modernStyles.addItemWrapper}>
                  <View style={modernStyles.addItemButton}>
                    <Ionicons name="add-circle" size={32} color="#6b7280" />
                    <Text style={modernStyles.addItemText}>Agregar artículo</Text>
                  </View>
                </TouchableOpacity>
              )
            }

            return (
              <View style={modernStyles.listItem}>
                <View style={modernStyles.listItemContent}>
                  <View style={modernStyles.bulletPoint} />
                  <Text style={modernStyles.listItemText}>{item}</Text>
                </View>

                <View style={modernStyles.listItemActions}>
                  <TouchableOpacity onPress={() => editItem(index)} style={modernStyles.editButton}>
                    <Ionicons name="pencil" size={18} color="#6366f1" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeItem(index)} style={modernStyles.removeButton}>
                    <Ionicons name="close" size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            )
          }}
          keyExtractor={(item, index) => index.toString()}
          style={modernStyles.flatList}
          contentContainerStyle={modernStyles.flatListContent}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        />
      )}

      {renderVoiceButton()}
      <ConfirmationModal />

      {/* Rate App Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={modernStyles.rateModalContainer}>
          <View style={modernStyles.rateModalContent}>
            <Text style={modernStyles.rateModalTitle}>{rateTexts.rateTitle}</Text>
            <Text style={modernStyles.rateModalMessage}>{rateTexts.rateMessage}</Text>
            <View style={modernStyles.rateModalButtons}>
              <TouchableOpacity style={modernStyles.rateButton} onPress={handleRateApp}>
                <Text style={modernStyles.rateButtonText}>{rateTexts.rateButton}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={modernStyles.notNowButton} onPress={() => setModalVisible(false)}>
                <Text style={modernStyles.notNowButtonText}>{rateTexts.notNowButton}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Other Modals */}
      <Modal visible={listModalVisible} animationType="slide" onRequestClose={() => setListModalVisible(false)}>
        <View style={modernStyles.modalContainer}>
          <Text style={modernStyles.modalTitle}>{currentLabels.createShoppingList}</Text>
          <TextInput
            style={modernStyles.modalInput}
            placeholder={currentLabels.writeItems}
            multiline
            value={editingText}
            onChangeText={setEditingText}
          />
          <TouchableOpacity
            style={modernStyles.modalButton}
            onPress={() => {
              const newList = editingText
                .split("\n")
                .map((item) => item.trim())
                .filter((item) => item)
              setShoppingList(newList)
              saveShoppingList(newList)
              setEditingText("")
              setListModalVisible(false)
            }}
          >
            <Text style={modernStyles.modalButtonText}>{currentLabels.save}</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        visible={countryModalVisible}
        animationType="slide"
        onRequestClose={() => setCountryModalVisible(false)}
        transparent={true}
      >
        <View style={modernStyles.modalContaineri}>
  
          {!isSubscribed && (
            <View style={modernStyles.subscriptionBanner}>
              <Ionicons name="lock-closed-outline" size={20} color="#e91e63" style={{ marginRight: 6 }} />
              <Text style={modernStyles.subscriptionBannerText}>Subscription Required</Text>
            </View>
          )}

          <TextInput
            style={modernStyles.modalInput}
            placeholder={currentLabels.cityNamePlaceholder}
            placeholderTextColor="#b8b8b8ab"
            value={country}
            onChangeText={handleCountryChange}
          />

          <TouchableOpacity
            style={[modernStyles.modalButton, isCountryEmpty && { backgroundColor: "#ccc" }]}
            onPress={handleSaveCountry}
            disabled={isCountryEmpty}
          >
            <Text style={modernStyles.modalButtonText}>{`${currentLabels.viewCost} ${country}`}</Text>
          </TouchableOpacity>
                  <TouchableOpacity style={modernStyles.closeIconContainer} onPress={() => setCountryModalVisible(false)}>
            <Ionicons name="close-circle" size={32} color="white" />
          </TouchableOpacity>

        </View>
      </Modal>

      <Modal
        visible={editModalVisible}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
        transparent={true}
      >
        <View style={modernStyles.modalContaineris}>
          <Text style={modernStyles.modalTitle}>{currentLabels.editItem}</Text>
          <TextInput
            style={modernStyles.modalInput}
            placeholder={currentLabels.writeItems}
            placeholderTextColor="#b8b8b8ab"
            multiline
            value={editingText}
            onChangeText={setEditingText}
          />
          <TouchableOpacity style={modernStyles.modalButton} onPress={saveEditedItem}>
            <Text style={modernStyles.modalButtonText}>{currentLabels.save}</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={editModalVisibleadd} animationType="slide" onRequestClose={closeEditModalAdd} transparent={true}>
        <View style={modernStyles.modalContaineris}>
      
          <TextInput
            style={modernStyles.modalInput}
            placeholder={currentLabels.writeHereWhatToAdd}
            placeholderTextColor="#b8b8b8ab"
            multiline
            value={editingText}
            onChangeText={setEditingText}
          />
          <TouchableOpacity style={modernStyles.modalButton} onPress={saveEditedItemadd}>
            <Text style={modernStyles.modalButtonText}>{currentLabels.addNewItembutton}</Text>
          </TouchableOpacity>


         
                  <TouchableOpacity style={modernStyles.closeIconContainer} onPress={saveEditedItemadd}>
            <Ionicons name="close-circle" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={isIdiomasModalVisible} transparent={true} animationType="slide" onRequestClose={handleCloseModal}>
        <View style={modernStyles.modalContaineridiomas}>
          <View style={modernStyles.modalContentidiomas}>
            <Text style={modernStyles.modalButtonTexteidi}>{languageName}</Text>
            <Image
              source={require("../assets/images/microfono.png")}
              style={modernStyles.modalImage}
            />
            <Text style={modernStyles.modalButtonTexte}>{currentLabels.changeLanguage}</Text>

            <TouchableOpacity onPress={handleCloseModal} style={modernStyles.closeButton}>
              <Ionicons name="close" size={32} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={primerModalVisible}
        onRequestClose={() => {
          setPrimerModalVisible(!primerModalVisible)
        }}
      >
        <View style={modernStyles.primermodalView}>
          <ScrollView contentContainerStyle={modernStyles.scrollViewContent}>
            <View style={modernStyles.modalView}>
              <Text style={modernStyles.modalTitleprimermodal}>{currentLabelse.title}</Text>
              <View style={modernStyles.stepContainer}>
                <NumberCircle number="1" />
                <Text style={modernStyles.modalText}>{currentLabelse.step1}</Text>
              </View>
              <View style={modernStyles.stepContainer}>
                <NumberCircle number="2" />
                <Text style={modernStyles.modalText}>{currentLabelse.step2}</Text>
              </View>
              <Text style={modernStyles.modalTextex}>{currentLabelse.step2Example}</Text>
              <View style={modernStyles.stepContainer}>
                <NumberCircle number="3" />
                <Text style={modernStyles.modalText}>{currentLabelse.step3}</Text>
              </View>
            </View>
            <TouchableOpacity style={modernStyles.modalButton} onPress={handleCloseprimerModal}>
              <Icon name="mic" size={25} color="white" style={modernStyles.icon} />
              <Text style={modernStyles.modalButtonText}>{currentLabelse.createList}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={modernStyles.modalButtonnos} onPress={handleCloseprimerModalCerrar}>
              <Icon name="close" size={25} color="white" style={modernStyles.icon} />
              <Text style={modernStyles.modalButtonText}>{currentLabelse.nowNot}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default HomeScreen