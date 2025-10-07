import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import MealPlanService from '../../services/MealPlanService';
import mealPlannerTranslations from '../translations/mealPlannerTranslations';

const PreferencesModal = ({ visible, onClose, onPreferencesUpdated, isSubscribed, onNavigateToSubscribe }) => {
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
  const t = mealPlannerTranslations[deviceLanguage] || mealPlannerTranslations['en'];

  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState('');
  const [cuisineDropdownOpen, setCuisineDropdownOpen] = useState(false);
  const [dietDropdownOpen, setDietDropdownOpen] = useState(false);
  const [customRestrictionText, setCustomRestrictionText] = useState('');

  const dietOptions = [
    { value: 'normal', label: t.noRestrictions || 'Sin restricciones', icon: null },
    { value: 'vegetarian', label: t.vegetarian || 'Vegetariana', icon: 'leaf' },
    { value: 'vegan', label: t.vegan || 'Vegana', icon: 'nutrition' },
    { value: 'keto', label: t.keto || 'Keto', icon: 'flame' },
    { value: 'gluten-free', label: t.glutenFree || 'Sin gluten', icon: 'ban' },
    { value: 'paleo', label: t.paleo || 'Paleo', icon: 'fitness' },
    { value: 'low-fat', label: t.lowFat || 'Baja en grasas', icon: 'water-outline' },
  ];

  const restrictionOptions = [
    { value: 'dairy', label: t.dairy || 'Lácteos' },
    { value: 'nuts', label: t.nuts || 'Frutos secos' },
    { value: 'seafood', label: t.seafood || 'Mariscos' },
    { value: 'eggs', label: t.eggs || 'Huevos' },
  ];

  const budgetOptions = [
    { value: 'low', label: t.low || 'Bajo' },
    { value: 'medium', label: t.medium || 'Medio' },
    { value: 'high', label: t.high || 'Alto' },
  ];

  const cookingLevelOptions = [
    { value: 'beginner', label: t.beginner || 'Principiante' },
    { value: 'intermediate', label: t.intermediate || 'Intermedio' },
    { value: 'advanced', label: t.advanced || 'Avanzado' },
  ];

  const cuisineTypeOptions = [
    { value: 'asian', label: t.asian || 'Asiática', icon: 'restaurant' },
    { value: 'italian', label: t.italian || 'Italiana', icon: 'pizza' },
    { value: 'mexican', label: t.mexican || 'Mexicana', icon: 'cafe' },
    { value: 'mediterranean', label: t.mediterraneanCuisine || 'Mediterránea', icon: 'fish' },
  ];

  useEffect(() => {
    if (visible) {
      loadPreferences();
      loadCountry();
    }
  }, [visible]);

  const loadCountry = async () => {
    try {
      let savedCountry = await AsyncStorage.getItem("@country");

      if (!savedCountry || savedCountry.trim() === '') {
        const countryCode = RNLocalize.getCountry();
        const countryNames = {
          'ES': 'España', 'MX': 'México', 'US': 'Estados Unidos',
          'AR': 'Argentina', 'CO': 'Colombia', 'CL': 'Chile',
          'PE': 'Perú', 'VE': 'Venezuela', 'EC': 'Ecuador',
          'BO': 'Bolivia', 'PY': 'Paraguay', 'UY': 'Uruguay',
          'CR': 'Costa Rica', 'PA': 'Panamá', 'GT': 'Guatemala',
          'HN': 'Honduras', 'SV': 'El Salvador', 'NI': 'Nicaragua',
          'DO': 'República Dominicana', 'PR': 'Puerto Rico', 'CU': 'Cuba',
          'FR': 'Francia', 'IT': 'Italia', 'DE': 'Alemania',
          'GB': 'Reino Unido', 'PT': 'Portugal', 'BR': 'Brasil',
          'CA': 'Canadá', 'JP': 'Japón', 'CN': 'China',
          'IN': 'India', 'RU': 'Rusia', 'AU': 'Australia',
          'CH': 'Suiza'
        };
        savedCountry = countryNames[countryCode] || countryCode || "tu zona";
      }

      setCountry(savedCountry);
    } catch (error) {
      console.error('Error al cargar país:', error);
      setCountry('');
    }
  };

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const prefs = await MealPlanService.getPreferences();
      setPreferences(prefs);
    } catch (error) {
      console.error('Error al cargar preferencias:', error);
      setPreferences(MealPlanService.getDefaultPreferences());
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = (key, value) => {
    setPreferences({ ...preferences, [key]: value });
  };

  const toggleRestriction = (restriction) => {
    const currentRestrictions = preferences.restrictions || [];
    const hasRestriction = currentRestrictions.includes(restriction);

    const newRestrictions = hasRestriction
      ? currentRestrictions.filter(r => r !== restriction)
      : [...currentRestrictions, restriction];

    updatePreference('restrictions', newRestrictions);
  };

  const hasRestriction = (restriction) => {
    return preferences?.restrictions?.includes(restriction) || false;
  };

  const addCustomRestriction = () => {
    const text = customRestrictionText.trim();
    if (!text) return;

    const currentCustom = preferences?.customRestrictions || [];
    const newCustom = [...currentCustom, text];

    updatePreference('customRestrictions', newCustom);
    setCustomRestrictionText('');
  };

  const removeCustomRestriction = (index) => {
    const currentCustom = preferences?.customRestrictions || [];
    const newCustom = currentCustom.filter((_, i) => i !== index);
    updatePreference('customRestrictions', newCustom);
  };

  const handleSave = async () => {
    // Verificar suscripción antes de guardar preferencias
    if (isSubscribed === false) {
      Alert.alert(
        t.subscriptionRequiredTitle || 'Suscripción requerida',
        t.subscriptionRequiredMessage || 'Para usar preferencias personalizadas necesitas una suscripción activa.',
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
      const success = await MealPlanService.savePreferences(preferences);

      if (success) {
        onPreferencesUpdated && onPreferencesUpdated(preferences);
        onClose();
      }
    } catch (error) {
      Alert.alert(t.error || 'Error', t.errorSaving || 'No se pudieron guardar las preferencias');
    }
  };

  const handleClose = async () => {
    try {
      await MealPlanService.savePreferences(preferences);
      onPreferencesUpdated && onPreferencesUpdated(preferences);
      onClose();
    } catch (error) {
      onClose();
    }
  };

  if (loading) {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <Text>{t.loading || 'Cargando...'}</Text>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>{t.dietaryPreferences || 'Preferencias Dietéticas'}</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveHeaderButton}>
            <Ionicons name="checkmark-circle" size={32} color="#10B981" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Tipo de Dieta - Dropdown */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.dropdownHeader}
              onPress={() => setDietDropdownOpen(!dietDropdownOpen)}
            >
              <View style={styles.dropdownHeaderLeft}>
                <Ionicons name="nutrition-outline" size={24} color="#8B5CF6" />
                <Text style={styles.dropdownHeaderText}>
                  {t.dietType || 'Tipo de Dieta'}
                </Text>
                {preferences?.diet && preferences.diet !== 'normal' && (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>
                      {dietOptions.find(o => o.value === preferences.diet)?.label || ''}
                    </Text>
                  </View>
                )}
              </View>
              <Ionicons
                name={dietDropdownOpen ? 'chevron-up' : 'chevron-down'}
                size={24}
                color="#8B5CF6"
              />
            </TouchableOpacity>

            {dietDropdownOpen && (
              <View style={styles.dropdownContent}>
                {dietOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.dropdownOption,
                      preferences?.diet === option.value && styles.dropdownOptionSelected,
                    ]}
                    onPress={() => {
                      updatePreference('diet', option.value);
                      setDietDropdownOpen(false);
                    }}
                  >
                    {option.icon ? (
                      <Ionicons name={option.icon} size={22} color="#6B21A8" />
                    ) : (
                      <Ionicons name="checkmark-outline" size={22} color="#6B21A8" />
                    )}
                    <Text style={styles.dropdownOptionText}>{option.label}</Text>
                    {preferences?.diet === option.value && (
                      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.helperText}>
              {t.dietTypeHelper}
            </Text>
          </View>

          {/* Tipo de Cocina - Dropdown */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.dropdownHeader}
              onPress={() => setCuisineDropdownOpen(!cuisineDropdownOpen)}
            >
              <View style={styles.dropdownHeaderLeft}>
                <Ionicons name="restaurant-outline" size={24} color="#8B5CF6" />
                <Text style={styles.dropdownHeaderText}>
                  {t.cuisineType || 'Tipo de Cocina'}
                </Text>
                {preferences?.cuisineType && preferences.cuisineType !== 'varied' && (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>
                      {cuisineTypeOptions.find(o => o.value === preferences.cuisineType)?.label || ''}
                    </Text>
                  </View>
                )}
              </View>
              <Ionicons
                name={cuisineDropdownOpen ? 'chevron-up' : 'chevron-down'}
                size={24}
                color="#8B5CF6"
              />
            </TouchableOpacity>

            {cuisineDropdownOpen && (
              <View style={styles.dropdownContent}>
                {/* Opción "Variada" por defecto */}
                <TouchableOpacity
                  style={[
                    styles.dropdownOption,
                    (!preferences?.cuisineType || preferences.cuisineType === 'varied') && styles.dropdownOptionSelected,
                  ]}
                  onPress={() => {
                    updatePreference('cuisineType', 'varied');
                    setCuisineDropdownOpen(false);
                  }}
                >
                  <Ionicons name="earth" size={22} color="#6B21A8" />
                  <Text style={styles.dropdownOptionText}>{t.varied || 'Variada'}</Text>
                  {(!preferences?.cuisineType || preferences.cuisineType === 'varied') && (
                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  )}
                </TouchableOpacity>

                {/* Opciones específicas */}
                {cuisineTypeOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.dropdownOption,
                      preferences?.cuisineType === option.value && styles.dropdownOptionSelected,
                    ]}
                    onPress={() => {
                      updatePreference('cuisineType', option.value);
                      setCuisineDropdownOpen(false);
                    }}
                  >
                    <Ionicons name={option.icon} size={22} color="#6B21A8" />
                    <Text style={styles.dropdownOptionText}>{option.label}</Text>
                    {preferences?.cuisineType === option.value && (
                      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.helperText}>
              {t.cuisineTypeHelper || 'Las recetas se enfocarán en este tipo de cocina'}
            </Text>
          </View>

          {/* Porciones */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.defaultServings || 'Porciones por Defecto'}</Text>
            <View style={styles.servingsWrapper}>
              <View style={styles.servingsControl}>
                <TouchableOpacity
                  onPress={() => updatePreference('servings', Math.max(1, preferences.servings - 1))}
                  style={styles.servingsButton}
                >
                  <Ionicons name="remove-circle" size={24} color="#6B21A8" />
                </TouchableOpacity>

                <Text style={styles.servingsText}>{preferences?.servings || 2}</Text>

                <TouchableOpacity
                  onPress={() => updatePreference('servings', preferences.servings + 1)}
                  style={styles.servingsButton}
                >
                  <Ionicons name="add-circle" size={24} color="#6B21A8" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Restricciones */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.restrictionsAllergies || 'Restricciones / Alergias'}</Text>
            <View style={styles.restrictionsList}>
              {restrictionOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.restrictionOption}
                  onPress={() => toggleRestriction(option.value)}
                >
                  <Ionicons
                    name={hasRestriction(option.value) ? 'checkbox' : 'square-outline'}
                    size={24}
                    color="#8B5CF6"
                  />
                  <Text style={styles.restrictionLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Input para otras restricciones */}
            <View style={styles.customRestrictionInput}>
              <Ionicons name="add-circle-outline" size={20} color="#8B5CF6" />
              <TextInput
                style={styles.restrictionTextInput}
                placeholder={t.customRestrictions}
                placeholderTextColor="#999"
                value={customRestrictionText}
                onChangeText={setCustomRestrictionText}
                multiline
              />
              {customRestrictionText.trim().length > 0 && (
                <TouchableOpacity onPress={addCustomRestriction} style={styles.addRestrictionButton}>
                  <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.helperText}>
              {t.customRestrictionsHelper}
            </Text>

            {/* Restricciones personalizadas agregadas */}
            {preferences?.customRestrictions && Array.isArray(preferences.customRestrictions) && preferences.customRestrictions.length > 0 && (
              <View style={styles.customRestrictionsChips}>
                {preferences.customRestrictions.map((restriction, index) => (
                  <View key={index} style={styles.restrictionChip}>
                    <Text style={styles.restrictionChipText}>{restriction}</Text>
                    <TouchableOpacity onPress={() => removeCustomRestriction(index)}>
                      <Ionicons name="close-circle" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Presupuesto */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.budget || 'Presupuesto'}</Text>
            <View style={styles.segmentedControl}>
              {budgetOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.segment,
                    preferences?.budget === option.value && styles.segmentSelected,
                  ]}
                  onPress={() => updatePreference('budget', option.value)}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      preferences?.budget === option.value && styles.segmentTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Nivel de Cocina */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.cookingLevel || 'Nivel de Cocina'}</Text>
            <View style={styles.segmentedControl}>
              {cookingLevelOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.segment,
                    preferences?.cookingLevel === option.value && styles.segmentSelected,
                  ]}
                  onPress={() => updatePreference('cookingLevel', option.value)}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      preferences?.cookingLevel === option.value && styles.segmentTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Ayuno Intermitente */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.intermittentFasting || 'Ayuno Intermitente'}</Text>
            <TouchableOpacity
              style={styles.toggleOption}
              onPress={() => updatePreference('intermittentFasting', !preferences?.intermittentFasting)}
            >
              <View style={styles.toggleLeft}>
                <Ionicons name="time-outline" size={24} color="#8B5CF6" />
                <Text style={styles.toggleLabel}>{t.enableIntermittentFasting || 'Activar ayuno intermitente'}</Text>
              </View>
              <Ionicons
                name={preferences?.intermittentFasting ? 'checkbox' : 'square-outline'}
                size={28}
                color="#8B5CF6"
              />
            </TouchableOpacity>
            {preferences?.intermittentFasting && (
              <Text style={styles.helperText}>
                {t.fastingHelper || 'Las recetas se adaptarán para ventanas de alimentación reducidas'}
              </Text>
            )}
          </View>

          {/* Máximo de Calorías */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.maxCalories || 'Máximo de Calorías'}</Text>
            <TouchableOpacity
              style={styles.toggleOption}
              onPress={() => updatePreference('maxCaloriesEnabled', !preferences?.maxCaloriesEnabled)}
            >
              <View style={styles.toggleLeft}>
                <Ionicons name="flame-outline" size={24} color="#8B5CF6" />
                <Text style={styles.toggleLabel}>{t.limitCalories || 'Limitar calorías por comida'}</Text>
              </View>
              <Ionicons
                name={preferences?.maxCaloriesEnabled ? 'checkbox' : 'square-outline'}
                size={28}
                color="#8B5CF6"
              />
            </TouchableOpacity>
            {preferences?.maxCaloriesEnabled && (
              <View style={styles.caloriesInput}>
                <Text style={styles.inputLabel}>{t.maxCaloriesPerMeal || 'Calorías máximas por comida:'}</Text>
                <TextInput
                  style={styles.textInput}
                  value={preferences?.maxCalories?.toString() || ''}
                  onChangeText={(text) => updatePreference('maxCalories', parseInt(text) || 0)}
                  keyboardType="numeric"
                  placeholder={t.caloriesPlaceholder}
                  placeholderTextColor="#999"
                />
                <Text style={styles.inputUnit}>kcal</Text>
              </View>
            )}
          </View>

          {/* Productos de Temporada */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.seasonalProducts || 'Productos de Temporada'}</Text>
            <TouchableOpacity
              style={styles.toggleOption}
              onPress={() => updatePreference('seasonalProducts', !preferences?.seasonalProducts)}
            >
              <View style={styles.toggleLeft}>
                <Ionicons name="leaf-outline" size={24} color="#8B5CF6" />
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleLabel}>{t.useSeasonalProducts || 'Usar productos de temporada'}</Text>
                  {country && (
                    <Text style={styles.countryBadge}>📍 {country}</Text>
                  )}
                </View>
              </View>
              <Ionicons
                name={preferences?.seasonalProducts ? 'checkbox' : 'square-outline'}
                size={28}
                color="#8B5CF6"
              />
            </TouchableOpacity>
            {preferences?.seasonalProducts && (
              <Text style={styles.helperText}>
                {t.seasonalHelper || 'Las recetas usarán ingredientes de temporada según tu ubicación y el mes actual'}
              </Text>
            )}
          </View>

          {/* IA Local (Ollama) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🤖 IA Local (Experimental)</Text>
            <TouchableOpacity
              style={styles.toggleOption}
              onPress={() => {
                const newValue = !preferences?.useLocalAI;
                console.log('🔄 Switch IA Local:', newValue ? 'Activado' : 'Desactivado');
                updatePreference('useLocalAI', newValue);
              }}
            >
              <View style={styles.toggleLeft}>
                <Ionicons name="hardware-chip-outline" size={24} color="#3B82F6" />
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleLabel}>Usar IA Local (Ollama)</Text>
                </View>
              </View>
              <Ionicons
                name={preferences?.useLocalAI ? 'checkbox' : 'square-outline'}
                size={28}
                color="#3B82F6"
              />
            </TouchableOpacity>
            {preferences?.useLocalAI && (
              <View>
                <Text style={styles.helperText}>
                  ⚡ Las recetas se generarán con tu IA local en lugar de ChatGPT
                </Text>

                {/* Selector de modelo */}
                <View style={styles.modelSelector}>
                  <Text style={[styles.toggleLabel, { marginBottom: 8 }]}>Modelo de IA:</Text>
                  {[
                    { value: 'ALIENTELLIGENCE/gourmetglobetrotter:latest', label: 'Gourmet Globetrotter 🌍 (Especializado)', icon: 'globe' },
                    { value: 'gemma3:4b', label: 'Gemma 3 4B (Alta calidad)', icon: 'star' },
                    { value: 'llama3.2:1b', label: 'Llama 3.2 1B 🔥 (Recomendado)', icon: 'flame' },
                    { value: 'gemma2:2b', label: 'Gemma 2 2B (Balance)', icon: 'checkmark-circle' },
                    { value: 'qwen2.5:1.5b', label: 'Qwen 2.5 1.5B ⚡', icon: 'flash-outline' },
                    { value: 'gemma3:1b', label: 'Gemma 3 1B', icon: 'rocket-outline' },
                  ].map((model) => (
                    <TouchableOpacity
                      key={model.value}
                      style={[
                        styles.modelOption,
                        (preferences?.aiModel || 'llama3.2:1b') === model.value && styles.modelOptionSelected
                      ]}
                      onPress={() => {
                        console.log('🎯 Modelo seleccionado:', model.value);
                        updatePreference('aiModel', model.value);
                      }}
                    >
                      <Ionicons
                        name={model.icon}
                        size={20}
                        color={(preferences?.aiModel || 'llama3.2:1b') === model.value ? '#3B82F6' : '#666'}
                      />
                      <Text style={[
                        styles.modelLabel,
                        (preferences?.aiModel || 'llama3.2:1b') === model.value && styles.modelLabelSelected
                      ]}>
                        {model.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  headerSpacer: {
    width: 36,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dietOption: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
  },
  dietOptionSelected: {
    borderColor: '#6B21A8',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  dietOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B21A8',
  },
  dietOptionTextSelected: {
    color: '#6B21A8',
  },
  servingsWrapper: {
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  servingsControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  servingsButton: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  servingsText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6B21A8',
    minWidth: 40,
    textAlign: 'center',
  },
  restrictionsList: {
    gap: 12,
  },
  restrictionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  restrictionLabel: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  customRestrictionInput: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
  },
  restrictionTextInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    minHeight: 40,
    textAlignVertical: 'top',
  },
  addRestrictionButton: {
    padding: 4,
  },
  customRestrictionsChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  restrictionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  restrictionChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B21A8',
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
  },
  segment: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  segmentSelected: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B21A8',
  },
  segmentTextSelected: {
    color: '#6B21A8',
  },
  toggleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  toggleTextContainer: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  countryBadge: {
    fontSize: 12,
    color: '#8B5CF6',
    marginTop: 4,
    fontWeight: '500',
  },
  helperText: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
    lineHeight: 18,
  },
  caloriesInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  textInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#8B5CF6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  inputUnit: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
  },
  dropdownHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  dropdownHeaderText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  selectedBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  selectedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B21A8',
  },
  dropdownContent: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownOptionSelected: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
  },
  dropdownOptionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  modelSelector: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  modelOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  modelOptionSelected: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: '#3B82F6',
  },
  modelLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    flex: 1,
  },
  modelLabelSelected: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  bottomPadding: {
    height: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#10B981',
    gap: 8,
  },
  saveButtonText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default PreferencesModal;
