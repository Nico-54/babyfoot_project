<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

// Etat pour basculer entre Login et Inscription
const isSignUp = ref(false);

// Champs dynamiques
const fields = computed(() => {
    // Champs de base : Toujours présents
    const baseFileds = [
        { name: 'email', type: 'email', label: 'Email'},
        { name: 'password', type: 'password', label: 'Mot de passe'},
    ]

    if (isSignUp.value) {
        return [
            { name: 'name', type: 'text', label: 'Prénom' },
            ...baseFileds,
        ]
    }

    return baseFileds
})

// Schema réactif
const schema = computed(() => {
    const base = {
        email: z.string().email('Email invalide'),
        password: z.string().min(8, 'Il doit contenir au moins 8 caractères'),
    }

    // En mode inscription
    if (isSignUp.value) {
        return z.object({
            name: z.string().min(1, 'Le prénom est requis'),
            ...base
        })
    }

    return z.object(base)
})

// z.infer pour suivre les changements du schéma
type Schema = z.infer<typeof schema>

function onSubmit(payload: FormSubmitEvent<Schema>) {
    // A retirer en prod
    if (isSignUp.value) {
        console.log('Inscription avec :', payload)
    } else {
        console.log('Connexion avec :', payload)
    }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
        <UAuthForm
            :schema="schema"
            icon="i-lucide-user"
            :title="isSignUp ? 'Créer un compte' : 'Connexion'"
            :description="isSignUp ? 'Rejoignez la ligue de Babyfoot !' : 'Heureux de vous revoir !'"
            :fields="fields"
            :submit-label="isSignUp ? 'S\'inscrire' : 'Se connecter'"
            @submit="onSubmit"
        >
            <template #footer>
                <div class="flex items-center gap-2 mt-4">
                    <UCheckbox v-model="isSignUp" label="Je n'ai pas encore de compte" />
                </div>
            </template>
        </UAuthForm>
    </UPageCard>
  </div>
</template>

