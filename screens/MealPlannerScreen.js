import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as RNLocalize from 'react-native-localize';
import { useTheme } from '../ThemeContext';
import MealPlanService from '../services/MealPlanService';
import ShoppingListConsolidator from '../services/ShoppingListConsolidator';
import MealSlot from './components/MealSlot';
import MealSelectorModal from './components/MealSelectorModal';
import CalendarSelectorModal from './components/CalendarSelectorModal';
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

  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeDay, setActiveDay] = useState('monday');

  const scrollViewRef = useRef(null);
  const dayRefs = useRef({});

  // Modales de header
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [preferencesModalVisible, setPreferencesModalVisible] = useState(false);
  const [listSelectionModalVisible, setListSelectionModalVisible] = useState(false);
  const [listNameModalVisible, setListNameModalVisible] = useState(false);
  const [pendingListType, setPendingListType] = useState(null); // 'week' o 'day'
  const [pendingDay, setPendingDay] = useState(null); // para lista de día específico
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

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const getDayAbbreviation = (day) => {
    const abbreviations = {
      monday: t.mondayShort || 'Lu',
      tuesday: t.tuesdayShort || 'Ma',
      wednesday: t.wednesdayShort || 'Mi',
      thursday: t.thursdayShort || 'Ju',
      friday: t.fridayShort || 'Vi',
      saturday: t.saturdayShort || 'Sá',
      sunday: t.sundayShort || 'Do'
    };
    return abbreviations[day] || day;
  };

  const getDayName = (day) => {
    const dayNames = {
      monday: t.monday || 'Lunes',
      tuesday: t.tuesday || 'Martes',
      wednesday: t.wednesday || 'Miércoles',
      thursday: t.thursday || 'Jueves',
      friday: t.friday || 'Viernes',
      saturday: t.saturday || 'Sábado',
      sunday: t.sunday || 'Domingo'
    };
    return dayNames[day] || day;
  };

  const getMonthName = (monthIndex) => {
    const months = [
      t.january, t.february, t.march, t.april, t.may, t.june,
      t.july, t.august, t.september, t.october, t.november, t.december
    ];
    return months[monthIndex] || monthIndex + 1;
  };

  const scrollToDay = (day) => {
    setActiveDay(day);
    const dayIndex = days.indexOf(day);
    if (dayIndex !== -1 && scrollViewRef.current) {
      const screenWidth = Dimensions.get('window').width;
      scrollViewRef.current.scrollTo({ x: dayIndex * screenWidth, animated: true });
    }
  };

  const getTodayDay = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado
    const dayMapping = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday'
    };
    return dayMapping[dayOfWeek];
  };

  useEffect(() => {
    loadWeekPlan();
    loadPreferences();
    checkSubscriptionStatus();
  }, [currentWeekStart]);

  // Scroll al día de hoy cuando se carga la pantalla
  useEffect(() => {
    const todayDay = getTodayDay();
    // Verificar si el día de hoy está dentro de la semana actual
    const today = new Date();
    const weekStart = MealPlanService.getWeekStart(today);

    if (weekStart.getTime() === currentWeekStart.getTime()) {
      // Solo hacer scroll si estamos en la semana actual
      setActiveDay(todayDay);
      // Pequeño delay para asegurar que el ScrollView esté renderizado
      setTimeout(() => {
        scrollToDay(todayDay);
      }, 100);
    }
  }, []);

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

      // Si keepCurrentDay es true, mantener el scroll en el día activo
      if (keepCurrentDay && activeDay) {
        setTimeout(() => {
          scrollToDay(activeDay);
        }, 150);
      }
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

  const openMealSelector = (day, mealType, existingMeal = null) => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
    setSelectedMeal(existingMeal);
    setModalVisible(true);
  };

  const closeMealSelector = () => {
    setModalVisible(false);
    setSelectedDay(null);
    setSelectedMealType(null);
    setSelectedMeal(null);
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

  const generateSingleMealWithAI = async (day, mealType) => {
    // Verificar suscripción antes de generar
    if (isSubscribed === false) {
      showSubscriptionAlert();
      return;
    }

    const mealKey = `${day}_${mealType}`;

    try {
      console.log(`🍽️ [generateSingleMeal] Generando SOLO ${mealType} para ${day}`);
      console.log(`🍽️ [generateSingleMeal] currentWeekStart:`, currentWeekStart);

      if (!preferences) {
        Alert.alert(t.error, t.errorLoadingPreferences);
        return;
      }

      setGeneratingMeals(prev => ({ ...prev, [mealKey]: true }));

      console.log(`🍽️ [generateSingleMeal] Llamando a suggestMeal para ${mealType}...`);
      const suggestedMeal = await MealPlanService.suggestMeal(mealType, preferences, weekPlan, day);
      console.log(`🍽️ [generateSingleMeal] Comida sugerida:`, suggestedMeal);
      console.log(`🍽️ [generateSingleMeal] Guardando en día: ${day}, tipo: ${mealType}`);

      const success = await MealPlanService.addMealToSlot(
        currentWeekStart,
        day,
        mealType,
        suggestedMeal
      );

      console.log(`🍽️ [generateSingleMeal] Guardado exitoso: ${success}`);

      if (success) {
        console.log(`🍽️ [generateSingleMeal] Recargando plan...`);
        console.log(`🍽️ [generateSingleMeal] Día activo antes de recargar: ${activeDay}`);

        // Recargar el plan manteniendo el día actual
        await loadWeekPlan(true);
        console.log(`🍽️ [generateSingleMeal] Plan recargado`);

        // Limpiar estado de generación DESPUÉS de recargar el plan
        setGeneratingMeals(prev => {
          const newState = { ...prev };
          delete newState[mealKey];
          return newState;
        });
      }
    } catch (error) {
      console.error('❌ [generateSingleMeal] Error al generar comida con IA:', error);
      Alert.alert(t.error, `${t.errorGeneratingMeal}: ${error.message}`);

      // Limpiar estado de generación en caso de error
      setGeneratingMeals(prev => {
        const newState = { ...prev };
        delete newState[mealKey];
        return newState;
      });
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


  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container]} edges={['top']}>
      {/* Header con 2 botones grandes estilo tabs */}
      <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerTab}
            onPress={() => setCalendarModalVisible(true)}
          >
            <Ionicons name="calendar-outline" size={20} color="#414141ff" />
            <Text style={styles.headerTabText}>{weekPlan?.weekRange || t.currentWeek}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerTab}
            onPress={() => setPreferencesModalVisible(true)}
          >
            <Ionicons name="settings-outline" size={20} color="#414141ff" />
            <Text style={styles.headerTabText}>{t.preferences}</Text>
          </TouchableOpacity>
        </View>

         
      {/* Scroll horizontal de días */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.daysScrollContainer}
        contentContainerStyle={styles.daysScrollContent}
      >
        {days.map((day) => (
          <TouchableOpacity
            key={`tab-${day}`}
            style={[
              styles.dayTab,
              activeDay === day && styles.dayTabActive
            ]}
            onPress={() => scrollToDay(day)}
          >
            <Text style={[
              styles.dayTabText,
              activeDay === day && styles.dayTabTextActive
            ]}>
              {getDayAbbreviation(day)}
            </Text>
            {hasMeals(day) && !isDayComplete(day) && (
              <View style={styles.dayTabDot} />
            )}
            {isDayComplete(day) && (
              <Ionicons name="checkmark-circle" size={12} color={activeDay === day ? "#fff" : "#10B981"} style={styles.dayTabCheck} />
            )}
          </TouchableOpacity>
        ))}
        
      </ScrollView>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        snapToInterval={Dimensions.get('window').width}
        decelerationRate="fast"
        onScroll={(event) => {
          const offsetX = event.nativeEvent.contentOffset.x;
          const screenWidth = Dimensions.get('window').width;
          const currentIndex = Math.round(offsetX / screenWidth);
          if (currentIndex >= 0 && currentIndex < days.length) {
            setActiveDay(days[currentIndex]);
          }
        }}
        scrollEventThrottle={16}
      >

        
        {days.map((day) => {
          const dayDate = MealPlanService.getDateForDay(day, currentWeekStart);
          const dayName = getDayName(day);
          const monthName = getMonthName(dayDate.getMonth());
          const formattedDate = `${dayDate.getDate()} ${monthName}`;

          return (
            <View
              key={day}
              ref={(ref) => (dayRefs.current[day] = ref)}
              style={styles.dayContainerHorizontal}
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.dayContainer}>
                  <View style={styles.dayHeader}>
                    <Text style={styles.dayName}>{dayName}</Text>
                    <Text style={styles.dayDate}>{formattedDate}</Text>
                  </View>

              <MealSlot
                mealType="breakfast"
                meal={weekPlan?.plan?.[day]?.breakfast}
                onPress={() => openMealSelector(day, 'breakfast', weekPlan?.plan?.[day]?.breakfast)}
                onRemove={() => handleRemoveMeal(day, 'breakfast')}
                onGenerateWithAI={() => generateSingleMealWithAI(day, 'breakfast')}
                isGenerating={generatingMeals[`${day}_breakfast`]}
                translations={t}
              />

              <MealSlot
                mealType="lunch"
                meal={weekPlan?.plan?.[day]?.lunch}
                onPress={() => openMealSelector(day, 'lunch', weekPlan?.plan?.[day]?.lunch)}
                onRemove={() => handleRemoveMeal(day, 'lunch')}
                onGenerateWithAI={() => generateSingleMealWithAI(day, 'lunch')}
                isGenerating={generatingMeals[`${day}_lunch`]}
                translations={t}
              />

              <MealSlot
                mealType="dinner"
                meal={weekPlan?.plan?.[day]?.dinner}
                onPress={() => openMealSelector(day, 'dinner', weekPlan?.plan?.[day]?.dinner)}
                onRemove={() => handleRemoveMeal(day, 'dinner')}
                onGenerateWithAI={() => generateSingleMealWithAI(day, 'dinner')}
                isGenerating={generatingMeals[`${day}_dinner`]}
                translations={t}
              />



              {/* Botón generar lista para este día */}
              <TouchableOpacity
                style={styles.generateDayListButton}
                onPress={() => openListSelectionModal('day', day)}
              >
                <Ionicons name="cart-outline" size={16} color="#059669" />
                <Text style={styles.generateDayListButtonText}>{t.dayShoppingList}</Text>
              </TouchableOpacity>
                </View>


              </ScrollView>
            </View>
          );
        })}


      </ScrollView>

      <MealSelectorModal
        visible={modalVisible}
        onClose={closeMealSelector}
        selectedDay={selectedDay ? getDayName(selectedDay) : ''}
        selectedMealType={selectedMealType}
        onMealAdded={handleMealAdded}
        preferences={preferences}
        existingMeal={selectedMeal}
        isSubscribed={isSubscribed}
        onNavigateToSubscribe={onNavigateToSubscribe}
        onOpenPreferences={() => {
          closeMealSelector();
          setPreferencesModalVisible(true);
        }}
      />

      <CalendarSelectorModal
        visible={calendarModalVisible}
        onClose={() => setCalendarModalVisible(false)}
        currentWeekStart={currentWeekStart}
        onWeekSelected={(weekStart) => {
          setCurrentWeekStart(weekStart);
        }}
        onGenerateShoppingList={(weekStart) => {
          setCurrentWeekStart(weekStart);
          openListSelectionModal('week');
        }}
      />

      <PreferencesModal
        visible={preferencesModalVisible}
        onClose={() => setPreferencesModalVisible(false)}
        onPreferencesUpdated={handlePreferencesUpdated}
        isSubscribed={isSubscribed}
        onNavigateToSubscribe={onNavigateToSubscribe}
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
        onConfirm={generateShoppingList}
        defaultName={
          pendingListType === 'week'
            ? `${t.weeklyList} ${weekPlan?.weekRange || ''}`
            : pendingDay
            ? `${t.dayList} ${getDayName(pendingDay)}`
            : t.shopping
        }
      />

      <CustomAlert
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        buttons={alertConfig.buttons}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e7ead2",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#e7ead2",
  },
  header: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
  daysScrollContainer: {
    maxHeight: 40,
    backgroundColor: 'transparent',
    marginBottom: 8,
  },
  daysScrollContent: {
    paddingHorizontal: 16,
    gap: 6,
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  dayTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
 
    minWidth: 40,
    alignItems: 'center',
    position: 'relative',
  },
  dayTabActive: {
     backgroundColor: 'rgba(16, 185, 129, 0.7)',

  },
  dayTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#414141ff',
  },
  dayTabTextActive: {
    color: '#fff',
  },
  dayTabDate: {
    fontSize: 9,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 2,
  },
  dayTabDateActive: {
    color: '#fff',
    opacity: 0.9,
  },
  dayTabDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
  },
  dayTabCheck: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  headerTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
     backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingVertical: 8,
    paddingHorizontal: 1,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  headerTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#414141ff',
    textAlign: 'center',
    flexShrink: 1,
  },
  weekListContainer: {
    backgroundColor: '#ffffffff',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weekListHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  weekListTextContainer: {
    flex: 1,
  },
  weekListTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  weekListSubtitle: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  weekListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  weekListButtonText: {
    color: '#414141ff',
    fontSize: 15,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  dayContainerHorizontal: {
    width: Dimensions.get('window').width,
    paddingHorizontal: 16,
  
  },
  dayContainer: {
 backgroundColor: '#ffffffff',
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#cbbdbdff',
  },
  dayName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  dayDate: {
    fontSize: 14,
    color: '#666',
  },
  generateDayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 12,
    gap: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  generateDayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
  },
  generateDayListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
    gap: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  generateDayListButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
  },
  bottomPadding: {
    height: 40,
  },
});

export default MealPlannerScreen;
