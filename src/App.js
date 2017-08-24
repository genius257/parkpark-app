import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import GoogleApiWrapper, {MapContainer} from './Map'

class App extends Component {
  render() {
    return (
      <div className="App">
        <GoogleApiWrapper google={{center:"Denmark"}} />
      </div>
    );
  }
}

export default App;
