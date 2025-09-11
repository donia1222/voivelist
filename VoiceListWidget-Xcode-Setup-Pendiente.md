# VoiceListWidget - Configuración Pendiente en Xcode

## Estado Actual del Widget

✅ **Ya Implementado:**
- Widget Swift creado (`VoiceListWidget.swift`)
- Bridge nativo para compartir datos (`WidgetDataBridge.swift`)
- Servicio React Native (`WidgetService.js`)
- Diferentes tamaños de widget (pequeño, mediano, grande)
- Vistas personalizadas con gradientes y diseño atractivo
- Sistema de deep linking con URLs personalizadas
- TimelineProvider para actualización de datos

❌ **Falta por Configurar en Xcode:**

## 1. App Groups - CRÍTICO ⚠️

### Problema Actual:
El bridge utiliza `group.com.voicelist.widget` pero **no está configurado el App Group en Xcode**.

### Pasos Requeridos:
1. **En Apple Developer Portal:**
   - Crear App Group: `group.com.voicelist.widget`
   - Asociar el App Group a ambos Bundle IDs:
     - App principal: `com.roberto.VoiceList` (o el que uses)
     - Widget: `com.roberto.VoiceList.VoiceListWidget`

2. **En Xcode - Target Principal (VoiceList):**
   - Ir a "Signing & Capabilities"
   - Añadir capability "App Groups"
   - Activar: `group.com.voicelist.widget`

3. **En Xcode - Target Widget (VoiceListWidget):**
   - Ir a "Signing & Capabilities" 
   - Añadir capability "App Groups"
   - Activar: `group.com.voicelist.widget`

## 2. Entitlements del Widget

### Archivo Faltante:
Crear: `ios/VoiceListWidget/VoiceListWidget.entitlements`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.application-groups</key>
    <array>
        <string>group.com.voicelist.widget</string>
    </array>
</dict>
</plist>
```

### Configurar en Xcode:
- Seleccionar target VoiceListWidget
- Build Settings → Code Signing Entitlements
- Establecer path: `VoiceListWidget/VoiceListWidget.entitlements`

## 3. Actualizar Entitlements de la App Principal

### Modificar: `ios/VoiceList/VoiceList.entitlements`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>aps-environment</key>
    <string>development</string>
    <key>com.apple.security.application-groups</key>
    <array>
        <string>group.com.voicelist.widget</string>
    </array>
</dict>
</plist>
```

## 4. Bundle IDs y Configuración

### Verificar Bundle IDs:
- **App Principal**: Mantener el actual
- **Widget**: Debe ser `{APP_BUNDLE_ID}.VoiceListWidget`

### En project.pbxproj verificar:
- PRODUCT_BUNDLE_IDENTIFIER para ambos targets
- DEVELOPMENT_TEAM configurado correctamente
- Provisioning profiles correctos

## 5. Bridge Nativo - Configuración Objective-C

### Crear: `ios/VoiceList/WidgetDataBridge.m`

```objc
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(WidgetDataBridge, NSObject)

RCT_EXTERN_METHOD(updateWidgetData:(NSArray *)favorites
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getWidgetData:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(clearWidgetData:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
```

### Añadir a project.pbxproj:
- Incluir `WidgetDataBridge.m` en el target principal
- Incluir `WidgetDataBridge.swift` en el target principal

## 6. Deep Linking - URL Scheme

### Configurar en Info.plist de la app principal:

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLName</key>
        <string>com.voicelist.urlscheme</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>voicelist</string>
        </array>
    </dict>
</array>
```

## 7. Verificación de Configuración del Widget

### En Xcode verificar que el target VoiceListWidget tenga:
- **iOS Deployment Target**: 14.0 o superior
- **Bundle Identifier**: Correcto y único
- **App Group**: Habilitado y configurado
- **Widget Extension**: Configurado en Info.plist

## 8. Testing y Debug

### Comandos para probar:
```bash
# Limpiar build
rm -rf ~/Library/Developer/Xcode/DerivedData

# Rebuild completo
cd ios && xcodebuild clean && cd ..
npx react-native run-ios
```

### Debug del App Group:
En VoiceListWidget.swift, añadir logs temporales:
```swift
func loadFavorites() -> [String] {
    let sharedDefaults = UserDefaults(suiteName: "group.com.voicelist.widget")
    print("✅ Shared UserDefaults disponible: \(sharedDefaults != nil)")
    let favorites = sharedDefaults?.array(forKey: "favoritesList") as? [String] ?? []
    print("✅ Favoritos cargados: \(favorites)")
    return favorites
}
```

## 9. Checklist Final

- [ ] App Group creado en Developer Portal
- [ ] App Group habilitado en ambos targets
- [ ] Entitlements del widget creado y configurado
- [ ] Entitlements de la app principal actualizado
- [ ] WidgetDataBridge.m creado y añadido al proyecto
- [ ] URL Scheme configurado en Info.plist
- [ ] Bundle IDs correctos para ambos targets
- [ ] Widget target configurado con iOS 14.0+
- [ ] Provisioning profiles actualizados
- [ ] Test en dispositivo físico

## 10. Problemas Comunes

### Si el widget no aparece:
- Verificar Bundle ID único
- Confirmar que iOS Deployment Target ≥ 14.0
- Reinstalar app completamente

### Si no se actualizan los datos:
- Verificar App Group funcionando
- Comprobar que WidgetCenter.shared.reloadAllTimelines() se llama
- Revisar logs en Console.app

### Si el deep linking no funciona:
- Verificar URL Scheme en Info.plist
- Implementar scene delegate correctamente

---

**Nota**: Una vez configurados los App Groups, el widget debería funcionar correctamente. Los archivos Swift ya están implementados y son funcionales.