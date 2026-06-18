/* Zona 1: Importaciones de componentes y archivos */
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { React, useState } from 'react';
import ActivityIndicatorScreen from './activityIndicatorScreen';
import CardsScreen from './cardsScreen';
import FlatListScreen from './flatListScreen';
import ImageBackgroundScreen from './imageBackgroundScreen';
import ModalScreen from './modalScreen';
import PressableScreen from './pressableScreen';
import SafeAreaViewScreen from './safeAreaViewScreen';
import TextInputScreen from './textInputScreen';

/* Zona 2: Main - Hogar de los componentes */
export default function MenuScreen() {
    const [screen, setScreen] = useState('menu');

    switch(screen) {
        case 'cards':
            return <CardsScreen/>
        case 'safeAreaView':
            return <SafeAreaViewScreen/>
        case 'pressable':
            return <PressableScreen/>
        case 'textInput':
            return <TextInputScreen/>
        case 'flatList':
            return <FlatListScreen/>
        case 'imageBackground':
            return <ImageBackgroundScreen/>
        case 'activityIndicator':
            return <ActivityIndicatorScreen/>
        case 'modal':
            return <ModalScreen/>
        case 'menu':
            default:
                return (
                    <View style = {styles.container}>
                        <StatusBar style = "auto"/>
                        <Text>Menú de prácticas</Text>
                        <Button onPress = {() => setScreen('cards')} title = "cards"/>
                        <Button onPress = {() => setScreen('safeAreaView')} title = "safeAreaView"/>
                        <Button onPress = {() => setScreen('pressable')} title = "pressable"/>
                        <Button onPress = {() => setScreen('textInput')} title = "textInput"/>
                        <Button onPress = {() => setScreen('flatList')} title = "flatList"/>
                        <Button onPress = {() => setScreen('imageBackground')} title = "imageBackground"/>
                        <Button onPress = {() => setScreen('activityIndicator')} title = "activityIndicator"/>
                        <Button onPress = {() => setScreen('modal')} title = "modal"/>
                    </View>
                );
    }
}

/* Zona 3: Estilos y posicionamiento */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
});