import { StyleSheet, Dimensions, Platform } from 'react-native';

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

  // Botón para expandir/colapsar favoritos
  favoritesToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.background || "#fefefe",
  },

  favoritesToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  heartIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },

  favoritesToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text || '#374151',
  },

  // Contenedor de filtros colapsables
  favoritesFilterContainer: {
    overflow: 'hidden',
    backgroundColor: theme.background || "#fefefe",
  },
  

  categoriesScrollContainer: {
    paddingHorizontal: 16,
    gap: 2,
  },

  categoryChip: {
    marginRight: 10,
  },

  categoryChipContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef8e7",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 28,
    borderWidth: 0,
    borderColor: "transparent",
    shadowColor: "#fef8e7",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
    marginTop: 8,
    minWidth: 140,
  },

  categoryChipActive: {
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
    backgroundColor: "#34c759",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
    shadowColor: "#34c759",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },

  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },

  // Tarjetas de historial
  historyCard: {
    width: width - 32,
marginBottom:-0,
    backgroundColor: "#ffffff67",
    borderRadius: 24,
    marginHorizontal: 16,
    marginVertical: 2,
    padding: 16,
    shadowColor: "#a8d5a8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 0,
    borderColor: "transparent",
    borderLeftWidth: 3,
    borderLeftColor: "#a8d5a8",
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
    fontSize: 18,
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
    maxWidth:45,
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

  // Botones de acción con scroll horizontal
  actionButtonsContainer: {
    marginBottom: 16,
  },
  
  actionButtonsRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },

  actionButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
    marginHorizontal: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  deleteButton: {
    backgroundColor: "rgba(55, 65, 81, 0.06)",
    borderWidth: 1.5,
    borderColor: "rgba(55, 65, 81, 0.15)",
  },

  shareButton: {
    backgroundColor: "rgba(34, 197, 94, 0.06)",
    borderWidth: 1.5,
    borderColor: "rgba(34, 197, 94, 0.15)",
  },

  printButton: {
    backgroundColor: "rgba(239, 68, 68, 0.06)",
    borderWidth: 1.5,
    borderColor: "rgba(239, 68, 68, 0.15)",
  },

  addButton: {
    backgroundColor: "rgba(251, 146, 60, 0.06)",
    borderWidth: 1.5,
    borderColor: "rgba(251, 146, 60, 0.15)",
  },

  reminderButton: {
    backgroundColor: "rgba(168, 85, 247, 0.06)",
    borderWidth: 1.5,
    borderColor: "rgba(168, 85, 247, 0.15)",
  },

  expandButton: {
    backgroundColor: "rgba(107, 114, 128, 0.06)",
    borderWidth: 1.5,
    borderColor: "rgba(107, 114, 128, 0.15)",
  },

  expandButtonBottom: {
    backgroundColor: "rgba(107, 114, 128, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(107, 114, 128, 0.15)",
    alignSelf: "center",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 4,
  },

  expandButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  expandButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6b7280",
  },

  // Recordatorio
  reminderContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fffbeb",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  reminderIcon: {
    backgroundColor: "#fde047",
    padding: 8,
    borderRadius: 20,
    marginRight: 12,
  },

  reminderText: {
    flex: 1,
    fontSize: 14,
    color: "#92400e",
    fontWeight: "600",
    lineHeight: 20,
  },

  cancelReminderButton: {
    backgroundColor: "#ef4444",
    padding: 8,
    borderRadius: 20,
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  // Contenido de la lista con scroll
  listContent: {

    marginBottom: 10,
    marginTop: 4,
  },
  
  listContentCollapsed: {
    maxHeight: 100,
    overflow: "hidden",
  },
  
  listContentExpanded: {
    maxHeight: 300,
  },

  moreItemsIndicator: {
    fontSize: 13,
    color: "#9ca3af",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 8,
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
    backgroundColor: "#a8d5a8",
    marginRight: 12,
    shadowColor:  "#a8d5a8",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },

  completedBullet: {
    backgroundColor:"#d92356a3",
  },

  listItemText: {
    fontSize: 18,
    color: theme.text || "#2d3748",
    flex: 1,
    fontWeight: "500",
  },

  completedItemText: {
    textDecorationLine: "line-through",
    color: "#9ca3af",
  },

  listItemCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.text === '#ffffff' ? '#4b5563' : '#d1d5db',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background || '#ffffff'
  },

  listItemCheckboxCompleted: {
    backgroundColor: '#10b981',
    borderColor: '#10b981'
  },

  listItemMainArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  listItemTextContainer: {
    flex: 1,
  },

  editIconButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: theme.background || '#ffffff',
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: theme.text === '#ffffff' ? '#4b5563' : '#e5e7eb',
  },

  completionCounter: {
    paddingHorizontal: 2,
    paddingVertical: 8,
    alignSelf: 'center',
  },

  completionText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.text === '#ffffff' ? '#9ca3af' : '#6b7280',
  },

  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  progressRingContainer: {
    width: 44,
    height: 14,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },

  progressRingBackground: {
    position: 'absolute',
    width: 35,
    height: 35,
    borderRadius: 22,
    borderWidth: 4,
    borderColor: theme.text === '#ffffff' ? '#374151' : '#e5e7eb',
  },

  progressRingFill: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 22,
    borderWidth: 4,
    borderColor: '#10b981',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },

  progressNumbersContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },

  progressNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.text === '#ffffff' ? '#9ca3af' : '#6b7280',
  },

  progressNumberActive: {
    color: '#10b981',
    fontWeight: '800',
  },

  progressSeparator: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.text === '#ffffff' ? '#9ca3af' : '#6b7280',
    marginHorizontal: 1,
  },

  progressTotal: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.text === '#ffffff' ? '#9ca3af' : '#6b7280',
  },

  // New progress bar styles
  progressBarContainer: {
    paddingHorizontal: 4,
    paddingVertical: 8,
    alignSelf: 'center',
  },

  progressBarBackground: {
    width: 120,
    height: 6,
    backgroundColor: theme.text === '#ffffff' ? '#374151' : '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 3,
    minWidth: 2,
  },

  deleteListButton: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },

  deleteListText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
    marginLeft: 6
  },

  // Estilos para edición de items
  listItemEditContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    marginVertical: 2,
    borderWidth: 2,
    borderColor: "#3b82f6",
  },

  listItemEditInput: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
    backgroundColor: "#ffffff",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },

  saveItemButton: {
    backgroundColor: "#ecfdf5",
    padding: 8,
    borderRadius: 20,
    marginLeft: 8,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  cancelItemButton: {
    backgroundColor: "#fef2f2",
    padding: 6,
    borderRadius: 18,
    marginLeft: 6,
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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

  },

  emptyStateTitle: {
    fontSize: 20,
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

width: "95%",
    height: "85%",
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

  // Footer del modal de favoritos
  favoritesModalFooter: {
    borderTopWidth: 1,
    borderTopColor: "rgba(200, 216, 228, 0.3)",
    backgroundColor: "rgba(254, 252, 243, 0.5)",
    padding: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  addButtonFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },

  addButtonFooterText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
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
    padding: 10,
    backgroundColor: "#e8e8e8",
    borderRadius: 12,
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
    alignItems: "center",
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
    color: "#2d3748",
  },

  // Botón de expandir para items de favoritos
  favoriteExpandButton: {
    backgroundColor: "#e8f4fd",
    borderWidth: 1.5,
    borderColor: "#b8d4f0",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#b8d4f0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  favoriteExpandText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#4a5d7a",
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
    height: "85%",
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
    marginBottom:60,
   
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
    backgroundColor: "rgba(168, 85, 247, 0.06)",
    borderWidth: 1.5,
    borderColor: "rgba(168, 85, 247, 0.15)",
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
    height: "80%",
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

  // Modal de lista expandida - PANTALLA COMPLETA
  expandedListModalContainer: {
    backgroundColor: theme.background || "#ffffff",
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },

  expandedModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(229, 231, 235, 0.3)",
    backgroundColor: theme.background || "#ffffff",
  },

  expandedModalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.text || "#1f2937",
    flex: 1,
  },

  expandedModalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  expandedListItem: {
    marginBottom: 4,
  },

  expandedListItemContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "rgba(249, 250, 251, 0.4)",
    marginHorizontal: 4,
  },

  expandedCheckbox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#d1d5db",
    marginRight: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },

  expandedCheckboxCompleted: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },

  expandedListItemText: {
    fontSize: 18,
    color: theme.text || "#1f2937",
    flex: 1,
    fontWeight: "500",
    lineHeight: 24,
  },

  expandedListItemTextCompleted: {
    textDecorationLine: "line-through",
    color: "#9ca3af",
    fontWeight: "400",
  },

  // Estilos para edición en modal expandido
  expandedListItemEditContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
    borderWidth: 2,
    borderColor: "#3b82f6",
  },

  expandedListItemEditInput: {
    flex: 1,
    fontSize: 18,
    color: "#1f2937",
    fontWeight: "500",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginLeft: 16,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },

  expandedSaveItemButton: {
    backgroundColor: "#dcfce7",
    padding: 10,
    borderRadius: 24,
    marginLeft: 12,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  expandedCancelItemButton: {
    backgroundColor: "#fef2f2",
    padding: 8,
    borderRadius: 20,
    marginLeft: 8,
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  expandedItemActions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },

  expandedEditButton: {
    backgroundColor: "#f3f4f6",
    padding: 6,
    borderRadius: 16,
    marginRight: 8,
    shadowColor: "#6b7280",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  expandedDeleteButton: {
    backgroundColor: "#fef2f2",
    padding: 6,
    borderRadius: 16,
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  fixedAddButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#10b981",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 3,
    borderColor: "#ffffff",
  },

  expandedModalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(229, 231, 235, 0.5)",
    alignItems: "center",
  },

  expandedModalProgress: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "600",
  },

  // Botón para agregar favoritos desde historial
  addFavoriteButton: {
    alignItems: "center",
    marginTop: 20,
    padding: 16,
  },

  addFavoriteText: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },

  // Botón para agregar desde historial cuando está vacío
  addFavoriteFromEmptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 24,
    borderWidth: 1.5,
    borderColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  addFavoriteFromEmptyText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
    marginLeft: 10,
  },

  // Estilos para el selector de listas del historial
  historyListSelector: {
    maxHeight: 400,
    padding: 16,
  },

  historyListItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(249, 250, 251, 0.8)",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(229, 231, 235, 0.5)",
  },

  historyListItemContent: {
    flex: 1,
    marginRight: 12,
  },

  historyListItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.text || "#1f2937",
    marginBottom: 4,
  },

  historyListItemCount: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 6,
  },

  historyListPreview: {
    marginTop: 4,
  },

  previewText: {
    fontSize: 12,
    color: "#9ca3af",
    lineHeight: 16,
  },

  previewMore: {
    fontSize: 12,
    color: "#6b7280",
    fontStyle: "italic",
  },

  // Modalize styles
  modalizeHandle: {
    backgroundColor: "#d1d5db",
    width: 40,
    height: 4,
    borderRadius: 2,
  },

  modalizeContainer: {
    backgroundColor: theme.background || "#fefefe",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: 20,
  },

  // Navigation container with arrows and dots
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },

  // Dots indicator para paginación horizontal
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    maxWidth: 220, // Limitar ancho máximo para que siempre se vean las flechas
    overflow: "hidden",
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(168, 213, 168, 0.3)",
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "rgba(168, 213, 168, 0.5)",
  },

  smallDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: "#a8d5a8",
    borderColor: "#a8d5a8",
    transform: [{ scale: 1.2 }],
    shadowColor: "#a8d5a8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },

  // Arrow buttons for navigation
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(168, 213, 168, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(168, 213, 168, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#a8d5a8",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  arrowButtonDisabled: {
    backgroundColor: "rgba(209, 213, 219, 0.1)",
    borderColor: "rgba(209, 213, 219, 0.2)",
    shadowOpacity: 0,
    elevation: 0,
  },

  // Single menu button styles
  singleMenuButtonContainer: {

  },

  menuButton: {
    width: 34,
    height: 34,
    borderRadius: 52,
    backgroundColor: "rgba(168, 213, 168, 0.35)",
    borderWidth: 1,
    borderColor: "rgba(168, 213, 168, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#a8d5a8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  // Actions modal styles
  actionsModal: {
    backgroundColor: theme.background || "#ffffff",
    borderRadius: 20,
    maxHeight: "90%",
    width: "99%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  
  },

  actionsModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(229, 231, 235, 0.3)",
  },

  actionsModalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.text || "#1f2937",
  },

  actionsModalContent: {
    padding: 20,
    paddingTop: 10,
  },

  actionModalButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 4,
    marginBottom: 8,
  },

    actionModalButtonexpand: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,

  },

  actionModalIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  actionModalTextContainer: {
    flex: 1,
  },

  actionModalButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.text || "#1f2937",
    marginBottom: 2,
  },

  actionModalButtonSubtext: {
    fontSize: 13,
    color: theme.text || "#6b7280",
    opacity: 0.7,
  },
});

export default getModernStyles;