
import React, { Component } from 'react';
import { Navigator, StyleSheet,TouchableOpacity,Text,View, Platform , TouchableHighlight} from 'react-native';

export default class TenanDirectory extends Component {
   
    render() {
        return(
            <View style={styles.container}>
                <Text> Tenants </Text>
                <Text>
                List of Tenants.
                </Text>
            
            
            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
   flex: 1,
    padding: Platform.OS === 'ios' ? 12 : 16,
  },
});
