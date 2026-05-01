// app/preview.tsx

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function PreviewScreen() {
  const { uris } = useLocalSearchParams();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Parse images — works for both single and batch
  const images: string[] = uris ? JSON.parse(uris as string) : [];

  const isBatch = images.length > 1;

  if (images.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">No image found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-slate-700 px-6 py-3 rounded-full"
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleUsePhotos = () => {
    console.log("Using photos:", images);
    // TODO: save to storage / send to backend / navigate to edit
    router.push("/(tabs)");
  };

  return (
    <View className="flex-1 bg-black">
      {/* ── Full Screen Image Swiper ── */}
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / SCREEN_WIDTH,
          );
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View
            style={{ width: SCREEN_WIDTH }}
            className="flex-1 justify-center"
          >
            <Image
              source={{ uri: item }}
              style={{ width: SCREEN_WIDTH, flex: 1 }}
              resizeMode="contain"
            />
          </View>
        )}
      />

      {/* ── Top Bar ── */}
      <SafeAreaView
        edges={["top"]}
        className="absolute top-0 left-0 right-0"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <View className="flex-row items-center justify-between px-4 py-3">
          {/* Back */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-9 h-9 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          {/* Page counter — batch only */}
          {isBatch && (
            <View className="bg-black/50 px-4 py-1.5 rounded-full">
              <Text className="text-white text-sm font-semibold">
                {currentIndex + 1} / {images.length}
              </Text>
            </View>
          )}

          {/* Delete current page — batch only */}
          {isBatch ? (
            <TouchableOpacity
              onPress={() => {
                const updated = images.filter((_, i) => i !== currentIndex);
                if (updated.length === 0) {
                  router.back();
                  return;
                }
                router.replace({
                  pathname: "/preview",
                  params: { uris: JSON.stringify(updated) },
                });
              }}
              className="w-9 h-9 items-center justify-center"
            >
              <Ionicons name="trash-outline" size={22} color="#EF4444" />
            </TouchableOpacity>
          ) : (
            <View className="w-9" />
          )}
        </View>
      </SafeAreaView>

      {/* ── Thumbnail Strip — batch only ── */}
      {isBatch && (
        <View className="absolute left-0 right-0" style={{ bottom: 130 }}>
          <FlatList
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 10 }}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => setCurrentIndex(index)}
                className="mr-2"
              >
                <Image
                  source={{ uri: item }}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor:
                      currentIndex === index ? "#10B981" : "transparent",
                  }}
                  resizeMode="cover"
                />
                <View className="absolute bottom-1 left-1 bg-black/60 rounded px-1">
                  <Text className="text-white text-[9px]">{index + 1}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* ── Bottom Actions ── */}
      <SafeAreaView
        edges={["bottom"]}
        className="absolute bottom-0 left-0 right-0"
        style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      >
        <View className="flex-row justify-around items-center px-6 py-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 mr-3 bg-slate-700 py-3 rounded-full items-center"
          >
            <Text className="text-white font-semibold">
              {isBatch ? "Add More" : "Retake"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleUsePhotos}
            className="flex-1 ml-3 bg-indigo-600 py-3 rounded-full items-center"
          >
            <Text className="text-white font-semibold">
              {isBatch ? `Use ${images.length} Pages` : "Use Photo"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
