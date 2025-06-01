import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { AudioModule, RecordingPresets, useAudioRecorder } from "expo-audio";

const STSConverter = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUri, setAudioUri] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const record = async () => {
    try {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      setIsRecording(true);
    } catch (error) {
      Alert.alert("Recording failed", error.message);
      console.error("Recording error:", error);
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
      console.log("Recording saved at", uri);
    } catch (error) {
      Alert.alert("Failed to stop recording", error.message);
      console.error("Stop recording error:", error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const status = await AudioModule.requestRecordingPermissionsAsync();
        setHasPermission(status.granted);
        if (!status.granted) {
          Alert.alert("Permission to access microphone was denied");
        }
      } catch (error) {
        console.error("Permission error:", error);
      }
    })();
  }, []);

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>Microphone permission is required for this app to work.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>STSConverter</Text>

      <Pressable
        style={styles.button}
        onPress={isRecording ? stopRecording : record}
        disabled={hasPermission === false}
      >
        <Text style={styles.buttonText}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Text>
      </Pressable>

      {/* {audioUri && <Text style={styles.uriText}>Recording saved </Text>} */}
    </View>
  );
};

export default STSConverter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  button: {
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  uriText: {
    marginTop: 20,
    color: "green",
  },
});
