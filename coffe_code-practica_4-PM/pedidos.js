import { 
    crearRegistro, 
    verRegistroPorID, 
    verRegistros, 
    actualizarRegistro, 
    eliminarRegistro 
} from "./controlador.js";


export class Pedido {
    constructor({ id_pedido, id_usuario, id_producto, cantidad, id_estado }) {
        this.id_pedido = id_pedido;
        this.id_usuario = id_usuario;
        this.id_producto = id_producto;
        this.cantidad = cantidad;
        this.id_estado = id_estado;
    }
}


export async function crearPedido(datos, base_de_datos) {
    return await crearRegistro(datos, Pedido, base_de_datos);
}


export function verPedidoPorID(id_pedido, base_de_datos) {
    verRegistroPorID(id_pedido, Pedido, base_de_datos);
}


export function verPedidos(base_de_datos, id_filtrado = undefined) {
    verRegistros(id_filtrado, Pedido, base_de_datos);
}


export async function actualizarPedido(id_pedido, datos_nuevos, base_de_datos) {
    return await actualizarRegistro(id_pedido, datos_nuevos, Pedido, base_de_datos);
}


export async function eliminarPedido(id_pedido, base_de_datos) {
    return await eliminarRegistro(id_pedido, Pedido, base_de_datos);
}