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
        bg: 'rgba(255, 255, 255, 0.5)',
        border: 'rgba(0, 0, 0, 0.1)',
        icon: '#374151',
        badge: 'rgba(255, 255, 255, 0.6)',
      },
      lunch: {
        bg: 'rgba(255, 255, 255, 0.5)',
        border: 'rgba(0, 0, 0, 0.1)',
        icon: '#374151',
        badge: 'rgba(255, 255, 255, 0.6)',
      },
      dinner: {
        bg: 'rgba(255, 255, 255, 0.5)',
        border: 'rgba(0, 0, 0, 0.1)',
        icon: '#374151',
        badge: 'rgba(255, 255, 255, 0.6)',
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
        {/* Badge con icono */}
        <View style={[styles.iconBadge, { backgroundColor: colors.badge }]}>
          <Ionicons name={getMealIcon(mealType)} size={24} color={colors.icon} />
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
            style={[styles.addManualButton, { backgroundColor: colors.bg, borderColor: colors.border }]}
          >
            <Ionicons name="create-outline" size={20} color={colors.icon} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onGenerateWithAI}
            style={[styles.addAIButton, { backgroundColor: colors.badge + '30', borderColor: colors.badge }]}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator size="small" color={colors.icon} />
            ) : (
              <Ionicons name="sparkles" size={18} color={colors.icon} />
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
      {/* Badge con icono */}
      <View style={[styles.iconBadge, { backgroundColor: colors.badge }]}>
        <Ionicons name={getMealIcon(mealType)} size={24} color={colors.icon} />
      </View>

      <View style={styles.mealInfo}>
        <Text style={styles.mealLabel}>{getMealLabel(mealType)}</Text>
        <Text style={styles.mealName}>{meal.name}</Text>
        <View style={styles.mealDetails}>
          {meal.servings && (
            <View style={styles.detailBadge}>
              <Ionicons name="people-outline" size={12} color={colors.icon} />
              <Text style={[styles.detailText, { color: colors.icon }]}>
                {meal.servings}
              </Text>
            </View>
          )}
          {meal.time && (
            <View style={styles.detailBadge}>
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
        <Ionicons name="close-circle" size={24} color="#ff3b30" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    marginVertical: 6,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyContainer: {
    borderStyle: 'dashed',
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  mealInfo: {
    flex: 1,
    marginLeft: 14,
  },
  mealLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
    lineHeight: 20,
  },
  mealDetails: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  detailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
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
    color: '#6B7280',
    fontStyle: 'italic',
  },
  removeButton: {
    padding: 4,
    marginLeft: 8,
  },
  emptyActions: {
    flexDirection: 'row',
    gap: 8,
  },
  addManualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  addAIButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
});

export default MealSlot;
