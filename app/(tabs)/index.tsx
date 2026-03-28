// app/(tabs)/index.tsx

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ToolIcon = ({
  icon,
  label,
  color,
  bgColor,
}: {
  icon: any;
  label: string;
  color: string;
  bgColor: string;
}) => (
  <TouchableOpacity className="items-center justify-center w-[22%] mb-5">
    <View
      className={`w-14 h-14 rounded-2xl items-center justify-center ${bgColor}`}
    >
      <MaterialCommunityIcons name={icon} size={28} color={color} />
    </View>
    <Text
      className="text-[11px] mt-2 font-medium text-center"
      numberOfLines={1}
    >
      {label}
    </Text>
  </TouchableOpacity>
);


export default function HomeScreen() {

  const router = useRouter();
  return (
    <SafeAreaView className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 1. Header & Search Bar */}
        <View className="px-5 pt-4">
          <View className="flex-row justify-between items-center mb-6">
            <Text className=" text-2xl font-bold italic">Document Master</Text>
            <TouchableOpacity>
              {/* <Ionicons name="crown" size={24} color="#FBBF24" /> */}
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center px-4 py-3 rounded-2xl border border-slate-700">
            <Ionicons name="search-outline" size={20} color="#94A3B8" />
            <TextInput
              placeholder="Search documents and tools..."
              placeholderTextColor="#64748B"
              className="ml-3 flex-1"
            />
          </View>
        </View>

        {/* 2. Quick Tools Grid (Based on Ref 1 & 2) */}
        <View className="px-5 mt-8 flex-row flex-wrap justify-between">
          <ToolIcon
            icon="auto-fix"
            label="Smart Scan"
            color="#6366F1"
            bgColor="bg-indigo-500/20"
          />
          <ToolIcon
            icon="image-multiple"
            label="Images"
            color="#A855F7"
            bgColor="bg-purple-500/20"
          />
          <ToolIcon
            icon="file-pdf-box"
            label="PDF Tools"
            color="#EF4444"
            bgColor="bg-red-500/20"
          />
          <ToolIcon
            icon="file-word"
            label="PDF to Word"
            color="#3B82F6"
            bgColor="bg-blue-500/20"
          />
          <ToolIcon
            icon="card-account-details"
            label="ID Card"
            color="#10B981"
            bgColor="bg-emerald-500/20"
          />
          <ToolIcon
            icon="passport"
            label="Passport"
            color="#F59E0B"
            bgColor="bg-amber-500/20"
          />
          <ToolIcon
            icon="text-recognition"
            label="OCR Text"
            color="#EC4899"
            bgColor="bg-pink-500/20"
          />
          <ToolIcon
            icon="dots-grid"
            label="More"
            color="#94A3B8"
            bgColor="bg-slate-700/30"
          />
        </View>

        {/* 3. Recent Section (Based on Ref 3) */}
        <View className="px-5 mt-6 pb-20">
          <View className="flex-row justify-between items-center mb-10">
            <Text className=" text-lg font-bold">Recent Files</Text>
            <TouchableOpacity>
              <Text className="text-indigo-400">View All</Text>
            </TouchableOpacity>
          </View>

          {/* Empty State Illustration */}
          <View className="items-center justify-center py-10">
            <View className="bg-indigo-500/10 p-8 rounded-full mb-4">
              <Ionicons
                name="document-text-outline"
                size={80}
                color="#4F46E5"
              />
            </View>
            <Text className="text-lg font-semibold">No files yet</Text>
            <Text className="text-slate-400 text-center mt-2 px-10">
              Start scanning documents or import images to see your files here.
            </Text>

            <TouchableOpacity className="mt-6 border border-indigo-500 px-8 py-3 rounded-full">
              <Text className="text-indigo-400 font-bold">Scan Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* 4. Floating Action Button (FAB) - Camera */}
      <TouchableOpacity
        onPress={() => router.push("/camera")}
        style={{ elevation: 10 }}
        className="absolute bottom-6 right-6 w-16 h-16 bg-indigo-600 rounded-full items-center justify-center shadow-lg shadow-indigo-500"
      >
        <Ionicons name="camera" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
