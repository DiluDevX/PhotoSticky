import { Link, Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const NotFoundPage = () => {
  return (
    <>
      <Stack.Screen options={{ title: "oops, page not found!" }} />
      <View style={styles.container}>
        <Link href="/" style={styles.button}>
          Go back to the home screen
        </Link>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    fontSize: 18,
    color: "blue",
    marginTop: 20,
    textDecorationLine: "underline",
  },
});

export default NotFoundPage;
