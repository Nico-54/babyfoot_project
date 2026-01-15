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
              <h3 class="text-2xl font-bold">Nouvelle équipe</h3>
              <p class="text-sm text-gray-400">
                Créez une équipe et ajoutez ses membres
              </p>
            </div>
          </div>

          <UDivider />
        </div>
      </template>

      <!-- FORM -->
      <UForm
        :state="state"
        @submit="onSubmit"
        class="space-y-8"
      >
        <!-- NOM -->
        <UFieldGroup
          label="Nom de l'équipe"
          name="name"
          help="ex: Les Gladiateurs"
        >
          <UInput
            v-model="state.name"
            icon="mdi-light:trophy"
            placeholder="Nom de l'équipe"
            size="lg"
            autofocus
          />
        </UFieldGroup>

        <!-- MEMBRES -->
        <UFieldGroup label="Membres de l'équipe" help="Ajoutez les noms des joueurs">
          <div class="space-y-3">
            <div 
              v-for="(member, index) in state.members" 
              :key="index" 
              class="flex gap-2 animate-in fade-in slide-in-from-left-2"
            >
              <UInput
                v-model="state.members[index]"
                placeholder="Nom du joueur"
                icon="mdi-light:account"
                class="flex-1"
                size="lg"
              />
              
              <UButton
                v-if="state.members.length > 1"
                icon="i-heroicons-trash"
                color="error"
                variant="ghost"
                @click="removeMember(index)"
              />
            </div>

            <UButton
              icon="i-heroicons-plus"
              label="Ajouter un joueur"
              variant="soft"
              color="primary"
              block
              class="mt-2"
              @click="addMember"
            />
          </div>
        </UFieldGroup>

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
            Enregistrer l'équipe
          </UButton>
        </div>

      </UForm>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { useAuthStore } from '../../stores/useAuth'
definePageMeta({
  middleware: 'auth' as any,
  role: 'ADMIN'
})

const authStore = useAuthStore();
const toast = useToast();
const loading = ref(false);

// State initial avec un membre vide
const state = reactive({
  name: '',
  members: [''] 
});

// Ajouter un nouveau champ de saisie
const addMember = () => {
  state.members.push('');
};

// Supprimer un champ spécifique
const removeMember = (index: number) => {
  state.members.splice(index, 1);
};

const onSubmit = async () => {
  // Validation de base
  if (!state.name.trim()) {
    toast.add({ title: 'Erreur', description: 'Le nom de l\'équipe est requis', color: 'error' });
    return;
  }

  // Nettoyage : On retire les membres vides (espaces blancs compris)
  const cleanedMembers = state.members.filter(m => m.trim() !== '');

  if (cleanedMembers.length === 0) {
    toast.add({ title: 'Erreur', description: 'L\'équipe doit avoir au moins un membre', color: 'error' });
    return;
  }

  loading.value = true;

  try {
    await $fetch('http://localhost:5000/api/teams/createTeam', {
      method: 'POST',
      body: {
        name: state.name,
        members: cleanedMembers // Envoi du tableau propre à ton backend Prisma
      },
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });

    // Reset du formulaire
    state.name = '';
    state.members = [''];

    toast.add({
      title: 'Équipe créée !',
      description: 'L\'équipe a été enregistrée avec succès',
      color: 'success',
      icon: 'mdi-light:check-circle'
    });

  } catch (err: any) {
    console.error('Erreur creation équipe:', err);
    toast.add({
      title: 'Erreur !',
      description: err.data?.message || 'Impossible de créer l\'équipe',
      color: 'error',
      icon: 'mdi-light:alert-octagon'
    });
  } finally {
    loading.value = false;
  }
};

// TODO: Ajouter une limite maximum au nombre de membre d'une équipe
</script>