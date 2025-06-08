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

  const playAudio = async () => {
    if (!player || !audioUri || isPlaying) return;

    try {
      setIsPlaying(true);
      player.play();
    } catch (error) {
      console.error("Playback error:", error);
      Alert.alert("Error", "Failed to play audio");
    } finally {
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
    formData.append('audio', {
      uri: uri,
      type: 'audio/wav',  // or 'audio/x-wav'
      name: 'recording.wav',
    });

    // Use the full URL from your environment variable directly
    const apiUrl = `${process.env.EXPO_PUBLIC_URL}/api/v1/stt`;
    console.log('API URL:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to convert speech to text');
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
      throw new Error('No transcription received from server');
    }
  } catch (error) {
    console.error('STT Error:', error);
    Alert.alert(
      'Conversion Error',
      error.message || 'Failed to convert speech to text'
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Speech to Text Converter</Text>

      <View style={styles.chatContainer}>
        {messages.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <MaterialIcons
              name="record-voice-over"
              size={80}
              color="#6200ee"
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>No recordings yet</Text>
            <Text style={styles.emptySubtitle}>Try these actions: </Text>

            <View style={styles.tipContainer}>
              <MaterialIcons name="mic" size={20} color="#6200ee" />
              <Text style={styles.tipText}>
                Press the red button to start recording
              </Text>
            </View>

            <View style={styles.tipContainer}>
              <MaterialIcons name="play-arrow" size={20} color="#6200ee" />
              <Text style={styles.tipText}>
                Play your recordings before converting
              </Text>
            </View>

            <View style={styles.samplePrompts}>
              <Text style={styles.sampleTitle}>Try saying:</Text>
              <View style={styles.promptBubble}>
                <Text style={styles.promptText}>
                  "What's the weather today?"
                </Text>
              </View>
              <View style={styles.promptBubble}>
                <Text style={styles.promptText}>
                  "Set a reminder for tomorrow"
                </Text>
              </View>
            </View>
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
                  {message.text + "  "}
                </Text>
                <Text style={styles.timestamp}>{message.timestamp}</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.recordButton, isRecording && styles.recordingActive]}
          onPress={isRecording ? stopRecording : record}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isRecording ? "⏹ Stop" : "🎤 Record"}
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.actionButton,
            (!audioUri || isPlaying) && styles.disabledButton,
          ]}
          onPress={playAudio}
          disabled={!audioUri || isPlaying || isLoading}
        >
          <Text style={styles.buttonText}>
            {isPlaying ? "🔊 Playing..." : "▶️ Play"}
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.actionButton,
            (!audioUri || isLoading) && styles.disabledButton,
          ]}
          onPress={() => speechToText(audioUri)}
          disabled={!audioUri || isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Processing..." : "🔊 Convert"}
          </Text>
        </Pressable>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.loadingText}>Processing audio...</Text>
        </View>
      )}
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
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chatContent: {
    paddingBottom: 16,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#6200ee",
    borderBottomRightRadius: 2,
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
  aiText: {
    color: "#333",
    fontSize: 16,
  },
  timestamp: {
    fontSize: 10,
    color: "#757575",
    marginTop: 4,
    textAlign: "right",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  recordButton: {
    backgroundColor: "#ff3b30",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    minWidth: 100,
    alignItems: "center",
  },
  recordingActive: {
    backgroundColor: "#d32f2f",
  },
  actionButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    minWidth: 100,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#9e9e9e",
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  loadingText: {
    marginTop: 16,
    color: "#fff",
    fontSize: 16,
  },
});

export default STTConverter;
