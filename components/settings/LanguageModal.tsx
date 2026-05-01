import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

export const LANGUAGES = [
  { code: "en", label: "English" },
  //   { code: "ur", label: "Urdu" },
  //   { code: "ar", label: "Arabic" },
  //   { code: "fr", label: "French" },
  //   { code: "de", label: "German" },
  //   { code: "es", label: "Spanish" },
  //   { code: "zh", label: "Chinese" },
  //   { code: "hi", label: "Hindi" },
];

type Props = {
  visible: boolean;
  selectedLang: string;
  onSelect: (lang: { code: string; label: string }) => void;
  onClose: () => void;
};

export default function LanguageModal({
  visible,
  selectedLang,
  onSelect,
  onClose,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 bg-black/50 justify-end"
      >
        <TouchableOpacity activeOpacity={1}>
          <View className="bg-white rounded-t-[32px] px-5 pt-4 pb-10">
            {/* Drag Handle */}
            <View className="w-12 h-1.5 bg-slate-200 rounded-full self-center mb-5" />

            <Text className="text-xl font-bold text-slate-900 mb-4">
              Select Language
            </Text>

            {LANGUAGES.map((lang, index) => (
              <TouchableOpacity
                key={lang.code}
                onPress={() => onSelect(lang)}
                className={`flex-row items-center justify-between py-4 ${
                  index < LANGUAGES.length - 1
                    ? "border-b border-slate-100"
                    : ""
                }`}
              >
                <Text className="text-lg text-slate-700">{lang.label}</Text>
                {selectedLang === lang.label && (
                  <View className="w-5 h-5 rounded-full bg-emerald-500 items-center justify-center">
                    <Text className="text-white text-xs font-bold">✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
