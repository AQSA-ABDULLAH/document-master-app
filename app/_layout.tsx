import AppLoading from "@/components/startup/Loading";
import VisitorUser from "@/components/startup/VisitorUser";
import { useColorScheme } from "@/hooks/use-color-scheme";
import store from "@/store";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import "react-native-reanimated";
import { Provider } from "react-redux";
import "../global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(true);

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        {/* Visitor init — runs on every app launch */}
        <VisitorUser setLoading={setLoading} />

        {/* Full screen loading spinner */}
        <AppLoading loading={loading} />

        {/* Main app — always rendered but hidden behind loading */}
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>

        <StatusBar style="auto" />
      </ThemeProvider>
    </Provider>
  );
}
