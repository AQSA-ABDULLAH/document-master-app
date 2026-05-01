import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

type Section = {
  heading: string;
  body: string;
};

type ContentData = {
  title: string;
  lastUpdated: string;
  sections: Section[];
};

type Props = {
  visible: boolean;
  data: ContentData | null;
  onClose: () => void;
};

export default function InfoModal({ visible, data, onClose }: Props) {
  if (!data) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View
          className="bg-white rounded-t-[32px] px-5 pt-4"
          style={{ maxHeight: "85%" }}
        >
          {/* Drag Handle */}
          <View className="w-12 h-1.5 bg-slate-200 rounded-full self-center mb-4" />

          {/* Header */}
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-xl font-bold text-slate-900">
              {data.title}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 bg-slate-100 rounded-full items-center justify-center"
            >
              <Text className="text-slate-500 font-bold">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Last Updated */}
          <Text className="text-xs text-slate-400 mb-4">
            Last updated: {data.lastUpdated}
          </Text>

          {/* Scrollable Sections */}
          <ScrollView showsVerticalScrollIndicator={false} className="mb-8">
            {data.sections.map((section, index) => (
              <View key={index} className="mb-5">
                <Text className="text-sm font-bold text-slate-800 mb-1">
                  {section.heading}
                </Text>
                <Text className="text-sm text-slate-500 leading-6">
                  {section.body}
                </Text>
              </View>
            ))}
            {/* Bottom padding for last item */}
            <View className="h-6" />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
