import { StyleSheet, Dimensions } from "react-native"

const { width: screenWidth } = Dimensions.get("window")
const isTablet = screenWidth >= 768

export const styles = StyleSheet.create({
  drawerHeader: {
    padding: 16,
    paddingTop: 30,
    alignItems: "center",
    marginBottom: 10,
  },
  drawerLogo: {
    width: 80,
    height: 80,
    borderRadius: 35,
    marginBottom: -10,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Poppins-SemiBold",
    color: "#333",
  },
  drawerItem: {
    borderRadius: 8,
    marginHorizontal: 12,
    marginVertical: 4,
  },
  drawerItemActive: {
    backgroundColor: "#e6f7ff",
  },
  drawerItemLabel: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  separator: {
    height: 1,
    backgroundColor: "#e9ecef",
    marginVertical: 10,
    marginHorizontal: 16,
  },
  drawerFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#6c757d",
    fontFamily: "Poppins-Regular",
  },
  contactItem: {
    marginTop: 0,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 15,
  },
  headerLogoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    width: 52,
    height: 52,
    marginLeft: -10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
    marginLeft: 10,
    fontFamily: "Poppins-Regular",
  },
  headerMenuButton: {
    padding: 5,
    marginRight: 20,
  },
  // New styles for tablet top navigation
  tabletContainer: {
    flex: 1,
  },
  tabletHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  tabletLogoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabletLogo: {
    width: 40,
    height: 40,
  },
  tabletTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#444",
    marginLeft: 10,
    fontFamily: "Poppins-Regular",
  },
  tabletMenuButton: {
    padding: 8,
  },
  tabletTabsContainer: {
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  tabletTabsScrollView: {
    paddingHorizontal: 10,
  },
  tabletTabsContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    justifyContent: "center",
    minWidth: "100%",
  },
  tabletTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 25,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabletTabActive: {
    backgroundColor: "#4a6bff",
    shadowColor: "#4a6bff",
    shadowOpacity: 0.3,
  },
  tabletTabIcon: {
    marginRight: 8,
  },
  tabletTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    fontFamily: "Poppins-Regular",
  },
  tabletTabTextActive: {
    color: "white",
  },
  tabletContent: {
    flex: 1,
  },
})

export { isTablet }