import React, { Component } from 'react';
import {AppRegistry, Navigator, StyleSheet, View} from 'react-native';

import NewSideBar from './js/NewSidebar';
import Main from './js/Main';

export default class AppSAPv2 extends Component {
    render() {
        return (
           <Main />
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#FFFFFF',
        borderColor: '#FFFFFF'
    }
});

AppRegistry.registerComponent('AppSAPv2', () => AppSAPv2);
