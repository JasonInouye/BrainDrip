import { View, Text, Pressable, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../src/stores/authStore";

export default function ProfileScreen() {
  const { user, profile, signOut } = useAuthStore();

  const displayName =
    profile?.display_name || profile?.username || user?.email || "User";

  const handleSignOut = () => {
    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to sign out?")) {
        signOut();
      }
    } else {
      Alert.alert("Sign Out", "Are you sure you want to sign out?", [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", style: "destructive", onPress: signOut },
      ]);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4">
        <Text className="text-2xl font-bold text-gray-900 mt-4 mb-6">
          Profile
        </Text>

        <View className="items-center mb-8">
          <View className="bg-primary-100 rounded-full w-20 h-20 items-center justify-center mb-3">
            <Ionicons name="person" size={40} color="#0891b2" />
          </View>
          <Text className="text-lg font-semibold text-gray-900">
            {displayName}
          </Text>
          {profile?.preferred_categories &&
            profile.preferred_categories.length > 0 && (
              <Text className="text-sm text-gray-400 mt-1">
                {profile.preferred_categories.length} interests selected
              </Text>
            )}
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

        <View className="bg-gray-50 rounded-2xl p-6 mb-6">
          <Text className="text-sm font-medium text-gray-500 uppercase mb-3">
            Achievements
          </Text>
          <Text className="text-sm text-gray-400 italic">
            Complete activities to unlock achievements...
          </Text>
        </View>

        <Pressable
          className="border border-red-200 rounded-xl py-4 items-center active:bg-red-50"
          onPress={handleSignOut}
        >
          <Text className="text-red-600 font-semibold text-base">
            Sign Out
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
