import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as RNLocalize from 'react-native-localize';
import {
  PROMPT_COMIDA_INDIVIDUAL,
  PROMPT_DIA_COMPLETO,
  PROMPT_MENU_SEMANAL,
  SYSTEM_ROLE_CHEF,
  SYSTEM_ROLE_NUTRITIONIST
} from './mealPlannerPromptsClean';

const API_KEY_CHAT = process.env.API_KEY_CHAT;
const MEAL_PLANS_KEY = '@meal_plans';
const MEAL_PREFERENCES_KEY = '@meal_preferences';

export const MealPlanService = {
  /**
   * Obtener el inicio de la semana (lunes) para una fecha dada
   */
  getWeekStart(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar al lunes
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  },

  /**
   * Formatear fecha como clave (YYYY-MM-DD)
   */
  formatDateKey(date) {
    return date.toISOString().split('T')[0];
  },

  /**
   * Convertir inicio de semana a rango legible
   */
  getWeekRange(weekStart) {
    const start = new Date(weekStart);
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);

    const formatDay = (d) => {
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      return `${d.getDate()} ${months[d.getMonth()]}`;
    };

    return `${formatDay(start)} - ${formatDay(end)}`;
  },

  /**
   * Obtener todos los planes guardados
   */
  async getAllPlans() {
    try {
      const plansJson = await AsyncStorage.getItem(MEAL_PLANS_KEY);
      return plansJson ? JSON.parse(plansJson) : {};
    } catch (error) {
      console.error('Error al obtener planes:', error);
      return {};
    }
  },

  /**
   * Obtener plan de una semana específica
   */
  async getWeeklyPlan(weekStart) {
    try {
      const plans = await this.getAllPlans();
      const key = `weekOf_${this.formatDateKey(weekStart)}`;
      return plans[key] || this.createEmptyPlan(weekStart);
    } catch (error) {
      console.error('Error al obtener plan semanal:', error);
      return this.createEmptyPlan(weekStart);
    }
  },

  /**
   * Crear estructura de plan vacío
   */
  createEmptyPlan(weekStart) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const plan = {};

    days.forEach(day => {
      plan[day] = {
        breakfast: null,
        lunch: null,
        dinner: null
      };
    });

    return {
      weekRange: this.getWeekRange(weekStart),
      preferences: null,
      plan: plan,
      shoppingList: [],
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      calendarSynced: false,
      notificationsEnabled: false
    };
  },

  /**
   * Guardar plan semanal
   */
  async saveWeeklyPlan(weekStart, planData) {
    try {
      const plans = await this.getAllPlans();
      const key = `weekOf_${this.formatDateKey(weekStart)}`;

      plans[key] = {
        ...planData,
        lastModified: new Date().toISOString()
      };

      await AsyncStorage.setItem(MEAL_PLANS_KEY, JSON.stringify(plans));
      return true;
    } catch (error) {
      console.error('Error al guardar plan semanal:', error);
      return false;
    }
  },

  /**
   * Eliminar plan semanal
   */
  async deleteWeeklyPlan(weekStart) {
    try {
      const plans = await this.getAllPlans();
      const key = `weekOf_${this.formatDateKey(weekStart)}`;
      delete plans[key];
      await AsyncStorage.setItem(MEAL_PLANS_KEY, JSON.stringify(plans));
      return true;
    } catch (error) {
      console.error('Error al eliminar plan semanal:', error);
      return false;
    }
  },

  /**
   * Añadir comida a un slot específico
   */
  async addMealToSlot(weekStart, day, mealType, meal) {
    try {
      console.log(`📌 [addMealToSlot] Inicio - weekStart: ${weekStart}, day: ${day}, mealType: ${mealType}`);
      console.log(`📌 [addMealToSlot] Meal a guardar:`, meal);

      const weekPlan = await this.getWeeklyPlan(weekStart);
      console.log(`📌 [addMealToSlot] Plan actual antes de modificar:`, JSON.stringify(weekPlan.plan[day], null, 2));

      if (!weekPlan.plan[day]) {
        weekPlan.plan[day] = { breakfast: null, lunch: null, dinner: null };
      }

      weekPlan.plan[day][mealType] = meal;

      console.log(`📌 [addMealToSlot] Plan después de modificar ${day}.${mealType}:`, JSON.stringify(weekPlan.plan[day], null, 2));

      await this.saveWeeklyPlan(weekStart, weekPlan);
      console.log(`📌 [addMealToSlot] Plan guardado exitosamente`);

      return true;
    } catch (error) {
      console.error('❌ [addMealToSlot] Error al añadir comida:', error);
      return false;
    }
  },

  /**
   * Eliminar comida de un slot
   */
  async removeMealFromSlot(weekStart, day, mealType) {
    try {
      const weekPlan = await this.getWeeklyPlan(weekStart);

      if (weekPlan.plan[day]) {
        weekPlan.plan[day][mealType] = null;
      }

      await this.saveWeeklyPlan(weekStart, weekPlan);
      return true;
    } catch (error) {
      console.error('Error al eliminar comida:', error);
      return false;
    }
  },

  /**
   * Obtener preferencias del usuario
   */
  async getPreferences() {
    try {
      const prefsJson = await AsyncStorage.getItem(MEAL_PREFERENCES_KEY);
      return prefsJson ? JSON.parse(prefsJson) : this.getDefaultPreferences();
    } catch (error) {
      console.error('Error al obtener preferencias:', error);
      return this.getDefaultPreferences();
    }
  },

  /**
   * Preferencias por defecto
   */
  getDefaultPreferences() {
    return {
      diet: 'normal',
      servings: 2,
      restrictions: [],
      customRestrictions: [], // ✅ NUEVO: Restricciones personalizadas como array
      budget: 'medium',
      cookingLevel: 'intermediate',
      cuisineType: 'varied', // ✅ NUEVO: Tipo de cocina por defecto
      useLocalAI: false, // ✅ NUEVO: Usar IA local (Ollama)
      aiModel: 'llama3.2:1b', // ✅ NUEVO: Modelo de IA por defecto
      defaultBreakfastTime: '08:00',
      defaultLunchTime: '13:00',
      defaultDinnerTime: '19:00',
      notificationOffsets: {
        breakfast: -30,
        lunch: -60,
        dinner: -90
      }
    };
  },

  /**
   * Guardar preferencias
   */
  async savePreferences(preferences) {
    try {
      await AsyncStorage.setItem(MEAL_PREFERENCES_KEY, JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.error('Error al guardar preferencias:', error);
      return false;
    }
  },

  /**
   * Obtener fecha para un día de la semana
   */
  getDateForDay(dayName, weekStart) {
    const days = {
      monday: 0,
      tuesday: 1,
      wednesday: 2,
      thursday: 3,
      friday: 4,
      saturday: 5,
      sunday: 6
    };

    const date = new Date(weekStart);
    date.setDate(date.getDate() + days[dayName]);
    return date;
  },

  /**
   * Obtener nombre del día en español
   */
  getDayNameInSpanish(dayName) {
    const names = {
      monday: 'Lunes',
      tuesday: 'Martes',
      wednesday: 'Miércoles',
      thursday: 'Jueves',
      friday: 'Viernes',
      saturday: 'Sábado',
      sunday: 'Domingo'
    };
    return names[dayName] || dayName;
  },

  /**
   * Generar menú semanal con IA (GPT-4)
   */
  async generateMenuWithAI(preferences) {
    try {
      console.log('📝 [MealPlanService] Iniciando generateMenuWithAI');
      console.log('📝 [MealPlanService] Preferencias recibidas:', preferences);

      // ✅ LÓGICA LIMPIA - Solo español
      let country = '';
      let currentMonth = '';
      let currentSeason = '';

      if (preferences.seasonalProducts) {
        try {
          const savedCountry = await AsyncStorage.getItem("@country");
          country = savedCountry || '';

          const now = new Date();
          const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
          currentMonth = monthNames[now.getMonth()];

          const month = now.getMonth() + 1;
          if (month >= 3 && month <= 5) currentSeason = 'primavera';
          else if (month >= 6 && month <= 8) currentSeason = 'verano';
          else if (month >= 9 && month <= 11) currentSeason = 'otoño';
          else currentSeason = 'invierno';
        } catch (error) {
          console.error('Error obteniendo país/fecha:', error);
        }
      }

      // Construir contexto
      const context = {
        country,
        currentMonth,
        currentSeason
      };

      // ✅ USAR PROMPT LIMPIO
      const prompt = PROMPT_MENU_SEMANAL(preferences, context);

      console.log('📝 [MealPlanService] Prompt generado (primeros 300 chars):', prompt.substring(0, 300));

      const response = await axios.post(API_KEY_CHAT, {
        model: 'gpt-4.1',
        max_tokens: 3000,
        messages: [
          {
            role: 'system',
            content: SYSTEM_ROLE_NUTRITIONIST
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      console.log('📝 [MealPlanService] Respuesta recibida');
      console.log('📝 [MealPlanService] Status:', response.status);
      console.log('📝 [MealPlanService] Response data keys:', Object.keys(response.data));
      console.log('📝 [MealPlanService] Response.data:', response.data);

      if (!response.data || !response.data.choices || !response.data.choices[0]) {
        console.error('❌ [MealPlanService] Respuesta malformada:', response.data);
        throw new Error('Respuesta del servidor no tiene el formato esperado');
      }

      const content = response.data.choices[0].message.content;
      console.log('📝 [MealPlanService] Contenido extraído (primeros 500 chars):', content.substring(0, 500));
      console.log('📝 [MealPlanService] Longitud del contenido:', content.length);

      // Limpiar respuesta si contiene markdown
      const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      console.log('📝 [MealPlanService] JSON limpio (primeros 500 chars):', jsonContent.substring(0, 500));
      console.log('📝 [MealPlanService] JSON limpio (últimos 200 chars):', jsonContent.substring(Math.max(0, jsonContent.length - 200)));

      if (!jsonContent || jsonContent.length === 0) {
        console.error('❌ [MealPlanService] Contenido vacío después de limpiar');
        throw new Error('La respuesta de la IA está vacía');
      }

      let parsedMenu;
      try {
        parsedMenu = JSON.parse(jsonContent);
        console.log('📝 [MealPlanService] Menú parseado exitosamente');
        console.log('📝 [MealPlanService] Días en el menú:', Object.keys(parsedMenu));
      } catch (parseError) {
        console.error('❌ [MealPlanService] Error al parsear JSON:', parseError);
        console.error('❌ [MealPlanService] Contenido completo que causó el error:', jsonContent);
        throw new Error(`Error al parsear respuesta JSON: ${parseError.message}`);
      }

      return parsedMenu;
    } catch (error) {
      console.error('❌ [MealPlanService] Error al generar menú con IA:', error);
      console.error('❌ [MealPlanService] Error message:', error.message);
      console.error('❌ [MealPlanService] Error response:', error.response?.data);
      console.error('❌ [MealPlanService] Error status:', error.response?.status);
      throw error;
    }
  },

  /**
   * Sugerir una comida específica con IA
   */
  /**
   * Llamar a IA local (Ollama) para generar receta
   */
  async callLocalAI(prompt, model = 'llama3.2:1b') {
    const OLLAMA_URL = process.env.OLLAMA_API_URL;

    console.log('🤖 [LocalAI] Llamando a Ollama...');
    console.log('🤖 [LocalAI] Modelo:', model);
    console.log('🤖 [LocalAI] Prompt (primeros 300 chars):', prompt.substring(0, 300));

    // 🔥 Agregar instrucciones estrictas para JSON
    const strictPrompt = `${prompt}

🚨 CRITICAL: You MUST respond with ONLY valid JSON. No explanations, no text before or after. Just the JSON object.
Example:
{"name": "Dish Name", "servings": 2, "time": "30 min", "ingredients": [{"item": "Ingredient", "quantity": "100", "unit": "g"}]}`;

    try {
      // 🔄 Reintentar hasta 2 veces (ngrok puede dar 421 en el primer intento)
      let response;
      let lastError;

      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          console.log(`🤖 [LocalAI] Intento ${attempt}/2...`);
          console.log(`🤖 [LocalAI] URL: ${OLLAMA_URL}`);
          console.log(`🤖 [LocalAI] Modelo a usar: ${model}`);

          // 🔥 Timeout más largo para modelos grandes (4.7 GB)
          const isLargeModel = model.includes('recipemaker') || model.includes('4b') || model.includes('7b');
          const timeout = isLargeModel ? 180000 : 90000; // 3 min para modelos grandes, 1.5 min para pequeños

          console.log(`🤖 [LocalAI] Timeout configurado: ${timeout}ms (${timeout/1000}s)`);
          console.log(`🤖 [LocalAI] Iniciando petición POST...`);

          const startTime = Date.now();

          response = await axios.post(OLLAMA_URL, {
            message: strictPrompt,
            model: model
          }, {
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true',  // ✅ Evitar error 421 de ngrok
              'User-Agent': 'VoiceList-App/1.0'
            },
            timeout: timeout
          });

          const endTime = Date.now();
          const duration = endTime - startTime;
          console.log(`🤖 [LocalAI] Respuesta recibida en ${duration}ms (${(duration/1000).toFixed(1)}s)`);
          console.log('🤖 [LocalAI] Status:', response.status);
          console.log('🤖 [LocalAI] Data (primeros 500 chars):', JSON.stringify(response.data).substring(0, 500));

          if (!response.data || response.data.status !== 'success') {
            throw new Error(response.data?.error || response.data?.respuesta || 'Error en respuesta de Ollama');
          }

          // Si llegamos aquí, la petición fue exitosa
          break;
        } catch (err) {
          lastError = err;
          console.warn(`⚠️ [LocalAI] Intento ${attempt} falló:`, err.message);
          console.warn(`⚠️ [LocalAI] Error code:`, err.code);
          console.warn(`⚠️ [LocalAI] Error completo:`, JSON.stringify({
            message: err.message,
            code: err.code,
            response: err.response ? {
              status: err.response.status,
              data: err.response.data
            } : 'no response'
          }));

          if (attempt < 2) {
            console.log(`🔄 [LocalAI] Esperando 1 segundo antes del siguiente intento...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }

      if (!response || !response.data || response.data.status !== 'success') {
        console.error('❌ [LocalAI] No se recibió respuesta válida después de 2 intentos');
        console.error('❌ [LocalAI] Último error:', lastError?.message);
        throw lastError || new Error('No se pudo conectar con IA local');
      }

      const content = response.data.respuesta
        .replace(/<think>[\s\S]*?<\/think>/g, '')  // Eliminar tags <think>
        .replace(/^think[\s\S]*?$/gm, '')  // Eliminar líneas de pensamiento
        .trim();

      console.log('🤖 [LocalAI] Contenido limpio:', content);

      return content;
    } catch (error) {
      console.error('❌ [LocalAI] Error final:', error.message);
      throw new Error(`Error en IA local: ${error.message}`);
    }
  },

  async suggestMeal(mealType, preferences, weekPlan = null, currentDay = null) {
    try {
      // ✅ LÓGICA LIMPIA - Solo español
      console.log('🍽️ [suggestMeal] Generando comida individual...');

      // Analizar proteínas y platos ya usados en la semana
      let usedProteins = [];
      let todayProteins = [];
      let todayMeals = [];
      let allWeekMeals = []; // ✅ NUEVO: Todos los platos de la semana

      console.log(`🔍 [suggestMeal] Analizando platos existentes en la semana...`);
      console.log(`🔍 [suggestMeal] weekPlan recibido:`, weekPlan ? 'SÍ' : 'NO');
      console.log(`🔍 [suggestMeal] Día actual:`, currentDay || 'no especificado');

      if (weekPlan && weekPlan.plan) {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

        days.forEach(day => {
          if (weekPlan.plan[day]) {
            ['breakfast', 'lunch', 'dinner'].forEach(meal => {
              if (weekPlan.plan[day][meal]) {
                const mealName = weekPlan.plan[day][meal].name?.toLowerCase() || '';
                console.log(`  📋 ${day}.${meal}: "${weekPlan.plan[day][meal].name}"`);

                // Detectar proteínas (ampliado)
                if (mealName.includes('pollo') || mealName.includes('chicken') || mealName.includes('pechuga')) usedProteins.push('pollo');
                if (mealName.includes('salmón') || mealName.includes('salmon')) usedProteins.push('salmón');
                if (mealName.includes('pescado') || mealName.includes('fish') || mealName.includes('atún') || mealName.includes('bacalao') || mealName.includes('merluza') || mealName.includes('trucha')) usedProteins.push('pescado');
                if (mealName.includes('carne') || mealName.includes('beef') || mealName.includes('ternera') || mealName.includes('res') || mealName.includes('bistec') || mealName.includes('filete')) usedProteins.push('carne');
                if (mealName.includes('cerdo') || mealName.includes('pork') || mealName.includes('carnita')) usedProteins.push('cerdo');
                if (mealName.includes('huevo') || mealName.includes('egg') || mealName.includes('omelette') || mealName.includes('tortilla')) usedProteins.push('huevo');
                if (mealName.includes('camarón') || mealName.includes('shrimp') || mealName.includes('langostino')) usedProteins.push('camarón');
                if (mealName.includes('pavo') || mealName.includes('turkey')) usedProteins.push('pavo');

                // ✅ Guardar TODOS los platos de la semana para detectar repeticiones
                allWeekMeals.push(mealName);

                // Si es el día actual, también guardar proteínas y platos
                if (day === currentDay) {
                  if (mealName.includes('pollo') || mealName.includes('chicken') || mealName.includes('pechuga')) todayProteins.push('pollo');
                  if (mealName.includes('salmón') || mealName.includes('salmon')) todayProteins.push('salmón');
                  if (mealName.includes('pescado') || mealName.includes('fish') || mealName.includes('atún') || mealName.includes('bacalao') || mealName.includes('merluza') || mealName.includes('trucha')) todayProteins.push('pescado');
                  if (mealName.includes('carne') || mealName.includes('beef') || mealName.includes('ternera') || mealName.includes('res') || mealName.includes('bistec') || mealName.includes('filete')) todayProteins.push('carne');
                  if (mealName.includes('cerdo') || mealName.includes('pork') || mealName.includes('carnita')) todayProteins.push('cerdo');
                  if (mealName.includes('huevo') || mealName.includes('egg') || mealName.includes('omelette') || mealName.includes('tortilla')) todayProteins.push('huevo');
                  if (mealName.includes('camarón') || mealName.includes('shrimp') || mealName.includes('langostino')) todayProteins.push('camarón');
                  if (mealName.includes('pavo') || mealName.includes('turkey')) todayProteins.push('pavo');

                  todayMeals.push(mealName);
                }
              }
            });
          }
        });
      }

      console.log(`📊 [suggestMeal] Total de platos encontrados en la semana: ${allWeekMeals.length}`);
      console.log(`📊 [suggestMeal] Platos de la semana:`, allWeekMeals);

      // ✅ NUEVO: Detectar platos base repetidos EN TODA LA SEMANA
      const dishBaseKeywords = [
        'tortita', 'pancake', 'avena', 'oatmeal', 'yogurt', 'smoothie',
        'huevo', 'egg', 'tostada', 'toast', 'francesa', 'french',
        'bowl', 'quinoa', 'ensalada', 'salad',
        'pasta', 'arroz', 'rice', 'sopa', 'soup',
        'wraps', 'tacos', 'taco', 'burger', 'hamburguesa',
        'pizza', 'sandwich', 'wrap', 'burrito', 'quesadilla',
        'enchilada', 'fajita', 'nachos'
      ];
      const usedDishBases = [];

      dishBaseKeywords.forEach(keyword => {
        const count = allWeekMeals.filter(meal => meal.includes(keyword)).length;
        if (count >= 1) { // ✅ Si ya se usó 1+ vez, bloquearlo (NO permitir repeticiones)
          usedDishBases.push(keyword);
        }
      });

      console.log(`🚫 [suggestMeal] Platos base detectados (para bloquear):`, usedDishBases);
      console.log(`🥩 [suggestMeal] Proteínas detectadas en la semana:`, usedProteins);

      let weeklyDishRestrictions = '';
      let proteinRestrictions = '';

      // Restricciones de platos base
      if (usedDishBases.length > 0) {
        weeklyDishRestrictions = `\n\n❌ PLATOS BASE YA USADOS ESTA SEMANA - PROHIBIDO REPETIR: ${usedDishBases.join(', ').toUpperCase()}
🚫 NO PUEDES usar ninguna de estas palabras: ${usedDishBases.join(', ')}`;
        console.log(`⚠️ [suggestMeal] RESTRICCIONES DE PLATOS: ${usedDishBases.length} bloqueados`);
      }

      // Restricciones de proteínas (para evitar repetir proteínas en días consecutivos)
      if (usedProteins.length > 0) {
        // Crear un set para eliminar duplicados
        const uniqueProteins = [...new Set(usedProteins)];
        proteinRestrictions = `\n\n🥩 PROTEÍNAS YA USADAS ESTA SEMANA - EVITAR: ${uniqueProteins.join(', ').toUpperCase()}
⚠️ Intenta usar una proteína DIFERENTE a estas: ${uniqueProteins.join(', ')}
✅ Opciones alternativas: atún, lentejas, garbanzos, tofu, pavo, pato, cordero, camarones`;
        console.log(`⚠️ [suggestMeal] RESTRICCIONES DE PROTEÍNAS: ${uniqueProteins.length} bloqueadas`);
      }

      // Combinar todas las restricciones
      const allRestrictions = weeklyDishRestrictions + proteinRestrictions;
      if (allRestrictions) {
        console.log(`⚠️ [suggestMeal] Total restricciones aplicadas: ${usedDishBases.length} platos + ${[...new Set(usedProteins)].length} proteínas`);
      } else {
        console.log(`✅ [suggestMeal] No hay restricciones (semana vacía o primera comida)`);
      }

      // Obtener contexto geográfico y temporal
      let country = '';
      let currentMonth = '';
      let currentSeason = '';

      if (preferences.seasonalProducts) {
        try {
          const savedCountry = await AsyncStorage.getItem("@country");
          country = savedCountry || '';

          const now = new Date();
          const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
          currentMonth = monthNames[now.getMonth()];

          const month = now.getMonth() + 1;
          if (month >= 3 && month <= 5) currentSeason = 'primavera';
          else if (month >= 6 && month <= 8) currentSeason = 'verano';
          else if (month >= 9 && month <= 11) currentSeason = 'otoño';
          else currentSeason = 'invierno';
        } catch (error) {
          console.error('Error obteniendo datos geográficos:', error);
        }
      }

      // Construir contexto para el prompt
      // Detectar idioma del dispositivo
      const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
      const language = ['de', 'en', 'fr', 'it', 'pt', 'nl', 'ja', 'hi', 'tr'].includes(deviceLanguage) ? deviceLanguage : 'es';

      const context = {
        usedProteins,
        todayProteins,
        todayMeals,
        weeklyDishRestrictions: allRestrictions, // Incluye restricciones de platos Y proteínas
        country,
        currentMonth,
        currentSeason,
        language
      };

      // ✅ USAR PROMPT LIMPIO
      const prompt = PROMPT_COMIDA_INDIVIDUAL(mealType, preferences, context);

      console.log('📝 [suggestMeal] Prompt generado (primeros 300 chars):', prompt.substring(0, 300));
      if (usedDishBases.length > 0 || usedProteins.length > 0) {
        const uniqueProteins = [...new Set(usedProteins)];
        console.log('🔒 [suggestMeal] Restricciones enviadas a la IA:');
        if (usedDishBases.length > 0) {
          console.log('   📋 Platos bloqueados:', usedDishBases.join(', '));
        }
        if (uniqueProteins.length > 0) {
          console.log('   🥩 Proteínas bloqueadas:', uniqueProteins.join(', '));
        }
      }

      let content;

      // 🤖 Decidir si usar IA local o ChatGPT
      if (preferences.useLocalAI) {
        console.log('🤖 [suggestMeal] Usando IA Local (Ollama)');
        const aiModel = preferences.aiModel || 'llama3.2:1b';
        console.log('🤖 [suggestMeal] Modelo seleccionado:', aiModel);

        content = await this.callLocalAI(prompt, aiModel);
      } else {
        console.log('🤖 [suggestMeal] Usando ChatGPT');

        const response = await axios.post(API_KEY_CHAT, {
          model: 'gpt-4o-mini',
          temperature: 0.6,
          max_tokens: 600,
          messages: [
            {
              role: 'system',
              content: SYSTEM_ROLE_CHEF
            },
            {
              role: 'user',
              content: prompt
            }
          ]
        });

        console.log('📝 [MealPlanService] Sugerencia de comida recibida de ChatGPT');

        if (!response.data || !response.data.choices || !response.data.choices[0]) {
          throw new Error('Respuesta del servidor no tiene el formato esperado');
        }

        content = response.data.choices[0].message.content;
      }

      console.log('📝 [MealPlanService] Contenido:', content);

      // Limpiar respuesta - extraer JSON
      let jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      // 🤖 Si viene de IA local, extraer solo el JSON entre llaves
      if (preferences.useLocalAI) {
        const jsonMatch = jsonContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonContent = jsonMatch[0];
          console.log('🤖 [LocalAI] JSON extraído:', jsonContent);
        }
      }

      try {
        const parsedMeal = JSON.parse(jsonContent);
        console.log(`✅ [suggestMeal] Comida generada exitosamente: "${parsedMeal.name}"`);

        // Verificar si el plato generado incluye alguna palabra bloqueada
        const mealNameLower = parsedMeal.name.toLowerCase();
        const foundBlockedDishes = usedDishBases.filter(blocked => mealNameLower.includes(blocked));
        const uniqueProteins = [...new Set(usedProteins)];
        const foundBlockedProteins = uniqueProteins.filter(protein => mealNameLower.includes(protein));

        if (foundBlockedDishes.length > 0 || foundBlockedProteins.length > 0) {
          if (foundBlockedDishes.length > 0) {
            console.warn(`⚠️ [suggestMeal] ADVERTENCIA: La IA repitió platos bloqueados: ${foundBlockedDishes.join(', ')}`);
          }
          if (foundBlockedProteins.length > 0) {
            console.warn(`⚠️ [suggestMeal] ADVERTENCIA: La IA repitió proteínas bloqueadas: ${foundBlockedProteins.join(', ')}`);
          }
          console.warn(`⚠️ [suggestMeal] Esto puede indicar que el prompt necesita ser más estricto`);
        } else if (usedDishBases.length > 0 || usedProteins.length > 0) {
          console.log(`✅ [suggestMeal] Verificado: No se repitieron platos ni proteínas bloqueados`);
        }

        return parsedMeal;
      } catch (parseError) {
        console.error('❌ [MealPlanService] Error al parsear sugerencia:', parseError);
        console.error('❌ [MealPlanService] Contenido:', jsonContent);
        throw new Error(`Error al parsear sugerencia: ${parseError.message}`);
      }
    } catch (error) {
      console.error('Error al sugerir comida:', error);
      throw error;
    }
  },

  /**
   * Limpiar planes antiguos (más de 2 meses)
   */
  async cleanOldPlans() {
    try {
      const plans = await this.getAllPlans();
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

      const filteredPlans = {};

      Object.keys(plans).forEach(key => {
        const dateStr = key.replace('weekOf_', '');
        const planDate = new Date(dateStr);

        if (planDate >= twoMonthsAgo) {
          filteredPlans[key] = plans[key];
        }
      });

      await AsyncStorage.setItem(MEAL_PLANS_KEY, JSON.stringify(filteredPlans));
      return true;
    } catch (error) {
      console.error('Error al limpiar planes antiguos:', error);
      return false;
    }
  }
};

export default MealPlanService;
