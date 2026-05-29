import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

type Props = {
  loading: boolean;
};

export default function AppLoading({ loading }: Props) {
  if (!loading) return null;

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
    >
      <ActivityIndicator size="large" color="#6366F1" />
      <Text style={{ marginTop: 12, color: "#64748B", fontSize: 14 }}>
        Loading...
      </Text>
    </View>
  );
}
