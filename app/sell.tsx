import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import { useNavigation } from "@react-navigation/native"
import { apiService } from "@/services/api" // Your real API service (adjust path)
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

interface CarListing {
  title: string
  price: number
  year: number
  mileage: number
  fuel_type: string
  transmission: string
  location: string
  description: string
  images: ImagePicker.ImagePickerAsset[] // Picked images type from expo-image-picker
  specifications: {
    engine: string
    power: string
    color: string
    doors: number
    seats: number
  }
}

export default function SellCarScreen() {
  const navigation = useNavigation()
  const { user } = useAuth()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [listing, setListing] = useState<CarListing>({
    title: "",
    price: 0,
    year: new Date().getFullYear(),
    mileage: 0,
    fuel_type: "",
    transmission: "",
    location: "",
    description: "",
    images: [],
    specifications: {
      engine: "",
      power: "",
      color: "",
      doors: 4,
      seats: 5,
    },
  })

  // Helper for nested fields update
  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setListing({
        ...listing,
        [parent]: {
          ...(listing as any)[parent],
          [child]: value,
        },
      })
    } else {
      setListing({ ...listing, [field]: value })
    }
  }

  // Image picker with Expo ImagePicker
  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        base64: false,
      })

      if (!result.canceled) {
        // Supports multiple selection from Expo SDK 48+
        const selectedImages = result.assets || []

        // Filter images <= 5MB (~5242880 bytes)
        const validImages = selectedImages.filter((img) => img.fileSize && img.fileSize <= 5 * 1024 * 1024)

        if (validImages.length !== selectedImages.length) {
          toast({
            title: "Invalid files",
            description: "Some images were skipped. Max size 5MB each.",
            variant: "destructive",
          })
        }

        setListing({
          ...listing,
          images: [...listing.images, ...validImages].slice(0, 10),
        })
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to pick images.",
        variant: "destructive",
      })
    }
  }

  const removeImage = (index: number) => {
    setListing({
      ...listing,
      images: listing.images.filter((_, i) => i !== index),
    })
  }

  const validateStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return listing.title.length > 0 && listing.price > 0 && listing.year > 1900
      case 2:
        return listing.fuel_type.length > 0 && listing.transmission.length > 0 && listing.location.length > 0
      case 3:
        return listing.description.length >= 50
      case 4:
        return listing.images.length >= 1
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    } else {
      toast({
        title: "Please complete all fields",
        description: "Fill in all required information before continuing.",
        variant: "destructive",
      })
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const submitListing = async () => {
    if (!validateStep(4)) {
      toast({
        title: "Please complete all fields",
        description: "Make sure all information is filled in correctly.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()

      formData.append("title", listing.title)
      formData.append("price", listing.price.toString())
      formData.append("year", listing.year.toString())
      formData.append("mileage", listing.mileage.toString())
      formData.append("fuel_type", listing.fuel_type)
      formData.append("transmission", listing.transmission)
      formData.append("location", listing.location)
      formData.append("description", listing.description)
      formData.append("specifications[engine]", listing.specifications.engine)
      formData.append("specifications[power]", listing.specifications.power)
      formData.append("specifications[color]", listing.specifications.color)
      formData.append("specifications[doors]", listing.specifications.doors.toString())
      formData.append("specifications[seats]", listing.specifications.seats.toString())

      // Append images as blobs for React Native
      listing.images.forEach((img, idx) => {
        // @ts-ignore
        formData.append(`images[${idx}]`, {
          uri: img.uri,
          type: img.type || "image/jpeg",
          name: img.fileName || `photo_${idx}.jpg`,
        })
      })

      const response = await apiService.createCar(formData) // Your API call

      if (!response.data) throw new Error("Failed to create car listing - no data returned")

      toast({
        title: "Car listed successfully!",
        description: "Your car is now live on AutoBalkan.",
      })

      // Navigate to success page - adjust route as needed
      navigation.navigate("sellsuccess", { id: response.data.id })
    } catch (error: any) {
      toast({
        title: "Failed to list car",
        description: error.message || "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text>Please log in to sell your car</Text>
        <Button title="Log In" onPress={() => navigation.navigate("Login")} />
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Sell Your Car</Text>
      <Text style={styles.subHeader}>Step {step} of 4</Text>

      {/* Steps */}

      {step === 1 && (
        <View>
          <Text style={styles.label}>Car Title *</Text>
          <TextInput
            style={styles.input}
            value={listing.title}
            onChangeText={(text) => handleInputChange("title", text)}
            placeholder="e.g., BMW X5 xDrive40i"
          />

          <Text style={styles.label}>Price ($) *</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={listing.price ? listing.price.toString() : ""}
            onChangeText={(text) => handleInputChange("price", Number(text) || 0)}
            placeholder="45000"
          />

          <Text style={styles.label}>Year *</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={listing.year.toString()}
            onChangeText={(text) => handleInputChange("year", Number(text) || new Date().getFullYear())}
            placeholder="2023"
          />

          <Text style={styles.label}>Mileage (km)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={listing.mileage ? listing.mileage.toString() : ""}
            onChangeText={(text) => handleInputChange("mileage", Number(text) || 0)}
            placeholder="25000"
          />
        </View>
      )}

      {step === 2 && (
        <View>
          <Text style={styles.label}>Fuel Type *</Text>
          <TextInput
            style={styles.input}
            value={listing.fuel_type}
            onChangeText={(text) => handleInputChange("fuel_type", text)}
            placeholder="Gasoline, Diesel, Electric, Hybrid"
          />

          <Text style={styles.label}>Transmission *</Text>
          <TextInput
            style={styles.input}
            value={listing.transmission}
            onChangeText={(text) => handleInputChange("transmission", text)}
            placeholder="Manual, Automatic, CVT"
          />

          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.input}
            value={listing.location}
            onChangeText={(text) => handleInputChange("location", text)}
            placeholder="Belgrade, Serbia"
          />

          <Text style={styles.label}>Engine</Text>
          <TextInput
            style={styles.input}
            value={listing.specifications.engine}
            onChangeText={(text) => handleInputChange("specifications.engine", text)}
            placeholder="2.0L Turbo"
          />

          <Text style={styles.label}>Power</Text>
          <TextInput
            style={styles.input}
            value={listing.specifications.power}
            onChangeText={(text) => handleInputChange("specifications.power", text)}
            placeholder="250 HP"
          />

          <Text style={styles.label}>Color</Text>
          <TextInput
            style={styles.input}
            value={listing.specifications.color}
            onChangeText={(text) => handleInputChange("specifications.color", text)}
            placeholder="Black"
          />

          <Text style={styles.label}>Doors</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={listing.specifications.doors.toString()}
            onChangeText={(text) => handleInputChange("specifications.doors", Number(text) || 4)}
            placeholder="4"
          />

          <Text style={styles.label}>Seats</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={listing.specifications.seats.toString()}
            onChangeText={(text) => handleInputChange("specifications.seats", Number(text) || 5)}
            placeholder="5"
          />
        </View>
      )}

      {step === 3 && (
        <View>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            multiline
            value={listing.description}
            onChangeText={(text) => handleInputChange("description", text)}
            placeholder="Describe your car (minimum 50 characters)"
          />
          <Text>{listing.description.length}/50 minimum</Text>
        </View>
      )}

      {step === 4 && (
        <View>
          <Text style={styles.label}>Photos (1 to 10)</Text>
          <Button title="Pick Images" onPress={pickImages} />
          <ScrollView horizontal style={{ marginTop: 10 }}>
            {listing.images.map((img, index) => (
              <View key={index} style={{ marginRight: 10, position: "relative" }}>
                <Image source={{ uri: img.uri }} style={{ width: 100, height: 80, borderRadius: 8 }} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(index)}
                >
                  <Text style={{ color: "white" }}>X</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Navigation Buttons */}
      <View style={styles.navigation}>
        {step > 1 && <Button title="Previous" onPress={prevStep} />}
        {step < 4 && <Button title="Next" onPress={nextStep} />}
        {step === 4 && (
          <Button title={loading ? "Publishing..." : "Publish Listing"} onPress={submitListing} disabled={loading} />
        )}
      </View>

      {loading && <ActivityIndicator size="large" color="#fc6828" style={{ marginTop: 10 }} />}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: "#f9fafb",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subHeader: {
    marginBottom: 16,
    color: "#8c9199",
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "white",
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "red",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})
