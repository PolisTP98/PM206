import { 
    crearRegistro, 
    verRegistroPorID, 
    verRegistros, 
    actualizarRegistro, 
    eliminarRegistro 
} from "./controlador.js";


export class Producto {
    constructor({ id_producto, nombre, id_categoria, id_ingrediente, precio, stock = 0 }) {
        this.id_producto = id_producto;
        this.nombre = nombre;
        this.id_categoria = id_categoria;
        this.id_ingrediente = id_ingrediente;
        this.precio = precio;
        this.stock = stock;
    }
}


export async function crearProducto(datos, base_de_datos) {
    return await crearRegistro(datos, Producto, base_de_datos);
}


export function verProductoPorID(id_producto, base_de_datos) {
    verRegistroPorID(id_producto, Producto, base_de_datos);
}


export function verProductos(base_de_datos, id_filtrado = undefined) {
    verRegistros(id_filtrado, Producto, base_de_datos);
}


export async function actualizarProducto(id_producto, datos_nuevos, base_de_datos) {
    return await actualizarRegistro(id_producto, datos_nuevos, Producto, base_de_datos);
}


export async function eliminarProducto(id_producto, base_de_datos) {
    return await eliminarRegistro(id_producto, Producto, base_de_datos);
}