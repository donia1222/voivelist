"use client"

import { useState, useEffect, useRef } from "react"
import {
  Text,
  View,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Share,
} from "react-native"
import { BarCodeScanner } from 'expo-barcode-scanner'
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Modalize } from "react-native-modalize"
import { Swipeable } from "react-native-gesture-handler"
import { LogBox } from "react-native"
import * as RNLocalize from "react-native-localize"
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads"
import Purchases from "react-native-purchases"

// No more image imports needed - using Ionicons instead

// Translations
const translations = {
  en: "Scan barcodes",
  es: "Escanear códigos de barras",
  de: "Scannen Barcodes",
  fr: "Scanner les codes-barres",
  it: "Scansiona i codici a barre",
  tr: "Barkodları Tara",
  pt: "Digitalizar os códigos de barras",
  ru: "Сканировать штрихкоды",
  zh: "扫描条形码",
  ja: "バーコードをスキャン",
  pl: "Skanuj kody kreskowe",
  sv: "Skanna streckkoder",
  hu: "Vonalkódok beolvasása",
  ar: "مسح الباركودات ضوئيًا",
  hi: "बारकोड स्कैन करें",
  el: "Σάρωση των γραμμωτών κωδίκων",
  nl: "Scan de barcodes",
  sl: "Skenirajte črtne kode",
}

const translationsScan = {
  en: "Scan",
  es: "Escanear",
  de: "Scannen",
  fr: "Scanner",
  it: "Scansiona",
  tr: "Tara",
  pt: "Digitalizar",
  ru: "Сканировать",
  zh: "扫描",
  ja: "スキャン",
  pl: "Skanuj",
  sv: "Skanna",
  hu: "Beolvas",
  ar: "مسح ضوئي",
  hi: "स्कैन करें",
  el: "Σάρωση",
  nl: "Scannen",
  sl: "Skeniraj",
}

const translationsChooseMethod = {
  en: "Choose scanning method:",
  es: "Elige el método de escaneo:",
  de: "Scan-Methode wählen:",
  fr: "Choisissez la méthode de scan:",
  it: "Scegli il metodo di scansione:",
  tr: "Tarama yöntemini seçin:",
  pt: "Escolha o método de digitalização:",
  ru: "Выберите метод сканирования:",
  zh: "选择扫描方法:",
  ja: "スキャン方法を選択:",
  pl: "Wybierz metodę skanowania:",
  sv: "Välj skanningsmetod:",
  hu: "Válassza ki a beolvasási módot:",
  ar: "اختر طريقة الفحص:",
  hi: "स्कैनिंग विधि चुनें:",
  el: "Επιλέξτε μέθοδο σάρωσης:",
  nl: "Kies scanmethode:",
  sl: "Izberite način skeniranja:",
}

const translationsTakePhoto = {
  en: "Take Photo & Enter Code",
  es: "Tomar Foto e Ingresar Código",
  de: "Foto aufnehmen & Code eingeben",
  fr: "Prendre une photo & entrer le code",
  it: "Scatta foto e inserisci codice",
  tr: "Fotoğraf çek & Kod gir",
  pt: "Tirar foto & inserir código",
  ru: "Сделать фото и ввести код",
  zh: "拍照并输入代码",
  ja: "写真を撮ってコードを入力",
  pl: "Zrób zdjęcie i wprowadź kod",
  sv: "Ta foto & ange kod",
  hu: "Készítsen fotót és írja be a kódot",
  ar: "التقط صورة وأدخل الرمز",
  hi: "फोटो लें और कोड दर्ज करें",
  el: "Βγάλτε φωτογραφία και εισάγετε κωδικό",
  nl: "Maak foto & voer code in",
  sl: "Poslikaj in vnesi kodo",
}

const translationsManualEntry = {
  en: "Enter Code Manually",
  es: "Ingresar Código Manualmente",
  de: "Code manuell eingeben",
  fr: "Entrer le code manuellement",
  it: "Inserisci codice manualmente",
  tr: "Kodu manuel gir",
  pt: "Inserir código manualmente",
  ru: "Ввести код вручную",
  zh: "手动输入代码",
  ja: "コードを手動入力",
  pl: "Wprowadź kod ręcznie",
  sv: "Ange kod manuellt",
  hu: "Írja be a kódot kézzel",
  ar: "أدخل الرمز يدوياً",
  hi: "कोड मैन्युअल रूप से दर्ज करें",
  el: "Εισάγετε κωδικό χειροκίνητα",
  nl: "Code handmatig invoeren",
  sl: "Ročno vnesi kodo",
}

const translationsCancel = {
  en: "Cancel",
  es: "Cancelar",
  de: "Abbrechen",
  fr: "Annuler",
  it: "Annulla",
  tr: "İptal",
  pt: "Cancelar",
  ru: "Отмена",
  zh: "取消",
  ja: "キャンセル",
  pl: "Anuluj",
  sv: "Avbryt",
  hu: "Mégse",
  ar: "إلغاء",
  hi: "रद्द करें",
  el: "Ακύρωση",
  nl: "Annuleren",
  sl: "Prekliči",
}

const translationsLatestScans = {
  en: "Latest scans",
  es: "Últimos escaneos",
  de: "Letzte Scans",
  fr: "Derniers scans",
  it: "Ultime scansioni",
  tr: "Son taramalar",
  pt: "Últimos escaneamentos",
  ru: "Последние сканирования",
  zh: "最近的扫描",
  ja: "最新のスキャン",
  pl: "Ostatnie skanowania",
  sv: "Senaste skanningar",
  hu: "Legutóbbi beolvasások",
  ar: "آخر عمليات الفحص",
  hi: "नवीनतम स्कैन",
  el: "Τελευταίες σαρώσεις",
  nl: "Laatste scans",
  sl: "Zadnji skeni",
}

const translationsDiscoverScan = {
  en: {
    title: "With each scan, discover if the product contains:",
    items: [
      "🐸 Rainforest Alliance certifications.",
      "🐜 Identifies if it contains carmine (E120).",
      "📊 Nutritional Grade (Nutri-Score).",
      "🥦 Content of carbohydrates, proteins, and fats.",
      "🔥 Amount of calories per 100g.",
      "🍬 Total amount of sugars present.",
      "🧂 Salt: Amount of salt per 100g.",
      "🚫 Details on the presence of allergens.",
    ],
  },
  es: {
    title: "Con cada escaneo, descubre si el producto contiene:",
    items: [
      "🐸 Certificaciones Rainforest Alliance.",
      "🐜 Identifica si contiene carmín (E120).",
      "📊 Grado Nutricional (Nutri-Score).",
      "🥦 Contenido de carbohidratos, proteínas, y grasas.",
      "🔥 Cantidad de calorías por 100g.",
      "🍬 Cantidad total de azúcares presentes.",
      "🧂 Sal: Cantidad de sal por 100g.",
      "🚫 Detalles sobre la presencia de alérgenos.",
    ],
  },
  // Additional languages would be added here
}

const translationsHistoryDetails = {
  en: {
    nutriScore: "Nutri-Score:",
    carbohydrates: "Carbohydrates:",
    energy: "Energy:",
    sugars: "Sugars:",
    fats: "Fats:",
    proteins: "Proteins:",
    salt: "Salt:",
    containsCarmine: "Contains E120 🐜 (carmine)",
    doesNotContainCarmine: "Does not contain E120 🐜",
    certifiedRainforest: "Certified Rainforest Alliance 🐸",
    notCertifiedRainforest: "Not Rainforest Alliance 🐸",
    vermas: "View more colorants",
    vermenos: "View less",
  },
  es: {
    nutriScore: "Grado Nutricional (Nutri-Score):",
    carbohydrates: "Carbohidratos:",
    energy: "Energía:",
    sugars: "Azúcares:",
    fats: "Grasas:",
    proteins: "Proteínas:",
    salt: "Sal:",
    containsCarmine: "Contiene E120 🐜 (carmín)",
    doesNotContainCarmine: "No contiene E120 🐜",
    certifiedRainforest: "Certificado Rainforest Alliance 🐸",
    notCertifiedRainforest: "No Rainforest Alliance 🐸",
    vermas: "ver mas colorantes",
    vermenos: "ver menos",
  },
  // Additional languages would be added here
}

// Get system language
const systemLanguage = RNLocalize.getLocales()[0].languageCode
const latestScansText = translationsLatestScans[systemLanguage] || translationsLatestScans.en
const scanBarcodeText = translations[systemLanguage] || translations.en
const scanText = translationsScan[systemLanguage] || translationsScan.en
const chooseMethodText = translationsChooseMethod[systemLanguage] || translationsChooseMethod.en
const takePhotoText = translationsTakePhoto[systemLanguage] || translationsTakePhoto.en
const manualEntryText = translationsManualEntry[systemLanguage] || translationsManualEntry.en
const cancelText = translationsCancel[systemLanguage] || translationsCancel.en
const scanTexts = translationsDiscoverScan[systemLanguage] || translationsDiscoverScan.en
const translationsHistoryDetailss = translationsHistoryDetails[systemLanguage] || translationsHistoryDetails.en

const windowHeight = Dimensions.get("window").height
const windowWidth = Dimensions.get("window").width

// Ignore specific warnings
LogBox.ignoreLogs(["ViewPropTypes will be removed", "Property 'requestCameraPermissionsAsync' doesn't exist"])

const BarcodeScannerComponent = ({ navigation }) => {
  const [scanned, setScanned] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [hasPermission, setHasPermission] = useState(null)
  const [productInfo, setProductInfo] = useState(null)
  const [productImage, setProductImage] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [history, setHistory] = useState([])
  const modalizeRef = useRef(null)
  const screenHeight = Dimensions.get("window").height
  const modalHeight = screenHeight * 0.7
  const [isModalOpened, setIsModalOpened] = useState(false)
  const [showScanInfo, setShowScanInfo] = useState(true)
  const [isResultModalOpened, setIsResultModalOpened] = useState(false)
  const resultModalRef = useRef(null)
  const [colorants, setColorants] = useState([])
  const [showColorants, setShowColorants] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Request camera permissions
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    }
    getBarCodeScannerPermissions()
  }, [])

  // Purchases listener
  useEffect(() => {
    const listener = Purchases.addCustomerInfoUpdateListener((customerInfo) => {
      console.log("Customer info updated:", customerInfo)
      if (customerInfo.entitlements.active["semana16"]) {
        console.log("User already subscribed")
        setIsSubscribed(true)
      } else {
        console.log("User not subscribed")
        setIsSubscribed(false)
      }
    })

    return () => {
      // Clean up listener when component unmounts
      if (listener && typeof listener.remove === "function") {
        listener.remove()
      }
    }
  }, [])

  // Share product details function
  const shareProductDetails = async (productInfo) => {
    let message = `${productInfo.product_name}\n${translationsHistoryDetailss.nutriScore}: ${productInfo.nutrition_grades?.toUpperCase()}\n${translationsHistoryDetailss.carbohydrates}: ${productInfo.nutriments.carbohydrates_100g} g\n${translationsHistoryDetailss.energy}: ${productInfo.nutriments["energy-kcal_100g"]} kcal\n${translationsHistoryDetailss.sugars}: ${productInfo.nutriments.sugars_100g} g\n${translationsHistoryDetailss.fats}: ${productInfo.nutriments.fat_100g} g\n${translationsHistoryDetailss.proteins}: ${productInfo.nutriments.proteins_100g} g\n${translationsHistoryDetailss.salt}: ${productInfo.nutriments.salt_100g} g`

    if (productInfo.additives_tags) {
      if (productInfo.additives_tags.includes("en:e120")) {
        message += `\n${translationsHistoryDetailss.containsCarmine}`
      }
      if (showColorants) {
        productInfo.additives_tags.forEach((additive) => {
          message += `\n${additive.replace("en:", "")}`
        })
      }
    }

    if (productInfo.labels_tags && productInfo.labels_tags.includes("en:rainforest-alliance")) {
      message += `\n${translationsHistoryDetailss.certifiedRainforest}`
    }

    try {
      await Share.share({
        message: message,
      })
    } catch (error) {
      console.error("Error sharing:", error.message)
    }
  }

  // Modal management
  useEffect(() => {
    if (isResultModalOpened) {
      resultModalRef.current?.open()
    }
  }, [isResultModalOpened])

  useEffect(() => {
    if (modalizeRef.current) {
      if (isModalOpened) {
        modalizeRef.current.open()
      } else {
        modalizeRef.current.close()
      }
    }
  }, [isModalOpened])

  const openModal = () => {
    setIsModalOpened(true)
  }

  const closeModal = () => {
    setIsModalOpened(false)
  }

  // History item component
  const HistoryItem = ({ item, onDelete }) => {
    const [expanded, setExpanded] = useState(false)
    const [showItemColorants, setShowItemColorants] = useState(false)

    const handleAnalyzeAnother = () => {
      // Close all modals first
      setIsModalOpened(false)
      setIsResultModalOpened(false)

      // Small delay then open camera
      setTimeout(() => {
        if (hasPermission) {
          setShowCamera(true)
          setScanned(false)
          setShowScanInfo(false)
        } else {
          Alert.alert('Permiso requerido', 'Necesitamos acceso a la cámara para escanear códigos de barras')
        }
      }, 500)
    }

    return (
      <View style={styles.modernHistoryItem}>
        <TouchableOpacity
          style={styles.historyItemHeader}
          onPress={() => setExpanded(!expanded)}
          activeOpacity={0.7}
        >
          <View style={styles.historyItemLeft}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.modernHistoryImage} />
            ) : (
              <View style={styles.noImagePlaceholder}>
                <Ionicons name="image-outline" size={24} color="#999" />
              </View>
            )}
            <View style={styles.historyItemInfo}>
              <Text style={styles.modernHistoryTitle} numberOfLines={2}>
                {item.product_name || 'Producto sin nombre'}
              </Text>
              <Text style={styles.historyItemSubtitle}>
                {item.brand || 'Marca desconocida'}
              </Text>
            </View>
          </View>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#667eea"
          />
        </TouchableOpacity>

        {expanded && (
          <View style={styles.modernExpandedDetails}>
            <View style={styles.nutritionRow}>
              <View style={styles.nutritionCard}>
                <Text style={styles.nutritionValue}>
                  {item.nutriments?.["energy-kcal_100g"] || 0}
                </Text>
                <Text style={styles.nutritionLabel}>kcal</Text>
              </View>

              <View style={styles.nutritionCard}>
                <Text style={styles.nutritionValue}>
                  {item.nutriments?.carbohydrates_100g || 0}g
                </Text>
                <Text style={styles.nutritionLabel}>Carbohidratos</Text>
              </View>

              <View style={styles.nutritionCard}>
                <Text style={styles.nutritionValue}>
                  {item.nutriments?.proteins_100g || 0}g
                </Text>
                <Text style={styles.nutritionLabel}>Proteínas</Text>
              </View>
            </View>

            <View style={styles.modernActionButtons}>
              <TouchableOpacity
                onPress={handleAnalyzeAnother}
                style={styles.modernAnalyzeButton}
              >
                <Ionicons name="qr-code" size={18} color="#fff" />
                <Text style={styles.modernAnalyzeText}>Analizar otro</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => shareProductDetails(item)}
                style={styles.modernShareButton}
              >
                <Ionicons name="share-outline" size={18} color="#667eea" />
                <Text style={styles.modernShareText}>Compartir</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onDelete(item)}
                style={styles.modernDeleteButton}
              >
                <Ionicons name="trash-outline" size={18} color="#dc3545" />
                <Text style={styles.modernDeleteText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    )
  }

  // Load history from storage
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const historyData = await AsyncStorage.getItem("@productHistory")
        if (historyData) {
          setHistory(JSON.parse(historyData))
        }
      } catch (error) {
        console.error("Error fetching history:", error)
      }
    }

    fetchHistory()
  }, [])

  // Add product to history
  const addToHistory = async (newProduct) => {
    try {
      const updatedHistory = [newProduct, ...history]
      setHistory(updatedHistory)
      await AsyncStorage.setItem("@productHistory", JSON.stringify(updatedHistory))
    } catch (error) {
      console.error("Error adding to history:", error)
    }
  }

  // Delete item from history
  const handleDeleteItem = async (itemToDelete) => {
    try {
      const updatedHistory = history.filter((item) => item !== itemToDelete)
      setHistory(updatedHistory)
      await AsyncStorage.setItem("@productHistory", JSON.stringify(updatedHistory))
    } catch (error) {
      console.error("Error deleting item:", error)
    }
  }

  // Try multiple product databases
  const fetchProductData = async (barcode) => {
    setIsLoading(true)
    const cleanBarcode = barcode.replace(/[^0-9]/g, '')

    try {
      // Try UPC Database first (better coverage)
      const upcResult = await tryUPCDatabase(cleanBarcode)
      if (upcResult) {
        displayProduct(upcResult)
        return
      }

      // Try Open Food Facts as fallback
      const offResult = await tryOpenFoodFacts(cleanBarcode)
      if (offResult) {
        displayProduct(offResult)
        return
      }

      // If nothing found, create basic product info
      const basicProduct = {
        product_name: `Producto ${cleanBarcode}`,
        nutrition_grades: 'unknown',
        nutriments: {
          'energy-kcal_100g': 0,
          carbohydrates_100g: 0,
          sugars_100g: 0,
          fat_100g: 0,
          proteins_100g: 0,
          salt_100g: 0
        }
      }
      displayProduct(basicProduct)

    } catch (error) {
      Alert.alert("Error", "No se pudo buscar el producto.")
    } finally {
      setShowCamera(false)
      setScanned(false)
      setIsLoading(false)
    }
  }

  // UPC Database API
  const tryUPCDatabase = async (barcode) => {
    try {
      const response = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`)
      const data = await response.json()

      if (data.code === "OK" && data.items && data.items.length > 0) {
        const item = data.items[0]
        return {
          product_name: item.title || item.brand || "Producto encontrado",
          nutrition_grades: 'unknown',
          nutriments: {
            'energy-kcal_100g': 0,
            carbohydrates_100g: 0,
            sugars_100g: 0,
            fat_100g: 0,
            proteins_100g: 0,
            salt_100g: 0
          },
          brand: item.brand || '',
          category: item.category || ''
        }
      }
    } catch (error) {
      console.log("UPC Database failed")
    }
    return null
  }

  // Open Food Facts API (original)
  const tryOpenFoodFacts = async (barcode) => {
    try {
      const fields = "product_name,nutriscore_data,nutriments,nutrition_grades,labels_tags,selected_images,additives_tags"
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json?fields=${fields}`)
      const data = await response.json()

      if (data.status === 1 && data.product) {
        return data.product
      }
    } catch (error) {
      console.log("Open Food Facts failed")
    }
    return null
  }

  // Display product info
  const displayProduct = (product) => {
    setProductInfo(product)
    const imageUrl = product.selected_images?.front?.display?.en ||
                    product.selected_images?.front?.display?.fr ||
                    product.selected_images?.front?.small?.en ||
                    product.selected_images?.front?.small?.fr ||
                    null
    setProductImage(imageUrl)
    addToHistory({ ...product, imageUrl })
    setIsResultModalOpened(true)

    const colorants = product.additives_tags?.filter((tag) => tag.startsWith("en:e1")) || []
    setColorants(colorants)
  }

  // Handle barcode scanned
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true)
    setShowCamera(false)
    fetchProductData(data)
  }

  // Prompt user to manually enter barcode
  const promptForBarcode = () => {
    const enterBarcodeTexts = {
      en: { title: "Enter Barcode", message: "Please enter the barcode number from the product:", cancel: "Cancel", scan: "Scan" },
      es: { title: "Ingresar Código", message: "Por favor ingresa el número de código del producto:", cancel: "Cancelar", scan: "Escanear" },
      de: { title: "Barcode eingeben", message: "Bitte geben Sie die Barcode-Nummer des Produkts ein:", cancel: "Abbrechen", scan: "Scannen" },
      fr: { title: "Entrer le code-barres", message: "Veuillez entrer le numéro de code-barres du produit:", cancel: "Annuler", scan: "Scanner" },
      it: { title: "Inserisci codice a barre", message: "Inserisci il numero del codice a barre del prodotto:", cancel: "Annulla", scan: "Scansiona" },
    }

    const texts = enterBarcodeTexts[systemLanguage] || enterBarcodeTexts.en

    Alert.prompt(
      texts.title,
      texts.message,
      [
        {
          text: texts.cancel,
          style: "cancel"
        },
        {
          text: texts.scan,
          onPress: (barcode) => {
            if (barcode && barcode.trim()) {
              fetchProductData(barcode.trim())
            }
          }
        }
      ],
      "plain-text"
    )
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>

        {/* Modern Header */}
        {!showCamera && (
          <View style={styles.modernHeader}>
            <View style={styles.headerCard}>
              <Ionicons name="qr-code" size={40} color="#667eea" />
              <Text style={styles.modernHeaderText}>{scanBarcodeText}</Text>
              <Text style={styles.modernSubtitle}>Discover product information instantly</Text>
            </View>
          </View>
        )}

      {/* History Modal */}
      <Modalize
        ref={modalizeRef}
        modalHeight={modalHeight}
        modalStyle={styles.modalContainer}
        overlayStyle={styles.overlay}
        handleStyle={styles.handle}
        onClosed={closeModal}
      >
        <View style={styles.centeredView}>
          <Text style={styles.modalTitle}>{latestScansText}</Text>
          <View style={styles.modalView}>
            <ScrollView style={styles.historyScrollView}>
              {history.length > 0 ? (
                history.map((item, index) => <HistoryItem key={index} item={item} onDelete={handleDeleteItem} />)
              ) : (
                <Text style={styles.noHistoryText}>No scan history yet</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modalize>

      {/* Camera Scanner */}
      {showCamera && (
        <View style={styles.cameraContainer}>
          {hasPermission === null && (
            <View style={styles.permissionContainer}>
              <Text style={styles.permissionText}>Requesting camera permission...</Text>
            </View>
          )}
          {hasPermission === false && (
            <View style={styles.permissionContainer}>
              <Text style={styles.permissionText}>No access to camera</Text>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowCamera(false)}>
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            </View>
          )}
          {hasPermission === true && (
            <View style={styles.cameraView}>
              <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={styles.camera}
              />
              <View style={styles.cameraOverlay}>
                <View style={styles.scanFrame}>
                  <View style={styles.scanFrameCorner} />
                  <View style={[styles.scanFrameCorner, styles.topRight]} />
                  <View style={[styles.scanFrameCorner, styles.bottomLeft]} />
                  <View style={[styles.scanFrameCorner, styles.bottomRight]} />
                </View>
                <Text style={styles.scanInstructions}>Apunta la cámara al código de barras</Text>
                <View style={styles.cameraActions}>
                  <TouchableOpacity style={styles.manualEntryButton} onPress={promptForBarcode}>
                    <Ionicons name="create-outline" size={20} color="#fff" />
                    <Text style={styles.manualEntryText}>Manual</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelCameraButton} onPress={() => setShowCamera(false)}>
                    <Ionicons name="close" size={20} color="#fff" />
                    <Text style={styles.cancelCameraText}>{cancelText}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Modern Action Buttons */}
      {!showCamera && (
        <View style={styles.modernActionsContainer}>
          <TouchableOpacity
            style={styles.modernMainButton}
            onPress={() => {
              if (hasPermission) {
                setShowCamera(true)
                setScanned(false)
                setShowScanInfo(false)
              } else {
                Alert.alert('Permiso requerido', 'Necesitamos acceso a la cámara para escanear códigos de barras')
              }
            }}
          >
            <View style={styles.scanIconContainer}>
              <Ionicons name="qr-code" size={32} color="white" />
            </View>
            <Text style={styles.modernMainButtonText}>{scanText}</Text>
            <Text style={styles.modernMainButtonSubtext}>Tap to start scanning</Text>
          </TouchableOpacity>

          {/* History Card */}
          {history.length > 0 && (
            <TouchableOpacity style={styles.modernHistoryCard} onPress={openModal}>
              <View style={styles.historyCardContent}>
                <View style={styles.historyIconContainer}>
                  <Ionicons name="time-outline" size={24} color="#667eea" />
                </View>
                <View style={styles.historyTextContainer}>
                  <Text style={styles.modernHistoryTitle}>{latestScansText}</Text>
                  <Text style={styles.modernHistorySubtitle}>{history.length} products scanned</Text>
                </View>
                <Ionicons name="chevron-forward-outline" size={20} color="#667eea" />
              </View>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Product Result Modal */}
      {productInfo && (
        <Modalize
          ref={resultModalRef}
          modalHeight={modalHeight}
          modalStyle={styles.modalContainer}
          overlayStyle={styles.overlay}
          handleStyle={styles.handle}
          onClosed={() => setIsResultModalOpened(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {productInfo && (
                <View style={styles.productInfo}>
                  {productImage && <Image source={{ uri: productImage }} style={styles.productImage} />}
                  <Text style={styles.productName}>{productInfo.product_name}</Text>

                  <View style={styles.nutritionScoreContainer}>
                    <Text style={styles.nutritionScoreLabel}>{translationsHistoryDetailss.nutriScore}</Text>
                    <View
                      style={[
                        styles.nutritionScoreBadge,
                        productInfo.nutrition_grades === "a"
                          ? styles.scoreA
                          : productInfo.nutrition_grades === "b"
                            ? styles.scoreB
                            : productInfo.nutrition_grades === "c"
                              ? styles.scoreC
                              : productInfo.nutrition_grades === "d"
                                ? styles.scoreD
                                : styles.scoreE,
                      ]}
                    >
                      <Text style={styles.nutritionScoreText}>
                        {productInfo.nutrition_grades?.toUpperCase() || "?"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.nutritionGrid}>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>{translationsHistoryDetailss.carbohydrates}</Text>
                      <Text style={styles.nutritionValue}>{productInfo.nutriments.carbohydrates_100g} g</Text>
                    </View>

                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>{translationsHistoryDetailss.energy}</Text>
                      <Text style={styles.nutritionValue}>{productInfo.nutriments["energy-kcal_100g"]} kcal</Text>
                    </View>

                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>{translationsHistoryDetailss.sugars}</Text>
                      <Text style={styles.nutritionValue}>{productInfo.nutriments.sugars_100g} g</Text>
                    </View>

                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>{translationsHistoryDetailss.fats}</Text>
                      <Text style={styles.nutritionValue}>{productInfo.nutriments.fat_100g} g</Text>
                    </View>

                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>{translationsHistoryDetailss.proteins}</Text>
                      <Text style={styles.nutritionValue}>{productInfo.nutriments.proteins_100g} g</Text>
                    </View>

                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>{translationsHistoryDetailss.salt}</Text>
                      <Text style={styles.nutritionValue}>{productInfo.nutriments.salt_100g} g</Text>
                    </View>
                  </View>

                  {/* Certifications and Warnings */}
                  <View style={styles.certificationsContainer}>
                    {productInfo.additives_tags && productInfo.additives_tags.includes("en:e120") && (
                      <>
                        <Text style={styles.carmineWarning}>{translationsHistoryDetailss.containsCarmine}</Text>
                        <TouchableOpacity
                          style={showColorants ? styles.buttonStyleVerMenos : styles.buttonStyleVerMas}
                          onPress={() => setShowColorants(!showColorants)}
                        >
                          <Text style={styles.buttonTitleStyle}>
                            {showColorants ? translationsHistoryDetailss.vermenos : translationsHistoryDetailss.vermas}
                          </Text>
                        </TouchableOpacity>

                        {showColorants && (
                          <View style={styles.colorantsList}>
                            {productInfo.additives_tags.map((additive, index) => (
                              <Text key={index} style={styles.colorantItem}>
                                {additive.replace("en:", "")}
                              </Text>
                            ))}
                          </View>
                        )}
                      </>
                    )}

                    {productInfo.labels_tags && productInfo.labels_tags.includes("en:rainforest-alliance") && (
                      <Text style={styles.rainforestCertified}>{translationsHistoryDetailss.certifiedRainforest}</Text>
                    )}
                  </View>

                  {/* Share Button */}
                  <TouchableOpacity style={styles.shareButton} onPress={() => shareProductDetails(productInfo)}>
                    <Ionicons name="share-outline" size={20} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.shareButtonText}>Share</Text>
                  </TouchableOpacity>

 

                  <Text style={styles.dataSource}>SOURCE: Open Food Facts Database</Text>
                </View>
              )}
            </View>
          </View>
        </Modalize>
      )}

      {/* Modern Info Section */}
      {!showCamera && showScanInfo && (
        <View style={styles.modernInfoContainer}>
          <View style={styles.modernInfoCard}>
            <Text style={styles.modernInfoTitle}>{scanTexts.title}</Text>
            <View style={styles.modernInfoGrid}>
              {scanTexts.items.map((item, index) => (
                <View key={index} style={styles.modernInfoItem}>
                  <View style={styles.infoItemIcon}>
                    <Text style={styles.infoEmoji}>{item.charAt(0)}</Text>
                  </View>
                  <Text style={styles.modernInfoText}>
                    {item.substring(2)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#e7ead2',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  modernHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 30,
    paddingHorizontal: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  modernHeaderText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
    marginTop: 15,
    marginBottom: 8,
    textAlign: 'center',
  },
  modernSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },

  // Camera Scanner Styles
  cameraContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraView: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  scanFrameCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#fff',
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    left: 'auto',
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    top: 'auto',
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    top: 'auto',
    left: 'auto',
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  scanInstructions: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  cameraActions: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
  },
  manualEntryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  manualEntryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelCameraButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cancelCameraText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Modern Action Buttons
  modernActionsContainer: {
    gap: 20,
    marginTop: 20,
  },
  modernMainButton: {
    backgroundColor: '#667eea',
    borderRadius: 25,
    paddingVertical: 30,
    paddingHorizontal: 25,
    alignItems: 'center',
    gap: 15,
    elevation: 10,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  scanIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  modernMainButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  modernMainButtonSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },

  // Modern History Card
  modernHistoryCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  historyCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  historyIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyTextContainer: {
    flex: 1,
  },
  modernHistoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 4,
  },
  modernHistorySubtitle: {
    fontSize: 14,
    color: '#718096',
  },

  // Modern Info Section
  modernInfoContainer: {
    marginTop: 30,
    paddingBottom: 20,
  },
  modernInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  modernInfoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: 20,
  },
  modernInfoGrid: {
    gap: 15,
  },
  modernInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingVertical: 10,
  },
  infoItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoEmoji: {
    fontSize: 20,
  },
  modernInfoText: {
    flex: 1,
    fontSize: 16,
    color: '#4a5568',
    lineHeight: 22,
  },

  // Modal styles (keeping for existing modals)
  modalContainer: {

    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  handle: {
    backgroundColor: "#ddd",
    width: 40,
    height: 5,
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  centeredView: {
    flex: 1,
    alignItems: "center",
    paddingTop: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  modalView: {
    width: "100%",
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
  },
  historyScrollView: {
    flex: 1,
  },
  noHistoryText: {
    textAlign: "center",
    padding: 40,
    color: "#999",
    fontSize: 18,
    fontWeight: "500",
  },

  // Modern History Styles
  modernHistoryItem: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  historyItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  historyItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  modernHistoryImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
    resizeMode: "cover",
  },
  noImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  historyItemInfo: {
    flex: 1,
  },
  modernHistoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  historyItemSubtitle: {
    fontSize: 14,
    color: "#666",
  },

  // Expanded Details Styles
  modernExpandedDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  nutritionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  nutritionCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },

  // Modern Action Buttons
  modernActionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  modernAnalyzeButton: {
    backgroundColor: "#667eea",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
    marginRight: 8,
    justifyContent: "center",
  },
  modernAnalyzeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  modernShareButton: {
    backgroundColor: "#f8f9fa",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#667eea",
  },
  modernShareText: {
    color: "#667eea",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  modernDeleteButton: {
    backgroundColor: "#f8f9fa",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
    marginLeft: 8,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#dc3545",
  },
  modernDeleteText: {
    color: "#dc3545",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  productInfo: {
    padding: 16,
  },
  productImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: "contain",
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  nutritionScoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  nutritionScoreLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  nutritionScoreBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  scoreA: { backgroundColor: "#1e8e3e" },
  scoreB: { backgroundColor: "#81c995" },
  scoreC: { backgroundColor: "#fbbc05" },
  scoreD: { backgroundColor: "#f29900" },
  scoreE: { backgroundColor: "#ea4335" },
  nutritionScoreText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  nutritionItem: {
    width: "48%",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  nutritionLabel: {
    fontSize: 14,
    color: "#666",
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  certificationsContainer: {
    marginVertical: 16,
  },
  carmineWarning: {
    color: "#c87905",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  rainforestCertified: {
    color: "#1e8e3e",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  buttonStyleVerMas: {
    backgroundColor: "#0d6efd",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginBottom: 8,
  },
  buttonStyleVerMenos: {
    backgroundColor: "#dc3545",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginBottom: 8,
  },
  buttonTitleStyle: {
    color: "white",
    fontWeight: "bold",
  },
  colorantsList: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  colorantItem: {
    fontSize: 14,
    marginBottom: 4,
    color: "#555",
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0d6efd",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  shareButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  analyzeAnotherButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#667eea",
  },
  analyzeAnotherButtonText: {
    color: "#667eea",
    fontSize: 16,
    fontWeight: "600",
  },
  dataSource: {
    textAlign: "center",
    color: "#666",
    fontSize: 12,
    marginTop: 8,
  },
})

export default BarcodeScannerComponent
