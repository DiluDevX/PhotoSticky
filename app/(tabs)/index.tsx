import Button from "@/components/Button";
import ImageViewer from "@/components/ImageViewer";
import * as ImagePicker from "expo-image-picker";
import { StyleSheet, View } from "react-native";

const PlaceholderImage = require("@/assets/images/icon.png");

export default function Index() {
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log("Image selected:", result.assets[0].uri);
    } else {
      console.log("You did not select any image.");
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} />
      </View>
      <View style={styles.footerContainer}>
        <Button
          label="Choose a Photo"
          theme="primary"
          onPress={pickImageAsync}
        />
        <Button label="Use this Photo" />
      </View>
    </View>
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
});
