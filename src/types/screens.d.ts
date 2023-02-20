import { RouteProp } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/native-stack';

// export type ReturnMarkerDetailsProps = {

// };

export type RootStackParamList = {
  Home: {
    device_id: string;
    latitude: number;
    longitude: number;
    what3words: string;
  };
  MarkerDetails: {
    latitude: number,
    longitude: number
  };
};

export type HomeNavigationProps = StackScreenProps<RootStackParamList>;
export type MarkerDetailsNavigationProps = StackScreenProps<RootStackParamList, 'MarkerDetails'>;

export type HomeRouteProps = RouteProp<RootStackParamList, 'Home'>;
export type MarkerDetailsRouteProps = RouteProp<RootStackParamList, 'MarkerDetails'>;