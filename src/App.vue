<template>
  <v-app id="inspire" style="z-index: 9000">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <router-link to="/home">
          <v-list-item link>
            <v-list-item-action>
              <v-icon>mdi-home</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>

        <router-link to="/news">
          <v-list-item link>
            <v-list-item-action>
              <v-icon>mdi-newspaper-variant-multiple</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Neuigkeiten</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>

        <router-link to="/map">
          <v-list-item link>
            <v-list-item-action>
              <v-icon>mdi-map-marker</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Alle Fahrräder anzeigen</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>

        <router-link to="/history">
          <v-list-item link>
            <v-list-item-action>
              <v-icon>mdi-history</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Vergangene Ausleihen</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Bike-Finder</v-toolbar-title>
      
      <v-spacer></v-spacer>

      <p class="mx-2 my-5">Hallo, Philippe</p>
      <v-avatar color="grey">
        <v-icon dark>mdi-account-circle</v-icon>
      </v-avatar>
    </v-app-bar>

    <v-content>
        <v-row align="center" justify="center">
          <div class="container body-content">
            <router-view></router-view>
          </div>
        </v-row>
    </v-content>

    <v-footer app>
      <span>Bike-Finder &copy; 2020</span>
      <!-- <v-spacer></v-spacer>
      <v-btn dark @click="showNotification">
        Send Notification
        <v-icon dark right>mdi-message</v-icon>
      </v-btn> -->
    </v-footer>
  </v-app>
</template>

<script>
import * as signalR from '@aspnet/signalr';

export default {
  props: {
    source: String,
  },

  data: () => ({
    drawer: null,
  }),

  methods: {
    askPermission() {
      Notification.requestPermission((result) => {
        console.log("Notification permission result: ", result);
        if (result !== "granted") {
          alert("You probably do not like notifications?!");
        } else {
          console.log(
            "A notification will be send from the service worker => This only works in production"
          );
        }
      });
    },
    showNotification() {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready // returns a Promise, the active SW registration
          .then((swreg) =>
            swreg.showNotification("Es gibt Neuigkeiten für dich", {
              body: "Klicke hier um sofort zur News zu gelangen...",
              icon: "/img/icons/icon-192x192.png",
              image: "/img/icons/icon-192x192.png",
              vibrate: [300, 200, 300],
            })
          );
      }
    },
  },

  created() {
    this.$vuetify.theme.dark = true;
    this.askPermission();
  },
  mounted(){
    var thisVue = this;
    // https://docs.microsoft.com/en-us/aspnet/core/signalr/javascript-client?view=aspnetcore-3.1
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(process.env.VUE_APP_SIGNALR_HUB)
      .configureLogging(signalR.LogLevel.Information)
      .build()
 
    async function start() {
        try {
            await connection.start();
            console.log("connected");
        } catch (err) {
            console.log('failed to connect: ' + err);
            setTimeout(() => start(), 5000);
        }
    }

    connection.onclose(async () => {
        await start();
    });

    // Start the connection.
    start();

    connection.on("broadcastMessage", function(message) {
      console.log('Received new news article: ' + message);
      thisVue.showNotification();
    });
  }
};
</script>

<style>
/* Hide hyperlinks */
a {
  text-decoration: none;
}
</style>
