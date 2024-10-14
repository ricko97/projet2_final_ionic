<script lang="ts">
import {IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from "@ionic/vue";
import {defineComponent, ref} from "vue";
import L from 'leaflet'
import {getTripsByUserId} from "@/services/api";
import {getCurrentUser} from "@/services/user";
import {Trip, User} from "@/services/models";
import router from "@/router";

export default defineComponent({
  computed: {
    tripId() {
      return router.currentRoute.value.params.tripId;
    }
  },
  components: {
    IonBackButton,
    IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar
  },
  async ionViewDidEnter() {
    let currentUser: User = await getCurrentUser()
    currentUser = JSON.parse(currentUser.value)

    const res = await getTripsByUserId(currentUser.userId, this.tripId)
    this.currentTrip = res.data.trips.concat(res.data.sharedTrips).findLast((trip) => {
      return trip.tripId === this.tripId
    })


    //Initialiser avec les coordonnées de la premiere position
    const map = L.map('map').setView([this.currentTrip.locations[0].latitude,
      this.currentTrip.locations[0].longitude], 13);
    // Add the OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Projet 2 Ionic'
    }).addTo(map);

    this.currentTrip.locations.forEach((pos, index) => {
      const marker = L.marker([pos.latitude, pos.longitude]).addTo(map);
      marker.bindPopup(`<b>Position ${index}</b><br>Latitude: ${pos.latitude},
            Longitude: ${pos.longitude}`).openPopup();
    });
  },
  setup(){
    const currentTrip : Trip = ref({})
    return {
      currentTrip
    }
  },
})
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
          <ion-back-button default-href="/trips"></ion-back-button>
        </ion-buttons>
        <ion-title>Details du trajet "{{currentTrip.pathName}}"</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content id="content" :fullscreen="true">
      <div id="map" style="height: 100vh;"></div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
#map {
  height: 100%;
  width: 100%;
}
</style>