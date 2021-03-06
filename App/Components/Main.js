var React = require('react-native');
var api = require('../Utils/api');
var Dashboard = require('./Dashboard');

var {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS
} = React;

class Main extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      username: '',
      isLoading: false,
      error: false
    }
  }
  handleChange(event){
    console.log('CHANGE', this.state.username);
    this.setState({
      username: event.nativeEvent.text
    });
  }
  handleSubmit(){
    //update our indicatorIOS spinner
    this.setState({
      isLoading: true
    });
    console.log('SUBMIT', this.state.username);
    //fetch data from github
    //reroute to the next passing the github information
    api.getBio(this.state.username)
      .then((res) => {
        console.log('requested');
        if(res.message === 'Not Found'){
          console.log('error');
          this.setState({
            error: 'User not found',
            isLoading: false
          })
        } else {
          console.log('success');
          this.props.navigator.push({
              title: res.name || "Select an Option",
              component: Dashboard,
              passProps: {userInfo: res}
          });
          this.setState({
            isLoading: false,
            error: false,
            username: ''
          })
        }
      })
    
  }
  render(){
    var showErr = (
      this.state.error ? <Text> {this.state.error} </Text> : <View></View>
    );
    return (
      <View style={styles.mainContainer}>
        <Text style={styles.title}> Search for a Github User </Text>
        <TextInput 
          style={styles.searchInput}
          value={this.state.username}
          onChange={this.handleChange.bind(this)} />
          <TouchableHighlight
            style={styles.button}
            onPress={this.handleSubmit.bind(this)}
            underlayColor="white">
              <Text style={styles.buttonText}> SEARCH </Text> 
          </TouchableHighlight>
          <ActivityIndicatorIOS
            animating={this.state.isLoading}
            color="#111"
            style={styles.loader}
            size="large"></ActivityIndicatorIOS>
          {showErr}
      </View>
    )
  }
}

var styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 30,
    marginTop: 65,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#48BBEC'
  },
  title: {
    marginBottom: 20,
    fontSize: 25,
    textAlign: 'center',
    color: '#fff'
  },
  searchInput: {
    height: 50,
    padding: 4,
    marginRight: 5,
    fontSize: 23,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    color: 'white'
  },
  buttonText: {
    fontSize: 18,
    color: '#111',
    alignSelf: 'center'
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  loader: {
    alignSelf: 'center'
  }
});


module.exports = Main;