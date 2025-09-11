# WorkTrackWidget - Guía de Implementación

## Descripción General
El WorkTrackWidget es un widget de iOS que muestra información de seguimiento de tiempo de trabajo en la pantalla de inicio. Funciona en tres tamaños diferentes (pequeño, mediano, grande) y se actualiza dinámicamente con datos compartidos entre la app principal y el widget.

## Arquitectura del Sistema

### 1. Estructura de Archivos

```
ios/WorkTrackWidget/
├── WorkTrackWidget.swift              # Widget principal y vistas
├── MiniCalendarView.swift             # Calendario mini para mostrar días trabajados
├── ActiveTimerView.swift              # Vista del timer activo
├── SharedDataManager.swift            # Gestor de datos compartidos
├── WorkTrackWidgetBundle.swift        # Bundle del widget
├── WorkTrackWidgetAttributes.swift    # Atributos para Live Activities
├── WorkTrackWidgetLiveActivity.swift  # Live Activity (actividades dinámicas)
├── WidgetRefreshManager.swift         # Gestor de actualización
├── StopTimerHandler.swift            # Manejador para parar timer
├── PushNotificationHandler.swift     # Manejador de notificaciones
├── MediumTimerView.swift             # Vista del timer para widget mediano
├── WeeklyStatsView.swift             # Vista de estadísticas semanales
└── WorkTrackIntents.swift            # Intenciones del widget
```

## Componentes Principales

### 1. Modelo de Datos

#### TimerData (SharedDataManager.swift)
```swift
struct TimerData: Codable {
    let isActive: Bool
    let jobName: String
    let location: String?
    let startTime: Date?
    let lastUpdated: Date
    
    static var inactive: TimerData {
        return TimerData(
            isActive: false,
            jobName: "WorkTrack",
            location: nil,
            startTime: nil,
            lastUpdated: Date()
        )
    }
}
```

#### WorkDayInfo (MiniCalendarView.swift)
```swift
struct WorkDayInfo: Codable {
    let date: Date
    let type: WorkDayType
    let jobName: String?
    let jobColor: String?
    let hours: Double?
    
    enum WorkDayType: String, Codable {
        case work = "work"
        case vacation = "vacation"
        case sick = "sick"
        case free = "free"
        case scheduled = "scheduled"
    }
}
```

#### JobInfo (WorkTrackWidget.swift)
```swift
struct JobInfo: Hashable {
    let name: String
    let location: String?
    let color: String?
}
```

### 2. Compartición de Datos

#### App Group Configuration
- **Identificador**: `group.com.roberto.worktrack`
- **Llaves de UserDefaults**:
  - `WorkTrack.TimerData` - Datos del timer
  - `WorkTrack.JobsData` - Lista de trabajos
  - `WorkTrack.CalendarData` - Datos del calendario
  - `WorkTrack.WidgetNeedsUpdate` - Flag de actualización

#### Escritura de Datos (desde la app principal)
```swift
static func saveTimerData(isActive: Bool, jobName: String, location: String?, startTime: Date?) {
    guard let defaults = UserDefaults(suiteName: "group.com.roberto.worktrack") else {
        return
    }
    
    let timerData = TimerData(
        isActive: isActive,
        jobName: jobName,
        location: location,
        startTime: startTime,
        lastUpdated: Date()
    )
    
    let encoder = JSONEncoder()
    let data = try encoder.encode(timerData)
    defaults.set(data, forKey: "WorkTrack.TimerData")
    defaults.synchronize()
    
    // Actualizar widgets
    WidgetCenter.shared.reloadAllTimelines()
}
```

#### Lectura de Datos (desde el widget)
```swift
static func readTimerData() -> TimerData {
    guard let defaults = UserDefaults(suiteName: "group.com.roberto.worktrack"),
          let data = defaults.data(forKey: "WorkTrack.TimerData") else {
        return TimerData.inactive
    }
    
    let decoder = JSONDecoder()
    return try decoder.decode(TimerData.self, from: data)
}
```

### 3. Configuración del Widget

#### Timeline Provider
```swift
struct Provider: TimelineProvider {
    private let appGroupIdentifier = "group.com.roberto.worktrack"
    
    func placeholder(in context: Context) -> WorktrackEntry {
        // Datos placeholder
    }
    
    func getSnapshot(in context: Context, completion: @escaping (WorktrackEntry) -> Void) {
        // Snapshot inmediato
    }
    
    func getTimeline(in context: Context, completion: @escaping (Timeline<WorktrackEntry>) -> Void) {
        // Timeline con políticas de actualización
        let refreshMinutes = timerData.isActive ? 5 : 2
        let refreshDate = Calendar.current.date(byAdding: .minute, value: refreshMinutes, to: Date())!
        completion(Timeline(entries: entries, policy: .after(refreshDate)))
    }
}
```

### 4. Tamaños de Widget

#### Widget Pequeño (systemSmall)
- Muestra nombre de la app colorido "VixTime"
- Si hay timer activo: información compacta del timer
- Si no hay timer: primer trabajo + mini calendario (3 días)

#### Widget Mediano (systemMedium)  
- Header con "VixTime" + hasta 2 trabajos
- Estado del timer si está activo
- Calendario de 7 días

#### Widget Grande (systemLarge)
- Header completo con estado del timer
- Información detallada del timer si está activo
- Calendario de 21 días (3 semanas)

### 5. Diseño Visual

#### Colores y Estilos
```swift
// Gradiente de fondo
LinearGradient(
    colors: [
        Color(red: 0.65, green: 0.75, blue: 0.95),  // Azul claro
        Color(red: 0.85, green: 0.90, blue: 0.98)   // Azul muy claro
    ],
    startPoint: .topLeading, 
    endPoint: .bottomTrailing
)

// Colores de texto
Color(red: 0.2, green: 0.3, blue: 0.5)  // Azul oscuro para texto
```

#### Componentes de UI
- **CardBackground**: Fondo con gradiente y borde
- **HeaderView**: Header con icono y título
- **TimerBlock**: Bloque de información del timer
- **LocationRow**: Fila para mostrar ubicación
- **MiniCalendarView**: Calendario compacto

## Implementación Paso a Paso

### 1. Configuración Inicial

#### 1.1 App Groups
1. Crear App Group en Apple Developer Portal
2. Configurar entitlements en la app principal y extension
3. Usar el mismo identificador en ambos targets

#### 1.2 Targets
1. Crear Widget Extension target
2. Configurar Bundle ID: `com.tuapp.widgets`
3. Añadir App Group capability

### 2. Estructura de Datos

#### 2.1 Crear SharedDataManager
```swift
class SharedDataManager {
    private static let appGroupIdentifier = "group.com.tuapp.data"
    private static let timerDataKey = "App.TimerData"
    
    static func saveTimerData(isActive: Bool, jobName: String, startTime: Date?) {
        // Implementación de guardado
    }
    
    static func readTimerData() -> TimerData {
        // Implementación de lectura
    }
}
```

#### 2.2 Definir Modelos
- `TimerData`: Estado del timer
- `JobInfo`: Información de trabajos
- `WorkDayInfo`: Información de días trabajados

### 3. Widget Provider

#### 3.1 Timeline Provider
```swift
struct Provider: TimelineProvider {
    func getTimeline(in context: Context, completion: @escaping (Timeline<WorktrackEntry>) -> Void) {
        let timerData = SharedDataManager.readTimerData()
        let entries = [WorktrackEntry(date: Date(), timerData: timerData)]
        
        let refreshInterval = timerData.isActive ? 5 : 2
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: refreshInterval, to: Date())!
        
        completion(Timeline(entries: entries, policy: .after(nextUpdate)))
    }
}
```

#### 3.2 Entry Structure
```swift
struct WorktrackEntry: TimelineEntry {
    let date: Date
    let startDate: Date
    let title: String
    let location: String?
    let jobs: [JobInfo]
}
```

### 4. Vistas del Widget

#### 4.1 Widget Principal
```swift
struct WorkTrackWidget: Widget {
    let kind: String = "WorkTrackWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            WorkTrackSwitcher(entry: entry)
        }
        .configurationDisplayName("Tu App")
        .description("Descripción del widget")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}
```

#### 4.2 Switcher por Tamaño
```swift
struct WorkTrackSwitcher: View {
    @Environment(\.widgetFamily) private var family
    let entry: WorktrackEntry

    var body: some View {
        switch family {
        case .systemSmall:
            SmallWidgetView(entry: entry)
        case .systemMedium:
            MediumWidgetView(entry: entry)
        case .systemLarge:
            LargeWidgetView(entry: entry)
        default:
            SmallWidgetView(entry: entry)
        }
    }
}
```

### 5. Integración con la App Principal

#### 5.1 Actualizar Widget desde la App
```swift
// En tu ViewController o SwiftUI View
func startTimer(jobName: String, location: String?) {
    // Lógica del timer local
    startLocalTimer()
    
    // Compartir datos con widget
    SharedDataManager.saveTimerData(
        isActive: true,
        jobName: jobName,
        location: location,
        startTime: Date()
    )
}

func stopTimer() {
    // Parar timer local
    stopLocalTimer()
    
    // Actualizar widget
    SharedDataManager.clearTimerData()
}
```

#### 5.2 Sincronización de Jobs
```swift
func syncJobsWithWidget(_ jobs: [Job]) {
    let jobsData = jobs.map { job in
        [
            "name": job.name,
            "location": job.location ?? "",
            "color": job.color ?? "#059669"
        ]
    }
    
    UserDefaults(suiteName: "group.com.tuapp.data")?.set(jobsData, forKey: "App.JobsData")
    WidgetCenter.shared.reloadAllTimelines()
}
```

## Características Avanzadas

### 1. Deep Linking
```swift
// En el widget
.widgetURL(URL(string: "tuapp://open"))

// En la app principal (AppDelegate/SceneDelegate)
func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
    guard let url = URLContexts.first?.url else { return }
    if url.scheme == "tuapp" && url.host == "open" {
        // Abrir pantalla específica
    }
}
```

### 2. Configuración Dinámica
```swift
// Widget configurable
struct ConfigurableProvider: IntentTimelineProvider {
    func getTimeline(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        // Usar configuración del usuario
    }
}
```

### 3. Live Activities (iOS 16.1+)
```swift
struct WorkTrackWidgetLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: WorkTrackWidgetAttributes.self) { context in
            // Vista de Live Activity
        } dynamicIsland: { context in
            // Vista de Dynamic Island
        }
    }
}
```

## Mejores Prácticas

### 1. Performance
- Usar datos cached en UserDefaults
- Implementar invalidación de cache inteligente
- Limitar frecuencia de actualización

### 2. Datos
- Validar datos antes de mostrar
- Manejar casos de datos corruptos
- Implementar fallbacks para datos faltantes

### 3. UI/UX
- Mantener consistencia visual con la app principal
- Usar gradientes y sombras sutiles
- Optimizar para diferentes tamaños

### 4. Testing
- Probar en diferentes dispositivos
- Validar en modo oscuro/claro
- Verificar con datos vacíos/corruptos

## Debugging

### 1. Logs
```swift
print("✅ Widget: Timer data saved")
print("❌ Widget: Failed to read data")
print("⚠️ Widget: Data is stale")
```

### 2. Verificar App Group
```swift
guard let sharedDefaults = UserDefaults(suiteName: appGroupIdentifier) else {
    print("❌ Failed to access App Group: \(appGroupIdentifier)")
    return
}
```

### 3. Debug Datos Compartidos
```swift
static func debugPrintSharedData() {
    guard let defaults = UserDefaults(suiteName: appGroupIdentifier) else {
        print("❌ Cannot access shared UserDefaults")
        return
    }
    
    let allKeys = defaults.dictionaryRepresentation().keys
    print("📱 All keys in shared storage: \(allKeys)")
}
```

## Consideraciones de Deployment

### 1. Entitlements
- App Group debe existir en ambos targets
- Verificar Bundle IDs correctos
- Confirmar provisioning profiles

### 2. Info.plist
- Configurar NSExtension correctamente
- Establecer NSExtensionPointIdentifier

### 3. Testing
- Probar en dispositivo físico
- Validar actualización automática
- Verificar deep linking

## Conclusión

El WorkTrackWidget demuestra una implementación completa de widget iOS con:
- Compartición segura de datos via App Groups
- Múltiples tamaños y layouts adaptativos  
- Actualización automática inteligente
- UI moderna con gradientes y efectos
- Integración profunda con la app principal

Esta implementación puede servir como base para crear widgets similares en otras aplicaciones, adaptando los modelos de datos y componentes visuales según las necesidades específicas.