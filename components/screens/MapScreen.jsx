import React, { useState, useEffect, useContext } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { ThemeContext } from '../ThemeContext';

export default function MapScreen({ route }) {
    const { theme } = useContext(ThemeContext);
    const isDark = theme === 'dark';

    const [location, setLocation] = useState(null);
    const [path, setPath] = useState([]);
    const [errorMsg, setErrorMsg] = useState(null);
    const [hotspots, setHotspots] = useState([]);
    const [loading, setLoading] = useState(true);

    const potion = route?.params?.potion || null;

    useEffect(() => {
        if (!potion) {
            fetch('https://yimingeling.github.io/prog7api/hotspots.json')
                .then((res) => res.json())
                .then((json) => {
                    setHotspots(json);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        } else {
            setHotspots([potion]);
            setLoading(false);
        }
    }, [potion]);

    // Optional: Enable to track user location in real-time
    // useEffect(() => {
    //     async function getCurrentLocation() {
    //         let { status } = await Location.requestForegroundPermissionsAsync();
    //         if (status !== 'granted') {
    //             setErrorMsg('Permission to access location was denied');
    //             return;
    //         }

    //         await Location.watchPositionAsync(
    //             {
    //                 accuracy: Location.Accuracy.High,
    //                 timeInterval: 2000,
    //                 distanceInterval: 5,
    //             },
    //             (newLocation) => {
    //                 const { latitude, longitude } = newLocation.coords;
    //                 setLocation({ latitude, longitude });
    //                 setPath((prevPath) => [...prevPath, { latitude, longitude }]);
    //             }
    //         );
    //     }

    //     getCurrentLocation();
    // }, []);

    const initialRegion = potion
        ? {
            latitude: potion.coordinates.latitude,
            longitude: potion.coordinates.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        }
        : {
            latitude: 51.9173,
            longitude: 4.4843,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
        };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#121212' : '#ffffff',
        },
        map: {
            width: '100%',
            height: '80%',
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: 10,
            color: isDark ? '#ffffff' : '#000000',
        },
        description: {
            textAlign: 'center',
            marginBottom: 10,
            paddingHorizontal: 10,
            color: isDark ? '#cccccc' : '#333333',
        },
        centered: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isDark ? '#121212' : '#ffffff',
        },
    });

    const darkMapStyle = [
        {
            elementType: 'geometry',
            stylers: [{ color: '#1d2c4d' }],
        },
        {
            elementType: 'labels.text.fill',
            stylers: [{ color: '#8ec3b9' }],
        },
        {
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#1a3646' }],
        },
        {
            featureType: 'administrative.country',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#4b6878' }],
        },
        {
            featureType: 'landscape.natural',
            elementType: 'geometry',
            stylers: [{ color: '#023e58' }],
        },
        {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{ color: '#283d6a' }],
        },
        {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#6f9ba5' }],
        },
        {
            featureType: 'poi.park',
            elementType: 'geometry.fill',
            stylers: [{ color: '#023e58' }],
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#304a7d' }],
        },
        {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#98a5be' }],
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#2c6675' }],
        },
        {
            featureType: 'transit',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#98a5be' }],
        },
        {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#0e1626' }],
        },
        {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#4e6d70' }],
        },
    ];

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.description}>Loading map...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {potion ? (
                <>
                    <Text style={styles.title}>{potion.name}</Text>
                    <Text style={styles.description}>{potion.description}</Text>
                </>
            ) : (
                <Text style={styles.title}>All Hotspots</Text>
            )}

            <MapView
                style={styles.map}
                initialRegion={initialRegion}
                showsUserLocation={true}
                customMapStyle={isDark ? darkMapStyle : []}
            >
                {hotspots.map((spot) => (
                    <Marker
                        key={spot.id}
                        coordinate={spot.coordinates}
                        title={spot.name}
                        description={spot.description}
                        pinColor={potion ? 'purple' : 'orange'}
                    />
                ))}

                {location && (
                    <Marker coordinate={location} title="You are here" />
                )}

                {path.map((point, index) => (
                    <Marker key={index} coordinate={point} pinColor="blue" />
                ))}
            </MapView>
        </View>
    );
}
