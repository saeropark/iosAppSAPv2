import React,{Component} from 'react';

import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    ListView,
    TouchableOpacity, Linking,
    Picker
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';
import Spinner from 'react-native-loading-spinner-overlay';

var REQUEST_URL = 'https://asap-c4472.firebaseio.com/.json';
var DIR_LIST =[];
export default class TestDir extends Component {

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
           this.getList(responseData.Directory);
           this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData.Directory),
                //dataSource: this.state.dataSource.cloneWithRows(responseData["items"]),
                isLoading: false,
                visible: false,
            });
        })
        .done();
    }

    //----- getList will create as a new object called newList and store into an array called DIR_LIST. Will be called later under ListCollapseView
    getList(obj){
        DIR_LIST.length=0;
        try{
            var noOfDir = obj.length;
            console.log(noOfDir);
            console.log(obj);   
            for (var i=1; i<noOfDir; i++ ){
              console.log(obj[i]);
                var newName = obj[i].name; 
                var newAddress = obj[i].address;
                var newHours = obj[i].hours;
                var newType = obj[i].type;
                var newWebsite = obj[i].website;
                var newZone = obj[i].zone;
                

                var newList = new Object();
                newList.title = newName;
                newList.desc = newAddress;
              
                if(obj[i]!= 'undefined') {
                    newList.hour = newHours;
                    newList.site = newWebsite;
                    newList.zone = newZone;
                    newList.type = newType;
                } else {
                    newList.hour = "Currently nothing available";
                    newList.site = "No Website or Facebook";
                    newList.zone = '';
                    newList.type = '';
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
        <Text style={styles.headerText}>{section.title}</Text>
        <Text style={{padding: 10,}}>{section.desc}</Text>
      </Animatable.View>
    );
  }

  _renderContent(section, i, isActive) {
    return (
      <Animatable.View duration={400}  style={[styles.content, isActive ? styles.active : styles.inactive]} transition="backgroundColor">
        <Text>Operating Hours: {section.hour}</Text>
         <TouchableOpacity onPress={()=> this.handleClick(section.site)}><Text>{section.site}</Text></TouchableOpacity>
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
    color: '#d510d3',
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
});
