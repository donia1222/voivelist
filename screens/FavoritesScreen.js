import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../ThemeContext';
import * as RNLocalize from 'react-native-localize';

// Traducciones
const translations = {
  en: {
    noFavorites: "No favorites",
    goHome: "Back",
  },
  es: {
    noFavorites: "No hay favoritos",
    goHome: "Volver",
  },
  de: {
    noFavorites: "Keine Favoriten",
    goHome: "Zurück",
  },
  it: {
    noFavorites: "Nessun preferito",
    goHome: "Indietro",
  },
  fr: {
    noFavorites: "Pas de favoris",
    goHome: "Retour",
  },
  tr: {
    noFavorites: "Favori yok",
    goHome: "Geri",
  },
  pt: {
    noFavorites: "Sem favoritos",
    goHome: "Voltar",
  },
  ru: {
    noFavorites: "Нет избранного",
    goHome: "Назад",
  },
  ar: {
    noFavorites: "لا توجد مفضلات",
    goHome: "رجوع",
  },
  hu: {
    noFavorites: "Nincsenek kedvencek",
    goHome: "Vissza",
  },
  ja: {
    noFavorites: "お気に入りはありません",
    goHome: "戻る",
  },
  hi: {
    noFavorites: "कोई पसंदीदा नहीं",
    goHome: "वापस",
  },
  nl: {
    noFavorites: "Geen favorieten",
    goHome: "Terug",
  }
};

const FavoritesScreen = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const { theme } = useTheme();
  const styles = getStyles(theme); // Obtain styles based on the theme
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
  const currentTranslations = translations[deviceLanguage] || translations['en'];

  useEffect(() => {
    loadHistory();
    loadFavorites();

    const unsubscribe = navigation.addListener('focus', () => {
      loadHistory();
      loadFavorites();
    });

    return unsubscribe;
  }, [navigation]);

  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('@shopping_history');
      if (savedHistory !== null) {
        setHistory(JSON.parse(savedHistory));
        console.log('History loaded:', JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Error loading history: ", e);
    }
  };

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('@favorites');
      if (savedFavorites !== null) {
        setFavorites(JSON.parse(savedFavorites));
        console.log('Favorites loaded:', JSON.parse(savedFavorites));
      }
    } catch (e) {
      console.error("Error loading favorites: ", e);
    }
  };

  const renderFavoriteItem = ({ item }) => {
    if (!item) {
      return null;
    }
    return (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('HistoryScreen', { listId: item.id })}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Ionicons name="eye-outline" size={26} color="#e91e63" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require('../assets/images/favo.png')}
            style={[styles.emptyListImagenotifi]}
          />
          <Text style={styles.emptyText}>{currentTranslations.noFavorites}</Text>
          <TouchableOpacity 
            style={styles.homeButton} 
            onPress={() => navigation.navigate('HistoryScreen')}
          >
            <Ionicons name="arrow-back" size={22} color="white" style={styles.homeButtonIcon} />
            <Text style={styles.homeButtonText}>{currentTranslations.goHome}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites.map(index => history[index]).filter(item => item !== undefined)}
          renderItem={renderFavoriteItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: theme.text,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3f51b5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,

  },
  homeButtonIcon: {
    marginRight: 8,
  },
  homeButtonText: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
  },
  card: {
    backgroundColor: theme.backgroundtres,
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: theme.text,
  },
  emptyListImagenotifi: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 40,
    marginRight: 10,
  },
});

export default FavoritesScreen;
