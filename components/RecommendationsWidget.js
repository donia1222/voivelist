import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  ActivityIndicator,
  Alert,
  Platform,
  Dimensions
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../ThemeContext'
import { useHaptic } from '../HapticContext'
import RecommendationService from '../services/RecommendationService'
import * as RNLocalize from 'react-native-localize'

const { width: screenWidth } = Dimensions.get('window')
const isSmallIPhone = Platform.OS === 'ios' && screenWidth <= 375

/**
 * Widget de Recomendaciones Personalizadas
 * Muestra sugerencias inteligentes basadas en patrones del usuario
 */
const RecommendationsWidget = ({ onAddItem, style, visible = true }) => {
  const { theme } = useTheme()
  const { triggerHaptic } = useHaptic()

  // Estados
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addedItems, setAddedItems] = useState(new Set())

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(-50)).current
  const pulseAnim = useRef(new Animated.Value(1)).current

  // Traducciones
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  const texts = {
    es: {
      title: "💡 Sugerencias para ti",
      addAll: "Agregar todo",
      ignore: "Ignorar",
      loading: "Analizando patrones...",
      error: "Error cargando sugerencias",
      retry: "Reintentar",
      added: "Agregado",
      noSuggestions: "No hay sugerencias disponibles"
    },
    en: {
      title: "💡 Suggestions for you",
      addAll: "Add all",
      ignore: "Ignore",
      loading: "Analyzing patterns...",
      error: "Error loading suggestions",
      retry: "Retry",
      added: "Added",
      noSuggestions: "No suggestions available"
    }
  }
  const t = texts[deviceLanguage] || texts.en

  // Efectos
  useEffect(() => {
    if (visible) {
      loadRecommendations()
      startAnimations()
    }
  }, [visible])

  useEffect(() => {
    startPulseAnimation()
  }, [])

  // Funciones principales
  const loadRecommendations = async () => {
    try {
      setLoading(true)
      setError(null)

      const recs = await RecommendationService.getRecommendations(4)
      setRecommendations(recs)

      // Pequeño delay para mostrar el loading
      setTimeout(() => {
        setLoading(false)
      }, 800)

    } catch (err) {
      console.error('Error loading recommendations:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  const handleAddItem = async (recommendation) => {
    try {
      // Vibración háptica
      triggerHaptic()

      // Marcar como agregado
      setAddedItems(prev => new Set([...prev, recommendation.item]))

      // Llamar función padre
      if (onAddItem) {
        await onAddItem(recommendation.item)
      }

      // Animar el item agregado
      animateItemAdded(recommendation.item)

    } catch (error) {
      console.error('Error adding recommended item:', error)
      Alert.alert('Error', 'No se pudo agregar el item')
    }
  }

  const handleAddAll = async () => {
    try {
      triggerHaptic()

      for (const rec of recommendations) {
        if (!addedItems.has(rec.item)) {
          await handleAddItem(rec)
          // Pequeño delay entre items
          await new Promise(resolve => setTimeout(resolve, 200))
        }
      }
    } catch (error) {
      console.error('Error adding all items:', error)
    }
  }

  const handleIgnore = async () => {
    try {
      // Marcar recomendaciones como ignoradas
      for (const rec of recommendations) {
        await RecommendationService.ignoreRecommendation(rec.item)
      }

      // Animar salida y recargar
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        loadRecommendations()
      })

    } catch (error) {
      console.error('Error ignoring recommendations:', error)
    }
  }

  // Animaciones
  const startAnimations = () => {
    // Entrada del widget
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
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

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start()
  }

  const animateItemAdded = (itemName) => {
    // Animación simple para mostrar que se agregó
    console.log(`✅ Item agregado: ${itemName}`)
  }

  // Estilos
  const styles = {
    container: {
      backgroundColor: theme.background,
      borderRadius: isSmallIPhone ? 16 : 20,
      marginHorizontal: isSmallIPhone ? 16 : 20,
      marginVertical: isSmallIPhone ? 8 : 12,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 6,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: isSmallIPhone ? 16 : 20,
      paddingTop: isSmallIPhone ? 16 : 20,
      paddingBottom: isSmallIPhone ? 8 : 12,
    },
    title: {
      fontSize: isSmallIPhone ? 17 : 19,
      fontWeight: 'bold',
      color: theme.text,
      flex: 1,
    },
    actionButton: {
      paddingHorizontal: isSmallIPhone ? 8 : 12,
      paddingVertical: isSmallIPhone ? 4 : 6,
      borderRadius: isSmallIPhone ? 8 : 10,
      marginLeft: 8,
    },
    addAllButton: {
      backgroundColor: '#4a6bff20',
      borderWidth: 1,
      borderColor: '#4a6bff40',
    },
    ignoreButton: {
      backgroundColor: '#ef444420',
      borderWidth: 1,
      borderColor: '#ef444440',
    },
    actionButtonText: {
      fontSize: isSmallIPhone ? 12 : 13,
      fontWeight: '600',
    },
    addAllText: {
      color: '#4a6bff',
    },
    ignoreText: {
      color: '#ef4444',
    },
    content: {
      paddingHorizontal: isSmallIPhone ? 16 : 20,
      paddingBottom: isSmallIPhone ? 16 : 20,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: isSmallIPhone ? 20 : 30,
    },
    loadingText: {
      marginLeft: 12,
      fontSize: isSmallIPhone ? 14 : 15,
      color: theme.textSecondary,
      fontWeight: '500',
    },
    errorContainer: {
      alignItems: 'center',
      paddingVertical: isSmallIPhone ? 16 : 20,
    },
    errorText: {
      fontSize: isSmallIPhone ? 14 : 15,
      color: '#ef4444',
      textAlign: 'center',
      marginBottom: 12,
    },
    retryButton: {
      backgroundColor: '#4a6bff',
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 20,
    },
    retryButtonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '600',
    },
    horizontalScroll: {
      paddingVertical: 5,
    },
    scrollContainer: {
      paddingHorizontal: 5,
      gap: isSmallIPhone ? 12 : 15,
    },
    recommendationCard: {
      backgroundColor: theme.background,
      borderRadius: isSmallIPhone ? 14 : 16,
      paddingHorizontal: isSmallIPhone ? 14 : 18,
      paddingVertical: isSmallIPhone ? 12 : 16,
      minWidth: isSmallIPhone ? 120 : 140,
      maxWidth: isSmallIPhone ? 140 : 160,
      borderWidth: 1,
      borderColor: theme.backgroundtres + '30',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      alignItems: 'center',
    },
    recommendationCardAdded: {
      backgroundColor: '#10b98115',
      borderColor: '#10b98150',
    },
    cardIcon: {
      fontSize: isSmallIPhone ? 24 : 28,
      marginBottom: isSmallIPhone ? 8 : 10,
    },
    cardTitle: {
      fontSize: isSmallIPhone ? 14 : 16,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginBottom: isSmallIPhone ? 4 : 6,
      lineHeight: isSmallIPhone ? 18 : 20,
    },
    cardTitleAdded: {
      color: '#10b981',
    },
    cardReason: {
      fontSize: isSmallIPhone ? 11 : 12,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: isSmallIPhone ? 8 : 10,
      lineHeight: isSmallIPhone ? 14 : 16,
      opacity: 0.8,
    },
    cardButton: {
      backgroundColor: '#4a6bff15',
      borderRadius: isSmallIPhone ? 8 : 10,
      padding: isSmallIPhone ? 6 : 8,
      borderWidth: 1,
      borderColor: '#4a6bff30',
    },
    cardButtonAdded: {
      backgroundColor: '#10b981',
      borderColor: '#10b981',
    },
    noSuggestionsContainer: {
      alignItems: 'center',
      paddingVertical: isSmallIPhone ? 16 : 20,
    },
    noSuggestionsText: {
      fontSize: isSmallIPhone ? 14 : 15,
      color: theme.textSecondary,
      textAlign: 'center',
    },
  }

  // Render condicional
  if (!visible) {
    return null
  }

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: pulseAnim }
          ],
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t.title}</Text>

        {!loading && recommendations.length > 0 && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.addAllButton]}
              onPress={handleAddAll}
            >
              <Text style={[styles.actionButtonText, styles.addAllText]}>
                {t.addAll}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.ignoreButton]}
              onPress={handleIgnore}
            >
              <Text style={[styles.actionButtonText, styles.ignoreText]}>
                {t.ignore}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#4a6bff" />
            <Text style={styles.loadingText}>{t.loading}</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{t.error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadRecommendations}>
              <Text style={styles.retryButtonText}>{t.retry}</Text>
            </TouchableOpacity>
          </View>
        ) : recommendations.length === 0 ? (
          <View style={styles.noSuggestionsContainer}>
            <Text style={styles.noSuggestionsText}>{t.noSuggestions}</Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
            style={styles.horizontalScroll}
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
                  onPress={() => !isAdded && handleAddItem(rec)}
                  disabled={isAdded}
                >
                  <Text style={styles.cardIcon}>
                    {rec.icon || '🛒'}
                  </Text>

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
                    onPress={() => !isAdded && handleAddItem(rec)}
                    disabled={isAdded}
                  >
                    <Ionicons
                      name={isAdded ? "checkmark" : "add"}
                      size={18}
                      color={isAdded ? "white" : "#4a6bff"}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        )}
      </View>
    </Animated.View>
  )
}

export default RecommendationsWidget