import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet
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
  onSaveList 
}) => {
  const { theme } = useTheme()
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  const currentLabels = translationsHistorial[deviceLanguage] || translationsHistorial["en"]
  
  const [editingItemIndex, setEditingItemIndex] = useState(null)
  const [editingItemText, setEditingItemText] = useState("")
  const scrollViewRef = useRef(null)

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
    Alert.alert(
      currentLabels.confirmDelete || "Confirm Delete",
      currentLabels.areYouSure || "Are you sure you want to delete this item?",
      [
        {
          text: currentLabels.cancel || "Cancel",
          style: "cancel"
        },
        {
          text: currentLabels.delete || "Delete",
          onPress: () => {
            if (onDeleteItem) {
              onDeleteItem(itemIndex)
            }
            // Cancel editing if we're editing the deleted item
            if (editingItemIndex === itemIndex) {
              handleCancelEdit()
            }
          },
          style: "destructive"
        }
      ]
    )
  }

  const getCompletedCount = () => {
    return completedItems?.length || 0
  }

  const getTotalCount = () => {
    return listData?.list?.length || 0
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
      paddingTop: Platform.OS === 'ios' ? 45 : 15,
      paddingBottom: 18,
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#374151' : '#e5e7eb',
      backgroundColor: theme === 'dark' ? '#1f2937' : '#f8fafc',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3
    },
    expandedModalTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: theme === 'dark' ? '#f9fafb' : '#1f2937',
      flex: 1,
      marginRight: 15
    },
    headerActions: {
      flexDirection: 'row',
      gap: 10
    },
    headerButton: {
      padding: 12,
      borderRadius: 15,
      backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
      minWidth: 50,
      justifyContent: 'center',
      alignItems: 'center'
    },
    saveButton: {
      backgroundColor: '#10b981',
      borderColor: '#10b981'
    },
    closeButton: {
      backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
      borderColor: theme === 'dark' ? '#4b5563' : '#e5e7eb'
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
    expandedModalProgress: {
      fontSize: 16,
      fontWeight: '600',
      color: theme === 'dark' ? '#fff' : '#374151',
      textAlign: 'center'
    },
    fixedAddButton: {
      position: 'absolute',
      bottom: 100,
      right: 20,
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: '#8b5cf6',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 12,
      shadowColor: '#8b5cf6',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      borderWidth: 3,
      borderColor: '#ffffff'
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
          <Text style={styles.expandedModalTitle}>{listData.name}</Text>
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
              <Ionicons name="close" size={24} color={theme === 'dark' ? '#f9fafb' : '#6b7280'} />
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
          <Text style={styles.expandedModalProgress}>
            {getCompletedCount()} / {getTotalCount()} {currentLabels.completed || 'completados'}
          </Text>
        </View>
        
        {/* Fixed Add Button */}
        {onAddItem && (
          <TouchableOpacity
            onPress={onAddItem}
            style={styles.fixedAddButton}
          >
            <Ionicons name="add" size={32} color="#ffffff" />
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </Modal>
  )
}

export default ExpandedListModal