import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { useAuth } from "../../hooks/useAuth";

const COLORS = {
  primary: "#1E88E5",
  background: "#0F1419",
  surface: "#1A1F2E",
  text: "#FFFFFF",
  textSecondary: "#B0BEC5",
  error: "#FF5252",
  warning: "#FFA726",
  border: "#2D3139",
};

export default function LogoutScreen() {
  const { user, signOut, loading } = useAuth();

  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  async function onLogout() {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out of MovieFlix?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await signOut();
            } catch (error: any) {
              Alert.alert("Logout Failed", error.message);
            }
          },
          style: "destructive",
        },
      ]
    );
  }

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
        {/* Header */}
        <Text style={styles.header}>Account</Text>

        {/* User Profile Card */}
        <Animated.View
          style={[
            styles.profileCard,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </View>

          <Text style={styles.displayName}>
            {user?.displayName || "Movie Enthusiast"}
          </Text>
          <Text style={styles.emailAddress}>{user?.email}</Text>

          {/* User Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="bookmark-multiple"
                size={24}
                color={COLORS.primary}
              />
              <Text style={styles.statLabel}>Saved Movies</Text>
              <Text style={styles.statValue}>0</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="heart-multiple"
                size={24}
                color={COLORS.primary}
              />
              <Text style={styles.statLabel}>Favorites</Text>
              <Text style={styles.statValue}>0</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="star-outline"
                size={24}
                color={COLORS.primary}
              />
              <Text style={styles.statLabel}>Ratings</Text>
              <Text style={styles.statValue}>0</Text>
            </View>
          </View>
        </Animated.View>

        {/* Account Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <View style={styles.infoItem}>
            <View style={styles.infoItemLeft}>
              <MaterialCommunityIcons
                name="email-outline"
                size={24}
                color={COLORS.primary}
              />
              <View>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email}</Text>
              </View>
            </View>
            <MaterialCommunityIcons
              name="check-circle"
              size={20}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoItemLeft}>
              <MaterialCommunityIcons
                name="shield-check-outline"
                size={24}
                color={COLORS.primary}
              />
              <View>
                <Text style={styles.infoLabel}>Account Status</Text>
                <Text style={styles.infoValue}>Active</Text>
              </View>
            </View>
            <MaterialCommunityIcons
              name="check-circle"
              size={20}
              color="#4CAF50"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionItemLeft}>
              <MaterialCommunityIcons
                name="bell-outline"
                size={24}
                color={COLORS.primary}
              />
              <Text style={styles.actionLabel}>Notifications</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionItemLeft}>
              <MaterialCommunityIcons
                name="information-outline"
                size={24}
                color={COLORS.primary}
              />
              <Text style={styles.actionLabel}>About MovieFlix</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>

      {/* Logout Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={onLogout}
          disabled={loading}
          style={[styles.logoutButton, loading && styles.logoutButtonDisabled]}
        >
          {loading ? (
            <MaterialCommunityIcons
              name="loading"
              size={24}
              color={COLORS.text}
            />
          ) : (
            <>
              <MaterialCommunityIcons
                name="logout"
                size={22}
                color={COLORS.text}
              />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Your data will be securely stored
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 24,
    paddingTop: 12,
    letterSpacing: 0.5,
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    elevation: 4,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.text,
  },
  displayName: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  emailAddress: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 12,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    elevation: 4,
    marginBottom: 12,
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});