# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# react-native-gesture-handler
-keep class com.swmansion.gesturehandler.** { *; }

# react-native-screens
-keep class com.swmansion.rnscreens.** { *; }

# react-native-safe-area-context
-keep class com.th3rdwave.safeareacontext.** { *; }

# @react-native-async-storage/async-storage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# @react-native-community/voice
-keep class com.wenkesj.voice.** { *; }

# react-native-permissions
-keep class com.zoontek.rnpermissions.** { *; }

# react-native-image-picker
-keep class com.imagepicker.** { *; }

# react-native-device-info
-keep class com.learnium.RNDeviceInfo.** { *; }

# react-native-fs
-keep class com.rnfs.** { *; }

# react-native-calendar-events
-keep class com.calendarevents.** { *; }

# react-native-sound
-keep class com.zmxv.RNSound.** { *; }

# react-native-purchases (RevenueCat)
-keep class com.revenuecat.purchases.** { *; }
-keep class com.android.billingclient.api.** { *; }

# react-native-linear-gradient
-keep class com.BV.LinearGradient.** { *; }

# react-native-blur
-keep class com.cmcewen.blurview.** { *; }

# Expo modules
-keep class expo.modules.** { *; }
-keepclassmembers class expo.modules.** { *; }

# Keep native methods
-keepclassmembers class * {
    native <methods>;
}

# Keep React Native classes
-dontwarn com.facebook.react.**
-dontwarn expo.modules.**

# Hermes
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jsi.** { *; }

# OkHttp (used by many libraries)
-dontwarn okhttp3.**
-dontwarn okio.**
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase

# Gson (if used)
-keep class com.google.gson.** { *; }
-keepattributes Signature
-keepattributes *Annotation*

# Keep source file names and line numbers for better crash reports
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Add any project specific keep options here:
