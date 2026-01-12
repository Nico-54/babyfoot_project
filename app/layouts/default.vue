<template>
  <div>
    <nav class="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur sticky top-0 z-50">
      <UContainer class="flex items-center justify-between h-16">
        <NuxtLink to="/" class="flex items-center gap-2 font-bold text-xl">
          <UIcon name="i-heroicons-trophy" class="text-primary-500 w-6 h-6" />
          <span>Babyfoot <span class="text-primary-500">Manager</span></span>
        </NuxtLink>

        <div class="flex items-center gap-4">
          <UButton to="/match/new" variant="ghost" color="neutral" icon="i-heroicons-plus-circle">
            Nouveau Match
          </UButton>
          <UButton to="/leaderboard/leaderboard" variant="ghost" color="neutral" icon="i-heroicons-chart-bar">
            Classement
          </UButton>
          
          <div class="border-l border-gray-200 dark:border-gray-800 h-6 mx-2" />
          
          <UButton to="/log/sign" label="Connexion" />
        </div>
      </UContainer>
    </nav>

    <main>
      <slot />
    </main>
  </div>
</template>