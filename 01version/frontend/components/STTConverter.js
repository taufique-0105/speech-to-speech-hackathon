import { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import {
  useAudioRecorder,
  RecordingOptions,
  AudioModule,
  RecordingPresets,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import { MaterialIcons } from "@expo/vector-icons";

const STTConverter = () => {
  const scrollViewRef = useRef();

  const recordingOptions = {
    ...RecordingPresets.HIGH_QUALITY,
    extension: ".wav",
    outputFormat: "wav",
    audioQuality: "high",
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 128000,
  };

  const audioRecorder = useAudioRecorder(recordingOptions);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUri, setAudioUri] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [messages, setMessages] = useState([]);

  const record = async () => {
    try {
      setIsPlaying(false);
      setAudioUri(null);
      setIsLoading(false);
      player.pause();
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      setIsRecording(true);
    } catch (error) {
      console.error("Recording error:", error);
      Alert.alert("Error", "Failed to start recording");
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorder.stop();
      setAudioUri(audioRecorder.uri);
      console.log("Recording stopped, audio URI:", audioRecorder.uri);
      setIsRecording(false);
    } catch (error) {
      console.error("Stop recording error:", error);
      Alert.alert("Error", "Failed to stop recording");
    }
  };

  const player = useAudioPlayer(audioUri);
  const playerStatus = useAudioPlayerStatus(player);

  const playAudio = async () => {
    if (!player || !audioUri) return;

    try {
      if (isPlaying) {
        await player.pause();
      } else {
        // If at end of audio, restart from beginning
        if (playerStatus?.position === playerStatus?.duration) {
          await player.seekTo(0);
        }
        await player.play();
      }
      // Let the useEffect handle the state update based on playerStatus
    } catch (error) {
      console.error("Playback error:", error);
      Alert.alert("Error", "Failed to play audio");
      setIsPlaying(false);
    }
  };

  const speechToText = async (uri) => {
    if (!uri) {
      Alert.alert("Error", "No audio recording available");
      return;
    }

    try {
      setIsLoading(true);
      setTranscription("");

      // Create form data
      const formData = new FormData();
      formData.append("audio", {
        uri: uri,
        type: "audio/wav", // or 'audio/x-wav'
        name: "recording.wav",
      });

      // Use the full URL from your environment variable directly
      const apiUrl = `${process.env.EXPO_PUBLIC_URL}/api/v1/stt`;
      console.log("API URL:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to convert speech to text"
        );
      }

      const data = await response.json();

      if (data.transcript) {
        const newMessage = {
          id: Date.now().toString(),
          text: data.transcript,
          isUser: false,
          timestamp: new Date().toLocaleTimeString(),
        };

        setMessages((prev) => [...prev, newMessage]);
        setTranscription(data.transcript);
      } else {
        throw new Error("No transcription received from server");
      }
    } catch (error) {
      console.error("STT Error:", error);
      Alert.alert(
        "Conversion Error",
        error.message || "Failed to convert speech to text"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const status = await AudioModule.requestRecordingPermissionsAsync();
        if (mounted && !status.granted) {
          Alert.alert("Permission Denied", "Microphone access is required");
        }
      } catch (error) {
        console.error("Permission error:", error);
      }
    })();

    return () => {
      mounted = false;
      // Cleanup audio resources
      audioRecorder?.stopAndUnloadAsync?.();
      player?.stopAsync?.();
    };
  }, []);

  useEffect(() => {
    if (!playerStatus) return;
    setIsPlaying(playerStatus.playing);
    if (playerStatus.didJustFinish) {
      setIsPlaying(false);
    }
  }, [playerStatus]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Speech to Text Converter</Text>
      <View style={styles.chatContainer}>
        {messages.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <MaterialIcons
              name="mic"
              size={48}
              color="#6200ee"
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptySubtitle}>
              Press the{" "}
              <Text style={styles.highlightText}>microphone button</Text> below
              to begin
            </Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.chatContent}
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.isUser ? styles.userBubble : styles.aiBubble,
                ]}
              >
                <Text style={message.isUser ? styles.userText : styles.aiText}>
                  {message.text}
                </Text>
                <Text style={styles.timestamp}>{message.timestamp}</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.recordButton,
            isRecording && styles.recordingActive,
            pressed && styles.buttonPressed,
          ]}
          onPress={isRecording ? stopRecording : record}
          disabled={isLoading}
        >
          <MaterialIcons
            name={isRecording ? "stop" : "mic"}
            size={24}
            color="#fff"
          />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            (!audioUri || isLoading) && styles.disabledButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={playAudio}
          disabled={!audioUri || isLoading}
        >
          <MaterialIcons
            name={isPlaying ? "pause" : "play-arrow"}
            size={24}
            color="#6200ee"
          />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            (!audioUri || isLoading) && styles.disabledButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => speechToText(audioUri)}
          disabled={!audioUri || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#6200ee" />
          ) : (
            <MaterialIcons name="send" size={24} color="#6200ee" />
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyIcon: {
    opacity: 0.2,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6200ee",
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#757575",
    marginBottom: 20,
  },
  tipContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    width: "100%",
    paddingHorizontal: 20,
  },
  tipText: {
    marginLeft: 10,
    color: "#333",
    fontSize: 14,
  },
  samplePrompts: {
    marginTop: 30,
    width: "100%",
  },
  sampleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6200ee",
    marginBottom: 10,
    textAlign: "center",
  },
  promptBubble: {
    backgroundColor: "#f0e5ff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  promptText: {
    color: "#6200ee",
    fontStyle: "italic",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    color: "#333",
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  highlightText: {
    fontWeight: "600",
    color: "#6200ee",
  },
  chatContent: {
    padding: 16,
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    maxWidth: "80%",
  },
  userBubble: {
    backgroundColor: "#6200ee",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: "#f5f5f5",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  userText: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 20,
  },
  aiText: {
    color: "#333",
    fontSize: 15,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
    textAlign: "right",
  },
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#e0e0e0",
    borderBottomLeftRadius: 2,
  },
  userText: {
    color: "#fff",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    gap: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  recordButton: {
    backgroundColor: "#6200ee",
    width: 100,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  recordingActive: {
    backgroundColor: "#d32f2f",
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
  },
});

export default STTConverter;
