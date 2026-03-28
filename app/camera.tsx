//app/camera.tsx

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const router = useRouter();
  const [mode, setMode] = useState("Single");

  const modes = [
    "Extract Text",
    "To Word",
    "Single",
    "Batch",
    "ID Cards",
    "Passport",
  ];

  if (!permission) return <View className="flex-1 bg-black" />;
  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-10">
        <Text className="text-white text-center text-lg">
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          className="bg-indigo-600 px-8 py-3 rounded-full mt-6"
          onPress={requestPermission}
        >
          <Text className="text-white font-bold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      router.push({
        pathname: "/preview",
        params: { uri: photo.uri },
      });
    }
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView style={{ flex: 1 }} facing="back" ref={cameraRef}>
        <SafeAreaView className="flex-1 justify-between">
          {/* 1. Top Bar */}
          <View className="flex-row justify-between items-center px-6 py-4">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
            <View className="flex-row space-x-6">
              <TouchableOpacity>
                <Ionicons name="flash-outline" size={26} color="white" />
              </TouchableOpacity>
              <TouchableOpacity>
                <MaterialCommunityIcons size={28} color="white" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="ellipsis-vertical" size={26} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 2. Middle Viewfinder (Visual Guide) */}
          <View className="flex-1 items-center justify-center">
            {/* ID Card ya Document Frame yahan draw kiya ja sakta hai */}
            <View className="w-[85%] h-64 border-2 border-emerald-400/50 rounded-lg" />
          </View>

          {/* 3. Bottom Controls Container */}
          <View className="bg-black/40 pb-6">
            {/* Mode Selector (Scrollable) */}
            <View className="py-4">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20 }}
              >
                {modes.map((m) => (
                  <TouchableOpacity
                    key={m}
                    onPress={() => setMode(m)}
                    className="mr-6"
                  >
                    <Text
                      className={`text-sm font-bold ${mode === m ? "text-emerald-400" : "text-white/60"}`}
                    >
                      {m.toUpperCase()}
                    </Text>
                    {mode === m && (
                      <View className="h-1 w-1 bg-emerald-400 rounded-full self-center mt-1" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Main Action Bar */}
            <View className="flex-row items-center justify-around px-4">
              {/* All Features */}
              <TouchableOpacity className="items-center">
                <Ionicons name="grid-outline" size={28} color="white" />
                <Text className="text-white text-[10px] mt-1">
                  All Features
                </Text>
              </TouchableOpacity>

              {/* Import Images */}
              <TouchableOpacity className="items-center">
                <Ionicons name="images-outline" size={28} color="white" />
                <Text className="text-white text-[10px] mt-1">
                  Import Images
                </Text>
              </TouchableOpacity>

              {/* Capture Button */}
              <TouchableOpacity
                onPress={takePicture}
                className="w-20 h-20 rounded-full border-4 border-emerald-400 items-center justify-center"
              >
                <View className="w-16 h-16 bg-white rounded-full" />
              </TouchableOpacity>

              {/* Import Files */}
              <TouchableOpacity className="items-center">
                <Ionicons name="folder-open-outline" size={28} color="white" />
                <Text className="text-white text-[10px] mt-1">
                  Import Files
                </Text>
              </TouchableOpacity>

              {/* Empty Space for symmetry */}
              <View className="w-10" />
            </View>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}
