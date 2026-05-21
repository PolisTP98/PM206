import { obtenerRegistro } from "./controlador.js";
import { inventario } from "./cocina.js";


export function verMenuCliente() {
    console.log(`
        ¡BIENVENIDO A BIG CAESARS!, POR FAVOR SELECCIONE LA OPCIÓN A REALIZAR:

        ===============================
        | (1) VER MENÚ DE PRODUCTOS   |
        | (2) REALIZAR PEDIDO         |
        | (3) VER PEDIDOS             |
        |                             |
        | [ANY_KEY] SALIR DEL SISTEMA |
        ===============================
    `);
}


function verProductos(producto) {
    console.log(`
        ID PRODUCTO: ${producto.id_producto}
        NOMBRE: ${producto.nombre}
        CATEGORÍA: ${producto.categoria}
        PRECIO: $${producto.precio}
        INGREDIENTES: ${producto.ingredientes.forEach(ingrediente => {ingrediente.join(" ")})}
    \n`);
}


export function obtenerProductos() {
    inventario.forEach(producto => {
        verProductos(producto);
    });
}


export function obtenerProducto(id_producto) {
    const producto = obtenerRegistro(inventario, id_producto);
    verProductos(producto);
    return producto;
}