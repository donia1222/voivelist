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
const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
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

const DogRecep = {
  en: [
    // Recetas de Pollo
    { id: '1', title: "Homemade Chicken Croquettes", description: "Delicious and crispy chicken croquettes perfect for any meal.", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 kcal", fat: "15g", category: "meat" },
    { id: '5', title: "Grilled Chicken with Herbs", description: "Juicy grilled chicken breast with a mix of fresh herbs.", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 kcal", fat: "8g", category: "meat" },
    { id: '9', title: "Honey Glazed Chicken", description: "Sweet and savory chicken glazed with honey.", image: require('../assets/images/pollo.jpg'), calories: "240 kcal", fat: "12g", category: "meat" },
    { id: '10', title: "Spicy Chicken Wings", description: "Chicken wings coated in a spicy sauce, perfect for gatherings.", image: require('../assets/images/wins.jpg'), calories: "310 kcal", fat: "22g", category: "meat" },
  
    // Recetas de Ternera
    { id: '2', title: "Veal Meatballs", description: "Tender veal meatballs cooked to perfection.", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 kcal", fat: "18g", category: "meat" },
    { id: '6', title: "Beef Stroganoff", description: "Tender beef strips cooked in a creamy mushroom sauce.", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 kcal", fat: "20g", category: "meat" },
    { id: '11', title: "Beef Tacos", description: "Mexican-style tacos filled with seasoned beef.", image: require('../assets/images/beftacos.jpg'), calories: "280 kcal", fat: "15g", category: "meat" },
    { id: '12', title: "Beef and Mushroom Pie", description: "Savory pie filled with beef and mushrooms in a rich sauce.", image: require('../assets/images/pi.jpg'), calories: "350 kcal", fat: "25g", category: "meat" },
  
    // Recetas Vegetarianas
    { id: '4', title: "Vegetable Lasagna", description: "With fresh vegetables, gratin mozzarella cheese.", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 kcal", fat: "10g", category: "vegetarian" },
    { id: '7', title: "Stuffed Bell Peppers", description: "Colorful bell peppers stuffed with a vegetable and rice mix.", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 kcal", fat: "3g", category: "vegetarian" },
    { id: '13', title: "Grilled Vegetable Skewers", description: "Skewers of assorted vegetables grilled to perfection.", image: require('../assets/images/spiss.jpg'), calories: "100 kcal", fat: "2g", category: "vegetarian" },
    { id: '14', title: "Eggplant Parmesan", description: "Layers of breaded eggplant with marinara and cheese.", image: require('../assets/images/tres.jpg'), calories: "220 kcal", fat: "12g", category: "vegetarian" },
  
    // Postres
    { id: '3', title: "Oat and Banana Cookies", description: "Healthy and tasty oat and banana cookies.", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 kcal", fat: "5g", category: "dessert" },
    { id: '8', title: "Chocolate Brownie", description: "Rich chocolate brownie with a gooey center.", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 kcal", fat: "25g", category: "dessert" },
    { id: '15', title: "Strawberry Cheesecake", description: "Creamy cheesecake topped with fresh strawberries.", image: require('../assets/images/cake.jpg'), calories: "320 kcal", fat: "18g", category: "dessert" },
    { id: '16', title: "Lemon Tart", description: "A refreshing lemon tart with a crispy crust.", image: require('../assets/images/lemon.jpg'), calories: "210 kcal", fat: "12g", category: "dessert" },
  ],  
  es: [
    // Recetas de Pollo
    { id: '1', title: "Croquetas de Pollo Caseras", description: "Deliciosas croquetas de pollo crujientes perfectas para cualquier comida.", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 kcal", fat: "15g", category: "meat" },
    { id: '5', title: "Pollo a la Parrilla con Hierbas", description: "Pechuga de pollo jugosa a la parrilla con una mezcla de hierbas frescas.", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 kcal", fat: "8g", category: "meat" },
    { id: '9', title: "Pollo Glaseado con Miel", description: "Pollo dulce y salado glaseado con miel.", image: require('../assets/images/pollo.jpg'), calories: "240 kcal", fat: "12g", category: "meat" },
    { id: '10', title: "Alitas de Pollo Picantes", description: "Alitas de pollo cubiertas con una salsa picante, perfectas para reuniones.", image: require('../assets/images/wins.jpg'), calories: "310 kcal", fat: "22g", category: "meat" },
  
    // Recetas de Ternera
    { id: '2', title: "Albóndigas de Ternera", description: "Tiernas albóndigas de ternera cocinadas a la perfección.", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 kcal", fat: "18g", category: "meat" },
    { id: '6', title: "Stroganoff de Res", description: "Tiernas tiras de res cocinadas en una salsa cremosa de champiñones.", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 kcal", fat: "20g", category: "meat" },
    { id: '11', title: "Tacos de Res", description: "Tacos estilo mexicano rellenos de res sazonada.", image: require('../assets/images/beftacos.jpg'), calories: "280 kcal", fat: "15g", category: "meat" },
    { id: '12', title: "Pastel de Carne y Champiñones", description: "Pastel relleno de carne y champiñones en una rica salsa.", image: require('../assets/images/pi.jpg'), calories: "350 kcal", fat: "25g", category: "meat" },
  
    // Recetas Vegetarianas
    { id: '4', title: "Lasaña de Verduras", description: "Con verduras frescas y queso mozzarella gratinado.", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 kcal", fat: "10g", category: "vegetarian" },
    { id: '7', title: "Pimientos Rellenos", description: "Pimientos de colores rellenos con una mezcla de vegetales y arroz.", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 kcal", fat: "3g", category: "vegetarian" },
    { id: '13', title: "Brochetas de Verduras a la Parrilla", description: "Brochetas de verduras variadas a la parrilla.", image: require('../assets/images/spiss.jpg'), calories: "100 kcal", fat: "2g", category: "vegetarian" },
    { id: '14', title: "Berenjena a la Parmesana", description: "Capas de berenjena empanizada con marinara y queso.", image: require('../assets/images/tres.jpg'), calories: "220 kcal", fat: "12g", category: "vegetarian" },
  
    // Postres
    { id: '3', title: "Galletas de Avena y Plátano", description: "Galletas saludables y sabrosas de avena y plátano.", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 kcal", fat: "5g", category: "dessert" },
    { id: '8', title: "Brownie de Chocolate", description: "Brownie de chocolate rico con un centro cremoso.", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 kcal", fat: "25g", category: "dessert" },
    { id: '15', title: "Cheesecake de Fresas", description: "Cheesecake cremoso cubierto con fresas frescas.", image: require('../assets/images/cake.jpg'), calories: "320 kcal", fat: "18g", category: "dessert" },
    { id: '16', title: "Tarta de Limón", description: "Una refrescante tarta de limón con una base crujiente.", image: require('../assets/images/lemon.jpg'), calories: "210 kcal", fat: "12g", category: "dessert" },
  ],
  de: [
    // Hähnchenrezepte
    { id: '1', title: "Hausgemachte Hähnchenkroketten", description: "Leckere und knusprige Hähnchenkroketten, perfekt für jede Mahlzeit.", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 kcal", fat: "15g", category: "meat" },
    { id: '5', title: "Gegrilltes Hähnchen mit Kräutern", description: "Saftige Hähnchenbrust, gegrillt mit einer Mischung aus frischen Kräutern.", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 kcal", fat: "8g", category: "meat" },
    { id: '9', title: "Honigglasierte Hähnchen", description: "Süßes und herzhaftes Hähnchen mit Honig glasiert.", image: require('../assets/images/pollo.jpg'), calories: "240 kcal", fat: "12g", category: "meat" },
    { id: '10', title: "Würzige Hähnchenflügel", description: "Hähnchenflügel mit scharfer Soße überzogen, perfekt für Treffen.", image: require('../assets/images/wins.jpg'), calories: "310 kcal", fat: "22g", category: "meat" },
  
    // Rindfleischrezepte
    { id: '2', title: "Kalbfleischbällchen", description: "Zarte Kalbfleischbällchen, perfekt gegart.", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 kcal", fat: "18g", category: "meat" },
    { id: '6', title: "Rindergeschnetzeltes Stroganoff", description: "Zarte Rindfleischstreifen in einer cremigen Champignonsoße.", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 kcal", fat: "20g", category: "meat" },
    { id: '11', title: "Rindfleisch-Tacos", description: "Mexikanische Tacos gefüllt mit gewürztem Rindfleisch.", image: require('../assets/images/beftacos.jpg'), calories: "280 kcal", fat: "15g", category: "meat" },
    { id: '12', title: "Rindfleisch-Pilz-Kuchen", description: "Herzhafter Kuchen gefüllt mit Rindfleisch und Pilzen in einer reichhaltigen Soße.", image: require('../assets/images/pi.jpg'), calories: "350 kcal", fat: "25g", category: "meat" },
  
    // Vegetarische Rezepte
    { id: '4', title: "Gemüselasagne", description: "Mit frischem Gemüse und überbackenem Mozzarella-Käse.", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 kcal", fat: "10g", category: "vegetarian" },
    { id: '7', title: "Gefüllte Paprika", description: "Bunte Paprika gefüllt mit einer Mischung aus Gemüse und Reis.", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 kcal", fat: "3g", category: "vegetarian" },
    { id: '13', title: "Gegrillte Gemüsespieße", description: "Spieße mit verschiedenen Gemüse, perfekt gegrillt.", image: require('../assets/images/spiss.jpg'), calories: "100 kcal", fat: "2g", category: "vegetarian" },
    { id: '14', title: "Auberginen Parmesan", description: "Panierte Auberginenscheiben mit Marinara und Käse.", image: require('../assets/images/tres.jpg'), calories: "220 kcal", fat: "12g", category: "vegetarian" },
  
    // Desserts
    { id: '3', title: "Hafer-Bananen-Kekse", description: "Gesunde und leckere Hafer-Bananen-Kekse.", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 kcal", fat: "5g", category: "dessert" },
    { id: '8', title: "Schokoladen Brownie", description: "Reicher Schokoladen-Brownie mit cremigem Kern.", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 kcal", fat: "25g", category: "dessert" },
    { id: '15', title: "Erdbeer-Käsekuchen", description: "Cremiger Käsekuchen mit frischen Erdbeeren belegt.", image: require('../assets/images/cake.jpg'), calories: "320 kcal", fat: "18g", category: "dessert" },
    { id: '16', title: "Zitronentarte", description: "Eine erfrischende Zitronentarte mit knusprigem Boden.", image: require('../assets/images/lemon.jpg'), calories: "210 kcal", fat: "12g", category: "dessert" },
  ],
  fr: [
    // Recettes de Poulet
    { id: '1', title: "Croquettes de Poulet Maison", description: "Délicieuses croquettes de poulet croustillantes, parfaites pour tout repas.", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 kcal", fat: "15g", category: "meat" },
    { id: '5', title: "Poulet Grillé aux Herbes", description: "Poitrine de poulet juteuse grillée avec un mélange d'herbes fraîches.", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 kcal", fat: "8g", category: "meat" },
    { id: '9', title: "Poulet au Miel", description: "Poulet doux et salé glacé au miel.", image: require('../assets/images/pollo.jpg'), calories: "240 kcal", fat: "12g", category: "meat" },
    { id: '10', title: "Ailes de Poulet Épicées", description: "Ailes de poulet en sauce épicée, parfaites pour les réunions.", image: require('../assets/images/wins.jpg'), calories: "310 kcal", fat: "22g", category: "meat" },
  
    // Recettes de Boeuf
    { id: '2', title: "Boulettes de Veau", description: "Tendres boulettes de veau, cuites à la perfection.", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 kcal", fat: "18g", category: "meat" },
    { id: '6', title: "Boeuf Stroganoff", description: "Tendres lamelles de boeuf dans une sauce crémeuse aux champignons.", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 kcal", fat: "20g", category: "meat" },
    { id: '11', title: "Tacos de Boeuf", description: "Tacos à la mexicaine garnis de boeuf assaisonné.", image: require('../assets/images/beftacos.jpg'), calories: "280 kcal", fat: "15g", category: "meat" },
    { id: '12', title: "Tourte au Boeuf et Champignons", description: "Tourte salée au boeuf et champignons dans une sauce riche.", image: require('../assets/images/pi.jpg'), calories: "350 kcal", fat: "25g", category: "meat" },
  
    // Recettes Végétariennes
    { id: '4', title: "Lasagnes aux Légumes", description: "Avec des légumes frais et du fromage mozzarella gratiné.", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 kcal", fat: "10g", category: "vegetarian" },
    { id: '7', title: "Poivrons Farcis", description: "Poivrons colorés farcis avec un mélange de légumes et de riz.", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 kcal", fat: "3g", category: "vegetarian" },
    { id: '13', title: "Brochettes de Légumes Grillés", description: "Brochettes de légumes variés grillés à la perfection.", image: require('../assets/images/spiss.jpg'), calories: "100 kcal", fat: "2g", category: "vegetarian" },
    { id: '14', title: "Aubergine Parmigiana", description: "Couches d'aubergine panée avec sauce marinara et fromage.", image: require('../assets/images/tres.jpg'), calories: "220 kcal", fat: "12g", category: "vegetarian" },
  
    // Desserts
    { id: '3', title: "Biscuits à l'Avoine et à la Banane", description: "Biscuits sains et savoureux à l'avoine et à la banane.", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 kcal", fat: "5g", category: "dessert" },
    { id: '8', title: "Brownie au Chocolat", description: "Brownie au chocolat avec un centre fondant.", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 kcal", fat: "25g", category: "dessert" },
    { id: '15', title: "Cheesecake aux Fraises", description: "Cheesecake crémeux garni de fraises fraîches.", image: require('../assets/images/cake.jpg'), calories: "320 kcal", fat: "18g", category: "dessert" },
    { id: '16', title: "Tarte au Citron", description: "Une tarte au citron rafraîchissante avec une croûte croustillante.", image: require('../assets/images/lemon.jpg'), calories: "210 kcal", fat: "12g", category: "dessert" },
  ],
  it: [
    // Ricette di Pollo
    { id: '1', title: "Crocchette di Pollo Fatte in Casa", description: "Deliziose crocchette di pollo croccanti, perfette per ogni pasto.", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 kcal", fat: "15g", category: "meat" },
    { id: '5', title: "Pollo Grigliato alle Erbe", description: "Petto di pollo succulento grigliato con un mix di erbe fresche.", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 kcal", fat: "8g", category: "meat" },
    { id: '9', title: "Pollo Glassa al Miele", description: "Pollo dolce e salato glassato con miele.", image: require('../assets/images/pollo.jpg'), calories: "240 kcal", fat: "12g", category: "meat" },
    { id: '10', title: "Ali di Pollo Piccanti", description: "Ali di pollo ricoperte di salsa piccante, perfette per le riunioni.", image: require('../assets/images/wins.jpg'), calories: "310 kcal", fat: "22g", category: "meat" },
  
    // Ricette di Manzo
    { id: '2', title: "Polpette di Vitello", description: "Tenere polpette di vitello cucinate alla perfezione.", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 kcal", fat: "18g", category: "meat" },
    { id: '6', title: "Manzo alla Stroganoff", description: "Straccetti di manzo teneri in una cremosa salsa di funghi.", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 kcal", fat: "20g", category: "meat" },
    { id: '11', title: "Tacos di Manzo", description: "Tacos messicani con carne di manzo speziata.", image: require('../assets/images/beftacos.jpg'), calories: "280 kcal", fat: "15g", category: "meat" },
    { id: '12', title: "Torta Salata con Manzo e Funghi", description: "Torta salata ripiena di manzo e funghi in una ricca salsa.", image: require('../assets/images/pi.jpg'), calories: "350 kcal", fat: "25g", category: "meat" },
  
    // Ricette Vegetariane
    { id: '4', title: "Lasagna di Verdure", description: "Con verdure fresche e mozzarella gratinata.", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 kcal", fat: "10g", category: "vegetarian" },
    { id: '7', title: "Peperoni Ripieni", description: "Peperoni colorati ripieni con un mix di verdure e riso.", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 kcal", fat: "3g", category: "vegetarian" },
    { id: '13', title: "Spiedini di Verdure Grigliate", description: "Spiedini di verdure assortite grigliate alla perfezione.", image: require('../assets/images/spiss.jpg'), calories: "100 kcal", fat: "2g", category: "vegetarian" },
    { id: '14', title: "Parmigiana di Melanzane", description: "Strati di melanzane impanate con marinara e formaggio.", image: require('../assets/images/tres.jpg'), calories: "220 kcal", fat: "12g", category: "vegetarian" },
  
    // Dessert
    { id: '3', title: "Biscotti all'Avena e Banana", description: "Biscotti sani e gustosi all'avena e banana.", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 kcal", fat: "5g", category: "dessert" },
    { id: '8', title: "Brownie al Cioccolato", description: "Brownie ricco di cioccolato con centro cremoso.", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 kcal", fat: "25g", category: "dessert" },
    { id: '15', title: "Cheesecake alla Fragola", description: "Cheesecake cremoso con fragole fresche sopra.", image: require('../assets/images/cake.jpg'), calories: "320 kcal", fat: "18g", category: "dessert" },
    { id: '16', title: "Crostata al Limone", description: "Una crostata al limone rinfrescante con crosta croccante.", image: require('../assets/images/lemon.jpg'), calories: "210 kcal", fat: "12g", category: "dessert" },
  ],
  pt: [
    // Receitas de Frango
    { id: '1', title: "Croquetes de Frango Caseiros", description: "Deliciosos croquetes de frango crocantes, perfeitos para qualquer refeição.", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 kcal", fat: "15g", category: "meat" },
    { id: '5', title: "Frango Grelhado com Ervas", description: "Peito de frango suculento grelhado com um mix de ervas frescas.", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 kcal", fat: "8g", category: "meat" },
    { id: '9', title: "Frango com Glacê de Mel", description: "Frango doce e salgado glaceado com mel.", image: require('../assets/images/pollo.jpg'), calories: "240 kcal", fat: "12g", category: "meat" },
    { id: '10', title: "Asas de Frango Picantes", description: "Asas de frango cobertas com molho picante, perfeitas para encontros.", image: require('../assets/images/wins.jpg'), calories: "310 kcal", fat: "22g", category: "meat" },
  
    // Receitas de Carne
    { id: '2', title: "Almôndegas de Vitela", description: "Almôndegas de vitela tenras, cozidas à perfeição.", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 kcal", fat: "18g", category: "meat" },
    { id: '6', title: "Estrogonofe de Carne", description: "Tiras de carne tenra em um molho cremoso de cogumelos.", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 kcal", fat: "20g", category: "meat" },
    { id: '11', title: "Tacos de Carne", description: "Tacos ao estilo mexicano recheados com carne temperada.", image: require('../assets/images/beftacos.jpg'), calories: "280 kcal", fat: "15g", category: "meat" },
    { id: '12', title: "Torta de Carne e Cogumelos", description: "Torta salgada recheada com carne e cogumelos em um molho rico.", image: require('../assets/images/pi.jpg'), calories: "350 kcal", fat: "25g", category: "meat" },
  
    // Receitas Vegetarianas
    { id: '4', title: "Lasanha de Legumes", description: "Com legumes frescos e queijo mozzarella gratinado.", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 kcal", fat: "10g", category: "vegetarian" },
    { id: '7', title: "Pimentões Recheados", description: "Pimentões coloridos recheados com uma mistura de vegetais e arroz.", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 kcal", fat: "3g", category: "vegetarian" },
    { id: '13', title: "Espetinhos de Legumes Grelhados", description: "Espetinhos de legumes variados grelhados à perfeição.", image: require('../assets/images/spiss.jpg'), calories: "100 kcal", fat: "2g", category: "vegetarian" },
    { id: '14', title: "Berinjela à Parmegiana", description: "Camadas de berinjela empanada com molho marinara e queijo.", image: require('../assets/images/tres.jpg'), calories: "220 kcal", fat: "12g", category: "vegetarian" },
  
    // Sobremesas
    { id: '3', title: "Biscoitos de Aveia e Banana", description: "Biscoitos saudáveis e saborosos de aveia e banana.", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 kcal", fat: "5g", category: "dessert" },
    { id: '8', title: "Brownie de Chocolate", description: "Brownie de chocolate com um centro cremoso.", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 kcal", fat: "25g", category: "dessert" },
    { id: '15', title: "Cheesecake de Morango", description: "Cheesecake cremoso com morangos frescos por cima.", image: require('../assets/images/cake.jpg'), calories: "320 kcal", fat: "18g", category: "dessert" },
    { id: '16', title: "Torta de Limão", description: "Uma torta de limão refrescante com crosta crocante.", image: require('../assets/images/lemon.jpg'), calories: "210 kcal", fat: "12g", category: "dessert" },
  ],
  ru: [
    // Рецепты с курицей
    { id: '1', title: "Домашние Крокеты с Курицей", description: "Вкусные и хрустящие крокеты с курицей, идеально подходят для любого приема пищи.", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 kcal", fat: "15g", category: "meat" },
    { id: '5', title: "Курица на Гриле с Травами", description: "Сочное куриное филе на гриле с травами.", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 kcal", fat: "8g", category: "meat" },
    { id: '9', title: "Курица в Медовой Глазури", description: "Курица с медовой глазурью, сладкая и пикантная.", image: require('../assets/images/pollo.jpg'), calories: "240 kcal", fat: "12g", category: "meat" },
    { id: '10', title: "Острые Куриные Крылышки", description: "Крылышки в остром соусе, идеально подходят для встреч.", image: require('../assets/images/wins.jpg'), calories: "310 kcal", fat: "22g", category: "meat" },
  
    // Рецепты с Говядиной
    { id: '2', title: "Тефтели из Телятины", description: "Нежные тефтели из телятины, приготовленные до совершенства.", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 kcal", fat: "18g", category: "meat" },
    { id: '6', title: "Бефстроганов", description: "Кусочки нежной говядины в сливочном грибном соусе.", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 kcal", fat: "20g", category: "meat" },
    { id: '11', title: "Тако с Говядиной", description: "Мексиканские тако с приправленной говядиной.", image: require('../assets/images/beftacos.jpg'), calories: "280 kcal", fat: "15g", category: "meat" },
    { id: '12', title: "Пирог с Говядиной и Грибами", description: "Пирог с говядиной и грибами в насыщенном соусе.", image: require('../assets/images/pi.jpg'), calories: "350 kcal", fat: "25g", category: "meat" },
  
    // Вегетарианские рецепты
    { id: '4', title: "Овощная Лазанья", description: "С свежими овощами и запеченным сыром моцарелла.", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 kcal", fat: "10g", category: "vegetarian" },
    { id: '7', title: "Фаршированный Перец", description: "Цветной перец, фаршированный овощами и рисом.", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 kcal", fat: "3g", category: "vegetarian" },
    { id: '13', title: "Овощные Шашлычки", description: "Шашлычки из различных овощей, запеченные до совершенства.", image: require('../assets/images/spiss.jpg'), calories: "100 kcal", fat: "2g", category: "vegetarian" },
    { id: '14', title: "Пармезан из Баклажанов", description: "Слои запанированных баклажанов с соусом и сыром.", image: require('../assets/images/tres.jpg'), calories: "220 kcal", fat: "12g", category: "vegetarian" },
  
    // Десерты
    { id: '3', title: "Овсяное Печенье с Бананом", description: "Здоровое и вкусное печенье с овсянкой и бананом.", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 kcal", fat: "5g", category: "dessert" },
    { id: '8', title: "Шоколадный Брауни", description: "Шоколадный брауни с кремовым центром.", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 kcal", fat: "25g", category: "dessert" },
    { id: '15', title: "Чизкейк с Клубникой", description: "Нежный чизкейк с свежей клубникой сверху.", image: require('../assets/images/cake.jpg'), calories: "320 kcal", fat: "18g", category: "dessert" },
    { id: '16', title: "Лимонный Тарт", description: "Освежающий лимонный тарт с хрустящей корочкой.", image: require('../assets/images/lemon.jpg'), calories: "210 kcal", fat: "12g", category: "dessert" },
  ],
  ja: [
    // チキンのレシピ
    { id: '1', title: "自家製チキンクロケット", description: "どんな食事にもぴったりの、サクサクのチキンクロケットです。", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 kcal", fat: "15g", category: "meat" },
    { id: '5', title: "ハーブチキングリル", description: "新鮮なハーブのミックスでジューシーにグリルしたチキン胸肉。", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 kcal", fat: "8g", category: "meat" },
    { id: '9', title: "ハニーグレーズチキン", description: "甘くて香ばしいハニーグレーズのチキン。", image: require('../assets/images/pollo.jpg'), calories: "240 kcal", fat: "12g", category: "meat" },
    { id: '10', title: "スパイシーチキンウィング", description: "集まりにぴったりの、スパイシーソースでコーティングしたチキンウィング。", image: require('../assets/images/wins.jpg'), calories: "310 kcal", fat: "22g", category: "meat" },
  
    // 牛肉のレシピ
    { id: '2', title: "仔牛のミートボール", description: "柔らかく完璧に調理された仔牛のミートボール。", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 kcal", fat: "18g", category: "meat" },
    { id: '6', title: "ビーフストロガノフ", description: "クリーミーなマッシュルームソースで調理したビーフストリップ。", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 kcal", fat: "20g", category: "meat" },
    { id: '11', title: "ビーフタコス", description: "メキシコ風のタコスに味付けしたビーフを詰めました。", image: require('../assets/images/beftacos.jpg'), calories: "280 kcal", fat: "15g", category: "meat" },
    { id: '12', title: "ビーフとマッシュルームのパイ", description: "リッチなソースでビーフとマッシュルームを詰めたセイボリーパイ。", image: require('../assets/images/pi.jpg'), calories: "350 kcal", fat: "25g", category: "meat" },
  
    // ベジタリアンのレシピ
    { id: '4', title: "野菜のラザニア", description: "新鮮な野菜とグラタンチーズのモッツァレラ。", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 kcal", fat: "10g", category: "vegetarian" },
    { id: '7', title: "野菜の詰めピーマン", description: "野菜と米のミックスを詰めたカラフルなピーマン。", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 kcal", fat: "3g", category: "vegetarian" },
    { id: '13', title: "グリル野菜の串焼き", description: "色とりどりの野菜を完璧にグリルしました。", image: require('../assets/images/spiss.jpg'), calories: "100 kcal", fat: "2g", category: "vegetarian" },
    { id: '14', title: "ナスのパルメザン", description: "マリナラソースとチーズを重ねたナスのパルメザン。", image: require('../assets/images/tres.jpg'), calories: "220 kcal", fat: "12g", category: "vegetarian" },
  
    // デザート
    { id: '3', title: "オートミールとバナナのクッキー", description: "健康的で美味しいオートミールとバナナのクッキー。", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 kcal", fat: "5g", category: "dessert" },
    { id: '8', title: "チョコレートブラウニー", description: "とろける中心が美味しいチョコレートブラウニー。", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 kcal", fat: "25g", category: "dessert" },
    { id: '15', title: "ストロベリーチーズケーキ", description: "フレッシュなイチゴがトッピングされたクリーミーなチーズケーキ。", image: require('../assets/images/cake.jpg'), calories: "320 kcal", fat: "18g", category: "dessert" },
    { id: '16', title: "レモンタルト", description: "サクサクの皮にリフレッシュ感あふれるレモンタルト。", image: require('../assets/images/lemon.jpg'), calories: "210 kcal", fat: "12g", category: "dessert" },
  ],
  zh: [
    // 鸡肉食谱
    { id: '1', title: "自制鸡肉丸子", description: "美味酥脆的鸡肉丸子，适合任何餐点。", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 kcal", fat: "15g", category: "meat" },
    { id: '5', title: "香草烤鸡", description: "多汁的鸡胸肉，配上新鲜的香草。", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 kcal", fat: "8g", category: "meat" },
    { id: '9', title: "蜂蜜釉鸡肉", description: "甜咸口味的蜂蜜釉鸡肉。", image: require('../assets/images/pollo.jpg'), calories: "240 kcal", fat: "12g", category: "meat" },
    { id: '10', title: "辣味鸡翅", description: "适合聚会的辣味鸡翅。", image: require('../assets/images/wins.jpg'), calories: "310 kcal", fat: "22g", category: "meat" },
  
    // 牛肉食谱
    { id: '2', title: "牛肉丸", description: "嫩滑的牛肉丸，煮至完美。", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 kcal", fat: "18g", category: "meat" },
    { id: '6', title: "俄式牛肉", description: "嫩牛肉条配奶油蘑菇酱。", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 kcal", fat: "20g", category: "meat" },
    { id: '11', title: "牛肉卷饼", description: "墨西哥风味的牛肉卷饼。", image: require('../assets/images/beftacos.jpg'), calories: "280 kcal", fat: "15g", category: "meat" },
    { id: '12', title: "牛肉蘑菇馅饼", description: "充满香浓牛肉和蘑菇的馅饼。", image: require('../assets/images/pi.jpg'), calories: "350 kcal", fat: "25g", category: "meat" },
  
    // 素食食谱
    { id: '4', title: "蔬菜千层面", description: "配新鲜蔬菜和烤芝士。", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 kcal", fat: "10g", category: "vegetarian" },
    { id: '7', title: "填料青椒", description: "多彩青椒，内有蔬菜和米饭。", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 kcal", fat: "3g", category: "vegetarian" },
    { id: '13', title: "烤蔬菜串", description: "各种蔬菜串，完美烤制。", image: require('../assets/images/spiss.jpg'), calories: "100 kcal", fat: "2g", category: "vegetarian" },
    { id: '14', title: "茄子芝士", description: "配马林娜酱和芝士的茄子层。", image: require('../assets/images/tres.jpg'), calories: "220 kcal", fat: "12g", category: "vegetarian" },
  
    // 甜点
    { id: '3', title: "燕麦香蕉饼干", description: "健康美味的燕麦香蕉饼干。", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 kcal", fat: "5g", category: "dessert" },
    { id: '8', title: "巧克力布朗尼", description: "中心柔软的巧克力布朗尼。", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 kcal", fat: "25g", category: "dessert" },
    { id: '15', title: "草莓芝士蛋糕", description: "顶部新鲜草莓的奶油芝士蛋糕。", image: require('../assets/images/cake.jpg'), calories: "320 kcal", fat: "18g", category: "dessert" },
    { id: '16', title: "柠檬塔", description: "清爽的柠檬塔，带有酥脆的外壳。", image: require('../assets/images/lemon.jpg'), calories: "210 kcal", fat: "12g", category: "dessert" },
  ],
  pl: [
    // Przepisy z kurczakiem
    { id: '1', title: "Domowe krokiety z kurczaka", description: "Pyszne i chrupiące krokiety z kurczaka, idealne na każdy posiłek.", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 kcal", fat: "15g", category: "meat" },
    { id: '5', title: "Grillowany kurczak z ziołami", description: "Soczysta pierś z kurczaka grillowana z mieszanką świeżych ziół.", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 kcal", fat: "8g", category: "meat" },
    { id: '9', title: "Kurczak w miodowej glazurze", description: "Kurczak w słodko-pikantnej miodowej glazurze.", image: require('../assets/images/pollo.jpg'), calories: "240 kcal", fat: "12g", category: "meat" },
    { id: '10', title: "Ostre skrzydełka z kurczaka", description: "Skrzydełka z kurczaka w pikantnym sosie, idealne na spotkania.", image: require('../assets/images/wins.jpg'), calories: "310 kcal", fat: "22g", category: "meat" },
  
    // Przepisy z wołowiną
    { id: '2', title: "Pulpeciki z cielęciny", description: "Delikatne pulpeciki z cielęciny, przygotowane do perfekcji.", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 kcal", fat: "18g", category: "meat" },
    { id: '6', title: "Boeuf Stroganow", description: "Delikatne kawałki wołowiny gotowane w kremowym sosie grzybowym.", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 kcal", fat: "20g", category: "meat" },
    { id: '11', title: "Tacos z wołowiną", description: "Meksykańskie tacos wypełnione przyprawioną wołowiną.", image: require('../assets/images/beftacos.jpg'), calories: "280 kcal", fat: "15g", category: "meat" },
    { id: '12', title: "Placek z wołowiną i grzybami", description: "Placek nadziewany wołowiną i grzybami w bogatym sosie.", image: require('../assets/images/pi.jpg'), calories: "350 kcal", fat: "25g", category: "meat" },
  
    // Przepisy wegetariańskie
    { id: '4', title: "Lazania warzywna", description: "Ze świeżymi warzywami i zapiekaną mozzarellą.", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 kcal", fat: "10g", category: "vegetarian" },
    { id: '7', title: "Faszerowana papryka", description: "Kolorowa papryka nadziewana mieszanką warzyw i ryżu.", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 kcal", fat: "3g", category: "vegetarian" },
    { id: '13', title: "Grillowane warzywa na szaszłykach", description: "Szaszłyki z różnych warzyw grillowane do perfekcji.", image: require('../assets/images/spiss.jpg'), calories: "100 kcal", fat: "2g", category: "vegetarian" },
    { id: '14', title: "Bakłażan z parmezanem", description: "Warstwy panierowanego bakłażana z sosem i serem.", image: require('../assets/images/tres.jpg'), calories: "220 kcal", fat: "12g", category: "vegetarian" },
  
    // Desery
    { id: '3', title: "Ciasteczka owsiane z bananem", description: "Zdrowe i smaczne ciasteczka owsiane z bananem.", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 kcal", fat: "5g", category: "dessert" },
    { id: '8', title: "Brownie czekoladowe", description: "Bogate brownie czekoladowe z kremowym środkiem.", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 kcal", fat: "25g", category: "dessert" },
    { id: '15', title: "Sernik z truskawkami", description: "Kremowy sernik z świeżymi truskawkami na wierzchu.", image: require('../assets/images/cake.jpg'), calories: "320 kcal", fat: "18g", category: "dessert" },
    { id: '16', title: "Tarta cytrynowa", description: "Odświeżająca tarta cytrynowa z chrupiącą skórką.", image: require('../assets/images/lemon.jpg'), calories: "210 kcal", fat: "12g", category: "dessert" },
  ],
  sv: [
    // Kycklingrecept
    { id: '1', title: "Hemgjorda kycklingkroketter", description: "Läckra och krispiga kycklingkroketter, perfekta för varje måltid.", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 kcal", fat: "15g", category: "meat" },
    { id: '5', title: "Grillad kyckling med örter", description: "Saftig grillad kycklingbröst med en mix av färska örter.", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 kcal", fat: "8g", category: "meat" },
    { id: '9', title: "Honungsglaserad kyckling", description: "Söt och smakrik kyckling glaserad med honung.", image: require('../assets/images/pollo.jpg'), calories: "240 kcal", fat: "12g", category: "meat" },
    { id: '10', title: "Spicy kycklingvingar", description: "Kycklingvingar i kryddig sås, perfekt för fester.", image: require('../assets/images/wins.jpg'), calories: "310 kcal", fat: "22g", category: "meat" },
  
    // Nötköttsrecept
    { id: '2', title: "Kalvköttbullar", description: "Möra köttbullar av kalvkött, tillagade till perfektion.", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 kcal", fat: "18g", category: "meat" },
    { id: '6', title: "Boeuf Stroganoff", description: "Möra nötköttsremsor kokta i en krämig svampsås.", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 kcal", fat: "20g", category: "meat" },
    { id: '11', title: "Bifftacos", description: "Mexikansk stil tacos fyllda med kryddat nötkött.", image: require('../assets/images/beftacos.jpg'), calories: "280 kcal", fat: "15g", category: "meat" },
    { id: '12', title: "Nöt- och svamppaj", description: "Paj fylld med nötkött och svamp i en rik sås.", image: require('../assets/images/pi.jpg'), calories: "350 kcal", fat: "25g", category: "meat" },
  
    // Vegetariska recept
    { id: '4', title: "Grönsakslasagne", description: "Med färska grönsaker och gratinerad mozzarellaost.", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 kcal", fat: "10g", category: "vegetarian" },
    { id: '7', title: "Fyllda paprikor", description: "Färggranna paprikor fyllda med en blandning av grönsaker och ris.", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 kcal", fat: "3g", category: "vegetarian" },
    { id: '13', title: "Grillade grönsaksspett", description: "Spett med blandade grönsaker grillade till perfektion.", image: require('../assets/images/spiss.jpg'), calories: "100 kcal", fat: "2g", category: "vegetarian" },
    { id: '14', title: "Aubergine med parmesan", description: "Lager av panerad aubergine med marinara och ost.", image: require('../assets/images/tres.jpg'), calories: "220 kcal", fat: "12g", category: "vegetarian" },
  
    // Desserter
    { id: '3', title: "Havre- och banankakor", description: "Hälsosamma och smakrika havre- och banankakor.", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 kcal", fat: "5g", category: "dessert" },
    { id: '8', title: "Chokladbrownie", description: "Rik chokladbrownie med en mjuk mitten.", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 kcal", fat: "25g", category: "dessert" },
    { id: '15', title: "Jordgubbscheesecake", description: "Krämig cheesecake toppad med färska jordgubbar.", image: require('../assets/images/cake.jpg'), calories: "320 kcal", fat: "18g", category: "dessert" },
    { id: '16', title: "Citronpaj", description: "En uppfriskande citronpaj med krispig botten.", image: require('../assets/images/lemon.jpg'), calories: "210 kcal", fat: "12g", category: "dessert" },
  ],
  hu: [
    // Csirkés receptek
    { id: '1', title: "Házi készítésű csirke krokett", description: "Finom és ropogós csirke krokett, tökéletes minden étkezéshez.", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 kcal", fat: "15g", category: "meat" },
    { id: '5', title: "Grillezett csirke fűszernövényekkel", description: "Szaftos grillezett csirkemell friss fűszernövények keverékével.", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 kcal", fat: "8g", category: "meat" },
    { id: '9', title: "Mézes mázas csirke", description: "Édes és ízes csirke mézzel mázazva.", image: require('../assets/images/pollo.jpg'), calories: "240 kcal", fat: "12g", category: "meat" },
    { id: '10', title: "Fűszeres csirkeszárnyak", description: "Csirkeszárnyak fűszeres szószban, tökéletes bulikra.", image: require('../assets/images/wins.jpg'), calories: "310 kcal", fat: "22g", category: "meat" },
  
    // Marhahúsos receptek
    { id: '2', title: "Borjúhúsgolyók", description: "Puha borjúhúsgolyók tökéletesen elkészítve.", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 kcal", fat: "18g", category: "meat" },
    { id: '6', title: "Marhapörkölt", description: "Finom marhahús csíkok krémes gombás szószban.", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 kcal", fat: "20g", category: "meat" },
    { id: '11', title: "Marha tacos", description: "Mexikói stílusú tacos ízesített marhahússal.", image: require('../assets/images/beftacos.jpg'), calories: "280 kcal", fat: "15g", category: "meat" },
    { id: '12', title: "Marhahúsos gombás pite", description: "Pite marhával és gombával gazdag szószban.", image: require('../assets/images/pi.jpg'), calories: "350 kcal", fat: "25g", category: "meat" },
  
    // Vegetáriánus receptek
    { id: '4', title: "Zöldséges lasagna", description: "Friss zöldségekkel, mozzarellával gratinálva.", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 kcal", fat: "10g", category: "vegetarian" },
    { id: '7', title: "Töltött paprikák", description: "Színes paprikák zöldségekkel és rizzsel töltve.", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 kcal", fat: "3g", category: "vegetarian" },
    { id: '13', title: "Grillezett zöldség nyársak", description: "Grillezett vegyes zöldségek nyárson.", image: require('../assets/images/spiss.jpg'), calories: "100 kcal", fat: "2g", category: "vegetarian" },
    { id: '14', title: "Padlizsán parmezánnal", description: "Bundázott padlizsán rétegek marinara szósszal és sajttal.", image: require('../assets/images/tres.jpg'), calories: "220 kcal", fat: "12g", category: "vegetarian" },
  
    // Desszertek
    { id: '3', title: "Zab- és banán keksz", description: "Egészséges és ízletes zab- és banán keksz.", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 kcal", fat: "5g", category: "dessert" },
    { id: '8', title: "Csokoládés brownie", description: "Gazdag csokoládés brownie puha középpel.", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 kcal", fat: "25g", category: "dessert" },
    { id: '15', title: "Epres sajttorta", description: "Krémes sajttorta friss eperrel a tetején.", image: require('../assets/images/cake.jpg'), calories: "320 kcal", fat: "18g", category: "dessert" },
    { id: '16', title: "Citromos pite", description: "Frissítő citromos pite ropogós tésztával.", image: require('../assets/images/lemon.jpg'), calories: "210 kcal", fat: "12g", category: "dessert" },
  ],
  ar: [
    // وصفات الدجاج
    { id: '1', title: "كروكيت دجاج منزلي", description: "كروكيت دجاج لذيذ ومقرمش مناسب لأي وجبة.", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 سعرة حرارية", fat: "15 جم", category: "meat" },
    { id: '5', title: "دجاج مشوي بالأعشاب", description: "صدر دجاج مشوي مع خليط من الأعشاب الطازجة.", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 سعرة حرارية", fat: "8 جم", category: "meat" },
    { id: '9', title: "دجاج بالصلصة العسلية", description: "دجاج بطعم حلو مغطى بطبقة من العسل.", image: require('../assets/images/pollo.jpg'), calories: "240 سعرة حرارية", fat: "12 جم", category: "meat" },
    { id: '10', title: "أجنحة دجاج حارة", description: "أجنحة دجاج مغطاة بصلصة حارة، مثالية للتجمعات.", image: require('../assets/images/wins.jpg'), calories: "310 سعرة حرارية", fat: "22 جم", category: "meat" },
  
    // وصفات لحم العجل
    { id: '2', title: "كرات لحم العجل", description: "كرات لحم العجل الطرية مطبوخة بشكل مثالي.", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 سعرة حرارية", fat: "18 جم", category: "meat" },
    { id: '6', title: "لحم بيف ستروغانوف", description: "قطع لحم بقر طرية مطبوخة في صلصة كريمية بالفطر.", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 سعرة حرارية", fat: "20 جم", category: "meat" },
    { id: '11', title: "تاكو لحم بقر", description: "تاكو بأسلوب مكسيكي محشو بلحم البقر المتبل.", image: require('../assets/images/beftacos.jpg'), calories: "280 سعرة حرارية", fat: "15 جم", category: "meat" },
    { id: '12', title: "فطيرة لحم بقر وفطر", description: "فطيرة محشوة بلحم البقر والفطر في صلصة غنية.", image: require('../assets/images/pi.jpg'), calories: "350 سعرة حرارية", fat: "25 جم", category: "meat" },
  
    // وصفات نباتية
    { id: '4', title: "لازانيا الخضار", description: "مع خضروات طازجة وجبنة موزاريلا مشوية.", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 سعرة حرارية", fat: "10 جم", category: "vegetarian" },
    { id: '7', title: "فلفل محشو", description: "فلفل ملون محشو بمزيج من الخضار والأرز.", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 سعرة حرارية", fat: "3 جم", category: "vegetarian" },
    { id: '13', title: "أسياخ الخضار المشوية", description: "أسياخ من الخضار المتنوعة المشوية بشكل مثالي.", image: require('../assets/images/spiss.jpg'), calories: "100 سعرة حرارية", fat: "2 جم", category: "vegetarian" },
    { id: '14', title: "باذنجان بالجبنة", description: "شرائح باذنجان مقلية بصلصة طماطم وجبنة.", image: require('../assets/images/tres.jpg'), calories: "220 سعرة حرارية", fat: "12 جم", category: "vegetarian" },
  
    // الحلويات
    { id: '3', title: "بسكويت الشوفان والموز", description: "بسكويت شوفان صحي ولذيذ بالموز.", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 سعرة حرارية", fat: "5 جم", category: "dessert" },
    { id: '8', title: "براوني الشوكولاتة", description: "براوني شوكولاتة غني مع مركز طري.", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 سعرة حرارية", fat: "25 جم", category: "dessert" },
    { id: '15', title: "تشيز كيك الفراولة", description: "تشيز كيك كريمي مغطى بالفراولة الطازجة.", image: require('../assets/images/cake.jpg'), calories: "320 سعرة حرارية", fat: "18 جم", category: "dessert" },
    { id: '16', title: "تارت الليمون", description: "تارت الليمون منعش بقاعدة مقرمشة.", image: require('../assets/images/lemon.jpg'), calories: "210 سعرة حرارية", fat: "12 جم", category: "dessert" },
  ],
  hi: [
    // चिकन रेसिपी
    { id: '1', title: "घर का बना चिकन क्रोकेट", description: "स्वादिष्ट और कुरकुरे चिकन क्रोकेट, किसी भी भोजन के लिए उपयुक्त।", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 कैलोरी", fat: "15 ग्राम", category: "meat" },
    { id: '5', title: "हर्ब्स के साथ ग्रिल्ड चिकन", description: "ताज़ी जड़ी-बूटियों के मिश्रण के साथ रसदार ग्रिल्ड चिकन।", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 कैलोरी", fat: "8 ग्राम", category: "meat" },
    { id: '9', title: "शहद में ग्लेज़्ड चिकन", description: "शहद की मिठास के साथ चिकन का बेहतरीन स्वाद।", image: require('../assets/images/pollo.jpg'), calories: "240 कैलोरी", fat: "12 ग्राम", category: "meat" },
    { id: '10', title: "मसालेदार चिकन विंग्स", description: "चटपटे मसाले में लिपटे चिकन विंग्स, पार्टियों के लिए परफेक्ट।", image: require('../assets/images/wins.jpg'), calories: "310 कैलोरी", fat: "22 ग्राम", category: "meat" },
  
    // बीफ रेसिपी
    { id: '2', title: "वील मीटबॉल्स", description: "मुलायम और स्वादिष्ट वील मीटबॉल्स।", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 कैलोरी", fat: "18 ग्राम", category: "meat" },
    { id: '6', title: "बीफ स्ट्रोगानोफ़", description: "मशरूम की क्रीमी सॉस में पके हुए बीफ के स्लाइस।", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 कैलोरी", fat: "20 ग्राम", category: "meat" },
    { id: '11', title: "बीफ टाकोस", description: "मैक्सिकन स्टाइल में बीफ से भरे टाकोस।", image: require('../assets/images/beftacos.jpg'), calories: "280 कैलोरी", fat: "15 ग्राम", category: "meat" },
    { id: '12', title: "बीफ और मशरूम पाई", description: "बीफ और मशरूम से भरपूर स्वादिष्ट पाई।", image: require('../assets/images/pi.jpg'), calories: "350 कैलोरी", fat: "25 ग्राम", category: "meat" },
  
    // शाकाहारी रेसिपी
    { id: '4', title: "वेजिटेबल लसग्ना", description: "ताज़ी सब्जियों और ग्रेटेड मोज़रेला के साथ।", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 कैलोरी", fat: "10 ग्राम", category: "vegetarian" },
    { id: '7', title: "स्टफ्ड बेल पेपर्स", description: "सब्जियों और चावल के मिश्रण से भरी रंग-बिरंगी शिमला मिर्च।", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 कैलोरी", fat: "3 ग्राम", category: "vegetarian" },
    { id: '13', title: "ग्रिल्ड वेजिटेबल स्केवर्स", description: "मिश्रित सब्जियों के साथ ग्रिल्ड सींख।", image: require('../assets/images/spiss.jpg'), calories: "100 कैलोरी", fat: "2 ग्राम", category: "vegetarian" },
    { id: '14', title: "बैंगन परमेसन", description: "मैरिनारा और चीज़ के साथ परतों में बैंगन।", image: require('../assets/images/tres.jpg'), calories: "220 कैलोरी", fat: "12 ग्राम", category: "vegetarian" },
  
    // मिठाइयाँ
    { id: '3', title: "ओट और केला कुकीज़", description: "स्वस्थ और स्वादिष्ट ओट और केला कुकीज़।", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 कैलोरी", fat: "5 ग्राम", category: "dessert" },
    { id: '8', title: "चॉकलेट ब्राउनी", description: "गहरे चॉकलेट ब्राउनी में मुलायम केंद्र।", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 कैलोरी", fat: "25 ग्राम", category: "dessert" },
    { id: '15', title: "स्ट्रॉबेरी चीज़केक", description: "ताज़ी स्ट्रॉबेरी से सजाया हुआ क्रीमी चीज़केक।", image: require('../assets/images/cake.jpg'), calories: "320 कैलोरी", fat: "18 ग्राम", category: "dessert" },
    { id: '16', title: "नींबू की टार्ट", description: "कुरकुरी परत के साथ ताज़ा नींबू की टार्ट।", image: require('../assets/images/lemon.jpg'), calories: "210 कैलोरी", fat: "12 ग्राम", category: "dessert" },
  ],
  el: [
    // Συνταγές με Κοτόπουλο
    { id: '1', title: "Σπιτικές Κροκέτες Κοτόπουλου", description: "Νόστιμες και τραγανές κροκέτες κοτόπουλου, ιδανικές για κάθε γεύμα.", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 θερμίδες", fat: "15γρ", category: "meat" },
    { id: '5', title: "Κοτόπουλο στη Σχάρα με Μυρωδικά", description: "Ζουμερό κοτόπουλο στη σχάρα με μείγμα φρέσκων μυρωδικών.", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 θερμίδες", fat: "8γρ", category: "meat" },
    { id: '9', title: "Κοτόπουλο με Μέλι", description: "Γλυκό και νόστιμο κοτόπουλο γλασαρισμένο με μέλι.", image: require('../assets/images/pollo.jpg'), calories: "240 θερμίδες", fat: "12γρ", category: "meat" },
    { id: '10', title: "Πικάντικες Φτερούγες Κοτόπουλου", description: "Φτερούγες κοτόπουλου με πικάντικη σάλτσα, ιδανικές για συγκεντρώσεις.", image: require('../assets/images/wins.jpg'), calories: "310 θερμίδες", fat: "22γρ", category: "meat" },
  
    // Συνταγές με Μοσχάρι
    { id: '2', title: "Κεφτεδάκια Μοσχαρίσια", description: "Τρυφερά κεφτεδάκια μοσχαριού μαγειρεμένα στην εντέλεια.", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 θερμίδες", fat: "18γρ", category: "meat" },
    { id: '6', title: "Μοσχαρίσιο Στρογκανόφ", description: "Λωρίδες μοσχαριού μαγειρεμένες σε κρεμώδη σάλτσα μανιταριών.", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 θερμίδες", fat: "20γρ", category: "meat" },
    { id: '11', title: "Tάκος Μοσχαρίσιο", description: "Μεξικάνικα τάκος γεμισμένα με καρυκευμένο μοσχάρι.", image: require('../assets/images/beftacos.jpg'), calories: "280 θερμίδες", fat: "15γρ", category: "meat" },
    { id: '12', title: "Πίτα με Μοσχάρι και Μανιτάρια", description: "Αλμυρή πίτα γεμιστή με μοσχάρι και μανιτάρια σε πλούσια σάλτσα.", image: require('../assets/images/pi.jpg'), calories: "350 θερμίδες", fat: "25γρ", category: "meat" },
  
    // Χορτοφαγικές Συνταγές
    { id: '4', title: "Λαζάνια με Λαχανικά", description: "Με φρέσκα λαχανικά και γρατιναρισμένη μοτσαρέλα.", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 θερμίδες", fat: "10γρ", category: "vegetarian" },
    { id: '7', title: "Γεμιστές Πιπεριές", description: "Πολύχρωμες πιπεριές γεμιστές με μείγμα λαχανικών και ρυζιού.", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 θερμίδες", fat: "3γρ", category: "vegetarian" },
    { id: '13', title: "Σουβλάκια Λαχανικών στη Σχάρα", description: "Σουβλάκια με ποικιλία λαχανικών ψημένα στη σχάρα.", image: require('../assets/images/spiss.jpg'), calories: "100 θερμίδες", fat: "2γρ", category: "vegetarian" },
    { id: '14', title: "Μελιτζάνα Παρμεζάνα", description: "Στρώσεις μελιτζάνας πανέ με σάλτσα ντομάτας και τυρί.", image: require('../assets/images/tres.jpg'), calories: "220 θερμίδες", fat: "12γρ", category: "vegetarian" },
  
    // Επιδόρπια
    { id: '3', title: "Μπισκότα Βρώμης και Μπανάνας", description: "Υγιεινά και νόστιμα μπισκότα με βρώμη και μπανάνα.", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 θερμίδες", fat: "5γρ", category: "dessert" },
    { id: '8', title: "Μπράουνι Σοκολάτας", description: "Πλούσιο μπράουνι σοκολάτας με μαλακό κέντρο.", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 θερμίδες", fat: "25γρ", category: "dessert" },
    { id: '15', title: "Cheesecake με Φράουλες", description: "Κρεμώδες cheesecake με φρέσκες φράουλες.", image: require('../assets/images/cake.jpg'), calories: "320 θερμίδες", fat: "18γρ", category: "dessert" },
    { id: '16', title: "Λεμονόπιτα", description: "Δροσερή λεμονόπιτα με τραγανή βάση.", image: require('../assets/images/lemon.jpg'), calories: "210 θερμίδες", fat: "12γρ", category: "dessert" },
  ],
  nl: [
    // Kipgerechten
    { id: '1', title: "Zelfgemaakte Kippenkroketten", description: "Heerlijke en krokante kippenkroketten, perfect voor elke maaltijd.", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 kcal", fat: "15g", category: "meat" },
    { id: '5', title: "Gegrilde Kip met Kruiden", description: "Sappige gegrilde kipfilet met een mix van verse kruiden.", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 kcal", fat: "8g", category: "meat" },
    { id: '9', title: "Honing Geglaceerde Kip", description: "Zoete en hartige kip geglaceerd met honing.", image: require('../assets/images/pollo.jpg'), calories: "240 kcal", fat: "12g", category: "meat" },
    { id: '10', title: "Pittige Kip Vleugels", description: "Kippenvleugels in een pittige saus, ideaal voor feestjes.", image: require('../assets/images/wins.jpg'), calories: "310 kcal", fat: "22g", category: "meat" },
  
    // Runderrecepten
    { id: '2', title: "Kalfsvleesballetjes", description: "Malse kalfsvleesballetjes perfect bereid.", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 kcal", fat: "18g", category: "meat" },
    { id: '6', title: "Beef Stroganoff", description: "Malse runderreepjes in een romige champignonsaus.", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 kcal", fat: "20g", category: "meat" },
    { id: '11', title: "Beef Tacos", description: "Mexicaanse taco's gevuld met gekruid rundvlees.", image: require('../assets/images/beftacos.jpg'), calories: "280 kcal", fat: "15g", category: "meat" },
    { id: '12', title: "Beef en Champignon Taart", description: "Hartige taart gevuld met rundvlees en champignons in een rijke saus.", image: require('../assets/images/pi.jpg'), calories: "350 kcal", fat: "25g", category: "meat" },
  
    // Vegetarische Gerechten
    { id: '4', title: "Groente Lasagne", description: "Met verse groenten en gratin mozzarella kaas.", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 kcal", fat: "10g", category: "vegetarian" },
    { id: '7', title: "Gevulde Paprika's", description: "Kleurrijke paprika's gevuld met een mix van groenten en rijst.", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 kcal", fat: "3g", category: "vegetarian" },
    { id: '13', title: "Gegrilde Groentespiesjes", description: "Spiesjes met diverse groenten, gegrild tot perfectie.", image: require('../assets/images/spiss.jpg'), calories: "100 kcal", fat: "2g", category: "vegetarian" },
    { id: '14', title: "Aubergine Parmezaan", description: "Laagjes gepaneerde aubergine met marinara en kaas.", image: require('../assets/images/tres.jpg'), calories: "220 kcal", fat: "12g", category: "vegetarian" },
  
    // Desserts
    { id: '3', title: "Havermout en Banaan Koekjes", description: "Gezonde en smakelijke havermout en banaan koekjes.", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 kcal", fat: "5g", category: "dessert" },
    { id: '8', title: "Chocolade Brownie", description: "Rijke chocolade brownie met een smeuïg hart.", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 kcal", fat: "25g", category: "dessert" },
    { id: '15', title: "Aardbeien Cheesecake", description: "Romige cheesecake met verse aardbeien.", image: require('../assets/images/cake.jpg'), calories: "320 kcal", fat: "18g", category: "dessert" },
    { id: '16', title: "Citroentaart", description: "Een verfrissende citroentaart met een krokante korst.", image: require('../assets/images/lemon.jpg'), calories: "210 kcal", fat: "12g", category: "dessert" },
  ],
  sl: [
    // Recepti s Piščancem
    { id: '1', title: "Domači Piščančji Kroketi", description: "Okusni in hrustljavi piščančji kroketi, odlični za vsak obrok.", image: require('../assets/images/traditional-spanish-fried-croquettes-wooden-table_123827-22907.jpg'), calories: "220 kcal", fat: "15g", category: "meat" },
    { id: '5', title: "Piščanec na Žaru z Zelišči", description: "Sočna piščančja prsa na žaru z mešanico svežih zelišč.", image: require('../assets/images/grilled-chicken.jpg'), calories: "180 kcal", fat: "8g", category: "meat" },
    { id: '9', title: "Piščanec z Medom", description: "Sladko in okusno piščančje meso v medu.", image: require('../assets/images/pollo.jpg'), calories: "240 kcal", fat: "12g", category: "meat" },
    { id: '10', title: "Pikantna Piščančja Krilca", description: "Piščančja krilca v pikantni omaki, odlična za druženja.", image: require('../assets/images/wins.jpg'), calories: "310 kcal", fat: "22g", category: "meat" },
  
    // Recepti z Govedino
    { id: '2', title: "Goveje Mesne Kroglice", description: "Nežne mesne kroglice iz govejega mesa, popolno kuhane.", image: require('../assets/images/meatballs-green-peas-carrot-with-tomato-sauce-wooden-table_123827-30867.jpg'), calories: "250 kcal", fat: "18g", category: "meat" },
    { id: '6', title: "Goveji Stroganoff", description: "Goveji trakovi kuhani v kremni gobovi omaki.", image: require('../assets/images/beef-stroganoff.jpg'), calories: "300 kcal", fat: "20g", category: "meat" },
    { id: '11', title: "Goveji Tacos", description: "Mehiški tacos s začinjeno govedino.", image: require('../assets/images/beftacos.jpg'), calories: "280 kcal", fat: "15g", category: "meat" },
    { id: '12', title: "Pita z Govedino in Gobami", description: "Slana pita, polnjena z govedino in gobami v bogati omaki.", image: require('../assets/images/pi.jpg'), calories: "350 kcal", fat: "25g", category: "meat" },
  
    // Vegetarijanski Recepti
    { id: '4', title: "Zelenjavna Lazanja", description: "Sveža zelenjava in gratiniran mozzarella sir.", image: require('../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg'), calories: "200 kcal", fat: "10g", category: "vegetarian" },
    { id: '7', title: "Polnjene Paprike", description: "Pisane paprike, polnjene z mešanico zelenjave in riža.", image: require('../assets/images/stuffed-bell-peppers.jpg'), calories: "120 kcal", fat: "3g", category: "vegetarian" },
    { id: '13', title: "Zelenjavni Nabodala na Žaru", description: "Nabodala z različnimi zelenjavami, pečena na žaru.", image: require('../assets/images/spiss.jpg'), calories: "100 kcal", fat: "2g", category: "vegetarian" },
    { id: '14', title: "Jajčevec Parmezan", description: "Sloji paniranega jajčevca z omako marinara in sirom.", image: require('../assets/images/tres.jpg'), calories: "220 kcal", fat: "12g", category: "vegetarian" },
  
    // Sladice
    { id: '3', title: "Piškoti z Ovsom in Bananami", description: "Zdravi in okusni piškoti z ovsom in bananami.", image: require('../assets/images/pile-cookie-oatmeal-bowl-half-cut-orange-grey-surface_114579-64491-1.jpg'), calories: "150 kcal", fat: "5g", category: "dessert" },
    { id: '8', title: "Čokoladni Brownie", description: "Bogati čokoladni brownie z mehkim centrom.", image: require('../assets/images/chocolate-brownie.jpg'), calories: "400 kcal", fat: "25g", category: "dessert" },
    { id: '15', title: "Jagodna Cheesecake", description: "Kremast cheesecake z svežimi jagodami.", image: require('../assets/images/cake.jpg'), calories: "320 kcal", fat: "18g", category: "dessert" },
    { id: '16', title: "Limonin Tart", description: "Osvežujoč limonin tart s hrustljavo skorjo.", image: require('../assets/images/lemon.jpg'), calories: "210 kcal", fat: "12g", category: "dessert" },
  ]
     




  // Puedes agregar más idiomas siguiendo el mismo formato
};




  const FoodMosal = ({  isNightMode, visible, onClose, }) => {
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
  const [chipsModalVisible, setIschipsModalVisible] = useState(false);

  const [isSubscribed, setIsSubscribed] = useState(false);

  const [activeCategory, setActiveCategory] = useState(''); // Estado para la categoría activa
  const categories = [
    { key: 'meat', label: '', icon: 'fast-food-outline' },
    { key: 'vegetarian', label: '', icon: 'leaf-outline' },
    { key: 'dessert', label: '', icon: 'ice-cream-outline' },
  ];

  // Configura el idioma según el valor de `deviceLanguage` o en inglés por defecto
  const language = deviceLanguage || 'en';

  // Accede a las recetas según el idioma y organiza por categorías
  const categorizedRecipes = categories.reduce((acc, category) => {
    const recipesInLanguage = DogRecep[language] || [];
    acc[category.key] = recipesInLanguage.filter(recipe => recipe.category === category.key);
    return acc;
  }, {});

  // Función de desplazamiento a la sección y actualización de la categoría activa
  const scrollToSection = (key) => {
    setActiveCategory(key);
    sectionRefs[key].current?.measureLayout(
      scrollViewRef.current,
      (x, y) => {
        scrollViewRef.current.scrollTo({ y, animated: true });
      }
    );
  };

  const sectionRefs = {
    meat: useRef(null),
    vegetarian: useRef(null),
    dessert: useRef(null),
  };

  

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
  en: "Recipes",
  es: "Recetas",
  fr: "Recettes",
  de: "Rezepte",
  it: "Ricette",
  tr: "Tarifler",
  pt: "Receitas",
  ru: "Рецепты",
  ja: "レシピ",
  zh: "食谱",
  pl: "Przepisy",
  sv: "Recept",
  hu: "Receptek",
  ar: "وصفات",
  hi: "रेसिपीज़",
  el: "Συνταγές",
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
 

      {/* Barra de navegación para hacer autoscroll entre categorías con íconos */}
      <View style={styles.navBar}>
        {categories.map((cat) => (
          <TouchableOpacity 
            key={cat.key} 
            onPress={() => {
              scrollToSection(cat.key);
              setActiveCategory(cat.key); // Marca la categoría activa
            }}
            style={[
              styles.navButton, 
              activeCategory === cat.key && styles.activeNavButton // Resalta botón activo
            ]}
          >
            {/* Ícono de la categoría */}
            <Ionicons
              name={cat.icon} // Usa el ícono correspondiente a la categoría
              size={34}
              color={activeCategory === cat.key ? '#FFFFFF' : isNightMode ? '#FFFFFF' : 'grey'} // Color del ícono activo
            />
            {/* Etiqueta de la categoría */}
        
          </TouchableOpacity>
          
        ))}
        <TouchableOpacity onPress={() => setIschipsModalVisible(false)}>
          <Ionicons name="close"  size={24}  color={isNightMode ? "#000000" : "#FFFFFF"} style={styles.navButton} />
        </TouchableOpacity>
      </View>

      {/* Contenido del modal con ScrollView y FlatList */}
      <ScrollView ref={scrollViewRef} style={styles.scrollContainer}>
        {categories.map((cat) => (
          <View key={cat.key} ref={sectionRefs[cat.key]} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{cat.label}</Text>
            
            <FlatList
              data={categorizedRecipes[cat.key]}
              keyExtractor={(item) => item.id}
              numColumns={1} // Cambiado a 1 para mostrar solo una receta por fila
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipListContainer}
              renderItem={({ item }) => {
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
                    onPress={handlePress}
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
        ))}
      </ScrollView>
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
      borderRadius: 20,  
      padding:10,
      paddingBottom:100,

    },
    inputContainer: {
      marginTop: 40,
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
  marginTop:40,
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
  margin: 3, // Espacio entre tarjetas
  borderRadius: 10,
  overflow: 'hidden',
  backgroundColor: theme.backgroundnuevo,
  borderWidth: 1,
  borderColor: theme.text,
  padding: 10, // Tamaño del contenido de la tarjeta
  marginTop:20,
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
  color: theme.text, 
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
  backgroundColor: '#3b5998',  // Color de fondo del botón
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

navBar: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  paddingVertical: 10,

  borderRadius:50,
  marginTop:-10,
},
navText: {
  fontSize: 16,
  padding:10,
  color: theme.text, 
  padding:10,
  fontFamily: 'Poppins-Regular',
},

activeNavButton: {
  backgroundColor: '#3b5998', // Cambia el color de fondo de la categoría activa
  borderRadius:50,
  padding:10
},
navButton: {

  borderRadius:50,
  padding:10
},

categoryTitle: {

  marginTop:10,

},
chatContainer: {

  marginTop:-40,

},
});

export default FoodMosal;