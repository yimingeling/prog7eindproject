import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MapScreen from "./components/screens/MapScreen";
import SettingsScreen from "./components/screens/SettingsScreen";
import HomeScreen from "./components/screens/HomeScreen";
import { ThemeProvider } from './components/ThemeContext';


const Stack = createNativeStackNavigator();


export default function App() {
    return (
        <ThemeProvider>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Home" component={HomeScreen}/>
                    <Stack.Screen name="Map" component={MapScreen}/>
                    <Stack.Screen name="Settings" component={SettingsScreen}/>
                </Stack.Navigator>
            </NavigationContainer>
        </ThemeProvider>

    );
}


const styles = StyleSheet.create({
        backgroundColor: 'red',
});