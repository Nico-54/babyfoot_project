<script setup lang="ts">
const teamA = ref('')
const teamB = ref('')
const scoreA = ref(0)
const scoreB = ref(0)

const saveMatch = () => {
  alert(`Match enregistré : ${teamA.value} ${scoreA.value} - ${scoreB.value} ${teamB.value}`)
}
</script>

<template>
  <UContainer class="py-12 max-w-lg">
    <UCard>
      <template #header>
        <h3 class="text-xl font-bold">Enregistrer un nouveau match</h3>
      </template>

      <div class="space-y-8">
        <div class="flex items-center gap-4">
          <UInput v-model="teamA" placeholder="Équipe A" class="flex-1" />
          <UInput v-model="scoreA" type="number" class="w-20" />
        </div>

        <div class="text-center font-bold text-gray-400 text-2xl italic">VS</div>

        <div class="flex items-center gap-4">
          <UInput v-model="teamB" placeholder="Équipe B" class="flex-1" />
          <UInput v-model="scoreB" type="number" class="w-20" />
        </div>
      </div>

      <template #footer>
        <UButton block color="primary" icon="i-heroicons-check-circle" @click="saveMatch">
          Valider le score
        </UButton>
      </template>
    </UCard>
  </UContainer>
</template>