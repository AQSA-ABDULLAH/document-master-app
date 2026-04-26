import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

// Lucide Icons
import {
  FileImage,
  FileText,
  FileType,
  FileUp,
  Grip,
  ImageUp,
  ScanText,
  WandSparkles,
} from "lucide-react-native";

// Reusable Tool Component
const ToolIcon = ({
  icon,
  label,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  bgColor: string;
}) => (
  <TouchableOpacity className="items-center justify-center w-[22%] mb-5 active:opacity-70">
    <View
      className={`w-14 h-14 rounded-2xl items-center justify-center ${bgColor}`}
    >
      {icon}
    </View>
    <Text
      className="text-[11px] mt-2 font-medium text-center text-slate-800"
      numberOfLines={1}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const router = useRouter();

  return (
    <>
      {/* Header & Search Bar */}
      <View>
        <View className="mb-6">
          <Text className="text-2xl font-bold italic text-slate-900">
            Document Master
          </Text>
        </View>

        <View className="flex-row items-center py-3 px-4 rounded-2xl border border-slate-300">
          <Ionicons name="search-outline" size={20} color="#64748B" />
          <TextInput
            placeholder="Search documents and tools..."
            placeholderTextColor="#94A3B8"
            className="ml-3 flex-1 text-slate-900"
          />
        </View>
      </View>

      {/* Tools Grid */}
      <View className="mt-8 flex-row flex-wrap justify-between">
        <ToolIcon
          icon={<WandSparkles size={28} color="#6366F1" />}
          label="Smart Scan"
          bgColor="bg-indigo-500/10"
        />

        <ToolIcon
          icon={<ImageUp size={28} color="#A855F7" />}
          label="Import Images"
          bgColor="bg-purple-500/10"
        />

        <ToolIcon
          icon={<FileText size={28} color="#EF4444" />}
          label="PDF Tools"
          bgColor="bg-red-500/10"
        />

        <ToolIcon
          icon={<FileUp size={28} color="#06B6D4" />}
          label="Import Files"
          bgColor="bg-cyan-500/10"
        />

        <ToolIcon
          icon={<FileType size={28} color="#3B82F6" />}
          label="PDF to Word"
          bgColor="bg-blue-500/10"
        />

        <ToolIcon
          icon={<FileImage size={28} color="#F59E0B" />}
          label="PDF to Image"
          bgColor="bg-amber-500/10"
        />

        <ToolIcon
          icon={<ScanText size={28} color="#EC4899" />}
          label="Word to PDF"
          bgColor="bg-pink-500/10"
        />

        <ToolIcon
          icon={<Grip size={28} color="#64748B" />}
          label="More Tools"
          bgColor="bg-slate-200"
        />
      </View>

      {/* Recent Files */}
      <View className="mt-6 pb-20">
        <View className="flex-row justify-between items-center mb-10">
          <Text className="text-lg font-bold text-slate-900">Recent Files</Text>
          <TouchableOpacity>
            <Text className="text-indigo-500 font-medium">View All</Text>
          </TouchableOpacity>
        </View>

        {/* Empty State */}
        <View className="items-center justify-center py-10">
          <View className=" mb-4">
            <Ionicons name="document-text-outline" size={80} color="#4F46E5" />
          </View>

          <Text className="text-lg font-semibold text-slate-900">
            No files yet
          </Text>

          <Text className="text-slate-500 text-center mt-2 px-10">
            Start scanning documents or import images to see your files here.
          </Text>
        </View>
      </View>

      {/* Floating Camera Button */}
      <TouchableOpacity
        onPress={() => router.push("/camera")}
        className="absolute bottom-5 right-0 w-16 h-16 bg-indigo-600 rounded-full items-center justify-center shadow-lg"
      >
        <Ionicons name="camera" size={30} color="white" />
      </TouchableOpacity>
    </>
  );
}
