import React, {Component} from 'react';
import {
  Text,
  View,
  ListView,
  PropTypes,
  Image,
  StyleSheet, 
  Platform,
  Alert,
  TouchableOpacity,
  Dimensions,
  ScrollView,TouchableHighlight,
  ActivityIndicator, RefreshControl 
} from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';
import * as Animatable from 'react-native-animatable';
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';
import MapView from 'react-native-maps';
import {Button, Icon} from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';

var REQUEST_URL = 'https://api.beeline.sg/routes/search_by_region?regionId=24&areaName=North-east%20Region';
var FIREBASE_REQUEST_URL = 'https://asap-c4472.firebaseio.com/BusRoutes.json';
var CONTENT = [];

var {height, width} = Dimensions.get('window');
//var bus;
var markersArray = new Array();
var stopsArray = new Array();
var features;
var obj;


class AMTab extends React.Component {
    static navigationOptions = {
        tabBarLabel: 'AM',
        labelStyle: {
            fontSize:16,
        },
    }
  render() {
    return <AMList/>
  }
}

class PMTab extends React.Component {
    static navigationOptions = {
        tabBarLabel: 'PM',
        labelStyle: {
            fontSize:16,
        },
    }
  render() {
    return <PMList/>
  }
}

class LunchTab extends React.Component {
    static navigationOptions = {
        tabBarLabel: 'LUNCH',
        labelStyle: {
            fontSize:16,
        },
    }
    render(){
        return <LunchList/>
    }
}

//---------- EACH DETAIL PAGE ! ----------//

class AMList extends React.Component {
  static navigationOptions = {
    header: null,
  }
  constructor(props) {
        super(props);
        
        this.state = {
            visible: true,
            animating: true,
            isLoading: true,
            refreshing: false,
            //dataSource is the interface
            dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2)=> row1 !== row2
            })
        };
    }

    _onRefresh() {
    this.setState({refreshing: true});
    this.fetchData();
  }

    componentDidMount() {
       // setInterval(() => {
            this.fetchData();
        //}, 3000);
    }

 
    // --- calls Google API ---
    fetchData() {
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
            responseData = this.removeDuplicates(responseData);
            responseData = this.displayAm(responseData);
           //setInterval(() => {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData),
                //dataSource: this.state.dataSource.cloneWithRows(responseData["items"]),
                //isLoading: false,
                visible: false,
                refreshing: false,
            
            });
           //  }, 3000);
        })
        .done();
    }
    render() {
        return (
          <View style={styles.mainContainer}>
          
                  <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
           
            <ListView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}
                    />
                    }
                dataSource = {this.state.dataSource}
                renderRow = {this.renderBus.bind(this)}
                style = {styles.listView}
            />
            </View>
            
        );
    }

    renderBus(bus) {

       // var replace = this.replaceText(bus)
        return (
            <TouchableHighlight 
                onPress={() => this.showShuttleBusInfo(bus)}  underlayColor='#dddddd'>
                <View>
                    <View style = {styles.container}>
                        <View style = {styles.iconContainer}>
                         <Icon
                            reverse
                            name='directions-bus'
                            color= '#b510d3'//color='#517fa4'
                            />
                            <Text style={styles.centering}>{bus.label}</Text>
                        </View>
                        <View style = {styles.rightContainer}>
                            <Text style = {styles.lvTitle}>{bus.name}</Text>
                            <Text style = {styles.detail}>{bus.label}</Text>
                            <Text style = {styles.detail}>{bus.schedule}</Text>
                        </View>
                    </View>
                    <View style = {styles.separator}/>
                </View>
            </TouchableHighlight>
            
        );
    }

    // replaceText() {

    // }

    showShuttleBusInfo(busData) {
       console.log("TestonPress");
        this.props.navigation.navigate('Info', {busData});
   }
    /* to filter JSON data by making the name unique */
    removeDuplicates(obj){
        var array = obj;
        var seenObj = {};
        array = array.filter(function(currentObject) {
            if (currentObject.name in seenObj) {
                return false;
            } else {
                seenObj[currentObject.name] = true;
                return true;
            }
        });
        return array;
    }

    /* Filter to AM */
    displayAm(obj) {
        var array = obj;
        array = array.filter(function(currentObject) {
            if ((currentObject.label).includes("AM")){
                return true;
            } else {
                return false;
            }
        });
        return array; 
    }
  
}

class PMList extends React.Component {
   static navigationOptions = {
    header: null,
  }
  constructor(props) {
        super(props);
        
        this.state = {
            visible: true,
            animating: true,
            isLoading: true, 
            //dataSource is the interface
            dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2)=> row1 !== row2
            })
        };
    }

    componentDidMount() {
        this.fetchData();
        
    }

    // --- calls Google API ---
    fetchData() {
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
            responseData = this.removeDuplicates(responseData);
            responseData = this.displayPm(responseData);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData),
                //dataSource: this.state.dataSource.cloneWithRows(responseData["items"]),
                isLoading: false,
                visible: false,
            });
        })
        .done();
    }
    render() {
        return (
          <View style={styles.mainContainer}>
            
            <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
            <ListView
                dataSource = {this.state.dataSource}
                renderRow = {this.renderBus.bind(this)}
                style = {styles.listView}
            />
            </View>
            
        );
    }

    renderBus(bus) {

       // var replace = this.replaceText(bus)
        return (
            <TouchableHighlight 
                onPress={() => this.showShuttleBusInfo(bus)}  underlayColor='#dddddd'>
                <View>
                    <View style = {styles.container}>
                        <View style = {styles.iconContainer}>
                         <Icon
                            reverse
                            name='directions-bus'
                            color= '#b510d3'//color='#517fa4'
                            />
                            <Text style={styles.centering}>{bus.label}</Text>
                        </View>
                        <View style = {styles.rightContainer}>
                            <Text style = {styles.lvTitle}>{bus.name}</Text>
                            <Text style = {styles.detail}>{bus.label}</Text>
                            <Text style = {styles.detail}>{bus.schedule}</Text>
                        </View>
                    </View>
                    <View style = {styles.separator}/>
                </View>
            </TouchableHighlight>
            
        );
    }

    // replaceText() {

    // }

    showShuttleBusInfo(busData) {
       console.log("TestonPress");
        this.props.navigation.navigate('Info', {busData});
   }
    /* to filter JSON data by making the name unique */
    removeDuplicates(obj){
        var array = obj;
        var seenObj = {};
        array = array.filter(function(currentObject) {
            if (currentObject.name in seenObj) {
                return false;
            } else {
                seenObj[currentObject.name] = true;
                return true;
            }
        });
        return array;
    }

    /* Filter to AM */
    displayPm(obj) {
        var array = obj;
        array = array.filter(function(currentObject) {
            if ((currentObject.label).includes("PM")){
                return true;
            } else {
                return false;
            }
        });
        return array; 
    }
  
  
}

class LunchList extends React.Component {
    static navigationOptions = {
    header: null,
  }
  constructor(props) {
        super(props);
        
        this.state = {
            visible: true,
            animating: true,
            isLoading: true, 
            //dataSource is the interface
            dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2)=> row1 !== row2
            })
        };
    }

    componentDidMount() {
        this.fetchData();
        
    }

    // --- calls Google API ---
    fetchData() {
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
            responseData = this.removeDuplicates(responseData);
            responseData = this.displayLunchR(responseData);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData),
                //dataSource: this.state.dataSource.cloneWithRows(responseData["items"]),
                isLoading: false,
                visible: false
            });
        })
        .done();
    }
    render() {
        return (
          <View style={styles.mainContainer}>
            <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
            <ListView
                dataSource = {this.state.dataSource}
                renderRow = {this.renderBus.bind(this)}
                style = {styles.listView}
            />
            </View>
            
        );
    }

    renderBus(bus) {

       // var replace = this.replaceText(bus)
        return (
            <TouchableHighlight 
                onPress={() => this.showShuttleBusInfo(bus)}  underlayColor='#dddddd'>
                <View>
                    <View style = {styles.container}>
                        <View style = {styles.iconContainer}>
                         <Icon
                            reverse
                            name='directions-bus'
                            color= '#ff6666'//color='#517fa4'
                            />
                            <Text style={styles.centering}>{bus.label}</Text>
                        </View>
                        <View style = {styles.rightContainer}>
                            <Text style = {styles.lvTitle}>{bus.name}</Text>
                            <Text style = {styles.detail}>{bus.label}</Text>
                            <Text style = {styles.detail}>{bus.schedule}</Text>
                        </View>
                    </View>
                    <View style = {styles.separator}/>
                </View>
            </TouchableHighlight>
            
        );
    }
    showShuttleBusInfo(busData) {
       console.log("TestonPress");
        this.props.navigation.navigate('Info', {busData});
   }
    /* to filter JSON data by making the name unique */
    removeDuplicates(obj){
        var array = obj;
        var seenObj = {};
        array = array.filter(function(currentObject) {
            if (currentObject.name in seenObj) {
                return false;
            } else {
                seenObj[currentObject.name] = true;
                return true;
            }
        });
        return array;
    }

    /* Filter to Lunch */
    displayLunchR(obj) {
        var array = obj;
        array = array.filter(function(currentObject) {
            if (((currentObject.label).includes("PM")) || ((currentObject.label).includes("AM"))) {
                return false;
            } else {
                return true;
            }
        });
        return array; 
    }
  

  
}

class RouteDetail extends React.Component {
  static navigationOptions = {
    header: null,
  }
   constructor(props) {
    super(props);
    console.log("constructor(props)");
    //bus = this.props.busData;
    //var passData = this.props.navigation.state.params.busData;

    
    this.state ={
        
        visible: true,
        //bus: this.props.busData? this.props.busData: null,
        markers: [],
        restoring: false,
        animating: true,
        isLoading: false,
 
    }
    //console.log(bus);
  }

  componentWillMount() {
    console.log("componentWillMount()");
    this.setState({ showLoading: true ,  });
    // setInterval(() => {
    //         this.setState({
    //             visible: !this.state.visible
    //         });
    //     }, 3000);
    this.fetchStops();
     //setInterval(() => {
    this.fetchData().done();
   // }, 2000);
    
  }

  //fetchData fetches data from URL and get bus stop details from beeline for markers
  async fetchData() {
      var passData = this.props.navigation.state.params.busData;
      
      fetch(this.requestURL(passData))
      .then((response) => response.json())
      .then((responseData) => {
          markersArray.length = 0;
          console.log(this.state.markers);
          console.log("On fetchData():");
          this.getBusStopDescriptions(responseData);

          console.log(markersArray);
            this.state.markers = markersArray;
          this.setState({ 
              showLoading: false ,
              visible: false,
            });
      })
      .done();
  }

  //fetchStops fetches data from URL and get bus stop timings from firebase
  fetchStops(){
      fetch(FIREBASE_REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
          this.getBusStopTimings(responseData);
      })
  }

  //request url from beeline
  requestURL(bus){
     //id = bus.id;
     console.log(bus);
    return 'https://api.beeline.sg/routes/'+ bus.id +'?include_trips=true&include_features=true';
  }

  renderLoadingView() {
    return (
      <View ><Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{color: '#000000'}} />
      </View>
    );
  }
    
  render() {

       const {params} = this.props.navigation.state;
       const {goBack} = this.props.navigation
       ;
       console.log(this.props.navigation.state.params.busData);
        return (
            //fetch json data and display
            
            <View style={{flex:1}}>
                <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
              <ScrollView style={{flex:1, backgroundColor:'#ffffff'}}>
                  <View style={styles.timeSignage}>
                  <Text> {params.busData.name} </Text>
                  <View style={styles.rightContainer}>
                    <Text>Signage example:</Text>
                    <Text style={styles.rectangle}>{this.props.navigation.state.params.busData.notes.signage}</Text> 
                  </View>
                </View>
                <View style={styles.detail_container}>
                <MapView style={styles.map} initialRegion={{
                    latitude: 1.357857, 
                    longitude: 103.828568,
                    latitudeDelta: 0.2,
                    longitudeDelta: 0.2,
                  }}
                  >  
                {this.state.markers.map(marker => (
                  <MapView.Marker 
                    coordinate={marker.coordinates}
                    title={marker.title}
                    key={marker.id}
                  />
                ))}
                
                </MapView>
                </View>
                <View style = {styles.separator}/>

                <View style={{flex:1}}>
                    <Text style={styles.timingHeader}> BUS TIMING </Text>
                    <TimingCollapse />
                </View>

               
                <View style = {styles.separator}/>
                
                <View style={styles.listButton}>
                    
                    <Button
                    color = '#000000'
                    title = 'More Information'
                    backgroundColor = '#ffffff' 
                    onPress={this.goImptNotes.bind(this)}/>
            
            
                    <Button
                    buttonStyle = {styles.btnStyle}
                    color = "#FFFFFF"
                    title ="Back to List"
                    backgroundColor="#FFA500"
                    onPress={() => goBack()} />
                    </View>
                  
                
            </ScrollView>
            </View>
        );
    }

    getBusStopTimings(obj){
        console.log(obj);
        var keys = Object.keys(obj);
        console.log(keys);

        var routeKey;

        for (var i=0; i<keys.length; i++){
            var key = keys[i];
            if(obj[key].routeId = this.props.navigation.state.params.busData.id){
                console.log("FOUND! Key: " + key);
                routeKey = key;
                i = keys.length;
            }
        }

        stopsArray.length = 0;
        stopsArray = obj[routeKey].routeStops
        console.log(stopsArray);
    }

    //retrieve bus stop description from retrieved objects and pass into markersArray
  getBusStopDescriptions(obj){
    console.log("On getBusStopDescriptions()");
    console.log(obj);

    CONTENT.length = 0;

    try{
        var noOfTrips = obj.trips.length - 1;
        var noOfBusStops = obj.trips[noOfTrips].tripStops.length;

        for (var i = 0; i < noOfBusStops; i++){

            //get markers information
            var busStopNo = i + 1;
            var desc = obj.trips[noOfTrips].tripStops[i].stop.description;
            var lat = obj.trips[noOfTrips].tripStops[i].stop.coordinates.coordinates[1];
            var lng = obj.trips[noOfTrips].tripStops[i].stop.coordinates.coordinates[0];

            //create object and push markers info to markersArray
            var stop =  new Object();
            stop.title = desc;
            var latlng = new Object;
            latlng.latitude = lat;
            latlng.longitude = lng;
            stop.coordinates = latlng;
            stop.id = busStopNo;
            markersArray.push(stop);

            //create object and push timings to CONTENT
            var newStop = new Object();
            newStop.title = busStopNo + ". " + desc;
            if(stopsArray[i].timings != 'undefined'){
                newStop.content = stopsArray[i].timings;
            } else {
                newStop.content = "Timing to be added";
            }
            CONTENT.push(newStop);
      }
    }
    catch(err){
        console.log("error: " + err);
    }
  }


  goDisplayList() {

    var alertMessage = ("1. ").concat(markersArray[0].title);
    for(var i = 1; i < markersArray.length; i++){
      var index = i + 1;
      var indexText = ("\n").concat(index);
      var indexTextNo = indexText.concat(". ");
      var text = indexTextNo.concat(markersArray[i].title);
      alertMessage = alertMessage.concat(text);
    }
    Alert.alert("List of Bus Stops", alertMessage);
  }


  //display list of features
  goImptNotes() {
      
    features = this.props.navigation.state.params.busData.features;
    Alert.alert("Important Notes", features);
  }
}


//-------------- DROP DOWN MENU CLASS ----------------------//
class TimingCollapse extends React.Component {
  state = {
    activeSection: false,
    collapsed: true,
  };

  _toggleExpanded = () => {
    this.setState({ collapsed: !this.state.collapsed });
  }

  _setSection(section) {
    this.setState({ activeSection: section });
  }

  _renderHeader(section, i, isActive) {
    return (
      <Animatable.View duration={400} style={[styles.header, isActive ? styles.active : styles.inactive]} transition="backgroundColor">
      <View style={styles.container}>
        <Icon
            name='keyboard-arrow-down'
            color= '#000'//color='#517fa4'
            />
            <View style={styles.rightContainer}>
                <Text style={styles.headerText}>{section.title}</Text>
            </View>
        </View>
        <View style = {styles.separator}/>
      </Animatable.View>
    );
  }

  _renderContent(section, i, isActive) {
    return (
      <Animatable.View duration={400}  style={[styles.content, isActive ? styles.active : styles.inactive]} transition="backgroundColor">
        <Text>{section.content}</Text>
      </Animatable.View>
    );
  }

  _

  render() {
    return (
      <View style={styles.dContainer}>
        <Accordion
          activeSection={this.state.activeSection}
          sections={CONTENT}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}
          duration={400}
          onChange={this._setSection.bind(this)}
        />

      </View>
    );
  }
}
  


//----- NAVIGATION STACK --------///
const AMStack = StackNavigator({
    List: {screen: AMList},
    Info: {screen: RouteDetail},
    
},
 { initialRoute: 'List',
     mode: 'modal' } // this is needed to make sure header is hidden on ios
 );
 AMStack.navigationOptions = {
  header: null,

};

const PMStack = StackNavigator({
    List: {screen: PMList},
    Info: {screen: RouteDetail},
    
},
 { initialRoute: 'List',
     mode: 'modal' } // this is needed to make sure header is hidden on ios
 );
 PMStack.navigationOptions = {
  header: null,

};

const LunchStack = StackNavigator({
    List: {screen: LunchList},
    Info: {screen: RouteDetail},
    
},
 { initialRoute: 'List',
     mode: 'modal' } // this is needed to make sure header is hidden on ios
 );

 LunchStack.navigationOptions = {
  header: null,

};


const RouteTab = TabNavigator({
  AM : { screen: AMStack },
  PM : { screen: PMStack },
  Lunch : { screen: LunchStack},
},
    
    {
        lazy:true,
        mode: 'modal', // this is needed to make sure header is hidden on ios
        navigationOptions: {
            lazyLoad: true,
        },
        tabBarOptions: {
            activeTintColor: 'white',
            inactiveTintColor: 'lightgray',
            labelStyle: {
                fontSize:16,
        },

          style: {
          backgroundColor: 'rgba(218,29,42,1)',
          
        },
      } 
    } 

);

const RouteStack = StackNavigator({
    Home: {screen: RouteTab}
})

RouteTab.navigationOptions = ({navigation})=> ({
  header: null,
 lazy: true,
});


export default RouteStack;

var styles = StyleSheet.create ({
    btnStyle: {
        position:'relative',
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#Ffffff',
        padding: 10
    },
    thumbnail: {
        width: 53,
        height: 81,
        marginRight: 10
    },
    rightContainer: {
        flex: 1
    },
    lvTitle:{
      fontSize: 18,
      color: '#b510d3',
      marginBottom: 8,
    },
    title: {
        fontSize: 20,
        marginBottom: 8
    },
    author: {
        color: '#656565'
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd',
    },
    listView: {
        backgroundColor: '#ffffff' 
    },
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    mainContainer: {
        flex: 1,
        backgroundColor: '#ffcc00',
        height: Platform.OS === 'ios' ? 44 : 56,
        
    },
    iconContainer: {
        flexDirection: 'column',
        height: undefined,
    },
    centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
//--


    timingHeader: {
        fontSize: 20,
        color: '#b510d3',
        padding: 10,
    },
    contentContainer: {
       flex:1,
        marginTop: 75,
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    features: {
        padding: 10,
        fontSize: 15,
        color: '#656565'
    },
   rectangle: {
       height: 50,
       width: 50* 2,
       backgroundColor: 'white',
       borderColor: 'black',
       justifyContent: 'center',
       alignItems: 'center'
   },
   bigRect: {
       height: 200,
       width: 200*2,
       backgroundColor: 'white',
       borderColor: 'black',
       justifyContent: 'center',
       alignItems: 'center'
   },

   detail_container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    image: {
        width: 107,
        height: 165,
        padding: 10
    },
    description: {
        padding: 10,
        fontSize: 15,
        color: '#656565'
    },
    iconStyle: {
        textAlign: 'center',
        padding: 14,
        width: 50,
        color: 'white'
    },
    navText: {
        marginTop: -40,
        paddingLeft: 50,
        fontSize: 20,
        color: 'white'
    },
    timeSignage: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#Ffcc00',
        padding: 10
    }, 
    listButton: {
        flex:1,
    },
    buttonText: {
        fontSize: 20,
        textAlign: 'center'
    },
    map: {
      width: width,
      height: height/2.5
   },

  //------- Dropdowwn stylng -------//
  dContainer: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  dtitle: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 20,
  },
  header: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
    paddingBottom: 10,
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
  },
  active: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  inactive: {
    backgroundColor: 'rgba(255,255,255,1)', //(245,252,255)
  },
  selectors: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selector: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  activeSelector: {
    fontWeight: 'bold',
  },
  selectTitle: {
    fontSize: 14,
    fontWeight: '500',
    padding: 10,
  },
});