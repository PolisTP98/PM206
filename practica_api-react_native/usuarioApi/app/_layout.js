import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen 
                name="(tabs)" 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="detalles" 
                options={{ 
                    title: "Detalles del Usuario",
                    headerShown: true,
                    headerStyle: { backgroundColor: '#2563EB' },
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: 'bold' },
                }} 
            />
            <Stack.Screen 
                name="editar" 
                options={{ 
                    title: "Editar Usuario",
                    headerShown: true,
                    headerStyle: { backgroundColor: '#2563EB' },
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: 'bold' },
                }} 
            />
        </Stack>
    );
}