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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as RNLocalize from 'react-native-localize';
import MealPlanService from '../../services/MealPlanService';
import mealPlannerTranslations from '../translations/mealPlannerTranslations';

const CalendarSelectorModal = ({ visible, onClose, currentWeekStart, onWeekSelected, onGenerateShoppingList }) => {
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
  const t = mealPlannerTranslations[deviceLanguage] || mealPlannerTranslations['en'];

  const [selectedWeekStart, setSelectedWeekStart] = useState(currentWeekStart);
  const [weekPlan, setWeekPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  useEffect(() => {
    if (visible) {
      setSelectedWeekStart(currentWeekStart);
      loadWeekPlan(currentWeekStart);
    }
  }, [visible, currentWeekStart]);

  const loadWeekPlan = async (weekStart) => {
    try {
      setLoading(true);
      const plan = await MealPlanService.getWeeklyPlan(weekStart);
      setWeekPlan(plan);
    } catch (error) {
      console.error('Error al cargar plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeWeek = (direction) => {
    const newWeekStart = new Date(selectedWeekStart);
    newWeekStart.setDate(newWeekStart.getDate() + direction * 7);
    setSelectedWeekStart(newWeekStart);
    loadWeekPlan(newWeekStart);
  };

  const isCurrentWeek = () => {
    const today = MealPlanService.getWeekStart(new Date());
    return MealPlanService.formatDateKey(selectedWeekStart) === MealPlanService.formatDateKey(today);
  };

  const handleSelectWeek = () => {
    onWeekSelected(selectedWeekStart);
    onClose();
  };

  const getMealIcon = (type) => {
    const icons = {
      breakfast: 'sunny-outline',
      lunch: 'restaurant-outline',
      dinner: 'moon-outline',
    };
    return icons[type] || 'fast-food-outline';
  };

  const getMealLabel = (type) => {
    const labels = {
      breakfast: t.breakfast || 'Desayuno',
      lunch: t.lunch || 'Almuerzo',
      dinner: t.dinner || 'Cena',
    };
    return labels[type] || type;
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

  const hasMeals = () => {
    if (!weekPlan?.plan) return false;

    return days.some(day => {
      const dayPlan = weekPlan.plan[day];
      return dayPlan?.breakfast || dayPlan?.lunch || dayPlan?.dinner;
    });
  };

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
          <Text style={styles.headerTitle}>{t.selectWeek || 'Seleccionar Semana'}</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Week Navigator */}
        <View style={styles.weekNavigator}>
          <TouchableOpacity onPress={() => changeWeek(-1)} style={styles.arrowButton}>
            <Ionicons name="chevron-back" size={28} color="#8B5CF6" />
          </TouchableOpacity>

          <View style={styles.weekInfo}>
            <Text style={styles.weekText}>{weekPlan?.weekRange || ''}</Text>
            {isCurrentWeek() && (
              <Text style={styles.currentWeekBadge}>{t.currentWeekBadge || 'Semana actual'}</Text>
            )}
          </View>

          <TouchableOpacity onPress={() => changeWeek(1)} style={styles.arrowButton}>
            <Ionicons name="chevron-forward" size={28} color="#8B5CF6" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>{t.loading || 'Cargando...'}</Text>
            </View>
          ) : !hasMeals() ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>{t.noMenusThisWeek || 'No hay menús para esta semana'}</Text>
              <Text style={styles.emptySubtext}>
                {isCurrentWeek()
                  ? (t.startPlanning || 'Comienza a planificar tus comidas')
                  : (t.selectToStart || 'Selecciona esta semana para empezar a planificar')}
              </Text>
            </View>
          ) : (
            <View style={styles.weekPreview}>
              {days.map((day) => {
                const dayDate = MealPlanService.getDateForDay(day, selectedWeekStart);
                const dayName = getDayName(day);
                const formattedDate = `${dayDate.getDate()}/${dayDate.getMonth() + 1}`;
                const dayPlan = weekPlan?.plan?.[day];

                const hasMealsThisDay = dayPlan?.breakfast || dayPlan?.lunch || dayPlan?.dinner;

                if (!hasMealsThisDay) return null;

                return (
                  <View key={day} style={styles.dayCard}>
                    <View style={styles.dayHeader}>
                      <Text style={styles.dayName}>{dayName}</Text>
                      <Text style={styles.dayDate}>{formattedDate}</Text>
                    </View>

                    {['breakfast', 'lunch', 'dinner'].map((mealType) => {
                      const meal = dayPlan?.[mealType];
                      if (!meal) return null;

                      return (
                        <View key={mealType} style={styles.mealRow}>
                          <Ionicons
                            name={getMealIcon(mealType)}
                            size={18}
                            color="#8B5CF6"
                          />
                          <View style={styles.mealInfo}>
                            <Text style={styles.mealLabel}>{getMealLabel(mealType)}</Text>
                            <Text style={styles.mealName}>{meal.name}</Text>
                            {meal.servings && (
                              <Text style={styles.mealServings}>
                                {meal.servings} {meal.servings === 1 ? (t.person || 'persona') : (t.persons || 'personas')}
                              </Text>
                            )}
                          </View>
                        </View>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.footer}>
          {hasMeals() && onGenerateShoppingList && (
            <TouchableOpacity
              style={styles.shoppingListButton}
              onPress={() => {
                onGenerateShoppingList(selectedWeekStart);
                onClose();
              }}
            >
              <Ionicons name="cart-outline" size={20} color="#10B981" />
              <Text style={styles.shoppingListButtonText}>{t.shoppingList}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.selectButton,
              hasMeals() && onGenerateShoppingList ? { flex: 1 } : { width: '100%' }
            ]}
            onPress={handleSelectWeek}
          >
            <Ionicons name="checkmark-circle" size={20} color="#8B5CF6" />
            <Text style={styles.selectButtonText}>
              {isCurrentWeek() ? (t.cancel || 'Cancelar') : (t.viewThisWeek || 'Ver Esta Semana')}
            </Text>
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
  weekNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  arrowButton: {
    padding: 8,
  },
  weekInfo: {
    alignItems: 'center',
  },
  weekText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  currentWeekBadge: {
    fontSize: 12,
    color: '#8B5CF6',
    marginTop: 4,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 8,
    textAlign: 'center',
  },
  weekPreview: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  dayCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dayName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  dayDate: {
    fontSize: 13,
    color: '#999',
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    gap: 10,
  },
  mealInfo: {
    flex: 1,
  },
  mealLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  mealName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  mealServings: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexDirection: 'row',
    gap: 12,
  },
  shoppingListButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  shoppingListButtonText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '700',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#8B5CF6',
    gap: 8,
  },
  selectButtonText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CalendarSelectorModal;
