import { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
  Platform,
  Animated,
  Dimensions,
  StyleSheet,
  Switch,
  Linking
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as RNLocalize from 'react-native-localize'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useTheme } from '../ThemeContext'
import RNCalendarEvents from 'react-native-calendar-events'
import ExpandedListModal from '../components/ExpandedListModal'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

const translations = {
  en: {
    title: "Shopping Calendar",
    weeklyPlanner: "Weekly Planner",
    addEvent: "Add Shopping Event",
    selectList: "Select List",
    selectDate: "Select Date & Time",
    repeat: "Repeat",
    weekly: "Weekly",
    biweekly: "Bi-weekly",
    monthly: "Monthly",
    never: "Never",
    remindMe: "Remind Me",
    syncCalendar: "Sync with Calendar",
    createEvent: "Create Event",
    cancel: "Cancel",
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    sunday: "Sun",
    noEvents: "No shopping planned",
    tapToAdd: "Tap + to schedule shopping",
    eventCreated: "Shopping event created!",
    permissionDenied: "Calendar permission denied",
    selectStore: "Select Store",
    estimatedTime: "Estimated Time",
    minutes: "minutes",
    notifications: "Notifications",
    reminderBefore: "Reminder before",
    deleteEvent: "Delete Event",
    editEvent: "Edit Event",
    todayTasks: "Today's Shopping",
    upcomingTasks: "Upcoming",
    completedTasks: "Completed",
    markComplete: "Mark as Complete",
    shoppingList: "Shopping List",
    store: "Store",
    time: "Time"
  },
  es: {
    title: "Calendario de Compras",
    weeklyPlanner: "Planificador Semanal",
    addEvent: "Añadir Evento de Compra",
    selectList: "Seleccionar Lista",
    selectDate: "Seleccionar Fecha y Hora",
    repeat: "Repetir",
    weekly: "Semanal",
    biweekly: "Quincenal",
    monthly: "Mensual",
    never: "Nunca",
    remindMe: "Recordarme",
    syncCalendar: "Sincronizar con Calendario",
    createEvent: "Crear Evento",
    cancel: "Cancelar",
    monday: "Lun",
    tuesday: "Mar",
    wednesday: "Mié",
    thursday: "Jue",
    friday: "Vie",
    saturday: "Sáb",
    sunday: "Dom",
    noEvents: "Sin compras planificadas",
    tapToAdd: "Toca + para programar compras",
    eventCreated: "¡Evento de compra creado!",
    permissionDenied: "Permiso de calendario denegado",
    selectStore: "Seleccionar Tienda",
    estimatedTime: "Tiempo Estimado",
    minutes: "minutos",
    notifications: "Notificaciones",
    reminderBefore: "Recordatorio antes",
    deleteEvent: "Eliminar Evento",
    editEvent: "Editar Evento",
    todayTasks: "Compras de Hoy",
    upcomingTasks: "Próximas",
    completedTasks: "Completadas",
    markComplete: "Marcar como Completado",
    shoppingList: "Lista de Compras",
    store: "Tienda",
    time: "Hora"
  }
}

const CalendarPlannerScreen = () => {
  const { theme } = useTheme()
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  const t = translations[deviceLanguage] || translations.en
  
  const [events, setEvents] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedList, setSelectedList] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState(new Date())
  const [repeatOption, setRepeatOption] = useState('never')
  const [reminderEnabled, setReminderEnabled] = useState(true)
  const [syncWithCalendar, setSyncWithCalendar] = useState(true)
  const [savedLists, setSavedLists] = useState([])
  const [selectedStore, setSelectedStore] = useState('')
  const [estimatedMinutes, setEstimatedMinutes] = useState('30')
  const [reminderMinutes, setReminderMinutes] = useState('15')
  const [showDateSelector, setShowDateSelector] = useState(false)
  const [showTimeSelector, setShowTimeSelector] = useState(false)
  const [currentWeek, setCurrentWeek] = useState([])
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0)
  const [currentMonth, setCurrentMonth] = useState('Enero')
  const [currentYear, setCurrentYear] = useState('2025')
  const [showListExpanded, setShowListExpanded] = useState(false)
  const [showAllLists, setShowAllLists] = useState(false)
  const [showExpandedCalendar, setShowExpandedCalendar] = useState(false)
  const [expandedCalendarDate, setExpandedCalendarDate] = useState(new Date())
  const [expandedListModalVisible, setExpandedListModalVisible] = useState(false)
  const [selectedEventData, setSelectedEventData] = useState(null)
  const [dayActionsModalVisible, setDayActionsModalVisible] = useState(false)
  const [selectedDayDate, setSelectedDayDate] = useState(null)
  const [selectedDayEvents, setSelectedDayEvents] = useState([])
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scrollViewRef = useRef(null)

  useEffect(() => {
    const initializeCalendar = async () => {
      await loadEvents()
      await loadSavedLists()
      await requestCalendarPermission()
      
      // Inicializar mes y año actual
      const today = new Date()
      const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ]
      setCurrentMonth(months[today.getMonth()])
      setCurrentYear(today.getFullYear().toString())
      
      generateWeeks()
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }).start()
    }
    
    initializeCalendar()
  }, [])

  const generateWeeks = () => {
    const weeks = []
    const today = new Date()
    
    // Generar solo semanas futuras: semana actual + 9 futuras
    for (let weekOffset = 0; weekOffset <= 9; weekOffset++) {
      const week = []
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay() + (weekOffset * 7))
      
      for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart)
        day.setDate(weekStart.getDate() + i)
        week.push(day)
      }
      weeks.push(week)
    }
    
    setCurrentWeek(weeks)
    setCurrentWeekIndex(0) // Primera semana (semana actual)
    updateMonthYear(weeks[0][3]) // Día del medio de la primera semana
  }
  
  const updateMonthYear = (date) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]
    setCurrentMonth(months[date.getMonth()])
    setCurrentYear(date.getFullYear().toString())
  }
  
  const onWeekScroll = (event) => {
    const scrollX = event.nativeEvent.contentOffset.x
    const weekWidth = screenWidth - 20
    const newIndex = Math.round(scrollX / weekWidth)
    
    if (newIndex !== currentWeekIndex && currentWeek[newIndex]) {
      setCurrentWeekIndex(newIndex)
      updateMonthYear(currentWeek[newIndex][3])
    }
  }
  
  const scrollToWeek = (direction) => {
    const newIndex = direction === 'next' 
      ? Math.min(currentWeekIndex + 1, currentWeek.length - 1)
      : Math.max(currentWeekIndex - 1, 0)
    
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ 
        x: newIndex * (screenWidth - 20), 
        animated: true 
      })
    }
  }

  const requestCalendarPermission = async () => {
    try {
      const status = await RNCalendarEvents.requestPermissions()
      console.log('Calendar permission status:', status)
      
      if (status === 'denied' || status === 'restricted') {
        Alert.alert(
          'Calendar Access Required',
          'Voice Grocery needs access to your calendar to create shopping events and reminders. Please enable calendar access in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:')
              }
            }}
          ]
        )
      } else if (status === 'authorized') {
        console.log('Calendar access granted')
      }
      
      return status === 'authorized'
    } catch (error) {
      console.log('Calendar permission error:', error)
      Alert.alert('Error', 'Unable to request calendar permission')
      return false
    }
  }

  const loadEvents = async () => {
    try {
      const savedEvents = await AsyncStorage.getItem('@shopping_events')
      if (savedEvents) {
        setEvents(JSON.parse(savedEvents))
      }
    } catch (error) {
      console.error('Error loading events:', error)
    }
  }

  const loadSavedLists = async () => {
    try {
      const history = await AsyncStorage.getItem('@shopping_history')
      if (history) {
        const lists = JSON.parse(history)
        // Tomar las últimas 10 listas como opciones y validar estructura
        const validLists = lists.filter(item => 
          item && 
          typeof item === 'object' && 
          item.list && 
          Array.isArray(item.list) &&
          item.date
        )
        const recentLists = validLists.slice(-10).reverse()
        setSavedLists(recentLists)
        console.log('Listas cargadas:', recentLists.length)
      } else {
        setSavedLists([])
      }
    } catch (error) {
      console.error('Error loading lists:', error)
      setSavedLists([])
    }
  }

  const createEvent = async () => {
    try {
      if (!selectedList) {
        Alert.alert('Please select a shopping list')
        return
      }

      // Check calendar permission before creating event
      if (syncWithCalendar) {
        const hasPermission = await requestCalendarPermission()
        if (!hasPermission) {
          setSyncWithCalendar(false)
          Alert.alert(
            'Calendar Permission Required',
            'Event will be created without calendar sync. You can enable it later in settings.'
          )
        }
      }

      const eventDate = new Date(selectedDate)
      eventDate.setHours(selectedTime.getHours())
      eventDate.setMinutes(selectedTime.getMinutes())

      const listItems = selectedList.list?.map(item => 
        typeof item === 'string' ? item : item.text || item.name || String(item)
      ) || []

      const newEvent = {
        id: Date.now().toString(),
        title: `Shopping: ${selectedList.name || 'Grocery List'}`,
        listItems: listItems,
        date: eventDate.toISOString(),
        store: selectedStore,
        estimatedMinutes: parseInt(estimatedMinutes) || 30,
        repeat: repeatOption,
        reminder: reminderEnabled ? (parseInt(reminderMinutes) || 15) : null,
        completed: false
      }

      const updatedEvents = [...events, newEvent]
      setEvents(updatedEvents)
      
      // Solo guardar datos esenciales, no la lista completa
      const eventsToSave = updatedEvents.map(e => ({
        id: e.id,
        title: e.title,
        listItems: e.listItems,
        date: e.date,
        store: e.store,
        estimatedMinutes: e.estimatedMinutes,
        repeat: e.repeat,
        reminder: e.reminder,
        completed: e.completed
      }))
      
      await AsyncStorage.setItem('@shopping_events', JSON.stringify(eventsToSave))
      console.log('Event saved successfully')

      if (syncWithCalendar) {
        await addToNativeCalendar(newEvent)
      }

      if (reminderEnabled) {
        scheduleNotification()
      }

      Alert.alert(t.eventCreated)
      setModalVisible(false)
      resetForm()
    } catch (error) {
      console.error('Error creating event:', error)
      Alert.alert('Error', 'Could not create event')
    }
  }

  const addToNativeCalendar = async (event) => {
    try {
      const eventConfig = {
        title: event.title,
        startDate: event.date,
        endDate: new Date(new Date(event.date).getTime() + event.estimatedMinutes * 60000).toISOString(),
        notes: `Shopping at ${event.store || 'Store'}\n\nShopping List:\n${event.listItems?.join('\n• ') ? '• ' + event.listItems.join('\n• ') : 'No items'}`,
        alarms: event.reminder ? [{ date: -event.reminder }] : []
      }

      if (event.repeat !== 'never') {
        eventConfig.recurrence = event.repeat
      }

      await RNCalendarEvents.saveEvent(eventConfig.title, eventConfig)
    } catch (error) {
      console.error('Error adding to calendar:', error)
    }
  }

  const scheduleNotification = () => {
    // This would integrate with your existing notification system
    console.log('Scheduling notification')
  }

  const resetForm = () => {
    setSelectedList(null)
    setSelectedDate(new Date())
    setSelectedTime(new Date())
    setRepeatOption('never')
    setSelectedStore('')
    setEstimatedMinutes('30')
    setReminderMinutes('15')
    setShowListExpanded(false)
    setShowAllLists(false)
    setShowDateSelector(false)
    setShowTimeSelector(false)
  }

  const deleteEvent = async (eventId) => {
    try {
      const updatedEvents = events.filter(e => e.id !== eventId)
      setEvents(updatedEvents)
      await AsyncStorage.setItem('@shopping_events', JSON.stringify(updatedEvents))
      console.log('Event deleted successfully')
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  const markEventComplete = async (eventId) => {
    try {
      const updatedEvents = events.map(e => 
        e.id === eventId ? { ...e, completed: !e.completed } : e
      )
      setEvents(updatedEvents)
      await AsyncStorage.setItem('@shopping_events', JSON.stringify(updatedEvents))
      console.log('Event marked as complete')
    } catch (error) {
      console.error('Error updating event:', error)
    }
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(expandedCalendarDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setExpandedCalendarDate(newDate)
  }

  const handleDayPress = (date) => {
    const dayEvents = getEventsForDate(date)
    
    if (dayEvents.length > 0) {
      // Día con listas - mostrar modal de opciones
      setSelectedDayDate(date)
      setSelectedDayEvents(dayEvents)
      setDayActionsModalVisible(true)
    } else {
      // Día sin listas - abrir modal de crear evento
      setSelectedDate(date)
      setModalVisible(true)
    }
  }

  const handleToggleItem = async (itemIndex) => {
    if (!selectedEventData) return
    
    try {
      const updatedEvents = events.map(event => {
        if (event.id === selectedEventData.id) {
          const newCompletedItems = event.completedItems || []
          const itemCompleted = newCompletedItems.includes(itemIndex)
          
          if (itemCompleted) {
            // Remover de completados
            return {
              ...event,
              completedItems: newCompletedItems.filter(i => i !== itemIndex)
            }
          } else {
            // Agregar a completados
            return {
              ...event,
              completedItems: [...newCompletedItems, itemIndex]
            }
          }
        }
        return event
      })
      
      setEvents(updatedEvents)
      await AsyncStorage.setItem('@shopping_events', JSON.stringify(updatedEvents))
    } catch (error) {
      console.error('Error toggling item:', error)
    }
  }

  const handleSaveItem = async (itemIndex, newText) => {
    if (!selectedEventData) return
    
    try {
      const updatedEvents = events.map(event => {
        if (event.id === selectedEventData.id) {
          const newListItems = [...event.listItems]
          newListItems[itemIndex] = newText
          return {
            ...event,
            listItems: newListItems
          }
        }
        return event
      })
      
      // Actualizar el estado local del modal
      setSelectedEventData({
        ...selectedEventData,
        list: updatedEvents.find(e => e.id === selectedEventData.id)?.listItems || []
      })
      
      setEvents(updatedEvents)
      await AsyncStorage.setItem('@shopping_events', JSON.stringify(updatedEvents))
    } catch (error) {
      console.error('Error saving item:', error)
    }
  }

  const handleDeleteItem = async (itemIndex) => {
    if (!selectedEventData) return
    
    try {
      const updatedEvents = events.map(event => {
        if (event.id === selectedEventData.id) {
          const newListItems = [...event.listItems]
          newListItems.splice(itemIndex, 1)
          
          // Ajustar índices de items completados
          const newCompletedItems = (event.completedItems || [])
            .filter(index => index !== itemIndex)
            .map(index => index > itemIndex ? index - 1 : index)
          
          return {
            ...event,
            listItems: newListItems,
            completedItems: newCompletedItems
          }
        }
        return event
      })
      
      // Actualizar el estado local del modal
      setSelectedEventData({
        ...selectedEventData,
        list: updatedEvents.find(e => e.id === selectedEventData.id)?.listItems || []
      })
      
      setEvents(updatedEvents)
      await AsyncStorage.setItem('@shopping_events', JSON.stringify(updatedEvents))
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const handleAddItem = async () => {
    if (!selectedEventData) return
    
    try {
      const updatedEvents = events.map(event => {
        if (event.id === selectedEventData.id) {
          const newListItems = [...event.listItems, ""]
          return {
            ...event,
            listItems: newListItems
          }
        }
        return event
      })
      
      // Actualizar el estado local del modal
      const updatedEvent = updatedEvents.find(e => e.id === selectedEventData.id)
      setSelectedEventData({
        ...selectedEventData,
        list: updatedEvent?.listItems || []
      })
      
      setEvents(updatedEvents)
      await AsyncStorage.setItem('@shopping_events', JSON.stringify(updatedEvents))
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  // Handlers para las acciones del día
  const handleViewList = () => {
    if (selectedDayEvents.length > 0) {
      const event = selectedDayEvents[0] // Tomar el primer evento
      setSelectedEventData({
        list: event.listItems || [],
        name: event.title ? event.title.replace('Shopping: ', '') : 'Lista',
        date: event.date,
        id: event.id
      })
      setDayActionsModalVisible(false)
      setExpandedListModalVisible(true)
    }
  }

  const handleEditDay = () => {
    if (selectedDayDate) {
      setSelectedDate(selectedDayDate)
      if (selectedDayEvents.length > 0) {
        // Pre-cargar datos del evento existente
        const event = selectedDayEvents[0]
        const eventDate = new Date(event.date)
        setSelectedTime(eventDate)
        setSelectedStore(event.store || '')
        setEstimatedMinutes(event.estimatedMinutes?.toString() || '30')
        setRepeatOption(event.repeat || 'never')
        setReminderEnabled(!!event.reminder)
        setReminderMinutes(event.reminder?.toString() || '15')
        
        // Buscar la lista original en savedLists
        const originalList = savedLists.find(list => 
          list.list && 
          Array.isArray(list.list) &&
          list.list.length === event.listItems?.length &&
          list.list.every((item, index) => {
            const itemText = typeof item === 'string' ? item : item.text || item.name || String(item)
            return itemText === event.listItems[index]
          })
        )
        if (originalList) {
          setSelectedList(originalList)
        }
      }
      setDayActionsModalVisible(false)
      setModalVisible(true)
    }
  }

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const getTodayEvents = () => {
    const today = new Date()
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.toDateString() === today.toDateString() && !event.completed
    })
  }

  const getUpcomingEvents = () => {
    const today = new Date()
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate > today && !event.completed
    }).sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#F5F3E8'
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      backgroundColor: theme === 'dark' ? '#2a2a2a' : '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#333' : '#E8E6DB'
    },
    headerLeft: {
      flex: 1
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme === 'dark' ? '#fff' : '#4A5568',
      marginBottom: 4
    },
    monthYearContainer: {
      flexDirection: 'row',
      alignItems: 'baseline'
    },
    monthText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme === 'dark' ? '#ccc' : '#8B5CF6',
      marginRight: 8
    },
    yearText: {
      fontSize: 14,
      color: theme === 'dark' ? '#888' : '#6B7280'
    },
    addButton: {
      backgroundColor: '#6366F1',
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      shadowColor: '#6366F1',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4
    },
    calendarContainer: {
      backgroundColor: theme === 'dark' ? '#2a2a2a' : '#FFFFFF',
      marginTop: 10,
      marginHorizontal: 10,
      borderRadius: 15,
      paddingVertical: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2
    },
    weekNavigation: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? '#2a2a2a' : '#FFFFFF',
      borderRadius: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2
    },
    navButton: {
      padding: 15,
      justifyContent: 'center',
      alignItems: 'center'
    },
    weekScrollView: {
      flex: 1
    },
    weekScrollContent: {
      paddingHorizontal: 0
    },
    weekContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 15,
      width: screenWidth - 20 // Sin espacio para botones
    },
    dayColumn: {
      alignItems: 'center',
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 6
    },
    dayText: {
      fontSize: 12,
      color: theme === 'dark' ? '#888' : '#6B7280',
      marginBottom: 5
    },
    dateCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? '#333' : '#F9F7F0'
    },
    todayCircle: {
      backgroundColor: '#6366F1'
    },
    hasEventCircle: {
      borderWidth: 2,
      borderColor: '#8B5CF6'
    },
    dateText: {
      fontSize: 16,
      color: theme === 'dark' ? '#fff' : '#4A5568'
    },
    todayDateText: {
      color: '#fff'
    },
    eventDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#F59E0B',
      marginTop: 4
    },
    sectionContainer: {
      margin: 10,
      padding: 15,
      backgroundColor: theme === 'dark' ? '#2a2a2a' : '#FFFFFF',
      borderRadius: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme === 'dark' ? '#fff' : '#4A5568',
      marginBottom: 10
    },
    eventCard: {
      flexDirection: 'row',
      padding: 15,
      backgroundColor: theme === 'dark' ? '#333' : '#F9F7F0',
      borderRadius: 12,
      marginBottom: 10,
      alignItems: 'center',
      borderLeftWidth: 4,
      borderLeftColor: '#8B5CF6'
    },
    eventIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#8B5CF6',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15
    },
    eventInfo: {
      flex: 1
    },
    eventTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: theme === 'dark' ? '#fff' : '#4A5568'
    },
    eventSubtitle: {
      fontSize: 14,
      color: theme === 'dark' ? '#888' : '#6B7280',
      marginTop: 2
    },
    eventActions: {
      flexDirection: 'row',
      gap: 10
    },
    actionButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: theme === 'dark' ? '#444' : '#F3F1E8'
    },
    emptyState: {
      alignItems: 'center',
      padding: 40
    },
    emptyIcon: {
      marginBottom: 15
    },
    emptyText: {
      fontSize: 16,
      color: theme === 'dark' ? '#888' : '#666',
      textAlign: 'center'
    },
    emptySubtext: {
      fontSize: 14,
      color: theme === 'dark' ? '#666' : '#999',
      marginTop: 5
    },
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20
    },
    modalContent: {
      width: screenWidth * 0.9,
      maxHeight: screenHeight * 0.8,
      backgroundColor: theme === 'dark' ? '#2a2a2a' : '#FFFFFF',
      borderRadius: 20,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 8
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme === 'dark' ? '#fff' : '#4A5568'
    },
    closeButton: {
      padding: 5
    },
    inputSection: {
      marginBottom: 20
    },
    inputLabel: {
      fontSize: 14,
      color: theme === 'dark' ? '#888' : '#6B7280',
      marginBottom: 8,
      fontWeight: '500'
    },
    input: {
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#444' : '#E8E6DB',
      borderRadius: 12,
      padding: 12,
      fontSize: 16,
      color: theme === 'dark' ? '#fff' : '#4A5568',
      backgroundColor: theme === 'dark' ? '#333' : '#F9F7F0'
    },
    listSelector: {
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#444' : '#E8E6DB',
      borderRadius: 12,
      padding: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? '#333' : '#F9F7F0'
    },
    listSelectorText: {
      fontSize: 16,
      color: theme === 'dark' ? '#fff' : '#4A5568'
    },
    dateTimeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#444' : '#E8E6DB',
      borderRadius: 12,
      padding: 12,
      backgroundColor: theme === 'dark' ? '#333' : '#F9F7F0'
    },
    dateTimeText: {
      fontSize: 16,
      color: theme === 'dark' ? '#fff' : '#4A5568'
    },
    repeatOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10
    },
    repeatButton: {
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#444' : '#E8E6DB',
      backgroundColor: theme === 'dark' ? '#333' : '#F9F7F0'
    },
    repeatButtonActive: {
      backgroundColor: '#8B5CF6',
      borderColor: '#8B5CF6'
    },
    repeatButtonText: {
      fontSize: 14,
      color: theme === 'dark' ? '#fff' : '#4A5568'
    },
    repeatButtonTextActive: {
      color: '#fff'
    },
    switchRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15
    },
    switchLabel: {
      fontSize: 16,
      color: theme === 'dark' ? '#fff' : '#4A5568'
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20
    },
    cancelButton: {
      flex: 1,
      padding: 15,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#444' : '#E8E6DB',
      marginRight: 10,
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? '#333' : '#F9F7F0'
    },
    cancelButtonText: {
      fontSize: 16,
      color: theme === 'dark' ? '#888' : '#6B7280',
      fontWeight: '500'
    },
    createButton: {
      flex: 1,
      padding: 15,
      borderRadius: 12,
      backgroundColor: '#8B5CF6',
      marginLeft: 10,
      alignItems: 'center',
      shadowColor: '#8B5CF6',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4
    },
    createButtonText: {
      fontSize: 16,
      color: '#fff',
      fontWeight: '600'
    },
    listItem: {
      flexDirection: 'row',
      padding: 15,
      backgroundColor: theme === 'dark' ? '#333' : '#f8f8f8',
      borderRadius: 10,
      marginBottom: 10,
      alignItems: 'center'
    },
    selectedListItem: {
      backgroundColor: '#4A90E2' + '20',
      borderWidth: 1,
      borderColor: '#4A90E2'
    },
    listItemContent: {
      flex: 1
    },
    listItemTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme === 'dark' ? '#fff' : '#333',
      marginBottom: 4
    },
    listItemSubtitle: {
      fontSize: 12,
      color: theme === 'dark' ? '#888' : '#666',
      marginBottom: 4
    },
    listItemPreview: {
      fontSize: 12,
      color: theme === 'dark' ? '#aaa' : '#888',
      fontStyle: 'italic'
    },
    expandedListContainer: {
      marginTop: 10,
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#444' : '#E8E6DB',
      borderRadius: 12,
      backgroundColor: theme === 'dark' ? '#333' : '#FFFFFF',
      maxHeight: 300,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    },
    expandedListItem: {
      flexDirection: 'row',
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#444' : '#F3F1E8',
      alignItems: 'center'
    },
    selectedExpandedListItem: {
      backgroundColor: '#8B5CF6' + '15',
      borderLeftWidth: 3,
      borderLeftColor: '#8B5CF6'
    },
    expandedListTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme === 'dark' ? '#fff' : '#4A5568',
      marginBottom: 2
    },
    expandedListSubtitle: {
      fontSize: 11,
      color: theme === 'dark' ? '#888' : '#6B7280',
      marginBottom: 2
    },
    expandedListPreview: {
      fontSize: 11,
      color: theme === 'dark' ? '#aaa' : '#9CA3AF',
      fontStyle: 'italic'
    },
    emptyListState: {
      alignItems: 'center',
      padding: 30
    },
    emptyListText: {
      fontSize: 14,
      color: theme === 'dark' ? '#888' : '#6B7280',
      marginTop: 8,
      textAlign: 'center',
      fontWeight: '500'
    },
    emptyListSubtext: {
      fontSize: 12,
      color: theme === 'dark' ? '#666' : '#9CA3AF',
      marginTop: 4,
      textAlign: 'center'
    },
    viewMoreButton: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 12,
      backgroundColor: theme === 'dark' ? '#444' : '#F9F7F0',
      borderTopWidth: 1,
      borderTopColor: theme === 'dark' ? '#555' : '#E8E6DB'
    },
    viewMoreText: {
      fontSize: 12,
      color: '#8B5CF6',
      marginRight: 6,
      fontWeight: '600'
    },
    inlineDatePicker: {
      marginTop: 10,
      backgroundColor: theme === 'dark' ? '#444' : '#F9F7F0',
      borderRadius: 12,
      padding: 10,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#555' : '#E8E6DB'
    },
    inlineTimePicker: {
      marginTop: 10,
      backgroundColor: theme === 'dark' ? '#444' : '#F9F7F0',
      borderRadius: 12,
      padding: 10,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#555' : '#E8E6DB'
    },
    datePickerStyle: {
      backgroundColor: 'transparent'
    },
    listIconContainer: {
      alignItems: 'center',
      marginTop: 2
    },
    listNameText: {
      fontSize: 9,
      color: theme === 'dark' ? '#aaa' : '#6B7280',
      textAlign: 'center',
      marginTop: 1,
      paddingHorizontal: 2,
      fontWeight: '500'
    },
    todayDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#F59E0B',
      marginTop: 4,
      alignSelf: 'center'
    },
    calendarControls: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderTopWidth: 1,
      borderTopColor: theme === 'dark' ? '#333' : '#F3F1E8'
    },
    controlButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: theme === 'dark' ? '#333' : '#F9F7F0',
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#444' : '#E8E6DB'
    },
    controlButtonText: {
      fontSize: 12,
      color: theme === 'dark' ? '#fff' : '#4A5568',
      marginLeft: 6,
      fontWeight: '500'
    },
    expandedCalendarModal: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20
    },
    expandedCalendarContent: {
      width: screenWidth * 0.95,
      maxHeight: screenHeight * 0.8,
      backgroundColor: theme === 'dark' ? '#2a2a2a' : '#FFFFFF',
      borderRadius: 20,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 8
    },
    expandedCalendarHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20
    },
    monthNavigation: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20
    },
    monthNavButton: {
      padding: 10,
      borderRadius: 8,
      backgroundColor: theme === 'dark' ? '#333' : '#F9F7F0'
    },
    monthYearTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme === 'dark' ? '#fff' : '#4A5568'
    },
    fullCalendarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    calendarDay: {
      width: '14.28%',
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 2
    },
    dayNumber: {
      fontSize: 16,
      color: theme === 'dark' ? '#fff' : '#4A5568',
      textAlign: 'center'
    },
    otherMonthDay: {
      color: theme === 'dark' ? '#666' : '#ccc'
    },
    selectedDay: {
      backgroundColor: '#8B5CF6',
      borderRadius: 20
    },
    selectedDayText: {
      color: '#fff'
    },
    todayDay: {
      backgroundColor: '#F59E0B',
      borderRadius: 20
    },
    todayDayText: {
      color: '#fff'
    },
    actionOptionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: theme === 'dark' ? '#333' : '#F9F7F0',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#444' : '#E8E6DB'
    },
    viewListButton: {
      borderLeftWidth: 4,
      borderLeftColor: '#8B5CF6'
    },
    editDayButton: {
      borderLeftWidth: 4,
      borderLeftColor: '#F59E0B'
    },
    actionOptionIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#8B5CF6',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16
    },
    actionOptionContent: {
      flex: 1
    },
    actionOptionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme === 'dark' ? '#fff' : '#4A5568',
      marginBottom: 4
    },
    actionOptionSubtitle: {
      fontSize: 14,
      color: theme === 'dark' ? '#888' : '#6B7280'
    }
  })

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>{t.title}</Text>
            <View style={styles.monthYearContainer}>
              <Text style={styles.monthText}>{currentMonth}</Text>
              <Text style={styles.yearText}>{currentYear}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Weekly Calendar View with Navigation */}
          <View style={styles.calendarContainer}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={onWeekScroll}
              style={styles.weekScrollView}
              contentContainerStyle={styles.weekScrollContent}
            >
              {currentWeek.map((week, weekIndex) => (
                <View key={weekIndex} style={styles.weekContainer}>
                  {week.map((date, dayIndex) => {
                    const dayEvents = getEventsForDate(date)
                    const isToday = date.toDateString() === new Date().toDateString()
                    const dayNames = [t.sunday, t.monday, t.tuesday, t.wednesday, t.thursday, t.friday, t.saturday]
                    
                    return (
                      <TouchableOpacity 
                        key={dayIndex} 
                        style={styles.dayColumn}
                        onPress={() => handleDayPress(date)}
                      >
                        <Text style={styles.dayText}>{dayNames[date.getDay()]}</Text>
                        <View style={[
                          styles.dateCircle,
                          isToday && styles.todayCircle,
                          dayEvents.length > 0 && styles.hasEventCircle
                        ]}>
                          <Text style={[
                            styles.dateText,
                            isToday && styles.todayDateText
                          ]}>{date.getDate()}</Text>
                        </View>
                        {dayEvents.length > 0 && (
                          <>
                            <View style={styles.listIconContainer}>
                              <Ionicons name="cart" size={12} color="#8B5CF6" />
                            </View>
                            <Text style={styles.listNameText} numberOfLines={1}>
                              {(() => {
                                const event = dayEvents[0]
                                if (event) {
                                  if (event.list && event.list.name) {
                                    return event.list.name
                                  }
                                  if (event.title && event.title.includes('Shopping: ')) {
                                    return event.title.replace('Shopping: ', '')
                                  }
                                  return event.title || 'Lista'
                                }
                                return 'Lista'
                              })()} 
                            </Text>
                          </>
                        )}
                        {isToday && (
                          <View style={styles.todayDot} />
                        )}
                      </TouchableOpacity>
                    )
                  })}
                </View>
              ))}
            </ScrollView>
            
            {/* Botones de control */}
            <View style={styles.calendarControls}>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={() => {
                  setShowExpandedCalendar(true)
                }}
              >
                <Ionicons name="calendar-outline" size={16} color="#8B5CF6" />
                <Text style={styles.controlButtonText}>Expandir</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={() => {
                  // Scroll a la semana actual (índice 0 que es la semana de hoy)
                  if (scrollViewRef.current) {
                    scrollViewRef.current.scrollTo({ 
                      x: 0, 
                      animated: true 
                    })
                    setCurrentWeekIndex(0)
                    const today = new Date()
                    updateMonthYear(today)
                  }
                }}
              >
                <Ionicons name="today-outline" size={16} color="#F59E0B" />
                <Text style={styles.controlButtonText}>Hoy</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Today's Tasks */}
          {getTodayEvents().length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{t.todayTasks}</Text>
              {getTodayEvents().map(event => (
                <View key={event.id} style={styles.eventCard}>
                  <View style={styles.eventIcon}>
                    <Ionicons name="cart" size={20} color="#fff" />
                  </View>
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventSubtitle}>
                      {event.store || t.store} • {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    {event.listItems && event.listItems.length > 0 && (
                      <Text style={styles.eventItemsPreview} numberOfLines={1}>
                        {event.listItems.slice(0, 3).join(', ')}{event.listItems.length > 3 ? '...' : ''}
                      </Text>
                    )}
                  </View>
                  <View style={styles.eventActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => markEventComplete(event.id)}
                    >
                      <Ionicons name="checkmark" size={20} color="#10B981" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Upcoming Events */}
          {getUpcomingEvents().length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{t.upcomingTasks}</Text>
              {getUpcomingEvents().slice(0, 5).map(event => (
                <TouchableOpacity
                  key={event.id}
                  style={styles.eventCard}
                  onPress={() => {
                    // Abrir lista expandida
                    setSelectedEventData({
                      list: event.listItems || [],
                      name: event.title ? event.title.replace('Shopping: ', '') : 'Lista',
                      date: event.date,
                      id: event.id
                    })
                    setExpandedListModalVisible(true)
                  }}
                  activeOpacity={0.8}
                >
                  <View style={styles.eventIcon}>
                    <Ionicons name="time-outline" size={20} color="#fff" />
                  </View>
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventSubtitle}>
                      {new Date(event.date).toLocaleDateString()} • {event.store || t.store}
                    </Text>
                    {event.listItems && event.listItems.length > 0 && (
                      <Text style={styles.eventItemsPreview} numberOfLines={1}>
                        {event.listItems.slice(0, 3).join(', ')}{event.listItems.length > 3 ? '...' : ''}
                      </Text>
                    )}
                  </View>
                  <View style={styles.eventActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={(e) => {
                        e.stopPropagation() // Evitar que se active el onPress del contenedor
                        deleteEvent(event.id)
                      }}
                    >
                      <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Empty State */}
          {events.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons 
                name="calendar-outline" 
                size={64} 
                color={theme === 'dark' ? '#666' : '#ccc'}
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyText}>{t.noEvents}</Text>
              <Text style={styles.emptySubtext}>{t.tapToAdd}</Text>
            </View>
          )}
        </ScrollView>

        {/* Add Event Modal */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modal}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t.addEvent}</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color={theme === 'dark' ? '#fff' : '#333'} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Select List */}
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>{t.selectList}</Text>
                  <TouchableOpacity 
                    style={styles.listSelector}
                    onPress={() => {
                      setShowListExpanded(!showListExpanded)
                      if (savedLists.length === 0) {
                        loadSavedLists()
                      }
                    }}
                  >
                    <Text style={styles.listSelectorText}>
                      {selectedList ? (selectedList.name || 'Lista sin nombre') : t.selectList}
                    </Text>
                    <Ionicons 
                      name={showListExpanded ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color={theme === 'dark' ? '#888' : '#666'} 
                    />
                  </TouchableOpacity>
                  
                  {/* Lista Expandible */}
                  {showListExpanded && (
                    <View style={styles.expandedListContainer}>
                      {savedLists.length === 0 ? (
                        <View style={styles.emptyListState}>
                          <Ionicons name="list-outline" size={32} color={theme === 'dark' ? '#666' : '#ccc'} />
                          <Text style={styles.emptyListText}>No hay listas guardadas</Text>
                          <Text style={styles.emptyListSubtext}>Crea listas en el historial primero</Text>
                        </View>
                      ) : (
                        <>
                          {(showAllLists ? savedLists : savedLists.slice(0, 4)).map((listItem, index) => {
                            const previewItems = listItem.list?.slice(0, 3).map(item => 
                              typeof item === 'string' ? item : item.text || item.name || String(item)
                            ) || []
                            
                            return (
                              <TouchableOpacity
                                key={index}
                                style={[
                                  styles.expandedListItem,
                                  selectedList?.date === listItem.date && styles.selectedExpandedListItem
                                ]}
                                onPress={() => {
                                  setSelectedList(listItem)
                                  setShowListExpanded(false)
                                }}
                              >
                                <View style={styles.listItemContent}>
                                  <Text style={styles.expandedListTitle}>
                                    {listItem.name || `Lista ${index + 1}`}
                                  </Text>
                                  <Text style={styles.expandedListSubtitle}>
                                    {new Date(listItem.date).toLocaleDateString()} • {listItem.list?.length || 0} items
                                  </Text>
                                  <Text style={styles.expandedListPreview} numberOfLines={1}>
                                    {previewItems.join(', ')}{listItem.list?.length > 3 ? '...' : ''}
                                  </Text>
                                </View>
                                <Ionicons 
                                  name={selectedList?.date === listItem.date ? "checkmark-circle" : "chevron-forward"} 
                                  size={18} 
                                  color={selectedList?.date === listItem.date ? "#8B5CF6" : theme === 'dark' ? '#888' : '#D1D5DB'} 
                                />
                              </TouchableOpacity>
                            )
                          })}
                          
                          {/* Botón Ver Más */}
                          {savedLists.length > 4 && (
                            <TouchableOpacity 
                              style={styles.viewMoreButton}
                              onPress={() => setShowAllLists(!showAllLists)}
                            >
                              <Text style={styles.viewMoreText}>
                                {showAllLists ? 'Ver menos' : `Ver más (${savedLists.length - 4} más)`}
                              </Text>
                              <Ionicons 
                                name={showAllLists ? "chevron-up" : "chevron-down"} 
                                size={16} 
                                color="#8B5CF6" 
                              />
                            </TouchableOpacity>
                          )}
                        </>
                      )}
                    </View>
                  )}
                </View>

                {/* Store Name */}
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>{t.selectStore}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={t.selectStore}
                    placeholderTextColor={theme === 'dark' ? '#666' : '#999'}
                    value={selectedStore}
                    onChangeText={setSelectedStore}
                  />
                </View>

                {/* Date & Time */}
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>{t.selectDate}</Text>
                  <TouchableOpacity 
                    style={styles.dateTimeButton}
                    onPress={() => setShowDateSelector(!showDateSelector)}
                  >
                    <Text style={styles.dateTimeText}>
                      {selectedDate.toLocaleDateString()}
                    </Text>
                    <Ionicons 
                      name={showDateSelector ? "chevron-up" : "calendar-outline"} 
                      size={20} 
                      color={theme === 'dark' ? '#888' : '#666'} 
                    />
                  </TouchableOpacity>
                  
                  {/* Selector de Fecha Inline */}
                  {showDateSelector && (
                    <View style={styles.inlineDatePicker}>
                      <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="compact"
                        onChange={(_, date) => {
                          if (date) {
                            setSelectedDate(date)
                            setShowDateSelector(false)
                          }
                        }}
                        style={styles.datePickerStyle}
                      />
                    </View>
                  )}
                  
                  <TouchableOpacity 
                    style={[styles.dateTimeButton, { marginTop: 10 }]}
                    onPress={() => setShowTimeSelector(!showTimeSelector)}
                  >
                    <Text style={styles.dateTimeText}>
                      {selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    <Ionicons 
                      name={showTimeSelector ? "chevron-up" : "time-outline"} 
                      size={20} 
                      color={theme === 'dark' ? '#888' : '#666'} 
                    />
                  </TouchableOpacity>
                  
                  {/* Selector de Hora Inline */}
                  {showTimeSelector && (
                    <View style={styles.inlineTimePicker}>
                      <DateTimePicker
                        value={selectedTime}
                        mode="time"
                        display="compact"
                        onChange={(_, time) => {
                          if (time) {
                            setSelectedTime(time)
                            setShowTimeSelector(false)
                          }
                        }}
                        style={styles.datePickerStyle}
                      />
                    </View>
                  )}
                </View>

                {/* Repeat Options */}
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>{t.repeat}</Text>
                  <View style={styles.repeatOptions}>
                    {['never', 'weekly', 'biweekly', 'monthly'].map(option => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.repeatButton,
                          repeatOption === option && styles.repeatButtonActive
                        ]}
                        onPress={() => setRepeatOption(option)}
                      >
                        <Text style={[
                          styles.repeatButtonText,
                          repeatOption === option && styles.repeatButtonTextActive
                        ]}>
                          {t[option]}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Estimated Time */}
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>{t.estimatedTime} ({t.minutes})</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="30"
                    placeholderTextColor={theme === 'dark' ? '#666' : '#999'}
                    value={estimatedMinutes}
                    onChangeText={setEstimatedMinutes}
                    keyboardType="numeric"
                  />
                </View>

                {/* Switches */}
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>{t.remindMe}</Text>
                  <Switch
                    value={reminderEnabled}
                    onValueChange={setReminderEnabled}
                    trackColor={{ false: '#D1D5DB', true: '#8B5CF6' }}
                    thumbColor={reminderEnabled ? '#fff' : '#f4f3f4'}
                  />
                </View>

                {reminderEnabled && (
                  <View style={styles.inputSection}>
                    <Text style={styles.inputLabel}>{t.reminderBefore} ({t.minutes})</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="15"
                      placeholderTextColor={theme === 'dark' ? '#666' : '#999'}
                      value={reminderMinutes}
                      onChangeText={setReminderMinutes}
                      keyboardType="numeric"
                    />
                  </View>
                )}

                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>{t.syncCalendar}</Text>
                  <Switch
                    value={syncWithCalendar}
                    onValueChange={setSyncWithCalendar}
                    trackColor={{ false: '#D1D5DB', true: '#8B5CF6' }}
                    thumbColor={syncWithCalendar ? '#fff' : '#f4f3f4'}
                  />
                </View>
              </ScrollView>

              {/* Action Buttons */}
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>{t.cancel}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.createButton}
                  onPress={createEvent}
                >
                  <Text style={styles.createButtonText}>{t.createEvent}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Expanded Calendar Modal */}
        <Modal
          visible={showExpandedCalendar}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowExpandedCalendar(false)}
        >
          <View style={styles.expandedCalendarModal}>
            <View style={styles.expandedCalendarContent}>
              <View style={styles.expandedCalendarHeader}>
                <Text style={styles.modalTitle}>Calendario Completo</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowExpandedCalendar(false)}
                >
                  <Ionicons name="close" size={24} color={theme === 'dark' ? '#fff' : '#333'} />
                </TouchableOpacity>
              </View>

              <View style={styles.monthNavigation}>
                <TouchableOpacity 
                  style={styles.monthNavButton}
                  onPress={() => navigateMonth('prev')}
                >
                  <Ionicons name="chevron-back" size={20} color={theme === 'dark' ? '#fff' : '#4A5568'} />
                </TouchableOpacity>
                <Text style={styles.monthYearTitle}>
                  {(() => {
                    const months = [
                      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                    ]
                    return `${months[expandedCalendarDate.getMonth()]} ${expandedCalendarDate.getFullYear()}`
                  })()}
                </Text>
                <TouchableOpacity 
                  style={styles.monthNavButton}
                  onPress={() => navigateMonth('next')}
                >
                  <Ionicons name="chevron-forward" size={20} color={theme === 'dark' ? '#fff' : '#4A5568'} />
                </TouchableOpacity>
              </View>

              {/* Días de la semana */}
              <View style={styles.fullCalendarGrid}>
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day, index) => (
                  <View key={index} style={styles.calendarDay}>
                    <Text style={[styles.dayNumber, { fontWeight: 'bold', fontSize: 14 }]}>{day}</Text>
                  </View>
                ))}
              </View>

              {/* Días del mes */}
              <ScrollView style={{ maxHeight: 300 }}>
                <View style={styles.fullCalendarGrid}>
                  {(() => {
                    const today = new Date()
                    const firstDay = new Date(expandedCalendarDate.getFullYear(), expandedCalendarDate.getMonth(), 1)
                    const startDate = new Date(firstDay)
                    startDate.setDate(firstDay.getDate() - firstDay.getDay())
                    
                    const days = []
                    for (let i = 0; i < 42; i++) {
                      const date = new Date(startDate)
                      date.setDate(startDate.getDate() + i)
                      days.push(date)
                    }
                    
                    return days.map((date, index) => {
                      const isToday = date.toDateString() === today.toDateString()
                      const isCurrentMonth = date.getMonth() === expandedCalendarDate.getMonth()
                      const dayEvents = getEventsForDate(date)
                      
                      return (
                        <TouchableOpacity 
                          key={index} 
                          style={styles.calendarDay}
                          onPress={() => {
                            setShowExpandedCalendar(false)
                            handleDayPress(date)
                          }}
                        >
                          <Text style={[
                            styles.dayNumber,
                            !isCurrentMonth && styles.otherMonthDay
                          ]}>
                            {date.getDate()}
                          </Text>
                          {dayEvents.length > 0 && (
                            <>
                              <Ionicons 
                                name="cart" 
                                size={18} 
                                color="#8B5CF6" 
                                style={{ marginTop: 3 }}
                              />
                              <Text style={[styles.listNameText, { fontSize: 8 }]} numberOfLines={1}>
                                {(() => {
                                  const event = dayEvents[0]
                                  if (event) {
                                    if (event.list && event.list.name) {
                                      return event.list.name
                                    }
                                    if (event.title && event.title.includes('Shopping: ')) {
                                      return event.title.replace('Shopping: ', '')
                                    }
                                    return event.title || 'Lista'
                                  }
                                  return 'Lista'
                                })()}
                              </Text>
                            </>
                          )}
                          {isToday && (
                            <View style={styles.todayDot} />
                          )}
                        </TouchableOpacity>
                      )
                    })
                  })()}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Modal de opciones para días con listas */}
        <Modal
          visible={dayActionsModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setDayActionsModalVisible(false)}
        >
          <View style={styles.modal}>
            <View style={[styles.modalContent, { maxHeight: 300 }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {selectedDayDate?.toLocaleDateString() || 'Día seleccionado'}
                </Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setDayActionsModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color={theme === 'dark' ? '#fff' : '#333'} />
                </TouchableOpacity>
              </View>

              <View style={{ gap: 15 }}>
                {/* Opción 1: Ver Lista */}
                <TouchableOpacity
                  style={[styles.actionOptionButton, styles.viewListButton]}
                  onPress={handleViewList}
                >
                  <View style={styles.actionOptionIcon}>
                    <Ionicons name="list" size={24} color="#fff" />
                  </View>
                  <View style={styles.actionOptionContent}>
                    <Text style={styles.actionOptionTitle}>Ver Lista</Text>
                    <Text style={styles.actionOptionSubtitle}>
                      Ver y editar elementos de la lista
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme === 'dark' ? '#888' : '#666'} />
                </TouchableOpacity>

                {/* Opción 2: Editar Día */}
                <TouchableOpacity
                  style={[styles.actionOptionButton, styles.editDayButton]}
                  onPress={handleEditDay}
                >
                  <View style={[styles.actionOptionIcon, { backgroundColor: '#F59E0B' }]}>
                    <Ionicons name="calendar" size={24} color="#fff" />
                  </View>
                  <View style={styles.actionOptionContent}>
                    <Text style={styles.actionOptionTitle}>Editar Día</Text>
                    <Text style={styles.actionOptionSubtitle}>
                      Modificar evento y configuración
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme === 'dark' ? '#888' : '#666'} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal expandido para ver/editar listas */}
        <ExpandedListModal
          visible={expandedListModalVisible}
          onClose={() => setExpandedListModalVisible(false)}
          listData={selectedEventData}
          completedItems={selectedEventData ? (events.find(e => e.id === selectedEventData.id)?.completedItems || []) : []}
          onToggleItem={handleToggleItem}
          onSaveItem={handleSaveItem}
          onDeleteItem={handleDeleteItem}
          onAddItem={handleAddItem}
        />

      </Animated.View>
    </SafeAreaView>
  )
}

export default CalendarPlannerScreen