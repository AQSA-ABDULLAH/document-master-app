// app/result.tsx

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    Share,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function DocViewer() {
  const { uris, title } = useLocalSearchParams();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images: string[] = uris ? JSON.parse(uris as string) : [];
  const docTitle = (title as string) ?? "Document";

  if (images.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100">
        <Text className="text-slate-500">No document found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-slate-700 px-6 py-3 rounded-full"
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Share ──────────────────────────────────────────────────────────────
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Sharing document: ${docTitle}`,
        url: images[currentIndex],
      });
    } catch (e) {
      console.error(e);
    }
  };

  // ── Save to device gallery ─────────────────────────────────────────────
  const handleSave = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow access to save images.",
        );
        return;
      }
      await Promise.all(
        images.map((uri) => MediaLibrary.saveToLibraryAsync(uri)),
      );
      Alert.alert("Saved!", `${images.length} image(s) saved to your gallery.`);
    } catch (e) {
      Alert.alert("Error", "Could not save the document.");
    }
  };

  // ── To Word (placeholder) ──────────────────────────────────────────────
  const handleToWord = () => {
    Alert.alert(
      "Convert to Word",
      "This feature will convert your scanned document to a Word file.",
      [{ text: "OK" }],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#EEF0F5]" edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Top Bar ── */}
      <View className="flex-row items-center justify-between bg-white">
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

        {/* Right placeholder to center title */}
        <View className="w-9" />
      </View>

      {/* ── Page Counter Badge ── */}
      <View className="px-4 pt-3 pb-1">
        <View className="self-start bg-slate-600 px-3 py-1 rounded-md">
          <Text className="text-white text-xs font-semibold">
            {currentIndex + 1}/{images.length}
          </Text>
        </View>
      </View>

      {/* ── Document Viewer ── */}
      <View className="flex-1 px-4 py-3">
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x / (SCREEN_WIDTH - 32),
            );
            setCurrentIndex(index);
          }}
          renderItem={({ item }) => (
            <View style={{ width: SCREEN_WIDTH - 32 }} className="flex-1">
              <View
                className="bg-white w-full flex-1"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <Image
                  source={{ uri: item }}
                  className="w-full flex-1"
                  resizeMode="contain"
                />
              </View>
            </View>
          )}
        />
      </View>

      {/* ── Thumbnail Strip — batch only ── */}
      {images.length > 1 && (
        <View className="bg-[#EEF0F5] py-2">
          <FlatList
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12 }}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  setCurrentIndex(index);
                  flatListRef.current?.scrollToIndex({ index, animated: true });
                }}
                className="mr-2"
              >
                <Image
                  source={{ uri: item }}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 6,
                    borderWidth: 2,
                    borderColor:
                      currentIndex === index ? "#6366F1" : "transparent",
                  }}
                  resizeMode="cover"
                />
                <View className="absolute bottom-1 left-1 bg-black/50 rounded px-1">
                  <Text className="text-white text-[9px]">{index + 1}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* ── Bottom Action Bar ── */}
      <View className="bg-white border-t border-slate-100 py-4">
        <View className="flex-row justify-around items-center px-6">
          {/* Share */}
          <TouchableOpacity
            onPress={handleShare}
            className="items-center gap-1"
          >
            <View className="w-12 h-12 items-center justify-center">
              <Ionicons name="share-outline" size={28} color="#334155" />
            </View>
            <Text className="text-slate-600 text-xs">Share</Text>
          </TouchableOpacity>

          {/* Save */}
          <TouchableOpacity onPress={handleSave} className="items-center gap-1">
            <View className="w-12 h-12 items-center justify-center">
              <Ionicons name="download-outline" size={28} color="#334155" />
            </View>
            <Text className="text-slate-600 text-xs">Save</Text>
          </TouchableOpacity>

          {/* To Word */}
          <TouchableOpacity
            onPress={handleToWord}
            className="items-center gap-1"
          >
            <View className="w-12 h-12 items-center justify-center">
              <MaterialCommunityIcons
                name="file-word-outline"
                size={28}
                color="#334155"
              />
            </View>
            <Text className="text-slate-600 text-xs">To Word</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
