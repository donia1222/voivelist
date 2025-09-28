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
  Dimensions
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTheme } from '../ThemeContext'
import { useHaptic } from '../HapticContext'
import RecommendationService from '../services/RecommendationService'
import * as RNLocalize from 'react-native-localize'
import recommendationsTranslations from './translations/recommendationsTranslations'

const { width: screenWidth } = Dimensions.get('window')
const isSmallIPhone = Platform.OS === 'ios' && screenWidth <= 375

/**
 * Pantalla dedicada para Recomendaciones Personalizadas
 * Permite ver sugerencias y agregarlas a listas existentes
 */
const RecommendationsScreen = ({ navigation }) => {
  const { theme } = useTheme()
  const { triggerHaptic } = useHaptic()

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
  // Tipo eliminado - solo historial

  // Estados para auto-carga
  const [displayedCount, setDisplayedCount] = useState(0) // Trackea cuántos de los 60 se han mostrado
  const [isLoadingMore, setIsLoadingMore] = useState(false) // Loader para cargar más productos
  const [canLoadMore, setCanLoadMore] = useState(true) // Si puede cargar más de los 60

  // Animaciones y referencias
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current
  const scrollViewRef = useRef(null)

  // Traducciones
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  const t = recommendationsTranslations[deviceLanguage] || recommendationsTranslations.en
  const fallback = recommendationsTranslations.en

  // Efectos
  useEffect(() => {
    checkAndClearCacheOnNewSession()
    loadRecommendations()
    loadStats()
    startAnimations()
  }, [])

  // Detectar nueva sesión y limpiar cache
  const checkAndClearCacheOnNewSession = async () => {
    try {
      const lastSession = await AsyncStorage.getItem('@last_recommendations_session')
      const now = new Date().getTime()

      // Si es la primera vez o pasaron más de 5 minutos desde la última sesión
      if (!lastSession || (now - parseInt(lastSession)) > 5 * 60 * 1000) {
        console.log('🆕 Nueva sesión detectada, limpiando cache de historial')
        await AsyncStorage.removeItem('@all_recommendations_60')
      }

      // Actualizar timestamp de esta sesión
      await AsyncStorage.setItem('@last_recommendations_session', now.toString())
    } catch (error) {
      console.error('Error checking session:', error)
    }
  }

  // Funciones principales
  const loadMoreRecommendations = async () => {
    if (isLoadingMore || !canLoadMore || displayedCount >= 60) return

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

        // Si ya llegamos a 60, no se puede cargar más
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

  const loadRecommendations = async () => {
    try {
      setLoading(true)

      // Reset estados de auto-carga al iniciar nueva carga
      setDisplayedCount(6) // Los primeros 6
      setCanLoadMore(true)
      setIsLoadingMore(false)

      // Verificar si hay historial de compras
      const historyData = await AsyncStorage.getItem("@shopping_history")
      const hasHistoryData = historyData && JSON.parse(historyData).length > 0
      setHasHistory(hasHistoryData)

      // Verificar si ya hay 60 recomendaciones en cache
      const cachedAll = await AsyncStorage.getItem("@all_recommendations_60")

      let all60 = []

      if (cachedAll) {
        console.log("📦 Usando 60 recomendaciones del cache (misma sesión)")
        all60 = JSON.parse(cachedAll)
      } else {
        console.log("🤖 Generando 60 recomendaciones nuevas con IA")
        // Generar 60 recomendaciones con IA
        all60 = await RecommendationService.getRecommendations(60, false)
        // Guardar en cache
        await AsyncStorage.setItem("@all_recommendations_60", JSON.stringify(all60))
      }

      // Mostrar solo las primeras 6
      const first6 = all60.slice(0, 6)
      setRecommendations(first6)

    } catch (error) {
      console.error('Error loading recommendations:', error)
    } finally {
      setLoading(false)
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

      // Agregar directamente a la lista actual (en progreso)
      const currentListData = await AsyncStorage.getItem("@shopping_list")
      const currentList = currentListData ? JSON.parse(currentListData) : []

      console.log("Current list before adding:", currentList)

      // Verificar si el item ya existe
      if (!currentList.includes(selectedRecommendation.item)) {
        currentList.push(selectedRecommendation.item)
        await AsyncStorage.setItem("@shopping_list", JSON.stringify(currentList))
        console.log("Item added to current list:", currentList)
      } else {
        console.log("Item already exists in current list")
      }

      // Marcar como agregado
      setAddedItems(prev => new Set([...prev, selectedRecommendation.item]))

      // Cerrar modal
      setShowListModal(false)
      setSelectedRecommendation(null)

      console.log("STAYING IN RECOMMENDATIONS SCREEN - NO NAVIGATION")

      // INMEDIATAMENTE remover el producto agregado
      setRecommendations(prevRecs => {
        const filteredRecs = prevRecs.filter(rec => rec.item !== selectedRecommendation.item)
        return filteredRecs
      })

      Alert.alert('✅', `${selectedRecommendation.item} agregado a tu lista`)
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
    if (isCloseToBottom && canLoadMore && !isLoadingMore && displayedCount < 60) {
      console.log(`🔄 Auto-cargando más productos... Mostrados: ${displayedCount}/60`)
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
    filtersContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 10,
      marginTop: -35,
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
            style={styles.filterButtonActive}
            disabled
          >
            <Ionicons name="time-outline" size={16} color="#4a6bff" style={{ marginRight: 6 }} />
            <Text style={styles.filterTextActive}>{t.historySubtitle || 'Basado en tu historial de compras'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {
              triggerHaptic()
              navigation.navigate('SeasonalRecommendationsScreen')
            }}
          >
            <Ionicons name="leaf-outline" size={16} color={theme.textSecondary} style={{ marginRight: 6 }} />
            <Text style={styles.filterTextInactive}>{t.seasonalSubtitle || 'Productos de temporada'}</Text>
          </TouchableOpacity>
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

        {/* Estadísticas */}
        {stats && (
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

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4a6bff" />
            <Text style={styles.loadingText}>{t.loading}</Text>
          </View>
        ) : recommendations.length === 0 || !hasHistory ? (
          <View style={styles.noHistoryContainer}>
            {!hasHistory ? (
              // No hay historial - mostrar mensaje específico
              <>
                <Ionicons name="list-outline" size={64} color="#4a6bff" style={styles.noHistoryIcon} />
                <Text style={styles.noHistoryTitle}>{t.noHistoryTitle}</Text>
                <Text style={styles.noHistoryMessage}>{t.noHistoryMessage}</Text>
                <TouchableOpacity
                  style={styles.createListButton}
                  onPress={() => navigation.navigate('HomeScreen')}
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
            {recommendations.map((rec, index) => {
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
                      onPress={() => navigation.navigate('HomeScreen')}
                    >
                      <Ionicons name="add-circle" size={20} color="white" style={styles.createFirstListButtonIcon} />
                      <Text style={styles.createFirstListButtonText}>Crear mi primera lista</Text>
                    </TouchableOpacity>
                  </View>
                )
              }

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

            {/* Opción: Agregar a lista actual */}
            <TouchableOpacity
              style={styles.currentListButton}
              onPress={handleAddToCurrentList}
            >
              <Text style={styles.currentListButtonText}>
                {t.addToCurrentList}
              </Text>
            </TouchableOpacity>

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
                  <TouchableOpacity
                    style={styles.goCreateListButton}
                    onPress={() => {
                      console.log("USER CLICKED 'Create List' button - navigating to HomeScreen")
                      setShowListModal(false)
                      navigation.navigate('HomeScreen')
                    }}
                  >
                    <Ionicons name="add-circle" size={20} color="white" style={styles.goCreateListButtonIcon} />
                    <Text style={styles.goCreateListButtonText}>{t.goCreateList}</Text>
                  </TouchableOpacity>
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
                        {list.list.length} productos
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
    </SafeAreaView>
  )
}

export default RecommendationsScreen