import AsyncStorage from "@react-native-async-storage/async-storage"
import * as RNLocalize from "react-native-localize"
import recommendationsTranslations from "../screens/translations/recommendationsTranslations"
import axios from "axios"
import SeasonalProductsData, { getDietProducts } from "./SeasonalProductsData"

// ✅ USAR IA REAL - APIs configuradas igual que en HomeScreen
const API_KEY_ANALIZE = process.env.API_KEY_ANALIZE

/**
 * Servicio de Recomendaciones Personalizadas
 * Analiza patrones de compra del usuario y genera sugerencias inteligentes
 */
class RecommendationService {

  /**
   * Detecta el idioma del dispositivo del usuario
   */
  static getUserLanguage() {
    try {
      return RNLocalize.getLocales()[0].languageCode || 'es'
    } catch (error) {
      return 'es'
    }
  }

  /**
   * Limpia todo el cache de productos para forzar regeneración con IA real
   */
  static async clearAllProductCache() {
    try {
      console.log("🧹 Limpiando todo el cache de productos para regenerar con IA real...")

      // Limpiar cache de dieta
      await AsyncStorage.removeItem("@diet_cache")
      await AsyncStorage.removeItem("@used_diet_items")

      // Limpiar cache estacional para todos los meses
      for (let month = 1; month <= 12; month++) {
        await AsyncStorage.removeItem(`@seasonal_cache_${month}`)
        await AsyncStorage.removeItem(`@used_seasonal_${month}`)
      }

      // Limpiar cache de historial
      await AsyncStorage.removeItem("@recommendations_cache")
      await AsyncStorage.removeItem("@used_cache_items")

      console.log("✅ Cache de productos limpiado completamente - ahora usando IA real para estacionales y dieta")
    } catch (error) {
      console.error("Error limpiando cache:", error)
    }
  }


  /**
   * Analiza el historial del usuario para encontrar patrones
   */
  static async analyzeUserPatterns() {
    try {
      // Obtener datos existentes sin modificarlos
      const historyData = await AsyncStorage.getItem("@shopping_history")
      const completedItemsData = await AsyncStorage.getItem("@completed_items")

      console.log("=== DEBUGGING RECOMMENDATION SERVICE ===")
      console.log("Raw historyData:", historyData)

      if (!historyData) {
        console.log("No historyData found")
        return {
          frequencyPatterns: {},
          temporalPatterns: {},
          categoryPatterns: {},
          totalLists: 0,
          hasData: false
        }
      }

      const history = JSON.parse(historyData)
      console.log("Parsed history:", history)
      console.log("History length:", history.length)
      console.log("First item structure:", history[0])

      const completedItems = completedItemsData ? JSON.parse(completedItemsData) : {}

      // Análisis de frecuencia de productos
      const frequencyPatterns = this.analyzeFrequency(history)

      // Análisis de patrones temporales (días entre compras)
      const temporalPatterns = this.analyzeTemporal(history)

      // Análisis de categorías más compradas
      const categoryPatterns = this.analyzeCategories(history)

      return {
        frequencyPatterns,
        temporalPatterns,
        categoryPatterns,
        totalLists: history.length,
        hasData: true,
        lastAnalysis: new Date().toISOString()
      }

    } catch (error) {
      console.error("Error analyzing user patterns:", error)
      return {
        frequencyPatterns: {},
        temporalPatterns: {},
        categoryPatterns: {},
        totalLists: 0,
        hasData: false
      }
    }
  }

  /**
   * Analiza frecuencia de productos en el historial
   */
  static analyzeFrequency(history) {
    const frequency = {}

    console.log("=== ANALYZING FREQUENCY ===")
    console.log("History length:", history.length)

    history.forEach((listItem, index) => {
      console.log(`Processing list ${index}:`, listItem)

      if (listItem.list && Array.isArray(listItem.list)) {
        console.log(`List ${index} has ${listItem.list.length} items:`, listItem.list)

        listItem.list.forEach(item => {
          const cleanItem = this.cleanItemName(item)
          console.log(`Original item: "${item}" -> Clean item: "${cleanItem}"`)

          if (cleanItem && cleanItem.trim() !== '') {
            frequency[cleanItem] = (frequency[cleanItem] || 0) + 1
            console.log(`Updated frequency for "${cleanItem}": ${frequency[cleanItem]}`)
          }
        })
      } else {
        console.log(`List ${index} structure is wrong:`, listItem)
      }
    })

    console.log("Final frequency patterns:", frequency)
    return frequency
  }

  /**
   * Analiza patrones temporales (cuándo compra cada producto)
   */
  static analyzeTemporal(history) {
    const temporal = {}

    history.forEach(listItem => {
      if (listItem.list && Array.isArray(listItem.list) && listItem.date) {
        const listDate = new Date(listItem.date)

        listItem.list.forEach(item => {
          const cleanItem = this.cleanItemName(item)
          if (cleanItem) {
            if (!temporal[cleanItem]) {
              temporal[cleanItem] = []
            }
            temporal[cleanItem].push(listDate)
          }
        })
      }
    })

    // Calcular intervalos promedio entre compras
    const intervals = {}
    Object.keys(temporal).forEach(item => {
      const dates = temporal[item].sort((a, b) => a - b)
      if (dates.length > 1) {
        const gaps = []
        for (let i = 1; i < dates.length; i++) {
          const daysDiff = Math.floor((dates[i] - dates[i-1]) / (1000 * 60 * 60 * 24))
          gaps.push(daysDiff)
        }
        const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length
        intervals[item] = {
          averageDaysBetween: Math.round(avgGap),
          lastPurchase: dates[dates.length - 1],
          totalPurchases: dates.length
        }
      }
    })

    return intervals
  }

  /**
   * Analiza categorías más frecuentes
   */
  static analyzeCategories(history) {
    const categories = {
      'Lácteos': ['leche', 'yogurt', 'queso', 'mantequilla', 'crema'],
      'Carnes': ['pollo', 'carne', 'pescado', 'cerdo', 'pavo'],
      'Frutas': ['manzana', 'plátano', 'naranja', 'uva', 'pera'],
      'Verduras': ['tomate', 'cebolla', 'lechuga', 'zanahoria', 'papa'],
      'Panadería': ['pan', 'galletas', 'pastel', 'tortillas'],
      'Limpieza': ['detergente', 'jabón', 'shampoo', 'papel'],
      'Bebidas': ['agua', 'refresco', 'jugo', 'café', 'té']
    }

    const categoryCount = {}

    history.forEach(listItem => {
      if (listItem.list && Array.isArray(listItem.list)) {
        listItem.list.forEach(item => {
          const cleanItem = this.cleanItemName(item).toLowerCase()

          Object.keys(categories).forEach(category => {
            const keywords = categories[category]
            if (keywords.some(keyword => cleanItem.includes(keyword))) {
              categoryCount[category] = (categoryCount[category] || 0) + 1
            }
          })
        })
      }
    })

    return categoryCount
  }

  /**
   * Limpia el nombre del producto para análisis
   */
  static cleanItemName(item) {
    if (typeof item !== 'string') {
      item = String(item)
    }

    console.log(`🧹 Cleaning item: "${item}"`)

    // Patrón para extraer nombre del producto de formatos como:
    // "🍓 Fresas - 500 g" -> "Fresas"
    // "🥛 Nata - 1 brick (200 ml)" -> "Nata"
    // "- Tomate 🍅 (1 kg)" -> "Tomate"
    // "Snacks" -> "Snacks"

    // 1. Eliminar emojis al inicio
    item = item.replace(/^[^\w\s-]+\s*/, '')

    // 2. Eliminar prefijos como "- "
    item = item.replace(/^-\s*/, '')

    // 3. Para productos con formato "Nombre - cantidad/unidad"
    if (item.includes(' - ')) {
      const parts = item.split(' - ')
      // Tomar la primera parte que es el nombre
      item = parts[0].trim()
    }

    // 4. Eliminar cantidades y unidades al final
    item = item.replace(/\s*\([^)]*\)\s*$/g, '') // (cantidad) al final
    item = item.replace(/\s*-\s*\$[\d.,]+\s*$/g, '') // - $precio al final
    item = item.replace(/\s+\d+\s*(kg|g|ml|l|litro|litros|pieza|piezas|brick|tableta)\s*$/gi, '') // unidades al final

    // 5. Eliminar emojis al final
    item = item.replace(/\s*[^\w\s]+\s*$/, '')

    // 6. Limpiar espacios extra
    item = item.trim()

    const cleaned = item.toLowerCase()
    console.log(`✅ Cleaned result: "${cleaned}"`)

    return cleaned
  }

  /**
   * 🤖 Genera recomendaciones usando IA REAL (GPT-4.1) con sistema de cache
   * Obtiene 60 productos del bot y va rotando de 6 en 6 (~10 recargas)
   */
  static async getRecommendations(limit = 6, shuffle = false) {
    try {
      console.log("🤖 === USANDO SISTEMA DE CACHE PARA RECOMENDACIONES ===")

      // Verificar si hay historial primero
      const historyData = await AsyncStorage.getItem("@shopping_history")
      const hasHistory = historyData && JSON.parse(historyData).length > 0

      if (!hasHistory) {
        console.log("📝 No hay historial disponible, retornando mensaje para crear primera lista")
        return [{
          item: 'Sin historial disponible',
          reason: 'Crea tu primera lista para recibir recomendaciones personalizadas',
          type: 'no_history',
          priority: 'info'
        }]
      }

      // Verificar si tenemos cache disponible
      const cachedRecommendations = await this.getCachedRecommendations()

      if (cachedRecommendations && cachedRecommendations.length >= limit) {
        console.log("📦 Usando recomendaciones del cache:", cachedRecommendations.length, "disponibles")
        return await this.getRandomFromCache(cachedRecommendations, limit)
      }

      console.log("🔄 Cache insuficiente, generando nuevas recomendaciones...")

      // Analizar patrones del usuario
      const patterns = await this.analyzeUserPatterns()

      // Generar 60 recomendaciones con IA real para el cache (10 recargas aprox)
      const aiRecommendations = await this.getSmartRecommendations(60, shuffle, patterns)

      // Guardar en cache
      await this.saveCachedRecommendations(aiRecommendations)

      // Retornar solo las primeras 'limit' recomendaciones
      const result = aiRecommendations.slice(0, limit)

      // Guardar historial de recomendaciones mostradas
      await this.saveRecommendationHistory(result)

      return result

    } catch (error) {
      console.error("❌ Error generando recomendaciones con IA:", error)

      // Fallback amplio si falla la IA (productos variados)
      const fallbackProducts = [
        { item: 'Leche 🥛', reason: 'Producto básico', type: 'fallback' },
        { item: 'Pan 🍞', reason: 'Esencial diario', type: 'fallback' },
        { item: 'Huevos 🥚', reason: 'Proteína', type: 'fallback' },
        { item: 'Queso 🧀', reason: 'Lácteo', type: 'fallback' },
        { item: 'Tomates 🍅', reason: 'Verdura fresca', type: 'fallback' },
        { item: 'Aceite 🫒', reason: 'Condimento', type: 'fallback' },
        { item: 'Arroz 🍚', reason: 'Carbohidrato', type: 'fallback' },
        { item: 'Pasta 🍝', reason: 'Carbohidrato', type: 'fallback' },
        { item: 'Pollo 🐔', reason: 'Proteína', type: 'fallback' },
        { item: 'Pescado 🐟', reason: 'Proteína', type: 'fallback' },
        { item: 'Yogur 🥛', reason: 'Lácteo', type: 'fallback' },
        { item: 'Mantequilla 🧈', reason: 'Lácteo', type: 'fallback' },
        { item: 'Cebollas 🧅', reason: 'Verdura', type: 'fallback' },
        { item: 'Patatas 🥔', reason: 'Verdura', type: 'fallback' },
        { item: 'Zanahorias 🥕', reason: 'Verdura', type: 'fallback' },
        { item: 'Manzanas 🍎', reason: 'Fruta', type: 'fallback' },
        { item: 'Plátanos 🍌', reason: 'Fruta', type: 'fallback' },
        { item: 'Naranjas 🍊', reason: 'Fruta', type: 'fallback' },
        { item: 'Agua 💧', reason: 'Bebida', type: 'fallback' },
        { item: 'Café ☕', reason: 'Bebida', type: 'fallback' },
        { item: 'Azúcar 🧂', reason: 'Endulzante', type: 'fallback' },
        { item: 'Sal 🧂', reason: 'Condimento', type: 'fallback' },
        { item: 'Ajo 🧄', reason: 'Condimento', type: 'fallback' },
        { item: 'Limones 🍋', reason: 'Cítrico', type: 'fallback' },
        { item: 'Pimientos 🌶️', reason: 'Verdura', type: 'fallback' },
        { item: 'Lechuga 🥬', reason: 'Verdura', type: 'fallback' },
        { item: 'Pepinos 🥒', reason: 'Verdura', type: 'fallback' },
        { item: 'Carne 🥩', reason: 'Proteína', type: 'fallback' },
        { item: 'Jamón 🥓', reason: 'Embutido', type: 'fallback' },
        { item: 'Cereales 🥣', reason: 'Desayuno', type: 'fallback' }
      ]
      return fallbackProducts.slice(0, limit)
    }
  }

  /**
   * 🗓️ Recomendaciones estacionales con IA REAL (como el historial)
   */
  static async getSeasonalRecommendations(currentDate = null, shuffle = false, excludeItems = []) {
    try {
      console.log("🤖 === USANDO IA REAL PARA RECOMENDACIONES ESTACIONALES ===")

      const date = currentDate || this.getLocalDate()
      const month = date.getMonth() + 1 // 1-12

      // Detectar idioma del usuario
      const userLanguage = this.getUserLanguage()
      console.log("🌍 Idioma del usuario para estacionales:", userLanguage)

      // Verificar si tenemos cache disponible
      const cachedSeasonalItems = await this.getCachedSeasonalRecommendations(month)

      if (cachedSeasonalItems && cachedSeasonalItems.length >= 6) {
        // Verificar si el cache fue generado en el idioma actual
        const cacheLanguageMatch = await this.verifyCacheLanguage(cachedSeasonalItems, userLanguage, 'seasonal')

        if (cacheLanguageMatch) {
          console.log("📦 Usando recomendaciones estacionales del cache:", cachedSeasonalItems.length, "disponibles")
          return this.getRandomFromSeasonalCache(cachedSeasonalItems, 6, excludeItems)
        } else {
          console.log("🔄 Cache estacional en idioma incorrecto, regenerando con IA...")
          await this.clearSeasonalCache(month)
        }
      }

      console.log("🔄 Cache insuficiente, generando nuevas recomendaciones estacionales con IA...")

      // Generar 60 recomendaciones estacionales con IA real para el cache (10 recargas aprox)
      const aiRecommendations = await this.getSmartSeasonalRecommendations(date, month, 60, shuffle, excludeItems)

      // Guardar en cache
      await this.saveCachedSeasonalRecommendations(aiRecommendations, month)

      // Retornar solo las primeras 6 recomendaciones
      const result = aiRecommendations.slice(0, 6)

      return result

    } catch (error) {
      console.error("❌ Error generando recomendaciones estacionales con IA:", error)

      // Fallback a productos estacionales básicos
      const fallbackProducts = [
        { item: 'Naranjas 🍊', reason: 'Fruta de temporada', type: 'fallback' },
        { item: 'Mandarinas 🍊', reason: 'Cítricos de temporada', type: 'fallback' },
        { item: 'Manzanas 🍎', reason: 'Fruta de temporada', type: 'fallback' },
        { item: 'Peras 🍐', reason: 'Fruta de temporada', type: 'fallback' },
        { item: 'Brócoli 🥦', reason: 'Verdura de temporada', type: 'fallback' },
        { item: 'Zanahorias 🥕', reason: 'Verdura de temporada', type: 'fallback' }
      ]
      return fallbackProducts.slice(0, 6)
    }
  }

  /**
   * 🤖 NUEVA: Recomendaciones estacionales con IA REAL (60 productos como el historial)
   */
  static async getSmartSeasonalRecommendations(date, month, limit = 60, shuffle = false, excludeItems = []) {
    console.log("🤖 === USANDO IA REAL PARA RECOMENDACIONES ESTACIONALES ===")

    try {
      // Detectar idioma del usuario
      const deviceLanguage = RNLocalize.getLocales()[0].languageCode
      const t = recommendationsTranslations[deviceLanguage] || recommendationsTranslations.en
      const fallback = recommendationsTranslations.en

      // Crear prompt específico para temporadas con fallback
      const monthNames = t.monthNames || fallback.monthNames
      const currentMonth = monthNames[month - 1] || 'el mes actual'
      const currentDay = date.getDate()

      let prompt = (t.seasonalExpertIntro || fallback.seasonalExpertIntro) + " "

      const dateContext = t.currentDateContext || fallback.currentDateContext
      prompt += dateContext.replace('{month}', currentMonth).replace('{day}', currentDay) + " "

      prompt += (t.generateSeasonalProducts || fallback.generateSeasonalProducts).replace('{limit}', limit) + " "

      const seasonalFruits = t.seasonalFruits || fallback.seasonalFruits
      prompt += seasonalFruits.replace('{month}', currentMonth) + " "

      const climate = t.typicalClimate || fallback.typicalClimate
      prompt += climate.replace('{month}', currentMonth) + " "

      const festivals = t.festivalsAndTraditions || fallback.festivalsAndTraditions
      prompt += festivals.replace('{month}', currentMonth) + " "

      prompt += (t.culinaryPreparations || fallback.culinaryPreparations) + " "

      // Excluir productos ya mostrados
      if (excludeItems.length > 0) {
        const excludeAlready = t.excludeAlreadyShown || fallback.excludeAlreadyShown
        prompt += excludeAlready.replace('{excludeItems}', excludeItems.join(', ')) + " "
      }

      prompt += (t.seasonalResponseFormat || fallback.seasonalResponseFormat) + " "
      prompt += (t.seasonalExampleWithDescription || fallback.seasonalExampleWithDescription)

      console.log("📤 Enviando prompt estacional a GPT-4.1:", prompt)

      // ✅ LLAMADA REAL a GPT-4.1 - Configurado para 60 productos
      const response = await axios.post(API_KEY_ANALIZE, {
        model: "gpt-4.1",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800, // Más tokens para 60 productos
        temperature: shuffle ? 0.9 : 0.7 // Más creatividad si shuffle=true
      })

      const aiResponse = response.data.choices[0].message.content.trim()
      console.log("📥 Respuesta IA estacional:", aiResponse)

      // Procesar respuesta de IA - formato: "Producto - descripción específica"
      const lines = aiResponse.split('\n').filter(line => line.trim().length > 0)

      const recommendations = lines.slice(0, limit).map(line => {
        // Limpiar formato de lista numerada o viñetas
        const cleanLine = line.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim()

        let item, reason
        if (cleanLine.includes(' - ')) {
          [item, reason] = cleanLine.split(' - ', 2)
        } else {
          item = cleanLine
          reason = ""
        }

        return {
          item: this.ensureItemHasEmoji(item.trim()),
          reason: reason.trim(),
          confidence: 0.9,
          type: 'ai_seasonal',
          priority: 'high'
        }
      })

      console.log("🤖 Recomendaciones estacionales IA:", recommendations.length, "productos generados")
      return recommendations

    } catch (error) {
      console.error("❌ Error con IA estacional:", error)
      return []
    }
  }

  /**
   * 📋 Recomendaciones estáticas como fallback
   */
  static getStaticSeasonalRecommendations(date, month, dayOfWeek, shuffle = false, excludeItems = []) {
    const recommendations = []

    // Recomendaciones mejoradas por mes (con variedad para shuffle)
    const seasonalItems = {
      1: [ // Enero
        { item: 'Sopas calientes', reason: 'Perfecto para el frío de enero', type: 'seasonal' },
        { item: 'Vitamina C', reason: 'Refuerza defensas en invierno', type: 'seasonal' },
        { item: 'Agua', reason: 'Hidratación año nuevo', type: 'seasonal' },
        { item: 'Té caliente', reason: 'Bebidas cálidas de invierno', type: 'seasonal' },
        { item: 'Mandarinas', reason: 'Cítricos de temporada enero', type: 'seasonal' },
        { item: 'Lentejas', reason: 'Legumbres reconfortantes', type: 'seasonal' }
      ],
      2: [ // Febrero
        { item: 'Chocolate', reason: 'Temporada de San Valentín', type: 'seasonal' },
        { item: 'Fresas', reason: 'Frutas de temporada febrero', type: 'seasonal' },
        { item: 'Vino tinto', reason: 'Bebidas románticas', type: 'seasonal' }
      ],
      3: [ // Marzo
        { item: 'Verduras frescas', reason: 'Inicio de primavera', type: 'seasonal' },
        { item: 'Limones', reason: 'Cítricos de temporada', type: 'seasonal' },
        { item: 'Productos de limpieza', reason: 'Limpieza de primavera', type: 'seasonal' }
      ],
      4: [ // Abril
        { item: 'Espárragos', reason: 'Verdura de temporada abril', type: 'seasonal' },
        { item: 'Huevos', reason: 'Temporada de Pascua', type: 'seasonal' },
        { item: 'Ensaladas', reason: 'Comidas ligeras primavera', type: 'seasonal' }
      ],
      5: [ // Mayo
        { item: 'Fresas', reason: 'Temporada alta de fresas', type: 'seasonal' },
        { item: 'Barbacoa', reason: 'Inicio temporada BBQ', type: 'seasonal' },
        { item: 'Cerveza', reason: 'Bebidas frescas mayo', type: 'seasonal' }
      ],
      6: [ // Junio
        { item: 'Protector solar', reason: 'Inicio del verano', type: 'seasonal' },
        { item: 'Sandía', reason: 'Fruta refrescante verano', type: 'seasonal' },
        { item: 'Helados', reason: 'Postres frescos', type: 'seasonal' },
        { item: 'Agua', reason: 'Hidratación extra verano', type: 'seasonal' }
      ],
      7: [ // Julio
        { item: 'Melón', reason: 'Fruta de temporada julio', type: 'seasonal' },
        { item: 'Gazpacho', reason: 'Sopas frías de verano', type: 'seasonal' },
        { item: 'Pescado', reason: 'Comidas ligeras verano', type: 'seasonal' },
        { item: 'Bebidas isotónicas', reason: 'Hidratación deportiva', type: 'seasonal' }
      ],
      8: [ // Agosto
        { item: 'Material escolar', reason: 'Vuelta al cole', type: 'seasonal' },
        { item: 'Melocotones', reason: 'Fruta de temporada agosto', type: 'seasonal' },
        { item: 'Conservas', reason: 'Preparación otoño', type: 'seasonal' }
      ],
      9: [ // Septiembre
        { item: 'Uvas', reason: 'Temporada de vendimia', type: 'seasonal' },
        { item: 'Manzanas', reason: 'Frutas de otoño', type: 'seasonal' },
        { item: 'Castañas', reason: 'Frutos secos otoño', type: 'seasonal' },
        { item: 'Peras', reason: 'Frutas frescas de septiembre', type: 'seasonal' },
        { item: 'Higos', reason: 'Fruta de temporada otoñal', type: 'seasonal' },
        { item: 'Nueces', reason: 'Frutos secos de otoño', type: 'seasonal' },
        { item: 'Calabacín', reason: 'Verduras de septiembre', type: 'seasonal' },
        { item: 'Berenjenas', reason: 'Hortalizas de temporada', type: 'seasonal' }
      ],
      10: [ // Octubre
        { item: 'Calabaza', reason: 'Verdura de temporada octubre', type: 'seasonal' },
        { item: 'Setas', reason: 'Hongos de temporada', type: 'seasonal' },
        { item: 'Decoración Halloween', reason: 'Preparación Halloween', type: 'seasonal' }
      ],
      11: [ // Noviembre
        { item: 'Castañas', reason: 'Frutos secos de otoño', type: 'seasonal' },
        { item: 'Caldo', reason: 'Sopas calientes otoño', type: 'seasonal' },
        { item: 'Pavo', reason: 'Preparación Thanksgiving', type: 'seasonal' }
      ],
      12: [ // Diciembre
        { item: 'Pavo', reason: 'Navidad y fiestas', type: 'seasonal' },
        { item: 'Turrones', reason: 'Dulces navideños', type: 'seasonal' },
        { item: 'Champán', reason: 'Bebidas festivas', type: 'seasonal' },
        { item: 'Mazapán', reason: 'Postres navideños', type: 'seasonal' }
      ]
    }

    // Agregar recomendaciones del mes actual
    if (seasonalItems[month]) {
      let monthItems = [...seasonalItems[month]]

      // Filtrar productos que ya están mostrados
      if (excludeItems.length > 0) {
        monthItems = monthItems.filter(item =>
          !excludeItems.includes(item.item.toLowerCase())
        )
        console.log("✅ Productos filtrados, quedan:", monthItems.length)
      }

      // Si shuffle está activado, mezclar y tomar solo algunos
      if (shuffle) {
        console.log("🔀 Aplicando shuffle a recomendaciones estacionales")
        monthItems = this.shuffleArray(monthItems).slice(0, 4)
      }

      monthItems.forEach(item => {
        recommendations.push({
          ...item,
          confidence: 0.8,
          priority: 'high'
        })
      })
    }

    // Recomendaciones por día de la semana
    if (dayOfWeek === 5 || dayOfWeek === 6) { // Viernes o Sábado
      const weekendItem = 'snacks para el fin de semana'
      if (!excludeItems.includes(weekendItem)) {
        recommendations.push({
          item: 'Snacks para el fin de semana',
          reason: 'Perfectos para relajarse',
          confidence: 0.7,
          type: 'contextual',
          priority: 'medium'
        })
      }
    }

    if (dayOfWeek === 0) { // Domingo
      const brunchItem = 'ingredientes para brunch'
      if (!excludeItems.includes(brunchItem)) {
        recommendations.push({
          item: 'Ingredientes para brunch',
          reason: 'Ideal para domingo familiar',
          confidence: 0.6,
          type: 'contextual',
          priority: 'medium'
        })
      }
    }

    return recommendations
  }

  /**
   * 🤖 USA IA REAL (GPT-4.1) para generar recomendaciones inteligentes
   */
  static async getSmartRecommendations(limit, shuffle, patterns) {
    console.log("🤖 USANDO IA REAL (GPT-4.1) para recomendaciones")

    try {
      // Obtener historial del usuario
      const historyData = await AsyncStorage.getItem("@shopping_history")
      const history = historyData ? JSON.parse(historyData) : []

      // Detectar idioma del usuario
      const deviceLanguage = RNLocalize.getLocales()[0].languageCode
      const t = recommendationsTranslations[deviceLanguage] || recommendationsTranslations.en
      const fallback = recommendationsTranslations.en

      // Crear prompt para GPT basado en historial con fallback
      let prompt = (t.aiAssistantIntro || fallback.aiAssistantIntro) + " "

      if (history.length > 0) {
        const recentItems = history.flatMap(list => list.list).slice(-20)
        const userPurchases = t.userPreviousPurchases || fallback.userPreviousPurchases
        prompt += userPurchases.replace('{items}', recentItems.join(', ')) + " "
      }

      const generateRecs = t.generateRecommendations || fallback.generateRecommendations
      prompt += generateRecs.replace('{limit}', limit) + " "
      prompt += (t.includeVariety || fallback.includeVariety) + " "
      prompt += (t.responseFormat || fallback.responseFormat) + " "
      prompt += (t.exampleFormat || fallback.exampleFormat)

      console.log("📤 Enviando prompt a GPT-4.1:", prompt)

      // ✅ LLAMADA REAL a GPT-4.1 - Configurado para 60 productos
      const response = await axios.post(API_KEY_ANALIZE, {
        model: "gpt-4.1",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600, // Más tokens para 60 productos
        temperature: shuffle ? 0.9 : 0.7 // Más creatividad si shuffle=true
      })

      const aiResponse = response.data.choices[0].message.content.trim()
      console.log("📥 Respuesta de GPT-4.1:", aiResponse)

      // Procesar respuesta de IA
      const aiItems = aiResponse.split(',').map(item => item.trim()).filter(item => item.length > 0)

      // Distribuir recomendaciones entre TODAS las listas del historial
      const recommendations = aiItems.slice(0, limit).map((item, index) => {
        // Rotar entre todas las listas del historial
        const listIndex = index % history.length
        const targetList = history[listIndex]
        const listName = targetList ? targetList.name : "tu historial"

        return {
          item: item,
          reason: `${t.recommendedFor || fallback.recommendedFor} "${listName}"`,
          icon: this.getItemIcon(item),
          confidence: 0.9,
          type: 'ai_generated',
          priority: 'high',
          forList: listName
        }
      })

      console.log("🤖 Recomendaciones generadas por IA:", recommendations.map(r => r.item))
      console.log("📋 Distribución por listas:", recommendations.map(r => `${r.item} → ${r.forList}`))
      return recommendations

    } catch (error) {
      console.error("❌ Error con IA, usando fallback:", error)
      // Fallback amplio si falla la IA (productos variados)
      const fallbackProducts = [
        { item: 'Leche 🥛', reason: 'Producto básico', type: 'fallback' },
        { item: 'Pan 🍞', reason: 'Esencial diario', type: 'fallback' },
        { item: 'Huevos 🥚', reason: 'Proteína', type: 'fallback' },
        { item: 'Queso 🧀', reason: 'Lácteo', type: 'fallback' },
        { item: 'Tomates 🍅', reason: 'Verdura fresca', type: 'fallback' },
        { item: 'Aceite 🫒', reason: 'Condimento', type: 'fallback' },
        { item: 'Arroz 🍚', reason: 'Carbohidrato', type: 'fallback' },
        { item: 'Pasta 🍝', reason: 'Carbohidrato', type: 'fallback' },
        { item: 'Pollo 🐔', reason: 'Proteína', type: 'fallback' },
        { item: 'Pescado 🐟', reason: 'Proteína', type: 'fallback' },
        { item: 'Yogur 🥛', reason: 'Lácteo', type: 'fallback' },
        { item: 'Mantequilla 🧈', reason: 'Lácteo', type: 'fallback' },
        { item: 'Cebollas 🧅', reason: 'Verdura', type: 'fallback' },
        { item: 'Patatas 🥔', reason: 'Verdura', type: 'fallback' },
        { item: 'Zanahorias 🥕', reason: 'Verdura', type: 'fallback' },
        { item: 'Manzanas 🍎', reason: 'Fruta', type: 'fallback' },
        { item: 'Plátanos 🍌', reason: 'Fruta', type: 'fallback' },
        { item: 'Naranjas 🍊', reason: 'Fruta', type: 'fallback' },
        { item: 'Agua 💧', reason: 'Bebida', type: 'fallback' },
        { item: 'Café ☕', reason: 'Bebida', type: 'fallback' },
        { item: 'Azúcar 🧂', reason: 'Endulzante', type: 'fallback' },
        { item: 'Sal 🧂', reason: 'Condimento', type: 'fallback' },
        { item: 'Ajo 🧄', reason: 'Condimento', type: 'fallback' },
        { item: 'Limones 🍋', reason: 'Cítrico', type: 'fallback' },
        { item: 'Pimientos 🌶️', reason: 'Verdura', type: 'fallback' },
        { item: 'Lechuga 🥬', reason: 'Verdura', type: 'fallback' },
        { item: 'Pepinos 🥒', reason: 'Verdura', type: 'fallback' },
        { item: 'Carne 🥩', reason: 'Proteína', type: 'fallback' },
        { item: 'Jamón 🥓', reason: 'Embutido', type: 'fallback' },
        { item: 'Cereales 🥣', reason: 'Desayuno', type: 'fallback' }
      ]
      return fallbackProducts.slice(0, limit)
    }
  }

  /**
   * ❌ ELIMINADO - Ahora usa IA real en lugar de listas estáticas
   */

  /**
   * Capitaliza nombre del producto
   */
  static capitalizeItem(item) {
    return item.charAt(0).toUpperCase() + item.slice(1)
  }

  /**
   * Obtiene icono apropiado para el producto
   */
  static getItemIcon(item) {
    const iconMap = {
      'leche': '🥛', 'yogurt': '🥛', 'queso': '🧀',
      'pan': '🍞', 'galletas': '🍪', 'pastel': '🎂',
      'manzana': '🍎', 'plátano': '🍌', 'naranja': '🍊',
      'pollo': '🍗', 'carne': '🥩', 'pescado': '🐟',
      'agua': '💧', 'café': '☕', 'té': '🍵',
      'detergente': '🧽', 'jabón': '🧼', 'shampoo': '🧴',
      'tomate': '🍅', 'cebolla': '🧅', 'papa': '🥔',
      'huevos': '🥚', 'mantequilla': '🧈'
    }

    const lowerItem = item.toLowerCase()
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowerItem.includes(key)) {
        return icon
      }
    }

    return '🛒' // Icono por defecto
  }

  /**
   * Asegura que el producto tenga un emoji apropiado
   */
  static ensureItemHasEmoji(item) {
    // Regex para detectar emojis Unicode
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u

    // Si ya tiene emoji, devolverlo tal como está
    if (emojiRegex.test(item)) {
      return item
    }

    // Si no tiene emoji, añadir uno basado en palabras clave
    const lowerItem = item.toLowerCase()

    // Mapeo ampliado de palabras clave a emojis
    const emojiMap = {
      // Frutas
      'manzana': '🍎', 'apple': '🍎', 'pomme': '🍎', 'apfel': '🍎', 'mela': '🍎', 'maçã': '🍎',
      'naranja': '🍊', 'orange': '🍊', 'arancia': '🍊', 'laranja': '🍊',
      'plátano': '🍌', 'banana': '🍌', 'banane': '🍌', 'banane': '🍌',
      'limón': '🍋', 'lemon': '🍋', 'citron': '🍋', 'zitrone': '🍋', 'limone': '🍋', 'limão': '🍋',
      'uva': '🍇', 'grape': '🍇', 'raisin': '🍇', 'traube': '🍇', 'uva': '🍇',
      'fresas': '🍓', 'strawberr': '🍓', 'fraise': '🍓', 'erdbeere': '🍓', 'fragola': '🍓', 'morango': '🍓',
      'pera': '🍐', 'pear': '🍐', 'poire': '🍐', 'birne': '🍐', 'pera': '🍐',
      'sandía': '🍉', 'watermelon': '🍉', 'pastèque': '🍉', 'wassermelone': '🍉', 'anguria': '🍉', 'melancia': '🍉',
      'melón': '🍈', 'melon': '🍈', 'melone': '🍈',

      // Verduras
      'tomate': '🍅', 'tomato': '🍅', 'pomodoro': '🍅',
      'cebolla': '🧅', 'onion': '🧅', 'oignon': '🧅', 'zwiebel': '🧅', 'cipolla': '🧅', 'cebola': '🧅',
      'ajo': '🧄', 'garlic': '🧄', 'ail': '🧄', 'knoblauch': '🧄', 'aglio': '🧄', 'alho': '🧄',
      'zanahoria': '🥕', 'carrot': '🥕', 'carotte': '🥕', 'karotte': '🥕', 'carota': '🥕', 'cenoura': '🥕',
      'papa': '🥔', 'potato': '🥔', 'pomme de terre': '🥔', 'kartoffel': '🥔', 'patata': '🥔', 'batata': '🥔',
      'brócoli': '🥦', 'broccoli': '🥦', 'brocoli': '🥦',
      'lechuga': '🥬', 'lettuce': '🥬', 'laitue': '🥬', 'salat': '🥬', 'lattuga': '🥬', 'alface': '🥬',
      'pepino': '🥒', 'cucumber': '🥒', 'concombre': '🥒', 'gurke': '🥒', 'cetriolo': '🥒', 'pepino': '🥒',
      'calabaza': '🎃', 'pumpkin': '🎃', 'citrouille': '🎃', 'kürbis': '🎃', 'zucca': '🎃', 'abóbora': '🎃',
      'calabacín': '🥒', 'zucchini': '🥒', 'courgette': '🥒', 'zucchine': '🥒',
      'berenjena': '🍆', 'eggplant': '🍆', 'aubergine': '🍆', 'melanzana': '🍆', 'berinjela': '🍆',
      'pimiento': '🌶️', 'pepper': '🌶️', 'poivron': '🌶️', 'paprika': '🌶️', 'peperone': '🌶️', 'pimentão': '🌶️',
      'setas': '🍄', 'mushroom': '🍄', 'champignon': '🍄', 'pilz': '🍄', 'fungo': '🍄', 'cogumelo': '🍄',
      'espinaca': '🥬', 'spinach': '🥬', 'épinard': '🥬', 'spinat': '🥬', 'spinaci': '🥬', 'espinafre': '🥬',

      // Lácteos
      'leche': '🥛', 'milk': '🥛', 'lait': '🥛', 'milch': '🥛', 'latte': '🥛', 'leite': '🥛',
      'queso': '🧀', 'cheese': '🧀', 'fromage': '🧀', 'käse': '🧀', 'formaggio': '🧀', 'queijo': '🧀',
      'yogur': '🥛', 'yogurt': '🥛', 'yaourt': '🥛', 'joghurt': '🥛', 'yogurt': '🥛', 'iogurte': '🥛',
      'mantequilla': '🧈', 'butter': '🧈', 'beurre': '🧈', 'butter': '🧈', 'burro': '🧈', 'manteiga': '🧈',

      // Carnes
      'pollo': '🍗', 'chicken': '🍗', 'poulet': '🍗', 'hähnchen': '🍗', 'pollo': '🍗', 'frango': '🍗',
      'carne': '🥩', 'meat': '🥩', 'viande': '🥩', 'fleisch': '🥩', 'carne': '🥩',
      'pescado': '🐟', 'fish': '🐟', 'poisson': '🐟', 'fisch': '🐟', 'pesce': '🐟', 'peixe': '🐟',
      'cerdo': '🐷', 'pork': '🐷', 'porc': '🐷', 'schwein': '🐷', 'maiale': '🐷', 'porco': '🐷',
      'jamón': '🥓', 'ham': '🥓', 'jambon': '🥓', 'schinken': '🥓', 'prosciutto': '🥓', 'presunto': '🥓',

      // Huevos
      'huevo': '🥚', 'egg': '🥚', 'oeuf': '🥚', 'ei': '🥚', 'uovo': '🥚', 'ovo': '🥚',

      // Panadería
      'pan': '🍞', 'bread': '🍞', 'pain': '🍞', 'brot': '🍞', 'pane': '🍞', 'pão': '🍞',
      'galleta': '🍪', 'cookie': '🍪', 'biscuit': '🍪', 'keks': '🍪', 'biscotto': '🍪', 'biscoito': '🍪',
      'pastel': '🎂', 'cake': '🎂', 'gâteau': '🎂', 'kuchen': '🎂', 'torta': '🎂', 'bolo': '🎂',

      // Bebidas
      'agua': '💧', 'water': '💧', 'eau': '💧', 'wasser': '💧', 'acqua': '💧', 'água': '💧',
      'café': '☕', 'coffee': '☕', 'café': '☕', 'kaffee': '☕', 'caffè': '☕',
      'té': '🍵', 'tea': '🍵', 'thé': '🍵', 'tee': '🍵', 'tè': '🍵', 'chá': '🍵',
      'jugo': '🧃', 'juice': '🧃', 'jus': '🧃', 'saft': '🧃', 'succo': '🧃', 'suco': '🧃',
      'cerveza': '🍺', 'beer': '🍺', 'bière': '🍺', 'bier': '🍺', 'birra': '🍺', 'cerveja': '🍺',
      'vino': '🍷', 'wine': '🍷', 'vin': '🍷', 'wein': '🍷', 'vino': '🍷', 'vinho': '🍷',

      // Condimentos y granos
      'arroz': '🍚', 'rice': '🍚', 'riz': '🍚', 'reis': '🍚', 'riso': '🍚', 'arroz': '🍚',
      'pasta': '🍝', 'pasta': '🍝', 'pâtes': '🍝', 'nudeln': '🍝', 'massa': '🍝',
      'aceite': '🫒', 'oil': '🫒', 'huile': '🫒', 'öl': '🫒', 'olio': '🫒', 'óleo': '🫒',
      'sal': '🧂', 'salt': '🧂', 'sel': '🧂', 'salz': '🧂', 'sale': '🧂',
      'azúcar': '🧂', 'sugar': '🧂', 'sucre': '🧂', 'zucker': '🧂', 'zucchero': '🧂', 'açúcar': '🧂',

      // Frutos secos
      'nuez': '🥜', 'nut': '🥜', 'noix': '🥜', 'nuss': '🥜', 'noce': '🥜', 'noz': '🥜',
      'castaña': '🌰', 'chestnut': '🌰', 'châtaigne': '🌰', 'kastanie': '🌰', 'castagna': '🌰', 'castanha': '🌰'
    }

    // Buscar coincidencia en palabras clave
    for (const [keyword, emoji] of Object.entries(emojiMap)) {
      if (lowerItem.includes(keyword)) {
        return `${item} ${emoji}`
      }
    }

    // Si no se encuentra coincidencia específica, añadir emoji genérico
    return `${item} 🛒`
  }

  /**
   * Guarda historial de recomendaciones mostradas
   */
  static async saveRecommendationHistory(recommendations) {
    try {
      const history = {
        timestamp: new Date().toISOString(),
        recommendations: recommendations,
        shown: true
      }

      const existingHistory = await AsyncStorage.getItem("@recommendation_history")
      const historyArray = existingHistory ? JSON.parse(existingHistory) : []

      historyArray.push(history)

      // Mantener solo los últimos 50 registros
      if (historyArray.length > 50) {
        historyArray.splice(0, historyArray.length - 50)
      }

      await AsyncStorage.setItem("@recommendation_history", JSON.stringify(historyArray))
    } catch (error) {
      console.error("Error saving recommendation history:", error)
    }
  }

  /**
   * Obtiene productos que ya fueron agregados a una lista específica desde recomendaciones
   */
  static async getAddedToList(listName) {
    try {
      const addedData = await AsyncStorage.getItem("@added_to_lists")
      if (!addedData) return new Set()

      const added = JSON.parse(addedData)
      const listItems = added[listName] || []
      return new Set(listItems.map(item => item.toLowerCase()))
    } catch (error) {
      console.error("Error getting added to list:", error)
      return new Set()
    }
  }

  /**
   * Marca un producto como agregado a una lista específica
   */
  static async markAsAddedToList(listName, productName) {
    try {
      const addedData = await AsyncStorage.getItem("@added_to_lists")
      const added = addedData ? JSON.parse(addedData) : {}

      if (!added[listName]) {
        added[listName] = []
      }

      const cleanProduct = productName.toLowerCase()
      if (!added[listName].includes(cleanProduct)) {
        added[listName].push(cleanProduct)
      }

      await AsyncStorage.setItem("@added_to_lists", JSON.stringify(added))
      console.log(`Marked "${productName}" as added to list "${listName}"`)
    } catch (error) {
      console.error("Error marking as added to list:", error)
    }
  }

  /**
   * Obtiene productos recientemente mostrados para evitar repetición
   */
  static async getRecentlyShown() {
    try {
      const historyData = await AsyncStorage.getItem("@recommendation_history")
      if (!historyData) return new Set()

      const history = JSON.parse(historyData)
      const recent = new Set()

      // Obtener productos mostrados en las últimas 3 sesiones
      const recentSessions = history.slice(-3)
      recentSessions.forEach(session => {
        session.recommendations.forEach(rec => {
          recent.add(rec.item.toLowerCase())
        })
      })

      return recent
    } catch (error) {
      console.error("Error getting recently shown:", error)
      return new Set()
    }
  }

  /**
   * Marca una recomendación como ignorada para mejorar el algoritmo
   */
  static async ignoreRecommendation(item) {
    try {
      const ignoredData = await AsyncStorage.getItem("@ignored_recommendations")
      const ignored = ignoredData ? JSON.parse(ignoredData) : {}

      const cleanItem = this.cleanItemName(item)
      ignored[cleanItem] = (ignored[cleanItem] || 0) + 1

      await AsyncStorage.setItem("@ignored_recommendations", JSON.stringify(ignored))
    } catch (error) {
      console.error("Error saving ignored recommendation:", error)
    }
  }

  /**
   * Obtiene estadísticas del sistema de recomendaciones
   */
  static async getRecommendationStats() {
    try {
      const patterns = await this.analyzeUserPatterns()
      const historyData = await AsyncStorage.getItem("@recommendation_history")
      const ignoredData = await AsyncStorage.getItem("@ignored_recommendations")

      const history = historyData ? JSON.parse(historyData) : []
      const ignored = ignoredData ? JSON.parse(ignoredData) : {}

      return {
        totalAnalyzedLists: patterns.totalLists,
        uniqueProducts: Object.keys(patterns.frequencyPatterns).length,
        recommendationsShown: history.length,
        ignoredRecommendations: Object.keys(ignored).length,
        hasData: patterns.hasData,
        lastAnalysis: patterns.lastAnalysis
      }
    } catch (error) {
      console.error("Error getting recommendation stats:", error)
      return null
    }
  }

  /**
   * Limpia el historial de recomendaciones mostradas para permitir variedad total
   */
  static async clearRecentlyShown() {
    try {
      // Limpiar múltiples tipos de memoria de recomendaciones
      await AsyncStorage.removeItem("@recommendation_history")
      await AsyncStorage.removeItem("@added_to_lists")
      console.log("✅ All recommendation memory cleared for fresh variety")
    } catch (error) {
      console.error("Error clearing recently shown:", error)
    }
  }

  /**
   * Obtiene la fecha local corregida considerando zona horaria
   */
  static getLocalDate() {
    const now = new Date()
    const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
    console.log("🌍 Fecha UTC:", now.toISOString())
    console.log("🏠 Fecha local calculada:", localDate.toLocaleDateString())
    return localDate
  }

  /**
   * Mezcla aleatoriamente un array
   */
  static shuffleArray(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  /**
   * 📦 Obtiene recomendaciones del cache
   */
  static async getCachedRecommendations() {
    try {
      const cacheData = await AsyncStorage.getItem("@recommendations_cache")
      if (!cacheData) return null

      const cache = JSON.parse(cacheData)
      const now = new Date().getTime()

      // Verificar si el cache ha expirado (24 horas)
      if (now - cache.timestamp > 24 * 60 * 60 * 1000) {
        console.log("⏰ Cache expirado, limpiando...")
        await AsyncStorage.removeItem("@recommendations_cache")
        return null
      }

      // Filtrar productos que ya fueron usados
      const usedItems = await this.getUsedCacheItems()
      const availableItems = cache.recommendations.filter(rec =>
        !usedItems.has(rec.item.toLowerCase())
      )

      console.log("📦 Cache disponible:", availableItems.length, "de", cache.recommendations.length)
      return availableItems.length > 0 ? availableItems : null

    } catch (error) {
      console.error("Error obteniendo cache:", error)
      return null
    }
  }

  /**
   * 💾 Guarda recomendaciones en cache
   */
  static async saveCachedRecommendations(recommendations) {
    try {
      const cacheData = {
        timestamp: new Date().getTime(),
        recommendations: recommendations,
        total: recommendations.length
      }

      await AsyncStorage.setItem("@recommendations_cache", JSON.stringify(cacheData))

      // Limpiar items usados del cache para empezar fresh
      await AsyncStorage.removeItem("@used_cache_items")

      console.log("💾 Cache guardado con", recommendations.length, "recomendaciones (suficiente para ~10 recargas)")
    } catch (error) {
      console.error("Error guardando cache:", error)
    }
  }

  /**
   * 🎯 Obtiene elementos aleatorios del cache y redistribuye entre listas
   */
  static async getRandomFromCache(cachedItems, limit) {
    const shuffled = this.shuffleArray(cachedItems)
    let selected = shuffled.slice(0, limit)

    // Detectar idioma para traducciones
    const deviceLanguage = RNLocalize.getLocales()[0].languageCode
    const t = recommendationsTranslations[deviceLanguage] || recommendationsTranslations.en
    const fallback = recommendationsTranslations.en

    // Obtener historial para redistribuir recomendaciones
    try {
      const historyData = await AsyncStorage.getItem("@shopping_history")
      const history = historyData ? JSON.parse(historyData) : []

      if (history.length > 0) {
        console.log("🔄 Redistribuyendo cache entre", history.length, "listas:", history.map(h => h.name))
        // Redistribuir entre todas las listas del historial
        selected = selected.map((item, index) => {
          const listIndex = index % history.length
          const targetList = history[listIndex]
          const listName = targetList ? targetList.name : "tu historial"

          console.log(`📍 Producto ${index}: ${item.item} → ${listName} (index ${listIndex})`)

          return {
            ...item,
            reason: `${t.recommendedFor || fallback.recommendedFor} "${listName}"`,
            forList: listName
          }
        })
      }
    } catch (error) {
      console.error("Error redistribuyendo cache:", error)
    }

    // Marcar estos items como usados
    await this.markCacheItemsAsUsed(selected.map(item => item.item))

    console.log("🎯 Seleccionados del cache:", selected.map(item => item.item))
    console.log("📋 Redistribución cache por listas:", selected.map(r => `${r.item} → ${r.forList}`))
    return selected
  }

  /**
   * ✅ Marca items del cache como usados
   */
  static async markCacheItemsAsUsed(items) {
    try {
      const usedData = await AsyncStorage.getItem("@used_cache_items")
      const usedItems = usedData ? JSON.parse(usedData) : []

      const newUsedItems = [...usedItems, ...items.map(item => item.toLowerCase())]
      await AsyncStorage.setItem("@used_cache_items", JSON.stringify(newUsedItems))

      console.log("✅ Marcados como usados:", items)
    } catch (error) {
      console.error("Error marcando items como usados:", error)
    }
  }

  /**
   * 📋 Obtiene items ya usados del cache
   */
  static async getUsedCacheItems() {
    try {
      const usedData = await AsyncStorage.getItem("@used_cache_items")
      const usedItems = usedData ? JSON.parse(usedData) : []
      return new Set(usedItems)
    } catch (error) {
      console.error("Error obteniendo items usados:", error)
      return new Set()
    }
  }

  /**
   * 🗑️ Limpia el cache de recomendaciones
   */
  static async clearRecommendationsCache() {
    try {
      await AsyncStorage.removeItem("@recommendations_cache")
      await AsyncStorage.removeItem("@used_cache_items")
      console.log("🗑️ Cache de recomendaciones limpiado")
    } catch (error) {
      console.error("Error limpiando cache:", error)
    }
  }

  /**
   * 🌿 Genera productos estacionales usando el componente SeasonalProductsData
   */
  static generateSeasonalRecommendations(month) {
    console.log("🌿 Generando productos estacionales para mes:", month)

    const userLanguage = this.getUserLanguage()
    console.log("🌍 Idioma del usuario:", userLanguage)

    // Usar el componente separado para obtener productos estacionales traducidos
    return SeasonalProductsData.getSeasonalProducts(month, null, userLanguage)
  }

  /**
   * 📅 Obtiene el nombre del mes usando SeasonalProductsData
   */
  static getMonthName(month) {
    return SeasonalProductsData.getMonthName(month)
  }

  /**
   * 📦 Cache para productos estacionales
   */
  static async getCachedSeasonalRecommendations(month) {
    try {
      const cacheData = await AsyncStorage.getItem(`@seasonal_cache_${month}`)
      if (!cacheData) return null

      const cache = JSON.parse(cacheData)
      const usedItems = await this.getUsedSeasonalItems(month)

      const availableItems = cache.recommendations.filter(rec =>
        !usedItems.has(rec.item.toLowerCase())
      )

      console.log("📦 Cache estacional mes", month, ":", availableItems.length, "disponibles")
      return availableItems.length > 0 ? availableItems : null

    } catch (error) {
      console.error("Error obteniendo cache estacional:", error)
      return null
    }
  }

  /**
   * 💾 Guarda cache estacional
   */
  static async saveCachedSeasonalRecommendations(recommendations, month) {
    try {
      const cacheData = {
        month: month,
        recommendations: recommendations,
        timestamp: new Date().getTime()
      }

      await AsyncStorage.setItem(`@seasonal_cache_${month}`, JSON.stringify(cacheData))
      await AsyncStorage.removeItem(`@used_seasonal_${month}`)

      console.log("💾 Cache estacional guardado para mes", month, "con", recommendations.length, "productos")
    } catch (error) {
      console.error("Error guardando cache estacional:", error)
    }
  }

  /**
   * 🎯 Obtiene elementos aleatorios del cache estacional
   */
  static getRandomFromSeasonalCache(cachedItems, limit, excludeItems = []) {
    // Filtrar items excluidos
    const filtered = cachedItems.filter(item =>
      !excludeItems.includes(item.item.toLowerCase())
    )

    const shuffled = this.shuffleArray(filtered)
    const selected = shuffled.slice(0, limit)

    // Marcar como usados
    this.markSeasonalItemsAsUsed(selected.map(item => item.item), cachedItems[0]?.month || new Date().getMonth() + 1)

    console.log("🎯 Seleccionados del cache estacional:", selected.map(item => item.item))
    return selected
  }

  /**
   * ✅ Marca items estacionales como usados
   */
  static async markSeasonalItemsAsUsed(items, month) {
    try {
      const usedData = await AsyncStorage.getItem(`@used_seasonal_${month}`)
      const usedItems = usedData ? JSON.parse(usedData) : []

      const newUsedItems = [...usedItems, ...items.map(item => item.toLowerCase())]
      await AsyncStorage.setItem(`@used_seasonal_${month}`, JSON.stringify(newUsedItems))

      console.log("✅ Marcados como usados estacionales:", items)
    } catch (error) {
      console.error("Error marcando items estacionales como usados:", error)
    }
  }

  /**
   * 📋 Obtiene items estacionales ya usados
   */
  static async getUsedSeasonalItems(month) {
    try {
      const usedData = await AsyncStorage.getItem(`@used_seasonal_${month}`)
      const usedItems = usedData ? JSON.parse(usedData) : []
      return new Set(usedItems)
    } catch (error) {
      console.error("Error obteniendo items estacionales usados:", error)
      return new Set()
    }
  }

  /**
   * 🗑️ Limpia el cache estacional para un mes específico
   */
  static async clearSeasonalCache(month) {
    try {
      await AsyncStorage.removeItem(`@seasonal_cache_${month}`)
      await AsyncStorage.removeItem(`@used_seasonal_${month}`)
      console.log("🗑️ Cache estacional limpiado para mes", month)
    } catch (error) {
      console.error("Error limpiando cache estacional:", error)
    }
  }

  /**
   * 🥗 Recomendaciones de productos de dieta con IA REAL (como el historial)
   */
  static async getDietRecommendations(limit = 6, shuffle = false, excludeItems = []) {
    try {
      console.log("🤖 === USANDO IA REAL PARA RECOMENDACIONES DE DIETA ===")

      // Detectar idioma del usuario
      const userLanguage = this.getUserLanguage()
      console.log("🌍 Idioma del usuario para dieta:", userLanguage)

      // Verificar si tenemos cache disponible
      const cachedDietItems = await this.getCachedDietRecommendations()

      if (cachedDietItems && cachedDietItems.length >= 6) {
        // Verificar si el cache fue generado en el idioma actual
        const cacheLanguageMatch = await this.verifyCacheLanguage(cachedDietItems, userLanguage, 'diet')

        if (cacheLanguageMatch) {
          console.log("📦 Usando recomendaciones de dieta del cache:", cachedDietItems.length, "disponibles")
          return this.getRandomFromDietCache(cachedDietItems, limit, excludeItems)
        } else {
          console.log("🔄 Cache de dieta en idioma incorrecto, regenerando con IA...")
          await this.clearDietCache()
        }
      }

      console.log("🔄 Cache insuficiente, generando nuevas recomendaciones de dieta con IA...")

      // Generar 60 recomendaciones de dieta con IA real para el cache (10 recargas aprox)
      const aiRecommendations = await this.getSmartDietRecommendations(60, shuffle, excludeItems)

      // Guardar en cache
      await this.saveCachedDietRecommendations(aiRecommendations)

      // Retornar solo las primeras 6 recomendaciones
      const result = aiRecommendations.slice(0, limit)

      return result

    } catch (error) {
      console.error("❌ Error generando recomendaciones de dieta con IA:", error)

      // Fallback a productos de dieta básicos
      const fallbackProducts = [
        { item: 'Pepino 🥒', reason: 'Bajo en calorías (16 cal/100g)', type: 'fallback' },
        { item: 'Lechuga 🥬', reason: 'Muy baja en calorías (15 cal/100g)', type: 'fallback' },
        { item: 'Tomate 🍅', reason: 'Bajo en calorías (18 cal/100g)', type: 'fallback' },
        { item: 'Brócoli 🥦', reason: 'Rico en fibra (34 cal/100g)', type: 'fallback' },
        { item: 'Espinacas 🥬', reason: 'Ricas en hierro (23 cal/100g)', type: 'fallback' },
        { item: 'Calabacín 🥒', reason: 'Bajo en calorías (17 cal/100g)', type: 'fallback' }
      ]
      return fallbackProducts.slice(0, limit)
    }
  }

  /**
   * 🤖 NUEVA: Recomendaciones de dieta con IA REAL (60 productos con información nutricional)
   */
  static async getSmartDietRecommendations(limit = 60, shuffle = false, excludeItems = []) {
    console.log("🤖 === USANDO IA REAL PARA RECOMENDACIONES DE DIETA ===")

    try {
      // Detectar idioma del usuario
      const deviceLanguage = RNLocalize.getLocales()[0].languageCode
      const t = recommendationsTranslations[deviceLanguage] || recommendationsTranslations.en
      const fallback = recommendationsTranslations.en

      // Crear prompt específico para productos de dieta con información nutricional completa
      let prompt = (t.dietExpertIntro || fallback.dietExpertIntro) + " "

      prompt += (t.generateDietProducts || fallback.generateDietProducts).replace('{limit}', limit) + " "

      prompt += (t.includeNutritionalInfo || fallback.includeNutritionalInfo) + " "

      prompt += (t.lowCalorieOptions || fallback.lowCalorieOptions) + " "

      prompt += (t.healthyProtein || fallback.healthyProtein) + " "

      prompt += (t.fiberRichFoods || fallback.fiberRichFoods) + " "

      prompt += (t.lowFatOptions || fallback.lowFatOptions) + " "

      // Excluir productos ya mostrados
      if (excludeItems.length > 0) {
        const excludeAlready = t.excludeAlreadyShown || fallback.excludeAlreadyShown
        prompt += excludeAlready.replace('{excludeItems}', excludeItems.join(', ')) + " "
      }

      prompt += (t.dietResponseFormat || fallback.dietResponseFormat) + " "
      prompt += (t.dietExample || fallback.dietExample)

      console.log("📤 Enviando prompt de dieta a GPT-4.1:", prompt)

      // ✅ LLAMADA REAL a GPT-4.1 - Configurado para 60 productos de dieta
      const response = await axios.post(API_KEY_ANALIZE, {
        model: "gpt-4.1",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000, // Más tokens para 60 productos con información nutricional
        temperature: shuffle ? 0.8 : 0.6 // Menos variabilidad para productos de dieta
      })

      const aiResponse = response.data.choices[0].message.content.trim()
      console.log("📥 Respuesta IA de dieta:", aiResponse)

      // Procesar respuesta de IA - formato: "Producto - descripción nutricional"
      const lines = aiResponse.split('\n').filter(line => line.trim().length > 0)

      const recommendations = lines.slice(0, limit).map(line => {
        // Limpiar formato de lista numerada o viñetas
        const cleanLine = line.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim()

        let item, reason
        if (cleanLine.includes(' - ')) {
          [item, reason] = cleanLine.split(' - ', 2)
        } else {
          item = cleanLine
          reason = 'Ideal para dieta saludable'
        }

        return {
          item: item.trim(),
          reason: reason ? reason.trim() : 'Ideal para dieta saludable',
          confidence: 0.9,
          type: 'ai_diet',
          priority: 'high'
        }
      })

      console.log("🤖 Recomendaciones de dieta IA:", recommendations.length, "productos generados")
      return recommendations

    } catch (error) {
      console.error("❌ Error con IA de dieta:", error)
      return []
    }
  }

  /**
   * 📦 Obtiene cache de recomendaciones de dieta
   */
  static async getCachedDietRecommendations() {
    try {
      const cachedData = await AsyncStorage.getItem("@diet_cache")
      if (cachedData) {
        const cached = JSON.parse(cachedData)
        console.log("📦 Cache de dieta encontrado:", cached.length, "productos")
        return cached
      }
      return null
    } catch (error) {
      console.error("Error obteniendo cache de dieta:", error)
      return null
    }
  }

  /**
   * 💾 Guarda cache de recomendaciones de dieta
   */
  static async saveCachedDietRecommendations(recommendations) {
    try {
      await AsyncStorage.setItem("@diet_cache", JSON.stringify(recommendations))
      console.log("💾 Cache de dieta guardado:", recommendations.length, "productos")
    } catch (error) {
      console.error("Error guardando cache de dieta:", error)
    }
  }

  /**
   * 🎲 Obtiene selección aleatoria del cache de dieta
   */
  static async getRandomFromDietCache(cachedItems, limit, excludeItems = []) {
    try {
      // Filtrar items excluidos (el filtrado de usados ya se hizo en getCachedDietRecommendations)
      let available = cachedItems.filter(item =>
        !excludeItems.includes(item.item.toLowerCase())
      )

      // Mezclar y seleccionar
      const shuffled = this.shuffleArray([...available])
      const selected = shuffled.slice(0, limit)

      // Marcar como usados
      await this.markDietItemsAsUsed(selected.map(item => item.item))

      console.log("🎯 Seleccionados del cache de dieta:", selected.map(item => item.item))
      return selected
    } catch (error) {
      console.error("Error obteniendo del cache de dieta:", error)
      return cachedItems.slice(0, limit)
    }
  }

  /**
   * ✅ Marca items de dieta como usados
   */
  static async markDietItemsAsUsed(items) {
    try {
      const usedData = await AsyncStorage.getItem("@used_diet_items")
      const usedItems = usedData ? JSON.parse(usedData) : []

      const newUsedItems = [...usedItems, ...items.map(item => item.toLowerCase())]
      await AsyncStorage.setItem("@used_diet_items", JSON.stringify(newUsedItems))

      console.log("✅ Marcados como usados (dieta):", items)
    } catch (error) {
      console.error("Error marcando items de dieta como usados:", error)
    }
  }

  /**
   * 📋 Obtiene items de dieta ya usados
   */
  static async getUsedDietItems() {
    try {
      const usedData = await AsyncStorage.getItem("@used_diet_items")
      const usedItems = usedData ? JSON.parse(usedData) : []
      return new Set(usedItems)
    } catch (error) {
      console.error("Error obteniendo items de dieta usados:", error)
      return new Set()
    }
  }

  /**
   * 🗑️ Limpia items de dieta usados
   */
  static async clearUsedDietItems() {
    try {
      await AsyncStorage.removeItem("@used_diet_items")
      console.log("🗑️ Items de dieta usados limpiados")
    } catch (error) {
      console.error("Error limpiando items de dieta usados:", error)
    }
  }

  /**
   * 🔍 Verifica si el cache fue generado en el idioma actual del usuario
   */
  static async verifyCacheLanguage(cachedItems, userLanguage, type) {
    try {
      if (!cachedItems || cachedItems.length === 0) return false

      // Obtener algunos items del cache para analizar el idioma
      const sampleItems = cachedItems.slice(0, Math.min(10, cachedItems.length))

      // Palabras clave por idioma para detectar el idioma del cache
      const languageKeywords = {
        'es': ['tomate', 'pimiento', 'zanahoria', 'pepino', 'lechuga', 'pollo', 'pescado', 'queso', 'leche', 'pan', 'cebolla', 'ajo'],
        'en': ['tomato', 'pepper', 'carrot', 'cucumber', 'lettuce', 'chicken', 'fish', 'cheese', 'milk', 'bread', 'onion', 'garlic'],
        'de': ['tomaten', 'paprika', 'karotten', 'gurken', 'salat', 'hähnchen', 'fisch', 'käse', 'milch', 'brot', 'zwiebeln', 'knoblauch', 'kartoffeln', 'äpfel', 'bananen'],
        'fr': ['tomate', 'poivron', 'carotte', 'concombre', 'laitue', 'poulet', 'poisson', 'fromage', 'lait', 'pain', 'oignon', 'ail'],
        'it': ['pomodoro', 'peperone', 'carota', 'cetriolo', 'lattuga', 'pollo', 'pesce', 'formaggio', 'latte', 'pane', 'cipolla', 'aglio'],
        'pt': ['tomate', 'pimentão', 'cenoura', 'pepino', 'alface', 'frango', 'peixe', 'queijo', 'leite', 'pão', 'cebola', 'alho'],
        'ru': ['помидор', 'перец', 'морковь', 'огурец', 'салат', 'курица', 'рыба', 'сыр', 'молоко', 'хлеб', 'лук', 'чеснок'],
        'ar': ['طماطم', 'فلفل', 'جزر', 'خيار', 'خس', 'دجاج', 'سمك', 'جبن', 'حليب', 'خبز', 'بصل', 'ثوم'],
        'hu': ['paradicsom', 'paprika', 'sárgarépa', 'uborka', 'saláta', 'csirke', 'hal', 'sajt', 'tej', 'kenyér', 'hagyma', 'fokhagyma'],
        'ja': ['トマト', 'ペッパー', 'にんじん', 'きゅうり', 'レタス', 'チキン', '魚', 'チーズ', '牛乳', 'パン', '玉ねぎ', 'にんにく'],
        'tr': ['domates', 'biber', 'havuç', 'salatalık', 'marul', 'tavuk', 'balık', 'peynir', 'süt', 'ekmek', 'soğan', 'sarımsak'],
        'hi': ['टमाटर', 'मिर्च', 'गाजर', 'खीरा', 'सलाद', 'चिकन', 'मछली', 'पनीर', 'दूध', 'रोटी', 'प्याज', 'लहसुन'],
        'nl': ['tomaat', 'paprika', 'wortel', 'komkommer', 'sla', 'kip', 'vis', 'kaas', 'melk', 'brood', 'ui', 'knoflook']
      }

      const currentKeywords = languageKeywords[userLanguage] || languageKeywords['en']

      // Contar coincidencias del idioma actual en el cache
      let matches = 0
      let total = 0

      sampleItems.forEach(item => {
        const itemText = (item.item + ' ' + (item.reason || '')).toLowerCase()
        total++

        const hasMatch = currentKeywords.some(keyword =>
          itemText.includes(keyword.toLowerCase())
        )

        if (hasMatch) {
          matches++
        }
      })

      // Si al menos 20% de los items coinciden con el idioma actual, consideramos que es correcto
      const matchPercentage = matches / total
      const isCorrectLanguage = matchPercentage >= 0.2

      console.log(`🔍 Verificación de idioma ${type}: ${matches}/${total} coincidencias (${Math.round(matchPercentage * 100)}%), idioma correcto: ${isCorrectLanguage}`)

      return isCorrectLanguage

    } catch (error) {
      console.error("Error verificando idioma del cache:", error)
      return false // En caso de error, forzar regeneración
    }
  }

  /**
   * 🗑️ Limpia todo el cache de dieta
   */
  static async clearDietCache() {
    try {
      await AsyncStorage.removeItem("@diet_cache")
      await AsyncStorage.removeItem("@used_diet_items")
      console.log("🗑️ Cache completo de dieta limpiado")
    } catch (error) {
      console.error("Error limpiando cache de dieta:", error)
    }
  }
}

export default RecommendationService