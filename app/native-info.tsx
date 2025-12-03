import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  NativeModules,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ✅ IMPORTANT — This MUST be outside the component
type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

const COLORS = {
  primary: "#1E88E5",
  secondary: "#0D47A1",
  background: "#0F1419",
  surface: "#1A1F2E",
  text: "#FFFFFF",
  textSecondary: "#B0BEC5",
  error: "#FF5252",
  success: "#4CAF50",
  border: "#2D3139",
  accent: "#00BCD4",
};

// ✅ THIS IS YOUR CUSTOM NATIVE MODULE FROM KOTLIN
const { DeviceInfoModule } = NativeModules;

interface NativeDeviceInfo {
  deviceModel: string;
  brand: string;
  manufacturer: string;
  product: string;
  platform: string;
  apiLevel: number;
  osVersion: string;
  locale: string;
  language: string;
  country: string;
  appVersion: string;
  appVersionCode: number;
  batteryLevel: number;
  isCharging: boolean;
  nativeTimestamp: string;
  customMessage: string;
}

export default function NativeInfoScreen() {
  const [nativeData, setNativeData] = useState<NativeDeviceInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [deviceSummary, setDeviceSummary] = useState<string>("");

  useEffect(() => {
    fetchNativeData();
    fetchFormattedDate();
    fetchDeviceSummary();
  }, []);

  const fetchNativeData = async () => {
    try {
      setLoading(true);
      
      // ✅ THIS CALLS YOUR CUSTOM KOTLIN MODULE
      const data: NativeDeviceInfo = await DeviceInfoModule.getDeviceInfo();
      setNativeData(data);
      
    } catch (error) {
      console.error("Error fetching native data from Kotlin module:", error);
      Alert.alert("Error", "Failed to fetch device information from Kotlin module");
    } finally {
      setLoading(false);
    }
  };

  const fetchFormattedDate = async () => {
    try {
      const timestamp = Date.now();
      // ✅ THIS CALLS YOUR CUSTOM KOTLIN DATE FORMATTING FUNCTION
      const result = await DeviceInfoModule.getFormattedDate(timestamp);
      setFormattedDate(result.formattedDate);
    } catch (error) {
      console.error("Error formatting date via Kotlin:", error);
    }
  };

  const fetchDeviceSummary = async () => {
    try {
      // ✅ THIS CALLS YOUR CUSTOM KOTLIN SUMMARY FUNCTION
      const summary = await DeviceInfoModule.getDeviceSummary();
      setDeviceSummary(summary);
    } catch (error) {
      console.error("Error getting device summary via Kotlin:", error);
    }
  };

  // Info Card component
  const InfoCard = ({
    title,
    value,
    icon,
    highlight = false,
  }: {
    title: string;
    value: string;
    icon: IconName;
    highlight?: boolean;
  }) => (
    <View style={[styles.infoCard, highlight && styles.highlightCard]}>
      <View style={styles.infoHeader}>
        <MaterialCommunityIcons name={icon} size={20} color={highlight ? COLORS.accent : COLORS.primary} />
        <Text style={[styles.infoTitle, highlight && styles.highlightText]}>{title}</Text>
      </View>
      <Text style={[styles.infoValue, highlight && styles.highlightValue]}>{value}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>
          Fetching data from custom Kotlin native module...
        </Text>
      </SafeAreaView>
    );
  }

  if (!nativeData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={48} color={COLORS.error} />
          <Text style={styles.errorText}>Failed to load data from Kotlin module</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchNativeData}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons name="android" size={40} color={COLORS.primary} />
          <Text style={styles.headerTitle}>Custom Kotlin Native Module</Text>
          <Text style={styles.headerSubtitle}>
            Data fetched from custom DeviceInfoModule.kt
          </Text>
          <View style={styles.verifiedBadge}>
            <MaterialCommunityIcons name="check-circle" size={16} color={COLORS.success} />
            <Text style={styles.verifiedText}>Custom Kotlin Module Verified</Text>
          </View>
        </View>

        {/* Custom Message from Kotlin */}
        <View style={styles.customMessageCard}>
          <MaterialCommunityIcons name="code-tags" size={24} color={COLORS.accent} />
          <Text style={styles.customMessageText}>{nativeData.customMessage}</Text>
        </View>

        {/* Device Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="cellphone-information" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Device Information (From Kotlin)</Text>
          </View>

          <InfoCard title="Device Model" value={nativeData.deviceModel} icon="cellphone" />
          <InfoCard title="Brand" value={nativeData.brand} icon="factory" />
          <InfoCard title="Manufacturer" value={nativeData.manufacturer} icon="domain" />
          <InfoCard title="Product" value={nativeData.product} icon="package-variant" />
        </View>

        {/* Platform Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="android" size={24} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>Platform Information (From Kotlin)</Text>
          </View>

          <InfoCard title="Platform" value={nativeData.platform} icon="apps" />
          <InfoCard title="OS Version" value={nativeData.osVersion} icon="android" />
          <InfoCard title="API Level" value={`API ${nativeData.apiLevel}`} icon="code-tags" />
          <InfoCard title="Locale" value={nativeData.locale} icon="translate" />
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="application" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>App Information (From Kotlin)</Text>
          </View>

          <InfoCard title="App Version" value={nativeData.appVersion} icon="tag" />
          <InfoCard title="Version Code" value={nativeData.appVersionCode.toString()} icon="numeric" />
        </View>

        {/* Battery Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="battery" size={24} color={COLORS.success} />
            <Text style={styles.sectionTitle}>Battery Information (From Kotlin)</Text>
          </View>

          <View style={styles.batteryCard}>
            <View style={styles.batteryHeader}>
              <Text style={styles.batteryLabel}>Battery Level</Text>
              <Text style={styles.batteryPercentage}>{nativeData.batteryLevel}%</Text>
            </View>

            <View style={styles.batteryBar}>
              <View
                style={[
                  styles.batteryFill,
                  { width: `${nativeData.batteryLevel}%` },
                  nativeData.batteryLevel < 20 && styles.batteryLow,
                  nativeData.isCharging && styles.batteryCharging,
                ]}
              />
            </View>

            <View style={styles.batteryStatus}>
              <MaterialCommunityIcons 
                name={nativeData.isCharging ? "power-plug" : "battery"} 
                size={16} 
                color={nativeData.isCharging ? COLORS.success : COLORS.textSecondary} 
              />
              <Text style={styles.batteryStatusText}>
                {nativeData.isCharging ? "Charging" : "Not charging"}
              </Text>
            </View>
          </View>
        </View>

        {/* Formatted Date from Kotlin */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="clock-outline" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Formatted Date (From Kotlin)</Text>
          </View>

          <InfoCard 
            title="Kotlin Formatted Timestamp" 
            value={nativeData.nativeTimestamp} 
            icon="clock-outline" 
            highlight={true}
          />
          
          {formattedDate && (
            <InfoCard 
              title="Current Date (Formatted in Kotlin)" 
              value={formattedDate} 
              icon="calendar-clock" 
              highlight={true}
            />
          )}
        </View>

        {/* Device Summary */}
        {deviceSummary && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="text-box" size={24} color={COLORS.accent} />
              <Text style={styles.sectionTitle}>Device Summary (From Kotlin)</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryText}>{deviceSummary}</Text>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchNativeData}>
            <MaterialCommunityIcons name="refresh" size={20} color={COLORS.text} />
            <Text style={styles.refreshText}>Refresh Kotlin Data</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.codeButton} onPress={() => {
            Alert.alert("Kotlin Module", "Check DeviceInfoModule.kt in android/app/src/main/java/com/yourapp/");
          }}>
            <MaterialCommunityIcons name="code-braces" size={20} color={COLORS.text} />
            <Text style={styles.codeText}>View Kotlin Code</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Note */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ✅ All data is fetched from custom Kotlin native module
          </Text>
          <Text style={styles.footerSubtext}>
            Module: DeviceInfoModule.kt | Package: DeviceInfoPackage.kt
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 16, paddingBottom: 40 },
  header: { alignItems: "center", marginBottom: 30, paddingTop: 10 },
  headerTitle: { fontSize: 28, fontWeight: "800", color: COLORS.text, textAlign: "center" },
  headerSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4, textAlign: "center" },
  verifiedBadge: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 6, 
    marginTop: 8,
    backgroundColor: `${COLORS.success}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  verifiedText: { color: COLORS.success, fontSize: 12, fontWeight: "600" },
  loadingText: { color: COLORS.text, marginTop: 20, textAlign: "center" },
  
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { color: COLORS.error, marginTop: 12, fontSize: 16, textAlign: "center" },
  retryButton: { marginTop: 20, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: COLORS.primary, borderRadius: 8 },
  retryText: { color: COLORS.text, fontWeight: "600" },

  customMessageCard: {
    backgroundColor: `${COLORS.accent}15`,
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  customMessageText: { color: COLORS.text, flex: 1, fontSize: 14, fontWeight: "500" },

  section: { marginBottom: 25 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: COLORS.text },

  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  highlightCard: {
    backgroundColor: `${COLORS.accent}10`,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  infoHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  infoTitle: { fontSize: 14, fontWeight: "600", color: COLORS.textSecondary },
  highlightText: { color: COLORS.accent },
  infoValue: { fontSize: 16, color: COLORS.text },
  highlightValue: { color: COLORS.accent, fontWeight: "600" },

  batteryCard: { backgroundColor: COLORS.surface, borderRadius: 10, padding: 15 },
  batteryHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  batteryLabel: { fontSize: 14, color: COLORS.textSecondary },
  batteryPercentage: { fontSize: 24, fontWeight: "700", color: COLORS.success },
  batteryBar: { height: 10, backgroundColor: COLORS.border, borderRadius: 5, overflow: "hidden", marginBottom: 8 },
  batteryFill: { height: "100%", backgroundColor: COLORS.success },
  batteryLow: { backgroundColor: COLORS.error },
  batteryCharging: { backgroundColor: COLORS.accent },
  batteryStatus: { flexDirection: "row", alignItems: "center", gap: 6 },
  batteryStatusText: { color: COLORS.textSecondary, fontSize: 12 },

  summaryCard: { backgroundColor: COLORS.surface, borderRadius: 10, padding: 15 },
  summaryText: { color: COLORS.text, fontSize: 12, lineHeight: 18, fontFamily: "monospace" },

  actionsContainer: { flexDirection: "row", gap: 12, marginTop: 20 },
  refreshButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  codeButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  refreshText: { color: COLORS.text, fontSize: 16, fontWeight: "600" },
  codeText: { color: COLORS.primary, fontSize: 16, fontWeight: "600" },

  footer: { marginTop: 30, padding: 16, backgroundColor: `${COLORS.success}10`, borderRadius: 10 },
  footerText: { color: COLORS.success, fontSize: 14, fontWeight: "600", textAlign: "center" },
  footerSubtext: { color: COLORS.textSecondary, fontSize: 12, textAlign: "center", marginTop: 4 },
});