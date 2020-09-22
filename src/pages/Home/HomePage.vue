<template>
  <v-container v-if="homeContent">
    <v-row >
      <v-col cols="12">
        <v-carousel
          cycle
          hide-delimiter-background
          show-arrows-on-hover
        >
          <v-carousel-item
            v-for="(image, i) in homeContent.carouselImageUrls"
            :key="i"
          >
              <v-row
                class="fill-height"
                align="center"
                justify="center"
              >
                <v-img :src="image"></v-img>
              </v-row>
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">{{homeContent.headerTitle}}</h1>
        <p class="subheading font-weight-regular">
          {{homeContent.headerSubtitle1}}
          <br />
          {{homeContent.headerSubtitle2}}
        </p>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-card
        v-for="(highlight, i) in homeContent.highlights"
        :key="i"
        class="mx-3 my-12"
        max-width="250"
      >
        <v-img
          height="190"
          :src="homeContent.highlights[i].image"
        ></v-img>

        <v-card-title>{{highlight.title}}</v-card-title>

        <v-card-text>
          <v-row
            align="center"
            class="mx-0"
          >
            <div class="grey--text ml-4">{{highlight.subtitle}}</div>
          </v-row>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import { getHome } from "../../service";

export default {
  name: "Home",

  data: () => ({
    homeContent: null
  }),
  computed:{
  },
  methods:{
    loadHomeContent: async function() {
      this.homeContent = [];
      try {
        const result = await getHome();
        console.log(result);
        this.homeContent = result.homeContent;
      } catch (ex) {
        this.homeContent = [];
        console.log(ex);
      }
    }
  },
  async mounted() {
    this.loadHomeContent();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

