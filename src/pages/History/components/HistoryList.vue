<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" >
        <v-card v-for="element in history" :key="element.id" max-width="100%" class="mx-3 my-5">
            <v-row>
                <v-col>
                    <v-img class="mx-3 my-5" max-width="150" :src="element.imageUrl"></v-img>
                </v-col>
                <v-col>
                    <p class="text--disabled">Name</p>
                    {{ element.name }}
                </v-col>
                <v-col>
                    <v-card-text>
                        <p class="text--disabled">Ausleihdatum</p>
                        {{ element.startDate | moment("LLLL") }} Uhr</v-card-text>
                </v-col>
                <v-col>
                    <v-card-text>
                        <p class="text--disabled">Rückgabedatum</p>
                        {{ element.endDate | moment("LLLL") }} Uhr</v-card-text>
                </v-col>
                <v-col>
                    <v-card-text>
                        <p class="text--disabled">Gesamtstrecke</p>
                        {{ element.distance.toLocaleString() }} Kilometer</v-card-text>
                </v-col>
            </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
export default {
  name: "HistoryList",
  props: {
    history: Array
  },
  data: () => ({
    //
  }),
  methods: {
    //
  },
  mounted(){
    //
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
