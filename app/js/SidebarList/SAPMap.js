/**
 * This functionality will allow users to view map of SAP eiher by:
 *  - pinching
 *  - double tap.
 *  maxScale={X}  ---> X can be any integer you wish to zoom in. 
 * Best performance for the images to be less than 1MB to reduce loading time.
 */


import React,{Component} from 'react';

import {StyleSheet, View,Text, ScrollView, Picker} from 'react-native';

import Image from 'react-native-transformable-image';

const CONTENT = 
  {
       'busStop':{ 
            title: 'Bus Stops',
            url: 'https://firebasestorage.googleapis.com/v0/b/asap-c4472.appspot.com/o/Map%2FBusStop%2FBUSSTOPMAP.png?alt=media&token=2ac0d750-5ccd-45ee-9975-cb4e708d011a', 
       },
        'lunchRoute': {
            title: 'Lunch',
            url: 'https://firebasestorage.googleapis.com/v0/b/asap-c4472.appspot.com/o/Map%2FLunchRoute%2FLUNCHMAP.png?alt=media&token=4e9d834d-26bf-46a3-a5c4-971f8d20068c'
        },
        'overview': {
            title: 'Overview',
            url: 'https://firebasestorage.googleapis.com/v0/b/asap-c4472.appspot.com/o/Map%2FOverall%2FSAPMap.jpg?alt=media&token=364a21ff-718c-40e7-a2fb-fb2b83189e83',
        },
  
  };

export default class SAPMap extends Component {
    constructor(props) {
        super(props);
        this.state ={
            mapType: 'overview'
        }
    }

    render(){
        var type = CONTENT[this.state.mapType];
        console.log( "content type:" + type.title);
        console.log( "url link:" + type.url);
        
        return(
            <View style={style.container}>
                <Text>Select map view:</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={this.state.mapType}
                        onValueChange={(mapValue) => this.setState({mapType: mapValue})}>
                            <Picker.Item label = "Overview" value = "overview" />
                            <Picker.Item label = "Lunch" value = "lunchRoute" />
                            <Picker.Item label = "Bus Stop" value = "busStop" />
                    </Picker>
                    <Text>You are currently viewing: {type.title} map</Text>
                </View>
                <Image 
                    enableTrasnform={true}
                    enableScale={true}
                    maxScale={10}
                    style={styles.imageStyle}
                    source={{uri: type.url}}/>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        flex:1,
        padding: 5,
        backgroundColor: 'white'
    },
    imageStyle: {
        flex: 1,
        width: undefined,
        height: undefined,
    },

    pickerContainer: {
        flex:0,
    }
});