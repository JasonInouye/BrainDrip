import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useAuthStore } from "../../src/stores/authStore";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const signIn = useAuthStore((s) => s.signIn);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setError(null);
    setLoading(true);
    const { error: signInError } = await signIn(email.trim(), password);
    setLoading(false);

    if (signInError) {
      setError(signInError);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-6 justify-center">
          <Text className="text-3xl font-bold text-gray-900 mb-1">
            Welcome Back
          </Text>
          <Text className="text-base text-gray-500 mb-8">
            Sign in to continue learning
          </Text>

          {error && (
            <View className="bg-red-50 rounded-xl p-3 mb-4">
              <Text className="text-red-600 text-sm">{error}</Text>
            </View>
          )}

          <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 mb-4"
            placeholder="you@example.com"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />

          <Text className="text-sm font-medium text-gray-700 mb-1">
            Password
          </Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 mb-6"
            placeholder="Your password"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />

          <Pressable
            className="bg-primary-600 rounded-xl py-4 items-center active:bg-primary-700"
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                Sign In
              </Text>
            )}
          </Pressable>

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-500 text-sm">
              Don't have an account?{" "}
            </Text>
            <Link href="/(auth)/register" asChild>
              <Pressable>
                <Text className="text-primary-600 font-semibold text-sm">
                  Sign Up
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
