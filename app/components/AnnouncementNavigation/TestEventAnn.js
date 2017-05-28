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
  Alert
} from 'react-native';
import { StackNavigator, navigate } from 'react-navigation';
import { TabNavigator } from "react-navigation";
import {Icon, Button} from "react-native-elements";
import Spinner from 'react-native-loading-spinner-overlay';

var REQUEST_URL = 'https://asap-c4472.firebaseio.com/.json';
var event;
var someText;
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
    static navigationOptions = ({ navigation }) => ({
     header: null,
    });

    constructor(props) {
    super(props);
    const navigate = this.props.navigation;
    //const { navigate } = this.props.navigation;
    this.state = {
        isLoading: true, 
        visible: true,
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
            //responseData = this.removeDuplicates(responseData);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.sortObjects(responseData)),
                //dataSource: this.state.dataSource.cloneWithRows(responseData["items"]),
                isLoading: false,
                visible: false,
            });
        }).catch((error) => {
            console.error(error);
            Alert.alert('Unable to connect to the internet. Please check your connectivity!');
        })
        .done();
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
                                <Text style={styles.calDate}> {event.date.split("/")[1]} </Text>
                            </View>
                            <View style={{backgroundColor: 'white', flex:0.2}}>
                                <Text style={styles.calMonth}> { this.getMonth(event.date.split("/")[0]) } </Text>
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
        isLoading: true, 
        visible: true,
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
            //responseData = this.removeDuplicates(responseData);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.sortObjects(responseData)),
                //dataSource: this.state.dataSource.cloneWithRows(responseData["items"]),
                isLoading: false,
                visible: false
            });
        }).catch((error) => {
            console.error(error);
            Alert.alert('Unable to connect to the internet. Please check your connectivity!');
        })
        .done();
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
                                <Text style={styles.calDate}> {event.date.split("/")[1]} </Text>
                            </View>
                            <View style={{backgroundColor: 'white', flex:0.2}}>
                                <Text style={styles.calMonth}> { this.getMonth(event.date.split("/")[0]) } </Text>
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
            //responseData = this.removeDuplicates(responseData);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.sortObjects(responseData)),
                //dataSource: this.state.dataSource.cloneWithRows(responseData["items"]),
                isLoading: false
            });
        })
        .done();
    }
    render() {
      //const { navigate } = this.props.navigation;
        return (
            <ListView
                dataSource = {this.state.dataSource}
                renderRow = {this.renderEvent.bind(this)}
                style = {styles.listView}
            />
        );
    }


    renderEvent(event) {
        return (
           <TouchableHighlight 
                onPress={() => this.testOnPress(event)}>
                <View>
                    <View style = {styles.container}>
                        <Image
                            source={require(event.fileURL)}
                            />
                             <View style={{backgroundColor: (event.postType === 'Announcement')? '#ff8080':'#99ffbb',width: 100}}>
                                <Text style = {styles.postType}> {event.postType} </Text>
                            </View>
                            <Text style = {styles.title}> {event.title}</Text>
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

        return (
            
            <View style={styles.container}>
                <ScrollView>
                <View style={styles.contentContainer}>
                        <Image
                            style={{width: 300, height: 200}}
                            source={{uri: (params.event.fileURL === "")? '../../img/SAP.png' : params.event.fileURL}}
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



const EventTab = TabNavigator({
    Upcoming: { screen: AnnStack },
    Past: { screen: PastStack },
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
          backgroundColor: '#b510d3',
        },
      },
    }
);

const EventStack = StackNavigator({
    Home: {screen: EventTab},
    // List: {screen: EventList},
    // Info: {screen: EventDetail},
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
        fontSize: 20,
        paddingBottom: 8,
        color: '#b510d3',
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
        color:'white', 
        textAlign:'center',
        fontSize: 24
    },
    calMonth: {
        color: '#b51d03', 
        textAlign: 'center',
        fontSize: 14
    },
    description: {
        padding: 10,
        paddingBottom: 50,
    }
});

