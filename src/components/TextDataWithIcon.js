import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../assets/Colors';

class TextDataWithIcon extends Component {
  render() {
    return(
      <View style={[styles.container, this.props.styleContainer]}>
        <Text style={[styles.label, this.props.styleLabel]}>
          {this.props.label}
        </Text>
        <View style={styles.dataContainer}>
          <Icon name={this.props.icon} style={styles.icon}/>
          <Text style={[this.props.styleDescription, styles.description]}>
            {this.props.description}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 20
  },
  dataContainer: {
    flexDirection: 'row',
  },
  icon: {
    flex: .1,
    color: Colors.dark,
    fontSize: 25,
    marginRight: 10
  },
  description: {
    flex: .9
  }
});

export default TextDataWithIcon;