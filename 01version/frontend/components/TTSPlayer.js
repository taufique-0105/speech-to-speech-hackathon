import { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { useAudioPlayer } from "expo-audio";

const TTSComponent = ({ defaultLanguage = "en-IN", initialText = "" }) => {
  const [text, setText] = useState(initialText);
  const [lang, setLang] = useState(defaultLanguage);
  const [loading, setLoading] = useState(false);
  const [audioUri, setAudioUri] = useState(null);
  const [status, setStatus] = useState("Waiting for input");

  const player = useAudioPlayer(audioUri);

  const URI = "http://<YOUR_IP_ADDRESS>:3000/api/v1/tts";

  const fetchTTS = async () => {
    if (!text.trim()) {
      Alert.alert("Please enter some text");
      setStatus("Waiting for input");
      return;
    }

    setLoading(true);
    setStatus("Sending request to server...");

    try {
      const response = await fetch(URI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, target_language_code: lang }),
      });

      const data = await response.json();

      if (!data.audios || !Array.isArray(data.audios) || !data.audios[0]) {
        throw new Error("No audio found in response");
      }

      const base64Audio = data.audios[0];

      const timestamp = Date.now();
      const fileName = `tts-audio-${timestamp}.wav`;
      const fileUri = FileSystem.cacheDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, base64Audio, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setAudioUri(fileUri);
      setStatus("Conversion successful, ready to play!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to generate or play audio.");
      setStatus("Error: Failed to convert");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter text to convert"
        value={text}
        onChangeText={setText}
        multiline
      />

      <Button
        title="Convert & Load TTS"
        onPress={fetchTTS}
        disabled={loading}
      />

      <View style={{ marginTop: 10 }}>
        <Button
          title="Play TTS Audio"
          onPress={() => player.play()}
          disabled={!audioUri}
        />
      </View>

      <Text style={styles.statusText}>{status}</Text>

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 20,
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    textAlignVertical: "top",
    marginBottom: 20,
  },
  statusText: {
    marginTop: 20,
    fontSize: 16,
    color: "#555",
    fontStyle: "italic",
  },
});

export default TTSComponent;
