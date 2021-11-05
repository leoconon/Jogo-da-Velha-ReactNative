import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Provider as PaperProvider, Appbar } from 'react-native-paper';
import StartPage from './pages/StartPage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GamePage from './pages/GamePage';

const Stack = createNativeStackNavigator();

export default function App() {    
    return (
        <PaperProvider>
            <StatusBar style="inverted"/>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ header: Header }}>
                    <Stack.Screen name="StartPage" component={StartPage}/>
                    <Stack.Screen name="GamePage" component={GamePage}/>
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}

function Header() {
    return (
        <Appbar.Header>
            <Appbar.Content title="Jogo da Velha" />
        </Appbar.Header>
    );
}
