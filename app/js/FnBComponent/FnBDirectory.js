/**
 * F&B Directory will have a picker for user to choose their cuisine type. 
 * They are sorted by alphabetical order. 
 */

import React,{Component} from 'react';

import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    ListView,
    TouchableOpacity, Linking,
    Picker,Image, Dimensions
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';
import Spinner from 'react-native-loading-spinner-overlay';

var REQUEST_URL = 'https://asap-c4472.firebaseio.com/.json';
var DIR_LIST =[];


export default class FnBDirectory extends Component {

  constructor(props) {
        super(props);
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
           this.getList(responseData);
           this.setState({
                //dataSource: this.state.dataSource.cloneWithRows(responseData['F&B']),
                //dataSource: this.state.dataSource.cloneWithRows(responseData["items"]),
                isLoading: false,
                visible: false,
            });
        })
        .done();
    }

    //----- getList will create as a new object called newList and store into an array called DIR_LIST. Will be called later under ListCollapseView
    getList(obj){
      console.log(obj);
        var foodDir = obj['F&B'];
        console.log('getlist::::: ' + foodDir);
        var foodDirKeys = Object.keys(foodDir);
        DIR_LIST.length=0;
        try{
            // var noOfDir = obj.length;
            // console.log(noOfDir);
            // console.log(obj);   
            for (var i=0; i< foodDirKeys.length; i++ ){
              var key = foodDirKeys[i];
              console.log(foodDirKeys[i]);
                // var newName = obj[i].companyName; 
                // //var newAddress = obj[i].address;
                // var newHours = obj[i].operatingHours;
                // var newType = obj[i].cuisineType;
                // var newWebsite = obj[i].websiteURL;
                // var newZone = obj[i].clusterZone;
                // var newLogo = obj[i].fileURL;
                // var newBuildingName = obj[i].address.buildingName;
                // var newBuildingAddress = obj[i].address.address;
                // var newPostalCode = obj[i].address.postalCode;
                var newName = foodDir[key].companyName; 
                var newHours = foodDir[key].operatingHours;
                var newType = foodDir[key].cuisineType;
                var newWebsite = foodDir[key].websiteURL;
                var newZone = foodDir[key].clusterZone;
                var newLogo = foodDir[key].fileURL;
                var newBuildingName = foodDir[key].address.buildingName;
                var newBuildingAddress = foodDir[key].address.address;
                var newPostalCode = foodDir[key].address.postalCode;
                
                if(newHours) {
                  var formatHours;
                  if (newHours.includes('=')){
                    formatHours = newHours.replace(/=/g,'\n\n');
                    newHours = formatHours;
                  }
                  if (newHours.includes('/')) {
                    formatHours = newHours.replace(/\//g,'\n');
                    newHours = formatHours;
                  }
                }

                var newList = new Object();
                newList.companyName = newName;
                //newList.desc = newAddress;
                newList.buildingName = newBuildingName;
                newList.buildingAddress = newBuildingAddress;
                newList.postalCode = newPostalCode;
              
                if(foodDir[key]!= 'undefined') {
                    newList.hour = newHours;
                    newList.site = newWebsite;
                    newList.zone = newZone;
                    newList.type = newType;
                    newList.logo = newLogo;
                } else {
                    newList.hour = "Currently nothing available";
                    newList.site = "No Website or Facebook";
                    newList.zone = '';
                    newList.type = '';
                    newList.logo = '';
                }
                DIR_LIST.push(newList);
            }
            console.log(DIR_LIST);
        }
        catch (err) {
            console.log("error: " + err);
        }
    }

    render() {
        return (
           <View style={styles.container}>
                <ListCollapseView/>
            </View>
        );
    }
}

//-------------- DROP DOWN MENU CLASS ----------------------//


class ListCollapseView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          activeSection: false,
          collapsed: true,
          cuisineType: 'All',
        }
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
        <Text style={styles.headerText}>{section.companyName}</Text> 
        {((section.buildingName)!= '')? 
            <Text style={{paddingLeft: 10,}}>{section.buildingName}</Text>
            : 
           null
        } 
        <Text style={{paddingLeft: 10,}}>{section.buildingAddress}</Text>
        <Text style={{paddingLeft: 10,}}>(s) {section.postalCode}</Text>
      </Animatable.View>
    );
  }

  _renderContent(section, i, isActive) {
    return (
      <Animatable.View duration={400}  style={[styles.content, isActive ? styles.active : styles.inactive]} transition="backgroundColor">
         {((section.logo)!= '')? 
            <Image
                style={{flex:1, width:undefined, height: 300}}
                source={{uri: section.logo}}
                resizeMode="contain"
                //title="Seletar Aerospace Park"
                contentContainerStyle={{height: 70}}
            />: 
            null
        }
         
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.textBold}>Zone:</Text><Text> {section.zone}</Text>
        </View>
        <Text style={styles.textBold}>Operating Hours:</Text>
        <Text>{section.hour}</Text>
         <TouchableOpacity onPress={()=> this.handleClick(section.site)}>
           <Text style={{color:'rgba(218,29,42,0.8)'}}>{section.site}</Text>
        </TouchableOpacity>
      </Animatable.View>
    );
  }
  handleClick(url) {
      //  var myurl = url.site;
      //  console.log("URL: "+ myurl);
      Linking.openURL(url);
    }
  
  sortOn(property){
    return function(a, b){
        if(a[property] < b[property]){
            return -1;
        }else if(a[property] > b[property]){
            return 1;
        }else{
            return 0;   
        }
    }
}


  filterDirectory(val){
    var array = [];
    if (val === "All"){
      array = DIR_LIST;
    } else {
      for(var i = 0; i < DIR_LIST.length; i++){
        if (DIR_LIST[i].type === val){
          array.push(DIR_LIST[i])
        }
      }
    }
    array.sort(function(a,b) {return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0);})
    return array;
  }

   
  render() {
    //var type = DIR_LIST[this.state.cusineType];
    console.log("Selected state: " + this.state.cuisineType);
    var filteredList = this.filterDirectory(this.state.cuisineType);
    console.log(filteredList);
        // console.log( "content type:" + type.title);
        // console.log( "url link:" + type.url);
        
    return (
      <View style={styles.dContainer}>
         <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
        <ScrollView>
          <Text style={{fontSize: 18, paddingLeft: 10, paddingTop: 10,}}>Filter by Cuisine type:</Text>
            <Picker
                selectedValue={this.state.cuisineType}
                onValueChange={(cuisineValue) => this.setState({cuisineType: cuisineValue})}>
                    <Picker.Item label = "All" value = "All" />
                    <Picker.Item label = "Asian" value = "Asian" />
                    <Picker.Item label = "Chinese" value = "Chinese" />
                    <Picker.Item label = "European" value = "European" />
                    <Picker.Item label = "Fusion" value = "Fusion" />
                    <Picker.Item label = "Local Delights" value = "Local Delights" />
                    <Picker.Item label = "Thai" value = "Thai" />
                    <Picker.Item label = "Western" value = "Western" />
                </Picker>
                <View style = {styles.separator}/>
        <Accordion
          activeSection={this.state.activeSection}
          sections={filteredList}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent.bind(this)}
          duration={400}
          onChange={this._setSection.bind(this)}
        />
        </ScrollView>

      </View>
    );
  }
}



var styles = StyleSheet.create({
   container: {
       flex:1,
       backgroundColor: '#FFFFFF',
   },

  //------- Dropdowwn stylng -------//
  dContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 20,
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  headerText: {
    color: 'rgba(218,29,42,0.8)',
    fontSize: 18,
    fontWeight: '500',
    padding: 10,
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
  },
  inactive: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  active: {
    backgroundColor: 'rgba(245,252,255,1)',
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
  separator: {
        height: 1,
        backgroundColor: '#dddddd',
    },
    textBold: {
    fontWeight: 'bold',
  },
});
