import React from "react"
import { View, TouchableOpacity, Platform } from "react-native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useDrawerStatus } from "@react-navigation/drawer"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../ThemeContext"
import * as RNLocalize from "react-native-localize"
import { translations } from "../../translations"
import { isTablet } from "../../styles/AppStyles"
import { HeaderWithLogo, TabletHeaderWithMenu } from "../components/HeaderComponents"

import HomeScreen from "../../screens/HomeScreen"
import Suscribe from "../../screens/Suscribe"
import HistoryScreen from "../../screens/HistoryScreen"
import InformationScreen from "../../screens/InformationScreen"
import ImageListScreen from "../../screens/ImageListScreen"
import MySubscriptionScreen from "../../screens/MySubscriptionScreen"
import FavoritesScreen from "../../screens/FavoritesScreen"

const Stack = createNativeStackNavigator()

const getCurrentTranslations = () => {
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode
  return translations[deviceLanguage] || translations["en"]
}

function HomeStackNavigator({ navigation }) {
  const isDrawerOpen = useDrawerStatus() === "open"
  const { theme } = useTheme()
  const currentTranslations = getCurrentTranslations()

  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerShadowVisible: false,
          headerTintColor: "#a2a2a200",
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.voiceGrocery}
              />
            ) : (
              <View />
            ),
        }}
      />

      <Stack.Screen
        name="Suscribe"
        component={Suscribe}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerShadowVisible: false,
          headerTintColor: theme.text,
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.subscribe}
              />
            ) : (
              <View />
            ),
        }}
      />

      <Stack.Screen
        name="HistoryScreen"
        component={HistoryScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: "#a2a2a200",
          headerShadowVisible: false,
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.history}
              />
            ) : (
              <View />
            ),
        }}
      />

      <Stack.Screen
        name="InformationScreen"
        component={InformationScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: theme.text,
          headerTitleStyle: {},
          headerShadowVisible: false,
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.information}
              />
            ) : (
              <View />
            ),
        }}
      />

      <Stack.Screen
        name="ImageListScreen"
        component={ImageListScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: theme.text,
          headerTitleStyle: {},
          headerShadowVisible: false,
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.imageList}
              />
            ) : (
              <View />
            ),
        }}
      />

      <Stack.Screen
        name="MySubscriptionScreen"
        component={MySubscriptionScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: "#a2a2a200",
          headerShadowVisible: false,
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.mySubscription}
              />
            ) : (
              <View />
            ),
        }}
      />

    </Stack.Navigator>
  )
}

function SuscribeScreen({ navigation }) {
  const isDrawerOpen = useDrawerStatus() === "open"
  const { theme } = useTheme()
  const currentTranslations = getCurrentTranslations()

  return (
    <Stack.Navigator initialRouteName="Suscribe">
      <Stack.Screen
        name="Suscribe"
        component={Suscribe}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerShadowVisible: false,
          headerTintColor: "#a2a2a200",
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.subscribe}
              />
            ) : (
              <View />
            ),
        }}
      />

      <Stack.Screen
        name="HistoryScreen"
        component={HistoryScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: "#a2a2a200",
          headerShadowVisible: false,
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.history}
              />
            ) : (
              <View />
            ),
        }}
      />
    </Stack.Navigator>
  )
}

function HistoryStackNavigator({ navigation }) {
  const isDrawerOpen = useDrawerStatus() === "open"
  const { theme } = useTheme()
  const currentTranslations = getCurrentTranslations()

  return (
    <Stack.Navigator initialRouteName="HistoryScreen">
      <Stack.Screen
        name="HistoryScreen"
        component={HistoryScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: "#a2a2a200",
          headerShadowVisible: false,
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.history}
              />
            ) : (
              <View />
            ),
        }}
      />

      <Stack.Screen
        name="Suscribe"
        component={Suscribe}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: "#a2a2a200",
          headerShadowVisible: false,
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.subscribe}
              />
            ) : (
              <View />
            ),
        }}
      />
    </Stack.Navigator>
  )
}

function InformationStackNavigator({ navigation }) {
  const { theme, toggleTheme } = useTheme()
  const currentTranslations = getCurrentTranslations()
  const isDrawerOpen = useDrawerStatus() === "open"

  return (
    <Stack.Navigator initialRouteName="InformationScreen">
      <Stack.Screen
        name="InformationScreen"
        component={InformationScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerShadowVisible: false,
          headerTintColor: "#a2a2a200",
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.information}
              />
            ) : (
              <TabletHeaderWithMenu navigation={navigation} theme={theme} title={currentTranslations.information} />
            ),
        }}
      />

      <Stack.Screen
        name="Suscribe"
        component={Suscribe}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: "#a2a2a200",
          headerShadowVisible: false,
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.subscribe}
              />
            ) : (
              <TabletHeaderWithMenu navigation={navigation} theme={theme} title={currentTranslations.subscribe} />
            ),
        }}
      />
    </Stack.Navigator>
  )
}

function FavoritesStackNavigator({ navigation }) {
  const isDrawerOpen = useDrawerStatus() === "open"
  const { theme } = useTheme()
  const currentTranslations = getCurrentTranslations()

  return (
    <Stack.Navigator initialRouteName="FavoritesScreen">
      <Stack.Screen
        name="FavoritesScreen"
        component={FavoritesScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: "#a2a2a200",
          headerShadowVisible: false,
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.favorites}
              />
            ) : (
              <View />
            ),
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate("FavoritesScreen")}>
              <Ionicons name="heart" size={26} color="#ff375f" style={{ marginRight: 15 }} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  )
}

function ImageListStackNavigator({ navigation }) {
  const isDrawerOpen = useDrawerStatus() === "open"
  const { theme } = useTheme()
  const currentTranslations = getCurrentTranslations()

  return (
    <Stack.Navigator initialRouteName="ImageListScreen">
      <Stack.Screen
        name="ImageListScreen"
        component={ImageListScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerShadowVisible: false,
          headerTintColor: "#a2a2a200",
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.imageList}
              />
            ) : (
              <View />
            ),
        }}
      />

      <Stack.Screen
        name="Suscribe"
        component={Suscribe}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: "#a2a2a200",
          headerShadowVisible: false,
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.subscribe}
              />
            ) : (
              <View />
            ),
        }}
      />
    </Stack.Navigator>
  )
}

function MySubscriptionStackNavigator({ navigation }) {
  const isDrawerOpen = useDrawerStatus() === "open"
  const { theme } = useTheme()
  const currentTranslations = getCurrentTranslations()

  return (
    <Stack.Navigator initialRouteName="MySubscriptionScreen">
      <Stack.Screen
        name="MySubscriptionScreen"
        component={MySubscriptionScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: "#a2a2a200",
          headerShadowVisible: false,
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.mySubscription}
              />
            ) : (
              <View />
            ),
        }}
      />

      <Stack.Screen
        name="Suscribe"
        component={Suscribe}
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: "#a2a2a200",
          headerShadowVisible: false,
          headerTitleStyle: {},
          headerLeft: () => null,
          headerTitle: () =>
            !isTablet ? (
              <HeaderWithLogo
                navigation={navigation}
                isDrawerOpen={isDrawerOpen}
                theme={theme}
                title={currentTranslations.subscribe}
              />
            ) : (
              <View />
            ),
        }}
      />
    </Stack.Navigator>
  )
}

export {
  HomeStackNavigator,
  SuscribeScreen,
  HistoryStackNavigator,
  InformationStackNavigator,
  FavoritesStackNavigator,
  ImageListStackNavigator,
  MySubscriptionStackNavigator,
}