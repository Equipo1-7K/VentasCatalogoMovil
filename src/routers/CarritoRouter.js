import React, { Component } from 'react';
import { Scene } from 'react-native-router-flux';
import { CarritoVenta as CarritoVentaView } from '../views/main/carrito/CarritoVenta';

const CarritoVenta = () => {
    return (
        <Scene key='carritoVenta' component={CarritoVentaView} title='Finalizar venta'/>
    )
}

export default CarritoVenta();