<template>
    <UContainer class="py-10">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <h1 class="text-3xl font-bold">Tournois</h1>
            <p class="text-gray-400">
                Découvrez tous les tournois
            </p>
        </div>

        <template v-if="authStore.user?.role === 'ADMIN'">
            <UButton
                to="/tournament/new"
                icon="mdi-light:plus"
                label="Créer un tournoi"
                color="primary"
            />
        </template>

        <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <USkeleton v-for="i in 3" :key="i" class="h-48 w-ful" />
        </div>

        <div v-else-if="tournaments?.data?.length" class="space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <UCard
                    v-for="tournament in tournaments.data"
                    :key="tournament.id"
                    class="hover:ring-2 hover:ring-primary transition-all group"
                >
                    <div class="space-y-4">
                        <div class="flex justify-between items-start">
                            <h3 class="fon-bold text-xl group-hover:text-primary transition-colors">
                                {{ tournament.name }}
                            </h3>
                            <UBadge color="primary" variant="soft">A venir</UBadge>
                        </div>

                        <div class="space-y-2 text-sm text-gray-400">
                            <!-- DATE -->
                            <div class="flex items-center gap-2">
                                <UIcon name="mdi-light:calendar" />
                                <span>{{ new Date(tournament.date).toLocaleDateString() }}</span>
                            </div>
                            <!-- HEURE -->
                            <div class="flex items-center gap-2">
                                <UIcon name="mdi-light:clock" />
                                <span>{{ tournament.time }}</span>
                            </div>
                            <!-- LIEU -->
                            <div class="flex items-center gap-2">
                                <UIcon name="mdi-light:map-marker" />
                                <span>{{ tournament.localisation }}</span>
                            </div>
                        </div>

                        <UButton label="Voir les détails" block variant="ghost" :to="`/tournaments/${tournament.id}`"></UButton>
                    </div>
                </UCard>
            </div>

            <!-- NAVIGATION -->
            <div class="flex justify-center mt-10">
                <UPagination
                    v-model="page"
                    :page-count="limit"
                    :total="tournaments?.pagination?.total || 0"
                    show-last
                    show-first
                />
            </div>
        </div>

        <div v-else class="text-center py-20 border-2 border-dashed border-white/10 rounded-xl">
            <UIcon name="mdi-light:trophy" class="text-5xl text-gray-600 mb-4" />
            <p>Aucun tournoi trouvé pour le moment</p>
        </div>
    </UContainer>
</template>

<script setup lang="ts">
import { useAuthStore } from '../../stores/useAuth';

const authStore = useAuthStore();
const page = ref(1);
const limit = 10;

// Interface
interface Tournament {
  id: string
  name: string
  date: string
  time: string
  localisation: string
}

interface TournamentResponse {
  data: Tournament[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// Récupération des tournois
const { data: tournaments, pending, refresh } = await useFetch<TournamentResponse>('http://localhost:5000/api/tournaments/', {
    params: {
        page: page,
        limit: limit
    },
    watch: [page] // Rafraichir automatique
});
</script>