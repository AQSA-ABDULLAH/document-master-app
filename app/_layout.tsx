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

import Loading from "@/components/startup/Loading";
import VisitorUser from "@/components/startup/VisitorUser";
import { useColorScheme } from "@/hooks/use-color-scheme";
import store from "@/store";

import "../global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout(): React.JSX.Element {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <VisitorUser loading={loading} setLoading={setLoading} />

        <Loading loading={loading} setLoading={setLoading} />

        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{
              presentation: "modal",
              title: "Modal",
            }}
          />
        </Stack>

        <StatusBar style="auto" />
      </ThemeProvider>
    </Provider>
  );
}
