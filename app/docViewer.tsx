// app/docViewer.tsx

import { renameDocumentAPI, uploadDocumentAPI } from "@/lib/documentHelper";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import * as Print from "expo-print";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function DocViewerScreen() {
  const { uris, title, filter } = useLocalSearchParams();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const images: string[] = uris ? JSON.parse(uris as string) : [];
  const activeFilter = (filter as string) ?? "original";

  // ── Auto-generate title ────────────────────────────────────────────────
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const autoTitle = `DocNo_${pad(now.getDate())}${pad(now.getMonth() + 1)}${now.getFullYear()}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

  // ── State ──────────────────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [docTitle, setDocTitle] = useState((title as string) || autoTitle);
  const [editTitle, setEditTitle] = useState(docTitle);
  const [savedDocId, setSavedDocId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [renameModal, setRenameModal] = useState(false);
  const [saveModal, setSaveModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);

  // ── Empty state ────────────────────────────────────────────────────────
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

  // ── Save to backend (only once) ────────────────────────────────────────
  const saveToBackend = async (): Promise<string | null> => {
    if (savedDocId) return savedDocId;
    try {
      const data = await uploadDocumentAPI({
        imageUris: images,
        title: docTitle,
        mode: images.length > 1 ? "batch" : "single",
        filters: images.map(() => activeFilter),
      });
      setSavedDocId(data.document._id);
      console.log("✅ Saved to backend:", data.document._id);
      return data.document._id;
    } catch (err: any) {
      console.error("❌ Backend save error:", err.message);
      return null;
    }
  };

  // ── Generate PDF ───────────────────────────────────────────────────────
  const generatePDF = async (): Promise<string> => {
    const imgTags = await Promise.all(
      images.map(async (uri) => {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64, // ✅ works with legacy
        });
        return `
          <img
            src="data:image/jpeg;base64,${base64}"
            style="width:100%;display:block;page-break-after:always;"
          />`;
      }),
    );

    const html = `
      <html>
        <body style="margin:0;padding:0;">
          ${imgTags.join("")}
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });
    return uri; // ✅ use temp URI directly — no move needed
  };

  // ── Save as Image ──────────────────────────────────────────────────────
  const handleSaveAsImage = async () => {
    setSaveModal(false);
    setIsSaving(true);
    try {
      // ✅ Request only READ/WRITE — not AUDIO
      const { status } = await MediaLibrary.requestPermissionsAsync(false);
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow access to save images.",
        );
        return;
      }

      await Promise.all(
        images.map(async (uri) => {
          const filename = uri.split("/").pop() ?? `img_${Date.now()}.jpg`;
          const destUri = `${FileSystem.cacheDirectory}${filename}`;

          if (!uri.startsWith(FileSystem.cacheDirectory ?? "")) {
            await FileSystem.copyAsync({ from: uri, to: destUri });
            return MediaLibrary.saveToLibraryAsync(destUri);
          }

          return MediaLibrary.saveToLibraryAsync(uri);
        }),
      );

      await saveToBackend();
      Alert.alert("✅ Saved!", `${images.length} image(s) saved to gallery.`);
    } catch (e: any) {
      console.error("Save image error:", e);
      Alert.alert("Error", "Could not save images: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  // ── Save as PDF ────────────────────────────────────────────────────────
  const handleSaveAsPDF = async () => {
    setSaveModal(false);
    setIsSaving(true);
    try {
      const pdfUri = await generatePDF();

      // ✅ Request only READ/WRITE — not AUDIO
      const { status } = await MediaLibrary.requestPermissionsAsync(false);
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow access to save files.",
        );
        return;
      }

      await MediaLibrary.saveToLibraryAsync(pdfUri);
      await saveToBackend();
      Alert.alert("✅ Saved!", `PDF saved as "${docTitle}.pdf"`);
    } catch (e: any) {
      console.error("Save PDF error:", e);
      Alert.alert("Error", "Could not save PDF: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };
  // ── Share as Image ─────────────────────────────────────────────────────
  const handleShareAsImage = async () => {
    setShareModal(false);
    try {
      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert("Sharing not available");
        return;
      }
      await Sharing.shareAsync(images[currentIndex], {
        mimeType: "image/jpeg",
        dialogTitle: `Share ${docTitle}`,
      });
    } catch (e: any) {
      console.error("Share image error:", e);
      Alert.alert("Error", "Could not share image: " + e.message);
    }
  };

  // ── Share as PDF ───────────────────────────────────────────────────────
  const handleShareAsPDF = async () => {
    setShareModal(false);
    setIsSaving(true);
    try {
      const pdfUri = await generatePDF();
      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert("Sharing not available");
        return;
      }
      await Sharing.shareAsync(pdfUri, {
        mimeType: "application/pdf",
        dialogTitle: `Share ${docTitle}`,
      });
    } catch (e: any) {
      console.error("Share PDF error:", e);
      Alert.alert("Error", "Could not share PDF: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  // ── Rename ─────────────────────────────────────────────────────────────
  const handleRename = async () => {
    if (!editTitle.trim()) return;
    const newTitle = editTitle.trim();
    setDocTitle(newTitle);
    setRenameModal(false);
    if (savedDocId) {
      try {
        await renameDocumentAPI(savedDocId, newTitle);
        console.log("✅ Renamed in DB");
      } catch {
        console.error("❌ Rename failed");
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#EEF0F5]" edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Loading Overlay ── */}
      {isSaving && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            zIndex: 99,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View className="bg-white px-8 py-6 rounded-2xl items-center gap-3">
            <ActivityIndicator size="large" color="#10B981" />
            <Text className="text-slate-700 font-semibold mt-2">
              Processing...
            </Text>
          </View>
        </View>
      )}

      {/* ── Top Bar ── */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-9 h-9 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={26} color="#1E293B" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setEditTitle(docTitle);
            setRenameModal(true);
          }}
          className="flex-1 items-center"
        >
          <Text
            className="text-slate-800 font-semibold text-base"
            numberOfLines={1}
            style={{
              textDecorationLine: "underline",
              textDecorationStyle: "dashed",
            }}
          >
            {docTitle}
          </Text>
          <Text className="text-[9px] text-slate-400 mt-0.5">
            tap to rename
          </Text>
        </TouchableOpacity>

        <View className="w-9" />
      </View>

      {/* ── Page Counter ── */}
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
          keyExtractor={(_, i) => i.toString()}
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
                  elevation: 3,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
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
            keyExtractor={(_, i) => i.toString()}
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
            onPress={() => setShareModal(true)}
            className="items-center gap-1"
          >
            <View className="w-12 h-12 items-center justify-center">
              <Ionicons name="share-outline" size={28} color="#334155" />
            </View>
            <Text className="text-slate-600 text-xs">Share</Text>
          </TouchableOpacity>

          {/* Save */}
          <TouchableOpacity
            onPress={() => setSaveModal(true)}
            className="items-center gap-1"
          >
            <View className="w-12 h-12 items-center justify-center">
              <Ionicons name="download-outline" size={28} color="#334155" />
            </View>
            <Text className="text-slate-600 text-xs">Save</Text>
          </TouchableOpacity>

          {/* To Word */}
          <TouchableOpacity
            onPress={() =>
              Alert.alert("Coming Soon", "Word conversion coming soon!")
            }
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

      {/* ── Save Modal ── */}
      <Modal
        visible={saveModal}
        transparent
        animationType="slide"
        onRequestClose={() => setSaveModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setSaveModal(false)}
          className="flex-1 bg-black/50 justify-end"
        >
          <TouchableOpacity activeOpacity={1}>
            <View className="bg-white rounded-t-[32px] px-5 pt-4 pb-10">
              <View className="w-12 h-1.5 bg-slate-200 rounded-full self-center mb-5" />
              <Text className="text-xl font-bold text-slate-900 mb-6">
                Save As
              </Text>

              <TouchableOpacity
                onPress={handleSaveAsImage}
                className="flex-row items-center gap-4 py-4 border-b border-slate-100"
              >
                <View className="w-12 h-12 bg-indigo-100 rounded-2xl items-center justify-center">
                  <Ionicons name="image-outline" size={26} color="#6366F1" />
                </View>
                <View>
                  <Text className="text-slate-800 font-semibold text-base">
                    Save as Image
                  </Text>
                  <Text className="text-slate-400 text-xs">
                    Save as JPG to gallery
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveAsPDF}
                className="flex-row items-center gap-4 py-4"
              >
                <View className="w-12 h-12 bg-red-100 rounded-2xl items-center justify-center">
                  <MaterialCommunityIcons
                    name="file-pdf-box"
                    size={26}
                    color="#EF4444"
                  />
                </View>
                <View>
                  <Text className="text-slate-800 font-semibold text-base">
                    Save as PDF
                  </Text>
                  <Text className="text-slate-400 text-xs">
                    Save as {docTitle}.pdf
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ── Share Modal ── */}
      <Modal
        visible={shareModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShareModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShareModal(false)}
          className="flex-1 bg-black/50 justify-end"
        >
          <TouchableOpacity activeOpacity={1}>
            <View className="bg-white rounded-t-[32px] px-5 pt-4 pb-10">
              <View className="w-12 h-1.5 bg-slate-200 rounded-full self-center mb-5" />
              <Text className="text-xl font-bold text-slate-900 mb-6">
                Share As
              </Text>

              <TouchableOpacity
                onPress={handleShareAsImage}
                className="flex-row items-center gap-4 py-4 border-b border-slate-100"
              >
                <View className="w-12 h-12 bg-indigo-100 rounded-2xl items-center justify-center">
                  <Ionicons name="image-outline" size={26} color="#6366F1" />
                </View>
                <View>
                  <Text className="text-slate-800 font-semibold text-base">
                    Share as Image
                  </Text>
                  <Text className="text-slate-400 text-xs">
                    Share current page as JPG
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleShareAsPDF}
                className="flex-row items-center gap-4 py-4"
              >
                <View className="w-12 h-12 bg-red-100 rounded-2xl items-center justify-center">
                  <MaterialCommunityIcons
                    name="file-pdf-box"
                    size={26}
                    color="#EF4444"
                  />
                </View>
                <View>
                  <Text className="text-slate-800 font-semibold text-base">
                    Share as PDF
                  </Text>
                  <Text className="text-slate-400 text-xs">
                    Share all pages as PDF
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ── Rename Modal ── */}
      <Modal
        visible={renameModal}
        transparent
        animationType="fade"
        onRequestClose={() => setRenameModal(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-white rounded-3xl p-6 w-full">
            <Text className="text-xl font-bold text-slate-900 mb-4">
              Rename Document
            </Text>
            <TextInput
              value={editTitle}
              onChangeText={setEditTitle}
              className="border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-base mb-5"
              placeholder="Enter document name"
              autoFocus
            />
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setRenameModal(false)}
                className="flex-1 border border-slate-200 py-3 rounded-full items-center"
              >
                <Text className="text-slate-600 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRename}
                className="flex-1 bg-indigo-600 py-3 rounded-full items-center"
              >
                <Text className="text-white font-bold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
