import { ThemedText } from "@/components/themed-text";
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Tools() {
  return (
    <SafeAreaView className="bg-white h-screen p-11">
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedText type="title">Tools</ThemedText>
      </ScrollView>
    </SafeAreaView>
  );
}
