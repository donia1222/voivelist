"use client"

import { useState, useEffect, useRef } from "react"
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ScrollView,
  Animated,
  Dimensions,
  StyleSheet,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as RNLocalize from "react-native-localize"
import { useNavigation } from "@react-navigation/native"
import { useHaptic } from "../HapticContext"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")

// Available icons for custom categories
const availableIcons = [
  'basket', 'beer', 'bicycle', 'boat', 'book', 'briefcase', 'brush', 'build',
  'bus', 'cafe', 'camera', 'car', 'cart', 'cash', 'color-palette', 'construct',
  'cut', 'desktop', 'egg', 'fast-food', 'fish', 'fitness', 'flower', 'football',
  'game-controller', 'gift', 'glasses', 'globe', 'hammer', 'heart', 'home',
  'ice-cream', 'key', 'laptop', 'leaf', 'library', 'medkit', 'musical-notes',
  'nutrition', 'paw', 'pencil', 'pizza', 'planet', 'restaurant', 'ribbon',
  'rose', 'school', 'shirt', 'snow', 'star', 'sunny', 'tennisball', 'train',
  'trophy', 'umbrella', 'watch', 'water', 'wine'
]

// Available colors for custom categories
const availableColors = [
  { color: '#FF6B6B', gradient: ['#FF6B6B', '#FF8787'] },
  { color: '#4ECDC4', gradient: ['#4ECDC4', '#6FD6D1'] },
  { color: '#45B7D1', gradient: ['#45B7D1', '#64C4DD'] },
  { color: '#96CEB4', gradient: ['#96CEB4', '#AAD9C3'] },
  { color: '#FECA57', gradient: ['#FECA57', '#FFD574'] },
  { color: '#FF9F43', gradient: ['#FF9F43', '#FFB265'] },
  { color: '#A29BFE', gradient: ['#A29BFE', '#B5AFFE'] },
  { color: '#FD79A8', gradient: ['#FD79A8', '#FE92BB'] },
  { color: '#6C5CE7', gradient: ['#6C5CE7', '#8777ED'] },
  { color: '#00B894', gradient: ['#00B894', '#26C6A8'] },
  { color: '#FDCB6E', gradient: ['#FDCB6E', '#FDD488'] },
  { color: '#E17055', gradient: ['#E17055', '#E88774'] },
  { color: '#0984E3', gradient: ['#0984E3', '#3399E9'] },
  { color: '#6AB04C', gradient: ['#6AB04C', '#83C167'] },
  { color: '#EB4D4B', gradient: ['#EB4D4B', '#EF6B6A'] },
  { color: '#22A6B3', gradient: ['#22A6B3', '#44B8C4'] },
  { color: '#F0932B', gradient: ['#F0932B', '#F3A74D'] },
  { color: '#6741D9', gradient: ['#6741D9', '#8159E1'] },
  { color: '#F368E0', gradient: ['#F368E0', '#F582E6'] },
  { color: '#48DBF8', gradient: ['#48DBF8', '#6BE2FA'] }
]

// Default categories
const defaultCategories = [
  { id: 'groceries', icon: 'cart', color: '#4CAF50', gradient: ['#4CAF50', '#66BB6A'], isDefault: true },
  { id: 'pharmacy', icon: 'medkit', color: '#FF5722', gradient: ['#FF5722', '#FF7043'], isDefault: true },
  { id: 'pets', icon: 'paw', color: '#9C27B0', gradient: ['#9C27B0', '#BA68C8'], isDefault: true },
  { id: 'home', icon: 'home', color: '#2196F3', gradient: ['#2196F3', '#42A5F5'], isDefault: true },
  { id: 'beverages', icon: 'wine', color: '#E91E63', gradient: ['#E91E63', '#F06292'], isDefault: true },
  { id: 'bakery', icon: 'restaurant', color: '#FF9800', gradient: ['#FF9800', '#FFB74D'], isDefault: true },
  { id: 'meat', icon: 'nutrition', color: '#795548', gradient: ['#795548', '#8D6E63'], isDefault: true },
  { id: 'produce', icon: 'leaf', color: '#4CAF50', gradient: ['#66BB6A', '#81C784'], isDefault: true },
  { id: 'electronics', icon: 'phone-portrait', color: '#607D8B', gradient: ['#607D8B', '#78909C'], isDefault: true },
  { id: 'clothing', icon: 'shirt', color: '#00BCD4', gradient: ['#00BCD4', '#26C6DA'], isDefault: true },
  { id: 'frozen', icon: 'snow', color: '#00ACC1', gradient: ['#00ACC1', '#26C6DA'], isDefault: true }
]

// Translations
const translations = {
  en: {
    title: "Create Manual List",
    selectCategory: "Select a category",
    addCustomCategory: "Custom",
    categoryName: "Category name",
    selectIcon: "Select an icon (optional)",
    selectColor: "Select a color",
    noIcon: "No icon (use text)",
    addCategory: "Add Category",
    addItem: "Add Item",
    itemName: "Item name",
    quantity: "Quantity",
    unit: "Unit",
    units: {
      units: "Units",
      kg: "Kilograms",
      g: "Grams",
      l: "Liters",
      ml: "Milliliters"
    },
    price: "Price (optional)",
    isStore: "Store item",
    add: "Add",
    cancel: "Cancel",
    saveList: "Save List",
    listName: "List name",
    emptyList: "Your list is empty",
    emptyListSubtitle: "Select a category and add items to get started",
    categories: {
      groceries: "Groceries",
      pharmacy: "Pharmacy",
      pets: "Pets",
      home: "Home & Cleaning",
      beverages: "Beverages",
      bakery: "Bakery",
      meat: "Meat & Fish",
      produce: "Fruits & Vegetables",
      electronics: "Electronics",
      clothing: "Clothing",
      frozen: "Frozen",
      dairy: "Dairy"
    },
    items: "items",
    total: "Total",
    manualList: "Manual List"
  },
  es: {
    title: "Crear Lista Manual",
    selectCategory: "Selecciona una categoría",
    addCustomCategory: "Personal",
    categoryName: "Nombre de la categoría",
    selectIcon: "Selecciona un icono (opcional)",
    selectColor: "Selecciona un color",
    noIcon: "Sin icono (usar texto)",
    addCategory: "Añadir Categoría",
    addItem: "Añadir Artículo",
    itemName: "Nombre del artículo",
    quantity: "Cantidad",
    unit: "Unidad",
    units: {
      units: "Unidades",
      kg: "Kilogramos",
      g: "Gramos",
      l: "Litros",
      ml: "Mililitros"
    },
    price: "Precio (opcional)",
    isStore: "Artículo de tienda",
    add: "Añadir",
    cancel: "Cancelar",
    saveList: "Guardar Lista",
    listName: "Nombre de la lista",
    emptyList: "Tu lista está vacía",
    emptyListSubtitle: "Selecciona una categoría y añade artículos para comenzar",
    categories: {
      groceries: "Supermercado",
      pharmacy: "Farmacia",
      pets: "Mascotas",
      home: "Hogar y Limpieza",
      beverages: "Bebidas",
      bakery: "Panadería",
      meat: "Carnicería",
      produce: "Frutas y Verduras",
      electronics: "Electrónica",
      clothing: "Ropa",
      frozen: "Congelados",
      dairy: "Lácteos"
    },
    items: "artículos",
    total: "Total",
    manualList: "Lista Manual"
  }
}

const HandwrittenListScreen = ({ route }) => {
  const { triggerHaptic } = useHaptic()
  const navigation = useNavigation()

  // Get device language
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  const t = translations[deviceLanguage] || translations.en

  // States
  const [categories, setCategories] = useState(defaultCategories)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [listItems, setListItems] = useState({})
  const [modalVisible, setModalVisible] = useState(false)
  const [saveModalVisible, setSaveModalVisible] = useState(false)
  const [customCategoryModalVisible, setCustomCategoryModalVisible] = useState(false)
  const [listName, setListName] = useState("")
  const [itemName, setItemName] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [unit, setUnit] = useState("units") // units, kg, g, l, ml
  const [price, setPrice] = useState("")
  const [isStore, setIsStore] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [selectedIcon, setSelectedIcon] = useState(null)
  const [selectedColor, setSelectedColor] = useState(availableColors[0])
  const [showIconPicker, setShowIconPicker] = useState(false)

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.9)).current
  const categoryAnimations = useRef(
    categories.map(() => new Animated.Value(0))
  ).current

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      })
    ]).start()

    // Animate categories sequentially
    const animations = categoryAnimations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 50,
        useNativeDriver: true,
      })
    )

    Animated.stagger(50, animations).start()
  }, [])

  const handleCategoryPress = (category) => {
    triggerHaptic('light')
    setSelectedCategory(category)
    setModalVisible(true)
  }

  const handleAddItem = () => {
    if (!itemName.trim() || !selectedCategory) return

    const newItem = {
      id: Date.now().toString(),
      name: itemName,
      quantity: parseFloat(quantity) || 1,
      unit: unit,
      price: parseFloat(price) || 0,
      isStore,
      category: selectedCategory.id
    }

    setListItems(prev => ({
      ...prev,
      [selectedCategory.id]: [...(prev[selectedCategory.id] || []), newItem]
    }))

    // Reset form
    setItemName("")
    setQuantity("1")
    setUnit("units")
    setPrice("")
    setIsStore(false)
    setModalVisible(false)

    triggerHaptic('success')
  }

  const handleAddCustomCategory = () => {
    if (!newCategoryName.trim()) {
      Alert.alert("", t.categoryName)
      return
    }

    const newCategory = {
      id: newCategoryName.toLowerCase().replace(/\s+/g, '_'),
      name: newCategoryName,
      icon: selectedIcon,
      color: selectedColor.color,
      gradient: selectedColor.gradient,
      isCustom: true
    }

    setCategories([...categories, newCategory])
    setCustomCategoryModalVisible(false)
    setNewCategoryName("")
    setSelectedIcon(null)
    setSelectedColor(availableColors[0])
    triggerHaptic('success')
  }

  const removeItem = (categoryId, itemId) => {
    triggerHaptic('light')
    setListItems(prev => ({
      ...prev,
      [categoryId]: prev[categoryId].filter(item => item.id !== itemId)
    }))
  }

  const getTotalItems = () => {
    return Object.values(listItems).reduce((total, items) => total + items.length, 0)
  }

  const getTotalPrice = () => {
    return Object.values(listItems).reduce((total, items) => {
      return total + items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    }, 0)
  }

  const saveList = async () => {
    if (getTotalItems() === 0) {
      Alert.alert("", t.emptyList)
      return
    }

    const defaultName = `${t.manualList} ${new Date().toLocaleDateString()}`
    setListName(defaultName)
    setSaveModalVisible(true)
  }

  const confirmSave = async () => {
    try {
      const listData = {
        id: Date.now().toString(),
        name: listName || `${t.manualList} ${new Date().toLocaleDateString()}`,
        items: listItems,
        totalItems: getTotalItems(),
        totalPrice: getTotalPrice(),
        createdAt: new Date().toISOString(),
        type: 'manual'
      }

      // Get existing history
      const existingHistory = await AsyncStorage.getItem("@shopping_history")
      let history = existingHistory ? JSON.parse(existingHistory) : []

      // Convert to flat list format for compatibility
      const flatList = Object.entries(listItems).flatMap(([, items]) =>
        items.map(item => `${item.name} (${item.quantity})`)
      )

      // Add to history in compatible format
      history.push({
        list: flatList,
        name: listData.name,
        date: listData.createdAt,
        metadata: listData
      })

      await AsyncStorage.setItem("@shopping_history", JSON.stringify(history))
      await AsyncStorage.setItem("@show_newest_list", "true")

      setSaveModalVisible(false)

      // Navigate to History
      if (route.params?.onNavigateToHistory) {
        route.params.onNavigateToHistory()
      } else {
        navigation.navigate('History')
      }

      triggerHaptic('success')
    } catch (error) {
      console.error("Error saving list:", error)
      Alert.alert("Error", "Could not save list")
    }
  }

  const renderCategory = ({ item, index }) => {
    const itemCount = listItems[item.id]?.length || 0
    const displayName = item.isCustom ? item.name : t.categories[item.id]

    return (
      <Animated.View
        style={[
          styles.categoryCard,
          {
            opacity: categoryAnimations[index] || 1,
            transform: [
              {
                translateY: categoryAnimations[index]?.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0]
                }) || 0
              },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        <TouchableOpacity
          style={[styles.categoryButton, { backgroundColor: item.gradient[0] }]}
          onPress={() => handleCategoryPress(item)}
          activeOpacity={0.8}
        >
          <View style={styles.categoryGradient}>
            <View style={styles.categoryIconContainer}>
              {item.icon ? (
                <Ionicons name={item.icon} size={32} color="white" />
              ) : (
                <Text style={styles.categoryInitials}>
                  {displayName.substring(0, 2).toUpperCase()}
                </Text>
              )}
            </View>
            <Text style={styles.categoryName} numberOfLines={2}>{displayName}</Text>
            {itemCount > 0 && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{itemCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  const AddCategoryButton = () => (
    <View style={styles.categoryCard}>
      <TouchableOpacity
        style={[styles.categoryButton, styles.addCategoryButton]}
        onPress={() => setCustomCategoryModalVisible(true)}
        activeOpacity={0.8}
      >
        <View style={styles.categoryGradient}>
          <View style={[styles.categoryIconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Ionicons name="add" size={32} color="white" />
          </View>
          <Text style={[styles.categoryName, { fontSize: 11 }]}>{t.addCustomCategory}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )

  const getUnitDisplay = (quantity, unit) => {
    const unitAbbreviations = {
      units: '',
      kg: 'kg',
      g: 'g',
      l: 'L',
      ml: 'ml'
    }
    const unitText = unitAbbreviations[unit] || ''
    return unit === 'units' ? `x${quantity}` : `${quantity}${unitText}`
  }

  const renderListItem = (item, categoryId) => (
    <View key={item.id} style={styles.listItem}>
      <View style={styles.listItemContent}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <View style={styles.itemDetails}>
            <Text style={styles.itemQuantity}>
              {getUnitDisplay(item.quantity, item.unit)}
            </Text>
            {item.price > 0 && (
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            )}
            {item.isStore && (
              <View style={styles.storeBadge}>
                <Ionicons name="business" size={12} color="#ff9500" />
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity
          onPress={() => removeItem(categoryId, item.id)}
          style={styles.removeButton}
        >
          <Ionicons name="close-circle" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.subtitle}>{t.selectCategory}</Text>
        </View>

        {/* Categories Grid */}
        <FlatList
          data={[...categories, { id: 'add_custom', isAddButton: true }]}
          renderItem={({ item, index }) =>
            item.isAddButton ? <AddCategoryButton key="add_custom" /> : renderCategory({ item, index })
          }
          keyExtractor={item => item.id}
          numColumns={3}
          contentContainerStyle={styles.categoriesGrid}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            getTotalItems() > 0 && (
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    {getTotalItems()} {t.items}
                  </Text>
                  {getTotalPrice() > 0 && (
                    <Text style={styles.summaryPrice}>
                      {t.total}: ${getTotalPrice().toFixed(2)}
                    </Text>
                  )}
                </View>
              </View>
            )
          }
          ListFooterComponent={
            <View style={styles.listSection}>
              {Object.entries(listItems).map(([categoryId, items]) => {
                if (items.length === 0) return null
                const category = categories.find(c => c.id === categoryId)

                return (
                  <View key={categoryId} style={styles.categorySection}>
                    <View style={[styles.categorySectionHeader, { backgroundColor: category.gradient[0] + '20' }]}>
                      <Ionicons name={category.icon} size={20} color={category.gradient[0]} />
                      <Text style={[styles.categorySectionTitle, { color: category.gradient[0] }]}>
                        {category.isCustom ? category.name : t.categories[categoryId]}
                      </Text>
                    </View>
                    {items.map(item => renderListItem(item, categoryId))}
                  </View>
                )
              })}
            </View>
          }
        />

        {/* Empty State */}
        {getTotalItems() === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="list-outline" size={64} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>{t.emptyList}</Text>
            <Text style={styles.emptySubtitle}>{t.emptyListSubtitle}</Text>
          </View>
        )}

        {/* Save Button */}
        {getTotalItems() > 0 && (
          <TouchableOpacity style={styles.saveButton} onPress={saveList}>
            <Ionicons name="save-outline" size={24} color="white" />
            <Text style={styles.saveButtonText}>{t.saveList}</Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Custom Category Modal */}
      <Modal
        visible={customCategoryModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCustomCategoryModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.customCategoryModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.addCustomCategory}</Text>
              <TouchableOpacity onPress={() => setCustomCategoryModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder={t.categoryName}
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              autoFocus
            />

            <Text style={styles.sectionTitle}>{t.selectColor}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorPicker}>
              {availableColors.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color.gradient[0] },
                    selectedColor.color === color.color && styles.selectedColor
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor.color === color.color && (
                    <Ionicons name="checkmark" size={20} color="white" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>{t.selectIcon}</Text>
            <TouchableOpacity
              style={styles.iconPickerToggle}
              onPress={() => setShowIconPicker(!showIconPicker)}
            >
              <View style={styles.selectedIconPreview}>
                {selectedIcon ? (
                  <Ionicons name={selectedIcon} size={24} color={selectedColor.color} />
                ) : (
                  <Text style={styles.noIconText}>{t.noIcon}</Text>
                )}
              </View>
              <Ionicons name="chevron-down" size={20} color="#6b7280" />
            </TouchableOpacity>

            {showIconPicker && (
              <ScrollView style={styles.iconGrid} showsVerticalScrollIndicator={false}>
                <View style={styles.iconGridContent}>
                  <TouchableOpacity
                    style={[
                      styles.iconOption,
                      !selectedIcon && styles.selectedIcon
                    ]}
                    onPress={() => {
                      setSelectedIcon(null)
                      setShowIconPicker(false)
                    }}
                  >
                    <Text style={styles.noIconOptionText}>AB</Text>
                  </TouchableOpacity>
                  {availableIcons.map((icon, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.iconOption,
                        selectedIcon === icon && styles.selectedIcon
                      ]}
                      onPress={() => {
                        setSelectedIcon(icon)
                        setShowIconPicker(false)
                      }}
                    >
                      <Ionicons name={icon} size={24} color={selectedColor.color} />
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setCustomCategoryModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>{t.cancel}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: selectedColor.gradient[0] }
                ]}
                onPress={handleAddCustomCategory}
              >
                <Text style={styles.addButtonText}>{t.addCategory}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Add Item Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderIcon}>
                {selectedCategory && (
                  selectedCategory.icon ? (
                    <Ionicons
                      name={selectedCategory.icon}
                      size={24}
                      color={selectedCategory.gradient[0]}
                    />
                  ) : (
                    <Text style={[styles.categoryInitials, { fontSize: 16, color: selectedCategory.gradient[0] }]}>
                      {(selectedCategory.isCustom ? selectedCategory.name : t.categories[selectedCategory.id]).substring(0, 2).toUpperCase()}
                    </Text>
                  )
                )}
              </View>
              <Text style={styles.modalTitle}>{t.addItem}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder={t.itemName}
              value={itemName}
              onChangeText={setItemName}
              autoFocus
            />

            <View style={styles.row}>
              <View style={[styles.quantityContainer, { flex: 1.5 }]}>
                <Text style={styles.label}>{t.quantity}</Text>
                <View style={styles.quantityRow}>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => {
                        const val = parseFloat(quantity)
                        const step = unit === 'kg' || unit === 'l' ? 0.5 :
                                    unit === 'g' || unit === 'ml' ? 50 : 1
                        setQuantity(String(Math.max(step, val - step)))
                      }}
                    >
                      <Ionicons name="remove" size={20} color="#6b7280" />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.quantityInput}
                      value={quantity}
                      onChangeText={setQuantity}
                      keyboardType="decimal-pad"
                    />
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => {
                        const val = parseFloat(quantity)
                        const step = unit === 'kg' || unit === 'l' ? 0.5 :
                                    unit === 'g' || unit === 'ml' ? 50 : 1
                        setQuantity(String(val + step))
                      }}
                    >
                      <Ionicons name="add" size={20} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.unitSelector}
                    onPress={() => {
                      // Cycle through units
                      const units = ['units', 'kg', 'g', 'l', 'ml']
                      const currentIndex = units.indexOf(unit)
                      const nextIndex = (currentIndex + 1) % units.length
                      setUnit(units[nextIndex])

                      // Adjust quantity based on unit change
                      if (units[nextIndex] === 'g' || units[nextIndex] === 'ml') {
                        setQuantity(String(parseFloat(quantity) * 1000))
                      } else if ((unit === 'g' || unit === 'ml') &&
                                (units[nextIndex] === 'kg' || units[nextIndex] === 'l')) {
                        setQuantity(String(parseFloat(quantity) / 1000))
                      }
                    }}
                  >
                    <Text style={styles.unitText}>
                      {unit === 'units' ? 'UN' : unit.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.label}>{t.price}</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="0.00"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>{t.isStore}</Text>
              <Switch
                value={isStore}
                onValueChange={setIsStore}
                trackColor={{ false: "#e5e7eb", true: "#fbbf24" }}
                thumbColor={isStore ? "#f59e0b" : "#f3f4f6"}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>{t.cancel}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.addButton, { backgroundColor: selectedCategory?.gradient[0] }]}
                onPress={handleAddItem}
              >
                <Text style={styles.addButtonText}>{t.add}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Save List Modal */}
      <Modal
        visible={saveModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSaveModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.saveModalContent}>
            <Text style={styles.saveModalTitle}>{t.listName}</Text>
            <TextInput
              style={styles.saveInput}
              value={listName}
              onChangeText={setListName}
              placeholder={t.manualList}
              autoFocus
              selectTextOnFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setSaveModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>{t.cancel}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmSave}
              >
                <Text style={styles.addButtonText}>{t.saveList}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  categoriesGrid: {
    paddingHorizontal: 10,
    paddingBottom: 100,
  },
  categoryCard: {
    flex: 1,
    margin: 8,
    height: 120,
  },
  categoryButton: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  categoryInitials: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  addCategoryButton: {
    backgroundColor: '#94a3b8',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  categoryBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoryBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
  },
  summaryPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10b981',
  },
  listSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  categorySection: {
    marginBottom: 20,
  },
  categorySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  categorySectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  listItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 4,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#64748b',
  },
  itemPrice: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  storeBadge: {
    backgroundColor: '#fff7ed',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  removeButton: {
    padding: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: -100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#475569',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  saveButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 28,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
  },
  customCategoryModal: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalHeaderIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
    marginLeft: 12,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginTop: 16,
    marginBottom: 8,
  },
  colorPicker: {
    flexDirection: 'row',
    marginBottom: 16,
    maxHeight: 50,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#1e293b',
  },
  iconPickerToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedIconPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noIconText: {
    fontSize: 16,
    color: '#94a3b8',
  },
  iconGrid: {
    maxHeight: 200,
    marginTop: 8,
  },
  iconGridContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 8,
  },
  iconOption: {
    width: 50,
    height: 50,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedIcon: {
    backgroundColor: '#e0e7ff',
    borderColor: '#6366f1',
  },
  noIconOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94a3b8',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  quantityContainer: {
    flex: 1,
  },
  priceContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 8,
  },
  quantityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quantityControls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quantityButton: {
    padding: 10,
  },
  quantityInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  unitSelector: {
    backgroundColor: '#e0e7ff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6366f1',
    minWidth: 50,
  },
  unitText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366f1',
  },
  priceInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: '#475569',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  addButton: {
    backgroundColor: '#10b981',
  },
  confirmButton: {
    backgroundColor: '#10b981',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  saveModalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
  },
  saveModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  saveInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
})

export default HandwrittenListScreen