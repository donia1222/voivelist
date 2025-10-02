import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as RNLocalize from 'react-native-localize';
import MealPlanService from '../../services/MealPlanService';
import mealPlannerTranslations from '../translations/mealPlannerTranslations';

const MealSelectorModal = ({ visible, onClose, selectedDay, selectedMealType, onMealAdded, preferences, existingMeal, isSubscribed, onNavigateToSubscribe, onOpenPreferences }) => {
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
  const t = mealPlannerTranslations[deviceLanguage] || mealPlannerTranslations['en'];
  const [activeTab, setActiveTab] = useState('manual');
  const [mealName, setMealName] = useState('');
  const [servings, setServings] = useState(preferences?.servings || 2);
  const [cookingTime, setCookingTime] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState({ item: '', quantity: '', unit: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (preferences) {
      setServings(preferences.servings || 2);
    }
  }, [preferences]);

  useEffect(() => {
    if (existingMeal) {
      console.log('📝 Pre-llenando modal con comida existente:', existingMeal);
      setMealName(existingMeal.name || '');
      setServings(existingMeal.servings || preferences?.servings || 2);
      setCookingTime(existingMeal.time || '');
      setIngredients(existingMeal.ingredients || []);
    }
  }, [existingMeal, preferences]);

  const getMealTypeLabel = () => {
    const labels = {
      breakfast: t.breakfast || 'Desayuno',
      lunch: t.lunch || 'Almuerzo',
      dinner: t.dinner || 'Cena',
    };
    return labels[selectedMealType] || selectedMealType || '';
  };

  const addIngredient = () => {
    if (newIngredient.item.trim()) {
      setIngredients([...ingredients, { ...newIngredient }]);
      setNewIngredient({ item: '', quantity: '', unit: '' });
    }
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleAddMeal = () => {
    if (!mealName.trim()) {
      Alert.alert(t.error || 'Error', t.mealNameError || 'Debes ingresar un nombre para la comida');
      return;
    }

    const meal = {
      id: `meal_${Date.now()}`,
      name: mealName.trim(),
      servings: servings,
      time: cookingTime.trim() || '30 min',
      ingredients: ingredients,
      source: 'manual',
    };

    onMealAdded(meal);
    resetForm();
    onClose();
  };

  const handleAISuggestion = async () => {
    // Verificar suscripción antes de generar
    if (isSubscribed === false) {
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
                onClose(); // Cerrar el modal antes de navegar
                onNavigateToSubscribe();
              }
            }
          }
        ]
      );
      return;
    }

    try {
      setLoading(true);
      const suggestion = await MealPlanService.suggestMeal(selectedMealType, preferences);

      setMealName(suggestion.name);
      setServings(suggestion.servings);
      setCookingTime(suggestion.time);
      setIngredients(suggestion.ingredients || []);
      setActiveTab('manual');
    } catch (error) {
      Alert.alert(t.error || 'Error', t.aiSuggestionError || 'No se pudo generar la sugerencia. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setMealName('');
    setServings(preferences?.servings || 2);
    setCookingTime('');
    setIngredients([]);
    setNewIngredient({ item: '', quantity: '', unit: '' });
    setActiveTab('manual');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header con botón cerrar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {existingMeal ? (t.edit || 'Editar') : (t.add || 'Añadir')} {getMealTypeLabel()} - {selectedDay}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.modalContent}>
        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'manual' && styles.activeTab]}
            onPress={() => setActiveTab('manual')}
          >
            <Ionicons
              name="create-outline"
              size={24}
              color={activeTab === 'manual' ? '#fff' : '#8B5CF6'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'ai' && styles.activeTab]}
            onPress={() => setActiveTab('ai')}
          >
            <Ionicons
              name="sparkles"
              size={24}
              color={activeTab === 'ai' ? '#fff' : '#8B5CF6'}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {activeTab === 'manual' && (
            <View style={styles.manualForm}>
              {/* Nombre de la comida */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>{t.mealNameLabel || 'Nombre de la comida *'}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.mealNamePlaceholderExample || 'Ej: Ensalada César'}
                  value={mealName}
                  onChangeText={setMealName}
                />
              </View>

              {/* Porciones */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>{t.servingsLabel || 'Porciones'}</Text>
                <View style={styles.servingsControl}>
                  <TouchableOpacity
                    onPress={() => setServings(Math.max(1, servings - 1))}
                    style={styles.servingsButton}
                  >
                    <Ionicons name="remove-circle-outline" size={32} color="#8B5CF6" />
                  </TouchableOpacity>

                  <Text style={styles.servingsText}>{servings}</Text>

                  <TouchableOpacity
                    onPress={() => setServings(servings + 1)}
                    style={styles.servingsButton}
                  >
                    <Ionicons name="add-circle-outline" size={32} color="#8B5CF6" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Tiempo de preparación */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>{t.cookingTimeLabel || 'Tiempo de preparación'}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.cookingTimePlaceholder || 'Ej: 30 min'}
                  value={cookingTime}
                  onChangeText={setCookingTime}
                />
              </View>

              {/* Ingredientes */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>{t.ingredientsLabel || 'Ingredientes'}</Text>

                {ingredients.map((ingredient, index) => (
                  <View key={index} style={styles.ingredientItem}>
                    <Text style={styles.ingredientText}>
                      {ingredient.quantity} {ingredient.unit} {ingredient.item}
                    </Text>
                    <TouchableOpacity onPress={() => removeIngredient(index)}>
                      <Ionicons name="close-circle" size={20} color="#ff3b30" />
                    </TouchableOpacity>
                  </View>
                ))}

                <View style={styles.ingredientInput}>
                  <TextInput
                    style={[styles.input, styles.ingredientItemInput]}
                    placeholder={t.ingredientPlaceholder || 'Ingrediente'}
                    value={newIngredient.item}
                    onChangeText={(text) =>
                      setNewIngredient({ ...newIngredient, item: text })
                    }
                  />
                  <TextInput
                    style={[styles.input, styles.ingredientQuantityInput]}
                    placeholder={t.quantity || 'Cant.'}
                    value={newIngredient.quantity}
                    onChangeText={(text) =>
                      setNewIngredient({ ...newIngredient, quantity: text })
                    }
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.input, styles.ingredientUnitInput]}
                    placeholder={t.unit || 'Unidad'}
                    value={newIngredient.unit}
                    onChangeText={(text) =>
                      setNewIngredient({ ...newIngredient, unit: text })
                    }
                  />
                  <TouchableOpacity onPress={addIngredient} style={styles.addIngredientButton}>
                    <Ionicons name="add-circle" size={28} color="#10B981" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'ai' && (
            <View style={styles.aiTab}>
              <Ionicons name="sparkles" size={64} color="#8B5CF6" style={styles.aiIcon} />
              <Text style={styles.aiTitle}>{t.aiSuggestionTitle || 'Sugerencia con IA'}</Text>
              <Text style={styles.aiDescription}>
                {(t.aiSuggestionDescription || 'La IA generará una sugerencia de {meal} basada en tus preferencias dietéticas.')
                  .replace('{meal}', getMealTypeLabel()?.toLowerCase() || 'comida')}
              </Text>

              {loading ? (
                <ActivityIndicator size="large" color="#8B5CF6" style={styles.loader} />
              ) : (
                <View style={styles.aiButtonsContainer}>
                  <TouchableOpacity style={styles.aiButton} onPress={handleAISuggestion}>
                    <Ionicons name="flash" size={20} color="#fff" />
                    <Text style={styles.aiButtonText}>{t.generateSuggestion || 'Generar Sugerencia'}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.preferencesButton}
                    onPress={() => {
                      if (onOpenPreferences) {
                        onOpenPreferences();
                      }
                    }}
                  >
                    <Ionicons name="settings-outline" size={20} color="#8B5CF6" />
                    <Text style={styles.preferencesButtonText}>{t.preferences || 'Preferencias'}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Botón principal */}
        {activeTab === 'manual' && (
          <TouchableOpacity style={styles.addButton} onPress={handleAddMeal}>
            <Text style={styles.addButtonText}>
              {existingMeal ? (t.updateMeal || 'Actualizar Comida') : (t.addMeal || 'Añadir Comida')}
            </Text>
          </TouchableOpacity>
        )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  modalContent: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  activeTab: {
    backgroundColor: '#8B5CF6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  manualForm: {
    paddingBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  servingsControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  servingsButton: {
    padding: 4,
  },
  servingsText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8B5CF6',
    minWidth: 50,
    textAlign: 'center',
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 14,
    color: '#333',
  },
  ingredientInput: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  ingredientItemInput: {
    flex: 2,
  },
  ingredientQuantityInput: {
    flex: 1,
  },
  ingredientUnitInput: {
    flex: 1,
  },
  addIngredientButton: {
    padding: 4,
  },
  aiTab: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  aiIcon: {
    marginBottom: 20,
  },
  aiTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  aiDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  loader: {
    marginVertical: 20,
  },
  aiButtonsContainer: {
    alignItems: 'center',
    gap: 12,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    gap: 10,
  },
  aiButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  preferencesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  preferencesButtonText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#10B981',
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default MealSelectorModal;
