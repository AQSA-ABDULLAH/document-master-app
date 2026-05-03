// app/preview.tsx

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ── Filter options ──────────────────────────────────────────────────────────
const FILTERS = [
  { id: "original", label: "Original", color: "#1E293B" },
  { id: "lighten", label: "Lighten", color: "#334155" },
  { id: "bw", label: "B&W", color: "#10B981" },
  { id: "magic", label: "Magic Color", color: "#1E3A5F" },
  { id: "noshadow", label: "No Shadow", color: "#374151" },
];

export default function PreviewScreen() {
  const { uris } = useLocalSearchParams();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const images: string[] = uris ? JSON.parse(uris as string) : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState("bw");

  const isBatch = images.length > 1;

  // ── Title ───────────────────────────────────────────────────────────────
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const docTitle = `ScanOn ${pad(now.getDate())}${pad(now.getMonth() + 1)}${now.getFullYear()}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

  if (images.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100">
        <Text className="text-slate-500">No image found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-slate-700 px-6 py-3 rounded-full"
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Navigation helpers ──────────────────────────────────────────────────
  const goToPrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }
  };

  const handleDeletePage = () => {
    const updated = images.filter((_, i) => i !== currentIndex);
    if (updated.length === 0) {
      router.back();
      return;
    }
    router.replace({
      pathname: "/preview",
      params: { uris: JSON.stringify(updated) },
    });
  };

  const handleDone = async () => {
    try {
      await Share.share({ message: docTitle, url: images[currentIndex] });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#EEF0F5]" edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Top Bar ── */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-9 h-9 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={26} color="#1E293B" />
        </TouchableOpacity>

        <Text
          className="flex-1 text-center text-slate-800 font-semibold text-base"
          numberOfLines={1}
          style={{
            textDecorationLine: "underline",
            textDecorationStyle: "dashed",
          }}
        >
          {docTitle}
        </Text>

        <TouchableOpacity
          onPress={handleDeletePage}
          className="w-9 h-9 items-center justify-center"
        >
          <Ionicons name="trash-outline" size={22} color="#1E293B" />
        </TouchableOpacity>
      </View>

      {/* ── Document Image Viewer ── */}
      <View className="flex-1 items-center justify-center px-4 py-4">
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          style={{ flexGrow: 0 }}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x / (SCREEN_WIDTH - 32),
            );
            setCurrentIndex(index);
          }}
          renderItem={({ item }) => (
            <View style={{ width: SCREEN_WIDTH - 32 }}>
              <View
                className="bg-white w-full"
                style={{
                  aspectRatio: 0.75,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <Image
                  source={{ uri: item }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            </View>
          )}
        />
      </View>

      {/* ── Page Navigation & Filter Toggle ── */}
      <View className="flex-row items-center justify-between px-6 pb-3">
        {/* Left arrow */}
        <TouchableOpacity
          onPress={goToPrev}
          disabled={currentIndex === 0}
          className="w-10 h-10 rounded-full bg-white items-center justify-center"
          style={{ opacity: currentIndex === 0 ? 0.3 : 1 }}
        >
          <Ionicons name="chevron-back" size={20} color="#1E293B" />
        </TouchableOpacity>

        {/* Page counter */}
        <View className="bg-white px-5 py-2 rounded-full">
          <Text className="text-slate-700 font-semibold text-sm">
            {currentIndex + 1}/{images.length}
          </Text>
        </View>

        {/* Right arrow */}
        <TouchableOpacity
          onPress={goToNext}
          disabled={currentIndex === images.length - 1}
          className="w-10 h-10 rounded-full bg-white items-center justify-center"
          style={{ opacity: currentIndex === images.length - 1 ? 0.3 : 1 }}
        >
          <Ionicons name="chevron-forward" size={20} color="#1E293B" />
        </TouchableOpacity>
      </View>

      {/* ── Filter Strip ── */}
      <View className="bg-white pt-3 pb-2">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, gap: 12 }}
        >
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <TouchableOpacity
                key={filter.id}
                onPress={() => setActiveFilter(filter.id)}
                className="items-center"
              >
                {/* Filter thumbnail */}
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 8,
                    borderWidth: isActive ? 2.5 : 0,
                    borderColor: isActive ? "#10B981" : "transparent",
                    overflow: "hidden",
                    backgroundColor:
                      filter.id === "bw"
                        ? "#D1FAE5"
                        : filter.id === "lighten"
                          ? "#334155"
                          : filter.id === "magic"
                            ? "#1E3A5F"
                            : filter.id === "noshadow"
                              ? "#374151"
                              : "#1E293B",
                  }}
                >
                  <Image
                    source={{ uri: images[currentIndex] }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                  {/* B&W overlay */}
                  {filter.id === "bw" && (
                    <View
                      style={{
                        ...{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                        },
                        backgroundColor: "rgba(209,250,229,0.55)",
                      }}
                    />
                  )}
                </View>

                {/* Label */}
                <Text
                  className="text-xs mt-1 font-medium"
                  style={{ color: isActive ? "#10B981" : "#64748B" }}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Bottom Action Bar ── */}
      <View className="bg-white border-t border-slate-100 px-4 py-3">
        <View className="flex-row items-center justify-between">
          {/* Retake */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="items-center gap-1"
          >
            <Ionicons name="camera-outline" size={24} color="#334155" />
            <Text className="text-slate-600 text-[10px]">Retake</Text>
          </TouchableOpacity>

          {/* Rotate */}
          <TouchableOpacity className="items-center gap-1">
            <Ionicons name="refresh-outline" size={24} color="#334155" />
            <Text className="text-slate-600 text-[10px]">Rotate</Text>
          </TouchableOpacity>

          {/* Crop */}
          <TouchableOpacity className="items-center gap-1">
            <MaterialCommunityIcons name="crop" size={24} color="#334155" />
            <Text className="text-slate-600 text-[10px]">Crop</Text>
          </TouchableOpacity>

          {/* Done */}
          <TouchableOpacity onPress={handleDone} className="items-center">
            <View className="bg-emerald-500 flex-row items-center px-4 py-2 rounded-full gap-1">
              <Check color="white" size={20} />
              <Text className="text-white font-bold text-[12px]">Done</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
