# 📱 VoiceList - Guía de Desarrollo

## 🏗️ Arquitectura del Proyecto

**VoiceList** es una aplicación React Native desarrollada con Expo que permite crear listas de compras usando reconocimiento de voz, análisis de imágenes y integración con ChatGPT.

### 📂 Estructura de Carpetas

```
VoiceList/
├── 📱 App.js                    # Componente principal y navegación
├── 🎨 ThemeContext.js           # Sistema de temas (claro/oscuro)
├── 🔔 NotificationContext.js    # Contexto de notificaciones
├── 📄 CLAUDE.md                 # Documentación del proyecto
├── 
├── 📱 screens/                  # Pantallas principales
│   ├── 🏠 HomeScreen.js         # Pantalla principal con reconocimiento de voz
│   ├── 📷 ImageListScreen.js    # Análisis de imágenes para listas
│   ├── 📝 TextListScreen.js     # Creación manual de listas
│   ├── 📊 HistoryScreen.js      # Historial de listas guardadas
│   ├── ⭐ FavoritesScreen.js    # Listas favoritas
│   ├── ℹ️ InformationScreen.js   # Información de la app
│   ├── 💰 Suscribe.js           # Pantalla de suscripción
│   ├── 👤 MySubscriptionScreen.js # Gestión de suscripción
│   ├── 🍳 RecipesScreen.js      # Listas basadas en recetas
│   ├── 
│   ├── 🎨 Styles/               # Estilos organizados por pantalla
│   │   ├── HomeScreenStyles.js
│   │   ├── StylesSuscribe.js
│   │   ├── stylesHistorial.js
│   │   ├── InfoStyles.js
│   │   └── SettingsStyles.js
│   ├── 
│   ├── 🌐 translations/         # Sistema de internacionalización
│   │   ├── texts.js            # Textos principales (14 idiomas)
│   │   ├── languagesApp.js     # Nombres de pantallas
│   │   ├── prompts.js          # Prompts para ChatGPT
│   │   ├── modal-texts.js      # Textos de modales
│   │   └── translationsHistorial.js
│   ├── 
│   ├── 🧩 components/          # Componentes reutilizables
│   │   ├── Carousel.js         # Carrusel de características
│   │   ├── TextoAnimadoSuscribese.js # Texto animado
│   │   ├── PushNotification.js # Configuración de notificaciones
│   │   └── TypingText.js       # Efecto de escritura
│   └── 
│   └── 🔗 links/               # Modales legales
│       ├── PrivacyModal.js     # Política de privacidad
│       ├── GDPRModal.js        # Compliance GDPR
│       └── EulaModal.js        # Términos de uso
├── 
├── 📱 iOS/                     # Configuración iOS
│   ├── VoiceList.xcodeproj/
│   ├── Podfile
│   └── Info.plist
├── 
└── 🖼️ assets/images/           # Recursos gráficos
    ├── App-Icon-1024x1024@1x copia.png # Icono principal
    ├── wave.png / wavedark.png # Fondos por tema
    └── [imágenes de recetas y UI]
```

---

## 🛠️ Tecnologías y Dependencias Principales

### 🚀 Framework & Navegación
- **React Native 0.74.3** + **Expo ~51.0.21**
- **@react-navigation/native** - navegación con drawer y stack
- **@react-navigation/drawer** - menú lateral personalizable

### 🎙️ Funcionalidades Principales
- **@react-native-community/voice** - reconocimiento de voz
- **openai 4.52.1** - integración con ChatGPT
- **react-native-image-picker** - captura y análisis de imágenes
- **axios** - peticiones HTTP

### 💰 Monetización
- **react-native-purchases** - suscripciones in-app
- **react-native-google-mobile-ads** - publicidad

### 🎨 UI/UX
- **react-native-reanimated** - animaciones fluidas
- **react-native-linear-gradient** - gradientes
- **@expo/vector-icons** - iconografía
- **react-native-gesture-handler** - gestos táctiles

### 📱 Funcionalidades Nativas
- **@react-native-async-storage/async-storage** - almacenamiento local
- **react-native-localize** - detección de idioma
- **react-native-push-notification** - notificaciones
- **react-native-device-info** - información del dispositivo

---

## 🎯 Pantallas Principales y Funcionalidades

### 🏠 **HomeScreen.js** - Centro de Control de Voz
**Funcionalidades:**
- ✅ Reconocimiento de voz en tiempo real
- ✅ Procesamiento con ChatGPT para extraer elementos de lista
- ✅ Soporte para 14 idiomas
- ✅ Análisis inteligente de texto hablado
- ✅ Guardado automático de listas
- ✅ Interfaz adaptativa (móvil/tablet)

**APIs utilizadas:**
- `@react-native-community/voice` para captura de audio
- `openai` para procesamiento inteligente
- Variables de entorno: `API_KEY_ANALIZE`, `API_KEY_CHAT`

### 📷 **ImageListScreen.js** - Análisis de Imágenes
**Funcionalidades:**
- ✅ Captura desde cámara o galería
- ✅ OCR y análisis con ChatGPT
- ✅ Extracción automática de elementos de listas escritas a mano
- ✅ Conversión a formato digital editable

### 📊 **HistoryScreen.js** - Gestión de Listas
**Funcionalidades:**
- ✅ Historial completo de listas creadas
- ✅ Edición y eliminación de listas
- ✅ Sistema de favoritos
- ✅ Búsqueda y filtrado
- ✅ Exportación de listas

### 🍳 **RecipesScreen.js** - Listas por Recetas
**Funcionalidades:**
- ✅ Generación automática de listas basadas en recetas
- ✅ Base de datos de recetas predefinidas
- ✅ Carrusel visual de platos
- ✅ Integración con ChatGPT para ingredientes

### 💰 **Suscribe.js** - Monetización
**Funcionalidades:**
- ✅ Gestión de suscripciones premium
- ✅ Eliminación de publicidad
- ✅ Funcionalidades premium desbloqueadas
- ✅ Integración con RevenueCat

---

## 🎨 Sistema de Diseño

### 🌈 **ThemeContext.js** - Gestión de Temas

```javascript
// Temas disponibles
const themes = {
  light: {
    background: '#1d265e',      // Azul principal
    backgroundtresapp: '#3f51b5', // Azul secundario
    text: 'black',              // Texto principal
    buttonBackground: '#009688', // Verde botones
    // ... más colores
  },
  dark: {
    background: '#e7ead2',      // Crema claro
    backgroundnuevo: '#a9cbcb', // Azul verdoso
    text: '#2c3c3c',           // Texto oscuro
    // ... más colores
  }
}
```

### 📏 **Sistema de Estilos**
Cada pantalla tiene su propio archivo de estilos en `screens/Styles/`:
- Estilos dinámicos que responden al tema actual
- Responsive design para móviles y tablets
- Consistencia visual en toda la app

---

## 🌐 Sistema de Internacionalización

### 🗣️ **Idiomas Soportados (14 total):**
- 🇺🇸 English (en) - predeterminado
- 🇪🇸 Español (es)
- 🇩🇪 Deutsch (de)
- 🇮🇹 Italiano (it)
- 🇫🇷 Français (fr)
- 🇹🇷 Türkçe (tr)
- 🇵🇹 Português (pt)
- 🇷🇺 Русский (ru)
- 🇸🇦 العربية (ar)
- 🇭🇺 Magyar (hu)
- 🇯🇵 日本語 (ja)
- 🇮🇳 हिन्दी (hi)
- 🇳🇱 Nederlands (nl)
- 🇨🇳 中文 (zh)

### 📂 **Archivos de Traducción:**
- **`texts.js`** - textos principales de la interfaz
- **`modal-texts.js`** - textos de modales y alertas
- **`prompts.js`** - prompts específicos para ChatGPT por idioma
- **`translationsHistorial.js`** - textos específicos del historial

---

## 🔧 Configuración de Desarrollo

### ⚡ **Scripts Disponibles:**
```json
{
  "start": "expo start",
  "android": "expo run:android", 
  "ios": "expo run:ios",
  "web": "expo start --web"
}
```

### 🔐 **Variables de Entorno Requeridas:**
Crear archivo `.env` en la raíz:
```bash
API_KEY_ANALIZE=tu_openai_key_para_analisis
API_KEY_CHAT=tu_openai_key_para_chat
```

### 📱 **Configuración iOS:**
- Bundle ID: configurado en `ios/VoiceList/Info.plist`
- Icono de app: `assets/images/App-Icon-1024x1024@1x copia.png`
- Permisos requeridos: micrófono, cámara, notificaciones

---

## 🚀 Flujo de Desarrollo Recomendado

### 1. 🏁 **Setup Inicial**
```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus API keys

# Ejecutar en desarrollo
npm start
```

### 2. 🎨 **Trabajar con Estilos**
- Modificar estilos en `screens/Styles/[Pantalla]Styles.js`
- Los estilos son dinámicos y responden al tema actual
- Usar `useTheme()` hook para acceder a colores del tema

### 3. 🌐 **Añadir Traducciones**
- Editar `screens/translations/texts.js`
- Mantener consistencia en todos los idiomas
- Probar con diferentes configuraciones de idioma del dispositivo

### 4. 🔧 **Añadir Nueva Funcionalidad**
- Crear componente en `screens/components/` si es reutilizable
- Seguir patrones existentes de navegación
- Actualizar traducciones correspondientes
- Añadir estilos específicos en carpeta `Styles/`

### 5. 📱 **Testing en Dispositivos**
- iOS: usar simulador o dispositivo físico
- Android: usar emulador o dispositivo físico
- Probar funcionalidades de voz en dispositivo real (simuladores tienen limitaciones)

---

## 🔍 APIs y Servicios Integrados

### 🤖 **OpenAI/ChatGPT Integration**
- **Análisis de voz:** extracción de elementos de listas
- **Procesamiento de imágenes:** OCR y interpretación
- **Generación de recetas:** creación automática de listas de ingredientes
- **Prompts multiidioma:** optimizados por idioma del usuario

### 💳 **RevenueCat (Suscripciones)**
```javascript
// Configuración en App.js
await Purchases.configure({ 
  apiKey: "appl_bHxScLAZLsKxfggiOiqVAZTXjJX" 
});
```

### 🔔 **Push Notifications**
- Configuración automática al primer uso
- Recordatorios de listas
- Promociones de suscripción

---

## 🎯 Funcionalidades Premium vs Gratuito

### 🆓 **Versión Gratuita:**
- ✅ Creación de listas por voz (limitada)
- ✅ Análisis básico de imágenes
- ✅ Guardado de listas
- ❌ Contiene publicidad
- ❌ Funcionalidades limitadas

### 💎 **Versión Premium:**
- ✅ Reconocimiento de voz ilimitado
- ✅ Análisis avanzado de imágenes
- ✅ Generación de listas por recetas
- ✅ Sin publicidad
- ✅ Exportación de listas
- ✅ Sincronización en la nube

---

## 🛠️ Herramientas de Desarrollo Recomendadas

### 📝 **IDE/Editores:**
- **VS Code** con extensiones React Native
- **Expo CLI** para desarrollo
- **React Native Debugger** para debugging

### 🔧 **Debugging:**
- Flipper para debugging nativo
- Metro bundler logs
- Device logs para problemas nativos

### 📱 **Testing:**
- **iOS Simulator** (macOS)
- **Android Emulator** (todas las plataformas)
- **Expo Go** para testing rápido

---

## 🚨 Problemas Comunes y Soluciones

### 🎙️ **Reconocimiento de Voz**
**Problema:** No funciona en simulador
**Solución:** Siempre probar en dispositivo físico

### 🔑 **API Keys**
**Problema:** Error de autenticación con OpenAI
**Solución:** Verificar variables de entorno en `.env`

### 📱 **Navegación**
**Problema:** Pantallas no se renderizan correctamente
**Solución:** Verificar estructura de Stack y Drawer Navigators

### 🎨 **Temas**
**Problema:** Colores no cambian
**Solución:** Asegurar que el componente está dentro de `ThemeProvider`

---

## 📋 Roadmap y Mejoras Futuras

### 🔄 **Próximas Actualizaciones:**
- [ ] **Sincronización en la nube** - backup automático
- [ ] **Colaboración** - listas compartidas en tiempo real
- [ ] **IA mejorada** - reconocimiento de contexto avanzado
- [ ] **Widgets** - acceso rápido desde home screen
- [ ] **Wear OS/watchOS** - creación de listas desde wearables
- [ ] **Integración con supermercados** - precios en tiempo real
- [ ] **Modo offline** - funcionalidad sin conexión

### 🎨 **Mejoras de Diseño:**
- [ ] **Material Design 3** - actualización visual
- [ ] **Animaciones mejoradas** - transiciones más fluidas
- [ ] **Accesibilidad** - soporte completo para VoiceOver/TalkBack
- [ ] **Modo oscuro automático** - basado en hora del día

---

## 👨‍💻 Guía de Contribución

### ✅ **Antes de Empezar:**
1. Familiarizarse con la estructura del proyecto
2. Revisar issues existentes en GitHub
3. Seguir convenciones de código establecidas
4. Probar en múltiples idiomas y dispositivos

### 🔀 **Flujo de Git:**
```bash
# Crear rama para nueva funcionalidad
git checkout -b feature/nueva-funcionalidad

# Hacer commits descriptivos
git commit -m "feat: añadir reconocimiento de voz mejorado"

# Crear PR con descripción detallada
```

### 📝 **Convenciones de Código:**
- Usar `camelCase` para variables y funciones
- Comentarios en español para explicar lógica compleja
- Mantener componentes pequeños y reutilizables
- Seguir estructura de carpetas establecida

---

## 🏆 Conclusión

VoiceList es una aplicación compleja que integra múltiples tecnologías avanzadas para crear una experiencia de usuario fluida y inteligente. La arquitectura modular permite escalabilidad y mantenimiento sencillo, mientras que el sistema de temas y traducciones asegura accesibilidad global.

**¡Listo para comenzar el desarrollo! 🚀**

---
*Documentación actualizada: Noviembre 2024*
*Version: 1.0.6*