import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../context/ThemeContext";
import * as Haptics from "expo-haptics";

const Feedback = () => {
  const { isDarkTheme } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 0,
    message: "",
  });
  const [errors, setErrors] = useState({});

  const handleFieldFocus = async () => {
    try {
      await Haptics.selectionAsync();
    } catch (error) {
      console.log("Haptic error:", error);
    }
  };

  const handleFieldBlur = async () => {
    try {
      await Haptics.selectionAsync();
    } catch (error) {
      console.log("Haptic error:", error);
    }
  };

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.message.trim()) {
      newErrors.message = "Feedback message is required";
      valid = false;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    const host = process.env.EXPO_PUBLIC_URL;
    const URI = new URL("/api/v1/feedback/submit", host).toString();
    console.log(URI);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      if (validateForm()) {
        const response = await fetch(URI, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to submit feedback");
        }

        Alert.alert(
          "Thank You!",
          result.message || "Feedback submitted successfully",
          [{ text: "OK", onPress: () => resetForm() }]
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to submit feedback. Please try again."
      );
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      rating: 0,
      message: "",
    });
    setErrors({});
  };

  const handleStarPress = async (rating) => {
    try {
      await Haptics.selectionAsync();
      handleChange("rating", rating);
    } catch (error) {
      console.log("Haptic error:", error);
    }
  };

  const renderStarRating = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleStarPress(i)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={i <= formData.rating ? "star" : "star-outline"}
            size={32}
            color={
              i <= formData.rating ? "#FFD700" : isDarkTheme ? "#666" : "#ccc"
            }
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  // Dynamic styles based on theme
  const dynamicStyles = {
    container: {
      backgroundColor: isDarkTheme ? "#121212" : "#f5f5f5",
    },
    card: {
      backgroundColor: isDarkTheme ? "#1E1E1E" : "#fff",
    },
    text: {
      color: isDarkTheme ? "#fff" : "#333",
    },
    input: {
      color: isDarkTheme ? "#fff" : "#333",
      borderColor: isDarkTheme ? "#444" : "#ddd",
    },
    label: {
      color: isDarkTheme ? "#aaa" : "#666",
    },
    error: {
      color: "#ff4444",
    },
  };

  return (
    <ScrollView
      style={[styles.container, dynamicStyles.container]}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.card, dynamicStyles.card, styles.formContainer]}>
        <Text style={[styles.title, dynamicStyles.text]}>
          Share Your Feedback
        </Text>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, dynamicStyles.label]}>
            Your Name (Optional)
          </Text>
          <TextInput
            style={[styles.input, dynamicStyles.input]}
            placeholder="John Doe"
            placeholderTextColor={isDarkTheme ? "#555" : "#999"}
            value={formData.name}
            onChangeText={(text) => handleChange("name", text)}
            onFocus={handleFieldFocus}
            onBlur={handleFieldBlur}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, dynamicStyles.label]}>
            Email (Optional)
          </Text>
          <TextInput
            style={[
              styles.input,
              dynamicStyles.input,
              errors.email && styles.errorInput,
            ]}
            placeholder="your@email.com"
            placeholderTextColor={isDarkTheme ? "#555" : "#999"}
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
            onFocus={handleFieldFocus}
            onBlur={handleFieldBlur}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, dynamicStyles.label]}>
            How would you rate our app?
          </Text>
          <View style={styles.ratingContainer}>{renderStarRating()}</View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, dynamicStyles.label]}>
            Your Feedback*
          </Text>
          <TextInput
            style={[
              styles.input,
              styles.messageInput,
              dynamicStyles.input,
              errors.message && styles.errorInput,
            ]}
            placeholder="Tell us what you think..."
            placeholderTextColor={isDarkTheme ? "#555" : "#999"}
            multiline
            numberOfLines={4}
            value={formData.message}
            onChangeText={(text) => handleChange("message", text)}
            onFocus={handleFieldFocus}
            onBlur={handleFieldBlur}
          />
          {errors.message && (
            <Text style={styles.errorText}>{errors.message}</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  formContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  messageInput: {
    height: 120,
    textAlignVertical: "top",
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 5,
  },
  errorInput: {
    borderColor: "#ff4444",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Feedback;
