import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen'

import type { RootStackParamList } from './src/types/screens';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function App() {

  return (
    <NavigationContainer>
      <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
        <RootStack.Group>
          <RootStack.Screen name="Home" component={HomeScreen} />
          {/* <RootStack.Screen name="Details" component={DetailsScreen} /> */}
        </RootStack.Group>
        {/* <RootStack.Group screenOptions={{ presentation: 'modal' }}>
          <RootStack.Screen name="MyModal" component={ModalScreen} />
        </RootStack.Group> */}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

