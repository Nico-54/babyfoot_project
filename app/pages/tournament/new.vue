<template>
  <UContainer class="py-20 max-w-2xl">
    <UCard class="border border-white/10 shadow-xl backdrop-blur p-6 sm:p-8">

      <!-- HEADER -->
      <template #header>
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <div class="bg-primary/10 text-primary p-3 rounded-lg">
              <UIcon name="mdi-light:trophy" class="text-3xl" />
            </div>

            <div>
              <h3 class="text-2xl font-bold">Nouveau tournoi</h3>
              <p class="text-sm text-gray-400">
                Renseignez les informations du tournoi
              </p>
            </div>
          </div>

          <UDivider />
        </div>
      </template>

      <!-- FORM -->
      <UForm
        :schema="tournamentSchema"
        :state="state"
        @submit="onSubmit"
        class="space-y-8"
      >
        <!-- NOM -->
        <UFieldGroup
          label="Nom du tournoi"
          name="name"
          help="Ce nom sera visible par tous les participants"
        >
          <UInput
            v-model="state.name"
            icon="mdi-light:trophy"
            placeholder="Summer Cup 2024"
            size="lg"
            autofocus
          />
        </UFieldGroup>

        <!-- DATE / HEURE -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/5 p-4 rounded-lg">
          <UFieldGroup label="Date" name="date">
            <UInput
              v-model="state.date"
              type="date"
              icon="mdi-light:calendar"
              size="lg"
            />
          </UFieldGroup>

          <UFieldGroup label="Heure" name="time">
            <UInput
              v-model="state.time"
              type="time"
              icon="mdi-light:clock"
              size="lg"
            />
          </UFieldGroup>
        </div>

        <!-- LIEU -->
        <UFieldGroup
          label="Lieu"
          name="localisation"
          help="Adresse ou nom du lieu du tournoi"
        >
          <UInput
            v-model="state.localisation"
            icon="mdi-light:map-marker"
            placeholder="Gymnase municipal, Paris"
            size="lg"
            class="font-medium"
          />
        </UFieldGroup>

        <!-- DESCRIPTION -->
         <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/5 p-4 rounded-lg">
          <UFieldGroup
            label="Description"
            name="description"
            help="Description du tournoi"
          >
            <UTextarea
              v-model="state.localisation"
              icon="mdi-light:pencil"
              placeholder="Tournoi d'entrainement"
              size="lg"
              class="font-medium"
            />
          </UFieldGroup>
        </div>

        <!-- ACTION -->
        <div class="pt-6">
          <UButton
            type="submit"
            block
            size="xl"
            color="primary"
            icon="mdi-light:content-save"
            :loading="loading"
            class="transition-transform hover:scale-[1.01] active:scale-[0.98]"
          >
            Créer le tournoi
          </UButton>
        </div>

      </UForm>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
// Import
import { tournamentSchema } from '../../utils/tournament';
  
const authStore = useAuthStore();
const toast = useToast();
const loading = ref(false)

const state = reactive({
  name: '',
  date: '',
  time: '',
  localisation: '',
  description: '',
});

const onSubmit = async (event: any) => {
  loading.value = true
  try {
    await $fetch('http://localhost:5000/api/tournaments/createTournament', {
      method: 'POST',
      body: event.data,
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    // Nettoyage des champs et affichage d'un message de réussite
    Object.assign(state, {
      name: '',
      date: '',
      time: '',
      localisation: '',
      description: ''
    })

    toast.add({
      title: 'Tournoi créé !',
      description: 'Le tournoi a été créé avec succès',
      color: 'success',
      icon: 'mdi-light:check-circle'
    })

  } catch (err) {
    console.error('Erreur creation:', err)

    toast.add({
      title: 'Erreur !',
      description: 'Une erreur est survenue à la création',
      color: 'error',
      icon: 'mdi-light:alert-octagon'
    })
  } finally {
    loading.value = false
  }
};
</script>