import React,{Component} from 'react';

import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    ListView,
    TouchableOpacity, Linking,
    Picker,Image, Dimensions, RefreshControl
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';
import Spinner from 'react-native-loading-spinner-overlay';

var REQUEST_URL = 'https://asap-c4472.firebaseio.com/.json';



export default class TenantDirectory extends Component {

  constructor(props) {
        super(props);
        this.state = {
            //isLoading: true, 
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
        this.fetchData();
    }

    // --- calls Google API ---
    fetchData() {
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
            //responseData = this.removeDuplicates(responseData);
           responseData = this.getList(responseData);
           this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.sortBy(responseData)),
                //dataSource: this.state.dataSource.cloneWithRows(responseData["items"]),
                //isLoading: false,
                visible: false,
                refreshing: false
            });
        })
        .done();
    }

    //----- getList will create as a new object called newList and store into an array called DIR_LIST. Will be called later under ListCollapseView
    getList(obj){
        var DIR_LIST =[];
      console.log(obj);
        var tenantDir = obj.Tenant;
        console.log('getlist::::: ' + tenantDir);
        var tenantDirKeys = Object.keys(tenantDir);
        DIR_LIST.length=0;
        try{
            // var noOfDir = obj.length;
            // console.log(noOfDir);
            // console.log(obj);   
            for (var i=0; i< tenantDirKeys.length; i++ ){
              var key = tenantDirKeys[i];
              console.log(tenantDirKeys[i]);
            
                var newName = tenantDir[key].companyName; 
                var newHours = tenantDir[key].operatingHours;
                //var newType = tenantDir[key].cuisineType;
                var newWebsite = tenantDir[key].websiteURL;
                //var newZone = tenantDir[key].clusterZone;
                var newLogo = tenantDir[key].fileURL;
                var newBuildingName = tenantDir[key].address.buildingName;
                var newBuildingAddress = tenantDir[key].address.address;
                var newPostalCode = tenantDir[key].address.postalCode;

                var newList = new Object();
                newList.companyName = newName;
                //newList.desc = newAddress;
                newList.buildingName = newBuildingName;
                newList.buildingAddress = newBuildingAddress;
                newList.postalCode = newPostalCode;
              
                if(tenantDir[key]!= 'undefined') {
                    newList.hour = newHours;
                    newList.site = newWebsite;
                    // newList.zone = newZone;
                    // newList.type = newType;
                    newList.logo = newLogo;
                } else {
                    newList.hour = "Currently nothing available";
                    newList.site = "No Website or Facebook";
                    // newList.zone = '';
                    // newList.type = '';
                    newList.logo = '';
                }
                DIR_LIST.push(newList);
                
            }
            console.log(DIR_LIST);
            
            return DIR_LIST;
        }
        catch (err) {
            console.log("error: " + err);
        }
    }

    //---- sort by alphabetical-----
    sortBy(obj) {
        obj.sort(function(a,b) {return (a.companyName > b.companyName) ? 1 : ((b.companyName > a.companyName) ? -1 : 0);})
        return obj;
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
                renderRow = {this.renderDirectory.bind(this)}
                style = {styles.listView}
            />
            </View>
        );
    }

     renderDirectory(obj) {

        return (
        <View style={styles.container}>
            <View style = {styles.listItemContainer}>
                <Text style={styles.headerText}>{obj.companyName}</Text> 
                {((obj.buildingName)!= '')? 
                    <Text style={{paddingLeft: 10,}}>{obj.buildingName}</Text>
                    : 
                null
                } 
                <Text style={{paddingLeft: 10,}}>{obj.buildingAddress}</Text>
                <Text style={{paddingLeft: 10,}}>(s) {obj.postalCode}</Text>
            </View>
            <View style = {styles.separator}/>
        </View>
        );
    }
}

var styles = StyleSheet.create({
   container: {
       flex:1,
       backgroundColor: '#FFFFFF',
   },
   listItemContainer: {
       padding: 10,
   },
  headerText: {
    color: 'rgba(218,29,42,0.8)',
    fontSize: 18,
    fontWeight: '500',
    padding: 10,
  },
  dirText: {
    paddingLeft: 10,
  }
})
