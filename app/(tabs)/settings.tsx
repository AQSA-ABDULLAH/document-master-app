import { ThemedText } from "@/components/themed-text";
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  return (
    <SafeAreaView className="bg-white h-screen mt-12 py-6 px-5">
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedText type="title">Settings</ThemedText>
      </ScrollView>
    </SafeAreaView>
  );
}
