import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { LogBox } from "react-native";

// Ignore specific harmless warnings to improve DX
LogBox.ignoreLogs(["Reanimated 2", "Failed prop type", "ViewPropTypes"]);

export default function RootLayout() {
  // Load custom fonts
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    // Keep splash screen visible while we fetch resources
    if (fontsLoaded || fontError) {
      // Hide the splash screen after a short delay to allow animations to start
      const timer = setTimeout(() => {
        SplashScreen.hideAsync();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, fontError]);

  // Show the splash screen if the fonts haven't loaded and there was no error
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
          animation: "fade",
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
