import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { GeoCoordinates } from 'react-native-geolocation-service';
import MapView, { Circle, Marker, MapMarkerProps, PROVIDER_GOOGLE, MapStyleElement, LatLng, LongPressEvent, CalloutPressEvent } from 'react-native-maps';

interface MapViewProps {
    // coords: GeoCoordinates | null;
    markers: MapMarkerProps[] | null;
    customMapStyle: MapStyleElement[];
    animateCameraTo: LatLng | null;
    onMarkerCalloutPress: (markerId: string) => void;
}

const PeatMapView = ({
    markers,
    customMapStyle,
    animateCameraTo,
    onMarkerCalloutPress
}: MapViewProps) => {

    const mapRef = useRef<MapView>(null);

    if (!!animateCameraTo && mapRef.current) {
        mapRef.current.animateCamera({
            center: {
                latitude: animateCameraTo.latitude,
                longitude: animateCameraTo.longitude,
            },
            pitch: 0,
            heading: 0,
            altitude: 1000,
            zoom: 17,
        });
    }

    // function testlongpress(event:LongPressEvent){
    //   console.log(event.nativeEvent.coordinate);
    // }

    function onCalloutPress(markerId: string) {
        onMarkerCalloutPress(markerId);
    }

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.mapView}
                provider={PROVIDER_GOOGLE}
                initialCamera={{
                    altitude: 15000,
                    center: {
                        latitude: 52.93725,
                        longitude: -1.19595,
                    },
                    heading: 0,
                    pitch: 0,
                    zoom: 18,
                }}
                showsUserLocation={true}
                userLocationUpdateInterval={5000}
                userLocationFastestInterval={3000}
                showsCompass={false}
                showsMyLocationButton={false}
                customMapStyle={customMapStyle}
            // onLongPress={testlongpress}
            >
                {!!markers && (
                    markers.map((marker, index) =>
                        <Marker
                            key={`marker_${index}`}
                            coordinate={marker.coordinate}
                            title={marker.title}
                            description={marker.description}
                            tracksViewChanges={false}
                            // onPress={(event)=>{console.log(event.nativeEvent)}}
                            onCalloutPress={() => { onCalloutPress(marker.title!) }}
                        />)
                )}
            </MapView>
        </View>
    );
};

export default PeatMapView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mapView: {
        ...StyleSheet.absoluteFillObject,
    },
});