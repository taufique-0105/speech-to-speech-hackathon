import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React from "react";

const Home = ({ navigation }) => {
  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Logo & App Name */}
        <View style={styles.headerContainer}>
          <Image
            source={require("../assets/download.png")} // Update with your actual logo path
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>OdiaAudioGen</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.ttsButton]}
            onPress={() => navigation.navigate("TTS")}
          >
            <Text style={styles.buttonText}>Text to Speech</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.sttButton]}
            onPress={() => navigation.navigate("STT")}
          >
            <Text style={styles.buttonText}>Speech to Text</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.stsButton]}
            onPress={() => navigation.navigate("STS")}
          >
            <Text style={styles.buttonText}>Speech to Speech</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  headerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  appName: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 10,
  },
  buttonContainer: {
    paddingHorizontal: 40,
    marginBottom: 60,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ttsButton: {
    backgroundColor: "#007AFF",
  },
  sttButton: {
    backgroundColor: "#34C759",
  },
  stsButton: {
    backgroundColor: "#FF9500",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
