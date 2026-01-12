<script setup lang="ts">
// On simule quelques statistiques pour l'accueil
const stats = [
  { label: 'Matchs joués', value: '42', icon: 'i-heroicons-trophy' },
  { label: 'Joueurs actifs', value: '12', icon: 'i-heroicons-users' },
  { label: 'Buts marqués', value: '384', icon: 'i-heroicons-chart-bar' }
]
</script>

<template>
  <UContainer class="py-12">
    <div class="text-center mb-16">
      <div class="inline-flex items-center justify-center p-3 bg-primary-500/10 rounded-full mb-4">
        <UIcon name="i-heroicons-swatch" class="w-8 h-8 text-primary-500" />
      </div>
      <h1 class="text-5xl font-extrabold tracking-tight mb-4">
        Babyfoot <span class="text-primary-500">Manager</span>
      </h1>
      <p class="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
        L'outil ultime pour organiser vos tournois au bureau, suivre les scores et humilier vos collègues (avec respect).
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <UCard v-for="stat in stats" :key="stat.label" class="text-center">
        <div class="flex flex-col items-center">
          <UIcon :name="stat.icon" class="w-6 h-6 text-gray-400 mb-2" />
          <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">{{ stat.label }}</p>
          <p class="text-3xl font-bold mt-1">{{ stat.value }}</p>
        </div>
      </UCard>
    </div>

    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <UButton
        size="xl"
        icon="i-heroicons-plus-circle"
        label="Nouveau Match"
        color="primary"
        trailing
        to="/match/new"
      />
      <UButton
        size="xl"
        icon="i-heroicons-list-bullet"
        label="Voir le Classement"
        color="neutral"
        variant="subtle"
        to="/leaderboard/leaderboard"
      />
    </div>

    <div class="mt-20">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">Derniers affrontements</h2>
        <UButton variant="ghost" label="Voir tout" icon="i-heroicons-arrow-right" trailing />
      </div>
      
      <UCard variant="soft" class="overflow-hidden">
        <div class="flex items-center justify-between px-4 py-2">
          <div class="flex items-center gap-3">
            <span class="font-bold">Team Marketing</span>
            <UBadge color="success" variant="subtle">WIN</UBadge>
          </div>
          <div class="flex items-center gap-4 bg-neutral-900 text-white px-6 py-2 rounded-lg font-mono text-xl">
            <span>10</span>
            <span class="text-neutral-500">-</span>
            <span>8</span>
          </div>
          <div class="flex items-center gap-3">
            <UBadge color="error" variant="subtle">LOSS</UBadge>
            <span class="font-bold text-gray-400">Team Dev</span>
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>