import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MealSlot = ({ mealType, meal, onPress, onRemove, onGenerateWithAI, isGenerating, translations }) => {
  const getMealIcon = (type) => {
    const icons = {
      breakfast: 'sunny-outline',
      lunch: 'restaurant-outline',
      dinner: 'moon-outline',
    };
    return icons[type] || 'fast-food-outline';
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

  if (!meal) {
    // Slot vacío con botones
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Ionicons
          name={getMealIcon(mealType)}
          size={20}
          color="#ccc"
        />

        <View style={styles.mealInfo}>
          <Text style={styles.emptyText}>
            {getMealLabel(mealType)}
          </Text>
        </View>

        <View style={styles.emptyActions}>
          <TouchableOpacity
            onPress={onPress}
            style={styles.addManualButton}
          >
            <Ionicons name="create-outline" size={20} color="#8B5CF6" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onGenerateWithAI}
            style={styles.addAIButton}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator size="small" color="#7C3AED" />
            ) : (
              <Ionicons name="sparkles" size={18} color="#7C3AED" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Slot con comida
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={getMealIcon(mealType)}
        size={20}
        color="#8B5CF6"
      />

      <View style={styles.mealInfo}>
        <Text style={styles.mealName}>{meal.name}</Text>
        {meal.servings && (
          <Text style={styles.mealServings}>
            {meal.servings} {meal.servings === 1 ? (translations?.person || 'persona') : (translations?.persons || 'personas')}
          </Text>
        )}
        {meal.time && (
          <Text style={styles.mealTime}>{meal.time}</Text>
        )}
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
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#8B5CF6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyContainer: {
    borderStyle: 'dashed',
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  mealInfo: {
    flex: 1,
    marginLeft: 12,
  },
  mealName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  mealServings: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  mealTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  removeButton: {
    padding: 4,
  },
  emptyActions: {
    flexDirection: 'row',
    gap: 8,
  },
  addManualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  addAIButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  addAIButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7C3AED',
  },
});

export default MealSlot;
