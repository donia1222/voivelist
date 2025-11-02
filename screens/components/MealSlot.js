import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MealSlot = ({ mealType, meal, onPress, onRemove, onGenerateWithAI, isGenerating, translations }) => {
  const getMealIcon = (type) => {
    const icons = {
      breakfast: 'sunny',
      lunch: 'restaurant',
      dinner: 'moon',
    };
    return icons[type] || 'fast-food';
  };

  const getMealEmoji = (type) => {
    const emojis = {
      breakfast: '🌅',
      lunch: '🍽️',
      dinner: '🌙',
    };
    return emojis[type] || '🍴';
  };

  const getMealColors = (type) => {
    const colors = {
      breakfast: {
        bg: '#ffffff',
        border: '#6B7280',
        icon: '#6B7280',
        badge: '#F3F4F6',
      },
      lunch: {
        bg: '#ffffff',
        border: '#6B7280',
        icon: '#6B7280',
        badge: '#F3F4F6',
      },
      dinner: {
        bg: '#ffffff',
        border: '#6B7280',
        icon: '#6B7280',
        badge: '#F3F4F6',
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
        {/* Badge con emoji */}
        <View style={[styles.iconBadge, { backgroundColor: colors.badge }]}>
          <Text style={styles.emojiText}>{getMealEmoji(mealType)}</Text>
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
      {/* Badge con emoji */}
      <View style={[styles.iconBadge, { backgroundColor: colors.badge }]}>
        <Text style={styles.emojiText}>{getMealEmoji(mealType)}</Text>
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
    borderRadius: 16,
    marginVertical: 6,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emojiText: {
    fontSize: 24,
  },
  mealInfo: {
    flex: 1,
    marginLeft: 14,
  },
  mealLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
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
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
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
    color: '#999',
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
    borderRadius: 12,
    borderWidth: 2,
  },
  addAIButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 2,
  },
});

export default MealSlot;
