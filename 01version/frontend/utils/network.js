import NetInfo from '@react-native-community/netinfo';

export const checkNetworkStatus = async (showAlert = false) => {
  try {
    const status = await NetInfo.fetch();
    
    if (showAlert && !status.isInternetReachable) {
      Alert.alert(
        "No Internet Connection",
        "Please check your internet connection and try again."
      );
    }
    
    return {
      isConnected: status.isConnected,
      isInternetReachable: status.isInternetReachable
    };
  } catch (error) {
    console.error("Network check error:", error);
    if (showAlert) {
      Alert.alert(
        "Network Error",
        "Unable to verify network connection. Some features may not work properly."
      );
    }
    return {
      isConnected: false,
      isInternetReachable: false
    };
  }
};