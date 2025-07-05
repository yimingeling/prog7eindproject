import React, { useContext } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { ThemeContext } from "../ThemeContext";

export default function SettingsScreen() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const isDark = theme === 'dark';

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: isDark ? '#121212' : '#ffffff',
        },
        label: {
            fontSize: 18,
            color: isDark ? '#ffffff' : '#000000',
        },
    });

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Dark Mode</Text>
            <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isDark ? '#f5dd4b' : '#f4f3f4'}
            />
        </View>
    );
}
