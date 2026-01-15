<template>
    <UContainer class="py-10">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <h1 class="text-3xl font-bold">Equipes</h1>
            <p class="text-gray-400">
                Retrouvez toutes les équipes
            </p>
        </div>

        <UButton
            to="/team/create-team"
            icon="mdi-light:plus"
            label="Créer une équipe"
            color="primary"
        />

        <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <USkeleton v-for="i in 3" :key="i" class="h-48 w-full" />
        </div>

        <div v-else-if="teams?.data?.length" class="space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <UCard
                    v-for="team in teams.data"
                    :key="team.id"
                    class="hover:ring-2 hover:ring-primary transition-all group"
                >
                <!-- NOM EQUIPE -->
                    <div class="space-y-4">
                        <div class="flex justify-between items-start">
                            <h3 class="font-bold text-xl group-hover:text-primary transition-colors">
                                {{ team.name }}
                            </h3>
                        </div>

                        <div class="space-y-2 text-sm text-gray-400">
                            <!-- MEMBRES -->
                            <div class="flex items-center gap-2">
                                <UIcon name="mdi-light:account-group" />
                                <span>{{ team.members.join(', ') }}</span>
                            </div>
                        </div>
                    </div>
                </UCard>
            </div>

            <!-- NAVIGATION -->
            <div class="flex justify-center mt-10">
                <UPagination
                    v-model="page"
                    :page-count="limit"
                    :total="teams?.pagination?.total || 0"
                    show-last
                    show-first
                />
            </div>
        </div>

        <div v-else class="text-center py-20 border-2 border-dashed border-white/10 rounded-xl">
            <UIcon name="mdi-light:trophy" class="text-5xl text-gray-600 mb-4" />
            <p>Aucune équipe trouvée pour le moment</p>
        </div>
    </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth' as any,
  role: 'ADMIN'
})

const page = ref(1);
const limit = 10;

// Interface
interface Team {
  id: string
  name: string
  members: string[]
}

interface TeamResponse {
  data: Team[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// Récupération des tournois
const { data: teams, pending, refresh } = await useFetch<TeamResponse>('http://localhost:5000/api/teams/', {
    params: {
        page: page,
        limit: limit
    },
    watch: [page] // Rafraichir automatique

});

// TODO: Pouvoir modifier ou supprimer une équipe
// TODO: Pouvoir trier l'affichage
// TODO: Ajouter le détail d'une équipe avec ses derniers scores et/ou derniers tournois
</script>