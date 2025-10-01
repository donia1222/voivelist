# 🍽️ Análisis de Feature: MealPlannerScreen (Planificador de Menús)

## 📱 Resumen Ejecutivo

**MealPlannerScreen** es una nueva pantalla para VoiceList que permite a los usuarios planificar sus comidas semanales (desayuno, almuerzo, cena) y generar automáticamente una lista de compra consolidada con todos los ingredientes necesarios. La feature aprovecha tecnologías ya instaladas (OpenAI, AsyncStorage, react-native-calendar-events) sin requerir nuevas dependencias.

---

## 🎯 Objetivo de la Feature

### **Problema que Resuelve:**
- Los usuarios planifican comidas día a día sin visión semanal
- Compran ingredientes sin saber qué cocinarán
- Van al supermercado múltiples veces por semana
- Desperdician comida por falta de planificación

### **Solución Propuesta:**
Una pantalla que permita:
1. ✅ **Planificar menú semanal completo** (7 días × 3 comidas = 21 slots)
2. ✅ **Generar lista de compra consolidada** con todos los ingredientes
3. ✅ **Ajustar porciones y dietas** (vegetariana, keto, sin gluten, vegana, mediterránea)
4. ✅ **Usar IA para sugerencias** de menús balanceados
5. ✅ **Sincronizar con calendario nativo** (recordatorios de cocina)
6. ✅ **Reutilizar recetas guardadas** de RecipesScreen

---

## 🛠️ Tecnologías a Utilizar (YA INSTALADAS)

### ✅ **Sin Instalar Nada Nuevo:**

| Tecnología | Uso en MealPlannerScreen | Ya Usada En |
|-----------|-------------------------|-------------|
| **OpenAI GPT-4** | Generar menús semanales basados en preferencias | HomeScreen, ImageListScreen, RecommendationsScreen |
| **AsyncStorage** | Guardar planes semanales y preferencias dietéticas | Toda la app |
| **react-native-calendar-events** | Crear eventos "Hoy cocinar X receta" en calendario nativo | CalendarPlannerScreen |
| **react-native-push-notification** | Recordatorios diarios "Hoy toca cocinar Lasaña" | HomeScreen, HistoryScreen |
| **react-native-draggable-flatlist** | Reordenar comidas arrastrando (drag & drop) | HistoryScreen |
| **react-native-modalize** | Modal de detalle de comida + edición | Usado en varias pantallas |
| **Iconicons** | Iconos de comidas (🍳 desayuno, 🍽️ almuerzo, 🌙 cena) | Toda la app |
| **ThemeContext** | Modo oscuro/claro | Global |
| **Animated API** | Transiciones suaves al cambiar días | Pantallas animadas |

---

## 📐 Estructura de la Pantalla

```
┌─────────────────────────────────────────────────────┐
│  MealPlannerScreen                                  │
│  Header: "Planificador de Menús" 🍽️                │
│  ┌───────────────────────────────────────────────┐  │
│  │ [<] Semana del 1-7 Oct 2025 [>]              │  │
│  │ [🤖 Generar Menú con IA]  [⚙️ Preferencias]  │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌─── Lunes 1 Oct ────────────────────────────┐    │
│  │ 🍳 Desayuno: [Vacío - Toca para añadir]   │    │
│  │ 🍽️ Almuerzo: Ensalada César (4 personas)  │    │
│  │ 🌙 Cena: [Vacío]                           │    │
│  └────────────────────────────────────────────┘    │
│                                                     │
│  ┌─── Martes 2 Oct ───────────────────────────┐    │
│  │ 🍳 Desayuno: Avena con frutas              │    │
│  │ 🍽️ Almuerzo: [Vacío]                       │    │
│  │ 🌙 Cena: Pasta Carbonara (2 personas)      │    │
│  └────────────────────────────────────────────┘    │
│                                                     │
│  ... (resto de días)                                │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ [🛒 Generar Lista de Compra Semanal]       │   │
│  │ [📅 Sincronizar con Calendario]            │   │
│  │ [💾 Guardar Plan]  [📤 Compartir]          │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 🔧 Componentes y Funcionalidades Detalladas

### 1️⃣ **WeekNavigator** (Navegador de Semanas)
```javascript
// Cambiar entre semanas con flechas
<View style={styles.weekNavigator}>
  <TouchableOpacity onPress={() => changeWeek(-1)}>
    <Ionicons name="chevron-back" size={24} />
  </TouchableOpacity>

  <Text>Semana del {weekStart} - {weekEnd}</Text>

  <TouchableOpacity onPress={() => changeWeek(1)}>
    <Ionicons name="chevron-forward" size={24} />
  </TouchableOpacity>
</View>
```

**Funcionalidad:**
- Navegar semanas pasadas/futuras
- Mostrar rango de fechas actual
- Indicador de "Semana Actual"

---

### 2️⃣ **MealSlot** (Slot de Comida Individual)
```javascript
// Cada comida del día (desayuno, almuerzo, cena)
<TouchableOpacity
  style={styles.mealSlot}
  onPress={() => openMealModal(day, mealType)}
>
  <Ionicons name={getMealIcon(mealType)} size={20} />
  <View style={styles.mealInfo}>
    {meal ? (
      <>
        <Text style={styles.mealName}>{meal.name}</Text>
        <Text style={styles.mealServings}>{meal.servings} personas</Text>
      </>
    ) : (
      <Text style={styles.emptySlot}>Toca para añadir</Text>
    )}
  </View>
  {meal && (
    <TouchableOpacity onPress={() => removeMeal(day, mealType)}>
      <Ionicons name="close-circle" size={24} color="#ff3b30" />
    </TouchableOpacity>
  )}
</TouchableOpacity>
```

**Funcionalidad:**
- Mostrar comida asignada o estado vacío
- Botón para eliminar comida
- Icono según tipo de comida
- Mostrar número de porciones

---

### 3️⃣ **MealSelectorModal** (Modal de Selección de Comida)
```javascript
<Modalize ref={mealModalRef} snapPoint={600}>
  <View style={styles.modalContent}>
    <Text style={styles.modalTitle}>
      Añadir {mealType} - {selectedDay}
    </Text>

    {/* Tabs de opciones */}
    <View style={styles.tabs}>
      <TouchableOpacity onPress={() => setActiveTab('saved')}>
        <Text>Recetas Guardadas</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setActiveTab('search')}>
        <Text>Buscar Recetas</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setActiveTab('ai')}>
        <Text>Sugerencias IA</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setActiveTab('manual')}>
        <Text>Añadir Manual</Text>
      </TouchableOpacity>
    </View>

    {/* Contenido según tab activa */}
    {activeTab === 'saved' && <SavedRecipesList />}
    {activeTab === 'search' && <RecipeSearchInput />}
    {activeTab === 'ai' && <AISuggestionsView />}
    {activeTab === 'manual' && <ManualMealForm />}

    {/* Ajuste de porciones */}
    <View style={styles.servingsControl}>
      <Text>Porciones:</Text>
      <Button onPress={() => setServings(servings - 1)}>-</Button>
      <Text>{servings}</Text>
      <Button onPress={() => setServings(servings + 1)}>+</Button>
    </View>

    <Button title="Añadir Comida" onPress={addMealToPlan} />
  </View>
</Modalize>
```

**Funcionalidad:**
- **Recetas Guardadas:** Lista de recetas de RecipesScreen
- **Buscar Recetas:** Input de búsqueda + resultados
- **Sugerencias IA:** Basadas en historial y preferencias
- **Manual:** Formulario simple (nombre, ingredientes, porciones)
- **Ajuste de porciones:** Aumentar/disminuir dinámicamente

---

### 4️⃣ **AI Menu Generator** (Generador de Menús con IA)
```javascript
const generateWeeklyMenuWithAI = async (preferences) => {
  const prompt = `
    Eres un nutricionista experto. Genera un menú semanal balanceado con:

    Preferencias del usuario:
    - Dieta: ${preferences.diet} (vegetariana, keto, sin gluten, vegana, mediterránea)
    - Personas: ${preferences.servings}
    - Restricciones: ${preferences.restrictions.join(', ')} (alergias, intolerancias)
    - Presupuesto: ${preferences.budget} (bajo, medio, alto)
    - Nivel cocina: ${preferences.cookingLevel} (principiante, intermedio, avanzado)

    Genera 7 días con desayuno, almuerzo y cena.

    Formato JSON:
    {
      "monday": {
        "breakfast": { "name": "...", "servings": 2, "ingredients": [...], "time": "15 min" },
        "lunch": { "name": "...", "servings": 2, "ingredients": [...], "time": "30 min" },
        "dinner": { "name": "...", "servings": 2, "ingredients": [...], "time": "45 min" }
      },
      "tuesday": { ... },
      ...
    }

    IMPORTANTE:
    - Variedad de ingredientes (no repetir platos)
    - Balance nutricional
    - Ingredientes de temporada
    - Recetas prácticas y realistas
  `

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: 'Genera el menú semanal ahora.' }
      ],
      max_tokens: 3000,
      temperature: 0.8
    },
    {
      headers: {
        'Authorization': `Bearer ${API_KEY_CHAT}`,
        'Content-Type': 'application/json'
      }
    }
  )

  return JSON.parse(response.data.choices[0].message.content)
}
```

**Funcionalidad:**
- Generar menú completo en 1 clic
- Respetar preferencias dietéticas
- Balance nutricional automático
- Ingredientes de temporada
- Guardar como plan activo

---

### 5️⃣ **PreferencesModal** (Modal de Preferencias Dietéticas)
```javascript
<Modalize ref={preferencesModalRef} snapPoint={500}>
  <View style={styles.preferencesContent}>
    <Text style={styles.sectionTitle}>Preferencias Dietéticas</Text>

    {/* Tipo de dieta */}
    <View style={styles.preferenceSection}>
      <Text>Tipo de Dieta:</Text>
      <Picker
        selectedValue={preferences.diet}
        onValueChange={(value) => updatePreference('diet', value)}
      >
        <Picker.Item label="Sin restricciones" value="normal" />
        <Picker.Item label="Vegetariana" value="vegetarian" />
        <Picker.Item label="Vegana" value="vegan" />
        <Picker.Item label="Keto" value="keto" />
        <Picker.Item label="Sin gluten" value="gluten-free" />
        <Picker.Item label="Mediterránea" value="mediterranean" />
        <Picker.Item label="Paleo" value="paleo" />
      </Picker>
    </View>

    {/* Número de personas */}
    <View style={styles.preferenceSection}>
      <Text>Porciones por defecto:</Text>
      <Stepper value={preferences.servings} onChange={(v) => updatePreference('servings', v)} />
    </View>

    {/* Restricciones adicionales */}
    <View style={styles.preferenceSection}>
      <Text>Restricciones/Alergias:</Text>
      <CheckBox label="Lácteos" value={hasRestriction('dairy')} onChange={toggleRestriction} />
      <CheckBox label="Frutos secos" value={hasRestriction('nuts')} onChange={toggleRestriction} />
      <CheckBox label="Mariscos" value={hasRestriction('seafood')} onChange={toggleRestriction} />
      <CheckBox label="Huevos" value={hasRestriction('eggs')} onChange={toggleRestriction} />
    </View>

    {/* Presupuesto */}
    <View style={styles.preferenceSection}>
      <Text>Presupuesto:</Text>
      <SegmentedControl
        values={['Bajo', 'Medio', 'Alto']}
        selectedIndex={preferences.budgetIndex}
        onChange={(index) => updatePreference('budgetIndex', index)}
      />
    </View>

    {/* Nivel de cocina */}
    <View style={styles.preferenceSection}>
      <Text>Nivel de cocina:</Text>
      <SegmentedControl
        values={['Principiante', 'Intermedio', 'Avanzado']}
        selectedIndex={preferences.cookingLevelIndex}
        onChange={(index) => updatePreference('cookingLevelIndex', index)}
      />
    </View>

    <Button title="Guardar Preferencias" onPress={savePreferences} />
  </View>
</Modalize>
```

**Funcionalidad:**
- Guardar preferencias en AsyncStorage
- Usar preferencias en generación IA
- Filtrar recetas por restricciones
- Ajustar porciones por defecto

---

### 6️⃣ **ShoppingListGenerator** (Generador de Lista de Compra)
```javascript
const generateConsolidatedShoppingList = (weeklyPlan) => {
  // Consolidar ingredientes de todas las comidas de la semana
  const ingredientsMap = {}

  Object.keys(weeklyPlan).forEach(day => {
    ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
      const meal = weeklyPlan[day][mealType]

      if (meal && meal.ingredients) {
        meal.ingredients.forEach(ingredient => {
          const key = ingredient.item.toLowerCase()

          if (ingredientsMap[key]) {
            // Sumar cantidades si mismo ingrediente
            ingredientsMap[key].quantity += parseFloat(ingredient.quantity) || 0
          } else {
            ingredientsMap[key] = {
              item: ingredient.item,
              quantity: parseFloat(ingredient.quantity) || 0,
              unit: ingredient.unit,
              category: categorizeIngredient(ingredient.item),
              checked: false
            }
          }
        })
      }
    })
  })

  // Convertir a array y ordenar por categoría
  const shoppingList = Object.values(ingredientsMap).sort(
    (a, b) => a.category.localeCompare(b.category)
  )

  return shoppingList
}

const categorizeIngredient = (item) => {
  // Categorización automática por palabras clave
  const categories = {
    'Frutas y Verduras': ['tomate', 'lechuga', 'manzana', 'banana', 'zanahoria'],
    'Carnes': ['pollo', 'carne', 'pescado', 'cerdo'],
    'Lácteos': ['leche', 'queso', 'yogur', 'mantequilla'],
    'Panadería': ['pan', 'harina', 'levadura'],
    'Despensa': ['arroz', 'pasta', 'aceite', 'sal'],
    'Especias': ['pimienta', 'orégano', 'ají']
  }

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => item.toLowerCase().includes(keyword))) {
      return category
    }
  }

  return 'Otros'
}

const saveShoppingListToHistory = async (shoppingList, weekRange) => {
  // Guardar en HistoryScreen como lista normal
  const newList = {
    id: `meal_plan_${Date.now()}`,
    name: `Lista Semanal ${weekRange}`,
    items: shoppingList,
    date: new Date().toISOString(),
    category: 'meal_plan',
    fromMealPlanner: true
  }

  const existingLists = await AsyncStorage.getItem('@saved_lists')
  const lists = existingLists ? JSON.parse(existingLists) : []
  lists.unshift(newList)

  await AsyncStorage.setItem('@saved_lists', JSON.stringify(lists))

  // Navegar a HistoryScreen
  navigation.navigate('History')
}
```

**Funcionalidad:**
- **Consolidación inteligente:** Sumar cantidades del mismo ingrediente
- **Categorización automática:** Agrupar por sección del supermercado
- **Integración con HistoryScreen:** Guardar como lista normal
- **Detección de duplicados:** Evitar "3 tomates + 2 tomates" → "5 tomates"

---

### 7️⃣ **Calendar Sync** (Sincronización con Calendario Nativo)
```javascript
import RNCalendarEvents from 'react-native-calendar-events'

const syncWeeklyPlanToCalendar = async (weeklyPlan) => {
  // Solicitar permisos (ya implementado en CalendarPlannerScreen)
  const permission = await RNCalendarEvents.requestPermissions()

  if (permission !== 'authorized') {
    Alert.alert('Permiso denegado', 'Necesitamos acceso al calendario')
    return
  }

  const events = []

  Object.keys(weeklyPlan).forEach(day => {
    const date = getDateForDay(day) // Convertir "monday" → "2025-10-01"

    ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
      const meal = weeklyPlan[day][mealType]

      if (meal) {
        const startTime = getMealTime(mealType, date)
        // breakfast: 08:00, lunch: 13:00, dinner: 19:00

        events.push({
          title: `🍽️ Cocinar: ${meal.name}`,
          startDate: startTime.toISOString(),
          endDate: new Date(startTime.getTime() + meal.time * 60000).toISOString(),
          location: 'Casa',
          notes: `Ingredientes:\n${meal.ingredients.map(i => `- ${i.quantity}${i.unit} ${i.item}`).join('\n')}`,
          alarms: [{
            date: -30 // Recordatorio 30 min antes
          }]
        })
      }
    })
  })

  // Crear eventos en calendario
  for (const event of events) {
    await RNCalendarEvents.saveEvent(event.title, event)
  }

  Alert.alert('✅ Sincronizado', `${events.length} comidas añadidas al calendario`)
}
```

**Funcionalidad:**
- Crear evento por cada comida del plan
- Recordatorios 30 min antes de cocinar
- Ingredientes en notas del evento
- Tiempo estimado de cocina

---

### 8️⃣ **Drag & Drop Reordering** (Reordenar Comidas)
```javascript
import DraggableFlatList from 'react-native-draggable-flatlist'

const DayMealsList = ({ day, meals, onReorder }) => {
  const mealTypes = ['breakfast', 'lunch', 'dinner']

  return (
    <DraggableFlatList
      data={mealTypes}
      onDragEnd={({ data }) => onReorder(day, data)}
      keyExtractor={(item) => item}
      renderItem={({ item, drag, isActive }) => (
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          style={[styles.mealSlot, isActive && styles.dragging]}
        >
          <MealSlotContent mealType={item} meal={meals[item]} />
        </TouchableOpacity>
      )}
    />
  )
}
```

**Funcionalidad:**
- Reordenar comidas dentro de un día
- Mover comidas entre días (drag entre listas)
- Feedback visual al arrastrar

---

### 9️⃣ **Notifications** (Notificaciones Diarias)
```javascript
import PushNotification from 'react-native-push-notification'

const scheduleDailyCookingReminders = (weeklyPlan) => {
  Object.keys(weeklyPlan).forEach(day => {
    const date = getDateForDay(day)

    ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
      const meal = weeklyPlan[day][mealType]

      if (meal) {
        const notificationTime = getMealReminderTime(mealType, date)
        // breakfast: 07:30, lunch: 12:00, dinner: 18:00

        PushNotification.localNotificationSchedule({
          channelId: 'meal-planner',
          title: `🍳 Hoy cocinas: ${meal.name}`,
          message: `${meal.servings} personas · ${meal.time} de preparación`,
          date: notificationTime,
          allowWhileIdle: true,
          userInfo: {
            screen: 'MealPlanner',
            day: day,
            mealType: mealType
          }
        })
      }
    })
  })

  Alert.alert('🔔 Recordatorios activados', 'Recibirás notificaciones diarias')
}
```

**Funcionalidad:**
- Notificación diaria por cada comida
- Horarios configurables
- Deep link a MealPlannerScreen al tocar

---

## 💾 Estructura de Datos en AsyncStorage

### **Clave:** `@meal_plans`
```json
{
  "weekOf_2025-10-01": {
    "weekRange": "1-7 Oct 2025",
    "preferences": {
      "diet": "vegetarian",
      "servings": 2,
      "restrictions": ["dairy", "nuts"],
      "budget": "medium",
      "cookingLevel": "intermediate"
    },
    "plan": {
      "monday": {
        "breakfast": {
          "id": "recipe_123",
          "name": "Avena con frutas",
          "servings": 2,
          "time": "15 min",
          "ingredients": [
            { "item": "Avena", "quantity": "100", "unit": "g" },
            { "item": "Banana", "quantity": "2", "unit": "unidades" },
            { "item": "Miel", "quantity": "2", "unit": "cucharadas" }
          ],
          "steps": ["Paso 1...", "Paso 2..."],
          "source": "ai_generated" // o "saved_recipe" o "manual"
        },
        "lunch": {
          "id": "recipe_456",
          "name": "Ensalada César Vegetariana",
          "servings": 2,
          "time": "20 min",
          "ingredients": [...]
        },
        "dinner": null
      },
      "tuesday": { ... },
      "wednesday": { ... },
      "thursday": { ... },
      "friday": { ... },
      "saturday": { ... },
      "sunday": { ... }
    },
    "shoppingList": [
      { "item": "Avena", "quantity": "700", "unit": "g", "category": "Despensa", "checked": false },
      { "item": "Banana", "quantity": "14", "unit": "unidades", "category": "Frutas y Verduras", "checked": false }
    ],
    "createdAt": "2025-10-01T10:00:00.000Z",
    "lastModified": "2025-10-01T15:30:00.000Z",
    "calendarSynced": true,
    "notificationsEnabled": true
  },
  "weekOf_2025-10-08": { ... }
}
```

### **Clave:** `@meal_preferences` (Preferencias globales)
```json
{
  "diet": "vegetarian",
  "servings": 2,
  "restrictions": ["dairy", "nuts"],
  "budget": "medium",
  "cookingLevel": "intermediate",
  "defaultBreakfastTime": "08:00",
  "defaultLunchTime": "13:00",
  "defaultDinnerTime": "19:00",
  "notificationOffsets": {
    "breakfast": -30,
    "lunch": -60,
    "dinner": -90
  }
}
```

---

## 🎨 Diseño UI/UX

### **Paleta de Colores:**
- **Color Primario:** `#8B5CF6` (Púrpura - planificación)
- **Color Secundario:** `#10B981` (Verde - nutrición)
- **Gradiente:** `['#8B5CF6', '#10B981']`
- **Iconos:** `calendar-outline`, `restaurant`, `nutrition`

### **Iconos por Tipo de Comida:**
```javascript
const mealIcons = {
  breakfast: 'sunny-outline',      // ☀️ Desayuno
  lunch: 'restaurant-outline',     // 🍽️ Almuerzo
  dinner: 'moon-outline'           // 🌙 Cena
}
```

### **Estados Visuales:**
- **Slot vacío:** Borde punteado + texto gris "Toca para añadir"
- **Slot lleno:** Card con sombra + nombre + porciones
- **Día actual:** Borde destacado en color primario
- **Arrastrando:** Opacidad 0.7 + escala 1.05

---

## 🚀 Flujo de Usuario

### **Caso 1: Generar Menú Automático con IA**
```
1. Usuario abre MealPlannerScreen
2. Toca "Generar Menú con IA"
3. Configura preferencias (vegetariana, 2 personas, sin lácteos)
4. IA genera menú completo en 5-10 segundos
5. Usuario revisa y edita comidas si quiere
6. Toca "Generar Lista de Compra"
7. Lista consolidada se guarda en HistoryScreen
8. Toca "Sincronizar con Calendario"
9. 21 eventos creados en calendario nativo
10. Recibe notificaciones diarias "Hoy cocinas X"
```

### **Caso 2: Planificar Manualmente Usando Recetas Guardadas**
```
1. Usuario abre MealPlannerScreen
2. Toca slot de "Lunes - Almuerzo"
3. Selecciona tab "Recetas Guardadas"
4. Elige "Pasta Carbonara" de RecipesScreen
5. Ajusta porciones de 4 a 2 personas
6. Toca "Añadir Comida"
7. Repite para todas las comidas de la semana
8. Genera lista de compra consolidada
9. Comparte plan con familia
```

### **Caso 3: Editar Comida Existente**
```
1. Usuario ve "Martes - Cena: Lasaña"
2. Toca el slot de comida
3. Modal se abre con detalles
4. Cambia porciones de 4 a 6
5. Añade ingrediente "Extra queso"
6. Guarda cambios
7. Lista de compra se actualiza automáticamente
```

---

## 📊 Integración con Pantallas Existentes

### **1. HomeScreen (Crear Lista por Voz)**
- Añadir botón "Crear desde Plan Semanal"
- Al grabar voz, sugerir agregar a plan actual

### **2. HistoryScreen (Listas Guardadas)**
- Listas generadas desde MealPlanner llevan badge "🍽️ Plan Semanal"
- Filtro especial para listas de meal plans
- Botón "Ver Plan Original" → abre MealPlannerScreen

### **3. RecipesScreen (Recetas con IA)**
- Botón "Añadir a Plan Semanal" en RecipeDetailModal
- Seleccionar día y tipo de comida al añadir

### **4. CalendarPlannerScreen (Calendario de Compras)**
- Mostrar eventos de cocina del meal plan
- Integración bidireccional (editar evento = editar comida)

### **5. RecommendationsScreen (Recomendaciones IA)**
- Pestaña nueva "Sugerencias Semanales"
- IA sugiere menús basados en historial

---

## 📋 Archivos a Crear

### **Nuevos Archivos:**
```
/screens/MealPlannerScreen.js                      (~2,500 líneas)
/screens/components/MealSlot.js                    (~150 líneas)
/screens/components/MealSelectorModal.js           (~400 líneas)
/screens/components/PreferencesModal.js            (~300 líneas)
/screens/components/WeekNavigator.js               (~100 líneas)
/screens/Styles/MealPlannerStyles.js               (~250 líneas)
/services/MealPlanService.js                       (~400 líneas)
/services/ShoppingListConsolidator.js              (~200 líneas)
/screens/translations/mealPlannerTranslations.js   (~150 líneas)
```

### **Archivos a Modificar:**
```
/navigation/components/CustomBottomTabNavigator.js  (añadir pestaña MealPlanner)
/navigation/navigators/DrawerNavigator.js           (añadir opción en menú)
/screens/RecipesScreen.js                           (botón "Añadir a Plan")
/screens/HistoryScreen.js                           (badge + filtro meal plans)
/translations.js                                    (traducciones)
```

---

## ⚙️ Servicios y Funciones Clave

### **MealPlanService.js**
```javascript
export const MealPlanService = {
  // CRUD de planes
  async getWeeklyPlan(weekStart) { ... },
  async saveWeeklyPlan(weekStart, plan) { ... },
  async deleteWeeklyPlan(weekStart) { ... },

  // IA
  async generateMenuWithAI(preferences) { ... },
  async suggestMeal(mealType, preferences) { ... },

  // Preferencias
  async getPreferences() { ... },
  async savePreferences(preferences) { ... },

  // Calendario
  async syncToCalendar(weeklyPlan) { ... },
  async createMealEvent(meal, date) { ... },

  // Notificaciones
  async scheduleMealReminders(weeklyPlan) { ... },
  async cancelMealReminders(weekStart) { ... },

  // Conversión
  convertWeekToRange(weekStart) { ... },
  getDateForDay(dayName, weekStart) { ... },
  getMealTime(mealType, date) { ... }
}
```

### **ShoppingListConsolidator.js**
```javascript
export const ShoppingListConsolidator = {
  // Consolidación
  consolidateIngredients(weeklyPlan) { ... },

  // Categorización
  categorizeIngredient(item) { ... },
  getCategoryOrder() { ... }, // Orden lógico de compra

  // Conversión de unidades
  convertUnits(quantity, fromUnit, toUnit) { ... },
  normalizeUnit(unit) { ... }, // "kg" === "kilogramos"

  // Detección duplicados
  areSameIngredient(item1, item2) { ... },
  fuzzyMatch(str1, str2) { ... }, // "tomate" === "tomates"

  // Exportar
  async saveToHistory(shoppingList, weekRange) { ... },
  exportToText(shoppingList) { ... },
  exportToJSON(shoppingList) { ... }
}
```

---

## 🎯 Ventajas de Esta Feature

### ✅ **Sin Nuevas Dependencias**
- 100% construida con tecnologías ya instaladas
- OpenAI, AsyncStorage, Calendar Events ya funcionan
- Reducción de riesgo técnico

### ✅ **Alto Valor para Usuario**
- Ahorra tiempo planificando semana completa
- Reduce viajes al supermercado
- Minimiza desperdicio de comida
- Alimentación más balanceada

### ✅ **Integración Natural**
- Flujo lógico: Planificar → Generar lista → Comprar
- Reutiliza RecipesScreen (si existe)
- Compatible con HistoryScreen y CalendarPlanner

### ✅ **Monetización Clara**
- **Feature Premium:** Generar menús con IA ilimitados
- **Free Tier:** 1 menú IA/semana + planificación manual ilimitada
- **Upsell:** "Desbloquea menús ilimitados - $2.99/mes"

### ✅ **Engagement Alto**
- Usuarios revisan plan diariamente
- Notificaciones mantienen engagement
- Sharing de menús semanales (viralidad)

---

## 📈 Métricas de Éxito Esperadas

| Métrica | Objetivo Conservador | Objetivo Optimista |
|---------|---------------------|-------------------|
| Usuarios que usan feature en 1ª semana | 25% | 45% |
| Planes semanales creados/usuario/mes | 2-3 | 4+ |
| Conversión a premium desde feature | +15% | +30% |
| Retención usuarios a 30 días | +20% | +40% |
| Listas consolidadas generadas/semana | 0.5/usuario | 2/usuario |
| Eventos sincronizados a calendario | 60% usuarios | 80% usuarios |

---

## 🚧 Roadmap de Implementación

### **Fase 1: MVP (2 semanas)**
- ✅ Crear MealPlannerScreen básico
- ✅ Navegador de semanas
- ✅ Slots de comidas (desayuno, almuerzo, cena)
- ✅ Modal de selección manual
- ✅ Guardar plan en AsyncStorage
- ✅ Generar lista de compra consolidada
- ✅ Ajuste de porciones

### **Fase 2: IA Integration (1 semana)**
- ✅ Generador de menús con GPT-4
- ✅ Modal de preferencias dietéticas
- ✅ Sugerencias inteligentes por comida
- ✅ Respeto de restricciones alimentarias

### **Fase 3: Integraciones (1 semana)**
- ✅ Sincronización con calendario nativo
- ✅ Notificaciones diarias de cocina
- ✅ Integración con RecipesScreen
- ✅ Badge en HistoryScreen
- ✅ Compartir planes

### **Fase 4: Mejoras UX (1 semana)**
- ✅ Drag & drop para reordenar comidas
- ✅ Copiar semana anterior
- ✅ Templates de planes (ej. "Semana vegetariana keto")
- ✅ Búsqueda de recetas en modal
- ✅ Modo vista rápida (ver semana completa)

### **Fase 5: Premium Features (Opcional)**
- [ ] Biblioteca de 500+ recetas profesionales
- [ ] Análisis nutricional (calorías, macros)
- [ ] Exportar plan a PDF
- [ ] Planes compartidos con familia
- [ ] Integración con supermercados (precios reales)

---

## ⚠️ Consideraciones Técnicas

### **Costos de API OpenAI:**
- Generación de menú semanal: ~1,500 tokens = $0.015/generación
- **Solución:** Free users = 1 generación/semana | Premium = ilimitado
- Costo mensual estimado (10k usuarios activos, 30% usan IA): $45/mes

### **Performance:**
- AsyncStorage puede crecer con múltiples semanas guardadas
- **Solución:** Límite de 8 semanas guardadas | Auto-borrado de semanas >2 meses

### **Sincronización Calendario:**
- iOS: `react-native-calendar-events` ya funciona
- Android: Requiere permisos adicionales (READ_CALENDAR, WRITE_CALENDAR)
- **Solución:** Feature opcional, no bloqueante

### **Notificaciones:**
- iOS: Requiere permisos explícitos
- **Solución:** Solicitar permisos al activar "Recordatorios diarios"

### **Conversión de Unidades:**
- "1 taza" + "250ml" = ¿cómo consolidar?
- **Solución:** Tabla de conversiones estándar + IA normaliza unidades

---

## 🎯 Conclusión

**MealPlannerScreen** es una feature de alto impacto que:

✅ **No requiere nuevas dependencias** (usa stack existente)
✅ **Resuelve problema real** (planificación caótica de comidas)
✅ **Incrementa engagement** (uso diario, notificaciones, calendario)
✅ **Monetización clara** (premium para menús IA ilimitados)
✅ **Integración perfecta** con RecipesScreen, HistoryScreen, CalendarPlanner
✅ **Viralidad potencial** (compartir planes semanales)

### **Diferenciador Competitivo:**
Muy pocas apps combinan:
1. 🎤 Listas por voz
2. 🍽️ Recetas con IA
3. 📅 Planificación semanal
4. 🛒 Lista consolidada automática

### **Recomendación Final:**
Implementar como **7ma pestaña en Tab Navigator** o **opción destacada en menú lateral**, con color púrpura `#8B5CF6` e icono `calendar-outline`.

Flujo ideal:
```
Planificar menú → Generar lista consolidada → Sincronizar calendario → Recibir recordatorios → Cocinar
```

Esto posiciona a VoiceList como una **"superapp de gestión culinaria inteligente"**.

---

**Fecha de Análisis:** 1 Octubre 2025
**Autor:** Análisis generado con Claude Code
**Versión App:** 2.0.1
