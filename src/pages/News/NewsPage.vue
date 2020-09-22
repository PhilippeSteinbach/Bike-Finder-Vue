<template>
  <v-container v-if="newsContent">
    <v-row >
      <v-col cols="12">
        <NewsList :articles="newsContent"></NewsList>
      </v-col>
    </v-row>
  </v-container> 
</template>

<script>
import { getNews } from "@/service";
import NewsList from "@/pages/News/components/NewsList.vue";

export default {
  name: "News",
   components: {
     NewsList
  },

  data: () => ({
    newsContent: null
  }),
  methods:{
    loadNewsContent: async function() {
      this.newsContent = [];
      try {
        const result = await getNews();
        console.log(result);
        this.newsContent = result.news;
      } catch (ex) {
        this.newsContent = [];
        console.log(ex);
      }
    }
  },
  async mounted() {
    this.loadNewsContent();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
