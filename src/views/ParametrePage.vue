<script lang="ts">
import {IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from "@ionic/vue";
import {defineComponent} from "vue";

export default defineComponent({
  components: {
    IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar
  },
  setup(){

  },
  ionViewDidEnter(){

  }
})
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Paramètres</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content id="content" :fullscreen="true">

    </ion-content>
  </ion-page>
</template>

<style scoped>

</style>