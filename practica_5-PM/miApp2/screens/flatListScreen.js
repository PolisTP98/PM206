/* Zona 1: Importaciones de componentes y archivos */
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, Text, FlatList, SectionList, Button } from "react-native";
import React, { useState } from "react";

/* Zona 2: Main - Hogar de los componentes */
export default function FlatListScreen() {
    const[elementos, setElementos] = useState([
        {id: "1", nombre: "Daniela Lisset Elizalde Ortiz"}, 
        {id: "2", nombre: "Isaac Abdiel Sánchez López"}, 
        {id: "3", nombre: "Ian David Rodríguez Ruiz"}, 
        {id: "4", nombre: "Alan David Santiago de Vicente"}, 
        {id: "5", nombre: "Rafael de Jesús Reyes Chávez"}, 
        {id: "6", nombre: "Gabriela Martínez Cruz"}, 
        {id: "7", nombre: "Axel Gabriel Ramírez Ortiz"}, 
        {id: "8", nombre: "Diego Aarón Sámano Hernández"},
    ]);
    const[secciones, setSecciones] = useState([
        {
            titulo: "Videojuegos", 
            data: ["COD Mobile", "Halo", "Skullgirls"]
        }, 
        {
            titulo: "Refrescos", 
            data: ["Pepsi", "Cocacola", "Delaware punch"]
        }, 
        {
            titulo: "Gays", 
            data: ["Ian", "Ian", "Ian"]
        }, 
        {
            titulo: "Frituras", 
            data: ["Takis fuego", "Chips", "Rancheritos"]
        }, 
        {
            titulo: "Aguas", 
            data: ["Sandía", "Guayaba", "Naranja"]
        }, 
        {
            titulo: "Sexys", 
            data: ["Rafa", "Rafa", "Rafa"]
        },
    ]);

    const eliminarElemento = (id) => {
        setElementos(elementos.filter(item => item.id != id));
    };

    const renderContenidoSuperior = () => (
        <View>
            <Text style = {styles.titulo}>Practica flatList</Text>

            <FlatList 
                data = {elementos} 
                keyExtractor = {(item) => item.id} 
                scrollEnabled = {false} 
                renderItem = {({ item }) => (
                    <View style = {styles.itemFlat}>
                        <Text style = {styles.texto}>{item.nombre}</Text>
                        <Button title = "Eliminar" onPress = {() => eliminarElemento(item.id)}/>
                    </View>
                )}
            />

            <View style = {styles.barraDivisora}/>

            <Text style = {styles.titulo}>Práctica sectionList</Text>
        </View>
    );

    return (
        <View style = {styles.container}>
            <SectionList
                sections = {secciones} 
                keyExtractor = {(item, index) => item + index} 
                ListHeaderComponent = {renderContenidoSuperior} 
                renderItem = {({ item }) => (
                    <View style = {styles.itemSection}>
                        <Text style = {styles.texto}>{item}</Text>
                    </View>
                )}
                renderSectionHeader = {({ section: {titulo} }) => (
                    <View style = {styles.encabezado}>
                        <Text style = {styles.texto}>{titulo}</Text>
                    </View>
                )}
            />

            <StatusBar style = "auto"/>
        </View>
    );
}

/* Zona 3: Estilos y posicionamiento */
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#ffffff', 
        paddingTop: 60, 
        paddingHorizontal: 20,
    }, 
    titulo: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginBottom: 20, 
        textAlign: 'center', 
    }, 
    itemFlat: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 10, 
        borderBottomWidth: 1, 
        borderBottomColor: '#cccccc', 
    }, 
    itemSection: { 
        padding: 12, 
        borderBottomWidth: 1, 
        borderBottomColor: '#b50000', 
    }, 
    encabezado: { 
        backgroundColor: '#ff0202', 
        padding: 8, 
        marginTop: 15, 
    }, 
    textoEncabezado: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#333333', 
    }, 
    texto: { 
        fontSize: 16, 
    }, 
    barraDivisora: { 
        height: 2, 
        backgroundColor: '#444444', 
        marginVertical: 30, 
        borderRadius: 1, 
    },
});