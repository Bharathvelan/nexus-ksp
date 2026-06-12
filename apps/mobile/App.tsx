import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import VoiceCaptureScreen from './src/screens/VoiceCaptureScreen';
import CaseLookupScreen from './src/screens/CaseLookupScreen';
import PatrolScreen from './src/screens/PatrolScreen';
import ARScannerScreen from './src/screens/ARScannerScreen';
import DroneSwarmScreen from './src/screens/DroneSwarmScreen';
import { LanguageProvider, useLanguage } from './src/contexts/LanguageContext';
import { Button } from 'react-native';

const Stack = createNativeStackNavigator();

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  return (
    <Button 
      title={language === 'en' ? 'ಕನ್ನಡ' : 'English'} 
      color="#FFD700"
      onPress={() => setLanguage(language === 'en' ? 'kn' : 'en')} 
    />
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => <LanguageToggle />
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'NEXUS-KSP Field App' }}
        />
        <Stack.Screen 
          name="VoiceCapture" 
          component={VoiceCaptureScreen} 
          options={{ title: 'Voice Intelligence' }}
        />
        <Stack.Screen 
          name="CaseLookup" 
          component={CaseLookupScreen} 
          options={{ title: 'FIR Lookup' }}
        />
        <Stack.Screen 
          name="Patrol" 
          component={PatrolScreen} 
          options={{ title: 'AI Dispatch' }}
        />
        <Stack.Screen 
          name="ARScanner" 
          component={ARScannerScreen} 
          options={{ title: 'AR Crime Scene Scanner', headerShown: false }}
        />
        <Stack.Screen 
          name="DroneSwarm" 
          component={DroneSwarmScreen} 
          options={{ title: 'Tactical Swarm' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </LanguageProvider>
  );
}
