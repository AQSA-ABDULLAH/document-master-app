import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function PreviewScreen() {
  const { uri } = useLocalSearchParams();
  const router = useRouter();

  if (!uri) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">No image found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {/* Image Preview */}
      <Image
        source={{ uri: uri as string }}
        className="flex-1"
        resizeMode="contain"
      />

      {/* Top Bar */}
      <View className="absolute top-12 left-5">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Bottom Actions */}
      <View className="absolute bottom-10 w-full flex-row justify-around items-center px-6">
        
        {/* Retake */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-slate-800 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Retake</Text>
        </TouchableOpacity>

        {/* Use Photo */}
        <TouchableOpacity
          onPress={() => {
            console.log("Use Photo:", uri);

            // 👉 yahan tum next step kar sakti ho:
            // - save to storage
            // - send to backend
            // - navigate to edit screen

            router.push("/(tabs)"); // ya jahan bhejna ho
          }}
          className="bg-indigo-600 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Use Photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}