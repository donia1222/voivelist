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
  onSwitchList
}) => {
  const { theme } = useTheme()
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  const currentLabels = translationsHistorial[deviceLanguage] || translationsHistorial["en"]
  
  const [editingItemIndex, setEditingItemIndex] = useState(null)
  const [editingItemText, setEditingItemText] = useState("")
  const [listSwitcherVisible, setListSwitcherVisible] = useState(false)
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
    // Add a new empty item
    if (onAddItem) {
      onAddItem()
    }
    // Set the new item (last index) in edit mode
    const newItemIndex = listData?.list?.length || 0
    setEditingItemIndex(newItemIndex)
    setEditingItemText("")
    // Scroll to the bottom to show the new item
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true })
      }
    }, 100)
  }

  const getCompletedCount = () => {
    return completedItems?.length || 0
  }

  const getTotalCount = () => {
    return listData?.list?.length || 0
  }

  const areAllItemsCompleted = () => {
    const totalItems = getTotalCount()
    const completedCount = getCompletedCount()
    return totalItems > 0 && completedCount === totalItems
  }

  const styles = StyleSheet.create({
    expandedListModalContainer: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#FFFFFF'
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
      fontSize: 24,
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
      backgroundColor: theme === 'dark' ? '#1f2937' : '#f8fafc',
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
              <Ionicons name="list" size={22} color="#15803d" />
              {markedLists && markedLists.length > 0 && (
                <View style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  backgroundColor: '#15803d',
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
        
        <ScrollView 
          ref={scrollViewRef}
          style={styles.expandedModalContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {listData.list?.map((item, itemIndex) => (
            <View key={itemIndex}>
              {editingItemIndex === itemIndex ? (
                // Modo edición
                <View style={styles.expandedListItemEditContainer}>
                  <View
                    style={[
                      styles.expandedCheckbox,
                      completedItems?.includes(itemIndex) && styles.expandedCheckboxCompleted
                    ]}
                  >
                    {completedItems?.includes(itemIndex) && (
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
                    onPress={handleCancelEdit}
                    style={styles.expandedCancelItemButton}
                  >
                    <Ionicons name="close" size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ) : (
                // Modo normal
                <TouchableOpacity
                  onPress={() => {
                    if (onToggleItem) {
                      onToggleItem(itemIndex)
                    }
                  }}
                  style={styles.expandedListItem}
                >
                  <View style={styles.expandedListItemContent}>
                    <View
                      style={[
                        styles.expandedCheckbox,
                        completedItems?.includes(itemIndex) && styles.expandedCheckboxCompleted
                      ]}
                    >
                      {completedItems?.includes(itemIndex) && (
                        <Ionicons name="checkmark" size={20} color="white" />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.expandedListItemText,
                        completedItems?.includes(itemIndex) && styles.expandedListItemTextCompleted
                      ]}
                    >
                      {typeof item === 'string' ? item : item.text || item.name || String(item)}
                    </Text>
                    <View style={styles.expandedItemActions}>
                      <TouchableOpacity
                        onPress={() => {
                          const itemText = typeof item === 'string' ? item : item.text || item.name || String(item)
                          handleEditItem(itemIndex, itemText)
                        }}
                        style={styles.expandedEditButton}
                      >
                        <Ionicons name="pencil" size={14} color={theme === 'dark' ? '#fff' : '#6b7280'} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteItem(itemIndex)}
                        style={styles.expandedDeleteButton}
                      >
                        <Ionicons name="trash-outline" size={14} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          ))}
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
    </Modal>
  )
}

export default ExpandedListModal