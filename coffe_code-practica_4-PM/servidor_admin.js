import { rl, iniciarSesionSistema } from "./controlador.js";
import { leerBaseDeDatos } from "./base_de_datos.js";
import { crearUsuario, verUsuarios, actualizarUsuario, eliminarUsuario } from "./usuarios.js";


function menuLogin() {
    console.log(`
======================================
|          INICIO DE SESIÓN          |
======================================
    `);
}


function menuPrincipalAdmin() {
    console.log(`
==========================
| (1) VER USUARIOS       |
| (2) AGREGAR USUARIO    |
| (3) ACTUALIZAR USUARIO |
| (4) ELIMINAR USUARIO   |
|                        |
| [S] SALIR DEL SISTEMA  |
==========================
    `);
}


function menuUsuarios() {
    console.log(`
=================================
| (1) ADMINISTRADOR             |
| (2) CAJA                      |
| (3) COCINA                    |
| (4) CLIENTE                   |
| (5) CUALQUIER USUARIO         |
|                               |
| [R] REGRESAR AL MENÚ ANTERIOR |
=================================
    `);
}


function menuAgregarU() {
    console.log(`
=================================
| (1) ADMINISTRADOR             |
| (2) CAJA                      |
| (3) COCINA                    |
| (4) CLIENTE                   |
|                               |
| [R] REGRESAR AL MENÚ ANTERIOR |
=================================
    `);
}


async function iniciarSesion() {
    let intentos = 0;
    while(intentos < 3) {
        menuLogin();
        const nombre = await rl.question("INGRESE SU NOMBRE DE USUARIO\n>>> ");
        const contrasena = await rl.question("INGRESE SU CONTRASEÑA\n>>> ");
        try {
            const base_de_datos = leerBaseDeDatos();
            iniciarSesionSistema(nombre.trim(), contrasena, 1, base_de_datos);
            console.log("\n¡BIENVENIDO ADMINISTRADOR DE BIG CAESARS!");
            return true;
        }
        catch(error) {
            intentos++;
            console.error(`\nERROR: ${error.message.toUpperCase()}`);
            console.log(`INTENTOS RESTANTES: ${3 - intentos}`);
        }
    }
    console.log("\nHA EXCEDIDO EL NÚMERO MÁXIMO DE INTENTOS. CERRANDO EL SISTEMA.");
    process.exit(1);
}


async function menuVerUsuarios() {
    let regresar = false;
    while(!regresar) {
        menuUsuarios();
        const opcion = (await rl.question("SELECCIONE EL TIPO DE USUARIO A MOSTRAR\n>>> ")).trim().toUpperCase();        
        try {
            const base_de_datos = leerBaseDeDatos();
            switch(opcion) {
                case "1": verUsuarios(base_de_datos, 1); break;
                case "2": verUsuarios(base_de_datos, 2); break;
                case "3": verUsuarios(base_de_datos, 3); break;
                case "4": verUsuarios(base_de_datos, 4); break;
                case "5": verUsuarios(base_de_datos); break;
                case "R": regresar = true; break;
                default: console.log("\nOPCIÓN NO VÁLIDA. INTENTE DE NUEVO.");
            }
        }
        catch(error) {
            console.error(`\nERROR: ${error.message.toUpperCase()}`);
        }
    }
}


async function menuAgregarUsuario() {
    let regresar = false;
    while (!regresar) {
        menuAgregarU();
        const opcion = (await rl.question("SELECCIONE EL TIPO DE USUARIO A AGREGAR\n>>> ")).trim().toUpperCase();
        if (opcion === "R") {
            regresar = true;
            break;
        }
        let id_rol = Number(opcion);
        if (![1, 2, 3, 4].includes(id_rol)) {
            console.log("\nOPCIÓN NO VÁLIDA. INTENTE DE NUEVO.");
            continue;
        }
        try {
            const nombre = await rl.question("\nINGRESE EL NOMBRE DEL NUEVO USUARIO\n>>> ");
            const contrasena = await rl.question("INGRESE LA CONTRASEÑA DEL NUEVO USUARIO\n>>> ");
            const base_de_datos = leerBaseDeDatos();
            const nuevo_usuario = await crearUsuario({ nombre, contrasena, id_rol }, base_de_datos);
            console.log(`\nUSUARIO AGREGADO CON ÉXITO. ID: ${nuevo_usuario.id_usuario}`);
        } catch (error) {
            console.error(`\nERROR: ${error.message.toUpperCase()}`);
        }
    }
}


async function submenuActualizarUsuario() {
    let regresar = false;
    while (!regresar) {
        menuAgregarU();
        const opcion = (await rl.question("SELECCIONE EL TIPO DE USUARIO A EDITAR\n>>> ")).trim().toUpperCase();
        if (opcion === "R") {
            regresar = true;
            break;
        }
        let filter_rol = ["1", "2", "3", "4"].includes(opcion) ? Number(opcion) : undefined;
        if (opcion !== "5" && filter_rol === undefined) {
            console.log("\nOPCIÓN NO VÁLIDA. INTENTE DE NUEVO.");
            continue;
        }
        try {
            let base_de_datos = leerBaseDeDatos();
            verUsuarios(base_de_datos, filter_rol);
            const id_str = await rl.question("\nINGRESE EL ID DEL USUARIO A EDITAR\n>>> ");
            const id_usuario = Number(id_str);
            if (Number.isNaN(id_usuario) || id_str.trim() === "") {
                console.log("\nDEBES INGRESAR UN VALOR NUMÉRICO PARA EL ID.");
                continue;
            }
            const usuario_existente = base_de_datos.usuarios.find(u => u.id_usuario === id_usuario);
            if (!usuario_existente || (filter_rol !== undefined && usuario_existente.id_rol !== filter_rol)) {
                console.log("\nEL ID NO CORRESPONDE A LA CATEGORÍA SELECCIONADA O NO EXISTE.");
                continue;
            }
            console.log("\nDEJE EN BLANCO LOS CAMPOS QUE NO DESEE MODIFICAR:");
            const nombre = await rl.question("NUEVO NOMBRE DE USUARIO\n>>> ");
            const contrasena = await rl.question("NUEVA CONTRASEÑA\n>>> ");
            const nuevo_rol_str = await rl.question("NUEVO ID DE ROL (1: ADMIN, 2: CAJA, 3: COCINA, 4: CLIENTE)\n>>> ");
            const datos_nuevos = {};
            if (nombre.trim() !== "") datos_nuevos.nombre = nombre;
            if (contrasena.trim() !== "") datos_nuevos.contrasena = contrasena;
            if (nuevo_rol_str.trim() !== "") {
                const n_rol = Number(nuevo_rol_str);
                if (!Number.isNaN(n_rol)) datos_nuevos.id_rol = n_rol;
            }
            base_de_datos = leerBaseDeDatos();
            const actualizado = await actualizarUsuario(id_usuario, datos_nuevos, base_de_datos);
            console.log(`\nUSUARIO ID ${actualizado.id_usuario} ACTUALIZADO CON ÉXITO.`);
        }
        catch (error) {
            console.error(`\nERROR: ${error.message.toUpperCase()}`);
        }
    }
}


async function submenuEliminarUsuario() {
    let regresar = false;
    while(!regresar) {
        menuAgregarU();
        const opcion = (await rl.question("SELECCIONE EL TIPO DE USUARIO A ELIMINAR\n>>> ")).trim().toUpperCase();
        if (opcion === "R") {
            regresar = true;
            break;
        }
        let filter_rol = ["1", "2", "3", "4"].includes(opcion) ? Number(opcion) : undefined;
        if (opcion !== "5" && filter_rol === undefined) {
            console.log("\nOPCIÓN NO VÁLIDA. INTENTE DE NUEVO.");
            continue;
        }
        try {
            let base_de_datos = leerBaseDeDatos();
            verUsuarios(base_de_datos, filter_rol);
            const id_str = await rl.question("\nINGRESE EL ID DEL USUARIO A ELIMINAR\n>>> ");
            const id_usuario = Number(id_str);
            if (Number.isNaN(id_usuario) || id_str.trim() === "") {
                console.log("\nDEBES INGRESAR UN VALOR NUMÉRICO PARA EL ID.");
                continue;
            }
            const usuario_existente = base_de_datos.usuarios.find(u => u.id_usuario === id_usuario);
            if (!usuario_existente || (filter_rol !== undefined && usuario_existente.id_rol !== filter_rol)) {
                console.log("\nEL ID NO CORRESPONDE A LA CATEGORÍA SELECCIONADA O NO EXISTE.");
                continue;
            }
            const confirmacion = (await rl.question(`\n¿ESTÁ SEGURO DE ELIMINAR AL USUARIO ${usuario_existente.nombre.toUpperCase()}? (S/N)\n>>> `)).trim().toUpperCase();
            if (confirmacion !== "S") {
                console.log("\nOPERACIÓN CANCELADA.");
                continue;
            }
            base_de_datos = leerBaseDeDatos();
            const eliminado = await eliminarUsuario(id_usuario, base_de_datos);
            console.log(`\nUSUARIO ${eliminado.nombre.toUpperCase()} ELIMINADO CON ÉXITO.`);
        }
        catch (error) {
            console.error(`\nERROR: ${error.message.toUpperCase()}`);
        }
    }
}


async function menuPrincipal() {
    let salir = false;
    while (!salir) {
        menuPrincipalAdmin();
        const opcion = (await rl.question("SELECCIONE UNA OPCIÓN\n>>> ")).trim().toUpperCase();
        switch (opcion) {
            case "1": await menuVerUsuarios(); break;
            case "2": await menuAgregarUsuario(); break;
            case "3": await submenuActualizarUsuario(); break;
            case "4": await submenuEliminarUsuario(); break;
            case "S": 
                console.log("\nSALIENDO DEL SISTEMA ADMINISTRATIVO DE BIG CAESARS..."); 
                salir = true; 
                break;
            default: 
                console.log("\nOPCIÓN NO VÁLIDA. INTENTE DE NUEVO.");
        }
    }
    rl.close();
}


async function arrancarServidorAdmin() {
    const login_correcto = await iniciarSesion();
    if (login_correcto) {
        await menuPrincipal();
    }
}


arrancarServidorAdmin();