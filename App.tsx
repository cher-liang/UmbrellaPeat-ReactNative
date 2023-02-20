import React from 'react';
import { Platform } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen'
import MarkerDetails from './src/screens/MarkerDetails';

import type { RootStackParamList } from './src/types/screens';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function App() {

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          // gestureEnabled: true,
          // ...Platform.select({
          //   android: {
          //     ...TransitionPresets.ModalPresentationIOS,
          //   }
          // })
        }}>
        <RootStack.Group>
          <RootStack.Screen name="Home" component={HomeScreen} />
        </RootStack.Group>
        <RootStack.Group screenOptions={{ presentation: 'modal'}}>
          <RootStack.Screen name="MarkerDetails" component={MarkerDetails} />
        </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

