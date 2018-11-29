import React, { PureComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../assets/Colors'
import Moment from 'moment'

export default class ListItem_CobrosDeHoy extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const {idVenta, cliente, hora, deuda, fechaAPagar} = this.props.data
        return (
            <View style={[styles.root, { backgroundColor: Moment().isAfter(fechaAPagar, 'day') ? Colors.lightDanger : Colors.white }]}>
                <View>
                    <Text style={styles.textCliente}>
                        Cliente {`${cliente.nombre} ${cliente.apPaterno} ${cliente.apMaterno}`}
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon name='phone' size={14} color='black' style={{marginRight: 5}}/>
                        <Text>
                            {cliente.telefono}
                        </Text>
                    </View>
                    <Text style={styles.textCliente}>
                        Pedido: #{idVenta}
                    </Text>
                </View>
                <View>
                    <Text style={styles.textHora}>
                        {Moment(fechaAPagar).format('DD/MM/YYYY')}
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon name='access-time' size={14} color='black' style={{marginRight: 5}}/>
                        <Text style={styles.textHora}>
                            13:00
                        </Text>
                    </View>
                    <Text style={styles.textDeuda}>
                        ${deuda}
                    </Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: 'black',
        marginVertical: 2,
        marginHorizontal: 5,
        elevation: 1
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textCliente: {
        fontSize: 16
    },
    textDeuda: {
        fontWeight: 'bold'
    }
});