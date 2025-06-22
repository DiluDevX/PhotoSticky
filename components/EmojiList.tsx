import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useState } from "react";
import {
  FlatList,
  ImageSourcePropType,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Props = {
  onSelect: (image: ImageSourcePropType) => void;
  onCloseModal: () => void;
};

// Component to handle each emoji item with its own animation state
const EmojiItem = ({
  item,
  index,
  onSelect,
}: {
  item: ImageSourcePropType;
  index: number;
  onSelect: (item: ImageSourcePropType) => void;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelect(item);
  };

  return (
    <Animated.View style={[styles.emojiContainer, animatedStyle]}>
      <Pressable
        onPress={handlePress}
        onPressIn={() => {
          scale.value = withSpring(1.2, { damping: 15 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15 });
        }}
      >
        <Image source={item} key={index} style={styles.image} />
      </Pressable>
    </Animated.View>
  );
};

export default function EmojiList({ onSelect, onCloseModal }: Props) {
  const [emoji] = useState<ImageSourcePropType[]>([
    require("../assets/images/emoji1.png"),
    require("../assets/images/emoji2.png"),
    require("../assets/images/emoji3.png"),
    require("../assets/images/emoji4.png"),
    require("../assets/images/emoji5.png"),
    require("../assets/images/emoji6.png"),
  ]);

  const handleSelect = (item: ImageSourcePropType) => {
    onSelect(item);
    onCloseModal();
  };

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={Platform.OS === "web"}
        data={emoji}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }) => (
          <EmojiItem item={item} index={index} onSelect={handleSelect} />
        )}
        initialNumToRender={6}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(40, 44, 52, 0.95)",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
    flexGrow: 1, // ensures container expands to fill available space
    alignItems: "center",
    justifyContent: "space-around",
  },
  emojiContainer: {
    borderRadius: 16,
    marginHorizontal: 6,
    padding: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
});
