import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as Device from "expo-device";
import { Platform } from "react-native";
import uuid from "react-native-uuid";

const API_URL = "http://localhost:5000/api";

// ── Helper: get or generate visitorId ─────────────────────────────────────
const getOrGenerateVisitorId = async (): Promise<string> => {
  let visitorId = await AsyncStorage.getItem("visitor_id");
  if (!visitorId) {
    visitorId = uuid.v4() as string;
    await AsyncStorage.setItem("visitor_id", visitorId);
  }
  return visitorId;
};

// ── Thunk: Fetch visitor from backend ─────────────────────────────────────
export const fetchVisitor = createAsyncThunk(
  "visitor/fetch",
  async (_, thunkAPI) => {
    try {
      const visitorId = await getOrGenerateVisitorId();

      const response = await fetch(`${API_URL}/visitor/register`, {
        method: "POST",
        headers: {
          "x-visitor-id": visitorId,
          "x-platform": Platform.OS,
          "x-app-version": "1.0.1",
          "x-device-model": Device.modelName ?? "unknown",
        },
      });

      const data = await response.json();

      if (!data.success) {
        return thunkAPI.rejectWithValue(data.message);
      }

      // Save full visitor data to AsyncStorage
      await AsyncStorage.setItem("visitor_data", JSON.stringify(data.visitor));

      console.log(
        data.isNew
          ? `🆕 New visitor registered: ${data.visitor.visitorId}`
          : `👤 Returning visitor: ${data.visitor.visitorId}`,
      );

      return data.visitor;
    } catch (err: any) {
      console.error("❌ Visitor fetch error:", err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// ── Visitor Slice ──────────────────────────────────────────────────────────
const visitorSlice = createSlice({
  name: "visitor",
  initialState: {
    status: "idle" as "idle" | "loading" | "success" | "error",
    data: null as any,
    isNew: false,
  },
  reducers: {
    // Load visitor from AsyncStorage (returning user)
    loadVisitor: (state, action) => {
      state.data = action.payload;
      state.status = "success";
      state.isNew = false;
    },
    clearVisitor: (state) => {
      state.data = null;
      state.status = "idle";
      state.isNew = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVisitor.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchVisitor.fulfilled, (state, action) => {
        state.status = "success";
        state.data = action.payload;
        state.isNew = action.payload?.isNew || false;
      })
      .addCase(fetchVisitor.rejected, (state) => {
        state.status = "error";
        state.data = null;
      });
  },
});

export const { loadVisitor, clearVisitor } = visitorSlice.actions;
export default visitorSlice.reducer;
