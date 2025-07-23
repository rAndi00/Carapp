import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { CheckCircle, Home, Eye } from "lucide-react-native" // or another icon lib for RN
import { useRoute, useNavigation } from "@react-navigation/native"

export default function SellSuccessScreen() {
  const route = useRoute()
  const navigation = useNavigation()
  const { id } = route.params as { id: string }

  return (
    <View style={styles.container}>
      <CheckCircle size={80} color="white" style={{ marginBottom: 20 }} />
      <Text style={styles.title}>Car Listed Successfully!</Text>
      <Text style={styles.description}>
        Your car has been published on AutoBalkan and is now visible to thousands of potential buyers.
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>What happens next?</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Your listing is now live and searchable</Text>
          <Text style={styles.listItem}>• Buyers can contact you directly</Text>
          <Text style={styles.listItem}>• You'll receive notifications for inquiries</Text>
          <Text style={styles.listItem}>• You can edit your listing anytime</Text>
        </View>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate("CarDetails", { id })}
        >
          <Eye size={20} color="#fc6828" />
          <Text style={styles.primaryButtonText}>View Your Listing</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.outlineButton]}
          onPress={() => navigation.navigate("Home")}
        >
          <Home size={20} color="white" />
          <Text style={styles.outlineButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fc6828",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  infoBox: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    width: "100%",
  },
  infoTitle: {
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 8,
    color: "white",
  },
  list: {
    paddingLeft: 8,
  },
  listItem: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginBottom: 4,
  },
  buttons: {
    width: "100%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "white",
  },
  primaryButtonText: {
    color: "#fc6828",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "white",
  },
  outlineButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
  },
})
