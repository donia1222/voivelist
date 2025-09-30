"use client"

import React, { useState, useEffect } from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import * as Updates from "expo-updates"
import { ThemeProvider } from "./ThemeContext"
import { NotificationProvider } from "./NotificationContext"
import { RecordingProvider } from "./RecordingContext"
import { HapticProvider } from "./HapticContext"
import AppContent from "./navigation/navigators/DrawerNavigator"
import LoadingScreen from "./screens/LoadingScreen"

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkForUpdates() {
      try {
        const update = await Updates.checkForUpdateAsync()
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync()
          await Updates.reloadAsync()
        }
      } catch (e) {
        console.log("Error checking for updates:", e)
      }
    }

    checkForUpdates()

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <LoadingScreen />
      </GestureHandlerRootView>
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <NotificationProvider>
          <RecordingProvider>
            <HapticProvider>
              <AppContent />
            </HapticProvider>
          </RecordingProvider>
        </NotificationProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}