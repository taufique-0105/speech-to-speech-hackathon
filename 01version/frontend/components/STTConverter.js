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
import { useNavigation } from "@react-navigation/native";

const STTConverter = () => {
  const scrollViewRef = useRef();
  const navigation = useNavigation();

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
  const [messages, setMessages] = useState([]);
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const [currentAudioUri, setCurrentAudioUri] = useState(null);

  const player = useAudioPlayer();
  const playerStatus = useAudioPlayerStatus(player);

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

  const playMessageAudio = async (messageId, messageAudioUri) => {
    try {
      if (playingMessageId === messageId) {
        await player.pause();
        setPlayingMessageId(null);
      } else {
        if (isPlaying || playingMessageId) {
          await player.pause();
        }
        if (currentAudioUri !== messageAudioUri) {
          await player.replace(messageAudioUri);
          setCurrentAudioUri(messageAudioUri);
        }
        await player.play();
        setPlayingMessageId(messageId);
      }
    } catch (error) {
      console.error("Message audio playback error:", error);
      Alert.alert("Error", "Failed to play audio message");
    }
  };

  const speechToText = async (uri) => {
    if (!uri) {
      Alert.alert("Error", "No audio recording available");
      return;
    }
    try {
      setIsLoading(true);
      const audioMessage = {
        id: `audio_${Date.now()}`,
        audioUri: uri,
        isUser: true,
        isAudio: true,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, audioMessage]);

      const formData = new FormData();
      formData.append("audio", {
        uri: uri,
        type: "audio/wav",
        name: "recording.wav",
      });

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
        throw new Error(errorData.message || "Failed to convert speech to text");
      }

      const data = await response.json();
      if (data.transcript) {
        const textMessage = {
          id: `text_${Date.now()}`,
          text: data.transcript,
          isUser: false,
          isAudio: false,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, textMessage]);
      } else {
        throw new Error("No transcription received from server");
      }
    } catch (error) {
      console.error("STT Error:", error);
      Alert.alert("Conversion Error", error.message || "Failed to convert speech to text");
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
      audioRecorder?.stopAndUnloadAsync?.();
      player?.stopAsync?.();
    };
  }, []);

  useEffect(() => {
    if (!playerStatus) return;
    setIsPlaying(playerStatus.playing);
    if (playerStatus.didJustFinish) {
      setIsPlaying(false);
      setPlayingMessageId(null);
    }
  }, [playerStatus]);

  const renderMessage = (message) => {
    if (message.isAudio) {
      return (
        <View
          key={message.id}
          style={[styles.messageBubble, message.isUser ? styles.userBubble : styles.aiBubble]}
        >
          <View style={styles.audioMessageContainer}>
            <Pressable
              style={[
                styles.audioPlayButton,
                playingMessageId === message.id && styles.playingButton,
              ]}
              onPress={() => playMessageAudio(message.id, message.audioUri)}
            >
              <MaterialIcons
                name={playingMessageId === message.id ? "pause" : "play-arrow"}
                size={20}
                color={message.isUser ? "#fff" : "#6200ee"}
              />
            </Pressable>
            <View style={styles.audioInfo}>
              <MaterialIcons
                name="keyboard-voice"
                size={20}
                color={message.isUser ? "#fff" : "#6200ee"}
                style={styles.audioIcon}
              />
              <Text style={[styles.audioLabel, { color: message.isUser ? "#fff" : "#666" }]}>
                Voice message
              </Text>
            </View>
          </View>
          <Text style={styles.timestamp}>{message.timestamp}</Text>
        </View>
      );
    } else {
      return (
        <View
          key={message.id}
          style={[styles.messageBubble, message.isUser ? styles.userBubble : styles.aiBubble]}
        >
          <Text style={message.isUser ? styles.userText : styles.aiText}>{message.text}</Text>
          <Text style={styles.timestamp}>{message.timestamp}</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={20} color="#000" />
      </Pressable>
      <Text style={styles.title}>Speech to Text Converter</Text>
      <View style={styles.chatContainer}>
        {messages.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <MaterialIcons name="mic" size={48} color="#6200ee" style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptySubtitle}>
              Press the <Text style={styles.highlightText}>microphone button</Text> below to begin
            </Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.chatContent}
            ref={scrollViewRef}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map(renderMessage)}
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
          <MaterialIcons name={isRecording ? "stop" : "mic"} size={24} color="#fff" />
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            (!audioUri || isLoading) && styles.disabledButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => speechToText(audioUri)}
          disabled={isPlaying || isRecording}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <MaterialIcons name="send" size={30} color="#fff" />
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
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
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
  highlightText: {
    fontWeight: "600",
    color: "#6200ee",
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
    overflow: "hidden",
    elevation: 2,
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
    backgroundColor: "#f0f0f0",
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
  audioMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 160,
  },
  audioPlayButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  playingButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  audioInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  audioIcon: {
    marginRight: 8,
  },
  audioLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    gap: 24,
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
    elevation: 4,
  },
  recordingActive: {
    backgroundColor: "#d32f2f",
  },
  actionButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
  },
});

export default STTConverter;