import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const navItems = [
  { name: "Home", route: "Home", icon: ({ color, size }: any) => <Ionicons name="home-outline" size={size} color={color} /> },
  { name: "Search", route: "Search", icon: ({ color, size }: any) => <Ionicons name="search-outline" size={size} color={color} /> },
  { name: "Sell Car", route: "Sell", icon: ({ color, size }: any) => <Ionicons name="car-outline" size={size} color={color} /> },
  { name: "Favorites", route: "Favorites", icon: ({ color, size }: any) => <Ionicons name="heart-outline" size={size} color={color} /> },
  { name: "Profile", route: "Profile", icon: ({ color, size }: any) => <Ionicons name="person-outline" size={size} color={color} /> },
];

export default function BottomNavigation() {
  const navigation = useNavigation();
  const route = useRoute();
  const currentRoute = route.name;

  const isActive = (routeName: string) => routeName === currentRoute;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {navItems.map(({ name, route: routeName, icon }) => {
          const active = isActive(routeName);
          const iconColor = active ? "white" : "#8c9199";
          const iconSize = 24;

          return (
            <TouchableOpacity
              key={routeName}
              style={[styles.navItem, active && styles.activeNavItem]}
              onPress={() => navigation.navigate(routeName as never)}
              activeOpacity={0.7}
            >
              {icon({ color: iconColor, size: iconSize })}
              <Text style={[styles.label, active && styles.activeLabel]}>{name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "white",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingVertical: 12,
    borderRadius: 30,

    width: "95%",      // <-- shrink smoothly on small screens
    maxWidth: 400,     // <-- max width on big screens
    alignSelf: "center",

    // Uncomment these 3 lines if you want it fixed at bottom:
    // position: 'absolute',
    // bottom: 16,
    // left: 0,
    // right: 0,

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
});
