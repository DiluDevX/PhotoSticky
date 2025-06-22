import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { Link } from "expo-router";
import { useEffect } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function AboutScreen() {
  // Animation values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const translateY = useSharedValue(50);
  const logoRotate = useSharedValue(0);

  useEffect(() => {
    // Animate elements when screen loads
    opacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
    scale.value = withSpring(1, { damping: 12, stiffness: 100 });
    translateY.value = withSpring(0, { damping: 15, stiffness: 80 });

    // Animate logo rotation
    const spinLogo = () => {
      logoRotate.value = withDelay(
        1000,
        withSequence(
          withTiming(360, { duration: 8000, easing: Easing.linear }),
          withTiming(0, { duration: 0 }),
        ),
      );

      // Create continuous rotation
      setTimeout(spinLogo, 9000);
    };

    spinLogo();
  }, [opacity, scale, translateY, logoRotate]);

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
    };
  });

  const logoStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${logoRotate.value}deg` }],
    };
  });

  const handleOpenGithub = () => {
    Linking.openURL("https://github.com/DiluDevX/PhotoSticky");
  };

  return (
    <View style={styles.container}>
      <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.contentContainer, containerStyle]}>
            <Animated.View style={[styles.logoContainer, logoStyle]}>
              <Image
                source={require("@/assets/images/icon.png")}
                style={styles.logo}
              />
            </Animated.View>

            <Text style={styles.title}>PhotoSticky</Text>
            <Text style={styles.version}>Version 1.0.0</Text>

            <View style={styles.divider} />

            <Text style={styles.description}>
              A fun and easy-to-use app that lets you add stickers to your
              favorite photos. Double tap stickers to resize them and drag them
              around to position perfectly.
            </Text>

            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Ionicons name="image-outline" size={24} color="#3490dc" />
                <Text style={styles.featureText}>
                  Choose photos from your gallery
                </Text>
              </View>

              <View style={styles.featureItem}>
                <Ionicons name="happy-outline" size={24} color="#3490dc" />
                <Text style={styles.featureText}>Add fun emoji stickers</Text>
              </View>

              <View style={styles.featureItem}>
                <Ionicons name="save-outline" size={24} color="#3490dc" />
                <Text style={styles.featureText}>
                  Save your creations to gallery
                </Text>
              </View>
            </View>

            <View style={styles.buttonsContainer}>
              <Pressable style={styles.button} onPress={handleOpenGithub}>
                <Ionicons name="logo-github" size={20} color="#fff" />
                <Text style={styles.buttonText}>GitHub</Text>
              </Pressable>

              <Link href="/" asChild>
                <Pressable style={styles.button}>
                  <Ionicons name="arrow-back" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Go to Editor</Text>
                </Pressable>
              </Link>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>© 2025 PhotoSticky</Text>
              <Text style={styles.footerSubText}>
                Made with ❤️ using React Native
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </BlurView>
    </View>
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
  scrollContent: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  contentContainer: {
    width: width - 40,
    alignItems: "center",
    padding: 24,
    borderRadius: 24,
    backgroundColor: "rgba(40, 44, 52, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "rgba(0, 180, 216, 0.4)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  logoContainer: {
    width: 120,
    height: 120,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
    shadowColor: "rgba(0, 180, 216, 0.4)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textShadowColor: "rgba(0, 255, 255, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  version: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 24,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: 20,
  },
  description: {
    fontSize: 16,
    color: "#f0f0f0",
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 28,
  },
  featuresContainer: {
    width: "100%",
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  featureText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(52, 144, 220, 0.8)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 4,
  },
  footerSubText: {
    fontSize: 12,
    color: "#888",
  },
});
