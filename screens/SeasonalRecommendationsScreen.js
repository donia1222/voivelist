import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  Alert,
  Animated,
  ActivityIndicator,
  Platform,
  Dimensions
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTheme } from '../ThemeContext'
import { useHaptic } from '../HapticContext'
import * as RNLocalize from 'react-native-localize'
import axios from 'axios'
import seasonalRecommendationsTranslations from './translations/seasonalRecommendationsTranslations'

const { width: screenWidth } = Dimensions.get('window')
const isSmallIPhone = Platform.OS === 'ios' && screenWidth <= 375

const API_KEY_ANALIZE = process.env.API_KEY_ANALIZE

const SeasonalRecommendationsScreen = ({ navigation }) => {
  const { theme } = useTheme()
  const { triggerHaptic } = useHaptic()

  // Estados principales
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [addedItems, setAddedItems] = useState(new Set())
  const [showListModal, setShowListModal] = useState(false)
  const [selectedRecommendation, setSelectedRecommendation] = useState(null)
  const [historyLists, setHistoryLists] = useState([])
  const [hasCurrentList, setHasCurrentList] = useState(false)

  // Estados de ubicación y fecha
  const [country, setCountry] = useState('')
  const [currentDate, setCurrentDate] = useState(new Date())

  // Estados para paginación
  const [displayedCount, setDisplayedCount] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [canLoadMore, setCanLoadMore] = useState(true)

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current
  const scrollViewRef = useRef(null)

  // Traducciones
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  const t = seasonalRecommendationsTranslations[deviceLanguage] || seasonalRecommendationsTranslations.en
  const fallback = seasonalRecommendationsTranslations.en

  // Efectos
  useEffect(() => {
    checkAndClearCacheOnNewSession()
    initializeScreen()
    startAnimations()
  }, [])

  // Detectar nueva sesión y limpiar cache
  const checkAndClearCacheOnNewSession = async () => {
    try {
      const lastSession = await AsyncStorage.getItem('@last_seasonal_session')
      const now = new Date().getTime()

      // Si es la primera vez o pasaron más de 5 minutos desde la última sesión
      if (!lastSession || (now - parseInt(lastSession)) > 5 * 60 * 1000) {
        console.log('🆕 Nueva sesión detectada, limpiando cache estacional')
        await AsyncStorage.removeItem('@seasonal_recommendations_60')
      }

      // Actualizar timestamp de esta sesión
      await AsyncStorage.setItem('@last_seasonal_session', now.toString())
    } catch (error) {
      console.error('Error checking seasonal session:', error)
    }
  }

  const initializeScreen = async () => {
    await loadCountryAndGenerateRecommendations()
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

  const loadCountryAndGenerateRecommendations = async () => {
    try {
      setLoading(true)

      // Cargar país desde AsyncStorage (igual que en HomeScreen)
      let savedCountry = await AsyncStorage.getItem("@country")

      // Si no hay ciudad guardada, detectar país del dispositivo
      if (!savedCountry || savedCountry.trim() === '') {
        console.log("⚠️ No hay ciudad guardada, detectando país del dispositivo")
        const countryCode = RNLocalize.getCountry() // Devuelve código: "ES", "MX", "US", etc.

        // Mapear códigos de país a nombres en español
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
        console.log(`🌍 País detectado: ${countryCode} → ${savedCountry}`)
      }

      setCountry(savedCountry)
      console.log("📍 Ciudad para recomendaciones:", savedCountry)

      // Obtener fecha actual
      const now = new Date()
      setCurrentDate(now)

      // Verificar si ya tenemos recomendaciones en cache para esta ubicación
      const cachedData = await AsyncStorage.getItem('@seasonal_recommendations_60')

      if (cachedData) {
        const cached = JSON.parse(cachedData)
        console.log("📦 Usando 60 recomendaciones del cache (misma sesión)")
        setRecommendations(cached.slice(0, 6))
        setDisplayedCount(6)
      } else {
        // Generar 60 recomendaciones con IA
        console.log("🤖 Generando 60 recomendaciones estacionales con IA")
        const all60 = await generateSeasonalRecommendations(savedCountry, now, 60)

        // Guardar en cache
        await AsyncStorage.setItem('@seasonal_recommendations_60', JSON.stringify(all60))

        // Mostrar solo las primeras 6
        setRecommendations(all60.slice(0, 6))
        setDisplayedCount(6)
      }

    } catch (error) {
      console.error("Error cargando recomendaciones:", error)
      Alert.alert(
        t.error || 'Error',
        t.errorLoadingRecommendations || 'No se pudieron cargar las recomendaciones'
      )
    } finally {
      setLoading(false)
    }
  }

  const generateSeasonalRecommendations = async (locationStr, date, limit) => {
    try {
      const month = date.getMonth() + 1 // 1-12
      const monthName = t.monthNames[month] || fallback.monthNames[month]
      const year = date.getFullYear()
      const day = date.getDate()

      // Crear prompt para IA (igual que en HomeScreen con costEstimatePrompts)
      let prompt = t.seasonalExpertIntro || fallback.seasonalExpertIntro
      prompt += " "

      const genProducts = (t.generateSeasonalProducts || fallback.generateSeasonalProducts)
        .replace('{limit}', limit)
        .replace('{location}', locationStr)
        .replace('{month}', monthName)
        .replace('{year}', year)
        .replace('{day}', day)

      prompt += genProducts + " "
      prompt += (t.considerFactors || fallback.considerFactors) + " "

      const fruits = (t.seasonalFruits || fallback.seasonalFruits)
        .replace('{location}', locationStr)
        .replace('{month}', monthName)
      prompt += fruits + " "

      const climate = (t.localClimate || fallback.localClimate)
        .replace('{location}', locationStr)
        .replace('{month}', monthName)
      prompt += climate + " "

      const festivals = (t.festivalsAndTraditions || fallback.festivalsAndTraditions)
        .replace('{location}', locationStr)
        .replace('{month}', monthName)
      prompt += festivals + " "

      prompt += (t.culinaryPreparations || fallback.culinaryPreparations) + " "

      const responseFormat = (t.responseFormat || fallback.responseFormat)
        .replace('{location}', locationStr)
      prompt += responseFormat + " "

      const exampleFormat = (t.exampleFormat || fallback.exampleFormat)
        .replace(/{location}/g, locationStr)
      prompt += exampleFormat

      console.log("📤 Enviando prompt estacional a GPT-4.1")

      // Llamada a GPT-4.1 (igual que en HomeScreen línea 819)
      const response = await axios.post(API_KEY_ANALIZE, {
        model: "gpt-4.1",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.7
      })

      const aiResponse = response.data.choices[0].message.content.trim()
      console.log("📥 Respuesta IA estacional recibida")

      // Procesar respuesta
      const lines = aiResponse.split('\n').filter(line => line.trim().length > 0)

      const recommendations = lines.slice(0, limit).map(line => {
        const cleanLine = line.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim()

        let item, reason
        if (cleanLine.includes(' - ')) {
          [item, reason] = cleanLine.split(' - ', 2)
        } else {
          item = cleanLine
          reason = `${t.subtitle || fallback.subtitle}`
        }

        return {
          item: item.trim(),
          reason: reason.trim(),
          confidence: 0.9,
          type: 'seasonal',
          priority: 'high'
        }
      })

      console.log("🤖 Recomendaciones estacionales IA:", recommendations.length, "productos generados")
      return recommendations

    } catch (error) {
      console.error("❌ Error generando recomendaciones estacionales:", error)

      // Fallback básico
      return [
        { item: 'Naranjas 🍊', reason: 'Fruta de temporada', type: 'seasonal' },
        { item: 'Manzanas 🍎', reason: 'Fruta de temporada', type: 'seasonal' },
        { item: 'Peras 🍐', reason: 'Fruta de temporada', type: 'seasonal' },
        { item: 'Brócoli 🥦', reason: 'Verdura de temporada', type: 'seasonal' },
        { item: 'Zanahorias 🥕', reason: 'Verdura de temporada', type: 'seasonal' },
        { item: 'Calabaza 🎃', reason: 'Verdura de temporada', type: 'seasonal' }
      ]
    }
  }

  const loadMoreRecommendations = async () => {
    if (isLoadingMore || !canLoadMore || displayedCount >= 60) return

    try {
      setIsLoadingMore(true)

      const cachedData = await AsyncStorage.getItem('@seasonal_recommendations_60')
      if (!cachedData) {
        setCanLoadMore(false)
        setIsLoadingMore(false)
        return
      }

      const cached = JSON.parse(cachedData)
      const nextBatch = cached.slice(displayedCount, displayedCount + 6)

      if (nextBatch.length > 0) {
        setRecommendations(prev => [...prev, ...nextBatch])
        setDisplayedCount(prev => prev + nextBatch.length)

        if (displayedCount + nextBatch.length >= 60) {
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

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 50

    if (isCloseToBottom && canLoadMore && !isLoadingMore && displayedCount < 60) {
      console.log(`🔄 Auto-cargando más productos... Mostrados: ${displayedCount}/60`)
      loadMoreRecommendations()
    }
  }

  const handleAddToList = (recommendation) => {
    triggerHaptic()
    setSelectedRecommendation(recommendation)
    loadHistoryLists()
    setShowListModal(true)
  }

  const loadHistoryLists = async () => {
    try {
      const historyData = await AsyncStorage.getItem("@shopping_history")
      if (historyData) {
        const history = JSON.parse(historyData)
        setHistoryLists(history.reverse())
      }

      const currentListData = await AsyncStorage.getItem("@shopping_list")
      const currentList = currentListData ? JSON.parse(currentListData) : []
      setHasCurrentList(currentList.length > 0)
    } catch (error) {
      console.error('Error loading history lists:', error)
    }
  }

  const handleAddToCurrentList = async () => {
    try {
      if (!selectedRecommendation) return

      const currentListData = await AsyncStorage.getItem("@shopping_list")
      const currentList = currentListData ? JSON.parse(currentListData) : []

      if (!currentList.includes(selectedRecommendation.item)) {
        currentList.push(selectedRecommendation.item)
        await AsyncStorage.setItem("@shopping_list", JSON.stringify(currentList))
      }

      setAddedItems(prev => new Set([...prev, selectedRecommendation.item]))
      setShowListModal(false)
      setSelectedRecommendation(null)

      setRecommendations(prevRecs => {
        const filteredRecs = prevRecs.filter(rec => rec.item !== selectedRecommendation.item)
        return filteredRecs
      })

      Alert.alert('✅', `${selectedRecommendation.item} ${t.added || fallback.added}`)
    } catch (error) {
      console.error('Error adding to current list:', error)
      Alert.alert(t.error || fallback.error, t.couldNotAddProduct || fallback.couldNotAddProduct)
    }
  }

  const handleAddToSpecificList = async (listIndex) => {
    try {
      if (!selectedRecommendation) return

      const currentListData = await AsyncStorage.getItem("@shopping_list")
      const currentList = currentListData ? JSON.parse(currentListData) : []

      if (!currentList.includes(selectedRecommendation.item)) {
        currentList.push(selectedRecommendation.item)
        await AsyncStorage.setItem("@shopping_list", JSON.stringify(currentList))
      }

      setAddedItems(prev => new Set([...prev, selectedRecommendation.item]))
      setShowListModal(false)
      setSelectedRecommendation(null)

      setRecommendations(prevRecs => {
        const filteredRecs = prevRecs.filter(rec => rec.item !== selectedRecommendation.item)
        return filteredRecs
      })

      Alert.alert('✅', `${selectedRecommendation.item} ${t.added || fallback.added}`)
    } catch (error) {
      console.error('Error adding to list:', error)
      Alert.alert(t.error || fallback.error, t.couldNotAddProduct || fallback.couldNotAddProduct)
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
      marginTop: -25,
      paddingBottom: 15,
    },
    titleContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: isSmallIPhone ? 24 : 28,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: isSmallIPhone ? 12 : 14,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 4,
    },
    filtersContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 10,
      marginTop: 8,
      marginBottom: 2,
      gap: 8,
    },
    filterButtonActive: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.backgroundtres + '10',
      borderRadius: 10,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: theme.backgroundtres + '20',
    },
    filterButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.background,
      borderRadius: 10,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: theme.backgroundtres + '10',
    },
    filterTextActive: {
      fontSize: isSmallIPhone ? 11 : 12,
      fontWeight: '600',
      color: '#4a6bff',
    },
    filterTextInactive: {
      fontSize: isSmallIPhone ? 11 : 12,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.backgroundtres + '10',
      marginHorizontal: 0,
      marginTop: 0,
      marginBottom: 15,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: theme.backgroundtres + '20',
    },
    locationLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    locationRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    locationText: {
      fontSize: isSmallIPhone ? 12 : 13,
      fontWeight: '600',
      color: '#4a6bff',
      marginLeft: 6,
    },
    monthText: {
      fontSize: isSmallIPhone ? 12 : 13,
      fontWeight: '600',
      color: '#4a6bff',
      marginLeft: 6,
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
    statNumber: {
      fontSize: isSmallIPhone ? 16 : 18,
      fontWeight: 'bold',
      color: '#4a6bff',
      marginBottom: 4,
    },
    statLabel: {
      fontSize: isSmallIPhone ? 10 : 11,
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

        {/* Filtros de navegación */}
        <View style={styles.filtersContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {
              triggerHaptic()
              navigation.goBack()
            }}
          >
            <Ionicons name="time-outline" size={16} color={theme.textSecondary} style={{ marginRight: 6 }} />
            <Text style={styles.filterTextInactive}>{t.historyFilter || 'Basado en historial'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterButtonActive}
            disabled
          >
            <Ionicons name="leaf-outline" size={16} color="#4a6bff" style={{ marginRight: 6 }} />
            <Text style={styles.filterTextActive}>{t.seasonalFilter || 'Productos de temporada'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a6bff" />
          <Text style={styles.loadingText}>
            {t.analyzingLocation || fallback.analyzingLocation}
          </Text>
        </View>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          style={styles.content}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* Ubicación y mes dentro del scroll */}
          {country && (
            <View style={styles.locationContainer}>
              <View style={styles.locationLeft}>
                <Ionicons name="location" size={16} color="#4a6bff" />
                <Text style={styles.locationText}>{country}</Text>
              </View>
              <View style={styles.locationRight}>
                <Ionicons name="calendar-outline" size={16} color="#4a6bff" />
                <Text style={styles.monthText}>
                  {t.monthNames[currentDate.getMonth() + 1] || fallback.monthNames[currentDate.getMonth() + 1]}
                </Text>
              </View>
            </View>
          )}

          <Animated.View
            style={[
              styles.recommendationsGrid,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {recommendations.map((rec, index) => {
              const isAdded = addedItems.has(rec.item)

              return (
                <TouchableOpacity
                  key={`${rec.item}-${index}`}
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

          {isLoadingMore && (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size="small" color="#4a6bff" />
              <Text style={styles.loadingMoreText}>{t.loadingMore || fallback.loadingMore}</Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Modal para seleccionar lista */}
      <Modal
        visible={showListModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowListModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.selectList || fallback.selectList}</Text>

            <TouchableOpacity
              style={styles.currentListButton}
              onPress={handleAddToCurrentList}
            >
              <Text style={styles.currentListButtonText}>
                {t.addToCurrentList || fallback.addToCurrentList}
              </Text>
            </TouchableOpacity>

            <ScrollView style={{ maxHeight: '60%' }}>
              {historyLists.map((list, index) => (
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
                      {list.list.length} {t.products || fallback.products || 'products'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowListModal(false)}
            >
              <Text style={styles.closeModalButtonText}>{t.cancel || fallback.cancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default SeasonalRecommendationsScreen