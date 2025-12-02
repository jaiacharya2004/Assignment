import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export default function RootLayout() {
  const { user, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    if (!user) {
      router.replace("/auth/login");
    } else {
      router.replace("/(tabs)/list");
    }
  }, [user, initialized]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="auth" />
    </Stack>
  );
}
