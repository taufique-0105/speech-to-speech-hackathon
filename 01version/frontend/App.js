import React from "react";
import { View, StyleSheet, StatusBar, SafeAreaView } from "react-native";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./components/Home";
import TTSPlayer from "./components/TTSPlayer";
import STTConverter from "./components/STTConverter";
import Feedback from "./components/Feedback";
import STSConverter from "./components/STSConverter";
import { ThemeProvider } from "./context/ThemeContext";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.appContainer}>
          <NavigationContainer>
            <Header />
            <View style={styles.contentContainer}>
              <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                  headerShown: false,
                  animation: "fade",
                  gestureEnabled: true,
                }}
              >
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen
                  name="TTS"
                  component={TTSPlayer}
                  options={{ gestureDirection: "horizontal" }}
                />
                <Stack.Screen
                  name="STT"
                  component={STTConverter}
                  options={{ gestureDirection: "horizontal" }}
                />
                <Stack.Screen
                  name="Feedback"
                  component={Feedback}
                  options={{ presentation: "modal" }}
                />
                <Stack.Screen
                  name="STS"
                  component={STSConverter}
                  options={{ gestureDirection: "vertical" }}
                />
              </Stack.Navigator>
            </View>
          </NavigationContainer>
        </View>
      </SafeAreaView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  appContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flex: 1,
  },
  // Additional styles for future use
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
