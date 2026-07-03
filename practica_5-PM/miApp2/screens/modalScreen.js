/* Zona 1: Importaciones de componentes y archivos */
import { StatusBar } from "expo-status-bar";
import React, { use, useState } from "react";
import { 
    StyleSheet, 
    Text, 
    View, 
    Button, 
    Modal, 
    Pressable, 
} from "react-native";

/* Zona 2: Main - Hogar de los componentes */
export default function ModalScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

    return(
        <View style = {styles.container}>
            <Text style = {styles.titulo}>Ejemplo de Modal y BottomSheet</Text>
            <Button title = "Abrir Modal" onPress = {() => setModalVisible(true)}/>
            <Button title = "Abrir BottomSheet" onPress = {() => setBottomSheetVisible(true)}/>

            <Modal 
                animationType = "fade" 
                transparent = {true} 
                visible = {modalVisible}
            >
                <View style = {styles.modalBackground}>
                    <View style = {styles.modal}>
                        <Text style = {styles.texto}>Hola, esto es un Modal</Text>
                        <Pressable style = {styles.boton} onPress = {() => setModalVisible(false)}>
                            <Text style = {styles.textoBoton}>Cerrar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <Modal 
                animationType = "slide" 
                transparent = {true} 
                visible = {bottomSheetVisible   }
            >
                <View style = {styles.fondo}>
                    <View style = {styles.bottomSheet}>
                        <Text style = {styles.texto}>Hola, esto es un BottomSheet</Text>
                        <Pressable style = {styles.boton} onPress = {() => setBottomSheetVisible(false)}>
                            <Text style = {styles.textoBoton}>Cerrar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <StatusBar style = "auto"/>
        </View>
    );
}

/* Zona 3: Estilos y posicionamiento */
const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center", 
        backgroundColor: "#ffffff", 
    }, 
    titulo: {
        fontSize: 24, 
        fontWeight: "bold", 
        marginBottom: 20, 
    }, 
    modalBackground: {
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center", 
        backgroundColor: "rgba(0,0,0,0.4)", 
    }, 
    modal: {
        backgroundColor: "#ffffff", 
        padding: 25, 
        borderRadius: 20, 
        alignItems: "center", 
    }, 
    fondo: {
        flex: 1, 
        justifyContent: "flex-end", 
        backgroundColor: "rgba(0,0,0,0.4)", 
    }, 
    bottomSheet: {
        backgroundColor: "#ffffff", 
        padding: 25, 
        borderTopLeftRadius: 20, 
        borderTopRightRadius: 20, 
        alignItems: "center", 
    }, 
    texto: {
        fontSize: 20, 
        marginBottom: 20, 
    }, 
    boton: {
        backgroundColor: "#2196F3", 
        paddingHorizontal: 25, 
        paddingVertical: 10, 
        borderRadius: 8, 
    }, 
    textoBoton: {
        color: "#ffffff", 
        fontWeight: "bold", 
    }, 
});