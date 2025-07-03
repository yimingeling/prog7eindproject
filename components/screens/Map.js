import React, {useState, useEffect} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {Platform, Text, View, StyleSheet} from 'react-native';
import * as Location from 'expo-location';

export default function Map() {

    const [location, setLocation] = useState(null);
    const [path, setPath] = useState([]);
    const {errorMsg, setErrorMsg} = useState
    const region = {
        latitude: 51.9173,
        longitude: 4.4843,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    }
    useEffect(() => {
        async function getCurrentLocation() {

            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 2000,
                    distanceInterval: 5,
                },
                (newLocation) => {
                    const {latitude, longitude} = newLocation.coords;
                    setLocation({latitude, longitude});

                    setPath((prevPath) => [...prevPath, {latitude, longitude}]);
                }
            );
        }

        getCurrentLocation();
    }, []);

    console.log(Location.watchPositionAsync)

    let text = 'Waiting...';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    return (<View style={styles.container}>

        <MapView
            style={styles.map}
            showsUserLocation={true}
            followsUserLocation={true}
            region={location ? region : undefined}
        >
            {location && (
                <Marker coordinate={location} title="Je bent hier"/>
            )}
            {path.map((point, index) => (
                <Marker
                    key={index}
                    coordinate={point}
                    pinColor="blue"
                />
            ))}
        </MapView>
    </View>);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }, map: {
        width: '100%', height: '100%',
    },
});
