import { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./components/Home";
import TTSPlayer from "./components/TTSPlayer";
import STTConverter from "./components/STTConverter";
import Feedback from "./components/Feedback";

export default function App() {

  const Stack = createNativeStackNavigator();

  return (
      <View style={styles.appContainer}>
        <Header />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home}/>
            <Stack.Screen name="TTS" component={TTSPlayer}/>
            <Stack.Screen name="STT" component={STTConverter}/>
            <Stack.Screen name="Feedback" component={Feedback}/>
          </Stack.Navigator>
        </NavigationContainer>
        <Footer />
      </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flex: 1, // Takes remaining space
    paddingBottom: 16,
  },
  tabContainer: {
    flexDirection: "row",
    height: 50,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#f8f9fa",
  },
  activeTab: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  tabText: {
    fontSize: 14,
    color: "#6c757d",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#007AFF",
  },
});
