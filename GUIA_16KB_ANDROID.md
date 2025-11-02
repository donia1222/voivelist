# Guía: Configurar App React Native para Soporte de 16 KB en Android

Esta guía te ayudará a configurar cualquier app React Native/Expo para cumplir con los requisitos de Google Play de soportar tamaños de página de memoria de 16 KB en Android 15+.

**Fecha límite:** 31 de mayo de 2026

---

## ¿Por qué es necesario?

A partir del 31 de mayo de 2026, Google Play requiere que todas las apps que apunten a Android 15+ soporten tamaños de página de memoria de 16 KB en dispositivos de 64 bits. Si no cumples con esto, no podrás publicar actualizaciones de tu app.

---

## Pasos a Seguir

### 1. Actualizar `android/gradle.properties`

Busca la línea que define `reactNativeArchitectures` y cámbiala para **solo incluir arquitecturas de 64 bits**:

```properties
# ANTES (incluía 32 bits):
reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64

# DESPUÉS (solo 64 bits):
# Only 64-bit architectures for 16KB page size support (Android 15+)
reactNativeArchitectures=arm64-v8a,x86_64
```

Luego, busca la configuración de `expo.useLegacyPackaging` y cámbiala a `true`:

```properties
# Use legacy packaging to compress native libraries in the resulting APK.
# Set to true for 16KB page size support with older AGP versions
expo.useLegacyPackaging=true
```

---

### 2. Actualizar `android/app/build.gradle`

Agrega la configuración de **splits ABI** dentro del bloque `android {}`, después de `packagingOptions`:

```gradle
android {
    // ... otras configuraciones ...

    packagingOptions {
        jniLibs {
            useLegacyPackaging (findProperty('expo.useLegacyPackaging')?.toBoolean() ?: false)
        }
    }

    // Support for 16KB page sizes (Android 15+)
    splits {
        abi {
            reset()
            enable true
            universalApk false
            // Only 64-bit architectures for 16KB page size support
            include "arm64-v8a", "x86_64"
        }
    }
}
```

---

### 3. Verificar `android/build.gradle` (raíz del proyecto)

Asegúrate de que tu `targetSdkVersion` y `compileSdkVersion` estén actualizados. Para proyectos actuales, usa SDK 34 (cuando SDK 35 esté disponible oficialmente, actualiza a 35):

```gradle
buildscript {
    ext {
        buildToolsVersion = findProperty('android.buildToolsVersion') ?: '34.0.0'
        minSdkVersion = Integer.parseInt(findProperty('android.minSdkVersion') ?: '23')
        compileSdkVersion = Integer.parseInt(findProperty('android.compileSdkVersion') ?: '34')
        targetSdkVersion = Integer.parseInt(findProperty('android.targetSdkVersion') ?: '34')
        // Cuando SDK 35 esté disponible, cambia a '35'
    }
}
```

---

### 4. (Opcional) Actualizar `app.json`

Si usas Expo, asegúrate de tener `versionCode` en la configuración de Android:

```json
{
  "expo": {
    "android": {
      "versionCode": 1,
      "package": "com.tuapp.nombre"
    }
  }
}
```

---

## Compilar y Probar

### Limpiar el build cache

```bash
cd android
./gradlew clean
cd ..
```

### Compilar con EAS Build (Recomendado)

```bash
eas build --platform android --profile production
```

### Compilar localmente (Alternativa)

```bash
cd android
./gradlew assembleRelease
cd ..
```

---

## Verificar Compatibilidad de 16 KB

### Opción 1: Usar Emulador Android

1. Descarga una imagen del sistema "Google APIs Experimental 16 KB Page Size" (ARM 64 v8a o x86_64)
2. Crea un dispositivo virtual con Android 15+ usando la imagen de 16 KB
3. Verifica con: `adb shell getconf PAGE_SIZE` (debería retornar `16384`)

### Opción 2: Dispositivo Físico (Pixel 8/9)

1. Habilita las Opciones de Desarrollador
2. Activa "Boot with 16KB page size" (Arrancar con tamaño de página de 16KB)
3. Reinicia el dispositivo
4. Verifica con: `adb shell getconf PAGE_SIZE` (debería retornar `16384`)

### Verificar el APK generado

```bash
# Verificar alineación del APK
zipalign -c -P 16 -v 4 app-release.apk

# Verificar alineación de segmentos ELF en librerías
llvm-objdump -p path/to/library.so | grep LOAD
# Debería mostrar "align 2**14" o superior
```

---

## Preguntas Frecuentes

### ¿Puedo seguir soportando dispositivos de 32 bits?

No, si quieres cumplir con el requisito de 16 KB. Las librerías nativas de React Native para arquitecturas de 32 bits no son compatibles con páginas de 16 KB.

### ¿Afectará esto a mis usuarios actuales?

No significativamente. La gran mayoría de dispositivos Android modernos (desde 2015+) son de 64 bits. Los dispositivos muy antiguos de 32 bits ya no recibirán actualizaciones de tu app, pero seguirán usando la última versión instalada.

### ¿Qué pasa si uso librerías nativas de terceros?

La mayoría de las librerías populares ya están siendo actualizadas para soportar 16 KB. Si encuentras problemas:

1. Actualiza todas tus dependencias a las últimas versiones
2. Verifica los issues en GitHub de cada librería
3. Contacta a los mantenedores si es necesario

### ¿Necesito actualizar React Native?

React Native 0.77+ tiene soporte completo integrado para 16 KB. Si usas versiones anteriores (como 0.74), los cambios en esta guía deberían ser suficientes, pero considera actualizar a largo plazo.

---

## Recursos Adicionales

- [Documentación oficial de Android - Soporte de 16 KB](https://developer.android.com/guide/practices/page-sizes)
- [React Native 0.77 - Anuncio de soporte 16KB](https://reactnative.dev/blog/2025/01/21/version-0.77)
- [Expo Build Configuration](https://docs.expo.dev/build/introduction/)

---

## Checklist Final

Antes de enviar tu app a Google Play, verifica:

- [ ] Arquitecturas limitadas a 64 bits (arm64-v8a, x86_64)
- [ ] `expo.useLegacyPackaging=true` en gradle.properties
- [ ] Configuración de `splits.abi` en app/build.gradle
- [ ] Compilación exitosa sin errores
- [ ] Probado en emulador/dispositivo con 16 KB
- [ ] APK verificado con zipalign

---

**Última actualización:** Noviembre 2025
**Versión de la guía:** 1.0
