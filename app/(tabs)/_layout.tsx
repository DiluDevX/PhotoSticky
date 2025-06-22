import Ionicons from "@expo/vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// Type for the icon names
type IconName = keyof typeof Ionicons.glyphMap;

// Animated tab bar icon component for smoother transitions
function TabBarIcon({
  name,
  color,
  focused,
}: {
  name: IconName;
  color: string;
  focused: boolean;
}) {
  const iconSize = useSharedValue(24);
  const iconOpacity = useSharedValue(0.7);

  // Create animation when focused state changes
  const animatedStyle = useAnimatedStyle(() => {
    iconSize.value = withTiming(focused ? 28 : 24, { duration: 200 });
    iconOpacity.value = withTiming(focused ? 1 : 0.7, { duration: 200 });

    return {
      transform: [{ scale: iconSize.value / 24 }],
      opacity: iconOpacity.value,
    };
  }, [focused]);

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons
        name={
          focused && name.includes("-outline")
            ? (name.replace("-outline", "") as IconName)
            : name
        }
        color={color}
        size={24}
      />
    </Animated.View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3490dc",
        headerStyle: {
          backgroundColor: "#18191a",
          borderBottomColor: "rgba(52, 144, 220, 0.3)",
          borderBottomWidth: 1,
        },
        headerShadowVisible: true,
        headerTitleAlign: "center",
        headerTintColor: "#3490dc",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
          letterSpacing: 0.5,
        },
        tabBarStyle: {
          backgroundColor: "rgba(24, 25, 26, 0.98)",
          borderTopWidth: 0,
          elevation: 0,
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
          ...(Platform.OS === "ios"
            ? {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 5,
              }
            : {}),
        },
        tabBarItemStyle: {
          padding: 5,
        },
        tabBarLabelStyle: {
          fontWeight: "500",
          fontSize: 12,
        },
        tabBarBackground: () => (
          <BlurView tint="dark" intensity={30} style={{ flex: 1 }} />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Editor",
          headerTitle: "PhotoSticky",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="image-outline" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name="information-circle-outline"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
