import Axios from 'axios'
import {URL, SESION, REGISTRO, PRODUCTOS, CLIENTES, VENTAS, COBROS_DEL_DIA} from './Constantes'

// ----------- Sesión -----------

/**
 * Petición GET para iniciar sesión
 * @param {string} correo - Correo de usuario
 * @param {string} contrasena - Contraseña de usuario
 * @returns {Promise} El objeto promesa representa los datos de la respuesta de la petición
 */
export const iniciarSesion = (correo, contrasena) => {
  return new Promise((resolve, reject) => {
    Axios.post(SESION, {
        correo, contrasena
    }).then((response) => {
        resolve(response.data)
    }).catch(err => {
        reject(err.response)
    })
  })
}

/**
 * Petición POST para registrar un usuario.
 * @param {Object} usuario - Objeto con parámetros del usuario
 * @param {string} usuario.nombre - Nombre del usuario
 * @param {string} usuario.apPaterno - Apellido paterno del usuario
 * @param {string} usuario.apMaterno - Apellido materno del usuario
 * @param {string} usuario.correo - Correo del usuario
 * @param {string} usuario.contrasena - Contraseña del usuario
 * @returns {Promise} El objeto promesa representa los datos de la respuesta de la petición
 */
export const registrarUsuario = (usuario) => {
  return new Promise((resolve, reject) => {
    Axios.post(REGISTRO, usuario).then((response) => {
        resolve(response.data)
    }).catch(err => {
        reject(err.response)
    })
  })
}

// ----------- Productos -----------
/**
 * Petición GET para obtener productos paginados.
 * @param {number} page - Número de página
 * @param {number} perPage - Cantidad de productos por página
 * @returns {Promise} El objeto promesa representa los datos de la respuesta de la petición
 */
export const GET_Productos = (page, perPage) => {
    return new Promise((resolve, reject) => {
        Axios.get(`${PRODUCTOS}?page=${page}&perPage=${perPage}`).then((response) => {
            response.data.items.forEach((producto, index, array) => {
                array[index].imagen = `${URL}/public/img/${producto.imagen}.jpg`
            });
            resolve(response.data)
        }).catch(err => {
            reject(err.response)
        })
    })
}

/**
 * Petición POST para registrar un producto.
 * @param {Object} producto - Objeto de producto
 * @param {string} producto.nombre - Nombre del producto
 * @param {number} producto.precio - Precio del producto
 * @param {string} producto.descripcion - Descripción del producto
 * @param {string} producto.imagen - Imagen del producto en base 64
 * @returns {Promise} El objeto promesa representa los datos de la respuesta de la petición
 */
export const POST_Productos = (producto) => {
    return new Promise((resolve, reject) => {
        Axios.post(PRODUCTOS, producto).then((response) => {
            resolve(response.data)
        }).catch(err => {
            reject(err.response)
        })
    })
}

/**
 * Petición PUT para modificar un producto.
 * @param {number} id - Id del producto
 * @param {Object} producto - Objeto de producto
 * @param {string} producto.nombre - Nombre del producto
 * @param {number} producto.precio - Precio del producto
 * @param {string} producto.descripcion - Descripción del producto
 * @param {string} producto.imagen - Imagen del producto en base 64
 * @returns {Promise} El objeto promesa representa los datos de la respuesta de la petición
 */
export const PUT_Productos = (id, producto) => {
    return new Promise((resolve, reject) => {
        Axios.put(`${PRODUCTOS}/${id}`, producto).then((response) => {
            resolve(response.data)
        }).catch(err => {
            reject(err)
        })
    })
}

/**
 * Petición DELETE para eliminar un producto.
 * @param {number} id - Id del producto
 * @returns {Promise} El objeto promesa representa los datos de la respuesta de la petición
 */
export const DELETE_Productos = (id) => {
    return new Promise((resolve, reject) => {
        Axios.delete(`${PRODUCTOS}/${id}`).then((response) => {
            resolve(response.data)
        }).catch(err => {
            reject(err)
        })
    })
}

// ----------- Clientes -----------
/**
 * Petición GET para obtener clientes paginados.
 * @param {number} page - Número de página
 * @param {number} perPage - Cantidad de clientes por página
 * @returns {Promise} El objeto promesa representa los datos de la respuesta de la petición
 */
export const GET_Clientes = (page, perPage) => {
    return new Promise((resolve, reject) => {
        Axios.get(`${CLIENTES}?page=${page}&perPage=${perPage}`).then((response) => {
            resolve(response.data)
        }).catch(err => {
            console.log(err)
            reject(err.response)
        })
    })
}

/**
 * Petición POST para registrar un cliente.
 * @param {Object} cliente - Objeto de cliente
 * @param {string} cliente.nombre - Nombre del cliente
 * @param {string} cliente.apPaterno - Apellido paterno del cliente
 * @param {string} cliente.apMaterno - Apellido materno del cliente
 * @param {string} cliente.telefono - Número telefónico del cliente
 * @param {string} cliente.correo - Correo del cliente
 * @param {Object} cliente.domicilio - Objeto de domicilio del cliente
 * @param {string} cliente.domicilio.calle - Calle de domicilio del cliente
 * @param {string} cliente.domicilio.noExterno - Número externo de domicilio del cliente
 * @param {string} cliente.domicilio.noInterno - Número interno de domicilio del cliente
 * @param {string} cliente.domicilio.colonia - Colonia de domicilio del cliente
 * @param {string} cliente.domicilio.municipio - Municipio de domicilio del cliente
 * @param {string} cliente.domicilio.estado - Estado de domicilio del cliente
 * @param {string} cliente.domicilio.cp - Código postal de domicilio del cliente
 * @param {string} cliente.domicilio.referencia - Referencia de domicilio del cliente
 * @returns {Promise} El objeto promesa representa los datos de la respuesta de la petición
 */
export const POST_Clientes = (cliente) => {
    return new Promise((resolve, reject) => {
        Axios.post(CLIENTES, cliente).then((response) => {
            resolve(response.data)
        }).catch(err => {
            reject(err.response)
        })
    })
}

/**
 * Petición PUT para modificar un cliente.
 * @param {number} idCliente - Id del cliente
 * @param {Object} cliente - Objeto de cliente
 * @param {string} cliente.nombre - Nombre del cliente
 * @param {string} cliente.apPaterno - Apellido paterno del cliente
 * @param {string} cliente.apMaterno - Apellido materno del cliente
 * @param {string} cliente.telefono - Número telefónico del cliente
 * @param {string} cliente.correo - Correo del cliente
 * @param {Object} cliente.domicilio - Objeto de domicilio del cliente
 * @param {string} cliente.domicilio.calle - Calle de domicilio del cliente
 * @param {string} cliente.domicilio.noExterno - Número externo de domicilio del cliente
 * @param {string} cliente.domicilio.noInterno - Número interno de domicilio del cliente
 * @param {string} cliente.domicilio.colonia - Colonia de domicilio del cliente
 * @param {string} cliente.domicilio.municipio - Municipio de domicilio del cliente
 * @param {string} cliente.domicilio.estado - Estado de domicilio del cliente
 * @param {string} cliente.domicilio.cp - Código postal de domicilio del cliente
 * @param {string} cliente.domicilio.referencia - Referencia de domicilio del cliente
 * @returns {Promise} El objeto promesa representa los datos de la respuesta de la petición
 */
export const PUT_Clientes = (idCliente, cliente) => {
    return new Promise((resolve, reject) => {
        Axios.put(`${CLIENTES}/${idCliente}`, cliente).then((response) => {
            resolve(response.data)
        }).catch(err => {
            reject(err.response)
        })
    })
}

/**
 * Petición DELETE para eliminar un cliente.
 * @param {number} id - Id del cliente
 * @returns {Promise} El objeto promesa representa los datos de la respuesta de la petición
 */
export const DELETE_Clientes = (id) => {
    return new Promise((resolve, reject) => {
        Axios.delete(`${CLIENTES}/${id}`).then((response) => {
            resolve(response.data)
        }).catch(err => {
            reject(err)
        })
    })
}

// ----------- Cobros de Hoy -----------
/**
 * Petición GET para obtener los cobros de hoy
 * @returns {Promise} El objeto promesa representa los datos de la respuesta de la petición
 */
export const GET_CobrosDeHoy = (page, perPage) => {
    return new Promise((resolve, reject) => {
        Axios.get(`${COBROS_DEL_DIA}?page=${page}&perPage=${perPage}`).then((response) => {
            resolve(response.data)  
        }).catch(err => {
            reject(err)
        })
    })
}

/**
 * Petición POST para agregar un abono a un cliente y pedido específico
 * @returns {Promise} El objeto promesa representa los datos de la respuesta de la petición
 */
export const GET_VentaPorId = (id) => {
    return new Promise((resolve, reject) => {
        Axios.get(`${VENTAS}/${id}`).then((response) => {
            resolve(response.data)  
        }).catch(err => {
            reject(err)
        })
    })
}

/**
 * Petición POST para agregar un abono a un cliente y pedido específico
 * @returns {Promise} El objeto promesa representa los datos de la respuesta de la petición
 */
export const POST_AbonoVenta = (idVenta, cantidad) => {
    return new Promise((resolve, reject) => {
        Axios.post(`${VENTAS}/${idVenta}/abonos`, {cantidad}).then((response) => {
            resolve(response.data)  
        }).catch(err => {
            reject(err)
        })
    })
}