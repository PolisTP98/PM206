import { leerDB, guardarDB } from "./bd.js";
import { rl } from "./controlador.js";


export function verMenuCaja() {
    console.log(`
        POR FAVOR SELECCIONE LA OPCIÓN A REALIZAR:
        ========================================
        | (1) CONSULTAR TODOS LOS PEDIDOS      |
        | (2) CONSULTAR PEDIDOS POR USUARIO    |
        |                                      |
        | [ANY_KEY] REGRESAR AL MENÚ PRINCIPAL |
        ========================================
    `);
}


export async function agregarPedido(id_usuario, id_producto, cantidad) {
    const db = leerDB();
    const id_pedido = db.pedidos.length > 0 ? Math.max(...db.pedidos.map(p => p.id_pedido)) + 1 : 1;
    
    db.pedidos.push({ id_pedido, id_usuario, id_producto, cantidad });
    guardarDB(db);
}


function verInfoPedidos(lista_pedidos) {
    const db = leerDB();
    let total = 0;

    if (lista_pedidos.length === 0) {
        console.log("\n========== NO HAY PEDIDOS REGISTRADOS ==========");
        return;
    }

    lista_pedidos.forEach(pedido => {
        console.log(`\n
            ID USUARIO: ${pedido.id_usuario}
            ID PEDIDO: ${pedido.id_pedido}
        `);
        
        let producto = db.inventario.find(p => p.id_producto === pedido.id_producto);
        if (producto) {
            let subtotal = producto.precio * pedido.cantidad;
            total += subtotal;
            console.log(`
                PRODUCTO: ${producto.nombre}
                CANTIDAD: ${pedido.cantidad}
                SUBTOTAL: $${subtotal}
            `);
        } else {
            console.log("========== PRODUCTO DESCONOCIDO (ELIMINADO DEL INVENTARIO) ==========");
        }
    });
    console.log(`\n
        ========== TOTAL: $${total} ==========
        ======================================
        TOTAL DE PEDIDOS: ${lista_pedidos.length}
    `);
}


export function obtenerTodosLosPedidos() {
    const db = leerDB();
    verInfoPedidos(db.pedidos);
}


export function obtenerPedidosPorUsuario(id_usuario) {
    const db = leerDB();
    const pedidos_usuario = db.pedidos.filter(p => p.id_usuario === id_usuario);
    verInfoPedidos(pedidos_usuario);
}


export async function crearPedidoMenu(id_usuario) {
    let agregar = "1";
    while(agregar === "1") {
        console.clear();
        const db = leerDB();
        const idStr = await rl.question("ID DEL PRODUCTO A AGREGAR AL PEDIDO\n>>> ");
        const id_producto = parseInt(idStr);

        const producto = db.inventario.find(p => p.id_producto === id_producto);
        if (!producto) {
            console.log("========== PRODUCTO NO ENCONTRADO ==========");
            await rl.question("[ENTER] PARA CONTINUAR");
            continue;
        }

        const cantStr = await rl.question("CANTIDAD\n>>> ");
        const cantidad = parseInt(cantStr);
        if (isNaN(cantidad) || cantidad <= 0) {
            console.log("========== CANTIDAD INVÁLIDA ==========");
            await rl.question("[ENTER] PARA CONTINUAR");
            continue;
        }

        await agregarPedido(id_usuario, id_producto, cantidad);
        console.log("\n========== PEDIDO PREGISTRADO EXITOSAMENTE ==========");
        agregar = await rl.question("INGRESA '1' PARA REALIZAR OTRO PEDIDO U OTRA TECLA PARA REGRESAR\n>>> ");
    }
}