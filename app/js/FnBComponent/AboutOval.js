/**
 * https://github.com/react-native-community/react-native-side-menu/blob/master/examples/Basic/Basic.js#L107
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View,  Image, Alert, TouchableOpacity,Linking,ScrollView, Dimensions} from 'react-native';
import { Tile, Icon ,SideMenu, SocialIcon} from 'react-native-elements';

//import Icon from 'react-native-vector-icons/MaterialIcons';

import img from '../../../img/ovaltherainbow.jpg';

var deviceHeight = Dimensions.get('window').height;
export default class AboutOval extends Component {
 
       
  render() {
    console.log('img'+img);
    return (
        <View style={styles.container}>
          <ScrollView>
            <View style={{flex:1}}>
             <Image
                style={{flex:1, width: undefined, height:deviceHeight/2.7}}
                resizeMode={'contain'}
                source={img}/>

            </View>
            <View style={styles.ovalDescription}>
              <Text style={styles.descriptionHeading}>ABOUT THE OVAL</Text>
              <Text>
              The Oval @ SAP is a cluster of 32 black & white bungalows that have been gazetted for conservation under the Urban Redevelopment Authority (URA) Master Plan 2014. It is set to be a vibrant lifestyle destination with an eclectic mix of restaurants and cafés, kids’ activities, retail and service outlets, as well as offices. 
</Text>
<Text> {'\n'}</Text>
<Text>
  Alongside the runway of Seletar Airport, the distinctive architecture of the heritage houses amidst lush, rustic greenery provides a unique location in the North-east region of Singapore.
</Text>
<Text> {'\n'}</Text>
<Text>
Other than being a great weekend destination for families to enjoy, The Oval @ SAP also functions as an exciting epicentre for the SAP community to congregate, enhancing Seletar Aerospace Park as a vibrant and attractive place to work and play.
</Text>

              <View style={styles.followUs}>
                <Text>Follow us on Facebook!</Text>
      
                <TouchableOpacity onPress={()=> this.handleClick('https://www.facebook.com/ovalsap/')} >
                  <SocialIcon
                    type='facebook'
                  />
                  <Text> THE OVAL </Text>
                </TouchableOpacity>
              </View>
            </View>
          
            </ScrollView>
       </View>
 
   );
  }  

  handleClick(url) {
     Linking.openURL(url);
  }      
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  ovalDescription: {
    padding: 20,
  },

  descriptionHeading: {
    fontSize: 24,
    color: 'rgba(218,29,42,0.8)'
  },
  followUs: {
    paddingTop: 20
  }

 
});
