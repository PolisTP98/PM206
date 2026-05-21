import { leerDB } from "./bd.js";


export function verMenuCliente() {
    console.log(`
        ===============================
        | (1) VER MENÚ DE PRODUCTOS   |
        | (2) REALIZAR PEDIDO         |
        | (3) VER MIS PEDIDOS         |
        |                             |
        | [S] SALIR DEL SISTEMA       |
        ===============================
    `);
}


export function obtenerProductosPublicos() {
    const db = leerDB();
    if(db.inventario.length === 0) {
        console.log("\n========== LO SENTIMOS, NO HAY PRODUCTOS DISPONIBLES EN ESTE MOMENTO n==========");
        return;
    }

    db.inventario.forEach(producto => {
        const list_ingredientes = producto.ingredientes ? producto.ingredientes.join(", ") : "SIN INGREDIENTES";
        console.log(`
        ID PRODUCTO: ${producto.id_producto}
        NOMBRE: ${producto.nombre}
        CATEGORÍA: ${producto.categoria}
        PRECIO: $${producto.precio}
        INGREDIENTES: ${list_ingredientes}
        `);
    });
}