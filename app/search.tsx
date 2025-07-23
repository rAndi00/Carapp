import { useState } from 'react';
import { ScrollView, TextInput, TouchableOpacity, View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const mockData = [
  {
    id: '1',
    title: 'BMW X5',
    price: '€35,000',
    location: 'Skopje',
    image: 'https://images.unsplash.com/photo-1607631385045-83ae6c1e1f67',
  },
  {
    id: '2',
    title: 'Audi A4',
    price: '€25,000',
    location: 'Tetovo',
    image: 'https://images.unsplash.com/photo-1617531653332-5ff4e520e56f',
  },
  // Add more cars as needed
];

export default function SearchScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black px-4 pt-4">
      {/* Search Header */}
      <View className="flex-row items-center mb-4">
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search..."
          placeholderTextColor="#999"
          className="flex-1 bg-gray-100 dark:bg-gray-800 text-black dark:text-white px-4 py-2 rounded-full"
        />
        <TouchableOpacity className="ml-3">
          <Ionicons name="search" size={24} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Results */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-lg font-semibold text-black dark:text-white mb-4">
          Results for “{search}”
        </Text>
        <View className="gap-y-4 pb-10">
          {mockData.map((car) => (
            <TouchableOpacity
              key={car.id}
              onPress={() => router.push(`/car/${car.id}`)}
              className="bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden"
            >
              <Image
                source={{ uri: car.image }}
                className="w-full h-48"
                resizeMode="cover"
              />
              <View className="p-4">
                <Text className="text-lg font-bold text-black dark:text-white">{car.title}</Text>
                <Text className="text-sm text-gray-700 dark:text-gray-300">{car.price}</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">{car.location}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
