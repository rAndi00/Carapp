import React from "react"
import { Picker } from "@react-native-picker/picker"
import { View } from "react-native"

interface SortPickerProps {
  value: string
  onValueChange: (value: string) => void
}

export default function SortPicker({ value, onValueChange }: SortPickerProps) {
  return (
    <View className="w-32 bg-white border border-gray-300 rounded">
      <Picker
        selectedValue={value}
        onValueChange={onValueChange}
        style={{ height: 35, width: "100%" }}
        mode="dropdown"
      >
        <Picker.Item label="Newest" value="newest" />
        <Picker.Item label="Oldest" value="oldest" />
        <Picker.Item label="Price: Low" value="price_low" />
        <Picker.Item label="Price: High" value="price_high" />
      </Picker>
    </View>
  )
}
