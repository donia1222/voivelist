import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, FlatList, Alert, Animated, Modal, TextInput, ActivityIndicator, Dimensions, StyleSheet, SectionList  } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Modalize } from 'react-native-modalize';
import { useTheme } from '../ThemeContext';
import texts from './translations/texts';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import getStyles from './Styles/HomeScreenStyles';

const screenHeight = Dimensions.get('window').height;
const API_KEY_ANALIZE = process.env.API_KEY_ANALIZE;

const costEstimatePrompts = {
  en: "You are an assistant that calculates the estimated cost of a shopping list in ${country}. Respond with the total cost.",
  es: "Eres un asistente que calcula el costo estimado de una lista de compras en ${country}. Responde siempre con el costo total o aproximado.",
  // Añade otros idiomas según sea necesario
};

const predefinedItems = {
  en: ["chicken", "bread", "pasta", "potatoes", "bananas", "pears", "peppers", "pineapple",
       "chicken breast", "roast chicken", "breaded chicken", "garlic", "rice", "oats", 
       "oil", "tuna", "sugar", "avocado", "basil", "artichokes", "almonds", "bacon", "eggplant",
       "broccoli", "zucchini", "onion", "pork", "cherry", "mushrooms", "chocolate", "cilantro",
       "cabbage", "cauliflower", "cumin", "ribs", "dates", "peach", "dill", "endive", "asparagus",
       "spinach", "noodles", "strawberries", "beans", "chickpeas", "gelatin", "peas", "figs",
       "eggs", "ham", "ginger", "green beans", "kiwi", "lobster", "lentils", "lemons", "pork loin",
       "corn", "mango", "apples", "butter", "passion fruit", "margarine", "mussels", "mint", "honey",
       "blood sausage", "mustard", "orange", "nectarine", "nuts", "oregano", "paprika", "parmesan",
       "raisins", "cucumber", "parsley", "fish", "pepper", "pine nuts", "cheese", "radish", "celery sticks",
       "beet", "rosemary", "arugula", "salt", "sausages", "salmon", "watermelon", "sardines",
       "sunflower seeds", "soy", "tomato", "trout", "grapes", "vanilla", "vinegar", "yogurt", "carrot",
       "pumpkin", "orange juice", "pineapple juice", "peas", "sweet potato", "anchovies", "squid",
       "shrimp", "cinnamon", "crab", "caviar", "beer", "green peas", "custard apple", "coconut",
       "curly kale", "pork ribs", "cream", "sour cream", "croquettes", "plums", "shredded coconut",
       "quail", "pastry cream", "curd", "caramel", "puff pastry", "endive", "prawns", "waffles",
       "burgers", "flour", "ice cream", "hummus", "milk", "lemonade", "macaroni", "peanut", "mayonnaise",
       "melon", "hake", "mozzarella", "cream", "oysters", "hearts of palm", "bacon", "cake", "turkey breast",
       "sunflower seeds", "cream cheese", "quiche", "ravioli", "barbecue sauce", "canned sardines", "mushrooms",
       "fish soup", "tea", "green tea", "beef", "omelet", "nougat", "wine", "white wine", "red wine", "vodka",
       "wafers", "baby carrots"],
  es: ["pollo", "pan", "pasta", "papas", "plátanos", "peras", "pimientos", "piña",
       "pechuga de pollo", "pollo asado", "pollo empanizado", "ajo", "arroz", "avena", 
       "aceite", "atún", "azúcar", "aguacate", "albahaca", "alcachofas", "almendras",
       "bacon", "berenjena", "brócoli", "calabacín", "cebolla", "cerdo", "cereza", "champiñones",
       "chocolate", "cilantro", "col", "coliflor", "comino", "costillas", "dátiles", "durazno",
       "eneldo", "endivia", "espárragos", "espinacas", "fideos", "fresas", "frijoles", "garbanzos",
       "gelatina", "guisantes", "higos", "huevos", "jamón", "jengibre", "judías verdes", "kiwi",
       "langosta", "lentejas", "limones", "lomo de cerdo", "maíz", "mango", "manzanas", "mantequilla",
       "maracuyá", "margarina", "mejillones", "menta", "miel", "morcilla", "mostaza", "naranja",
       "nectarina", "nueces", "orégano", "paprika", "parmesano", "pasas", "pepino", "perejil",
       "pescado", "pimienta", "piñones", "queso", "rábano", "ramitas de apio", "remolacha",
       "romero", "rúcula", "sal", "salchichas", "salmón", "sandía", "sardinas", "semillas de girasol",
       "setas", "soja", "tomate", "trucha", "uvas", "vainilla", "vinagre", "yogur", "zanahoria",
       "zapallo", "zumo de naranja", "zumo de piña", "arvejas", "batata", "berenjena", "boquerones",
       "calamares", "camarones", "canela", "cangrejo", "caviar", "cerveza", "chicharos", "chirimoya",
       "cilantro", "clavo de olor", "coco", "col rizada", "costillas de cerdo", "crema de leche",
       "crema agria", "croquetas", "dátiles", "frambuesas", "frutillas", "granada", "grosellas",
       "guayaba", "higos", "hinojo", "jalea", "jugo de limón", "kale", "lechuga", "licor", "lima",
       "mandarina", "manteca", "melocotón", "mermelada", "morrones", "nabo", "papaya", "pepitas de calabaza",
       "piña", "pollo al curry", "queso azul", "quinoa", "rape", "riñones", "rúcula", "salsa de soja",
       "sardinas", "solomillo", "sopa", "tacos", "tofu", "tomillo", "trigo", "uvas pasas", "vinagreta",
       "whisky", "yuca", "zarzamoras", "zumo de manzana", "agua", "agua con gas", "alcaparras", "almejas",
       "alubias", "anchoas", "arepas", "bacalao", "café", "carne de res", "cereales", "chile", "chocolate blanco",
       "chorizo", "ciruelas", "coco rallado", "codorniz", "crema pastelera", "cuajada", "dulce de leche",
       "empanadas", "escarola", "gambas", "gofres", "hamburguesas", "harina", "helado", "hummus", "leche",
       "limonada", "macarrones", "maní", "mayonesa", "melón", "merluza", "mozzarella", "nata", "ostras",
       "palmitos", "panceta", "pastel", "pechuga de pavo", "pepitas de girasol", "queso crema", "quiche",
       "ravioles", "salsa barbacoa", "sardinas en lata", "setas", "sopa de pescado", "té", "té verde",
       "ternera", "tortilla", "turrón", "vino", "vino blanco", "vino tinto", "vodka", "wafles", "zamburiñas",
       "zanahorias baby"],
  de: ["Hähnchen", "Brot", "Nudeln", "Kartoffeln", "Bananen", "Birnen", "Paprika", "Ananas",
       "Hähnchenbrust", "Brathähnchen", "Panierte Hähnchen", "Knoblauch", "Reis", "Hafer", 
       "Öl", "Thunfisch", "Zucker", "Avocado", "Basilikum", "Artischocken", "Mandeln", "Speck", "Aubergine",
       "Brokkoli", "Zucchini", "Zwiebel", "Schweinefleisch", "Kirsche", "Pilze", "Schokolade", "Koriander",
       "Kohl", "Blumenkohl", "Kreuzkümmel", "Rippchen", "Datteln", "Pfirsich", "Dill", "Endivie", "Spargel",
       "Spinat", "Nudeln", "Erdbeeren", "Bohnen", "Kichererbsen", "Gelatine", "Erbsen", "Feigen", "Eier",
       "Schinken", "Ingwer", "Grüne Bohnen", "Kiwi", "Hummer", "Linsen", "Zitronen", "Schweinelende",
       "Mais", "Mango", "Äpfel", "Butter", "Passionsfrucht", "Margarine", "Muscheln", "Minze", "Honig",
       "Blutwurst", "Senf", "Orange", "Nektarine", "Nüsse", "Oregano", "Paprika", "Parmesan", "Rosinen",
       "Gurke", "Petersilie", "Fisch", "Pfeffer", "Pinienkerne", "Käse", "Radieschen", "Selleriestangen",
       "Rübe", "Rosmarin", "Rucola", "Salz", "Würstchen", "Lachs", "Wassermelone", "Sardinen", "Sonnenblumenkerne",
       "Soja", "Tomate", "Forelle", "Trauben", "Vanille", "Essig", "Joghurt", "Karotte", "Kürbis", "Orangensaft",
       "Ananassaft", "Erbsen", "Süßkartoffel", "Sardellen", "Tintenfisch", "Garnelen", "Zimt", "Krabbe",
       "Kaviar", "Bier", "Grüne Erbsen", "Kakis", "Kokosnuss", "Grünkohl", "Schweinerippchen", "Sahne",
       "Saure Sahne", "Kroketten", "Pflaumen", "Kokosraspeln", "Wachtel", "Konditorcreme", "Quark",
       "Karamell", "Blätterteig", "Endivie", "Krabben", "Waffeln", "Burger", "Mehl", "Eis", "Hummus",
       "Milch", "Limonade", "Makkaroni", "Erdnuss", "Mayonnaise", "Melone", "Seehecht", "Mozzarella",
       "Sahne", "Austern", "Palmherzen", "Speck", "Kuchen", "Putenbrust", "Sonnenblumenkerne", "Frischkäse",
       "Quiche", "Ravioli", "Barbecuesoße", "Dosen-Sardinen", "Pilze", "Fischsuppe", "Tee", "Grüner Tee",
       "Rindfleisch", "Omelett", "Nougat", "Wein", "Weißwein", "Rotwein", "Wodka", "Waffeln", "Babykarotten"]
};

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme); // Obtén los estilos basados en el tema
  const route = useRoute();
  const initialList = route.params?.initialList;
  const [shoppingList, setShoppingList] = useState([]);
  const [history, setHistory] = useState([]);
  const [listModalVisible, setListModalVisible] = useState(false);
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
  const currentLabels = texts[deviceLanguage] || texts['en'];
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState(null);
  const [estimatedCost, setEstimatedCost] = useState(null);
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [isCountryEmpty, setIsCountryEmpty] = useState(true);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const flatListRef = useRef(null);
  const welcomeModalRef = useRef(null);
  const addProductModalRef = useRef(null);

  useEffect(() => {
    const loadCountry = async () => {
      try {
        const savedCountry = await AsyncStorage.getItem('@country');
        if (savedCountry !== null) {
          setCountry(savedCountry);
          setIsCountryEmpty(savedCountry.trim() === '');
        }
      } catch (error) {
        console.error('Error loading country: ', error);
      }
    };

    loadCountry();
  }, []);

  const handleCountryChange = (text) => {
    setCountry(text);
    setIsCountryEmpty(text.trim() === '');
  };

  const handleSaveCountry = async () => {
    if (!isCountryEmpty) {
      try {
        await AsyncStorage.setItem('@country', country);
        setCountryModalVisible(false);
        await fetchEstimatedCost();

        setTimeout(() => {
          if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }, 200);
      } catch (error) {
        console.error('Error saving country: ', error);
      }
    }
  };

  useEffect(() => {
    if (flatListRef.current && estimatedCost) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [estimatedCost]);

  const fetchEstimatedCost = async () => {
    setLoading(true);
    if (!country) {
      Alert.alert("Error", "Please enter a country.");
      return;
    }

    const estimatePrompt = costEstimatePrompts[deviceLanguage] || costEstimatePrompts['en'];

    try {
      const response = await axios.post(API_KEY_ANALIZE, {
        model: "gpt-3.5-turbo",
        max_tokens: 200,
        messages: [
          {
            role: "system",
            content: estimatePrompt.replace("${country}", country),
          },
          {
            role: "user",
            content: shoppingList.join(", "),
          },
        ],
      });
      const estimatedCostResponse = response.data.choices[0].message.content;
      setEstimatedCost(`Costo estimado: ${estimatedCostResponse}`);
      setLoading(false);

      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    } catch (error) {
      console.error("Error fetching estimated cost: ", error);
      Alert.alert("Error", "Could not fetch the estimated cost.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialList) {
      setShoppingList(initialList);
    }
  }, [initialList]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const historyData = await AsyncStorage.getItem('@shopping_history');
        if (historyData !== null) {
          setHistory(JSON.parse(historyData));
        }
      } catch (error) {
        console.error('Failed to fetch history', error);
      }
    };

    fetchHistory();
  }, []);

  const saveEditedItem = () => {
    const newList = [...shoppingList];
    newList[editingIndex] = editingText;
    setShoppingList(newList);
    saveShoppingList(newList);
    setEditingText('');
    setEditModalVisible(false);
  };

  const editItem = (index) => {
    setEditingIndex(index);
    setEditingText(shoppingList[index]);
    setEditModalVisible(true);
  };

  const addItem = (item) => {
    const newList = [...shoppingList, item];
    setShoppingList(newList);
    saveShoppingList(newList);
  };

  const renderItem = ({ item, index }) => {
    if (item === currentLabels.costdelalista) {
      return (
        <TouchableOpacity onPress={() => setCountryModalVisible(true)}>
          <View style={styles.costButtonContainer}>
            <Text style={styles.costButtonText}>{estimatedCost || item}</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{item}</Text>
        <View style={styles.iconsContainer}>
          <TouchableOpacity onPress={() => editItem(index)}>
            <Ionicons name="pencil" size={24} style={styles.editIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => removeItem(index)}>
            <Ionicons name="close" size={28} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const removeItem = (index) => {
    const newList = [...shoppingList];
    newList.splice(index, 1);
    setShoppingList(newList);
    saveShoppingList(newList);
  };

  const saveShoppingList = async (list) => {
    try {
      await AsyncStorage.setItem('@shopping_list', JSON.stringify(list));
    } catch (e) {
      console.error("Error saving shopping list: ", e);
    }
  };

  const generateGenericListName = () => {
    const existingNumbers = history
      .map(item => {
        const match = item.name.match(/^.* (\d+)$/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter(number => number !== null);

    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    return `List ${nextNumber}`;
  };

  const saveToHistory = async () => {
    if (shoppingList.length === 0) return;

    const newDishName = generateGenericListName();
    const newHistory = [...history, { list: shoppingList, name: newDishName }];

    try {
      await AsyncStorage.setItem('@shopping_history', JSON.stringify(newHistory));
      setHistory(newHistory);
      setShoppingList([]);
      await AsyncStorage.setItem('@shopping_list', JSON.stringify([]));
      setConfirmationModalVisible(true);
      setTimeout(() => setConfirmationModalVisible(false), 2000); // Mostrar el modal de confirmación por 2 segundos
    } catch (e) {
      console.error("Error saving to history: ", e);
    }
  };

  const ConfirmationModal = () => (
    <Modal
      visible={confirmationModalVisible}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.confirmationModalContainer}>
        <View style={styles.confirmationModalContent}>
          <Text style={styles.confirmationText}>Lista guardada correctamente</Text>
        </View>
      </View>
    </Modal>
  );

  const closeModalwelcome = () => {
    welcomeModalRef.current?.close();
    navigation.navigate('InformationScreen');
    welcomeModalRef.current?.close();
  };

  const handleTextChange = (text) => {
    setEditingText(text);
    if (text.length > 0) {
      const filteredSuggestions = predefinedItems[deviceLanguage].filter(item =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {loading && (
        <View style={styles.overlay}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={theme.buttonBackground} />
          </View>
        </View>
      )}

      {!loading && shoppingList.length === 0 && (
        <View style={styles.emptyListContainer}>
          <Text style={styles.emptyListText}>{currentLabels.pressAndSpeak}</Text>
        </View>
      )}

      {!loading && shoppingList.length > 0 && (
        <FlatList
          ref={flatListRef}
          data={shoppingList.length > 0 ? [...shoppingList, currentLabels.costdelalista] : []}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.messageList}
          contentContainerStyle={{ paddingBottom: 10 }}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => addProductModalRef.current?.open()}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      <ConfirmationModal />

      <Modalize
        ref={addProductModalRef}
        adjustToContentHeight
        modalTopOffset={50}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{currentLabels.createShoppingList}</Text>
          <TextInput
            style={styles.modalInput}
            placeholder={currentLabels.writeItems}
            multiline
            value={editingText}
            onChangeText={handleTextChange}
          />
                  <TouchableOpacity
            style={styles.modalButtones}
            onPress={() => {
              const newItems = editingText.split('\n').map(item => item.trim()).filter(item => item);
              newItems.forEach(item => addItem(item));
              setEditingText('');
              setSuggestions([]);
              addProductModalRef.current?.close();
            }}
          >
            <Text style={styles.modalButtonText}>{currentLabels.save}</Text>
          </TouchableOpacity>
          <FlatList
            data={suggestions}
            renderItem={({ item }) => (
              <TouchableOpacity  style={styles.modalButtoneslist} onPress={() => setEditingText(item)}>
                <Text style={styles.suggestionItem}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
  
        </View>
      </Modalize>
      <Modal
        visible={countryModalVisible}
        animationType="slide"
        onRequestClose={() => setCountryModalVisible(false)}
        transparent={true}
      >
        <View style={styles.modalContaineri}>
          <TouchableOpacity
            style={styles.closeIconContainer}
            onPress={() => setCountryModalVisible(false)}
          >
            <Ionicons name="close-circle" size={32} color="#9f9f9f" />
          </TouchableOpacity>
          <Text style={styles.modalTitlecurrency}>{currentLabels.selectCountry}</Text>
          <TextInput
            style={styles.modalInput}
            placeholder={currentLabels.cityNamePlaceholder}
            placeholderTextColor="#b8b8b8ab"
            value={country}
            onChangeText={handleCountryChange}
          />
          <TouchableOpacity
            style={[styles.modalButton, isCountryEmpty && { backgroundColor: '#ccc' }]}
            onPress={handleSaveCountry}
            disabled={isCountryEmpty}
          >
            <Text style={styles.modalButtonText}>
              {`${currentLabels.viewCost} ${country}`}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        visible={editModalVisible}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
        transparent={true}
      >
        <View style={styles.modalContaineris}>
          <Text style={styles.modalTitle}>{currentLabels.editItem}</Text>
          <TextInput
            style={styles.modalInput}
            placeholder={currentLabels.writeItems}
            multiline
            value={editingText}
            onChangeText={setEditingText}
          />
          <TouchableOpacity
            style={styles.modalButton}
            onPress={saveEditedItem}
          >
            <Text style={styles.modalButtonText}>{currentLabels.save}</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modalize
        ref={welcomeModalRef}
        adjustToContentHeight
        modalTopOffset={50}
        onClosed={async () => {
          await AsyncStorage.setItem('@welcome_shown', 'true');
        }}
      >
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>{currentLabels.welcomeMessagePart1}</Text>
          <Text style={styles.welcomeTextw}>{currentLabels.welcomeMessagePart2}</Text>
          <TouchableOpacity
            onPress={() => closeModalwelcome()}
            style={[styles.buttonCustommodlaize]}>
            <Text style={styles.emptyListTextsuscribemodalize}>{currentLabels.verComoFunciona}</Text>
          </TouchableOpacity>
        </View>
      </Modalize>
      {shoppingList.length > 0 && (
        <View style={styles.headerSaveContainer}>
          <TouchableOpacity onPress={saveToHistory} style={styles.headerIconSave}>
            <Ionicons name="checkmark-circle-outline" size={24} color='#009688' />
            <Text style={styles.saveText}>{currentLabels.saveList}</Text>
          </TouchableOpacity>
        </View>
      )}

    </SafeAreaView>
  );
};

export default HomeScreen;
