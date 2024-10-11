<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
        <ion-buttons slot="end">
          <ion-button class="logout-button" @click="logout()"
            ><ion-icon slot="start" aria-hidden="true" :ios="exit" :md="exit"></ion-icon>
            Logout</ion-button
          >
        </ion-buttons>
        <ion-title>GéoLocalisation</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content id="content" fixed-slot-placement="before">
      <ion-list id="trip-positions" v-if="positions.length > 0">
        <ion-list-header>
          <ion-label>{{positions.length}} Positions capturées </ion-label>
        </ion-list-header>
        <ion-item class="pos-list-item" v-for="(position, index) in positions" :key="index">
          <ion-label>
            <h3>
              Lat: {{ position.latitude }}, Lon:
              {{ position.longitude }}
            </h3>
            <p>
              {{ position.address }}
            </p>
          </ion-label>
        </ion-item>
      </ion-list>
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button id="new-trip">
          <ion-icon :icon="add" v-show="!recordingTrip" ></ion-icon>
          <ion-spinner name="circular" v-if="recordingTrip"></ion-spinner>
        </ion-fab-button>
        <ion-fab-list side="top">
          <ion-fab-button :class="[readytoSend() ? '' : 'disabled-fab-button']"
                          :disabled="!readytoSend()" id="send-button" title="Envoyer ce trajet">
            <ion-icon :icon="navigateCircle"></ion-icon>
          </ion-fab-button>
          <ion-fab-button id="start-button" v-show ="!recordingTrip">
            <ion-icon :icon="locate" title="Lancer un trajet"></ion-icon>
          </ion-fab-button>

          <ion-fab-button v-show ="recordingTrip" id="stop-button">
            <ion-icon :icon="stopCircle" title="Arrêter ce trajet"></ion-icon>
          </ion-fab-button>
        </ion-fab-list>
      </ion-fab>
      <ion-alert
          class="start-trip-alert"
          trigger="start-button"
          :animated=true
          :backdrop-dismiss=false
          header="Nouveau trajet"
          :buttons="[
              {
                text: 'Quitter',
                cssClass: 'alert-button-cancel',
              },
              {
                text: 'Lancer',
                cssClass: 'alert-button-confirm',
                handler: startTrip
              },
            ]"
          :inputs="[{
            placeholder: 'Nom du trajet',
            cssClass : 'trajet-input',
            name: 'tripName',
            min: 5,
            handler: (data) => {
              console.log('Valeur saisie :', data.inputField);
              this.tripName = data.inputField;
            }
          }]"
      ></ion-alert>
      <ion-alert
          class="stop-trip-alert"
          trigger="stop-button"
          :animated=true
          :backdrop-dismiss=false
          header="Arrêter le trajet en cours?"
          :buttons="[
              {
                text: 'Non',
                cssClass: 'alert-button-cancel',
              },
              {
                text: 'Oui',
                cssClass: 'alert-button-confirm',
                handler: stopTrip
              },
            ]"
      ></ion-alert>
      <ion-alert
          class="send-trip-alert"
          trigger="send-button"
          :animated=true
          :header= "`Sauvegarder ${positions.length} positions recupérées?`"
          :buttons="[
              {
                text: 'Supprimer',
                cssClass: 'alert-button-cancel',
                handler: resetPositions
              },
              {
                text: 'Envoyer',
                cssClass: 'alert-button-confirm',
                handler: sendTrip
              },
            ]"
      ></ion-alert>
      <ion-toast :is-open="toastInfo.isOpen" :message="toastInfo.message" :icon="informationCircle"
                 :duration="2000" @didDismiss="toastInfo.isOpen=false" class="toast-info"></ion-toast>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import router from "@/router";
import {reverseGeocode, saveTrip} from "@/services/api";
import {getCurrentUser, logoutUser} from "@/services/user";
import { Geolocation } from "@capacitor/geolocation";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonLabel,
  IonItem,
  IonIcon,
  IonList,
  IonToast,
  IonAlert,
  IonFab,
  IonFabButton,
  IonFabList,
  IonMenu,
  IonMenuButton, createAnimation,
} from "@ionic/vue";
import {defineComponent, ref} from "vue";
import {
  add, exit, informationCircle, locate, navigateCircle, stopCircle
} from "ionicons/icons";
import {User} from "@/services/models";

export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonLabel,
    IonItem,
    IonIcon,
    IonList,
    IonToast,
    IonAlert,
    IonFab,
    IonFabButton,
    IonFabList,
    IonMenu,
    IonMenuButton,
  },
  async ionViewDidEnter() {

    const user = await getCurrentUser()
    this.currentUser = JSON.parse(user.value)

  },
  setup() {
    const positions = ref([] as any[]);
    const toastInfo = ref({isOpen : false, message: ''})
    const recordingTrip = ref(false)

    return { positions, toastInfo, recordingTrip,
      exit, add, navigateCircle, stopCircle, informationCircle, locate};
  },
  methods: {
    async getCurrentPosition() {
      const pos = await Geolocation.getCurrentPosition();
      reverseGeocode(pos.coords.latitude, pos.coords.longitude).then((result) => {
        this.positions.push({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          address: result,
        });
      });
    },

    async startTrip(data){
      if (!data.tripName || data.tripName.trim() === '') {
        this.toastInfo.message = "Veuillez saisir le nom du trajet"
        this.toastInfo.isOpen = true
        return false
      }

      this.resetPositions()

      this.tripName = data.tripName
      this.recordingTrip = true

      setInterval(() => {
        if(!this.recordingTrip)
          return
        this.getCurrentPosition()
      }, 5000)
    },

    resetPositions(){
      if(this.positions.length > 0){
        this.positions.splice(0);
      }
    },

    stopTrip(){
      this.recordingTrip = false
    },

    async sendTrip() {
      //send positions to server
      const response = await saveTrip(this.currentUser.userId, this.tripName, this.positions.map(pos => {
        return {latitude: pos.latitude, longitude: pos.longitude}
      }))

      this.toastInfo.message = `"Le trajet ${response.data.tripId} a été enregistré avec succès"`
      this.toastInfo.isOpen = true

      this.resetPositions()
    },

    logout() {
      logoutUser();
      router.replace("/login");
    },
    readytoSend() {
      return !this.recordingTrip && this.positions.length > 0
    }
  },
  data() {
    return {
      tripName: "",
      currentUser : {} as User
    };
  },
});
</script>



<style>

.pos-list-item p{
  color: var(--gris-sombre);
}

.pos-list-item{
  --background: var(--noir);
}

.pos-list-item h3 {
  color: var(--secondaire);
}

#trip-positions{
  background-color: var(--noir);
}

.disabled-fab-button{
  --background: var(--gris-sombre);
}

.logout-button {
  --background: transparent;
  --color: var(--primaire);
}

.logout-button:hover {
  --background: var(--primaire);
  --color: var(--blanc);
}

#new-trip {
  --background: var(--secondaire);
  --border-radius: 15px;
  --box-shadow: 0px 1px 5px 0px var(--noir);
  --color: var(--noir);
  margin-bottom: var(--ion-safe-area-bottom, 0);
  margin-top: var(--ion-safe-area-top, 0);
}

ion-fab-list ion-fab-button{
  --background: var(--accent);
  --border-radius: 15px;
  --box-shadow: 0px 1px 5px 0px var(--noir);
  --color: var(--noir);
}

#stop-button:disabled{
  --background: var(--gris-sombre);
}

.start-trip-alert, .stop-trip-alert, .send-trip-alert{
  --background: var(--noir);
}

button.alert-button.alert-button-confirm {
  color: var(--primaire);
}

button.alert-button.alert-button-cancel {
  color: var(--gris-sombre);
}

input.alert-input.trajet-input:focus{
  border-color: var(--accent);
}

ion-toast.toast-info {
  --background: var(--noir);
  --box-shadow: 3px 3px 10px 0 var(--noir);
  --color: var(--blanc);
}
</style>
