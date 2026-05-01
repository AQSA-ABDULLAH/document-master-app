import SettingsScreen from "@/components/settings/SettingsScreen";
import React from "react";
import { ScrollView, View } from "react-native";

export default function Settings() {
  return (
    <View className="bg-white h-screen mt-10 py-6 px-5">
      <ScrollView showsVerticalScrollIndicator={false}>
        <SettingsScreen />
      </ScrollView>
    </View>
  );
}
