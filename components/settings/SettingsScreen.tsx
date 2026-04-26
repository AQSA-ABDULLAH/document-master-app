import {
    ArrowDownCircle,
    ChevronRight,
    FileText,
    Globe,
    Mail,
    RotateCcw,
    ShieldCheck,
} from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// Reusable Settings Row Component
const SettingItem = ({
  icon,
  label,
  value,
  isLast = false,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  isLast?: boolean;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    className="flex-row items-center py-4 px-5"
  >
    <View className="mr-4">{icon}</View>

    <View
      className={`flex-1 flex-row items-center justify-between ${
        !isLast ? "border-b border-slate-100 pb-4 -mb-4" : ""
      }`}
    >
      <Text className="text-lg text-slate-700 font-medium">{label}</Text>

      <View className="flex-row items-center">
        {value && (
          <Text className="text-emerald-400 font-semibold mr-2">{value}</Text>
        )}
        <ChevronRight size={20} color="#CBD5E1" />
      </View>
    </View>
  </TouchableOpacity>
);

export default function SettingsScreen() {
  return (
    <ScrollView className="flex-1">
      <View className="pb-6">
        <Text className="text-4xl font-bold text-slate-900">Settings</Text>
      </View>

      {/* Main Container */}
      <View className=" bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100">
        <SettingItem
          label="Languages"
          value="English"
          icon={<Globe size={24} color="#1E293B" />}
        />

        <SettingItem
          label="Send Feedback"
          icon={<Mail size={24} color="#1E293B" />}
        />

        <SettingItem
          label="Share App"
          icon={<RotateCcw size={24} color="#1E293B" />}
        />

        <SettingItem
          label="Privacy Policy"
          icon={<ShieldCheck size={24} color="#1E293B" />}
        />

        <SettingItem
          label="Term of Use"
          icon={<FileText size={24} color="#1E293B" />}
        />

        <SettingItem
          label="App Version"
          value="1.0.1"
          isLast={true}
          icon={<ArrowDownCircle size={24} color="#1E293B" />}
        />
      </View>
    </ScrollView>
  );
}
