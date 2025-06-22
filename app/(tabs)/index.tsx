import Button from "@/components/Button";
import CircleButton from "@/components/CircleButton";
import EmojiList from "@/components/EmojiList";
import EmojiPicker from "@/components/EmojiPicker";
import EmojiSticker from "@/components/EmojiSticker";
import IconButton from "@/components/IconButton";
import ImageViewer from "@/components/ImageViewer";
import domtoimage from "dom-to-image";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useRef, useState } from "react";
import {
  ImageSourcePropType,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { captureRef } from "react-native-view-shot";

const PlaceholderImage = require("@/assets/images/icon.png");

export default function Index() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [pickedEmoji, setPickedEmoji] = useState<ImageSourcePropType | null>(
    null,
  );
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const imageRef = useRef<View>(null);

  if (status === null) {
    requestPermission();
  }

  const pickImageAsync = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedPhoto(result.assets[0].uri);
      setShowOptions(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      console.log("Image selected:", result.assets[0].uri);
    } else {
      console.log("You did not select any image.");
    }
  };

  const onReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowOptions(false);
    setPickedEmoji(null);
    setSelectedPhoto(null);
  };

  const onAddSticker = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsModalVisible(true);
    console.log("Add sticker button pressed");
  };

  const onSaveImageAsync = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (Platform.OS !== "web") {
      try {
        const localUrl = await captureRef(imageRef, {
          width: 440,
          height: 440,
          quality: 1,
        });

        await MediaLibrary.saveToLibraryAsync(localUrl);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        if (localUrl) {
          alert("Image saved successfully!");
        }
      } catch (error) {
        console.error("Error saving image:", error);
      }
    } else {
      try {
        const dataUrl = await domtoimage.toJpeg(imageRef.current, {
          quality: 1,
          width: 440,
          height: 440,
        });

        let link = document.createElement("a");
        link.download = "PhotoSticky.jpeg";
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error("Error saving image:", error);
      }
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>PhotoSticky</Text>

          <View style={styles.imageContainer}>
            <View
              ref={imageRef}
              collapsable={false}
              style={styles.imageWrapper}
            >
              <ImageViewer
                imgSource={
                  selectedPhoto ? { uri: selectedPhoto } : PlaceholderImage
                }
              />
              {pickedEmoji && (
                <EmojiSticker imageSize={100} stickerSource={pickedEmoji} />
              )}
            </View>
          </View>

          {showOptions ? (
            <View style={styles.optionsContainer}>
              <View style={styles.optionsRow}>
                <IconButton icon="refresh" label="Reset" onPress={onReset} />
                <CircleButton onPress={onAddSticker} />
                <IconButton
                  icon="save-alt"
                  label="Save"
                  onPress={onSaveImageAsync}
                />
              </View>
            </View>
          ) : (
            <View style={styles.footerContainer}>
              <Button
                label="Choose a Photo"
                theme="primary"
                onPress={pickImageAsync}
              />
              <Button
                label="Use this Photo"
                onPress={() => {
                  if (selectedPhoto) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowOptions(true);
                  }
                }}
              />
            </View>
          )}

          <EmojiPicker
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
          >
            <EmojiList
              onSelect={setPickedEmoji}
              onCloseModal={() => setIsModalVisible(false)}
            />
          </EmojiPicker>
        </View>
      </BlurView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#18191a",
  },
  blurContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 10,
    textShadowColor: "rgba(0, 255, 255, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 20,
  },
  imageWrapper: {
    borderRadius: 25,
    shadowColor: "cyan",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  footerContainer: {
    paddingVertical: 30,
    gap: 16,
    alignItems: "center",
    width: "100%",
  },
  optionsContainer: {
    marginTop: 20,
    marginBottom: 40,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "rgba(30, 30, 30, 0.6)",
  },
  optionsRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 30,
  },
});
