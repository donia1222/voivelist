import { StyleSheet, Dimensions, Platform } from "react-native"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")
const isTablet = screenWidth >= 768
const isSmallIPhone = Platform.OS === 'ios' && (screenWidth <= 375 || screenHeight <= 667)

export const getModernStyles = () => {
  return StyleSheet.create({
    // Main Container with Modern Gradient Background
    mainContainer: {
      flex: 1,
      backgroundColor: "#e7ead2",
      paddingTop: 25
    },
    
    // Modern Gradient Overlay
    gradientBackground: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: screenHeight,
      opacity: 0.1
    },

    // Ultra Modern Live Results Styles with Advanced Glass Morphism
    liveResultsContainer: {
      alignSelf: 'center',
      width: '90%', // Fixed 90% width
      height: screenHeight * 0.5, // Fixed height
      marginVertical: 30,
      position: 'relative',
    },
    liveResultsCard: {
      backgroundColor: "rgba(255, 255, 255, 0.12)",
      backdropFilter: 'blur(30px)',
      borderRadius: 28,
      padding: 32,
      shadowColor: "rgba(147, 176, 176, 0.9)",
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.35,
      shadowRadius: 40,
      elevation: 25,
      borderWidth: 1.8,
      borderColor: "rgba(255, 255, 255, 0.6)",
      position: 'relative',
      overflow: 'hidden',
      width: '100%', // Full width of container
      height: '100%', // Full height of container
      flex: 1,
    },
    
    // Advanced glass morphism background with gradient overlay
    liveResultsGlassBg: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(147, 176, 176, 0.08)',
      borderRadius: 28,
    },
    
    // Shimmer effect overlay
    liveResultsShimmer: {
      position: 'absolute',
      top: -2,
      left: -2,
      right: -2,
      height: 2,
      backgroundColor: 'rgba(147, 176, 176, 0.4)',
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
    },
    listeningHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
      position: 'relative',
      zIndex: 1,
    },
    pulsingDot: {
      width: 14,
      height: 14,
      backgroundColor: "#6366f1",
      borderRadius: 7,
      marginRight: 16,
      shadowColor: "#6366f1",
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 5,
    },
    listeningText: {
      fontSize: 20,
      fontWeight: "800",
      color: "#1f2937",
      letterSpacing: 0.8,
    },
    resultItem: {
      marginBottom: 12,
    },
    resultText: {
      fontSize: 16,
      lineHeight: 24,
    },
    highlightedWord: {
      fontWeight: "900",
      fontSize: 17,
      backgroundColor: "rgba(147, 176, 176, 0.25)",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      textShadowColor: "rgba(147, 176, 176, 0.8)",
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 6,
      borderWidth: 1,
      borderColor: "rgba(147, 176, 176, 0.3)",
      color: "#1f2937",
    },
    normalWord: {
      color: "#4b5563",
      fontSize: 16,
      fontWeight: "500",
    },
    // Scrollable content styles
    scrollableContent: {
      flex: 1,
      maxHeight: screenHeight * 0.35, // Maximum height for scrollable area
    },
    
    scrollContentContainer: {
      paddingBottom: 10,
    },

    // Floating items container for detected grocery items
    floatingItemsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 12,
      minHeight: 40,
      paddingHorizontal: 4,
    },
    
    // Live container for better layout control
    liveContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    // Integrated pause button styles (fixed at bottom)
    pauseButtonContainer: {
      alignItems: 'center',
      marginTop: 15,
      paddingTop: 15,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    
    pauseButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(239, 68, 68, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: 'rgba(239, 68, 68, 0.6)',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 4,
    },
    
    pauseButtonInner: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(239, 68, 68, 1)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    tipContainer: {
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: "rgba(99, 102, 241, 0.2)",
    },
    tipText: {
      fontSize: 14,
      color: "#6366f1",
      fontWeight: "600",
      textAlign: "center",
    },

    // Action Buttons Styles
    actionButtonsContainer: {
      paddingHorizontal: 16,
      paddingVertical: 24,
      borderTopWidth: 1,
      borderTopColor: "rgba(99, 102, 241, 0.1)",
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    deleteButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fef2f2",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "#fecaca",
      shadowColor: "#ef4444",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    deleteButtonText: {
      marginLeft: 8,
      color: "#ef4444",
      fontWeight: "700",
      fontSize: 14,
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#eff6ff",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "#bfdbfe",
      shadowColor: "#4a6bff",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    addButtonText: {
      marginLeft: 8,
      color: "#4a6bff",
      fontWeight: "700",
      fontSize: 14,
    },
    saveButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#ecfdf5",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "#a7f3d0",
      shadowColor: "#10b981",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    saveButtonText: {
      marginLeft: 8,
      color: "#10b981",
      fontWeight: "700",
      fontSize: 14,
    },

    // Ultra Modern Voice Button Styles - MÁS COMPACTO
    voiceButtonContainer: {
      alignItems: "center",
      paddingVertical: 40,
      backgroundColor: "transparent",
      position: 'relative',
      zIndex: 100,
    },

    // Manual List Button
    manualListButton: {
      position: 'absolute',
      top: -70,
      right: 100,
      width: 54,
      height: 54,
      borderRadius: 27,
      backgroundColor: '#10b981',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#10b981',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 14,
      elevation: 10,
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.4)',
      zIndex: 101,
    },

    manualListInner: {
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Voice Info Styles
    voiceInfoContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      paddingHorizontal: isSmallIPhone ? 14 : 20,
      paddingVertical: isSmallIPhone ? 10 : 16,
      borderRadius: isSmallIPhone ? 16 : 20,
      marginBottom: isSmallIPhone ? 16 : 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: isSmallIPhone ? 4 : 6 },
      shadowOpacity: 0.15,
      shadowRadius: isSmallIPhone ? 12 : 16,
      elevation: 8,
      borderWidth: 1,
      borderColor: 'rgba(255, 149, 0, 0.2)',
      maxWidth: isSmallIPhone ? screenWidth * 0.9 : screenWidth * 0.85,
    },
    voiceInfoText: {
      fontSize: isSmallIPhone ? 14 : 16,
      fontWeight: '700',
      color: '#1f2937',
      textAlign: 'center',
      marginBottom: isSmallIPhone ? 2 : 4,
    },
    voiceInfoSubtext: {
      fontSize: isSmallIPhone ? 11 : 13,
      fontWeight: '500',
      color: '#6b7280',
      textAlign: 'center',
      lineHeight: isSmallIPhone ? 15 : 18,
    },
    voiceInfoSubtextClickable: {
      color: '#ff9500',
      fontWeight: '600',
      textDecorationLine: 'underline',
    },
    
    // Floating effect background
    voiceFloatingContainer: {
      position: 'relative',
      alignItems: "center",
      justifyContent: "center",
    },
    
    // Outer pulse ring - COLORES VIBRANTES
    pulseRingOuter: {
      position: 'absolute',
      width: isSmallIPhone ? 160 : 200,
      height: isSmallIPhone ? 160 : 200,
      borderRadius: isSmallIPhone ? 80 : 100,
      backgroundColor: 'rgba(74, 107, 255, 0.12)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    // Middle pulse ring - AMARILLO
    pulseRingMiddle: {
      position: 'absolute',
      width: isSmallIPhone ? 130 : 160,
      height: isSmallIPhone ? 130 : 160,
      borderRadius: isSmallIPhone ? 65 : 80,
      backgroundColor: 'rgba(255, 149, 0, 0.18)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    // Inner glow ring - LILA VIBRANTE
    pulseRingInner: {
      position: 'absolute',
      width: isSmallIPhone ? 110 : 140,
      height: isSmallIPhone ? 110 : 140,
      borderRadius: isSmallIPhone ? 55 : 70,
      backgroundColor: 'rgba(74, 107, 255, 0.25)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    voiceButtonWrapper: {
      alignItems: "center",
      position: 'relative',
      zIndex: 10,
    },
    
    voiceButton: {
      width: isSmallIPhone ? 70 : 90,
      height: isSmallIPhone ? 70 : 90,
      borderRadius: isSmallIPhone ? 45 : 60,
      alignItems: "center",
      justifyContent: "center",
      shadowOffset: { width: 0, height: isSmallIPhone ? 15 : 25 },
      shadowOpacity: isSmallIPhone ? 0.4 : 0.5,
      shadowRadius: isSmallIPhone ? 25 : 40,
      elevation: isSmallIPhone ? 20 : 30,
      borderWidth: isSmallIPhone ? 4 : 5,
      borderColor: 'rgba(255, 255, 255, 0.6)',
    },
    
    // Glass morphism effect when active
    voiceButtonActive: {
      backgroundColor: "rgba(239, 68, 68, 0.9)",
      shadowColor: "#ef4444",
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    
    // Ultra modern gradient when inactive - COLORES VIBRANTES
    voiceButtonInactive: {
      backgroundColor: "#4a6bff",
      shadowColor: "#4a6bff",
      borderColor: 'rgba(255, 255, 255, 0.8)',
    },
    
    // Floating microphone icon
    micIconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    

    // Ultra prominent call-to-action text - MÁS COMPACTO
    voiceButtonSubtitle: {
      marginTop: 20,
      fontSize: 22,
      color: "#1f2937",
      textAlign: "center",
      maxWidth: 300,
      lineHeight: 28,
      fontWeight: "900",
      letterSpacing: -0.4,
      textShadowColor: "rgba(147, 176, 176, 0.3)",
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    
    // Recording status with pulse dot
    recordingStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderRadius: 25,
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    
    recordingDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#ef4444',
      marginRight: 8,
    },
    
    recordingText: {
      fontSize: 14,
      color: '#dc2626',
      fontWeight: '600',
      letterSpacing: 0.3,
    },

    // Ultra Modern Empty State Styles - MÁS COMPACTO
    emptyStateContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
      paddingVertical: 20,
      backgroundColor: "transparent",
    },
    emptyStateContent: {
      alignItems: "center",
      width: "100%",
    },
    
    // Modern Hero Section - MÁS COMPACTO
    heroSection: {
      alignItems: "center",
      marginBottom: 20,
      paddingHorizontal: 20,
    },
    
    // Compact Modern Voice Icon Container
    modernIconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(147, 176, 176, 0.08)",
      borderWidth: 2,
      borderColor: "rgba(147, 176, 176, 0.2)",
      marginBottom: 30,
      shadowColor: "rgba(147, 176, 176, 0.6)",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 8,
      position: 'relative',
      overflow: 'hidden',
    },
    
    // Gradient overlay for modern look
    iconGradientOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(147, 176, 176, 0.03)',
      borderRadius: 60,
    },
    
    // Modern Voice Icon
    modernVoiceIcon: {
      position: 'relative',
      zIndex: 1,
    },
    
    // Hero Title - MÁS COMPACTO
    heroTitle: {
      fontSize: isSmallIPhone ? 20 : 24,
      fontWeight: isSmallIPhone ? "700" : "800",
      color: "#2b4262d4",
      textAlign: "center",
      marginBottom: isSmallIPhone ? 6 : 18,
      letterSpacing: -0.3,
      lineHeight: isSmallIPhone ? 26 : 32,
      marginTop: isSmallIPhone ? 20 : 40,
    },
    
    // Hero Subtitle - MÁS COMPACTO
    heroSubtitle: {
      fontSize: isSmallIPhone ? 13 : 15,
      color: "#6b7280",
      textAlign: "center",
      lineHeight: isSmallIPhone ? 18 : 22,
      marginBottom: isSmallIPhone ? 4 : 6,
      fontWeight: "500",
      maxWidth: isSmallIPhone ? 260 : 280,
    },
    
    // Feature highlights - MÁS COMPACTO
    featuresContainer: {
      alignItems: "center",
      marginTop: isSmallIPhone ? 8 : 12,
      marginBottom: isSmallIPhone ? 12 : 16,
    },
    
    featureItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: isSmallIPhone ? 6 : 10,
      paddingHorizontal: isSmallIPhone ? 12 : 18,
      paddingVertical: isSmallIPhone ? 6 : 10,
      backgroundColor: "rgba(255, 255, 255, 0.85)",
      borderRadius: isSmallIPhone ? 16 : 22,
      borderWidth: isSmallIPhone ? 1 : 1.5,
      borderColor: "rgba(74, 107, 255, 0.2)",
      shadowColor: "#4a6bff",
      shadowOffset: { width: 0, height: isSmallIPhone ? 2 : 3 },
      shadowOpacity: isSmallIPhone ? 0.1 : 0.15,
      shadowRadius: isSmallIPhone ? 6 : 8,
      elevation: isSmallIPhone ? 3 : 4,
      minWidth: isSmallIPhone ? 130 : 160,
      justifyContent: "center",
    },
    
    featureIcon: {
      marginRight: isSmallIPhone ? 6 : 12,
    },
    
    featureText: {
      fontSize: isSmallIPhone ? 11 : 14,
      color: "#1f2937",
      fontWeight: isSmallIPhone ? "600" : "700",
    },
    
    // Call to Action Section - MÁS COMPACTO
    ctaContainer: {
      alignItems: "center",


    },
    
    ctaText: {
      fontSize: 16,
      color: "#4a6bff",
      fontWeight: "700",
      textAlign: "center",
      marginBottom: 6,
      letterSpacing: 0.2,
    },
    
    arrowIcon: {
      opacity: 0.7,
    },
    
    // Legacy styles (hidden/removed)
    iconContainer: {
      display: "none", // Hide old container
    },
    emptyStateIcon: {
      display: "none", // Hide old image
    },
    languageButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(74, 107, 255, 0.10)",
      paddingHorizontal: isSmallIPhone ? 12 : 18,
      paddingVertical: isSmallIPhone ? 8 : 10,
      borderRadius: isSmallIPhone ? 16 : 20,
      borderWidth: isSmallIPhone ? 1 : 1.5,
      borderColor: "rgba(74, 107, 255, 0.30)",
      shadowColor: "rgba(74, 107, 255, 0.8)",
      shadowOffset: { width: 0, height: isSmallIPhone ? 4 : 6 },
      shadowOpacity: isSmallIPhone ? 0.15 : 0.20,
      shadowRadius: isSmallIPhone ? 10 : 15,
      elevation: isSmallIPhone ? 4 : 6,

      marginBottom: isSmallIPhone ? -10 : -10,
    },
    languageButtonText: {
      marginLeft: isSmallIPhone ? 8 : 12,
      color: "#1f2937",
      fontWeight: isSmallIPhone ? "600" : "700",
      fontSize: isSmallIPhone ? 13 : 16,
    },

    // Creating Message Styles
    creatingContainer: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 32,
      backgroundColor: "transparent",
      position: 'relative',
      zIndex: 50,
    },
    creatingHeader: {
      alignItems: "center",
      marginBottom: 32,
    },
    micContainer: {
      alignItems: "center",
    },
    micIconWrapper: {
      width: 80,
      height: 80,
      backgroundColor: "#6366f1",
      borderRadius: 40,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
      shadowColor: "#6366f1",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 10,
    },
    creatingTitle: {
      fontSize: 20,
      fontWeight: "700",
      textAlign: "center",
      marginBottom: 12,
      letterSpacing: 0.5,
    },
    creatingSubtitle: {
      color: "#6b7280",
      textAlign: "center",
      fontSize: 14,
      fontWeight: "500",
    },
    processingContainer: {
      alignItems: "center",
      marginTop: 32,
      marginBottom: 120, // Espacio para evitar superposición con botón de voz
    },
    processingHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    processingDot: {
      width: 8,
      height: 8,
      backgroundColor: "#6366f1",
      borderRadius: 4,
      marginHorizontal: 8,
    },
    processingText: {
      fontSize: 18,
      fontWeight: "700",
      color: "#1f2937",
      letterSpacing: 0.5,
    },
    showListButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#10b981",
      paddingHorizontal: 28,
      paddingVertical: 16,
      borderRadius: 20,
      shadowColor: "#10b981",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    showListButtonText: {
      marginLeft: 12,
      color: "white",
      fontWeight: "800",
      fontSize: 16,
      letterSpacing: 0.5,
    },

    // List Item Styles
    flatList: {
      flex: 1,
      backgroundColor: "transparent",
    },
    flatListContent: {
      paddingBottom: 20,
      paddingTop: 40,
    },
    listItem: {
      marginHorizontal: 16,
      marginBottom: 12,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderRadius: 20,
      padding: 18,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      shadowColor: "#6366f1",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
      borderLeftWidth: 4,
      borderLeftColor: "#6366f1",
    },
    listItemContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    bulletPoint: {
      width: 12,
      height: 12,
      backgroundColor: "#6366f1",
      borderRadius: 6,
      marginRight: 16,
    },
    listItemText: {
      color: "#1f2937",
      fontWeight: "600",
      fontSize: 16,
      flex: 1,
      letterSpacing: 0.3,
    },
    listItemActions: {
      flexDirection: "row",
      alignItems: "center",
    },
    editButton: {
      backgroundColor: "#eff6ff",
      padding: 10,
      borderRadius: 12,
      marginRight: 8,
    },
    removeButton: {
      backgroundColor: "#fef2f2",
      padding: 10,
      borderRadius: 12,
    },

    // Cost and Add Item Styles - ULTRA MODERNO
    costButtonWrapper: {
      marginHorizontal: 16,
      marginBottom: 16,
    },
    costButton: {
      paddingVertical: 20,
      paddingHorizontal: 24,
      borderRadius: 25,
  
      elevation: 12,
      position: "relative",
      overflow: "hidden",
    },
    costButtonText: {
      color: "rgba(0, 0, 0, 0.66)",
      fontWeight: "800",
      textAlign: "center",
      fontSize: 16,
    },
    addItemWrapper: {
      marginHorizontal: 16,
      marginBottom: 16,
    },
    addItemButton: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderWidth: 2,
      borderColor: "#d1d5db",
      borderStyle: "dashed",
      padding: 18,
      borderRadius: 20,
      alignItems: "center",
      shadowColor: "#6b7280",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    addItemText: {
      marginTop: 8,
      color: "#6b7280",
      fontWeight: "600",
      fontSize: 15,
    },

    // Modal Styles
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: 20,
    },
    modalContaineri: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: 20,
    },
    modalContaineris: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: 20,
    },
    modalContaineridiomas: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContentidiomas: {
      backgroundColor: "white",
      borderRadius: 20,
      padding: 30,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 15,
      width: "85%",
    },
    modalView: {
      backgroundColor: "white",
      borderRadius: 20,
      padding: 30,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 15,
      width: "90%",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "white",
      marginBottom: 20,
      textAlign: "center",
    },
    modalTitleprimermodal: {
      fontSize: 22,
      fontWeight: "800",
      color: "#1f2937",
      marginBottom: 24,
      textAlign: "center",
    },
    modalInput: {
      borderWidth: 1,
      borderColor: "#d1d5db",
      borderRadius: 12,
      padding: 15,
      fontSize: 16,
      backgroundColor: "#f9fafb",
      width: "100%",
      marginBottom: 20,
    },
    modalButton: {
      backgroundColor: "#6366f1",
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#6366f1",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
      marginBottom: 10,
    },
    modalButtonnos: {
      backgroundColor: "#6b7280",
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#6b7280",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    modalButtonText: {
      color: "white",
      fontWeight: "700",
      fontSize: 18,
      marginLeft: 8,
    },
    modalButtonTextclose: {
      color: "white",
      fontWeight: "700",
      fontSize: 21,
    },
    modalButtonTexteidi: {
      fontSize: 18,
      fontWeight: "700",
      color: "#1f2937",
      marginBottom: 20,
    },
    modalButtonTexte: {
      fontSize: 16,
      color: "#6b7280",
      textAlign: "center",
      marginTop: 20,
    },
    modalImage: {
      width: 80,
      height: 80,
      tintColor: "#6366f1",
    },
    closeButton: {
      position: "absolute",
      top: 15,
      right: 15,
      padding: 5,
    },
    modalText: {
      fontSize: 16,
      color: "#374151",
      textAlign: "center",
      lineHeight: 24,
      marginBottom: 15,
    },
    modalTextex: {
      fontSize: 14,
      color: "#6b7280",
      textAlign: "center",
      fontStyle: "italic",
      marginBottom: 20,
      paddingHorizontal: 10,
    },
    stepContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
      paddingHorizontal: 10,
    },
    circle: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: "#6366f1",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 15,
    },
    circleText: {
      color: "white",
      fontWeight: "700",
      fontSize: 14,
    },

    // Settings Modal Styles
    primermodalView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    scrollViewContent: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalButtonSettins: {
      backgroundColor: "#6366f1",
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 12,
      marginBottom: 15,
      shadowColor: "#6366f1",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
      marginTop: 20,
    },
    modalButtonTextSettins: {
      color: "white",
      fontWeight: "700",
      fontSize: 16,
      textAlign: "center",
    },
    modalButtonno: {
      backgroundColor: "#ef4444",
      padding: 12,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20
    },

    // Confirmation Modal
    confirmationModalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    confirmationModalContent: {
      backgroundColor: "white",
      borderRadius: 20,
      padding: 30,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 15,
    },
    confirmationImage: {
      width: 60,
      height: 60,
      marginBottom: 20,
      tintColor: "#10b981",
    },
    confirmationText: {
      fontSize: 18,
      fontWeight: "700",
      color: "#1f2937",
      textAlign: "center",
    },

    // Subscription Banner
    subscriptionBanner: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fef2f2",
      padding: 12,
      borderRadius: 12,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: "#fecaca",
    },
    subscriptionBannerText: {
      color: "#e91e63",
      fontWeight: "600",
      fontSize: 14,
    },

    // Country Modal - NUEVO ESTILO MÁS COMPACTO
    countryModalContent: {
      backgroundColor: "white",
      borderRadius: 25,
      paddingVertical: 25,
      paddingHorizontal: 25,
      width: "85%",
      maxWidth: 350,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 15 },
      shadowOpacity: 0.35,
      shadowRadius: 25,
      elevation: 30,
    },
    countryModalCloseButton: {
      position: "absolute",
      top: 15,
      right: 20,
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: "#f3f4f6",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10,
    },
    countryModalHeader: {
      alignItems: "center",
      marginBottom: 20,
    },
    countryModalIconContainer: {
      width: 60,
      height: 60,
      backgroundColor: "#4a6bff15",
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    countryModalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#1f2937",
      marginBottom: 5,
    },
    countryModalSubtitle: {
      fontSize: 14,
      color: "#6b7280",
      textAlign: "center",
    },

    // Add Product Modal - NUEVO ESTILO MODERNO SIN TECLADO TAPANDO
    addProductModalContent: {
      backgroundColor: "white",
      borderRadius: 25,
      paddingVertical: 25,
      paddingHorizontal: 25,
      width: "90%",
      maxWidth: 380,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 15 },
      shadowOpacity: 0.35,
      shadowRadius: 25,
      elevation: 30,
      // Sin maxHeight para evitar problemas con teclado
    },
    addProductModalCloseButton: {
      position: "absolute",
      top: 15,
      right: 20,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "#f3f4f6",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10,
    },
    addProductModalHeader: {
      alignItems: "center",
      marginBottom: 25,
    },
    addProductModalIconContainer: {
      width: 70,
      height: 70,
      backgroundColor: "#4a6bff15",
      borderRadius: 35,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 15,
    },
    addProductModalTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#1f2937",
      marginBottom: 8,
      textAlign: "center",
    },
    addProductModalSubtitle: {
      fontSize: 15,
      color: "#6b7280",
      textAlign: "center",
      lineHeight: 20,
    },
    addProductModalInput: {
      borderWidth: 2,
      borderColor: "#e5e7eb",
      borderRadius: 15,
      padding: 18,
      fontSize: 16,
      backgroundColor: "#f9fafb",
      minHeight: 100,
      textAlignVertical: "top",
      marginBottom: 25,
      color: "#374151",
    },
    addProductModalButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 15,
    },
    addProductCancelButton: {
      flex: 1,
      backgroundColor: "#f3f4f6",
      paddingVertical: 16,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
    },
    addProductCancelButtonText: {
      color: "#6b7280",
      fontWeight: "600",
      fontSize: 16,
    },
    addProductSaveButton: {
      flex: 1,
      backgroundColor: "#4a6bff",
      paddingVertical: 16,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    addProductSaveButtonText: {
      color: "white",
      fontWeight: "700",
      fontSize: 16,
      marginLeft: 8,
    },
    addProductSaveButtonFull: {
      backgroundColor: "#4a6bff",
      paddingVertical: 18,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      width: "100%",
      shadowColor: "#4a6bff",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },

    // Edit Product Modal - MISMO ESTILO MODERNO
    editProductModalContent: {
      backgroundColor: "white",
      borderRadius: 25,
      paddingVertical: 25,
      paddingHorizontal: 25,
      width: "90%",
      maxWidth: 380,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 15 },
      shadowOpacity: 0.35,
      shadowRadius: 25,
      elevation: 30,
    },
    editProductModalCloseButton: {
      position: "absolute",
      top: 15,
      right: 20,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "#f3f4f6",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10,
    },
    editProductModalHeader: {
      alignItems: "center",
      marginBottom: 25,
    },
    editProductModalIconContainer: {
      width: 70,
      height: 70,
      backgroundColor: "#ff950015",
      borderRadius: 35,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 15,
    },
    editProductModalTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#1f2937",
      marginBottom: 8,
      textAlign: "center",
    },
    editProductModalSubtitle: {
      fontSize: 15,
      color: "#6b7280",
      textAlign: "center",
      lineHeight: 20,
    },
    editProductModalInput: {
      borderWidth: 2,
      borderColor: "#e5e7eb",
      borderRadius: 15,
      padding: 18,
      fontSize: 16,
      backgroundColor: "#f9fafb",
      minHeight: 100,
      textAlignVertical: "top",
      marginBottom: 25,
      color: "#374151",
    },
    editProductSaveButtonFull: {
      backgroundColor: "#ff9500",
      paddingVertical: 18,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      width: "100%",
      shadowColor: "#ff9500",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    editProductSaveButtonText: {
      color: "white",
      fontWeight: "700",
      fontSize: 16,
      marginLeft: 8,
    },

    // Close Icon
    closeIconContainer: {
      position: "absolute",
      top: 50,
      right: 30,
      zIndex: 1,
    },

    // Loading Overlay
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    loaderContainer: {
      backgroundColor: "white",
      borderRadius: 16,
      padding: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 10,
    },

    // Publicidad (if needed)
    publicidad: {
      // Add styles if needed
    },

    // Icon styles
    icon: {
      marginRight: 8,
    },

    // Legacy styles for compatibility
    itemContainer: {
      marginHorizontal: 16,
      marginBottom: 12,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderRadius: 20,
      padding: 18,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      shadowColor: "#6366f1",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
      borderLeftWidth: 4,
      borderLeftColor: "#6366f1",
    },
    itemText: {
      color: "#1f2937",
      fontWeight: "600",
      fontSize: 16,
      flex: 1,
      letterSpacing: 0.3,
    },
    iconsContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    editIcon: {
      color: "#6366f1",
      marginRight: 12,
    },
    closeIcon: {
      color: "#ef4444",
    },
    addButtonContainer: {
      marginHorizontal: 16,
      marginBottom: 16,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderWidth: 2,
      borderColor: "#d1d5db",
      borderStyle: "dashed",
      padding: 18,
      borderRadius: 20,
      alignItems: "center",
      shadowColor: "#6b7280",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    costButtonContaineriumage: {
      marginHorizontal: 16,
      marginBottom: 16,
      backgroundColor: "#8b5cf6",
      paddingVertical: 20,
      paddingHorizontal: 24,
      borderRadius: 25,
      shadowColor: "#8b5cf6",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 20,
      elevation: 12,
      borderWidth: 2,
      borderColor: "rgba(255, 255, 255, 0.2)",
      position: "relative",
      overflow: "hidden",
    },

    // Rate App Modal Styles
    rateModalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    rateModalContent: {
      backgroundColor: "white",
      borderRadius: 20,
      padding: 30,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 15,
      width: "85%",
    },
    rateModalTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "#1f2937",
      marginBottom: 16,
      textAlign: "center",
    },
    rateModalMessage: {
      fontSize: 16,
      color: "#6b7280",
      textAlign: "center",
      marginBottom: 24,
      lineHeight: 24,
    },
    rateModalButtons: {
      width: "100%",
    },
    rateButton: {
      backgroundColor: "#6366f1",
      paddingVertical: 14,
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: "#6366f1",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    rateButtonText: {
      color: "white",
      fontWeight: "700",
      fontSize: 16,
      textAlign: "center",
    },
    notNowButton: {
      backgroundColor: "#f3f4f6",
      paddingVertical: 14,
      borderRadius: 12,
    },
    notNowButtonText: {
      color: "#6b7280",
      fontWeight: "600",
      fontSize: 16,
      textAlign: "center",
    },

    // Voice Limit Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    voiceLimitModalContainer: {
      backgroundColor: "white",
      borderRadius: 24,
      padding: 32,
      width: "90%",
      maxWidth: 400,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.3,
      shadowRadius: 24,
      elevation: 16,
    },
    voiceLimitModalHeader: {
      alignItems: "center",
      marginBottom: 20,
    },
    voiceLimitModalTitle: {
      fontSize: 22,
      fontWeight: "800",
      color: "#1f2937",
      textAlign: "center",
      marginTop: 12,
    },
    voiceLimitModalMessage: {
      fontSize: 16,
      color: "#6b7280",
      textAlign: "center",
      marginBottom: 32,
      lineHeight: 24,
    },
    voiceLimitModalButtons: {
      gap: 12,
    },
    subscribeButton: {
      backgroundColor: "#ff9500",
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#ff9500",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    subscribeButtonText: {
      color: "white",
      fontWeight: "700",
      fontSize: 16,
      marginLeft: 8,
    },
    cancelButton: {
      backgroundColor: "#f3f4f6",
      paddingVertical: 14,
      borderRadius: 12,
    },
    cancelButtonText: {
      color: "#6b7280",
      fontWeight: "600",
      fontSize: 16,
      textAlign: "center",
    },

    // Settings Modal Styles (improved)
    settingsModalContainer: {
      backgroundColor: "white",
      borderRadius: 24,
      padding: 32,
      width: "90%",
      maxWidth: 400,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.3,
      shadowRadius: 24,
      elevation: 16,
    },
    settingsModalHeader: {
      alignItems: "center",
      marginBottom: 20,
    },
    settingsModalTitle: {
      fontSize: 22,
      fontWeight: "800",
      color: "#1f2937",
      textAlign: "center",
      marginTop: 12,
    },
    settingsModalMessage: {
      fontSize: 16,
      color: "#6b7280",
      textAlign: "center",
      marginBottom: 32,
      lineHeight: 24,
    },
    settingsModalButtons: {
      gap: 12,
    },
    settingsButton: {
      backgroundColor: "#4f46e5",
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#4f46e5",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    settingsButtonText: {
      color: "white",
      fontWeight: "700",
      fontSize: 16,
      marginLeft: 8,
    },

    // Modern Welcome Modal Styles
    welcomeModalContainer: {
      backgroundColor: "white",
      borderRadius: 24,
      padding: 32,
      width: "99%",
     height: "90%",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.3,
      shadowRadius: 24,
      elevation: 16,
    },
    welcomeModalHeader: {
      alignItems: "center",
      marginBottom: 32,
    },
    welcomeIconContainer: {
      width: 72,
      height: 72,
      backgroundColor: "rgba(255, 149, 0, 0.1)",
      borderRadius: 36,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    welcomeModalTitle: {
      fontSize: 24,
      fontWeight: "800",
      color: "#1f2937",
      textAlign: "center",
    },
    welcomeStepsContainer: {
      marginBottom: 32,
      gap: 20,
    },
    welcomeStep: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 16,
    },
    stepNumber: {
      width: 32,
      height: 32,
      backgroundColor: "#ff9500",
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 4,
    },
    stepNumberText: {
      color: "white",
      fontWeight: "800",
      fontSize: 16,
    },
    stepContent: {
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
    },
    stepText: {
      fontSize: 16,
      color: "#374151",
      lineHeight: 24,
      fontWeight: "500",
      flex: 1,
    },
    stepExample: {
      fontSize: 14,
      color: "#6b7280",
      fontStyle: "italic",
      marginTop: 4,
      paddingLeft: 8,
      borderLeftWidth: 2,
      borderLeftColor: "#e5e7eb",
    },
    welcomeModalButtons: {
      gap: 12,
    },
    welcomeStartButton: {
      backgroundColor: "#ff9500",
      paddingVertical: 18,
      paddingHorizontal: 24,
      borderRadius: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#ff9500",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    welcomeStartButtonText: {
      color: "white",
      fontWeight: "700",
      fontSize: 16,
      marginLeft: 8,
    },
    welcomeSkipButton: {
      backgroundColor: "#f3f4f6",
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 12,
      alignItems: "center",
    },
    welcomeSkipButtonText: {
      color: "#6b7280",
      fontWeight: "600",
      fontSize: 16,
    },
  })
}

export default getModernStyles