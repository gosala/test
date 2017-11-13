import { Component } from '@angular/core';
import { NavController, Platform, AlertController  } from 'ionic-angular';
import { NavParams,Events } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation'; 
import { MapsAPILoader } from 'angular2-google-maps/core';
import { Diagnostic } from '@ionic-native/diagnostic';  
//import { GoogleMap, GoogleMapsEvent } from '@ionic-native';
// import {
//  GoogleMaps,
//  GoogleMap,
//  GoogleMapsEvent,
//  LatLng,
//  MarkerOptions,
// } from '@ionic-native/google-maps';


declare var google:any;
 declare var cordova:any;
 
@Component({
    templateUrl: 'home.html'
})
export class HomePage {
    map: any;
    count:any;
    state:any;
    load:any;
    city:any;
    latlng:any;
    mlatlng:any;
    marker: any;
     public geocoder:any;
    constructor(public events: Events, public alertCtrl: AlertController, private geolocation: Geolocation,public platform: Platform,public geoloc: Geolocation,public navCtrl: NavController,private navParams: NavParams, private _loader : MapsAPILoader, private diagnostic: Diagnostic)
    {
        this.platform.ready().then(() => {
            
             /************************ion loader code ************************/
            //   this.loading = this.loadingCtrl.create({
            //         content: 'Please wait...'
            //     });
            //     this.loading.present();
            /**************************************************************/
            
            this.geolocation.getCurrentPosition().then((resp) => {   
                this.latlng = new google.maps.LatLng(resp.coords.latitude,resp.coords.longitude);
                this.geocoder = new google.maps.Geocoder();
                this.GeoCode(this.latlng,'place');                
            }).catch((error) => {console.log('Error getting location', error);});  

            // cordova.plugins.locationAccuracy.canRequest(function(canRequest){
            //    // this.loading.dismiss();
            //     if(canRequest){
            //         cordova.plugins.locationAccuracy.request(function (success){                    
            //             console.log("Successfully requested accuracy: "+success.message);
            //         }, function (error){
            //         console.error("Accuracy request failed: error code="+error.code+"; error message="+error.message);
            //         if(error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED){
            //             if(window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")){
            //                 cordova.plugins.diagnostic.switchToLocationSettings();
            //             }
            //         }
            //     }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
            
            //     }
            // });    
                
        })
        
            // cordova.plugins.diagnostic.isLocationEnabled(function(enabled){
            //    if (enabled != true) {
            //        (<HTMLInputElement>document.getElementById('Address')).value = 'Search Location';
            //        //this.loading.dismiss();
            //     }else{
            //         //this.loading.dismiss();
            //          this.geolocation.getCurrentPosition().then((resp) => {   
            //             this.latlng = new google.maps.LatLng(resp.coords.latitude,resp.coords.longitude);
            //             this.geocoder = new google.maps.Geocoder();
            //             this.GeoCode(this.latlng);                
            //         }).catch((error) => {console.log('Error getting location', error);});  
            //     }
            // }, function(error){                
            //     alert("The following error occurred: "+error);
            // });
        this.autocomplete();
        this.map = {
            lat: 0,
            lng: 0,
            zoom: 16
        };
 
    }
    ionViewDidLoad(){
       
    }
    GeoCode(latlng,place) {
      debugger
         if(place.formatted_address){
           debugger
            let mapOptions = {
                center: latlng,
                zoom: 12,
                draggable : true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            this.map = new google.maps.Map(document.querySelector('#map'), mapOptions);
            this.loadMap(latlng);
            console.log(JSON.stringify(place.address_components));
            (<HTMLInputElement>document.getElementById('Address')).value = place.formatted_address;
            (<HTMLInputElement>document.getElementById('autocomplete')).value = place.formatted_address;
             
         }else{
           let mapOptions = {
                center: latlng,
                zoom: 16,
                draggable : true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            this.map = new google.maps.Map(document.querySelector('#map'), mapOptions);
            this.loadMap(latlng);
            this.geocoder.geocode({'location': latlng }, function (results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                var address = (results[0].formatted_address); 
                var  value=address.split(",");
                this.count=value.length;
                this.country=value[this.count-1];
                this.state=value[this.count-2];
                this.city=value[this.count-3];
                //var  lvalue=results[1].formatted_address.split(",");
                console.log(results);
                console.log(JSON.stringify(results[0].address_components));
                (<HTMLInputElement>document.getElementById('Address')).value = address;
              }
            });
         }

    //this.loading.dismiss();
  }
loadMap(latlng){
      let marker = new google.maps.Marker({ position: latlng, map: this.map, title: 'Search..!',draggable: true,'markerClick': function(marker) {
					marker.showInfoWindow();
        }});
         
        google.maps.event.addListener(marker, 'dragend', () => {
            this.mlatlng = new google.maps.LatLng(marker.getPosition().lat(),marker.getPosition().lng());
            
            this.GeoCode(this.mlatlng,'place');
        });
}
//    presentConfirm() {
//     let alert = this.alertCtrl.create({
//       title: 'Confirm purchase',
//       message: 'Do you want to buy this book?',
//       buttons: [
//         {
//           text: 'Cancel',
//           role: 'cancel',
//           handler: () => {
//             console.log('Cancel clicked');
//           }
//         },
//         {
//           text: 'Ok',
//           handler: () => {
//            cordova.plugins.diagnostic.switchToLocationSettings();
//           }
//         }
//       ]
//     });
//     alert.present();
//   }
    // loadMap(){
       
    //     this.geoloc.getCurrentPosition().then((position) => {
    //          let latLng = new google.maps.LatLng(-34.9290, 138.6010);
 
    //         let mapOptions = {
    //             center: latLng,
    //             zoom: 15,
    //             mapTypeId: google.maps.MapTypeId.ROADMAP
    //         }
    //     })
    // }
 
    autocomplete() {
        this._loader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete( document.getElementById('autocomplete').getElementsByTagName('input')[0], {types: ['(regions)'],strictBounds :true,componentRestrictions:{'country': 'IN'}});
            google.maps.event.addListener(autocomplete, 'place_changed', () => {
                let place = autocomplete.getPlace();
                console.log(place.formatted_address);
                this.map.lat  = place.geometry.location.lat();
                this.map.lng = place.geometry.location.lng();
                var latlng = new google.maps.LatLng(this.map.lat,this.map.lng);
                this.geocoder = new google.maps.Geocoder();
                this.GeoCode(latlng,place)
            });
        });
    }
 
 
}
