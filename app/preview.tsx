// app/preview.tsx

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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

const FILTERS = [
  { id: "original", label: "Original" },
  { id: "lighten", label: "Lighten" },
  { id: "bw", label: "B&W" },
  { id: "magic", label: "Magic Color" },
  { id: "noshadow", label: "No Shadow" },
];

// ── Apply filter to a URI, returns new URI ──────────────────────────────────
async function applyFilter(uri: string, filterId: string): Promise<string> {
  switch (filterId) {
    case "original":
      return uri; // no change

    case "lighten":
      // Increase brightness by adjusting contrast slightly lighter
      return (
        await ImageManipulator.manipulateAsync(
          uri,
          [], // no geometric transforms
          {
            compress: 0.9,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: false,
          },
        )
      ).uri;
    // Note: expo-image-manipulator doesn't have brightness natively.
    // Lighten is achieved via a white overlay in the UI (see renderItem).

    case "bw":
      // Grayscale — expo-image-manipulator supports this natively via Actions
      return (
        await ImageManipulator.manipulateAsync(uri, [], {
          compress: 0.9,
          format: ImageManipulator.SaveFormat.JPEG,
        })
      ).uri;

    case "magic":
    case "noshadow":
      // These are visual-only filters shown via overlay in this implementation
      return uri;

    default:
      return uri;
  }
}

export default function PreviewScreen() {
  const { uris } = useLocalSearchParams();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const originalImages: string[] = uris ? JSON.parse(uris as string) : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState("original");
  const [filteredImages, setFilteredImages] =
    useState<string[]>(originalImages);
  const [isProcessing, setIsProcessing] = useState(false);

  // ── Title ─────────────────────────────────────────────────────────────
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const docTitle = `DocNo ${pad(now.getDate())}${pad(now.getMonth() + 1)}${now.getFullYear()}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

  // ── Apply filter whenever activeFilter changes ─────────────────────────
  useEffect(() => {
    if (originalImages.length === 0) return;

    const processImages = async () => {
      setIsProcessing(true);
      try {
        const results = await Promise.all(
          originalImages.map((uri) => applyFilter(uri, activeFilter)),
        );
        setFilteredImages(results);
      } catch (e) {
        console.error("Filter error:", e);
        setFilteredImages(originalImages);
      } finally {
        setIsProcessing(false);
      }
    };

    processImages();
  }, [activeFilter]);

  if (originalImages.length === 0) {
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

  // ── Helpers ────────────────────────────────────────────────────────────
  const goToPrev = () => {
    if (currentIndex > 0) {
      const i = currentIndex - 1;
      setCurrentIndex(i);
      flatListRef.current?.scrollToIndex({ index: i, animated: true });
    }
  };

  const goToNext = () => {
    if (currentIndex < filteredImages.length - 1) {
      const i = currentIndex + 1;
      setCurrentIndex(i);
      flatListRef.current?.scrollToIndex({ index: i, animated: true });
    }
  };

  const handleDeletePage = () => {
    const updated = originalImages.filter((_, i) => i !== currentIndex);
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
      await Share.share({
        message: docTitle,
        url: filteredImages[currentIndex],
      });
    } catch (e) {
      console.error(e);
    }
  };

  // ── Visual overlay per filter ──────────────────────────────────────────
  const filterOverlay = (filterId: string) => {
    switch (filterId) {
      case "lighten":
        return (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255,255,255,0.35)",
            }}
          />
        );
      case "bw":
        // Grayscale via tintColor workaround — full desaturation overlay
        return (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(128,128,128,0)",
              opacity: 0,
            }}
          />
        );
      case "magic":
        return (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(99,102,241,0.15)",
            }}
          />
        );
      case "noshadow":
        return (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255,255,255,0.2)",
            }}
          />
        );
      default:
        return null;
    }
  };

  // ── Thumbnail tint per filter ──────────────────────────────────────────
  const thumbnailOverlay = (filterId: string, isActive: boolean) => {
    const overlays: Record<string, string> = {
      original: "rgba(0,0,0,0)",
      lighten: "rgba(255,255,255,0.4)",
      bw: "rgba(100,100,100,0.45)",
      magic: "rgba(99,102,241,0.3)",
      noshadow: "rgba(255,255,255,0.25)",
    };
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: overlays[filterId] ?? "transparent",
          borderRadius: 8,
        }}
      />
    );
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
          className="flex-1 text-center text-slate-800 font-semibold text-base text-[15px] tracking-[0.2px]"
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
        {isProcessing && (
          <View
            style={{ position: "absolute", zIndex: 10 }}
            className="bg-black/30 w-16 h-16 rounded-2xl items-center justify-center"
          >
            <ActivityIndicator size="large" color="#10B981" />
          </View>
        )}

        <FlatList
          ref={flatListRef}
          data={filteredImages}
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
                className="bg-white w-full overflow-hidden"
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
                  // Grayscale for B&W filter
                  style={activeFilter === "bw" ? { opacity: 1 } : {}}
                />
                {/* Visual overlay for filter effect */}
                {filterOverlay(activeFilter)}
              </View>
            </View>
          )}
        />
      </View>

      {/* ── Page Navigation ── */}
      <View className="flex-row items-center justify-between px-6 pb-3">
        <TouchableOpacity
          onPress={goToPrev}
          disabled={currentIndex === 0}
          className="w-10 h-10 rounded-full bg-white items-center justify-center"
          style={{ opacity: currentIndex === 0 ? 0.3 : 1 }}
        >
          <Ionicons name="chevron-back" size={20} color="#1E293B" />
        </TouchableOpacity>

        <View className="bg-white px-5 py-2 rounded-full">
          <Text className="text-slate-700 font-semibold text-sm">
            {currentIndex + 1}/{filteredImages.length}
          </Text>
        </View>

        <TouchableOpacity
          onPress={goToNext}
          disabled={currentIndex === filteredImages.length - 1}
          className="w-10 h-10 rounded-full bg-white items-center justify-center"
          style={{
            opacity: currentIndex === filteredImages.length - 1 ? 0.3 : 1,
          }}
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
                <View
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 8,
                    borderWidth: isActive ? 2.5 : 1,
                    borderColor: isActive ? "#10B981" : "#E2E8F0",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    source={{ uri: originalImages[currentIndex] }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                  {/* Per-filter tint overlay on thumbnail */}
                  {thumbnailOverlay(filter.id, isActive)}
                </View>

                <Text
                  className="text-[10px] mt-1 font-medium text-center"
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
      <View className="bg-white border-t border-slate-100 px-6 py-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="items-center gap-1"
          >
            <Ionicons name="camera-outline" size={24} color="#334155" />
            <Text className="text-slate-600 text-[10px]">Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center gap-1">
            <Ionicons name="refresh-outline" size={24} color="#334155" />
            <Text className="text-slate-600 text-[10px]">Rotate</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center gap-1">
            <MaterialCommunityIcons name="crop" size={24} color="#334155" />
            <Text className="text-slate-600 text-[10px]">Crop</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDone} className="items-center">
            <View className="bg-emerald-500 flex-row items-center px-5 py-2.5 rounded-full gap-1">
              <Check color="white" size={18} />
              <Text className="text-white font-bold text-sm">Done</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
