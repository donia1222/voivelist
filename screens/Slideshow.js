import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import * as RNLocalize from "react-native-localize";
// Importa las imágenes desde el directorio local
import backgroundImage1 from '../assets/images/fresh-homemade-lasagna-leafs-plate-generative-ai_188544-8132.jpg';
import backgroundImage2 from '../assets/images/beef-stroganoff.jpg';
import backgroundImage3 from '../assets/images/chocolate-brownie.jpg';

const { width } = Dimensions.get('window');

const deviceLanguage = RNLocalize.getLocales()[0].languageCode;

const HeaderComponent = () => {
  const placeholdersi = {
    en: "Generate recipes with a shopping list",
    es: "Genera recetas con una lista de compra",
    de: "Rezepte mit einer Einkaufsliste generieren",
    fr: "Générez des recettes avec une liste de courses",
    it: "Genera ricette con una lista della spesa",
    tr: "Alışveriş listesiyle tarifler oluşturun",
    pt: "Gere receitas com uma lista de compras",
    ru: "Создавайте рецепты со списком покупок",
    ja: "買い物リスト付きのレシピを作成する",
    zh: "生成带购物清单的食谱",
    pl: "Generuj przepisy z listą zakupów",
    sv: "Generera recept med en inköpslista",
    hu: "Készíts recepteket bevásárlólistával",
    ar: "قم بإنشاء وصفات مع قائمة تسوق",
    hi: "खरीदारी सूची के साथ व्यंजन तैयार करें",
    el: "Δημιουργήστε συνταγές με λίστα αγορών",
    nl: "Genereer recepten met een boodschappenlijst",
    sl: "Ustvarite recepte z nakupovalnim seznamom"
  };

  // Array de imágenes de fondo
  const images = [backgroundImage1, backgroundImage2, backgroundImage3];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  
  // Animated values para opacidad
  const fadeAnim1 = useRef(new Animated.Value(1)).current; // Imagen actual visible
  const fadeAnim2 = useRef(new Animated.Value(0)).current; // Imagen siguiente invisible

  // Animated values para escala
  const scaleAnim1 = useRef(new Animated.Value(1)).current; // Escala inicial de la primera imagen
  const scaleAnim2 = useRef(new Animated.Value(1)).current; // Escala inicial de la segunda imagen

  // Flag para alternar entre las dos imágenes
  const [isFirstImageActive, setIsFirstImageActive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Iniciar las animaciones de desvanecimiento y zoom
      Animated.parallel([
        // Animaciones de opacidad
        Animated.timing(isFirstImageActive ? fadeAnim1 : fadeAnim2, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(isFirstImageActive ? fadeAnim2 : fadeAnim1, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        // Animaciones de escala
        Animated.timing(isFirstImageActive ? scaleAnim1 : scaleAnim2, {
          toValue: 0.95, // Zoom hacia adentro
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(isFirstImageActive ? scaleAnim2 : scaleAnim1, {
          toValue: 1, // Volver a la escala original
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Resetear la escala de la imagen que desapareció
        if (isFirstImageActive) {
          scaleAnim1.setValue(1);
        } else {
          scaleAnim2.setValue(1);
        }

        // Actualizar índices después de la animación
        setCurrentImageIndex(nextImageIndex);
        setNextImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        // Alternar el flag para la próxima animación
        setIsFirstImageActive(!isFirstImageActive);
      });
    }, 2000); // Intervalo de 4 segundos entre transiciones

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar
  }, [fadeAnim1, fadeAnim2, scaleAnim1, scaleAnim2, isFirstImageActive, nextImageIndex, images.length]);

  return (
    <View style={styles.container}>
      {/* Primera Imagen Animada */}
      <Animated.Image 
        source={images[currentImageIndex]}
        style={[
          styles.backgroundImage, 
          { 
            opacity: isFirstImageActive ? fadeAnim1 : fadeAnim2,
            transform: [{ scale: isFirstImageActive ? scaleAnim1 : scaleAnim2 }]
          }
        ]}
        resizeMode="cover"
      />

      {/* Segunda Imagen Animada */}
      <Animated.Image 
        source={images[nextImageIndex]}
        style={[
          styles.backgroundImage, 
          { 
            opacity: isFirstImageActive ? fadeAnim2 : fadeAnim1,
            transform: [{ scale: isFirstImageActive ? scaleAnim2 : scaleAnim1 }]
          }
        ]}
        resizeMode="cover"
      />

      {/* Efecto Blur Solo en la Parte Inferior */}
      <BlurView style={styles.blurEffect} blurType="light" blurAmount={10} />

      {/* Título y Subtítulo en la Sección Blur */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{placeholdersi[deviceLanguage] || placeholdersi.en}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.9, // Ancho responsivo
    height: 250, // Altura fija para el encabezado
    borderRadius: 20, 
    overflow: 'hidden', // Para asegurar que el borde redondeado funcione con los hijos
    position: 'relative',
    alignItems: 'center',
    marginTop: -30,
  },
  backgroundImage: {
    width: '100%',
    height: '100%', // Cubrir todo el contenedor
    position: 'absolute',
    top: 0,
    left: 0,
  },
  blurEffect: {
    position: 'absolute',
    bottom: 0, // Posicionar el blur en la parte inferior
    width: '100%',
    height: 100, // Ajustar la altura del efecto blur según sea necesario
  },
  textContainer: {
    position: 'absolute',
    bottom: 25, // Posicionar el texto sobre el efecto de desenfoque
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
    marginTop: 5,
  },
});

export default HeaderComponent;
