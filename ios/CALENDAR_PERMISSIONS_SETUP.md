# 📅 Configuración de Permisos de Calendario iOS

## ✅ Permisos Agregados Automáticamente

He configurado todos los permisos necesarios para que el calendario funcione correctamente:

### 📱 Info.plist - Permisos iOS
Se agregaron las siguientes claves de privacidad:

```xml
<key>NSCalendarsUsageDescription</key>
<string>Voice Grocery needs access to your calendar to create shopping events and reminders. This helps you plan your grocery shopping and get notified when it's time to shop.</string>

<key>NSRemindersUsageDescription</key>
<string>Voice Grocery needs access to your reminders to create shopping notifications and alerts for your planned grocery trips.</string>
```

### 🔧 Funcionalidad Implementada

1. **Solicitud de Permisos Inteligente:**
   - La app solicita permisos solo cuando es necesario
   - Si se deniegan los permisos, ofrece ir a Configuración
   - Funciona sin permisos (solo guarda eventos localmente)

2. **Manejo de Estados:**
   - `authorized`: Permisos concedidos ✅
   - `denied`: Permisos denegados ❌
   - `restricted`: Restricciones parentales 🔒
   - `undetermined`: No se han solicitado permisos ❓

3. **Experiencia de Usuario:**
   - Alerta explicativa si se deniegan permisos
   - Opción para abrir Configuración directamente
   - Funcionalidad degradada sin romper la app

## 🎯 Cómo Funcionará para el Usuario

### Primer Uso:
1. Usuario va a "Calendario de Compras"
2. Usuario toca "Añadir Evento de Compra"
3. Usuario activa "Sincronizar con Calendario"
4. **iOS solicita automáticamente el permiso**
5. Usuario ve el mensaje: *"Voice Grocery needs access to your calendar to create shopping events and reminders..."*

### Si el Usuario Acepta:
✅ Eventos se crean en Calendario nativo
✅ Recordatorios automáticos
✅ Funcionalidad completa

### Si el Usuario Rechaza:
⚠️ Alerta: "Calendar Permission Required"
🔧 Opción: "Abrir Configuración" 
💾 Los eventos se guardan solo localmente
🔄 Puede habilitar más tarde

## 📋 Para Probar los Permisos:

### En Simulador iOS:
1. Abre Configuración > Privacidad y Seguridad > Calendarios
2. Deberías ver "Voice Grocery" en la lista
3. Puedes alternar ON/OFF para probar

### En Dispositivo Real:
1. Configuración > Privacidad y Seguridad > Calendarios > Voice Grocery
2. Activa/desactiva para probar diferentes estados

## 🚀 Build & Test

```bash
# Instalar dependencias
cd ios && pod install

# Compilar app
npx react-native run-ios
```

## 📝 Notas Técnicas

- **Paquete Usado:** `react-native-calendar-events@2.2.0`
- **iOS Mínimo:** iOS 13.4 (ya configurado)
- **Permisos:** NSCalendarsUsageDescription + NSRemindersUsageDescription
- **Fallback:** Funciona sin permisos (solo almacenamiento local)

## ✨ Funciones del Calendario

1. **Crear Eventos de Compras**
2. **Repetición:** Nunca, Semanal, Quincenal, Mensual
3. **Recordatorios:** 15 min antes (configurable)
4. **Sincronización:** Con Calendario nativo de iOS
5. **Notas:** Incluye lista de compras en el evento

¡Los permisos están completamente configurados y listos para usar! 🎉