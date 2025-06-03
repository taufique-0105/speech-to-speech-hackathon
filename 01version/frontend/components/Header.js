import { View, TouchableOpacity, Image, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const Header = () => {
	const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar></StatusBar>
      <View style={styles.headerContainer}>
        {/* Logo */}
        <View style={styles.logoWrapper}>
          <Image
            source={require('../assets/download.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Feedback Button */}
        <TouchableOpacity
          style={styles.feedbackButton}
          onPress={()=> navigation.navigate("Feedback")}
          activeOpacity={0.7}
        >
          <Ionicons name="chatbox-ellipses-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#073d5c',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 70,
    paddingHorizontal: 16,
    backgroundColor: '#073d5c',
    // ...Platform.select({
    //   ios: {
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 1 },
    //     shadowOpacity: 0.1,
    //     shadowRadius: 3,
    //   },
    //   android: {
    //     elevation: 4,
    //   },
    // }),
  },
  logoWrapper: {
    padding: 4,
    marginLeft: 4,
  },
  logoImage: {
    width: 50,
    height: 50,
  },
  feedbackButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
});

export default Header;
