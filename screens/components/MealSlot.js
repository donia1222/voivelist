import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MealSlot = ({ mealType, meal, onPress, onRemove, onGenerateWithAI, isGenerating, translations }) => {
  const getMealIcon = (type) => {
    const icons = {
      breakfast: 'cafe-outline',
      lunch: 'restaurant-outline',
      dinner: 'moon-outline',
    };
    return icons[type] || 'fast-food-outline';
  };

  const getMealColors = (type) => {
    const colors = {
      breakfast: {
        bg: 'rgba(255, 255, 255, 0.45)',
        border: 'rgba(255, 255, 255, 0.6)',
        icon: '#EA580C',
        iconBg: 'rgba(251, 146, 60, 0.15)',
        badge: 'rgba(251, 146, 60, 0.1)',
        accent: '#F97316',
      },
      lunch: {
        bg: 'rgba(255, 255, 255, 0.45)',
        border: 'rgba(255, 255, 255, 0.6)',
        icon: '#16A34A',
        iconBg: 'rgba(34, 197, 94, 0.15)',
        badge: 'rgba(34, 197, 94, 0.1)',
        accent: '#22C55E',
      },
      dinner: {
        bg: 'rgba(255, 255, 255, 0.45)',
        border: 'rgba(255, 255, 255, 0.6)',
        icon: '#4F46E5',
        iconBg: 'rgba(99, 102, 241, 0.15)',
        badge: 'rgba(99, 102, 241, 0.1)',
        accent: '#6366F1',
      },
    };
    return colors[type] || colors.breakfast;
  };

  const getMealLabel = (type) => {
    if (!translations) {
      const labels = {
        breakfast: 'Desayuno',
        lunch: 'Almuerzo',
        dinner: 'Cena',
      };
      return labels[type] || type;
    }

    const labels = {
      breakfast: translations.breakfast,
      lunch: translations.lunch,
      dinner: translations.dinner,
    };
    return labels[type] || type;
  };

  const colors = getMealColors(mealType);

  if (!meal) {
    // Slot vacío con botones
    return (
      <View style={[styles.container, styles.emptyContainer, { backgroundColor: colors.bg, borderColor: colors.border }]}>
        {/* Badge con icono colorido */}
        <View style={[styles.iconBadge, { backgroundColor: colors.iconBg, borderColor: colors.border }]}>
          <Ionicons name={getMealIcon(mealType)} size={26} color={colors.icon} />
        </View>

        <View style={styles.mealInfo}>
          <Text style={[styles.emptyText, { color: colors.icon }]}>
            {getMealLabel(mealType)}
          </Text>
          <Text style={styles.emptySubtext}>{translations?.addMealText || 'Añade una comida'}</Text>
        </View>

        <View style={styles.emptyActions}>
          <TouchableOpacity
            onPress={onPress}
            style={[styles.addManualButton, { backgroundColor: colors.iconBg, borderColor: colors.border }]}
          >
            <Ionicons name="create-outline" size={20} color={colors.icon} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onGenerateWithAI}
            style={styles.addAIButton}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator size="small" color="#8B5CF6" />
            ) : (
              <Ionicons name="sparkles" size={18} color="#8B5CF6" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Slot con comida
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.bg, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Badge con icono colorido */}
      <View style={[styles.iconBadge, { backgroundColor: colors.iconBg, borderColor: colors.border }]}>
        <Ionicons name={getMealIcon(mealType)} size={26} color={colors.icon} />
      </View>

      <View style={styles.mealInfo}>
        <Text style={[styles.mealLabel, { color: colors.icon }]}>{getMealLabel(mealType)}</Text>
        <Text style={styles.mealName}>{meal.name}</Text>
        <View style={styles.mealDetails}>
          {meal.servings && (
            <View style={[styles.detailBadge, { backgroundColor: colors.badge, borderColor: colors.border }]}>
              <Ionicons name="people-outline" size={12} color={colors.icon} />
              <Text style={[styles.detailText, { color: colors.icon }]}>
                {meal.servings}
              </Text>
            </View>
          )}
          {meal.time && (
            <View style={[styles.detailBadge, { backgroundColor: colors.badge, borderColor: colors.border }]}>
              <Ionicons name="time-outline" size={12} color={colors.icon} />
              <Text style={[styles.detailText, { color: colors.icon }]}>
                {meal.time}
              </Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        style={styles.removeButton}
      >
        <Ionicons name="close-circle" size={22} color="rgba(239, 68, 68, 0.8)" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    marginVertical: 5,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyContainer: {
    borderStyle: 'dashed',
    borderWidth: 1.5,
  },
  iconBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  mealInfo: {
    flex: 1,
    marginLeft: 14,
  },
  mealLabel: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  mealName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
    lineHeight: 20,
  },
  mealDetails: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  detailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  detailText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  removeButton: {
    padding: 6,
    marginLeft: 4,
  },
  emptyActions: {
    flexDirection: 'row',
    gap: 8,
  },
  addManualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  addAIButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
});

export default MealSlot;
