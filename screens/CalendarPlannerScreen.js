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
import PushNotification from 'react-native-push-notification'
import PushNotificationIOS from '@react-native-community/push-notification-ios'

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
    time: "Time",
    fullCalendar: "Full Calendar",
    expand: "Expand",
    today: "Today",
    add: "Add",
    viewList: "View List",
    editDay: "Edit Day",
    viewEditItems: "View and edit list items",
    modifyEvent: "Modify event and settings",
    emptyList: "Empty list",
    noContent: "No content",
    noSavedLists: "No saved lists",
    createListsFirst: "Create lists in history first",
    viewLess: "View less",
    viewMore: "View more",
    items: "items",
    reminderSuccess: "Reminder scheduled successfully",
    january: "January",
    february: "February",
    march: "March",
    april: "April",
    may: "May",
    june: "June",
    july: "July",
    august: "August",
    september: "September",
    october: "October",
    november: "November",
    december: "December"
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
    time: "Hora",
    fullCalendar: "Calendario Completo",
    expand: "Expandir",
    today: "Hoy",
    add: "Agregar",
    viewList: "Ver Lista",
    editDay: "Editar Día",
    viewEditItems: "Ver y editar elementos de la lista",
    modifyEvent: "Modificar evento y configuración",
    emptyList: "Lista vacía",
    noContent: "Sin contenido",
    noSavedLists: "No hay listas guardadas",
    createListsFirst: "Crea listas en el historial primero",
    viewLess: "Ver menos",
    viewMore: "Ver más",
    items: "artículos",
    reminderSuccess: "Recordatorio programado exitosamente",
    january: "Enero",
    february: "Febrero",
    march: "Marzo",
    april: "Abril",
    may: "Mayo",
    june: "Junio",
    july: "Julio",
    august: "Agosto",
    september: "Septiembre",
    october: "Octubre",
    november: "Noviembre",
    december: "Diciembre"
  },
  de: {
    title: "Einkaufskalender",
    weeklyPlanner: "Wochenplaner",
    addEvent: "Einkaufsereignis hinzufügen",
    selectList: "Liste auswählen",
    selectDate: "Datum & Zeit auswählen",
    repeat: "Wiederholen",
    weekly: "Wöchentlich",
    biweekly: "Zweiwöchentlich",
    monthly: "Monatlich",
    never: "Nie",
    remindMe: "Erinnere mich",
    syncCalendar: "Mit Kalender synchronisieren",
    createEvent: "Ereignis erstellen",
    cancel: "Abbrechen",
    monday: "Mo",
    tuesday: "Di",
    wednesday: "Mi",
    thursday: "Do",
    friday: "Fr",
    saturday: "Sa",
    sunday: "So",
    noEvents: "Keine Einkäufe geplant",
    tapToAdd: "Tippen Sie auf +, um Einkäufe zu planen",
    eventCreated: "Einkaufsereignis erstellt!",
    permissionDenied: "Kalenderberechtigung verweigert",
    selectStore: "Geschäft auswählen",
    estimatedTime: "Geschätzte Zeit",
    minutes: "Minuten",
    notifications: "Benachrichtigungen",
    reminderBefore: "Erinnerung vorher",
    deleteEvent: "Ereignis löschen",
    editEvent: "Ereignis bearbeiten",
    todayTasks: "Heutige Einkäufe",
    upcomingTasks: "Kommende",
    completedTasks: "Abgeschlossen",
    markComplete: "Als erledigt markieren",
    shoppingList: "Einkaufsliste",
    store: "Geschäft",
    time: "Zeit",
    fullCalendar: "Vollständiger Kalender",
    expand: "Erweitern",
    today: "Heute",
    add: "Hinzufügen",
    viewList: "Liste anzeigen",
    editDay: "Tag bearbeiten",
    viewEditItems: "Listenelemente anzeigen und bearbeiten",
    modifyEvent: "Ereignis und Einstellungen ändern",
    emptyList: "Leere Liste",
    noContent: "Kein Inhalt",
    noSavedLists: "Keine gespeicherten Listen",
    createListsFirst: "Erstellen Sie zuerst Listen im Verlauf",
    viewLess: "Weniger anzeigen",
    viewMore: "Mehr anzeigen",
    items: "Artikel",
    reminderSuccess: "Erinnerung erfolgreich geplant",
    january: "Januar",
    february: "Februar",
    march: "März",
    april: "April",
    may: "Mai",
    june: "Juni",
    july: "Juli",
    august: "August",
    september: "September",
    october: "Oktober",
    november: "November",
    december: "Dezember"
  },
  it: {
    title: "Calendario della Spesa",
    weeklyPlanner: "Pianificatore Settimanale",
    addEvent: "Aggiungi Evento Spesa",
    selectList: "Seleziona Lista",
    selectDate: "Seleziona Data e Ora",
    repeat: "Ripeti",
    weekly: "Settimanale",
    biweekly: "Bisettimanale",
    monthly: "Mensile",
    never: "Mai",
    remindMe: "Ricordami",
    syncCalendar: "Sincronizza con Calendario",
    createEvent: "Crea Evento",
    cancel: "Annulla",
    monday: "Lun",
    tuesday: "Mar",
    wednesday: "Mer",
    thursday: "Gio",
    friday: "Ven",
    saturday: "Sab",
    sunday: "Dom",
    noEvents: "Nessuna spesa pianificata",
    tapToAdd: "Tocca + per programmare la spesa",
    eventCreated: "Evento spesa creato!",
    permissionDenied: "Permesso calendario negato",
    selectStore: "Seleziona Negozio",
    estimatedTime: "Tempo Stimato",
    minutes: "minuti",
    notifications: "Notifiche",
    reminderBefore: "Promemoria prima",
    deleteEvent: "Elimina Evento",
    editEvent: "Modifica Evento",
    todayTasks: "Spesa di Oggi",
    upcomingTasks: "Prossime",
    completedTasks: "Completate",
    markComplete: "Segna come Completato",
    shoppingList: "Lista della Spesa",
    store: "Negozio",
    time: "Ora",
    fullCalendar: "Calendario Completo",
    expand: "Espandi",
    today: "Oggi",
    add: "Aggiungi",
    viewList: "Visualizza Lista",
    editDay: "Modifica Giorno",
    viewEditItems: "Visualizza e modifica elementi della lista",
    modifyEvent: "Modifica evento e impostazioni",
    emptyList: "Lista vuota",
    noContent: "Nessun contenuto",
    noSavedLists: "Nessuna lista salvata",
    createListsFirst: "Crea prima le liste nella cronologia",
    viewLess: "Mostra meno",
    viewMore: "Mostra di più",
    items: "articoli",
    reminderSuccess: "Promemoria programmato con successo",
    january: "Gennaio",
    february: "Febbraio",
    march: "Marzo",
    april: "Aprile",
    may: "Maggio",
    june: "Giugno",
    july: "Luglio",
    august: "Agosto",
    september: "Settembre",
    october: "Ottobre",
    november: "Novembre",
    december: "Dicembre"
  },
  fr: {
    title: "Calendrier des Courses",
    weeklyPlanner: "Planificateur Hebdomadaire",
    addEvent: "Ajouter un Événement de Courses",
    selectList: "Sélectionner une Liste",
    selectDate: "Sélectionner Date et Heure",
    repeat: "Répéter",
    weekly: "Hebdomadaire",
    biweekly: "Bihebdomadaire",
    monthly: "Mensuel",
    never: "Jamais",
    remindMe: "Me rappeler",
    syncCalendar: "Synchroniser avec le Calendrier",
    createEvent: "Créer un Événement",
    cancel: "Annuler",
    monday: "Lun",
    tuesday: "Mar",
    wednesday: "Mer",
    thursday: "Jeu",
    friday: "Ven",
    saturday: "Sam",
    sunday: "Dim",
    noEvents: "Aucune course planifiée",
    tapToAdd: "Appuyez sur + pour planifier les courses",
    eventCreated: "Événement de courses créé!",
    permissionDenied: "Permission de calendrier refusée",
    selectStore: "Sélectionner le Magasin",
    estimatedTime: "Temps Estimé",
    minutes: "minutes",
    notifications: "Notifications",
    reminderBefore: "Rappel avant",
    deleteEvent: "Supprimer l'Événement",
    editEvent: "Modifier l'Événement",
    todayTasks: "Courses d'Aujourd'hui",
    upcomingTasks: "À venir",
    completedTasks: "Terminées",
    markComplete: "Marquer comme Terminé",
    shoppingList: "Liste de Courses",
    store: "Magasin",
    time: "Heure",
    fullCalendar: "Calendrier Complet",
    expand: "Développer",
    today: "Aujourd'hui",
    add: "Ajouter",
    viewList: "Voir la Liste",
    editDay: "Modifier le Jour",
    viewEditItems: "Voir et modifier les éléments de la liste",
    modifyEvent: "Modifier l'événement et les paramètres",
    emptyList: "Liste vide",
    noContent: "Aucun contenu",
    noSavedLists: "Aucune liste enregistrée",
    createListsFirst: "Créez d'abord des listes dans l'historique",
    viewLess: "Voir moins",
    viewMore: "Voir plus",
    items: "articles",
    reminderSuccess: "Rappel programmé avec succès",
    january: "Janvier",
    february: "Février",
    march: "Mars",
    april: "Avril",
    may: "Mai",
    june: "Juin",
    july: "Juillet",
    august: "Août",
    september: "Septembre",
    october: "Octobre",
    november: "Novembre",
    december: "Décembre"
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
  const [lastUsedReminderMinutes, setLastUsedReminderMinutes] = useState('15')
  const [editingEventId, setEditingEventId] = useState(null)
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
  const [notificationSuccessVisible, setNotificationSuccessVisible] = useState(false)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scrollViewRef = useRef(null)

  // Configurar notificaciones push
  useEffect(() => {
    console.log("🔔 Configurando notificaciones push...")
    
    PushNotification.configure({
      onRegister: (token) => {
        console.log("✅ TOKEN registrado:", token)
      },
      onNotification: (notification) => {
        console.log("📱 NOTIFICACIÓN recibida:", notification)
        notification.finish(PushNotificationIOS.FetchResult.NoData)
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    })

    // Crear canal para Android
    PushNotification.createChannel(
      {
        channelId: "shopping-reminders",
        channelName: "Shopping Reminders",
        channelDescription: "Notifications for shopping list reminders",
        soundName: "default",
        importance: 4,
        vibrate: true,
        playSound: true,
      },
      (created) => console.log(`📢 Canal creado: ${created}`),
    )
  }, [])

  useEffect(() => {
    const initializeCalendar = async () => {
      await loadEvents()
      await loadSavedLists()
      await requestCalendarPermission()
      
      // Cargar el último valor de minutos de recordatorio usado
      try {
        const savedReminderMinutes = await AsyncStorage.getItem('@last_reminder_minutes')
        if (savedReminderMinutes) {
          setLastUsedReminderMinutes(savedReminderMinutes)
          setReminderMinutes(savedReminderMinutes)
        }
      } catch (error) {
        console.log('Error loading last reminder minutes:', error)
      }
      
      // Inicializar mes y año actual
      const today = new Date()
      const months = [
        t.january, t.february, t.march, t.april, t.may, t.june,
        t.july, t.august, t.september, t.october, t.november, t.december
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
      t.january, t.february, t.march, t.april, t.may, t.june,
      t.july, t.august, t.september, t.october, t.november, t.december
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
        const parsedEvents = JSON.parse(savedEvents)
        // Agregar originalListName a eventos existentes que no lo tengan
        const updatedEvents = parsedEvents.map(event => {
          if (!event.originalListName && event.title) {
            // Extraer nombre de la lista del título
            const nameFromTitle = event.title.replace('Shopping: ', '')
            return {
              ...event,
              originalListName: nameFromTitle
            }
          }
          return event
        })
        setEvents(updatedEvents)
        
        // Guardar eventos actualizados
        if (updatedEvents.some(event => !parsedEvents.find(pe => pe.id === event.id && pe.originalListName))) {
          await AsyncStorage.setItem('@shopping_events', JSON.stringify(updatedEvents))
        }
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

      // Request notification permissions if needed
      if (reminderEnabled && Platform.OS === 'android') {
        PushNotification.requestPermissions()
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

      const listName = selectedList.name || selectedList.title || selectedList.listName || 'Lista sin nombre'

      let updatedEvents
      let newEvent

      if (editingEventId) {
        // Si estamos editando, buscar y actualizar el evento existente
        const existingEvent = events.find(e => e.id === editingEventId)
        
        // Cancelar notificación anterior si existe
        if (existingEvent?.notificationId) {
          PushNotification.cancelLocalNotification(existingEvent.notificationId)
        }

        newEvent = {
          ...existingEvent,
          title: `Shopping: ${listName}`,
          originalListName: listName,
          listItems: listItems,
          date: eventDate.toISOString(),
          store: selectedStore,
          estimatedMinutes: parseInt(estimatedMinutes) || 30,
          repeat: repeatOption,
          reminder: reminderEnabled ? parseInt(reminderMinutes) : null,
          notificationId: null // Se actualizará si se programa nueva notificación
        }

        updatedEvents = events.map(e => e.id === editingEventId ? newEvent : e)
      } else {
        // Crear nuevo evento
        newEvent = {
          id: Date.now().toString(),
          title: `Shopping: ${listName}`,
          originalListName: listName,
          listItems: listItems,
          date: eventDate.toISOString(),
          store: selectedStore,
          estimatedMinutes: parseInt(estimatedMinutes) || 30,
          repeat: repeatOption,
          reminder: reminderEnabled ? parseInt(reminderMinutes) : null,
          completed: false,
          notificationId: null
        }

        updatedEvents = [...events, newEvent]
      }

      setEvents(updatedEvents)
      
      // Solo guardar datos esenciales, no la lista completa
      const eventsToSave = updatedEvents.map(e => ({
        id: e.id,
        title: e.title,
        originalListName: e.originalListName,
        listItems: e.listItems,
        date: e.date,
        store: e.store,
        estimatedMinutes: e.estimatedMinutes,
        repeat: e.repeat,
        reminder: e.reminder,
        completed: e.completed,
        notificationId: e.notificationId
      }))
      
      await AsyncStorage.setItem('@shopping_events', JSON.stringify(eventsToSave))
      console.log('Event saved successfully')

      if (syncWithCalendar) {
        await addToNativeCalendar(newEvent)
      }

      if (reminderEnabled) {
        console.log("🔔 Procesando recordatorio...")
        // Guardar el último valor usado de minutos de recordatorio
        setLastUsedReminderMinutes(reminderMinutes)
        await AsyncStorage.setItem('@last_reminder_minutes', reminderMinutes)
        
        const notificationId = scheduleNotification(newEvent)
        console.log("📱 ID de notificación recibido:", notificationId)
        
        if (notificationId) {
          newEvent.notificationId = notificationId
          // Actualizar el evento con el ID de notificación
          const finalEvents = updatedEvents.map(e => 
            e.id === newEvent.id ? { ...e, notificationId } : e
          )
          setEvents(finalEvents)
          await AsyncStorage.setItem('@shopping_events', JSON.stringify(finalEvents))
          
          // Mostrar banner de éxito de notificación
          console.log("✅ Mostrando banner de éxito")
          setNotificationSuccessVisible(true)
          setTimeout(() => {
            setNotificationSuccessVisible(false)
          }, 3000)
        } else {
          console.log("❌ No se pudo programar la notificación")
        }
      } else {
        console.log("❌ Recordatorio no habilitado en createEvent")
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

  // Función para probar notificaciones inmediatamente
  const testNotification = () => {
    console.log("🧪 Probando notificación inmediata...")
    
    const testConfig = {
      id: "test_notification",
      title: "🧪 Prueba de Notificación",
      message: "Si ves esto, las notificaciones funcionan correctamente!",
      playSound: true,
      soundName: 'default',
    }

    // Agregar channelId solo para Android
    if (Platform.OS === 'android') {
      testConfig.channelId = "calendar-shopping-reminders"
    }

    try {
      PushNotification.localNotification(testConfig)
      console.log("✅ Notificación de prueba enviada")
    } catch (error) {
      console.log("❌ Error enviando notificación de prueba:", error)
    }
  }


  const scheduleNotification = (eventData) => {
    console.log("🔔 Intentando programar notificación...")
    console.log("📅 Event data:", eventData)
    console.log("⏰ Reminder enabled:", reminderEnabled)
    console.log("⏰ Reminder minutes:", reminderMinutes)

    if (!reminderEnabled || !reminderMinutes) {
      console.log("❌ Recordatorio no habilitado o sin minutos")
      return null
    }

    const eventDate = new Date(eventData.date)
    const reminderDate = new Date(eventDate.getTime() - (parseInt(reminderMinutes) * 60 * 1000))
    const now = new Date()
    
    console.log("📅 Fecha del evento:", eventDate.toLocaleString())
    console.log("⏰ Fecha del recordatorio:", reminderDate.toLocaleString())
    console.log("🕐 Ahora:", now.toLocaleString())
    
    // No programar notificación si ya pasó la fecha del recordatorio
    if (reminderDate <= now) {
      console.log('❌ La fecha del recordatorio ya pasó')
      return null
    }

    const notificationId = `calendar_reminder_${eventData.id}_${Date.now()}`
    const listItemsPreview = eventData.listItems?.slice(0, 3).join(', ') || 'Tu lista de compras'
    const moreItemsText = eventData.listItems?.length > 3 ? `... y ${eventData.listItems.length - 3} más` : ''

    try {
      PushNotification.localNotificationSchedule({
        id: notificationId,
        channelId: "shopping-reminders",
        title: "🛒 Recordatorio de Compras",
        message: `Es hora de ir de compras: ${eventData.title.replace('Shopping: ', '')}\n${listItemsPreview}${moreItemsText}`,
        date: reminderDate,
        allowWhileIdle: true,
        playSound: true,
        soundName: 'default',
        vibrate: true,
        userInfo: { 
          eventId: eventData.id, 
          eventTitle: eventData.title,
          type: 'calendar_shopping_reminder'
        },
      })
      
      console.log(`✅ Notificación programada exitosamente para ${reminderDate.toLocaleString()}`)
      return notificationId
    } catch (error) {
      console.log("❌ Error programando notificación:", error)
      return null
    }
  }

  const resetForm = () => {
    setSelectedList(null)
    setSelectedDate(new Date())
    setSelectedTime(new Date())
    setRepeatOption('never')
    setSelectedStore('')
    setEstimatedMinutes('30')
    setReminderMinutes(lastUsedReminderMinutes) // Usar el último valor guardado
    setReminderEnabled(true)
    setEditingEventId(null)
    setShowListExpanded(false)
    setShowAllLists(false)
    setShowDateSelector(false)
    setShowTimeSelector(false)
  }

  const deleteEvent = async (eventId) => {
    try {
      const eventToDelete = events.find(e => e.id === eventId)
      
      // Cancelar notificación si existe
      if (eventToDelete?.notificationId) {
        PushNotification.cancelLocalNotification(eventToDelete.notificationId)
        console.log(`Notification ${eventToDelete.notificationId} cancelled`)
      }
      
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
      setReminderMinutes(lastUsedReminderMinutes) // Usar el último valor guardado
      setEditingEventId(null) // Asegurarse de que no estamos editando
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
        setEditingEventId(event.id) // Marcar que estamos editando
        const eventDate = new Date(event.date)
        setSelectedTime(eventDate)
        setSelectedStore(event.store || '')
        setEstimatedMinutes(event.estimatedMinutes?.toString() || '30')
        setRepeatOption(event.repeat || 'never')
        
        // Cargar correctamente el recordatorio
        if (event.reminder !== null && event.reminder !== undefined) {
          setReminderEnabled(true)
          setReminderMinutes(event.reminder.toString())
        } else {
          setReminderEnabled(false)
          setReminderMinutes('15')
        }
        
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
      } else {
        setEditingEventId(null) // No estamos editando
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

  // Función para verificar si una notificación está activa
  const isNotificationActive = (event) => {
    // Verificar si el evento tiene recordatorio configurado
    if (!event.reminder || (!event.notificationId && !reminderEnabled)) {
      return false
    }
    
    const eventDate = new Date(event.date)
    const reminderDate = new Date(eventDate.getTime() - (event.reminder * 60 * 1000))
    const now = new Date()
    
    // La notificación está activa si aún no ha pasado la fecha del recordatorio
    return reminderDate > now
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
    today.setHours(0, 0, 0, 0) // Comenzar desde el inicio del día de hoy
    
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate >= today && !event.completed
    }).sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
  backgroundColor: theme.background || "#fefefe",
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
      color: theme === 'dark' ? '#fff' : '#4a6bff20',
      marginBottom: 4
    },
    monthYearContainer: {
      flexDirection: 'row',
      alignItems: 'baseline'
    },
    monthText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme === 'dark' ? '#ccc' : '#6c6d75ff',
      marginRight: 8
    },
    yearText: {
      fontSize: 14,
      color: theme === 'dark' ? '#888' : '#6B7280'
    },
    addButton: {
      backgroundColor: 'rgba(31, 135, 73, 0.3)',
      borderWidth: 1,
      borderColor: 'rgba(31, 135, 73, 0.5)',
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      shadowColor: 'rgba(31, 135, 73, 0.3)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4
    },
    calendarSection: {
      // Sin altura fija para que el calendario sea visible
    },
    calendarContainer: {
      backgroundColor: theme === 'dark' ? '#2a2a2a' : '#ffffff6b', // Rojo muy suave, casi rosado
      marginTop: 10,
      marginHorizontal: 10,
      borderRadius: 15,
      paddingVertical: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
      minHeight: 200, // Altura mínima para asegurar que sea visible
    },
    upcomingSection: {
      flex: 1, // Ocupa todo el espacio restante
    },
    weekNavigation: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f7f7f7ff', // Mismo rojo suave semi-transparente
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
      height: 150, // Altura fija para el calendario semanal completo
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
      backgroundColor: '#918e97ff'
    },
    hasEventCircle: {
      borderWidth: 2,
      borderColor: '#918e97ff'
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
      flex: 1, // Ocupar todo el espacio restante dentro de upcomingSection
      margin: 10,
      padding: 0,
      backgroundColor: 'transparent', // Sin fondo, se ve el fondo de la app
      borderRadius: 15,
      marginTop: 15,
      // Sin sombra para que se integre con el fondo
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme === 'dark' ? '#fff' : '#2D3748',
      marginBottom: 16,
      textAlign: 'center', // Centrado
      letterSpacing: 0.3, // Espaciado sutil entre letras
    },
    eventCard: {
      flexDirection: 'row',
      padding: 15,
      backgroundColor: theme === 'dark' ? '#333' : '#f9f7f0a4',
      borderRadius: 12,
      marginBottom: 10,
      alignItems: 'center',
      borderLeftWidth: 4,
      borderLeftColor: '#918e97ff'
    },
    eventIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#918e97ff',
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
      backgroundColor: 'rgba(31, 135, 73, 0.3)',
      borderColor: 'rgba(31, 135, 73, 0.5)'
    },
    repeatButtonText: {
      fontSize: 14,
      color: theme === 'dark' ? '#fff' : '#4A5568'
    },
    repeatButtonTextActive: {
      color: '#1f8749'
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
      backgroundColor: 'rgba(220, 38, 38, 0.3)',
      borderWidth: 1,
      borderColor: 'rgba(220, 38, 38, 0.5)',
      marginRight: 10,
      alignItems: 'center'
    },
    cancelButtonText: {
      fontSize: 16,
      color: '#dc2626',
      fontWeight: '700'
    },
    createButton: {
      flex: 1,
      padding: 15,
      borderRadius: 12,
      backgroundColor: 'rgba(31, 135, 73, 0.3)',
      borderWidth: 1,
      borderColor: 'rgba(31, 135, 73, 0.5)',
      marginLeft: 10,
      alignItems: 'center',
      shadowColor: '#1f8749',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4
    },
    createButtonText: {
      fontSize: 16,
      color: '#1f8749',
      fontWeight: '700'
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
      marginTop: 2,
      flex: 1,
      justifyContent: 'space-between'
    },
    listNameText: {
      fontSize: 8,
      color: theme === 'dark' ? '#aaa' : '#6B7280',
      textAlign: 'center',
      marginTop: 2,
      paddingHorizontal: 1,
      fontWeight: '500',
      lineHeight: 10,
      maxHeight: 20,
      overflow: 'hidden'
    },
    todayDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#EF4444', // ROJO
      marginTop: 4,
      alignSelf: 'center'
    },
    calendarControls: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      marginTop: -5,
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
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 15
    },
    expandedCalendarContent: {
      width: screenWidth * 0.92,
      maxHeight: screenHeight * 0.85,
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#FAFAFA',
      borderRadius: 25,
      padding: 25,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 15
    },
    expandedCalendarHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 25,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#333' : '#E8E8E8'
    },
    monthNavigation: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 25,
      backgroundColor: theme === 'dark' ? '#2a2a2a' : '#F5F5F5',
      borderRadius: 15,
      padding: 10
    },
    monthNavButton: {
      padding: 12,
      borderRadius: 12,
      backgroundColor: theme === 'dark' ? '#3a3a3a' : '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2
    },
    monthYearTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme === 'dark' ? '#fff' : '#2D3748',
      letterSpacing: 0.3
    },
    fullCalendarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      backgroundColor: theme === 'dark' ? '#2a2a2a' : '#FFFFFF',
      borderRadius: 15,
      padding: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1
    },
    calendarDay: {
      width: '14.28%',
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 4,
      borderRadius: 10,
      marginVertical: 2
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
      backgroundColor: '#26923fff',
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
      borderLeftColor: '#26923fff'
    },
    editDayButton: {
      borderLeftWidth: 4,
      borderLeftColor: '#F59E0B'
    },
    actionOptionIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#918e97ff',
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
    },
    dayIconsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2
    },
    notificationBell: {
      marginLeft: 2
    },
    expandedCalendarIconsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      marginTop: 3
    },
    expandedNotificationBell: {
      marginLeft: 3
    },
    notificationBadge: {
      position: 'absolute',
      top: -2,
      right: -2,
      backgroundColor: 'rgba(245, 158, 11, 0.2)',
      borderRadius: 8,
      padding: 1,
      borderWidth: 1,
      borderColor: '#F59E0B'
    },
    successBanner: {
      position: 'absolute',
      top: 100,
      left: 20,
      right: 20,
      backgroundColor: theme === 'dark' ? '#064e3b' : '#D1FAE5',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#059669' : '#10B981',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
      zIndex: 1000
    },
    successBannerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      gap: 12
    },
    successBannerText: {
      flex: 1,
      fontSize: 16,
      fontWeight: '600',
      color: theme === 'dark' ? '#D1FAE5' : '#065F46'
    },
    eventsScrollView: {
      flex: 1, // Ocupar todo el espacio disponible en la sección
    },
    emptyUpcomingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
      paddingHorizontal: 20
    },
    emptyUpcomingText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
      marginTop: 12,
      textAlign: 'center'
    },
    emptyUpcomingSubtext: {
      fontSize: 14,
      color: theme === 'dark' ? '#6B7280' : '#9CA3AF',
      marginTop: 4,
      textAlign: 'center'
    },
    integratedHeader: {
      paddingHorizontal: 15,
      paddingTop: 10,
      paddingBottom: 5
    },
    titleSection: {
      alignItems: 'center'
    },
    integratedTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme === 'dark' ? '#fff' : '#4A5568',
      marginBottom: 4
    },
    integratedMonthYear: {
      flexDirection: 'row',
      alignItems: 'baseline'
    },
    integratedMonthText: {
      fontSize: 18,
      fontWeight: '700',
      color: theme === 'dark' ? '#ccc' : '#49484aff',
      marginRight: 8
    },
    integratedYearText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme === 'dark' ? '#888' : '#6B7280'
    },
    addControlButton: {
      backgroundColor: 'rgba(34, 197, 94, 0.3)',
      borderWidth: 1,
      borderColor: 'rgba(34, 197, 94, 0.5)'
    },
    addControlButtonText: {
      color: '#16a34a'
    }
  })

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>

        {/* Calendar Section - Height fija */}
        <View style={styles.calendarSection}>
          <View style={styles.calendarContainer}>
            {/* Header integrado en el calendario */}
            <View style={styles.integratedHeader}>
              <View style={styles.titleSection}>
                <View style={styles.integratedMonthYear}>
                  <Text style={styles.integratedMonthText}>{currentMonth}</Text>
                  <Text style={styles.integratedYearText}>{currentYear}</Text>
                </View>
              </View>
            </View>
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
                          <View style={styles.listIconContainer}>
                            <View style={styles.dayIconsRow}>
                              <Ionicons name="cart" size={16} color="#26923fff" />
                              {/* Mostrar campanita temporalmente para todos los eventos */}
                              <Ionicons 
                                name="notifications" 
                                size={14} 
                                color="#F59E0B" 
                                style={styles.notificationBell}
                              />
                            </View>
                          </View>
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
                <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                <Text style={styles.controlButtonText}>{t.expand}</Text>
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
                <Text style={styles.controlButtonText}>{t.today}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.controlButton, styles.addControlButton]}
                onPress={() => {
                  setReminderMinutes(lastUsedReminderMinutes) // Usar el último valor guardado
                  setEditingEventId(null) // Asegurarse de que no estamos editando
                  setModalVisible(true)
                }}
              >
                <Ionicons name="add-circle" size={18} color="#16a34a" />
                <Text style={[styles.controlButtonText, styles.addControlButtonText]}>{t.add}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Upcoming Events Section - Ocupa resto del espacio */}
        <View style={styles.upcomingSection}>
          <View style={styles.sectionContainer}>
       
            {getUpcomingEvents().length > 0 ? (
              <ScrollView 
                style={styles.eventsScrollView}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              >
                {getUpcomingEvents().map(event => (
                <TouchableOpacity
                  key={event.id}
                  style={styles.eventCard}
                  onPress={() => {
                    // Mostrar modal de opciones como cuando se presiona un día
                    const eventDate = new Date(event.date)
                    setSelectedDayDate(eventDate)
                    setSelectedDayEvents([event])
                    setDayActionsModalVisible(true)
                  }}
                  activeOpacity={0.8}
                >
                  <View style={styles.eventIcon}>
                    <Ionicons name="time-outline" size={20} color="#fff" />
                    {/* Mostrar campanita temporalmente para todos los eventos */}
                    <View style={styles.notificationBadge}>
                      <Ionicons name="notifications" size={12} color="#F59E0B" />
                    </View>
                  </View>
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>
                      {event.originalListName || event.title.replace('Shopping: ', '') || 'Lista'}
                    </Text>
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
              </ScrollView>
            ) : (
              <View style={styles.emptyUpcomingContainer}>
                <Ionicons name="list-outline" size={48} color="#9CA3AF" />
                <Text style={styles.emptyUpcomingText}>{t.emptyList}</Text>
                <Text style={styles.emptyUpcomingSubtext}>{t.noContent}</Text>
              </View>
            )}
          </View>
        </View>

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
                          <Text style={styles.emptyListText}>{t.noSavedLists}</Text>
                          <Text style={styles.emptyListSubtext}>{t.createListsFirst}</Text>
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
                                    {new Date(listItem.date).toLocaleDateString()} • {listItem.list?.length || 0} {t.items}
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
                                {showAllLists ? t.viewLess : `${t.viewMore} (${savedLists.length - 4})`}
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
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: '#6B7280' + '20',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12
                  }}>
                    <Ionicons name="calendar" size={22} color="#6B7280" />
                  </View>
                  <Text style={[styles.modalTitle, { fontSize: 18, fontWeight: '600' }]}>{t.fullCalendar}</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.closeButton, {
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: theme === 'dark' ? '#333' : '#F0F0F0',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }]}
                  onPress={() => setShowExpandedCalendar(false)}
                >
                  <Ionicons name="close" size={22} color={theme === 'dark' ? '#fff' : '#333'} />
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
                      t.january, t.february, t.march, t.april, t.may, t.june,
                      t.july, t.august, t.september, t.october, t.november, t.december
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
              <View style={[styles.fullCalendarGrid, { 
                backgroundColor: theme === 'dark' ? '#1a1a1a' : '#F8F8F8',
                marginBottom: 10,
                paddingVertical: 12
              }]}>
                {[t.sunday.slice(0,3), t.monday.slice(0,3), t.tuesday.slice(0,3), t.wednesday.slice(0,3), t.thursday.slice(0,3), t.friday.slice(0,3), t.saturday.slice(0,3)].map((day, index) => (
                  <View key={index} style={styles.calendarDay}>
                    <Text style={[styles.dayNumber, { 
                      fontWeight: '500', 
                      fontSize: 11,
                      color: theme === 'dark' ? '#888' : '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: 0.3
                    }]}>{day}</Text>
                  </View>
                ))}
              </View>

              {/* Días del mes */}
              <ScrollView style={{ 
                maxHeight: 350,
                backgroundColor: theme === 'dark' ? '#1a1a1a' : '#FAFAFA',
                borderRadius: 15,
                padding: 5
              }}>
                <View style={[styles.fullCalendarGrid, {
                  backgroundColor: 'transparent',
                  shadowOpacity: 0,
                  elevation: 0
                }]}>
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
                          style={[styles.calendarDay, {
                            backgroundColor: isToday ? '#6B7280' + '15' : 
                                          dayEvents.length > 0 ? '#26923f' + '10' : 
                                          'transparent',
                            borderWidth: isToday ? 1.5 : dayEvents.length > 0 ? 1 : 0,
                            borderColor: isToday ? '#6B7280' : dayEvents.length > 0 ? '#26923f' + '30' : 'transparent'
                          }]}
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
                              <View style={styles.expandedCalendarIconsRow}>
                                <Ionicons 
                                  name="cart" 
                                  size={20} 
                                  color="#26923fff" 
                                />
                                {/* Mostrar campanita temporalmente para todos los eventos */}
                                <Ionicons 
                                  name="notifications" 
                                  size={18} 
                                  color="#F59E0B" 
                                  style={styles.expandedNotificationBell}
                                />
                              </View>
                            </>
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
                    <Text style={styles.actionOptionTitle}>{t.viewList}</Text>
                    <Text style={styles.actionOptionSubtitle}>
                      {t.viewEditItems}
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
                    <Text style={styles.actionOptionTitle}>{t.editDay}</Text>
                    <Text style={styles.actionOptionSubtitle}>
                      {t.modifyEvent}
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

        {/* Banner de éxito de notificación */}
        {notificationSuccessVisible && (
          <View style={styles.successBanner}>
            <View style={styles.successBannerContent}>
              <Ionicons name="notifications" size={24} color="#10B981" />
              <Text style={styles.successBannerText}>
                🔔 {t.reminderSuccess}
              </Text>
            </View>
          </View>
        )}

      </Animated.View>
    </SafeAreaView>
  )
}

export default CalendarPlannerScreen