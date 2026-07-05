import React, { 
    useState, 
    useEffect, 
} from "react";
import { StatusBar, } from "react-native";
import { SafeAreaProvider, } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import SplashScreen from "./screens/splashScreen.js";
import Biblioteca from "./screens/biblioteca.js";

export default function App() {
    const[cargando, setCargando] = useState(true);

    useEffect(() => {
        const temporizador = setTimeout(() => {
            setCargando(false);
        }, 2000);
        return () => clearTimeout(temporizador);
    }, []);

    useEffect(() => {
        async function ocultarNavigationBar() {
            await NavigationBar.setVisibilityAsync("hidden");
        }
        ocultarNavigationBar();
    }, []);

    return (
        <SafeAreaProvider>
            <StatusBar 
                hidden = {true} 
                translucent = {true}
            />
            {cargando 
                ? <SplashScreen/> 
                : <Biblioteca/>
            }
        </SafeAreaProvider>
    );
}