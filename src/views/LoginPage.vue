
<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonLabel,
  IonInput,
  IonIcon,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { loginAction } from "@/services/api";
import { setCurrentUser } from "@/services/user";

import { alertController, loadingController } from "@ionic/vue";
import router from "@/router";

export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton,
    IonLabel,
    IonInput,
    IonIcon,
  },
  setup() {
    const router = useRouter();

    return { router };
  },
  methods: {
    async login() {
      loginAction(this.data)
        .then(async (response) => {
          const loading = await loadingController.create({
            message: "Connexion réussie...",
            duration: 1500,
          });
          loading.present().then(async () => {
            await setCurrentUser(response.data);
            await router.replace("/geolocation");
          });

        })
        .catch(async (error: any) => {
          const alert = await alertController.create({
            header: "Connexion échouée",
            message: error.response.data.error,
            buttons: ["OK"],
          });
          await alert.present();
        });
    },
  },
  data() {
    return {
      data: {
        email: "",
        password: "",
      },
    };
  },
});
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title size="large">Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content id="content">
      <div id="container">
        <ion-label class="label">Se connecter</ion-label>
        <ion-input
            label="Email"
            label-placement="floating"
            placeholder="Email address"
            v-model="data.email"
            fill="outline"
        ></ion-input>
        <ion-input
            label="Mot de passe"
            label-placement="floating"
            fill="outline"
            placeholder="Mot de passe"
            type="password"
            v-model="data.password"
        ></ion-input>

        <div id="buttons">
          <ion-button expand="full" @click="login()" class="login-button">
            <div class="login-text">Se connecter</div>
            <ion-icon name="log-in-outline"></ion-icon>
          </ion-button>
          <ion-button expand="full" class="signup-button" router-link="/signup">
            <div class="signup-text">Créer un compte</div>
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.logo {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 70px;
  height: auto;
}

.label {
  font-size: xx-large;
}

#buttons {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
}

#container {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 5%;
  margin-right: 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 20px;
  padding: 30px;
  border: 2px solid var(--secondaire);
  border-radius: 25px;
  background-color: var(--blanc);
  color: var(--noir);
}

.login-button::part(native) {
  border-radius: 50px;
  background-color: white;
  color: var(--primaire);
  font-weight: bold;
}

.signup-button::part(native) {
  border-radius: 50px;
  background-color: var(--primaire);
  color: var(--blanc);
  font-weight: bold;
}
</style>
