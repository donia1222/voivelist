import AsyncStorage from '@react-native-async-storage/async-storage';

export const ShoppingListConsolidator = {
  /**
   * Consolidar ingredientes de todo el plan semanal
   */
  consolidateIngredients(weeklyPlan) {
    const ingredientsMap = {};

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const mealTypes = ['breakfast', 'lunch', 'dinner'];

    days.forEach(day => {
      mealTypes.forEach(mealType => {
        const meal = weeklyPlan.plan?.[day]?.[mealType];

        if (meal && meal.ingredients && Array.isArray(meal.ingredients)) {
          meal.ingredients.forEach(ingredient => {
            const key = this.normalizeIngredientName(ingredient.item);

            if (ingredientsMap[key]) {
              // Sumar cantidades si es el mismo ingrediente
              const normalizedUnit = this.normalizeUnit(ingredient.unit);
              const existingUnit = this.normalizeUnit(ingredientsMap[key].unit);

              if (normalizedUnit === existingUnit) {
                ingredientsMap[key].quantity = (
                  parseFloat(ingredientsMap[key].quantity || 0) +
                  parseFloat(ingredient.quantity || 0)
                ).toString();
              } else {
                // Unidades diferentes, agregar como item separado
                const altKey = `${key}_${normalizedUnit}`;
                if (ingredientsMap[altKey]) {
                  ingredientsMap[altKey].quantity = (
                    parseFloat(ingredientsMap[altKey].quantity || 0) +
                    parseFloat(ingredient.quantity || 0)
                  ).toString();
                } else {
                  ingredientsMap[altKey] = {
                    item: ingredient.item,
                    quantity: ingredient.quantity || '0',
                    unit: ingredient.unit || '',
                    category: this.categorizeIngredient(ingredient.item),
                    checked: false
                  };
                }
              }
            } else {
              ingredientsMap[key] = {
                item: ingredient.item,
                quantity: ingredient.quantity || '0',
                unit: ingredient.unit || '',
                category: this.categorizeIngredient(ingredient.item),
                checked: false
              };
            }
          });
        }
      });
    });

    // Convertir a array y ordenar por categoría
    const shoppingList = Object.values(ingredientsMap).sort((a, b) => {
      const categoryOrder = this.getCategoryOrder();
      const orderA = categoryOrder[a.category] || 999;
      const orderB = categoryOrder[b.category] || 999;
      return orderA - orderB;
    });

    return shoppingList;
  },

  /**
   * Normalizar nombre de ingrediente (minúsculas, sin acentos, singular)
   */
  normalizeIngredientName(name) {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/s$/, '') // Intentar singularizar
      .trim();
  },

  /**
   * Normalizar unidades de medida
   */
  normalizeUnit(unit) {
    if (!unit) return '';

    const unitMap = {
      'kg': 'kg',
      'kilogramo': 'kg',
      'kilogramos': 'kg',
      'kilo': 'kg',
      'kilos': 'kg',
      'g': 'g',
      'gramo': 'g',
      'gramos': 'g',
      'gr': 'g',
      'l': 'l',
      'litro': 'l',
      'litros': 'l',
      'ml': 'ml',
      'mililitro': 'ml',
      'mililitros': 'ml',
      'taza': 'taza',
      'tazas': 'taza',
      'cucharada': 'cdta',
      'cucharadas': 'cdta',
      'cdta': 'cdta',
      'cucharadita': 'cdtita',
      'cucharaditas': 'cdtita',
      'cdtita': 'cdtita',
      'unidad': 'unidad',
      'unidades': 'unidad',
      'u': 'unidad',
      'pieza': 'unidad',
      'piezas': 'unidad'
    };

    const normalized = unit.toLowerCase().trim();
    return unitMap[normalized] || normalized;
  },

  /**
   * Categorizar ingrediente automáticamente
   */
  categorizeIngredient(item) {
    const itemLower = item.toLowerCase();

    const categories = {
      'Frutas y Verduras': [
        'tomate', 'lechuga', 'manzana', 'banana', 'zanahoria', 'cebolla', 'ajo',
        'papa', 'patata', 'pepino', 'pimiento', 'aguacate', 'limón', 'naranja',
        'fresa', 'uva', 'melón', 'sandía', 'brócoli', 'espinaca', 'col',
        'calabacín', 'berenjena', 'champiñón', 'seta', 'perejil', 'cilantro'
      ],
      'Carnes y Pescados': [
        'pollo', 'carne', 'res', 'cerdo', 'pescado', 'salmón', 'atún',
        'pavo', 'ternera', 'cordero', 'bacon', 'jamón', 'salchicha',
        'merluza', 'bacalao', 'camarón', 'gamba', 'marisco'
      ],
      'Lácteos y Huevos': [
        'leche', 'queso', 'yogur', 'yogurt', 'mantequilla', 'nata', 'crema',
        'huevo', 'mozzarella', 'parmesano', 'ricotta', 'feta'
      ],
      'Panadería': [
        'pan', 'harina', 'levadura', 'masa', 'baguette', 'tortilla',
        'tostada', 'croissant', 'galleta'
      ],
      'Despensa': [
        'arroz', 'pasta', 'fideos', 'aceite', 'sal', 'azúcar', 'vinagre',
        'salsa', 'tomate frito', 'legumbre', 'lenteja', 'garbanzo', 'alubia',
        'café', 'té', 'caldo', 'conserva', 'atún en lata'
      ],
      'Especias y Condimentos': [
        'pimienta', 'orégano', 'ají', 'curry', 'comino', 'pimentón',
        'canela', 'vainilla', 'mostaza', 'mayonesa', 'ketchup', 'soja',
        'albahaca', 'tomillo', 'romero', 'laurel'
      ]
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => itemLower.includes(keyword))) {
        return category;
      }
    }

    return 'Otros';
  },

  /**
   * Orden de categorías para mostrar en la lista
   */
  getCategoryOrder() {
    return {
      'Frutas y Verduras': 1,
      'Carnes y Pescados': 2,
      'Lácteos y Huevos': 3,
      'Panadería': 4,
      'Despensa': 5,
      'Especias y Condimentos': 6,
      'Otros': 7
    };
  },

  /**
   * Guardar lista de compra en el historial
   */
  async saveShoppingListToHistory(shoppingList, weekRange) {
    try {
      const newList = {
        id: `meal_plan_${Date.now()}`,
        name: `Lista Semanal ${weekRange}`,
        items: shoppingList,
        date: new Date().toISOString(),
        category: 'meal_plan',
        fromMealPlanner: true
      };

      const existingListsJson = await AsyncStorage.getItem('@saved_lists');
      const lists = existingListsJson ? JSON.parse(existingListsJson) : [];
      lists.unshift(newList);

      await AsyncStorage.setItem('@saved_lists', JSON.stringify(lists));
      return newList;
    } catch (error) {
      console.error('Error al guardar lista en historial:', error);
      throw error;
    }
  },

  /**
   * Exportar lista a texto plano
   */
  exportToText(shoppingList) {
    let text = 'LISTA DE COMPRA SEMANAL\n';
    text += '========================\n\n';

    const groupedByCategory = {};

    shoppingList.forEach(item => {
      if (!groupedByCategory[item.category]) {
        groupedByCategory[item.category] = [];
      }
      groupedByCategory[item.category].push(item);
    });

    Object.entries(groupedByCategory).forEach(([category, items]) => {
      text += `${category.toUpperCase()}\n`;
      text += '-'.repeat(category.length) + '\n';

      items.forEach(item => {
        const checkbox = item.checked ? '[✓]' : '[ ]';
        const quantity = item.quantity ? `${item.quantity}${item.unit} ` : '';
        text += `${checkbox} ${quantity}${item.item}\n`;
      });

      text += '\n';
    });

    return text;
  },

  /**
   * Detectar si dos ingredientes son similares
   */
  areSameIngredient(item1, item2) {
    const normalized1 = this.normalizeIngredientName(item1);
    const normalized2 = this.normalizeIngredientName(item2);

    // Comparación exacta
    if (normalized1 === normalized2) return true;

    // Fuzzy match básico
    return this.fuzzyMatch(normalized1, normalized2);
  },

  /**
   * Match difuso entre strings
   */
  fuzzyMatch(str1, str2) {
    // Si uno está contenido en el otro
    if (str1.includes(str2) || str2.includes(str1)) return true;

    // Calcular similitud de Levenshtein (simplificado)
    const maxLength = Math.max(str1.length, str2.length);
    const distance = this.levenshteinDistance(str1, str2);
    const similarity = 1 - distance / maxLength;

    return similarity > 0.8; // 80% similar
  },

  /**
   * Distancia de Levenshtein
   */
  levenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitución
            matrix[i][j - 1] + 1,     // inserción
            matrix[i - 1][j] + 1      // eliminación
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }
};

export default ShoppingListConsolidator;
