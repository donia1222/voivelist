import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Text, Dimensions, StyleSheet, FlatList, Platform } from 'react-native';
import * as Localization from 'expo-localization';

const { width, height } = Dimensions.get('window');

const carouselData = [
    {
        image: require('../../assets/images/bloqueador-de-anuncios.png'),
        title: {
            en: "SUBSCRIBE",
            es: "SUSCRÍBETE",
            de: "ABONNIEREN ",
            fr: "S'ABONNER",
            it: "ISCRIVITI",
            tr: "ABONE OL",
            pt: "ASSINAR",
            ru: "ПОДПИСАТЬСЯ",
            zh: "订阅",
            ja: "サブスクライブ", 
            pl: "SUBSKRYBUJ",
            sv: "PRENUMERERA",
            hu: "FELIRATKOZÁS",
            ar: "اشترك",
            hi: "सदस्यता लें",
            el: "ΕΓΓΡΑΦΕΙΤΕ"
          },
          description: {
            en: 'Subscribe to make your shopping lists without distractions.',
            es: 'Suscríbete para hacer tus listas de compras sin distracciones.',
            de: 'Abonnieren Sie, um Ihre Einkaufslisten ohne Ablenkungen zu erstellen.',
            fr: 'Abonnez-vous pour faire vos listes de courses sans distractions.',
            it: 'Abbonati per fare le tue liste della spesa senza distrazioni.',
            tr: 'Alışveriş listelerinizi dikkat dağılmadan yapmak için abone olun.',
            pt: 'Assine para fazer suas listas de compras sem distrações.',
            ru: 'Подпишитесь, чтобы составлять списки покупок без отвлечений.',
            zh: '订阅以在没有干扰的情况下制定购物清单。',
            ja: '気を散らさずに買い物リストを作成するには購読してください。',
            pl: 'Subskrybuj, aby tworzyć listy zakupów bez rozpraszania uwagi.',
            sv: 'Prenumerera för att göra dina inköpslistor utan distraktioner.',
            hu: 'Iratkozz fel, hogy zavartalanul elkészíthesd a bevásárlólistáidat.',
            ar: 'اشترك لعمل قوائم التسوق الخاصة بك دون تشتيت.',
            hi: 'बिना किसी ध्यान भटकाए अपनी खरीदारी सूची बनाने के लिए सदस्यता लें।',
            el: 'Εγγραφείτε για να φτιάξετε τις λίστες αγορών σας χωρίς περισπασμούς.',
            nl: 'Abonneer u om uw boodschappenlijsten zonder afleiding te maken.',
            sl: 'Naročite se, da boste svoje nakupovalne sezname naredili brez motenj.',
            // ... otros idiomas ...
          },
      },
];

const Carousel = () => {
  const deviceLanguage = Localization.locale.split('-')[0];
  const ref = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);


  const handleScroll = (event) => {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const newIndex = Math.round(contentOffsetX / width);
      if (newIndex !== currentIndex) {
          setCurrentIndex(newIndex);
      }
  };

  const renderItem = ({ item }) => (
      <View style={styles.itemContainer}>
   
          <View style={styles.textContainer}>
              <Text style={styles.titleText}>{item.title[deviceLanguage]}</Text>
              <Text style={styles.descriptionText}>{item.description[deviceLanguage]}</Text>
          </View>
      </View>
  );

  const renderPagination = () => (
      <View style={styles.paginationContainer}>
          {carouselData.map((_, index) => (
              <View key={index} style={[styles.paginationDot, index === currentIndex && styles.paginationDotActive]} />
          ))}
      </View>
  );

  return (
      <View style={styles.carouselContainer}>
          <FlatList
              ref={ref}
              data={carouselData}
              keyExtractor={(_, index) => index.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              renderItem={renderItem}
          />
          {renderPagination()}
      </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   maxHeight:150,
  },
  itemContainer: {
      flexDirection: 'row',
      width,
      height: height * 0.1,
      alignItems: 'center',
      borderRadius: 0,
      alignSelf: 'center',
      backgroundColor:'#73c5e98a',
  },
  iconStyle: {
      width: 60,
      height: 60,
      marginHorizontal: 10,
      borderRadius: 10,
      marginLeft:20,
 
  },
  textContainer: {
      justifyContent: 'center',
      padding: 10,
      maxWidth: width * 0.7,

  },
  titleText: {
      fontSize: 21,
      color: '#06405a',
      marginTop: 15,
      marginLeft:20,
      fontFamily: 'Poppins-Bold'
  },
  descriptionText: {
      fontSize: 15,
      color: '#06405a',
      paddingVertical: 5,
      fontFamily: 'Poppins-Regular',
      width:250,
      marginLeft:20,
  },
  paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 5,
      marginBottom: 10,
  },
  paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 5,
  },

});

export default Carousel;