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
import { LinearGradient } from 'expo-linear-gradient';
import Footer from './Footer';

const { width } = Dimensions.get('window');

const Home = ({ navigation }) => {
  // Animation values
  const buttonScale = new Animated.Value(1);
  const logoOpacity = new Animated.Value(0);
  const buttonTranslateY = new Animated.Value(30);
  const titleScale = new Animated.Value(0.9);

  React.useEffect(() => {
    // Logo fade-in animation
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(titleScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(buttonTranslateY, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
        delay: 200
      })
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
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
    <LinearGradient 
      colors={['#f9f9ff', '#eef2ff']} 
      style={styles.gradient}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Logo & App Name */}
          <View style={styles.headerContainer}>
            <Animated.Image
              source={require("../assets/download.png")}
              style={[styles.logo, { 
                opacity: logoOpacity,
                transform: [{ scale: logoOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1]
                })}]
              }]}
              resizeMode="contain"
            />
            <Animated.Text style={[
              styles.appName, 
              { 
                opacity: logoOpacity,
                transform: [{ scale: titleScale }]
              }
            ]}>
              OdishaVox
            </Animated.Text>
            <Animated.Text style={[
              styles.tagline, 
              { 
                opacity: logoOpacity,
                transform: [{ translateY: logoOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0]
                })}]
              }
            ]}>
              Your Odia Voice Companion
            </Animated.Text>
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
                activeOpacity={0.8}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => navigation.navigate("TTS")}
              >
                <LinearGradient
                  colors={['#4a6cf7', '#6a8eff']}
                  style={[styles.button, styles.buttonElevation]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <Text style={styles.buttonText}>Text to Speech</Text>
                    <Text style={styles.buttonSubtext}>Convert Odia text to natural speech</Text>
                  </Animated.View>
                </LinearGradient>
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
                activeOpacity={0.8}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => navigation.navigate("STT")}
              >
                <LinearGradient
                  colors={['#00b894', '#55efc4']}
                  style={[styles.button, styles.buttonElevation]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <Text style={styles.buttonText}>Speech to Text</Text>
                    <Text style={styles.buttonSubtext}>Transcribe Odia speech to text</Text>
                  </Animated.View>
                </LinearGradient>
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
                activeOpacity={0.8}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => navigation.navigate("STS")}
              >
                <LinearGradient
                  colors={['#ff7675', '#fd79a8']}
                  style={[styles.button, styles.buttonElevation]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <Text style={styles.buttonText}>Speech to Speech</Text>
                    <Text style={styles.buttonSubtext}>Convert Odia speech to different voice</Text>
                  </Animated.View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
        <Footer/>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between', // Add this
  },
  container: {
    flex: 1,
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 15,
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 10,
  },
  appName: {
    fontSize: 34,
    fontWeight: "800",
    color: "#2d3748",
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 16,
    color: "#4a5568",
    marginBottom: 30,
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  buttonContainer: {
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 22,
    paddingHorizontal: 25,
    borderRadius: 14,
    marginVertical: 10,
  },
  buttonElevation: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  buttonSubtext: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default Home;