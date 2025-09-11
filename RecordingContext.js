import React, { createContext, useContext, useState } from 'react'

const RecordingContext = createContext()

export const RecordingProvider = ({ children }) => {
  const [isRecording, setIsRecording] = useState(false)

  return (
    <RecordingContext.Provider value={{ isRecording, setIsRecording }}>
      {children}
    </RecordingContext.Provider>
  )
}

export const useRecording = () => {
  const context = useContext(RecordingContext)
  if (!context) {
    throw new Error('useRecording must be used within a RecordingProvider')
  }
  return context
}