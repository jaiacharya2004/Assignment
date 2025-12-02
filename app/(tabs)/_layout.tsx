import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2196F3",
        headerShown: true,
      }}
    >
      <Tabs.Screen 
        name="list" 
        options={{ 
          title: "List",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="settings" 
        options={{ 
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen
  name="logout"
  options={{
    title: "Logout",
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="log-out-outline" size={size} color={color} />
    ),
  }}
/>


    </Tabs>
  );
}