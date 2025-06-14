import * as Network from 'expo-network';
import { Alert } from 'react-native';

export const checkNetworkStatus = async (showAlert = false) => {
  try {
    const status = await Network.getNetworkStateAsync();
    
    if (showAlert && !status.isInternetReachable) {
      Alert.alert(
        "No Internet Connection",
        "Please check your internet connection and try again."
      );
    }
    
    return status.isInternetReachable;
  } catch (error) {
    console.error("Network check error:", error);
    if (showAlert) {
      Alert.alert(
        "Network Error",
        "Unable to verify network connection. Some features may not work properly."
      );
    }
    return false;
  }
};