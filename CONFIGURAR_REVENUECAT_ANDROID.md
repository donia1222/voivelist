# Configuración de RevenueCat para Android

Esta guía te ayudará a activar las suscripciones de RevenueCat en tu app de Android.

## Estado Actual

✅ **iOS**: Funcionando correctamente con la API key `appl_bHxScLAZLsKxfggiOiqVAZTXjJX`

⚠️ **Android**: Configuración pendiente - actualmente usa placeholder `goog_PLACEHOLDER_ANDROID_KEY`

---

## Pasos para Activar RevenueCat en Android

### 1. Obtener la API Key de Android desde RevenueCat

1. Inicia sesión en tu cuenta de [RevenueCat](https://app.revenuecat.com/)

2. Ve a tu proyecto **VoiceList**

3. En el menú lateral, ve a **⚙️ Settings → Apps**

4. Selecciona tu app de Android o créala si no existe:
   - Click en **+ New App**
   - Nombre: `VoiceList Android`
   - Platform: `Android`
   - Bundle ID: `com.lwebch.VoiceList` (debe coincidir con tu package en app.json)

5. Una vez creada la app, verás la **Google Play SDK Key**
   - Se verá algo como: `goog_xxxxxxxxxxxxxxxxx`
   - **COPIA esta key** - la necesitarás en el paso 3

### 2. Conectar Google Play Console con RevenueCat

Para que RevenueCat pueda verificar las compras de Android, necesitas vincular tu cuenta de Google Play:

1. En RevenueCat, ve a tu app de Android

2. Click en **Service Credentials**

3. Sigue las instrucciones para crear una **Service Account** en Google Cloud Platform:

   a. Ve a [Google Cloud Console](https://console.cloud.google.com/)

   b. Selecciona el proyecto vinculado a tu Google Play Console

   c. Ve a **IAM & Admin → Service Accounts**

   d. Click en **+ CREATE SERVICE ACCOUNT**

   e. Nombre: `RevenueCat`

   f. Click **Create and Continue**

   g. Role: Selecciona **Pub/Sub → Pub/Sub Editor**

   h. Click **Done**

4. Crear la clave JSON:

   a. Click en el Service Account que acabas de crear

   b. Ve a la pestaña **KEYS**

   c. Click **ADD KEY → Create new key**

   d. Selecciona **JSON**

   e. Click **CREATE** - se descargará un archivo JSON

5. Subir la clave a RevenueCat:

   a. Vuelve a RevenueCat, en la sección **Service Credentials**

   b. Click en **Upload Credentials**

   c. Sube el archivo JSON que descargaste

6. Vincular con Google Play Console:

   a. Ve a [Google Play Console](https://play.google.com/console/)

   b. Selecciona tu app **VoiceList**

   c. Ve a **Monetization → Monetization setup**

   d. En **Services & APIs**, agrega el email del Service Account que creaste

   e. Otorga permisos de **View financial data**

### 3. Actualizar el Código con la API Key de Android

Una vez que tengas la API key de Android (`goog_xxxxxxxxx`), actualiza el código:

**Archivo:** `/Users/roberto/VoiceList/navigation/navigators/DrawerNavigator.js`

**Línea 91** - Reemplaza:
```javascript
: "goog_PLACEHOLDER_ANDROID_KEY";      // Android API key (reemplazar cuando esté disponible)
```

**Por:**
```javascript
: "goog_TU_API_KEY_AQUI";  // Android API key de RevenueCat
```

⚠️ **IMPORTANTE**: También actualiza esta key en estos archivos:
- `/Users/roberto/VoiceList/screens/HomeScreen.js` (línea ~777)
- `/Users/roberto/VoiceList/screens/ImageListScreen.js` (línea ~743)
- `/Users/roberto/VoiceList/historial3Fvoritos.js` (línea ~178)

Actualmente estos archivos tienen hardcodeada la key de iOS. Deberían usar la misma lógica del DrawerNavigator:

```javascript
const apiKey = Platform.OS === 'ios'
  ? "appl_bHxScLAZLsKxfggiOiqVAZTXjJX"  // iOS API key
  : "goog_TU_API_KEY_AQUI";              // Android API key

await Purchases.configure({ apiKey: apiKey });
```

### 4. Configurar Productos en RevenueCat

1. En RevenueCat, ve a **Products**

2. Si ya tienes productos configurados para iOS, necesitas **vincularlos a Android**:

   a. Click en cada producto existente

   b. En la sección **App Store Connect**, ya verás el producto de iOS

   c. Agrega el **Google Play product ID** correspondiente

3. Si aún no has creado productos en Google Play Console:

   a. Ve a [Google Play Console](https://play.google.com/console/)

   b. Selecciona tu app

   c. Ve a **Monetization → Products → Subscriptions**

   d. Click **+ Create subscription**

   e. Crea tus planes (ejemplo):
      - **Product ID**: `premium_monthly`
      - **Name**: Premium Monthly
      - **Price**: Define el precio
      - **Billing period**: 1 month

   f. Repite para otros planes (3 meses, 6 meses, anual, etc.)

4. Vuelve a RevenueCat y vincula estos Product IDs a tus productos existentes

### 5. Configurar Entitlements en RevenueCat

1. En RevenueCat, ve a **Entitlements**

2. Verifica que tengas configurado el entitlement `premium` (o el que uses en tu código)

3. Asegúrate de que todos tus productos (iOS y Android) estén vinculados a este entitlement

En tu código actual usas:
```javascript
purchaserInfo.entitlements.active['premium']
purchaserInfo.entitlements.active['12981']
```

### 6. Configurar Offerings en RevenueCat

1. En RevenueCat, ve a **Offerings**

2. Crea o edita tu offering actual

3. Agrega los paquetes que quieres mostrar a los usuarios:
   - Monthly package
   - 3-Month package
   - 6-Month package
   - Annual package

4. Asigna los productos correspondientes (tanto iOS como Android) a cada paquete

---

## Verificación de la Configuración

### ✅ Checklist antes de hacer el build:

- [ ] API key de Android obtenida de RevenueCat
- [ ] Service Account creada y vinculada
- [ ] Productos creados en Google Play Console
- [ ] Productos vinculados en RevenueCat
- [ ] Entitlement `premium` configurado
- [ ] Offering con paquetes configurada
- [ ] Código actualizado con la API key de Android en todos los archivos
- [ ] Permiso `com.android.vending.BILLING` agregado al AndroidManifest.xml ✅ (ya está hecho)

---

## Probar las Suscripciones

### 1. Configurar Testers

1. En Google Play Console, ve a **Testing → License testing**

2. Agrega emails de cuentas de prueba

3. Estas cuentas podrán hacer compras de prueba sin pagar

### 2. Build de Prueba

```bash
# Compilar versión de prueba
eas build --platform android --profile preview
```

### 3. Probar la Compra

1. Instala el APK/AAB en un dispositivo de prueba

2. Inicia sesión con una cuenta de tester

3. Intenta suscribirte al plan premium

4. Verifica en RevenueCat Dashboard que la compra se registró

---

## Cambios Ya Realizados

✅ **AndroidManifest.xml** - Agregado permiso de facturación:
```xml
<uses-permission android:name="com.android.vending.BILLING"/>
```

✅ **Configuración 16KB** - Ya está lista para cumplir requisitos de Google Play

---

## Problemas Comunes

### Error: "No offerings found"
- Verifica que hayas configurado al menos un Offering en RevenueCat
- Asegúrate de que el Offering tenga productos de Android vinculados

### Error: "Unable to buy item"
- Verifica que el producto existe en Google Play Console
- Asegúrate de que el producto esté en estado **Active**
- Verifica que el Product ID coincida exactamente

### Error: "Service credentials not configured"
- Completa el paso 2 (Service Account de Google Cloud)
- Asegúrate de haber subido el JSON a RevenueCat

### Las compras no se reflejan en RevenueCat
- Verifica la vinculación entre Google Play Console y RevenueCat
- Puede tomar unos minutos en aparecer
- Verifica los logs en RevenueCat Dashboard → Customer History

---

## Recursos Adicionales

- [Documentación RevenueCat - Android](https://www.revenuecat.com/docs/getting-started/installation/android)
- [Configurar Google Play Billing](https://www.revenuecat.com/docs/google-play-billing)
- [Crear productos en Google Play](https://support.google.com/googleplay/android-developer/answer/12124625)
- [Testing de suscripciones en Android](https://www.revenuecat.com/docs/google-play-billing/test-and-launch)

---

## Próximos Pasos

1. **Obtén la API key de Android** siguiendo el Paso 1

2. **Configura Service Credentials** siguiendo el Paso 2

3. **Actualiza el código** con la API key (Paso 3)

4. **Crea los productos** en Google Play Console (Paso 4)

5. **Vincula todo en RevenueCat** (Pasos 4-6)

6. **Haz un build de prueba** y verifica que funcione

7. **Publica la actualización** cuando todo esté probado

---

**¡Importante!** Una vez que configures todo, las suscripciones de Android funcionarán exactamente igual que en iOS. Los usuarios de Android podrán suscribirse y disfrutar de todas las funcionalidades premium.

---

**Última actualización:** Noviembre 2025
**Versión:** 1.0
