import { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, Text, Alert, ActivityIndicator } from "react-native";
import {
  useAudioRecorder,
  RecordingOptions,
  AudioModule,
  RecordingPresets,
  useAudioPlayer,
} from "expo-audio";

const STTConverter = () => {

  const URL = "http://192.168.29.91:3000/api/v1/stt";

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUri, setAudioUri] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    setIsRecording(true);
  };

  const stopRecording = async () => {
    // The recording will be available on `audioRecorder.uri`.
    await audioRecorder.stop();
    setAudioUri(audioRecorder.uri);
    console.log("Recording stopped, audio URI:", audioRecorder.uri);
    setIsRecording(false);
  };

  const player = useAudioPlayer(audioUri);

  const playAudio = async () => {
    if (!player || !audioUri) return;
    setIsPlaying(true);
    player.play();
    setIsPlaying(false); // reset after playback ends
  };

  const speechToText = async (uri) => {
    if (!uri) {
      Alert.alert("No audio URI provided for speech-to-text conversion.");
      return;
    }
    console.log("Converting audio to text:", uri);
    try {
      setIsLoading(true);
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audio: uri }),
      });
    }
    catch (error) {
      Alert.alert(
        "Error converting audio to text",
        "Please check the console for more details."
      );
    }
  }

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission to access microphone was denied");
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={isRecording ? stopRecording : record}
      >
        <Text style={styles.buttonText}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Text>
      </Pressable>
      <Pressable
        style={[styles.button, !audioUri && styles.disabledButton]}
        onPress={playAudio}
        disabled={!audioUri || isPlaying}
      >
        <Text style={styles.buttonText}>Play Recording</Text>
      </Pressable>
      <Pressable
        style={[styles.button, !audioUri && styles.disabledButton]}
        onPress={() => {
          if (!audioUri) return;
          console.log("Converting audio to text:", audioUri);
          speechToText(audioUri);
        }}
        disabled={!audioUri}
      >
        <Text style={styles.buttonText}>Convert </Text>
      </Pressable>
      { isLoading && <ActivityIndicator size='large' color='#00ff00'/>}
      
    </View>
  );
};

export default STTConverter;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 10,
  },
  button: {
    marginVertical: 10,
    padding: 12,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
});
