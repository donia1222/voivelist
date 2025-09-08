import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView, Keyboard,Platform, TouchableOpacity, Modal,KeyboardAvoidingView, Animated, FlatList,ActivityIndicator, Alert,  } from 'react-native';
import { Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as RNLocalize from "react-native-localize";
import { useTheme } from '../ThemeContext'; // Importa el hook useTheme
import { StyleSheet } from 'react-native';
import Slideshow from './Slideshow';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Purchases from 'react-native-purchases';
import LinearGradient from 'react-native-linear-gradient';
const ModernButton = ({ icon, text, onPress, gradientColors }) => (
  <TouchableOpacity
    style={styles.button}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <LinearGradient
      colors={gradientColors}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <Ionicons name={icon} size={24} color="white" style={styles.icon} />
      <Text style={styles.text}>{text}</Text>
    </LinearGradient>
  </TouchableOpacity>
);
const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    overflow: 'hidden',
    marginVertical: 10,
    elevation: 5, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginRight: 10,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',

    textAlign:'center',
  },
});
const locale = RNLocalize.getLocales()[0];
console.log(locale.languageCode);  // Esto imprimirá el código del idioma, por ejemplo, "en", "es", etc.
const API_KEY_CHAT = process.env.API_KEY_CHAT;

  const FoodMosal = ({  isNightMode }) => {
  const [breed, setBreed] = useState('');
  const [inputText, setInputText] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const scrollViewRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [chipsVisible, setChipsVisible] = useState(true);
  const { theme } = useTheme();
  const styles = getStyles(theme);

const [shoppingLists, setShoppingLists] = useState([]);
const [isModalVisible, setIsModalVisible] = useState(false);

 const navigation = useNavigation();
  const [history, setHistory] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isFavoritesModalVisible, setIsFavoritesModalVisible] = useState(false);
  const [chipsModalVisible, setIschipsModalVisible] = useState(true);

  const [isSubscribed, setIsSubscribed] = useState(false);

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


return () => {
  Purchases.removeCustomerInfoUpdateListener(handleCustomerInfoUpdate);
};
}, []);


  
  useEffect(() => {
    // Cargar las listas de la compra y el historial desde AsyncStorage al montar el componente
    const loadLists = async () => {
      try {
        const storedLists = await AsyncStorage.getItem('@shopping_lists');
        if (storedLists !== null) {
          setShoppingLists(JSON.parse(storedLists));
        }

        const storedHistory = await AsyncStorage.getItem('@shopping_history');
        if (storedHistory !== null) {
          setHistory(JSON.parse(storedHistory));
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    loadLists();
  }, []);


  
  const DogRecep = {
    en: [
      // Recetas de Pollo
      { id: '1', title: "Homemade Chicken Croquettes", description: "Delicious and crispy chicken croquettes perfect for any meal.", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 kcal", fat: "15g" },
      { id: '5', title: "Grilled Chicken with Herbs", description: "Juicy grilled chicken breast with a mix of fresh herbs.", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 kcal", fat: "8g" },
      // Recetas de Ternera
      { id: '2', title: "Veal Meatballs", description: "Tender veal meatballs cooked to perfection.", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 kcal", fat: "18g" },
      { id: '6', title: "Beef Stroganoff", description: "Tender beef strips cooked in a creamy mushroom sauce.", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 kcal", fat: "20g" },
      // Recetas Vegetarianas
      { id: '4', title: "Vegetable Lasagna", description: "With fresh vegetables, gratin mozzarella cheese.", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 kcal", fat: "10g" },
      { id: '7', title: "Stuffed Bell Peppers", description: "Colorful bell peppers stuffed with a vegetable and rice mix.", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 kcal", fat: "3g" },
      // Postres
      { id: '3', title: "Oat and Banana Cookies", description: "Healthy and tasty oat and banana cookies.", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 kcal", fat: "5g" },
      { id: '8', title: "Chocolate Brownie", description: "Rich chocolate brownie with a gooey center.", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 kcal", fat: "25g" },
    ],
    es: [
      // Recetas de Pollo
      { id: '1', title: "Croquetas de Pollo Caseras", description: "Deliciosas croquetas de pollo crujientes perfectas para cualquier comida.", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 kcal", fat: "15g" },
      { id: '5', title: "Pollo a la Parrilla con Hierbas", description: "Pechuga de pollo jugosa a la parrilla con una mezcla de hierbas frescas.", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 kcal", fat: "8g" },
      // Recetas de Ternera
      { id: '2', title: "Albóndigas de Ternera", description: "Tiernas albóndigas de ternera cocidas a la perfección.", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 kcal", fat: "18g" },
      { id: '6', title: "Stroganoff de Ternera", description: "Tiernas tiras de ternera cocinadas en una cremosa salsa de champiñones.", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 kcal", fat: "20g" },
      // Recetas Vegetarianas
      { id: '4', title: "Lasaña de Verduras", description: "Con verduras frescas, queso mozzarella gratinado.", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 kcal", fat: "10g" },
      { id: '7', title: "Pimientos Rellenos", description: "Pimientos de colores rellenos con una mezcla de vegetales y arroz.", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 kcal", fat: "3g" },
      // Postres
      { id: '3', title: "Galletas de Avena y Plátano", description: "Galletas saludables y sabrosas de avena y plátano.", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 kcal", fat: "5g" },
      { id: '8', title: "Brownie de Chocolate", description: "Brownie de chocolate rico con un centro cremoso.", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 kcal", fat: "25g" },
    ],
    de: [
      // Recetas de Pollo
      { id: '1', title: "Hausgemachte Hähnchenkroketten", description: "Köstliche und knusprige Hähnchenkroketten, perfekt für jede Mahlzeit.", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 kcal", fat: "15g" },
      { id: '5', title: "Gegrilltes Hähnchen mit Kräutern", description: "Saftige gegrillte Hähnchenbrust mit einer Mischung aus frischen Kräutern.", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 kcal", fat: "8g" },
      // Recetas de Ternera
      { id: '2', title: "Kalbsfleischbällchen", description: "Zarte Kalbsfleischbällchen, perfekt gegart.", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 kcal", fat: "18g" },
      { id: '6', title: "Rinder Stroganoff", description: "Zarte Rinderstreifen in einer cremigen Pilzsauce.", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 kcal", fat: "20g" },
      // Recetas Vegetarianas
      { id: '4', title: "Gemüse-Lasagne", description: "Mit frischem Gemüse und überbackenem Mozzarella.", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 kcal", fat: "10g" },
      { id: '7', title: "Gefüllte Paprika", description: "Bunte Paprikaschoten gefüllt mit einer Mischung aus Gemüse und Reis.", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 kcal", fat: "3g" },
      // Postres
      { id: '3', title: "Hafer-Bananen-Kekse", description: "Gesunde und leckere Hafer-Bananen-Kekse.", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 kcal", fat: "5g" },
      { id: '8', title: "Schokoladenbrownie", description: "Reicher Schokoladenbrownie mit einem weichen Kern.", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 kcal", fat: "25g" },
    ],
    fr: [
      // Recetas de Pollo
      { id: '1', title: "Croquettes de Poulet Maison", description: "Délicieuses croquettes de poulet croustillantes, parfaites pour tous les repas.", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 kcal", fat: "15g" },
      { id: '5', title: "Poulet Grillé aux Herbes", description: "Poitrine de poulet grillée juteuse avec un mélange de fines herbes.", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 kcal", fat: "8g" },
      // Recetas de Ternera
      { id: '2', title: "Boulettes de Veau", description: "Boulettes de veau tendres cuites à la perfection.", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 kcal", fat: "18g" },
      { id: '6', title: "Bœuf Stroganoff", description: "Lanières de bœuf tendre dans une sauce crémeuse aux champignons.", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 kcal", fat: "20g" },
      // Recetas Vegetarianas
      { id: '4', title: "Lasagne aux Légumes", description: "Avec des légumes frais et du mozzarella gratiné.", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 kcal", fat: "10g" },
      { id: '7', title: "Poivrons Farcis", description: "Poivrons colorés farcis d'un mélange de légumes et de riz.", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 kcal", fat: "3g" },
      // Postres
      { id: '3', title: "Cookies à l'Avoine et Banane", description: "Cookies sains et savoureux à l'avoine et à la banane.", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 kcal", fat: "5g" },
      { id: '8', title: "Brownie au Chocolat", description: "Brownie au chocolat riche avec un centre fondant.", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 kcal", fat: "25g" },
    ],
    it: [
      // Recetas di Pollo
      { id: '1', title: "Crocchette di Pollo Fatto in Casa", description: "Deliziose crocchette di pollo croccanti, perfette per ogni pasto.", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 kcal", fat: "15g" },
      { id: '5', title: "Pollo alla Griglia con Erbe", description: "Petto di pollo succoso alla griglia con una miscela di erbe fresche.", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 kcal", fat: "8g" },
      // Ricette di Vitello
      { id: '2', title: "Polpette di Vitello", description: "Tenere polpette di vitello cotte alla perfezione.", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 kcal", fat: "18g" },
      { id: '6', title: "Stroganoff di Manzo", description: "Strisce di manzo tenero cotte in una salsa cremosa ai funghi.", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 kcal", fat: "20g" },
      // Ricette Vegetariane
      { id: '4', title: "Lasagna di Verdure", description: "Con verdure fresche e mozzarella gratinata.", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 kcal", fat: "10g" },
      { id: '7', title: "Peperoni Ripieni", description: "Peperoni colorati ripieni di un mix di verdure e riso.", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 kcal", fat: "3g" },
      // Dessert
      { id: '3', title: "Biscotti di Avena e Banana", description: "Biscotti sani e gustosi a base di avena e banana.", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 kcal", fat: "5g" },
      { id: '8', title: "Brownie al Cioccolato", description: "Brownie al cioccolato ricco con un centro morbido.", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 kcal", fat: "25g" },
    ],
  
    // Portugués (pt)
    pt: [
      // Receitas de Frango
      { id: '1', title: "Croquetes de Frango Caseiros", description: "Deliciosos croquetes de frango crocantes, perfeitos para qualquer refeição.", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 kcal", fat: "15g" },
      { id: '5', title: "Frango Grelhado com Ervas", description: "Peito de frango suculento grelhado com uma mistura de ervas frescas.", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 kcal", fat: "8g" },
      // Receitas de Vitela
      { id: '2', title: "Almôndegas de Vitela", description: "Almôndegas de vitela tenras, cozidas à perfeição.", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 kcal", fat: "18g" },
      { id: '6', title: "Strogonoff de Carne", description: "Tiras de carne tenra cozidas em um molho cremoso de cogumelos.", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 kcal", fat: "20g" },
      // Receitas Vegetarianas
      { id: '4', title: "Lasanha de Legumes", description: "Com legumes frescos e mozzarella gratinada.", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 kcal", fat: "10g" },
      { id: '7', title: "Pimentos Recheados", description: "Pimentos coloridos recheados com uma mistura de legumes e arroz.", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 kcal", fat: "3g" },
      // Sobremesas
      { id: '3', title: "Biscoitos de Aveia e Banana", description: "Biscoitos saudáveis e saborosos de aveia e banana.", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 kcal", fat: "5g" },
      { id: '8', title: "Brownie de Chocolate", description: "Brownie de chocolate rico com um centro cremoso.", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 kcal", fat: "25g" },
    ],
  
    // Ruso (ru)
    ru: [
      // Рецепты из курицы
      { id: '1', title: "Домашние Куриные Крокеты", description: "Вкусные и хрустящие куриные крокеты, идеальные для любого приёма пищи.", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 ккал", fat: "15г" },
      { id: '5', title: "Курица на Гриле с Травами", description: "Сочная куриная грудка на гриле с смесью свежих трав.", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 ккал", fat: "8г" },
      // Рецепты из телятины
      { id: '2', title: "Телячьи Тефтели", description: "Нежные телячьи тефтели, приготовленные до совершенства.", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 ккал", fat: "18г" },
      { id: '6', title: "Бефстроганов", description: "Нежные полоски говядины в кремовом грибном соусе.", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 ккал", fat: "20г" },
      // Вегетарианские Рецепты
      { id: '4', title: "Овощная Лазанья", description: "С свежими овощами и запечённой моцареллой.", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 ккал", fat: "10г" },
      { id: '7', title: "Фаршированные Перцы", description: "Цветной болгарский перец, фаршированный овощами и рисом.", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 ккал", fat: "3г" },
      // Десерты
      { id: '3', title: "Овсяное Печенье с Бананом", description: "Полезное и вкусное овсяное печенье с бананом.", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 ккал", fat: "5г" },
      { id: '8', title: "Шоколадный Брауни", description: "Насыщенный шоколадный брауни с мягким центром.", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 ккал", fat: "25г" },
    ],
  
    // Japonés (ja)
    ja: [
      // チキンのレシピ
      { id: '1', title: "手作りチキンクロケット", description: "どんな食事にもぴったりの美味しくてサクサクのチキンクロケット。", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 kcal", fat: "15g" },
      { id: '5', title: "ハーブグリルチキン", description: "フレッシュハーブのミックスで味付けしたジューシーなグリルチキン。", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 kcal", fat: "8g" },
      // 仔牛のレシピ
      { id: '2', title: "仔牛のミートボール", description: "完璧に調理された柔らかい仔牛のミートボール。", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 kcal", fat: "18g" },
      { id: '6', title: "ビーフストロガノフ", description: "クリーミーなマッシュルームソースで調理された柔らかいビーフストリップ。", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 kcal", fat: "20g" },
      // ベジタリアンのレシピ
      { id: '4', title: "野菜のラザニア", description: "新鮮な野菜とモッツァレラチーズのグラタン。", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 kcal", fat: "10g" },
      { id: '7', title: "野菜の詰め物ピーマン", description: "色とりどりのピーマンに野菜とご飯を詰めました。", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 kcal", fat: "3g" },
      // デザート
      { id: '3', title: "オート麦とバナナのクッキー", description: "ヘルシーで美味しいオート麦とバナナのクッキー。", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 kcal", fat: "5g" },
      { id: '8', title: "チョコレートブラウニー", description: "柔らかい中心のリッチなチョコレートブラウニー。", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 kcal", fat: "25g" },
    ],
  
    // Chino (zh)
    zh: [
      // 鸡肉食谱
      { id: '1', title: "自制鸡肉可乐饼", description: "美味酥脆的鸡肉可乐饼，适合任何餐点。", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 kcal", fat: "15g" },
      { id: '5', title: "香草烤鸡", description: "多汁的烤鸡胸肉，配以新鲜香草混合。", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 kcal", fat: "8g" },
      // 小牛肉食谱
      { id: '2', title: "小牛肉丸", description: "嫩滑的小牛肉丸，完美烹饪。", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 kcal", fat: "18g" },
      { id: '6', title: "牛肉斯特罗加诺夫", description: "嫩牛肉条配奶油蘑菇酱烹制。", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 kcal", fat: "20g" },
      // 素食食谱
      { id: '4', title: "蔬菜千层面", description: "搭配新鲜蔬菜和马苏里拉芝士。", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 kcal", fat: "10g" },
      { id: '7', title: "填馅彩椒", description: "彩色彩椒，内含蔬菜和米饭混合物。", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 kcal", fat: "3g" },
      // 甜点
      { id: '3', title: "燕麦香蕉饼干", description: "健康美味的燕麦香蕉饼干。", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 kcal", fat: "5g" },
      { id: '8', title: "巧克力布朗尼", description: "内心柔软的浓郁巧克力布朗尼。", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 kcal", fat: "25g" },
    ],
  
    // Polaco (pl)
    pl: [
      // Przepisy z Kurczaka
      { id: '1', title: "Domowe Kotleciki z Kurczaka", description: "Pyszne i chrupiące kotleciki z kurczaka, idealne na każdy posiłek.", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 kcal", fat: "15g" },
      { id: '5', title: "Grillowany Kurczak z Ziołami", description: "Soczysta pierś z kurczaka z mieszanką świeżych ziół.", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 kcal", fat: "8g" },
      // Przepisy z Cielęciny
      { id: '2', title: "Klopsiki z Cielęciny", description: "Delikatne klopsiki z cielęciny, doskonale przyrządzone.", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 kcal", fat: "18g" },
      { id: '6', title: "Strogonow Wołowy", description: "Delikatne paski wołowiny w kremowym sosie grzybowym.", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 kcal", fat: "20g" },
      // Przepisy Wegetariańskie
      { id: '4', title: "Lasagne Warzywna", description: "Z świeżymi warzywami i zapiekanym serem mozzarella.", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 kcal", fat: "10g" },
      { id: '7', title: "Nadziewane Papryki", description: "Kolorowe papryki faszerowane mieszanką warzyw i ryżu.", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 kcal", fat: "3g" },
      // Desery
      { id: '3', title: "Ciastka owsiane z Bananem", description: "Zdrowe i smaczne ciastka owsiane z bananem.", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 kcal", fat: "5g" },
      { id: '8', title: "Brownie Czekoladowe", description: "Bogate brownie czekoladowe z miękkim środkiem.", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 kcal", fat: "25g" },
    ],
    sv: [
      // Kycklingrecept
      { id: '1', title: "Hemgjorda Kycklingkroketter", description: "Läckra och krispiga kycklingkroketter, perfekta för varje måltid.", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 kcal", fat: "15g" },
      { id: '5', title: "Grillad Kyckling med Örter", description: "Saftig grillad kycklingbröst med en blandning av färska örter.", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 kcal", fat: "8g" },
      // Kalvköttrecept
      { id: '2', title: "Kalvköttbullar", description: "Mjuka kalvköttbullar tillagade till perfektion.", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 kcal", fat: "18g" },
      { id: '6', title: "Biff Stroganoff", description: "Möra biffstrimlor tillagade i en krämig svampsås.", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 kcal", fat: "20g" },
      // Vegetariska Recept
      { id: '4', title: "Vegetarisk Lasagne", description: "Med färska grönsaker och gratinerad mozzarella.", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 kcal", fat: "10g" },
      { id: '7', title: "Fyllda Paprikor", description: "Färgglada paprikor fyllda med en blandning av grönsaker och ris.", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 kcal", fat: "3g" },
      // Efterrätter
      { id: '3', title: "Havre- och Banan-kakor", description: "Hälsosamma och goda havre- och banankakor.", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 kcal", fat: "5g" },
      { id: '8', title: "Chokladbrownie", description: "Rik chokladbrownie med en mjuk kärna.", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 kcal", fat: "25g" },
    ],
  
    // Húngaro (hu)
    hu: [
      // Csirke receptek
      { id: '1', title: "Házi Készítésű Csirke Kroket", description: "Ízletes és ropogós csirke krokett, tökéletes minden étkezéshez.", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 kcal", fat: "15g" },
      { id: '5', title: "Grillezett Csirke Fűszernövényekkel", description: "Szaftos grillezett csirkemell friss fűszernövényekkel.", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 kcal", fat: "8g" },
      // Borjú receptek
      { id: '2', title: "Borjú Húsgombócok", description: "Puhára főtt borjú húsgombócok.", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 kcal", fat: "18g" },
      { id: '6', title: "Marha Stroganoff", description: "Puha marhahús csíkok krémes gombaszószban.", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 kcal", fat: "20g" },
      // Vegetáriánus Receptek
      { id: '4', title: "Zöldséges Lasagne", description: "Friss zöldségekkel és gratinált mozzarellával.", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 kcal", fat: "10g" },
      { id: '7', title: "Töltött Paprika", description: "Színes paprika, megtöltve zöldségekkel és rizzsel.", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 kcal", fat: "3g" },
      // Desszertek
      { id: '3', title: "Zab és Banán Süti", description: "Egészséges és finom zab és banán süti.", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 kcal", fat: "5g" },
      { id: '8', title: "Csokoládés Brownie", description: "Gazdag csokoládés brownie puha központtal.", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 kcal", fat: "25g" },
    ],
  
    // Árabe (ar)
    ar: [
      // وصفات الدجاج
      { id: '1', title: "كروكيت الدجاج منزلي الصنع", description: "كروكيت الدجاج اللذيذ والمقرمش، مثالي لأي وجبة.", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 سعر حراري", fat: "15 جرام" },
      { id: '5', title: "دجاج مشوي بالأعشاب", description: "صدر دجاج مشوي طري مع خليط من الأعشاب الطازجة.", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 سعر حراري", fat: "8 جرام" },
      // وصفات العجل
      { id: '2', title: "كرات لحم العجل", description: "كرات لحم العجل الطرية المطهية بإتقان.", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 سعر حراري", fat: "18 جرام" },
      { id: '6', title: "بف ستراغانوف", description: "شرائح لحم طرية مطهوة في صلصة كريمية بالفطر.", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 سعر حراري", fat: "20 جرام" },
      // وصفات نباتية
      { id: '4', title: "لازانيا بالخضار", description: "مع الخضار الطازجة وجبن الموزاريلا المبشور.", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 سعر حراري", fat: "10 جرام" },
      { id: '7', title: "فلفل محشي", description: "فلفل ملون محشي بمزيج من الخضار والأرز.", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 سعر حراري", fat: "3 جرام" },
      // حلويات
      { id: '3', title: "بسكويت الشوفان والموز", description: "بسكويت صحي ولذيذ من الشوفان والموز.", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 سعر حراري", fat: "5 جرام" },
      { id: '8', title: "براوني الشوكولاتة", description: "براوني الشوكولاتة الغني بمركز طري.", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 سعر حراري", fat: "25 جرام" },
    ],
  
    // Hindi (hi)
    hi: [
      // चिकन व्यंजन
      { id: '1', title: "घर का बना चिकन क्रोकेट्स", description: "स्वादिष्ट और कुरकुरे चिकन क्रोकेट्स, किसी भी भोजन के लिए उपयुक्त।", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 किलो कैलोरी", fat: "15 ग्राम" },
      { id: '5', title: "हर्ब्स के साथ ग्रिल्ड चिकन", description: "ताज़े हर्ब्स के मिश्रण के साथ रसीला ग्रिल्ड चिकन ब्रेस्ट।", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 किलो कैलोरी", fat: "8 ग्राम" },
      // बछड़ा व्यंजन
      { id: '2', title: "वील मीटबॉल्स", description: "नरम वील मीटबॉल्स, परफेक्शन में पकाए गए।", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 किलो कैलोरी", fat: "18 ग्राम" },
      { id: '6', title: "बीफ स्ट्रोगानॉफ", description: "क्रीमी मशरूम सॉस में नरम बीफ स्ट्रिप्स।", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 किलो कैलोरी", fat: "20 ग्राम" },
      // शाकाहारी व्यंजन
      { id: '4', title: "सब्ज़ियों की लसग्ना", description: "ताज़ी सब्ज़ियों और मोज़ेरेला चीज़ के साथ।", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 किलो कैलोरी", fat: "10 ग्राम" },
      { id: '7', title: "भरवां बेल मिर्च", description: "रंगीन बेल मिर्च, सब्ज़ियों और चावल के मिश्रण से भरी हुई।", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 किलो कैलोरी", fat: "3 ग्राम" },
      // मिठाई
      { id: '3', title: "ओट और केला कुकीज", description: "स्वस्थ और स्वादिष्ट ओट और केला कुकीज।", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 किलो कैलोरी", fat: "5 ग्राम" },
      { id: '8', title: "चॉकलेट ब्राउनी", description: "मुलायम केंद्र के साथ समृद्ध चॉकलेट ब्राउनी।", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 किलो कैलोरी", fat: "25 ग्राम" },
    ],
  
    // Griego (el)
    el: [
      // Συνταγές Κοτόπουλου
      { id: '1', title: "Σπιτικές Κροκέτες Κοτόπουλου", description: "Νόστιμες και τραγανές κροκέτες κοτόπουλου, ιδανικές για κάθε γεύμα.", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 kcal", fat: "15γρ" },
      { id: '5', title: "Ψητό Κοτόπουλο με Βότανα", description: "Ζουμερό ψητό στήθος κοτόπουλου με μείγμα φρέσκων βοτάνων.", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 kcal", fat: "8γρ" },
      // Συνταγές Μοσχαριού
      { id: '2', title: "Κεφτεδάκια Μοσχαριού", description: "Τρυφερά κεφτεδάκια μοσχαριού μαγειρεμένα στην εντέλεια.", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 kcal", fat: "18γρ" },
      { id: '6', title: "Μοσχαρίσιο Στρογκανόφ", description: "Τρυφερά μοσχαρίσια φιλετάκια μαγειρεμένα σε κρεμώδη σάλτσα μανιταριών.", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 kcal", fat: "20γρ" },
      // Χορτοφαγικές Συνταγές
      { id: '4', title: "Λαζάνια Λαχανικών", description: "Με φρέσκα λαχανικά και μοτσαρέλα στο γκρατέν.", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 kcal", fat: "10γρ" },
      { id: '7', title: "Γεμιστές Πιπεριές", description: "Χρωματιστές πιπεριές γεμιστές με μίγμα λαχανικών και ρυζιού.", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 kcal", fat: "3γρ" },
      // Γλυκά
      { id: '3', title: "Μπισκότα Βρώμης και Μπανάνας", description: "Υγιεινά και νόστιμα μπισκότα με βρώμη και μπανάνα.", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 kcal", fat: "5γρ" },
      { id: '8', title: "Σοκολατένιο Μπράουνι", description: "Πλούσιο σοκολατένιο μπράουνι με μαλακό κέντρο.", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 kcal", fat: "25γρ" },
    ],
  
    // Neerlandés (nl)
    nl: [
      // Kiprecepten
      { id: '1', title: "Zelfgemaakte Kippenkroketten", description: "Heerlijke en knapperige kippenkroketten, perfect voor elke maaltijd.", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 kcal", fat: "15g" },
      { id: '5', title: "Gegrilde Kip met Kruiden", description: "Sappige gegrilde kipfilet met een mix van verse kruiden.", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 kcal", fat: "8g" },
      // Kalfsvlees Recepten
      { id: '2', title: "Kalfsgehaktballetjes", description: "Zachte kalfsgehaktballetjes perfect bereid.", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 kcal", fat: "18g" },
      { id: '6', title: "Biefstuk Stroganoff", description: "Malse biefstukreepjes in een romige champignonsaus.", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 kcal", fat: "20g" },
      // Vegetarische Recepten
      { id: '4', title: "Groentelasagne", description: "Met verse groenten en gegratineerde mozzarella.", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 kcal", fat: "10g" },
      { id: '7', title: "Gevulde Paprika's", description: "Kleurrijke paprika's gevuld met een mix van groenten en rijst.", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 kcal", fat: "3g" },
      // Desserts
      { id: '3', title: "Haver- en Bananenkoekjes", description: "Gezonde en smakelijke haver- en bananenkoekjes.", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 kcal", fat: "5g" },
      { id: '8', title: "Chocoladebrownie", description: "Rijke chocoladebrownie met een zachte kern.", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 kcal", fat: "25g" },
    ],
  
    // Esloveno (sl)
    sl: [
      // Recepti s Piščancem
      { id: '1', title: "Domače Piščančje Krokete", description: "Okusne in hrustljave piščančje krokete, popolne za vsak obrok.", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 kcal", fat: "15g" },
      { id: '5', title: "Piščanec na Žaru z Zelišči", description: "Sočna piščančja prsa na žaru s svežimi zelišči.", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 kcal", fat: "8g" },
      // Recepti iz Teletine
      { id: '2', title: "Telečje Mesne Kroglice", description: "Nežne telečje mesne kroglice kuhane do popolnosti.", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 kcal", fat: "18g" },
      { id: '6', title: "Goveji Stroganov", description: "Nežni goveji trakovi kuhani v kremni gobovi omaki.", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 kcal", fat: "20g" },
      // Vegetarijanski Recepti
      { id: '4', title: "Zelenjavna Lazanja", description: "S svežo zelenjavo in gratiniranim sirom mozzarella.", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 kcal", fat: "10g" },
      { id: '7', title: "Polnjene Paprike", description: "Barvne paprike polnjene z mešanico zelenjave in riža.", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 kcal", fat: "3g" },
      // Sladice
      { id: '3', title: "Ovseni in Bananini Piškoti", description: "Zdravi in okusni ovseni piškoti z banano.", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 kcal", fat: "5g" },
      { id: '8', title: "Čokoladni Brownie", description: "Bogati čokoladni brownie z mehkim jedrom.", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 kcal", fat: "25g" },
    ],
  };
  
  



const placeholdersi = {
  en: "What recipe would you like to prepare today?",
  es: "¿Qué receta te gustaría preparar hoy?",
  de: "Welches Rezept möchten Sie heute zubereiten?",
  fr: "Quelle recette aimeriez-vous préparer aujourd'hui?",
  it: "Quale ricetta ti piacerebbe preparare oggi?",
  tr: "Bugün hangi tarifi hazırlamak istersiniz?",
  pt: "Qual receita você gostaria de preparar hoje?",
  ru: "Какой рецепт вы хотели бы приготовить сегодня?",
  ja: "今日はどのレシピを作りたいですか？",
  zh: "今天你想准备什么食谱？",
  pl: "Jakiego przepisu chciałbyś dzisiaj przygotować?",
  sv: "Vilket recept skulle du vilja förbereda idag?",
  hu: "Milyen receptet szeretnél ma elkészíteni?",
  ar: "ما هو الوصفة التي ترغب في إعدادها اليوم؟",
  hi: "आप आज कौन सी रेसिपी तैयार करना चाहेंगे?",
  el: "Ποια συνταγή θα θέλατε να προετοιμάσετε σήμερα;",
  nl: "Welk recept wilt u vandaag bereiden?",
  sl: "Kateri recept bi radi pripravili danes?"
};


const placeholders = {
  en: "Type here for example Recipe with chicken...",
  es: "Escribe aquí por ejemplo Receta con pollo...",
  de: "Schreiben Sie hier zum Beispiel Rezept mit Hühnchen...",
  fr: "Écrivez ici par exemple Recette avec du poulet...",
  it: "Scrivi qui per esempio Ricetta con pollo...",
  tr: "Örnek olarak Tavuklu bir tarif yazın...",
  pt: "Digite aqui por exemplo Receita com frango...",
  ru: "Напишите здесь, например, Рецепт с курицей...",
  ja: "こちらに例として鶏肉のレシピを入力してください...",
  zh: "在此输入例如用鸡肉做的食谱...",
  pl: "Wpisz tutaj na przykład Przepis z kurczakiem...",
  sv: "Skriv här till exempel Recept med kyckling...",
  hu: "Írja be ide például Csirkehúsos receptet...",
  ar: "اكتب هنا مثلاً وصفة بالدجاج...",
  hi: "यहाँ उदाहरण के लिए चिकन के साथ रेसिपी लिखें।",
  el: "Πληκτρολογήστε εδώ για παράδειγμα Συνταγή με κοτόπουλο...",
  nl: "Typ hier bijvoorbeeld Recept met kip...",
  sl: "Vpišite tukaj na primer Recept s piščancem..."
};



const sendTranslations = {
  en: "Ask the Bot",
  es: "Pregunta al Bot",
  de: "Fragen Sie den Bot",
  fr: "Demander au Bot",
  it: "Chiedere al Bot",
  tr: "Bot'a Sor",
  pt: "Perguntar ao Bot",
  ru: "Спросить у бота",
  zh: "向机器人提问",
  ja: "ボットに尋ねる",
  pl: "Zapytać Bota",
  sv: "Fråga Boten",
  hu: "Kérdezze meg a Bót",
  ar: "اسأل البوت",
  hi: "बॉट से पूछें",
  el: "Ρωτήστε το Ρομπότ",
  nl: "Vraag de Bot",
  sl: "Vprašajte Bota"

};

const greetingsTranslations = {
  en: '',
  es: '',
  de: '',
  fr: '',
  it: '',
  tr: '',
  pt: '',
  ru: '',
  ja: '',
  zh: '',
  pl: '',
  sv: '',
  hu: '',
  ar: '',
  hi: '',
  el: '',
  nl: '',
  sl: ''
};

const loadingTranslations = {
  en: ['PREPARING THE RECIPE, ONE MOMENT...'],
  es: ['PREPARANDO LA RECETA, UN MOMENTO...'],
  de: ['REZEPT WIRD VORBEREITET, EINEN MOMENT...'],
  fr: ['PRÉPARATION DE LA RECETTE, UN INSTANT...'],
  it: ['PREPARAZIONE DELLA RICETTA, UN ATTIMO...'],
  tr: ['TARİF HAZIRLANIYOR, BİR DAKİKA...'],
  pt: ['PREPARANDO A RECEITA, UM MOMENTO...'],
  ru: ['ПРИГОТОВЛЕНИЕ РЕЦЕПТА, МОМЕНТ...'],
  ja: ['レシピを準備中、少々お待ちください...'],
  zh: ['正在准备食谱，稍等一下...'],
  pl: ['PRZYGOTOWYWANIE PRZEPISU, CHWILĘ...'],
  sv: ['FÖRBEREDER RECEPTET, ETT ÖGONBLICK...'],
  hu: ['RECEPT ELŐKÉSZÍTÉSE, EGY PILLANAT...'],
  ar: ['تحضير الوصفة، لحظة واحدة...'],
  hi: ['रेसिपी तैयार की जा रही है, एक पल...'],
  el: ['ΠΡΟΕΤΟΙΜΑΣΙΑ ΤΗΣ ΣΥΝΤΑΓΉΣ, ΛΊΓΟ...'],
  nl: ['RECEPT AAN HET VOORBEREIDEN, EEN MOMENT...'],
  sl: ['PRIPRAVA RECEPTA, TRENUTEK...']
};




const suscribeButtonTranslations = {
  en: ['Subscribe to create your recipes'],
  es: ['Suscríbete para crear tus recetas'],
  de: ['Abonniere, um deine rezepte zu erstellen'],
  fr: ['Abonnez-vous pour créer vos recettes'],
  it: ['Abbonati per creare le tue ricette'],
  tr: ['Tariflerini oluşturmak için abone ol'],
  pt: ['Assine para criar suas receitas'],
  ru: ['Подпишитесь, чтобы создать свои рецепты'],
  ja: ['レシピを作成するために購読してください'],
  zh: ['订阅以创建您的食谱'],
  pl: ['Zasubskrybuj, aby tworzyć swoje przepisy'],
  sv: ['Prenumerera för att skapa dina recept'],
  hu: ['Iratkozz fel a receptjeid létrehozásához'],
  ar: ['اشترك لإنشاء وصفاتك الخاصة'],
  hi: ['अपनी रेसिपी बनाने के लिए सदस्यता लें'],
  el: ['Εγγραφείτε για να δημιουργήσετε τις συνταγές σας'],
  nl: ['Abonneer om je recepten te maken'],
  sl: ['Naroči se, da ustvariš svoje recepte']
};


const shareButtonTranslations = {
  en: "Share",
  es: "Compartir",
  de: "Teilen",
  fr: "Partager",
  it: "Condividi",
  tr: "Paylaş",
  pt: "Compartilhar",
  ru: "Поделиться",
  ja: "共有",
  zh: "分享",
  pl: "Udostępnij",
  sv: "Dela",
  hu: "Megosztás",
  ar: "مشاركة",
  hi: "साझा करें",
  el: "Κοινοποίηση",
  nl: "Delen",
  sl: "Deli"
};


const shareButtonTranslationse = {
  en: "Save Shopping List",
  es: "Guardar lista de la compra",
  de: "Einkaufsliste speichern",
  fr: "Enregistrer la liste de courses",
  it: "Salva la lista della spesa",
  tr: "Alışveriş listesini Kaydet",
  pt: "Salvar lista de compras",
  ru: "Сохранить список покупок",
  ja: "買い物リストを保存",
  zh: "保存购物清单",
  pl: "Zapisz listę zakupów",
  sv: "Spara inköpslista",
  hu: "Bevásárlólista mentése",
  ar: "حفظ قائمة التسوق",
  hi: "खरीदारी सूची सहेजें",
  el: "Αποθήκευση λίστας αγορών",
  nl: "Winkel lijst opslaan",
  sl: "Shrani nakupovalni seznam"
};
const toggleChipsTranslations = {
  en: "Examples",
  es: "Ejemplos",
  fr: "Exemples",
  de: "Beispiele",
  it: "Esempi",
  tr: "Örnekler",
  pt: "Exemplos",
  ru: "Примеры",
  ja: "例",
  zh: "示例",
  pl: "Przykłady",
  sv: "Exempel",
  hu: "Példák",
  ar: "أمثلة",
  hi: "उदाहरण",
  el: "Παραδείγματα",
};


const toggleChipsTranslationsHome = {
  en: "Favorites",
  es: "Favoritos",
  fr: "Favoris",
  de: "Favoriten",
  it: "Preferiti",
  tr: "Favoriler",
  pt: "Favoritos",
  ru: "Избранное",
  ja: "お気に入り",
  zh: "收藏夹",
  pl: "Ulubione",
  sv: "Favoriter",
  hu: "Kedvencek",
  ar: "المفضلة",
  hi: "पसंदीदा",
  el: "Αγαπημένα",
};

const recetaButtonTranslations = {
  en: "Recipe",
  es: "Receta",
  fr: "Recette",
  de: "Rezept",
  it: "Ricetta",
  tr: "Tarif",
  pt: "Receita",
  ru: "Рецепт",
  ja: "レシピ",
  zh: "食谱",
  pl: "Przepis",
  sv: "Recept",
  hu: "Recept",
  ar: "وصفة",
  hi: "रेसिपी",
  el: "Συνταγή",
};


const translations = {
  en: {
    untitledRecipe: "Untitled Recipe",
    addToFavorites: "Add to Favorites",
    favorites: "Favorites",
    noFavorites: "You have no favorite recipes."
  },
  es: {
    untitledRecipe: "Receta sin título",
    addToFavorites: "Añadir a favoritos",
    favorites: "Favoritos",
    noFavorites: "No tienes recetas favoritas."
  },
  de: {
    untitledRecipe: "Unbenanntes Rezept",
    addToFavorites: "Zu Favoriten hinzufügen",
    favorites: "Favoriten",
    noFavorites: "Sie haben keine Lieblingsrezepte."
  },
  fr: {
    untitledRecipe: "Recette sans titre",
    addToFavorites: "Ajouter aux favoris",
    favorites: "Favoris",
    noFavorites: "Vous n'avez aucune recette favorite."
  },
  it: {
    untitledRecipe: "Ricetta senza titolo",
    addToFavorites: "Aggiungi ai preferiti",
    favorites: "Preferiti",
    noFavorites: "Non hai ricette preferite."
  },
  pt: {
    untitledRecipe: "Receita sem título",
    addToFavorites: "Adicionar aos favoritos",
    favorites: "Favoritos",
    noFavorites: "Você não tem receitas favoritas."
  },
  tr: {
    untitledRecipe: "Başlıksız Tarif",
    addToFavorites: "Favorilere Ekle",
    favorites: "Favoriler",
    noFavorites: "Favori tarifiniz yok."
  },
  ru: {
    untitledRecipe: "Без названия",
    addToFavorites: "Добавить в избранное",
    favorites: "Избранное",
    noFavorites: "У вас нет избранных рецептов."
  },
  ja: {
    untitledRecipe: "無題のレシピ",
    addToFavorites: "お気に入りに追加",
    favorites: "お気に入り",
    noFavorites: "お気に入りのレシピがありません。"
  },
  zh: {
    untitledRecipe: "无标题食谱",
    addToFavorites: "添加到收藏夹",
    favorites: "收藏夹",
    noFavorites: "您没有收藏的食谱。"
  },
  pl: {
    untitledRecipe: "Przepis bez tytułu",
    addToFavorites: "Dodaj do ulubionych",
    favorites: "Ulubione",
    noFavorites: "Nie masz ulubionych przepisów."
  },
  sv: {
    untitledRecipe: "Otitelat recept",
    addToFavorites: "Lägg till i favoriter",
    favorites: "Favoriter",
    noFavorites: "Du har inga favorit recept."
  },
  hu: {
    untitledRecipe: "Cím nélküli recept",
    addToFavorites: "Hozzáadás a kedvencekhez",
    favorites: "Kedvencek",
    noFavorites: "Nincsenek kedvenc receptjeid."
  },
  ar: {
    untitledRecipe: "وصفة بدون عنوان",
    addToFavorites: "أضف إلى المفضلة",
    favorites: "المفضلة",
    noFavorites: "ليس لديك وصفات مفضلة."
  },
  hi: {
    untitledRecipe: "शीर्षकहीन रेसिपी",
    addToFavorites: "पसंदीदा में जोड़ें",
    favorites: "पसंदीदा",
    noFavorites: "आपके पास कोई पसंदीदा रेसिपी नहीं है।"
  },
  el: {
    untitledRecipe: "Συνταγή χωρίς τίτλο",
    addToFavorites: "Προσθήκη στα αγαπημένα",
    favorites: "Αγαπημένα",
    noFavorites: "Δεν έχετε αγαπημένες συνταγές."
  },
  nl: {
    untitledRecipe: "Naamloze Recept",
    addToFavorites: "Toevoegen aan favorieten",
    favorites: "Favorieten",
    noFavorites: "Je hebt geen favoriete recepten."
  },
  sl: {
    untitledRecipe: "Neimenovan recept",
    addToFavorites: "Dodaj v priljubljene",
    favorites: "Priljubljene",
    noFavorites: "Nimate priljubljenih receptov."
  }
};


const clearButtonTranslations = {
  en: "Clear Chat",
  es: "Limpiar Chat",
  de: "Chat löschen",
  fr: "Effacer le chat",
  it: "Pulisci chat",
  tr: "Sohbeti Temizle",
  pt: "Limpar Chat",
  ru: "Очистить чат",
  ja: "チャットをクリア",
  zh: "清除聊天",
  pl: "Wyczyść czat",
  sv: "Rensa chatt",
  hu: "Csevegés törlése",
  ar: "مسح الدردشة",
  hi: "चैट साफ करें",
  el: "Καθαρισμός συνομιλίας",
  nl: "Chat wissen",
  sl: "Počisti klepet"
};


const labelMappings = {
  en: {
    recipe: /Recipe:\s*(.*)/i,
    ingredients: /Ingredients:\s*([\s\S]*?)\n\n/i,
    preparation: /Preparation:\s*([\s\S]*?)\n\n/i,
    shoppingList: /Shopping List:\s*([\s\S]*?)(?:\n\n|$)/i,
    untitledRecipe: translations.en.untitledRecipe,
  },
  es: {
    recipe:/Receta:\s*(.*)/i,
    ingredients: /Ingredientes:\s*([\s\S]*?)\n\n/i,
    preparation: /Preparación:\s*([\s\S]*?)\n\n/i,
    shoppingList:  /Lista de la compra:\s*([\s\S]*?)(?:\n\n|$)/i,
    untitledRecipe: translations.es.untitledRecipe,
  },
  de: {
    recipe: /Rezept:\s*(.*)/i,
    ingredients: /Zutaten:\s*([\s\S]*?)\n\n/i,
    preparation: /Zubereitung:\s*([\s\S]*?)\n\n/i,
    shoppingList: /Einkaufsliste:\s*([\s\S]*?)(?:\n\n|$)/i,
    untitledRecipe: translations.de.untitledRecipe,
  },
  fr: {
    recipe: /Recette:\s*(.*)/i,
    ingredients: /Ingrédients:\s*([\s\S]*?)\n\n/i,
    preparation: /Préparation:\s*([\s\S]*?)\n\n/i,
    shoppingList: /Liste de courses:\s*([\s\S]*?)(?:\n\n|$)/i,
    untitledRecipe: translations.fr.untitledRecipe,
  },
  it: {
    recipe: /Ricetta:\s*(.*)/i,
    ingredients: /Ingredienti:\s*([\s\S]*?)\n\n/i,
    preparation: /Preparazione:\s*([\s\S]*?)\n\n/i,
    shoppingList: /Lista della spesa:\s*([\s\S]*?)(?:\n\n|$)/i,
    untitledRecipe: translations.it.untitledRecipe,
  },
  tr: {
    recipe: /Tarif:\s*(.*)/i,
    ingredients: /Malzemeler:\s*([\s\S]*?)\n\n/i,
    preparation: /Hazırlık:\s*([\s\S]*?)\n\n/i,
    shoppingList: /Alışveriş Listesi:\s*([\s\S]*?)(?:\n\n|$)/i,
    untitledRecipe: translations.tr.untitledRecipe,
  },
  pt: {
    recipe: /Receita:\s*(.*)/i,
    ingredients: /Ingredientes:\s*([\s\S]*?)\n\n/i,
    preparation: /Preparação:\s*([\s\S]*?)\n\n/i,
    shoppingList: /Lista de compras:\s*([\s\S]*?)(?:\n\n|$)/i,
    untitledRecipe: translations.pt.untitledRecipe,
  },
  ru: {
    recipe: /Рецепт:\s*(.*)/i,
    ingredients: /Ингредиенты:\s*([\s\S]*?)\n\n/i,
    preparation: /Приготовление:\s*([\s\S]*?)\n\n/i,
    shoppingList: /Список покупок:\s*([\s\S]*?)(?:\n\n|$)/i,
    untitledRecipe: translations.ru.untitledRecipe,
  },
  ja: {
    recipe: /レシピ:\s*(.*)/i,
    ingredients: /材料:\s*([\s\S]*?)\n\n/i,
    preparation: /調理:\s*([\s\S]*?)\n\n/i,
    shoppingList: /買い物リスト:\s*([\s\S]*?)(?:\n\n|$)/i,
    untitledRecipe: translations.ja.untitledRecipe,
  },
  zh: {
    recipe: /食谱:\s*(.*)/i,
    ingredients: /材料:\s*([\s\S]*?)\n\n/i,
    preparation: /准备:\s*([\s\S]*?)\n\n/i,
    shoppingList: /购物清单:\s*([\s\S]*?)(?:\n\n|$)/i,
    untitledRecipe: translations.zh.untitledRecipe,
  },
  pl: {
    recipe: /Przepis:\s*(.*)/i,
    ingredients: /Składniki:\s*([\s\S]*?)\n\n/i,
    preparation: /Przygotowanie:\s*([\s\S]*?)\n\n/i,
    shoppingList: /Lista zakupów:\s*([\s\S]*?)(?:\n\n|$)/i,
    untitledRecipe: translations.pl.untitledRecipe,
  },
  sv: {
    recipe: /Recept:\s*(.*)/i,
    ingredients: /Ingredienser:\s*([\s\S]*?)\n\n/i,
    preparation: /Förberedelse:\s*([\s\S]*?)\n\n/i,
    shoppingList: /Inköpslista:\s*([\s\S]*?)(?:\n\n|$)/i,
    untitledRecipe: translations.sv.untitledRecipe,
  },
  hu: {
    recipe: /Recept:\s*(.*)/i,
    ingredients: /Hozzávalók:\s*([\s\S]*?)\n\n/i,
    preparation: /Elkészítés:\s*([\s\S]*?)\n\n/i,
    shoppingList: /Bevásárlólista:\s*([\s\S]*?)(?:\n\n|$)/i,
    untitledRecipe: translations.hu.untitledRecipe,
  },
  ar: {
    recipe: /وصفة:\s*(.*)/i,
    ingredients: /مكونات:\s*([\s\S]*?)\n\n/i,
    preparation: /تحضير:\s*([\s\S]*?)\n\n/i,
    shoppingList: /قائمة التسوق:\s*([\s\S]*?)(?:\n\n|$)/i,
    untitledRecipe: translations.ar.untitledRecipe,
  },
  hi: {
    recipe: /रेसिपी:\s*(.*)/i,
    ingredients: /सामग्री:\s*([\s\S]*?)\n\n/i,
    preparation: /तैयारी:\s*([\s\S]*?)\n\n/i,
    shoppingList: /खरीदारी सूची:\s*([\s\S]*?)(?:\n\n|$)/i,
    untitledRecipe: translations.hi.untitledRecipe,
  },
  el: {
    recipe: /Συνταγή:\s*(.*)/i,
    ingredients: /Υλικά:\s*([\s\S]*?)\n\n/i,
    preparation: /Προετοιμασία:\s*([\s\S]*?)\n\n/i,
    shoppingList: /Λίστα Αγορών:\s*([\s\S]*?)(?:\n\n|$)/i,
    untitledRecipe: translations.el.untitledRecipe,
  },
  nl: {
    recipe: /Recept:\s*(.*)/i,
    ingredients: /Ingrediënten:\s*([\s\S]*?)\n\n/i,
    preparation: /Voorbereiding:\s*([\s\S]*?)\n\n/i,
    shoppingList: /Boodschappenlijst:\s*([\s\S]*?)(?:\n\n|$)/i,
    untitledRecipe: translations.nl.untitledRecipe,
  },
  sl: {
    recipe: /Recept:\s*(.*)/i,
    ingredients: /Sestavine:\s*([\s\S]*?)\n\n/i,
    preparation: /Priprava:\s*([\s\S]*?)\n\n/i,
    shoppingList: /Seznam nakupov:\s*([\s\S]*?)(?:\n\n|$)/i,
    untitledRecipe: translations.sl.untitledRecipe,
  },
};

const getSystemPrompt = (language) => {
  const prompts = {
    en: 'You are an expert in creating food recipes for people. Respond in the language that is requested. Provide the recipes in the following format and always create a shopping list:\n\nRecipe: [Recipe Name]\n\nIngredients:\n- [Ingredient 1]\n- [Ingredient 2]\n...\n\nPreparation:\n[Preparation steps]\n\nShopping List:\n- [Ingredient 1]\n- [Ingredient 2]\n...',
    es: 'Eres un experto en crear recetas de comidas para personas. Responde en el idioma que se te pregunte. Proporciona las recetas en el siguiente formato y siempre crea una lista de la compra:\n\nReceta: [Nombre de la receta]\n\nIngredientes:\n- [Ingrediente 1]\n- [Ingrediente 2]\n...\n\nPreparación:\n[Pasos de preparación]\n\nLista de la compra:\n- [Ingrediente 1]\n- [Ingrediente 2]\n...',
    de: 'Sie sind ein Experte in der Erstellung von Rezepten für Menschen. Antworten Sie in der gewünschten Sprache. Geben Sie die Rezepte im folgenden Format an und erstellen Sie immer eine Einkaufsliste:\n\nRezept: [Rezeptname]\n\nZutaten:\n- [Zutat 1]\n- [Zutat 2]\n...\n\nZubereitung:\n[Zubereitungsschritte]\n\nEinkaufsliste:\n- [Zutat 1]\n- [Zutat 2]\n...',
    fr: 'Vous êtes un expert dans la création de recettes de cuisine pour les gens. Répondez dans la langue demandée. Fournissez les recettes dans le format suivant et créez toujours une liste de courses :\n\nRecette : [Nom de la recette]\n\nIngrédients :\n- [Ingrédient 1]\n- [Ingrédient 2]\n...\n\nPréparation :\n[Étapes de préparation]\n\nListe de courses :\n- [Ingrédient 1]\n- [Ingrédient 2]\n...',
    it: 'Sei un esperto nella creazione di ricette per le persone. Rispondi nella lingua richiesta. Fornisci le ricette nel seguente formato e crea sempre una lista della spesa:\n\nRicetta: [Nome della ricetta]\n\nIngredienti:\n- [Ingrediente 1]\n- [Ingrediente 2]\n...\n\nPreparazione:\n[Passaggi di preparazione]\n\nLista della spesa:\n- [Ingrediente 1]\n- [Ingrediente 2]\n...',
    pt: 'Você é um especialista em criar receitas para as pessoas. Responda no idioma solicitado. Forneça as receitas no seguinte formato e sempre crie uma lista de compras:\n\nReceita: [Nome da receita]\n\nIngredientes:\n- [Ingrediente 1]\n- [Ingrediente 2]\n...\n\nPreparo:\n[Passos de preparo]\n\nLista de compras:\n- [Ingrediente 1]\n- [Ingrediente 2]\n...',
    tr: 'İnsanlar için yemek tarifleri oluşturma konusunda uzmansınız. İstenilen dilde yanıt verin. Tarifleri aşağıdaki formatta sağlayın ve her zaman bir alışveriş listesi oluşturun:\n\nTarif: [Tarif Adı]\n\nMalzemeler:\n- [Malzeme 1]\n- [Malzeme 2]\n...\n\nHazırlık:\n[Hazırlık adımları]\n\nAlışveriş Listesi:\n- [Malzeme 1]\n- [Malzeme 2]\n...',
    ru: 'Вы — эксперт по созданию рецептов блюд для людей. Ответьте на запрашиваемом языке. Предоставьте рецепты в следующем формате и всегда составляйте список покупок:\n\nРецепт: [Название рецепта]\n\nИнгредиенты:\n- [Ингредиент 1]\n- [Ингредиент 2]\n...\n\nПриготовление:\n[Шаги приготовления]\n\nСписок покупок:\n- [Ингредиент 1]\n- [Ингредиент 2]\n...',
    ja: 'あなたは人々のために料理レシピを作成する専門家です。リクエストされた言語で回答してください。以下の形式でレシピを提供し、常に買い物リストを作成してください。\n\nレシピ：[レシピ名]\n\n材料:\n- [材料 1]\n- [材料 2]\n...\n\n準備:\n[準備手順]\n\n買い物リスト:\n- [材料 1]\n- [材料 2]\n...',
    zh: '您是为人们创建食谱的专家。请以请求的语言作答。提供以下格式的食谱，并始终创建购物清单：\n\n食谱：[食谱名称]\n\n食材:\n- [食材 1]\n- [食材 2]\n...\n\n制作方法:\n[制作步骤]\n\n购物清单:\n- [食材 1]\n- [食材 2]\n...',
    pl: 'Jesteś ekspertem w tworzeniu przepisów kulinarnych dla ludzi. Odpowiadaj w języku, który jest wymagany. Podaj przepisy w następującym formacie i zawsze twórz listę zakupów:\n\nPrzepis: [Nazwa przepisu]\n\nSkładniki:\n- [Składnik 1]\n- [Składnik 2]\n...\n\nPrzygotowanie:\n[Kroki przygotowania]\n\nLista zakupów:\n- [Składnik 1]\n- [Składnik 2]\n...',
    sv: 'Du är expert på att skapa matrecept för människor. Svara på det språk som efterfrågas. Tillhandahåll recepten i följande format och skapa alltid en inköpslista:\n\nRecept: [Receptnamn]\n\nIngredienser:\n- [Ingrediens 1]\n- [Ingrediens 2]\n...\n\nFörberedelse:\n[Förberedelsesteg]\n\nInköpslista:\n- [Ingrediens 1]\n- [Ingrediens 2]\n...',
    hu: 'Szakértő vagy az ételek receptjeinek létrehozásában emberek számára. Válaszolj a kért nyelven. A recepteket az alábbi formátumban adja meg, és mindig készítsen bevásárlólistát:\n\nRecept: [Recept neve]\n\nHozzávalók:\n- [Hozzávaló 1]\n- [Hozzávaló 2]\n...\n\nElkészítés:\n[Elkészítési lépések]\n\nBevásárlólista:\n- [Hozzávaló 1]\n- [Hozzávaló 2]\n...',
    ar: 'أنت خبير في إنشاء وصفات الطعام للناس. أجب باللغة المطلوبة. قدّم الوصفات بالتنسيق التالي وأنشئ دائمًا قائمة مشتريات:\n\nوصفة: [اسم الوصفة]\n\nالمكونات:\n- [المكون 1]\n- [المكون 2]\n...\n\nالتحضير:\n[خطوات التحضير]\n\nقائمة المشتريات:\n- [المكون 1]\n- [المكون 2]\n...',
    hi: 'आप लोगों के लिए खाद्य व्यंजनों के निर्माण में विशेषज्ञ हैं। अनुरोधित भाषा में उत्तर दें। निम्नलिखित प्रारूप में व्यंजनों को प्रदान करें और हमेशा एक खरीदारी सूची बनाएं:\n\nरेसिपी: [रेसिपी का नाम]\n\nसामग्री:\n- [सामग्री 1]\n- [सामग्री 2]\n...\n\nतैयारी:\n[तैयारी के चरण]\n\nखरीदारी सूची:\n- [सामग्री 1]\n- [सामग्री 2]\n...',
    el: 'Είστε ειδικός στη δημιουργία συνταγών για φαγητό για τους ανθρώπους. Απαντήστε στη ζητούμενη γλώσσα. Παρέχετε τις συνταγές στην ακόλουθη μορφή και δημιουργήστε πάντα μια λίστα αγορών:\n\nΣυνταγή: [Όνομα συνταγής]\n\nΣυστατικά:\n- [Συστατικό 1]\n- [Συστατικό 2]\n...\n\nΠροετοιμασία:\n[Βήματα προετοιμασίας]\n\nΛίστα αγορών:\n- [Συστατικό 1]\n- [Συστατικό 2]\n...',
    nl: 'Je bent een expert in het maken van recepten voor mensen. Beantwoord in de gevraagde taal. Geef de recepten in het volgende formaat en maak altijd een boodschappenlijst:\n\nRecept: [Naam van het recept]\n\nIngrediënten:\n- [Ingrediënt 1]\n- [Ingrediënt 2]\n...\n\nBereiding:\n[Bereidingsstappen]\n\nBoodschappenlijst:\n- [Ingrediënt 1]\n- [Ingrediënt 2]\n...',
    sl: 'Ste strokovnjak za ustvarjanje receptov za ljudi. Odgovorite v zahtevanem jeziku. Recepti naj bodo v naslednji obliki in vedno ustvarite nakupovalni seznam:\n\nRecept: [Ime recepta]\n\nSestavine:\n- [Sestavina 1]\n- [Sestavina 2]\n...\n\nPriprava:\n[Koraki priprave]\n\nNakupovalni seznam:\n- [Sestavina 1]\n- [Sestavina 2]\n...',
  };
  return prompts[language] || prompts['en'];
};



const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
const limitedDogRecep = (DogRecep[deviceLanguage] || DogRecep['en']).slice(0, 100);

const greetingMessage = greetingsTranslations[deviceLanguage] || greetingsTranslations['en'];
const currentDogRecep = DogRecep[deviceLanguage] || DogRecep['en'];
const [currentLoadingImage] = useState(new Animated.Value(0));
const [currentImageIndex, setCurrentImageIndex] = useState(0);

const [loadingMessage, setLoadingMessage] = useState(
  loadingTranslations[deviceLanguage] ? 
  loadingTranslations[deviceLanguage][0] : 
  loadingTranslations['en'][0]
);

useEffect(() => {
  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('@favorites');
      if (storedFavorites !== null) {
        const parsedFavorites = JSON.parse(storedFavorites);
        if (Array.isArray(parsedFavorites)) {
          // Filtrar elementos nulos o sin 'recipeName'
          const validFavorites = parsedFavorites.filter(item => {
            if (item && item.recipeName) {
              return true;
            } else {
              console.warn('Elemento inválido en favoritos:', item);
              return false;
            }
          });
          setFavorites(validFavorites);
        } else {
          console.warn('Los favoritos almacenados no son un array.');
          setFavorites([]);
        }
      }
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
    }
  };

  loadFavorites();
}, []);

// Agregar una receta a favoritos
const addToFavorites = async (recipe) => {
  if (!recipe || !recipe.recipeName) {
    console.error('Receta inválida. No se puede agregar a favoritos.');
    return;
  }

  try {
    // Filtrar elementos inválidos antes de realizar la verificación
    const validFavorites = favorites.filter(item => item && item.recipeName);

    // Verificar si la receta ya está en favoritos
    const isAlreadyFavorite = validFavorites.some(
      item => item.recipeName === recipe.recipeName
    );

    if (isAlreadyFavorite) {
      console.log('La receta ya está en favoritos.');
      return;
    }

    // Agregar la nueva receta
    const updatedFavorites = [recipe, ...validFavorites];
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem('@favorites', JSON.stringify(updatedFavorites));
    console.log('Receta agregada a favoritos:', recipe.recipeName);
  } catch (error) {
    console.error('Error al agregar a favoritos:', error);
  }
};


// Eliminar una receta de favoritos
const removeFromFavorites = async (recipeName) => {
try {
  const updatedFavorites = favorites.filter(item => item.recipeName !== recipeName);
  setFavorites(updatedFavorites);
  await AsyncStorage.setItem('@favorites', JSON.stringify(updatedFavorites));
  console.log('Receta eliminada de favoritos:', recipeName);
} catch (error) {
  console.error('Error al eliminar de favoritos:', error);
}
};


const loadingImages = [
  require('../assets/images/ai-technology.png'),
  require('../assets/images/ai-technology2.png'),
  require('../assets/images/ai-technology3.png'),
  // ... otras imágenes locales
];


useEffect(() => {
  let isMounted = true;

  const animate = () => {
    setTimeout(() => {
      if (isMounted) {
        setCurrentImageIndex(prevIndex => {
          const newIndex = (prevIndex + 1) % loadingImages.length;
          setLoadingMessage(
            loadingTranslations[deviceLanguage]
              ? loadingTranslations[deviceLanguage][newIndex]
              : loadingTranslations['en'][newIndex]
          );
          return newIndex; // Actualiza el índice de imagen
        });

        // Reinicia la animación de opacidad con una duración más lenta
        Animated.timing(currentLoadingImage, {
          toValue: 1,
          duration: 1500, // Aumenta a 1500 ms para hacer la aparición más lenta
          useNativeDriver: true,
        }).start(() => {
          Animated.timing(currentLoadingImage, {
            toValue: 0,
            duration: 1500, // Aumenta a 1500 ms para hacer la desaparición más lenta
            useNativeDriver: true,
          }).start(() => {
            if (isMounted) animate(); // Llama a la animación en bucle
          });
        });
      }
    }, 500); // Cambia cada medio segundo
  };

  animate();

  return () => {
    isMounted = false;
    currentLoadingImage.stopAnimation();
  };
}, []);




const handleScroll = (e) => {
  const yOffset = e.nativeEvent.contentOffset.y;
  setIsScrolling(yOffset > 50);  // Ajusta este valor según tus necesidades
};





const getGPTResponse = async (userMessage, chatLog = [], selectedModel = 'gpt-4o') => {
  // Añadir el nuevo mensaje del usuario al final de chatLog
  const fullConversation = [
    ...chatLog,
    { role: 'user', message: userMessage }
  ];

  // Si la conversación está vacía, agregar el prompt inicial.
  if (fullConversation.length === 1) {
    fullConversation.unshift({
      role: 'system',
      message: getSystemPrompt(deviceLanguage),
    });
  }

  // Solo toma los últimos 10 mensajes para evitar exceder el límite de tokens
  const recentMessages = fullConversation.slice(-10).map(item => {
    // Cambiar 'bot' por 'assistant' cuando el rol es 'bot'
    if (item.role === 'bot') {
      item.role = 'assistant';
    }
    return item;
  });

  const apiUrl = process.env.GPT_API_URL || "https://api.openai.com/v1/chat/completions";

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.API_KEY_CHAT}`
    },
    body: JSON.stringify({
      model: selectedModel,
      messages: recentMessages.map(item => ({
        role: item.role,
        content: item.message
      })),
      max_tokens: 800
    })
  };

  try {
    const response = await fetch(apiUrl, requestOptions);
    const result = await response.json();

    if (response.ok && result.choices && result.choices[0] && result.choices[0].message) {
      let cleanedResponse = result.choices[0].message.content.trim();

      // Extraer lista de la compra y nombre de la receta
      const extractRecipeNameAndShoppingList = (responseText, language) => {
        const labels = labelMappings[language] || labelMappings['en']; // Por defecto, inglés
      
        // Extraer el nombre de la receta
        const recipeNameMatch = responseText.match(labels.recipe);
        const recipeName = recipeNameMatch 
          ? recipeNameMatch[1].trim() 
          : (translations[language]?.untitledRecipe || labels.untitledRecipe);
      
        // Extraer la lista de la compra
        const shoppingListMatch = responseText.match(labels.shoppingList);
        const shoppingListText = shoppingListMatch ? shoppingListMatch[1].trim() : null;
      
        // Convertir la lista de la compra en un arreglo
        let shoppingList = [];
        if (shoppingListText) {
          shoppingList = shoppingListText.split('\n').map(item => item.replace(/^-+\s*/, '').trim());
        }
      
        console.log(`Lista de la compra extraída para ${recipeName}:`, shoppingList);
        return { recipeName, shoppingList };
      };
      
      
      const { recipeName, shoppingList } = extractRecipeNameAndShoppingList(cleanedResponse, deviceLanguage);

      // Actualizar el estado de las listas de la compra
      const newShoppingList = { recipeName, shoppingList };
      setShoppingLists(prevLists => {
        const updatedLists = [newShoppingList, ...prevLists];
        // Guardar en AsyncStorage
        AsyncStorage.setItem('@shopping_lists', JSON.stringify(updatedLists))
          .catch(error => console.error('Error al guardar en AsyncStorage:', error));
        return updatedLists;
      });

      // Si la respuesta se ha acercado al límite de tokens, añadir "..."
      if (result.usage && result.usage.total_tokens >= 350 * 0.90) {
        cleanedResponse += "...";
      }

      return cleanedResponse;
    } else {
      throw new Error(result.error || "Unexpected API response format");
    }
  } catch (error) {
    console.error("Error de la API:", error);
    return "Lo siento, no pude procesar tu mensaje, por favor intenta de nuevo.";
  }
};



const saveToHistory = async () => {
    if (isExporting) return; // Evita que se ejecute si ya se está exportando
    setIsExporting(true); // Deshabilita el botón
    setIsFavoritesModalVisible(false)
    try {
      // Obtener la entrada más reciente
      const latestEntry = shoppingLists[0];
      const latestShoppingList = latestEntry?.shoppingList;
      const recipeName = latestEntry?.recipeName || 'Lista sin título';
  
      console.log('Última lista de compras:', latestShoppingList);
  
      if (!latestShoppingList || latestShoppingList.length === 0) {
        console.error("La lista de compras está vacía.");
        setIsExporting(false); // Rehabilita el botón si la lista está vacía
        return;
      }
  
      // Obtener el historial existente
      const existingHistory = await AsyncStorage.getItem('@shopping_history');
      let updatedHistory = existingHistory ? JSON.parse(existingHistory) : [];
  
      // Verificar si la lista ya existe en el historial
      const isDuplicate = updatedHistory.some(
        (item) => JSON.stringify(item.list) === JSON.stringify(latestShoppingList)
      );
  
      if (isDuplicate) {
        console.log("La lista ya existe en el historial.");
        setIsExporting(false); // Rehabilita el botón si es un duplicado
        // Navegar a 'HistoryScreen' de todos modos si así lo deseas
        navigation.navigate('HistoryScreen');
        return;
      }
  
      // Utilizar el nombre de la receta como nombre de la lista
      const newListName = recipeName;
  
      // Agregar la nueva lista al historial
      updatedHistory.push({
        list: latestShoppingList,
        name: newListName,
      });
  
      // Guardar el historial actualizado
      await AsyncStorage.setItem('@shopping_history', JSON.stringify(updatedHistory));
  
      // Actualizar el estado 'history' si es necesario
      setHistory(updatedHistory);
  
      // Cerrar el modal actual (si corresponde)
      setIsModalVisible(false); // Asegúrate de usar el estado correcto

      // Navegar inmediatamente a 'HistoryScreen'
      navigation.navigate('HistoryScreen');
  
      // Mostrar el modal de confirmación (opcional)

      setTimeout(() => {

      }, 2000);
    
    } catch (e) {
      console.error("Error al guardar en el historial: ", e);
    } finally {
      setIsExporting(false); // Rehabilita el botón después de la operación
    }
  };
  


  
const shareBotResponse = async (botMessage) => {
  try {
    await Share.share({
      message: botMessage,
      title: 'Respuesta del Bot' // Opcional, puedes omitirlo si no lo deseas
    });
  } catch (error) {
    console.error("Error compartiendo el mensaje del bot:", error.message);
  }
};



const parseRecipe = (message, deviceLanguage = 'en') => {
  if (!message || typeof message !== 'string') {
    console.error('Mensaje inválido para parsear receta.');
    return null;
  }

  // Obtener las etiquetas correspondientes al idioma actual
  const labels = labelMappings[deviceLanguage] || labelMappings['en']; // Fallback a inglés si el idioma no está soportado

  // Extraer el nombre de la receta
  const recipeNameMatch = message.match(labels.recipe);
  const recipeName = recipeNameMatch
    ? recipeNameMatch[1].trim()
    : (labels.untitledRecipe || labelMappings['en'].untitledRecipe);

  // Extraer los ingredientes
  const ingredientsMatch = message.match(labels.ingredients);
  const ingredientsText = ingredientsMatch ? ingredientsMatch[1].trim() : '';
  const ingredients = ingredientsText
    .split('\n')
    .map(item => item.replace(/^-+\s*/, '').trim())
    .filter(item => item.length > 0);

  // Extraer la preparación
  const preparationMatch = message.match(labels.preparation);
  const preparation = preparationMatch ? preparationMatch[1].trim() : '';

  // Extraer la lista de la compra
  const shoppingListMatch = message.match(labels.shoppingList);
  const shoppingListText = shoppingListMatch ? shoppingListMatch[1].trim() : '';
  const shoppingList = shoppingListText
    .split('\n')
    .map(item => item.replace(/^-+\s*/, '').trim())
    .filter(item => item.length > 0);

  // Validar los datos extraídos
  if (!recipeName || ingredients.length === 0 || !preparation || shoppingList.length === 0) {
    console.error('Datos insuficientes para parsear receta.');
    return null;
  }

  console.log(`Receta parseada:`, { recipeName, ingredients, preparation, shoppingList });
  return { recipeName, ingredients, preparation, shoppingList };
};


return (
  <KeyboardAvoidingView 
  style={{ flex: 1 }} 
  behavior={Platform.OS === "ios" ? "padding" : "height"} 
  keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 500}
>
  
  <ScrollView
    ref={scrollViewRef}
    onScroll={handleScroll}
    scrollEventThrottle={16}
    style={{ flex: 1 }}
    contentContainerStyle={{ flexGrow: 1 }}
  >

    <View style={[styles.modalContainer, isNightMode && styles.nightModeSection]}>
      {isLoading ? (
        <View style={[styles.loadingContainer, styles.centeredContainer]}>
          
          <View style={styles.overlay} />
          <Animated.Image
  source={loadingImages[currentImageIndex]}
  style={[
    styles.loadingImage,
    { opacity: currentLoadingImage },
  ]}
/>

          <Text style={styles.loadingText}>
            {loadingMessage}
          </Text>
        </View>
      ) : (
        <View style={[styles.contentContainer, isNightMode && styles.nightModeSection]}>

            <View style={[
              styles.textContainer,
              isNightMode ? styles.textNightMode : styles.textDayMode,
              styles.marginContainer,
            ]}>

<Slideshow />

              <Text style={styles.text}>
                {placeholdersi[deviceLanguage] || placeholdersi.en}
              </Text>
              <View style={styles.header}>


<ModernButton
        icon="star-outline"
        text={toggleChipsTranslationsHome[deviceLanguage] || toggleChipsTranslationsHome.en}
        onPress={() => setIsFavoritesModalVisible(true)}
        gradientColors={['#4c669f', '#3b5998', '#192f6a']}
      />
      <ModernButton
        icon="list-sharp"
        text={toggleChipsTranslations[deviceLanguage] || toggleChipsTranslations.en}
        onPress={() => setIschipsModalVisible(true)}
        gradientColors={['#4c669f', '#3b5998', '#192f6a']}
      />




</View>
{ !isSubscribed && (
<ModernButton
        icon="diamond"
        text=  {suscribeButtonTranslations[deviceLanguage] || suscribeButtonTranslations.en}
        gradientColors={['#009688', '#3b5998', '#009688']}
        
      />
)}

              </View>
      
            <View style={styles.inputContainer}>
            { isSubscribed && (    
            <TextInput
    style={[
        styles.textInput,
        isNightMode && styles.nightModeInput,
        {
            height: 'auto',
            minHeight: 40, // Asegúrate de tener una altura mínima para que el TextInput no desaparezca cuando esté vacío
            backgroundColor: '#f0ffff00', // Color de fondo (elige el color que prefieras)
            textAlignVertical: 'center', // Centra el texto (y el placeholder) verticalmente
        }
    ]}
    value={inputText}
    onChangeText={setInputText}
    placeholder={placeholders[deviceLanguage] || placeholders.en}
    placeholderTextColor={isNightMode ? 'grey' : 'grey'}
    multiline // Habilita la propiedad multiline
    numberOfLines={4} // Establece un número máximo de líneas, ajusta según sea necesario
/>

)}



{ isSubscribed && (

<TouchableOpacity
  style={[
    styles.button,
    isNightMode && styles.nightModeButton,
    (!inputText.trim()) && styles.disabledButton,
  ]}
  onPress={async () => {
    if (!inputText.trim()) return; // Evita enviar mensajes vacíos

    setIsLoading(true);
    setChipsVisible(false);

    const userMessage = inputText;
    setInputText(''); // Limpia el campo de entrada
    Keyboard.dismiss(); // Cierra el teclado

    // Agregar el mensaje del usuario al chat log
    setChatLog(prevChatLog => [
      ...prevChatLog,
      { role: 'user', message: userMessage }
    ]);

    try {
      const response = await getGPTResponse(userMessage); // Obtiene la respuesta del bot
      const botResponse = { role: 'bot', message: response };
      
      // Agregar la respuesta del bot al chat log
      setChatLog(prevChatLog => [...prevChatLog, botResponse]);

      // Asegúrate de que el ScrollView se desplace hacia abajo
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      }, 100);

    } catch (error) {
      console.error("Error al obtener respuesta:", error);
    } finally {
      setIsLoading(false);
    }
  }}
  disabled={!inputText.trim()}
>
  <Text style={[
    styles.buttonText,
    isNightMode && styles.nightModeButtonText,
    (!inputText.trim()) && styles.disabledButtonText,
  ]}>
    {sendTranslations[deviceLanguage] || sendTranslations.en}
  </Text>
</TouchableOpacity>
          
          )}


          
          </View>
          

          <View style={[styles.chatContainer, isNightMode && styles.nightModeChatContainer]}>
  {chatLog.map((message, index) => (
    <View key={index} style={{ marginBottom: 10 }}>

      {message.role === 'bot' && typeof message.message === 'string' && message.message.trim() !== '' && 
      (locale.languageCode === 'en' || locale.languageCode === 'es') && (
        <View>
  
        </View>
      )}
      
            {/* Mostrar el mensaje del bot o usuario */}
      {typeof message.message === 'string' && (
        <Text
          style={[
            styles.chatMessage,
            message.role === 'bot' ? styles.botMessage : styles.userMessage,
            isNightMode && styles.nightModeChatMessage
          ]}
        >
          {message.role !== 'user' && message.role !== 'bot' ? message.role + ': ' : ''}{message.message}
        </Text>
      )}


{message.role === 'bot' && typeof message.message === 'string' && message.message.trim() !== '' && (
  <TouchableOpacity onPress={saveToHistory} disabled={isExporting} style={styles.exportButton}>
    {isExporting ? (
      <ActivityIndicator size="small" color="#ffffff" />
    ) : (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name="save-outline" size={23} color={isNightMode ? "#ffffff" : "#ffffff"} />
        <Text style={[styles.textShareButtonText, isNightMode && styles.nightModeTextShareButtonText, { marginLeft: 5 }]}>
          {shareButtonTranslationse[deviceLanguage] || shareButtonTranslationse.en}
        </Text>
      </View>
    )}
  </TouchableOpacity>
)}

{message.role === 'bot' && typeof message.message === 'string' && message.message.trim() !== '' && (
 <TouchableOpacity
 style={[styles.exportButton, isNightMode && styles.exportButton]}
 onPress={() => {
  const recipe = parseRecipe(message.message, deviceLanguage);
   if (recipe) {
     addToFavorites(recipe);
     setIsFavoritesModalVisible(true);
   }
 }}
>
<View style={{ flexDirection: 'row', alignItems: 'center' }}>
 <Ionicons name="star-outline" size={23} color={isNightMode ? "#ffffff" : "#ffffff"} />
 <Text style={[styles.textShareButtonText, isNightMode && styles.nightModeTextShareButtonText, { marginLeft: 5 }]}>
   {translations[deviceLanguage]?.addToFavorites || "Agregar a Favoritos"}
 </Text>
 </View>
</TouchableOpacity>

    )}


      {/* Botón para compartir el mensaje del bot */}
      {message.role === 'bot' && typeof message.message === 'string' && message.message.trim() !== '' && (
  <TouchableOpacity
    style={[styles.exportButtone, isNightMode && styles.exportButton]}
    onPress={() => shareBotResponse(message.message)}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Ionicons name="share-outline" size={23} color={isNightMode ? "#ffffff" : "#ffffff"} />
      <Text style={[styles.textShareButtonText, isNightMode && styles.nightModeTextShareButtonText, { marginLeft: 5 }]}>
        {shareButtonTranslations[deviceLanguage] || shareButtonTranslations.en}
      </Text>
    </View>
  </TouchableOpacity>
)}

{/* Botón para limpiar el chat */}
{message.role === 'bot' && typeof message.message === 'string' && message.message.trim() !== '' && (
  <TouchableOpacity
    style={[styles.clearButton, isNightMode && styles.clearButton]}
    onPress={() => setChatLog([])} // Esto limpiará el historial del chat
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Ionicons name="trash-outline" size={23} color={isNightMode ? "#ffffff" : "#ffffff"} />
      <Text style={[styles.textShareButtonText, isNightMode && styles.nightModeTextShareButtonText, { marginLeft: 5 }]}>
        {clearButtonTranslations[deviceLanguage] || clearButtonTranslations.en}
      </Text>
    </View>
  </TouchableOpacity>
)}

      
    </View>
  ))}
          </View>
        </View>
      )}

      {isScrolling && (
        <TouchableOpacity
          onPress={() => {
            if (scrollViewRef.current) {
              scrollViewRef.current.scrollTo({ y: 0, animated: true });
            }
          }}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            backgroundColor: 'blue',
            borderRadius: 30,
            padding: 5
          }}
        >
     <Ionicons name="arrow-up" size={21} color="white" />
        </TouchableOpacity>
      )}

    </View>
    
  </ScrollView>

  <Modal
  visible={chipsModalVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setIschipsModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={[styles.favoritesModal, isNightMode && styles.favoritesModalNightMode]}>
      <View style={styles.modalHeader}>
        <TouchableOpacity onPress={() => setIschipsModalVisible(false)}>
          <Ionicons name="close" size={30} color={isNightMode ? "#000000" : "grey"} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={limitedDogRecep}
        keyExtractor={(item) => item.id}
        numColumns={2} // Configura el FlatList para que muestre 2 columnas
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipListContainer}
        renderItem={({ item }) => {
          // Define la función para manejar el press
          const handlePress = async () => {
            setIsLoading(true);
            setIschipsModalVisible(false);

            const response = await getGPTResponse(item.title);
            setChatLog([{ role: 'bot', message: response }]);
            setIsLoading(false);

            setTimeout(() => {
              if (scrollViewRef.current) {
                scrollViewRef.current.scrollToEnd({ animated: true });
              }
            }, 100);
          };

          return (
            <TouchableOpacity
              style={[styles.chipCard, isNightMode && styles.chipCardNightMode]}
              onPress={handlePress} // Usa handlePress aquí
            >
              <Image source={item.image} style={styles.chipImage} />
              <Text style={[styles.chipTitle, isNightMode && styles.chipTitleNightMode]}>
                {item.title}
              </Text>
              <Text style={[styles.chipDescription, isNightMode && styles.chipDescriptionNightMode]}>
                {item.description}
              </Text>
              <Text style={[styles.chipNutrition, isNightMode && styles.chipNutritionNightMode]}>
                {`Calories: ${item.calories}`}
              </Text>
              <Text style={[styles.chipNutrition, isNightMode && styles.chipNutritionNightMode]}>
                {`Fat: ${item.fat}`}
              </Text>

              {/* Botón de "Receta" que también llama a handlePress */}
              <TouchableOpacity onPress={handlePress} style={styles.recipeButton}>
                <Text style={[styles.textShareButtonText, isNightMode && styles.nightModeTextShareButtonText, { marginLeft: 5 }]}>
                  {recetaButtonTranslations[deviceLanguage] || recetaButtonTranslations.en}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  </View>
</Modal>





  <Modal
  visible={isFavoritesModalVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setIsFavoritesModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={[styles.favoritesModal, isNightMode && styles.favoritesModalNightMode]}>
      <View style={styles.modalHeader}>
        <TouchableOpacity onPress={() => setIsFavoritesModalVisible(false)}>
        <Ionicons name="close" size={30} color={isNightMode ? "#000000" : "grey"} />
        </TouchableOpacity>
      </View>
      {favorites.length === 0 ? (
        <Text style={[styles.noFavoritesText, isNightMode && styles.noFavoritesTextNightMode]}>
          {translations[deviceLanguage]?.noFavorites || "No tienes recetas favoritas."}
        </Text>
      ) : (
<FlatList
  data={favorites}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item }) => {
    if (!item || !item.recipeName) {
      console.warn('Elemento inválido en favoritos:', item);
      return null;
    }

    return (
      <View style={styles.favoriteItem}>
        {/* Título de la Receta */}
        <Text style={[styles.favoriteRecipeName, isNightMode && styles.favoriteRecipeNameNightMode]}>
          {item.recipeName}
        </Text>

        {/* Ingredientes */}
        {item.ingredients && item.ingredients.length > 0 && (
          <View style={styles.ingredientsContainer}>
            <Text style={[styles.sectionTitle, isNightMode && styles.sectionTitleNightMode]}>
            <Ionicons name="cart-outline" size={26} color="grey" />
            </Text>
            {item.ingredients.map((ingredient, idx) => (
              <Text key={idx} style={[styles.ingredientText, isNightMode && styles.ingredientTextNightMode]}>
                - {ingredient}
              </Text>
            ))}
          </View>
          
        )}

        {/* Preparación */}
        {item.preparation && (
          <View style={styles.preparationContainer}>
            <Text style={[styles.sectionTitle, isNightMode && styles.sectionTitleNightMode]}>
            <Ionicons name="information-circle-outline" size={26} color="grey" />
            </Text>
            <Text style={[styles.preparationText, isNightMode && styles.preparationTextNightMode]}>
              {item.preparation}
            </Text>
          </View>
        )}
          <TouchableOpacity onPress={saveToHistory} disabled={isExporting} style={styles.exportButtoisn}>
    {isExporting ? (
      <ActivityIndicator size="small" color="#ffffff" />
    ) : (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
   
        <Text style={[styles.textShareButtonTextes, isNightMode && styles.nightModeTextShareButtonText, { marginLeft: 5 }]}>
          {shareButtonTranslationse[deviceLanguage] || shareButtonTranslationse.en}
        </Text>
      </View>
    )}
  </TouchableOpacity>

        {/* Botón para Eliminar de Favoritos */}
        <TouchableOpacity onPress={() => removeFromFavorites(item.recipeName)} style={styles.removeButton}>
          <Ionicons name="trash-outline" size={20} color="red" />
        </TouchableOpacity>
      </View>
    );
  }}
/>



      )}
    </View>
  </View>
</Modal>

  </KeyboardAvoidingView>
);
};


const getStyles = (theme) => StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: theme.background,
      padding: 5,
      
    },
    contentContainer: {
      borderRadius: 10,  
  
      backgroundColor:'#a5a5a542',
      padding:10,
      paddingBottom:100,
    },
    inputContainer: {
      marginTop: 100,
      padding:19,

    },

  
    buttonText: {
      color: 'white',
      fontFamily: 'Poppins-Regular',
      fontSize:17,
    },
   
  
      smallImage: {
        width: '100%',
        height: 100, // tamaño reducido aún más
        resizeMode: 'cover',
        alignSelf: 'center',
        marginBottom: 10, // espacio debajo de la imagen

      },
  

      button: {
        backgroundColor: '#e91e63',
        padding: 15,
        borderRadius: 50,
        alignItems: 'center',
        marginBottom: 40, // espacio debajo del botón
        top: 5,
        width: '80%', // Asegurándonos de que ocupe toda la anchura
        alignSelf: 'center', // Centrando el botón horizontalmente
      },
      
  
      scrollView: {
        height: 100, // ejemplo de tamaño original
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        marginBottom: 20, // espacio debajo del chat
        borderRadius: 5,

        
      },
  
      largeScrollView: {
        height: 250, // tamaño ampliado
        padding: 20,
        borderWidth: 1,
        borderColor: 'gray',
        marginBottom: 20, // espacio debajo del chat
        borderRadius: 5,
        width: '100%', // Asegurándonos de que ocupe toda la anchura
      },

    chatMessage: {
      marginBottom: 5,
    },

    nightModeSection: {
        backgroundColor: '#333',
      },
      nightModeText: {
        color: '#fff',
      },
      nightModeInput: {
        fontSize: 18,
        color: 'white',
        borderWidth: 1,
        borderColor: 'gray',
      },
      nightModeButton: {
        backgroundColor: '#e91e63',
      },
      nightModeButtonText: {
        color: '#fff',
      },
      nightModeScrollView: {
        backgroundColor: '#444',
      },
      nightModeChatMessage: {
        color: '#fff',
      },
      image: {
        width: '100%',
        height: 300,
        borderRadius: 20,
        marginTop: 60,
    },
    smallImage: {
        width: '100%',
        height: 150,
        alignSelf: 'center', // Asegura que la imagen esté centrada en su contenedor padre
        borderRadius: 20, // Radio de borde redondeado
        resizeMode: 'cover', // Asegura que la imagen se adapte manteniendo su relación de aspecto sin recortes
   
    },
    
    scrollView: {
        height: 150, // ejemplo de tamaño original
        padding:10,
        borderRadius:20,

    },
 
      chatMessage: {
        fontSize: 16, // Tamaño de letra aumentado
        marginBottom: 50, // Espaciado entre mensajes
        padding: 10, // Espaciado interno para que se vea más estético
        borderRadius: 30, // Bordes redondeados
        backgroundColor: 'black', // Color de fondo por defecto para todos los mensajes
    },
    
    userMessage: {
        backgroundColor: '#09bbd2', // Un color azul claro para los mensajes del usuario
        alignSelf: 'flex-end', // Alinear a la derecha
        marginRight: 10, // Margen a la derecha para no ocupar todo el ancho
        borderRadius:20
    },
    
    botMessage: {
        backgroundColor: '#e91e6300', // Un color verde claro para los mensajes del bot
        alignSelf: 'flex-start', // Alinear a la izquierda
        marginLeft: 10, // Margen a la izquierda
        borderRadius:20,
        color: theme.text, // Color de texto en modo noche
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
    
    largeScrollView: {
        height: 400, // Aumenta la altura
        width: '100%', // Aumenta el ancho
        alignSelf: 'center', // Centrar el contenedor
        padding:10,

    },

    text: {
      fontSize: 21, // Tamaño de fuente grande
      textAlign: 'center', // Texto centrado
      padding: 20, // Padding de 20
      borderRadius: 20, // Radio de 20
      color: 'grey', // Color de texto en modo noche
      fontFamily: 'Poppins-Regular',

      color: theme.text,
    },


    chipContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      paddingVertical: 10,
  },
  chip: {
      borderRadius: 50,
      paddingVertical: 10,
      paddingHorizontal: 25,
      borderWidth:2,
      borderColor:'#009688',
      maxWidth:300,
      margin: 5,
  },
  chipText: {
      fontSize: 15,
      color: 'white',
      textAlign: 'center',
      fontFamily: 'Poppins-Regular',
      color:'#009688',
  },
  marginContainer: {
    marginTop:30,
  },
 
  progressContainer: {
    flex: 1, // Aseguramos que el contenedor ocupe toda la pantalla
    backgroundColor: '#d8fffb', // Color de fondo, elige el que desees
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center', // Centra el contenido horizontalmente
    padding: 5, // Añade un padding al contenedor
    borderRadius: 20,
    marginTop :80
},
greetingText: {
  fontSize: 40,
  color: '#333',
  // ... otros estilos que desees aplicar
},
shareButton: {
  padding: 10,
  borderRadius: 5,
  marginTop:20,   // margen superior
  marginBottom: -50, // margen inferior
  alignItems: 'center',
  justifyContent: 'center',

},

shareButtonText: {
  color: 'gray', // color de texto blanco
  fontSize: 16,
},

textShareButton: {
  padding: 10,
  borderRadius: 5,
  marginTop: -30,   // margen superior
  marginBottom: 10, // margen inferior
  width: '80%', // Asegurándonos de que ocupe toda la anchura
},
textShareButtonText: {
  color: 'white', // color de texto blanco
  fontSize: 14,
  fontFamily: 'Poppins-Regular',
},


textShareButtonTextes: {
  color: 'white', // color de texto blanco
  fontSize: 14,
  fontFamily: 'Poppins-Regular',
},


textShareButtonTextesf: {
  color: 'white',
  fontSize: 16,
  fontFamily: 'Poppins-Regular',
},
textShareButtonTextesfg: {
  color: 'white',
  fontSize: 16,
  fontFamily: 'Poppins-Regular',
},

nightModeTextShareButtonText: {
  color: 'gray', // Color del texto en modo oscuro
},
generatingText: {
  marginTop: 10,
  fontSize: 16,
  color: '#333',

},
nightModeShareButtonText: {
  color: 'gray', // Color del texto en modo oscuro
},
disabledButton: {
  backgroundColor: '#60606047',
  // otros estilos según sea necesario
},

disabledButtonText: {
  color: 'white',
  // otros estilos según sea necesario
},
loadingModalContainer: {
  backgroundColor: 'transparent', // Hacer el fondo transparente cuando el loader está activo
},

loadingText: {
  color:  '#e91e63 ',
  fontSize: 16, // Tamaño de texto más grande
  textAlign: 'center',
  marginTop: 40, // Espaciado en la parte superior para separar el texto del indicador de actividad
  padding:10
},
centeredContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 0,      // Elimina el borde redondeado para cubrir toda la pantalla
  marginBottom: 0,      // Elimina el margen inferior
  marginTop: 0,         // Asegúrate de que no haya margen superior
  width: '100%',        // Asegura que el ancho cubra toda la pantalla
  height: '100%',       // Asegura que el alto cubra toda la pantalla
  position: 'absolute', // Asegura que el contenedor se posicione en toda la pantalla
  top: 0,               // Alinea el contenedor al inicio de la pantalla
  left: 0,              // Alinea el contenedor al lado izquierdo de la pantalla
},

loadingImage: {
  width: 150,  // O el tamaño que prefieras
  height: 150, // O el tamaño que prefieras
  resizeMode: 'contain',
},
backgroundImage: {
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  opacity: 0.9, // Puedes ajustar la opacidad según tus necesidades
  
},

overlay: {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,

  opacity: 0.7, // Ajusta la opacidad para cambiar la oscuridad del overlay
},

nightModeInput: {
  backgroundColor: '#333', // o cualquier otro color oscuro que quieras para el fondo
  color: 'white', // esto cambiará el color del texto ingresado
},
playButton: {
  backgroundColor: '#009688', // Color de fondo para el botón de reproducción (ajusta según tus preferencias)
  padding: 5, // Espaciado interno para el botón de reproducción (ajusta según tus preferencias)
  borderRadius: 50, // Radio de borde para el botón de reproducción (ajusta según tus preferencias)
  alignItems: 'center', // Alineación de contenido en el centro para el botón de reproducción
  maxWidth: '15%', // Ancho máximo del 50% del contenedor
  marginLeft:20
},
stopButton: {
  backgroundColor: 'red', // Color de fondo para el botón de detención (ajusta según tus preferencias)
  padding: 5, // Espaciado interno para el botón de detención (ajusta según tus preferencias)
  borderRadius: 50, // Radio de borde para el botón de detención (ajusta según tus preferencias)
  alignItems: 'center', // Alineación de contenido en el centro para el botón de detención
  maxWidth: '15%', // Ancho máximo del 50% del contenedor
  marginLeft:20
},

showExamplesText: {
  fontSize: 17, // Ajusta según sea necesario
  color:  '#007BFF', 
  marginBottom: 20, // Ajusta según sea necesario
  marginTop: -20, // Ajusta según sea necesario
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding:5,
  borderRadius: 50, // Radio de borde para el botón de reproducción (ajusta según tus preferencias)
  fontFamily: 'Poppins-Regular',
},


nightModeInput: {
  backgroundColor: '#f0ffff00',
  color: 'white',
},


textInput: {
  padding: 20,
  marginBottom: 10, // espacio debajo del input
  borderRadius: 20,
  width: '100%', // Asegurándonos de que ocupe toda la anchura
  fontSize: 18,
  borderWidth: 1,
  borderBlockColor:'grey',
  color: theme.text,
  marginTop: -60
},
openModalButton: {
  backgroundColor: '#28a745',
  padding: 10,
  borderRadius: 8,
  alignItems: 'center',
  marginVertical: 10,
},
openModalButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalContainerg: {
  width: '85%',
  maxHeight: '80%',
  backgroundColor: '#fff',
  borderRadius: 10,
  padding: 20,
},
modalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 10,
},
noListsText: {
  fontSize: 16,
  textAlign: 'center',
  marginVertical: 20,
},
listItem: {
  backgroundColor: '#f0f0f0',
  padding: 15,
  borderRadius: 8,
  marginVertical: 5,
  position: 'relative',
},
recipeName: {
  fontSize: 16,
  fontWeight: 'bold',
},
shoppingList: {
  marginTop: 5,
  fontSize: 14,
  color: '#333',
},
deleteButton: {
  position: 'absolute',
  top: 10,
  right: 10,
  backgroundColor: '#ff4d4d',
  borderRadius: 15,
  padding: 5,
},
closeButton: {
  marginTop: 15,
  backgroundColor: '#ff5722',
  padding: 10,
  borderRadius: 8,
  alignItems: 'center',
},
closeButtonText: {
  color: '#fff',
  fontSize: 16,
},
exportButton: {
  backgroundColor: '#009688',
  padding: 8,
  borderRadius: 5,
  alignItems: 'center',
  marginTop: 10,
  borderRadius:10,
  width:300,
alignSelf:'center',
marginBottom:10
},
exportButtone: {
  backgroundColor: '#007BFF',
  padding: 8,
  borderRadius: 5,
  alignItems: 'center',
  marginTop: 10,
  marginBottom:10,
 borderRadius:10,
width:200,
alignSelf:'center'
},


exportButtoisn: {
  backgroundColor: '#007BFF',
  padding: 8,
  borderRadius: 5,
  alignItems: 'center',
  marginTop: 10,
  marginBottom:10,
 borderRadius:10,
width:200,
alignSelf:'center'
},



exportButtonText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: 'bold',
},

clearButton: {
  backgroundColor: '#e91e63',
  padding: 8,
  borderRadius: 5,
  alignItems: 'center',
  marginTop: 10,
  marginBottom:60,
 borderRadius:10,
width:200,
alignSelf:'center'
},

header: {
  flexDirection: 'row',
  alignSelf:'center',

  paddingBottom: 10,
},
headerTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: theme.textColor,

},
favoritesIcon: {
  padding: 5,
backgroundColor:'#e91e63',

  borderRadius:10
},


favoritesIcondos: {
  padding: 5,
  backgroundColor:'#e91e63',
  marginLeft:10,
    borderRadius:10
},

modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},

// Contenedor del modal de favoritos
favoritesModal: {
  width: '96%',
  maxHeight: '90%',
  backgroundColor: theme.backgroundnuevo, // Usar una propiedad del tema
  borderRadius: 10,
  padding: 20,
},

// Encabezado del modal
modalHeader: {
  alignSelf: 'flex-end',
  paddingRight: 10
},

// Título del modal
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: theme.text, // Usar una propiedad del tema
  
},

// Texto cuando no hay favoritos
noFavoritesText: {
  textAlign: 'center',
  color: theme.textdos, // Usar una propiedad del tema
  
},

// Contenedor de cada elemento favorito
favoriteItem: {
  backgroundColor: theme.backgroundnuevo, // Usar una propiedad del tema
  padding: 15,
  marginVertical: 8,
  marginHorizontal: 16,
  borderRadius: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3.84,
  elevation: 5,
},

// Nombre de la receta en favoritos
favoriteRecipeName: {
  fontSize: 16,
  color: theme.text, // Usar una propiedad del tema
  marginBottom: 8,
},

// Contenedor de ingredientes
ingredientsContainer: {
  marginBottom: 8,
},

// Contenedor de preparación
preparationContainer: {
  marginBottom: 8,
},

// Título de sección (Ingredientes, Preparación)
sectionTitle: {
  fontSize: 16,
  fontWeight: '600',
  color: theme.text, // Usar una propiedad del tema
  marginBottom: 4,
  
},

// Texto de ingredientes
ingredientText: {
  fontSize: 14,
  color: theme.textcuatro, // Usar una propiedad específica del tema
},




// Texto de preparación
preparationText: {
  fontSize: 14,
  color: theme.textcuatro, // Usar una propiedad específica del tema
  textAlign: 'justify',
},

// Botón para eliminar de favoritos
removeButton: {
  position: 'absolute',
  top: 15,
  right: 15,
},

// Botón de favoritos
favoriteButton: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 5,
},

// Texto compartido en botones


favoriteItem: {
  backgroundColor: theme.backgroundnuevo, // Usando una propiedad del tema
  padding: 15,
  marginVertical: 8,
  marginHorizontal: 16,
  borderRadius: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3.84,
  elevation: 5,

},
// Estilo del nombre de la receta
favoriteRecipeName: {
  fontSize: 21,
  fontWeight: 'bold',
  marginBottom: 8,
  padding:20,
  textAlign: 'center',
  fontFamily: 'Poppins-Bold',
  color:  '#e91e63',
},
// Contenedor de ingredientes
ingredientsContainer: {
  marginBottom: 8,
},
// Contenedor de preparación
preparationContainer: {
  marginBottom: 8,
},
// Título de sección (Ingredientes, Preparación)
sectionTitle: {
  fontSize: 16,
  fontWeight: '600',
  color: theme.text, // Usando theme.text
  marginBottom: 4,
  fontFamily: 'Poppins-Regular',
},
// Título de sección en modo oscuro (si es necesario)
sectionTitleNightMode: {
  color: theme.text, // Asegurándonos de que coincide con theme.text
},
// Texto de ingredientes
ingredientText: {
  fontSize: 16,
  color: theme.text, // Usando una propiedad específica del tema
  fontFamily: 'Poppins-Regular',
},
// Texto de preparación
preparationText: {
  fontSize: 16,
  color: theme.text, // Usando una propiedad específica del tema
  textAlign: 'justify',
},
// Botón para eliminar de favoritos
removeButton: {
  position: 'absolute',
  top: 15,
  left: 15,
},
chipListContainer: {
  paddingVertical: 10,
},
chipCard: {
  flex: 1, // Permite que el ancho de la tarjeta se ajuste automáticamente
  margin: 4, // Espacio entre tarjetas
  borderRadius: 10,
  overflow: 'hidden',
  backgroundColor: theme.backgroundnuevo,
  borderWidth: 1,
  borderColor: theme.text,
  padding: 10, // Tamaño del contenido de la tarjeta
},
chipCardNightMode: {
  backgroundColor: '#444',
},
chipImage: {
  width: '100%',
  height: 100,
  borderRadius: 8,
  marginBottom: 10,
  resizeMode: 'cover',
},
chipTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 5,
  color:  '#e91e63',
  textAlign: 'center',
  fontFamily: 'Poppins-Regular',
},

chipDescription: {
  fontSize: 14,
  color: theme.textdos,
  textAlign: 'center',
  fontFamily: 'Poppins-Regular',
},
chipDescriptionNightMode: {
  color: '#ccc',
},
chipNutrition: {
  fontSize: 12,
  fontFamily: 'Poppins-Regular',
  color: theme.text,
  marginTop: 4,
  textAlign: 'center',
  fontWeight: 'bold',
},
recipeButton: {
  backgroundColor: '#e91e63',  // Color de fondo del botón
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 5,
  alignItems: 'center',
  marginTop: 8,
},
recipeButtonText: {
  color: '#ffffff',  // Color del texto en el botón
  fontWeight: 'bold',
  fontSize: 14,
},
suscribeButtonContainer: {
  backgroundColor: '#e91e63', // Color de fondo (por ejemplo, rojo tomate)
  paddingVertical: 10,
  paddingHorizontal: 15,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 10,
  marginTop: -80
},
suscribeShareButtonText: {
  fontSize: 16,
  color: 'white',
  textAlign: 'center',

  fontFamily: 'Poppins-Regular',
},
});

export default FoodMosal;