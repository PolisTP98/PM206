import { rl, iniciarSesionSistema } from "./controlador.js";
import { leerBaseDeDatos } from "./base_de_datos.js";
import { crearProducto, verProductos, actualizarProducto, eliminarProducto } from "./productos.js";
import { verPedidos, actualizarPedido } from "./pedidos.js";

// ==========================================
// VISTAS Y MENÚS MULTILÍNEA (PARTE SUPERIOR)
// ==========================================

function menuLogin() {
    console.log(`
¡BIENVENIDO! POR FAVOR INICIE SESIÓN
=======================================`);
}

function menuPrincipalCocina() {
    console.log(`
=== MENÚ PRINCIPAL - COCINA ===
=======================================
| (1) GESTIONAR PRODUCTOS             |
| (2) GESTIONAR PEDIDOS               |
|                                     |
| [S] SALIR DEL SISTEMA               |
=======================================`);
}

function menuGestionarProductos() {
    console.log(`
=== SUBMENÚ: GESTIONAR PRODUCTOS ===
=======================================
| (1) VER PRODUCTOS                   |
| (2) AGREGAR PRODUCTO                |
| (3) ACTUALIZAR PRODUCTO             |
| (4) ELIMINAR PRODUCTO               |
|                                     |
| [R] REGRESAR AL MENÚ ANTERIOR       |
=======================================`);
}

function menuGestionarPedidos() {
    console.log(`
=== SUBMENÚ: GESTIONAR PEDIDOS ===
=======================================
| (1) VER TODOS LOS PEDIDOS           |
| (2) VER PEDIDOS DE UN CLIENTE       |
| (3) ACTUALIZAR ESTADO DE UN PEDIDO  |
|                                     |
| [R] REGRESAR AL MENÚ ANTERIOR       |
=======================================`);
}

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

// Convierte un string "1, 2, 3" en un arreglo numérico [1, 2, 3]
function procesarArregloIDs(input_str) {
    if (!input_str || input_str.trim() === "") return [];
    return input_str.split(",").map(num => Number(num.trim())).filter(n => !Number.isNaN(n));
}

// ==========================================
// LÓGICA DE FLUJO DEL SERVIDOR
// ==========================================

async function iniciarSesion() {
    let intentos = 0;
    while (intentos < 3) {
        menuLogin();
        const nombre = await rl.question("INGRESE SU NOMBRE DE USUARIO\n>>> ");
        const contrasena = await rl.question("INGRESE SU CONTRASEÑA\n>>> ");
        
        try {
            const base_de_datos = leerBaseDeDatos();
            // Validar accesos (Rol 3 = Cocina)
            iniciarSesionSistema(nombre.trim(), contrasena, 3, base_de_datos);
            
            console.log("\n¡BIENVENIDO EQUIPO DE COCINA DE BIG CAESARS!");
            return true;
        } catch (error) {
            intentos++;
            console.error(`\nERROR: ${error.message.toUpperCase()}`);
            console.log(`INTENTOS RESTANTES: ${3 - intentos}`);
        }
    }
    console.log("\nHA EXCEDIDO EL NÚMERO MÁXIMO DE INTENTOS. CERRANDO EL SISTEMA.");
    process.exit(1);
}

async function submenuProductos() {
    let regresar = false;
    while (!regresar) {
        menuGestionarProductos();
        const opcion = (await rl.question("SELECCIONE UNA OPCIÓN\n>>> ")).trim().toUpperCase();
        
        try {
            let base_de_datos = leerBaseDeDatos();
            
            switch (opcion) {
                case "1":
                    console.log("\n=== CATÁLOGO DE PRODUCTOS ===");
                    verProductos(base_de_datos);
                    break;
                    
                case "2":
                    console.log("\n--- AGREGAR NUEVO PRODUCTO ---");
                    const nombre = await rl.question("INGRESE EL NOMBRE DEL PRODUCTO\n>>> ");
                    
                    const str_cat = await rl.question("INGRESE EL ID (O IDs SEPARADOS POR COMA) DE LA(S) CATEGORÍA(S)\n>>> ");
                    const id_categoria = procesarArregloIDs(str_cat);
                    
                    const str_ing = await rl.question("INGRESE EL ID (O IDs SEPARADOS POR COMA) DE LOS INGREDIENTES\n>>> ");
                    const id_ingrediente = procesarArregloIDs(str_ing);
                    
                    const precio_str = await rl.question("INGRESE EL PRECIO DEL PRODUCTO\n>>> ");
                    const precio = parseFloat(precio_str);
                    
                    const stock_str = await rl.question("INGRESE EL STOCK INICIAL (PRESIONE ENTER PARA DEJAR EN 0)\n>>> ");
                    const stock = stock_str.trim() === "" ? 0 : parseInt(stock_str, 10);
                    
                    if (Number.isNaN(precio) || Number.isNaN(stock)) {
                        console.log("\nERROR: PRECIO O STOCK DEBEN SER VALORES NUMÉRICOS.");
                        continue;
                    }
                    
                    const nuevo_producto = await crearProducto({ 
                        nombre: nombre.trim(), 
                        id_categoria, 
                        id_ingrediente, 
                        precio, 
                        stock 
                    }, base_de_datos);
                    
                    console.log(`\nPRODUCTO CREADO CON ÉXITO. ID: ${nuevo_producto.id_producto}`);
                    break;
                    
                case "3":
                    console.log("\n--- ACTUALIZAR PRODUCTO ---");
                    verProductos(base_de_datos);
                    
                    const id_prod_str = await rl.question("\nINGRESE EL ID DEL PRODUCTO A EDITAR\n>>> ");
                    const id_producto = Number(id_prod_str);
                    
                    if (Number.isNaN(id_producto) || id_prod_str.trim() === "") {
                        console.log("\nDEBES INGRESAR UN VALOR NUMÉRICO PARA EL ID.");
                        continue;
                    }
                    
                    console.log("\nDEJE EN BLANCO LOS CAMPOS QUE NO DESEE MODIFICAR:");
                    const n_nombre = await rl.question("NUEVO NOMBRE DEL PRODUCTO\n>>> ");
                    const n_str_cat = await rl.question("NUEVOS IDs DE CATEGORÍAS (SEPARADOS POR COMA)\n>>> ");
                    const n_str_ing = await rl.question("NUEVOS IDs DE INGREDIENTES (SEPARADOS POR COMA)\n>>> ");
                    const n_precio_str = await rl.question("NUEVO PRECIO\n>>> ");
                    const n_stock_str = await rl.question("NUEVO STOCK\n>>> ");
                    
                    const datos_nuevos = {};
                    if (n_nombre.trim() !== "") datos_nuevos.nombre = n_nombre.trim();
                    if (n_str_cat.trim() !== "") datos_nuevos.id_categoria = procesarArregloIDs(n_str_cat);
                    if (n_str_ing.trim() !== "") datos_nuevos.id_ingrediente = procesarArregloIDs(n_str_ing);
                    if (n_precio_str.trim() !== "") datos_nuevos.precio = parseFloat(n_precio_str);
                    if (n_stock_str.trim() !== "") datos_nuevos.stock = parseInt(n_stock_str, 10);
                    
                    const actualizado = await actualizarProducto(id_producto, datos_nuevos, base_de_datos);
                    console.log(`\nPRODUCTO ID ${actualizado.id_producto} ACTUALIZADO CON ÉXITO.`);
                    break;
                    
                case "4":
                    console.log("\n--- ELIMINAR PRODUCTO ---");
                    verProductos(base_de_datos);
                    
                    const id_eliminar_str = await rl.question("\nINGRESE EL ID DEL PRODUCTO A ELIMINAR\n>>> ");
                    const id_eliminar = Number(id_eliminar_str);
                    
                    if (Number.isNaN(id_eliminar) || id_eliminar_str.trim() === "") {
                        console.log("\nDEBES INGRESAR UN VALOR NUMÉRICO PARA EL ID.");
                        continue;
                    }
                    
                    const eliminado = await eliminarProducto(id_eliminar, base_de_datos);
                    console.log(`\nPRODUCTO ${eliminado.nombre.toUpperCase()} ELIMINADO CON ÉXITO.`);
                    break;
                    
                case "R":
                    regresar = true;
                    break;
                    
                default:
                    console.log("\nOPCIÓN NO VÁLIDA. INTENTE DE NUEVO.");
            }
        } catch (error) {
            console.error(`\nERROR: ${error.message.toUpperCase()}`);
        }
    }
}

async function submenuPedidos() {
    let regresar = false;
    while (!regresar) {
        menuGestionarPedidos();
        const opcion = (await rl.question("SELECCIONE UNA OPCIÓN\n>>> ")).trim().toUpperCase();
        
        try {
            let base_de_datos = leerBaseDeDatos();
            
            switch (opcion) {
                case "1":
                    console.log("\n=== LISTADO GENERAL DE PEDIDOS ===");
                    verPedidos(base_de_datos);
                    break;
                    
                case "2":
                    const id_str = await rl.question("\nINGRESE EL ID DEL CLIENTE PARA VER SUS PEDIDOS\n>>> ");
                    const id_usuario = Number(id_str);
                    
                    if (Number.isNaN(id_usuario) || id_str.trim() === "") {
                        console.log("\nDEBES INGRESAR UN VALOR NUMÉRICO PARA EL ID.");
                        continue;
                    }
                    
                    console.log(`\n=== PEDIDOS DEL CLIENTE ID: ${id_usuario} ===`);
                    verPedidos(base_de_datos, id_usuario);
                    break;
                    
                case "3":
                    console.log("\n--- ACTUALIZAR ESTADO DE PEDIDO ---");
                    verPedidos(base_de_datos);
                    
                    const id_pedido_str = await rl.question("\nINGRESE EL ID DEL PEDIDO A MODIFICAR\n>>> ");
                    const id_pedido = Number(id_pedido_str);
                    
                    if (Number.isNaN(id_pedido) || id_pedido_str.trim() === "") {
                        console.log("\nDEBES INGRESAR UN VALOR NUMÉRICO PARA EL ID DEL PEDIDO.");
                        continue;
                    }
                    
                    console.log(`
ESTADOS DISPONIBLES:
(1) PENDIENTE
(2) EN PREPARACIÓN
(3) COMPLETADO
(4) ENTREGADO
(5) CANCELADO`);
                    
                    const id_estado_str = await rl.question("\nINGRESE EL NUEVO ID DE ESTADO\n>>> ");
                    const id_estado = Number(id_estado_str);
                    
                    if (Number.isNaN(id_estado) || ![1, 2, 3, 4, 5].includes(id_estado)) {
                        console.log("\nID DE ESTADO NO VÁLIDO.");
                        continue;
                    }
                    
                    const pedido_actualizado = await actualizarPedido(id_pedido, { id_estado }, base_de_datos);
                    console.log(`\nESTADO DEL PEDIDO ID ${pedido_actualizado.id_pedido} ACTUALIZADO A ${id_estado} CON ÉXITO.`);
                    break;
                    
                case "R":
                    regresar = true;
                    break;
                    
                default:
                    console.log("\nOPCIÓN NO VÁLIDA. INTENTE DE NUEVO.");
            }
        } catch (error) {
            console.error(`\nERROR: ${error.message.toUpperCase()}`);
        }
    }
}

async function menuPrincipal() {
    let salir = false;
    while (!salir) {
        menuPrincipalCocina();
        const opcion = (await rl.question("SELECCIONE UNA OPCIÓN\n>>> ")).trim().toUpperCase();
        
        switch (opcion) {
            case "1": 
                await submenuProductos(); 
                break;
            case "2": 
                await submenuPedidos(); 
                break;
            case "S": 
                console.log("\nSALIENDO DEL SISTEMA DE COCINA DE BIG CAESARS..."); 
                salir = true; 
                break;
            default: 
                console.log("\nOPCIÓN NO VÁLIDA. INTENTE DE NUEVO.");
        }
    }
    rl.close();
}

async function arrancarServidorCocina() {
    const login_correcto = await iniciarSesion();
    if (login_correcto) {
        await menuPrincipal();
    }
}

arrancarServidorCocina();