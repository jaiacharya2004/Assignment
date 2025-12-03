import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const COLORS = {
  primary: "#1E88E5",
  background: "#0F1419",
  surface: "#1A1F2E",
  text: "#FFFFFF",
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "#8E99A4",
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: "#2D3139",
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 18,
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 14,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
      }}
    >
      <Tabs.Screen
        name="list"
        options={{
          title: "Movies",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="film" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-sharp" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="logout"
        options={{
          title: "Logout",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="log-out" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}