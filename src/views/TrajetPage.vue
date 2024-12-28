<script lang="ts">

import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonItemSliding, IonItemOptions, IonItemOption,
  IonToolbar, IonRippleEffect,
  IonToast, alertController,
  IonRefresher, IonRefresherContent, RefresherCustomEvent, IonSplitPane,
} from "@ionic/vue";
import {defineComponent, ref} from "vue";
import {
  add, bookmarks, people, person, sadOutline, locationSharp,
  shareSocial, trash, informationCircle, personCircleOutline
} from "ionicons/icons";
import {SharedTrip, Trip, User} from "@/services/models";
import {deleteTrip, getTripsByUserId, shareTrip} from "@/services/api";
import {getCurrentUser} from "@/services/user";
import router from "@/router";
import SideMenu from "@/components/side-menu.vue";

export default defineComponent({

  components: {
    SideMenu,
    IonSplitPane,
    IonItem, IonToast, IonItemSliding, IonItemOptions, IonItemOption,
    IonMenuButton, IonChip, IonLabel, IonRippleEffect,
    IonIcon, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
    IonTabs, IonTab, IonTabBar, IonTabButton, IonList,
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonRefresher, IonRefresherContent
  },
  methods: {
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
      async showDeleteAlert(tripId: string){
        const alert = await alertController.create({
          header: 'Supprimer ce trajet?',
          buttons: [
            {
              text: 'Annuler',
              cssClass: 'alert-button-cancel',
            },
            {
              text: 'Supprimer',
              cssClass: 'alert-button-confirm',
              handler: () => this.deleteTrip(tripId)
            },
          ],
        });
        await alert.present()
      },

      deleteTrip(tripId: string) {

        deleteTrip(this.currentUser.userId, tripId).then((res) => {
          if (res.status == 200) {
            this.toastInfo.message = "Le trajet a été supprimé"
            this.toastInfo.isOpen = true

            this.refreshTrips()
          }

        })
      },
      async refreshTrips(){
        const res = await getTripsByUserId(this.currentUser.userId)

        this.trips = res.data.trips.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        })
        this.sharedTrips = res.data.sharedTrips.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        })
      }
  },
  setup(){
    const trips: Trip[] = ref([])
    const sharedTrips: SharedTrip[] = ref([])
    const toastInfo = ref({isOpen : false, message: ''})

    const handleRefresh = (refreshAction, event: RefresherCustomEvent) => {
      setTimeout(async () => {
        refreshAction()
        await event.target.complete();
      }, 2000);
    };


    return {trips, sharedTrips, router, toastInfo, handleRefresh,
      sadOutline, personCircleOutline, locationSharp,
      add, person, people, bookmarks, shareSocial, trash, informationCircle}
  },
  async ionViewDidEnter() {
    const user = await getCurrentUser()
    this.currentUser = JSON.parse(user.value)

    await this.refreshTrips()
  },
  data(){
    return{
      currentUser : {} as User,
    }
  }
})
</script>

<template>
  <ion-page>
    <ion-split-pane content-id="main-content">
      <side-menu :email="currentUser.email" :lastname="currentUser.lastName"
                 :firstname="currentUser.firstName" />
      <ion-content id="content" >
        <ion-tabs>
          <ion-tab tab="trips">
            <div id="trips-page">
              <ion-header>
                <ion-toolbar>
                  <ion-title>Mes Trajets</ion-title>
                  <ion-buttons slot="start">
                    <ion-menu-button></ion-menu-button>
                  </ion-buttons>
                </ion-toolbar>
              </ion-header>
              <ion-content :fullscreen="true">
                <ion-refresher slot="fixed" @ionRefresh="handleRefresh(refreshTrips,$event)">
                  <ion-refresher-content></ion-refresher-content>
                </ion-refresher>
                <ion-list v-if="trips.length > 0">
                  <ion-item-sliding v-for="(trip, index) in trips" :key="index">
                    <ion-item class="list-item">
                      <ion-card @click="router.push({name: 'Détails Trajet', params: {tripId: trip.tripId}})"
                                class="ion-activatable">
                        <ion-ripple-effect></ion-ripple-effect>
                        <ion-card-header>
                          <ion-card-title>{{trip.pathName}}</ion-card-title>
                          <ion-card-subtitle>{{ `Crée le ${new Date(trip.date).toLocaleString('fr-CA', {
                            timeZone: 'America/New_York',
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}` }}</ion-card-subtitle>
                        </ion-card-header>

                        <ion-card-content >
                          <ion-chip>
                            <ion-icon :icon="locationSharp" color="dark"></ion-icon>
                            <ion-label>{{ `${trip.locations.length} positions enregistrées` }}</ion-label>
                          </ion-chip>
                        </ion-card-content>
                      </ion-card>
                    </ion-item>

                    <ion-item-options side="end">
                      <ion-item-option color="light" @click="showShareAlert(trip.tripId)">
                        <ion-icon slot="icon-only" :icon="shareSocial"></ion-icon>
                        Partager
                      </ion-item-option>
                      <ion-item-option color="danger" @click="showDeleteAlert(trip.tripId)">
                        <ion-icon slot="icon-only" :icon="trash"></ion-icon>
                        Supprimer
                      </ion-item-option>
                    </ion-item-options>
                  </ion-item-sliding>
                </ion-list>
                <div v-else class="center-content">
                  <ion-label class="empty-label">
                    <ion-icon :icon="sadOutline"></ion-icon>
                    Aucun trajet trouvé
                  </ion-label>
                </div>
              </ion-content>
            </div>
          </ion-tab>
          <ion-tab tab="shared-trips">
            <div id="shared-trips-page">
              <ion-header>
                <ion-toolbar>
                  <ion-title>Trajets Partagés</ion-title>
                  <ion-buttons slot="start">
                    <ion-menu-button></ion-menu-button>
                  </ion-buttons>
                </ion-toolbar>
              </ion-header>
              <ion-content :fullscreen="true">
                <ion-refresher slot="fixed" @ionRefresh="handleRefresh(refreshTrips,$event)">
                  <ion-refresher-content></ion-refresher-content>
                </ion-refresher>
                <ion-list v-if="sharedTrips.length > 0">
                  <ion-item-sliding v-for="(trip, index) in sharedTrips" :key="index">
                    <ion-item class="list-item">
                      <ion-card @click="router.push({name: 'Détails Trajet', params: {tripId: trip.tripId}})"
                                class="ion-activatable">
                        <ion-ripple-effect></ion-ripple-effect>
                        <ion-card-header>
                          <ion-card-title>
                            {{trip.pathName}}
                            <ion-chip color="tertiary">
                              <ion-icon :icon="personCircleOutline" color="tertiary"></ion-icon>
                              <ion-label>{{`${trip.firstName} ${trip.lastName}`}}</ion-label>
                            </ion-chip>
                          </ion-card-title>
                          <ion-card-subtitle>{{ `Crée le ${new Date(trip.date).toLocaleString('fr-CA', {
                            timeZone: 'America/New_York',
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}` }}</ion-card-subtitle>
                        </ion-card-header>

                        <ion-card-content >
                          <ion-chip>
                            <ion-icon :icon="locationSharp" color="dark"></ion-icon>
                            <ion-label>{{ `${trip.locations.length} positions enregistrées` }}</ion-label>
                          </ion-chip>
                        </ion-card-content>
                      </ion-card>
                    </ion-item>

                    <ion-item-options side="end">
                      <ion-item-option color="danger" @click="showDeleteAlert(trip.tripId)">
                        <ion-icon slot="icon-only" :icon="trash"></ion-icon>
                        Supprimer
                      </ion-item-option>
                    </ion-item-options>
                  </ion-item-sliding>
                </ion-list>
                <div v-else class="center-content">
                  <ion-label class="empty-label">
                    <ion-icon :icon="sadOutline"></ion-icon>
                    Aucun trajet trouvé
                  </ion-label>
                </div>
              </ion-content>
            </div>
          </ion-tab>


          <ion-tab-bar slot="bottom">
            <ion-tab-button tab="trips">
              <ion-icon :icon="person" />
              Mes Trajets
            </ion-tab-button>
            <ion-tab-button tab="shared-trips">
              <ion-icon :icon="people" />
              Trajets Partagés
            </ion-tab-button>
          </ion-tab-bar>
        </ion-tabs>
      </ion-content>
    </ion-split-pane>

    <ion-toast :is-open="toastInfo.isOpen" :message="toastInfo.message" :icon="informationCircle"
               :duration="2000" @didDismiss="toastInfo.isOpen=false" class="toast-info"></ion-toast>
  </ion-page>
</template>

<style scoped>

ion-tab-bar{
  --background: var(--noir);
}

ion-tab-button{
  --color-selected: var(--primaire);
  --color-focused: var(--primaire);
}

ion-list{
  background-color: transparent;
  --ion-item-border-color: var(--gris-sombre);
}

ion-list ion-item{
  --background: var(--gris-clair);
}

ion-card{
  --background: var(--blanc);
  --color: var(--noir);
  width: 100%;
  position: relative;
  overflow: hidden;
}

ion-card:hover{
  cursor: pointer;
}

ion-card-title{
  --color: var(--secondaire);
  font-weight: bolder;
}

ion-chip{
  --background: var(--noir);
}

ion-item-options {
  height: 80%;
  margin-top: 3%;
}

.empty-label{
  color: var(--noir);
  font-size: large;
}

.center-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

</style>