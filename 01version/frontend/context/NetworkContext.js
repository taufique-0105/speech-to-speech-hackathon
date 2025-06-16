import React, { createContext, useState, useEffect } from 'react';
import { checkNetworkStatus } from '../utils/network';
import NetInfo from '@react-native-community/netinfo';
import { AppState } from 'react-native';

export const NetworkContext = createContext();

export const NetworkProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState(true);

  const updateNetworkStatus = async () => {
    const status = await NetInfo.fetch();
    setIsConnected(status.isConnected);
    setIsInternetReachable(status.isInternetReachable);
  };

  useEffect(() => {
    // Initial check
    updateNetworkStatus();

    // Subscribe to network changes
    const unsubscribeNetInfo = NetInfo.addEventListener(updateNetworkStatus);

    // Subscribe to app state changes
    const unsubscribeAppState = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        updateNetworkStatus();
      }
    });

    return () => {
      unsubscribeNetInfo();
      unsubscribeAppState.remove();
    };
  }, []);

  return (
    <NetworkContext.Provider value={{ 
      isConnected, 
      isInternetReachable,
      refreshNetworkStatus: updateNetworkStatus 
    }}>
      {children}
    </NetworkContext.Provider>
  );
};