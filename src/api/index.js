import * as ApiClient from './apiClient';

export const iniciarSesion  = ApiClient.iniciarSesion;

// Productos
export const GET_Productos      = ApiClient.GET_Productos;
export const POST_Productos     = ApiClient.POST_Productos;
export const PUT_Productos      = ApiClient.PUT_Productos;
export const DELETE_Productos   = ApiClient.DELETE_Productos;

// Clientes
export const GET_Clientes       = ApiClient.GET_Clientes;
export const POST_Clientes      = ApiClient.POST_Clientes;
export const PUT_Clientes       = ApiClient.PUT_Clientes;
export const DELETE_Clientes    = ApiClient.DELETE_Clientes;

// Ventas
export const POST_AbonoVenta    = ApiClient.POST_AbonoVenta;
export const GET_VentaPorId     = ApiClient.GET_VentaPorId;

// Cobros de Hoy
export const GET_CobrosDeHoy    = ApiClient.GET_CobrosDeHoy