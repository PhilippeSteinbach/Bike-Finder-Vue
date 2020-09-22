<template>
      <v-card v-if="bike" max-width="100%" height="100%">
            <v-card-title>{{bike.name}}</v-card-title>
            <v-divider class="mx-4"></v-divider>
            <v-img class="mx-3 my-5" max-width="150" :src="bike.imageUrl"></v-img>
            <v-card-text>{{bike.locationAddress}}</v-card-text>
            <v-card-actions>
              <v-card :loading="loading" class="mx-2 my-12" max-width="100%">
                <v-btn color="deep-purple lighten-2" text @click="reserve" :disabled="reserved">Jetzt reservieren</v-btn>
              </v-card>
            </v-card-actions>
            <v-card-text>* Hinweis: Die angebotene Reservierung simuliert zu Demo-Zwecken die Fahrt mit dem ausgewählten Fahrrad und generiert einen zufälligen neuen Standort mit keinem Bezug zur realen Welt.</v-card-text>
            <v-alert v-if="reserved && bike.name === reservedBikeName" type="success">Die Reservierung von {{reservedBikeName}} war erfolgreich. </v-alert>
      </v-card>
</template>

<script>
import { setBikeLocation, createHistory } from "@/service";
import axios from 'axios'
import moment from 'moment'

export default {
  name: "BikeDetails",
  props: {
    bike: Object
  },
  data: () => ({
    loading: false,
    reserved: false,
    reservedBikeName: null
  }),
  methods: {
    async reserve() {
      this.loading = true;

      var newLocation = this.calculateNewLocation(this.bike.location)
      var newLocationAddress = await this.geocode(newLocation)
      var bikeRequestBody = {
        location: {
          iv: {
            latitude: newLocation.latitude,
            longitude: newLocation.longitude
          }
        },
        locationAddress: {
          iv: newLocationAddress
        }
      }

      await setBikeLocation(this.bike.id, bikeRequestBody)
      
      var historyRequestBody = {
          startDate: {
              iv: moment().utc().format()
          },
          endDate: {
              iv: moment().utc().add(Math.floor(Math.random() * 60) + 10, 'minutes').format()
          },
          bike: {
              iv: this.bike.name
          },
          distance: {
              iv: parseFloat(((Math.random() * (5.00 - 1.00) + 1.00).toFixed(2)))
          },
          image: {
            iv: [
              this.bike.imageUrl.split("assets/").pop()
            ]
          }
      }
      
      await createHistory(historyRequestBody)

      setTimeout(() => {
        this.loading = false;
        this.reserved = true;
        this.reservedBikeName = this.bike.name;
        this.$emit("load"); // event loadBikes
        this.bike.locationAddress = newLocationAddress
      }, 5000);
      
    },
    calculateNewLocation(location){
      var r = 2000/111300 // = 2000 meters
            , y0 = location.latitude
            , x0 = location.longitude
            , u = Math.random()
            , v = Math.random()
            , w = r * Math.sqrt(u)
            , t = 2 * Math.PI * v
            , x = w * Math.cos(t)
            , y1 = w * Math.sin(t)
            , x1 = x / Math.cos(y0)

            var newY = y0 + y1
            var newX = x0 + x1

            console.log("Calculated new location");

            return ({
              latitude: newY,
              longitude: newX
            })
    },
    geocode(location){
      var latLng = {lat: parseFloat(location.latitude), lng: parseFloat(location.longitude)};

        var geoRequestParams = {
          format: "jsonv2",
          lat: latLng.lat,
          lon: latLng.lng
        }

        var json = axios
          .get("https://nominatim.openstreetmap.org/reverse", {params: geoRequestParams})
          .then(response => {
            //console.log(response.data);
            
            var address = null;

            if(response.data.address.house_number){
              address = response.data.address.road + " " +
                response.data.address.house_number + ", " +
                response.data.address.postcode + " " +
                response.data.address.city;
            } else {
              address = response.data.address.road + ", " +
                response.data.address.postcode + " " +
                response.data.address.city;
            }
            
            return(address)
          })
          .catch(error => console.log(error))

        return json
    },
  },
  async mounted(){
    //
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
