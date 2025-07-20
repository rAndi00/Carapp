import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Heart, Search } from "lucide-react-native"
import { useAuth } from "../contexts/auth-context"
import { apiService } from "../services/api"
import BottomNavigation from "../../components/BottomNavigation"

type Car = {
  id: number
  title: string
  price: number
  year: number
  mileage: number
  location: string
  images?: string[]
  has_360_view: boolean
  is_favorited: boolean
}

export default function HomeScreen() {
  const [cars, setCars] = useState<Car[]>([])
  const [featuredCars, setFeaturedCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigation = useNavigation()

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      const [carsResponse, featuredResponse] = await Promise.all([
        apiService.getCars(),
        apiService.getFeaturedCars(),
      ])
      if (carsResponse.success) setCars(carsResponse.data || [])
      if (featuredResponse.success) setFeaturedCars(featuredResponse.data || [])
    } catch (error) {
      console.error("Failed to fetch cars:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async (carId: number) => {
    if (!user) {
      navigation.navigate("Login" as never)
      return
    }
    try {
      setCars(cars.map(car =>
        car.id === carId ? { ...car, is_favorited: !car.is_favorited } : car
      ))
      setFeaturedCars(featuredCars.map(car =>
        car.id === carId ? { ...car, is_favorited: !car.is_favorited } : car
      ))
      await apiService.toggleFavorite(carId)
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
      // revert optimistic update
      setCars(cars.map(car =>
        car.id === carId ? { ...car, is_favorited: !car.is_favorited } : car
      ))
      setFeaturedCars(featuredCars.map(car =>
        car.id === carId ? { ...car, is_favorited: !car.is_favorited } : car
      ))
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fc6828" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {user ? `Welcome back, ${user.name}!` : "Find Your Perfect Car"}
          </Text>
          <Text style={styles.subtitle}>
            Browse thousands of quality vehicles across the Balkans
          </Text>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate("Search" as never)}
        >
          <Search color="#8c9199" width={20} height={20} />
          <Text style={styles.searchPlaceholder}>
            Search for Honda Pilot 7-Passenger...
          </Text>
        </TouchableOpacity>

        {/* Featured Cars */}
        <Text style={styles.sectionTitle}>Featured Cars</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 20 }}
        >
          {featuredCars.map(car => (
            <TouchableOpacity
              key={car.id}
              style={styles.featuredCard}
              activeOpacity={0.9}
            >
              <Image
                source={{
                  uri: car.images?.[0] || "https://via.placeholder.com/280x160",
                }}
                style={styles.featuredImage}
              />
              {car.has_360_view && (
                <Text style={styles.badge}>360° View</Text>
              )}
              <View style={styles.featuredInfo}>
                <Text style={styles.carTitle}>{car.title}</Text>
                <Text style={styles.carPrice}>
                  ${car.price.toLocaleString()}
                </Text>
                <TouchableOpacity onPress={() => toggleFavorite(car.id)}>
                  <Heart
                    color={car.is_favorited ? "red" : "#8c9199"}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recent Listings */}
        <Text style={styles.sectionTitle}>Recent Listings</Text>
        {cars.slice(0, 5).map(car => (
          <TouchableOpacity
            key={car.id}
            style={styles.listingCard}
            activeOpacity={0.9}
          >
            <Image
              source={{
                uri: car.images?.[0] || "https://via.placeholder.com/150x100",
              }}
              style={styles.listingImage}
            />
            <View style={styles.listingInfo}>
              <Text style={styles.carTitle}>{car.title}</Text>
              <Text style={styles.carPrice}>
                ${car.price.toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => toggleFavorite(car.id)}
              style={{ padding: 8 }}
            >
              <Heart
                color={car.is_favorited ? "red" : "#8c9199"}
                size={20}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BottomNavigation />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  loadingText: { marginTop: 10, fontSize: 16, color: "#8c9199" },
  header: { padding: 20, backgroundColor: "#fc6828" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: "white", opacity: 0.9 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ededed",
    margin: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
  },
  searchPlaceholder: { color: "#8c9199", marginLeft: 10, fontSize: 16 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginBottom: 10,
    color: "#000",
  },
  featuredCard: {
    width: 280,
    marginLeft: 20,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "white",
    marginBottom: 10,
  },
  featuredImage: { width: "100%", height: 160 },
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#fc6828",
    color: "white",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    fontWeight: "bold",
  },
  featuredInfo: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  carTitle: { fontWeight: "bold", fontSize: 16, flex: 1 },
  carPrice: {
    color: "#fc6828",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
  listingCard: {
    flexDirection: "row",
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
  },
  listingImage: { width: 120, height: 80 },
  listingInfo: { flex: 1, padding: 10 },
})
