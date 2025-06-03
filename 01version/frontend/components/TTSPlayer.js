import { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { useAudioPlayer } from "expo-audio";
import { MaterialIcons } from "@expo/vector-icons";

const TTSComponent = ({ initialText = "" }) => {
  const [text, setText] = useState(initialText);
  const [loading, setLoading] = useState(false);
  const [audioUri, setAudioUri] = useState(null);
  const [status, setStatus] = useState("Enter text and press convert");
  const [selectedLanguage, setSelectedLanguage] = useState("en-IN");
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const player = useAudioPlayer(audioUri);

  const URI = "http://192.168.29.201:3000/api/v1/tts";

  const languages = [
    { code: "en-IN", name: "English (India) " },
    { code: "od-IN", name: "Odia" },
    { code: "hi-IN", name: "Hindi " },
    { code: "ta-IN", name: "Tamil " },
    { code: "te-IN", name: "Telugu " },
    { code: "kn-IN", name: "Kannada " },
    { code: "ml-IN", name: "Malayalam " },
    { code: "bn-IN", name: "Bengali " },
    { code: "gu-IN", name: "Gujarati " },
    { code: "mr-IN", name: "Marathi " },
    { code: "pa-IN", name: "Punjabi " },
  ];

  const fetchTTS = async () => {
    if (!text.trim()) {
      Alert.alert("Input Required", "Please enter some text to convert");
      setStatus("Waiting for input");
      return;
    }

    setLoading(true);
    setStatus("Processing your request...");

    try {
      const response = await fetch(URI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim(),
          target_language_code: selectedLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();

      if (!data.audios?.[0]) {
        throw new Error("No audio data received");
      }

      const timestamp = Date.now();
      const fileName = `tts-${timestamp}.wav`;
      const fileUri = FileSystem.cacheDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, data.audios[0], {
        encoding: FileSystem.EncodingType.Base64,
      });

      setAudioUri(fileUri);
      setStatus("Ready to play!");
    } catch (error) {
      console.error("TTS Error:", error);
      Alert.alert(
        "Conversion Error",
        error.message || "Failed to generate audio"
      );
      setStatus("Error: " + (error.message || "Conversion failed"));
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = async () => {
    if (!audioUri) return;

    try {
      setStatus("Playing audio...");
      player.play();
      setStatus("Audio playback complete");
    } catch (error) {
      console.error("Playback Error: ", error);
      setStatus("Playback failed");
    }
  };

  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
    setShowLanguageModal(false);
  };

  const getLanguageName = (code) => {
    const lang = languages.find(l => l.code === code);
    return lang ? lang.name : "Select Language";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Text-to-Speech Converter</Text>

      <TouchableOpacity
        style={styles.languageSelector}
        onPress={() => setShowLanguageModal(true)}
      >
        <Text style={styles.languageSelectorText}>
          {getLanguageName(selectedLanguage)}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="#2c3e50" />
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Type or paste your text here..."
        placeholderTextColor="#888"
        value={text}
        onChangeText={setText}
        multiline
        textAlignVertical="top"
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={fetchTTS}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <MaterialIcons name="volume-up" size={20} color="#fff" />
            <Text style={styles.buttonText}>Convert to Speech</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, !audioUri && styles.buttonDisabled]}
        onPress={handlePlay}
        disabled={!audioUri}
      >
        <MaterialIcons name="play-arrow" size={24} color="#fff" />
        <Text style={styles.buttonText}>Play Audio</Text>
      </TouchableOpacity>

      <View style={styles.statusContainer}>
        <MaterialIcons
          name={status.includes("Error") ? "error" : "info"}
          size={18}
          color={status.includes("Error") ? "#e74c3c" : "#555"}
        />
        <Text
          style={[
            styles.statusText,
            status.includes("Error") && styles.errorStatusText,
          ]}
        >
          {status}
        </Text>
      </View>

      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowLanguageModal(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Language</Text>
          <FlatList
            data={languages}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.languageItem,
                  selectedLanguage === item.code && styles.selectedLanguageItem,
                ]}
                onPress={() => handleLanguageSelect(item.code)}
              >
                <Text
                  style={[
                    styles.languageItemText,
                    selectedLanguage === item.code &&
                      styles.selectedLanguageItemText,
                  ]}
                >
                  {item.name}
                </Text>
                {selectedLanguage === item.code && (
                  <MaterialIcons name="check" size={20} color="#3498db" />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 20,
    textAlign: "center",
  },
  languageSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },
  languageSelectorText: {
    fontSize: 16,
    color: "#2c3e50",
  },
  input: {
    minHeight: 150,
    maxHeight: 250,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 15,
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: "#95a5a6",
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 10,
  },
  statusText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#555",
  },
  errorStatusText: {
    color: "#e74c3c",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
    textAlign: "center",
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedLanguageItem: {
    backgroundColor: "#f5f5f5",
  },
  languageItemText: {
    fontSize: 16,
    color: "#2c3e50",
  },
  selectedLanguageItemText: {
    fontWeight: "bold",
    color: "#3498db",
  },
});

export default TTSComponent;