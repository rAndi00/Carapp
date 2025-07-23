import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
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

export default function CarsPage() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchAllCars();
  }, []);

  const fetchAllCars = async () => {
    try {
      const carsData = await apiService.get("/cars");
      setCars(carsData);
    } catch (error) {
      console.error("Failed to fetch cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (carId: number) => {
    setCars((prev) =>
      prev.map((car) =>
        car.id === carId ? { ...car, is_favorited: !car.is_favorited } : car
      )
    );

    try {
      await apiService.post(`/cars/${carId}/favorite`);
    } catch (error) {
      setCars((prev) =>
        prev.map((car) =>
          car.id === carId ? { ...car, is_favorited: !car.is_favorited } : car
        )
      );
    }
  };

  const sortCars = (cars: Car[], sortBy: string) => {
    const sorted = [...cars];
    switch (sortBy) {
      case "newest":
        return sorted.sort((a, b) => b.year - a.year);
      case "oldest":
        return sorted.sort((a, b) => a.year - b.year);
      case "price_low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price_high":
        return sorted.sort((a, b) => b.price - a.price);
      default:
        return sorted;
    }
  };

  const sortedCars = sortCars(cars, sortBy);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#fc6828" />
        <Text className="text-[#8c9199] mt-2">Loading cars...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#f9fafb]">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-200">
        <View className="flex-row items-center space-x-3">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold">All Cars</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/search")}>
          <Ionicons name="search" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-200">
        <Text className="text-[#8c9199]">{cars.length} cars available</Text>
        <View className="w-36 border border-gray-300 rounded-md bg-white">
          <Picker
            selectedValue={sortBy}
            onValueChange={(itemValue) => setSortBy(itemValue)}
            dropdownIconColor="#fc6828"
          >
            <Picker.Item label="Newest" value="newest" />
            <Picker.Item label="Oldest" value="oldest" />
            <Picker.Item label="Price: Low" value="price_low" />
            <Picker.Item label="Price: High" value="price_high" />
          </Picker>
        </View>
      </View>

      {/* Cars List */}
      <FlatList
        data={sortedCars}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item: car }) => (
          <TouchableOpacity
            onPress={() => router.push(`/cars/${car.id}`)}
            className="bg-white rounded-xl overflow-hidden mb-4 shadow-sm"
          >
            <View className="flex-row">
              <Image
                source={{
                  uri: car.image || "https://via.placeholder.com/120",
                }}
                className="w-24 h-24"
                resizeMode="cover"
              />
              <View className="flex-1 p-3">
                <View className="flex-row justify-between items-start mb-1">
                  <Text className="font-semibold text-sm text-black">{car.title}</Text>
                  <TouchableOpacity
                    onPress={() => toggleFavorite(car.id)}
                    className="p-1"
                  >
                    <Ionicons
                      name={car.is_favorited ? "heart" : "heart-outline"}
                      size={16}
                      color={car.is_favorited ? "red" : "#8c9199"}
                    />
                  </TouchableOpacity>
                </View>
                <Text className="text-[#fc6828] font-semibold mb-1">
                  ${car.price.toLocaleString()}
                </Text>
                <View className="flex-row justify-between text-xs text-[#8c9199]">
                  <Text className="text-xs text-[#8c9199]">
                    {car.year} • {car.mileage.toLocaleString()} km
                  </Text>
                  <Text className="text-xs text-[#8c9199]">{car.location}</Text>
                </View>
                <Text className="text-xs text-[#8c9199] mt-1">{car.fuel_type}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <BottomNavigation />
    </View>
  );
}
