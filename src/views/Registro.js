import React from 'react';
import BackHandledComponent from '../components/BackHandledComponent';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Color from '../assets/Colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {registrarUsuario} from '../api/apiClient';
import TextField from '../components/TextField';
import validate from '../utils/validationWrapper';
import Colors from '../assets/Colors';

export default class Registro extends BackHandledComponent {
  state = {
    nombre: '',
    apPaterno: '',
    apMaterno: '',
    correo: '',
    contrasena: '',
    errores: {
      errorNombre: '',
      errorApPaterno: '',
      errorApMaterno: '',
      errorCorreo: '',
      errorContrasena: ''
    },
  }

  _validarFormulario() {
    this.setState({
      errores: {
        errorNombre: validate('userDataRequired', this.state.nombre),
        errorApPaterno: validate('userDataRequired', this.state.apPaterno),
        errorApMaterno: validate('userData', this.state.apMaterno),
        errorCorreo: validate('email', this.state.correo),
        errorContrasena: validate('password', this.state.contrasena)
      }
    }, this._asignarValidezFormulario);
  }

  _asignarValidezFormulario = () => {
    const { errores } = this.state;
    let validezFormulario = true;
    for (const index in errores) {
      if (errores[index]) {
        validezFormulario = false;
        break;
      }
    }
    if (validezFormulario) {
      this.registrarUsuario();
    } else {
      Alert.alert('Error en el registro','Verifique los datos ingresados, por favor.',
        [
          {text: 'Ok'},
        ],
        { cancelable: false }
      );
    }
  }

  registrarUsuario() {
    const { nombre, apPaterno, apMaterno, correo, contrasena } = this.state;
    const usuario = { nombre, apPaterno, apMaterno, correo, contrasena };
    registrarUsuario(usuario).then(data => {
      Alert.alert('','Registro realizado con éxito',
        [
          {text: 'Ok', onPress: () => Actions.login()},
        ],
        { cancelable: false }
      );
    }).catch(response => {
      if (response.status == 400) {
        Alert.alert('Error en el registro', 'Verifique los datos ingresados', [{
            text: 'Ok'
          }], {
            cancelable: false
        });
      } else {
        Alert.alert('Error en el registro', 'No se puede registrar en este momento, inténtelo mas tarde', [{
            text: 'Ok'
          }], {
            cancelable: false
        });
      }
    });
  }

  render() {
    return (
      <KeyboardAwareScrollView 
      style={{flex: 1, backgroundColor: Colors.white}}
      contentContainerStyle={styles.container}
      >
        <View>
          <Text style={styles.title}>
            Registro
          </Text>
        </View>
        <TextField
          autoCapitalize={'words'}
          style={[styles.textInput]}
          onChangeText={(nombre) => this.setState({nombre})}
          value={this.state.nombre}
          placeholder={'Nombre(s)'}
          placeholderTextColor={'#999999'}
          ref={input => {this.tb_nombre = input}}
          onSubmitEditing={ () => { this.tb_apPaterno.input.focus()} }
          returnKeyType={'next'}
          onBlur={() => {
            this.setState({
              errores: {
                ...this.state.errores,
                errorNombre: validate('userDataRequired', this.state.nombre),
              }
            })
          }}
          error={this.state.errores.errorNombre}
        />
        <TextField
          autoCapitalize={'words'}
          style={[styles.textInput]}
          onChangeText={(apPaterno) => this.setState({apPaterno})}
          value={this.state.apPaterno}
          placeholder={'Apellido paterno'}
          placeholderTextColor={'#999999'}
          ref={input => {this.tb_apPaterno = input}}
          onSubmitEditing={ () => { this.tb_apMaterno.input.focus() } }
          returnKeyType={'next'}
          onBlur={() => {
            this.setState({
              errores: {
                ...this.state.errores,
                errorApPaterno: validate('userDataRequired', this.state.apPaterno),
              }
            })
          }}
          error={this.state.errores.errorApPaterno}
        />
        <TextField
          autoCapitalize={'words'}
          style={[styles.textInput]}
          onChangeText={(apMaterno) => this.setState({apMaterno})}
          value={this.state.apMaterno}
          placeholder={'Apellido materno'}
          placeholderTextColor={'#999999'}
          ref={input => {this.tb_apMaterno = input}}
          onSubmitEditing={ () => { this.tb_correo.input.focus() } }
          returnKeyType={'next'}
          onBlur={() => {
            this.setState({
              errores: {
                ...this.state.errores,
                errorApMaterno: validate('userData', this.state.apMaterno),
              }
            })
          }}
          error={this.state.errores.errorApMaterno}
        />
        <TextField
          autoCapitalize={'none'}
          keyboardType={'email-address'}
          style={[styles.textInput]}
          onChangeText={(correo) => {this.setState({correo})}}
          value={this.state.correo}
          placeholder={'Correo'}
          placeholderTextColor={'#999999'}
          ref={input => {this.tb_correo = input}}
          onSubmitEditing={ () => { this.tb_contrasena.input.focus() } }
          returnKeyType={'next'}
          onBlur={() => {
            this.setState({
              errores: {
                ...this.state.errores,
                errorCorreo: validate('email', this.state.correo),
              }
            })
          }}
          error={this.state.errores.errorCorreo}
        />
        <TextField
          autoCapitalize={'none'}
          style={[styles.textInput]}
          onChangeText={(contrasena) => this.setState({contrasena})}
          value={this.state.contrasena}
          secureTextEntry={true}
          placeholder={'Contraseña'}
          placeholderTextColor={'#999999'}
          ref={input => {this.tb_contrasena = input}}
          onSubmitEditing={ () => { this._validarFormulario() } }
          returnKeyType={'done'}
          onBlur={() => {
            this.setState({
              errores: {
                ...this.state.errores,
                errorContrasena: validate('password', this.state.contrasena),
              }
            })
          }}
          error={this.state.errores.errorContrasena}
        />
        <TouchableOpacity onPress={() => {this._validarFormulario()}} style={styles.button}>
          <Text style={styles.textButton}>
            Registrarme
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
    marginTop: 20
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
    width: '100%',
  },
  button: {
    alignItems: 'center',
    backgroundColor: Color.primary,
    borderRadius: 5,
    justifyContent: 'center',
    marginVertical: 10,
    width: '80%',
  },
  textButton: {
    color: Color.white,
    fontSize: 15,
    marginVertical: 10,
  }
})