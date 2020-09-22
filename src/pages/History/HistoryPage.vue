<template>
  <v-container v-if="historyContent">
    <v-row >
      <v-col cols="12">
        <HistoryList :history="historyContent"></HistoryList>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getHistory } from "@/service";
import HistoryList from "@/pages/History/components/HistoryList.vue";

export default {
  name: "HistoryPage",
  components: {
    HistoryList
  },
  data: () => {
    return {
      historyContent: null
    };
  },
  methods: {
    loadHistoryContent: async function() {
      this.historyContent = [];
      try {
        const result = await getHistory();
        console.log(result);
        this.historyContent = result.history;
      } catch (ex) {
        this.historyContent = [];
        console.log(ex);
      }
    }
  },
  async mounted() {
    this.loadHistoryContent();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>