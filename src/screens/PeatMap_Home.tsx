import React, { useEffect, useRef, useState, FC } from 'react';
import {
  Alert,
  StyleSheet,
  Appearance,
  View,
} from 'react-native';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import { LatLng, MapMarkerProps, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MapView from '../components/MapView2';
import MapButtons from '../components/MapButtons';
import hasMessage from '../utils/CatchErrorMessage';
import hasLocationPermission from '../utils/RequestLocationPermission';

import type { HomeNavigationProps, HomeRouteProps } from '../types/screens';

const PeatMap_Home: FC = () => {
  const colorScheme = Appearance.getColorScheme();
  const customMapStyle = (colorScheme == 'dark') ?
    require('../components/mapDarkModeStyle.json') :
    require('../components/mapLightModeStyle.json');

  const navigation = useNavigation<HomeNavigationProps>();
  const route = useRoute<HomeRouteProps>();

  const [location, setLocation] = useState<GeoPosition | null>(null);
  const [markers, setMarkers] = useState<MapMarkerProps[]>([]);
  const [animateCameraTo, setAnimateCameraTo] = useState<LatLng | null>(null);

  useEffect(() => {
    async () => {
      console.log("here... requesting location permission");
      await hasLocationPermission();
    }
    loadMarkers();
    // getLocationUpdates();
  }, []);

  const returnMarker = route.params;

  // save marker to async storage
  useEffect(() => {
    if (returnMarker) {
      const marker = {
        title: returnMarker.device_id,
        description: returnMarker.what3words,
        coordinate: { latitude: returnMarker.latitude, longitude: returnMarker.longitude } as LatLng
      };
      setMarkers(markers.concat(
        marker as MapMarkerProps))

      const saveToStorage = async () => {
        try {
          await AsyncStorage.setItem(returnMarker.device_id, JSON.stringify(marker));
        } catch (e) {
          if (hasMessage(e)) {
            console.error('Caught error: ' + (e.message || e));
          } else {
            console.error('Unknown error: ' + e);
          }
        };
      }

      saveToStorage();
    }

  }, [returnMarker])

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        setLocation(position);
        // console.log(position);
      },
      error => {
        Alert.alert(`Code ${error.code}`, error.message);
        setLocation(null);
        console.error(error);
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

  // // location tracking done by MapView from react-native-maps
  // const getLocationUpdates = async () => {
  //   const hasPermission = await hasLocationPermission();

  //   if (!hasPermission) {
  //     return;
  //   }

  //   if (watchId.current !== null) {
  //     Geolocation.clearWatch(watchId.current);
  //     watchId.current = null;
  //   }

  //   watchId.current = Geolocation.watchPosition(
  //     position => {
  //       setLocation(position);
  //       // console.log(position);
  //     },
  //     error => {
  //       setLocation(null);
  //       console.error(error);
  //     },
  //     {
  //       accuracy: {
  //         android: 'high',
  //         ios: 'best',
  //       },
  //       enableHighAccuracy: true,
  //       distanceFilter: 0,
  //       interval: 5000,
  //       fastestInterval: 2000,
  //     },
  //   );
  // };

  const addMarker = async () => {
    await getLocation();
    if (location?.coords) {
      navigation.navigate('MarkerDetails',
        {
          latitude: location?.coords.latitude!,
          longitude: location?.coords.longitude!
        })
    }
  };

  const loadMarkers = async () => {

    try {
      const keys = await AsyncStorage.getAllKeys();
      const values = await AsyncStorage.multiGet(keys);

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

  const animateCameraToCurrentPosition = async () => {
    await getLocation();

    setAnimateCameraTo(
      {
        latitude: location?.coords.latitude,
        longitude: location?.coords.longitude
      } as LatLng);
  }

  const resetAnimateCameraTo =async () => {
    await new Promise(f => setTimeout(f, 3000)); // delay 3 seconds

    setAnimateCameraTo(null)
  }

  return (
    <View style={styles.mainContainer}>
      <MapView
        coords={location?.coords || null}
        markers={markers}
        customMapStyle={customMapStyle}
        animateCameraTo={animateCameraTo || null} />
      <View style={styles.bottom}>
        <MapButtons
          onPressIn={animateCameraToCurrentPosition}
          onPressOut={resetAnimateCameraTo}
          source={require('../assets/icons/current-location-icon.png')} />
        <MapButtons
          onPressIn={addMarker}
          source={require('../assets/icons/sign-plus-outline-icon.png')} />
      </View>
      {/* <>
      {
        console.log(location?.coords!)
      }
      </> */}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  mapView: {
    ...StyleSheet.absoluteFillObject,
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

export default PeatMap_Home;