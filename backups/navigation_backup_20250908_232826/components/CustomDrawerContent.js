import React, { useState } from "react"
import {
  View,
  TouchableOpacity,
  Text,
  Share,
  Image,
  Linking,
} from "react-native"
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../ThemeContext"
import * as RNLocalize from "react-native-localize"
import { translations } from "../../translations"
import { styles } from "../../styles/AppStyles"
import DeviceInfo from "react-native-device-info"
import PrivacyModal from "../../screens/links/PrivacyModal"

const getCurrentTranslations = () => {
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  return translations[deviceLanguage] || translations["en"]
}

function CustomDrawerContent(props) {
  const { theme, toggleTheme } = useTheme()
  const { isSubscribed } = props
  const currentTranslations = getCurrentTranslations()
  const [isPrivacyModalVisible, setIsPrivacyModalVisible] = useState(false)

  const shareMessage = currentTranslations.shareMessage
  const shareAppLink = async () => {
    try {
      const result = await Share.share({
        message: shareMessage,
      })

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with activity type of", result.activityType)
        } else {
          console.log("Shared")
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Dismissed")
      }
    } catch (error) {
      console.error("Error al compartir", error.message)
    }
  }

  const handlePrivacyPress = () => {
    setIsPrivacyModalVisible(true)
  }

  const handleContactPress = () => {
    const emailBody = `
      Device Model: ${DeviceInfo.getModel()}\n
      OS Version: ${DeviceInfo.getSystemVersion()}\n
    `

    const mailtoURL = `mailto:info@lweb.ch?subject=Contact&body=${encodeURIComponent(emailBody)}`
    Linking.openURL(mailtoURL).catch((err) => console.error("Failed to open mail app:", err))
  }

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Image
          source={require("../../assets/images/App-Icon-1024x1024@1x copia.png")}
          style={styles.drawerLogo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.separator} />

      <DrawerItemList {...props} itemStyle={styles.drawerItem} labelStyle={styles.drawerItemLabel} />

      <View style={styles.separator} />

      <DrawerItem
        label={currentTranslations.share}
        onPress={shareAppLink}
        icon={({ color, size }) => <Ionicons name="share-social-outline" size={24} color={"#4a6bff"} />}
        labelStyle={[styles.drawerItemLabel, { color: theme.textdos }]}
        style={styles.drawerItem}
      />

      <DrawerItem
        label={currentTranslations.contactUs}
        onPress={handleContactPress}
        icon={({ color, size }) => <Ionicons name="mail-outline" size={24} color={"#ff9500"} />}
        labelStyle={[styles.drawerItemLabel, { color: theme.textdos }]}
        style={styles.drawerItem}
      />

      <DrawerItem
        label={currentTranslations.privacyPolicy}
        onPress={handlePrivacyPress}
        icon={({ color, size }) => <Ionicons name="shield-outline" size={24} color={"#34c759"} />}
        labelStyle={[styles.drawerItemLabel, { color: theme.textdos }]}
        style={styles.drawerItem}
      />

      <View style={styles.drawerFooter}>
        <Text style={styles.footerText}>Powered by Chat GPT</Text>
      </View>

      <PrivacyModal visible={isPrivacyModalVisible} onClose={() => setIsPrivacyModalVisible(false)} />
    </DrawerContentScrollView>
  )
}

export default CustomDrawerContent