import AsyncStorage from "@react-native-async-storage/async-storage"
import * as RNLocalize from "react-native-localize"
import recommendationsTranslations from "../screens/translations/recommendationsTranslations"
import axios from "axios"

// ✅ USAR IA REAL - APIs configuradas igual que en HomeScreen
const API_KEY_ANALIZE = process.env.API_KEY_ANALIZE

/**
 * Servicio de Recomendaciones Personalizadas
 * Analiza patrones de compra del usuario y genera sugerencias inteligentes
 */
class RecommendationService {

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
   * 🤖 Genera recomendaciones usando IA REAL (GPT-4.1)
   */
  static async getRecommendations(limit = 4, shuffle = false) {
    try {
      console.log("🤖 === USANDO IA REAL GPT-4.1 PARA RECOMENDACIONES ===")

      // Analizar patrones del usuario
      const patterns = await this.analyzeUserPatterns()

      // Generar recomendaciones con IA real
      const aiRecommendations = await this.getSmartRecommendations(limit, shuffle, patterns)

      // Guardar historial de recomendaciones mostradas
      await this.saveRecommendationHistory(aiRecommendations)

      return aiRecommendations

    } catch (error) {
      console.error("❌ Error generando recomendaciones con IA:", error)

      // Fallback simple si falla la IA
      return [
        { item: 'Leche', reason: 'Producto básico', icon: '🥛', type: 'fallback' },
        { item: 'Pan', reason: 'Esencial diario', icon: '🍞', type: 'fallback' },
        { item: 'Huevos', reason: 'Proteína', icon: '🥚', type: 'fallback' },
        { item: 'Queso', reason: 'Lácteo', icon: '🧀', type: 'fallback' },
        { item: 'Tomates', reason: 'Verdura fresca', icon: '🍅', type: 'fallback' },
        { item: 'Aceite', reason: 'Condimento', icon: '🫒', type: 'fallback' }
      ].slice(0, limit)
    }
  }

  /**
   * Recomendaciones estacionales y contextuales
   */
  static getSeasonalRecommendations(currentDate) {
    const month = currentDate.getMonth() + 1 // 1-12
    const dayOfWeek = currentDate.getDay() // 0-6
    const recommendations = []

    const deviceLanguage = RNLocalize.getLocales()[0].languageCode
    const t = recommendationsTranslations[deviceLanguage] || recommendationsTranslations.en

    // Recomendaciones por mes
    const seasonalItems = {
      12: [{ item: t.seasonalItems.turkey, reason: t.seasonalReasons.christmas, icon: '🦃' }],
      1: [{ item: t.seasonalItems.water, reason: t.seasonalReasons.newYear, icon: '💧' }],
      6: [{ item: t.seasonalItems.sunscreen, reason: t.seasonalReasons.summerStart, icon: '☀️' }],
      7: [{ item: t.seasonalItems.iceCream, reason: t.seasonalReasons.hotSeason, icon: '🍦' }],
      8: [{ item: t.seasonalItems.schoolSupplies, reason: t.seasonalReasons.backToSchool, icon: '📚' }]
    }

    if (seasonalItems[month]) {
      seasonalItems[month].forEach(item => {
        recommendations.push({
          ...item,
          confidence: 0.6,
          type: 'seasonal',
          priority: 'medium'
        })
      })
    }

    // Recomendaciones por día de la semana
    if (dayOfWeek === 5 || dayOfWeek === 6) { // Viernes o Sábado
      recommendations.push({
        item: t.seasonalItems.snacks,
        reason: t.seasonalReasons.weekend,
        confidence: 0.5,
        type: 'contextual',
        icon: '🍿',
        priority: 'low'
      })
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

      // Crear prompt para GPT basado en historial
      let prompt = "Eres un asistente inteligente de compras. "

      if (history.length > 0) {
        const recentItems = history.flatMap(list => list.list).slice(-20)
        prompt += `El usuario ha comprado antes: ${recentItems.join(', ')}. `
      }

      prompt += `Genera ${limit} recomendaciones de productos para una lista de compras. `
      prompt += "Responde SOLO con una lista separada por comas, sin numeración ni explicaciones. "
      prompt += "Ejemplo: Leche, Pan, Huevos, Queso, Tomates, Aceite"

      console.log("📤 Enviando prompt a GPT-4.1:", prompt)

      // ✅ LLAMADA REAL a GPT-4.1
      const response = await axios.post(API_KEY_ANALIZE, {
        model: "gpt-4.1",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: shuffle ? 0.9 : 0.7 // Más creatividad si shuffle=true
      })

      const aiResponse = response.data.choices[0].message.content.trim()
      console.log("📥 Respuesta de GPT-4.1:", aiResponse)

      // Procesar respuesta de IA
      const aiItems = aiResponse.split(',').map(item => item.trim()).filter(item => item.length > 0)

      // Convertir a formato de recomendaciones
      const recommendations = aiItems.slice(0, limit).map(item => ({
        item: item,
        reason: "Recomendado por IA basado en tu historial",
        icon: this.getItemIcon(item),
        confidence: 0.9,
        type: 'ai_generated',
        priority: 'high'
      }))

      console.log("🤖 Recomendaciones generadas por IA:", recommendations.map(r => r.item))
      return recommendations

    } catch (error) {
      console.error("❌ Error con IA, usando fallback:", error)
      // Fallback simple si falla la IA
      return [
        { item: 'Leche', reason: 'Producto básico', icon: '🥛', type: 'fallback' },
        { item: 'Pan', reason: 'Esencial diario', icon: '🍞', type: 'fallback' },
        { item: 'Huevos', reason: 'Proteína', icon: '🥚', type: 'fallback' },
        { item: 'Queso', reason: 'Lácteo', icon: '🧀', type: 'fallback' },
        { item: 'Tomates', reason: 'Verdura fresca', icon: '🍅', type: 'fallback' },
        { item: 'Aceite', reason: 'Condimento', icon: '🫒', type: 'fallback' }
      ].slice(0, limit)
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
}

export default RecommendationService