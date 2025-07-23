import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
  Ionicons,
  MaterialIcons,
  Feather,
  Entypo,
} from "@expo/vector-icons";
import BottomNavigation from "@/components/BottomNavigation";
import { apiService } from "./services/api";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");

  // Fetch user profile & stats on mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  async function fetchUserProfile() {
    setLoadingUser(true);
    try {
      const userRes = await apiService.get("/user/profile"); // Adjust endpoint
      setUser(userRes);
      setNewName(userRes.name);

      const statsRes = await apiService.get("/user/stats"); // Adjust endpoint
      setUserStats(statsRes);
    } catch (error) {
      console.error("Failed to fetch user/profile:", error);
      Alert.alert("Error", "Failed to load profile. Please login again.");
      router.push("/login");
    } finally {
      setLoadingUser(false);
    }
  }

  async function handleLogout() {
    try {
      await apiService.post("/auth/logout"); // Adjust endpoint
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      Alert.alert("Error", "Logout failed. Please try again.");
    }
  }

  function confirmLogoutAll() {
    Alert.alert(
      "Logout from all devices",
      "This will log you out from all devices. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await apiService.post("/auth/logout-all"); // Adjust endpoint
              setUser(null);
              router.push("/");
            } catch (error) {
              console.error("Logout all failed:", error);
              Alert.alert("Error", "Failed to logout all devices.");
            }
          },
          style: "destructive",
        },
      ]
    );
  }

  // Pick image using Expo Image Picker, then upload avatar
  async function handleAvatarUpload() {
    // Ask permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Permission to access gallery is required!");
      return;
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (result.cancelled) return;

    if (result.uri) {
      const uri = result.uri;
      const filename = uri.split("/").pop()!;
      const match = /\.(\w+)$/.exec(filename);
      const ext = match ? match[1] : "jpg";

      if (result.height * result.width > 2 * 1024 * 1024) {
        Alert.alert("File too large", "Please select an image under 2MB.");
        return;
      }

      const formData = new FormData();
      formData.append("avatar", {
        uri,
        name: filename,
        type: `image/${ext}`,
      } as any);

      setLoading(true);
      try {
        const response = await apiService.post("/user/avatar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }); // Adjust endpoint

        if (response.success) {
          setUser((prev: any) => ({ ...prev, avatar: response.avatar_url }));
          Alert.alert("Success", "Avatar updated");
        } else {
          throw new Error("Upload failed");
        }
      } catch (error: any) {
        console.error("Avatar upload failed:", error);
        Alert.alert("Upload failed", error.message || "Please try again.");
      } finally {
        setLoading(false);
      }
    }
  }

  async function updateName() {
    if (!newName.trim() || newName === user?.name) {
      setEditingName(false);
      return;
    }
    setLoading(true);
    try {
      const response = await apiService.post("/user/update-profile", { name: newName }); // Adjust endpoint

      if (response.success) {
        setUser((prev: any) => ({ ...prev, name: response.user.name }));
        setEditingName(false);
        Alert.alert("Success", "Name updated");
      } else {
        throw new Error("Update failed");
      }
    } catch (error: any) {
      console.error("Name update failed:", error);
      Alert.alert("Update failed", error.message || "Please try again.");
      setNewName(user?.name || "");
    } finally {
      setLoading(false);
    }
  }

  if (loadingUser) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#fc6828" />
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-6">
        <Ionicons name="person-outline" size={64} color="#8c9199" />
        <Text className="text-gray-400 my-4 text-center">Please log in to view your profile</Text>
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
          <Text className="text-xl font-semibold">Profile</Text>
        </View>
        <View className="flex-row space-x-3">
          <TouchableOpacity onPress={confirmLogoutAll} accessibilityLabel="Logout from all devices">
            <Ionicons name="settings-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile Header */}
        <View className="bg-white p-6">
          <View className="flex-row items-center mb-4 space-x-4">
            <TouchableOpacity
              onPress={handleAvatarUpload}
              disabled={loading}
              className="relative w-16 h-16 rounded-full bg-[#fc6828] items-center justify-center overflow-hidden"
            >
              {user.avatar ? (
                <Image
                  source={{ uri: user.avatar }}
                  className="w-full h-full rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <Text className="text-white font-semibold text-xl">
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              )}
              <View
                style={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  width: 24,
                  height: 24,
                  backgroundColor: "#fc6828",
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="camera" size={14} color="white" />
              </View>
            </TouchableOpacity>

            <View className="flex-1">
              {editingName ? (
                <View className="flex-row space-x-2">
                  <TextInput
                    value={newName}
                    onChangeText={setNewName}
                    editable={!loading}
                    className="border border-gray-300 rounded px-2 flex-1"
                    onSubmitEditing={updateName}
                    autoFocus
                  />
                  <TouchableOpacity onPress={updateName} disabled={loading} className="bg-[#fc6828] px-3 rounded justify-center">
                    <Text className="text-white">Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setEditingName(false);
                      setNewName(user.name);
                    }}
                    disabled={loading}
                    className="border border-gray-300 px-3 rounded justify-center"
                  >
                    <Text>Cancel</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="flex-row items-center space-x-2">
                  <Text className="text-xl font-semibold">{user.name}</Text>
                  <TouchableOpacity onPress={() => setEditingName(true)} disabled={loading}>
                    <Ionicons name="pencil-outline" size={20} color="black" />
                  </TouchableOpacity>
                </View>
              )}

              <Text className="text-gray-500">{user.email}</Text>
              {user.phone && <Text className="text-gray-500 text-sm">{user.phone}</Text>}
            </View>
          </View>

          {/* Stats */}
          {userStats ? (
            <View className="flex-row justify-between border-t border-gray-200 pt-4">
              <View className="items-center flex-1">
                <Ionicons name="car-outline" size={24} color="#fc6828" />
                <Text className="font-semibold">{userStats.total_cars}</Text>
                <Text className="text-xs text-gray-500">Listings</Text>
              </View>
              <View className="items-center flex-1">
                <Ionicons name="heart-outline" size={24} color="#fc6828" />
                <Text className="font-semibold">{userStats.total_favorites}</Text>
                <Text className="text-xs text-gray-500">Favorites</Text>
              </View>
              <View className="items-center flex-1">
                <Ionicons name="eye-outline" size={24} color="#fc6828" />
                <Text className="font-semibold">{userStats.total_views}</Text>
                <Text className="text-xs text-gray-500">Views</Text>
              </View>
              <View className="items-center flex-1">
                <Ionicons name="chatbubble-ellipses-outline" size={24} color="#fc6828" />
                <Text className="font-semibold">{userStats.total_messages}</Text>
                <Text className="text-xs text-gray-500">Messages</Text>
              </View>
            </View>
          ) : (
            <View className="pt-4 border-t border-gray-200 items-center">
              <ActivityIndicator size="small" color="#fc6828" />
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View className="bg-white mt-6">
          <View className="p-4 border-b border-gray-200">
            <Text className="font-semibold">Quick Actions</Text>
          </View>
          {[
            { label: "My Favorites", icon: "heart-outline", route: "/favorites" },
            { label: "My Listings", icon: "car-outline", route: "/user/cars" },
            { label: "Sell a Car", icon: "car-sport-outline", route: "/sell" },
            { label: "Messages", icon: "chatbubble-ellipses-outline", route: null },
          ].map(({ label, icon, route }) => (
            <TouchableOpacity
              key={label}
              onPress={() => route && router.push(route)}
              className="flex-row items-center p-4 border-b border-gray-200"
              activeOpacity={0.7}
            >
              <Ionicons name={icon as any} size={20} color="#8c9199" />
              <Text className="ml-3">{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings */}
        <View className="bg-white mt-6">
          <View className="p-4 border-b border-gray-200">
            <Text className="font-semibold">Settings</Text>
          </View>
          {[
            { label: "Notifications", icon: "notifications-outline" },
            { label: "Privacy & Security", icon: "shield-outline" },
            { label: "Help & Support", icon: "help-circle-outline" },
          ].map(({ label, icon }) => (
            <TouchableOpacity
              key={label}
              className="flex-row items-center p-4 border-b border-gray-200"
              activeOpacity={0.7}
            >
              <Ionicons name={icon as any} size={20} color="#8c9199" />
              <Text className="ml-3">{label}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={confirmLogoutAll}
            className="flex-row items-center p-4 border-b border-gray-200"
            activeOpacity={0.7}
            style={{ backgroundColor: "#fee2e2" }}
          >
            <Ionicons name="log-out-outline" size={20} color="#b91c1c" />
            <Text className="ml-3 text-red-600">Logout from all devices</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View className="bg-white p-4 mt-6 items-center">
          <Text className="text-gray-400 text-sm">AutoBalkan v1.0.0</Text>
          <Text className="text-gray-400 text-xs">© 2024 AutoBalkan. All rights reserved.</Text>
        </View>
      </ScrollView>

      <BottomNavigation />
    </View>
  );
}
