// app/camera.tsx

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import { CheckCircle, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const router = useRouter();
  const [mode, setMode] = useState<"Single" | "Batch">("Single");
  const [batchImages, setBatchImages] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  const handleModeChange = (newMode: "Single" | "Batch") => {
    setMode(newMode);
    setBatchImages([]);
  };

  if (!permission) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 items-center justify-center px-10">
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
      </SafeAreaView>
    );
  }

  const takePictureSingle = async () => {
    if (cameraRef.current && !isCapturing) {
      setIsCapturing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync();
        router.push({ pathname: "/preview", params: { uri: photo.uri } });
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const takePictureBatch = async () => {
    if (cameraRef.current && !isCapturing) {
      setIsCapturing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setBatchImages((prev) => [...prev, photo.uri]);
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const removeBatchImage = (index: number) => {
    setBatchImages((prev) => prev.filter((_, i) => i !== index));
  };

  const proceedWithBatch = () => {
    if (batchImages.length === 0) return;
    router.push({
      pathname: "/preview",
      params: { uris: JSON.stringify(batchImages) },
    });
  };

  const handleCapture = () => {
    if (mode === "Single") takePictureSingle();
    else takePictureBatch();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Force status bar icons to be light (white) */}
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <View className="flex-1 bg-black">
        <CameraView style={{ flex: 1 }} facing="back" ref={cameraRef}>
          {/* ── SafeAreaView wraps only the top bar so it pushes below status bar ── */}
          <SafeAreaView
            edges={["top"]}
            style={{ backgroundColor: "rgba(0,0,0,1)" }}
          >
            <View className="flex-row justify-between items-center px-6 py-3">
              <TouchableOpacity onPress={() => router.back()}>
                <X color="white" size={30} />
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
          </SafeAreaView>

          {/* ── Viewfinder ── */}
          <View className="flex-1 items-center justify-center">
            <View className="w-[85%] h-64 border-2 border-emerald-400/50 rounded-lg" />

            {mode === "Batch" && batchImages.length > 0 && (
              <View className="absolute top-2 right-[7%] bg-emerald-500 rounded-full w-8 h-8 items-center justify-center">
                <Text className="text-white font-bold text-sm">
                  {batchImages.length}
                </Text>
              </View>
            )}
          </View>

          {/* ── Batch Thumbnails ── */}
          {mode === "Batch" && batchImages.length > 0 && (
            <View className="px-4 mb-2">
              <FlatList
                data={batchImages}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <View className="mr-2 relative">
                    <Image
                      source={{ uri: item }}
                      className="w-16 h-16 rounded-lg border-2 border-emerald-400"
                    />
                    <TouchableOpacity
                      onPress={() => removeBatchImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center"
                    >
                      <Text className="text-white text-xs font-bold">✕</Text>
                    </TouchableOpacity>
                    <View className="absolute bottom-1 left-1 bg-black/60 rounded px-1">
                      <Text className="text-white text-[9px]">{index + 1}</Text>
                    </View>
                  </View>
                )}
              />
            </View>
          )}

          {/* ── Bottom Controls ── */}
          <SafeAreaView
            edges={["bottom"]}
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          >
            <View className="py-4">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20 }}
              >
                {(["Single", "Batch"] as const).map((m) => (
                  <TouchableOpacity
                    key={m}
                    onPress={() => handleModeChange(m)}
                    className="mr-6"
                  >
                    <Text
                      className={`text-sm font-bold ${
                        mode === m ? "text-emerald-400" : "text-white/60"
                      }`}
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

            <View className="flex-row items-center justify-around px-4 pb-4">
              <TouchableOpacity className="items-center" />

              <TouchableOpacity className="items-center">
                <Ionicons name="images-outline" size={28} color="white" />
                <Text className="text-white text-[10px] mt-1">
                  Import Images
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCapture}
                disabled={isCapturing}
                className={`w-20 h-20 rounded-full border-4 items-center justify-center ${
                  isCapturing ? "border-white/40" : "border-emerald-400"
                }`}
              >
                <View
                  className={`w-16 h-16 rounded-full ${
                    isCapturing ? "bg-white/40" : "bg-white"
                  }`}
                />
              </TouchableOpacity>

              <TouchableOpacity className="items-center">
                <Ionicons name="folder-open-outline" size={28} color="white" />
                <Text className="text-white text-[10px] mt-1">
                  Import Files
                </Text>
              </TouchableOpacity>

              {mode === "Batch" && batchImages.length > 0 ? (
                <TouchableOpacity
                  onPress={proceedWithBatch}
                  className="items-center"
                >
                  <CheckCircle color="#10B981" size={28} />
                  <Text className="text-emerald-400 text-[10px] mt-1 font-bold">
                    Done ({batchImages.length})
                  </Text>
                </TouchableOpacity>
              ) : (
                <View className="w-10" />
              )}
            </View>
          </SafeAreaView>
        </CameraView>
      </View>
    </>
  );
}
