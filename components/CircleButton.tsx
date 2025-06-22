import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Props = {
  onPress: () => void;
};

export default function CircleButton({ onPress }: Props) {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const pressed = useSharedValue(false);

  useAnimatedReaction(
    () => pressed.value,
    (isPressed) => {
      if (isPressed) {
        scale.value = withSpring(0.9, { damping: 15 });
        rotate.value = withSpring(45, { damping: 15 });
      } else {
        scale.value = withSpring(1, { damping: 15 });
        rotate.value = withSpring(0, { damping: 15 });
      }
    },
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
    };
  });

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <View style={styles.circleButtonContainer}>
      <Animated.View style={[styles.innerContainer, animatedStyle]}>
        <Pressable
          style={styles.circleButton}
          onPress={handlePress}
          onPressIn={() => {
            pressed.value = true;
          }}
          onPressOut={() => {
            pressed.value = false;
          }}
        >
          <MaterialIcons name="add" size={38} color="#25292e" />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  circleButtonContainer: {
    width: 84,
    height: 84,
    marginHorizontal: 60,
    borderWidth: 4,
    borderColor: "#3490dc",
    borderRadius: 42,
    padding: 3,
    shadowColor: "#3490dc",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  innerContainer: {
    flex: 1,
    borderRadius: 42,
    overflow: "hidden",
  },
  circleButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 42,
    backgroundColor: "#fff",
  },
});
