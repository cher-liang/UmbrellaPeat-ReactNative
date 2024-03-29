import React from 'react';
import { Appearance } from 'react-native'
import {
  Provider as PaperProvider,
  MD3LightTheme as LightTheme,
  MD3DarkTheme as DarkTheme,
} from 'react-native-paper';

import MD3OrangeLight from './src/assets/styles/OrangeLightTheme.json'
import MD3BlueDark from './src/assets/styles/BlueDarkTheme.json'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'

import App from './src/RootNavigator'

function getTheme() {
  if (Appearance.getColorScheme() == 'light') {
    return {
      ...LightTheme,
      colors: MD3OrangeLight
    }
  } else {
    return {
      ...DarkTheme,
      colors: MD3BlueDark
    }
  }
}

const theme = {
  ...LightTheme,
  colors: MD3OrangeLight
};

export default function UmbrellaPeat() {
  return (
    <PaperProvider
      theme={getTheme()}>
      <App />
    </PaperProvider>
  )
}

