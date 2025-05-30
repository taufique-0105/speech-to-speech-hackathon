import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Footer = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>© 2025 OdishaVox App. All rights reserved. </Text>
      <View style={styles.socialContainer}>
        <Ionicons name="logo-github" size={20} color="#6c757d" />
        <Ionicons name="logo-twitter" size={20} color="#6c757d" style={styles.icon} />
        <Ionicons name="logo-linkedin" size={20} color="#6c757d" />
      </View>
      <Text style={styles.text}>Version 1.0.0 </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    color: '#6c757d',
    marginVertical: 4,
  },
  socialContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  icon: {
    marginHorizontal: 15,
  },
});

export default Footer;