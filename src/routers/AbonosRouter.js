import React, { Component } from 'react';
import { Scene } from 'react-native-router-flux';
import AbonarCliente from '../views/main/abonos/AbonarCliente'

const AbonarClienteRouter = () => {
    return (
        <Scene key='abonarCliente' component={AbonarCliente} title='Abonar pedido'/>
    )
}

export default AbonarClienteRouter();
