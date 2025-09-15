"use client"

import { useState, useEffect, useRef } from "react"
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ScrollView,
  Animated,
  Dimensions,
  StyleSheet,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as RNLocalize from "react-native-localize"
import { useNavigation } from "@react-navigation/native"
import { useHaptic } from "../HapticContext"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")

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
    title: "Create Manual List",
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
    saveList: "Save List",
    listName: "List name",
    emptyList: "Your list is empty",
    emptyListSubtitle: "Select a category and add items to get started",
    categories: {
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
    items: "items",
    total: "Total",
    manualList: "Manual List"
  },
  es: {
    title: "Crear Lista Manual",
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
    saveList: "Guardar Lista",
    listName: "Nombre de la lista",
    emptyList: "Tu lista está vacía",
    emptyListSubtitle: "Selecciona una categoría y añade artículos para comenzar",
    categories: {
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
    items: "artículos",
    total: "Total",
    manualList: "Lista Manual"
  },
  de: {
    title: "Manuelle Liste erstellen",
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
    saveList: "Liste speichern",
    listName: "Listenname",
    emptyList: "Ihre Liste ist leer",
    emptyListSubtitle: "Wählen Sie eine Kategorie und fügen Sie Artikel hinzu",
    categories: {
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
    items: "Artikel",
    total: "Gesamt",
    manualList: "Manuelle Liste"
  },
  fr: {
    title: "Créer une liste manuelle",
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
    saveList: "Enregistrer la liste",
    listName: "Nom de la liste",
    emptyList: "Votre liste est vide",
    emptyListSubtitle: "Sélectionnez une catégorie et ajoutez des articles",
    categories: {
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
    items: "articles",
    total: "Total",
    manualList: "Liste manuelle"
  },
  it: {
    title: "Crea lista manuale",
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
    saveList: "Salva lista",
    listName: "Nome lista",
    emptyList: "La tua lista è vuota",
    emptyListSubtitle: "Seleziona una categoria e aggiungi articoli per iniziare",
    categories: {
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
    items: "articoli",
    total: "Totale",
    manualList: "Lista manuale"
  },
  tr: {
    title: "Manuel Liste Oluştur",
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
    saveList: "Listeyi Kaydet",
    listName: "Liste adı",
    emptyList: "Listeniz boş",
    emptyListSubtitle: "Bir kategori seçin ve öğeler ekleyin",
    categories: {
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
    items: "öğeler",
    total: "Toplam",
    manualList: "Manuel Liste"
  },
  pt: {
    title: "Criar Lista Manual",
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
    saveList: "Salvar Lista",
    listName: "Nome da lista",
    emptyList: "Sua lista está vazia",
    emptyListSubtitle: "Selecione uma categoria e adicione itens para começar",
    categories: {
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
    items: "itens",
    total: "Total",
    manualList: "Lista Manual"
  },
  ru: {
    title: "Создать ручной список",
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
    saveList: "Сохранить список",
    listName: "Название списка",
    emptyList: "Ваш список пуст",
    emptyListSubtitle: "Выберите категорию и добавьте товары для начала",
    categories: {
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
    items: "товаров",
    total: "Итого",
    manualList: "Ручной список"
  },
  ar: {
    title: "إنشاء قائمة يدوية",
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
    saveList: "حفظ القائمة",
    listName: "اسم القائمة",
    emptyList: "قائمتك فارغة",
    emptyListSubtitle: "اختر فئة وأضف عناصر للبدء",
    categories: {
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
    items: "عناصر",
    total: "المجموع",
    manualList: "قائمة يدوية"
  },
  ja: {
    title: "手動リストを作成",
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
    saveList: "リストを保存",
    listName: "リスト名",
    emptyList: "リストは空です",
    emptyListSubtitle: "カテゴリーを選択してアイテムを追加してください",
    categories: {
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
    items: "アイテム",
    total: "合計",
    manualList: "手動リスト"
  },
  hu: {
    title: "Kézi lista létrehozása",
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
    saveList: "Lista mentése",
    listName: "Lista neve",
    emptyList: "A lista üres",
    emptyListSubtitle: "Válasszon kategóriát és adjon hozzá elemeket",
    categories: {
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
    items: "elemek",
    total: "Összesen",
    manualList: "Kézi lista"
  },
  hi: {
    title: "मैनुअल सूची बनाएं",
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
    saveList: "सूची सहेजें",
    listName: "सूची का नाम",
    emptyList: "आपकी सूची खाली है",
    emptyListSubtitle: "एक श्रेणी चुनें और आइटम जोड़ें",
    categories: {
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
    items: "आइटम",
    total: "कुल",
    manualList: "मैनुअल सूची"
  },
  nl: {
    title: "Handmatige lijst maken",
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
    saveList: "Lijst opslaan",
    listName: "Lijstnaam",
    emptyList: "Uw lijst is leeg",
    emptyListSubtitle: "Selecteer een categorie en voeg items toe om te beginnen",
    categories: {
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
    items: "items",
    total: "Totaal",
    manualList: "Handmatige lijst"
  }
}

const HandwrittenListScreen = ({ route }) => {
  const { triggerHaptic } = useHaptic()
  const navigation = useNavigation()

  // Get device language
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  const t = translations[deviceLanguage] || translations.en

  // States
  const [categories, setCategories] = useState([])
  const [customCategories, setCustomCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [listItems, setListItems] = useState({})
  const [modalVisible, setModalVisible] = useState(false)
  const [saveModalVisible, setSaveModalVisible] = useState(false)
  const [customCategoryModalVisible, setCustomCategoryModalVisible] = useState(false)
  const [listName, setListName] = useState("")
  const [itemName, setItemName] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [unit, setUnit] = useState("units") // units, kg, g, l, ml
  const [price, setPrice] = useState("")
  const [isStore, setIsStore] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [selectedIcon, setSelectedIcon] = useState(null)
  const [selectedColor, setSelectedColor] = useState(availableColors[0])
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [deleteMode, setDeleteMode] = useState(null) // ID de la categoría en modo eliminar

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.9)).current
  const categoryAnimations = useRef(
    categories.map(() => new Animated.Value(0))
  ).current
  const shakeAnimation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Load custom categories on mount
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
  }, [])

  const loadCustomCategories = async () => {
    try {
      const stored = await AsyncStorage.getItem('customCategoriesHandwritten')
      if (stored) {
        const parsed = JSON.parse(stored)
        setCustomCategories(parsed)
        // Ordenar: categorías personalizadas primero, luego las predeterminadas
        setCategories([...parsed, ...defaultCategories])
      } else {
        setCategories(defaultCategories)
      }
    } catch (error) {
      console.error('Error loading custom categories:', error)
      setCategories(defaultCategories)
    }
  }

  const handleCategoryPress = (category) => {
    if (deleteMode) {
      // Si está en modo eliminar, salir del modo
      setDeleteMode(null)
      return
    }
    triggerHaptic('light')
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
    triggerHaptic('light')
  }

  const handleDeleteCategory = async (categoryId) => {
    // Actualizar categorías personalizadas
    const updatedCustom = customCategories.filter(cat => cat.id !== categoryId)
    setCustomCategories(updatedCustom)

    // Actualizar la lista combinada
    setCategories([...updatedCustom, ...defaultCategories])

    // Salir del modo eliminar después de eliminar
    setDeleteMode(null)

    // También eliminar los items de esta categoría
    setListItems(prev => {
      const newItems = { ...prev }
      delete newItems[categoryId]
      return newItems
    })

    // Guardar en AsyncStorage
    try {
      await AsyncStorage.setItem('customCategoriesHandwritten', JSON.stringify(updatedCustom))
    } catch (error) {
      console.error('Error saving custom categories:', error)
    }

    triggerHaptic('success')
  }

  const handleAddItem = () => {
    if (!itemName.trim() || !selectedCategory) return

    const newItem = {
      id: Date.now().toString(),
      name: itemName,
      quantity: parseFloat(quantity) || 1,
      unit: unit,
      price: parseFloat(price) || 0,
      isStore,
      category: selectedCategory.id
    }

    setListItems(prev => ({
      ...prev,
      [selectedCategory.id]: [...(prev[selectedCategory.id] || []), newItem]
    }))

    // Reset form
    setItemName("")
    setQuantity("1")
    setUnit("units")
    setPrice("")
    setIsStore(false)
    setModalVisible(false)

    triggerHaptic('success')
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

    // Actualizar categorías personalizadas
    const updatedCustom = [...customCategories, newCategory]
    setCustomCategories(updatedCustom)

    // Actualizar la lista combinada: personalizadas primero, luego predeterminadas
    setCategories([...updatedCustom, ...defaultCategories])

    // Guardar en AsyncStorage
    try {
      await AsyncStorage.setItem('customCategoriesHandwritten', JSON.stringify(updatedCustom))
    } catch (error) {
      console.error('Error saving custom categories:', error)
    }

    setCustomCategoryModalVisible(false)
    setNewCategoryName("")
    setSelectedIcon(null)
    setSelectedColor(availableColors[0])
    triggerHaptic('success')
  }

  const removeItem = (categoryId, itemId) => {
    triggerHaptic('light')
    setListItems(prev => ({
      ...prev,
      [categoryId]: prev[categoryId].filter(item => item.id !== itemId)
    }))
  }

  const getTotalItems = () => {
    return Object.values(listItems).reduce((total, items) => total + items.length, 0)
  }

  const getTotalPrice = () => {
    return Object.values(listItems).reduce((total, items) => {
      return total + items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    }, 0)
  }

  const saveList = async () => {
    if (getTotalItems() === 0) {
      Alert.alert("", t.emptyList)
      return
    }

    const defaultName = `${t.manualList} ${new Date().toLocaleDateString()}`
    setListName(defaultName)
    setSaveModalVisible(true)
  }

  const confirmSave = async () => {
    try {
      const listData = {
        id: Date.now().toString(),
        name: listName || `${t.manualList} ${new Date().toLocaleDateString()}`,
        items: listItems,
        totalItems: getTotalItems(),
        totalPrice: getTotalPrice(),
        createdAt: new Date().toISOString(),
        type: 'manual'
      }

      // Get existing history
      const existingHistory = await AsyncStorage.getItem("@shopping_history")
      let history = existingHistory ? JSON.parse(existingHistory) : []

      // Convert to flat list format for compatibility with categories
      const flatList = Object.entries(listItems).flatMap(([categoryId, items]) => {
        // Get category name - check if it's a custom category or default
        let categoryName = null
        const category = categories.find(cat => cat.id === categoryId)

        if (category) {
          if (category.isCustom) {
            categoryName = category.name
          } else {
            // Use translated name for default categories
            categoryName = t.categories[categoryId] || categoryId
          }
        }

        // Map items with category prefix format
        return items.map(item => {
          const itemText = `${item.name} (${item.quantity})`
          return categoryName ? `${categoryName} - ${itemText}` : itemText
        })
      })

      // Add to history in compatible format
      history.push({
        list: flatList,
        name: listData.name,
        date: listData.createdAt,
        metadata: listData
      })

      await AsyncStorage.setItem("@shopping_history", JSON.stringify(history))
      await AsyncStorage.setItem("@show_newest_list", "true")

      setSaveModalVisible(false)

      // Navigate to History
      if (route.params?.onNavigateToHistory) {
        route.params.onNavigateToHistory()
      } else {
        navigation.navigate('History')
      }

      triggerHaptic('success')
    } catch (error) {
      console.error("Error saving list:", error)
      Alert.alert("Error", "Could not save list")
    }
  }

  const renderCategory = ({ item, index }) => {
    const itemCount = listItems[item.id]?.length || 0
    const displayName = item.isCustom ? item.name : t.categories[item.id]
    const showDeleteButton = deleteMode === item.id

    return (
      <Animated.View
        style={[
          styles.categoryCard,
          {
            opacity: categoryAnimations[index] || 1,
            transform: [
              {
                translateY: categoryAnimations[index]?.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0]
                }) || 0
              },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        <TouchableOpacity
          style={[styles.categoryButton, { backgroundColor: item.gradient[0] }]}
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
                <Ionicons name={item.icon} size={32} color="white" />
              ) : (
                <Text style={styles.categoryInitials}>
                  {displayName.substring(0, 2).toUpperCase()}
                </Text>
              )}
            </View>
            <Text style={styles.categoryName} numberOfLines={2}>{displayName}</Text>
            {itemCount > 0 && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{itemCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
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
            <Ionicons name="add" size={32} color="white" />
          </View>
          <Text style={[styles.categoryName, { fontSize: 11 }]}>{t.addCustomCategory}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )

  const getUnitDisplay = (quantity, unit) => {
    const unitAbbreviations = {
      units: '',
      kg: 'kg',
      g: 'g',
      l: 'L',
      ml: 'ml'
    }
    const unitText = unitAbbreviations[unit] || ''
    return unit === 'units' ? `x${quantity}` : `${quantity}${unitText}`
  }

  const renderListItem = (item, categoryId) => (
    <View key={item.id} style={styles.listItem}>
      <View style={styles.listItemContent}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <View style={styles.itemDetails}>
            <Text style={styles.itemQuantity}>
              {getUnitDisplay(item.quantity, item.unit)}
            </Text>
            {item.price > 0 && (
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            )}
            {item.isStore && (
              <View style={styles.storeBadge}>
                <Ionicons name="business" size={12} color="#ff9500" />
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity
          onPress={() => removeItem(categoryId, item.id)}
          style={styles.removeButton}
        >
          <Ionicons name="close-circle" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>

          <Text style={styles.title}>{t.selectCategory}</Text>
        </View>

        {/* Categories Grid */}
        <FlatList
          data={[{ id: 'add_custom', isAddButton: true }, ...categories]}
          renderItem={({ item, index }) =>
            item.isAddButton ? <AddCategoryButton key="add_custom" /> : renderCategory({ item, index: index - 1 })
          }
          keyExtractor={item => item.id}
          numColumns={3}
          contentContainerStyle={styles.categoriesGrid}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            getTotalItems() > 0 && (
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    {getTotalItems()} {t.items}
                  </Text>
                  {getTotalPrice() > 0 && (
                    <Text style={styles.summaryPrice}>
                      {t.total}: ${getTotalPrice().toFixed(2)}
                    </Text>
                  )}
                </View>
              </View>
            )
          }
          ListFooterComponent={
            <View style={styles.listSection}>
              {Object.entries(listItems).map(([categoryId, items]) => {
                if (items.length === 0) return null
                const category = categories.find(c => c.id === categoryId)

                return (
                  <View key={categoryId} style={styles.categorySection}>
                    <View style={[styles.categorySectionHeader, { backgroundColor: category.gradient[0] + '20' }]}>
                      <Ionicons name={category.icon} size={20} color={category.gradient[0]} />
                      <Text style={[styles.categorySectionTitle, { color: category.gradient[0] }]}>
                        {category.isCustom ? category.name : t.categories[categoryId]}
                      </Text>
                    </View>
                    {items.map(item => renderListItem(item, categoryId))}
                  </View>
                )
              })}
            </View>
          }
        />


        {/* Save Button */}
        {getTotalItems() > 0 && (
          <TouchableOpacity style={styles.saveButton} onPress={saveList}>
            <Ionicons name="save-outline" size={24} color="white" />
            <Text style={styles.saveButtonText}>{t.saveList}</Text>
          </TouchableOpacity>
        )}
      </Animated.View>

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
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.addCustomCategory}</Text>
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
                    selectedColor.color === color.color && styles.selectedColor
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
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
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
              <Text style={styles.modalTitle}>{t.addItem}</Text>
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

      {/* Save List Modal */}
      <Modal
        visible={saveModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSaveModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.saveModalContent}>
            <Text style={styles.saveModalTitle}>{t.listName}</Text>
            <TextInput
              style={styles.saveInput}
              value={listName}
              onChangeText={setListName}
              placeholder={t.manualList}
              autoFocus
              selectTextOnFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setSaveModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>{t.cancel}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmSave}
              >
                <Text style={styles.addButtonText}>{t.saveList}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e7ead2",
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1e293b9a',

    marginTop: -20,

  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  categoriesGrid: {
    paddingHorizontal: 10,
    paddingBottom: 100,
  },
  categoryCard: {
    flex: 1,
    margin: 8,
    height: 120,
  },
  categoryButton: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
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
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  categoryInitials: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  addCategoryButton: {
    backgroundColor: '#94a3b8',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  categoryBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoryBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
  },
  summaryPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10b981',
  },
  listSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  categorySection: {
    marginBottom: 20,
  },
  categorySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  categorySectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  listItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 4,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#64748b',
  },
  itemPrice: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  storeBadge: {
    backgroundColor: '#fff7ed',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  removeButton: {
    padding: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: -100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#475569',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  saveButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 28,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
  },
  customCategoryModal: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
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
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
    marginLeft: 12,
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
  selectedColor: {
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
  confirmButton: {
    backgroundColor: '#10b981',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  saveModalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
  },
  saveModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  saveInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
})

export default HandwrittenListScreen