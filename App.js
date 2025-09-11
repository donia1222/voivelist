"use client"

import React, { useState, useEffect } from "react"
import { ThemeProvider } from "./ThemeContext"
import { NotificationProvider } from "./NotificationContext"
import { RecordingProvider } from "./RecordingContext"
import { HapticProvider } from "./HapticContext"
import AppContent from "./navigation/navigators/DrawerNavigator"
import LoadingScreen from "./screens/LoadingScreen"

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <ThemeProvider>
      <NotificationProvider>
        <RecordingProvider>
          <HapticProvider>
            <AppContent />
          </HapticProvider>
        </RecordingProvider>
      </NotificationProvider>
    </ThemeProvider>
  )
}