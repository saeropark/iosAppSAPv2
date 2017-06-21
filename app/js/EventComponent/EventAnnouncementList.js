/**
 * Event & Announcement List.js will render a tab view with 'UPCOMING' and 'PAST' tabs. 
 */
import React, {Component} from 'react';
import {
  Text,
  View,
  PropTypes,
  Image,
  StyleSheet, 
  Platform,
  ScrollView,
  ListView,
  ActivityIndicator,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  NetInfo, RefreshControl
} from 'react-native';
import { StackNavigator, navigate } from 'react-navigation';
import { TabNavigator } from "react-navigation";
import {Icon, Button, Tile} from "react-native-elements";
import Spinner from 'react-native-loading-spinner-overlay';

var REQUEST_URL = 'https://asap-c4472.firebaseio.com/.json';
var event;
var someText;

import img from '../../../img/SAP.png';
//========= MAIN TABS: UPCOMING | PAST =============
class UpcomingTab extends React.Component {
    static navigationOptions = {
        tabBarLabel: 'Upcoming'
    }
  render() {
    return <EventList/>
  }
}

class PastTab extends React.Component {
    static navigationOptions = {
        tabBarLabel: 'Past'
    }
  render() {
    return <PastList/>
  }
}

class NewPastTab extends React.Component {
    static navigationOptions = {
        tabBarLabel: 'NEWPast'
    }
  render() {
    return <NewPastList/>
  }
}

//======= UNDER UPCOMING TABS ==============
class EventList extends React.Component {

//       state = {
//     connectionInfo: null,
//   };

//   componentDidMount() {
//     NetInfo.addEventListener(
//         'change',
//         this._handleConnectionInfoChange
//     );
//     NetInfo.fetch().done(
//         (connectionInfo) => { this.setState({connectionInfo}); }
//     );
//   }

    constructor(props) {
        super(props);
        const navigate = this.props.navigation;
        //const { navigate } = this.props.navigation;
        this.state = {
            connectionInfo: null,
            isLoading: true, 
            visible: true,
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
        NetInfo.addEventListener(
            'change',
            this._handleConnectionInfoChange
        );
        NetInfo.fetch().done(
            (connectionInfo) => { this.setState({connectionInfo});
                                    this.fetchData(); }
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

    static navigationOptions = ({ navigation }) => ({
     header: null,
    });


    // --- calls Google API ---
    fetchData() {
        console.log("Line 122: " + this.state.connectionInfo);

        if (this.state.connectionInfo === "NONE"){
            console.log("No active connection");
            Alert.alert('Alert Title', "No network found. Please try again.");
            this.setState({
                dataSource: [],
                isLoading: false,
                visible: false,
            });
        } else {
            console.log("Active connection");
            fetch(REQUEST_URL)
            .then((response) => response.json())
            .then((responseData) => {
                //responseData = this.removeDuplicates(responseData);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.sortObjects(responseData)),
                    //dataSource: this.state.dataSource.cloneWithRows(responseData["items"]),
                    isLoading: false,
                    visible: false,
                    refreshing: false,
                });
            }).catch((error) => {
                console.error(error);
                if (this.state.connectionInfo === 'NONE')
                    Alert.alert('Unable to connect to the internet. Please check your connectivity!');
                else
                    console.error("Please contact admin.");
            })
            .done();
        }
    }
    render() {
      //const { navigate } = this.props.navigation;
        return (
            <View style={{flex:1,}}>
                <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
               
                {/*{this.state.connectionInfo === 'NONE' ? (
                    <ListView
                        dataSource = {null}
                        renderRow = {this.renderEvent.bind(this)}
                        style = {styles.listView}
                    />
                ) : (*/}
                    <ListView
                         refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}
                    />
                    } 
                        dataSource = {this.state.dataSource}
                        renderRow = {this.renderEvent.bind(this)}
                        style = {styles.listView}
                    />
                {/*)}*/}
            </View>
        );
    }


    renderEvent(event) {
        return (
           <TouchableHighlight 
                onPress={() => this.testOnPress(event)}>
                <View>
                    <View style = {styles.container}>
                       <View style={styles.dateColumn}>
                           <View style={{backgroundColor: 'rgba(218,29,42,0.8)', flex:0.1}}>
                                <Text style={styles.calMonth}> { this.getMonth(event.date.split("/")[0]) } </Text>
                            </View>
                            <View style={{backgroundColor: 'white', flex:0.2}}>
                                <Text style={styles.calDate}> {event.date.split("/")[1]} </Text>
                            </View>
                            
                        </View>
                   
                        <View style = {styles.rightContainer}>
                             <View style={{backgroundColor: (event.postType === 'Announcement')? '#ff8080':'#99ffbb',width: 100}}>
                                <Text style = {styles.postType}> {event.postType} </Text>
                            </View>
                            <Text style = {styles.title}> {event.title}</Text>
                            <Text style = {styles.detail} numberOfLines={1} >{event.description}</Text>
                        </View>
                    </View>
                    <View style = {styles.separator}/>
                </View>
            </TouchableHighlight>
        );
    }

    testOnPress(event) {
        console.log("TestonPress");
        this.props.navigation.navigate('Info', {event});
    }

    /* to filter JSON data by making the name unique */
    // removeDuplicates(obj){
    //     var array = obj;
    //     var seenObj = {};
    //     array = array.filter(function(currentObject) {
    //         if (currentObject.name in seenObj) {
    //             return false;
    //         } else {
    //             seenObj[currentObject.name] = true;
    //             return true;
    //         }
    //     });
    //     return array;
    // }

    // Sort announcements and events based on upcoming
    sortObjects(obj){
        var announcements = obj.Announcement;
        var events = obj.Event;
        var announcementKeys = Object.keys(announcements);
        var eventKeys = Object.keys(events);
        var upcoming = {};
        var nowDate = new Date();

        for(var i = 0; i < eventKeys.length; i++) {
            var key = eventKeys[i];
            var eventDate = new Date(events[key].date);
            if (eventDate > nowDate){
                console.log(events[key].title + " is on Upcoming List");
                upcoming[key] = events[key];
            } else {
                console.log(events[key].title + " is on Past List");
            }
        }

        for(var x = 0; x < announcementKeys.length; x++) {
            var key = announcementKeys[x];
            var announcementDate = new Date(announcements[key].date);
            if (announcementDate > nowDate){
                console.log(announcements[key].title + " is on Upcoming List");
                upcoming[key] = announcements[key];
            } else {
                console.log(announcements[key].title + " is on Past List");
            }
        }

        upcoming = this.sortByDate(upcoming);

        return upcoming;
    }

    //Sort list based on date
    sortByDate(obj){
        console.log(obj);
        var keys = Object.keys(obj);
        for (var i = keys.length-1; i>=0; i--){
            for (var j = 1; j<=i; j++) {
                var aDate = new Date(obj[keys[j-1]].date);
                var bDate = new Date(obj[keys[j]].date);
                console.log(aDate);
                console.log(bDate);
                if (aDate > bDate){
                    var temp = obj[keys[j-1]];
                    obj[keys[j-1]] = obj[keys[j]];
                    obj[keys[j]] = temp;
                }
            }
        }

        return obj;
    }


    //Translate month number to text
    getMonth(month){
        switch(month){
            case "01": return "JAN";
            case "02": return "FEB";
            case "03": return "MARCH";
            case "04": return "APRIL";
            case "05": return "MAY";
            case "06": return "JUNE";
            case "07": return "JULY";
            case "08": return "AUG";
            case "09": return "SEP";
            case "10": return "OCT";
            case "11": return "NOV";
            case "12": return "DEC";
            default: return "MONTH";
        }
    }
} 


//======= UNDER PAST TABS ==============
class PastList extends React.Component {
    static navigationOptions = ({ navigation }) => ({
     header: null,
    });

    constructor(props) {
    super(props);
    const navigate = this.props.navigation;
    //const { navigate } = this.props.navigation;
    this.state = {
        connectionInfo: null,
        isLoading: true, 
        visible: true,
        //dataSource is the interface
        dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2)=> row1 !== row2
        })
    };
    }

    componentDidMount() {
        NetInfo.addEventListener(
            'change',
            this._handleConnectionInfoChange
        );
        NetInfo.fetch().done(
            (connectionInfo) => { this.setState({connectionInfo});
                                    this.fetchData(); }
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

    // --- calls Google API ---
    fetchData() {
        console.log("Line 346: " + this.state.connectionInfo);

        if (this.state.connectionInfo === "NONE"){
            // console.log("No active connection");
            // Alert.alert('Alert Title', "No network found. Please try again.");
            this.setState({
                dataSource: null,
                isLoading: false,
                visible: false,
            });
        } else {
            fetch(REQUEST_URL)
            .then((response) => response.json())
            .then((responseData) => {
                //responseData = this.removeDuplicates(responseData);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.sortObjects(responseData)),
                    //dataSource: this.state.dataSource.cloneWithRows(responseData["items"]),
                    isLoading: false,
                    visible: false
                });
            }).catch((error) => {
                console.error(error);
                //Alert.alert('Unable to connect to the internet. Please check your connectivity!');
            })
            .done();
        }
    }
    render() {
      //const { navigate } = this.props.navigation;
        return (
            <View style={styles.mainContainer}>
                <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
                <ListView
                    dataSource = {this.state.dataSource}
                    renderRow = {this.renderEvent.bind(this)}
                    style = {styles.listView}
                />
            </View>
        );
    }


    renderEvent(event) {
        return (
           <TouchableHighlight 
                onPress={() => this.testOnPress(event)}>
                <View>
                    <View style = {styles.container}>
                       <View style={styles.dateColumn}>
                            
                            <View style={{backgroundColor: '#b510d3', flex:0.2}}>
                                <Text style={styles.calMonth}> { this.getMonth(event.date.split("/")[0]) } </Text>
                            </View>
                            <View style={{backgroundColor: 'white', flex:0.2}}>
                                <Text style={styles.calDate}> {event.date.split("/")[1]} </Text>
                            </View>
                        </View>
                   
                        <View style = {styles.rightContainer}>
                             <View style={{backgroundColor: (event.postType === 'Announcement')? '#ff8080':'#99ffbb',width: 100}}>
                                <Text style = {styles.postType}> {event.postType} </Text>
                            </View>
                            <Text style = {styles.title}> {event.title}</Text>
                            <Text style = {styles.detail} numberOfLines={1} >{event.description}</Text>
                        </View>
                    </View>
                    <View style = {styles.separator}/>
                </View>
            </TouchableHighlight>
        );
    }

    testOnPress(event) {
        console.log("TestonPress");
        this.props.navigation.navigate('Info', {event});
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

    // Sort announcements and events based on upcoming
    sortObjects(obj){
        var announcements = obj.Announcement;
        var events = obj.Event;
        var announcementKeys = Object.keys(announcements);
        var eventKeys = Object.keys(events);
        var upcoming = {};
        var nowDate = new Date();

        for(var i = 0; i < eventKeys.length; i++) {
            var key = eventKeys[i];
            var eventDate = new Date(events[key].date);
            if (eventDate <= nowDate){
                console.log(events[key].title + " is on Upcoming List");
                upcoming[key] = events[key];
            } else {
                console.log(events[key].title + " is on Past List");
            }
        }

        for(var x = 0; x < announcementKeys.length; x++) {
            var key = announcementKeys[x];
            var announcementDate = new Date(announcements[key].date);
            if (announcementDate <= nowDate){
                console.log(announcements[key].title + " is on Upcoming List");
                upcoming[key] = announcements[key];
            } else {
                console.log(announcements[key].title + " is on Past List");
            }
        }

        upcoming = this.sortByDate(upcoming);

        return upcoming;
    }

    //Sort list based on date
    sortByDate(obj){
        console.log(obj);
        var keys = Object.keys(obj);
        for (var i = keys.length-1; i>=0; i--){
            for (var j = 1; j<=i; j++) {
                var aDate = new Date(obj[keys[j-1]].date);
                var bDate = new Date(obj[keys[j]].date);
                console.log(aDate);
                console.log(bDate);
                if (aDate > bDate){
                    var temp = obj[keys[j-1]];
                    obj[keys[j-1]] = obj[keys[j]];
                    obj[keys[j]] = temp;
                }
            }
        }

        return obj;
    }

    //Translate month number to text
    getMonth(month){
        switch(month){
            case "01": return "JAN";
            case "02": return "FEB";
            case "03": return "MARCH";
            case "04": return "APRIL";
            case "05": return "MAY";
            case "06": return "JUNE";
            case "07": return "JULY";
            case "08": return "AUG";
            case "09": return "SEP";
            case "10": return "OCT";
            case "11": return "NOV";
            case "12": return "DEC";
            default: return "MONTH";
        }
    }
} 


//================================================================ NEW PAST TABS ==============
class NewPastList extends React.Component {
    static navigationOptions = ({ navigation }) => ({
     header: null,
    });

    constructor(props) {
    super(props);
    const navigate = this.props.navigation;
    //const { navigate } = this.props.navigation;
    this.state = {
        connectionInfo: null,
        isLoading: true, 
        visible: true,
        //dataSource is the interface
        dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2)=> row1 !== row2
        })
    };
    }

    componentDidMount() {
        NetInfo.addEventListener(
            'change',
            this._handleConnectionInfoChange
        );
        NetInfo.fetch().done(
            (connectionInfo) => { this.setState({connectionInfo});
                                    this.fetchData(); }
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

    // --- calls Google API ---
    fetchData() {
        console.log("Line 566: " + this.state.connectionInfo);

        if (this.state.connectionInfo === "NONE"){
            // console.log("No active connection");
            // Alert.alert('Alert Title', "No network found. Please try again.");
            this.setState({
                dataSource: null,
                isLoading: false,
                visible: false,
            });
        } else {
            fetch(REQUEST_URL)
            .then((response) => response.json())
            .then((responseData) => {
                //responseData = this.removeDuplicates(responseData);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.sortObjects(responseData)),
                    //dataSource: this.state.dataSource.cloneWithRows(responseData["items"]),
                    isLoading: false,
                    visible: false,
                });
            })
            .done();
        }
    }
    render() {
      //const { navigate } = this.props.navigation;
        return (
            <View style={styles.listView}>
                <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
                
                <ListView
                    dataSource = {this.state.dataSource}
                    renderRow = {this.renderEvent.bind(this)}
                    style = {styles.listView}
                />
            </View>
        );
    }


    renderEvent(event) {

        var imgURL;
        var link = event.fileURL;
        console.log('undefined? '+ event.fileURL);
        if (event.fileURL)
            imgURL = {uri:event.fileURL};
        else
            imgURL = img;
        
        console.log('avail: ' + imgURL);

        return (
                <View>
                    <View style = {{flexDirection:'column', flex:1}}>
                        <Tile
                                onPress={()=>this.testOnPress(event)}
                                onLongPress={()=> this.testOnPress(event)}
                                imageSrc={imgURL}
                                containerStyle={{paddingBottom:-10,}}
                                //featured
                                title={event.title}
                                //titleStyle={{position:'absolute'}}
                                //imageContainerStyle={{color: 'transparent'}}
                                //icon={{name: 'play-circle', type: 'font-awesome'}}  // optional
                                //contentContainerStyle={{height: 70}}
                                />
                             {/*<View style={{backgroundColor: (event.postType === 'Announcement')? '#ff8080':'#99ffbb',width: 100}}>
                                <Text style = {styles.postType}> {event.postType} </Text>
                            </View>*/}
                            {/*<Text style = {styles.title}> {event.title}</Text>*/}
                        </View>
                  
                
                </View>
        );
    }

    testOnPress(event) {
        console.log("TestonPress");
        this.props.navigation.navigate('Info', {event});
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

    // Sort announcements and events based on upcoming
    sortObjects(obj){
        var announcements = obj.Announcement;
        var events = obj.Event;
        var announcementKeys = Object.keys(announcements);
        var eventKeys = Object.keys(events);
        var upcoming = {};
        var nowDate = new Date();

        for(var i = 0; i < eventKeys.length; i++) {
            var key = eventKeys[i];
            var eventDate = new Date(events[key].date);
            if (eventDate <= nowDate){
                console.log(events[key].title + " is on Upcoming List");
                upcoming[key] = events[key];
            } else {
                console.log(events[key].title + " is on Past List");
            }
        }

        for(var x = 0; x < announcementKeys.length; x++) {
            var key = announcementKeys[x];
            var announcementDate = new Date(announcements[key].date);
            if (announcementDate <= nowDate){
                console.log(announcements[key].title + " is on Upcoming List");
                upcoming[key] = announcements[key];
            } else {
                console.log(announcements[key].title + " is on Past List");
            }
        }

        upcoming = this.sortByDate(upcoming);

        return upcoming;
    }

    //Sort list based on date
    sortByDate(obj){
        console.log(obj);
        var keys = Object.keys(obj);
        for (var i = keys.length-1; i>=0; i--){
            for (var j = 1; j<=i; j++) {
                var aDate = new Date(obj[keys[j-1]].date);
                var bDate = new Date(obj[keys[j]].date);
                console.log(aDate);
                console.log(bDate);
                if (aDate > bDate){
                    var temp = obj[keys[j-1]];
                    obj[keys[j-1]] = obj[keys[j]];
                    obj[keys[j]] = temp;
                }
            }
        }

        return obj;
    }

    //Translate month number to text
    getMonth(month){
        switch(month){
            case "01": return "JAN";
            case "02": return "FEB";
            case "03": return "MARCH";
            case "04": return "APRIL";
            case "05": return "MAY";
            case "06": return "JUNE";
            case "07": return "JULY";
            case "08": return "AUG";
            case "09": return "SEP";
            case "10": return "OCT";
            case "11": return "NOV";
            case "12": return "DEC";
            default: return "MONTH";
        }
    }
} 

//==================================================================== DETAILS ===========================================================//
class EventDetail extends React.Component {
    constructor(props) {
        super(props);
      //event = this.props.navigation.state.event;
      
    }

    static navigationOptions = ({ navigation }) => ({
        header: null,
       // title: `Title: ${navigation.state.params.data}`,
    });
    
     render() {
        const {params} = this.props.navigation.state;
        const {goBack} = this.props.navigation;
            console.log("Event info page");
            console.log(params);

        var imgURL;
        if (params.event.fileURL === '' )
            imgURL = {uri:'../../../img/SAP.png'};
        else 
            imgURL = {uri:params.event.fileURL};
        
        console.log('avail: ' + imgURL);
        return (
            
            <View style={styles.container}>
                <ScrollView>
                <View style={styles.contentContainer}>
                        <Image
                            style={{width: 300, height: 200}}
                            source={imgURL}
                        />
                    </View>
                        
                        <Text style={styles.title}>{params.event.title}</Text>
                        <View style={styles.descriptionContainer}>
                           
                            <View style={styles.iconText}>
                                <Icon
                                    name='today'/>
                                 <Text style={styles.descriptionText}> {params.event.date}</Text>
                            </View>
                            <View style={styles.iconText}>
                                <Icon
                                    name='schedule'/>
                                    <Text style={styles.descriptionText}> {params.event.time}</Text>
                            </View>
                            <View style={styles.iconText}>
                                <Icon
                                    name='place'/>
                                <Text style={styles.descriptionText}> {params.event.location}</Text>
                            </View>
                                <Text style={styles.description}> {params. event.description}</Text>
                            </View>
                    
                
                <Button
                    color = "#FFFFFF"
                    title ="Back to List"
                    backgroundColor="#FFA500"
                    onPress={() => goBack()} />

                </ScrollView>
        </View>
        );
       
    }
}

const NewPastStack = StackNavigator({
    NPList: {screen: NewPastList},
    Info: {screen: EventDetail}
})
    
const PastStack = StackNavigator({
    PList: {screen: PastList},
    PInfo: {screen: EventDetail},
    
},
 { 
     mode: 'modal' } // this is needed to make sure header is hidden on ios
 );
 PastStack.navigationOptions = {
  header: null,

};

const AnnStack = StackNavigator({
    List: {screen: EventList},
    Info: {screen: EventDetail},
    
},
 { 
     mode: 'modal' } // this is needed to make sure header is hidden on ios
 );
 AnnStack.navigationOptions = {
  header: null,

};

/**
 * Must be in order of how you want your tab to look.
 * Expected tab output:
 * UPCOMING | PAST
 */
const EventTab = TabNavigator({
    Upcoming: { screen: AnnStack },
    //Past: { screen: PastStack },
    Past : {screen: NewPastStack},
},
    { 
        mode: 'modal',  // this is needed to make sure header is hidden on ios
        tabBarOptions: {
        activeTintColor: 'white',
        inactiveTintColor: 'lightgray',
        labelStyle: {
            fontSize:16,
        },

          style: {
          backgroundColor: 'rgba(218,29,42,1)',
        },
      },
    }
);

//make sure they are in the same stack to allow fwd/back navigation
const EventStack = StackNavigator({
    Home: {screen: EventTab},
},

);

EventStack.navigationOptions = {
    header: "22222",
    title: "Events & Announcements 2",

};

 export default EventTab;

var styles = StyleSheet.create ({
     mainContainer: {
        flex: 1,
        backgroundColor: '#ffcc00',
        
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        padding: 10
    },
    thumbnail: {
        width: 53,
        height: 81,
        marginRight: 10
    },
    rightContainer: {
        flexDirection: 'column',
        flex: 0.8,
        padding: 5,
    },
    title: {
        fontSize: 24,
        paddingTop: -20,
        color: 'rgba(218,29,42,0.8)',
    },
    author: {
        color: '#656565'
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    listView: {
        backgroundColor: '#F5FCFF'
    },
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dateColumn: {
        flexDirection: 'column',
        flex: 0.2,
        height: 70,
    },
    detail: {
        padding: 5,
        
    },
    iconText: {
        flex: 1,
        flexDirection: 'row',
        padding: 5
    },
    postType: {
        fontSize: 14,
        width: 100,
        textAlign: 'center'
    },
    calDate: {
        color:'rgba(218,29,42,0.8)', 
        textAlign:'center',
        fontSize: 30
    },
    calMonth: {
        color: 'white', 
        textAlign: 'center',
        fontSize: 14
    },
    description: {
        padding: 10,
        paddingBottom: 50,
    }
});

