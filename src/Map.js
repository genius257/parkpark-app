import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import './Map.css';

export class MapContainer extends Component {
  constructor(){
    super();
    this.state={
      parkingData:null,
      activeMarker:null,
      showingInfoWindow:false,
      markers:[],
      colors:{"rød":"red","blå":"blue","grøn":"green","gul":"yellow"}
    }
  }

  componentDidMount () {
    fetch('https://cors-anywhere.herokuapp.com/http://data.kk.dk/parking/latest/50')
        .then((response) => response.json())
        .then((json) => {
            //this.setState({ parkingData: json });
            this.state.parkingData=json;
            if(this.state.parkingData&&this.state.parkingData.results){
                this.state.markers=this.state.parkingData.results.map((value,key)=><Marker icon={{path:"M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z",strokeColor:"#000",fillColor:((value.areaId in this.state.colors)?this.state.colors[value.areaId]:value.areaId) ,fillOpacity:1}} label={key.toString('16')} position={{lat:value.sellingPointLocation.split(/[/,]/)[0],lng:value.sellingPointLocation.split(/[/,]/)[1]}} />);
            }
            this.forceUpdate();
        })
        .catch((err) => {
            // Handle error
            alert('a problem occurred when loading parking data');
        })
  }

  render() {
    let providers={};
    let $this=this;
    if(this.state.parkingData&&this.state.parkingData.results){
        //this.state.markers=this.state.parkingData.results.map((value,key)=><Marker icon={{path:"M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z",strokeColor:"#000",fillColor:((value.areaId in colors)?colors[value.areaId]:value.areaId) ,fillOpacity:1}} label={key.toString('16')} position={{lat:value.sellingPointLocation.split(/[/,]/)[0],lng:value.sellingPointLocation.split(/[/,]/)[1]}} />);
        this.state.parkingData.results.map(function(value, key){
            providers[value.providerId]=(providers[value.providerId]||0)+1;
        });
        //this.state.activeMarker=markers[5];
        //this.state.showingInfoWindow=true;
    }

    return (
        <div>
            <div>
                <div>antal parkeringer: <b>{this.state.markers.length}</b></div>
                <div>
                    {Object.keys(providers).map((value)=><div>{value}: <b>{providers[value]}</b></div>)}
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>udbyder</th>
                            <th>tidspunkt</th>
                            <th>koordinater</th>
                        </tr>
                    </thead>
                    <tbody>
                        {((this.state.parkingData&&this.state.parkingData.results)?this.state.parkingData.results:[]).map((value,key)=>
                            <tr>
                                <td>{value.providerId}</td>
                                <td>{new Date(value.validityBegin).toString()}</td>
                                <td className="link" onClick={()=>{$this.state.markers=[
                                    <Marker icon={{path:"M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z",strokeColor:"#000",fillColor:((value.areaId in $this.state.colors)?$this.state.colors[value.areaId]:value.areaId) ,fillOpacity:1}} label={key.toString('16')} position={{lat:value.sellingPointLocation.split(/[/,]/)[0],lng:value.sellingPointLocation.split(/[/,]/)[1]}} />
                                ];$this.forceUpdate();}}>{value.sellingPointLocation}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <Map google={this.props.google} zoom={11} initialCenter={{lat: 55.6760968, lng: 12.568337199999974}}>
                {this.state.markers}
            </Map>
        </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyBzMO-1djGW-xo3_ipBQ-1buk_ISW42OpA"
})(MapContainer)
