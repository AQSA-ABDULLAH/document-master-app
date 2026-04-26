import {
    FileImage,
    FileText,
    FileType,
    FileUp,
    IdCard,
    ImageUp,
    Lock,
    PenTool,
    ScanLine,
    ScanQrCode,
    ScanText,
} from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// Individual Tool Card Component
const ToolCard = ({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="w-[31%] bg-slate-100 items-center justify-center py-6 rounded-2xl mb-4 active:bg-slate-200"
  >
    <View className="mb-2">{icon}</View>
    <Text className="text-[12px] font-semibold text-center px-1">{label}</Text>
  </TouchableOpacity>
);

// Section Wrapper
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View className="mb-6">
    <Text className="text-lg font-bold text-slate-900 mb-4">{title}</Text>
    <View className="flex-row flex-wrap gap-[12px]">{children}</View>
  </View>
);

export default function ToolsScreen() {
  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-3xl font-bold text-slate-900 mb-6">Tools</Text>

      {/* SCAN SECTION */}
      <Section title="Scan">
        <ToolCard
          label="Scan Document"
          icon={<ScanLine size={28} color="#6366F1" />}
        />
        <ToolCard
          label="PDF Tools"
          icon={<FileText size={28} color="#EF4444" />}
        />
        <ToolCard label="ID Card" icon={<IdCard size={32} color="#10B981" />} />
        <ToolCard
          label="Scan Qr Code"
          icon={<ScanQrCode size={28} color="#6C3BAA" />}
        />
        {/*<ToolCard
          label="Passport"
          icon={<FileType size={28} color="#8B5CF6" />}
        />
        <ToolCard
          label="Extract Text"
          icon={<FileJson size={28} color="#F59E0B" />}
        /> */}
      </Section>

      {/* IMPORT SECTION */}
      <Section title="Import">
        <ToolCard
          label="Import Images"
          icon={<ImageUp size={28} color="#A855F7" />}
        />
        <ToolCard
          label="Import Files"
          icon={<FileUp size={28} color="#06B6D4" />}
        />
      </Section>

      {/* CONVERT SECTION */}
      <Section title="Convert from">
        <ToolCard
          label="PDF To Word"
          icon={<FileType size={28} color="#3B82F6" />}
        />

        <ToolCard
          label="Word To PDF"
          icon={<ScanText size={28} color="#EC4899" />}
        />

        <ToolCard
          label="PDF To Images"
          icon={<FileImage size={28} color="#F59E0B" />}
        />
        {/* <ToolCard
          label="To Excel"
          icon={<FileSpreadsheet size={28} color="#10B981" />}
        />
        <ToolCard
          label="To PPT"
          icon={<FileCheck size={28} color="#F97316" />}
        /> */}
      </Section>

      {/* EDIT TOOLS SECTION */}
      <Section title="Edit Tools">
        <ToolCard label="Sign" icon={<PenTool size={28} color="#F59E0B" />} />
        <ToolCard
          label="Watermark"
          icon={<FileText size={28} color="#6366F1" />}
        />
        <ToolCard
          label="Set Password"
          icon={<Lock size={28} color="#8B5CF6" />}
        />
      </Section>
    </ScrollView>
  );
}
