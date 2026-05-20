import { inventario } from "./cocina.js";
import { lista_pedidos } from "./caja.js";
import { total_acumulado } from "./caja.js";
import { pedido } from "./caja.js";
import { agregarPedido } from "./caja.js";

let breakpoint;
while(breakpoint != "0") {
    console.log("\nBienvenido a Big Caesar's, este es el menú de nuestras deliciosas pizzas:\n");
    for(const clave in inventario) {
        console.log(`${clave}: ${inventario[clave]}`);
    }

    let index_producto = prompt("\n¿Que le gustaría ordenar? Por favor escriba el índice del producto: ");
    while(!(inventario.index_producto || index_producto > 0)) {
        let index_producto = prompt(">>> Índice incorrecto, inténtelo nuevamente por favor: ");
    }

    let producto = inventario.index_producto;

    let cantidad = prompt(`\nEscriba la cantidad de ${producto.nombre} a ordenar: `);
    while(!(cantidad > 0)) {
        let cantidad = prompt(">>> Cantidad incorrecta, ingrese una cantidad válida: ");
    }

    pedido = new pedido(index_producto, cantidad);
    lista_pedidos.push(pedido);
    total_acumulado++;

    breakpoint = prompt("\nEscribe '0' para recibir tu ticket y finalizar la compra: ");
}

for(const clave in lista_pedidos) {
    console.log("==================== TICKET ====================");
    console.log(`${clave}: ${inventario[clave]}\n`);
    console.log(`\nTotal de pedidos: ${total_acumulado}`);
}