import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  theme?: "primary";
  onPress?: () => void;
};

export default function Button({ label, theme, onPress }: Props) {
  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  if (theme === "primary") {
    return (
      <View style={[styles.buttonContainer, styles.primaryButtonContainer]}>
        <LinearGradient
          colors={["#3490dc", "#6574cd"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handlePress}
          >
            <FontAwesome
              name="picture-o"
              size={18}
              color="#ffffff"
              style={styles.buttonIcon}
            />
            <Text style={[styles.buttonLabel, styles.primaryButtonLabel]}>
              {label}
            </Text>
          </Pressable>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.secondaryButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={handlePress}
      >
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 60,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    overflow: "hidden",
  },
  primaryButtonContainer: {
    shadowColor: "#6574cd",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  gradientBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  primaryButton: {
    backgroundColor: "transparent",
  },
  secondaryButton: {
    borderColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonIcon: {
    paddingRight: 12,
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  primaryButtonLabel: {
    color: "#ffffff",
  },
});
