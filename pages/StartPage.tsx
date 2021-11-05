import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Button } from 'react-native-paper';

export default function StartPage(props: StartPageProps) {

    const [player1, setPlayer1] = useState<string>();
    const [player2, setPlayer2] = useState<string>();

    return (
        <View style={{ padding: 20 }}>
            <TextInput
                label="Jogador 1" 
                mode="outlined"
                value={player1}
                style={{ marginBottom: 10 }}
                onChangeText={t => setPlayer1(t)}/>
            <TextInput
                label="Jogador 2" 
                mode="outlined"
                value={player2}
                style={{ marginBottom: 15 }}
                onChangeText={t => setPlayer2(t)}/>
            <Button 
                mode="contained"
                disabled={!player1 || !player2}
                onPress={() => props.navigation.navigate('GamePage', { player1Name: player1, player2Name: player2 })}>
                Jogar
            </Button>
        </View>
    )
}

interface StartPageProps {
    navigation: any
}