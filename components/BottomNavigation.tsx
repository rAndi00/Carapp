import React from "react"
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Ionicons } from '@expo/vector-icons'

const navItems = [
  { name: "Home", route: "Home", icon: ({ color, size }: any) => <Ionicons name="home-outline" size={size} color={color} /> },
  { name: "Search", route: "Search", icon: ({ color, size }: any) => <Ionicons name="search-outline" size={size} color={color} /> },
  { name: "Sell Car", route: "Sell", icon: ({ color, size }: any) => <Ionicons name="car-outline" size={size} color={color} /> },
  { name: "Favorites", route: "Favorites", icon: ({ color, size }: any) => <Ionicons name="heart-outline" size={size} color={color} /> },
  { name: "Profile", route: "Profile", icon: ({ color, size }: any) => <Ionicons name="person-outline" size={size} color={color} /> },
];

export default function BottomNavigation() {
  const navigation = useNavigation()
  const route = useRoute()
  const currentRoute = route.name

  const isActive = (routeName: string) => routeName === currentRoute

  return (
    <View style={styles.container}>
      {navItems.map(({ name, route: routeName, icon }) => {
        const active = isActive(routeName)
        const iconColor = active ? "white" : "#8c9199"
        const iconSize = 20

        return (
          <TouchableOpacity
            key={routeName}
            style={[styles.navItem, active && styles.activeNavItem]}
            onPress={() => navigation.navigate(routeName as never)}
          >
            {icon({ color: iconColor, size: iconSize })}
            <Text style={[styles.label, active && styles.activeLabel]}>{name}</Text>
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
