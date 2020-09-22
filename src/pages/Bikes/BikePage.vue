<template>
  <v-container v-if="bikes">
    <v-row>
      <v-col>
        <leaflet :bikes="bikes" :bike="activeBike" @update="updateCurrentBike" @load="loadBikes" ></leaflet>
      </v-col>
      <v-col>
        <BikeDetails :bike="activeBike" @update="updateCurrentBike" @load="loadBikes"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <BikesList :bikes="bikes" :bike="activeBike" v-on:event="updateCurrentBike" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Leaflet from "@/pages/Bikes/components/Leaflet.vue";
import BikesList from "@/pages/Bikes/components/BikesList.vue";
import BikeDetails from "@/pages/Bikes/components/BikeDetails.vue";
import { getBikes } from "@/service";

export default {
  name: "BikePage",
  components: {
    BikeDetails,
    BikesList,
    Leaflet
  },
  data: () => {
    return {
      bikes: null,
      activeBike: null
    };
  },
  methods: {
    updateCurrentBike(bike) {
      //console.log("current bike updated");
      this.activeBike = bike;
    },
    loadBikes: async function() {
      //console.log("load bikes");
      this.bikes = [];
      try {
        const result = await getBikes();
        console.log(result);
        this.bikes = result.bikes;
      } catch (ex) {
        this.bikes = [];
        console.log(ex);
      }
    }
  },
  async mounted() {
    this.loadBikes();
  }
};
</script>

<style scoped>

</style>
