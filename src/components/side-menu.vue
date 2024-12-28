<template>
  <ion-menu content-id="main-content" type="overlay">
    <ion-content>
      <ion-list id="inbox-list">
        <ion-list-header>{{ firstname }} {{ lastname }}</ion-list-header>
        <ion-note>{{ email }}</ion-note>

        <ion-menu-toggle
            :auto-hide="false"
            v-for="(p, i) in appPages"
            :key="i"
        >
          <ion-item
              @click="selectedIndex = i"
              router-direction="root"
              :router-link="p.url"
              lines="none"
              :detail="false"
              class="hydrated"
              :class="{ selected: selectedIndex == i }"
          >
            <ion-icon
                aria-hidden="true"
                slot="start"
                :ios="p.iosIcon"
                :md="p.mdIcon"
            ></ion-icon>
            <ion-label>{{ p.title }}</ion-label>
          </ion-item>
        </ion-menu-toggle>
      </ion-list>
    </ion-content>
    <ion-footer>
      <ion-label> Version 1.1.0 </ion-label>
    </ion-footer>
  </ion-menu>
</template>


<script setup lang="ts">
import {onMounted, ref} from "vue";
import {listOutline, listSharp, locationOutline, locationSharp, settingsOutline, settingsSharp} from "ionicons/icons";
import {
  IonIcon,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from "@ionic/vue";
import router from "@/router";


const selectedIndex = ref(0);
const appPages = [
  {
    title: "Liste des trajets",
    url: "/trips",
    iosIcon: listOutline,
    mdIcon: listSharp,
  },
  {
    title: "Ajouter un trajet",
    url: "/geolocation",
    iosIcon: locationOutline,
    mdIcon: locationSharp,
  },
  {
    title: "Paramètres",
    url: "/settings",
    iosIcon: settingsOutline,
    mdIcon: settingsSharp,
  },
];

onMounted(async () => {
  const path = router.currentRoute.value.path
  console.log(router.currentRoute.value.path);
  if (path !== '') {
    selectedIndex.value = appPages.findIndex(
        (page) => page.url.toLowerCase() == path.toLowerCase()
    );
  }
})
</script>

<script lang="ts">
export default {
  props: {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  }
}
</script>


<style scoped>
ion-menu ion-content {
  --background: var(--noir);
}

ion-menu.md ion-content {
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}

ion-menu.md ion-list {
  padding: 20px 0;
}

ion-menu.md ion-note {
  margin-bottom: 30px;
}

ion-menu.md ion-list-header,
ion-menu.md ion-note {
  padding-left: 10px;
}

ion-menu.md ion-list#inbox-list {
  border-bottom: 1px solid var(--ion-background-color-step-150, #d7d8da);
}

ion-menu.md ion-list#inbox-list ion-list-header {
  font-size: 22px;
  font-weight: 600;
  color: var(--blanc);
  min-height: 20px;
}

ion-menu.md ion-item {
  --padding-start: 10px;
  --padding-end: 10px;
  border-radius: 4px;
  color: var(--blanc);
  --background: transparent;
}

ion-menu.md ion-item.selected {
  --background: var(--primaire);
}

ion-menu.md ion-item ion-icon {
  color: var(--blanc);
}

ion-menu.md ion-item ion-label {
  font-weight: 500;
}

ion-menu.ios ion-content {
  --padding-bottom: 20px;
}

ion-menu.ios ion-list {
  padding: 20px 0 0 0;
}

ion-menu.ios ion-note {
  line-height: 24px;
  margin-bottom: 20px;
}

ion-menu.ios ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 50px;
}

ion-menu.ios ion-item.selected ion-icon {
  color: var(--noir);
}

ion-menu.ios ion-item ion-icon {
  font-size: 24px;
  color: var(--blanc);
}

ion-menu.ios ion-list-header,
ion-menu.ios ion-note {
  padding-left: 16px;
  padding-right: 16px;
}

ion-menu.ios ion-note {
  margin-bottom: 8px;
}

ion-note {
  display: inline-block;
  font-size: 16px;

  color: var(--blanc);
}
ion-list {
  background: transparent;
}

ion-footer {
  background: var(--noir);
  color: var(--blanc);
  padding: 4px;
  text-align: center;
}
</style>