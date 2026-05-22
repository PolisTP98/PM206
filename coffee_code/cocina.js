import { leerDB, guardarDB } from './bd.js';
import { rl } from './controlador.js';

export function listarProductos() {
    const db = leerDB();
    console.log("\n--- MENÚ DE BIG CAESARS ---");
    
    if (db.inventario.length === 0) console.log("No hay productos registrados.");
    
    db.inventario.forEach(producto => {
        console.log(`[ID: ${producto.id_producto}] ${producto.nombre} - $${producto.precio} (${producto.categoria})`);
        if (producto.ingredientes && producto.ingredientes.length > 0) {
            // Si es un combo, la etiqueta cambia sutilmente a "Contenido" para mejor lectura
            const etiqueta = producto.categoria === "Combo" ? "Incluye" : "Ingredientes";
            console.log(`   ${etiqueta}: ${producto.ingredientes.join(", ")}`);
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

export function filtrarProductosPorPrecio(tipo) {
    const db = leerDB();
    let filtrados = [];

    if (tipo === 'barato') {
        filtrados = db.inventario.filter(producto => producto.precio <= 100);
    } else if (tipo === 'caro') {
        filtrados = db.inventario.filter(producto => producto.precio > 100);
    }

    console.log(`\n--- PRODUCTOS CLASIFICADOS COMO "${tipo.toUpperCase()}" ---`);
    if (filtrados.length === 0) {
        console.log("No hay productos en este rango de precio.");
    } else {
        filtrados.forEach(producto => {
            console.log(`[ID: ${producto.id_producto}] ${producto.nombre} - $${producto.precio} (${producto.categoria})`);
        });
    }
    console.log("--------------------------------------------------\n");
}

export function filtrarProductosPorCategoria(categoria) {
    const db = leerDB();
    
    const filtrados = db.inventario.filter(producto => 
        producto.categoria.toLowerCase() === categoria.toLowerCase()
    );

    console.log(`\n--- PRODUCTOS EN LA CATEGORÍA "${categoria.toUpperCase()}" ---`);
    if (filtrados.length === 0) {
        console.log("No hay productos en esta categoría.");
    } else {
        filtrados.forEach(producto => {
            console.log(`[ID: ${producto.id_producto}] ${producto.nombre} - $${producto.precio}`);
            // Si estamos filtrando combos, mostramos explícitamente lo que contienen
            if (categoria.toLowerCase() === 'combo' && producto.ingredientes && producto.ingredientes.length > 0) {
                console.log(`   -> Contenido: ${producto.ingredientes.join(" + ")}`);
            }
        });
    }
    console.log("--------------------------------------------------\n");
}

export function agregarCombo(nombreCombo, idsProductos, precioCombo) {
    const db = leerDB();
    const productosValidos = [];
    const idsFaltantes = [];

    idsProductos.forEach(id => {
        const productoEncontrado = db.inventario.find(p => p.id_producto === id);
        
        if (productoEncontrado) {
            productosValidos.push(productoEncontrado.nombre); 
        } else {
            idsFaltantes.push(id);
        }
    });

    if (idsFaltantes.length > 0) {
        console.log(`\n¡Error! No se puede crear el combo.`);
        console.log(`Los siguientes IDs de productos no existen en el inventario: ${idsFaltantes.join(', ')}`);
        return; 
    }

    const id_producto = db.inventario.length > 0 ? Math.max(...db.inventario.map(p => p.id_producto)) + 1 : 1;
    
    const nuevoCombo = { 
        id_producto, 
        nombre: nombreCombo, 
        categoria: "Combo", 
        precio: precioCombo, 
        ingredientes: productosValidos 
    };
    
    db.inventario.push(nuevoCombo);
    guardarDB(db);
    
    console.log(`\n¡Éxito! Combo "${nombreCombo}" creado por $${precioCombo}.`);
    console.log(`Incluye: ${productosValidos.join(' + ')}`);
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
        console.log("5. Ver productos por rango de precio (1 = Barato / 2 = Caro)");
        console.log("6. Ver productos por categoría (1 = Pizza / 2 = Complemento / 3 = Combos)");
        console.log("7. Crear un Combo Promocional");
        console.log("8. Regresar al menú anterior");
        
        const opcion = await rl.question("\nElige una opción (1-8): ");
        
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
                const tipoFiltro = await rl.question("¿Qué deseas ver? (Escribe '1' para Baratos <= $100 o '2' para Caros > $100): ");
                const opcionPrecio = tipoFiltro.trim();
                
                if (opcionPrecio === '1') {
                    filtrarProductosPorPrecio('barato');
                } else if (opcionPrecio === '2') {
                    filtrarProductosPorPrecio('caro');
                } else {
                    console.log("Error: Opción no válida. Debes ingresar '1' o '2'.");
                }
                await rl.question("\n[ENTER] PARA CONTINUAR");
                break;
            case '6':
                const catFiltro = await rl.question("¿Qué categoría deseas ver? (1 = Pizza / 2 = Complemento / 3 = Combos): ");
                const opcionCat = catFiltro.trim();
                
                if (opcionCat === '1') {
                    filtrarProductosPorCategoria('Pizza');
                } else if (opcionCat === '2') {
                    filtrarProductosPorCategoria('Complemento');
                } else if (opcionCat === '3') {
                    filtrarProductosPorCategoria('Combo');
                } else {
                    console.log("Error: Opción no válida. Debes ingresar '1', '2' o '3'.");
                }
                await rl.question("\n[ENTER] PARA CONTINUAR");
                break;
            case '7':
                console.log("\n--- CREACIÓN DE COMBOS ---");
                listarProductos(); 
                
                const nombreCombo = await rl.question("Nombre del combo (Ej. Combo Familiar): ");
                const idsStr = await rl.question("Ingresa los IDs de los productos a incluir separados por coma (Ej. 1,3): ");
                const precioComboStr = await rl.question("Precio total del combo: ");
                
                const arrayIds = idsStr.split(',').map(id => parseInt(id.trim()));
                const precioCombo = parseFloat(precioComboStr);
                
                agregarCombo(nombreCombo, arrayIds, precioCombo);
                await rl.question("\n[ENTER] PARA CONTINUAR");
                break;
            case '8':
                salir = true;
                break;
            default:
                console.log("Opción no válida.");
                await rl.question("\n[ENTER] PARA CONTINUAR");
                break;
        }
    }
}