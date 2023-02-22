import React from 'react';

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PeatMap_Home from './screens/PeatMap_Home'
import MarkerDetails from './screens/MarkerDetails';

import type { RootStackParamList } from './types/screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Root() {

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}>
                <Stack.Group>
                    <Stack.Screen name="Home" component={PeatMap_Home} />
                </Stack.Group>
                <Stack.Group screenOptions={{ presentation: 'modal' }}>
                    <Stack.Screen name="MarkerDetails" component={MarkerDetails} />
                </Stack.Group>
            </Stack.Navigator>

        </NavigationContainer>
    );
}

