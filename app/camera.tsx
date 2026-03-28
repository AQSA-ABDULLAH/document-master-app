//app/camera.tsx

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const router = useRouter();
  const [mode, setMode] = useState("Single");

  // --- Native Permission Trigger ---
  useEffect(() => {
    // Agar permission abhi tak nahi mili aur na hi request ki gayi hai
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  // Loading state jab tak permission load ho rahi ho
  if (!permission) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  // Agar user ne permission permanently deny kar di ho (Setting se on karni hogi)
  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-10">
        <Ionicons name="camera-reverse-outline" size={60} color="#64748B" />
        <Text className="text-white text-center text-lg mt-4 font-semibold">
          Camera Access Required
        </Text>
        <Text className="text-slate-400 text-center mt-2">
          Please enable camera permissions in your system settings to use the
          scanner.
        </Text>
        <TouchableOpacity
          className="bg-emerald-500 px-10 py-4 rounded-full mt-8"
          onPress={requestPermission}
        >
          <Text className="text-white font-bold text-base">Try Again</Text>
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
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-black">
        <CameraView style={{ flex: 1 }} facing="back" ref={cameraRef}>
          {/* Baaki ka UI code wahi rahay ga... */}

          {/* ... (Existing UI code from previous response) */}
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

          <View className="flex-1 items-center justify-center">
            <View className="w-[85%] h-64 border-2 border-emerald-400/50 rounded-lg" />
          </View>

          <View className="bg-black/40 pb-6">
            {/* Mode ScrollView and Action Buttons code... */}
            <View className="py-4">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20 }}
              >
                {[
                  "Extract Text",
                  "To Word",
                  "Single",
                  "Batch",
                  "ID Cards",
                  "Passport",
                ].map((m) => (
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

            <View className="flex-row items-center justify-around px-4">
              <TouchableOpacity className="items-center">
                <Ionicons name="grid-outline" size={28} color="white" />
                <Text className="text-white text-[10px] mt-1">
                  All Features
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="items-center">
                <Ionicons name="images-outline" size={28} color="white" />
                <Text className="text-white text-[10px] mt-1">
                  Import Images
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={takePicture}
                className="w-20 h-20 rounded-full border-4 border-emerald-400 items-center justify-center"
              >
                <View className="w-16 h-16 bg-white rounded-full" />
              </TouchableOpacity>
              <TouchableOpacity className="items-center">
                <Ionicons name="folder-open-outline" size={28} color="white" />
                <Text className="text-white text-[10px] mt-1">
                  Import Files
                </Text>
              </TouchableOpacity>
              <View className="w-10" />
            </View>
          </View>
        </CameraView>
      </View>
    </>
  );
}
