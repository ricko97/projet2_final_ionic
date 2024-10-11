<script lang="ts">

import {IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from "@ionic/vue";
import {defineComponent} from "vue";
import {add, playCircle, radio} from "ionicons/icons";

export default defineComponent({
  methods: {
    radio() {
      return radio
    },
    playCircle() {
      return playCircle
    }
  },
  components: {
    IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar
  },
  setup(){
    return {add}
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
        <ion-title>Liste des Trajets</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content id="content" >
      <ion-tabs>
        <ion-tab tab="home">
          <div id="home-page">
            <ion-header>
              <ion-toolbar>
                <ion-title>Listen now</ion-title>
              </ion-toolbar>
            </ion-header>
            <ion-content>
              <div class="example-content">Listen now content</div>
            </ion-content>
          </div>
        </ion-tab>
        <ion-tab tab="radio">
          <div id="radio-page">
            <ion-header>
              <ion-toolbar>
                <ion-title>Radio</ion-title>
              </ion-toolbar>
            </ion-header>
            <ion-content>
              <div class="example-content">Radio content</div>
            </ion-content>
          </div>
        </ion-tab>
        <ion-tab tab="library">
          <div id="library-page">
            <ion-header>
              <ion-toolbar>
                <ion-title>Library</ion-title>
              </ion-toolbar>
            </ion-header>
            <ion-content>
              <div class="example-content">Library content</div>
            </ion-content>
          </div>
        </ion-tab>
        <ion-tab tab="search">
          <div id="search-page">
            <ion-header>
              <ion-toolbar>
                <ion-title>Search</ion-title>
              </ion-toolbar>
            </ion-header>
            <ion-content>
              <div class="example-content">Search content</div>
            </ion-content>
          </div>
        </ion-tab>

        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="home">
            <ion-icon :icon="playCircle()" />
            Listen Now
          </ion-tab-button>
          <ion-tab-button tab="radio">
            <ion-icon :icon="radio()" />
            Radio
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-content>
  </ion-page>
</template>

<style scoped>

</style>