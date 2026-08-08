// lib/visitorHelper.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import API_URL from "./config";

const log = (...args: unknown[]): void => {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
};

const logError = (...args: unknown[]): void => {
  if (process.env.NODE_ENV === "development") {
    console.error(...args);
  }
};

interface Visitor {
  visitor_id: string;
  country?: string;
  city?: string;
}

const getVisitor = async (): Promise<Visitor> => {
  let visitor_id = await AsyncStorage.getItem("visitor_id");

  if (!visitor_id) {
    visitor_id = uuid.v4() as string;
    await AsyncStorage.setItem("visitor_id", visitor_id);
  }

  try {
    const { data } = await API_URL.get<Visitor>(
      `/visitors?visitor_id=${visitor_id}`,
    );

    return data;
  } catch (e) {
    if (e instanceof Error) {
      logError("Error while fetching visitor:", e.message);
    }
    throw e;
  }
};

export { getVisitor };

