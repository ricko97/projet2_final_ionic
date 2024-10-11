<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/login"></ion-back-button>
        </ion-buttons>
        <ion-title>Sign Up</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content id="content">
      <div id="container">
        <ion-label class="label">Créer un compte</ion-label>
        <ion-input
          label="Prénom"
          label-placement="floating"
          fill="outline"
          placeholder="Quel est votre prénom"
          v-model="data.firstName"
        ></ion-input>
        <ion-input
          label="Nom"
          label-placement="floating"
          fill="outline"
          placeholder="Quel est votre nom"
          v-model="data.lastName"
        ></ion-input>
        <ion-input
          label="Email"
          label-placement="floating"
          fill="outline"
          placeholder="Inscrivez votre courriel"
          v-model="data.email"
          type="email"
        ></ion-input>
        <ion-input
          label="Mot de passe"
          label-placement="floating"
          fill="outline"
          placeholder="Ajoutez votre mot de passe"
          v-model="data.password"
          type="password"
        ></ion-input>
        <ion-button
          style="width: 100%"
          class="signupButton"
          expand="full"
          @click="handleSignup()"
          >Inscrivez-vous</ion-button
        >
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonButton,
  IonLabel,
  IonInput,
  alertController,
  loadingController,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { signupAction } from "@/services/api";
import router from "@/router";

export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonButtons,
    IonButton,
    IonLabel,
    IonInput,
  },
  setup() {

    return {
    };
  },
  methods: {
    async handleSignup() {
      console.log(this.data);
      signupAction(this.data)
        .then(async () => {
          const loading = await loadingController.create({
            message: "Compte crée avec succès...",
            duration: 1500,
          });
          await loading.present().then(() => {
            router.replace("/login");
          });

        })
        .catch(async (error) => {
          const alert = await alertController.create({
            header: "Erreur lors de l'enregistrement",
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
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      },
    };
  },
});
</script>

<style scoped>
.label {
  font-size: xx-large;
}

.signupButton::part(native) {
  border-radius: 50px;
  background-color: white;
  color: var(--primaire);
  font-weight: bold;
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
</style>
