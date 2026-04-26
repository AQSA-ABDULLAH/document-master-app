import ToolsScreen from "@/components/tools/ToolsScreen";
import React from "react";
import { ScrollView, View } from "react-native";

export default function Tools() {
  return (
    <View className="bg-white h-screen mt-12 py-6 px-5">
      <ScrollView showsVerticalScrollIndicator={false}>
        <ToolsScreen />
      </ScrollView>
    </View>
  );
}
