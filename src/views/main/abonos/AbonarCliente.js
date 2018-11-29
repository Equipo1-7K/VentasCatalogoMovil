import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TextField from '../../../components/TextField';
import validate from '../../../utils/validationWrapper';
import ActionButton from 'react-native-action-button';
import Colors from '../../../assets/Colors'
import { POST_AbonoVenta as agregarAbonoVenta, GET_VentaPorId as obtenerVenta } from '../../../api'
import { Actions } from 'react-native-router-flux';
class AbonarCliente extends Component {

    state = {
        deuda: '',
        abono: '',
        errors: {
            abono: ''
        }
    }

    componentDidMount() {
        obtenerVenta(this.props.data.idVenta).then(venta => {
            this.setState({
                deuda: venta.abono.cantidadSiguientePago
            })
        })
    }

  /**
   * @function _domicilioToString
   * @access private
   * @param {(Object|null)} domicilio - Objeto de domicilio del cliente
   * @param {string} cliente.domicilio.calle - Calle de domicilio del cliente
   * @param {string} cliente.domicilio.noExterno - Número externo de domicilio del cliente
   * @param {string} cliente.domicilio.noInterno - Número interno de domicilio del cliente
   * @param {string} cliente.domicilio.colonia - Colonia de domicilio del cliente
   * @param {string} cliente.domicilio.municipio - Municipio de domicilio del cliente
   * @param {string} cliente.domicilio.estado - Estado de domicilio del cliente
   * @param {string} cliente.domicilio.cp - Código postal de domicilio del cliente
   * @param {string} cliente.domicilio.referencia - Referencia de domicilio del cliente
   * @description Se concatenan los elementos de un domicilio.
   * @returns {string} Domicilio completo o string vacío si el objeto es nulo
   */
  _domicilioToString(domicilio) {
    if (domicilio) {
      const { calle, noExterno, noInterno, colonia, municipio, estado, cp, referencia } = domicilio;
      const stringDomicilio = `${calle || ''} ${noExterno || ''} ${(noInterno) ? 'Interior: ' + noInterno : ''}, ${colonia}, ${municipio}, ${estado}, ${cp}
${(referencia) ? 'Referencia: ' + referencia : ''}`;
      return stringDomicilio;
    }
    return '';
  }

    _validarFormulario = () => {
        this.setState({
            errors: {
                abono: validate('price', this.state.abono),
            }
        }, this._asignarValidezFormulario);
    }

    /**
     * @function _asignarValidezFormulario
     * @access private
     * @description Revisa si, después de validar el formulario, hay algún error de validación
     */
    _asignarValidezFormulario = () => {
        const { errors } = this.state;
        let validezFormulario = true;
        for (const index in errors) {
            if (errors[index]) {
                validezFormulario = false;
                break;
            }
        }
        if (validezFormulario) {
            this.agregarAbono();
        } else {
            Alert.alert('Error en el registro','Verifique los datos ingresados, por favor.',
            [
                {text: 'Ok'},
            ],
                { cancelable: false }
            );
        }
    }

    agregarAbono = () => {
        const cantidad = parseFloat(this.state.abono)
        agregarAbonoVenta(this.props.data.idVenta, cantidad).then(abonoAgregado => {
            Alert.alert('Abono Agregado','Se ha agregado un abono por ' + this.state.abono,
            [
                {text: 'Ok', onPress: () => Actions.pop()},
            ],
                { cancelable: false }
            );
        }).catch(err => console.warn(err))
    }

    render() {
        const { idVenta, cliente } = this.props.data
        
        return (
            <View style={styles.root}>
                <Text style={styles.default}>{`${cliente.nombre} ${cliente.apPaterno} ${cliente.apMaterno}`}</Text>
                <Text style={styles.default}>Pedido #{idVenta}</Text>
                <Text style={[styles.default, {fontWeight: 'bold'}]}>A Cobrar: ${this.state.deuda || '-'}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon name='attach-money' size={48} color='black' style={{paddingBottom: 20}}/>
                    <TextField
                        style={styles.textInput}
                        keyboardType='decimal-pad'
                        containerStyle={{width: '100%'}}
                        key
                        value={this.state.abono}
                        onChangeText={(abono) => {
                            this.setState({
                                ...this.state,
                                abono
                            })
                        }}
                        placeholder='0.00'
                        placeholderTextColor={'#999999'}
                        onBlur={() => {
                            this.setState({
                                errors: {
                                    ...this.state.errors,
                                    abono: validate('price', this.state.abono),
                                }
                            })
                        }}
                        error={this.state.errors.abono}/>
                </View>
                <Text style={styles.default}>Datos del cliente:</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon name='phone' size={20} color='black' style={{marginRight: 15}}/>
                    <Text style={[styles.default, {marginBottom: 0}]}>
                        {cliente.telefono}
                    </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
                    <Icon name='email' size={20} color='black' style={{marginRight: 15}}/>
                    <Text style={[styles.default, {marginBottom: 0}]}>
                        {cliente.correo}
                    </Text>
                </View>
                <Text style={[styles.default, {paddingRight: 40}]}>{this._domicilioToString(cliente.domicilio)}</Text>
                <ActionButton 
                    renderIcon={() => <Icon name='check' size={24} color='white' />}
                    buttonColor={Colors.info}
                    onPress={() => { this._validarFormulario() }}>
                </ActionButton>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        padding: 20
    },
    default: {
        fontSize: 20,
        marginBottom: 20
    },
    textInput: {
        alignItems: 'center',
        borderColor: 'lightgray',
        borderRadius: 5,
        borderWidth: 1,
        fontSize: 18,
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingTop: 10,
        width: '80%',
    },
})

export default AbonarCliente;
