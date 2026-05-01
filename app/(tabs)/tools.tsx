import ToolsScreen from "@/components/tools/ToolsScreen";
import React from "react";
import { ScrollView, View } from "react-native";

export default function Tools() {
  return (
    <View className="bg-white mt-10 px-5">
      <ScrollView showsVerticalScrollIndicator={false}>
        <ToolsScreen />
      </ScrollView>
    </View>
  );
}
