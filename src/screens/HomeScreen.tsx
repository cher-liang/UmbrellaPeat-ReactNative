import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import {MapMarkerProps } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MapView from '../components/MapView';
import MapButtons from '../components/MapButtons';
import appConfig from '../../app.json';
import get3Words from '../services/What3Words';
import hasMessage from '../utils/CatchErrorMessage';

const HomeScreen = () => {
// export default function HomeScreen() {
  const [location, setLocation] = useState<GeoPosition | null>(null);
  const [markers, setMarkers] = useState<MapMarkerProps[]>([]);
  const [count, setCount] = useState(0); // temporary

  const watchId = useRef<number | null>(null);

  useEffect(() => {
    loadMarkers();
    getLocationUpdates();
  }, []);

  const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
        '',
        [
          { text: 'Go to Settings', onPress: openSetting },
          { text: "Don't Use Location", onPress: () => { } },
        ],
      );
    }

    return false;
  };

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        setLocation(position);
        console.log(position);
      },
      error => {
        Alert.alert(`Code ${error.code}`, error.message);
        setLocation(null);
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
      },
    );
  };

  const getLocationUpdates = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    if (watchId.current !== null) {
      Geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }

    watchId.current = Geolocation.watchPosition(
      position => {
        setLocation(position);
        // console.log(position);
      },
      error => {
        setLocation(null);
        console.error(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        distanceFilter: 0,
        interval: 5000,
        fastestInterval: 2000,
      },
    );
  };

  const addMarker = async () => {
    await getLocation();
    const threeWords = await get3Words(location?.coords.latitude!, location?.coords.longitude!);
    const marker = {
      title: 'test', // Placeholder
      description: threeWords,
      coordinate: location?.coords
    };
    setMarkers(markers.concat(
      marker as MapMarkerProps))

    setCount(count + 1);
    try {
      await AsyncStorage.setItem(count.toString(), JSON.stringify(marker));
    } catch (e) {
      if (hasMessage(e)) {
        console.error('Caught error: ' + (e.message || e));
      } else {
        console.error('Unknown error: ' + e);
      }
    };
  };

  const loadMarkers = async () => {

    try {
      const keys = await AsyncStorage.getAllKeys();
      const values = await AsyncStorage.multiGet(keys);
      setCount(values.length);

      const temp_markers: MapMarkerProps[] = [];
      values.map((value) => {
        const data = JSON.parse(value[1]!);

        temp_markers.push({
          title: data.title,
          description: data.description,
          coordinate: data.coordinate
        })
      });
      setMarkers(temp_markers);
    } catch (e) {
      if (hasMessage(e)) {
        console.error('Caught error: ' + (e.message || e));
      } else {
        console.error('Unknown error: ' + e);
      }
    };
  }
  return (
    <View style={styles.mainContainer}>
      <MapView
        coords={location?.coords || null}
        markers={markers} />

      <View style={styles.bottom}>
        <MapButtons
          onPress={getLocation}
          source={require('../assets/current-location-icon.png')} />
        <MapButtons
          onPress={addMarker}
          source={require('../assets/sign-plus-outline-icon.png')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  bottom: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    right: 15
  }
});

export default HomeScreen;