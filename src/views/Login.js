import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, AsyncStorage, BackHandler, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Color from '../assets/Colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { iniciarSesion } from '../api/apiClient';
import TextField from '../components/TextField';
import validate from '../utils/validationWrapper';
import Axios from 'axios';
import Colors from '../assets/Colors';
import CarritoHandler from '../utils/CarritoHandler';

export default class Login extends Component {
  state = {
    correo: '',
    contrasena: '',
    errores: {
      errorCorreo: '',
    }
  }

  carritoHandler = new CarritoHandler();

  componentDidMount() {
    this.handleBackPress = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    this.handleBackPress.remove();
  }

  handleBackPress = () => {
    BackHandler.exitApp();
  }

  _validarFormulario() {
    this.setState({
      errores: {
        errorCorreo: validate('email', this.state.correo),
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
      this._iniciarSesion();
    } else {
      Alert.alert('Error en el registro','Verifique los datos ingresados, por favor.',
        [
          {text: 'Ok'},
        ],
        { cancelable: false }
      );
    }
  }

  _iniciarSesion() {
    const { correo, contrasena } = this.state;
    iniciarSesion(correo, contrasena).then(data => {
      //Se elimina contenido de carrito si existe
      this.carritoHandler.vaciar().catch((err)=>{console.log(err)});
      // guardamos el token y esa wea
      Axios.defaults.headers.common['Authorization'] = data.token;
      AsyncStorage.setItem("Token", data.token).then(() => {
        Actions.main();
      });
    }).catch(response => {
      if (response.status == 400) {
        Alert.alert('Error al iniciar sesión', 'Verifique que el correo esté bien escrito', [{
          text: 'Ok'
        }], {
          cancelable: false
        })
      } else if (response.status == 401) {
        Alert.alert('Error al iniciar sesión', 'Usuario y/o contraseña incorrectos', [{
          text: 'Ok'
        }], {
          cancelable: false
        })
      } else {
        console.error(response);
        Alert.alert('Error al iniciar sesión', 'No se puede iniciar sesión en este momento, inténtelo mas tarde', [{
          text: 'Ok'
        }], {
          cancelable: false
        })
      }
    });
  }

  render() {
    return (
      <KeyboardAwareScrollView
      style={{flex: 1}}
      contentContainerStyle={styles.container}
      >
        <View style={styles.innerContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/img/logo2.png')} style={styles.logo} resizeMode="cover" resizeMethod='scale'/>
          </View>
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
          />
          <TouchableOpacity onPress={() => {this._validarFormulario()}} style={styles.button}>
            <Text style={styles.textButton}>
              Iniciar Sesión
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {Actions.registro()}}>
            <Text style={styles.linkButton}>
              ¿No tienes cuenta? Regístrate aquí
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.white,
    justifyContent: 'center',
    width: '100%'
  },
  logo: {
    aspectRatio: 16/9,
    height: 150,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 25
  },
  title: {
    fontSize: 26,
    marginBottom: 25,
    marginTop: 40
  },
  textInput: {
    alignItems: 'center',
    backgroundColor: Colors.white,
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
    marginBottom: 30,
    marginTop: 10,
    width: '80%',
  },
  textButton: {
    color: Color.white,
    fontSize: 15,
    marginVertical: 10,
  },
  linkButton: {
    color: Color.primary,
    fontWeight: '500'
  }
})