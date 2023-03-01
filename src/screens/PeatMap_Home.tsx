import React, { useEffect, useRef, useMemo, useState, FC } from 'react';
import {
  Alert,
  StyleSheet,
  Appearance,
  View,
} from 'react-native';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import { LatLng, MapMarkerProps } from 'react-native-maps';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MapView from '../components/MapView';
import AddMarkerButton from '../components/AddMarkerButton';
import MyLocationButton from '../components/MyLocationButton';
import MarkerCalloutModal from '../components/MarkerCalloutModal';

import hasMessage from '../utils/CatchErrorMessage';
import hasLocationPermission from '../utils/RequestLocationPermission';

import type { HomeNavigationProps, HomeRouteProps } from '../types/screens';
import SearchBar from '../components/SearchBar';

const PeatMap_Home: FC = () => {
  const colorScheme = Appearance.getColorScheme();
  const customMapStyle = (colorScheme == 'dark') ?
    require('../assets/styles/mapDarkModeStyle.json') :
    require('../assets/styles/mapLightModeStyle.json');

  const navigation = useNavigation<HomeNavigationProps>();
  const route = useRoute<HomeRouteProps>();

  // const location = useRef<GeoPosition | null>(null);
  // const [location, setLocation] = useState<GeoPosition | null>(null);
  const [markers, setMarkers] = useState<MapMarkerProps[]>([]);
  const [animateCameraTo, setAnimateCameraTo] = useState<LatLng | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMarkerId, setModalMarkerId] = useState('');


  useEffect(() => {
    // AsyncStorage.clear();
    const f = async () => {
      await hasLocationPermission();
      await animateCameraToCurrentPosition();
      await resetAnimateCameraTo();
    }
    f();

    loadMarkers();
    // getLocationUpdates();
  }, []);

  const returnMarker = route.params;

  // save marker to async storage
  useEffect(() => {
    if (returnMarker) {
      const marker = {
        title: returnMarker.deviceId,
        description: returnMarker.what3words,
        coordinate: { latitude: returnMarker.latitude, longitude: returnMarker.longitude } as LatLng
      };
      setMarkers(markers.concat(
        marker as MapMarkerProps))

      const saveToStorage = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem(returnMarker.deviceId)
          // check if device existed in the database before (if yes, update edit timestamp)
          if (jsonValue) {
            await AsyncStorage.setItem(
              returnMarker.deviceId,
              JSON.stringify({
                edited_timestamp: Date.now(),
                timestamp: JSON.parse(jsonValue)['timestamp'],
                ...returnMarker
              })
            )
          } else {
            await AsyncStorage.setItem(
              returnMarker.deviceId,
              JSON.stringify({ timestamp: Date.now(), ...returnMarker }));
          }
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

  const getLocation = () => {
    // const hasPermission = await hasLocationPermission();

    // if (!hasPermission) {
    //   return;
    // }

    return new Promise<GeoPosition>((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          resolve(position);
        },
        error => {
          Alert.alert(`Code ${error.code}`, error.message);
          console.error(error);
          reject(null);
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
    })


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
    const location = await getLocation();

    if (location) {
      navigation.navigate('MarkerDetails',
        {
          latitude: location.coords.latitude!,
          longitude: location.coords.longitude!
        })
    }

    await resetAnimateCameraTo();
  };

  const loadMarkers = async () => {

    try {
      const keys = await AsyncStorage.getAllKeys();
      const values = await AsyncStorage.multiGet(keys);

      const temp_markers: MapMarkerProps[] = [];
      values.map((value) => {
        const data = JSON.parse(value[1]!);

        temp_markers.push({
          title: data['deviceId'],
          description: data['what3words'],
          coordinate: { latitude: data['latitude'], longitude: data['longitude'] }
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
    const location = await getLocation();

    if (location) {
      setAnimateCameraTo(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        } as LatLng);
    }
  }

  const resetAnimateCameraTo = async () => {
    await new Promise(f => setTimeout(f, 3000)); // delay 3 seconds

    setAnimateCameraTo(null)
  }

  const onMarkerCalloutPress = async (markerId: string) => {
    setModalMarkerId(markerId);
    setModalVisible(true);
    // const marker = await AsyncStorage.getItem(markerId);
  }

  function onMarkerDelete(deviceId: string) {
    setMarkers(markers.filter(function (marker) {
      return marker.title !== deviceId;
    }));

    try {
      AsyncStorage.removeItem(deviceId);
    } catch (e) {
      if (hasMessage(e)) {
        console.error('Caught error: ' + (e.message || e));
      } else {
        console.error('Unknown error: ' + e);
      }
    }
    setModalVisible(false);
  }

  function onSearchBarSubmit(markerId: string) {
    const searchResult=markers.filter((marker)=>{return (marker.title?.toLowerCase()==markerId.toLowerCase())});
    if (searchResult.length!=0){
      setAnimateCameraTo(
        {
          latitude: searchResult[0].coordinate.latitude,
          longitude: searchResult[0].coordinate.longitude
        } as LatLng);
    }
  }

  return (
    <View style={styles.mainContainer}>

      <MarkerCalloutModal
        visible={modalVisible}
        markerId={modalMarkerId}
        onDismiss={() => { setModalVisible(false) }}
        onMarkerDelete={onMarkerDelete}
      />

      <MapView
        // coords={location?.coords || null}
        markers={markers}
        customMapStyle={customMapStyle}
        animateCameraTo={animateCameraTo}
        onMarkerCalloutPress={onMarkerCalloutPress}
      />
      <View style={styles.top}>
        <SearchBar onSubmitEditing={onSearchBarSubmit} />
      </View>
      <View style={styles.bottom}>
        <MyLocationButton
          onPressIn={animateCameraToCurrentPosition}
          onPressOut={resetAnimateCameraTo} />
        <AddMarkerButton
          onPress={addMarker} />
      </View>
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
  top: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
  },
  bottom: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    right: 15,
  },
});

export default PeatMap_Home;