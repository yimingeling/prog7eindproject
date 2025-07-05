import {
    Button,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Alert,
    Image,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../ThemeContext';

export default function HomeScreen() {
    const navigation = useNavigation();
    const { theme } = useContext(ThemeContext);
    const isDark = theme === 'dark';

    const [data, setData] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);

    const HOTSPOTS_URL = 'https://yimingeling.github.io/prog7api/hotspots.json';
    const STORAGE_KEY = 'hotspots-cache';
    const INVENTORY_KEY = 'inventory-cache';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(HOTSPOTS_URL);
                if (!response.ok) throw new Error('Network response was not ok');
                const json = await response.json();
                setData(json);
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(json));
            } catch (error) {
                console.warn('API fetch failed, trying local cache...', error);
                const cached = await AsyncStorage.getItem(STORAGE_KEY);
                if (cached) {
                    setData(JSON.parse(cached));
                } else {
                    console.error('No cache found and fetch failed.');
                }
            } finally {
                setLoading(false);
            }
        };

        const loadInventory = async () => {
            const stored = await AsyncStorage.getItem(INVENTORY_KEY);
            if (stored) {
                setInventory(JSON.parse(stored));
            }
        };

        fetchData();
        loadInventory();
    }, []);

    const addToInventory = async (item) => {
        const alreadyAdded = inventory.find((inv) => inv.id === item.id);
        if (alreadyAdded) {
            Alert.alert('Already Added', `${item.name} is already in your inventory.`);
            return;
        }
        const newInventory = [...inventory, item];
        setInventory(newInventory);
        await AsyncStorage.setItem(INVENTORY_KEY, JSON.stringify(newInventory));
    };

    const removeFromInventory = async (item) => {
        const updatedInventory = inventory.filter((inv) => inv.id !== item.id);
        setInventory(updatedInventory);
        await AsyncStorage.setItem(INVENTORY_KEY, JSON.stringify(updatedInventory));
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: 10,
            paddingHorizontal: 10,
            backgroundColor: isDark ? '#121212' : '#ffffff',
        },
        text: {
            color: isDark ? '#ffffff' : '#000000',
        },
        buttons: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: 20,
            paddingBottom: 20,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        wizardBox: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            gap: 8,
        },
        wizardImage: {
            width: 80,
            height: 80,
            borderRadius: 50,
        },
        item: {
            backgroundColor: isDark ? '#2c2c2c' : '#f0f0f0',
            padding: 15,
            marginVertical: 8,
            borderRadius: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        name: {
            fontSize: 18,
            fontWeight: '600',
            color: isDark ? '#fff' : '#000',
        },
        addBtn: {
            color: 'blue',
            fontWeight: 'bold',
            backgroundColor: 'white',
            padding: 5,
            borderRadius: 10,
        },
        removeBtn: {
            color: 'red',
            fontWeight: 'bold',
            backgroundColor: 'white',
            padding: 5,
            borderRadius: 10,
        },
        title: {
            fontSize: 22,
            fontWeight: 'bold',
            marginVertical: 10,
            textAlign: 'center',
            color: isDark ? '#fff' : '#000',
        },
        emptyText: {
            fontStyle: 'italic',
            color: '#888',
            textAlign: 'center',
            marginBottom: 10,
        },
    });

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('Map', { potion: item })}
        >
            <Text style={styles.name}>{item.name}</Text>
            <TouchableOpacity onPress={() => addToInventory(item)}>
                <Text style={styles.addBtn}>➕</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderInventoryItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.name}>{item.ingredient}</Text>
            <TouchableOpacity onPress={() => removeFromInventory(item)}>
                <Text style={styles.removeBtn}>❌</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.text}>Loading hotspots...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.buttons}>
                <Button title="Map" onPress={() => navigation.navigate('Map')} />
                <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
            </View>
            <View style={styles.wizardBox}>
                <Image style={styles.wizardImage} source={require('../../assets/wizard.jpg')} />
                <View>
                    <Text style={styles.title}>Wizard Mischanus</Text>
                    <Text style={styles.text}>Gather ingrediënts for my potion!</Text>
                </View>
            </View>
            <Text style={styles.title}>Your Inventory</Text>
            {inventory.length === 0 ? (
                <Text style={styles.emptyText}>No items collected yet.</Text>
            ) : (
                <FlatList
                    data={inventory}
                    renderItem={renderInventoryItem}
                    keyExtractor={(item) => `inv-${item.id}`}
                />
            )}

            <Text style={styles.title}>All Locations</Text>

            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
}
