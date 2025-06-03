import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Animated,
  Easing
} from "react-native";

const { width } = Dimensions.get('window');

const Home = ({ navigation }) => {
  // Animation values
  const buttonScale = new Animated.Value(1);
  const logoOpacity = new Animated.Value(0);
  const buttonTranslateY = new Animated.Value(30);

  React.useEffect(() => {
    // Logo fade-in animation
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Button slide-up animation
    Animated.timing(buttonTranslateY, {
      toValue: 0,
      duration: 600,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Logo & App Name */}
        <View style={styles.headerContainer}>
          <Animated.Image
            source={require("../assets/download.png")}
            style={[styles.logo, { opacity: logoOpacity }]}
            resizeMode="contain"
          />
          <Animated.Text style={[styles.appName, { opacity: logoOpacity }]}>
            OdiaAudioGen
          </Animated.Text>
          <Text style={styles.tagline}>Your Odia Voice Assistant</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Animated.View style={{ 
            transform: [{ translateY: buttonTranslateY }],
            opacity: buttonTranslateY.interpolate({
              inputRange: [0, 30],
              outputRange: [1, 0]
            })
          }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={() => navigation.navigate("TTS")}
            >
              <Animated.View style={[
                styles.button, 
                styles.ttsButton,
                { transform: [{ scale: buttonScale }] }
              ]}>
                <Text style={styles.buttonText}>Text to Speech</Text>
                <Text style={styles.buttonSubtext}>Convert Odia text to natural speech</Text>
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ 
            transform: [{ translateY: buttonTranslateY }],
            opacity: buttonTranslateY.interpolate({
              inputRange: [0, 30],
              outputRange: [1, 0]
            })
          }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={() => navigation.navigate("STT")}
            >
              <Animated.View style={[
                styles.button, 
                styles.sttButton,
                { transform: [{ scale: buttonScale }] }
              ]}>
                <Text style={styles.buttonText}>Speech to Text</Text>
                <Text style={styles.buttonSubtext}>Transcribe Odia speech to text</Text>
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ 
            transform: [{ translateY: buttonTranslateY }],
            opacity: buttonTranslateY.interpolate({
              inputRange: [0, 30],
              outputRange: [1, 0]
            })
          }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={() => navigation.navigate("STS")}
            >
              <Animated.View style={[
                styles.button, 
                styles.stsButton,
                { transform: [{ scale: buttonScale }] }
              ]}>
                <Text style={styles.buttonText}>Speech to Speech</Text>
                <Text style={styles.buttonSubtext}>Convert Odia speech to different voice</Text>
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    paddingVertical: 40,
    minHeight: '100%',
  },
  headerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 15,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 5,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 30,
    marginBottom: 40,
  },
  button: {
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 15,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
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
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 5,
  },
  buttonSubtext: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
});

export default Home;