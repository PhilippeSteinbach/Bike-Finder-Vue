<template>
    <l-map
      ref="myMap"
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
      style="height: 80vh; width: 50vw; z-index: 0 !important;"
    >
      <l-tile-layer
        :url="url"
        :attribution="attribution"
      />
      <l-marker v-for="bike in bikes" :key="bike.id" :lat-lng="latLng(bike.location.latitude, bike.location.longitude)" @click="emitEvent(bike)">
        <l-tooltip :options="{ permanent: true, interactive: true }">
          <div>
            {{bike.name}}
          </div>
        </l-tooltip>
      </l-marker>
    </l-map>
</template>

<script>
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LTooltip } from "vue2-leaflet";

export default {
  name: "Example",
  props: {
    bikes: Array,
    bike: Object
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip
  },
  data() {
    return {
      zoom: 13,
      center: latLng(50.93856474439145, 6.956791877746582), // initial center
      currentCenter: latLng(50.93856474439145, 6.956791877746582),
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      showParagraph: true,
      mapOptions: {
        zoomSnap: 0.5,
        scrollWheelZoom: true
      },
    };
  },
  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    emitEvent(bike) {
      //console.log(bike);
      this.$emit("update", bike); // event updateCurrentBike
    },
    latLng(lat, lng){
      return latLng(lat, lng)
    },
    
  },
  watch: {
    bike: async function() {
      // https://vue2-leaflet.netlify.app/quickstart/#accessing-leaflet-api
      this.$nextTick(() => {
          this.$refs.myMap.mapObject.panTo(latLng(this.bike.location.latitude, this.bike.location.longitude)) // always pan map to active bike (clicks) 
      });
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
