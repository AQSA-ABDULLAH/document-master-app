import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ArrowDownCircle,
  ChevronRight,
  FileText,
  Globe,
  Mail,
  RotateCcw,
  ShieldCheck,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import InfoModal from "./InfoModal";
import LanguageModal from "./LanguageModal";
import legalContent from "./legalContent.json";

// ── Constants ──────────────────────────────────────────────────────────────
const APP_VERSION = "1.0.1";
const STORE_URL_ANDROID =
  "https://play.google.com/store/apps/details?id=com.yourapp";

// ── Setting Row Component ──────────────────────────────────────────────────
const SettingItem = ({
  icon,
  label,
  value,
  isLast = false,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  isLast?: boolean;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    className="flex-row items-center py-4 px-5"
  >
    <View className="mr-4">{icon}</View>
    <View
      className={`flex-1 flex-row items-center justify-between ${
        !isLast ? "border-b border-slate-100 pb-4 -mb-4" : ""
      }`}
    >
      <Text className="text-lg text-slate-700 font-medium">{label}</Text>
      <View className="flex-row items-center">
        {value && (
          <Text className="text-emerald-400 font-semibold mr-2">{value}</Text>
        )}
        <ChevronRight size={20} color="#CBD5E1" />
      </View>
    </View>
  </TouchableOpacity>
);

// ── Types ──────────────────────────────────────────────────────────────────
type LegalContent = typeof legalContent.privacyPolicy;

// ── Main Screen ────────────────────────────────────────────────────────────
export default function SettingsScreen() {
  const [selectedLang, setSelectedLang] = useState("English");
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState<{
    visible: boolean;
    data: LegalContent | null;
  }>({
    visible: false,
    data: null,
  });

  // 1. Language
  const handleLanguageSelect = async (lang: {
    code: string;
    label: string;
  }) => {
    setSelectedLang(lang.label);
    setLangModalVisible(false);
    try {
      await AsyncStorage.setItem("appLanguage", lang.code);
    } catch (e) {
      console.error("Failed to save language:", e);
    }
  };

  // 2. Feedback → Play Store
  const handleSendFeedback = () => {
    Linking.openURL(STORE_URL_ANDROID).catch(() =>
      Alert.alert("Error", "Could not open Play Store."),
    );
  };

  // 3. Share App
  const handleShareApp = async () => {
    try {
      await Share.share({
        message: `Check out Document Master - the best document scanner app!\n\nDownload here: ${STORE_URL_ANDROID}`,
        title: "Document Master",
      });
    } catch {
      Alert.alert("Error", "Could not share the app.");
    }
  };

  // 4. Privacy Policy → in-app modal from JSON
  const handlePrivacyPolicy = () => {
    setInfoModal({ visible: true, data: legalContent.privacyPolicy });
  };

  // 5. Terms of Use → in-app modal from JSON
  const handleTermsOfUse = () => {
    setInfoModal({ visible: true, data: legalContent.termsOfUse });
  };

  // 6. App Version → check update on Play Store
  const handleAppVersion = () => {
    Alert.alert(
      "App Version",
      `Current Version: ${APP_VERSION}\n\nWould you like to check for updates?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Check Update",
          onPress: () =>
            Linking.openURL(STORE_URL_ANDROID).catch(() =>
              Alert.alert("Error", "Could not open Play Store."),
            ),
        },
      ],
    );
  };

  return (
    <>
      <ScrollView className="flex-1">
        <View className="pb-8">
          <Text className="text-4xl font-bold text-slate-900">Settings</Text>
        </View>

        <View className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100">
          <SettingItem
            label="Languages"
            value={selectedLang}
            icon={<Globe size={24} color="#1E293B" />}
            onPress={() => setLangModalVisible(true)}
          />
          <SettingItem
            label="Send Feedback"
            icon={<Mail size={24} color="#1E293B" />}
            onPress={handleSendFeedback}
          />
          <SettingItem
            label="Share App"
            icon={<RotateCcw size={24} color="#1E293B" />}
            onPress={handleShareApp}
          />
          <SettingItem
            label="Privacy Policy"
            icon={<ShieldCheck size={24} color="#1E293B" />}
            onPress={handlePrivacyPolicy}
          />
          <SettingItem
            label="Term of Use"
            icon={<FileText size={24} color="#1E293B" />}
            onPress={handleTermsOfUse}
          />
          <SettingItem
            label="App Version"
            value={APP_VERSION}
            isLast={true}
            icon={<ArrowDownCircle size={24} color="#1E293B" />}
            onPress={handleAppVersion}
          />
        </View>
      </ScrollView>

      {/* Modals */}
      <LanguageModal
        visible={langModalVisible}
        selectedLang={selectedLang}
        onSelect={handleLanguageSelect}
        onClose={() => setLangModalVisible(false)}
      />

      <InfoModal
        visible={infoModal.visible}
        data={infoModal.data}
        onClose={() => setInfoModal({ visible: false, data: null })}
      />
    </>
  );
}
