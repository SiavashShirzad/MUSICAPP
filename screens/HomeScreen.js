import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the App</Text>
      <Text style={styles.subtitle}>Navigate to explore:</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Go to Demo"
          onPress={() => navigation.navigate("Demo")}
          color="#80cbc4"
        />
        <Button
          title="Go to Live"
          onPress={() => navigation.navigate("Live")}
          color="#80cbc4"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0f2f1",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#004d40",
  },
  subtitle: {
    fontSize: 18,
    color: "#004d40",
    marginVertical: 10,
  },
  buttonContainer: {
    marginTop: 20,
    width: "80%",
    justifyContent: "space-between",
    flexDirection: "row",
  },
});
