import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Animated,
  Switch,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, useCameraPermissions } from 'expo-camera';

const { width: screenWidth } = Dimensions.get("window")

// Available icons for custom categories
const availableIcons = [
  'basket', 'beer', 'bicycle', 'boat', 'book', 'briefcase', 'brush', 'build',
  'bus', 'cafe', 'camera', 'car', 'cart', 'cash', 'color-palette', 'construct',
  'cut', 'desktop', 'egg', 'fast-food', 'fish', 'fitness', 'flower', 'football',
  'game-controller', 'gift', 'glasses', 'globe', 'hammer', 'heart', 'home',
  'ice-cream', 'key', 'laptop', 'leaf', 'library', 'medkit', 'musical-notes',
  'nutrition', 'paw', 'pencil', 'pizza', 'planet', 'restaurant', 'ribbon',
  'rose', 'school', 'shirt', 'snow', 'star', 'sunny', 'tennisball', 'train',
  'trophy', 'umbrella', 'watch', 'water', 'wine'
]

// Available colors for custom categories
const availableColors = [
  { color: '#FF6B6B', gradient: ['#FF6B6B', '#FF8787'] },
  { color: '#4ECDC4', gradient: ['#4ECDC4', '#6FD6D1'] },
  { color: '#45B7D1', gradient: ['#45B7D1', '#64C4DD'] },
  { color: '#96CEB4', gradient: ['#96CEB4', '#AAD9C3'] },
  { color: '#FECA57', gradient: ['#FECA57', '#FFD574'] },
  { color: '#FF9F43', gradient: ['#FF9F43', '#FFB265'] },
  { color: '#A29BFE', gradient: ['#A29BFE', '#B5AFFE'] },
  { color: '#FD79A8', gradient: ['#FD79A8', '#FE92BB'] },
  { color: '#6C5CE7', gradient: ['#6C5CE7', '#8777ED'] },
  { color: '#00B894', gradient: ['#00B894', '#26C6A8'] },
  { color: '#FDCB6E', gradient: ['#FDCB6E', '#FDD488'] },
  { color: '#E17055', gradient: ['#E17055', '#E88774'] },
  { color: '#0984E3', gradient: ['#0984E3', '#3399E9'] },
  { color: '#6AB04C', gradient: ['#6AB04C', '#83C167'] },
  { color: '#EB4D4B', gradient: ['#EB4D4B', '#EF6B6A'] },
  { color: '#22A6B3', gradient: ['#22A6B3', '#44B8C4'] },
  { color: '#F0932B', gradient: ['#F0932B', '#F3A74D'] },
  { color: '#6741D9', gradient: ['#6741D9', '#8159E1'] },
  { color: '#F368E0', gradient: ['#F368E0', '#F582E6'] },
  { color: '#48DBF8', gradient: ['#48DBF8', '#6BE2FA'] }
]

// Default categories
const defaultCategories = [
  { id: 'barcode', icon: 'qr-code', color: '#8B5CF6', gradient: ['#8B5CF6', '#A78BFA'], isDefault: true, isBarcode: true },
  { id: 'groceries', icon: 'cart', color: '#4CAF50', gradient: ['#4CAF50', '#66BB6A'], isDefault: true },
  { id: 'pharmacy', icon: 'medkit', color: '#FF5722', gradient: ['#FF5722', '#FF7043'], isDefault: true },
  { id: 'pets', icon: 'paw', color: '#9C27B0', gradient: ['#9C27B0', '#BA68C8'], isDefault: true },
  { id: 'home', icon: 'home', color: '#2196F3', gradient: ['#2196F3', '#42A5F5'], isDefault: true },
  { id: 'beverages', icon: 'wine', color: '#E91E63', gradient: ['#E91E63', '#F06292'], isDefault: true },
  { id: 'bakery', icon: 'restaurant', color: '#FF9800', gradient: ['#FF9800', '#FFB74D'], isDefault: true },
  { id: 'meat', icon: 'nutrition', color: '#795548', gradient: ['#795548', '#8D6E63'], isDefault: true },
  { id: 'produce', icon: 'leaf', color: '#4CAF50', gradient: ['#66BB6A', '#81C784'], isDefault: true },
  { id: 'electronics', icon: 'phone-portrait', color: '#607D8B', gradient: ['#607D8B', '#78909C'], isDefault: true },
  { id: 'clothing', icon: 'shirt', color: '#00BCD4', gradient: ['#00BCD4', '#26C6DA'], isDefault: true },
  { id: 'frozen', icon: 'snow', color: '#00ACC1', gradient: ['#00ACC1', '#26C6DA'], isDefault: true }
]

// Translations
const translations = {
  en: {
    selectCategory: "Select a category",
    addCustomCategory: "Custom",
    categoryName: "Category name",
    selectIcon: "Select an icon (optional)",
    selectColor: "Select a color",
    noIcon: "No icon (use text)",
    addCategory: "Add Category",
    addItem: "Add Item",
    itemName: "Item name",
    quantity: "Quantity",
    unit: "Unit",
    units: {
      units: "Units",
      kg: "Kilograms",
      g: "Grams",
      l: "Liters",
      ml: "Milliliters"
    },
    price: "Price (optional)",
    isStore: "Store item",
    add: "Add",
    cancel: "Cancel",
    categories: {
      barcode: "Barcode",
      groceries: "Groceries",
      pharmacy: "Pharmacy",
      pets: "Pets",
      home: "Home & Cleaning",
      beverages: "Beverages",
      bakery: "Bakery",
      meat: "Meat & Fish",
      produce: "Fruits & Vegetables",
      electronics: "Electronics",
      clothing: "Clothing",
      frozen: "Frozen",
      dairy: "Dairy"
    },
    // Barcode scanner translations
    barcodeScanned: "Product Scanned",
    searchingProduct: "Searching product...",
    requestingPermissions: "Requesting camera permissions...",
    cameraNoAccess: "No camera access",
    pointCamera: "Point the camera at the barcode",
    permissionRequired: "Permission required",
    cameraPermissionMessage: "We need camera access to scan barcodes",
    productNotFound: "Product",
    addToList: "Add to list"
  },
  es: {
    selectCategory: "Selecciona una categoría",
    addCustomCategory: "Personal",
    categoryName: "Nombre de la categoría",
    selectIcon: "Selecciona un icono (opcional)",
    selectColor: "Selecciona un color",
    noIcon: "Sin icono (usar texto)",
    addCategory: "Añadir Categoría",
    addItem: "Añadir Artículo",
    itemName: "Nombre del artículo",
    quantity: "Cantidad",
    unit: "Unidad",
    units: {
      units: "Unidades",
      kg: "Kilogramos",
      g: "Gramos",
      l: "Litros",
      ml: "Mililitros"
    },
    price: "Precio (opcional)",
    isStore: "Artículo de tienda",
    add: "Añadir",
    cancel: "Cancelar",
    categories: {
      barcode: "Código de barras",
      groceries: "Supermercado",
      pharmacy: "Farmacia",
      pets: "Mascotas",
      home: "Hogar y Limpieza",
      beverages: "Bebidas",
      bakery: "Panadería",
      meat: "Carnicería",
      produce: "Frutas y Verduras",
      electronics: "Electrónica",
      clothing: "Ropa",
      frozen: "Congelados",
      dairy: "Lácteos"
    },
    // Barcode scanner translations
    barcodeScanned: "Producto Escaneado",
    searchingProduct: "Buscando producto...",
    requestingPermissions: "Solicitando permisos de cámara...",
    cameraNoAccess: "Sin acceso a la cámara",
    pointCamera: "Apunta la cámara al código de barras",
    permissionRequired: "Permiso requerido",
    cameraPermissionMessage: "Necesitamos acceso a la cámara para escanear códigos de barras",
    productNotFound: "Producto",
    addToList: "Añadir a lista"
  },
  de: {
    selectCategory: "Wähle eine Kategorie",
    addCustomCategory: "Benutzerdefiniert",
    categoryName: "Kategoriename",
    selectIcon: "Wähle ein Symbol (optional)",
    selectColor: "Wähle eine Farbe",
    noIcon: "Kein Symbol (Text verwenden)",
    addCategory: "Kategorie hinzufügen",
    addItem: "Artikel hinzufügen",
    itemName: "Artikelname",
    quantity: "Menge",
    unit: "Einheit",
    units: {
      units: "Einheiten",
      kg: "Kilogramm",
      g: "Gramm",
      l: "Liter",
      ml: "Milliliter"
    },
    price: "Preis (optional)",
    isStore: "Ladenartikel",
    add: "Hinzufügen",
    cancel: "Abbrechen",
    categories: {
      barcode: "Barcode",
      groceries: "Lebensmittel",
      pharmacy: "Apotheke",
      pets: "Haustiere",
      home: "Haushalt & Reinigung",
      beverages: "Getränke",
      bakery: "Bäckerei",
      meat: "Fleisch & Fisch",
      produce: "Obst & Gemüse",
      electronics: "Elektronik",
      clothing: "Kleidung",
      frozen: "Tiefkühl",
      dairy: "Milchprodukte"
    },
    // Barcode scanner translations
    barcodeScanned: "Produkt gescannt",
    searchingProduct: "Suche Produkt...",
    requestingPermissions: "Kamera-Berechtigungen anfordern...",
    cameraNoAccess: "Kein Kamerazugriff",
    pointCamera: "Kamera auf den Barcode richten",
    permissionRequired: "Berechtigung erforderlich",
    cameraPermissionMessage: "Wir benötigen Kamerazugriff zum Scannen von Barcodes",
    productNotFound: "Produkt",
    addToList: "Zur Liste hinzufügen"
  },
  fr: {
    selectCategory: "Sélectionner une catégorie",
    addCustomCategory: "Personnalisé",
    categoryName: "Nom de la catégorie",
    selectIcon: "Sélectionner une icône (optionnel)",
    selectColor: "Sélectionner une couleur",
    noIcon: "Pas d'icône (utiliser du texte)",
    addCategory: "Ajouter une catégorie",
    addItem: "Ajouter un article",
    itemName: "Nom de l'article",
    quantity: "Quantité",
    unit: "Unité",
    units: {
      units: "Unités",
      kg: "Kilogrammes",
      g: "Grammes",
      l: "Litres",
      ml: "Millilitres"
    },
    price: "Prix (optionnel)",
    isStore: "Article du magasin",
    add: "Ajouter",
    cancel: "Annuler",
    categories: {
      barcode: "Code-barres",
      groceries: "Épicerie",
      pharmacy: "Pharmacie",
      pets: "Animaux",
      home: "Maison & Nettoyage",
      beverages: "Boissons",
      bakery: "Boulangerie",
      meat: "Viande & Poisson",
      produce: "Fruits & Légumes",
      electronics: "Électronique",
      clothing: "Vêtements",
      frozen: "Surgelés",
      dairy: "Produits laitiers"
    },
    // Barcode scanner translations
    barcodeScanned: "Produit scanné",
    searchingProduct: "Recherche du produit...",
    requestingPermissions: "Demande d'autorisations de caméra...",
    cameraNoAccess: "Pas d'accès à la caméra",
    pointCamera: "Dirigez la caméra vers le code-barres",
    permissionRequired: "Autorisation requise",
    cameraPermissionMessage: "Nous avons besoin d'un accès à la caméra pour scanner les codes-barres",
    productNotFound: "Produit",
    addToList: "Ajouter à la liste"
  },
  it: {
    selectCategory: "Seleziona una categoria",
    addCustomCategory: "Personalizzato",
    categoryName: "Nome categoria",
    selectIcon: "Seleziona un'icona (opzionale)",
    selectColor: "Seleziona un colore",
    noIcon: "Nessuna icona (usa testo)",
    addCategory: "Aggiungi categoria",
    addItem: "Aggiungi articolo",
    itemName: "Nome articolo",
    quantity: "Quantità",
    unit: "Unità",
    units: {
      units: "Unità",
      kg: "Chilogrammi",
      g: "Grammi",
      l: "Litri",
      ml: "Millilitri"
    },
    price: "Prezzo (opzionale)",
    isStore: "Articolo del negozio",
    add: "Aggiungi",
    cancel: "Annulla",
    categories: {
      barcode: "Codice a barre",
      groceries: "Alimentari",
      pharmacy: "Farmacia",
      pets: "Animali",
      home: "Casa e Pulizia",
      beverages: "Bevande",
      bakery: "Panetteria",
      meat: "Carne e Pesce",
      produce: "Frutta e Verdura",
      electronics: "Elettronica",
      clothing: "Abbigliamento",
      frozen: "Surgelati",
      dairy: "Latticini"
    },
    // Barcode scanner translations
    barcodeScanned: "Prodotto scansionato",
    searchingProduct: "Ricerca prodotto...",
    requestingPermissions: "Richiesta permessi fotocamera...",
    cameraNoAccess: "Nessun accesso alla fotocamera",
    pointCamera: "Punta la fotocamera sul codice a barre",
    permissionRequired: "Autorizzazione richiesta",
    cameraPermissionMessage: "Abbiamo bisogno dell'accesso alla fotocamera per scansionare i codici a barre",
    productNotFound: "Prodotto",
    addToList: "Aggiungi alla lista"
  },
  tr: {
    selectCategory: "Bir kategori seçin",
    addCustomCategory: "Özel",
    categoryName: "Kategori adı",
    selectIcon: "Bir simge seçin (isteğe bağlı)",
    selectColor: "Bir renk seçin",
    noIcon: "Simge yok (metin kullan)",
    addCategory: "Kategori Ekle",
    addItem: "Öğe Ekle",
    itemName: "Öğe adı",
    quantity: "Miktar",
    unit: "Birim",
    units: {
      units: "Birimler",
      kg: "Kilogram",
      g: "Gram",
      l: "Litre",
      ml: "Mililitre"
    },
    price: "Fiyat (isteğe bağlı)",
    isStore: "Mağaza ürünü",
    add: "Ekle",
    cancel: "İptal",
    categories: {
      barcode: "Barkod",
      groceries: "Market",
      pharmacy: "Eczane",
      pets: "Evcil Hayvanlar",
      home: "Ev ve Temizlik",
      beverages: "İçecekler",
      bakery: "Fırın",
      meat: "Et ve Balık",
      produce: "Meyve ve Sebze",
      electronics: "Elektronik",
      clothing: "Giyim",
      frozen: "Dondurulmuş",
      dairy: "Süt Ürünleri"
    },
    // Barcode scanner translations
    barcodeScanned: "Ürün tarandı",
    searchingProduct: "Ürün aranıyor...",
    requestingPermissions: "Kamera izinleri isteniyor...",
    cameraNoAccess: "Kamera erişimi yok",
    pointCamera: "Kamerayı barkoda doğrultun",
    permissionRequired: "İzin gerekli",
    cameraPermissionMessage: "Barkod taramak için kamera erişimine ihtiyacımız var",
    productNotFound: "Ürün",
    addToList: "Listeye ekle"
  },
  pt: {
    selectCategory: "Selecione uma categoria",
    addCustomCategory: "Personalizado",
    categoryName: "Nome da categoria",
    selectIcon: "Selecione um ícone (opcional)",
    selectColor: "Selecione uma cor",
    noIcon: "Sem ícone (usar texto)",
    addCategory: "Adicionar categoria",
    addItem: "Adicionar item",
    itemName: "Nome do item",
    quantity: "Quantidade",
    unit: "Unidade",
    units: {
      units: "Unidades",
      kg: "Quilogramas",
      g: "Gramas",
      l: "Litros",
      ml: "Mililitros"
    },
    price: "Preço (opcional)",
    isStore: "Item da loja",
    add: "Adicionar",
    cancel: "Cancelar",
    categories: {
      barcode: "Código de barras",
      groceries: "Mercearia",
      pharmacy: "Farmácia",
      pets: "Animais",
      home: "Casa e Limpeza",
      beverages: "Bebidas",
      bakery: "Padaria",
      meat: "Carne e Peixe",
      produce: "Frutas e Vegetais",
      electronics: "Eletrônicos",
      clothing: "Roupas",
      frozen: "Congelados",
      dairy: "Laticínios"
    },
    // Barcode scanner translations
    barcodeScanned: "Produto escaneado",
    searchingProduct: "Procurando produto...",
    requestingPermissions: "Solicitando permissões da câmera...",
    cameraNoAccess: "Sem acesso à câmera",
    pointCamera: "Aponte a câmera para o código de barras",
    permissionRequired: "Permissão necessária",
    cameraPermissionMessage: "Precisamos de acesso à câmera para escanear códigos de barras",
    productNotFound: "Produto",
    addToList: "Adicionar à lista"
  },
  ru: {
    selectCategory: "Выберите категорию",
    addCustomCategory: "Пользовательская",
    categoryName: "Название категории",
    selectIcon: "Выберите иконку (необязательно)",
    selectColor: "Выберите цвет",
    noIcon: "Без иконки (использовать текст)",
    addCategory: "Добавить категорию",
    addItem: "Добавить товар",
    itemName: "Название товара",
    quantity: "Количество",
    unit: "Единица",
    units: {
      units: "Единицы",
      kg: "Килограммы",
      g: "Граммы",
      l: "Литры",
      ml: "Миллилитры"
    },
    price: "Цена (необязательно)",
    isStore: "Товар магазина",
    add: "Добавить",
    cancel: "Отмена",
    categories: {
      barcode: "Штрих-код",
      groceries: "Продукты",
      pharmacy: "Аптека",
      pets: "Животные",
      home: "Дом и уборка",
      beverages: "Напитки",
      bakery: "Пекарня",
      meat: "Мясо и рыба",
      produce: "Фрукты и овощи",
      electronics: "Электроника",
      clothing: "Одежда",
      frozen: "Замороженные",
      dairy: "Молочные продукты"
    },
    // Barcode scanner translations
    barcodeScanned: "Продукт отсканирован",
    searchingProduct: "Поиск продукта...",
    requestingPermissions: "Запрос разрешений камеры...",
    cameraNoAccess: "Нет доступа к камере",
    pointCamera: "Направьте камеру на штрих-код",
    permissionRequired: "Требуется разрешение",
    cameraPermissionMessage: "Нам нужен доступ к камере для сканирования штрих-кодов",
    productNotFound: "Продукт",
    addToList: "Добавить в список"
  },
  ar: {
    selectCategory: "اختر فئة",
    addCustomCategory: "مخصص",
    categoryName: "اسم الفئة",
    selectIcon: "اختر أيقونة (اختياري)",
    selectColor: "اختر لونًا",
    noIcon: "بدون أيقونة (استخدم النص)",
    addCategory: "إضافة فئة",
    addItem: "إضافة عنصر",
    itemName: "اسم العنصر",
    quantity: "الكمية",
    unit: "الوحدة",
    units: {
      units: "وحدات",
      kg: "كيلوغرام",
      g: "غرام",
      l: "لتر",
      ml: "ملليلتر"
    },
    price: "السعر (اختياري)",
    isStore: "عنصر المتجر",
    add: "إضافة",
    cancel: "إلغاء",
    categories: {
      barcode: "رمز شريطي",
      groceries: "البقالة",
      pharmacy: "صيدلية",
      pets: "الحيوانات الأليفة",
      home: "المنزل والتنظيف",
      beverages: "المشروبات",
      bakery: "مخبز",
      meat: "اللحوم والأسماك",
      produce: "الفواكه والخضروات",
      electronics: "الإلكترونيات",
      clothing: "الملابس",
      frozen: "المجمدة",
      dairy: "منتجات الألبان"
    },
    // Barcode scanner translations
    barcodeScanned: "منتج ممسوح ضوئياً",
    searchingProduct: "بحث عن المنتج...",
    requestingPermissions: "طلب أذونات الكاميرا...",
    cameraNoAccess: "لا يوجد وصول للكاميرا",
    pointCamera: "وجّه الكاميرا نحو الرمز الشريطي",
    permissionRequired: "مطلوب إذن",
    cameraPermissionMessage: "نحتاج إلى إذن الكاميرا لمسح الرموز الشريطية",
    productNotFound: "منتج",
    addToList: "إضافة إلى القائمة"
  },
  ja: {
    selectCategory: "カテゴリーを選択",
    addCustomCategory: "カスタム",
    categoryName: "カテゴリー名",
    selectIcon: "アイコンを選択（オプション）",
    selectColor: "色を選択",
    noIcon: "アイコンなし（テキストを使用）",
    addCategory: "カテゴリーを追加",
    addItem: "アイテムを追加",
    itemName: "アイテム名",
    quantity: "数量",
    unit: "単位",
    units: {
      units: "単位",
      kg: "キログラム",
      g: "グラム",
      l: "リットル",
      ml: "ミリリットル"
    },
    price: "価格（オプション）",
    isStore: "店舗アイテム",
    add: "追加",
    cancel: "キャンセル",
    categories: {
      barcode: "バーコード",
      groceries: "食料品",
      pharmacy: "薬局",
      pets: "ペット",
      home: "家庭と掃除",
      beverages: "飲み物",
      bakery: "ベーカリー",
      meat: "肉と魚",
      produce: "果物と野菜",
      electronics: "電子機器",
      clothing: "衣類",
      frozen: "冷凍食品",
      dairy: "乳製品"
    },
    // Barcode scanner translations
    barcodeScanned: "商品スキャン済み",
    searchingProduct: "商品を検索中...",
    requestingPermissions: "カメラの許可をリクエスト中...",
    cameraNoAccess: "カメラアクセスなし",
    pointCamera: "カメラをバーコードに向けてください",
    permissionRequired: "許可が必要",
    cameraPermissionMessage: "バーコードをスキャンするためにカメラアクセスが必要です",
    productNotFound: "商品",
    addToList: "リストに追加"
  },
  hu: {
    selectCategory: "Válasszon kategóriát",
    addCustomCategory: "Egyéni",
    categoryName: "Kategória neve",
    selectIcon: "Válasszon ikont (opcionális)",
    selectColor: "Válasszon színt",
    noIcon: "Nincs ikon (szöveg használata)",
    addCategory: "Kategória hozzáadása",
    addItem: "Elem hozzáadása",
    itemName: "Elem neve",
    quantity: "Mennyiség",
    unit: "Egység",
    units: {
      units: "Egységek",
      kg: "Kilogramm",
      g: "Gramm",
      l: "Liter",
      ml: "Milliliter"
    },
    price: "Ár (opcionális)",
    isStore: "Bolti termék",
    add: "Hozzáadás",
    cancel: "Mégse",
    categories: {
      barcode: "Vonalkód",
      groceries: "Élelmiszer",
      pharmacy: "Gyógyszertár",
      pets: "Háziállatok",
      home: "Otthon és tisztítás",
      beverages: "Italok",
      bakery: "Pékség",
      meat: "Hús és hal",
      produce: "Gyümölcs és zöldség",
      electronics: "Elektronika",
      clothing: "Ruházat",
      frozen: "Fagyasztott",
      dairy: "Tejtermékek"
    },
    // Barcode scanner translations
    barcodeScanned: "Termék beolvasva",
    searchingProduct: "Termék keresése...",
    requestingPermissions: "Kamera engedélyek kérése...",
    cameraNoAccess: "Nincs kamera hozzáférés",
    pointCamera: "Irányítsa a kamerát a vonalkódra",
    permissionRequired: "Engedély szükséges",
    cameraPermissionMessage: "Vonalkódok beolvasásához kamera hozzáférésre van szükségünk",
    productNotFound: "Termék",
    addToList: "Hozzáadás a listához"
  },
  hi: {
    selectCategory: "एक श्रेणी चुनें",
    addCustomCategory: "कस्टम",
    categoryName: "श्रेणी का नाम",
    selectIcon: "एक आइकन चुनें (वैकल्पिक)",
    selectColor: "एक रंग चुनें",
    noIcon: "कोई आइकन नहीं (टेक्स्ट का उपयोग करें)",
    addCategory: "श्रेणी जोड़ें",
    addItem: "आइटम जोड़ें",
    itemName: "आइटम का नाम",
    quantity: "मात्रा",
    unit: "इकाई",
    units: {
      units: "इकाइयां",
      kg: "किलोग्राम",
      g: "ग्राम",
      l: "लीटर",
      ml: "मिलीलीटर"
    },
    price: "मूल्य (वैकल्पिक)",
    isStore: "स्टोर आइटम",
    add: "जोड़ें",
    cancel: "रद्द करें",
    categories: {
      barcode: "बारकोड",
      groceries: "किराने का सामान",
      pharmacy: "फार्मेसी",
      pets: "पालतू जानवर",
      home: "घर और सफाई",
      beverages: "पेय पदार्थ",
      bakery: "बेकरी",
      meat: "मांस और मछली",
      produce: "फल और सब्जियां",
      electronics: "इलेक्ट्रॉनिक्स",
      clothing: "कपड़े",
      frozen: "जमे हुए",
      dairy: "डेयरी उत्पाद"
    },
    // Barcode scanner translations
    barcodeScanned: "उत्पाद स्कैन किया गया",
    searchingProduct: "उत्पाद खोज रहे हैं...",
    requestingPermissions: "कैमरा अनुमतियों का अनुरोध...",
    cameraNoAccess: "कैमरा एक्सेस नहीं",
    pointCamera: "कैमरा को बारकोड की ओर सिईट करें",
    permissionRequired: "अनुमति आवश्यक",
    cameraPermissionMessage: "बारकोड स्कैन करने के लिए हमें कैमरा एक्सेस की आवश्यकता है",
    productNotFound: "उत्पाद",
    addToList: "सूची में जोड़ें"
  },
  nl: {
    selectCategory: "Selecteer een categorie",
    addCustomCategory: "Aangepast",
    categoryName: "Categorienaam",
    selectIcon: "Selecteer een pictogram (optioneel)",
    selectColor: "Selecteer een kleur",
    noIcon: "Geen pictogram (gebruik tekst)",
    addCategory: "Categorie toevoegen",
    addItem: "Item toevoegen",
    itemName: "Itemnaam",
    quantity: "Hoeveelheid",
    unit: "Eenheid",
    units: {
      units: "Eenheden",
      kg: "Kilogram",
      g: "Gram",
      l: "Liter",
      ml: "Milliliter"
    },
    price: "Prijs (optioneel)",
    isStore: "Winkelartikel",
    add: "Toevoegen",
    cancel: "Annuleren",
    categories: {
      barcode: "Barcode",
      groceries: "Boodschappen",
      pharmacy: "Apotheek",
      pets: "Huisdieren",
      home: "Huis en schoonmaak",
      beverages: "Dranken",
      bakery: "Bakkerij",
      meat: "Vlees en vis",
      produce: "Fruit en groenten",
      electronics: "Elektronica",
      clothing: "Kleding",
      frozen: "Diepvries",
      dairy: "Zuivelproducten"
    },
    // Barcode scanner translations
    barcodeScanned: "Product gescand",
    searchingProduct: "Product zoeken...",
    requestingPermissions: "Camera toestemmingen aanvragen...",
    cameraNoAccess: "Geen camera toegang",
    pointCamera: "Richt de camera op de barcode",
    permissionRequired: "Toestemming vereist",
    cameraPermissionMessage: "We hebben camera toegang nodig om barcodes te scannen",
    productNotFound: "Product",
    addToList: "Toevoegen aan lijst"
  }
}

const AddItemModal = ({ visible, onClose, onAddItem, language = 'es' }) => {
  const t = translations[language] || translations.es

  // States
  const [categories, setCategories] = useState([...defaultCategories])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [customCategoryModalVisible, setCustomCategoryModalVisible] = useState(false)
  const [itemName, setItemName] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [unit, setUnit] = useState("units")
  const [price, setPrice] = useState("")
  const [isStore, setIsStore] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [selectedIcon, setSelectedIcon] = useState(null)
  const [selectedColor, setSelectedColor] = useState(availableColors[0])
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [customCategories, setCustomCategories] = useState([])
  const [deleteMode, setDeleteMode] = useState(null) // ID de la categoría que se está presionando

  // Barcode scanner states
  const [showCamera, setShowCamera] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [permission, requestPermission] = useCameraPermissions()
  const [productInfo, setProductInfo] = useState(null)
  const [productImage, setProductImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [barcodeResultVisible, setBarcodeResultVisible] = useState(false)
  const [barcodeQuantity, setBarcodeQuantity] = useState("1")

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.9)).current
  const categoryAnimations = useRef(
    categories.map(() => new Animated.Value(0))
  ).current

  // Request permission when needed
  const requestCameraPermission = async () => {
    const result = await requestPermission()
    return result.granted
  }

  useEffect(() => {
    console.log('=== AddItemModal useEffect ===')
    console.log('AddItemModal visible prop:', visible)
    if (visible) {
      loadCustomCategories()
      // Entrance animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        })
      ]).start()

      // Animate categories sequentially
      const animations = categoryAnimations.map((anim, index) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          delay: index * 50,
          useNativeDriver: true,
        })
      )

      Animated.stagger(50, animations).start()
    } else {
      // Reset everything when modal closes
      setSelectedCategory(null)
      setItemName("")
      setQuantity("1")
      setUnit("units")
      setPrice("")
      setIsStore(false)
      setModalVisible(false)
      setDeleteMode(null)
      setShowCamera(false)
      setScanned(false)
      setProductInfo(null)
      setProductImage(null)
      setBarcodeResultVisible(false)
      setBarcodeQuantity("1")
    }
  }, [visible])

  const loadCustomCategories = async () => {
    try {
      const stored = await AsyncStorage.getItem('customCategoriesAddItem')
      if (stored) {
        const parsed = JSON.parse(stored)
        setCustomCategories(parsed)
        setCategories([...parsed, ...defaultCategories])
      }
    } catch (error) {
      console.error('Error loading custom categories:', error)
    }
  }

  // Barcode scanning functions
  const fetchProductData = async (barcode) => {
    setIsLoading(true)
    const cleanBarcode = barcode.replace(/[^0-9]/g, '')

    try {
      // Try UPC Database first
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
        product_name: `${t.productNotFound} ${cleanBarcode}`,
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
      Alert.alert("Error", "Could not fetch product.")
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
          product_name: item.title || item.brand || t.productNotFound,
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

  // Open Food Facts API
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
    setBarcodeResultVisible(true)
  }

  // Handle barcode scanned
  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned) return
    setScanned(true)
    setShowCamera(false)
    fetchProductData(data)
  }

  const handleCategoryPress = (category) => {
    if (deleteMode) {
      // Si está en modo eliminar, salir del modo
      setDeleteMode(null)
      return
    }

    // Handle barcode category differently
    if (category.isBarcode) {
      if (permission?.granted) {
        setScanned(false)
        setShowCamera(true)
      } else {
        requestCameraPermission().then((granted) => {
          if (granted) {
            setScanned(false)
            setShowCamera(true)
          } else {
            Alert.alert(t.permissionRequired, t.cameraPermissionMessage)
          }
        })
      }
      return
    }

    setSelectedCategory(category)
    setModalVisible(true)
  }

  const handleCategoryLongPress = (category) => {
    // Solo permitir eliminar categorías personalizadas
    if (!category.isCustom) return

    // Activar/desactivar modo eliminar para esta categoría específica
    if (deleteMode === category.id) {
      setDeleteMode(null)
    } else {
      setDeleteMode(category.id)
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    const updatedCustom = customCategories.filter(cat => cat.id !== categoryId)
    setCustomCategories(updatedCustom)
    setCategories([...updatedCustom, ...defaultCategories])

    // Salir del modo eliminar después de eliminar
    setDeleteMode(null)

    try {
      await AsyncStorage.setItem('customCategoriesAddItem', JSON.stringify(updatedCustom))
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  const handleAddItem = () => {
    if (!itemName.trim() || !selectedCategory) return

    // Format the item string
    const categoryName = selectedCategory.isCustom ? selectedCategory.name : t.categories[selectedCategory.id]
    const quantityText = unit === 'units' ? (quantity > 1 ? ` (x${quantity})` : '') : ` (${quantity}${getUnitAbbreviation(unit)})`
    const priceText = price ? ` - $${parseFloat(price).toFixed(2)}` : ''
    const storeText = isStore ? ' 🏪' : ''

    const formattedItem = `${categoryName} - ${itemName}${quantityText}${priceText}${storeText}`

    onAddItem(formattedItem)

    // Reset form
    setItemName("")
    setQuantity("1")
    setUnit("units")
    setPrice("")
    setIsStore(false)
    setModalVisible(false)
  }

  // Handle adding barcode product to list
  const handleAddBarcodeProduct = () => {
    if (!productInfo) return

    const quantityText = barcodeQuantity > 1 ? ` (x${barcodeQuantity})` : ''
    const formattedItem = `${t.categories.barcode} - ${productInfo.product_name}${quantityText}`
    onAddItem(formattedItem)

    // Reset barcode states
    setProductInfo(null)
    setProductImage(null)
    setBarcodeResultVisible(false)
    setBarcodeQuantity("1")
  }

  const getUnitAbbreviation = (unit) => {
    const abbr = {
      units: '',
      kg: 'kg',
      g: 'g',
      l: 'L',
      ml: 'ml'
    }
    return abbr[unit] || ''
  }

  const handleAddCustomCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert("", t.categoryName)
      return
    }

    const newCategory = {
      id: newCategoryName.toLowerCase().replace(/\s+/g, '_'),
      name: newCategoryName,
      icon: selectedIcon,
      color: selectedColor.color,
      gradient: selectedColor.gradient,
      isCustom: true
    }

    const updatedCustom = [...customCategories, newCategory]
    setCustomCategories(updatedCustom)
    setCategories([...updatedCustom, ...defaultCategories])

    try {
      await AsyncStorage.setItem('customCategoriesAddItem', JSON.stringify(updatedCustom))
    } catch (error) {
      console.error('Error saving custom category:', error)
    }

    setCustomCategoryModalVisible(false)
    setNewCategoryName("")
    setSelectedIcon(null)
    setSelectedColor(availableColors[0])
  }

  const renderCategory = ({ item }) => {
    const displayName = item.isCustom ? item.name : t.categories[item.id]
    const showDeleteButton = deleteMode === item.id

    return (
      <View
        style={[
          styles.categoryCard,
          {
          }
        ]}
      >
        <TouchableOpacity
          style={[
            styles.categoryButton,
            { backgroundColor: item.gradient[0] }
          ]}
          onPress={() => handleCategoryPress(item)}
          onLongPress={() => handleCategoryLongPress(item)}
          activeOpacity={0.8}
        >
          <View style={styles.categoryGradient}>
            {showDeleteButton && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteCategory(item.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="trash" size={14} color="white" />
              </TouchableOpacity>
            )}
            <View style={styles.categoryIconContainer}>
              {item.icon ? (
                <Ionicons name={item.icon} size={30} color="white" />
              ) : (
                <Text style={styles.categoryInitials}>
                  {displayName.substring(0, 2).toUpperCase()}
                </Text>
              )}
            </View>
            <Text style={styles.categoryName} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.8}>
              {displayName}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  const AddCategoryButton = () => (
    <View style={styles.categoryCard}>
      <TouchableOpacity
        style={[styles.categoryButton, styles.addCategoryButton]}
        onPress={() => {
          if (deleteMode) {
            setDeleteMode(null)
          } else {
            setCustomCategoryModalVisible(true)
          }
        }}
        activeOpacity={0.8}
      >
        <View style={styles.categoryGradient}>
          <View style={[styles.categoryIconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Ionicons name="add" size={30} color="white" />
          </View>
          <Text style={[styles.categoryName]} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.8}>
            {t.addCustomCategory}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  )

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
       
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t.selectCategory}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={[{ id: 'add_custom', isAddButton: true }, ...categories]}
            renderItem={({ item, index }) =>
              item.isAddButton ? <AddCategoryButton key="add_custom" /> : renderCategory({ item, index })
            }
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={styles.categoriesGrid}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.columnWrapper}
          />
        </View>
      </View>

      {/* Custom Category Modal */}
      <Modal
        visible={customCategoryModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCustomCategoryModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.customCategoryModal}>
            <View style={styles.modalHeaderCustom}>
              <Text style={styles.modalTitleCustom}>{t.addCustomCategory}</Text>
              <TouchableOpacity onPress={() => setCustomCategoryModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder={t.categoryName}
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              autoFocus
            />

            <Text style={styles.sectionTitle}>{t.selectColor}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorPicker}>
              {availableColors.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color.gradient[0] },
                    selectedColor.color === color.color && styles.selectedColorOption
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor.color === color.color && (
                    <Ionicons name="checkmark" size={20} color="white" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>{t.selectIcon}</Text>
            <TouchableOpacity
              style={styles.iconPickerToggle}
              onPress={() => setShowIconPicker(!showIconPicker)}
            >
              <View style={styles.selectedIconPreview}>
                {selectedIcon ? (
                  <Ionicons name={selectedIcon} size={24} color={selectedColor.color} />
                ) : (
                  <Text style={styles.noIconText}>{t.noIcon}</Text>
                )}
              </View>
              <Ionicons name="chevron-down" size={20} color="#6b7280" />
            </TouchableOpacity>

            {showIconPicker && (
              <ScrollView style={styles.iconGrid} showsVerticalScrollIndicator={false}>
                <View style={styles.iconGridContent}>
                  <TouchableOpacity
                    style={[
                      styles.iconOption,
                      !selectedIcon && styles.selectedIcon
                    ]}
                    onPress={() => {
                      setSelectedIcon(null)
                      setShowIconPicker(false)
                    }}
                  >
                    <Text style={styles.noIconOptionText}>AB</Text>
                  </TouchableOpacity>
                  {availableIcons.map((icon, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.iconOption,
                        selectedIcon === icon && styles.selectedIcon
                      ]}
                      onPress={() => {
                        setSelectedIcon(icon)
                        setShowIconPicker(false)
                      }}
                    >
                      <Ionicons name={icon} size={24} color={selectedColor.color} />
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setCustomCategoryModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>{t.cancel}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: selectedColor.gradient[0] }
                ]}
                onPress={handleAddCustomCategory}
              >
                <Text style={styles.addButtonText}>{t.addCategory}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Add Item Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.itemModalContent}>
            <View style={styles.modalHeaderItem}>
              <View style={styles.modalHeaderIcon}>
                {selectedCategory && (
                  selectedCategory.icon ? (
                    <Ionicons
                      name={selectedCategory.icon}
                      size={24}
                      color={selectedCategory.gradient[0]}
                    />
                  ) : (
                    <Text style={[styles.categoryInitials, { fontSize: 16, color: selectedCategory.gradient[0] }]}>
                      {(selectedCategory.isCustom ? selectedCategory.name : t.categories[selectedCategory.id]).substring(0, 2).toUpperCase()}
                    </Text>
                  )
                )}
              </View>
              <Text style={styles.modalTitleItem}>{t.addItem}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder={t.itemName}
              value={itemName}
              onChangeText={setItemName}
              autoFocus
            />

            <View style={styles.row}>
              <View style={[styles.quantityContainer, { flex: 1.5 }]}>
                <Text style={styles.label}>{t.quantity}</Text>
                <View style={styles.quantityRow}>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => {
                        const val = parseFloat(quantity)
                        const step = unit === 'kg' || unit === 'l' ? 0.5 :
                                    unit === 'g' || unit === 'ml' ? 50 : 1
                        setQuantity(String(Math.max(step, val - step)))
                      }}
                    >
                      <Ionicons name="remove" size={20} color="#6b7280" />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.quantityInput}
                      value={quantity}
                      onChangeText={setQuantity}
                      keyboardType="decimal-pad"
                    />
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => {
                        const val = parseFloat(quantity)
                        const step = unit === 'kg' || unit === 'l' ? 0.5 :
                                    unit === 'g' || unit === 'ml' ? 50 : 1
                        setQuantity(String(val + step))
                      }}
                    >
                      <Ionicons name="add" size={20} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.unitSelector}
                    onPress={() => {
                      // Cycle through units
                      const units = ['units', 'kg', 'g', 'l', 'ml']
                      const currentIndex = units.indexOf(unit)
                      const nextIndex = (currentIndex + 1) % units.length
                      setUnit(units[nextIndex])

                      // Adjust quantity based on unit change
                      if (units[nextIndex] === 'g' || units[nextIndex] === 'ml') {
                        setQuantity(String(parseFloat(quantity) * 1000))
                      } else if ((unit === 'g' || unit === 'ml') &&
                                (units[nextIndex] === 'kg' || units[nextIndex] === 'l')) {
                        setQuantity(String(parseFloat(quantity) / 1000))
                      }
                    }}
                  >
                    <Text style={styles.unitText}>
                      {unit === 'units' ? 'UN' : unit.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.label}>{t.price}</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="0.00"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>{t.isStore}</Text>
              <Switch
                value={isStore}
                onValueChange={setIsStore}
                trackColor={{ false: "#e5e7eb", true: "#fbbf24" }}
                thumbColor={isStore ? "#f59e0b" : "#f3f4f6"}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>{t.cancel}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.addButton, { backgroundColor: selectedCategory?.gradient[0] }]}
                onPress={handleAddItem}
              >
                <Text style={styles.addButtonText}>{t.add}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Camera Scanner Modal */}
      <Modal
        visible={showCamera}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCamera(false)}
      >
        <View style={styles.cameraContainer}>
          {!permission && (
            <View style={styles.permissionContainer}>
              <Text style={styles.permissionText}>{t.requestingPermissions}</Text>
            </View>
          )}
          {permission && !permission.granted && (
            <View style={styles.permissionContainer}>
              <Text style={styles.permissionText}>{t.cameraNoAccess}</Text>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowCamera(false)}>
                <Text style={styles.cancelButtonText}>{t.cancel}</Text>
              </TouchableOpacity>
            </View>
          )}
          {permission?.granted && (
            <View style={styles.cameraView}>
              <CameraView
                style={styles.camera}
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                  barcodeTypes: [
                    'ean13',
                    'ean8',
                    'upc_a',
                    'upc_e',
                    'code128',
                    'code39',
                    'qr'
                  ],
                }}
              />
              <View style={styles.cameraOverlay}>
                <View style={styles.scanFrame}>
                  <View style={styles.scanFrameCorner} />
                  <View style={[styles.scanFrameCorner, styles.topRight]} />
                  <View style={[styles.scanFrameCorner, styles.bottomLeft]} />
                  <View style={[styles.scanFrameCorner, styles.bottomRight]} />
                </View>
                <Text style={styles.scanInstructions}>{t.pointCamera}</Text>
                <TouchableOpacity
                  style={styles.cancelCameraButton}
                  onPress={() => {
                    setShowCamera(false)
                    setScanned(false)
                  }}
                >
                  <Ionicons name="close" size={20} color="#fff" />
                  <Text style={styles.cancelCameraText}>{t.cancel}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>

      {/* Barcode Result Modal */}
      <Modal
        visible={barcodeResultVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setBarcodeResultVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.barcodeResultModal}>
            <View style={styles.barcodeResultHeader}>
              <Text style={styles.barcodeResultTitle}>{t.barcodeScanned}</Text>
              <TouchableOpacity onPress={() => setBarcodeResultVisible(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {productInfo && (
              <>
                {productImage && (
                  <Image source={{ uri: productImage }} style={styles.barcodeProductImage} />
                )}
                <Text style={styles.barcodeProductName}>{productInfo.product_name}</Text>

                {productInfo.brand && (
                  <Text style={styles.barcodeProductBrand}>{productInfo.brand}</Text>
                )}

                <View style={styles.barcodeQuantityContainer}>
                  <Text style={styles.barcodeQuantityLabel}>{t.quantity}:</Text>
                  <View style={styles.barcodeQuantityInputContainer}>
                    <TouchableOpacity
                      style={styles.barcodeQuantityButton}
                      onPress={() => setBarcodeQuantity(Math.max(1, parseInt(barcodeQuantity) - 1).toString())}
                    >
                      <Text style={styles.barcodeQuantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <TextInput
                      style={styles.barcodeQuantityInput}
                      value={barcodeQuantity}
                      onChangeText={(text) => {
                        const num = parseInt(text) || 1
                        setBarcodeQuantity(Math.max(1, num).toString())
                      }}
                      keyboardType="numeric"
                      selectTextOnFocus
                    />
                    <TouchableOpacity
                      style={styles.barcodeQuantityButton}
                      onPress={() => setBarcodeQuantity((parseInt(barcodeQuantity) + 1).toString())}
                    >
                      <Text style={styles.barcodeQuantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.barcodeModalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setBarcodeResultVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>{t.cancel}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.addButton]}
                    onPress={handleAddBarcodeProduct}
                  >
                    <Text style={styles.addButtonText}>{t.addToList}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
    elevation: 10, // Añadir elevación en Android
    shadowColor: '#000', // Añadir sombra en iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 21,
    fontWeight: '500',
    color: '#1e293b9a',
  },
  closeButton: {
    padding: 5,
  },
  categoriesGrid: {
    paddingBottom: 20,
    paddingHorizontal: 5,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  categoryCard: {
    width: '47%',
    aspectRatio: 1.1,
    marginVertical: 8,
  },
  categoryButton: {
    flex: 1,
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: 5,
    lineHeight: 16,
    minHeight: 32,
  },
  categoryInitials: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  addCategoryButton: {
    backgroundColor: '#94a3b8',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  deleteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#dc2626',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  customCategoryModal: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    maxHeight: '80%',
    width: '90%',
  },
  modalHeaderCustom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitleCustom: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginTop: 16,
    marginBottom: 8,
  },
  colorPicker: {
    flexDirection: 'row',
    marginBottom: 16,
    maxHeight: 50,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: '#1e293b',
  },
  iconPickerToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedIconPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noIconText: {
    fontSize: 16,
    color: '#94a3b8',
  },
  iconGrid: {
    maxHeight: 200,
    marginTop: 8,
  },
  iconGridContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 8,
  },
  iconOption: {
    width: 50,
    height: 50,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedIcon: {
    backgroundColor: '#e0e7ff',
    borderColor: '#6366f1',
  },
  noIconOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94a3b8',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  addButton: {
    backgroundColor: '#10b981',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  itemModalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    width: '90%',
  },
  modalHeaderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalHeaderIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitleItem: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
    marginLeft: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  quantityContainer: {
    flex: 1,
  },
  priceContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 8,
  },
  quantityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quantityControls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quantityButton: {
    padding: 10,
  },
  quantityInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  unitSelector: {
    backgroundColor: '#e0e7ff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6366f1',
    minWidth: 50,
  },
  unitText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366f1',
  },
  priceInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: '#475569',
  },

  // Camera styles
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
    backgroundColor: '#8B5CF6',
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
  cancelCameraButton: {
    position: 'absolute',
    bottom: 50,
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

  // Barcode result modal styles
  barcodeResultModal: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  barcodeResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  barcodeResultTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  barcodeProductImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  barcodeProductName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  barcodeProductBrand: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  barcodeModalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },

  // Barcode quantity styles
  barcodeQuantityContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  barcodeQuantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  barcodeQuantityInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
  },
  barcodeQuantityButton: {
    width: 36,
    height: 36,
    backgroundColor: '#8B5CF6',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barcodeQuantityButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  barcodeQuantityInput: {
    marginHorizontal: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 6,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    minWidth: 60,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
});

export default AddItemModal;