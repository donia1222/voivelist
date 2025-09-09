import React, { useState } from "react"
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../ThemeContext"
import * as RNLocalize from "react-native-localize"
import { translations } from "../../translations"
import { styles } from "../../styles/AppStyles"
import HomeScreen from "../../screens/HomeScreen"
import ImageListScreen from "../../screens/ImageListScreen"
import HistoryScreen from "../../screens/HistoryScreen"
import Suscribe from "../../screens/Suscribe"
import MySubscriptionScreen from "../../screens/MySubscriptionScreen"

const getCurrentTranslations = () => {
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  return translations[deviceLanguage] || translations["en"]
}

function TabletTopTabNavigator({ navigation, isSubscribed }) {
  const { theme } = useTheme()
  const currentTranslations = getCurrentTranslations()
  const [activeTab, setActiveTab] = useState("VoiceList")

  const tabs = [
    {
      key: "VoiceList",
      label: currentTranslations.createList,
      icon: "mic-outline",
      color: "#4a6bff",
    },
    {
      key: "ImageList",
      label: currentTranslations.imageList,
      icon: "image-outline",
      color: "#ff9500",
    },
    {
      key: "SavedLists",
      label: currentTranslations.saved,
      icon: "bookmark-outline",
      color: "#34c759",
    },
    ...(isSubscribed
      ? [
          {
            key: "MySubscription",
            label: currentTranslations.mySubscription,
            icon: "star",
            color: "#ff375f",
          },
        ]
      : [
          {
            key: "Subscribe",
            label: currentTranslations.subscribe,
            icon: "star-outline",
            color: "#ff375f",
          },
        ]),
  ]

  const handleTabPress = (tab) => {
    setActiveTab(tab.key)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "VoiceList":
        return <HomeScreen navigation={navigation} />
      case "ImageList":
        return <ImageListScreen navigation={navigation} />
      case "SavedLists":
        return <HistoryScreen navigation={navigation} />
      case "Subscribe":
        return <Suscribe navigation={navigation} />
      case "MySubscription":
        return <MySubscriptionScreen navigation={navigation} />
      default:
        return <HomeScreen navigation={navigation} />
    }
  }

  return (
    <View style={[styles.tabletContainer, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.tabletHeader, { backgroundColor: theme.background }]}>
        <View style={styles.tabletLogoContainer}>
          <Image
            source={require("../../assets/images/App-Icon-1024x1024@1x copia.png")}
            style={styles.tabletLogo}
            resizeMode="contain"
          />
          <Text style={[styles.tabletTitle, { color: theme.text }]}>Voice Grocery</Text>
        </View>

        <TouchableOpacity style={styles.tabletMenuButton} onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={28} color={theme.backgroundtresapp} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={[styles.tabletTabsContainer, { backgroundColor: theme.background }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabletTabsScrollView}
          contentContainerStyle={[styles.tabletTabsContent, tabs.length <= 5 && { justifyContent: "center", flex: 1 }]}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabletTab,
                activeTab === tab.key && [styles.tabletTabActive, { backgroundColor: tab.color }],
              ]}
              onPress={() => handleTabPress(tab)}
            >
              <Ionicons
                name={tab.icon}
                size={20}
                color={activeTab === tab.key ? "white" : tab.color}
                style={styles.tabletTabIcon}
              />
              <Text
                style={[
                  styles.tabletTabText,
                  activeTab === tab.key && styles.tabletTabTextActive,
                  { color: activeTab === tab.key ? "white" : theme.text },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <View style={styles.tabletContent}>{renderTabContent()}</View>
    </View>
  )
}

export default TabletTopTabNavigator