import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const getModernStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background || "#fefefe",
  },

  // Header de favoritos modernizado
  favoritesHeader: {
    backgroundColor: theme.background || "#fefefe",

    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(200, 216, 228, 0.1)",
    shadowColor: "#c8d8e4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  categoriesScrollContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },

  categoryChip: {
    marginRight: 4,
  },

  categoryChipContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef8e7",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 28,
    borderWidth: 0,
    borderColor: "transparent",
    shadowColor: "#fef8e7",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
    marginTop: 12,
  },

  categoryChipActive: {
    backgroundColor: "#b8d4f0",
    borderColor: "transparent",
    shadowColor: "#b8d4f0",
    shadowOpacity: 0.2,
    transform: [{ scale: 1.05 }],
  },

  categoryChipImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },

  categoryChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b5b73",
  },

  categoryChipTextActive: {
    color: "#4a5d7a",
    fontWeight: "700",
  },

  badgeContainer: {
    position: "absolute",
    top: -2,
    right: -8,
    backgroundColor: "#c8d8e4",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
    shadowColor: "#c8d8e4",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },

  badgeText: {
    color: "#6b5b73",
    fontSize: 12,
    fontWeight: "700",
  },

  // Tarjetas de historial
  historyCard: {
    width: width - 32,
    backgroundColor: "#f5f5f5",
    borderRadius: 24,
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 24,
    shadowColor: "#e0e8f0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 0,
    borderColor: "transparent",
    borderLeftWidth: 3,
    borderLeftColor: "#e0e8f0",
  },

  cardHeader: {
    marginBottom: 16,
  },

  editingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  editingInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: theme.text || "#1f2937",
    borderBottomWidth: 2,
    borderBottomColor: "#3b82f6",
    paddingVertical: 8,
  },

  confirmButton: {
    backgroundColor: "#ecfdf5",
    padding: 8,
    borderRadius: 8,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.text || "#2d3748",
    flex: 1,
  },

  titleActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  favoriteIndicator: {
    backgroundColor: "#ffb3b3",
    padding: 10,
    borderRadius: 12,
    borderWidth: 0,
    borderColor: "transparent",
    shadowColor: "#ffb3b3",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },

  editButton: {
    backgroundColor: "#b8d4f0",
    padding: 10,
    borderRadius: 12,
    shadowColor: "#b8d4f0",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },

  // Botones de acción
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 8,
  },

  actionButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    minHeight: 56,
  },

  deleteButton: {
    backgroundColor: "#b8d4f0",
    borderWidth: 0,
    borderColor: "transparent",
    shadowColor: "#b8d4f0",
    shadowOpacity: 0.15,
  },

  shareButton: {
    backgroundColor: "#c8d8e4",
    borderWidth: 0,
    borderColor: "transparent",
    shadowColor: "#c8d8e4",
    shadowOpacity: 0.15,
  },

  printButton: {
    backgroundColor: "#fef8e7",
    borderWidth: 0,
    borderColor: "transparent",
    shadowColor: "#fef8e7",
    shadowOpacity: 0.1,
  },

  addButton: {
    backgroundColor: "#b8d4f0",
    borderWidth: 0,
    borderColor: "transparent",
    shadowColor: "#b8d4f0",
    shadowOpacity: 0.15,
  },

  reminderButton: {
    backgroundColor: "rgba(255, 235, 179, 0.7)",
    borderWidth: 0,
    borderColor: "transparent",
    shadowColor: "#ffebb3",
    shadowOpacity: 0.1,
  },

  expandButton: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  // Recordatorio
  reminderContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fffbeb",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },

  reminderIcon: {
    marginRight: 8,
  },

  reminderText: {
    flex: 1,
    fontSize: 14,
    color: "#92400e",
    fontWeight: "500",
  },

  cancelReminderButton: {
    backgroundColor: "#fef2f2",
    padding: 6,
    borderRadius: 6,
  },

  // Contenido de la lista
  listContent: {
    maxHeight: 200,
    marginBottom: 16,
  },

  listItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },

  listItemBullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#b8d4f0",
    marginRight: 12,
    shadowColor: "#b8d4f0",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },

  completedBullet: {
    backgroundColor: "#a8d5a8",
  },

  listItemText: {
    fontSize: 16,
    color: theme.text || "#2d3748",
    flex: 1,
    fontWeight: "500",
  },

  completedItemText: {
    textDecorationLine: "line-through",
    color: "#9ca3af",
  },

  // Botón de favorito
  favoriteButton: {
    alignSelf: "flex-end",
  },

  favoriteIconContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  addFavoriteIcon: {
    position: "absolute",
    top: -4,
    right: -4,
  },

  // Estado vacío
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },

  emptyStateContent: {
    alignItems: "center",
  },

  emptyIconWrapper: {
    width: 120,
    height: 120,
    backgroundColor: "#ffffff",
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 3,
    borderColor: "#b8d4f0",
    shadowColor: "#b8d4f0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  emptyStateImage: {
    width: 80,
    height: 80,
    tintColor: "#6b7280",
  },

  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.text || "#2d3748",
    textAlign: "center",
    marginBottom: 32,
  },

  createListButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#b8d4f0",
    paddingHorizontal: 28,
    paddingVertical: 18,
    borderRadius: 20,
    shadowColor: "#b8d4f0",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0,
    borderColor: "transparent",
  },

  createListButtonText: {
    marginLeft: 12,
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Lista de historial
  historyList: {
    flex: 1,
  },

  historyListContainer: {
    paddingVertical: 16,
  },

  // Modales de favoritos - COMPLETAMENTE REDISEÑADOS
  favoritesModalContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 28,
    margin: 16,
    maxHeight: "85%",
    minHeight: height * 0.6,
    width: width - 32,
    shadowColor: "#d4a574",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 0,
    borderColor: "transparent",
    borderTopWidth: 4,
    borderTopColor: "#b8d4f0",
  },

  favoritesModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 28,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(200, 216, 228, 0.3)",
    minHeight: 90,
    backgroundColor: "rgba(254, 252, 243, 0.5)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  modalCategoryIcon: {
    width: 64,
    height: 64,
    backgroundColor: "#c8d8e4",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
    shadowColor: "#c8d8e4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 0,
    borderColor: "transparent",
  },

  modalCategoryImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  favoritesModalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.text || "#2d3748",
    flex: 1,
  },

  modalCloseButton: {
    padding: 14,
    backgroundColor: "#e8e8e8",
    borderRadius: 16,
    shadowColor: "#e8e8e8",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 0,
    borderColor: "transparent",
  },

  favoritesList: {
    flex: 1,
    minHeight: height * 0.4,
  },

  favoritesListContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Estado vacío mejorado y más grande
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
    minHeight: height * 0.35,
  },

  emptyIconContainer: {
    width: 120,
    height: 120,
    backgroundColor: "#fefcf3",
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    borderWidth: 3,
    borderColor: "#c8d8e4",
    shadowColor: "#c8d8e4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  emptyText: {
    fontSize: 18,
    color: theme.text || "#4a5568",
    textAlign: "center",
    lineHeight: 26,
    maxWidth: width * 0.7,
    fontWeight: "500",
  },

  // Items de favoritos más grandes
  favoriteItemCard: {
    backgroundColor: "#fefcf3",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 0,
    borderColor: "transparent",
    minHeight: 140,
    shadowColor: "#d4a574",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#b8d4f0",
  },

  favoriteItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  favoriteItemTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.text || "#2d3748",
    flex: 1,
  },

  removeFavoriteButton: {
    backgroundColor: "#e8e8e8",
    padding: 14,
    borderRadius: 14,
    borderWidth: 0,
    borderColor: "transparent",
    shadowColor: "#e8e8e8",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },

  favoriteItemList: {
    maxHeight: 100,
    marginBottom: 16,
  },

  favoriteItemText: {
    fontSize: 16,
    color: theme.text || "#4a5568",
    marginBottom: 6,
    lineHeight: 22,
    fontWeight: "500",
  },

  favoriteItemMore: {
    fontSize: 14,
    color: "#9ca3af",
    fontStyle: "italic",
  },

  favoriteItemActions: {
    flexDirection: "row",
    gap: 16,
  },

  favoriteActionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#c8d8e4",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 0,
    borderColor: "transparent",
    shadowColor: "#c8d8e4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  favoriteActionText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },

  // Modales generales
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 24,
    padding: 28,
    margin: 20,
    maxHeight: "80%",
    width: "90%",
    shadowColor: "#d4a574",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 0,
    borderColor: "transparent",
    borderTopWidth: 4,
    borderTopColor: "#b8d4f0",
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },

  modalTitleInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: theme.text || "#2d3748",
    borderBottomWidth: 2,
    borderBottomColor: "#ff6b9d",
    paddingVertical: 10,
  },

  saveButton: {
    backgroundColor: "#66bb6a",
    padding: 12,
    borderRadius: 12,
    shadowColor: "#66bb6a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 0,
    borderColor: "transparent",
  },

  modalContent: {
    maxHeight: 400,
  },

  modalItemInput: {
    fontSize: 16,
    color: theme.text || "#2d3748",
    borderBottomWidth: 2,
    borderBottomColor: "rgba(255, 107, 157, 0.5)",
    paddingVertical: 12,
    marginBottom: 10,
  },

  addItemButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginTop: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
  },

  addItemText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },

  // Modal de recordatorio
  reminderModalContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 20,
    padding: 32,
    margin: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },

  reminderIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#fffbeb",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  reminderModalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.text || "#1f2937",
    textAlign: "center",
    marginBottom: 12,
  },

  reminderModalText: {
    fontSize: 16,
    color: theme.text || "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },

  datePickerContainer: {
    marginBottom: 32,
  },

  reminderButtonsContainer: {
    width: "100%",
    gap: 12,
  },

  reminderButton: {
    backgroundColor: "rgba(255, 235, 179, 0.7)",
    borderWidth: 0,
    borderColor: "transparent",
    shadowColor: "#ffebb3",
    shadowOpacity: 0.1,
  },

  modalReminderButton: {
    backgroundColor: "#f59e0b",
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 250,
  },

  reminderButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  disabledButton: {
    backgroundColor: "#d1d5db",
  },

  cancelButton: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  cancelButtonText: {
    color: "#6b7280",
    fontSize: 16,
    fontWeight: "600",
  },

  // Modal de éxito
  successModalContainer: {
    backgroundColor: theme.backgrounddos || "white",
    borderRadius: 20,
    padding: 32,
    margin: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },

  successIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#ecfdf5",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.text || "#1f2937",
    textAlign: "center",
    marginBottom: 12,
  },

  successText: {
    fontSize: 16,
    color: theme.text || "#6b7280",
    textAlign: "center",
  },

  // Modal de selección de favoritos CORREGIDO
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  favoriteSelector: {
    backgroundColor: "#f5f5f5",
    borderRadius: 24,
    padding: 28,
    width: "100%",
    maxWidth: 420,
    shadowColor: "#cbd5e0",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 0,
    borderColor: "transparent",
    borderTopWidth: 4,
    borderTopColor: "#b8d4f0",
  },

  selectorHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 8,
  },

  selectorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.text || "#1f2937",
  },

  selectorSubtitle: {
    fontSize: 14,
    color: theme.text || "#6b7280",
    marginBottom: 20,
  },

  categoriesGrid: {
    flexDirection: "column",
    gap: 16,
  },

  categoryCard: {
    width: "100%",
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    position: "relative",
    shadowColor: "#cbd5e0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 70,
  },

  categoryCardSelected: {
    backgroundColor: "#e0f2fe",
    borderColor: "#b3e5fc",
    shadowColor: "#81d4fa",
    shadowOpacity: 0.2,
    transform: [{ scale: 1.02 }],
  },

  categoryCardImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 16,
  },

  categoryCardText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2d3748",
    flex: 1,
  },

  categoryCardTextSelected: {
    color: "#1e40af",
    fontWeight: "700",
  },

  selectedBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#10b981",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
    borderColor: "transparent",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
});

export default getModernStyles;