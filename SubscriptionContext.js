import React, { createContext, useContext, useState, useEffect } from 'react'
import Purchases from 'react-native-purchases'

const SubscriptionContext = createContext()

export const useSubscription = () => {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error('useSubscription debe ser usado dentro de un SubscriptionProvider')
  }
  return context
}

export const SubscriptionProvider = ({ children }) => {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const checkSubscriptionStatus = async () => {
    try {
      setIsLoading(true)
      const customerInfo = await Purchases.getCustomerInfo()
      // Usar el mismo identificador que en DrawerNavigator
      const hasActiveSubscription = customerInfo.entitlements.active["12981"] !== undefined
      setIsSubscribed(hasActiveSubscription)
      console.log('🔄 Estado de suscripción actualizado:', hasActiveSubscription ? 'Activa' : 'Inactiva')
      return hasActiveSubscription
    } catch (error) {
      console.error('Error verificando suscripción:', error)
      setIsSubscribed(false)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const refreshSubscription = async () => {
    await checkSubscriptionStatus()
  }

  useEffect(() => {
    checkSubscriptionStatus()
  }, [])

  const value = {
    isSubscribed,
    isLoading,
    checkSubscriptionStatus,
    refreshSubscription
  }

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export default SubscriptionContext