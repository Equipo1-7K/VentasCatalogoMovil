import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import ListItem_Clientes from '../../components/ListItem_Clientes';
import Colors from '../../assets/Colors';
import { GET_Clientes as getClientes } from '../../api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ActionButton from 'react-native-action-button';
import { Actions } from 'react-native-router-flux';

/**
 * Vista para mostrar lista de clientes
 * @class
 */
export default class Clientes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      perPage: 10,
      clientes: [],
      threshold: 0.5,
      loading: true,
      refreshing: false
    }
  }

  componentDidMount() {
    this.handleOnRefresh();
  }

  AgregarElemento(newItem) {
    this.setState({
      clientes: [
        ...this.state.clientes,
        newItem
      ]
    });
  }

  EliminarElemento(id) {
    const arrayTemp = this.state.clientes;
    arrayTemp.find((element, index, array) => {
      if (element.id === id) {
        array.splice(index, 1);
        return true;
      }
    });
    this.setState({
      clientes: arrayTemp
    });
  }

  ModificarElemento(id, updatedItem) {
    const arrayTemp = this.state.clientes;
    arrayTemp.find((element, index, array) => {
      if (element.id === id) {
        array[index] = updatedItem;
        return true;
      }
    });
    this.setState({
      clientes: arrayTemp
    });
  }

  /** @function handleOnRefresh
   * @access private
   * @description Se manda a llamar cuando se refresca la vista o se carga por primera vez. Restablece el state a configuración inicial. Ejecuta función de petición GET para obtener clientes paginados.
   */
  handleOnRefresh = () => {
    getClientes(1, this.state.perPage).then(result => {
      this.setState({
        refreshing: true
      }, () => {
        this.setState({
          page: 1,
          clientes: result.items,
          pages: parseInt(result.total / this.state.perPage) + 1,
          threshold: 0.5,
          loading: true,
          refreshing: false
        })
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

  /** @function handleOnEndReached
   * @access private
   * @description Se manda a llamar cuando al hacer scroll hacia abajo se alcanza el fin de la vista. Modifica el state para aumentar la paginación. Ejecuta función de petición GET para obtener clientes paginados.
   */
  handleOnEndReached = (distanceFromEnd) => {
    if (this.state.page < this.state.pages) {
      getClientes(this.state.page + 1, this.state.perPage).then(result => {
        this.setState({
          page: this.state.page + 1,
          clientes: [...this.state.clientes, ...result.items]
        });
      }).catch(err => {
        console.log(err);
      })
    } else {
      this.setState({
        loading: false
      }, () => {
        console.log("Final alcanzado");
      })
    }
  }

  render() {
    return (
      <View style={{flex: 1, marginTop: 5}}>
        <FlatList
          ref={list => this.list = list}
          data={this.state.clientes}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => {Actions.clientesDetalle({cliente: item})}}>
              <ListItem_Clientes style={{flex: 1}} {...item} />
            </TouchableOpacity>
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
          onRefresh={() => {
            this.setState({
              refreshing: true
            }, () => {
              this.handleOnRefresh();
            })
          }}
          refreshing={this.state.refreshing}
        />
        <ActionButton 
          buttonColor={Colors.clientes}
          onPress={() => { Actions.clientesAgregar() }}
        >
        </ActionButton>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    borderColor: 'black',
    elevation: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
    marginVertical: 2,
  },
  containerCliente: {
    padding: 20,
    width: '90%',
  },
  textCliente: {
    fontSize: 16
  },
  containerIcono: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: '10%',
  }
});