/**
 * AboutJTC description. 
 */
import React, { Component } from 'react';
import { Navigator, StyleSheet,TouchableOpacity,Text,View, Platform , TouchableHighlight} from 'react-native';
 
export default class AboutJTC extends Component {
   
    render() {
        return(
            <View style={styles.container}>

           
                <Text style={{fontSize:30, color: '(218,29,42,0.8)', padding:5}}> About JTC </Text>
                <Text style={{padding: 10, fontSize: 16}}>
                
                JTC Corporation (JTC) is the lead agency in Singapore to spearhead the planning, 
                promotion and development of a dynamic industrial landscape.
                Since its inception in 1968, JTC has played a major role in Singapore's economic development 
                journey by developing land and space to support the transformation of industries and create quality jobs.
                </Text>
            
            
            </View>
        )
    }

   
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
});
