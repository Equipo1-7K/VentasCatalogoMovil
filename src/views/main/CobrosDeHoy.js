import React, { Component } from 'react';
import {View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import ListItem_CobrosDeHoy from '../../components/ListItem_CobrosDeHoy'
import Colors from '../../assets/Colors';
import {GET_CobrosDeHoy as obtenerCobros} from '../../api'
import { Actions } from 'react-native-router-flux';

export default class CobrosDeHoy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            data: [],
            threshold: 1,
            loading: true,
            refreshing: false
        }
    }

    componentDidMount() {
        this.handleOnRefresh();
    }

    handleOnRefresh = () => {
        obtenerCobros(1, 15).then(result => {
            // console.warn(result)
            this.setState({
                refreshing: true,
            }, () => {
                this.setState({
                    page: 1,
                    data: result.items,
                    pages: parseInt(result.total / 15) + 1,
                    threshold: 1,
                    loading: true,
                    refreshing: false
                })
            })
        }).catch(err => console.error(err))
    }

    handleOnEndReached = (distanceFromEnd) => {
        if (this.state.page < this.state.pages) {
            obtenerCobros(this.state.page + 1, 15).then(result => {
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
                        <TouchableOpacity onPress={() => Actions.abonarCliente({data: item})}>
                            <ListItem_CobrosDeHoy style={{flex: 1}} data={item} />
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
                    onRefresh={() => this.handleOnRefresh()}
                    refreshing={this.state.refreshing}
                />
            </View>
        )
    }
}