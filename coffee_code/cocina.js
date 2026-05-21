import { leerDB, guardarDB } from './bd.js';
import { rl } from './controlador.js';

export function listarProductos() {
    const db = leerDB();
    console.log("\n--- MENÚ DE BIG CAESARS ---");
    
    if (db.inventario.length === 0) console.log("No hay productos registrados.");
    
    db.inventario.forEach(producto => {
        console.log(`[ID: ${producto.id_producto}] ${producto.nombre} - $${producto.precio} (${producto.categoria})`);
        if (producto.ingredientes && producto.ingredientes.length > 0) {
            console.log(`   Ingredientes: ${producto.ingredientes.join(", ")}`);
        }
    });
    console.log("------------------------------------\n");
}

function agregarProducto(nombre, categoria, precio, ingredientes) {
    const db = leerDB();
    const id_producto = db.inventario.length > 0 ? Math.max(...db.inventario.map(p => p.id_producto)) + 1 : 1;
    
    db.inventario.push({ id_producto, nombre, categoria, precio, ingredientes });
    guardarDB(db);
    console.log(`Producto agregado exitosamente: ${nombre}`);
}

function actualizarProducto(id, nuevosDatos) {
    const db = leerDB();
    const indice = db.inventario.findIndex(p => p.id_producto === id);
    
    if (indice !== -1) {
        db.inventario[indice] = { ...db.inventario[indice], ...nuevosDatos };
        guardarDB(db);
        console.log(`Producto con ID ${id} actualizado correctamente.`);
    } else {
        console.log(`Error: No se encontró el producto con ID ${id}.`);
    }
}

function eliminarProducto(id) {
    const db = leerDB();
    const longitudInicial = db.inventario.length;
    db.inventario = db.inventario.filter(p => p.id_producto !== id); 
    
    if (db.inventario.length < longitudInicial) {
        guardarDB(db);
        console.log(`Producto con ID ${id} eliminado de la cocina.`);
    } else {
        console.log(`Error: No se encontró el producto con ID ${id}.`);
    }
}

export async function mostrarMenuCocina() {
    let salir = false;
    while (!salir) {
        console.clear();
        console.log("\n--- SISTEMA DE GESTIÓN DE COCINA ---");
        console.log("1. Ver el menú de productos");
        console.log("2. Agregar un producto nuevo");
        console.log("3. Editar un producto");
        console.log("4. Eliminar un producto");
        console.log("5. Regresar al menú anterior");
        
        const opcion = await rl.question("\nElige una opción (1-5): ");
        
        switch (opcion.trim()) {
            case '1':
                listarProductos();
                await rl.question("\n[ENTER] PARA CONTINUAR");
                break;
            case '2':
                const nombre = await rl.question("Nombre del producto: ");
                const categoria = await rl.question("Categoría (Ej. Pizza, Complemento): ");
                const precioStr = await rl.question("Precio: ");
                const ingredientesStr = await rl.question("Ingredientes (separados por coma): ");
                
                const precio = parseFloat(precioStr);
                const ingredientes = ingredientesStr.split(',').map(i => i.trim());
                agregarProducto(nombre, categoria, precio, ingredientes);
                await rl.question("\n[ENTER] PARA CONTINUAR");
                break;
            case '3':
                listarProductos();
                const idEditarStr = await rl.question("Ingresa el ID del producto que deseas editar: ");
                const idEditar = parseInt(idEditarStr);
                
                const db = leerDB();
                const prodActual = db.inventario.find(p => p.id_producto === idEditar);
                if (!prodActual) {
                    console.log(`Error: No se encontró el producto con ID ${idEditar}.`);
                    await rl.question("\n[ENTER] PARA CONTINUAR");
                    break;
                }
                
                console.log("\n[NOTA: Deja en blanco y presiona Enter para mantener el valor actual]");
                const nNombre = await rl.question(`Nombre (${prodActual.nombre}): `);
                const nCategoria = await rl.question(`Categoría (${prodActual.categoria}): `);
                const nPrecioStr = await rl.question(`Precio ($${prodActual.precio}): `);
                const nIngredientesStr = await rl.question(`Ingredientes (${prodActual.ingredientes.join(', ')}): `);
                
                const nuevosDatos = {};
                if (nNombre.trim() !== "") nuevosDatos.nombre = nNombre.trim();
                if (nCategoria.trim() !== "") nuevosDatos.categoria = nCategoria.trim();
                if (nPrecioStr.trim() !== "") nuevosDatos.precio = parseFloat(nPrecioStr);
                if (nIngredientesStr.trim() !== "") nuevosDatos.ingredientes = nIngredientesStr.split(',').map(i => i.trim());
                
                if (Object.keys(nuevosDatos).length > 0) actualizarProducto(idEditar, nuevosDatos);
                else console.log("No se realizó ningún cambio.");
                await rl.question("\n[ENTER] PARA CONTINUAR");
                break;
            case '4':
                listarProductos();
                const idEliminarStr = await rl.question("Ingresa el ID del producto que deseas eliminar: ");
                eliminarProducto(parseInt(idEliminarStr));
                await rl.question("\n[ENTER] PARA CONTINUAR");
                break;
            case '5':
                salir = true;
                break;
            default:
                console.log("Opción no válida.");
                await rl.question("\n[ENTER] PARA CONTINUAR");
                break;
        }
    }
}