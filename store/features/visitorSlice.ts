// store/features/visitorSlice.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getUserLocation, getVisitor } from "../../lib/visitorHelper";

export interface VisitorData {
  visitor_id: string;
  ip?: string;
  city?: string;
  country?: string;
  [key: string]: any;
}

interface VisitorState {
  status: "idle" | "loading" | "success" | "error";
  data: VisitorData | null;
  isAllowed: boolean;
}

const initialState: VisitorState = {
  status: "idle",
  data: null,
  isAllowed: true,
};

export const fetchVisitor = createAsyncThunk<
  VisitorData,
  void,
  { rejectValue: string }
>("visitor/fetch", async (_, thunkAPI) => {
  try {
    const visitor = await getVisitor();

    await AsyncStorage.setItem(
      "visitor_data",
      JSON.stringify(visitor.visitor_data),
    );

    getUserLocation(visitor.visitor_data.visitor_id);

    return visitor.visitor_data;
  } catch (error) {
    const err = error as Error;

    if (err.message === "User denied Geolocation") {
      const visitor = await getVisitor();

      await AsyncStorage.setItem(
        "visitor_data",
        JSON.stringify(visitor.visitor_data),
      );

      return visitor.visitor_data;
    }

    return thunkAPI.rejectWithValue(err.message || "Unexpected error");
  }
});

const visitorSlice = createSlice({
  name: "visitor",
  initialState,
  reducers: {
    loadVisitor: (state, action: PayloadAction<VisitorData>) => {
      state.data = action.payload;
      state.status = "success";
    },

    clearVisitor: (state) => {
      state.data = null;
      state.status = "idle";
      state.isAllowed = true;
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
      })
      .addCase(fetchVisitor.rejected, (state, action) => {
        state.status = "error";

        if (action.payload) {
          try {
            const message = JSON.parse(action.payload);

            state.data = message.data ?? null;

            if (message.error === "Visitor not allowed") {
              state.isAllowed = false;
            }
          } catch {
            state.data = null;
            state.isAllowed = true;
          }
        } else {
          state.data = null;
          state.isAllowed = true;
        }
      });
  },
});

export const { loadVisitor, clearVisitor } = visitorSlice.actions;

export default visitorSlice.reducer;
