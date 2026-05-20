export var lista_pedidos = [];
export var total_acumulado = 0;


export class pedido {
    constructor(id, cantidad) {
        this.id = id;
        this.precio = precio;
        this.cantidad = cantidad;
    }
}


export function agregarPedido(index_producto, cantidad) {
    let pedido = new pedido(index_producto, cantidad);
    lista_pedidos.push(pedido);
    total_acumulado++;
}