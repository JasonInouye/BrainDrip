import "../global.css";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useAuthStore } from "../src/stores/authStore";

function useProtectedRoute() {
  const { session, isLoading, isOnboarded } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!session) {
      if (!inAuthGroup) {
        router.replace("/(auth)/login");
      }
    } else if (!isOnboarded) {
      const secondSegment = (segments as string[])[1];
      if (secondSegment !== "onboarding") {
        router.replace("/(auth)/onboarding");
      }
    } else {
      if (inAuthGroup) {
        router.replace("/(tabs)");
      }
    }
  }, [session, isLoading, isOnboarded, segments]);
}

export default function RootLayout() {
  const initialize = useAuthStore((s) => s.initialize);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync("#ffffff");
    initialize();
  }, []);

  useProtectedRoute();

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#0891b2" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
      </Stack>
    </>
  );
}
