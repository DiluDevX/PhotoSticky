import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { PropsWithChildren } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
}>;

export default function EmojiPicker({ isVisible, children, onClose }: Props) {
  const translateY = useSharedValue(200);
  const opacity = useSharedValue(0);
  const animatedRef = useAnimatedRef<Animated.View>();

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    translateY.value = withSpring(200, { damping: 15 });
    opacity.value = withTiming(0, { duration: 200 }, () => {
      onClose();
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  // Reset animation values when modal opens
  if (isVisible) {
    translateY.value = withSpring(0, { damping: 15 });
    opacity.value = withTiming(1, { duration: 200 });
  }

  return (
    <View>
      <Modal
        animationType="none"
        transparent={true}
        visible={isVisible}
        onRequestClose={handleClose}
      >
        <Animated.View style={[styles.overlay, overlayStyle]}>
          <BlurView intensity={15} tint="dark" style={styles.blurView}>
            <Pressable style={styles.dismissArea} onPress={handleClose} />

            <Animated.View
              ref={animatedRef}
              style={[styles.modalContent, animatedStyle]}
            >
              <View style={styles.handleContainer}>
                <View style={styles.handle} />
              </View>

              <View style={styles.titleContainer}>
                <Text style={styles.title}>Choose a sticker</Text>
                <Pressable
                  onPress={handleClose}
                  style={({ pressed }) => [
                    styles.closeButton,
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <MaterialIcons name="close" color="#fff" size={22} />
                </Pressable>
              </View>

              {children}
            </Animated.View>
          </BlurView>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  blurView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  dismissArea: {
    flex: 1,
  },
  modalContent: {
    height: "30%",
    width: "100%",
    backgroundColor: "rgba(40, 44, 52, 0.95)",
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
  },
  handleContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#666",
  },
  titleContainer: {
    height: "16%",
    backgroundColor: "rgba(70, 76, 85, 0.8)",
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});
