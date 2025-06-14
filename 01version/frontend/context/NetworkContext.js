import React, { createContext, useState, useEffect } from 'react';
import { checkNetworkStatus } from '../utils/network';
import * as Network from 'expo-network';

export const NetworkContext = createContext();

export const NetworkProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Initial check
    checkNetworkStatus().then(status => setIsConnected(status));

    // Subscribe to network changes
    const unsubscribe = Network.addNetworkStateListener(state => {
      setIsConnected(state.isInternetReachable);
    });

    return () => unsubscribe();
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {children}
    </NetworkContext.Provider>
  );
};