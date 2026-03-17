import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Text, View } from "react-native";
import { TabParamList } from "./types"; // Jo humne pichle step mein banaye thay

// Temporary Screens (Baad mein hum inke liye alag files banayenge)
const HomeScreen = () => (
  <View className="flex-1 bg-[#0F172A] items-center justify-center">
    <Text className="text-white text-lg font-bold">
      Document Master Dashboard
    </Text>
  </View>
);

const ScannerScreen = () => (
  <View className="flex-1 bg-[#0F172A] items-center justify-center">
    <Text className="text-white">Scanner / ID Card Scan</Text>
  </View>
);

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: "#0F172A", // Deep Black/Dark Slate
          borderTopWidth: 0,
          height: 65,
          paddingBottom: 10,
          paddingTop: 5,
          elevation: 10, // Shadow for Android
          shadowColor: "#4F46E5", // Indigo shadow for iOS
        },
        tabBarActiveTintColor: "#6366F1", // Indigo-500
        tabBarInactiveTintColor: "#64748B", // Slate-500
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "grid" : "grid-outline";
          } else if (route.name === "Scanner") {
            iconName = focused ? "scan" : "scan-outline";
          } else if (route.name === "Converter") {
            iconName = focused ? "sync" : "sync-outline";
          } else if (route.name === "History") {
            iconName = focused ? "time" : "time-outline";
          } else {
            iconName = "help-circle-outline";
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Scanner" component={ScannerScreen} />
      <Tab.Screen name="Converter" component={HomeScreen} />
      <Tab.Screen name="History" component={HomeScreen} />
    </Tab.Navigator>
  );
};
