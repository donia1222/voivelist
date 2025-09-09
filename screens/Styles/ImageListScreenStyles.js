import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const screenWidth = Dimensions.get('window').width;
const isTablet = screenWidth >= 768;

const getImageListStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme?.background || "#e7ead2",
  },

  // Loading States
  loadingOverlay: {
    flex: 1,
    backgroundColor: "rgba(248, 250, 252, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },

  loadingContainer: {
    alignItems: "center",
    backgroundColor: theme?.backgrounddos || "white",
    borderRadius: 24,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    maxWidth: width * 0.9,
  },

  loadingTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme?.text || "#1f2937",
    marginBottom: 24,
    textAlign: "center",
  },

  imagePreviewContainer: {
    position: "relative",
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
  },

  imagePreview: {
    width: 200,
    height: 150,
    borderRadius: 16,
  },

  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    borderRadius: 16,
  },

  analyzeIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: "#eff6ff",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  loadingSpinner: {
    marginBottom: 16,
  },

  loadingSubtitle: {
    fontSize: 16,
    color: theme?.text || "#6b7280",
    textAlign: "center",
  },

  // Empty State
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },

  emptyStateContent: {
    alignItems: "center",
    maxWidth: 320,
  },

  emptyIconContainer: {
    width: 160,
    height: 160,
    backgroundColor: "#f1f5f9",
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },

  emptyStateImage: {
    marginTop: -20,
    backgroundColor: "#93b0b0",
    shadowColor: "#93b0b0",
    borderWidth: 4,
    borderColor: "#93b0b0",
    borderRadius: 20,
    width: 300,
    height: 350,
    borderRadius: 20,
    width: screenWidth * (isTablet ? 0.5 : 0.65),
    height: screenWidth * (isTablet ? 0.6 : 0.75),
  },

  emptyStateTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#93b0b0",
    marginBottom: 12,
    textAlign: "center",
    marginTop: 80,
  },

  emptyStateSubtitle: {
    fontSize: 16,
    color: theme?.text || "#6b7280",
    textAlign: "center",
    lineHeight: 24,
  },

  // List Styles
  listContainer: {
    flex: 1,
  },

  listContent: {
    padding: 16,
    paddingBottom: 100,
  },

  listItem: {
    backgroundColor: theme?.backgrounddos || "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },

  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3b82f6",
    marginRight: 12,
  },

  itemText: {
    fontSize: 16,
    color: theme?.text || "#1f2937",
    flex: 1,
    fontWeight: "500",
  },

  removeButton: {
    padding: 8,
  },

  // Cost Item
  costItemContainer: {
    marginBottom: 12,
  },

  costButton: {
    backgroundColor: "#8b5cf6",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },

  costButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 12,
  },

  // Action Buttons
  mainActionButton: {
    position: "absolute",
    bottom: 32,
    right: 32,
    width: 64,
    height: 64,
    backgroundColor: "#93b0b0",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },

  buttonContent: {
    alignItems: "center",
    justifyContent: "center",
  },

  saveButton: {
    position: "absolute",
    bottom: 32,
    left: 32,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme?.backgrounddos || "white",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },

  saveButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#10b981",
  },

  subscriptionButton: {
    position: "absolute",
    bottom: 32,
    left: 32,
    right: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fef2f2",
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#fecaca",
  },

  subscriptionButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#ef4444",
    textAlign: "center",
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  imageModalContainer: {
    backgroundColor: theme?.backgrounddos || "white",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 16,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  modalIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#eff6ff",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme?.text || "#1f2937",
    flex: 1,
    marginLeft: 16,
  },

  closeButton: {
    padding: 8,
  },

  modalButtonsContainer: {
    gap: 16,
  },

  modalActionButton: {
    backgroundColor: "#93b0b0",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },

  modalButtonIcon: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },

  // Confirmation Modal
  confirmationOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  confirmationContainer: {
    backgroundColor: theme?.backgrounddos || "white",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 16,
  },

  successIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#ecfdf5",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  confirmationText: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme?.text || "#1f2937",
    textAlign: "center",
  },

  // Country Modal
  countryModalContainer: {
    backgroundColor: theme?.backgrounddos || "white",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 16,
  },

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
    marginLeft: 8,
    color: "#e91e63",
    fontWeight: "600",
  },

  countryInput: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#f9fafb",
    color: theme?.text || "#1f2937",
  },

  countryButton: {
    backgroundColor: "#93b0b0",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },

  countryButtonDisabled: {
    backgroundColor: "#d1d5db",
  },

  countryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default getImageListStyles;