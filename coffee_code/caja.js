import { 
    agregarRegistro, 
    obtenerRegistro 
} from "./controlador.js";
const lista_pedidos = [];
let id_pedido = 1;


class pedidos {
    constructor(id_usuario, id_producto, cantidad) {
        this.id_pedido = id_pedido;
        this.id_usuario = id_usuario;
        this.id_producto = id_producto;
        this.cantidad = cantidad;
    }
}


export function verMenuCaja() {
    console.log(`
        POR FAVOR SELECCIONE LA OPCIÓN A REALIZAR:

        ========================================
        | (1) CONSULTAR PEDIDOS                |
        | (2) CONSULTAR PEDIDOS POR USUARIO    |
        |                                      |
        | [ANY_KEY] REGRESAR AL MENÚ PRINCIPAL |
        ========================================
    `);
}


export function agregarPedido(id_usuario, id_producto, cantidad) {
    const pedido = new pedidos(id_usuario, id_producto, cantidad);
    agregarRegistro(lista_pedidos, id_pedido, pedido);
}


function verPedidos(lista_pedidos) {
    const total_pedidos = lista_pedidos.length;
    lista_pedidos.forEach(pedido => {
        console.log(`\n
            ID USUARIO: ${pedido.id_usuario}
            ID PEDIDO: ${pedido.id_pedido}
        `);
        
        for(producto in pedido) {
            let total = 0, precio_producto = producto.precio;
            total += (precio_producto * cantidad);
            console.log(`
                PRODUCTO: ${producto.nombre}
                CANTIDAD: ${pedido.cantidad}
                SUBTOTAL: $${precio_producto * cantidad}
            \n`);
        }
        console.log(`========== TOTAL: $${total} ==========\n`);
    });
    console.log(`\n
        ========================================
        TOTAL DE PEDIDOS: ${total_pedidos}
    `);
}


export function obtenerPedidos(id_usuario) {
    if(id_usuario !== undefined) {
        const pedidos_usuario = obtenerRegistro(lista_pedidos, id_usuario);
        verPedidos(pedidos_usuario);
        return pedidos_usuario;
    }
    verPedidos(lista_pedidos);
}