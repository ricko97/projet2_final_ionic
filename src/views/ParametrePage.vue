<script lang="ts">
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonMenuButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonButton, IonIcon, IonToast
} from "@ionic/vue";
import { defineComponent, ref, onMounted } from "vue";
import { updateUser, changePassword } from "@/services/api";
import {getCurrentUser, logoutUser, setCurrentUser} from "@/services/user";
import {exit, informationCircle} from "ionicons/icons";
import router from "@/router";
import SideMenu from "@/components/side-menu.vue";
import {User} from "@/services/models";

export default defineComponent({
  methods: {
    informationCircle() {
      return informationCircle
    },
    logout() {
      logoutUser();
      router.replace("/login");
    }
  },
  components: {
    IonToast,
    SideMenu,
    IonIcon,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonMenuButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonItem,
    IonLabel,
    IonInput,
    IonButton
  },
  async ionViewDidEnter() {

    const user = await getCurrentUser()
    this.currentUser = JSON.parse(user.value)

  },
  data() {
    return {
      currentUser : {} as User
    };
  },
  setup() {

    const user = ref({
      userId: '',
      lastName: '',
      firstName: '',
      email: '',
    });

    const password = ref({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    const isEditable = ref(false);


    const fetchUserData = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser.value) {

          try {
            const parsedUser = JSON.parse(currentUser.value);

            user.value = {
              userId: parsedUser.userId,
              lastName: parsedUser.lastName,
              firstName: parsedUser.firstName,
              email: parsedUser.email,
            };
          } catch (error) {
            console.error("Erreur lors du parsing des données utilisateur :", error);
            user.value = {
              userId: '',
              lastName: '',
              firstName: '',
              email: '',
            };
          }
        } else {
          console.log("Aucune donnée utilisateur trouvée.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur :", error);
      }
    };


    const toggleEditMode = () => {
      isEditable.value = !isEditable.value;
    };


    const saveChanges = async () => {
      if (password.value.newPassword !== password.value.confirmNewPassword) {
        alert("Les mots de passe ne correspondent pas.");
        return;
      }

      try {
        alert("Informations utilisateur mises à jour.")
        await updateUser(user.value.userId, user.value.firstName, user.value.lastName);
        await setCurrentUser({...user.value})


        if (password.value.oldPassword && password.value.newPassword) {
          alert("Mot de passe changé avec succès.");
          await changePassword(user.value.userId, password.value.oldPassword, password.value.newPassword);

        }


        isEditable.value = false;
      } catch (error) {
        alert("Erreur lors de la sauvegarde des modifications :", error);
      }
    };


    onMounted(() => {
      fetchUserData();
    });

    return {
      user,
      password,
      isEditable,
      toggleEditMode,
      saveChanges,
      exit
    };
  }
});
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
            </ion-buttons>
            <ion-buttons slot="end">
              <ion-button class="logout-button" @click="logout()"
              ><ion-icon slot="start" aria-hidden="true" :ios="exit" :md="exit"></ion-icon>
                Logout</ion-button
              >
            </ion-buttons>
            <ion-title>Paramètres</ion-title>
          </ion-toolbar>
        </ion-header>
        <div class="settings-card">
          <ion-card>
            <ion-card-header>
              <ion-card-title>Modifier les informations</ion-card-title>
            </ion-card-header>

            <ion-card-content>
              <ion-item>
                <ion-label class="label" position="stacked">Nom</ion-label>
                <ion-input
                    class="input"
                    v-model="user.lastName"
                    :readonly="!isEditable"
                    placeholder="Votre nom"></ion-input>
              </ion-item>

              <ion-item>
                <ion-label class="label" position="stacked">Prénom</ion-label>
                <ion-input
                    class="input"
                    v-model="user.firstName"
                    :readonly="!isEditable"
                    placeholder="Votre prénom"></ion-input>
              </ion-item>

              <ion-item>
                <ion-label class="label" position="stacked">Email</ion-label>
                <ion-input
                    class="input"
                    :value="user.email"
                    readonly></ion-input>
              </ion-item>

              <ion-item v-if="isEditable">
                <ion-label class="label" position="stacked">Ancien mot de passe</ion-label>
                <ion-input
                    class="input"
                    v-model="password.oldPassword"
                    type="password"
                    placeholder="Ancien mot de passe"></ion-input>
              </ion-item>

              <ion-item v-if="isEditable">
                <ion-label class="label" position="stacked">Nouveau mot de passe</ion-label>
                <ion-input
                    class="input"
                    v-model="password.newPassword"
                    type="password"
                    placeholder="Nouveau mot de passe"></ion-input>
              </ion-item>

              <ion-item v-if="isEditable">
                <ion-label class="label" position="stacked">Réécrire le nouveau mot de passe</ion-label>
                <ion-input
                    class="input"
                    v-model="password.confirmNewPassword"
                    type="password"
                    placeholder="Confirmez le nouveau mot de passe"></ion-input>
              </ion-item>


              <ion-button expand="block" @click="toggleEditMode">
                {{ isEditable ? 'Annuler' : 'Éditer' }}
              </ion-button>

              <ion-button
                  expand="block"
                  v-if="isEditable"
                  @click="saveChanges">Sauvegarder</ion-button>

            </ion-card-content>
          </ion-card>
        </div>
      </ion-content>
    </ion-split-pane>
  </ion-page>

</template>

<style scoped>
.settings-card {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

ion-card {
  width: 100%;
  max-width: 500px;
  border-radius: 15px;
  --background: var(--blanc);
}

ion-item {
  --background: var(--gris-clair);
  margin-bottom: 10px;
}

ion-button {
  --background: var(--accent);
  --border-radius: 10px;
}

ion-card-title {
  font-size: 1.5rem;
  text-align: center;
}

.label {
  color: var(--noir);
}

.input {
  color: var(--noir);
}
</style>