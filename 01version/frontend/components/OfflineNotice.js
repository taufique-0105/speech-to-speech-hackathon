// components/OfflineNotice.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NetworkContext } from '../context/NetworkContext';

const OfflineNotice = () => {
  const { isConnected } = useContext(NetworkContext);

  if (isConnected) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>No Internet Connection</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#b52424',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  text: {
    color: 'white',
  },
});

export default OfflineNotice;