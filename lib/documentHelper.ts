import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";

// ── Get visitor headers ────────────────────────────────────────────────────
const getHeaders = async (): Promise<Record<string, string>> => {
  const visitorId = await AsyncStorage.getItem("visitor_id");
  return {
    "x-visitor-id": visitorId ?? "",
  };
};

// ── Upload images to backend ───────────────────────────────────────────────
export const uploadDocumentAPI = async ({
  imageUris,
  title,
  mode,
  filters,
}: {
  imageUris: string[];
  title: string;
  mode: "single" | "batch";
  filters: string[];
}) => {
  const headers = await getHeaders();
  const formData = new FormData();

  // Append each image
  imageUris.forEach((uri, index) => {
    const filename = `page_${index + 1}.jpg`;
    formData.append("images", {
      uri,
      name: filename,
      type: "image/jpeg",
    } as any);
  });

  formData.append("title", title);
  formData.append("mode", mode);
  formData.append("filters", JSON.stringify(filters));

  const response = await fetch(`${API_URL}/documents/upload`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  });

  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data;
};

// ── Get all documents ──────────────────────────────────────────────────────
export const getDocumentsAPI = async (page = 1, limit = 20) => {
  const headers = await getHeaders();
  const response = await fetch(
    `${API_URL}/documents?page=${page}&limit=${limit}`,
    { headers },
  );
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data;
};

// ── Get single document ────────────────────────────────────────────────────
export const getDocumentByIdAPI = async (id: string) => {
  const headers = await getHeaders();
  const response = await fetch(`${API_URL}/documents/${id}`, { headers });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data;
};

// ── Rename document ────────────────────────────────────────────────────────
export const renameDocumentAPI = async (id: string, title: string) => {
  const headers = await getHeaders();
  const response = await fetch(`${API_URL}/documents/${id}/title`, {
    method: "PATCH",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data;
};

// ── Delete document ────────────────────────────────────────────────────────
export const deleteDocumentAPI = async (id: string) => {
  const headers = await getHeaders();
  const response = await fetch(`${API_URL}/documents/${id}`, {
    method: "DELETE",
    headers,
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data;
};
