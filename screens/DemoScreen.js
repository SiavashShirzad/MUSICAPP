import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DemoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Demo Page</Text>
      <Text style={styles.description}>
        This is the demo page where you can showcase sample features of the app.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0f7fa",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00796b",
  },
  description: {
    fontSize: 16,
    color: "#004d40",
    textAlign: "center",
    marginTop: 10,
  },
});
