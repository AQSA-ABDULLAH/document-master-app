import HomeScreen from "@/components/home/HomeScreen";
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView className="bg-white h-screen">
      <ScrollView showsVerticalScrollIndicator={false}>
        <HomeScreen />
      </ScrollView>
    </SafeAreaView>
  );
}
