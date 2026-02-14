import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateDeckScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4 justify-center items-center">
        <Text className="text-xl font-bold text-gray-900 mb-2">
          Create New Deck
        </Text>
        <Text className="text-sm text-gray-400">
          Deck creation form coming soon...
        </Text>
      </View>
    </SafeAreaView>
  );
}
