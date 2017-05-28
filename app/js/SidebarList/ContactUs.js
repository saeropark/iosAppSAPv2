
import React, { Component } from 'react';
import { Navigator, StyleSheet,TouchableOpacity,Text,View, Platform , TouchableHighlight} from 'react-native';

 
export default class ContactUs extends Component {
   constructor(props) {
       super(props);
   }
    render() {
        return(
            <View style={styles.container}>

                <Text style={{fontSize:30, color: '#b510d3', padding:5}}> Contact Us </Text>
                <Text style={{padding: 10, fontSize: 16,}}>
                    JTC Headquarters{"\n"}
                    JTC Corporation{"\n"}
                    The JTC Summit{"\n"}
                    8 Jurong Town Hall Road{"\n"}
                    Singapore 609434{"\n"}
                    Location Map{"\n"}
                    Email: askjtc@jtc.gov.sg{"\n"}
                    {"\n"}
                    Contact Centre Hotline{"\n"}
                    Local: 1800 - 5687000{"\n"}
                    Overseas: +65 6560 0056{"\n"}
                    Fax: +65 6565 5301{"\n"}
                    {"\n"}
                    Hotlines operate from Mondays to Fridays 8:30am - 6:00pm, and are closed on Saturdays, Sundays and public holidays.{"\n"}
                    For urgent enquiries beyond business hours, please call JTC Essential Services (24/7) at 1800 533 2211.{"\n"}

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
