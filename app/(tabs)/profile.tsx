import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4">
        <Text className="text-2xl font-bold text-gray-900 mt-4 mb-6">
          Profile
        </Text>

        <View className="items-center mb-8">
          <View className="bg-gray-200 rounded-full w-20 h-20 items-center justify-center mb-3">
            <Ionicons name="person" size={40} color="#6b7280" />
          </View>
          <Text className="text-lg font-semibold text-gray-900">
            Guest User
          </Text>
          <Text className="text-sm text-gray-400">Sign in to save progress</Text>
        </View>

        <View className="flex-row justify-between mb-8">
          <View className="bg-orange-50 rounded-2xl p-4 flex-1 mr-2 items-center">
            <Text className="text-2xl font-bold text-orange-600">0</Text>
            <Text className="text-xs text-orange-500 mt-1">Day Streak</Text>
          </View>
          <View className="bg-blue-50 rounded-2xl p-4 flex-1 mx-2 items-center">
            <Text className="text-2xl font-bold text-blue-600">0</Text>
            <Text className="text-xs text-blue-500 mt-1">Quizzes</Text>
          </View>
          <View className="bg-purple-50 rounded-2xl p-4 flex-1 ml-2 items-center">
            <Text className="text-2xl font-bold text-purple-600">0</Text>
            <Text className="text-xs text-purple-500 mt-1">Cards</Text>
          </View>
        </View>

        <View className="bg-gray-50 rounded-2xl p-6">
          <Text className="text-sm font-medium text-gray-500 uppercase mb-3">
            Achievements
          </Text>
          <Text className="text-sm text-gray-400 italic">
            Complete activities to unlock achievements...
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
