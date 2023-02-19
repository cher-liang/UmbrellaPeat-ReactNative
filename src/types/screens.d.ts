import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  MarkerDetails: {
    latitude: number,
    longtitude: number
  };
};

export type HomeNavigationProps = NativeStackScreenProps<RootStackParamList>;
export type MarkerDetailsNavigationProps = NativeStackScreenProps<RootStackParamList, 'Home'>;