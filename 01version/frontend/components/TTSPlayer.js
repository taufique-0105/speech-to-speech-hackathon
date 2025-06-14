import { useState, useRef, useEffect } from "react";
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
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { useAudioPlayer } from "expo-audio";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const TTSComponent = ({ initialText = "" }) => {
  const [text, setText] = useState(initialText);
  const [loading, setLoading] = useState(false);
  const [audioUri, setAudioUri] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en-IN");
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  const player = useAudioPlayer(audioUri);

  const languages = [
    { code: "en-IN", name: "English (India)" },
    { code: "od-IN", name: "Odia" },
    { code: "hi-IN", name: "Hindi" },
    { code: "ta-IN", name: "Tamil" },
    { code: "te-IN", name: "Telugu" },
    { code: "kn-IN", name: "Kannada" },
    { code: "ml-IN", name: "Malayalam" },
    { code: "bn-IN", name: "Bengali" },
    { code: "gu-IN", name: "Gujarati" },
    { code: "mr-IN", name: "Marathi" },
    { code: "pa-IN", name: "Punjabi" },
  ];

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const fetchTTS = async () => {
    if (!text.trim()) {
      Alert.alert("Input Required", "Please enter some text to convert");
      return;
    }

    setLoading(true);
    // const host = process.env.EXPO_PUBLIC_URL;
    // const URI = new URL("/api/v1/tts", host).toString();
    const URI = "http://15.206.61.50:3000/api/v1/tts"; // Replace with your actual API URL

    try {
      const newUserMessage = {
        id: Date.now(),
        text: text.trim(),
        isUser: true,
        language: getLanguageName(selectedLanguage),
      };
      setMessages((prev) => [...prev, newUserMessage]);

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

      const newSystemMessage = {
        id: Date.now() + 1,
        text: `Audio generated in ${getLanguageName(selectedLanguage)}`,
        isUser: false,
        audioUri: fileUri,
      };
      setMessages((prev) => [...prev, newSystemMessage]);

      setText("");
    } catch (error) {
      console.error("TTS Error:", error);
      Alert.alert(
        "Conversion Error",
        error.message || "Failed to generate audio"
      );

      const errorMessage = {
        id: Date.now() + 1,
        text: "Failed to generate audio",
        isUser: false,
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = async (uri) => {
    if (!uri) return;

    try {
      player.replace(uri);
      player.play();
    } catch (error) {
      console.error("Playback Error: ", error);
    }
  };

  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
    setShowLanguageModal(false);
  };

  const getLanguageName = (code) => {
    const lang = languages.find((l) => l.code === code);
    return lang ? lang.name : "Select Language";
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessage : styles.systemMessage,
        item.isError && styles.errorMessage,
      ]}
    >
      {!item.isUser && !item.isError && (
        <Text style={styles.languageTag}>{item.text}</Text>
      )}

      {item.isUser ? (
        <>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.languageTag}>{item.language}</Text>
        </>
      ) : item.isError ? (
        <Text style={styles.messageText}>{item.text}</Text>
      ) : (
        <TouchableOpacity
          style={styles.playMessageButton}
          onPress={() => handlePlay(item.audioUri)}
        >
          <MaterialIcons name="play-circle-filled" size={24} color="#2ecc71" />
          <Text style={styles.playMessageText}>Play Audio</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={20} color="#000" />
      </Pressable>
      <View style={styles.mainContent}>
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

        <View style={styles.displayContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.messagesList}
          />
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
                    selectedLanguage === item.code &&
                      styles.selectedLanguageItem,
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

      <View style={[styles.inputWrapper]}>
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
          style={[styles.sendButton, loading && styles.buttonDisabled]}
          onPress={fetchTTS}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <MaterialIcons name="send" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
  },
  mainContent: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
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
  displayContainer: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
  },
  messagesList: {
    paddingBottom: 10,
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#3498db",
    borderTopRightRadius: 0,
  },
  systemMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderTopLeftRadius: 0,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  errorMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#ffecec",
    borderColor: "#ffb3b3",
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
  },
  languageTag: {
    fontSize: 12,
    color: "#7f8c8d",
    marginTop: 4,
  },
  playMessageButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  playMessageText: {
    marginLeft: 5,
    color: "#2c3e50",
    fontWeight: "bold",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  input: {
    flex: 1,
    minHeight: 50,
    maxHeight: 150,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#fff",
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3498db",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#95a5a6",
    opacity: 0.7,
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