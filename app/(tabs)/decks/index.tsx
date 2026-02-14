import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function DecksScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4">
        <Text className="text-2xl font-bold text-gray-900 mt-4 mb-6">
          My Decks
        </Text>

        <View className="flex-1 justify-center items-center">
          <View className="bg-gray-100 rounded-full w-20 h-20 items-center justify-center mb-4">
            <Ionicons name="albums-outline" size={40} color="#9ca3af" />
          </View>
          <Text className="text-lg font-medium text-gray-600 mb-2">
            No decks yet
          </Text>
          <Text className="text-sm text-gray-400 text-center mb-6 px-8">
            Create your first flashcard deck to start learning with spaced
            repetition.
          </Text>

          <Pressable className="bg-primary-600 rounded-xl px-6 py-3 active:bg-primary-700">
            <Text className="text-white font-semibold text-sm">
              Create Deck
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
