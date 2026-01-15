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
            <UBadge color="info" variant="subtle">Format : Equipe</UBadge>
          </div>
          <p class="text-gray-300 leading-relaxed">
            {{ tournament?.description || 'Aucune description fournie.' }}
          </p>
        </section>

        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="font-bold">Equipes engagées</h3>
              <span class="text-sm text-gray-400">{{ tournament?.teams?.length || 0 }} équipes</span>
            </div>
          </template>
          
          <div v-if="tournament?.teams?.length" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="team in tournament.teams" :key="team.id" class="flex flex-col p-4 bg-white/5 border border-white/10 rounded-lg hover:border-primary/50 transition-colors">
              <div class="flex items-center gap-3 mb-2">
                <UAvatar :alt="team.name" size="sm" background="bg-primary/20" />
                <span class="font-bold text-primary">{{ team.name }}</span>
              </div>
              <p class="text-[11px] text-gray-500 italic">
                Joueurs : {{ team.members.join(', ') }}
              </p>
            </div>
          </div>
          <div v-else class="text-center py-6 text-gray-500 italic text-sm">
            Aucune équipe n'est encore inscrite à ce tournoi.
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

            <template v-if="authStore.user?.role === 'ADMIN'">
              <UButton 
                block 
                size="xl" 
                color="primary" 
                label="Gérer les équipes" 
                icon="mdi-light:account-group"
                @click="openTeamManager"
              />
              <p class="text-center text-[10px] text-gray-500 uppercase">
                Panel Administrateur
              </p>
            </template>

            <template v-if="authStore.user?.role === 'PLAYER'">
                <UButton 
                block 
                size="xl" 
                color="primary" 
                :label="isRegistered ? 'Se désincrire' : 'S\'inscrire maintenant'" 
                icon="mdi-light:check-circle"
                @click="handleRegister"
                />
            </template>
          </div>
        </UCard>
      </div>
    </div>

    <ClientOnly>
      <UModal v-model="isTeamModalOpen">
        <UCard v-if="isTeamModalOpen" :ui="{ divide: 'divide-y divide-gray-800' }">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-bold">Inscrire des équipes</h3>
              <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isTeamModalOpen = false" />
            </div>
          </template>

          <div class="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div v-if="loadingTeams" class="flex justify-center py-10">
              <UIcon name="i-heroicons-arrow-path" class="animate-spin text-3xl text-primary" />
            </div>
            
            <div v-else-if="allTeams.length === 0" class="text-center py-10 text-gray-400">
              Aucune équipe créée.
            </div>

            <div 
              v-else
              v-for="team in allTeams" 
              :key="team.id"
              class="flex items-center justify-between p-3 rounded-lg border border-transparent hover:bg-white/5 cursor-pointer transition-all"
              :class="{ 'bg-primary/10 border-primary/20': selectedTeamIds.includes(team.id) }"
              @click="toggleTeam(team.id)"
            >
              <div class="flex items-center gap-3">
                <UCheckbox :model-value="selectedTeamIds.includes(team.id)" @click.prevent.stop/>
                <div>
                    <p class="font-medium text-sm">{{ team.name }}</p>
                    <p class="text-[10px] text-gray-400">{{ team.members.length }} joueurs</p>
                </div>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
                <UButton color="neutral" variant="soft" label="Annuler" @click="isTeamModalOpen = false" />
                <UButton color="primary" label="Confirmer" :loading="savingTeams" @click="saveTeamsSelection" />
            </div>
          </template>
        </UCard>
      </UModal>
    </ClientOnly>
  </UContainer>
</template>

<script setup lang="ts">
import { useAuthStore } from '../../stores/useAuth'
definePageMeta({
  middleware: 'auth' as any,
  role: 'ADMIN'
})

// Store
const authStore = useAuthStore();

// Notifications
const toast = useToast();

const route = useRoute();

// ETATS
// Boolean d'inscription de l'utilsateur
const isRegistered = ref(false);
const isTeamModalOpen = ref(false);
const allTeams = ref<any[]>([]);
const selectedTeamIds = ref<string[]>([]);
const loadingTeams = ref(false);
const savingTeams = ref(false);

// Interface
interface Tournament {
    name: string,
    date: string,
    time: string,
    localisation: string,
    description: string,
    countsPlayer: string,
    teams: Team[]
}
interface Team {
  id: string,
  name: string,
  members: [],
}

// Récupération des informations du tournoi grâce à l'ID
// Récupération de l'id du tournoi
const tournamentId = route.params.id;
const { data: tournament, error, refresh } = await useFetch<Tournament>(`http://localhost:5000/api/tournaments/info/${tournamentId}`, {
    key: `tournament-${tournamentId}`
});
if (error.value) {
  toast.add({
    title: 'Erreur !',
    description: 'Impossible de récupérer les informations du tournoi',
    color: 'error',
    icon: 'mdi-light:alert-octagon'
  });
};

// Gestion équipes (ADMIN)
const openTeamManager = async () => {
  isTeamModalOpen.value = true;
  loadingTeams.value = true;
  try{
    const response = await $fetch<any>('http://localhost:5000/api/teams/');
    console.log('response :', response)
    console.log('response.data :', response.data)
    allTeams.value = response.data;

    // On pré-sélectionne les équipes déjà présentes dans le tournoi
    selectedTeamIds.value = tournament.value?.teams?.map(t=> t.id) || [];
  } catch (err) {
    toast.add({
      title: 'Erreur !',
      description: 'Impossible de charger les équipes',
      color: 'error',
      icon: 'mdi-light:alert-octagon'
    })
  } finally {
    loadingTeams.value = false;
  }
}

// Rendre la ligne de l'équipe clickable
const toggleTeam = (id: string) => {
  const index = selectedTeamIds.value.indexOf(id);

  if (index > -1) {
    selectedTeamIds.value.splice(index, 1);
  } else {
    selectedTeamIds.value.push(id);
  } 
}

// Fonction de sauvegarde des équipes
const saveTeamsSelection = async () => {
  savingTeams.value = true;
  try {
    await $fetch(`http://localhost:5000/api/tournaments/${tournamentId}/add-teams`, {
      method: 'POST',
      body: { teamsIds: selectedTeamIds.value },
      headers: { Authorization: `Bearer ${authStore.token}`}
    });

    toast.add({
      title: 'Succès !',
      description: 'Liste des équipes mise à jour',
      color: 'success',
      icon: 'mdi-light:check-circle'
    });

    isTeamModalOpen.value = false;
    await refresh();
  } catch (err) {
    toast.add({
      title: 'Erreur !',
      description: 'Erreur lors de l\'enregistrement',
      color: 'error',
      icon: 'mdi-light:alert-octagon'
    })
  } finally {
    savingTeams.value = false;
  }
}

// Fonction d'inscription au tournoi
// Version PLAYER CONNECTE
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

// TODO: Ajouter un état "started" au tournoi
// TODO: Générer les matchs en round-robin lors du lancement
// TODO: Bloquer l'ajout d'équipes une fois le tournoi lancé
// TODO: Calculer le classement à partir des résultats des matchs
// TODO: Ajouter une interface de saisie des scores
// TODO: Mettre à jour le classement en temps réel

</script>