/* Example: https://github.com/react-community/react-navigation/blob/master/examples/NavigationPlayground/js/Drawer.js */
/**
 * MAIN.JS contains classes that are on the homepage. 
 * Total of 6 images will run every 2hours between 7am to 6.59pm. 7pm - 6.59am is one image. 
 * Each icon 'navigates' points to the path name under the stack. MUST TALLY!
 */
import React, {Component} from 'react';
import {Text,View,Image,StyleSheet, Platform,AlertIOS,TouchableHighlight,TouchableOpacity,Dimensions,ScrollView, NetInfo} from 'react-native';
import { StackNavigator, DrawerNavigator} from 'react-navigation';
import { Icon , Button} from 'react-native-elements';
import SlidingUpPanel from 'react-native-sliding-up-panel';
import * as Animatable from 'react-native-animatable';

import ContactUs from './SidebarList/ContactUs';
import AboutJTC from './SidebarList/AboutJTC';
import TenantDirectory from './SidebarList/TenantDirectory';
import SAPMap from './SidebarList/SAPMap';
import SendFeedback from './SidebarList/SendFeedback';
//import FnBDirectory from './FnBComponent/FnBDirectory';
import FoodStack from './FnBComponent/FnBPromotion';
import EventStack from './EventComponent/EventAnnouncementList';
import RouteStack from './ShuttleBusComponent/BusRoute';

var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;
var MAXIMUM_HEIGHT = (deviceHeight - 100 )/3;
var MINUMUM_HEIGHT = 50;
//======== SCREEN ON LOAD ===========
class MyHomeScreen extends React.Component {
state = {
    connectionInfo: null,
  };

  componentDidMount() {
    NetInfo.addEventListener(
        'change',
        this._handleConnectionInfoChange
    );
    NetInfo.fetch().done(
        (connectionInfo) => { this.setState({connectionInfo}); }
    );
  }

  componentWillUnmount() {
    NetInfo.removeEventListener(
        'change',
        this._handleConnectionInfoChange
    );
  }

  _handleConnectionInfoChange = (connectionInfo) => {
    this.setState({
      connectionInfo,
    });
    console.log(this.state.connectionInfo);
  };

  static navigationOptions = ({navigation}) => ({

    headerTitle: 'Seletar Aerospace Park',
   
    headerTitleStyle: {
        //fontFamily: 'Insignia LT Std Roman'
    },
  });

   constructor(props) {
    super(props);
    this.state = {
      containerHeight : 0
    }
  }

  render() {
        var imgURL;
        var current= new Date();
        var day_night = current.getHours();
        console.log('number:'+ day_night);

        //--- Images for different times of the day:
        if (day_night <=7 && day_night<9 )
            imgURL = require('../../img/field.png');
        else if (day_night<=9 && day_night<11)
            imgURL = require('../../img/wallpaperjtc.png');
        else if (day_night<=11 && day_night<14)
            imgURL = require('../../img/oval4.jpg');
        else if (day_night<=14 && day_night<17)
            imgURL = require('../../img/summergarden.png');
        else if (day_night<=17 && day_night<19)
            imgURL = require('../../img/wheelers.png');
        else 
            imgURL = require('../../img/summerhouse.png');
        console.log('imgURL: ' + imgURL);
    return (

          
        <View style= {styles.container}>
        
         <Image
          source={imgURL}
          style={styles.imgContainer}>
          <View style={styles.parentContainer}>
               
                <SlidingUpPanel 
                    ref={panel => { this.panel = panel; }}
                    containerBackgroundColor={'rgba(0,0,0,0.5)'}
                    handlerBackgroundColor={'rgba(0,0,0,0.5)'}
                    containerMaximumHeight={MAXIMUM_HEIGHT}
                    handlerHeight={MINUMUM_HEIGHT}
                    allowStayMiddle={false}
                    getContainerHeight={this.getContainerHeight}
                    handlerDefaultView={<HandlerOne heightState={this.state.containerHeight}/>}>
                      <ScrollView
                            ref={(scrollView) => { _scrollView = scrollView; }}
                            automaticallyAdjustContentInsets={true}
                            horizontal={true}
                            style={[styles.scrollView, styles.horizontalScrollView]}>
                        <View style={styles.iconCon}>
                            <View style={styles.iconContainer}>
                                
                            <Icon
                                reverse
                                name='event'
                                size={45}
                                color='#ffcc00'
                                onPress={() => this.props.navigation.navigate('Announcement')}
                            />
                            <Text style={styles.instructions}>Events</Text>
                            </View>
                            
                            <View style = {styles.iconContainer}>
                            
                            <Icon
                                reverse
                                size={45}
                                name='local-dining'
                                color='red'
                                onPress={() => this.props.navigation.navigate('Food')}
                            />
                            <Text style={styles.instructions}>F&B</Text>
                            </View>
                            <View style={styles.iconContainer}>
                            <Icon
                                reverse
                                size={45}
                                name='directions-bus'
                                color= '#b510d3'//color='#517fa4'
                                onPress={() => this.props.navigation.navigate('Bus')}
                                />
                                <Text style={styles.instructions}>Shuttle bus</Text>
                            </View>
                             
                             <View style={styles.iconContainer}>
                            <Icon
                                reverse
                                size={45}
                                name='import-contacts'
                                color= 'teal'//color='#517fa4'
                                onPress={() => this.props.navigation.navigate('Tenant')}
                                />
                                <Text style={styles.instructions}>Directory</Text>
                            </View>
                             <View style={styles.iconContainer}>
                            <Icon
                                reverse
                                size={45}
                                name='map'
                                color= 'deeppink'//color='#517fa4'
                                onPress={() => this.props.navigation.navigate('SAPMap')}
                                />
                                <Text style={styles.instructions}>Map</Text>
                            </View>
                            <View style={styles.iconContainer}>
                            <Icon
                                reverse
                                size={45}
                                name='contact-phone'
                                color= 'deepskyblue'//color='#517fa4'
                                onPress={() => this.props.navigation.navigate('ContactUs')}
                                />
                                <Text style={styles.instructions}>Contact Us</Text>
                            </View>
                             <View style={styles.iconContainer}>
                            <Icon
                                reverse
                                size={45}
                                name='email'
                                color= 'orange'//color='#517fa4'
                                onPress={() => this.props.navigation.navigate('Feedback')}
                                />
                                <Text style={styles.instructions}>Feedback</Text>
                            </View>
                           
                           <View style={styles.iconContainer}>
                            <Icon
                                reverse
                                size={45}
                                name='business'
                                color= 'rgb(0,85,184)'//color='#517fa4'
                                onPress={() => this.props.navigation.navigate('AboutJTC')}
                                />
                                <Text style={styles.instructions}>About JTC</Text>
                            </View>
                        </View>
                         </ScrollView>            
                </SlidingUpPanel>
            </View>
        
      </Image>
      </View>
    );
  }
//   getContainerHeight = (height) => {
//     this.setState({
//       containerHeight : height
//     });
//   }


};

class HandlerOne extends Component{  
  render() {
        var height = this.props.heightState;
        console.log('height' + height);
      //<Text style={styles.handlerText}>Slide to pull up</Text> 
    return (
        <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite" style={styles.textContainer}>
             {/*<Animatable.Text animation="pulse" easing="ease-out" iterationCount="infinite" style={{ textAlign: 'center' }}>*/}
                 <Icon
                    name={(height === MAXIMUM_HEIGHT) ?'keyboard-arrow-down': 'airplanemode-active'}
                    color= '#fff'//color='#517fa4'
                    />
            {/*</Animatable.Text>*/}
             <Text style={{color: 'white', textAlign: 'center'}}> Slide up to begin</Text>
     </Animatable.View>
    );
  }
};


//======== CLASS TO CALL CONTACT US PAGE ============
class Contact extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: 'Contact Us',
        drawerLabel: 'Contact Us'
    });
    render() {
        const { params } = this.props.navigation.state;
        return <ContactUs />
    }
}
//======== CLASS TO CALL About JTC PAGE ============
class About extends React.Component {
    static navigationOptions = ({navigation}) => ({
       
        title: 'About JTC',
        drawerLabel: 'About JTC'
    });
    render() {
        const { params } = this.props.navigation.state;
        return <AboutJTC />
    }
}

//======== CLASS TO CALL Tenant Directory PAGE ============
class Tenant extends React.Component {
    static navigationOptions = ({navigation}) => ({
       
        title: 'Tenant Directory',
        drawerLabel: 'Tenant Directory'
    });
    render() {
        const { params } = this.props.navigation.state;
        return <TenantDirectory />
    }
}


//========CLASS TO CALL SAP MAP PAGE ============
class MapSAP extends React.Component {
    static navigationOptions = ({navigation}) => ({
       
        title: 'Map of SAP',
        drawerLabel: 'Map of SAP'
    });
    render() {
        const { params } = this.props.navigation.state;
        return <SAPMap />
    }
}

//========CLASS TO CALL SHUTTLE BUS PAGE ============
class ShuttleBus extends React.Component {
  static navigationOptions = ({navigation}) => ({
       
        title: 'Shuttle Bus Service',
        drawerLabel: 'Shuttle Bus',
        headerStyle: {
            elevation: 0,
        },

    });
    render() {
        const { params } = this.props.navigation.state;
        return <RouteStack />
    }
}

//========CLASS TO CALL ANNOUNCEMENT PAGE ============
class Announcement extends React.Component {
  static navigationOptions = ({navigation}) => ({
        title: 'Events & Announcements',
        drawerLabel: 'Events & Announcements'
    });
    render() {
        const { params } = this.props.navigation.state;
        return <EventStack />
    }
}

//========CLASS TO CALL FOOD N BEVERAGE PAGE ============
class FoodBev extends React.Component {
    static navigationOptions = ({navigation}) => ({
       
        title: 'Food & Beverage',
        drawerLabel: 'Food & Beverage'
    });
    render() {
        const { params } = this.props.navigation.state;
        return <FoodStack />
    }
}

//========CLASS TO CALL FEEDBACK PAGE ============
class Feedback extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: 'Send Feedback',
        drawerLabel: 'Email Feedback'
    })
    render() {
        return <SendFeedback />
    }
}


/**
 * StackNavigator is like a collection to compile the different screens.
 * Make sure your 'navigate' path is same as the one in the stack. screen name must tally with class name.
 * 
 */
const HomeStack = StackNavigator({
    //Home: {screen: DrawerExample},
    Home: {screen: MyHomeScreen},
    Announcement: {screen: Announcement},
    Food: {screen: FoodBev},
    Bus: {screen: ShuttleBus},
    ContactUs: {screen: Contact},
    AboutJTC: {screen: About},
    Tenant: {screen: Tenant},
    SAPMap: {screen: MapSAP},
    Feedback: {screen: Feedback},
    //Gesture: {screen: SomeFile}, 
    //Collapse: {screen: CollapseView},
},
)
HomeStack.navigationOptions = {
    headerStyle: {
        backgroundColor: '#ff6666'
    }
}
export default HomeStack;

const styles = StyleSheet.create({
    iconContainer: {
        flexDirection: 'column',
        height: undefined,
        
    },
container: {
    flex:1,
},
 
welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'white',
  },
  instructions: {
    textAlign: 'center',
    color: '#ffffff',
    marginBottom: 5,

  },
imgContainer: {
    flex:1,
    width: undefined,
    height: undefined,
    // backgroundColor:'transparent',
    // justifyContent: 'center',
    // alignItems: 'center',
},
iconCon: {
    flexDirection: 'row',
    justifyContent: 'center',
 
    paddingTop: -20,
},
  contentContainer: {
    flex:0.8,
  },
  iconStyle: {
    textAlign: 'center',
    padding: 14,
    
    color: 'white'
  },

  //----------- SLIDE UP PANEL  --------//
   parentContainer: {
    flex : 1,
    paddingTop: 60,
    elevation: 4,
  },

  backContainer: {
    flex : 1,
    backgroundColor : 'blue'
  },

  frontContainer: {
    flex : 1,
  },

  logText: {
    color : 'white',
    fontWeight: '700',
  },


  image: {
    height : MINUMUM_HEIGHT,
    width: deviceWidth,
    alignItems: 'center',
    //backgroundColor : 'gray'
  },

  textContainer: {
    height : MINUMUM_HEIGHT,
    width: deviceWidth,
  },

  handlerText: {
    color: 'white',
    fontSize: 15,
    justifyContent: 'center',
    fontWeight: '700',
  },

});
