import { rl, iniciarSesionSistema } from "./controlador.js";
import { leerBaseDeDatos } from "./base_de_datos.js";
import { verPedidos } from "./pedidos.js";


function menuLogin() {
    console.log(`
======================================
|          INICIO DE SESIÓN          |
======================================
    `);
}


function menuPrincipalCaja() {
    console.log(`
=================================
| (1) VER TODOS LOS PEDIDOS     |
| (2) VER PEDIDOS DE UN CLIENTE |
|                               |
| [S] SALIR DEL SISTEMA         |
=================================`);
}


function mostrarDesgloseFinanciero(pedidos_filtrados, base_de_datos) {
    if(!pedidos_filtrados || pedidos_filtrados.length === 0)
        return;
    
    const pedidos_por_usuario = {};
    pedidos_filtrados.forEach(pedido => {
        if (!pedidos_por_usuario[pedido.id_usuario]) {
            pedidos_por_usuario[pedido.id_usuario] = [];
        }
        pedidos_por_usuario[pedido.id_usuario].push(pedido);
    });

    Object.entries(pedidos_por_usuario).forEach(([id_usuario, lista_pedidos]) => {
        const usuario = base_de_datos.usuarios.find(u => u.id_usuario === Number(id_usuario));
        const nombre_usuario = usuario ? usuario.nombre.toUpperCase() : "DESCONOCIDO";

        console.log(`\n====================================`);
        console.log(`DESGLOSE ECONÓMICO - CLIENTE: ${nombre_usuario} (ID: ${id_usuario})`);
        console.log(`====================================`);

        let suma_subtotales = 0;

        lista_pedidos.forEach(pedido => {
            const producto = base_de_datos.productos.find(p => p.id_producto === pedido.id_producto);
            const nombre_producto = producto ? producto.nombre.toUpperCase() : "PRODUCTO ELIMINADO";
            const precio_unitario = producto ? producto.precio : 0;
            const subtotal_item = precio_unitario * pedido.cantidad;
            
            suma_subtotales += subtotal_item;

            console.log(`* ${nombre_producto} x${pedido.cantidad} | SUBTOTAL: $${subtotal_item}`);
        });

        const total_iva = 0.16 * suma_subtotales;
        const total_con_iva = suma_subtotales + total_iva;

        console.log(`------------------------------------`);
        console.log(`SUMA DE SUBTOTALES: $${suma_subtotales.toFixed(2)}`);
        console.log(`TOTAL IVA (16%):    $${total_iva.toFixed(2)}`);
        console.log(`TOTAL CON IVA:      $${total_con_iva.toFixed(2)}`);
        console.log(`====================================\n`);
    });
}

async function iniciarSesion() {
    let intentos = 0;
    while (intentos < 3) {
        menuLogin();
        const nombre = await rl.question("INGRESE SU NOMBRE DE USUARIO\n>>> ");
        const contrasena = await rl.question("INGRESE SU CONTRASEÑA\n>>> ");
        
        try {
            const base_de_datos = leerBaseDeDatos();
            // Invocación a la función del controlador compartida para validar accesos (Rol 2 = Caja)
            iniciarSesionSistema(nombre.trim(), contrasena, 2, base_de_datos);
            
            console.log("\n¡BIENVENIDO CAJERO DE BIG CAESARS!");
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

async function consultarTodosLosPedidos() {
    try {
        const base_de_datos = leerBaseDeDatos();
        
        console.log("\n=== LISTADO GENERAL DE PEDIDOS ===");
        verPedidos(base_de_datos);
        
        mostrarDesgloseFinanciero(base_de_datos.pedidos, base_de_datos);
    } catch (error) {
        console.error(`\nERROR: ${error.message.toUpperCase()}`);
    }
}

async function consultarPedidosPorCliente() {
    let regresar = false;
    while (!regresar) {
        try {
            const id_str = await rl.question("\nID DEL CLIENTE A CONSULTAR SUS PEDIDOS (O 'R' PARA REGRESAR)\n>>> ");
            if (id_str.trim().toUpperCase() === "R") {
                regresar = true;
                break;
            }

            const id_usuario = Number(id_str);
            if (Number.isNaN(id_usuario) || id_str.trim() === "") {
                console.log("\nDEBES INGRESAR UN VALOR NUMÉRICO PARA EL ID.");
                continue;
            }

            const base_de_datos = leerBaseDeDatos();
            
            const usuario_existente = base_de_datos.usuarios.find(u => u.id_usuario === id_usuario);
            if (!usuario_existente) {
                console.log("\nEL ID DEL CLIENTE NO EXISTE EN EL SISTEMA.");
                continue;
            }

            console.log(`\n=== PEDIDOS DEL CLIENTE: ${usuario_existente.nombre.toUpperCase()} ===`);
            verPedidos(base_de_datos, id_usuario);

            const pedidos_filtrados = base_de_datos.pedidos.filter(p => p.id_usuario === id_usuario);
            mostrarDesgloseFinanciero(pedidos_filtrados, base_de_datos);

        } catch (error) {
            console.error(`\nERROR: ${error.message.toUpperCase()}`);
        }
    }
}

async function menuPrincipal() {
    let salir = false;
    while (!salir) {
        menuPrincipalCaja();
        const opcion = (await rl.question("SELECCIONE UNA OPCIÓN\n>>> ")).trim().toUpperCase();
        
        switch (opcion) {
            case "1": 
                await consultarTodosLosPedidos(); 
                break;
            case "2": 
                await consultarPedidosPorCliente(); 
                break;
            case "S": 
                console.log("\nSALIENDO DEL SISTEMA DE CAJA DE BIG CAESARS..."); 
                salir = true; 
                break;
            default: 
                console.log("\nOPCIÓN NO VÁLIDA. INTENTE DE NUEVO.");
        }
    }
    rl.close();
}

async function arrancarServidorCaja() {
    const login_correcto = await iniciarSesion();
    if (login_correcto) {
        await menuPrincipal();
    }
}

arrancarServidorCaja();