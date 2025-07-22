import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Heart, Search, SlidersHorizontal } from "lucide-react-native";
import { useAuth } from "../contexts/auth-context";
import { apiService } from "../services/api";
import BottomNavigation from "../../components/BottomNavigation";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type Car = {
  id: number;
  title: string;
  price: number;
  year: number;
  mileage: number;
  location: string;
  images?: string[];
  has_360_view: boolean;
  is_favorited: boolean;
};

const HERO_HEIGHT = 70; // adjust as needed

export default function HomeScreen() {
  const [cars, setCars] = useState<Car[]>([]);
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const [carsResponse, featuredResponse] = await Promise.all([
        apiService.getCars(),
        apiService.getFeaturedCars(),
      ]);
      if (carsResponse.success) setCars(carsResponse.data || []);
      if (featuredResponse.success) setFeaturedCars(featuredResponse.data || []);
    } catch (error) {
      console.error("Failed to fetch cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (carId: number) => {
    if (!user) {
      navigation.navigate("Login" as never);
      return;
    }
    try {
      setCars(
        cars.map((car) =>
          car.id === carId ? { ...car, is_favorited: !car.is_favorited } : car
        )
      );
      setFeaturedCars(
        featuredCars.map((car) =>
          car.id === carId ? { ...car, is_favorited: !car.is_favorited } : car
        )
      );
      await apiService.toggleFavorite(carId);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fc6828" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      {/* Fixed hero/header */}
      <View style={[styles.hero, { paddingTop: insets.top, height: HERO_HEIGHT + insets.top }]}>
        <Text style={styles.heroTitle}>
          {user ? `Welcome back, ${user.name}!` : " AutoBalkan "}
        </Text>
        <Text style={styles.heroSubtitle}>
          
        </Text>
      </View>

      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={{
          paddingTop: HERO_HEIGHT,
          backgroundColor: "#f9fafb",
          paddingBottom: 30,
        }}
      >
        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => navigation.navigate("Search" as never)}
          >
            <Search color="#8c9199" width={20} height={20} />
            <Text style={styles.searchPlaceholder}>
              Search for Honda Pilot 7-Passenger...
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Search" as never)}>
            <SlidersHorizontal color="#000" size={24} />
          </TouchableOpacity>
        </View>

        {/* Featured Cars */}
        {featuredCars.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Cars</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Cars" as never)}>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
              style={{ marginBottom: 20 }}
            >
              {featuredCars.map((car) => (
                <TouchableOpacity key={car.id} style={styles.featuredCard}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{
                        uri: car.images?.[0] || "https://via.placeholder.com/280x160",
                      }}
                      style={styles.featuredImage}
                    />
                    <View style={styles.featuredBadge}>
                      <Text style={styles.badgeText}>Featured</Text>
                    </View>
                    {car.has_360_view && (
                      <View style={styles.view360Badge}>
                        <Text style={styles.badgeText}>360° View</Text>
                      </View>
                    )}
                    <TouchableOpacity
                      style={styles.favoriteIcon}
                      onPress={() => toggleFavorite(car.id)}
                    >
                      <Heart
                        color={car.is_favorited ? "red" : "#8c9199"}
                        fill={car.is_favorited ? "red" : "none"}
                        size={20}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.carInfo}>
                    <Text style={styles.carTitle}>{car.title}</Text>
                    <Text style={styles.carPrice}>${car.price.toLocaleString()}</Text>
                    <Text style={styles.carDetails}>
                      {car.year} • {car.mileage.toLocaleString()} km
                    </Text>
                    <Text style={styles.carLocation}>{car.location}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* Recent Listings */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Listings</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Cars" as never)}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          {cars.slice(0, 5).map((car) => (
            <TouchableOpacity key={car.id} style={styles.listingCard}>
              <Image
                source={{
                  uri: car.images?.[0] || "https://via.placeholder.com/150x100",
                }}
                style={styles.listingImage}
              />
              <View style={styles.listingInfo}>
                <Text style={styles.carTitle}>{car.title}</Text>
                <Text style={styles.carPrice}>${car.price.toLocaleString()}</Text>
                <Text style={styles.carDetails}>
                  {car.year} • {car.mileage.toLocaleString()} km
                </Text>
                <Text style={styles.carLocation}>{car.location}</Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleFavorite(car.id)}
                style={styles.favoriteButton}
              >
                <Heart
                  color={car.is_favorited ? "red" : "#8c9199"}
                  fill={car.is_favorited ? "red" : "none"}
                  size={20}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  loadingText: { marginTop: 5, fontSize: 16, color: "#8c9199" },
  hero: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fc6828",
    zIndex: 10,
    paddingHorizontal: 20,
    justifyContent: "flex-end",
  },
  heroTitle: { fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 0 },
  heroSubtitle: { fontSize: 16, color: "white", opacity: 0.9, marginBottom: 12 },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#f9fafb",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#edeeef",
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    marginRight: 12,
  },
  searchPlaceholder: { color: "#8c9199", marginLeft: 10, fontSize: 16 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#000" },
  viewAll: { color: "#fc6828", fontWeight: "500" },
  featuredCard: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  imageContainer: { position: "relative" },
  featuredImage: { width: "100%", height: 160 },
  featuredBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#fc6828",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  view360Badge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#000000aa",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: { color: "white", fontWeight: "600", fontSize: 12 },
  favoriteIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#ffffffcc",
    padding: 6,
    borderRadius: 50,
  },
  carInfo: { padding: 12 },
  carTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 4, color: "#000" },
  carPrice: { color: "#fc6828", fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  carDetails: { fontSize: 13, color: "#8c9199" },
  carLocation: { fontSize: 13, color: "#8c9199", marginTop: 2 },
  listingCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  listingImage: { width: 120, height: 90 },
  listingInfo: { flex: 1, padding: 10, justifyContent: "center" },
  favoriteButton: { justifyContent: "center", padding: 10 },
});
