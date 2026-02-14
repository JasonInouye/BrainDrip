import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4">
        <Text className="text-3xl font-bold text-gray-900 mt-4 mb-2">
          BrainDrip
        </Text>
        <Text className="text-base text-gray-500 mb-6">
          Your daily knowledge feed
        </Text>

        <View className="bg-primary-50 rounded-2xl p-6 mb-4">
          <Text className="text-lg font-semibold text-primary-800 mb-2">
            Welcome to BrainDrip!
          </Text>
          <Text className="text-sm text-primary-700">
            Your daily curated knowledge, quizzes, and flashcard decks will
            appear here.
          </Text>
        </View>

        <View className="bg-gray-50 rounded-2xl p-6 mb-4">
          <Text className="text-sm font-medium text-gray-500 uppercase mb-2">
            Today's Featured
          </Text>
          <Text className="text-base text-gray-400 italic">
            Knowledge cards coming soon...
          </Text>
        </View>

        <View className="bg-gray-50 rounded-2xl p-6 mb-4">
          <Text className="text-sm font-medium text-gray-500 uppercase mb-2">
            On This Day
          </Text>
          <Text className="text-base text-gray-400 italic">
            Historical events coming soon...
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
