import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Animated
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTheme } from '../ThemeContext'
import * as RNLocalize from 'react-native-localize'
import translationsHistorial from '../screens/translations/translationsHistorial'
import AddItemModal from './AddItemModal'

const ExpandedListModal = ({
  visible,
  onClose,
  listData,
  completedItems,
  onToggleItem,
  onSaveItem,
  onDeleteItem,
  onAddItem,
  onSaveList,
  onDeleteList,
  markedLists,
  onSwitchList,
  autoOpenAddModal = false
}) => {
  const { theme } = useTheme()
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  const currentLabels = translationsHistorial[deviceLanguage] || translationsHistorial["en"]
  
  const [editingItemIndex, setEditingItemIndex] = useState(null)
  const [editingItemText, setEditingItemText] = useState("")
  const [listSwitcherVisible, setListSwitcherVisible] = useState(false)
  const [showAddItemModal, setShowAddItemModal] = useState(false)
  const [selectedItemForMove, setSelectedItemForMove] = useState(null)
  const scrollViewRef = useRef(null)
  const progressAnimation = useRef(new Animated.Value(0)).current

  // Debug logging
  useEffect(() => {
    console.log('ExpandedListModal - markedLists:', markedLists)
    console.log('ExpandedListModal - markedLists length:', markedLists?.length)
  }, [markedLists])

  useEffect(() => {
    const progress = getTotalCount() > 0 ? (getCompletedCount() / getTotalCount()) : 0
    Animated.spring(progressAnimation, {
      toValue: progress,
      friction: 8,
      tension: 40,
      useNativeDriver: false
    }).start()
  }, [completedItems, listData])

  // Auto-abrir modal de añadir productos si autoOpenAddModal es true
  useEffect(() => {
    if (visible && autoOpenAddModal) {
      setTimeout(() => {
        setShowAddItemModal(true)
      }, 500) // Pequeño delay para que se abra el ExpandedListModal primero
    }
  }, [visible, autoOpenAddModal])

  const handleEditItem = (itemIndex, itemText) => {
    setEditingItemIndex(itemIndex)
    setEditingItemText(itemText)
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          y: itemIndex * 80,
          animated: true
        })
      }
    }, 300)
  }

  const handleSaveEdit = () => {
    if (editingItemIndex !== null && onSaveItem) {
      onSaveItem(editingItemIndex, editingItemText)
      setEditingItemIndex(null)
      setEditingItemText("")
    }
  }

  const handleCancelEdit = () => {
    setEditingItemIndex(null)
    setEditingItemText("")
  }

  const handleDeleteItem = (itemIndex) => {
    if (onDeleteItem) {
      onDeleteItem(itemIndex)
    }
    // Cancel editing if we're editing the deleted item
    if (editingItemIndex === itemIndex) {
      handleCancelEdit()
    }
  }

  const handleAddNewItem = () => {
    // Show the new add item modal instead of adding empty items
    setShowAddItemModal(true)
  }

  const handleAddItemFromModal = (item) => {
    // Add the formatted item from the modal
    if (onAddItem) {
      onAddItem(item)
    }
    // Scroll to the bottom to show the new item
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true })
      }
    }, 100)
  }

  const getCompletedCount = () => {
    // Filter to only include valid indices for this list
    const totalItems = getTotalCount()
    const validCompletedItems = (completedItems || []).filter(index =>
      index >= 0 && index < totalItems
    )
    return validCompletedItems.length
  }

  const getTotalCount = () => {
    return listData?.list?.length || 0
  }

  const areAllItemsCompleted = () => {
    const totalItems = getTotalCount()
    const completedCount = getCompletedCount()
    return totalItems > 0 && completedCount === totalItems
  }

  const extractItemName = (item) => {
    const itemText = typeof item === 'string' ? item : item.text || item.name || String(item)

    // If the item contains " - ", extract everything after the first " - "
    if (itemText.includes(' - ')) {
      const parts = itemText.split(' - ')
      if (parts.length >= 2) {
        // Get everything after the first " - " and remove extra details like quantity, price, store indicator
        let itemName = parts.slice(1).join(' - ')

        // Remove quantity info like (x2), (500g), etc.
        itemName = itemName.replace(/\s*\([^)]*\)\s*/g, '')

        // Remove price info like " - $5.50"
        itemName = itemName.replace(/\s*-\s*\$[\d.,]+\s*/g, '')

        // Remove store indicator emoji
        itemName = itemName.replace(/\s*🏪\s*$/, '')

        return itemName.trim()
      }
    }

    // If no " - " found, return the original text
    return itemText
  }

  const extractCategoryName = (item) => {
    const itemText = typeof item === 'string' ? item : item.text || item.name || String(item)

    // If the item contains " - ", extract everything before the first " - "
    if (itemText.includes(' - ')) {
      const parts = itemText.split(' - ')
      return parts[0].trim()
    }

    // If no " - " found, return "Sin categoría"
    return currentLabels.noCategory || "Sin categoría"
  }

  // Default categories mapping for icons
  const categoryIconMap = {
    'Supermercado': 'cart',
    'Farmacia': 'medkit',
    'Mascotas': 'paw',
    'Hogar y Limpieza': 'home',
    'Bebidas': 'wine',
    'Panadería': 'restaurant',
    'Carnicería': 'nutrition',
    'Frutas y Verduras': 'leaf',
    'Electrónica': 'phone-portrait',
    'Ropa': 'shirt',
    'Congelados': 'snow',
    'Lácteos': 'nutrition',
    [currentLabels.noCategory || 'Sin categoría']: 'list'
  }

  const getCategoryIcon = (categoryName) => {
    // Check if it's a translated category name
    if (categoryName === currentLabels.supermarket) return 'cart'
    if (categoryName === currentLabels.pharmacy) return 'medkit'
    if (categoryName === currentLabels.electronics) return 'phone-portrait'
    if (categoryName === currentLabels.homeAndCleaning) return 'home'
    if (categoryName === currentLabels.beverages) return 'wine'
    if (categoryName === currentLabels.butcher) return 'nutrition'

    // Fall back to original mapping
    return categoryIconMap[categoryName] || 'list'
  }

  const groupItemsByCategory = () => {
    if (!listData?.list) return { categorizedItems: [], uncategorizedItems: [] }

    const grouped = {}
    const uncategorized = []

    listData.list.forEach((item, index) => {
      const categoryName = extractCategoryName(item)

      if (categoryName === (currentLabels.noCategory || "Sin categoría")) {
        // Add uncategorized items to separate array
        uncategorized.push({ item, originalIndex: index })
      } else {
        // Group categorized items
        if (!grouped[categoryName]) {
          grouped[categoryName] = []
        }
        grouped[categoryName].push({ item, originalIndex: index })
      }
    })

    const categorizedItems = Object.keys(grouped).map(categoryName => ({
      categoryName,
      icon: getCategoryIcon(categoryName),
      items: grouped[categoryName]
    }))

    return { categorizedItems, uncategorizedItems: uncategorized }
  }

  const moveItemToCategory = (itemIndex, targetCategory) => {
    if (!onSaveItem || !listData?.list) return

    const item = listData.list[itemIndex]
    const itemName = extractItemName(item)
    const newItemText = targetCategory === 'none' ? itemName : `${targetCategory} - ${itemName}`

    onSaveItem(itemIndex, newItemText)
    setSelectedItemForMove(null)
  }

  const styles = StyleSheet.create({
    expandedListModalContainer: {
      flex: 1,
      backgroundColor: "#e7ead2",
    },
    expandedModalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: Platform.OS === 'ios' ? 50 : 20,
      paddingBottom: 20,
      borderBottomWidth: 0,
      backgroundColor: 'rgba(34, 197, 94, 0.08)',
      borderRadius: 0,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      shadowColor: '#22c55e',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5
    },
    expandedModalTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: '#15803d',
      flex: 1,
      marginRight: 15,
      letterSpacing: -0.5
    },
    
    headerActions: {
      flexDirection: 'row',
      gap: 10
    },
    headerButton: {
      padding: 12,
      borderRadius: 16,
      backgroundColor: 'rgba(34, 197, 94, 0.12)',
      borderWidth: 1.5,
      borderColor: 'rgba(22, 163, 74, 0.25)',
      shadowColor: '#16a34a',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 4,
      minWidth: 50,
      justifyContent: 'center',
      alignItems: 'center'
    },
    saveButton: {
      backgroundColor: '#15803d',
      borderColor: '#15803d',
      shadowColor: '#15803d',
      shadowOpacity: 0.3
    },
    closeButton: {
      backgroundColor: 'rgba(34, 197, 94, 0.08)',
      borderColor: 'rgba(22, 163, 74, 0.2)'
    },
    expandedModalContent: {
      flex: 1,
      paddingHorizontal: 20
    },
    expandedListItem: {
      marginVertical: 8
    },
    expandedListItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f9fafb',
      borderRadius: 12,
      padding: 15,
      minHeight: 60
    },
    expandedCheckbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
      marginRight: 15,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff'
    },
    expandedCheckboxCompleted: {
      backgroundColor: '#10b981',
      borderColor: '#10b981'
    },
    expandedListItemText: {
      flex: 1,
      fontSize: 16,
      color: theme === 'dark' ? '#fff' : '#374151',
      marginRight: 10
    },
    expandedListItemTextCompleted: {
      textDecorationLine: 'line-through',
      color: theme === 'dark' ? '#9ca3af' : '#9ca3af'
    },
    expandedItemActions: {
      flexDirection: 'row',
      gap: 8
    },
    expandedEditButton: {
      padding: 6,
      borderRadius: 6,
      backgroundColor: theme === 'dark' ? '#374151' : '#e5e7eb'
    },
    expandedDeleteButton: {
      padding: 6,
      borderRadius: 6,
      backgroundColor: theme === 'dark' ? '#374151' : '#fee2e2'
    },
    expandedListItemEditContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f9fafb',
      borderRadius: 12,
      padding: 15,
      marginVertical: 8,
      borderWidth: 2,
      borderColor: '#3b82f6'
    },
    expandedListItemEditInput: {
      flex: 1,
      fontSize: 16,
      color: theme === 'dark' ? '#fff' : '#374151',
      marginHorizontal: 15,
      padding: 8,
      borderRadius: 6,
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db'
    },
    expandedSaveItemButton: {
      padding: 8,
      borderRadius: 6,
      backgroundColor: '#dcfce7',
      marginRight: 5
    },
    expandedCancelItemButton: {
      padding: 8,
      borderRadius: 6,
      backgroundColor: '#fee2e2'
    },
    expandedModalFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: theme === 'dark' ? '#374151' : '#e5e7eb',
      backgroundColor: "#e7ead2",
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3
    },
    progressNumbersContainer: {
      position: 'absolute',
      flexDirection: 'row',
      alignItems: 'center'
    },
    expandedModalProgress: {
      fontSize: 14,
      fontWeight: '700',
      color: theme === 'dark' ? '#9ca3af' : '#6b7280'
    },
    expandedModalProgressActive: {
      color: '#10b981',
      fontWeight: '800'
    },
    expandedModalProgressSeparator: {
      fontSize: 14,
      fontWeight: '700',
      color: theme === 'dark' ? '#9ca3af' : '#6b7280',
      marginHorizontal: 1
    },
    expandedModalProgressTotal: {
      fontSize: 14,
      fontWeight: '700',
      color: theme === 'dark' ? '#9ca3af' : '#6b7280'
    },
    addButtonFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? '#059669' : '#dcfce7',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#10b981',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2
    },
    addButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme === 'dark' ? '#ffffff' : '#059669',
      marginLeft: 6
    },
    deleteListButtonFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#ef4444',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2
    },
    deleteButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#ef4444',
      marginLeft: 6
    },
    progressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12
    },
    progressRingContainer: {
      width: 44,
      height: 44,
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center'
    },
    progressRingBackground: {
      position: 'absolute',
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 4,
      borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'
    },
    progressRingFill: {
      position: 'absolute',
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 4,
      borderColor: '#10b981',
      borderTopColor: 'transparent',
      borderRightColor: 'transparent'
    },
    progressCheckmark: {
      position: 'absolute'
    },
    categorySection: {
      marginVertical: 10
    },
    categoryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: theme === 'dark' ? '#374151' : '#f1f5f9',
      borderRadius: 12,
      marginBottom: 8,
      borderLeftWidth: 4,
      borderLeftColor: '#10b981'
    },
    categoryIcon: {
      marginRight: 10
    },
    categoryTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme === 'dark' ? '#f9fafb' : '#374151',
      flex: 1
    },
    categoryCount: {
      backgroundColor: '#10b981',
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 2,
      minWidth: 24,
      alignItems: 'center',
      justifyContent: 'center'
    },
    categoryCountText: {
      fontSize: 12,
      fontWeight: '600',
      color: 'white'
    }
  })

  if (!listData) return null

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={false}
      presentationStyle="fullScreen"
    >
      <KeyboardAvoidingView 
        style={styles.expandedListModalContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={styles.expandedModalHeader}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1
          }}>
            <TouchableOpacity
              onPress={() => {
                console.log('===== LIST BUTTON PRESSED =====')
                console.log('markedLists exists?', !!markedLists)
                console.log('markedLists length:', markedLists?.length)
                console.log('markedLists content:', markedLists)
                console.log('listSwitcherVisible before:', listSwitcherVisible)

                if (markedLists && markedLists.length > 0) {
                  console.log('Setting listSwitcherVisible to true')
                  setListSwitcherVisible(true)
                } else {
                  console.log('Not opening modal - no marked lists or empty')
                }
              }}
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
                borderWidth: 1.5,
                borderColor: 'rgba(22, 163, 74, 0.3)',
                opacity: markedLists && markedLists.length > 0 ? 1 : 0.7
              }}
            >
              <Ionicons name="menu" size={22} color="#073bf5ff" />
              {markedLists && markedLists.length > 0 && (
                <View style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  backgroundColor: '#073bf5b8',
                  borderRadius: 10,
                  width: 20,
                  height: 20,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text style={{ color: 'white', fontSize: 11, fontWeight: 'bold' }}>
                    {markedLists.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <Text style={styles.expandedModalTitle}>{listData.name}</Text>
          </View>
          <View style={styles.headerActions}>
            {onSaveList && (
              <TouchableOpacity
                onPress={onSaveList}
                style={[styles.headerButton, styles.saveButton]}
              >
                <Ionicons name="checkmark" size={24} color="#ffffff" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={onClose}
              style={[styles.headerButton, styles.closeButton]}
            >
              <Ionicons name="close" size={24} color="#15803d" />
            </TouchableOpacity>
          </View>
        </View>
        
        {selectedItemForMove !== null && (
          <View style={{
            backgroundColor: '#10b981',
            padding: 12,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20
          }}>
            <Text style={{
              color: 'white',
              fontSize: 14,
              fontWeight: '600'
            }}>
{currentLabels.itemSelected || 'Item seleccionado'}
            </Text>
            <TouchableOpacity
              onPress={() => setSelectedItemForMove(null)}
              style={{
                backgroundColor: 'rgba(255,255,255,0.3)',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 6
              }}
            >
              <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                {currentLabels.cancelSelection || 'CANCELAR'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView
          ref={scrollViewRef}
          style={styles.expandedModalContent}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          {(() => {
            const { categorizedItems, uncategorizedItems } = groupItemsByCategory()

            return (
              <>
                {/* Render uncategorized items first - without header */}


                {uncategorizedItems.map(({ item, originalIndex }) => (
                  <View key={originalIndex}>
                    {editingItemIndex === originalIndex ? (
                      // Modo edición
                      <View style={styles.expandedListItemEditContainer}>
                        <View
                          style={[
                            styles.expandedCheckbox,
                            completedItems?.includes(originalIndex) && styles.expandedCheckboxCompleted
                          ]}
                        >
                          {completedItems?.includes(originalIndex) && (
                            <Ionicons name="checkmark" size={20} color="white" />
                          )}
                        </View>
                        <TextInput
                          style={styles.expandedListItemEditInput}
                          value={editingItemText}
                          onChangeText={setEditingItemText}
                          onSubmitEditing={handleSaveEdit}
                          autoFocus
                          selectTextOnFocus
                        />
                        <TouchableOpacity
                          onPress={handleSaveEdit}
                          style={styles.expandedSaveItemButton}
                        >
                          <Ionicons name="checkmark" size={20} color="#10b981" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleDeleteItem(originalIndex)}
                          style={styles.expandedCancelItemButton}
                        >
                          <Ionicons name="trash-outline" size={18} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      // Modo normal
                      <>
                        <TouchableOpacity
                          onPress={() => {
                            if (selectedItemForMove === originalIndex) {
                              setSelectedItemForMove(null)
                            } else if (onToggleItem) {
                              onToggleItem(originalIndex)
                            }
                          }}
                          onLongPress={() => {
                            setSelectedItemForMove(originalIndex)
                          }}
                          delayLongPress={300}
                          style={[
                            styles.expandedListItem,
                            selectedItemForMove === originalIndex && {
                              backgroundColor: 'rgba(16, 185, 129, 0.2)',
                              borderWidth: 2,
                              borderColor: '#10b981'
                            }
                          ]}
                        >
                          <View style={styles.expandedListItemContent}>
                            <View
                              style={[
                                styles.expandedCheckbox,
                                completedItems?.includes(originalIndex) && styles.expandedCheckboxCompleted
                              ]}
                            >
                              {completedItems?.includes(originalIndex) && (
                                <Ionicons name="checkmark" size={20} color="white" />
                              )}
                            </View>
                            <Text
                              style={[
                                styles.expandedListItemText,
                                completedItems?.includes(originalIndex) && styles.expandedListItemTextCompleted
                              ]}
                            >
                              {extractItemName(item)}
                            </Text>
                            <View style={styles.expandedItemActions}>
                              <TouchableOpacity
                                onPress={() => {
                                  const itemText = extractItemName(item)
                                  handleEditItem(originalIndex, itemText)
                                }}
                                style={styles.expandedEditButton}
                              >
                                <Ionicons name="pencil" size={14} color={theme === 'dark' ? '#fff' : '#6b7280'} />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => {
                                  setSelectedItemForMove(originalIndex)
                                }}
                                style={styles.expandedEditButton}
                              >
                                <Ionicons name="move" size={16} color="#10b981" />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </TouchableOpacity>

                        {/* Mostrar categorías justo debajo del item seleccionado */}
                        {selectedItemForMove === originalIndex && (
                          <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>
                            {[
                              currentLabels.supermarket || 'Supermercado',
                              currentLabels.pharmacy || 'Farmacia',
                              currentLabels.electronics || 'Electrónica',
                              currentLabels.homeAndCleaning || 'Hogar y Limpieza',
                              currentLabels.beverages || 'Bebidas',
                              currentLabels.butcher || 'Carnicería'
                            ].map((categoryName) => (
                              <TouchableOpacity
                                key={categoryName}
                                onPress={() => {
                                  moveItemToCategory(selectedItemForMove, categoryName)
                                }}
                                style={{
                                  backgroundColor: '#10b981',
                                  padding: 10,
                                  marginVertical: 3,
                                  borderRadius: 8,
                                  flexDirection: 'row',
                                  alignItems: 'center'
                                }}
                              >
                                <Ionicons
                                  name={getCategoryIcon(categoryName)}
                                  size={20}
                                  color="white"
                                  style={{ marginRight: 8 }}
                                />
                                <Text style={{
                                  color: 'white',
                                  fontSize: 14,
                                  fontWeight: '600'
                                }}>
                                  {categoryName}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </>
                    )}
                  </View>
                ))}


                {/* Render categorized items with headers after uncategorized */}
                {categorizedItems.map((categoryGroup, groupIndex) => (
                  <View key={groupIndex} style={styles.categorySection}>
                    {/* Category Header */}
                    <View style={styles.categoryHeader}>
                      <Ionicons
                        name={categoryGroup.icon}
                        size={20}
                        color="#10b981"
                        style={styles.categoryIcon}
                      />
                      <Text style={styles.categoryTitle}>
                        {categoryGroup.categoryName}
                      </Text>
                      <View style={styles.categoryCount}>
                        <Text style={styles.categoryCountText}>
                          {categoryGroup.items.length}
                        </Text>
                      </View>
                    </View>

                    {/* Category Items */}
                    {categoryGroup.items.map(({ item, originalIndex }) => (
                      <View key={originalIndex}>
                        {editingItemIndex === originalIndex ? (
                          // Modo edición
                          <View style={styles.expandedListItemEditContainer}>
                            <View
                              style={[
                                styles.expandedCheckbox,
                                completedItems?.includes(originalIndex) && styles.expandedCheckboxCompleted
                              ]}
                            >
                              {completedItems?.includes(originalIndex) && (
                                <Ionicons name="checkmark" size={20} color="white" />
                              )}
                            </View>
                            <TextInput
                              style={styles.expandedListItemEditInput}
                              value={editingItemText}
                              onChangeText={setEditingItemText}
                              onSubmitEditing={handleSaveEdit}
                              autoFocus
                              selectTextOnFocus
                            />
                            <TouchableOpacity
                              onPress={handleSaveEdit}
                              style={styles.expandedSaveItemButton}
                            >
                              <Ionicons name="checkmark" size={20} color="#10b981" />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => handleDeleteItem(originalIndex)}
                              style={styles.expandedCancelItemButton}
                            >
                              <Ionicons name="trash-outline" size={18} color="#ef4444" />
                            </TouchableOpacity>
                          </View>
                        ) : (
                          // Modo normal
                          <TouchableOpacity
                            onPress={() => {
                              if (selectedItemForMove === originalIndex) {
                                setSelectedItemForMove(null)
                              } else if (onToggleItem) {
                                onToggleItem(originalIndex)
                              }
                            }}
                            onLongPress={() => {
                              setSelectedItemForMove(originalIndex)
                            }}
                            delayLongPress={300}
                            style={[
                              styles.expandedListItem,
                              selectedItemForMove === originalIndex && {
                                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                                borderWidth: 2,
                                borderColor: '#10b981'
                              }
                            ]}
                          >
                            <View style={styles.expandedListItemContent}>
                              <View
                                style={[
                                  styles.expandedCheckbox,
                                  completedItems?.includes(originalIndex) && styles.expandedCheckboxCompleted
                                ]}
                              >
                                {completedItems?.includes(originalIndex) && (
                                  <Ionicons name="checkmark" size={20} color="white" />
                                )}
                              </View>
                              <Text
                                style={[
                                  styles.expandedListItemText,
                                  completedItems?.includes(originalIndex) && styles.expandedListItemTextCompleted
                                ]}
                              >
                                {extractItemName(item)}
                              </Text>
                              <View style={styles.expandedItemActions}>
                                <TouchableOpacity
                                  onPress={() => {
                                    const itemText = extractItemName(item)
                                    handleEditItem(originalIndex, itemText)
                                  }}
                                  style={styles.expandedEditButton}
                                >
                                  <Ionicons name="pencil" size={14} color={theme === 'dark' ? '#fff' : '#6b7280'} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => {
                                    setSelectedItemForMove(originalIndex)
                                  }}
                                  style={styles.expandedEditButton}
                                >
                                  <Ionicons name="move" size={16} color="#10b981" />
                                </TouchableOpacity>
                              </View>
                            </View>
                          </TouchableOpacity>
                        )}

                        {/* Mostrar categorías justo debajo del item seleccionado */}
                        {selectedItemForMove === originalIndex && (
                          <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>
                            {[
                              currentLabels.supermarket || 'Supermercado',
                              currentLabels.pharmacy || 'Farmacia',
                              currentLabels.electronics || 'Electrónica',
                              currentLabels.homeAndCleaning || 'Hogar y Limpieza',
                              currentLabels.beverages || 'Bebidas',
                              currentLabels.butcher || 'Carnicería'
                            ].map((categoryName) => (
                              <TouchableOpacity
                                key={categoryName}
                                onPress={() => {
                                  moveItemToCategory(selectedItemForMove, categoryName)
                                }}
                                style={{
                                  backgroundColor: '#10b981',
                                  padding: 10,
                                  marginVertical: 3,
                                  borderRadius: 8,
                                  flexDirection: 'row',
                                  alignItems: 'center'
                                }}
                              >
                                <Ionicons
                                  name={getCategoryIcon(categoryName)}
                                  size={20}
                                  color="white"
                                  style={{ marginRight: 8 }}
                                />
                                <Text style={{
                                  color: 'white',
                                  fontSize: 14,
                                  fontWeight: '600'
                                }}>
                                  {categoryName}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                ))}
              </>
            )
          })()}
        </ScrollView>
        
        <View style={styles.expandedModalFooter}>
          <View style={styles.progressContainer}>
            <View style={styles.progressRingContainer}>
              <View style={styles.progressRingBackground} />
              <Animated.View
                style={[
                  styles.progressRingFill,
                  {
                    opacity: getCompletedCount() === 0 ? 0 : 1,
                    transform: [{
                      rotate: progressAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['-90deg', '270deg']
                      })
                    }]
                  }
                ]}
              />
              {areAllItemsCompleted() ? (
                <Ionicons name="checkmark-circle" size={40} color="#10b981" style={styles.progressCheckmark} />
              ) : (
                <View style={styles.progressNumbersContainer}>
                  <Text style={[
                    styles.expandedModalProgress,
                    getCompletedCount() > 0 && styles.expandedModalProgressActive
                  ]}>
                    {getCompletedCount()}
                  </Text>
                  <Text style={styles.expandedModalProgressSeparator}>/</Text>
                  <Text style={styles.expandedModalProgressTotal}>
                    {getTotalCount()}
                  </Text>
                </View>
              )}
            </View>
          </View>
          {(onAddItem || onDeleteList) && (
            <TouchableOpacity
              onPress={areAllItemsCompleted() && onDeleteList ? onDeleteList : handleAddNewItem}
              style={areAllItemsCompleted() ? styles.deleteListButtonFooter : styles.addButtonFooter}
            >
              <Ionicons
                name={areAllItemsCompleted() ? "trash-outline" : "add-circle-outline"}
                size={20}
                color={areAllItemsCompleted() ? "#ef4444" : (theme === 'dark' ? "#ffffff" : "#059669")}
              />
              <Text style={areAllItemsCompleted() ? styles.deleteButtonText : styles.addButtonText}>
                {areAllItemsCompleted() 
                  ? (currentLabels.deleteList || 'Eliminar lista')
                  : (currentLabels.addNewItembutton || 'Añadir')
                }
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
 
      </KeyboardAvoidingView>

      {/* Modal para cambiar entre listas marcadas */}
      <Modal
        visible={listSwitcherVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setListSwitcherVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          activeOpacity={1}
          onPress={() => setListSwitcherVisible(false)}
        >
          <View style={{
            backgroundColor: theme === 'dark' ? '#2a2a2a' : '#ffffff',
            borderRadius: 20,
            padding: 20,
            width: '85%',
            maxHeight: '70%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
              paddingBottom: 15,
              borderBottomWidth: 1,
              borderBottomColor: theme === 'dark' ? '#374151' : '#e5e7eb'
            }}>
              <View style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12
              }}>
                <Ionicons name="list" size={20} color="#15803d" />
              </View>
              <Text style={{
                fontSize: 18,
                fontWeight: '700',
                color: theme === 'dark' ? '#f9fafb' : '#1f2937',
                flex: 1
              }}>
                {currentLabels.switchList || 'Cambiar lista'}
              </Text>
              <TouchableOpacity
                onPress={() => setListSwitcherVisible(false)}
                style={{
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6'
                }}
              >
                <Ionicons name="close" size={20} color={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {markedLists && markedLists.map((list, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    if (onSwitchList && list.index !== listData.index) {
                      onSwitchList(list)
                      setListSwitcherVisible(false)
                    }
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 15,
                    marginVertical: 5,
                    borderRadius: 12,
                    backgroundColor: list.index === listData.index
                      ? 'rgba(34, 197, 94, 0.1)'
                      : (theme === 'dark' ? '#1a1a1a' : '#f9fafb'),
                    borderWidth: list.index === listData.index ? 1.5 : 1,
                    borderColor: list.index === listData.index
                      ? 'rgba(22, 163, 74, 0.3)'
                      : (theme === 'dark' ? '#374151' : '#e5e7eb')
                  }}
                  disabled={list.index === listData.index}
                >
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: list.index === listData.index
                      ? '#15803d'
                      : (theme === 'dark' ? '#374151' : '#e5e7eb'),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12
                  }}>
                    {list.index === listData.index ? (
                      <Ionicons name="checkmark" size={18} color="white" />
                    ) : (
                      <Text style={{
                        color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                        fontSize: 14,
                        fontWeight: '600'
                      }}>
                        {index + 1}
                      </Text>
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 16,
                      fontWeight: list.index === listData.index ? '700' : '500',
                      color: list.index === listData.index
                        ? '#15803d'
                        : (theme === 'dark' ? '#f9fafb' : '#1f2937'),
                      marginBottom: 4
                    }}>
                      {list.name}
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      color: theme === 'dark' ? '#9ca3af' : '#6b7280'
                    }}>
                      {list.list?.length || 0} {currentLabels.items || 'items'}
                    </Text>
                  </View>
                  {list.index === listData.index && (
                    <View style={{
                      paddingHorizontal: 12,
                      paddingVertical: 4,
                      borderRadius: 8,
                      backgroundColor: 'rgba(34, 197, 94, 0.1)'
                    }}>
                      <Text style={{
                        fontSize: 11,
                        fontWeight: '600',
                        color: '#15803d'
                      }}>
                        {currentLabels.current || 'ACTUAL'}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Add Item Modal */}
      <AddItemModal
        visible={showAddItemModal}
        onClose={() => setShowAddItemModal(false)}
        onAddItem={(item) => {
          handleAddItemFromModal(item)
          setShowAddItemModal(false)
        }}
        language={deviceLanguage}
      />
    </Modal>
  )
}

export default ExpandedListModal