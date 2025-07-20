import React from "react"
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"

const navItems = [
  { name: "Home", route: "Home", icon: require("../assets/home.png") },
  { name: "Search", route: "Search", icon: require("../assets/search.png") },
  { name: "Sell Car", route: "Sell", icon: require("../assets/plus.png") },
  { name: "Favorites", route: "Favorites", icon: require("../assets/heart.png") },
  { name: "Profile", route: "Profile", icon: require("../assets/user.png") },
]

export default function BottomNavigation() {
  const navigation = useNavigation()
  const route = useRoute()
  const currentRoute = route.name

  const isActive = (routeName: string) => routeName === currentRoute

  return (
    <View style={styles.container}>
      {navItems.map(({ name, route: routeName, icon }) => {
        const active = isActive(routeName)
        return (
          <TouchableOpacity
            key={routeName}
            style={[styles.navItem, active && styles.activeNavItem]}
            onPress={() => navigation.navigate(routeName as never)}
          >
            <Image
              source={icon}
              style={[styles.icon, active && styles.activeIcon]}
              resizeMode="contain"
            />
            <Text style={[styles.label, active ? styles.activeLabel : null]}>{name}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const { width } = Dimensions.get("window")
const maxWidth = 400

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 16,
    left: "50%",
    transform: [{ translateX: -Math.min(width, maxWidth) / 2 }],
    width: Math.min(width, maxWidth),
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingVertical: 10,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  navItem: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 25,
  },
  activeNavItem: {
    backgroundColor: "#fc6828",
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: "#8c9199",
  },
  activeIcon: {
    tintColor: "white",
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    color: "#8c9199",
    fontWeight: "500",
  },
  activeLabel: {
    color: "white",
  },
})
