import React, { Component } from 'react';
import { ActivityIndicator, Alert, FlatList, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../../assets/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ActionButton from 'react-native-action-button';
import { Actions } from 'react-native-router-flux'
import CarritoHandler from '../../utils/CarritoHandler';
import TextDataWithIcon from '../../components/TextDataWithIcon';
import ListItem_Carrito from '../../components/ListItem_Carrito';

/**
 * @class Carrito
 * @description Vista del carrito utilizada dentro del tabView
 */
export default class Carrito extends Component {
	constructor(props) {
		super(props);
		this.carritoHandler = new CarritoHandler();
		this.state = {
			carrito: [],
			total: 0,
			page: 1,
			pages: 0,
			threshold: 0.5,
			loading: true,
			refreshing: false
		}
	}

	componentWillMount() {
		this.handleOnRefresh();
	}

	handleOnRefresh = () => {
		this.carritoHandler.obtenerProductos().then((productos) => {
			this.carritoHandler.obtenerTotal().then((total) => {
				this.setState({
					carrito: productos,
					total,
					loading: false					
				});
			}).catch(() => {});
		}).catch(()=> {
			this._eventoSinProductos();
		})
	}
	_eventoSinProductos = () => {
		this.setState({
			carrito: [],
			total: 0,
			loading: false
		})
	}

	_componenteSinProductos = () => {
		return (
			<TextDataWithIcon
				label={'Carrito vacío'}
				icon={'add-shopping-cart'}
				styleContainer={{marginHorizontal: 20}}
				styleDescription={styles.dataText}
				description={'Puede agregar productos al carrito desde la vista de Productos'}
			>
			</TextDataWithIcon>
		);
	}

	agregarProducto = (producto, cantidad) => {
		this.carritoHandler.agregarProducto(producto, cantidad).then(() => {
			this.carritoHandler.obtenerTotal().then((total) => {
				this.setState({total});
			}).catch(() => {});
		})
	}

	handleOnEmptyPress = () => {
		this.carritoHandler.vaciar().then(() => {
			this._eventoSinProductos();
		}).catch((err) => {
			Alert.alert(
        'Error',
        'No se pudo vaciar el carrito, inténtelo más tarde por favor.',
        [
          {text: 'Ok'},
        ],
        { cancelable: false }
      );
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={{marginHorizontal: 20}}>
					<TextDataWithIcon
						label={'Total a pagar'}
						icon={'attach-money'}
						styleContainer={{marginTop: 0}}
						styleDescription={styles.dataText}
						styleLabel={{marginTop: 10}}
						description={this.state.total}
					>
					</TextDataWithIcon>
				</View>
				<FlatList
					ListEmptyComponent={this._componenteSinProductos}
					ref={list => this.list = list}
					data={this.state.carrito}
					renderItem={({item}) => (
						<ListItem_Carrito 
							style={{flex: 1}} 
							{...item} 
							onQuantityChange={this.agregarProducto}
							handleOnRefresh={this.handleOnRefresh}
						/>
					)}
					keyExtractor={(item, index) => index.toString()}
					ListFooterComponent={
							this.state.loading ? 
							<ActivityIndicator
									style={{margin: 10}}
									size={"small"}
									color={Colors.secondary}
							/> : null
					}
					onRefresh={() => this.handleOnRefresh()}
					refreshing={this.state.refreshing}
				/>
				<ActionButton 
          buttonColor={Colors.carrito} 
          renderIcon={active => (<Icon name="menu" style={styles.actionButtonIcon}/>)}>
        >
          <ActionButton.Item 
            buttonColor={Colors.success} 
            title="Terminar venta" 
            onPress={() => { 
              Actions.pop();
              Actions.clientesEditar({cliente: this.state.cliente}) 
            }}
          >
            <Icon name="check" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item 
            buttonColor={Colors.danger} 
            title="Vaciar carrito" 
            onPress={this.handleOnEmptyPress}
          >
            <Icon name="remove-shopping-cart" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	actionButtonIcon: {
    color: Colors.white,
    fontSize: 20
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignContent: 'center',
		paddingTop: 0
	},
	dataText: {
    fontSize: 18
  }
});