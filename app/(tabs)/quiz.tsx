import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function QuizScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4 justify-center items-center">
        <View className="bg-primary-50 rounded-full w-24 h-24 items-center justify-center mb-6">
          <Ionicons name="help-circle" size={48} color="#0891b2" />
        </View>

        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Daily Quiz
        </Text>
        <Text className="text-base text-gray-500 text-center mb-8 px-8">
          Test your knowledge with 10 daily questions across your favorite
          categories.
        </Text>

        <Pressable className="bg-primary-600 rounded-xl px-8 py-4 active:bg-primary-700">
          <Text className="text-white font-semibold text-base">
            Start Quiz
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
