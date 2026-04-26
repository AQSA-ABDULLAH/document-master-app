import MyFiles from "@/components/my-files/MyFiles";
import React from "react";
import { ScrollView, View } from "react-native";

export default function Files() {
  return (
    <View className="bg-white h-screen mt-12 py-6 px-5">
      <ScrollView showsVerticalScrollIndicator={false}>
        <MyFiles />
      </ScrollView>
    </View>
  );
}
