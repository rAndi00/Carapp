import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BottomNavigation from "@/components/BottomNavigation";
import { apiService } from "./services/api";

interface Car {
  id: number;
  title: string;
  price: number;
  year: number;
  mileage: number;
  fuel_type: string;
  location: string;
  image: string;
  is_favorited: boolean;
}

export default function FavoritesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    checkAuthAndFetchFavorites();
  }, []);

  const checkAuthAndFetchFavorites = async () => {
    try {
      // Example: replace with your real auth token management
      const token = ""; // You might want to get token from secure storage or context
      if (token) {
        const mockUser = {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
        };
        setUser(mockUser);
        await fetchFavorites();
      }
    } catch (error) {
      console.error("Failed to check auth:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const favoritesData = await apiService.get("/user/favorites");
      setFavorites(favoritesData);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    }
  };

  const removeFavorite = async (carId: number) => {
    setFavorites((prev) => prev.filter((car) => car.id !== carId));
    try {
      await apiService.post(`/cars/${carId}/favorite`);
    } catch (error) {
      fetchFavorites();
    }
  };

  const clearAllFavorites = () => {
    Alert.alert(
      "Remove All Favorites",
      "Are you sure you want to remove all favorites?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            const carIds = favorites.map((car) => car.id);
            setFavorites([]);
            try {
              await Promise.all(
                carIds.map((id) => apiService.post(`/cars/${id}/favorite`))
              );
            } catch (error) {
              fetchFavorites();
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const filteredFavorites = favorites.filter(
    (car) =>
      car.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.fuel_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#fc6828" />
        <Text className="text-gray-400 mt-2">Loading favorites...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-6">
        <Ionicons name="heart-outline" size={64} color="#8c9199" />
        <Text className="text-gray-400 my-4">Please log in to view your favorites</Text>
        <TouchableOpacity
          onPress={() => router.push("/login")}
          className="bg-[#fc6828] px-6 py-2 rounded"
        >
          <Text className="text-white font-semibold text-center">Log In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#f9fafb]">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-200">
        <View className="flex-row items-center space-x-3">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold">Favorites</Text>
        </View>
        {favorites.length > 0 && (
          <TouchableOpacity onPress={clearAllFavorites}>
            <Ionicons name="trash" size={24} color="#000" />
          </TouchableOpacity>
        )}
      </View>

      {favorites.length > 0 && (
        <>
          {/* Search Bar */}
          <View className="p-4 bg-white border-b border-gray-200">
            <View className="flex-row items-center bg-gray-200 rounded-xl px-4 py-2">
              <Ionicons name="search" size={20} color="#8c9199" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search favorites..."
                className="ml-3 flex-1 text-black"
                placeholderTextColor="#8c9199"
              />
            </View>
          </View>

          {/* Stats */}
          <View className="p-4 bg-white border-b border-gray-200">
            <Text className="text-gray-400">
              {filteredFavorites.length} of {favorites.length} favorites
              {searchQuery ? " matching your search" : ""}
            </Text>
          </View>
        </>
      )}

      {/* Content */}
      <View className="flex-1">
        {favorites.length === 0 ? (
          <View className="flex-1 justify-center items-center p-6">
            <Ionicons name="heart-outline" size={64} color="#8c9199" />
            <Text className="text-black text-xl font-semibold mt-4 mb-2">
              No favorites yet
            </Text>
            <Text className="text-gray-400 mb-6 text-center">
              Start browsing cars and tap the heart icon to save your favorites
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/cars")}
              className="bg-[#fc6828] px-6 py-2 rounded"
            >
              <Text className="text-white font-semibold text-center">Browse Cars</Text>
            </TouchableOpacity>
          </View>
        ) : filteredFavorites.length === 0 ? (
          <View className="flex-1 justify-center items-center p-6">
            <Ionicons name="search" size={64} color="#8c9199" />
            <Text className="text-black text-xl font-semibold mt-4 mb-2">
              No matches found
            </Text>
            <Text className="text-gray-400 text-center">Try adjusting your search terms</Text>
          </View>
        ) : (
          <FlatList
            data={filteredFavorites}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item: car }) => (
              <TouchableOpacity
                onPress={() => router.push(`/cars/${car.id}`)}
                className="bg-white rounded-xl overflow-hidden mb-4 shadow-sm"
              >
                <View className="flex-row">
                  <Image
                    source={{ uri: car.image || "https://via.placeholder.com/120" }}
                    className="w-24 h-24"
                    resizeMode="cover"
                  />
                  <View className="flex-1 p-3">
                    <View className="flex-row justify-between items-start mb-1">
                      <Text className="font-semibold text-sm text-black">{car.title}</Text>
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          removeFavorite(car.id);
                        }}
                        className="p-1"
                      >
                        <Ionicons name="heart" size={16} color="red" />
                      </TouchableOpacity>
                    </View>
                    <Text className="text-[#fc6828] font-semibold mb-1">
                      ${car.price.toLocaleString()}
                    </Text>
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-gray-400">
                        {car.year} • {car.mileage.toLocaleString()} km
                      </Text>
                      <Text className="text-xs text-gray-400">{car.location}</Text>
                    </View>
                    <Text className="text-xs text-gray-400 mt-1">{car.fuel_type}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      <BottomNavigation />
    </View>
  );
}
