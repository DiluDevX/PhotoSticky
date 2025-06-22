import * as Haptics from "expo-haptics";
import { ImageSourcePropType } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type Props = {
  imageSize: number;
  stickerSource: ImageSourcePropType;
};

export default function EmojiSticker({ imageSize, stickerSource }: Props) {
  const scaleImage = useSharedValue(imageSize);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);

  // Trigger haptic feedback
  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  // Animate in on mount
  opacity.value = withDelay(
    100,
    withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) }),
  );

  rotation.value = withDelay(
    100,
    withSequence(
      withTiming(-15, { duration: 200 }),
      withTiming(10, { duration: 150 }),
      withTiming(0, { duration: 150 }),
    ),
  );

  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(scaleImage.value, { damping: 15 }),
      height: withSpring(scaleImage.value, { damping: 15 }),
      opacity: opacity.value,
      transform: [{ rotate: `${rotation.value}deg` }, { scale: 1 }],
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      runOnJS(triggerHaptic)();
      if (scaleImage.value !== imageSize * 2) {
        scaleImage.value = scaleImage.value * 2;
        // Add a little bounce effect
        rotation.value = withSequence(
          withTiming(5, { duration: 150 }),
          withTiming(-5, { duration: 150 }),
          withTiming(0, { duration: 150 }),
        );
      } else {
        scaleImage.value = Math.round(scaleImage.value / 2);
        // Add a little shrink effect
        rotation.value = withSequence(
          withTiming(-5, { duration: 150 }),
          withTiming(5, { duration: 150 }),
          withTiming(0, { duration: 150 }),
        );
      }
    });

  const drag = Gesture.Pan()
    .onChange((event) => {
      translateX.value += event.changeX;
      translateY.value += event.changeY;
    })
    .onEnd(() => {
      // Optional: Add a little spring effect when drag ends
      translateX.value = withSpring(translateX.value);
      translateY.value = withSpring(translateY.value);
    });

  return (
    <GestureDetector gesture={drag}>
      <Animated.View style={[containerStyle, { top: -350 }]}>
        <GestureDetector gesture={doubleTap}>
          <Animated.Image
            source={stickerSource}
            style={[imageStyle, { resizeMode: "contain" }]}
          />
        </GestureDetector>
      </Animated.View>
    </GestureDetector>
  );
}
