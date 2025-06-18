import { View, Text, StyleSheet } from 'react-native';

const Footer = () => {
  return (
    <View style={styles.container}>
      {/* Main Footer Content */}
      <View style={styles.contentWrapper}>
        {/* Brand and Tagline */}
        <View style={styles.brandSection}>
          {/* <Text style={styles.brandText}>OdishaVox</Text> */}
          <Text style={styles.taglineText}>
            Empowering Voices, Connecting Odisha
          </Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Additional Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            © 2025 OdishaVox App. All rights reserved. </Text>
          <Text style={styles.infoText}> Version 0.1.0 </Text>
          {/* <Text style={styles.infoText}> Contact:  </Text> */}
          <Text style={styles.infoText}> Bhubaneswar, Odisha, India </Text>
        </View>
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <Text style={styles.bottomText}>
          Built with Passion for Odisha's Future
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  contentWrapper: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  // brandText: {
  //   fontSize: 24,
  //   fontWeight: 'bold',
  //   color: '#1a73e8',
  //   letterSpacing: 0.5,
  // },
  taglineText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  infoSection: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#6c757d',
    marginVertical: 2,
    textAlign: 'center',
  },
  bottomBar: {
    backgroundColor: '#1a73e8',
    paddingVertical: 8,
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
});

export default Footer;