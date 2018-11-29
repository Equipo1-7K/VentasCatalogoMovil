import React, { PureComponent } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import CarritoHandler from '../utils/CarritoHandler';
import NumericInput from 'react-native-numeric-input';
import Colors from '../assets/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  id: number,
  nombre: string,
  descripcion: string,
  precio: number,
  imagen?: string
}

export default class ListItem_Carrito extends PureComponent<Props> {
  constructor(props) {
    super(props);
    const {id, nombre, descripcion, precio, imagen, cantidad, subtotal} = this.props;
    const producto = {id, nombre, descripcion, precio, imagen, cantidad, subtotal}
    this.carritoHandler = new CarritoHandler();
    this.state = {
      producto: producto
    }
  }

  handleDeletePress = () => {
    this.carritoHandler.eliminarProducto(this.state.producto.id).then(() => {
      this.props.handleOnRefresh();
    })
  }

  render() {
    const { nombre, descripcion, precio, imagen } = this.state.producto
    return (
      <View style={{flex: 1}}>
        <View>
          <View style={{zIndex: 1}}>
            <View style={styles.root}>
              <Image style={styles.image} resizeMode={'cover'} resizeMethod={'scale'} source={{uri: imagen || 'https://via.placeholder.com/2000x3000?text=Placeholder'}}></Image>
              <View style={styles.footer}>
                <Text style={styles.producto}>{nombre}</Text>
                <Text style={styles.descripcion} numberOfLines={1}>{descripcion}</Text>
                <Text style={styles.precio}>${precio}</Text>
                <View style={styles.carritoSpacer} />
              </View>
            </View>
          </View>
        </View>
        <View style={{ position: 'absolute', left: 30, bottom: 20, zIndex: 2 }}>
          <NumericInput 
            initValue={this.state.producto.cantidad}
            value={this.state.producto.cantidad}
            onChange={value => {
              this.setState({producto: {...this.state.producto, cantidad: value}}, () => {
                this.props.onQuantityChange(this.state.producto, value);
              });
            }}
            minValue={1} 
            totalHeight={40}
            inputStyle={{backgroundColor: Colors.white}}
            rightButtonBackgroundColor={Colors.carrito}
            leftButtonBackgroundColor={Colors.carrito}
            iconStyle={{color: Colors.white}}
            borderColor={Colors.carrito}
            totalWidth={150}
          />
        </View>
        <View style={{ position: 'absolute', right: 30, bottom: 130, zIndex: 2 }}>
          <TouchableOpacity onPress={this.handleDeletePress}>
            <Icon name="delete" style={styles.iconDelete} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    // flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
    elevation: 1,
  },
  image: {
    width: '100%',
    aspectRatio: 1
  },
  footer: {
    flex: 1, 
    backgroundColor: '#00000033',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '42%',
    paddingTop: 2,
    paddingHorizontal: 10
  },
  producto: {
    flex: 1,
    fontSize: 24,
    color: 'white'
  },
  descripcion: {
    flex: 1,
    fontSize: 16,
    lineHeight: 30,
    color: 'white'
  },
  precio: {
    flex: 1,
    fontSize: 16,
    color: 'white'
  },
  carritoSpacer: {
    flex: 1,
  },
  carrito: {
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
    paddingHorizontal: 2
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconDelete: {
    color: Colors.white,
    fontSize: 30
  }
});