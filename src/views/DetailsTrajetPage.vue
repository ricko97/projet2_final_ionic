<script lang="ts">
import {
  alertController,
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader, IonIcon,
  IonPage,
  IonTitle, IonToast,
  IonToolbar
} from "@ionic/vue";
import {defineComponent, ref} from "vue";
import L from 'leaflet'
import {getTripsByUserId, shareTrip} from "@/services/api";
import {getCurrentUser} from "@/services/user";
import {Trip, User} from "@/services/models";
import router from "@/router";
import {informationCircle, shareSocial} from "ionicons/icons";
import SideMenu from "@/components/side-menu.vue";

export default defineComponent({
  computed: {
    tripId() {
      return router.currentRoute.value.params.tripId;
    }
  },
  components: {
    SideMenu,
    IonIcon,
    IonToast,
    IonBackButton,
    IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar
  },
  async ionViewDidEnter() {
    const user = await getCurrentUser()
    this.currentUser = JSON.parse(user.value)

    const res = await getTripsByUserId(this.currentUser.userId, this.tripId)
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

    const mapIcon = L.icon({
      iconUrl: 'marker-icon-2x.png',
      iconSize: [28, 40],
      iconAnchor: [12, 44],
      popupAnchor: [-3, -36],
      shadowUrl: 'marker-shadow.png',
      shadowSize: [58, 40],
      shadowAnchor: [12,44]
    });

    this.currentTrip.locations.forEach((pos, index) => {
      const marker = L.marker([pos.latitude, pos.longitude], {icon: mapIcon}).addTo(map);
      marker.bindPopup(`<b>Position ${index}</b><br>Latitude: ${pos.latitude},
            Longitude: ${pos.longitude}`).openPopup();
    });
  },
  data() {
    return {
      currentUser : {} as User
    };
  },
  setup(){
    const currentTrip : Trip = ref({})
    const toastInfo = ref({isOpen : false, message: ''})

    return {
      currentTrip, toastInfo
    }
  },
  methods: {
    shareSocial() {
      return shareSocial
    },
    informationCircle() {
      return informationCircle
    },
    async showShareAlert(tripId: string) {
      const alert = await alertController.create({
        header: 'Partage du trajet',
        buttons: [
          {
            text: 'Annuler',
            cssClass: 'alert-button-cancel',
          },
          {
            text: 'Partager',
            cssClass: 'alert-button-confirm',
            handler: (data) => this.shareTrip(tripId, data)
          },
        ],
        inputs: [{
          placeholder: 'Email du récepteur',
          cssClass: 'trajet-input',
          name: 'userEmail',
          type: 'email'
        }]
      });
      await alert.present()
    },
    shareTrip(tripId: string, data){
      if (!data.userEmail || data.userEmail.trim() === '') {
        this.toastInfo.message = "Veuillez saisir l'email du récepteur"
        this.toastInfo.isOpen = true
        return false
      }
      shareTrip(tripId, data.userEmail).then((res) => {
        if(res.status == 200) {
          this.toastInfo.message = `Le trajet a été partagé avec ${data.userEmail}`
          this.toastInfo.isOpen = true
        }
      })
    },
  }
})
</script>

<template>
  <ion-page>
    <ion-split-pane content-id="main-content">
      <side-menu :email="currentUser.email" :lastname="currentUser.lastName"
                 :firstname="currentUser.firstName" />
      <ion-content id="content" :fullscreen="true">
        <ion-header :translucent="true">
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-menu-button></ion-menu-button>
              <ion-back-button default-href="/trips"></ion-back-button>
            </ion-buttons>
            <ion-buttons slot="end">
              <ion-button class="logout-button" @click="showShareAlert(tripId)">
                <ion-icon slot="start" aria-hidden="true" :ios="shareSocial()" :md="shareSocial()"></ion-icon>
                Partager</ion-button>
            </ion-buttons>
            <ion-title>Details du trajet "{{currentTrip.pathName}}"</ion-title>
          </ion-toolbar>
        </ion-header>
        <div id="map" style="height: 100vh;"></div>
      </ion-content>
    </ion-split-pane>

    <ion-toast :is-open="toastInfo.isOpen" :message="toastInfo.message" :icon="informationCircle()"
               :duration="2000" @didDismiss="toastInfo.isOpen=false" class="toast-info"></ion-toast>
  </ion-page>
</template>

<style scoped>
#map {
  height: 100%;
  width: 100%;
}
</style>