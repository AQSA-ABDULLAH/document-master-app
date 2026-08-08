import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface AppLoadingProps {
  loading: boolean;
}

const AppLoading: React.FC<AppLoadingProps> = ({ loading }) => {
  if (!loading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6366F1" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748B",
  },
});

export default AppLoading;
