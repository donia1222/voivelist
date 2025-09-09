import React from "react"
import {
  View,
  TouchableOpacity,
  Text,
  Image,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useDrawerStatus } from "@react-navigation/drawer"
import { styles } from "../../styles/AppStyles"

function HeaderWithLogo({ navigation, isDrawerOpen, theme, title }) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerLogoContainer}>
        <Image
          source={require("../../assets/images/App-Icon-1024x1024@1x copia.png")}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        {title && <Text style={styles.headerTitle}>{title}</Text>}
      </View>

      <TouchableOpacity style={styles.headerMenuButton} onPress={() => navigation.openDrawer()}>
        <Ionicons name={isDrawerOpen ? "close" : "menu"} size={36} color={theme.backgroundtresapp} />
      </TouchableOpacity>
    </View>
  )
}

function TabletHeaderWithMenu({ navigation, theme, title }) {
  return (
    <View style={[styles.tabletHeader, { backgroundColor: theme.background }]}>
      <View style={styles.tabletLogoContainer}>
        <Image
          source={require("../../assets/images/App-Icon-1024x1024@1x copia.png")}
          style={styles.tabletLogo}
          resizeMode="contain"
        />
        <Text style={[styles.tabletTitle, { color: theme.text }]}>{title}</Text>
      </View>

      <TouchableOpacity style={styles.tabletMenuButton} onPress={() => navigation.openDrawer()}>
        <Ionicons name="menu" size={28} color={theme.backgroundtresapp} />
      </TouchableOpacity>
    </View>
  )
}

export { HeaderWithLogo, TabletHeaderWithMenu }