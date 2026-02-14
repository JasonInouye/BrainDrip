import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function ReviewScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4 justify-center items-center">
        <View className="bg-green-50 rounded-full w-24 h-24 items-center justify-center mb-6">
          <Ionicons name="checkmark-circle" size={48} color="#16a34a" />
        </View>

        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Review Queue
        </Text>
        <Text className="text-base text-gray-500 text-center px-8">
          No cards due for review today. Create some decks and start learning!
        </Text>
      </View>
    </SafeAreaView>
  );
}
