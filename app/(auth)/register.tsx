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

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const signUp = useAuthStore((s) => s.signUp);

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError(null);
    setLoading(true);
    const { error: signUpError } = await signUp(email.trim(), password);
    setLoading(false);

    if (signUpError) {
      setError(signUpError);
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
            Create Account
          </Text>
          <Text className="text-base text-gray-500 mb-8">
            Start your learning journey
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
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 mb-4"
            placeholder="At least 6 characters"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="new-password"
          />

          <Text className="text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 mb-6"
            placeholder="Confirm your password"
            placeholderTextColor="#9ca3af"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoComplete="new-password"
          />

          <Pressable
            className="bg-primary-600 rounded-xl py-4 items-center active:bg-primary-700"
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                Create Account
              </Text>
            )}
          </Pressable>

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-500 text-sm">
              Already have an account?{" "}
            </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text className="text-primary-600 font-semibold text-sm">
                  Sign In
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
