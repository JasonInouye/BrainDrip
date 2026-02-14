import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../src/stores/authStore";
import { CATEGORIES, DIFFICULTY_LEVELS } from "../../src/constants/categories";

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  history: "book",
  science: "flask",
  geography: "globe",
  pop_culture: "star",
  technology: "laptop",
  literature: "book-outline",
  math: "calculator",
  art: "color-palette",
  sports: "football",
  nature: "leaf",
};

export default function OnboardingScreen() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState("beginner");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const toggleCategory = (key: string) => {
    setSelectedCategories((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  };

  const handleComplete = async () => {
    if (selectedCategories.length === 0) {
      setError("Select at least one category");
      return;
    }

    setError(null);
    setLoading(true);
    const { error: updateError } = await updateProfile({
      preferred_categories: selectedCategories,
      difficulty_level: selectedDifficulty as "beginner" | "intermediate" | "advanced",
    });
    setLoading(false);

    if (updateError) {
      setError(updateError);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-bold text-gray-900 mt-8 mb-1">
          What interests you?
        </Text>
        <Text className="text-base text-gray-500 mb-6">
          Pick topics you'd like to learn about
        </Text>

        {error && (
          <View className="bg-red-50 rounded-xl p-3 mb-4">
            <Text className="text-red-600 text-sm">{error}</Text>
          </View>
        )}

        <View className="flex-row flex-wrap gap-3 mb-8">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategories.includes(cat.key);
            return (
              <Pressable
                key={cat.key}
                onPress={() => toggleCategory(cat.key)}
                className={`flex-row items-center rounded-full px-4 py-3 border ${
                  isSelected
                    ? "bg-primary-50 border-primary-500"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <Ionicons
                  name={CATEGORY_ICONS[cat.key] ?? "help-circle"}
                  size={18}
                  color={isSelected ? "#0891b2" : "#6b7280"}
                />
                <Text
                  className={`ml-2 text-sm font-medium ${
                    isSelected ? "text-primary-700" : "text-gray-600"
                  }`}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text className="text-xl font-bold text-gray-900 mb-1">
          Difficulty Level
        </Text>
        <Text className="text-sm text-gray-500 mb-4">
          You can change this later in settings
        </Text>

        <View className="gap-3 mb-8">
          {DIFFICULTY_LEVELS.map((level) => {
            const isSelected = selectedDifficulty === level.key;
            return (
              <Pressable
                key={level.key}
                onPress={() => setSelectedDifficulty(level.key)}
                className={`flex-row items-center rounded-xl px-4 py-4 border ${
                  isSelected
                    ? "bg-primary-50 border-primary-500"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <View
                  className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-3 ${
                    isSelected ? "border-primary-600" : "border-gray-300"
                  }`}
                >
                  {isSelected && (
                    <View className="w-3 h-3 rounded-full bg-primary-600" />
                  )}
                </View>
                <Text
                  className={`text-base font-medium ${
                    isSelected ? "text-primary-700" : "text-gray-600"
                  }`}
                >
                  {level.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          className="bg-primary-600 rounded-xl py-4 items-center active:bg-primary-700 mb-8"
          onPress={handleComplete}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">
              Start Learning
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
