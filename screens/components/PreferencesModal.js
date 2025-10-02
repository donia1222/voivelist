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

  const dietOptions = [
    { value: 'normal', label: t.noRestrictions || 'Sin restricciones', icon: null },
    { value: 'vegetarian', label: t.vegetarian || 'Vegetariana', icon: 'leaf' },
    { value: 'vegan', label: t.vegan || 'Vegana', icon: 'nutrition' },
    { value: 'keto', label: t.keto || 'Keto', icon: 'flame' },
    { value: 'gluten-free', label: t.glutenFree || 'Sin gluten', icon: 'ban' },
    { value: 'mediterranean', label: t.mediterranean || 'Mediterránea', icon: 'fish' },
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
        Alert.alert(t.saved || 'Guardado', t.preferencesSaved || 'Preferencias guardadas correctamente');
        onPreferencesUpdated && onPreferencesUpdated(preferences);
        onClose();
      }
    } catch (error) {
      Alert.alert(t.error || 'Error', t.errorSaving || 'No se pudieron guardar las preferencias');
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
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.dietaryPreferences || 'Preferencias Dietéticas'}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Tipo de Dieta */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.dietType || 'Tipo de Dieta'}</Text>
            <View style={styles.optionsGrid}>
              {dietOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.dietOption,
                    preferences?.diet === option.value && styles.dietOptionSelected,
                  ]}
                  onPress={() => updatePreference('diet', option.value)}
                >
                  {option.icon && (
                    <Ionicons
                      name={option.icon}
                      size={24}
                      color="#6B21A8"
                    />
                  )}
                  <Text
                    style={[
                      styles.dietOptionText,
                      preferences?.diet === option.value && styles.dietOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
                  placeholder="Ej: 500"
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

          <View style={styles.bottomPadding} />
        </ScrollView>

        {/* Save Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.saveButtonText}>{t.savePreferences || 'Guardar Preferencias'}</Text>
          </TouchableOpacity>
        </View>
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
