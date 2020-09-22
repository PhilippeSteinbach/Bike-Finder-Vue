<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" >
        <v-card v-for="article in articles" :key="article.id" max-width="100%" class="mx-3 my-5">
          <v-card-title>{{article.title}}</v-card-title>

          <v-divider class="mx-4"></v-divider>

          <v-card-text>{{article.subtitle}}</v-card-text>

          <v-divider class="mx-4"></v-divider>

          <v-card-text>{{article.text}}</v-card-text>

          <v-img class="mx-3 my-5" max-width="150" :src="article.imageUrl"></v-img>

          <v-divider class="mx-4"></v-divider>

          <v-card-text>{{ article.created | moment("LLLL") }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
export default {
  name: "NewsList",
  props: {
    articles: Array
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
