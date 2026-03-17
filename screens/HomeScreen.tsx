import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// Types for our Quick Action Cards
interface QuickActionProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({
  title,
  icon,
  color,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="w-[47%] mb-4 p-4 rounded-3xl bg-slate-800/50 border border-slate-700"
    style={{
      shadowColor: color,
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 5,
    }}
  >
    <View
      className="w-12 h-12 rounded-2xl items-center justify-center mb-3"
      style={{ backgroundColor: color }}
    >
      <Ionicons name={icon} size={24} color="white" />
    </View>
    <Text className="text-white font-semibold text-base">{title}</Text>
    <Text className="text-slate-400 text-xs mt-1">Tap to start</Text>
  </TouchableOpacity>
);

const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#0F172A]">
      <ScrollView className="flex-1 px-5 pt-4">
        {/* Header Section */}
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text className="text-slate-400 text-sm font-medium">
              Welcome Back,
            </Text>
            <Text className="text-white text-2xl font-bold">
              Document Master
            </Text>
          </View>
          <TouchableOpacity className="bg-indigo-600/20 p-2 rounded-full border border-indigo-500/30">
            <Ionicons name="person" size={24} color="#6366F1" />
          </TouchableOpacity>
        </View>

        {/* Quick Actions Grid */}
        <Text className="text-white text-lg font-bold mb-4 ml-1">
          Quick Tools
        </Text>
        <View className="flex-row flex-wrap justify-between">
          <QuickAction
            title="Image to PDF"
            icon="images-outline"
            color="#4F46E5" // Indigo
            onPress={() => console.log("Image to PDF")}
          />
          <QuickAction
            title="ID Scanner"
            icon="card-outline"
            color="#7C3AED" // Purple
            onPress={() => console.log("ID Scanner")}
          />
          <QuickAction
            title="Compressor"
            icon="resize-outline"
            color="#C026D3" // Fuchsia
            onPress={() => console.log("Compressor")}
          />
          <QuickAction
            title="Cloud Sync"
            icon="cloud-upload-outline"
            color="#2563EB" // Blue
            onPress={() => console.log("Cloud")}
          />
        </View>

        {/* Recent Activity Placeholder */}
        <View className="mt-6 mb-10">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-lg font-bold">Recent Files</Text>
            <TouchableOpacity>
              <Text className="text-indigo-400">View All</Text>
            </TouchableOpacity>
          </View>
          <View className="bg-slate-800/40 p-10 rounded-3xl border border-dashed border-slate-700 items-center justify-center">
            <Ionicons name="folder-open-outline" size={40} color="#475569" />
            <Text className="text-slate-500 mt-2">No recent files found</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
