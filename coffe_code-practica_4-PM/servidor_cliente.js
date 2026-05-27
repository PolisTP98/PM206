import { rl, iniciarSesionSistema } from "./controlador.js";
import { leerBaseDeDatos } from "./base_de_datos.js";
import { crearUsuario, Usuario } from "./usuarios.js";
import { crearPedido } from "./pedidos.js";

// ==========================================
// VISTAS Y MENÚS MULTILÍNEA (PARTE SUPERIOR)
// ==========================================

function menuPrincipalCliente(sesion_activa, nombre_usuario) {
    const estado_usuario = sesion_activa ? `SESIÓN: ${nombre_usuario.toUpperCase()}` : "MODO: INVITADO (SIN CUENTA)";
    console.log(`
=== MENÚ PRINCIPAL - BIG CAESARS CLIENTES ===
[ ${estado_usuario} ]
=============================================
| (1) VER MENÚ DE PRODUCTOS                 |
| (2) HACER UN PEDIDO (REQUIERE SESIÓN)     |
| (3) VER MIS PEDIDOS (REQUIERE SESIÓN)     |
|                                           |
| [S] SALIR DEL SISTEMA                     |
=============================================`);
}

function menuAutenticacion() {
    console.log(`
=== CONTROL DE ACCESO REQUERIDO ===
===================================
| (1) INICIAR SESIÓN              |
| (2) REGISTRARSE (NUEVA CUENTA)  |
|                                 |
| [R] REGRESAR AL MENÚ PRINCIPAL  |
===================================`);
}

function menuFiltradoProductos() {
    console.log(`
=== SUBMENÚ: FILTRAR PRODUCTOS ===
==================================
| (1) VER TODOS LOS PRODUCTOS    |
| (2) PRODUCTOS CAROS (> $100)   |
| (3) PRODUCTOS BARATOS (<= $100)|
| (4) FILTRAR POR CATEGORÍA      |
| (5) FILTRAR POR INGREDIENTE    |
|                                |
| [R] REGRESAR AL MENÚ PRINCIPAL  |
==================================`);
}

// ==========================================
// VARIABLES DE SESIÓN LOCAL DEL CLIENTE
// ==========================================
let usuario_autenticado = null; 

// Promesa auxiliar para simular retrasos de tiempo lineal (1 segundo)
const esperarUnSegundo = () => new Promise(resolve => setTimeout(resolve, 1000));

// ==========================================
// GESTIÓN DE AUTENTICACIÓN (LOGIN / REGISTRO)
// ==========================================

async function forzarAutenticacion() {
    let intentos = 0;
    while (intentos < 3) {
        menuAutenticacion();
        const opcion = (await rl.question("SELECCIONE UNA OPCIÓN\n>>> ")).trim().toUpperCase();

        if (opcion === "R") {
            return false;
        }

        if (opcion === "1") { // Login
            console.log("\n--- INICIO DE SESIÓN ---");
            const nombre = await rl.question("INGRESE SU NOMBRE DE USUARIO\n>>> ");
            const contrasena = await rl.question("INGRESE SU CONTRASEÑA\n>>> ");
            try {
                const base_de_datos = leerBaseDeDatos();
                // Validar acceso para Cliente (Rol 4)
                const usuario = iniciarSesionSistema(nombre.trim(), contrasena, 4, base_de_datos);
                usuario_autenticado = usuario;
                console.log(`\n¡BIENVENIDO NUEVAMENTE, ${usuario_autenticado.nombre.toUpperCase()}!`);
                return true;
            } catch (error) {
                intentos++;
                console.error(`\nERROR: ${error.message.toUpperCase()}`);
                console.log(`INTENTOS RESTANTES: ${3 - intentos}`);
            }
        } 
        else if (opcion === "2") { // Registro Obligatorio + Login Forzado
            console.log("\n--- REGISTRO DE NUEVO CLIENTE ---");
            const nombre = await rl.question("ELIJA SU NOMBRE DE USUARIO\n>>> ");
            const contrasena = await rl.question("ELIJA SU CONTRASEÑA\n>>> ");
            try {
                let base_de_datos = leerBaseDeDatos();
                // id_rol = 4 de forma predeterminada para Clientes
                const nuevo_usuario = await crearUsuario({ nombre: nombre.trim(), contrasena, id_rol: 4 }, base_de_datos);
                console.log(`\n¡REGISTRO EXITOSO! SU ID ASIGNADO ES: ${nuevo_usuario.id_usuario}`);
                
                // Forzar inicio de sesión automático e inmediato tras el registro exitoso
                base_de_datos = leerBaseDeDatos();
                usuario_autenticado = iniciarSesionSistema(nombre.trim(), contrasena, 4, base_de_datos);
                return true;
            } catch (error) {
                console.error(`\nERROR EN REGISTRO: ${error.message.toUpperCase()}`);
            }
        } else {
            console.log("\nOPCIÓN NO VÁLIDA.");
        }
    }

    // Si falla el login 3 veces y no se registró una nueva cuenta con éxito
    console.log("\nHA EXCEDIDO EL NÚMERO MÁXIMO DE INTENTOS DE ACCESO.");
    console.log("REDIRIGIENDO AUTOMÁTICAMENTE AL MENÚ DE REGISTRO FORZADO...");
    
    // Bucle de registro mandatorio (No se rompe hasta que se registre con éxito)
    while (true) {
        console.log("\n--- REGISTRO OBLIGATORIO DE CLIENTE ---");
        const nombre = await rl.question("ELIJA SU NOMBRE DE USUARIO\n>>> ");
        const contrasena = await rl.question("ELIJA SU CONTRASEÑA\n>>> ");
        try {
            let base_de_datos = leerBaseDeDatos();
            const nuevo_usuario = await crearUsuario({ nombre: nombre.trim(), contrasena, id_rol: 4 }, base_de_datos);
            console.log(`\n¡REGISTRO EXITOSO! SU ID ASIGNADO ES: ${nuevo_usuario.id_usuario}`);
            
            base_de_datos = leerBaseDeDatos();
            usuario_autenticado = iniciarSesionSistema(nombre.trim(), contrasena, 4, base_de_datos);
            return true;
        } catch (error) {
            console.error(`\nERROR EN REGISTRO: ${error.message.toUpperCase()}`);
        }
    }
}

// ==========================================
// VISTA DE PRODUCTOS Y FILTRADOS
// ==========================================

function imprimirProductosBonito(lista_productos) {
    if (lista_productos.length === 0) {
        console.log("\nNO SE ENCONTRARON PRODUCTOS QUE COINCIDAN CON EL FILTRO.");
        return;
    }
    console.log("\n=======================================================");
    lista_productos.forEach(p => {
        console.log(`ID: ${p.id_producto} | ${p.nombre.toUpperCase()} - $${p.precio} (STOCK: ${p.stock})`);
    });
    console.log("=======================================================");
}

async function submenuVerProductos() {
    let regresar = false;
    while (!regresar) {
        menuFiltradoProductos();
        const opcion = (await rl.question("SELECCIONE UNA OPCIÓN DE FILTRADO\n>>> ")).trim().toUpperCase();
        const base_de_datos = leerBaseDeDatos();

        switch (opcion) {
            case "1":
                imprimirProductosBonito(base_de_datos.productos);
                break;
            case "2": // Productos Caros (> 100)
                imprimirProductosBonito(base_de_datos.productos.filter(p => p.precio > 100));
                break;
            case "3": // Productos Baratos (<= 100)
                imprimirProductosBonito(base_de_datos.productos.filter(p => p.precio <= 100));
                break;
            case "4": // Filtrar por Categoría
                const cat_id = Number(await rl.question("\nINGRESE EL ID DE LA CATEGORÍA A FILTRAR\n>>> "));
                if (Number.isNaN(cat_id)) {
                    console.log("\nERROR: DEBE SER UN VALOR NUMÉRICO.");
                } else {
                    // id_categoria puede ser un arreglo o un entero según el backend de cocina
                    imprimirProductosBonito(base_de_datos.productos.filter(p => 
                        Array.isArray(p.id_categoria) ? p.id_categoria.includes(cat_id) : p.id_categoria === cat_id
                    ));
                }
                break;
            case "5": // Filtrar por Ingrediente
                const ing_id = Number(await rl.question("\nINGRESE EL ID DEL INGREDIENTE A FILTRAR\n>>> "));
                if (Number.isNaN(ing_id)) {
                    console.log("\nERROR: DEBE SER UN VALOR NUMÉRICO.");
                } else {
                    // id_ingrediente puede ser un arreglo o un entero
                    imprimirProductosBonito(base_de_datos.productos.filter(p => 
                        Array.isArray(p.id_ingrediente) ? p.id_ingrediente.includes(ing_id) : p.id_ingrediente === ing_id
                    ));
                }
                break;
            case "R":
                regresar = true;
                break;
            default:
                console.log("\nOPCIÓN NO VÁLIDA. INTENTE DE NUEVO.");
        }
    }
}

// ==========================================
// OPERACIÓN: HACER PEDIDO
// ==========================================

async function procesarNuevoPedido() {
    console.log("\n=== NUEVA ORDEN DE COMPRA ===");
    let base_de_datos = leerBaseDeDatos();
    imprimirProductosBonito(base_de_datos.productos);

    let comprando = true;
    const carrito_temporal = [];

    while (comprando) {
        const prod_id_str = await rl.question("\nINGRESE EL ID DEL PRODUCTO QUE DESEA ORDENAR\n>>> ");
        const cantidad_str = await rl.question("INGRESE LA CANTIDAD\n>>> ");

        const id_producto = Number(prod_id_str);
        const cantidad = Number(cantidad_str);

        if (Number.isNaN(id_producto) || Number.isNaN(cantidad) || cantidad <= 0) {
            console.log("\nDATOS INVÁLIDOS. INTENTE OTRA VEZ.");
            continue;
        }

        const producto_valido = base_de_datos.productos.find(p => p.id_producto === id_producto);
        if (!producto_valido) {
            console.log("\nEL ID DE PRODUCTO NO EXISTE.");
            continue;
        }

        carrito_temporal.push({ id_producto, cantidad });
        console.log(`\nAGREGADO: ${producto_valido.nombre.toUpperCase()} X${cantidad}`);

        const continuar = (await rl.question("\n¿DESEA AGREGAR OTRO PRODUCTO AL PEDIDO? (S/N)\n>>> ")).trim().toUpperCase();
        if (continuar !== "S") {
            comprando = false;
        }
    }

    if (carrito_temporal.length === 0) {
        console.log("\nCARRITO VACÍO. OPERACIÓN CANCELADA.");
        return;
    }

    // Proceder al guardado asíncrono e inyección en la base de datos
    console.log("\nPROCESANDO Y GUARDANDO SU COMPRA...");
    try {
        for (const item of carrito_temporal) {
            base_de_datos = leerBaseDeDatos();
            // Todo pedido de cliente inicia en id_estado = 1 (Pendiente)
            await crearPedido({
                id_usuario: usuario_autenticado.id_usuario,
                id_producto: item.id_producto,
                cantidad: item.cantidad,
                id_estado: 1 
            }, base_de_datos);
        }
        console.log("\n¡SU PEDIDO HA SIDO ENVIADO A LA COCINA CON ÉXITO!");
    } catch (error) {
        console.error(`\nERROR AL PROCESAR PEDIDO: ${error.message.toUpperCase()}`);
    }
}

// ==========================================
// OPERACIÓN: VER PEDIDOS DEL USUARIO + TIMEOUTS
// ==========================================

async function consultarMisPedidos() {
    console.log(`\n=== HISTORIAL DE PEDIDOS DE: ${usuario_autenticado.nombre.toUpperCase()} ===`);
    const base_de_datos = leerBaseDeDatos();

    // Extraemos solo los registros que pertenezcan al cliente autenticado en esta sesión
    const mis_pedidos = base_de_datos.pedidos.filter(p => p.id_usuario === usuario_autenticado.id_usuario);

    if (mis_pedidos.length === 0) {
        console.log("\nUSTED NO TIENE NINGÚN PEDIDO REGISTRADO AÚN.");
        return;
    }

    let suma_subtotales = 0;

    // Desglose Financiero General en MAYÚSCULAS
    mis_pedidos.forEach(pedido => {
        const producto = base_de_datos.productos.find(p => p.id_producto === pedido.id_producto);
        const nombre_producto = producto ? producto.nombre.toUpperCase() : "PRODUCTO DESCONOCIDO";
        const precio = producto ? producto.precio : 0;
        const subtotal = precio * pedido.cantidad;
        suma_subtotales += subtotal;

        console.log(`- PEDIDO ID: ${pedido.id_pedido} | ${nombre_producto} X${pedido.cantidad} | SUBTOTAL: $${subtotal}`);
    });

    const total_iva = 0.16 * suma_subtotales;
    const total_con_iva = suma_subtotales + total_iva;

    console.log(`---------------------------------------------------`);
    console.log(`SUMA DE SUBTOTALES: $${suma_subtotales.toFixed(2)}`);
    console.log(`TOTAL IVA (16%):    $${total_iva.toFixed(2)}`);
    console.log(`TOTAL CON IVA:      $${total_con_iva.toFixed(2)}`);
    console.log(`---------------------------------------------------`);
    
    console.log("\nRASTREANDO EL ESTADO LOGÍSTICO DE SUS ORDENES...");
    
    // Impresión secuencial asíncrona de los estados con un retraso lineal de 1 segundo
    for (const pedido of mis_pedidos) {
        const producto = base_de_datos.productos.find(p => p.id_producto === pedido.id_producto);
        const nombre_prod = producto ? producto.nombre.toUpperCase() : "PRODUCTO";
        
        console.log(`\n>>> FLUX DE ESTADOS PARA EL PEDIDO DE ${nombre_prod} (ID: ${pedido.id_pedido}):`);
        
        // Obtenemos e imprimimos de forma ordenada todos los estados por los que pasó/está el pedido
        const estado_actual_limite = pedido.id_estado; // Ej. 2 (En preparación)
        
        for (let i = 1; i <= estado_actual_limite; i++) {
            await esperarUnSegundo(); // Pausa exacta de 1000 ms
            const estado_info = base_de_datos.estados.find(e => e.id_estado === i);
            if (estado_info) {
                console.log(`  [ESTADO] -> ${estado_info.nombre.toUpperCase()}`);
            }
        }
        console.log(`* ESTADO ACTUAL RETENIDO: EL PEDIDO SE ENCUENTRA AQUÍ.`);
    }
    console.log(`\n===================================================`);
}

// ==========================================
// MENÚ CONTROLADOR PRINCIPAL DEL CLIENTE
// ==========================================

async function menuPrincipal() {
    let salir = false;
    while (!salir) {
        menuPrincipalCliente(usuario_autenticado !== null, usuario_autenticado ? usuario_autenticado.nombre : "");
        const opcion = (await rl.question("SELECCIONE UNA OPCIÓN\n>>> ")).trim().toUpperCase();

        switch (opcion) {
            case "1":
                await submenuVerProductos();
                break;
            case "2":
                // Si no está autenticado, se le exige iniciar sesión o registrarse
                if (!usuario_autenticado) {
                    const acceso_concedido = await forzarAutenticacion();
                    if (!acceso_concedido) continue;
                }
                await procesarNuevoPedido();
                break;
            case "3":
                if (!usuario_autenticado) {
                    const acceso_concedido = await forzarAutenticacion();
                    if (!acceso_concedido) continue;
                }
                await consultarMisPedidos();
                break;
            case "S":
                console.log("\n¡GRACIAS POR VISITAR BIG CAESARS! VUELVA PRONTO.");
                salir = true;
                break;
            default:
                console.log("\nOPCIÓN NO VÁLIDA. INTENTE DE NUEVO.");
        }
    }
    rl.close();
}

async function arrancarServidorCliente() {
    await menuPrincipal();
}

arrancarServidorCliente();