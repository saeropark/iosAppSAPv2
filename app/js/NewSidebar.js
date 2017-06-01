/* Example: https://github.com/react-community/react-navigation/blob/master/examples/NavigationPlayground/js/Drawer.js */

import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet, 
  Platform,
  AlertIOS,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from 'react-native';
import { StackNavigator, DrawerNavigator} from 'react-navigation';
import { Icon , Button} from 'react-native-elements';
import SlidingUpPanel from 'react-native-sliding-up-panel';

import ContactUs from './SidebarList/ContactUs';
import AboutJTC from './SidebarList/AboutJTC';
import TenantDirectory from './SidebarList/TenantDirectory';
import SAPMap from './SidebarList/SAPMap';
import TestDir from './AnnouncementLists/TestDir';
import SendFeedback from './SidebarList/SendFeedback';

import FoodStack from '../components/EventNavigation/TestFnB';
import EventStack from '../components/AnnouncementNavigation/TestEventAnn';
import RouteStack from '../components/BusRouteNavigation/TestBusRoute';

var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;

var MAXIMUM_HEIGHT = (deviceHeight - 100 )/2;
var MINUMUM_HEIGHT = 50;
//======== SCREEN ON LOAD ===========
class MyHomeScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({

    headerTitle: 'Seletar Aerospace Park',
    drawerLabel: 'Home',
    headerTitleStyle : {
        fontFamily: 'Calibri Light'
    },
    headerStyle: {
    },
    headerLeft: (
        <View style={{padding:20, }}>
            <TouchableOpacity onPress={() => navigation.navigate('DrawerOpen')}>
            <Icon
                //onPress={() => navigation.navigate('DrawerOpen')}
                name='menu'
                //type='ionicon'
                color='black'
            />
            </TouchableOpacity>
        </View>
    )
  });

   constructor(props) {
    super(props);
    this.state = {
      containerHeight : 0
    }
  }


//   onSwipeUp(gestureState) {
//     this.setState({myText: 'You swiped up!'});
//   }
 
//   onSwipeDown(gestureState) {
//     this.setState({myText: 'You swiped down!'});
//   }
 
//   onSwipeLeft(gestureState) {
//     this.setState({myText: 'You swiped left!'});
//   }
 
//   onSwipeRight(gestureState) {
//     this.setState({myText: 'You swiped right!'});
//   }
 
//   onSwipe(gestureName, gestureState) {
//     const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
//     this.setState({gestureName: gestureName});
//     switch (gestureName) {
//       case SWIPE_UP:
//         this.setState({backgroundColor: 'red'});
//         break;
//       case SWIPE_DOWN:
//         this.setState({backgroundColor: 'green'});
//         break;
//     }
//   }
 
  render() {

    // const config = {
    //   velocityThreshold: 0.3,
    //   directionalOffsetThreshold: 80
    // };
 
    return (
        <View style= {styles.container}>
         <Image
          source={require('../../img/avia_wallpaper.png')}
          style={styles.imgContainer}>
          <View style={styles.parentContainer}>
               {/*<GestureRecognizer
                    onSwipe={(direction, state) => this.onSwipe(direction, state)}
                    onSwipeUp={(state) => this.onSwipeUp(state)}
                    onSwipeDown={(state) => this.onSwipeDown(state)}
                    config={config}
                    style={{
                    flex: 1,
                    backgroundColor: this.state.backgroundColor
                     }}
                >*/}
       

                <SlidingUpPanel 
                    ref={panel => { this.panel = panel; }}
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
                                //type='ionicon'
                                color='#ffcc00'
                                onPress={() => this.props.navigation.navigate('Announcement')}
                            />
                            <Text style={styles.instructions}>Events</Text>
                            </View>
                            
                            <View style = {styles.iconContainer}>
                            
                            <Icon
                                reverse
                                name='local-dining'
                                //type='ionicon'
                                color='red'
                                onPress={() => this.props.navigation.navigate('Food')}
                            />
                            <Text style={styles.instructions}>F&B</Text>
                            </View>
                            <View style={styles.iconContainer}>
                            <Icon
                                reverse
                                name='directions-bus'
                                //type='ionicon'
                                color= '#b510d3'//color='#517fa4'
                                onPress={() => this.props.navigation.navigate('Bus')}
                                />
                                <Text style={styles.instructions}>Shuttle bus</Text>
                            </View>
                             
                             <View style={styles.iconContainer}>
                            <Icon
                                reverse
                                name='import-contacts'
                                //type='ionicon'
                                color= '#b510d3'//color='#517fa4'
                                onPress={() => this.props.navigation.navigate('TenantDirectory')}
                                />
                                <Text style={styles.instructions}>Directory</Text>
                            </View>
                             <View style={styles.iconContainer}>
                            <Icon
                                reverse
                                name='map'
                                //type='ionicon'
                                color= 'pink'//color='#517fa4'
                                onPress={() => this.props.navigation.navigate('SAPMap')}
                                />
                                <Text style={styles.instructions}>Map</Text>
                            </View>
                            <View style={styles.iconContainer}>
                            <Icon
                                reverse
                                name='contact-phone'
                                //type='ionicon'
                                color= '#b510d3'//color='#517fa4'
                                onPress={() => this.props.navigation.navigate('ContactUs')}
                                />
                                <Text style={styles.instructions}>Contact Us</Text>
                            </View>
                             <View style={styles.iconContainer}>
                            <Icon
                                reverse
                                name='email'
                                //type='ionicon'
                                color= 'orange'//color='#517fa4'
                                onPress={() => this.props.navigation.navigate('Feedback')}
                                />
                                <Text style={styles.instructions}>Feedback</Text>
                            </View>
                           

                        </View>
                         </ScrollView>
                        
                       
                </SlidingUpPanel>

                    {/*</GestureRecognizer>*/}
            </View>
        
      </Image>
      </View>
    );
  }
  getContainerHeight = (height) => {
    this.setState({
      containerHeight : height
    });
  }


};

class HandlerOne extends Component{

  
  render() {
        var height = this.props.heightState;
        console.log('height' + height);
      //<Text style={styles.handlerText}>Slide to pull up</Text> 
    return (

        <View style={styles.textContainer}>
             <Text style={{color:'white'}}>Slide up to begin</Text>
             <Icon
             
            name={(height === MAXIMUM_HEIGHT) ?'keyboard-arrow-down': 'airplanemode-active'}
            color= '#fff'//color='#517fa4'
            />
           
                
         
     </View>
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
        return <TestDir />
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
 * StackNavigator is like a collection to compile the different screens.\.
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

/**
 * DrawerNavigator is a sidebar functionality that calls the sliding panel.
 * SideBar 'Home' will call HomeStack, a StackNavigator.
 * Announcements to Contact us will be the list of links for user to click. 
 */
const SideBar = DrawerNavigator({
    Home: {screen: HomeStack},
    AboutJTC: {screen: About},
    Announcement: {screen: Announcement},
    Food: {screen: FoodBev},
    Bus: {screen: ShuttleBus},
    Tenant: {screen: Tenant},
    SAPMap: {screen: MapSAP},
    ContactUs: {screen: Contact},
    Feedback: {screen: Feedback},
   // Gesture: {screen: SomeFile}, 
   // Collapse: {screen: CollapseView},
 }, 

{
//   initialRouteName: 'Drafts',
   contentOptions: {
     activeTintColor: '#e91e63',
   },
  
 }
);

HomeStack.navigationOptions = {
    headerStyle: {
        backgroundColor: '#ff6666'
    }
}
export default SideBar;




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
