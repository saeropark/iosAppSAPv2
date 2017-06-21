import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet, 
  ScrollView,
  ListView, 
  TouchableHighlight,
  Dimensions
} from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import {Icon, Button, Tile} from "react-native-elements";

import AboutOval from '../../js/FnBComponent/AboutOval';
import FnBDirectory from '../../js/FnBComponent/FnBDirectory';

var REQUEST_URL = 'https://asap-c4472.firebaseio.com/.json';
var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;

//------------------ TABS ----------------------//
class OvalTab extends React.Component {
  static navigationOptions = {
        tabBarLabel: 'OVAL'
    }
  render() {
    return <AboutOval />
  }
}

class DirectoryTab extends React.Component {
  static navigationOptions = {
        tabBarLabel: 'F&B Directory'
    }
  render() {
    return <FnBDirectory/>
  }
}

class PromoTab extends React.Component {
  static navigationOptions = {
        tabBarLabel: 'Promotion'
    }
  render() {
    return <PromoList/>
  }
}

/** =================== RENDERING INFORMATION ===================
 * ::::: PROMOLIST :::::
 * PromoList will fetch json data from the REQUEST_URL and display under listview.
 * Spinner will stop once data is loaded. 
 * Once a promotion poster is pressed, it will call PromoDetail class. 
 */

class PromoList extends React.Component {
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
                dataSource: this.state.dataSource.cloneWithRows(responseData.Promotion),
                //dataSource: this.state.dataSource.cloneWithRows(responseData["items"]),
                isLoading: false,
                visible: false,
            });
        })
        .done();
    }
    render() {
      //returns data in listview. within listview, format of data will be rendered under 'renderPromotion'
        return (
            <View style={{flex:1}}>
                <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
                <ListView
                    dataSource = {this.state.dataSource}
                    renderRow = {this.renderPromotion.bind(this)}
                    style = {styles.listView}
                />
            </View>
        );
    }

    //POSTER is displayed
    renderPromotion(event) {
        console.log('img ' + event.fileURL);
        var img = event.fileURL;
        console.log(img);
        return (
            <View>
                <View style = {styles.container}>
                    <View style={styles.dateColumn}>
                    <Tile
                        onPress={()=>this.imgOnPress(event)}
                        onLongPress={()=> this.imgOnPress(event)}
                        imageSrc={{uri: (event.fileURL)}}
                        //title={event.title}
                        //imageContainerStyle={{color: 'transparent'}}
                        //icon={{name: 'play-circle', type: 'font-awesome'}}  // optional
                        //contentContainerStyle={{height: 70}}
                        />
                        <Text style = {styles.title}> {event.title}</Text>
                        </View>
                </View>
                <View style = {styles.separator}/>
            </View>
        );
    }

    //imgOnPress will pass 'event' object to the Info page identified under PromoStack
    imgOnPress(event) {
        console.log("imgOnPress");
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
}


/** =================== DISPLAY DETAILED INFORMATION ===================
 * ::::: PROMODETAIL :::::
 * PromoDetail will receive information as object from PROMOLIST.
 * PromoDetail reads object via state (see 'this.props.navigation.state')
 */
class PromoDetail extends React.Component {
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
        if (params.event.fileURL ==='undefined' )
            imgURL = {uri:'../../../img/SAP.png'};
        else
            imgURL = {uri:params.event.fileURL};
        
        console.log('avail: ' + imgURL);
        return (
            <View style={styles.container}>
                <ScrollView>
                <View style={styles.contentContainer}>
                    <Image
                        style={{flex:1, width: undefined, height: deviceHeight, }}
                        resizeMode='contain'
                        source={imgURL}
                        //source={{uri: (params.event.fileURL === "")? '../../img/SAP.png' : params.event.fileURL}}
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
                                onPress={() => goBack()} 
                                />
                </ScrollView>
        </View>
        );
       
    }
}

const PromoStack = StackNavigator( {
    List: {screen: PromoList},
    Info: {screen: PromoDetail}
})

/**
 * Must be in order of how you want your tab to look.
 * Expected tab output:
 * PROMOTION | OVAL | F&B DIRECTORY
 */
const FoodTab = TabNavigator({
    Promotion: { screen: PromoStack},
    Oval: { screen: OvalTab },
    Directory: { screen: DirectoryTab },
  
},
    { mode: 'modal', // this is needed to make sure header is hidden on ios
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

//make sure they fall under the same stack to allow forward and prev navigation
const FoodStack = StackNavigator({
    Home: {screen: FoodTab},
})

FoodTab.navigationOptions = ({navigation})=> ({
  header: null,
  
  style: {
    backgroundColor: 'rgba(218,29,42,1)',
  }, 
});

export default FoodStack;

var styles = StyleSheet.create ({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
       
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
        fontSize: 26,
        paddingBottom: 20,
        color: 'grey',
        fontWeight: '500',
        
    },
    author: {
        color: '#656565'
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    listView: {
        backgroundColor: '#ffffff'
    },
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dateColumn: {
        flexDirection: 'column',
        flex: 1,
    },
    detail: {
        padding: 5,
        
    },
    iconText: {
        flex: 1,
        flexDirection: 'row',
        padding: 5
    },
    description: {
        padding: 10,
    }
});
