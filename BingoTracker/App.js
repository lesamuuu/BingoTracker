import React from 'react';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './Screens/HomeScreen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['top', 'bottom', 'right', 'left']} style={{ flex: 1 }}>
          <HomeScreen />
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};