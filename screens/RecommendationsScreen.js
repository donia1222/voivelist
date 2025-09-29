import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  FlatList,
  Alert,
  Animated,
  Easing,
  ActivityIndicator,
  Platform,
  Dimensions,
  AppState
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTheme } from '../ThemeContext'
import { useHaptic } from '../HapticContext'
import RecommendationService from '../services/RecommendationService'
import * as RNLocalize from 'react-native-localize'
import recommendationsTranslations from './translations/recommendationsTranslations'
import seasonalRecommendationsTranslations from './translations/seasonalRecommendationsTranslations'
import dietRecommendationsTranslations from './translations/dietRecommendationsTranslations'
import { useFocusEffect } from '@react-navigation/native'
import axios from 'axios'
import Purchases from 'react-native-purchases'

const API_KEY_ANALIZE = process.env.API_KEY_ANALIZE

const { width: screenWidth } = Dimensions.get('window')
const isSmallIPhone = Platform.OS === 'ios' && screenWidth <= 375

/**
 * Pantalla dedicada para Recomendaciones Personalizadas
 * Permite ver sugerencias y agregarlas a listas existentes
 */
const RecommendationsScreen = ({ navigation, route }) => {
  const { theme } = useTheme()
  const { triggerHaptic } = useHaptic()
  const { onNavigateToHome, onNavigateToSubscribe } = route.params || {}

  // Estados principales
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [addedItems, setAddedItems] = useState(new Set())
  const [showListModal, setShowListModal] = useState(false)
  const [selectedRecommendation, setSelectedRecommendation] = useState(null)
  const [historyLists, setHistoryLists] = useState([])
  const [stats, setStats] = useState(null)
  const [hasHistory, setHasHistory] = useState(false)
  const [hasCurrentList, setHasCurrentList] = useState(false)

  // Estados para pestañas
  const [activeTab, setActiveTab] = useState('history') // 'history', 'seasonal' o 'diet'
  const [seasonalRecommendations, setSeasonalRecommendations] = useState([])
  const [seasonalLoading, setSeasonalLoading] = useState(false)
  const [seasonalCountry, setSeasonalCountry] = useState('')
  const [dietRecommendations, setDietRecommendations] = useState([])
  const [dietLoading, setDietLoading] = useState(false)
  const [dietRefreshing, setDietRefreshing] = useState(false)
  const [dietRefreshKey, setDietRefreshKey] = useState(0)

  // Estados para auto-carga
  const [displayedCount, setDisplayedCount] = useState(0) // Trackea cuántos se han mostrado
  const [isLoadingMore, setIsLoadingMore] = useState(false) // Loader para cargar más productos
  const [canLoadMore, setCanLoadMore] = useState(true) // Si puede cargar más

  // Estados para modo 7 - modal informativo
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [hasShownInfoModal, setHasShownInfoModal] = useState(false)

  // Estado de suscripción
  const [isSubscribed, setIsSubscribed] = useState(null)

  // Animaciones y referencias
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current
  const scrollViewRef = useRef(null)
  const hasLoadedRef = useRef(false) // Flag para cargar solo una vez por sesión

  // Traducciones
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  const t = recommendationsTranslations[deviceLanguage] || recommendationsTranslations.en
  const tSeasonal = seasonalRecommendationsTranslations[deviceLanguage] || seasonalRecommendationsTranslations.en
  const tDiet = dietRecommendationsTranslations[deviceLanguage] || dietRecommendationsTranslations.en
  const fallback = recommendationsTranslations.en

  // Efectos
  useEffect(() => {
    loadStats()
    startAnimations()
    checkFirstTimeModal()
    checkSubscriptionStatus()
  }, [])

  // Verificar si es la primera vez y mostrar modal
  const checkFirstTimeModal = async () => {
    try {
      const hasSeenModal = await AsyncStorage.getItem("@recommendations_modal_shown")
      if (!hasSeenModal) {
        // Es la primera vez, mostrar modal después de un pequeño delay
        setTimeout(() => {
          setShowInfoModal(true)
          setHasShownInfoModal(true)
        }, 1500) // Delay de 1.5 segundos para que cargue la pantalla
      } else {
        setHasShownInfoModal(true)
      }
    } catch (error) {
      console.error('Error checking first time modal:', error)
    }
  }

  // Verificar estado de suscripción
  const checkSubscriptionStatus = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo()
      const hasActiveSubscription = customerInfo.entitlements.active["12981"] !== undefined
      setIsSubscribed(hasActiveSubscription)
      console.log('🔄 Estado de suscripción:', hasActiveSubscription ? 'Activa' : 'Inactiva')
    } catch (error) {
      console.error('Error verificando suscripción:', error)
      setIsSubscribed(false) // Por defecto no suscrito si hay error
    }
  }

  // Función para navegar a suscripción
  const handleSubscribePress = () => {
    triggerHaptic()
    if (onNavigateToSubscribe) {
      onNavigateToSubscribe()
    } else {
      console.warn("No subscription navigation function provided")
    }
  }

  // Recargar SOLO la primera vez que la pantalla recibe focus
  useFocusEffect(
    React.useCallback(() => {
      if (hasLoadedRef.current) {
        console.log('✅ Ya cargado en esta sesión - NO recargar')
        return
      }

      console.log('🔄 Primera vez en esta sesión - cargando ambas pestañas')
      hasLoadedRef.current = true

      const reloadData = async () => {
        try {
          const historyData = await AsyncStorage.getItem("@shopping_history")
          const hasHistoryData = historyData && JSON.parse(historyData).length > 0
          setHasHistory(hasHistoryData)

          // Verificar suscripción ANTES de hacer cualquier carga para historial
          if (isSubscribed === false) {
            console.log('🚫 No suscrito - no cargando recomendaciones de historial')
            setRecommendations([])
            setLoading(false)
            setSeasonalRecommendations([])
            setSeasonalLoading(false)
            setDietRecommendations([])
            setDietLoading(false)
            return
          }

          // Cargar recomendaciones de historial SOLO si está suscrito
          setLoading(true)
          setDisplayedCount(12)
          setCanLoadMore(false)
          setIsLoadingMore(false)

          console.log("🤖 Generando 12 recomendaciones de historial con IA")
          const all12 = await RecommendationService.getRecommendations(12, false)
          console.log(`📥 Recibidas ${all12.length} recomendaciones de historial`)

          setRecommendations(all12)
          setDisplayedCount(all12.length)
          setCanLoadMore(false)
          setLoading(false)

          // Cargar recomendaciones de temporada y dieta en paralelo
          loadSeasonalRecommendations()
          loadDietRecommendations()
        } catch (error) {
          console.error('❌ Error generando recomendaciones:', error)
          setRecommendations([])
          setLoading(false)
        }
      }
      reloadData()

      // Cleanup: resetear el flag cuando el componente se desmonte completamente
      return () => {
        console.log('🧹 Componente desmontado - reseteando flag')
        hasLoadedRef.current = false
      }
    }, [])
  )

  // Funciones principales
  const loadMoreRecommendations = async () => {
    if (isLoadingMore || !canLoadMore || displayedCount >= 24) return

    try {
      setIsLoadingMore(true)

      // Obtener los siguientes 6 del cache de 60
      const allCached = await AsyncStorage.getItem("@all_recommendations_60")
      if (!allCached) {
        setCanLoadMore(false)
        setIsLoadingMore(false)
        return
      }

      const cached = JSON.parse(allCached)
      const nextBatch = cached.slice(displayedCount, displayedCount + 6)

      if (nextBatch.length > 0) {
        setRecommendations(prev => [...prev, ...nextBatch])
        setDisplayedCount(prev => prev + nextBatch.length)

        // Si ya llegamos a 24, no se puede cargar más
        if (displayedCount + nextBatch.length >= 24) {
          setCanLoadMore(false)
        }
      } else {
        setCanLoadMore(false)
      }

    } catch (error) {
      console.error('Error loading more recommendations:', error)
      setCanLoadMore(false)
    } finally {
      setIsLoadingMore(false)
    }
  }

  const loadRecommendations = async () => {
    try {
      setLoading(true)

      // Reset estados
      setDisplayedCount(12)
      setCanLoadMore(false)
      setIsLoadingMore(false)

      // Verificar si hay historial de compras
      const historyData = await AsyncStorage.getItem("@shopping_history")
      const hasHistoryData = historyData && JSON.parse(historyData).length > 0
      setHasHistory(hasHistoryData)

      // Verificar suscripción antes de hacer peticiones para historial
      if (isSubscribed === false) {
        console.log('🚫 No suscrito - no cargando recomendaciones de historial')
        setRecommendations([])
        setLoading(false)
        return
      }

      // SIEMPRE generar nuevas recomendaciones al entrar
      console.log("🤖 Generando 12 recomendaciones nuevas con IA")
      await generateRecommendationsProgressive()
      setLoading(false)

    } catch (error) {
      console.error('Error loading recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  // Nueva función: Generar recomendaciones progresivamente
  const generateRecommendationsProgressive = async () => {
    try {
      // Verificar suscripción antes de hacer peticiones
      if (isSubscribed === false) {
        console.log('🚫 No suscrito - no generando recomendaciones de historial')
        setRecommendations([])
        setLoading(false)
        return
      }

      console.log("📤 Petición única: 12 recomendaciones")
      const all12 = await RecommendationService.getRecommendations(12, false)

      console.log(`📥 Recibidas ${all12.length} recomendaciones, mostrando INMEDIATAMENTE`)

      // Mostrar TODOS los 12 de golpe
      setRecommendations(all12)
      setDisplayedCount(all12.length)
      setLoading(false)

      setCanLoadMore(false)

    } catch (error) {
      console.error("❌ Error generando recomendaciones:", error)
      setRecommendations([])
    }
  }

  const loadSeasonalRecommendations = async () => {
    try {
      // Verificar suscripción ANTES de mostrar cualquier loader
      if (isSubscribed === false) {
        console.log('🚫 No suscrito - no cargando recomendaciones de temporada')
        setSeasonalRecommendations([])
        setSeasonalLoading(false)
        return
      }

      setSeasonalLoading(true)

      // Cargar país desde AsyncStorage
      let savedCountry = await AsyncStorage.getItem("@country")
      if (!savedCountry || savedCountry.trim() === '') {
        const countryCode = RNLocalize.getCountry()
        const countryNames = {
          'ES': 'España', 'MX': 'México', 'US': 'Estados Unidos',
          'AR': 'Argentina', 'CO': 'Colombia', 'CL': 'Chile',
          'PE': 'Perú', 'VE': 'Venezuela', 'EC': 'Ecuador',
          'BO': 'Bolivia', 'PY': 'Paraguay', 'UY': 'Uruguay',
          'CR': 'Costa Rica', 'PA': 'Panamá', 'GT': 'Guatemala',
          'HN': 'Honduras', 'SV': 'El Salvador', 'NI': 'Nicaragua',
          'DO': 'República Dominicana', 'PR': 'Puerto Rico', 'CU': 'Cuba',
          'FR': 'Francia', 'IT': 'Italia', 'DE': 'Alemania',
          'GB': 'Reino Unido', 'PT': 'Portugal', 'BR': 'Brasil',
          'CA': 'Canadá', 'JP': 'Japón', 'CN': 'China',
          'IN': 'India', 'RU': 'Rusia', 'AU': 'Australia'
        }
        savedCountry = countryNames[countryCode] || countryCode || "tu zona"
      }

      console.log("🤖 Generando 12 recomendaciones de temporada con IA")

      // Guardar el país en el estado para mostrarlo en el banner
      setSeasonalCountry(savedCountry)

      const date = new Date()
      const month = date.getMonth() + 1
      const monthName = tSeasonal.monthNames[month]
      const year = date.getFullYear()
      const day = date.getDate()

      let prompt = tSeasonal.seasonalExpertIntro + " "
      prompt += tSeasonal.generateSeasonalProducts.replace('{limit}', 12).replace('{location}', savedCountry).replace('{month}', monthName).replace('{year}', year).replace('{day}', day) + " "
      prompt += tSeasonal.considerFactors + " "
      prompt += tSeasonal.seasonalFruits.replace('{location}', savedCountry).replace('{month}', monthName) + " "
      prompt += tSeasonal.localClimate.replace('{location}', savedCountry).replace('{month}', monthName) + " "
      prompt += tSeasonal.festivalsAndTraditions.replace('{location}', savedCountry).replace('{month}', monthName) + " "
      prompt += tSeasonal.culinaryPreparations + " "
      prompt += tSeasonal.responseFormat.replace('{location}', savedCountry) + " "
      prompt += tSeasonal.exampleFormat.replace(/{location}/g, savedCountry)

      const response = await axios.post(API_KEY_ANALIZE, {
        model: "gpt-4.1",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.7
      })

      const aiResponse = response.data.choices[0].message.content.trim()
      const lines = aiResponse.split('\n').filter(line => line.trim().length > 0)

      const seasonal = lines.slice(0, 12).map(line => {
        const cleanLine = line.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim()
        let item, reason
        if (cleanLine.includes(' - ')) {
          [item, reason] = cleanLine.split(' - ', 2)
        } else {
          item = cleanLine
          reason = tSeasonal.subtitle
        }
        return {
          item: item.trim(),
          reason: reason.trim(),
          type: 'seasonal'
        }
      })

      console.log(`📥 Recibidas ${seasonal.length} recomendaciones de temporada`)
      setSeasonalRecommendations(seasonal)
      setSeasonalLoading(false)
    } catch (error) {
      console.error('❌ Error generando recomendaciones de temporada:', error)
      setSeasonalRecommendations([])
      setSeasonalLoading(false)
    }
  }

  const loadDietRecommendations = async (showLoading = true) => {
    try {
      // Verificar suscripción ANTES de mostrar cualquier loader
      if (isSubscribed === false) {
        console.log('🚫 No suscrito - no cargando recomendaciones de dieta')
        setDietRecommendations([])
        setDietLoading(false)
        setDietRefreshing(false)
        return
      }

      if (showLoading) {
        setDietLoading(true)
      } else {
        setDietRefreshing(true)
      }

      console.log("🤖 Generando 12 recomendaciones de dieta con IA")
      const date = new Date()
      const randomSeed = Math.random()
      const timestamp = Date.now()
      const dateStr = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

      let prompt = tDiet.dietExpertIntro + " "
      prompt += tDiet.generateDietProducts.replace('{limit}', 12).replace('{date}', dateStr) + " "
      prompt += tDiet.considerFactors + " "
      prompt += tDiet.nutritionalBalance + " "
      prompt += tDiet.healthyOptions + " "
      prompt += tDiet.varietyOfProducts + " "
      prompt += tDiet.portionSizes + " "
      prompt += "IMPORTANT: Always include nutritional information per 100 grams. This is mandatory for every product. "
      prompt += tDiet.responseFormat + " "
      prompt += tDiet.exampleFormat

      console.log("📤 Enviando petición a GPT-4.1...")
      const response = await axios.post(API_KEY_ANALIZE, {
        model: "gpt-4.1",
        messages: [
          {
            role: "system",
            content: "You are a creative nutritionist. Always generate COMPLETELY DIFFERENT food products in each request. Never repeat the same products. Use variety from all cuisines, preparations, and food categories."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 1.2
      })
      console.log("📥 Respuesta recibida de GPT-4.1")

      const aiResponse = response.data.choices[0].message.content.trim()
      const lines = aiResponse.split('\n').filter(line => line.trim().length > 0)

      const diet = lines.slice(0, 12).map(line => {
        const cleanLine = line.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim()
        let item, reason
        if (cleanLine.includes(' - ')) {
          [item, reason] = cleanLine.split(' - ', 2)
        } else {
          item = cleanLine
          reason = tDiet.subtitle
        }
        return {
          item: item.trim(),
          reason: reason.trim(),
          type: 'diet'
        }
      })

      console.log(`📥 Recibidas ${diet.length} recomendaciones de dieta`)
      console.log("🍎 Productos de dieta generados:", diet.map(d => d.item).join(', '))

      // Limpiar primero y luego establecer nuevos productos
      setDietRecommendations([])
      setTimeout(() => {
        setDietRecommendations(diet)
        setDietRefreshKey(prev => prev + 1)
        console.log("✅ Estado dietRecommendations actualizado con", diet.length, "productos")
      }, 10)
      if (showLoading) {
        setDietLoading(false)
      } else {
        setDietRefreshing(false)
      }
    } catch (error) {
      console.error('❌ Error generando recomendaciones de dieta:', error)
      setDietRecommendations([])
      if (showLoading) {
        setDietLoading(false)
      } else {
        setDietRefreshing(false)
      }
    }
  }

  const loadStats = async () => {
    try {
      const statsData = await RecommendationService.getRecommendationStats()
      setStats(statsData)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const loadHistoryLists = async () => {
    try {
      const historyData = await AsyncStorage.getItem("@shopping_history")
      if (historyData) {
        const history = JSON.parse(historyData)
        // Mostrar las más recientes primero (reverse del almacenamiento)
        setHistoryLists(history.reverse())
      }

      // Verificar si hay una lista actual en progreso
      const currentListData = await AsyncStorage.getItem("@shopping_list")
      const currentList = currentListData ? JSON.parse(currentListData) : []
      setHasCurrentList(currentList.length > 0)
    } catch (error) {
      console.error('Error loading history lists:', error)
    }
  }

  const handleAddToList = (recommendation) => {
    console.log("=== HANDLE ADD TO LIST ===")
    console.log("Selected recommendation:", recommendation)
    triggerHaptic()

    // Si es una recomendación personalizada para una lista específica, agregar directamente
    if (recommendation.type === 'personalized' && recommendation.forList) {
      handleAddToSpecificHistoryList(recommendation)
    } else {
      // Para otros tipos, mostrar modal
      setSelectedRecommendation(recommendation)
      loadHistoryLists()
      setShowListModal(true)
    }
  }

  const handleAddToSpecificHistoryList = async (recommendation) => {
    try {
      console.log(`Adding ${recommendation.item} directly to list: ${recommendation.forList}`)

      // Agregar a la lista actual por ahora (más tarde podemos agregar a lista específica del historial)
      const currentListData = await AsyncStorage.getItem("@shopping_list")
      const currentList = currentListData ? JSON.parse(currentListData) : []

      if (!currentList.includes(recommendation.item)) {
        currentList.push(recommendation.item)
        await AsyncStorage.setItem("@shopping_list", JSON.stringify(currentList))
      }

      // IMPORTANTE: Marcar este producto como agregado a esta lista específica
      await RecommendationService.markAsAddedToList(recommendation.forList, recommendation.item)

      // Marcar como agregado y remover
      setAddedItems(prev => new Set([...prev, recommendation.item]))

      setRecommendations(prevRecs => {
        const filteredRecs = prevRecs.filter(rec => rec.item !== recommendation.item)
        return filteredRecs
      })

      Alert.alert('✅', `${recommendation.item} agregado para "${recommendation.forList}"`)
    } catch (error) {
      console.error('Error adding to specific list:', error)
    }
  }

  const handleAddToSpecificList = async (listIndex) => {
    try {
      console.log("=== HANDLE ADD TO SPECIFIC LIST ===")
      console.log("List index:", listIndex)
      console.log("Selected recommendation:", selectedRecommendation)

      if (!selectedRecommendation) return

      // Cargar el historial
      const historyData = await AsyncStorage.getItem("@shopping_history")
      if (!historyData) {
        console.log("⚠️ No hay historial disponible")
        return
      }

      const history = JSON.parse(historyData)
      console.log("📚 Historial completo:", history.length, "listas")

      // La lista está en orden reverso en historyLists, así que necesitamos el índice correcto
      const actualIndex = history.length - 1 - listIndex

      if (!history[actualIndex]) {
        console.log("⚠️ Lista no encontrada en índice:", actualIndex)
        return
      }

      const selectedList = history[actualIndex]
      console.log("📋 Lista seleccionada:", selectedList.name, "con", selectedList.list.length, "productos")

      // Verificar si el item ya existe en esta lista
      if (!selectedList.list.includes(selectedRecommendation.item)) {
        selectedList.list.push(selectedRecommendation.item)

        // Guardar el historial actualizado
        await AsyncStorage.setItem("@shopping_history", JSON.stringify(history))
        console.log("✅ Item agregado a la lista del historial:", selectedList.name)
        console.log("✅ Lista actualizada con", selectedList.list.length, "productos")

        // Verificar que se guardó correctamente
        const verify = await AsyncStorage.getItem("@shopping_history")
        const verifyHistory = JSON.parse(verify)
        console.log("🔍 Verificación - Lista en historial:", verifyHistory[actualIndex].list.length, "productos")
      } else {
        console.log("⚠️ Item ya existe en esta lista del historial")
      }

      // Marcar como agregado
      setAddedItems(prev => new Set([...prev, selectedRecommendation.item]))

      // Cerrar modal
      setShowListModal(false)
      setSelectedRecommendation(null)

      console.log("STAYING IN RECOMMENDATIONS SCREEN - NO NAVIGATION")

      // INMEDIATAMENTE remover el producto agregado del tab activo
      if (activeTab === 'history') {
        setRecommendations(prevRecs => {
          const filteredRecs = prevRecs.filter(rec => rec.item !== selectedRecommendation.item)
          return filteredRecs
        })
      } else if (activeTab === 'seasonal') {
        setSeasonalRecommendations(prevRecs => {
          const filteredRecs = prevRecs.filter(rec => rec.item !== selectedRecommendation.item)
          return filteredRecs
        })
      } else if (activeTab === 'diet') {
        setDietRecommendations(prevRecs => {
          const filteredRecs = prevRecs.filter(rec => rec.item !== selectedRecommendation.item)
          return filteredRecs
        })
      }
    } catch (error) {
      console.error('Error adding to list:', error)
      Alert.alert(t.error || fallback.error, t.couldNotAddProduct || fallback.couldNotAddProduct)
    }
  }

  const handleAddToCurrentList = async () => {
    try {
      if (!selectedRecommendation) return

      // Agregar a la lista actual (en progreso)
      const currentListData = await AsyncStorage.getItem("@shopping_list")
      const currentList = currentListData ? JSON.parse(currentListData) : []

      currentList.push(selectedRecommendation.item)
      await AsyncStorage.setItem("@shopping_list", JSON.stringify(currentList))

      // Marcar como agregado
      setAddedItems(prev => new Set([...prev, selectedRecommendation.item]))

      // Cerrar modal
      setShowListModal(false)
      setSelectedRecommendation(null)

      // INMEDIATAMENTE remover el producto agregado
      setRecommendations(prevRecs => {
        const filteredRecs = prevRecs.filter(rec => rec.item !== selectedRecommendation.item)
        return filteredRecs
      })

      Alert.alert('✅', `${selectedRecommendation.item} agregado a la lista actual`)
    } catch (error) {
      console.error('Error adding to current list:', error)
      Alert.alert(t.error || fallback.error, t.couldNotAddProduct || fallback.couldNotAddProduct)
    }
  }

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start()
  }

  // Función eliminada - sin tabs

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 50

    // Si está cerca del final y puede cargar más, cargar automáticamente
    if (isCloseToBottom && canLoadMore && !isLoadingMore && displayedCount < 24) {
      console.log(`🔄 Auto-cargando más productos... Mostrados: ${displayedCount}/24`)
      loadMoreRecommendations()
    }
  }

  // Estilos
  const styles = {
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 15,
    },
    titleContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    title: {
      fontSize: isSmallIPhone ? 24 : 28,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginRight: 12,
    },
    infoButton: {
      padding: 4,
      borderRadius: 20,
      backgroundColor: theme.backgroundtres + '10',
    },
    subtitle: {
      fontSize: isSmallIPhone ? 12 : 14,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop:  20,

    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: theme.backgroundtres + '10',
      borderRadius: 15,
      paddingVertical: 12,
      paddingHorizontal: 25,
      marginHorizontal: 10,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: theme.backgroundtres + '20',
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    statIcon: {
      marginBottom: 8,
    },
    statNumber: {
      fontSize: isSmallIPhone ? 18 : 20,
      fontWeight: 'bold',
      color: '#4a6bff',
      marginBottom: 4,
    },
    statLabel: {
      fontSize: isSmallIPhone ? 11 : 12,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    loadingText: {
      marginTop: 15,
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    noHistoryContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
      paddingVertical: 60,
    },
    noHistoryIcon: {
      marginBottom: 24,
      opacity: 0.7,
    },
    noHistoryTitle: {
      fontSize: isSmallIPhone ? 20 : 24,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 16,
      marginTop: -26,
    },
    noHistoryMessage: {
      fontSize: isSmallIPhone ? 14 : 16,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 32,
    },
    createListButton: {
      backgroundColor: '#4a6bff',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
      shadowColor: '#4a6bff',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    createListButtonIcon: {
      marginRight: 8,
    },
    createListButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    // Estilos para modal cuando no hay listas
    noListsModalContainer: {
      alignItems: 'center',
      paddingVertical: 30,
      paddingHorizontal: 20,
    },
    noListsModalIcon: {
      marginBottom: 16,
      opacity: 0.7,
    },
    noListsModalTitle: {
      fontSize: isSmallIPhone ? 18 : 20,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 12,
    },
    noListsModalMessage: {
      fontSize: isSmallIPhone ? 14 : 15,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 24,
    },
    goCreateListButton: {
      backgroundColor: '#4a6bff',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 10,
      shadowColor: '#4a6bff',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    goCreateListButtonIcon: {
      marginRight: 6,
    },
    goCreateListButtonText: {
      color: 'white',
      fontSize: 15,
      fontWeight: '600',
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    recommendationsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 15,
    },
    recommendationCard: {
      backgroundColor: theme.background,
      borderRadius: 20,
      padding: 20,
      width: '47%',
      borderWidth: 1,
      borderColor: theme.backgroundtres + '20',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
      alignItems: 'center',
      minHeight: isSmallIPhone ? 140 : 160,
    },
    recommendationCardAdded: {
      backgroundColor: '#10b98115',
      borderColor: '#10b98140',
    },
    cardIcon: {
      fontSize: isSmallIPhone ? 32 : 40,
      marginBottom: 12,
    },
    cardTitle: {
      fontSize: isSmallIPhone ? 15 : 17,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 8,
      lineHeight: 20,
    },
    cardTitleAdded: {
      color: '#10b981',
    },
    cardReason: {
      fontSize: isSmallIPhone ? 11 : 12,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 15,
      lineHeight: 16,
      opacity: 0.8,
    },
    cardButton: {
      backgroundColor: 'rgba(74, 107, 255, 0.8)',
      borderRadius: 20,
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#4a6bff',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    cardButtonAdded: {
      backgroundColor: 'rgba(16, 185, 129, 0.9)',
      shadowColor: '#10b981',
    },
    cardButtonText: {
      color: 'white',
      fontSize: isSmallIPhone ? 12 : 13,
      fontWeight: '600',
    },
    reloadButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#4a6bff15',
      borderRadius: 15,
      paddingVertical: 12,
      paddingHorizontal: 20,
      marginTop: 20,
      borderWidth: 1,
      borderColor: '#4a6bff30',
      marginBottom: 40,
    },
    reloadButtonText: {
      color: '#4a6bff',
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 8,
    },
    loadingMoreContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 20,
      marginTop: 10,
      marginBottom: 30,
    },
    loadingMoreText: {
      color: theme.textSecondary,
      fontSize: 14,
      marginLeft: 10,
    },
    subscriptionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffd70015',
      borderRadius: 15,
      paddingVertical: 12,
      paddingHorizontal: 20,
      marginTop: 15,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#ffd70030',
    },
    subscriptionButtonText: {
      color: '#ffd700',
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 8,
    },

    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    modalContent: {
      backgroundColor: theme.background,
      borderRadius: 20,
      paddingVertical: 20,
      paddingHorizontal: 20,
      width: '100%',
      maxWidth: 400,
      maxHeight: '80%',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 20,
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 15,
      backgroundColor: theme.backgroundtres + '10',
      borderRadius: 12,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.backgroundtres + '20',
    },
    listIcon: {
      marginRight: 12,
    },
    listInfo: {
      flex: 1,
    },
    listName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    listItemCount: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    currentListButton: {
      backgroundColor: '#4a6bff',
      borderRadius: 12,
      paddingVertical: 15,
      alignItems: 'center',
      marginBottom: 15,
    },
    currentListButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    closeModalButton: {
      backgroundColor: theme.backgroundtres + '20',
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: 'center',
      marginTop: 10,
    },
    closeModalButtonText: {
      color: theme.text,
      fontSize: 14,
      fontWeight: '600',
    },
    // Estilos para navegación de tabs
    tabsContainer: {
      flexDirection: 'row',
      backgroundColor: theme.backgroundtres + '10',
      marginHorizontal: 10,
      marginTop: 8,
      marginBottom: 2,
      borderRadius: 10,
      padding: 1,
      borderWidth: 1,
      borderColor: theme.backgroundtres + '20',
      marginTop: isSmallIPhone ? -20 : -30,
    },
    tab: {
      flex: 1,
      paddingVertical: 2,
      paddingHorizontal: 12,
      borderRadius: 7,
      alignItems: 'center',
      justifyContent: 'center',
    },
    activeTab: {

      elevation: 3,
    },
    tabText: {
      fontSize: isSmallIPhone ? 12 : 12,
      fontWeight: '600',
      color: '#4a6bff', 
    },
    activeTabText: {
      color:  '#4a6bff', 
      fontSize: isSmallIPhone ? 16 : 16,
    },
    tabIcon: {
      marginRight: 4,
    },
    tabSubtitle: {
      fontSize: 12,
      color:  '#4a6bff', 
      textAlign: 'center',
      marginTop: 1,
      opacity: 0.7,
    },
    activeTabSubtitle: {
      color: 'white',
      opacity: 0.9,
    },
    // Estilos para mensaje sin historial en recomendaciones
    noHistoryRecommendationContainer: {
      width: '100%',
      alignItems: 'center',
      paddingVertical: 40,
      paddingHorizontal: 20,
      backgroundColor: theme.background,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.backgroundtres + '20',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    noHistoryRecommendationIcon: {
      marginBottom: 16,
      opacity: 0.7,
    },
    noHistoryRecommendationTitle: {
      fontSize: isSmallIPhone ? 18 : 20,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 12,
    },
    noHistoryRecommendationMessage: {
      fontSize: isSmallIPhone ? 14 : 15,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 24,
    },
    createFirstListButton: {
      backgroundColor: '#4a6bff',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 12,
      shadowColor: '#4a6bff',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    createFirstListButtonIcon: {
      marginRight: 8,
    },
    createFirstListButtonText: {
      color: 'white',
      fontSize: 15,
      fontWeight: '600',
    },
    // Estilos mejorados para pestañas de navegación
    tabsNavigationContainer: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      marginTop: -45,
    },
    tabsWrapper: {
      flexDirection: 'row',
      backgroundColor: theme.background,
      borderRadius: 20,
      padding: 6,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme.backgroundtres + '15',
    },
    tabButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 8,
      borderRadius: 16,
      backgroundColor: 'transparent',
      marginHorizontal: 2,
    },
    tabButtonActive: {
      backgroundColor: '#4a6bff',
      shadowColor: '#4a6bff',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    tabIcon: {
      marginRight: 6,
    },
    tabLabel: {
      fontSize: isSmallIPhone ? 11 : 12,
      fontWeight: '600',
      color: theme.text,
      textAlign: 'center',
    },
    tabLabelActive: {
      color: 'white',
    },
    // Estilos para banner dinámico
    dynamicBannerContainer: {
      backgroundColor: theme.backgroundtres + '08',
      marginHorizontal: 16,
      marginTop: 8,
      marginBottom: 16,
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderWidth: 1,
      borderColor: theme.backgroundtres + '15',
    },
    dynamicBannerTitle: {
      fontSize: isSmallIPhone ? 16 : 18,
      fontWeight: '700',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 6,
    },
    dynamicBannerSubtitle: {
      fontSize: isSmallIPhone ? 13 : 14,
      fontWeight: '500',
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      opacity: 0.9,
    },
    refreshButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 10,
    },
    refreshButtonText: {
      color: '#4a6bff',
      fontSize: isSmallIPhone ? 12 : 13,
      fontWeight: '700',
    },
    // Estilos para modal informativo modo 7
    infoModalContent: {
      backgroundColor: theme.background,
      borderRadius: 20,
      paddingVertical: 30,
      paddingHorizontal: 25,
      width: '100%',
      maxWidth: 400,
      maxHeight: '80%',
    },
    infoModalHeader: {
      alignItems: 'center',
      marginBottom: 25,
    },
    infoModalIcon: {
      marginBottom: 15,
    },
    infoModalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    infoModalSubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    infoFeatureItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 20,
      paddingHorizontal: 10,
    },
    infoFeatureIcon: {
      marginRight: 15,
      marginTop: 2,
    },
    infoFeatureContent: {
      flex: 1,
    },
    infoFeatureTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    infoFeatureDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
    },
    infoModalCloseButton: {
      backgroundColor: '#4a6bff',
      borderRadius: 12,
      paddingVertical: 15,
      alignItems: 'center',
      marginTop: 20,
    },
    infoModalCloseButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    // Estilos para componente de suscripción requerida
    subscriptionRequiredContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 40,
      paddingVertical: 60,
      backgroundColor: theme.background,
      borderRadius: 20,
      marginHorizontal: 16,
      marginTop: 20,
      borderWidth: 1,
      borderColor: theme.backgroundtres + '20',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    subscriptionIcon: {
      marginBottom: 24,
      opacity: 0.8,
    },
    subscriptionTitle: {
      fontSize: isSmallIPhone ? 20 : 24,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 16,
    },
    subscriptionMessage: {
      fontSize: isSmallIPhone ? 15 : 16,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 24,
    },
    subscriptionBenefits: {
      fontSize: isSmallIPhone ? 14 : 15,
      color: theme.text,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 32,
      backgroundColor: theme.backgroundtres + '10',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.backgroundtres + '20',
    },
    subscriptionButton: {
      backgroundColor: '#4a6bff',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
      shadowColor: '#4a6bff',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    subscriptionButtonIcon: {
      marginRight: 8,
    },
    subscriptionButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
  }

  // Render
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >



        </Animated.View>


        {/* Navegación de pestañas mejorada */}
        <View style={styles.tabsNavigationContainer}>
          <View style={styles.tabsWrapper}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'history' && styles.tabButtonActive]}
              onPress={() => {
                triggerHaptic()
                setActiveTab('history')
              }}
            >
              <Ionicons
                name="time-outline"
                size={16}
                color={activeTab === 'history' ? "white" : "#4a6bff"}
                style={styles.tabIcon}
              />
              <Text style={[styles.tabLabel, activeTab === 'history' && styles.tabLabelActive]}>
                {t.historyTab || 'Historial'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'seasonal' && styles.tabButtonActive]}
              onPress={() => {
                triggerHaptic()
                setActiveTab('seasonal')
              }}
            >
              <Ionicons
                name="leaf-outline"
                size={16}
                color={activeTab === 'seasonal' ? "white" : "#10b981"}
                style={styles.tabIcon}
              />
              <Text style={[styles.tabLabel, activeTab === 'seasonal' && styles.tabLabelActive]}>
                {t.seasonalTab || 'Temporada'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'diet' && styles.tabButtonActive]}
              onPress={() => {
                triggerHaptic()
                setActiveTab('diet')
              }}
            >
              <Ionicons
                name="nutrition-outline"
                size={16}
                color={activeTab === 'diet' ? "white" : "#f59e0b"}
                style={styles.tabIcon}
              />
              <Text style={[styles.tabLabel, activeTab === 'diet' && styles.tabLabelActive]}>
                {tDiet.tabLabel || 'Nutrición'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >

        {/* Banner dinámico con descripción de la pestaña activa */}
        <View style={styles.dynamicBannerContainer}>
          <Text style={styles.dynamicBannerTitle}>
            {activeTab === 'history' && (t.historyBannerTitle || '🕒 Personal Recommendations')}
            {activeTab === 'seasonal' && (tSeasonal.seasonalBannerTitle || '🍃 Seasonal Products')}
            {activeTab === 'diet' && (tDiet.dietBannerTitle || '🥗 Balanced Nutrition')}
          </Text>
          <Text style={styles.dynamicBannerSubtitle}>
            {activeTab === 'history' && (t.historyBannerDesc || 'Based on your previous shopping patterns')}
            {activeTab === 'seasonal' && (tSeasonal.seasonalBannerDesc || 'Fresh products ideal for this season')}
            {activeTab === 'diet' && (tDiet.dietBannerDesc || 'Healthy foods with nutritional information')}
          </Text>
        </View>

        {/* Estadísticas - solo mostrar en historial */}
        {stats && activeTab === 'history' && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.totalAnalyzedLists || 0}</Text>
              <Text style={styles.statLabel}>{t.analyzedLists}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.uniqueProducts || 0}</Text>
              <Text style={styles.statLabel}>{t.uniqueProducts}</Text>
            </View>
          </View>
        )}

        {/* Banner de temporada - ubicación y fecha */}
        {activeTab === 'seasonal' && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="location-outline" size={24} color="#4a6bff" style={styles.statIcon} />
              <Text style={styles.statLabel}>{seasonalCountry || tSeasonal.currentLocation || 'Ubicación'}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="calendar-outline" size={24} color="#4a6bff" style={styles.statIcon} />
              <Text style={styles.statLabel}>
                {tSeasonal.monthNames[new Date().getMonth() + 1]} {new Date().getFullYear()}
              </Text>
            </View>
          </View>
        )}

        {/* Banner de nutrición */}
        {activeTab === 'diet' && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="nutrition-outline" size={24} color="#4a6bff" style={styles.statIcon} />
              <Text style={styles.statLabel}>{tDiet.title || 'Nutrición'}</Text>
            </View>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={() => {
                console.log("🔄 BOTÓN REFRESCAR PRESIONADO - Cargando nuevos productos de dieta")
                triggerHaptic()
                loadDietRecommendations(false)
              }}
              disabled={dietRefreshing}
            >
              {dietRefreshing ? (
                <ActivityIndicator size="small" color="#4a6bff" style={{ marginRight: 6 }} />
              ) : (
                <Ionicons name="refresh-outline" size={20} color="#4a6bff" style={{ marginRight: 6 }} />
              )}
              <Text style={styles.refreshButtonText}>
                {tDiet.refreshList || 'Refrescar lista'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {(activeTab === 'history' && loading) || (activeTab === 'seasonal' && seasonalLoading) || (activeTab === 'diet' && dietLoading) ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4a6bff" />
            <Text style={styles.loadingText}>
              {activeTab === 'history' ? t.loading : activeTab === 'seasonal' ? tSeasonal.loading : tDiet.loading}
            </Text>
          </View>
        ) : activeTab === 'history' && isSubscribed === false ? (
          // Mostrar componente de suscripción para historial si no está suscrito
          <View style={styles.subscriptionRequiredContainer}>
            <Ionicons name="lock-closed" size={64} color="#4a6bff" style={styles.subscriptionIcon} />
            <Text style={styles.subscriptionTitle}>{t.subscriptionRequiredTitle}</Text>
            <Text style={styles.subscriptionMessage}>{t.subscriptionRequiredMessage}</Text>
            <Text style={styles.subscriptionBenefits}>{t.subscriptionBenefits}</Text>
            <TouchableOpacity
              style={styles.subscriptionButton}
              onPress={handleSubscribePress}
            >
              <Ionicons name="star" size={20} color="white" style={styles.subscriptionButtonIcon} />
              <Text style={styles.subscriptionButtonText}>{t.subscribeButton}</Text>
            </TouchableOpacity>
          </View>
        ) : activeTab === 'history' && (recommendations.length === 0 || !hasHistory) ? (
          <View style={styles.noHistoryContainer}>
            {!hasHistory ? (
              // No hay historial - mostrar mensaje específico
              <>
                <Text style={styles.noHistoryTitle}>{t.noHistoryTitle}</Text>
                <Text style={styles.noHistoryMessage}>{t.noHistoryMessage}</Text>
                <TouchableOpacity
                  style={styles.createListButton}
                  onPress={() => {
                    if (onNavigateToHome) {
                      onNavigateToHome()
                    } else {
                      console.warn("No navigation function provided")
                    }
                  }}
                >
                  <Ionicons name="add-circle" size={20} color="white" style={styles.createListButtonIcon} />
                  <Text style={styles.createListButtonText}>{t.createFirstList}</Text>
                </TouchableOpacity>
              </>
            ) : (
              // Hay historial pero no recomendaciones
              <>
                <Ionicons name="bulb-outline" size={64} color="#6b7280" style={styles.noHistoryIcon} />
                <Text style={styles.noHistoryTitle}>{t.noRecommendations}</Text>
                <Text style={styles.noHistoryMessage}>{t.noRecommendationsWithHistory}</Text>
              </>
            )}
          </View>
        ) : (activeTab === 'seasonal' || activeTab === 'diet') && isSubscribed === false ? (
          // Mostrar componente de suscripción para pestañas premium si no está suscrito
          <View style={styles.subscriptionRequiredContainer}>
            <Ionicons name="lock-closed" size={64} color="#4a6bff" style={styles.subscriptionIcon} />
            <Text style={styles.subscriptionTitle}>{t.subscriptionRequiredTitle}</Text>
            <Text style={styles.subscriptionMessage}>{t.subscriptionRequiredMessage}</Text>
            <Text style={styles.subscriptionBenefits}>{t.subscriptionBenefits}</Text>
            <TouchableOpacity
              style={styles.subscriptionButton}
              onPress={handleSubscribePress}
            >
              <Ionicons name="star" size={20} color="white" style={styles.subscriptionButtonIcon} />
              <Text style={styles.subscriptionButtonText}>{t.subscribeButton}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Animated.View
            style={[
              styles.recommendationsGrid,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {(() => {
              const productsToShow = activeTab === 'history' ? recommendations : activeTab === 'seasonal' ? seasonalRecommendations : dietRecommendations
              if (activeTab === 'diet') {
                console.log("🖼️ RENDERIZANDO productos de dieta en pantalla:", productsToShow.map(p => p.item).join(', '))
              }
              return productsToShow
            })().map((rec, index) => {
              const isAdded = addedItems.has(rec.item)

              // Caso especial: Sin historial disponible
              if (rec.type === 'no_history') {
                return (
                  <View key={`no-history-${index}`} style={styles.noHistoryRecommendationContainer}>
                    <Ionicons name="list-outline" size={48} color="#6b7280" style={styles.noHistoryRecommendationIcon} />
                    <Text style={styles.noHistoryRecommendationTitle}>
                      {rec.item}
                    </Text>
                    <Text style={styles.noHistoryRecommendationMessage}>
                      {rec.reason}
                    </Text>
                    <TouchableOpacity
                      style={styles.createFirstListButton}
                      onPress={() => {
                        if (onNavigateToHome) {
                          onNavigateToHome()
                        } else {
                          // Fallback si no hay función de navegación
                          console.warn("No navigation function provided")
                        }
                      }}
                    >
                      <Ionicons name="add-circle" size={20} color="white" style={styles.createFirstListButtonIcon} />
                      <Text style={styles.createFirstListButtonText}>{t.createFirstList}</Text>
                    </TouchableOpacity>
                  </View>
                )
              }

              return (
                <TouchableOpacity
                  key={activeTab === 'diet' ? `${rec.item}-${index}-${dietRefreshKey}` : `${rec.item}-${index}`}
                  style={[
                    styles.recommendationCard,
                    isAdded && styles.recommendationCardAdded
                  ]}
                  onPress={() => !isAdded && handleAddToList(rec)}
                  disabled={isAdded}
                >

                  <Text style={[
                    styles.cardTitle,
                    isAdded && styles.cardTitleAdded
                  ]}>
                    {rec.item}
                  </Text>

                  <Text style={styles.cardReason}>
                    {rec.reason}
                  </Text>

                  <TouchableOpacity
                    style={[
                      styles.cardButton,
                      isAdded && styles.cardButtonAdded
                    ]}
                    onPress={() => !isAdded && handleAddToList(rec)}
                    disabled={isAdded}
                  >
                    <Ionicons
                      name={isAdded ? "checkmark" : "add"}
                      size={18}
                      color="white"
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              )
            })}
          </Animated.View>
        )}
   

        {/* Auto-load UI: Loader */}
        {isLoadingMore && (
          <View style={styles.loadingMoreContainer}>
            <ActivityIndicator size="small" color="#4a6bff" />
            <Text style={styles.loadingMoreText}>{t.loadingMore || fallback.loadingMore}</Text>
          </View>
        )}

  
      </ScrollView>

      {/* Modal para seleccionar lista */}
      <Modal
        visible={showListModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowListModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.selectList}</Text>



            {/* Lista de listas guardadas */}
            <ScrollView style={{ maxHeight: '60%' }}>
              {historyLists.length === 0 ? (
                <View style={styles.noListsModalContainer}>
                  <Ionicons name="alert-circle-outline" size={48} color="#6b7280" style={styles.noListsModalIcon} />
                  <Text style={styles.noListsModalTitle}>
                    {t.noListsModalTitle}
                  </Text>
                  <Text style={styles.noListsModalMessage}>
                    {t.noListsModalMessage}
                  </Text>
       
                </View>
              ) : (
                historyLists.map((list, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.listItem}
                    onPress={() => handleAddToSpecificList(index)}
                  >
                    <Ionicons
                      name="list"
                      size={20}
                      color="#4a6bff"
                      style={styles.listIcon}
                    />
                    <View style={styles.listInfo}>
                      <Text style={styles.listName}>{list.name}</Text>
                      <Text style={styles.listItemCount}>
                        {list.list.length} {t.products}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>

            {/* Cerrar modal */}
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowListModal(false)}
            >
              <Text style={styles.closeModalButtonText}>{t.cancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal informativo modo 7 */}
      <Modal
        visible={showInfoModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.infoModalContent}>
            <View style={styles.infoModalHeader}>
              <Ionicons
                name="bulb"
                size={48}
                color="#4a6bff"
                style={styles.infoModalIcon}
              />
              <Text style={styles.infoModalTitle}>
                {t.infoModalTitle || '¡Recomendaciones Inteligentes!'}
              </Text>
              <Text style={styles.infoModalSubtitle}>
                {t.infoModalSubtitle || 'Descubre las nuevas funciones de esta pantalla'}
              </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.infoFeatureItem}>
                <Ionicons
                  name="time-outline"
                  size={24}
                  color="#4a6bff"
                  style={styles.infoFeatureIcon}
                />
                <View style={styles.infoFeatureContent}>
                  <Text style={styles.infoFeatureTitle}>
                    {t.historyFeatureTitle || 'Basado en tu historial'}
                  </Text>
                  <Text style={styles.infoFeatureDescription}>
                    {t.historyFeatureDescription || 'Analizamos tus compras anteriores para sugerir productos que realmente necesitas.'}
                  </Text>
                </View>
              </View>

              <View style={styles.infoFeatureItem}>
                <Ionicons
                  name="leaf-outline"
                  size={24}
                  color="#10b981"
                  style={styles.infoFeatureIcon}
                />
                <View style={styles.infoFeatureContent}>
                  <Text style={styles.infoFeatureTitle}>
                    {tSeasonal.featureTitle || 'Productos de temporada'}
                  </Text>
                  <Text style={styles.infoFeatureDescription}>
                    {tSeasonal.featureDescription || 'Productos frescos y de temporada según tu ubicación y la época del año.'}
                  </Text>
                </View>
              </View>

              <View style={styles.infoFeatureItem}>
                <Ionicons
                  name="nutrition-outline"
                  size={24}
                  color="#f59e0b"
                  style={styles.infoFeatureIcon}
                />
                <View style={styles.infoFeatureContent}>
                  <Text style={styles.infoFeatureTitle}>
                    {tDiet.featureTitle || 'Nutrición balanceada'}
                  </Text>
                  <Text style={styles.infoFeatureDescription}>
                    {tDiet.featureDescription || 'Sugerencias saludables y nutritivas para una dieta equilibrada.'}
                  </Text>
                </View>
              </View>

              <View style={styles.infoFeatureItem}>
                <Ionicons
                  name="sync-outline"
                  size={24}
                  color="#8b5cf6"
                  style={styles.infoFeatureIcon}
                />
                <View style={styles.infoFeatureContent}>
                  <Text style={styles.infoFeatureTitle}>
                    {t.syncFeatureTitle || 'Sincronización automática'}
                  </Text>
                  <Text style={styles.infoFeatureDescription}>
                    {t.syncFeatureDescription || 'Agrega productos directamente a tus listas existentes o crea nuevas listas.'}
                  </Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.infoModalCloseButton}
              onPress={async () => {
                setShowInfoModal(false)
                // Marcar que ya se mostró el modal
                try {
                  await AsyncStorage.setItem("@recommendations_modal_shown", "true")
                } catch (error) {
                  console.error('Error saving modal shown flag:', error)
                }
              }}
            >
              <Text style={styles.infoModalCloseButtonText}>
                {t.gotIt || '¡Entendido!'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default RecommendationsScreen