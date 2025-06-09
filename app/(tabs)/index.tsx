import Button from "@/components/Button";
import CircleButton from "@/components/CircleButton";
import EmojiList from "@/components/EmojiList";
import EmojiPicker from "@/components/EmojiPicker";
import EmojiSticker from "@/components/EmojiSticker";
import IconButton from "@/components/IconButton";
import ImageViewer from "@/components/ImageViewer";
import domtoimage from "dom-to-image";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useRef, useState } from "react";
import { ImageSourcePropType, Platform, StyleSheet, View } from "react-native";
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
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedPhoto(result.assets[0].uri);
      setShowOptions(true);
      console.log("Image selected:", result.assets[0].uri);
    } else {
      console.log("You did not select any image.");
    }
  };

  const onReset = () => {
    setShowOptions(false);
    setPickedEmoji(null);
    setSelectedPhoto(null);
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
    console.log("Add sticker button pressed");
  };

  const onSaveImageAsync = async () => {
    if (Platform.OS !== "web") {
      try {
        const localUrl = await captureRef(imageRef, {
          width: 440,
          quality: 1,
        });

        await MediaLibrary.saveToLibraryAsync(localUrl);

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
          width: 320,
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
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
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
          <Button label="Use this Photo" onPress={() => setShowOptions(true)} />
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
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    paddingTop: 48,
  },
  footerContainer: {
    paddingVertical: 20,
    gap: 10,
    alignItems: "center",
    width: "100%",
  },
  optionsContainer: {
    position: "absolute",
    bottom: 80,
  },
  optionsRow: {
    alignItems: "center",
    flexDirection: "row",
  },
});
