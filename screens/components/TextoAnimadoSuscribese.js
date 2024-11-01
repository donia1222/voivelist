import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Dimensions } from 'react-native';
import * as RNLocalize from 'react-native-localize';

const TextoAnimado = () => {
  const { width } = Dimensions.get('window');
  const isSmallScreen = width < 375;
  const animatedColor = useRef(new Animated.Value(0)).current;
  const systemLanguage = RNLocalize.getLocales()[0]?.languageCode || 'en';

  // Define los textos en diferentes idiomas
  const textTranslations = {
    en: "REMOVE ADS",
    es: "ELIMINAR ANUNCIOS",
    de: "WERBUNG ENTFERNEN",
    fr: "SUPPRIMER LES ANNONCES",
    it: "RIMUOVI GLI ANNUNCI",
    tr: "REKLAMLARI KALDIR",
    pt: "REMOVER ANÚNCIOS",
    ru: "УДАЛИТЬ РЕКЛАМУ",
    zh: "删除广告",
    ja: "広告を削除",
    pl: "USUŃ REKLAMY",
    sv: "TA BORT ANNONSER",
    hu: "HIRDETÉSEK ELTÁVOLÍTÁSA",
    ar: "إزالة الإعلانات",
    hi: "विज्ञापन हटाएं",
    el: "ΑΦΑΙΡΕΣΤΕ ΔΙΑΦΗΜΙΣΕΙΣ"
  };
  
  

  const translatedText = textTranslations[systemLanguage] || textTranslations.en;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedColor, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.ease),
      }),
    ).start();
  }, [animatedColor]);

  const colorInterpolado = animatedColor.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1, 1.25 ],
    outputRange: ['#2942b8', '#20ac9f', '#8353da', '#c718a6', '#34363f','#c718a6', ],
  });


  if (isSmallScreen) {
    // No renderizar el componente en pantallas pequeñas como el iPhone SE
    return null;
  }

  return (
      <Animated.Text style={{
        color: colorInterpolado,
        fontSize: 21,
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
        marginTop: 125,
        marginBottom: 10,
        borderWidth: 2, // Establece el ancho del borde
        borderColor: colorInterpolado, // Utiliza el mismo color interpolado para el borde
        borderRadius: 20, // Establece el radio del borde
        padding: 5, // Agrega padding para separar el texto del borde
        width: 300, // Establece el ancho del contenedor
      }}>
        {translatedText}
      </Animated.Text>
  );
};

export default TextoAnimado;
