<template>
  <v-data-table
    :headers="headers"
    :items="bikes"
    :items-per-page="5"
    class="elevation-1"
    @click:row="updateBike"
  >
    <template v-slot:item.imageUrl="{ item }">
      <div class="p-2">
        <v-img :src="item.imageUrl" :alt="item.name" width="30px"></v-img>
      </div>
    </template>
    <template v-slot:item.locationAddress="{ item }">
      <div class="p-2">{{item.locationAddress}}</div>
    </template>
    <template slot="items" slot-scope="props">
      <div class="p-2">
        <tr @click="showAlert(props.item)"></tr>
      </div>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "BikesList",
  props: {
    bikes: Array,
    bike: Object
  },
  data: () => ({
    headers: [
      { value: "imageUrl", sortable: false, width: "10" },
      {
        text: "Bike Name",
        sortable: true,
        value: "name"
      },
      { text: "Standort", value: "locationAddress", sortable: false }
    ]
  }),
  methods: {
    updateBike(row) {
      this.$emit("event", row);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
