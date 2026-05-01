// app/camera.tsx

import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import { X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  const [flash, setFlash] = useState<"off" | "on">("off");

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  const handleModeChange = (newMode: "Single" | "Batch") => {
    setMode(newMode);
    setBatchImages([]);
  };

  // ── Permission Loading ──────────────────────────────────────────────────
  if (!permission) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  // ── Permission Denied ───────────────────────────────────────────────────
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

  // ── Single Mode: capture one → navigate immediately ─────────────────────
  const takePictureSingle = async () => {
    if (!cameraRef.current || isCapturing) return;
    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync();
      router.push({
        pathname: "/preview",
        params: { uris: JSON.stringify([photo.uri]) },
      });
    } catch {
      Alert.alert("Error", "Failed to capture photo. Please try again.");
    } finally {
      setIsCapturing(false);
    }
  };

  // ── Batch Mode: keep adding to list ─────────────────────────────────────
  const takePictureBatch = async () => {
    if (!cameraRef.current || isCapturing) return;
    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync();
      setBatchImages((prev) => [...prev, photo.uri]);
    } catch {
      Alert.alert("Error", "Failed to capture photo. Please try again.");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleCapture = () => {
    if (mode === "Single") takePictureSingle();
    else takePictureBatch();
  };

  // ── Remove one image from batch ─────────────────────────────────────────
  const removeBatchImage = (index: number) => {
    setBatchImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Proceed with all batch images ───────────────────────────────────────
  const proceedWithBatch = () => {
    if (batchImages.length === 0) return;
    router.push({
      pathname: "/preview",
      params: { uris: JSON.stringify(batchImages) },
    });
  };

  // ── Import from Gallery ─────────────────────────────────────────────────
  const handleImportImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // Allow multiple only in Batch mode
      allowsMultipleSelection: mode === "Batch",
      quality: 1,
    });

    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      if (mode === "Single") {
        // Navigate immediately with the first picked image
        router.push({
          pathname: "/preview",
          params: { uris: JSON.stringify([uris[0]]) },
        });
      } else {
        // Add all picked images to batch
        setBatchImages((prev) => [...prev, ...uris]);
      }
    }
  };

  // ── Import Files (documents) ────────────────────────────────────────────
  const handleImportFiles = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: mode === "Batch",
      quality: 1,
    });

    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      if (mode === "Single") {
        router.push({
          pathname: "/preview",
          params: { uris: JSON.stringify([uris[0]]) },
        });
      } else {
        setBatchImages((prev) => [...prev, ...uris]);
      }
    }
  };

  // ── Toggle Flash ────────────────────────────────────────────────────────
  const toggleFlash = () => setFlash((prev) => (prev === "off" ? "on" : "off"));

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <StatusBar barStyle="light-content" backgroundColor="black" translucent />

      <View className="flex-1 bg-black">
        {/* Camera fills entire screen as background */}
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          ref={cameraRef}
          enableTorch={flash === "on"}
        />

        {/* All UI is absolutely positioned on top */}
        <View
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          {/* ── Top Bar ── */}
          <SafeAreaView
            edges={["top"]}
            style={{ backgroundColor: "rgba(0,0,0,1)" }}
          >
            <View className="flex-row justify-between items-center px-4 pt-4 pb-3">
              <TouchableOpacity onPress={() => router.back()}>
                <X color="white" size={24} />
              </TouchableOpacity>
              <View className="flex-row gap-3">
                {/* Flash Toggle */}
                <TouchableOpacity onPress={toggleFlash}>
                  <Ionicons
                    name={flash === "on" ? "flash" : "flash-outline"}
                    size={24}
                    color={flash === "on" ? "#10B981" : "white"}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Ionicons name="ellipsis-vertical" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>

          {/* ── Viewfinder ── */}
          <View className="flex-1 items-center justify-center">
            {mode === "Batch" && batchImages.length > 0 && (
              <View className="absolute top-2 right-[7%] bg-emerald-500 rounded-full w-8 h-8 items-center justify-center">
                <Text className="text-white font-bold text-sm">
                  {batchImages.length}
                </Text>
              </View>
            )}
          </View>

          {/* ── Batch Thumbnails Strip ── */}
          {mode === "Batch" && batchImages.length > 0 && (
            <View className="px-4 mb-2">
              <FlatList
                data={batchImages}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={{ paddingTop: 10 }}
                renderItem={({ item, index }) => (
                  <View className="mr-2 relative">
                    <Image
                      source={{ uri: item }}
                      className="w-16 h-16 rounded-lg border-2 border-emerald-400"
                    />
                    {/* Remove button */}
                    <TouchableOpacity
                      onPress={() => removeBatchImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center"
                    >
                      <Text className="text-white text-xs font-bold">✕</Text>
                    </TouchableOpacity>
                    {/* Page number */}
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
            style={{ backgroundColor: "rgba(0,0,0,1)" }}
          >
            {/* Mode Tabs */}
            <View className="pt-4 pb-5">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 145 }}
              >
                {(["Single", "Batch"] as const).map((m) => (
                  <TouchableOpacity
                    key={m}
                    onPress={() => handleModeChange(m)}
                    className="mr-[18px]"
                  >
                    <Text
                      className={`text-[12px] tracking-[1px] font-bold ${
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

            {/* Shutter Row */}
            <View className="flex-row items-center justify-between px-8 pb-4">
              {/* Import Images */}
              <TouchableOpacity
                onPress={handleImportImages}
                className="items-center"
              >
                <Ionicons name="images-outline" size={28} color="white" />
                <Text className="text-white text-[10px] mt-1">
                  Import Images
                </Text>
              </TouchableOpacity>

              {/* Shutter Button */}
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

              {/* Import Files */}
              <TouchableOpacity
                onPress={handleImportFiles}
                className="items-center"
              >
                <Ionicons name="folder-open-outline" size={28} color="white" />
                <Text className="text-white text-[10px] mt-1">
                  Import Files
                </Text>
              </TouchableOpacity>
            </View>

            {/* Batch Done Button */}
            {/* {mode === "Batch" && batchImages.length > 0 && (
              <TouchableOpacity
                onPress={proceedWithBatch}
                className="flex-row items-center justify-center gap-2 mb-4"
              >
                <CheckCircle color="#10B981" size={22} />
                <Text className="text-emerald-400 font-bold text-sm">
                  Done — {batchImages.length} page
                  {batchImages.length !== 1 ? "s" : ""}
                </Text>
              </TouchableOpacity>
            )} */}
          </SafeAreaView>
        </View>
      </View>
    </>
  );
}
