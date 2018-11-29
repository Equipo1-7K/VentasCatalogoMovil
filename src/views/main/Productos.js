import React, { Component } from 'react';
import {View, FlatList, ActivityIndicator } from 'react-native';
import ListItem_Productos from '../../components/ListItem_Productos'
import Colors from '../../assets/Colors';
import ActionButton from 'react-native-action-button';
import {GET_Productos as getProductos} from '../../api'
import { Actions } from 'react-native-router-flux'

/**
 * @class Productos
 * @description Vista de los productos utilizada dentro del tabView
 */
export default class Productos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pages: 0,
            data: [],
            threshold: 0.5,
            loading: true,
            refreshing: false
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.loading;
      }

    componentDidMount() {
        // Obtenemos la primer página de elementos al momento de cargar el componente
        this.handleOnRefresh();
    }

    /**
     * @function AgregarElemento
     * @description Agrega un elemento a la lista de manera dinámica sin actualizarla
     * @param {Object} newItem - El prodcuto nuevo
     * @param {string} newItem.nombre - Nombre del produto
     * @param {string} newItem.precio - Precio del producto
     * @param {string} newItem.descripcion - Descripcion del producto
     * @param {string} newItem.imagen - Cadena de la uri de la imagen del producto
     */
    AgregarElemento(newItem) {
        this.setState({
            data: [
                ...this.state.data,
                newItem
            ]
        })
    }

    /**
     * @function EliminarElemento
     * @description Elimina un elemento a la lista de manera dinámica sin actualizarla
     * @param {number} id - Id del producto a eliminar
     */
    EliminarElemento(id) {
        const arrayTemp = this.state.data;
        arrayTemp.find((element, index, array) => {
            if (element.id === id) {
                array.splice(index, 1);
                return true;
            }
        })
        this.setState({
            data: arrayTemp
        })
    }

    /**
     * @function ModificarElemento
     * @description Modifica un elemento a la lista de manera dinámica sin actualizarla
     * @param {number} id - Id del producto a modificar
     * @param {Object} updatedItem - El prodcuto nuevo
     * @param {string} updatedItem.nombre - Nombre del produto
     * @param {string} updatedItem.precio - Precio del producto
     * @param {string} updatedItem.descripcion - Descripcion del producto
     * @param {string} updatedItem.imagen - Cadena de la uri de la imagen del producto
     */
    ModificarElemento(id, updatedItem) {
        const arrayTemp = this.state.data;
        arrayTemp.find((element, index, array) => {
            if (element.id === id) {
                array[index] = updatedItem;
                return true;
            }
        })
        this.setState({
            data: arrayTemp
        })
    }

    /**
     * @function handleOnRefresh
     * @description Maneja el evento onRefresh de la lista, el gesto de 'jalar' la lista ara actualizarla
     */
    handleOnRefresh = () => {
        getProductos(1, 4).then(result => {
            this.setState({
                refreshing: true
            }, () => {
                this.setState({
                    page: 1,
                    data: result.items,
                    pages: parseInt(result.total / 4) + 1,
                    threshold: 0.5,
                    loading: true,
                    refreshing: false
                })
            })
        })
    }

    /**
     * @function handleOnEndReached
     * @description Maneja evento de haber llegado el fondo de la lista, le pide mas elementos al servidor
     */
    handleOnEndReached = () => {
        if (this.state.page < this.state.pages) {
            getProductos(this.state.page + 1, 4).then(result => {
                console.log(result);
                this.setState({
                    page: this.state.page + 1,
                    data: [...this.state.data, ...result.items]
                });
            }).catch(err => {
                console.log(err);
            })
        } else {
            this.setState({
                loading: false
            })
        }
    }

    render() {
        return (
            <View style={{flex: 1, marginTop: 5}}>
                <FlatList
                    ref={list => this.list = list}
                    data={this.state.data}
                    renderItem={({item}) => (
                        <ListItem_Productos style={{flex: 1}} {...item} />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={(distanceFromEnd) => this.handleOnEndReached(distanceFromEnd)}
                    onEndReachedThreshold={this.state.threshold}
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
                    buttonColor={Colors.productos}
                    onPress={() => { Actions.productosAgregar() }}
                />
            </View>
        )
    }
}