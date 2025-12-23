import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  Animated,
  Easing,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import * as RNLocalize from 'react-native-localize';
import { useTheme } from '../ThemeContext';
import MealPlanService from '../services/MealPlanService';
import ShoppingListConsolidator from '../services/ShoppingListConsolidator';
import PreferencesModal from './components/PreferencesModal';
import ListNameModal from './components/ListNameModal';
import ListSelectionModal from './components/ListSelectionModal';
import CustomAlert from './components/CustomAlert';
import mealPlannerTranslations from './translations/mealPlannerTranslations';
import Purchases from 'react-native-purchases';

const MealPlannerScreen = ({ route }) => {
  const { theme } = useTheme();
  const onNavigateToHistory = route?.params?.onNavigateToHistory;
  const onNavigateToSubscribe = route?.params?.onNavigateToSubscribe;
  const registerCalendarOpener = route?.params?.registerCalendarOpener;
  const registerPreferencesOpener = route?.params?.registerPreferencesOpener;

  const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
  const t = mealPlannerTranslations[deviceLanguage] || mealPlannerTranslations['en'];

  const [currentWeekStart, setCurrentWeekStart] = useState(
    MealPlanService.getWeekStart(new Date())
  );
  const [weekPlan, setWeekPlan] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingMeals, setGeneratingMeals] = useState({});
  const [generatingMenu, setGeneratingMenu] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('breakfast');

  // Recetas por categoría
  const [recipes, setRecipes] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  });

  // Estados de generación
  const [generatingCategory, setGeneratingCategory] = useState(null);
  const [regeneratingRecipeId, setRegeneratingRecipeId] = useState(null);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Límites de generación por categoría
  const [generationLimits, setGenerationLimits] = useState({
    breakfast: { count: 0, lastGeneration: null },
    lunch: { count: 0, lastGeneration: null },
    dinner: { count: 0, lastGeneration: null },
    snacks: { count: 0, lastGeneration: null }
  });

  // Estado para ingredientes pendientes de añadir
  const [pendingIngredients, setPendingIngredients] = useState([]);
  const [pendingListType, setPendingListType] = useState(null);
  const [pendingDay, setPendingDay] = useState(null);

  // Estado para checkboxes de ingredientes en el modal
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  // Estado para límites diarios de generación
  const [dailyLimits, setDailyLimits] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
    snacks: false
  });

  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  // Modales
  const [preferencesModalVisible, setPreferencesModalVisible] = useState(false);
  const [listSelectionModalVisible, setListSelectionModalVisible] = useState(false);
  const [listNameModalVisible, setListNameModalVisible] = useState(false);
  const [selectedExistingList, setSelectedExistingList] = useState(null);
  const [selectedExistingListIndex, setSelectedExistingListIndex] = useState(null);

  // CustomAlert para confirmación de lista generada
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'success',
    buttons: []
  });

  // Estado de suscripción
  const [isSubscribed, setIsSubscribed] = useState(null);

  const categories = ['breakfast', 'lunch', 'dinner', 'snacks'];

  // URLs de imágenes de Unsplash por categoría
  const RECIPE_IMAGES = {
    breakfast: [
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80', // Pancakes
      'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80', // Avena
      'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&q=80', // Tostadas
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80', // Huevos
      'https://images.unsplash.com/photo-1547496502-affa22d38842?w=400&q=80', // Smoothie bowl
      'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400&q=80', // Croissant
      'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&q=80', // Waffles
      'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=400&q=80', // Yogurt
      'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?w=400&q=80', // Toast
      'https://images.unsplash.com/photo-1513442542250-854d436a73f2?w=400&q=80', // Frutas
    ],
    lunch: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', // Ensalada
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&q=80', // Pasta
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', // Pizza
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', // Hamburguesa
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', // Bowl
      'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&q=80', // Tacos
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80', // Plato preparado
      'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&q=80', // Comida
      'https://images.unsplash.com/photo-1547584370-2cc98b8b8dc8?w=400&q=80', // Sushi
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', // Curry
    ],
    dinner: [
      'https://images.unsplash.com/photo-1560963805-6c64417e3413?w=400&q=80', // Salmón
      'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&q=80', // Pollo
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80', // Ensalada cena
      'https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=400&q=80', // Pescado
      'https://images.unsplash.com/photo-1529694157872-4e0c0f3b238b?w=400&q=80', // Vegetales
      'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80', // Bowl cena
      'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=400&q=80', // Wrap
      'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=400&q=80', // Sopas
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80', // Plato saludable
      'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&q=80', // Carne
    ],
    snacks: [
      'https://images.unsplash.com/photo-1559163499-413811fb2344?w=400&q=80', // Snacks saludables
      'https://images.unsplash.com/photo-1564414734627-5b9b85bc66cb?w=400&q=80', // Frutas snack
      'https://images.unsplash.com/photo-1519915212116-7cfef71f1d3e?w=400&q=80', // Nueces
      'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&q=80', // Granola
      'https://images.unsplash.com/photo-1549388604-817d15fa5a44?w=400&q=80', // Smoothie
      'https://images.unsplash.com/photo-1590080876132-06d5e33fa0e4?w=400&q=80', // Bocadillos
      'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80', // Barras
      'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=400&q=80', // Chips
      'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80', // Hummus
      'https://images.unsplash.com/photo-1562059392-096320bccc7e?w=400&q=80', // Energy balls
    ]
  };

  // Mapeo de keywords de comida a URLs específicas de imágenes
  const FOOD_KEYWORD_MAP = {
    // Breakfast keywords
    'pancake': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80',
    'oatmeal': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80',
    'avena': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80',
    'toast': 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&q=80',
    'tostada': 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&q=80',
    'egg': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80',
    'huevo': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80',
    'smoothie': 'https://images.unsplash.com/photo-1547496502-affa22d38842?w=400&q=80',
    'bowl': 'https://images.unsplash.com/photo-1547496502-affa22d38842?w=400&q=80',
    'croissant': 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400&q=80',
    'waffle': 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&q=80',
    'yogurt': 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=400&q=80',
    'yogur': 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=400&q=80',
    'fruit': 'https://images.unsplash.com/photo-1513442542250-854d436a73f2?w=400&q=80',
    'fruta': 'https://images.unsplash.com/photo-1513442542250-854d436a73f2?w=400&q=80',
    'berry': 'https://images.unsplash.com/photo-1513442542250-854d436a73f2?w=400&q=80',
    'chia': 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=400&q=80',
    'mango': 'https://images.unsplash.com/photo-1513442542250-854d436a73f2?w=400&q=80',
    'matcha': 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=400&q=80',
    'pudding': 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=400&q=80',
    'coconut': 'https://images.unsplash.com/photo-1513442542250-854d436a73f2?w=400&q=80',
    'coco': 'https://images.unsplash.com/photo-1513442542250-854d436a73f2?w=400&q=80',

    // Lunch keywords
    'salad': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
    'ensalada': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
    'pasta': 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&q=80',
    'pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
    'burger': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
    'hamburguesa': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
    'taco': 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&q=80',
    'sushi': 'https://images.unsplash.com/photo-1547584370-2cc98b8b8dc8?w=400&q=80',
    'curry': 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80',
    'rice': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
    'arroz': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
    'tofu': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
    'noodle': 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&q=80',
    'fideo': 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&q=80',

    // Dinner keywords
    'salmon': 'https://images.unsplash.com/photo-1560963805-6c64417e3413?w=400&q=80',
    'salmón': 'https://images.unsplash.com/photo-1560963805-6c64417e3413?w=400&q=80',
    'chicken': 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&q=80',
    'pollo': 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&q=80',
    'fish': 'https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=400&q=80',
    'pescado': 'https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=400&q=80',
    'vegetable': 'https://images.unsplash.com/photo-1529694157872-4e0c0f3b238b?w=400&q=80',
    'vegetal': 'https://images.unsplash.com/photo-1529694157872-4e0c0f3b238b?w=400&q=80',
    'wrap': 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=400&q=80',
    'soup': 'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=400&q=80',
    'sopa': 'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=400&q=80',
    'meat': 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&q=80',
    'carne': 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&q=80',
    'steak': 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&q=80',

    // Snacks keywords
    'granola': 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&q=80',
    'nuts': 'https://images.unsplash.com/photo-1519915212116-7cfef71f1d3e?w=400&q=80',
    'nuez': 'https://images.unsplash.com/photo-1519915212116-7cfef71f1d3e?w=400&q=80',
    'chip': 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=400&q=80',
    'hummus': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80',
    'bar': 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80',
    'barra': 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80',
    'energy': 'https://images.unsplash.com/photo-1562059392-096320bccc7e?w=400&q=80',
  };

  // Obtener imagen aleatoria para una categoría (fallback)
  const getRandomRecipeImage = (category) => {
    const images = RECIPE_IMAGES[category] || RECIPE_IMAGES.breakfast;
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  // Obtener imagen basada en el nombre de la receta
  const getImageForRecipe = (recipeName, category) => {
    if (!recipeName) {
      return getRandomRecipeImage(category);
    }

    // Normalizar el nombre (minúsculas, sin acentos)
    const normalizedName = recipeName.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    console.log(`🔍 Buscando imagen para: "${recipeName}" (normalizado: "${normalizedName}")`);

    // Buscar coincidencia de keywords
    for (const [keyword, imageUrl] of Object.entries(FOOD_KEYWORD_MAP)) {
      if (normalizedName.includes(keyword)) {
        console.log(`🎯 Keyword match: "${keyword}" encontrado en "${recipeName}"`);
        return imageUrl;
      }
    }

    // Si no hay match, usar imagen aleatoria de la categoría
    console.log(`🎲 No hay keyword match para "${recipeName}", usando imagen aleatoria de ${category}`);
    return getRandomRecipeImage(category);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      breakfast: 'sunny-outline',
      lunch: 'restaurant-outline',
      dinner: 'moon-outline',
      snacks: 'cafe-outline'
    };
    return icons[category] || 'nutrition-outline';
  };

  const getCategoryName = (category) => {
    const names = {
      breakfast: t.breakfast || 'Desayuno',
      lunch: t.lunch || 'Comida',
      dinner: t.dinner || 'Cena',
      snacks: t.snacks || 'Snacks'
    };
    return names[category] || category;
  };

  const getDayName = (day) => {
    const names = {
      monday: t.monday || 'Lunes',
      tuesday: t.tuesday || 'Martes',
      wednesday: t.wednesday || 'Miércoles',
      thursday: t.thursday || 'Jueves',
      friday: t.friday || 'Viernes',
      saturday: t.saturday || 'Sábado',
      sunday: t.sunday || 'Domingo'
    };
    return names[day] || day;
  };

  const scrollToCategory = (category) => {
    if (category === activeCategory) return;

    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setActiveCategory(category);
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    });
  };

  useEffect(() => {
    loadAllRecipes();
    loadPreferences();
    checkSubscriptionStatus();
    loadGenerationLimits();
    // Limpiar imágenes antiguas al iniciar
    MealPlanService.cleanOldRecipeImages();
  }, []);

  // Animación shimmer para skeleton
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  // Inicializar checkboxes cuando se selecciona una receta
  useEffect(() => {
    if (selectedRecipe && selectedRecipe.ingredients) {
      setSelectedIngredients(selectedRecipe.ingredients.map(() => true));
    }
  }, [selectedRecipe]);

  // Cargar recetas desde AsyncStorage
  const loadAllRecipes = async () => {
    try {
      setLoading(true);
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const savedRecipesJson = await AsyncStorage.getItem('@recipe_explorer_v2');

      if (savedRecipesJson) {
        const savedRecipes = JSON.parse(savedRecipesJson);
        setRecipes(savedRecipes);
      }
    } catch (error) {
      console.error('Error al cargar recetas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar límites de generación desde AsyncStorage
  const loadGenerationLimits = async () => {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const limitsJson = await AsyncStorage.getItem('@recipe_generation_limits');

      if (limitsJson) {
        const limits = JSON.parse(limitsJson);
        setGenerationLimits(limits);
        console.log('📊 Límites de generación cargados:', limits);
      }
    } catch (error) {
      console.error('Error al cargar límites de generación:', error);
    }
  };

  // Guardar límites de generación en AsyncStorage
  const saveGenerationLimits = async (limits) => {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('@recipe_generation_limits', JSON.stringify(limits));
      setGenerationLimits(limits);
      console.log('💾 Límites de generación guardados:', limits);
    } catch (error) {
      console.error('Error al guardar límites de generación:', error);
    }
  };

  // Verificar si puede generar en una categoría
  const canGenerateInCategory = (category) => {
    const limit = generationLimits[category];

    if (!limit || !limit.lastGeneration) {
      return { canGenerate: true, remainingAttempts: 2, hoursLeft: 0 };
    }

    const now = new Date();
    const lastGen = new Date(limit.lastGeneration);
    const hoursSinceLastGen = (now - lastGen) / (1000 * 60 * 60);

    // Si han pasado 24 horas, resetear
    if (hoursSinceLastGen >= 24) {
      return { canGenerate: true, remainingAttempts: 2, hoursLeft: 0 };
    }

    // Si ha usado menos de 2 intentos
    if (limit.count < 2) {
      return { canGenerate: true, remainingAttempts: 2 - limit.count, hoursLeft: 0 };
    }

    // Bloqueado
    const hoursLeft = Math.ceil(24 - hoursSinceLastGen);
    return { canGenerate: false, remainingAttempts: 0, hoursLeft };
  };

  // Incrementar contador de generación
  const incrementGenerationCount = async (category) => {
    const now = new Date().toISOString();
    const currentLimit = generationLimits[category];

    // Verificar si han pasado 24 horas desde la última generación
    if (currentLimit && currentLimit.lastGeneration) {
      const lastGen = new Date(currentLimit.lastGeneration);
      const hoursSinceLastGen = (new Date() - lastGen) / (1000 * 60 * 60);

      if (hoursSinceLastGen >= 24) {
        // Resetear contador
        const newLimits = {
          ...generationLimits,
          [category]: { count: 1, lastGeneration: now }
        };
        await saveGenerationLimits(newLimits);
        return;
      }
    }

    // Incrementar contador
    const newLimits = {
      ...generationLimits,
      [category]: {
        count: (currentLimit?.count || 0) + 1,
        lastGeneration: now
      }
    };
    await saveGenerationLimits(newLimits);
  };

  // Guardar recetas en AsyncStorage
  const saveAllRecipes = async (newRecipes) => {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('@recipe_explorer_v2', JSON.stringify(newRecipes));
      setRecipes(newRecipes);
    } catch (error) {
      console.error('Error al guardar recetas:', error);
    }
  };

  // Registrar funciones para abrir modales desde el header
  useEffect(() => {
    if (registerPreferencesOpener) {
      registerPreferencesOpener(() => setPreferencesModalVisible(true));
    }
  }, [registerPreferencesOpener]);

  // Verificar estado de suscripción
  const checkSubscriptionStatus = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const entitlementId = Platform.OS === 'ios' ? '12981' : 'an6161';
      const hasActiveSubscription = customerInfo.entitlements.active[entitlementId] !== undefined;
      setIsSubscribed(hasActiveSubscription);
      console.log('🔄 MealPlanner - Estado de suscripción:', hasActiveSubscription ? 'Activa' : 'Inactiva');
    } catch (error) {
      console.error('Error verificando suscripción:', error);
      setIsSubscribed(false);
    }
  };

  // Función para mostrar alerta y navegar a suscripción
  const showSubscriptionAlert = () => {
    Alert.alert(
      t.subscriptionRequiredTitle || 'Suscripción requerida',
      t.subscriptionRequiredMessage || 'Para generar menús con IA necesitas una suscripción activa.',
      [
        {
          text: t.cancel || 'Cancelar',
          style: 'cancel'
        },
        {
          text: t.subscribeButton || 'Suscribirse',
          onPress: () => {
            if (onNavigateToSubscribe) {
              onNavigateToSubscribe();
            } else {
              console.warn("No subscription navigation function provided");
            }
          }
        }
      ]
    );
  };

  const loadWeekPlan = async (keepCurrentDay = false) => {
    try {
      setLoading(true);
      const plan = await MealPlanService.getWeeklyPlan(currentWeekStart);
      setWeekPlan(plan);
      // El día activo se mantiene automáticamente con el estado
    } catch (error) {
      Alert.alert(t.error, t.errorLoading);
    } finally {
      setLoading(false);
    }
  };

  const loadPreferences = async () => {
    try {
      const prefs = await MealPlanService.getPreferences();
      setPreferences(prefs);
    } catch (error) {
      console.error('Error al cargar preferencias:', error);
    }
  };

  const handlePreferencesUpdated = (newPreferences) => {
    setPreferences(newPreferences);
  };

  const changeWeek = (direction) => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(newWeekStart.getDate() + direction * 7);
    setCurrentWeekStart(newWeekStart);
  };

  const isCurrentWeek = () => {
    const today = MealPlanService.getWeekStart(new Date());
    return MealPlanService.formatDateKey(currentWeekStart) === MealPlanService.formatDateKey(today);
  };


  const handleMealAdded = async (meal) => {
    try {
      const success = await MealPlanService.addMealToSlot(
        currentWeekStart,
        selectedDay,
        selectedMealType,
        meal
      );

      if (success) {
        await loadWeekPlan();
      }
    } catch (error) {
      Alert.alert(t.error, t.errorAdding);
    }
  };

  const handleRemoveMeal = async (day, mealType) => {
    Alert.alert(
      t.confirmDelete,
      t.confirmDeleteMessage,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.delete,
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await MealPlanService.removeMealFromSlot(
                currentWeekStart,
                day,
                mealType
              );

              if (success) {
                await loadWeekPlan(true);
              }
            } catch (error) {
              Alert.alert(t.error, t.errorDeleting);
            }
          },
        },
      ]
    );
  };

  const openListSelectionModal = (type, day = null) => {
    setPendingListType(type);
    setPendingDay(day);
    setListSelectionModalVisible(true);
  };

  const handleCreateNewList = () => {
    setSelectedExistingList(null);
    setSelectedExistingListIndex(null);
    setListNameModalVisible(true);
  };

  const handleSelectExistingList = (list, index) => {
    console.log('🔵 [handleSelectExistingList] Lista seleccionada:', list);
    console.log('🔵 [handleSelectExistingList] Índice:', index);
    setSelectedExistingList(list);
    setSelectedExistingListIndex(index);
    // Cerrar el modal de selección antes de generar la lista
    setListSelectionModalVisible(false);
    // Pasar la lista y el índice directamente a la función
    generateShoppingList(null, list, index);
  };

  const generateShoppingList = async (listName, existingList = null, existingIndex = null) => {
    console.log('🟢 [generateShoppingList] INICIO');
    console.log('🟢 [generateShoppingList] listName:', listName);
    console.log('🟢 [generateShoppingList] existingList:', existingList ? existingList.name : 'null');
    console.log('🟢 [generateShoppingList] existingIndex:', existingIndex);

    try {
      let shoppingList;
      let defaultName;

      // Generar lista de ingredientes
      if (pendingListType === 'week') {
        if (!weekPlan || !weekPlan.plan) {
          Alert.alert(t.error, t.noWeekPlan);
          return;
        }

        console.log('🛒 Generando lista semanal con plan:', JSON.stringify(weekPlan.plan, null, 2));
        shoppingList = ShoppingListConsolidator.consolidateIngredients(weekPlan);
        console.log('🛒 Lista consolidada:', shoppingList.length, 'ingredientes');
        defaultName = listName || `${t.weeklyList} ${weekPlan.weekRange}`;
      } else if (pendingListType === 'day' && pendingDay) {
        const dayPlan = weekPlan?.plan?.[pendingDay];
        if (!dayPlan) {
          Alert.alert(t.error, t.noMealsForDay);
          return;
        }

        const tempPlan = {
          plan: {
            [pendingDay]: dayPlan
          }
        };

        shoppingList = ShoppingListConsolidator.consolidateIngredients(tempPlan);
        const dayName = getDayName(pendingDay);
        defaultName = listName || `${t.dayList} ${dayName}`;
      } else if (pendingListType === 'recipe') {
        // Usar ingredientes pendientes de la receta
        shoppingList = pendingIngredients;
        const today = new Date().toLocaleDateString();
        defaultName = listName || `${t.recipeIngredients || 'Ingredientes de receta'} - ${today}`;
      }

      if (!shoppingList || shoppingList.length === 0) {
        Alert.alert(t.emptyList, t.emptyListMessage);
        return;
      }

      // Convertir objetos {item, quantity, unit} a strings para compatibilidad con HistoryScreen
      const formattedList = shoppingList.map(item => {
        if (typeof item === 'string') {
          return item;
        }
        // Formato: "Aguacate (1 pieza)" o solo "Sal" si no hay cantidad
        const qty = item.quantity && item.quantity !== 'NaN' ? item.quantity : '';
        const unit = item.unit || '';
        if (qty && unit) {
          return `${item.item} (${qty} ${unit})`;
        } else if (qty) {
          return `${item.item} (${qty})`;
        } else {
          return item.item || '';
        }
      }).filter(item => item.trim() !== '');

      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const existingHistoryJson = await AsyncStorage.getItem('@shopping_history');
      const history = existingHistoryJson ? JSON.parse(existingHistoryJson) : [];

      // Si se seleccionó una lista existente, añadir a ella
      // Usar los parámetros pasados directamente o los estados
      const targetList = existingList || selectedExistingList;
      const targetIndex = existingIndex !== null ? existingIndex : selectedExistingListIndex;

      if (targetList && targetIndex !== null) {
        console.log('🛒 [generateShoppingList] Añadiendo a lista existente');
        console.log('🛒 [generateShoppingList] targetIndex:', targetIndex);
        console.log('🛒 [generateShoppingList] Total listas en history:', history.length);
        console.log('🛒 [generateShoppingList] Lista seleccionada:', JSON.stringify(targetList, null, 2));

        // Buscar la lista por coincidencia de nombre y fecha en lugar de usar índice
        // porque el índice puede cambiar si las listas se ordenan diferente
        const targetListIndex = history.findIndex(item =>
          item.name === targetList.name &&
          item.date === targetList.date
        );

        console.log('🛒 [generateShoppingList] Índice encontrado en history:', targetListIndex);

        if (targetListIndex === -1) {
          console.error('🛒 [generateShoppingList] ERROR: No se encontró la lista en history');
          Alert.alert(t.error, 'No se pudo encontrar la lista seleccionada');
          return;
        }

        const existingItems = history[targetListIndex].list || [];
        console.log('🛒 [generateShoppingList] Items existentes antes:', existingItems.length);

        // Añadir nuevos ingredientes (ya convertidos a strings)
        formattedList.forEach(newItem => {
          // Evitar duplicados exactos
          if (!existingItems.includes(newItem)) {
            existingItems.push(newItem);
          }
        });

        console.log('🛒 [generateShoppingList] Items después de añadir:', existingItems.length);
        console.log('🛒 [generateShoppingList] Nuevos items añadidos:', formattedList.length);

        history[targetListIndex].list = existingItems;

        await AsyncStorage.setItem('@shopping_history', JSON.stringify(history));

        // Marcar que debe mostrar esta lista actualizada (usar el índice real encontrado)
        await AsyncStorage.setItem('@show_list_at_index', targetListIndex.toString());

        // Cerrar todos los modales
        setListSelectionModalVisible(false);
        setListNameModalVisible(false);

        setAlertConfig({
          title: t.added,
          message: t.addedToList.replace('{{count}}', formattedList.length).replace('{{name}}', targetList.name),
          type: 'success',
          buttons: [
            { text: t.ok },
            {
              text: t.viewHistory,
              onPress: () => {
                setAlertVisible(false);
                setTimeout(() => {
                  if (onNavigateToHistory) {
                    onNavigateToHistory();
                  }
                }, 300);
              },
            },
          ]
        });
        setAlertVisible(true);
      } else {
        // Crear nueva lista
        const newList = {
          list: formattedList,
          name: defaultName,
          date: new Date().toISOString()
        };

        // Añadir al final (como HomeScreen), HistoryScreen hace reverse al cargar
        const newHistory = [...history, newList];
        await AsyncStorage.setItem('@shopping_history', JSON.stringify(newHistory));

        // Marcar que debe mostrar la lista más reciente (que estará en índice 0 después del reverse)
        await AsyncStorage.setItem('@show_newest_list', 'true');

        // Cerrar todos los modales
        setListSelectionModalVisible(false);
        setListNameModalVisible(false);

        setAlertConfig({
          title: t.listGenerated,
          message: `${defaultName} - ${formattedList.length} ${formattedList.length === 1 ? t.ingredient : t.ingredients}`,
          type: 'success',
          buttons: [
            { text: t.ok },
            {
              text: t.viewHistory,
              onPress: () => {
                setAlertVisible(false);
                setTimeout(() => {
                  if (onNavigateToHistory) {
                    onNavigateToHistory();
                  }
                }, 300);
              },
            },
          ]
        });
        setAlertVisible(true);
      }

      // Limpiar estados
      setSelectedExistingList(null);
      setSelectedExistingListIndex(null);
    } catch (error) {
      console.error('Error al generar lista:', error);
      Alert.alert(t.error, t.errorGeneratingList);
    }
  };

  // Simular progreso de generación
  const simulateProgress = (duration = 20000) => {
    setGenerationProgress(0);
    const steps = 100;
    const interval = duration / steps;
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      currentStep++;
      const progress = Math.min(currentStep / steps, 0.95); // Máximo 95% hasta que termine
      setGenerationProgress(progress);

      if (currentStep >= steps * 0.95) {
        clearInterval(progressInterval);
      }
    }, interval);

    return progressInterval;
  };

  // Generar 3 recetas para una categoría
  const generateRecipesForCategory = async (category) => {
    // Verificar límite de generación
    const { canGenerate, remainingAttempts, hoursLeft } = canGenerateInCategory(category);

    if (!canGenerate) {
      Alert.alert(
        t.limitReached || 'Límite alcanzado',
        t.limitReachedMessage?.replace('{{hours}}', hoursLeft) ||
        `Has alcanzado el límite de 2 generaciones para ${getCategoryName(category)}. Podrás generar de nuevo en ${hoursLeft} horas.`,
        [{ text: t.ok || 'OK' }]
      );
      return;
    }

    // Verificar suscripción antes de generar
    if (isSubscribed === false) {
      showSubscriptionAlert();
      return;
    }

    if (!preferences) {
      Alert.alert(t.error || 'Error', t.errorLoadingPreferences || 'Error al cargar preferencias');
      return;
    }

    let progressInterval = null;

    try {
      console.log(`🍽️ Generando 1 receta para ${category} con imagen DALL-E`);
      console.log(`📊 Intentos restantes: ${remainingAttempts}`);
      setGeneratingCategory(category);

      // Iniciar simulación de progreso
      progressInterval = simulateProgress(20000); // 20 segundos estimados

      // Generar 1 receta
      const recipe = await MealPlanService.suggestMeal(category, preferences, null, null);
      console.log(`✅ Receta generada:`, recipe.name);
      setGenerationProgress(0.6); // 60% al generar receta

      // Generar imagen con DALL-E
      console.log(`🎨 Generando imagen con DALL-E para "${recipe.name}"`);
      const imageUrl = await MealPlanService.generateRecipeImage(recipe.name, recipe.description);
      console.log(`✅ Imagen generada:`, imageUrl.substring(0, 100));
      setGenerationProgress(0.9); // 90% al generar imagen

      // Agregar ID único e imagen a la receta
      const recipeWithMetadata = {
        ...recipe,
        id: `${category}_${Date.now()}`,
        category: category,
        image_url: imageUrl,
        createdAt: new Date().toISOString()
      };

      // Actualizar estado de recetas (array con 1 receta)
      const newRecipes = {
        ...recipes,
        [category]: [recipeWithMetadata]
      };

      // Guardar en AsyncStorage
      await saveAllRecipes(newRecipes);

      // Incrementar contador de generación
      await incrementGenerationCount(category);

      // Limpiar imágenes antiguas después de guardar
      await MealPlanService.cleanOldRecipeImages();

      setGenerationProgress(1); // 100% completado

      console.log(`✅ Receta guardada para ${category}`);
      console.log(`📊 Generaciones usadas: ${(generationLimits[category]?.count || 0) + 1}/2`);
    } catch (error) {
      console.error(`❌ Error al generar receta para ${category}:`, error);
      Alert.alert(
        t.error || 'Error',
        `Error al generar receta: ${error.message}`
      );
    } finally {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setGeneratingCategory(null);
      setGenerationProgress(0);
    }
  };

  // Regenerar la receta de una categoría
  const regenerateSingleRecipe = async (category, recipeIndex = 0) => {
    // Verificar límite de generación
    const { canGenerate, remainingAttempts, hoursLeft } = canGenerateInCategory(category);

    if (!canGenerate) {
      Alert.alert(
        t.limitReached || 'Límite alcanzado',
        t.limitReachedMessage?.replace('{{hours}}', hoursLeft) ||
        `Has alcanzado el límite de 2 generaciones para ${getCategoryName(category)}. Podrás generar de nuevo en ${hoursLeft} horas.`,
        [{ text: t.ok || 'OK' }]
      );
      return;
    }

    // Verificar suscripción
    if (isSubscribed === false) {
      showSubscriptionAlert();
      return;
    }

    if (!preferences) {
      Alert.alert(t.error || 'Error', t.errorLoadingPreferences || 'Error al cargar preferencias');
      return;
    }

    let progressInterval = null;

    try {
      const recipeId = recipes[category][0]?.id;
      const oldImageUrl = recipes[category][0]?.image_url;
      console.log(`🔄 Regenerando receta de ${category} con imagen DALL-E`);
      console.log(`📊 Intentos restantes: ${remainingAttempts}`);
      setRegeneratingRecipeId(recipeId);

      // Iniciar simulación de progreso
      progressInterval = simulateProgress(20000);

      // Generar nueva receta
      const newRecipe = await MealPlanService.suggestMeal(category, preferences, null, null);
      console.log(`✅ Nueva receta generada:`, newRecipe.name);
      setGenerationProgress(0.6);

      // Generar imagen con DALL-E
      console.log(`🎨 Generando nueva imagen con DALL-E para "${newRecipe.name}"`);
      const imageUrl = await MealPlanService.generateRecipeImage(newRecipe.name, newRecipe.description);
      console.log(`✅ Nueva imagen generada`);
      setGenerationProgress(0.9);

      // Agregar metadata
      const recipeWithMetadata = {
        ...newRecipe,
        id: `${category}_${Date.now()}`,
        category: category,
        image_url: imageUrl,
        createdAt: new Date().toISOString()
      };

      // Actualizar receta (array con 1 receta)
      const newRecipes = {
        ...recipes,
        [category]: [recipeWithMetadata]
      };

      // Guardar
      await saveAllRecipes(newRecipes);

      // Incrementar contador de generación
      await incrementGenerationCount(category);

      // Limpiar imágenes antiguas después de guardar
      await MealPlanService.cleanOldRecipeImages();

      setGenerationProgress(1);

      console.log(`✅ Receta regenerada para ${category}`);
      console.log(`📊 Generaciones usadas: ${(generationLimits[category]?.count || 0) + 1}/2`);
    } catch (error) {
      console.error(`❌ Error al regenerar receta:`, error);
      Alert.alert(
        t.error || 'Error',
        `Error al regenerar receta: ${error.message}`
      );
    } finally {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setRegeneratingRecipeId(null);
      setGenerationProgress(0);
    }
  };

  const generateFullDayWithAI = async (day) => {
    // Verificar suscripción antes de generar
    if (isSubscribed === false) {
      showSubscriptionAlert();
      return;
    }

    const dayKey = `${day}_fullday`;

    try {
      console.log(`📅 Generando día completo para ${day}`);

      if (!preferences) {
        Alert.alert(t.error, t.errorLoadingPreferences);
        return;
      }

      // Establecer el día activo ANTES de empezar a generar
      setActiveDay(day);

      const mealTypes = ['breakfast', 'lunch', 'dinner'];

      // Limpiar visualmente las comidas del día en el estado local primero
      setWeekPlan(prev => {
        if (!prev?.plan?.[day]) return prev;
        return {
          ...prev,
          plan: {
            ...prev.plan,
            [day]: {}
          }
        };
      });

      // Marcar como generando después de limpiar visualmente
      setGeneratingMeals(prev => ({ ...prev, [dayKey]: true }));

      // Eliminar comidas existentes en AsyncStorage
      console.log('Eliminando comidas existentes del día...');
      for (const mealType of mealTypes) {
        await MealPlanService.removeMealFromSlot(currentWeekStart, day, mealType);
      }

      // Generar las 3 comidas secuencialmente para tener contexto
      console.log('Generando las 3 comidas del día...');
      for (let i = 0; i < mealTypes.length; i++) {
        const currentMealType = mealTypes[i];
        const mealKey = `${day}_${currentMealType}`;

        // Marcar la comida específica como generando
        setGeneratingMeals(prev => ({ ...prev, [mealKey]: true }));

        // Recargar el plan para tener el contexto actualizado
        const currentPlan = await MealPlanService.getWeeklyPlan(currentWeekStart);

        const meal = await MealPlanService.suggestMeal(currentMealType, preferences, currentPlan, day);
        console.log(`Comida ${currentMealType} generada:`, meal);

        await MealPlanService.addMealToSlot(
          currentWeekStart,
          day,
          currentMealType,
          meal
        );

        // Limpiar el estado de generación de esta comida
        setGeneratingMeals(prev => {
          const newState = { ...prev };
          delete newState[mealKey];
          return newState;
        });

        // Recargar el plan después de cada comida para mostrar progreso
        await loadWeekPlan(true);
      }

      // Limpiar estado de generación DESPUÉS de recargar el plan
      setGeneratingMeals(prev => {
        const newState = { ...prev };
        delete newState[dayKey];
        return newState;
      });
    } catch (error) {
      console.error('❌ Error al generar día completo:', error);
      Alert.alert(t.error, `${t.errorGeneratingMeal}: ${error.message}`);

      // Limpiar estado de generación en caso de error
      setGeneratingMeals(prev => {
        const newState = { ...prev };
        delete newState[dayKey];
        return newState;
      });
    }
  };

  const isDayComplete = (day) => {
    const dayPlan = weekPlan?.plan?.[day];
    return dayPlan?.breakfast && dayPlan?.lunch && dayPlan?.dinner;
  };

  const hasMeals = (day) => {
    const dayPlan = weekPlan?.plan?.[day];
    return dayPlan?.breakfast || dayPlan?.lunch || dayPlan?.dinner;
  };

  const generateWeeklyMenuWithAI = async () => {
    // Verificar suscripción antes de generar
    if (isSubscribed === false) {
      showSubscriptionAlert();
      return;
    }

    try {
      console.log('=== INICIO generateWeeklyMenuWithAI ===');

      if (!preferences) {
        console.log('ERROR: No hay preferencias');
        Alert.alert(t.error, t.errorLoadingPreferences);
        return;
      }

      console.log('Preferencias cargadas:', preferences);

      Alert.alert(
        t.generateMenuTitle,
        t.generateMenuMessage,
        [
          { text: t.cancel, style: 'cancel' },
          {
            text: t.generate,
            onPress: async () => {
              try {
                console.log('Usuario confirmó generación');
                setGeneratingMenu(true);

                console.log('Llamando a MealPlanService.generateMenuWithAI...');
                const generatedMenu = await MealPlanService.generateMenuWithAI(preferences);
                console.log('Menú generado:', JSON.stringify(generatedMenu, null, 2));

                const newPlan = {
                  ...weekPlan,
                  plan: generatedMenu,
                };

                console.log('Guardando plan semanal...');
                await MealPlanService.saveWeeklyPlan(currentWeekStart, newPlan);
                console.log('Plan guardado exitosamente');

                console.log('Recargando plan...');
                await loadWeekPlan();
                console.log('Plan recargado');

                Alert.alert(t.menuGenerated, t.menuGeneratedMessage);
              } catch (error) {
                console.error('❌ ERROR al generar menú:', error);
                console.error('Error details:', error.message);
                console.error('Error stack:', error.stack);
                Alert.alert(t.error, `${t.errorGenerating}: ${error.message}`);
              } finally {
                console.log('Finalizando generación');
                setGeneratingMenu(false);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('❌ ERROR en generateWeeklyMenuWithAI:', error);
      Alert.alert(t.error, t.errorGenerating);
    }
  };

  // Renderizar estado vacío (sin recetas)
  const renderEmptyState = (category) => {
    return (
      <View style={styles.emptyStateContainer}>
        <Ionicons name={getCategoryIcon(category)} size={64} color="#9CA3AF" />
        <Text style={styles.emptyStateTitle}>
          {t.noRecipes || 'No hay recetas aún'}
        </Text>
        <Text style={styles.emptyStateSubtitle}>
          {t.generateRecipesHint || 'Genera 3 recetas deliciosas con IA'}
        </Text>
        <TouchableOpacity
          style={styles.generateButton}
          onPress={() => generateRecipesForCategory(category)}
        >
          <Ionicons name="sparkles" size={20} color="#fff" />
          <Text style={styles.generateButtonText}>
            {t.generateRecipes || 'Generar Recetas'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Renderizar skeleton loader con animación
  const renderRecipeSkeleton = () => {
    const opacity = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    });

    const progressPercentage = Math.round(generationProgress * 100);

    return (
      <View style={styles.recipeCard}>
        {/* Skeleton Imagen con barra de progreso */}
        <Animated.View style={[styles.recipeImage, styles.skeleton, { opacity }]}>
          <View style={styles.skeletonLoaderContainer}>
            <Ionicons name="sparkles" size={48} color="#8B5CF6" />
            <Text style={styles.skeletonLoaderText}>
              {t.generatingRecipes || 'Generando receta...'}
            </Text>

            {/* Barra de progreso */}
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
              </View>
              <Text style={styles.progressText}>{progressPercentage}%</Text>
            </View>
          </View>
        </Animated.View>

        {/* Skeleton Chips */}
        <View style={styles.recipeChipsContainer}>
          {[1, 2, 3, 4].map((item) => (
            <Animated.View
              key={item}
              style={[styles.skeletonChip, { opacity }]}
            />
          ))}
        </View>

        {/* Skeleton Nombre */}
        <View style={styles.recipeContent}>
          <Animated.View
            style={[styles.skeletonTitle, { opacity }]}
          />
          <Animated.View
            style={[styles.skeletonDescription, { opacity }]}
          />
        </View>

        {/* Skeleton Botón */}
        <Animated.View
          style={[styles.skeletonButton, { opacity }]}
        />
      </View>
    );
  };

  // Renderizar carta de receta
  const renderRecipeCard = (recipe, index, category) => {
    const isRegenerating = regeneratingRecipeId === recipe.id;

    return (
      <TouchableOpacity
        key={recipe.id}
        style={styles.recipeCard}
        onPress={() => {
          setSelectedRecipe(recipe);
          setDetailModalVisible(true);
        }}
        activeOpacity={0.7}
      >
        {/* Imagen */}
        <Image
          source={{ uri: recipe.image_url }}
          style={styles.recipeImage}
          resizeMode="cover"
        />

        {/* Chips informativos */}
        <View style={styles.recipeChipsContainer}>
          <View style={styles.recipeChip}>
            <Ionicons name="time-outline" size={14} color="#6B7280" />
            <Text style={styles.recipeChipText}>
              {recipe.time || `30 ${t.timeUnit || 'min'}`}
            </Text>
          </View>
          <View style={styles.recipeChip}>
            <Ionicons name="flame-outline" size={14} color="#6B7280" />
            <Text style={styles.recipeChipText}>
              {recipe.calories || 450} {t.caloriesUnit || 'cal'}
            </Text>
          </View>
          <View style={styles.recipeChip}>
            <Ionicons name="star-outline" size={14} color="#6B7280" />
            <Text style={styles.recipeChipText}>
              {recipe.difficulty === 'easy' || recipe.difficulty === 'fácil' || recipe.difficulty === 'facile' ? t.difficultyEasy || 'easy' :
               recipe.difficulty === 'medium' || recipe.difficulty === 'medio' || recipe.difficulty === 'moyen' ? t.difficultyMedium || 'medium' :
               recipe.difficulty === 'hard' || recipe.difficulty === 'difícil' || recipe.difficulty === 'difficile' ? t.difficultyHard || 'hard' :
               recipe.difficulty || t.difficultyMedium || 'medium'}
            </Text>
          </View>
          <View style={styles.recipeChip}>
            <Ionicons name="people-outline" size={14} color="#6B7280" />
            <Text style={styles.recipeChipText}>
              {recipe.servings || 2} {t.servingsUnit || ''}
            </Text>
          </View>
        </View>

        {/* Nombre y descripción */}
        <View style={styles.recipeContent}>
          <Text style={styles.recipeName} numberOfLines={2}>
            {recipe.name}
          </Text>
          {recipe.description && (
            <Text style={styles.recipeDescription} numberOfLines={2}>
              {recipe.description}
            </Text>
          )}
        </View>

        {/* Botón regenerar */}

      </TouchableOpacity>
    );
  };

  // Renderizar modal de detalle de receta
  const renderRecipeDetailModal = () => {
    if (!selectedRecipe) return null;

    return (
      <Modal
        visible={detailModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Header del modal */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setDetailModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={28} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.modalTitle} numberOfLines={1}>
              {selectedRecipe.name}
            </Text>
            <View style={styles.modalHeaderSpacer} />
          </View>

          <ScrollView
            style={styles.modalScrollView}
            showsVerticalScrollIndicator={false}
          >
            {/* Imagen grande */}
            <Image
              source={{ uri: selectedRecipe.image_url }}
              style={styles.modalRecipeImage}
              resizeMode="cover"
            />

            {/* Chips informativos */}
            <View style={styles.modalChipsContainer}>
              <View style={styles.modalChip}>
                <Ionicons name="time-outline" size={18} color="#6B7280" />
                <Text style={styles.modalChipText}>{selectedRecipe.time || '30 min'}</Text>
              </View>
              <View style={styles.modalChip}>
                <Ionicons name="flame-outline" size={18} color="#6B7280" />
                <Text style={styles.modalChipText}>{selectedRecipe.calories || 450} cal</Text>
              </View>
              <View style={styles.modalChip}>
                <Ionicons name="star-outline" size={18} color="#6B7280" />
                <Text style={styles.modalChipText}>{selectedRecipe.difficulty || 'fácil'}</Text>
              </View>
              <View style={styles.modalChip}>
                <Ionicons name="people-outline" size={18} color="#6B7280" />
                <Text style={styles.modalChipText}>{selectedRecipe.servings || 2} personas</Text>
              </View>
            </View>

            {/* Descripción */}
            {selectedRecipe.description && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>
                  {t.description || 'Descripción'}
                </Text>
                <Text style={styles.modalDescription}>
                  {selectedRecipe.description}
                </Text>
              </View>
            )}

            {/* Ingredientes con checkboxes */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>
                {t.ingredients || 'Ingredientes'}
              </Text>
              {selectedRecipe.ingredients?.map((ingredient, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.ingredientRow}
                  onPress={() => {
                    const newSelected = [...selectedIngredients];
                    newSelected[index] = !newSelected[index];
                    setSelectedIngredients(newSelected);
                  }}
                >
                  <Ionicons
                    name={selectedIngredients[index] ? 'checkbox' : 'square-outline'}
                    size={24}
                    color="#8B5CF6"
                  />
                  <Text style={styles.ingredientText}>
                    {ingredient.item} - {ingredient.quantity} {ingredient.unit}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Instrucciones */}
            {selectedRecipe.instructions && selectedRecipe.instructions.length > 0 && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>
                  {t.instructions || 'Instrucciones'}
                </Text>
                {selectedRecipe.instructions.map((instruction, index) => (
                  <View key={index} style={styles.instructionRow}>
                    <View style={styles.instructionNumber}>
                      <Text style={styles.instructionNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.instructionText}>{instruction}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.modalBottomPadding} />
          </ScrollView>

          {/* Footer fijo con botón de añadir a lista */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.addToListButton}
              onPress={() => {
                setDetailModalVisible(false);
                // Filtrar ingredientes seleccionados
                const selected = selectedRecipe.ingredients?.filter((_, i) => selectedIngredients[i]) || [];
                handleAddIngredientsToShoppingList(selected);
              }}
            >
              <Ionicons name="cart-outline" size={20} color="#fff" />
              <Text style={styles.addToListButtonText}>
                {t.addToShoppingList || 'Añadir a Lista de Compras'}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  // Función para añadir ingredientes a la lista de compras
  const handleAddIngredientsToShoppingList = (ingredients) => {
    if (!ingredients || ingredients.length === 0) {
      Alert.alert(
        t.noIngredientsSelected || 'Sin ingredientes',
        t.selectIngredients || 'Selecciona al menos un ingrediente'
      );
      return;
    }

    console.log('🛒 Ingredientes a añadir:', ingredients);

    // Guardar ingredientes en estado
    setPendingIngredients(ingredients);
    setPendingListType('recipe');
    setSelectedExistingList(null);
    setSelectedExistingListIndex(null);

    // Abrir modal de selección de lista
    setListSelectionModalVisible(true);
  };

  return (
    <LinearGradient
      colors={['#e7ead2', '#e7ead2', '#e7ead2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={[styles.container]} edges={['top']}>
        {/* Tabs de categorías */}
        <View style={styles.daysWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.daysScrollContainer}
            contentContainerStyle={styles.daysScrollContent}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={`tab-${category}`}
                style={[
                  styles.dayTab,
                  activeCategory === category && styles.dayTabActive
                ]}
                onPress={() => scrollToCategory(category)}
              >
                <Ionicons
                  name={getCategoryIcon(category)}
                  size={18}
                  color={activeCategory === category ? "#374151" : "#6B7280"}
                  style={styles.tabIcon}
                />
                <Text style={[
                  styles.dayTabText,
                  activeCategory === category && styles.dayTabTextActive
                ]}>
                  {getCategoryName(category)}
                </Text>
                {recipes[category].length > 0 && (
                  <View style={styles.recipeBadge}>
                    <Text style={styles.recipeBadgeText}>{recipes[category].length}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Contenido de la categoría activa */}
        <Animated.View style={[styles.scrollView, { opacity: fadeAnim }]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.dayScrollView}
            contentContainerStyle={styles.dayScrollContent}
          >
            {/* Empty state */}
            {generatingCategory !== activeCategory && recipes[activeCategory].length === 0 ? (
              renderEmptyState(activeCategory)
            ) : (
              <>
                {/* Header con botón regenerar todas */}
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryTitle}>
                    {getCategoryName(activeCategory)}
                  </Text>
                  {(() => {
                    const { canGenerate, remainingAttempts, hoursLeft } = canGenerateInCategory(activeCategory);
                    const isBlocked = !canGenerate;

                    return (
                      <TouchableOpacity
                        style={[
                          styles.regenerateAllButton,
                          isBlocked && styles.regenerateAllButtonBlocked
                        ]}
                        onPress={() => {
                          if (isBlocked) {
                            Alert.alert(
                              t.limitReached || 'Límite alcanzado',
                              t.limitReachedMessage?.replace('{{hours}}', hoursLeft) ||
                              `Has alcanzado el límite de 2 generaciones. Podrás generar de nuevo en ${hoursLeft} horas.`,
                              [{ text: t.ok || 'OK' }]
                            );
                            return;
                          }

                          Alert.alert(
                            t.regenerate || 'Regenerar',
                            `${t.regenerateConfirm || '¿Quieres regenerar la receta?'}\n\n${t.attemptsRemaining || 'Intentos restantes'}: ${remainingAttempts}/2`,
                            [
                              { text: t.cancel || 'Cancelar', style: 'cancel' },
                              {
                                text: t.regenerate || 'Regenerar',
                                onPress: () => generateRecipesForCategory(activeCategory)
                              }
                            ]
                          );
                        }}
                        disabled={isBlocked}
                      >
                        <Ionicons
                          name={isBlocked ? "lock-closed" : "refresh"}
                          size={18}
                          color={isBlocked ? "#9CA3AF" : "#8B5CF6"}
                        />
                        <Text style={[
                          styles.regenerateAllButtonText,
                          isBlocked && styles.regenerateAllButtonTextBlocked
                        ]}>
                          {isBlocked
                            ? `${t.blocked || 'Bloqueado'} (${hoursLeft}h)`
                            : `${t.regenerate || 'Regenerar'} (${remainingAttempts}/2)`
                          }
                        </Text>
                      </TouchableOpacity>
                    );
                  })()}
                </View>

                {/* Grid de recetas o skeleton */}
                <View style={styles.recipesGrid}>
                  {generatingCategory === activeCategory ? (
                    renderRecipeSkeleton()
                  ) : (
                    recipes[activeCategory].map((recipe, index) =>
                      renderRecipeCard(recipe, index, activeCategory)
                    )
                  )}
                </View>
              </>
            )}
          </ScrollView>
        </Animated.View>

        {/* Modal de detalle de receta */}
        {renderRecipeDetailModal()}

        {/* Modales de configuración y listas */}
        <PreferencesModal
          visible={preferencesModalVisible}
          onClose={() => setPreferencesModalVisible(false)}
          onPreferencesUpdated={handlePreferencesUpdated}
        />

        <ListSelectionModal
          visible={listSelectionModalVisible}
          onClose={() => setListSelectionModalVisible(false)}
          onCreateNew={handleCreateNewList}
          onSelectExisting={handleSelectExistingList}
        />

        <ListNameModal
          visible={listNameModalVisible}
          onClose={() => setListNameModalVisible(false)}
          onSubmit={(name) => {
            setListNameModalVisible(false);
            generateShoppingList(name);
          }}
        />

        <CustomAlert
          visible={alertVisible}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          buttons={alertConfig.buttons}
          onClose={() => setAlertVisible(false)}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  // ========== CONTENEDORES PRINCIPALES ==========
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },

  // ========== TABS ==========
  daysWrapper: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 8,
  },
  daysScrollContainer: {
    maxHeight: 60,
    backgroundColor: 'transparent',
  },
  daysScrollContent: {
    paddingHorizontal: 12,
    gap: 8,
    alignItems: 'center',
  },
  dayTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    gap: 6,
  },
  dayTabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  dayTabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  dayTabTextActive: {
    color: '#374151',
  },
  tabIcon: {
    marginRight: 2,
  },
  recipeBadge: {
    backgroundColor: '#8B5CF6',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  recipeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },

  // ========== EMPTY STATE ==========
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  generateButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },


  // ========== HEADER DE CATEGORÍA ==========
  dayScrollView: {
    flex: 1,
  },
  dayScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
  },
  regenerateAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  regenerateAllButtonBlocked: {
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
    opacity: 0.7,
  },
  regenerateAllButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  regenerateAllButtonTextBlocked: {
    color: '#9CA3AF',
  },

  // ========== RECIPE CARDS ==========
  recipesGrid: {
    gap: 16,
    alignItems: 'center',
    paddingBottom: 24,
  },
  recipeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    width: '100%',
    maxWidth: 500,
  },
  recipeImage: {
    width: '100%',
    height: 280,
    backgroundColor: '#E5E7EB',
  },
  recipeChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 8,
  },
  recipeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  recipeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  recipeContent: {
    padding: 16,
    paddingTop: 4,
  },
  recipeName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  regenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  regenerateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
  },

  // ========== MODAL DE DETALLE ==========
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  modalHeaderSpacer: {
    width: 36,
  },
  modalScrollView: {
    flex: 1,
  },
  modalRecipeImage: {
    width: '100%',
    height: 240,
    backgroundColor: '#E5E7EB',
  },
  modalChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    backgroundColor: '#fff',
    gap: 12,
  },
  modalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  modalChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  modalSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  ingredientText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  modalBottomPadding: {
    height: 100,
  },
  modalFooter: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  addToListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  addToListButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },

  // ========== SKELETON LOADER ==========
  skeleton: {
    backgroundColor: '#D1D5DB',
  },
  skeletonLoaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(209, 213, 219, 0.9)',
    gap: 16,
    paddingHorizontal: 24,
  },
  skeletonLoaderText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#8B5CF6',
    marginTop: 8,
  },
  progressBarContainer: {
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
    gap: 8,
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  skeletonChip: {
    width: 70,
    height: 26,
    backgroundColor: '#D1D5DB',
    borderRadius: 8,
  },
  skeletonTitle: {
    width: '80%',
    height: 24,
    backgroundColor: '#D1D5DB',
    borderRadius: 6,
    marginBottom: 10,
  },
  skeletonDescription: {
    width: '100%',
    height: 40,
    backgroundColor: '#D1D5DB',
    borderRadius: 6,
  },
  skeletonButton: {
    width: 120,
    height: 36,
    backgroundColor: '#D1D5DB',
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 16,
  },
});

export default MealPlannerScreen;
