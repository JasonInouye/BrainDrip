import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DeckDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4 justify-center items-center">
        <Text className="text-xl font-bold text-gray-900 mb-2">
          Deck Detail
        </Text>
        <Text className="text-sm text-gray-400">Deck ID: {id}</Text>
        <Text className="text-sm text-gray-400 mt-2">
          Card list coming soon...
        </Text>
      </View>
    </SafeAreaView>
  );
}
