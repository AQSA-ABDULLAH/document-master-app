// store/features/visitorSlice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getVisitorProfileAPI,
  registerVisitorAPI,
} from "../../lib/visitorHelper";

interface VisitorState {
  status: "idle" | "loading" | "success" | "error";
  data: any;
  isNew: boolean;
}

const initialState: VisitorState = {
  status: "idle",
  data: null,
  isNew: false,
};

// ── Async Thunk for Fetching / Initializing Visitor ───────────────────────
export const fetchVisitor = createAsyncThunk(
  "visitor/fetchVisitor",
  async (_, { rejectWithValue }) => {
    try {
      // 1. Attempt to get the existing profile
      const response = await getVisitorProfileAPI();
      return response.data;
    } catch (error: any) {
      // 2. If it fails because they don't exist yet, register them
      // Note: You might want to adjust this catch block depending on your backend error codes
      try {
        const registerResponse = await registerVisitorAPI();
        return registerResponse.data;
      } catch (regError: any) {
        return rejectWithValue(
          regError.message || "Failed to handle visitor lifecycle",
        );
      }
    }
  },
);

// ── Visitor Slice ──────────────────────────────────────────────────────────
const visitorSlice = createSlice({
  name: "visitor",
  initialState,
  reducers: {
    // Manually load visitor from local storage on app launch if desired
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
