import React from 'react';
import { Appearance } from 'react-native'

import { NavigationContainer, DefaultTheme, DarkTheme as DTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { adaptNavigationTheme, useTheme } from 'react-native-paper';

import PeatMap_Home from './screens/PeatMap_Home'
import MarkerDetails from './screens/MarkerDetails';

import type { RootStackParamList } from './types/screens';

const Stack = createNativeStackNavigator<RootStackParamList>();
const { LightTheme } = adaptNavigationTheme({
    reactNavigationLight: DefaultTheme,
});
const { DarkTheme } = adaptNavigationTheme({
    reactNavigationDark: DTheme,

})
export default function Root() {

    return (
        <NavigationContainer
            theme={DarkTheme || LightTheme}>
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

