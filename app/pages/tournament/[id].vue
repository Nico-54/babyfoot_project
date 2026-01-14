<template>
  <UContainer class="py-10">
    <UButton to="/tournament/all" icon="mdi-light:arrow-left" variant="ghost" class="mb-6">
      Retour aux tournois
    </UButton>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-2 space-y-8">
        <section>
          <h1 class="text-4xl font-extrabold mb-4">{{ tournament?.name }}</h1>
          <div class="flex gap-2 mb-6">
            <UBadge color="primary" variant="subtle">Ouvert aux inscriptions</UBadge>
            <UBadge color="info" variant="subtle">Format : Élimination directe</UBadge>
          </div>
          <p class="text-gray-300 leading-relaxed">
            Bienvenue au tournoi {{ tournament?.name }}. Préparez vos équipements et 
            affrontez les meilleurs joueurs de la région. 
          </p>
        </section>

        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="font-bold">Participants inscrits</h3>
              <span class="text-sm text-gray-400">{{ tournament?.countsPlayer }} joueurs</span>
            </div>
          </template>
          
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div v-for="i in 6" :key="i" class="flex items-center gap-2 p-2 bg-white/5 rounded">
              <UAvatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" size="sm" />
              <span class="text-sm font-medium">Player_{{ i }}</span>
            </div>
          </div>
        </UCard>
      </div>

      <div class="space-y-6">
        <UCard class="sticky top-24 border-primary/30">
          <div class="space-y-6">
            <div class="space-y-4 text-sm">
              <div class="flex items-center gap-3">
                <UIcon name="mdi-light:calendar" class="text-primary text-xl" />
                <div>
                  <p class="font-bold text-gray-200">Date & Heure</p>
                  <p class="text-gray-400" v-if="tournament?.date && tournament?.time">
                    {{ new Date(tournament.date).toLocaleDateString() }} à {{ tournament?.time }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <UIcon name="mdi-light:map-marker" class="text-primary text-xl" />
                <div>
                  <p class="font-bold text-gray-200">Localisation</p>
                  <p class="text-gray-400">{{ tournament?.localisation }}</p>
                </div>
              </div>
            </div>

            <UDivider />

            <template v-if="authStore.user?.role === 'PLAYER'">
                <UButton 
                block 
                size="xl" 
                color="primary" 
                :label="isRegistered ? 'Se désincrire' : 'S\'inscrire maintenant'" 
                icon="mdi-light:check-circle"
                @click="handleRegister"
                />
                
                <p class="text-center text-[10px] text-gray-500 uppercase tracking-widest">
                Fin des inscriptions dans 2 jours
                </p>
            </template>
          </div>
        </UCard>
      </div>

    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { useAuthStore } from '../../stores/useAuth'

// Store
const authStore = useAuthStore();

// Notifications
const toast = useToast();

const route = useRoute();

// Boolean d'inscription de l'utilsateur
const isRegistered = ref(false);

// Interface
interface Tournament {
    name: string,
    date: string,
    time: string,
    localisation: string,
    countsPlayer: string,
}

// Récupération des informations du tournoi grâce à l'ID
// Récupération de l'id du tournoi
const tournamentId = route.params.id;
const { data: tournament, error } = await useFetch<Tournament>(`http://localhost:5000/api/tournaments/info/${tournamentId}`, {
    key: `tournament-${tournamentId}`
});
if (error.value) {
  toast.add({
    title: 'Erreur !',
    description: 'Impossible de récupérer les informations du tournoi',
    color: 'error',
    icon: 'mdi-light:alert-octagon'
  });
}

// Fonction d'inscription au tournoi
const handleRegister = async () => {
    /* 
      Pensez à vérifier si on a isRegistered
      Si oui alors on appel la route de désincription
      Sinon la route de connexion
    */
   
  // Récupération de l'id du tournoi
  const tournamentId = route.params.id;

  // Si l'utilisateur n'est pas inscrit au tournoi
  if (!isRegistered.value) {

    try {
      const response = await $fetch<any>(`http://localhost:5000/api/tournaments/registerTournament/${tournamentId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      if (tournament.value) {
        tournament.value.countsPlayer = response.totalInscrits;
        console.info(tournament.value);
      }
      toast.add({
        title: 'Inscription réussie !',
        description: 'Vous êtes bien inscrit pour le tournoi',
        color: 'success',
        icon: 'mdi-light:check-circle'
      });

    } catch (err) {
      toast.add({
        title: 'Erreur !',
        description: 'Une erreur est survenue lors de votre inscription',
        color: 'error',
        icon: 'mdi-light:alert-octagon'
      });
    }
  } else {
        try {
      const response = await $fetch<any>(`http://localhost:5000/api/tournaments/retiredTournament/${tournamentId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      if (tournament.value) {
        tournament.value.countsPlayer = response.totalInscrits;
        console.info(tournament.value);
      }
      toast.add({
        title: 'Inscription retirée !',
        description: 'Vous êtes désincrit pour le tournoi',
        color: 'success',
        icon: 'mdi-light:check-circle'
      });

    } catch (err) {
      toast.add({
        title: 'Erreur !',
        description: 'Une erreur est survenue lors de votre désinscription',
        color: 'error',
        icon: 'mdi-light:alert-octagon'
      });
    }
  }
};

// Fonction de vérification
const checkStatus = async () => {
  if (!authStore.isAuthenticated) return;

  const tournamentId = route.params.id 

  // Requête permettant de vérifier 
  // si l'utilisateur est incrit au tournoi ou non
  const data = await $fetch<any>(`http://localhost:5000/api/tournaments/${tournamentId}/check-status`, {
    headers: {
      Authorization: `Bearer ${authStore.token}`
    }
  });

  isRegistered.value = data.registered;
}

onMounted(() => {
  if (authStore.token) {
    checkStatus();
  }
})
</script>