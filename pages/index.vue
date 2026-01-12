<template>
  <UContainer class="py-10">
    <header class="text-center mb-12">
      <div class="flex justify-center mb-4">
        <UAvatar
          src="https://em-content.zobj.net/source/microsoft-teams/363/soccer-ball_26bd.png"
          alt="Ballon"
          size="xl"
        />
      </div>
      <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
        Babyfoot <span class="text-primary-500">Pro Manager</span>
      </h1>
      <p class="mt-4 text-lg text-gray-500">
        Prêt pour la revanche ? Gérez vos scores et dominez le classement.
      </p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      <UCard @click="navigateTo('/tournament/new')" class="cursor-pointer hover:ring-2 hover:ring-primary-500 transition">
        <div class="flex items-center space-x-4">
          <UIcon name="i-heroicons-trophy" class="w-10 h-10 text-yellow-500" />
          <div>
            <h3 class="text-xl font-bold">Nouveau Tournoi</h3>
            <p class="text-gray-500 text-sm">Créez une compétition et inscrivez les joueurs.</p>
          </div>
        </div>
      </UCard>

      <UCard @click="navigateTo('/leaderboard')" class="cursor-pointer hover:ring-2 hover:ring-primary-500 transition">
        <div class="flex items-center space-x-4">
          <UIcon name="i-heroicons-chart-bar" class="w-10 h-10 text-blue-500" />
          <div>
            <h3 class="text-xl font-bold">Classement Général</h3>
            <p class="text-gray-500 text-sm">Découvrez qui est le véritable roi de la table.</p>
          </div>
        </div>
      </UCard>
    </div>

    <UCard color="gray">
      <div class="flex justify-between items-center">
        <div class="text-center">
          <p class="text-xs uppercase text-gray-400 font-bold">Dernier Match</p>
          <div class="flex items-center space-x-4 mt-2">
            <span class="font-bold">Team Alpha</span>
            <span class="bg-gray-800 text-white px-3 py-1 rounded text-xl font-mono">10 - 8</span>
            <span class="font-bold text-gray-400">Team Bravo</span>
          </div>
        </div>
        <UButton color="primary" variant="ghost" icon="i-heroicons-chevron-right-20-solid">
          Tous les matchs
        </UButton>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
// On peut ajouter ici une fonction pour naviguer vers d'autres pages plus tard
const navigateTo = (path: string) => {
  console.log('Navigation vers :', path)
  // useNuxtApp().$router.push(path)
}
</script>