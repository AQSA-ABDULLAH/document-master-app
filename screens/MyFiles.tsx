import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Reusable Component for File List Item
const FileItem = ({
  title,
  date,
  size,
  type,
}: {
  title: string;
  date: string;
  size?: string;
  type: "pdf" | "img";
}) => (
  <TouchableOpacity className="flex-row items-center justify-between mb-4 bg-slate-800/30 p-3 rounded-2xl border border-slate-700/50">
    <View className="flex-row items-center flex-1">
      {/* Thumbnail Placeholder */}
      <View className="w-14 h-14 bg-slate-700 rounded-lg items-center justify-center overflow-hidden">
        {type === "pdf" ? (
          <MaterialCommunityIcons
            name="file-pdf-box"
            size={32}
            color="#EF4444"
          />
        ) : (
          <Ionicons name="image" size={30} color="#6366F1" />
        )}
      </View>

      <View className="ml-4 flex-1">
        <Text className="text-white font-semibold text-base" numberOfLines={1}>
          {title}
        </Text>
        <Text className="text-slate-400 text-xs mt-1">
          {date} {size ? ` • ${size}` : ""}
        </Text>
      </View>
    </View>

    <TouchableOpacity className="p-2">
      <Ionicons name="ellipsis-horizontal" size={20} color="#94A3B8" />
    </TouchableOpacity>
  </TouchableOpacity>
);

export default function MyFiles() {
  return (
    <SafeAreaView className="flex-1 bg-[#0F172A] mt-16">
      <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="flex-row justify-between items-center py-4">
          <Text className="text-white text-2xl font-bold">My files</Text>
          <TouchableOpacity>
            <Ionicons name="search-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* 1. Import Section Cards (Ref Image Top) */}
        <View className="flex-row justify-between mt-2">
          <TouchableOpacity className="bg-slate-800/60 w-[48%] p-6 rounded-3xl items-center border border-slate-700">
            <View className="bg-indigo-500/20 p-3 rounded-2xl mb-3">
              <Ionicons name="cloud-upload" size={28} color="#6366F1" />
            </View>
            <Text className="text-white font-medium text-center">
              Import Files
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-slate-800/60 w-[48%] p-6 rounded-3xl items-center border border-slate-700">
            <View className="bg-emerald-500/20 p-3 rounded-2xl mb-3">
              <Ionicons name="images" size={28} color="#10B981" />
            </View>
            <Text className="text-white font-medium text-center">
              Import Images
            </Text>
          </TouchableOpacity>
        </View>

        {/* 2. File List Filter Section */}
        <View className="flex-row items-center mt-8 mb-4">
          <Text className="text-white text-lg font-bold">All</Text>
          <Text className="text-slate-500 text-lg font-bold ml-1">(2)</Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color="#94A3B8"
            className="ml-1"
          />
        </View>

        {/* 3. List of Files (Based on Ref Image List) */}
        <View className="pb-10">
          <FileItem
            title="ScanOn 19032026025655"
            date="19/03/2026"
            type="img"
          />
          <FileItem
            title="MOAZ CV"
            date="19/03/2026"
            size="418.9 KB"
            type="pdf"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
