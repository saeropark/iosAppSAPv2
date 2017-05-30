import React,{Component} from 'react';

import {
    StyleSheet,
    View,
    Text,
    ScrollView, Picker, Platform, PickerIOS
} from 'react-native';

import PhotoView from 'react-native-photo-view';
const CONTENT = 
  {
       'busStop':{ 
            title: 'Bus Stops Available',
            url: 'https://firebasestorage.googleapis.com/v0/b/asap-c4472.appspot.com/o/Map%2FBusStop%2Fwf-home.jpg?alt=media&token=57396f62-4aa2-4986-a118-b2390f11738e', 
       },
        'lunchRoute': {
            title: 'Lunch',
            url: 'https://firebasestorage.googleapis.com/v0/b/asap-c4472.appspot.com/o/Map%2FLunchRoute%2Fwf-sidebar.png?alt=media&token=1372c9e7-b177-4d16-a36b-9141db3237d5'
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
        var PickerType = (Platform.OS === 'android')? Picker: PickeriOS;
        //--- mapValue reads picker.item value.
        return(

            <View style={{flex:1}}>
                <Text>Please choose a map view:</Text>
            <PickerType
                selectedValue={this.state.mapType}
                onValueChange={(mapValue) => this.setState({mapType: mapValue})}>
                    <PickerType.Item label = "Overview" value = "overview" />
                    <PickerType.Item label = "Lunch" value = "lunchRoute" />
                    <PickerType.Item label = "Bus Stop" value = "busStop" />
                    
                </PickerType>
                
                <PhotoView
                    source={{uri: type.url}}
                    minimumZoomScale={1}
                    maximumZoomScale={10}
                    onLoad={() => console.log("Image loaded!")}
                    style={{flex: 1, width: undefined, height: undefined }} />
            </View>
        )
    }
}

var styles = StyleSheet.create({
    pdf: {
        flex:1
    }
});