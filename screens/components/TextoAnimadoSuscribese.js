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
    en: "SUBSCRIBE NOW",
    es: "SUSCRÍBETE AHORA",
    de: "JETZT ABONNIEREN",
    fr: "ABONNEZ-VOUS MAINTENANT",
    it: "ABBONATI ORA",
    tr: "ŞİMDİ ABONE OL",
    pt: "ASSINE AGORA",
    ru: "ПОДПИШИТЕСЬ СЕЙЧАС",
    zh: "立即订阅",
    ja: "今すぐ購読",
    pl: "ZASUBSKRYBUJ TERAZ",
    sv: "PRENUMERERA NU",
    hu: "IRATKOZZ FEL MOST",
    ar: "اشترك الآن",
    hi: "अभी सदस्यता लें",
    el: "ΕΓΓΡΑΦΕΙΤΕ ΤΩΡΑ"
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
        fontSize: 18,
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
        marginTop: 125,
        marginBottom: 10,
        borderWidth: 1, // Establece el ancho del borde
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
