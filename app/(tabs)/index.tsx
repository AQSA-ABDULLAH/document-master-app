import HomeScreen from "@/components/home/HomeScreen";
import React from "react";
import { ScrollView, View } from "react-native";

export default function Home() {
  return (
    <View className="bg-white h-screen mt-10 py-6 px-5">
      <ScrollView showsVerticalScrollIndicator={false}>
        <HomeScreen />
      </ScrollView>
    </View>
  );
}
