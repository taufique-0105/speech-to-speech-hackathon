import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import {
  AudioModule,
  RecordingPresets,
  useAudioPlayer,
  useAudioRecorder,
  useAudioPlayerStatus,
} from "expo-audio";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const WaveAnimation = () => {
  const barHeights = [
    useRef(new Animated.Value(5)).current,
    useRef(new Animated.Value(5)).current,
    useRef(new Animated.Value(5)).current,
    useRef(new Animated.Value(5)).current,
    useRef(new Animated.Value(5)).current,
  ];

  useEffect(() => {
    barHeights.forEach((barHeight, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 100),
          Animated.timing(barHeight, {
            toValue: 20,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(barHeight, {
            toValue: 5,
            duration: 300,
            useNativeDriver: false,
          }),
        ])
      ).start();
    });

    return () => {
      barHeights.forEach((barHeight) => barHeight.stopAnimation());
    };
  }, []);

  const barStyle = {
    width: 3,
    backgroundColor: "white",
    marginHorizontal: 1,
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end", height: 24, marginLeft: 8 }}>
      {barHeights.map((height, index) => (
        <Animated.View key={index} style={[barStyle, { height }]} />
      ))}
    </View>
  );
};

const STSConverter = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUri, setAudioUri] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  const player = useAudioPlayer(null);
  const playerStatus = useAudioPlayerStatus(player);

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

  const playing = async (uri) => {
    try {
      if (currentlyPlaying === uri) {
        player.pause();
        setCurrentlyPlaying(null);
        return;
      }

      if (currentlyPlaying) {
        player.pause();
      }

      player.replace(uri);
      player.play();
      setCurrentlyPlaying(uri);
    } catch (error) {
      console.error("Playback error:", error);
      Alert.alert("Playback Error", "Failed to play the audio");
      setCurrentlyPlaying(null);
    }
  };

  useEffect(() => {
    const requestPermission = async () => {
      try {
        const status = await AudioModule.requestRecordingPermissionsAsync();
        setHasPermission(status.granted);
        if (!status.granted) {
          Alert.alert(
            "Permission Denied",
            "Microphone access is required for this app to work."
          );
        }
      } catch (error) {
        console.error("Permission error:", error);
        Alert.alert("Error", "Failed to request microphone permission.");
      }
    };

    requestPermission();

    return () => {
      if (isRecording) {
        audioRecorder.stop();
      }
      if (currentlyPlaying) {
        player.pause();
      }
    };
  }, []);

  const record = async () => {
    if (isRecording) {
      Alert.alert(
        "Already recording",
        "Please stop the current recording first."
      );
      return;
    }

    try {
      setIsLoading(false);
      setAudioUri(null);

      await audioRecorder.prepareToRecordAsync();
      await audioRecorder.record();
      setIsRecording(true);
    } catch (error) {
      console.error("Recording error:", error);
      Alert.alert(
        "Recording Failed",
        error.message || "Failed to start recording"
      );
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorder.stop();
      const uri = audioRecorder.uri;

      if (!uri) {
        throw new Error("No audio file was recorded");
      }

      setAudioUri(uri);
      setIsRecording(false);

      const newMessage = {
        id: Date.now().toString(),
        uri: uri,
        type: "sent",
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    } catch (error) {
      console.error("Stop recording error:", error);
      Alert.alert(
        "Recording Failed",
        error.message || "Failed to stop recording"
      );
    }
  };

  const speechToSpeech = async () => {
    if (!audioUri) {
      Alert.alert("No Audio", "Please record an audio file first.");
      return;
    }
    // const host = process.env.EXPO_PUBLIC_URL;
    // const API_URL = new URL("/api/v1/sts", host).toString();
    // console.log(API_URL);
    const API_URL = "http://15.206.61.50:3000/api/v1/sts"; // Replace with your actual API URL

    try {
      setIsLoading(true);
      console.log("Processing audio:", audioUri);

      const formData = new FormData();
      formData.append("audio", {
        uri: audioUri,
        type: "audio/wav",
        name: `recording-${Date.now()}.wav`,
      });

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Server responded with an error");
      }

      const data = await response.json();

      if (!data.audio) {
        throw new Error("No audio data received from the server");
      }
      const timestamp = Date.now();
      const fileName = `processed-${timestamp}.wav`;
      const fileUri = FileSystem.cacheDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, data.audio, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const newMessage = {
        id: Date.now().toString(),
        uri: fileUri,
        type: "received",
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
      console.log("Processed audio saved at", fileUri);
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert(
        "Processing Error",
        error.message || "Failed to process audio"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!playerStatus) return;

    setIsPlaying(playerStatus.playing);

    if (playerStatus.didJustFinish) {
      setCurrentlyPlaying(null);
      setIsPlaying(false);
    }
  }, [playerStatus]);

  const renderMessage = ({ item }) => {
    return (
      <View
        style={[
          styles.messageContainer,
          item.type === "sent" ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        <Pressable style={styles.playButton} onPress={() => playing(item.uri)}>
          <Ionicons
            name={currentlyPlaying === item.uri ? "pause" : "play"}
            size={24}
            color="white"
          />
        </Pressable>
        {currentlyPlaying === item.uri && <WaveAnimation />}
        <Text style={styles.messageTime}>
          {item.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={20} color="#000" />
      </Pressable>
      {hasPermission === false ? (
        <Text style={styles.errorText}>
          Microphone permission is required for this app to work.
        </Text>
      ) : (
        <>
          <Text style={styles.title}>Speech to Speech</Text>
          <Text style={styles.subtitle}>Record, convert, and play audio</Text>
          <View style={styles.messagesContainer}>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messagesList}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Welcome to Speech to Speech</Text>
                  <Text style={styles.emptySubText}>
                    Record your voice, and we’ll convert it to another speech.
                  </Text>
                  <Text style={styles.emptySubText}>
                    Start by pressing the microphone button below.
                  </Text>
                </View>
              }
            />
          </View>
          <View style={styles.mainButtonContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.recordButton,
                isRecording && styles.recordingButton,
                pressed && styles.buttonPressed,
                hasPermission === false && styles.disabledButton,
              ]}
              onPress={isRecording ? stopRecording : record}
              disabled={hasPermission === false}
            >
              <Ionicons
                name={isRecording ? "stop" : "mic"}
                size={32}
                color="white"
              />
              <Text style={styles.recordButtonText}>
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                styles.sendButton,
                (!audioUri || isRecording) && styles.disabledButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={speechToSpeech}
              disabled={!audioUri || isRecording || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Ionicons name="send" size={24} color="white" />
              )}
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  messagesContainer: {
    flex: 1,
    width: "100%",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 0,
    padding: 20,
  },
  messagesList: {
    paddingBottom: 20,
  },
  messageContainer: {
    maxWidth: "70%",
    padding: 12,
    borderRadius: 18,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#4263eb",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#7048e8",
  },
  playButton: {
    padding: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  messageTime: {
    color: "white",
    fontSize: 12,
    opacity: 0.8,
  },
  mainButtonContainer: {
    width: "100%",
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  recordButton: {
    backgroundColor: "#4263eb",
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  recordingButton: {
    backgroundColor: "#f03e3e",
  },
  recordButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  actionButton: {
    flex: 1,
    maxWidth: 80,
    paddingVertical: 15,
    borderRadius: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sendButton: {
    backgroundColor: "#37b24b",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.8,
  },
  errorText: {
    color: "#f03e3e",
    fontSize: 16,
    textAlign: "center",
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
});

export default STSConverter;