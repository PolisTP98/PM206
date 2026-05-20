import { inventario } from "./cocina.js";
import { agregarPedido } from "./caja.js";

while(true) {
    console.log("\nBienvenido a Big Caesar's, este es el menú de nuestras deliciosas pizzas:\n");
    for(const producto in inventario) {
        console.log(`${clave}: ${usuario[clave]}`);
    }
    let pedido = prompt("¿Cuál es tu nombre?");
}