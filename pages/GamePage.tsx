import React, { useState } from 'react';
import { View, Dimensions, Text, Platform, ViewStyle, StyleProp, TextStyle } from 'react-native';
import { TouchableRipple, Card, Badge, Modal, Portal, Button } from 'react-native-paper';

const VW = Dimensions.get('window').width;
const X_PLAYER = 'X';
const O_PLAYER = 'O';

const rowGameStyle: StyleProp<ViewStyle> = {
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    flexGrow: 1
}

const buttonGameTextStyle: StyleProp<TextStyle> = {
    textAlign: 'center', 
    fontSize: 50, 
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace'
}

export default function GamePage(props: GamePageProps) {

    const { player1Name, player2Name } = props.route.params;
    const [matrix, setMatrix] = useState<GameButtonState[][]>([[], [], []]);
    const [change, setChange] = useState(true);
    const [clickCount, setClickCount] = useState<number>(0);
    const [actualPlayer, setActualPlayer] = useState<string>(X_PLAYER);
    const [hasWinner, setHasWinner] = useState(false);
    const [playerXScore, setPlayerXScore] = useState(0);
    const [playerOScore, setPlayerOScore] = useState(0);
    const [finish, setFinish] = useState(false);

    function onButtonClick(x: number, y: number) {
        setChange(!change);

        const newMatrix = matrix;
        newMatrix[x][y] = { label: actualPlayer, victory: false };
        setMatrix(newMatrix);

        for (let i = 0; i < 3; i++) {
            const victoryHor = areButtonsEqualsAndDefined(newMatrix, i, 0, i, 1, i, 2);
            const victoryVer = areButtonsEqualsAndDefined(newMatrix, 0, i, 1, i, 2, i);
            if (victoryHor || victoryVer) {
                return;
            }
        }

        const victoryOnDiag1 = areButtonsEqualsAndDefined(newMatrix, 0, 0, 1, 1, 2, 2);
        const victoryOnDiag2 = areButtonsEqualsAndDefined(newMatrix, 2, 0, 1, 1, 0, 2);

        if (victoryOnDiag1 || victoryOnDiag2) {
            return;
        }

        setClickCount(clickCount + 1);
        togglePlayer();
    }

    function areButtonsEqualsAndDefined(matrix: GameButtonState[][], x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
        const button1 = matrix[x1][y1];
        const button2 = matrix[x2][y2];
        const button3 = matrix[x3][y3];

        if (!button1 || !button2 || !button3) {
            return;
        }

        if (button1.label === button2.label && button2.label === button3.label) {
            button1.victory = true;
            button2.victory = true;
            button3.victory = true;
            setHasWinner(true);
            setMatrix(matrix);

            if (actualPlayer === X_PLAYER) {
                setPlayerXScore(playerXScore + 1);
            } else {
                setPlayerOScore(playerOScore + 1);
            }

            return true;
        }

        return false;
    }

    function onCloseModal() {
        setMatrix(([[], [], []]));
        setClickCount(0);
        togglePlayer();
        setHasWinner(false);
    }

    function togglePlayer() {
        setActualPlayer(actualPlayer === X_PLAYER ? O_PLAYER : X_PLAYER);
    }

    function getWinnerMessage(): string {
        if (playerXScore === playerOScore) {
            return "Ninguém venceu";
        } else if (playerXScore > playerOScore) {
            return player1Name + " venceu a partida!";
        } else {
            return player2Name + " venceu a partida!";
        }
    }

    function finishGame() {
        props.navigation.goBack();
    }

    return (
        <>
            <View style={{ padding: 10 }}>
                <PlayerIndicator name={`X ${player1Name}`} playing={actualPlayer === X_PLAYER} victories={playerXScore}/>
                <PlayerIndicator name={`O ${player2Name}`} playing={actualPlayer === O_PLAYER} victories={playerOScore}/>
                <View style={{ height: VW, marginBottom: 5 }}>
                    <View style={rowGameStyle}>
                        <GameButton state={matrix[0][0]} onChange={() => onButtonClick(0, 0)}/>
                        <GameButton state={matrix[0][1]} onChange={() => onButtonClick(0, 1)}/>
                        <GameButton state={matrix[0][2]} onChange={() => onButtonClick(0, 2)}/>
                    </View>
                    <View style={rowGameStyle}>
                        <GameButton state={matrix[1][0]} onChange={() => onButtonClick(1, 0)}/>
                        <GameButton state={matrix[1][1]} onChange={() => onButtonClick(1, 1)}/>
                        <GameButton state={matrix[1][2]} onChange={() => onButtonClick(1, 2)}/>
                    </View>
                    <View style={rowGameStyle}>
                        <GameButton state={matrix[2][0]} onChange={() => onButtonClick(2, 0)}/>
                        <GameButton state={matrix[2][1]} onChange={() => onButtonClick(2, 1)}/>
                        <GameButton state={matrix[2][2]} onChange={() => onButtonClick(2, 2)}/>
                    </View>
                </View>
                <Button mode="outlined" onPress={() => setFinish(true)}>Finalizar</Button>
            </View>
            <GameModal visible={hasWinner} onDismiss={onCloseModal} title={`${actualPlayer} venceu!`} message="Parabéns!!!"/>
            <GameModal visible={clickCount >= 9} onDismiss={onCloseModal} title="Velha!" message="Ninguém venceu =/"/>
            <GameModal 
                visible={finish} 
                onDismiss={finishGame} 
                title={getWinnerMessage()} 
                message="Bom jogo!"/>
        </>
    );
}

function GameButton(props: GameButtonProps) {

    const buttonGameTouchableStyle: StyleProp<ViewStyle> = {
        flexGrow: 1, 
        flexDirection: 'column', 
        justifyContent: 'center', 
        margin: 5, 
        borderRadius: 5, 
        backgroundColor: props.state ? ( props.state.victory ? 'green' : '#6200ee') : '#ccc'
    }

    function onPress() {
        if (!props.state) {
            props.onChange();
        }
    }

    return (
        <TouchableRipple style={buttonGameTouchableStyle} onPress={onPress}>
            <Text style={buttonGameTextStyle}>
                {props.state?.label || '?'}
            </Text>
        </TouchableRipple>
    );
}

function PlayerIndicator(props: PlayerIndicatorProps) {
    return (
        <View style={{ padding: 5, paddingTop: 0 }}>
            <Card style={{ backgroundColor: ( props.playing ? '#6200ee' : '#998cac') }}>
                <Card.Content style={{ flexDirection: 'row' }}>
                    <Text style={{ color: 'white', flexGrow: 1 }}>{props.playing ? '>> ' : ''}{props.name}</Text>
                    <Badge style={{ backgroundColor: 'white' }}>{props.victories || 0}</Badge>
                </Card.Content>
            </Card>
        </View>
    );
}

function GameModal(props: GameModalProps) {
    return (
        <Portal>
            <Modal visible={props.visible} onDismiss={props.onDismiss} contentContainerStyle={{ padding: 20 }}>
                <Card>
                    <Card.Title title={props.title}/>
                    <Card.Content>
                        <Text>{props.message}</Text>
                    </Card.Content>
                </Card>
            </Modal>
        </Portal>
    )
}

interface GamePageProps {
    route: any,
    navigation: any
}

interface GameButtonProps {
    state?: GameButtonState,
    onChange: () => void
}

interface PlayerIndicatorProps {
    name: string,
    victories?: number,
    playing: boolean,
}

interface GameButtonState {
    label: string,
    victory: boolean
}

interface GameModalProps {
    visible: boolean,
    onDismiss: () => void,
    title: string,
    message: string
}