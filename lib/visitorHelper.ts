// lib/visitorHelper.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import { Platform } from "react-native";
import uuid from "react-native-uuid";
import { API_URL } from "./config"; // ◄ Fixed: Added missing import

// ── Get existing or generate new visitorId ─────────────────────────────────
export const getOrGenerateVisitorId = async (): Promise<string> => {
  let visitorId = await AsyncStorage.getItem("visitor_id");
  if (!visitorId) {
    visitorId = uuid.v4() as string;
    await AsyncStorage.setItem("visitor_id", visitorId);
  }
  return visitorId;
};

// ── Build common visitor headers ───────────────────────────────────────────
export const getVisitorHeaders = async (): Promise<Record<string, string>> => {
  const visitorId = await getOrGenerateVisitorId();
  return {
    "x-visitor-id": visitorId,
    "x-platform": Platform.OS,
    "x-app-version": "1.0.1",
    "x-device-model": Device.modelName ?? "unknown",
  };
};

// ── API: Register new visitor ──────────────────────────────────────────────
export const registerVisitorAPI = async () => {
  const headers = await getVisitorHeaders();

  const response = await fetch(`${API_URL}/visitor/register`, {
    method: "POST",
    headers,
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to register visitor");
  }
  return data;
};

// ── API: Get visitor profile ───────────────────────────────────────────────
export const getVisitorProfileAPI = async () => {
  const headers = await getVisitorHeaders();

  const response = await fetch(`${API_URL}/visitor/profile`, {
    method: "GET",
    headers,
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to get visitor profile");
  }
  return data;
};

// ── API: Update visitor device info ───────────────────────────────────────
export const updateVisitorAPI = async (deviceInfo: {
  platform?: string;
  version?: string;
  deviceModel?: string;
}) => {
  const headers = await getVisitorHeaders();

  const response = await fetch(`${API_URL}/visitor/profile`, {
    method: "PATCH",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ deviceInfo }),
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to update visitor");
  }
  return data;
};

// ── API: Deactivate visitor ────────────────────────────────────────────────
export const deactivateVisitorAPI = async () => {
  const headers = await getVisitorHeaders();

  const response = await fetch(`${API_URL}/visitor/profile/deactivate`, {
    method: "PATCH",
    headers,
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to deactivate visitor");
  }
  return data;
};

// ── API: Delete visitor ────────────────────────────────────────────────────
export const deleteVisitorAPI = async () => {
  const headers = await getVisitorHeaders();

  const response = await fetch(`${API_URL}/visitor/profile`, {
    method: "DELETE",
    headers,
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to delete visitor");
  }
  return data;
};
