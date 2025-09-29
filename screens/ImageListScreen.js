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
  StyleSheet,
} from "react-native"

import axios from "axios"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as RNLocalize from "react-native-localize"
import { useNavigation, useRoute } from "@react-navigation/native"
import Purchases from "react-native-purchases"
import { useTheme } from "../ThemeContext"
import { useHaptic } from "../HapticContext"
import { launchCamera, launchImageLibrary } from "react-native-image-picker"
import texts from "./translations/texts"
import { translations } from "../translations"
import RNFS from "react-native-fs"
import { request, PERMISSIONS, RESULTS } from "react-native-permissions"
import DeviceInfo from 'react-native-device-info'
const { width, height } = Dimensions.get("window")
const screenWidth = width
const screenHeight = height
const isTablet = screenWidth >= 768;
const isSmallIPhone = Platform.OS === 'ios' && (screenWidth <= 375 || screenHeight <= 667)
const API_KEY_ANALIZE = process.env.API_KEY_ANALIZE
const API_KEY_CHAT = process.env.API_KEY_CHAT

const promptsAnalize = {
  en: "You are a helpful assistant that analyzes images of shopping lists. Respond in English and do not comment on anything, just add the items seen in the shopping list, and if the image does not contain items to generate a list, always look for the texts to make a list, if it is in another language, translate the products to the language you are asked.",
  es: "Eres un asistente útil que analiza imágenes de listas de compras. Responde en español y no comentes nada, solo añade los ítems vistos en la lista de la compra, y si la imagen no contiene ítems para generar una lista, busca siempre los textos para hacer una lista, si está en otro idioma traduce los productos al idioma que se te ha preguntado.",
  de: "Du bist ein hilfreicher Assistent, der Bilder von Einkaufslisten analysiert. Antworte auf Deutsch und kommentiere nichts, füge nur die Artikel hinzu, die in der Einkaufsliste zu sehen sind. Wenn das Bild keine Artikel enthält, suche immer nach Texten, um eine Liste zu erstellen. Wenn sie in einer anderen Sprache sind, übersetze die Produkte in die angeforderte Sprache.",
  it: "Sei un assistente utile che analizza immagini di liste della spesa. Rispondi in italiano e non fare commenti, aggiungi solo gli articoli presenti nella lista della spesa. Se l'immagine non contiene articoli per generare una lista, cerca sempre i testi per farne una. Se sono in un'altra lingua, traduci i prodotti nella lingua richiesta.",
  fr: "Tu es un assistant utile qui analyse des images de listes de courses. Réponds en français sans faire de commentaires, ajoute simplement les articles vus sur la liste de courses. Si l'image ne contient pas d'articles pour générer une liste, cherche toujours les textes pour en créer une. S'ils sont dans une autre langue, traduis les produits dans la langue demandée.",
  tr: "Sen, alışveriş listesi görüntülerini analiz eden yardımcı bir asistansın. Türkçe yanıt ver ve hiçbir yorum yapma, sadece alışveriş listesinde görülen ürünleri ekle. Görüntüde liste oluşturacak ürünler yoksa, her zaman metinleri ara ve bir liste oluştur. Eğer metin başka bir dildeyse, ürünleri istenilen dile çevir.",
  pt: "Você é um assistente útil que analisa imagens de listas de compras. Responda em português e não comente nada, apenas adicione os itens vistos na lista de compras. Se a imagem não contiver itens para gerar uma lista, sempre procure os textos para criar uma. Se estiver em outro idioma, traduza os produtos para o idioma solicitado.",
  ru: "Вы полезный помощник, который анализирует изображения списков покупок. Отвечайте на русском языке и не комментируйте, просто добавьте товары, видимые в списке покупок. Если изображение не содержит товаров для создания списка, всегда ищите тексты для создания списка. Если они на другом языке, переведите продукты на запрашиваемый язык.",
  ar: "أنت مساعد مفيد يحلل صور قوائم التسوق. أجب باللغة العربية ولا تعلق على أي شيء، فقط أضف العناصر الموجودة في قائمة التسوق. إذا لم تحتوي الصورة على عناصر لإنشاء قائمة، فابحث دائمًا عن النصوص لإنشاء قائمة. إذا كانت بلغة أخرى، ترجم المنتجات إلى اللغة المطلوبة.",
  hu: "Hasznos asszisztens vagy, aki bevásárlólisták képeit elemzi. Válaszolj magyarul és ne kommentálj semmit, csak add hozzá a bevásárlólistán látható termékeket. Ha a kép nem tartalmaz elemeket lista létrehozásához, mindig keress szövegeket lista készítéséhez. Ha más nyelven vannak, fordítsd le a termékeket a kért nyelvre.",
  ja: "あなたは買い物リストの画像を分析する有能なアシスタントです。日本語で回答し、コメントは一切せず、買い物リストに表示されている商品を追加してください。画像にリストを生成する商品が含まれていない場合は、常にテキストを探してリストを作成してください。別の言語で書かれている場合は、求められた言語に翻訳してください。",
  hi: "आप खरीदारी सूची की छवियों का विश्लेषण करने वाले एक सहायक हैं। हिंदी में उत्तर दें और कोई टिप्पणी न करें, बस खरीदारी सूची में दिखाई देने वाली वस्तुओं को जोड़ें। यदि छवि में सूची बनाने के लिए आइटम नहीं हैं, तो हमेशा सूची बनाने के लिए टेक्स्ट खोजें। यदि वे दूसरी भाषा में हैं, तो उत्पादों को अनुरोधित भाषा में अनुवाद करें।",
  nl: "Je bent een behulpzame assistent die afbeeldingen van boodschappenlijsten analyseert. Antwoord in het Nederlands en geef geen commentaar, voeg alleen de items toe die op de boodschappenlijst staan. Als de afbeelding geen items bevat om een lijst te genereren, zoek dan altijd naar teksten om een lijst te maken. Als deze in een andere taal zijn, vertaal de producten naar de gevraagde taal."
};


const costEstimatePrompts = {
  en: "You are an assistant that calculates the estimated cost of a shopping list in ${country}. Respond with the total cost.",
  es: "Eres un asistente que calcula el costo estimado de una lista de compras en ${country}. Responde siempre con el costo total o aproximado.",
  de: "Du bist ein Assistent, der die geschätzten Kosten einer Einkaufsliste in ${country} berechnet. Antworte mit den Gesamtkosten.",
  it: "Sei un assistente che calcola il costo stimato di una lista della spesa in ${country}. Rispondi con il costo totale.",
  fr: "Tu es un assistant qui calcule le coût estimé d'une liste de courses en ${country}. Réponds avec le coût total.",
  tr: "${country} ülkesindeki bir alışveriş listesinin tahmini maliyetini hesaplayan bir asistansın. Toplam maliyeti belirterek yanıt ver.",
  pt: "Você é um assistente que calcula o custo estimado de uma lista de compras em ${country}. Responda com o custo total.",
  ru: "Вы помощник, который рассчитывает примерную стоимость списка покупок в ${country}. Ответьте общей стоимостью.",
  ar: "أنت مساعد يحسب التكلفة التقديرية لقائمة التسوق في ${country}. أجب بالتكلفة الإجمالية.",
  hu: "Ön egy asszisztens, aki kiszámítja egy bevásárlólista becsült költségét ${country} országban. Válaszoljon a teljes költséggel.",
  ja: "あなたは${country}における買い物リストの推定費用を計算するアシスタントです。合計金額を答えてください。",
  hi: "आप ${country} में खरीदारी सूची की अनुमानित लागत की गणना करने वाले सहायक हैं। कुल लागत के साथ उत्तर दें।",
  nl: "Je bent een assistent die de geschatte kosten van een boodschappenlijst in ${country} berekent. Antwoord met de totale kosten."
};


const modalTexts = {
  en: {
    title: "Select or take a photo of your shopping list",
    gallery: "Select from gallery",
    takePhoto: "Take a photo",
    cancel: "Cancel",
  },
  es: {
    title: "Seleccionar o tomar una foto de tu lista de compras",
    gallery: "Seleccionar de la galería",
    takePhoto: "Tomar una foto",
    cancel: "Cancelar",
  },
  de: {
    title: "Wähle oder mache ein Foto deiner Einkaufsliste",
    gallery: "Aus der Galerie auswählen",
    takePhoto: "Ein Foto machen",
    cancel: "Abbrechen",
  },
  it: {
    title: "Seleziona o scatta una foto della tua lista della spesa",
    gallery: "Seleziona dalla galleria",
    takePhoto: "Scatta una foto",
    cancel: "Annulla",
  },
  fr: {
    title: "Sélectionner ou prendre une photo de votre liste de courses",
    gallery: "Choisir depuis la galerie",
    takePhoto: "Prendre une photo",
    cancel: "Annuler",
  },
  tr: {
    title: "Alışveriş listenin fotoğrafını seç veya çek",
    gallery: "Galeriden seç",
    takePhoto: "Fotoğraf çek",
    cancel: "İptal",
  },
  pt: {
    title: "Selecione ou tire uma foto da sua lista de compras",
    gallery: "Selecionar da galeria",
    takePhoto: "Tirar uma foto",
    cancel: "Cancelar",
  },
  ar: {
    title: "اختر أو التقط صورة لقائمة التسوق الخاصة بك",
    gallery: "اختر من المعرض",
    takePhoto: "التقط صورة",
    cancel: "إلغاء",
  },
  hu: {
    title: "Válasszon vagy készítsen fényképet a bevásárlólistájáról",
    gallery: "Választás a galériából",
    takePhoto: "Fénykép készítése",
    cancel: "Mégse",
  },
  ja: {
    title: "買い物リストの写真を選択または撮影してください",
    gallery: "ギャラリーから選択",
    takePhoto: "写真を撮る",
    cancel: "キャンセル",
  },
  hi: {
    title: "अपनी खरीदारी सूची की फोटो चुनें या लें",
    gallery: "गैलरी से चुनें",
    takePhoto: "फोटो लें",
    cancel: "रद्द करें",
  },
  nl: {
    title: "Selecteer of maak een foto van je boodschappenlijst",
    gallery: "Selecteren uit galerij",
    takePhoto: "Een foto maken",
    cancel: "Annuleren",
  },
};


const suscribeButtonTranslations = {
  en: "Subscribe to analyze shopping lists",
  es: "Suscríbete para poder analizar listas de compras",
  de: "Abonniere, um Einkaufslisten zu analysieren",
  it: "Iscriviti per analizzare le liste della spesa",
  fr: "Abonne-toi pour analyser des listes de courses",
  tr: "Alışveriş listelerini analiz etmek için abone ol",
  pt: "Assine para analisar listas de compras",
  ar: "اشترك لتحليل قوائم التسوق",
  ja: "買い物リストを分析するには購読してください",
  nl: "Abonneer je om boodschappenlijsten te analyseren"
};

const alertTexts = {
  en: {
    subscriptionRequired: "Subscription Required",
    subscriptionMessage: "You must be subscribed to calculate the estimated cost.",
    subscribe: "Subscribe",
    cancel: "Cancel",
    error: "Error",
    enterCountry: "Please enter a country.",
    couldNotFetchCost: "Could not fetch the estimated cost.",
    noValidAnalysis: "No valid analysis received.",
    couldNotAnalyze: "Could not analyze the image.",
    errorLoadingCountry: "Error loading country: ",
    errorSavingCountry: "Error saving country: ",
    errorSavingList: "Error saving shopping list: ",
    errorSavingHistory: "Error saving to history: ",
    failedCameraPermission: "Failed to request camera permission",
    failedGalleryPermission: "Failed to request gallery permission",
    errorAnalyzingImage: "Error analyzing the image: ",
    errorGettingCustomerInfo: "Error getting customer information:",
  },
  es: {
    subscriptionRequired: "Suscripción Requerida",
    subscriptionMessage: "Debes estar suscrito para calcular el costo estimado.",
    subscribe: "Suscribirse",
    cancel: "Cancelar",
    error: "Error",
    enterCountry: "Por favor ingresa un país.",
    couldNotFetchCost: "No se pudo obtener el costo estimado.",
    noValidAnalysis: "No se recibió un análisis válido.",
    couldNotAnalyze: "No se pudo analizar la imagen.",
    errorLoadingCountry: "Error al cargar el país: ",
    errorSavingCountry: "Error al guardar el país: ",
    errorSavingList: "Error al guardar la lista de compras: ",
    errorSavingHistory: "Error al guardar en el historial: ",
    failedCameraPermission: "Error al solicitar permiso de cámara",
    failedGalleryPermission: "Error al solicitar permiso de galería",
    errorAnalyzingImage: "Error al analizar la imagen: ",
    errorGettingCustomerInfo: "Error al obtener la información del comprador:",
  },
  de: {
    subscriptionRequired: "Abonnement erforderlich",
    subscriptionMessage: "Du musst abonniert sein, um die geschätzten Kosten zu berechnen.",
    subscribe: "Abonnieren",
    cancel: "Abbrechen",
    error: "Fehler",
    enterCountry: "Bitte gib ein Land ein.",
    couldNotFetchCost: "Geschätzte Kosten konnten nicht abgerufen werden.",
    noValidAnalysis: "Keine gültige Analyse erhalten.",
    couldNotAnalyze: "Bild konnte nicht analysiert werden.",
    errorLoadingCountry: "Fehler beim Laden des Landes: ",
    errorSavingCountry: "Fehler beim Speichern des Landes: ",
    errorSavingList: "Fehler beim Speichern der Einkaufsliste: ",
    errorSavingHistory: "Fehler beim Speichern im Verlauf: ",
    failedCameraPermission: "Kameraberechtigung konnte nicht angefordert werden",
    failedGalleryPermission: "Galerieberechtigung konnte nicht angefordert werden",
    errorAnalyzingImage: "Fehler beim Analysieren des Bildes: ",
    errorGettingCustomerInfo: "Fehler beim Abrufen der Kundendaten:",
  },
  it: {
    subscriptionRequired: "Abbonamento richiesto",
    subscriptionMessage: "Devi essere abbonato per calcolare il costo stimato.",
    subscribe: "Abbonati",
    cancel: "Annulla",
    error: "Errore",
    enterCountry: "Inserisci un paese.",
    couldNotFetchCost: "Impossibile recuperare il costo stimato.",
    noValidAnalysis: "Nessuna analisi valida ricevuta.",
    couldNotAnalyze: "Impossibile analizzare l'immagine.",
    errorLoadingCountry: "Errore nel caricamento del paese: ",
    errorSavingCountry: "Errore nel salvataggio del paese: ",
    errorSavingList: "Errore nel salvataggio della lista della spesa: ",
    errorSavingHistory: "Errore nel salvataggio nella cronologia: ",
    failedCameraPermission: "Richiesta di autorizzazione alla fotocamera non riuscita",
    failedGalleryPermission: "Richiesta di autorizzazione alla galleria non riuscita",
    errorAnalyzingImage: "Errore nell'analisi dell'immagine: ",
    errorGettingCustomerInfo: "Errore nel recupero delle informazioni del cliente:",
  },
  fr: {
    subscriptionRequired: "Abonnement requis",
    subscriptionMessage: "Vous devez être abonné pour calculer le coût estimé.",
    subscribe: "S’abonner",
    cancel: "Annuler",
    error: "Erreur",
    enterCountry: "Veuillez entrer un pays.",
    couldNotFetchCost: "Impossible d'obtenir le coût estimé.",
    noValidAnalysis: "Aucune analyse valide reçue.",
    couldNotAnalyze: "Impossible d'analyser l'image.",
    errorLoadingCountry: "Erreur lors du chargement du pays : ",
    errorSavingCountry: "Erreur lors de l’enregistrement du pays : ",
    errorSavingList: "Erreur lors de l’enregistrement de la liste de courses : ",
    errorSavingHistory: "Erreur lors de l’enregistrement de l’historique : ",
    failedCameraPermission: "Échec de la demande d’autorisation de la caméra",
    failedGalleryPermission: "Échec de la demande d’autorisation de la galerie",
    errorAnalyzingImage: "Erreur lors de l’analyse de l’image : ",
    errorGettingCustomerInfo: "Erreur lors de la récupération des informations du client :",
  },
  tr: {
    subscriptionRequired: "Abonelik Gerekli",
    subscriptionMessage: "Tahmini maliyeti hesaplamak için abone olmalısınız.",
    subscribe: "Abone Ol",
    cancel: "İptal",
    error: "Hata",
    enterCountry: "Lütfen bir ülke girin.",
    couldNotFetchCost: "Tahmini maliyet alınamadı.",
    noValidAnalysis: "Geçerli analiz alınamadı.",
    couldNotAnalyze: "Görüntü analiz edilemedi.",
    errorLoadingCountry: "Ülke yüklenirken hata: ",
    errorSavingCountry: "Ülke kaydedilirken hata: ",
    errorSavingList: "Alışveriş listesi kaydedilirken hata: ",
    errorSavingHistory: "Geçmişe kaydedilirken hata: ",
    failedCameraPermission: "Kamera izni istenemedi",
    failedGalleryPermission: "Galeri izni istenemedi",
    errorAnalyzingImage: "Görüntü analiz edilirken hata: ",
    errorGettingCustomerInfo: "Müşteri bilgileri alınırken hata:",
  },
  pt: {
    subscriptionRequired: "Assinatura Necessária",
    subscriptionMessage: "Você precisa estar assinado para calcular o custo estimado.",
    subscribe: "Assinar",
    cancel: "Cancelar",
    error: "Erro",
    enterCountry: "Por favor, insira um país.",
    couldNotFetchCost: "Não foi possível obter o custo estimado.",
    noValidAnalysis: "Nenhuma análise válida recebida.",
    couldNotAnalyze: "Não foi possível analisar a imagem.",
    errorLoadingCountry: "Erro ao carregar o país: ",
    errorSavingCountry: "Erro ao salvar o país: ",
    errorSavingList: "Erro ao salvar a lista de compras: ",
    errorSavingHistory: "Erro ao salvar no histórico: ",
    failedCameraPermission: "Falha ao solicitar permissão da câmera",
    failedGalleryPermission: "Falha ao solicitar permissão da galeria",
    errorAnalyzingImage: "Erro ao analisar a imagem: ",
    errorGettingCustomerInfo: "Erro ao obter informações do cliente:",
  },
  ar: {
    subscriptionRequired: "الاشتراك مطلوب",
    subscriptionMessage: "يجب أن تكون مشتركًا لحساب التكلفة التقديرية.",
    subscribe: "اشترك",
    cancel: "إلغاء",
    error: "خطأ",
    enterCountry: "يرجى إدخال دولة.",
    couldNotFetchCost: "تعذر الحصول على التكلفة التقديرية.",
    noValidAnalysis: "لم يتم استلام تحليل صالح.",
    couldNotAnalyze: "تعذر تحليل الصورة.",
    errorLoadingCountry: "خطأ في تحميل الدولة: ",
    errorSavingCountry: "خطأ في حفظ الدولة: ",
    errorSavingList: "خطأ في حفظ قائمة التسوق: ",
    errorSavingHistory: "خطأ في الحفظ في السجل: ",
    failedCameraPermission: "فشل في طلب إذن الكاميرا",
    failedGalleryPermission: "فشل في طلب إذن المعرض",
    errorAnalyzingImage: "خطأ في تحليل الصورة: ",
    errorGettingCustomerInfo: "خطأ في الحصول على معلومات العميل:",
  },
  ja: {
    subscriptionRequired: "サブスクリプションが必要です",
    subscriptionMessage: "推定費用を計算するにはサブスクリプションが必要です。",
    subscribe: "購読する",
    cancel: "キャンセル",
    error: "エラー",
    enterCountry: "国名を入力してください。",
    couldNotFetchCost: "推定費用を取得できませんでした。",
    noValidAnalysis: "有効な分析が受信されませんでした。",
    couldNotAnalyze: "画像を分析できませんでした。",
    errorLoadingCountry: "国の読み込みエラー: ",
    errorSavingCountry: "国の保存エラー: ",
    errorSavingList: "買い物リストの保存エラー: ",
    errorSavingHistory: "履歴の保存エラー: ",
    failedCameraPermission: "カメラの許可リクエストに失敗しました",
    failedGalleryPermission: "ギャラリーの許可リクエストに失敗しました",
    errorAnalyzingImage: "画像の分析エラー: ",
    errorGettingCustomerInfo: "顧客情報の取得エラー:",
  },
  nl: {
    subscriptionRequired: "Abonnement vereist",
    subscriptionMessage: "Je moet een abonnement hebben om de geschatte kosten te berekenen.",
    subscribe: "Abonneren",
    cancel: "Annuleren",
    error: "Fout",
    enterCountry: "Voer een land in.",
    couldNotFetchCost: "Kon de geschatte kosten niet ophalen.",
    noValidAnalysis: "Geen geldige analyse ontvangen.",
    couldNotAnalyze: "Afbeelding kon niet worden geanalyseerd.",
    errorLoadingCountry: "Fout bij laden van land: ",
    errorSavingCountry: "Fout bij opslaan van land: ",
    errorSavingList: "Fout bij opslaan van boodschappenlijst: ",
    errorSavingHistory: "Fout bij opslaan in geschiedenis: ",
    failedCameraPermission: "Kon geen cameratoestemming aanvragen",
    failedGalleryPermission: "Kon geen galerijtoestemming aanvragen",
    errorAnalyzingImage: "Fout bij analyseren van afbeelding: ",
    errorGettingCustomerInfo: "Fout bij ophalen van klantinformatie:",
  }
};

const uiTexts = {
  en: {
    creatingList: "Creating list",
    analyzingImage: "Analyzing your image...",
    uploadImage: "Upload an image",
    uploadImageDescription: "Take a photo or select an image of your shopping list to analyze it automatically",
    saveList: "Save List",
    listSaved: "List Saved!",
    listName: "List Name",
    enterListName: "Enter list name",
    save: "Save",
    cancel: "Cancel",
    selectCountry: "Select Country",
    cityNamePlaceholder: "Enter city or country name",
    viewCost: "View cost in",
    subscriptionRequired: "Subscription Required",
    costOfList: "Cost of list",
    imageListPrefix: "Image List",
  },
  es: {
    creatingList: "Creando lista",
    analyzingImage: "Analizando tu imagen...",
    uploadImage: "Sube una imagen",
    uploadImageDescription:
      "Toma una foto o selecciona una imagen de tu lista de compras para analizarla automáticamente",
    saveList: "Guardar Lista",
    listSaved: "¡Lista Guardada!",
    listName: "Nombre de Lista",
    enterListName: "Ingrese nombre de lista",
    save: "Guardar",
    cancel: "Cancelar",
    selectCountry: "Seleccionar País",
    cityNamePlaceholder: "Ingresa el nombre de la ciudad o país",
    viewCost: "Ver costo en",
    subscriptionRequired: "Suscripción Requerida",
    costOfList: "Costo de la lista",
    imageListPrefix: "Lista por Imagen",
  },
  de: {
    creatingList: "Liste wird erstellt",
    analyzingImage: "Bild wird analysiert...",
    uploadImage: "Bild hochladen",
    uploadImageDescription: "Mache ein Foto oder wähle ein Bild deiner Einkaufsliste, um es automatisch zu analysieren",
    saveList: "Liste speichern",
    listSaved: "Liste gespeichert!",
    listName: "Listenname",
    enterListName: "Listennamen eingeben",
    save: "Speichern",
    cancel: "Abbrechen",
    selectCountry: "Land auswählen",
    cityNamePlaceholder: "Stadt- oder Landesname eingeben",
    viewCost: "Kosten anzeigen in",
    subscriptionRequired: "Abonnement erforderlich",
    costOfList: "Kosten der Liste",
    imageListPrefix: "Bildliste",
  },
  fr: {
    creatingList: "Création de la liste",
    analyzingImage: "Analyse de votre image...",
    uploadImage: "Téléverser une image",
    uploadImageDescription: "Prenez une photo ou sélectionnez une image de votre liste de courses pour l'analyser automatiquement",
    saveList: "Enregistrer la liste",
    listSaved: "Liste enregistrée !",
    listName: "Nom de la liste",
    enterListName: "Entrez le nom de la liste",
    save: "Enregistrer",
    cancel: "Annuler",
    selectCountry: "Sélectionner un pays",
    cityNamePlaceholder: "Entrez le nom de la ville ou du pays",
    viewCost: "Voir le coût en",
    subscriptionRequired: "Abonnement requis",
    costOfList: "Coût de la liste",
    imageListPrefix: "Liste d'image",
  },
  it: {
    creatingList: "Creazione lista",
    analyzingImage: "Analisi della tua immagine...",
    uploadImage: "Carica un'immagine",
    uploadImageDescription: "Scatta una foto o seleziona un'immagine della tua lista della spesa per analizzarla automaticamente",
    saveList: "Salva Lista",
    listSaved: "Lista Salvata!",
    listName: "Nome Lista",
    enterListName: "Inserisci nome lista",
    save: "Salva",
    cancel: "Annulla",
    selectCountry: "Seleziona Paese",
    cityNamePlaceholder: "Inserisci il nome della città o del paese",
    viewCost: "Visualizza costo in",
    subscriptionRequired: "Abbonamento richiesto",
    costOfList: "Costo della lista",
    imageListPrefix: "Lista Immagine",
  },
  tr: {
    creatingList: "Liste oluşturuluyor",
    analyzingImage: "Görüntünüz analiz ediliyor...",
    uploadImage: "Bir görüntü yükle",
    uploadImageDescription: "Alışveriş listenizin fotoğrafını çekin veya bir görüntü seçin, otomatik olarak analiz edilsin",
    saveList: "Liste Kaydet",
    listSaved: "Liste Kaydedildi!",
    listName: "Liste Adı",
    enterListName: "Liste adı girin",
    save: "Kaydet",
    cancel: "İptal",
    selectCountry: "Ülke Seç",
    cityNamePlaceholder: "Şehir veya ülke adı girin",
    viewCost: "Maliyeti görüntüle:",
    subscriptionRequired: "Abonelik Gerekli",
    costOfList: "Liste maliyeti",
    imageListPrefix: "Görüntü Listesi",
  },
  pt: {
    creatingList: "Criando lista",
    analyzingImage: "Analisando sua imagem...",
    uploadImage: "Carregar uma imagem",
    uploadImageDescription: "Tire uma foto ou selecione uma imagem da sua lista de compras para analisá-la automaticamente",
    saveList: "Salvar Lista",
    listSaved: "Lista Salva!",
    listName: "Nome da Lista",
    enterListName: "Digite o nome da lista",
    save: "Salvar",
    cancel: "Cancelar",
    selectCountry: "Selecionar País",
    cityNamePlaceholder: "Digite o nome da cidade ou país",
    viewCost: "Ver custo em",
    subscriptionRequired: "Assinatura Necessária",
    costOfList: "Custo da lista",
    imageListPrefix: "Lista de Imagem",
  },
  ru: {
    creatingList: "Создание списка",
    analyzingImage: "Анализ вашего изображения...",
    uploadImage: "Загрузить изображение",
    uploadImageDescription: "Сделайте фото или выберите изображение вашего списка покупок для автоматического анализа",
    saveList: "Сохранить список",
    listSaved: "Список сохранён!",
    listName: "Название списка",
    enterListName: "Введите название списка",
    save: "Сохранить",
    cancel: "Отмена",
    selectCountry: "Выбрать страну",
    cityNamePlaceholder: "Введите название города или страны",
    viewCost: "Посмотреть стоимость в",
    subscriptionRequired: "Требуется подписка",
    costOfList: "Стоимость списка",
    imageListPrefix: "Список изображений",
  },
  ar: {
    creatingList: "إنشاء القائمة",
    analyzingImage: "تحليل صورتك...",
    uploadImage: "تحميل صورة",
    uploadImageDescription: "التقط صورة أو اختر صورة لقائمة التسوق الخاصة بك لتحليلها تلقائياً",
    saveList: "حفظ القائمة",
    listSaved: "تم حفظ القائمة!",
    listName: "اسم القائمة",
    enterListName: "أدخل اسم القائمة",
    save: "حفظ",
    cancel: "إلغاء",
    selectCountry: "اختر البلد",
    cityNamePlaceholder: "أدخل اسم المدينة أو البلد",
    viewCost: "عرض التكلفة في",
    subscriptionRequired: "الاشتراك مطلوب",
    costOfList: "تكلفة القائمة",
    imageListPrefix: "قائمة الصور",
  },
  hu: {
    creatingList: "Lista létrehozása",
    analyzingImage: "A kép elemzése...",
    uploadImage: "Kép feltöltése",
    uploadImageDescription: "Készítsen fényképet vagy válasszon egy képet a bevásárlólistájáról az automatikus elemzéshez",
    saveList: "Lista mentése",
    listSaved: "Lista elmentve!",
    listName: "Lista neve",
    enterListName: "Adja meg a lista nevét",
    save: "Mentés",
    cancel: "Mégse",
    selectCountry: "Ország kiválasztása",
    cityNamePlaceholder: "Adja meg a város vagy ország nevét",
    viewCost: "Költség megtekintése:",
    subscriptionRequired: "Előfizetés szükséges",
    costOfList: "Lista költsége",
    imageListPrefix: "Kép lista",
  },
  ja: {
    creatingList: "リスト作成中",
    analyzingImage: "画像を分析中...",
    uploadImage: "画像をアップロード",
    uploadImageDescription: "買い物リストの写真を撮るか画像を選択して、自動的に分析してください",
    saveList: "リストを保存",
    listSaved: "リストが保存されました！",
    listName: "リスト名",
    enterListName: "リスト名を入力",
    save: "保存",
    cancel: "キャンセル",
    selectCountry: "国を選択",
    cityNamePlaceholder: "都市または国名を入力",
    viewCost: "コストを表示：",
    subscriptionRequired: "サブスクリプションが必要",
    costOfList: "リストのコスト",
    imageListPrefix: "画像リスト",
  },
  hi: {
    creatingList: "सूची बना रहे हैं",
    analyzingImage: "आपकी छवि का विश्लेषण कर रहे हैं...",
    uploadImage: "एक छवि अपलोड करें",
    uploadImageDescription: "अपनी खरीदारी सूची की तस्वीर लें या छवि चुनें और इसे स्वचालित रूप से विश्लेषित करें",
    saveList: "सूची सहेजें",
    listSaved: "सूची सहेजी गई!",
    listName: "सूची का नाम",
    enterListName: "सूची का नाम दर्ज करें",
    save: "सहेजें",
    cancel: "रद्द करें",
    selectCountry: "देश चुनें",
    cityNamePlaceholder: "शहर या देश का नाम दर्ज करें",
    viewCost: "लागत देखें:",
    subscriptionRequired: "सदस्यता आवश्यक",
    costOfList: "सूची की लागत",
    imageListPrefix: "छवि सूची",
  },
  nl: {
    creatingList: "Lijst maken",
    analyzingImage: "Uw afbeelding analyseren...",
    uploadImage: "Een afbeelding uploaden",
    uploadImageDescription: "Maak een foto of selecteer een afbeelding van uw boodschappenlijst om deze automatisch te analyseren",
    saveList: "Lijst opslaan",
    listSaved: "Lijst opgeslagen!",
    listName: "Lijstnaam",
    enterListName: "Voer lijstnaam in",
    save: "Opslaan",
    cancel: "Annuleren",
    selectCountry: "Land selecteren",
    cityNamePlaceholder: "Voer stad- of landnaam in",
    viewCost: "Kosten bekijken in",
    subscriptionRequired: "Abonnement vereist",
    costOfList: "Kosten van lijst",
    imageListPrefix: "Afbeeldingslijst",
  },
}

const ImageListScreen = ({ route }) => {
  const { theme } = useTheme()
  const { triggerHaptic } = useHaptic()
  const navigation = useNavigation()
  const initialList = route.params?.initialList
  const subscriptionFromNav = route.params?.isSubscribed

  // States
  const [shoppingList, setShoppingList] = useState([])
  const [history, setHistory] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [listModalVisible, setListModalVisible] = useState(false)
  const [editingText, setEditingText] = useState("")
  const [imageModalVisible, setImageModalVisible] = useState(false)
  const [imageUri, setImageUri] = useState(null)
  const [loading, setLoading] = useState(false)
  const [estimatedCost, setEstimatedCost] = useState(null)
  const [country, setCountry] = useState("")
  const [countryModalVisible, setCountryModalVisible] = useState(false)
  const [isCountryEmpty, setIsCountryEmpty] = useState(true)
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubscribed, setIsSubscribed] = useState(subscriptionFromNav || false)
  const [images, setImages] = useState([])
  const [uploadingImage, setUploadingImage] = useState(null)
  const [nameModalVisible, setNameModalVisible] = useState(false)
  const [listName, setListName] = useState("")

  // Image analysis states
  const [canAnalyzeImage, setCanAnalyzeImage] = useState(true)
  const [dailyImageCount, setDailyImageCount] = useState(0)

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current
  const bounceAnim = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0)).current
  // Nueva animación para pulse rings del botón upload
  const pulseRingOuter = useRef(new Animated.Value(1)).current
  const pulseRingMiddle = useRef(new Animated.Value(1)).current
  const pulseRingInner = useRef(new Animated.Value(1)).current
  const flatListRef = useRef(null)

  // Language setup
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  const currentLabels = texts[deviceLanguage] || texts["en"]
  const modalText = modalTexts[deviceLanguage] || modalTexts["en"]
  const alertText = alertTexts[deviceLanguage] || alertTexts["en"]
  const uiText = uiTexts[deviceLanguage] || uiTexts["en"]
  console.log('🌐 Device language for uiText:', deviceLanguage)
  console.log('🔍 Available uiTexts languages:', Object.keys(uiTexts))
  console.log('📝 Using uiText for listName:', uiText.listName)

  // Initialize animations
  useEffect(() => {
    const startPulsing = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
      ).start()
    }
    startPulsing()

    // Pulse rings animation - similar al HomeScreen
    const startPulseRings = () => {
      // Outer ring - slower pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseRingOuter, {
            toValue: 1.3,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseRingOuter, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start()

      // Middle ring - medium pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseRingMiddle, {
            toValue: 1.2,
            duration: 1600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseRingMiddle, {
            toValue: 1,
            duration: 1600,
            useNativeDriver: true,
          }),
        ])
      ).start()

      // Inner ring - faster pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseRingInner, {
            toValue: 1.15,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseRingInner, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start()
    }
    startPulseRings()

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()
  }, [])

  // Subscription management
  useEffect(() => {
    const initializePurchases = async () => {
      try {
        // Si ya tenemos el estado de suscripción de navegación, usarlo
        if (subscriptionFromNav !== undefined) {
          setIsSubscribed(subscriptionFromNav)
          setIsLoading(false)
          return
        }

        // Solo verificar si no viene de navegación
        await Purchases.setDebugLogsEnabled(true)
        await Purchases.configure({ apiKey: "appl_bHxScLAZLsKxfggiOiqVAZTXjJX" })

        const customerInfo = await Purchases.getCustomerInfo()
        if (customerInfo.entitlements.active["12981"]) {
          setIsSubscribed(true)
        } else {
          setIsSubscribed(false)
        }
      } catch (error) {
        console.log(alertText.errorGettingCustomerInfo, error)
      } finally {
        setIsLoading(false)
      }
    }

    initializePurchases()
  }, [subscriptionFromNav])

  // Country management
  useEffect(() => {
    const loadCountry = async () => {
      try {
        const savedCountry = await AsyncStorage.getItem("@country")
        if (savedCountry !== null) {
          setCountry(savedCountry)
          setIsCountryEmpty(savedCountry.trim() === "")
        }
      } catch (error) {
        console.error(alertText.errorLoadingCountry, error)
      }
    }
    loadCountry()
  }, [])

  // Check image analysis limits on mount and periodically
  useEffect(() => {
    if (isSubscribed) {
      checkImageAnalysisLimits()

      // Auto-refresh every 30 seconds to check if limit has reset
      const interval = setInterval(() => {
        checkImageAnalysisLimits()
      }, 30000) // 30 seconds

      return () => clearInterval(interval)
    }
  }, [isSubscribed])

  const handleCountryChange = (text) => {
    setCountry(text)
    setIsCountryEmpty(text.trim() === "")
  }

  const handleSaveCountry = async () => {
    if (!isCountryEmpty) {
      try {
        if (!isSubscribed) {
          Alert.alert(alertText.subscriptionRequired, alertText.subscriptionMessage, [
            {
              text: alertText.subscribe,
              onPress: () => {
                if (route.params?.onNavigateToSubscribe) {
                  route.params.onNavigateToSubscribe();
                }
              },
            },
            { text: alertText.cancel, style: "cancel" },
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
        console.error(alertText.errorSavingCountry, error)
      }
    }
  }

  const fetchEstimatedCost = async () => {
    setLoading(true)
    if (!country) {
      Alert.alert(alertText.error, alertText.enterCountry)
      return
    }

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
    } catch (error) {
      console.error("Error fetching estimated cost: ", error)
      Alert.alert(alertText.error, alertText.couldNotFetchCost)
      setLoading(false)
    }
  }

  // Permission requests
  const requestCameraPermission = async () => {
    try {
      const result = await request(
        Platform.select({
          android: PERMISSIONS.ANDROID.CAMERA,
          ios: PERMISSIONS.IOS.CAMERA,
        }),
      )
      return result === RESULTS.GRANTED
    } catch (error) {
      console.error(alertText.failedCameraPermission, error)
      return false
    }
  }

  const requestGalleryPermission = async () => {
    try {
      const result = await request(
        Platform.select({
          android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
        }),
      )
      return result === RESULTS.GRANTED
    } catch (error) {
      console.error(alertText.failedGalleryPermission, error)
      return false
    }
  }

  // Image handling
  const convertImageToBase64 = (uri) => {
    return new Promise((resolve, reject) => {
      RNFS.readFile(uri, "base64")
        .then((data) => resolve(data))
        .catch((err) => reject(err))
    })
  }

  const analyzeImage = async (imageUri) => {
    // Check if user can analyze image
    if (!canAnalyzeImage) {
      Alert.alert(
        deviceLanguage === 'es' ? 'Límite alcanzado' : 'Limit reached',
        translations[deviceLanguage]?.imageLimitReached || translations.en.imageLimitReached
      )
      return
    }

    setLoading(true)
    setEstimatedCost(null)

    // Start bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -20,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ).start()

    try {
      const base64Image = await convertImageToBase64(imageUri)
      const promptMessage = promptsAnalize[deviceLanguage] || promptsAnalize["en"]

      const response = await axios.post(
        API_KEY_ANALIZE,
        {
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
                    url: `data:image/jpeg;base64,${base64Image}`,
                    detail: "low",
                  },
                },
              ],
            },
          ],
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      )

      const content = response.data.choices[0].message.content
      if (content) {
        const items = content
          .split("\n")
          .map((item) => item.trim())
          .filter((item) => item)
        setShoppingList(items)
        saveShoppingList(items)

        // Increment image analysis count after successful analysis
        incrementImageAnalysis()
      } else {
        Alert.alert(alertText.error, alertText.noValidAnalysis)
      }
    } catch (error) {
      console.error(alertText.errorAnalyzingImage, error)
      Alert.alert(alertText.error, alertText.couldNotAnalyze)
    } finally {
      setLoading(false)
    }
  }

  const handleChoosePhoto = async () => {
    const hasPermission = await requestGalleryPermission()
    if (!hasPermission) return

    const options = { noData: true }
    launchImageLibrary(options, (response) => {
      if (response.assets) {
        const uri = response.assets[0].uri
        setImageUri(uri)
        setImageModalVisible(false)
        analyzeImage(uri)
      }
    })
  }

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission()
    if (!hasPermission) return

    const options = { noData: true }
    launchCamera(options, (response) => {
      if (response.assets) {
        const uri = response.assets[0].uri
        setImageUri(uri)
        setImageModalVisible(false)
        analyzeImage(uri)
      }
    })
  }

  // List management
  const removeItem = (index) => {
    const newList = [...shoppingList]
    newList.splice(index, 1)
    setShoppingList(newList)
    saveShoppingList(newList)
    setEstimatedCost(null)
  }

  const saveShoppingList = async (newList) => {
    try {
      await AsyncStorage.setItem("@current_shopping_list", JSON.stringify(newList))
    } catch (e) {
      console.error(alertText.errorSavingList, e)
    }
  }

  const generateGenericListName = () => {
    const prefix = uiText.imageListPrefix
    const existingNumbers = history
      .map((item) => item.name.match(new RegExp(`^${prefix} (\\d+)$`)))
      .filter((match) => match !== null)
      .map((match) => Number.parseInt(match[1], 10))

    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1
    return `${prefix} ${nextNumber}`
  }

  // Simple functions for image analysis
  const getDeviceId = async () => {
    try {
      return await DeviceInfo.getUniqueId()
    } catch (error) {
      return `fallback_${Date.now()}`
    }
  }

  const checkImageAnalysisLimits = async () => {
    console.log('🔍 Checking image analysis limits...')
    if (!isSubscribed) {
      console.log('❌ User not subscribed')
      return { canAnalyze: false, reason: 'not_subscribed' }
    }

    try {
      const deviceId = await getDeviceId()
      console.log('📱 Device ID:', deviceId)
      const response = await fetch(`https://web.lweb.ch/voice/image_check.php?device_id=${deviceId}`)
      const data = await response.json()
      console.log('🔍 Image limits response:', data)

      if (data.success) {
        setCanAnalyzeImage(data.can_analyze)
        setDailyImageCount(data.daily_count)
        console.log(`📊 Análisis usados: ${data.daily_count}/10`)
        console.log(`⏰ Puede analizar: ${data.can_analyze ? 'SÍ' : 'NO'}`)
        console.log(`📈 Quedan: ${data.remaining} análisis`)
        if (data.time_until_reset > 0) {
          console.log(`🕒 Próximo reset en: ${data.time_remaining_text}`)
        }
        return { canAnalyze: data.can_analyze, remaining: data.remaining }
      }
    } catch (error) {
      console.error('Error checking limits:', error)
    }

    return { canAnalyze: true, remaining: 1 } // Fallback
  }

  const incrementImageAnalysis = async () => {
    try {
      const deviceId = await getDeviceId()
      const response = await fetch(`https://web.lweb.ch/voice/image_increment.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_id: deviceId })
      })
      const data = await response.json()

      if (data.success) {
        setCanAnalyzeImage(data.can_analyze)
        setDailyImageCount(data.daily_count)
        return data.limit_reached
      }
    } catch (error) {
      console.error('Error incrementing:', error)
    }
    return false
  }

  const saveToHistory = async () => {
    if (shoppingList.length === 0) return

    // Generate default name and show name modal
    const defaultName = generateGenericListName()
    setListName(defaultName)
    setNameModalVisible(true)
  }

  const confirmSaveWithName = async () => {
    try {
      const existingLists = await AsyncStorage.getItem("@shopping_history")
      let updatedLists = []

      if (existingLists !== null) {
        updatedLists = JSON.parse(existingLists)
      }

      const newHistory = [...updatedLists, {
        list: shoppingList,
        name: listName || generateGenericListName(),
        date: new Date().toISOString()
      }]

      await AsyncStorage.setItem("@shopping_history", JSON.stringify(newHistory))
      setHistory(newHistory)
      setShoppingList([])
      setNameModalVisible(false)

      console.log("🔥 Setting confirmationModalVisible to true")
      setConfirmationModalVisible(true)

      // Set flag to show newest list in History
      await AsyncStorage.setItem("@show_newest_list", "true")

      setTimeout(() => {
        console.log("🔥 Closing modal after 2 seconds")
        setConfirmationModalVisible(false)
        // Navigate to History if callback is available
        if (route.params?.onNavigateToHistory) {
          route.params.onNavigateToHistory()
        }
      }, 2000)
    } catch (e) {
      console.error(alertText.errorSavingHistory, e)
    }
  }

  // Render functions
  const renderItem = ({ item, index }) => {
    if (item === uiText.costOfList || item === currentLabels.costdelalista) {
      return null // Don't render the cost item anymore
    }

    return (
      <Animated.View style={[modernStyles.listItem, { opacity: fadeAnim }]}>
        <View style={modernStyles.itemContent}>
          <View style={modernStyles.bulletPoint} />
          <Text style={modernStyles.itemText}>{item}</Text>
        </View>
        <TouchableOpacity onPress={() => removeItem(index)} style={modernStyles.removeButton}>
          <Ionicons name="close-circle" size={24} color="#ef4444" />
        </TouchableOpacity>
      </Animated.View>
    )
  }

  const renderImageModal = () => (
    <Modal
      visible={imageModalVisible}
      animationType="slide"
      onRequestClose={() => setImageModalVisible(false)}
      transparent={true}
    >
      <View style={modernStyles.modalOverlay}>
        <View style={modernStyles.imageModalContainer}>
          <View style={modernStyles.modalHeader}>
            <View style={modernStyles.modalIconContainer}>
              <Ionicons name="camera" size={32} color="#ff9500" />
              </View>
            <Text style={modernStyles.modalTitle}>{modalText.title}</Text>
            <TouchableOpacity onPress={() => setImageModalVisible(false)} style={modernStyles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={modernStyles.modalButtonsContainer}>
            <TouchableOpacity style={modernStyles.modalActionButton} onPress={handleChoosePhoto}>
              <View style={modernStyles.modalButtonIcon}>
                <Ionicons name="image-outline" size={28} color="#ff9500" />
              </View>
              <Text style={modernStyles.modalButtonText}>{modalText.gallery}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={modernStyles.modalActionButton} onPress={handleTakePhoto}>
              <View style={modernStyles.modalButtonIcon}>
                <Ionicons name="camera-outline" size={28} color="#ff9500" />
              </View>
              <Text style={modernStyles.modalButtonText}>{modalText.takePhoto}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )

  const ConfirmationModal = () => (
    <Modal visible={confirmationModalVisible} transparent={true} animationType="fade">
      <View style={modernStyles.confirmationModalContainer}>
        <View style={modernStyles.confirmationModalContent}>
          <Ionicons name="checkmark-circle" size={60} color="#10b981" />
          <Text style={modernStyles.confirmationText}>{uiText.listSaved || "List Saved!"}</Text>
        </View>
      </View>
    </Modal>
  )

  return (
    <SafeAreaView style={modernStyles.container}>
      {/* Loading State */}
      {loading && (
        <View style={modernStyles.loadingOverlay}>
          <View style={modernStyles.loadingContainer}>
            <Text style={modernStyles.loadingTitle}>{uiText.creatingList}</Text>

            {imageUri && (
              <View style={modernStyles.imagePreviewContainer}>
                <Image source={{ uri: imageUri }} style={modernStyles.imagePreview} />
                <View style={modernStyles.imageOverlay} />
              </View>
            )}

            <Animated.View style={[modernStyles.analyzeIconContainer, { transform: [{ translateY: bounceAnim }] }]}>
              <Ionicons name="search" size={32} color="#3b82f6" />
            </Animated.View>

            <ActivityIndicator size="large" color="#3b82f6" style={modernStyles.loadingSpinner} />
            <Text style={modernStyles.loadingSubtitle}>{uiText.analyzingImage}</Text>
          </View>
        </View>
      )}

      {/* Empty State */}
      {!loading && shoppingList.length === 0 && (
        <Animated.View style={[modernStyles.emptyStateContainer, { opacity: fadeAnim }]}>
          <View style={modernStyles.emptyStateContent}>
            <View style={[modernStyles.emptyIconContainer, isSmallIPhone && {width: 90, height: 90}]}>
              <Image
                source={require("../assets/images/838080c2-a486-41a7-9ed4-ef7587b48120.png")}
                style={[modernStyles.emptyStateImage, isSmallIPhone && {width: 160, height: 160}]}
              />
            </View>
            <Text style={[modernStyles.emptyStateTitle, isSmallIPhone && {fontSize: 20}]}>{currentLabels.uploadImageTitle}</Text>
            <Text style={[modernStyles.emptyStateSubtitle, isSmallIPhone && {fontSize: 13, paddingHorizontal: 10}]}>{uiText.uploadImageDescription}</Text>
          </View>
        </Animated.View>
      )}

      {/* Shopping List */}
      {!loading && shoppingList.length > 0 && (
        <FlatList
          ref={flatListRef}
          data={shoppingList.length > 0 ? [...shoppingList, uiText.costOfList] : []}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          style={modernStyles.listContainer}
          contentContainerStyle={modernStyles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}


      {/* Upload Section - Only show when no items in list */}
      {!loading && isSubscribed && canAnalyzeImage && shoppingList.length === 0 && (
        <View style={modernStyles.uploadSectionContainer}>
          {/* Title and Description Card */}
          <View style={[
            modernStyles.uploadInfoCards,
        
          ]}>
            <View style={modernStyles.uploadIconContainere}>

            </View>
         

          </View>

          {/* Upload Button with Pulse Rings */}
          <View style={[modernStyles.uploadButtonContainer, isSmallIPhone && {bottom: 10}]}>
            {/* Outer Pulse Ring - NARANJA */}
            <Animated.View style={[
              modernStyles.pulseRingOuter,
              isSmallIPhone && {width: 140, height: 140, borderRadius: 70},
              { transform: [{ scale: pulseRingOuter }] }
            ]} />

            {/* Middle Pulse Ring - NARANJA */}
            <Animated.View style={[
              modernStyles.pulseRingMiddle,
              isSmallIPhone && {width: 110, height: 110, borderRadius: 55},
              { transform: [{ scale: pulseRingMiddle }] }
            ]} />

            {/* Inner Pulse Ring - NARANJA */}
            <Animated.View style={[
              modernStyles.pulseRingInner,
              isSmallIPhone && {width: 90, height: 90, borderRadius: 45},
              { transform: [{ scale: pulseRingInner }] }
            ]} />

            <TouchableOpacity style={[modernStyles.mainActionButton, isSmallIPhone && {
              width: 60,
              height: 60,
              borderRadius: 30,
              shadowOffset: { width: 0, height: 10 },
              shadowRadius: 20,
              elevation: 15
            },
            {
              backgroundColor: 'rgba(251, 146, 60, 0.15)',
              borderWidth: 2,
              borderColor: 'rgba(251, 146, 60, 0.5)',
              backdropFilter: 'blur(10px)'
            }
            ]} onPress={() => {
              triggerHaptic('light')
              setImageModalVisible(true)
            }}>
              <Animated.View style={[modernStyles.buttonContent, { transform: [{ scale: pulseAnim }] }]}>
                <Ionicons name="cloud-upload-outline" size={isSmallIPhone ? 18 : 24} color="#f97316" />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Subscription Banner */}
      {!isSubscribed && (
        <TouchableOpacity style={[modernStyles.subscriptionBanner, isSmallIPhone && {padding: 8, marginBottom: 12}]} onPress={() => {
          // Navigate to Subscribe screen through route params
          if (route.params?.onNavigateToSubscribe) {
            route.params.onNavigateToSubscribe();
          }
        }}>
          <Ionicons name="lock-closed" size={isSmallIPhone ? 16 : 20} color="#f79730ff" />
          <Text style={[modernStyles.subscriptionBannerText, isSmallIPhone && {fontSize: 12}]}>
            {suscribeButtonTranslations[deviceLanguage] || suscribeButtonTranslations.en}
          </Text>
        </TouchableOpacity>
      )}

      {/* Daily Limit Banner for Subscribers - Only show when no items in list */}
      {isSubscribed && !canAnalyzeImage && shoppingList.length === 0 && (
        <View style={[modernStyles.subscriptionBanner, isSmallIPhone && {padding: 8, marginBottom: 12}]}>
          <Ionicons name="time-outline" size={isSmallIPhone ? 16 : 20} color="#ef4444" />
          <Text style={[modernStyles.subscriptionBannerText, isSmallIPhone && {fontSize: 12}]}>
            {translations[deviceLanguage]?.imageLimitReached || translations.en.imageLimitReached}
          </Text>
        </View>
      )}

      {/* Cancel Button - Left side when items exist */}
      {shoppingList.length > 0 && !loading && (
        <TouchableOpacity
          onPress={() => setShoppingList([])}
          style={[modernStyles.saveButton, {
            left: 20,
            right: 'auto',
            backgroundColor: '#ef4444'
          }]}
        >
          <Ionicons name="close-circle-outline" size={24} color="#fff" />
          <Text style={[modernStyles.saveButtonText, { color: '#fff' }]}>{uiText.cancel || 'Cancel'}</Text>
        </TouchableOpacity>
      )}

      {/* Save Button - Right side */}
      {shoppingList.length > 0 && !loading && (
        <TouchableOpacity onPress={saveToHistory} style={modernStyles.saveButton}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#ffffffff" />
          <Text style={modernStyles.saveButtonText}>{uiText.saveList}</Text>
        </TouchableOpacity>
      )}

      {/* Modals */}
      {renderImageModal()}
      <ConfirmationModal />

      {/* Name Modal */}
      <Modal
        visible={nameModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setNameModalVisible(false)}
      >
        <View style={modernStyles.modalOverlay}>
          <View style={modernStyles.countryModalContainer}>
            <View style={modernStyles.modalHeader}>
              <Text style={modernStyles.countryModalTitle}>
                {uiText.listName || "List Name"}
              </Text>
              <Text style={modernStyles.countryModalSubtitle}>
                {uiText.enterListName || "Enter list name"}
              </Text>
            </View>

            <TextInput
              style={modernStyles.modalInput}
              value={listName}
              onChangeText={setListName}
              placeholder={uiText.imageListPrefix || "Image List"}
              placeholderTextColor="#b8b8b8ab"
              autoFocus
              selectTextOnFocus
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
              <TouchableOpacity
                style={[modernStyles.modalButton, {
                  flex: 1,
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderWidth: 1,
                  borderColor: 'rgba(239, 68, 68, 0.3)'
                }]}
                onPress={() => setNameModalVisible(false)}
              >
                <Ionicons name="close" size={20} color="#ef4444" style={{ marginRight: 8 }} />
                <Text style={[modernStyles.modalButtonText, { color: '#ef4444' }]}>
                  {uiText.cancel || "Cancel"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[modernStyles.modalButton, {
                  flex: 1,
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  borderWidth: 1,
                  borderColor: 'rgba(16, 185, 129, 0.3)'
                }]}
                onPress={confirmSaveWithName}
              >
                <Ionicons name="checkmark" size={20} color="#10b981" style={{ marginRight: 8 }} />
                <Text style={[modernStyles.modalButtonText, { color: '#10b981' }]}>
                  {uiText.save || "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Country Modal */}
      <Modal
        visible={countryModalVisible}
        animationType="slide"
        onRequestClose={() => setCountryModalVisible(false)}
        transparent={true}
      >
        <View style={modernStyles.modalOverlay}>
          <View style={modernStyles.countryModalContainer}>
            <View style={modernStyles.modalHeader}>
              <Text style={modernStyles.modalTitle}>{uiText.selectCountry}</Text>
              <TouchableOpacity style={modernStyles.closeButton} onPress={() => setCountryModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {!isSubscribed && (
              <View style={[modernStyles.subscriptionBanner, isSmallIPhone && {padding: 8}]}>
                <Ionicons name="lock-closed-outline" size={isSmallIPhone ? 16 : 20} color="#e91e63" />
                <Text style={[modernStyles.subscriptionBannerText, isSmallIPhone && {fontSize: 12}]}>{uiText.subscriptionRequired}</Text>
              </View>
            )}

            <TextInput
              style={modernStyles.countryInput}
              placeholder={uiText.cityNamePlaceholder}
              placeholderTextColor="#9ca3af"
              value={country}
              onChangeText={handleCountryChange}
            />

            <TouchableOpacity
              style={[modernStyles.countryButton, isCountryEmpty && modernStyles.countryButtonDisabled]}
              onPress={handleSaveCountry}
              disabled={isCountryEmpty}
            >
              <Text style={modernStyles.countryButtonText}>{`${uiText.viewCost} ${country}`}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const modernStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e7ead2",
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

  // Loading States
  loadingOverlay: {
    flex: 1,
    backgroundColor: "rgba(248, 250, 252, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },

  loadingContainer: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 24,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    maxWidth: width * 0.9,
  },

  loadingTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 24,
    textAlign: "center",
  },

  imagePreviewContainer: {
    position: "relative",
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
  },

  imagePreview: {
    width: 200,
    height: 150,
    borderRadius: 16,
  },

  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    borderRadius: 16,
  },

  analyzeIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: "#eff6ff",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  loadingSpinner: {
    marginBottom: 16,
  },

  loadingSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },

  // Empty State
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    position: 'relative',
    marginTop: -62,
  },

  emptyStateContent: {
    alignItems: "center",
    maxWidth: 340,

  },

  emptyIconContainer: {
    width: 160,
    height: 160,
    backgroundColor: "#f1f5f9",
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 62,
  },

  emptyStateImage: {
    marginTop: -20,
    backgroundColor: "#93b0b0",
    shadowColor: "#93b0b0",
    borderWidth: 2,
    borderColor: "#93b0b0",
    borderRadius: 20,
    width: 240,
    height: 280,
  },

  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#e67812ba",
    marginBottom: 16,
    textAlign: "center",
    marginTop: 40,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(74, 107, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },

  emptyStateSubtitle: {
    fontSize: 18,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 26,
    fontWeight: "500",
    marginHorizontal: 20,
  },

  // List Styles
  listContainer: {
    flex: 1,
  },

  listContent: {
    padding: 16,
    paddingBottom: 100,
  },

  listItem: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },

  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3b82f6",
    marginRight: 12,
  },

  itemText: {
    fontSize: 16,
    color: "#1f2937",
    flex: 1,
    fontWeight: "500",
  },

  removeButton: {
    padding: 8,
  },

  // Cost Item
  costItemContainer: {
    marginBottom: 12,
  },

  costButton: {
    backgroundColor: "#ff9500",
    borderRadius: 20,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ff9500",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  costButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 12,
  },

  // Upload Section Styles
  uploadSectionContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    alignItems: 'center',
    width: '100%',

  },

  uploadInfoCard: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 20,
    marginHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(251, 146, 60, 0.2)',
  },

  uploadIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(251, 146, 60, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  uploadTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6,
  },

  uploadDescription: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },

  // Action Buttons with Pulse Rings
  uploadButtonContainer: {
    width: 94,
    height: 94,
    alignItems: "center",
    justifyContent: "center",
        marginTop: 10,
  },
  
  // Outer pulse ring - NARANJA VIBRANTE
  pulseRingOuter: {
    position: 'absolute',
  width: 94,
    height: 94,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 149, 0, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Middle pulse ring - NARANJA
  pulseRingMiddle: {
    position: 'absolute',
    width: 94,
    height: 94,
  borderRadius: 80,
    backgroundColor: 'rgba(255, 149, 0, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Inner pulse ring - NARANJA VIBRANTE
  pulseRingInner: {
    position: 'absolute',
    width: 84,
    height: 84,
  borderRadius: 80,
    backgroundColor: 'rgba(255, 149, 0, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  
  mainActionButton: {
   width: 64,
    height: 64,
    backgroundColor: 'rgba(251, 146, 60, 0.15)',
  borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#f97316",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 10,

  },

  buttonContent: {
    alignItems: "center",
    justifyContent: "center",
  },

  saveButton: {
    position: "absolute",
    bottom: 32,
    right: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:"#10b981",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },

  saveButtonText: {
    marginLeft: 8,
    fontSize: isSmallIPhone ? 12 : 16,
    fontWeight: "600",
    color: "#ffffffff",
  },

  subscriptionBanner: {
    position: "absolute",
    bottom: 32,
    left: 32,
    right: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#feedcaff",
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#feedcaff",
  },

  subscriptionBannerText: {
    marginLeft: 2,
    fontSize: 12,
    fontWeight: "600",
    color: "#f79730ff",
    padding:4,

  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  imageModalContainer: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 16,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  modalIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#eff6ff",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    flex: 1,
    marginLeft: 16,
  },

  closeButton: {
    padding: 8,
  },

  modalButtonsContainer: {
    gap: 16,
  },

  modalActionButton: {
    backgroundColor: 'rgba(255, 149, 0, 0.3)',
    borderRadius: 20,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#ff9500",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 149, 0, 0.5)',
  },

  modalButtonIcon: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 10,
  },

  modalButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#717171ff",
  },

  // Confirmation Modal
  confirmationOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  confirmationContainer: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 16,
  },

  successIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#ecfdf5",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  confirmationText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
  },

  // Country Modal
  countryModalContainer: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 16,
  },

  subscriptionBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#fecaca",
    marginTop:-70
  },



  countryInput: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#f9fafb",
  },

  countryButton: {
    backgroundColor: "#ff9500",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    shadowColor: "#ff9500",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  countryButtonDisabled: {
    backgroundColor: "#d1d5db",
  },

  countryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default ImageListScreen
