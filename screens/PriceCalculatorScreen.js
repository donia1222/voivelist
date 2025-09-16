import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Dimensions,
  Share
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as RNLocalize from 'react-native-localize'
import { useTheme } from '../ThemeContext'
import axios from 'axios'
import Purchases from 'react-native-purchases'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

const API_KEY_ANALIZE = process.env.API_KEY_ANALIZE

const translations = {
  en: {
    title: "Price Calculator",
    selectList: "Select a List",
    noLists: "No saved lists",
    createListsFirst: "Create lists in history first",
    calculatePrice: "Calculate Price",
    enterCountry: "Enter Your City",
    country: "Your city",
    viewCost: "Calculate cost in",
    placeholderExample: "Paris, France",
    estimatedCost: "Estimated Cost",
    items: "items",
    subscriptionRequired: "Subscription Required",
    subscribeMessage: "You must be subscribed to calculate the estimated cost.",
    subscribe: "Subscribe",
    cancel: "Cancel",
    error: "Error",
    pleaseEnterCountry: "Please enter your city.",
    couldNotFetchCost: "Could not fetch the estimated cost.",
    selectListFirst: "Please select a list first",
    loading: "Calculating...",
    result: "Result",
    tryAnother: "Try Another List",
    shareList: "Share List",
    viewPrice: "View Price",
    price: "Price",
    calculate: "Calculate",
    shareError: "Could not share the list"
  },
  es: {
    title: "Calculadora de Precios",
    selectList: "Seleccionar una Lista",
    noLists: "No hay listas guardadas",
    createListsFirst: "Crea listas en el historial primero",
    calculatePrice: "Calcular Precio",
    enterCountry: "Ingresar tu Ciudad",
    country: "Tu ciudad",
    viewCost: "Calcular costo en",
    placeholderExample: "Madrid, España",
    estimatedCost: "Costo Estimado",
    items: "artículos",
    subscriptionRequired: "Suscripción Requerida",
    subscribeMessage: "Debes estar suscrito para calcular el costo estimado.",
    subscribe: "Suscribirse",
    cancel: "Cancelar",
    error: "Error",
    pleaseEnterCountry: "Por favor ingresa tu ciudad.",
    couldNotFetchCost: "No se pudo obtener el costo estimado.",
    selectListFirst: "Por favor selecciona una lista primero",
    loading: "Calculando...",
    result: "Resultado",
    tryAnother: "Probar Otra Lista",
    shareList: "Compartir Lista",
    viewPrice: "Ver Precio",
    price: "Precio",
    calculate: "Calcular",
    shareError: "No se pudo compartir la lista"
  },
  de: {
    title: "Preisrechner",
    selectList: "Liste auswählen",
    noLists: "Keine gespeicherten Listen",
    createListsFirst: "Erstellen Sie zuerst Listen im Verlauf",
    calculatePrice: "Preis berechnen",
    enterCountry: "Deine Stadt eingeben",
    country: "Deine Stadt",
    viewCost: "Kosten berechnen in",
    placeholderExample: "Berlin, Deutschland",
    estimatedCost: "Geschätzte Kosten",
    items: "Artikel",
    subscriptionRequired: "Abonnement erforderlich",
    subscribeMessage: "Sie müssen abonniert sein, um die geschätzten Kosten zu berechnen.",
    subscribe: "Abonnieren",
    cancel: "Abbrechen",
    error: "Fehler",
    pleaseEnterCountry: "Bitte geben Sie Ihre Stadt ein.",
    couldNotFetchCost: "Die geschätzten Kosten konnten nicht abgerufen werden.",
    selectListFirst: "Bitte wählen Sie zuerst eine Liste aus",
    loading: "Berechnung...",
    result: "Ergebnis",
    tryAnother: "Andere Liste ausprobieren",
    shareList: "Liste teilen",
    viewPrice: "Preis ansehen",
    price: "Preis",
    calculate: "Berechnen",
    shareError: "Liste konnte nicht geteilt werden"
  },
  it: {
    title: "Calcolatore di Prezzi",
    selectList: "Seleziona una Lista",
    noLists: "Nessuna lista salvata",
    createListsFirst: "Crea prima le liste nella cronologia",
    calculatePrice: "Calcola Prezzo",
    enterCountry: "Inserisci la tua Città",
    country: "La tua città",
    viewCost: "Calcola il costo in",
    placeholderExample: "Roma, Italia",
    estimatedCost: "Costo Stimato",
    items: "articoli",
    subscriptionRequired: "Abbonamento Richiesto",
    subscribeMessage: "Devi essere abbonato per calcolare il costo stimato.",
    subscribe: "Abbonati",
    cancel: "Annulla",
    error: "Errore",
    pleaseEnterCountry: "Per favore inserisci la tua città.",
    couldNotFetchCost: "Non è stato possibile ottenere il costo stimato.",
    selectListFirst: "Per favore seleziona prima una lista",
    loading: "Calcolo...",
    result: "Risultato",
    tryAnother: "Prova un'altra lista",
    shareList: "Condividi Lista",
    viewPrice: "Vedi Prezzo",
    price: "Prezzo",
    calculate: "Calcola",
    shareError: "Impossibile condividere la lista"
  },
  fr: {
    title: "Calculateur de Prix",
    selectList: "Sélectionner une Liste",
    noLists: "Aucune liste enregistrée",
    createListsFirst: "Créez d'abord des listes dans l'historique",
    calculatePrice: "Calculer le Prix",
    enterCountry: "Entrer votre Ville",
    country: "Votre ville",
    viewCost: "Calculer le coût en",
    placeholderExample: "Paris, France",
    estimatedCost: "Coût Estimé",
    items: "articles",
    subscriptionRequired: "Abonnement Requis",
    subscribeMessage: "Vous devez être abonné pour calculer le coût estimé.",
    subscribe: "S'abonner",
    cancel: "Annuler",
    error: "Erreur",
    pleaseEnterCountry: "Veuillez entrer votre ville.",
    couldNotFetchCost: "Impossible d'obtenir le coût estimé.",
    selectListFirst: "Veuillez d'abord sélectionner une liste",
    loading: "Calcul...",
    result: "Résultat",
    tryAnother: "Essayer une autre liste",
    shareList: "Partager la liste",
    viewPrice: "Voir le prix",
    price: "Prix",
    calculate: "Calculer",
    shareError: "Impossible de partager la liste"
  },
  tr: {
    title: "Fiyat Hesaplayıcı",
    selectList: "Bir Liste Seç",
    noLists: "Kayıtlı liste yok",
    createListsFirst: "Önce geçmişte liste oluştur",
    calculatePrice: "Fiyat Hesapla",
    enterCountry: "Şehrinizi Girin",
    country: "Şehriniz",
    viewCost: "Maliyeti hesapla",
    placeholderExample: "İstanbul, Türkiye",
    estimatedCost: "Tahmini Maliyet",
    items: "ürün",
    subscriptionRequired: "Abonelik Gerekli",
    subscribeMessage: "Tahmini maliyeti hesaplamak için abone olmalısınız.",
    subscribe: "Abone Ol",
    cancel: "İptal",
    error: "Hata",
    pleaseEnterCountry: "Lütfen şehrinizi girin.",
    couldNotFetchCost: "Tahmini maliyet alınamadı.",
    selectListFirst: "Lütfen önce bir liste seçin",
    loading: "Hesaplanıyor...",
    result: "Sonuç",
    tryAnother: "Başka Liste Dene",
    shareList: "Listeyi Paylaş",
    viewPrice: "Fiyatı Gör",
    price: "Fiyat",
    calculate: "Hesapla",
    shareError: "Liste paylaşılamadı"
  },
  pt: {
    title: "Calculadora de Preços",
    selectList: "Selecionar uma Lista",
    noLists: "Sem listas salvas",
    createListsFirst: "Crie listas no histórico primeiro",
    calculatePrice: "Calcular Preço",
    enterCountry: "Digite sua Cidade",
    country: "Sua cidade",
    viewCost: "Calcular custo em",
    placeholderExample: "Lisboa, Portugal",
    estimatedCost: "Custo Estimado",
    items: "itens",
    subscriptionRequired: "Assinatura Necessária",
    subscribeMessage: "Você precisa estar inscrito para calcular o custo estimado.",
    subscribe: "Assinar",
    cancel: "Cancelar",
    error: "Erro",
    pleaseEnterCountry: "Por favor, digite sua cidade.",
    couldNotFetchCost: "Não foi possível obter o custo estimado.",
    selectListFirst: "Por favor, selecione uma lista primeiro",
    loading: "Calculando...",
    result: "Resultado",
    tryAnother: "Tentar Outra Lista",
    shareList: "Compartilhar Lista",
    viewPrice: "Ver Preço",
    price: "Preço",
    calculate: "Calcular",
    shareError: "Não foi possível compartilhar a lista"
  },
  ru: {
    title: "Калькулятор цен",
    selectList: "Выбрать список",
    noLists: "Нет сохраненных списков",
    createListsFirst: "Сначала создайте списки в истории",
    calculatePrice: "Рассчитать цену",
    enterCountry: "Введите ваш город",
    country: "Ваш город",
    viewCost: "Рассчитать стоимость в",
    placeholderExample: "Москва, Россия",
    estimatedCost: "Примерная стоимость",
    items: "товаров",
    subscriptionRequired: "Требуется подписка",
    subscribeMessage: "Вы должны быть подписаны для расчета примерной стоимости.",
    subscribe: "Подписаться",
    cancel: "Отмена",
    error: "Ошибка",
    pleaseEnterCountry: "Пожалуйста, введите ваш город.",
    couldNotFetchCost: "Не удалось получить примерную стоимость.",
    selectListFirst: "Пожалуйста, сначала выберите список",
    loading: "Расчет...",
    result: "Результат",
    tryAnother: "Попробовать другой список",
    shareList: "Поделиться списком",
    viewPrice: "Посмотреть цену",
    price: "Цена",
    calculate: "Рассчитать",
    shareError: "Не удалось поделиться списком"
  },
  ar: {
    title: "حاسبة الأسعار",
    selectList: "اختر قائمة",
    noLists: "لا توجد قوائم محفوظة",
    createListsFirst: "قم بإنشاء قوائم في السجل أولاً",
    calculatePrice: "احسب السعر",
    enterCountry: "أدخل مدينتك",
    country: "مدينتك",
    viewCost: "احسب التكلفة في",
    placeholderExample: "القاهرة، مصر",
    estimatedCost: "التكلفة المقدرة",
    items: "عناصر",
    subscriptionRequired: "الاشتراك مطلوب",
    subscribeMessage: "يجب أن تكون مشتركًا لحساب التكلفة المقدرة.",
    subscribe: "اشترك",
    cancel: "إلغاء",
    error: "خطأ",
    pleaseEnterCountry: "من فضلك أدخل مدينتك.",
    couldNotFetchCost: "لا يمكن الحصول على التكلفة المقدرة.",
    couldNotShareList: "لا يمكن مشاركة القائمة",
    selectListFirst: "من فضلك اختر قائمة أولاً",
    loading: "جاري الحساب...",
    result: "النتيجة",
    tryAnother: "جرب قائمة أخرى",
    shareList: "شارك القائمة",
    viewPrice: "عرض السعر",
    price: "السعر",
    calculate: "احسب",
    shareError: "لم يتمكن من مشاركة القائمة"
  },
  hu: {
    title: "Árkalkulátor",
    selectList: "Válassz egy listát",
    noLists: "Nincsenek mentett listák",
    createListsFirst: "Először hozz létre listákat az előzményekben",
    calculatePrice: "Ár kiszámítása",
    enterCountry: "Add meg a városod",
    country: "A városod",
    viewCost: "Költség kiszámítása itt",
    placeholderExample: "Budapest, Magyarország",
    estimatedCost: "Becsült költség",
    items: "elem",
    subscriptionRequired: "Előfizetés szükséges",
    subscribeMessage: "Előfizetésre van szükség a becsült költség kiszámításához.",
    subscribe: "Előfizetés",
    cancel: "Mégse",
    error: "Hiba",
    pleaseEnterCountry: "Kérlek add meg a városod.",
    couldNotFetchCost: "Nem sikerült lekérni a becsült költséget.",
    selectListFirst: "Kérlek először válassz egy listát",
    loading: "Számítás...",
    result: "Eredmény",
    tryAnother: "Próbálj másik listát",
    shareList: "Lista megosztása",
    viewPrice: "Ár megtekintése",
    price: "Ár",
    calculate: "Számítás",
    shareError: "Nem sikerült megosztani a listát"
  },
  ja: {
    title: "価格計算機",
    selectList: "リストを選択",
    noLists: "保存されたリストはありません",
    createListsFirst: "最初に履歴でリストを作成",
    calculatePrice: "価格を計算",
    enterCountry: "都市を入力",
    country: "あなたの都市",
    viewCost: "コストを計算",
    placeholderExample: "東京、日本",
    estimatedCost: "推定コスト",
    items: "アイテム",
    subscriptionRequired: "サブスクリプションが必要",
    subscribeMessage: "推定コストを計算するには購読が必要です。",
    subscribe: "購読する",
    cancel: "キャンセル",
    error: "エラー",
    pleaseEnterCountry: "都市を入力してください。",
    couldNotFetchCost: "推定コストを取得できませんでした。",
    selectListFirst: "最初にリストを選択してください",
    loading: "計算中...",
    result: "結果",
    tryAnother: "別のリストを試す",
    shareList: "リストを共有",
    viewPrice: "価格を見る",
    price: "価格",
    calculate: "計算",
    shareError: "リストを共有できませんでした"
  },
  hi: {
    title: "मूल्य कैलकुलेटर",
    selectList: "एक सूची चुनें",
    noLists: "कोई सहेजी गई सूची नहीं",
    createListsFirst: "पहले इतिहास में सूचियां बनाएं",
    calculatePrice: "मूल्य की गणना करें",
    enterCountry: "अपना शहर दर्ज करें",
    country: "आपका शहर",
    viewCost: "लागत की गणना करें",
    placeholderExample: "दिल्ली, भारत",
    estimatedCost: "अनुमानित लागत",
    items: "आइटम",
    subscriptionRequired: "सदस्यता आवश्यक",
    subscribeMessage: "अनुमानित लागत की गणना के लिए आपको सदस्यता लेनी होगी।",
    subscribe: "सदस्यता लें",
    cancel: "रद्द करें",
    error: "त्रुटि",
    pleaseEnterCountry: "कृपया अपना शहर दर्ज करें।",
    couldNotFetchCost: "अनुमानित लागत प्राप्त नहीं कर सके।",
    selectListFirst: "कृपया पहले एक सूची चुनें",
    loading: "गणना हो रही है...",
    result: "परिणाम",
    tryAnother: "दूसरी सूची आज़माएं",
    shareList: "सूची साझा करें",
    viewPrice: "मूल्य देखें",
    price: "मूल्य",
    calculate: "गणना करें",
    shareError: "सूची साझा नहीं कर सके"
  },
  nl: {
    title: "Prijscalculator",
    selectList: "Selecteer een lijst",
    noLists: "Geen opgeslagen lijsten",
    createListsFirst: "Maak eerst lijsten in geschiedenis",
    calculatePrice: "Prijs berekenen",
    enterCountry: "Voer uw stad in",
    country: "Uw stad",
    viewCost: "Kosten berekenen in",
    placeholderExample: "Amsterdam, Nederland",
    estimatedCost: "Geschatte kosten",
    items: "items",
    subscriptionRequired: "Abonnement vereist",
    subscribeMessage: "U moet een abonnement hebben om de geschatte kosten te berekenen.",
    subscribe: "Abonneren",
    cancel: "Annuleren",
    error: "Fout",
    pleaseEnterCountry: "Voer uw stad in.",
    couldNotFetchCost: "Kon de geschatte kosten niet ophalen.",
    selectListFirst: "Selecteer eerst een lijst",
    loading: "Berekenen...",
    result: "Resultaat",
    tryAnother: "Probeer een andere lijst",
    shareList: "Lijst delen",
    viewPrice: "Prijs bekijken",
    price: "Prijs",
    calculate: "Berekenen",
    shareError: "Kon de lijst niet delen"
  }
}

const costEstimatePrompts = {
  en: "You are an assistant that calculates the estimated cost of a shopping list in ${country}. Provide detailed breakdown with individual item prices in ${currency} currency. Show: item name, quantity, price per item. End with total cost.",
  es: "Eres un asistente que calcula el costo estimado de una lista de compras en ${country}. Proporciona un desglose detallado con precios individuales en moneda ${currency}. Muestra: nombre del artículo, cantidad, precio por artículo. Termina con el costo total.",
  de: "Sie sind ein Assistent, der die geschätzten Kosten einer Einkaufsliste in ${country} berechnet. Geben Sie eine detaillierte Aufschlüsselung mit Einzelpreisen in ${currency}-Währung an. Zeigen Sie: Artikelname, Menge, Preis pro Artikel. Enden Sie mit den Gesamtkosten.",
  it: "Sei un assistente che calcola il costo stimato di una lista della spesa in ${country}. Fornisci un dettaglio con prezzi individuali in valuta ${currency}. Mostra: nome articolo, quantità, prezzo per articolo. Termina con il costo totale.",
  fr: "Vous êtes un assistant qui calcule le coût estimé d'une liste de courses en ${country}. Fournissez une ventilation détaillée avec les prix individuels en devise ${currency}. Affichez : nom de l'article, quantité, prix par article. Terminez par le coût total.",
  tr: "Siz ${country} ülkesindeki bir alışveriş listesinin tahmini maliyetini hesaplayan bir asistansınız. ${currency} para biriminde bireysel ürün fiyatlarıyla detaylı dökümü sağlayın. Gösterin: ürün adı, miktar, ürün başına fiyat. Toplam maliyetle bitirin.",
  pt: "Você é um assistente que calcula o custo estimado de uma lista de compras em ${country}. Forneça um detalhamento com preços individuais em moeda ${currency}. Mostre: nome do item, quantidade, preço por item. Termine com o custo total.",
  ru: "Вы помощник, который рассчитывает примерную стоимость списка покупок в ${country}. Предоставьте подробную разбивку с отдельными ценами в валюте ${currency}. Покажите: название товара, количество, цена за единицу. Закончите общей стоимостью.",
  ar: "أنت مساعد يحسب التكلفة التقديرية لقائمة التسوق في ${country}. قدم تفصيلاً مفصلاً مع أسعار فردية بعملة ${currency}. أظهر: اسم المنتج، الكمية، السعر لكل منتج. انته بالتكلفة الإجمالية.",
  hu: "Ön egy asszisztens, aki kiszámítja egy bevásárlólista becsült költségét ${country} országban. Adjon részletes lebontást az egyes tételek áraival ${currency} pénznemben. Mutassa: termék neve, mennyiség, egységár. Fejezze be a teljes költséggel.",
  ja: "${country}での買い物リストの推定コストを計算するアシスタントです。${currency}通貨で個別商品価格の詳細な内訳を提供してください。表示：商品名、数量、単価。合計金額で終了。",
  hi: "आप ${country} में खरीदारी सूची की अनुमानित लागत की गणना करने वाले सहायक हैं। ${currency} मुद्रा में व्यक्तिगत वस्तु मूल्यों के साथ विस्तृत विवरण दें। दिखाएं: वस्तु का नाम, मात्रा, प्रति वस्तु मूल्य। कुल लागत के साथ समाप्त करें।",
  nl: "U bent een assistent die de geschatte kosten van een boodschappenlijst in ${country} berekent. Geef gedetailleerde uitsplitsing met individuele artikelprijzen in ${currency} valuta. Toon: artikelnaam, hoeveelheid, prijs per artikel. Eindig met totale kosten."
}

const PriceCalculatorScreen = ({ navigation, route }) => {
  const { onNavigateToSubscribe } = route?.params || {}
  const { theme } = useTheme()
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  const deviceCurrency = RNLocalize.getCurrencies()[0] || 'USD'
  const deviceCountry = RNLocalize.getCountry()
  const t = translations[deviceLanguage] || translations.en
  
  const [savedLists, setSavedLists] = useState([])
  const [selectedList, setSelectedList] = useState(null)
  const [countryModalVisible, setCountryModalVisible] = useState(false)
  const [country, setCountry] = useState('')
  const [loading, setLoading] = useState(false)
  const [estimatedCost, setEstimatedCost] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [subscriptionModalVisible, setSubscriptionModalVisible] = useState(false)
  const [priceHistory, setPriceHistory] = useState({})

  useEffect(() => {
    loadSavedLists()
    checkSubscription()
    loadSavedCountry()
    loadPriceHistory()
  }, [])

  const checkSubscription = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo()
      if (customerInfo.entitlements.active["12981"]) {
        setIsSubscribed(true)
      } else {
        setIsSubscribed(false)
      }
    } catch (error) {
      console.error('Error checking subscription:', error)
      setIsSubscribed(false)
    }
  }

  const loadSavedCountry = async () => {
    try {
      const savedCountry = await AsyncStorage.getItem('@country')
      if (savedCountry) {
        setCountry(savedCountry)
      }
    } catch (error) {
      console.error('Error loading saved country:', error)
    }
  }

  const loadPriceHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('priceCalculatorHistory')
      if (history) {
        setPriceHistory(JSON.parse(history))
      }
    } catch (error) {
      console.error('Error loading price history:', error)
    }
  }

  const savePriceHistory = async (listId, city, result) => {
    try {
      const historyKey = `${listId}_${city}`
      const newHistory = {
        ...priceHistory,
        [historyKey]: {
          result,
          city,
          date: new Date().toISOString(),
          currency: getCurrencyFromCity(city)
        }
      }
      setPriceHistory(newHistory)
      await AsyncStorage.setItem('priceCalculatorHistory', JSON.stringify(newHistory))
    } catch (error) {
      console.error('Error saving price history:', error)
    }
  }

  const getHistoryForList = (listId, city) => {
    const historyKey = `${listId}_${city}`
    const result = priceHistory[historyKey]
    return result
  }

  const loadSavedLists = async () => {
    try {
      const history = await AsyncStorage.getItem('@shopping_history')
      if (history) {
        const lists = JSON.parse(history)
        const validLists = lists.filter(item => 
          item && 
          typeof item === 'object' && 
          item.list && 
          Array.isArray(item.list) &&
          item.date
        )
        setSavedLists(validLists.reverse())
      }
    } catch (error) {
      console.error('Error loading lists:', error)
    }
  }

  const handleCalculatePrice = () => {
    if (!selectedList) {
      Alert.alert(t.error, t.selectListFirst)
      return
    }
    setCountryModalVisible(true)
  }

  const handleSaveCountry = async () => {
    if (!country.trim()) {
      Alert.alert(t.error, t.pleaseEnterCountry)
      return
    }

    if (!isSubscribed) {
      setCountryModalVisible(false)
      setSubscriptionModalVisible(true)
      return
    }

    try {
      await AsyncStorage.setItem('@country', country)
      setCountryModalVisible(false)
      await fetchEstimatedCost()
    } catch (error) {
      console.error('Error saving country:', error)
    }
  }

  const getCurrencyFromCity = (city) => {
    const cityLower = city.toLowerCase()
    
    // Europa - EUR
    if (cityLower.includes('madrid') || cityLower.includes('barcelona') || cityLower.includes('valencia') ||
        cityLower.includes('paris') || cityLower.includes('lyon') || cityLower.includes('marseille') ||
        cityLower.includes('berlin') || cityLower.includes('munich') || cityLower.includes('hamburg') ||
        cityLower.includes('rome') || cityLower.includes('milan') || cityLower.includes('naples') ||
        cityLower.includes('amsterdam') || cityLower.includes('rotterdam') || cityLower.includes('vienna') ||
        cityLower.includes('brussels') || cityLower.includes('lisbon') || cityLower.includes('porto') ||
        cityLower.includes('athens') || cityLower.includes('dublin') || cityLower.includes('helsinki') ||
        cityLower.includes('stockholm') || cityLower.includes('copenhagen') || cityLower.includes('oslo')) {
      return 'EUR'
    }
    
    // USA - USD
    if (cityLower.includes('new york') || cityLower.includes('los angeles') || cityLower.includes('chicago') ||
        cityLower.includes('miami') || cityLower.includes('san francisco') || cityLower.includes('boston') ||
        cityLower.includes('washington') || cityLower.includes('atlanta') || cityLower.includes('dallas') ||
        cityLower.includes('houston') || cityLower.includes('philadelphia') || cityLower.includes('phoenix')) {
      return 'USD'
    }
    
    // Suiza - CHF
    if (cityLower.includes('zurich') || cityLower.includes('geneva') || cityLower.includes('basel') ||
        cityLower.includes('bern') || cityLower.includes('lausanne')) {
      return 'CHF'
    }
    
    // Reino Unido - GBP
    if (cityLower.includes('london') || cityLower.includes('manchester') || cityLower.includes('birmingham') ||
        cityLower.includes('glasgow') || cityLower.includes('liverpool') || cityLower.includes('edinburgh')) {
      return 'GBP'
    }
    
    // Canadá - CAD
    if (cityLower.includes('toronto') || cityLower.includes('montreal') || cityLower.includes('vancouver') ||
        cityLower.includes('calgary') || cityLower.includes('ottawa')) {
      return 'CAD'
    }
    
    // Por defecto EUR para ciudades europeas no especificadas
    return 'EUR'
  }

  const fetchEstimatedCost = async () => {
    setLoading(true)
    setShowResult(true)
    
    const estimatePrompt = costEstimatePrompts[deviceLanguage] || costEstimatePrompts["en"]
    const cityCurrency = getCurrencyFromCity(country)
    
    // Convertir lista a string
    const listItems = selectedList.list.map(item => 
      typeof item === 'string' ? item : item.text || item.name || String(item)
    )

    try {
      const response = await axios.post(API_KEY_ANALIZE, {
        model: "gpt-4.1",
        max_tokens: 400,
        messages: [
          {
            role: "system",
            content: estimatePrompt
              .replace("${country}", country)
              .replace("${currency}", cityCurrency),
          },
          {
            role: "user",
            content: listItems.join(", "),
          },
        ],
      })
      
      const estimatedCostResponse = response.data.choices[0].message.content
      console.log("API response for cost:", estimatedCostResponse)
      setEstimatedCost(`${estimatedCostResponse}`)
      console.log("estimatedCost state set to:", estimatedCostResponse)
      
      // Guardar en historial
      if (selectedList && country) {
        const listId = selectedList.date || selectedList.name || Date.now().toString()
        savePriceHistory(listId, country, estimatedCostResponse)
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching estimated cost:', error)
      Alert.alert(t.error, t.couldNotFetchCost)
      setLoading(false)
      setShowResult(false)
    }
  }

  const resetCalculator = () => {
    setSelectedList(null)
    setEstimatedCost('')
    setShowResult(false)
    // Forzar recarga de la vista para que se muestren los botones "Ver Precio"
    loadSavedLists()
  }

  const shareShoppingList = async (list) => {
    const listItems = list.list.map(item => 
      typeof item === 'string' ? item : item.text || item.name || String(item)
    )
    const listString = listItems.join("\n")
    try {
      await Share.share({
        message: listString,
        title: t.shareList,
      })
    } catch (error) {
      console.error("Error sharing shopping list: ", error)
      Alert.alert(t.error, t.shareError)
    }
  }

  const showHistoricalPrice = (list) => {
    const listId = list.date || list.name || Date.now().toString()
    const history = getHistoryForList(listId, country)
    if (history) {
      setSelectedList(list)
      setEstimatedCost(history.result)
      setShowResult(true)
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background || '#fefefe',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 50,
      paddingBottom: 20,
      backgroundColor: theme.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.backgroundtres + '20',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginLeft: 15,

    },
    content: {
      flex: 1,
      padding: 20,
      paddingTop: 10,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 15,
      marginLeft:15,
    
    },
    listContainer: {
      flex: 1,
      borderRadius: 15,
      padding: 10,
    },
    listItem: {
      flexDirection: 'row',
      padding: 15,
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
      borderRadius: 12,
      marginBottom: 10,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'transparent',
    },
    listItemContent: {
      flex: 1,
    },
    listItemTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    listItemSubtitle: {
      fontSize: 12,
      color: theme === 'dark' ? '#888' : '#666',
      marginBottom: 4,
    },
    listItemPreview: {
      fontSize: 12,
      color: theme === 'dark' ? '#aaa' : '#888',
      fontStyle: 'italic',
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
    },
    emptyText: {
      fontSize: 16,
      color: theme === 'dark' ? '#888' : '#666',
      marginTop: 15,
      textAlign: 'center',
    },
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      width: screenWidth * 0.9,
      backgroundColor: theme === 'dark' ? '#2a2a2a' : '#fff',
      borderRadius: 20,
      padding: 25,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 8,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 20,
      textAlign: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#444' : '#ddd',
      borderRadius: 12,
      padding: 15,
      fontSize: 16,
      color: theme.text,
      backgroundColor: theme === 'dark' ? '#333' : '#f9f9f9',
      marginBottom: 20,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    cancelButton: {
      flex: 1,
      padding: 15,
      borderRadius: 12,
      backgroundColor: 'rgba(220, 38, 38, 0.3)',
      borderWidth: 1,
      borderColor: 'rgba(220, 38, 38, 0.5)',
      marginRight: 10,
      alignItems: 'center',
    },
    confirmButton: {
      flex: 1,
      padding: 15,
      borderRadius: 12,
      backgroundColor: 'rgba(22, 163, 74, 0.3)',
      borderWidth: 1,
      borderColor: 'rgba(22, 163, 74, 0.5)',
      marginLeft: 10,
      alignItems: 'center',
    },
    confirmButtonText: {
      color: '#16a34a',
      fontSize: 16,
      fontWeight: '600',
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    resultContainer: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f8f9fa',
      padding: 20,
      paddingTop: 50,
    },
    resultCard: {
      backgroundColor: theme === 'dark' ? '#2a2a2a' : '#fff',
      borderRadius: 24,
      padding: 25,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
      elevation: 8,
      width: '100%',
      maxHeight: screenHeight * 0.75,
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#333' : '#f0f0f0',
    },
    resultTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 20,
      textAlign: 'center',
    },
    resultCost: {
      fontSize: 15,
      fontWeight: '500',
      color: theme.text,
      marginBottom: 20,
      lineHeight: 22,
      paddingHorizontal: 5,
    },
    resultCountry: {
      fontSize: 16,
      color: '#dc2626',
      marginBottom: 25,
      textAlign: 'center',
      fontWeight: '600',
    },
    tryAnotherButton: {
      backgroundColor: theme === 'dark' ? '#333' : '#f0f0f0',
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 28,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    tryAnotherText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '500',
    },
    shareButton: {
      backgroundColor: '#16a34a',
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 28,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#16a34a',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
      marginBottom: 40,
    },
    shareIcon: {
      marginRight: 8,
    },
    shareText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '500',
    },
    viewPriceButton: {
      backgroundColor: 'rgba(220, 38, 38, 0.3)',
      paddingHorizontal: 8,
      paddingVertical: 8,
      borderRadius: 8,
      marginLeft: 10,
      width: 80,
      borderWidth: 1,
      borderColor: 'rgba(220, 38, 38, 0.5)',
    },
    viewPriceText: {
      color: '#dc2626',
      fontSize: 11,
      fontWeight: '700',
      textAlign: 'center',
    },
    buttonContainer: {
      flexDirection: 'column',
      alignItems: 'flex-end',
      marginLeft: 10,
    },
    calculateAgainSmallButton: {
      backgroundColor: 'rgba(22, 163, 74, 0.3)',
      paddingHorizontal: 8,
      paddingVertical: 8,
      borderRadius: 8,
      marginTop: 4,
      width: 80,
      borderWidth: 1,
      borderColor: 'rgba(22, 163, 74, 0.5)',
    },
    calculateAgainSmallText: {
      color: '#16a34a',
      fontSize: 11,
      fontWeight: '700',
      textAlign: 'center',
    },
  })

  if (showResult) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#dc2626" />
          ) : (
            <ScrollView style={styles.resultCard} showsVerticalScrollIndicator={false}>
              <Text style={styles.resultTitle}>{t.estimatedCost}</Text>
              <Text style={styles.resultCost}>{estimatedCost}</Text>
              <Text style={styles.resultCountry}>{country}</Text>
              <TouchableOpacity 
                style={styles.tryAnotherButton}
                onPress={resetCalculator}
              >
                <Text style={styles.tryAnotherText}>{t.tryAnother}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.shareButton}
                onPress={() => shareShoppingList(selectedList)}
              >
                <Ionicons name="share-outline" size={18} color="#fff" style={styles.shareIcon} />
                <Text style={styles.shareText}>{t.shareList}</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {savedLists.length > 0 && (
          <Text style={styles.sectionTitle}>{t.selectList}</Text>
        )}

        {savedLists.length === 0 ? (
          <View style={{ flex: 1 }}>
            <View style={styles.emptyState}>
              <Ionicons name="list-outline" size={48} color={theme === 'dark' ? '#666' : '#ccc'} />
              <Text style={styles.emptyText}>{t.noLists}</Text>
              <Text style={[styles.emptyText, { fontSize: 14 }]}>{t.createListsFirst}</Text>
            </View>
            <TouchableOpacity 
              style={[
                styles.calculateButton,
                styles.calculateButtonDisabled
              ]}
              disabled={true}
            >


            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={savedLists}
            style={styles.listContainer}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              const previewItems = item.list?.slice(0, 3).map(listItem => 
                typeof listItem === 'string' ? listItem : listItem.text || listItem.name || String(listItem)
              ) || []
              
              const listId = item.date || item.name || Date.now().toString()
              const hasHistory = country && getHistoryForList(listId, country)
              
              return (
                <View
                  style={styles.listItem}
                >
                  <View style={styles.listItemContent}>
                    <Text style={styles.listItemTitle}>
                      {item.name || `Lista ${index + 1}`}
                    </Text>
                    <Text style={styles.listItemSubtitle}>
                      {new Date(item.date).toLocaleDateString()} • {item.list?.length || 0} {t.items}
                    </Text>
                    <Text style={styles.listItemPreview} numberOfLines={1}>
                      {previewItems.join(', ')}{item.list?.length > 3 ? '...' : ''}
                    </Text>
                  </View>
                  <View style={styles.buttonContainer}>
                    {hasHistory && (
                      <TouchableOpacity
                        style={styles.viewPriceButton}
                        onPress={() => showHistoricalPrice(item)}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                          <Ionicons name="location-outline" size={12} color="#dc2626" />
                          <Text style={[styles.viewPriceText, { marginLeft: 4 }]} numberOfLines={1} ellipsizeMode="tail">
                            {getHistoryForList(listId, country)?.city}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.calculateAgainSmallButton}
                      onPress={() => {
                        setSelectedList(item)
                        // Use item directly instead of relying on state update
                        if (!item) {
                          Alert.alert(t.error, t.selectListFirst)
                          return
                        }
                        setCountryModalVisible(true)
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="calculator-outline" size={12} color="#16a34a" />
                        <Text style={[styles.calculateAgainSmallText, { marginLeft: 4 }]} numberOfLines={1}>
                          {t.calculate}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            }}
            ListFooterComponent={null}
          />
        )}
      </View>

      {/* Country Modal */}
      <Modal
        visible={countryModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCountryModalVisible(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.enterCountry}</Text>
            
            <TextInput
              style={styles.input}
              placeholder={t.placeholderExample}
              placeholderTextColor={theme === 'dark' ? '#666' : '#999'}
              value={country}
              onChangeText={setCountry}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setCountryModalVisible(false)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="close" size={16} color="#dc2626" />
                  <Text style={[styles.buttonText, { color: '#dc2626', marginLeft: 6 }]}>
                    {t.cancel}
                  </Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleSaveCountry}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="calculator" size={16} color="#16a34a" />
                  <Text style={[styles.confirmButtonText, { marginLeft: 6 }]}>
                    {t.calculate}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Subscription Modal */}
      <Modal
        visible={subscriptionModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSubscriptionModalVisible(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <View style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: '#dc2626' + '20',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 15
              }}>
                <Ionicons name="star" size={32} color="#dc2626" />
              </View>
              <Text style={[styles.modalTitle, { color: '#dc2626' }]}>{t.subscriptionRequired}</Text>
            </View>
            
            <Text style={{
              fontSize: 16,
              color: theme.text,
              textAlign: 'center',
              marginBottom: 30,
              lineHeight: 24
            }}>
              {t.subscribeMessage}
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={[styles.cancelButton, { flex: 1 }]}
                onPress={() => setSubscriptionModalVisible(false)}
              >
                <Text style={[styles.buttonText, { color: '#dc2626' }]}>{t.cancel}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmButton, { backgroundColor: '#dc2626', borderColor: '#dc2626', flex: 1 }]}
                onPress={() => {
                  setSubscriptionModalVisible(false)
                  if (onNavigateToSubscribe) {
                    onNavigateToSubscribe()
                  }
                }}
              >
                <Text style={[styles.buttonText, { color: '#fff' }]}>{t.subscribe}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default PriceCalculatorScreen