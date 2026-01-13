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
        <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
            <template #footer>
                <div class="flex items-center gap-2 mt-4">
                    <UCheckbox v-model="isSignUp" label="Je n'ai pas encore de compte" />
                </div>
            </template>
        </UAuthForm>
    </UPageCard>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
// Import Store
import { useAuthStore } from '~/stores/auth';

// Etat pour basculer entre Login et Inscription
const isSignUp = ref(false);

// Message d'erreur
const errorMessage = ref('')

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

// Interface qui décris le format de retour de l'api
interface LoginResponse {
    message: string
    token: string
    user: string
    email: string
    id: string
    name: string
    role: string 
}

async function onSubmit(payload: FormSubmitEvent<any>) {
    errorMessage.value = ''

    if (isSignUp.value) {
        // Extraction des données
        const bodyData = payload.data as Record<string, any>

        console.log('Inscription avec :', payload.data)
        const { data, error } = await useFetch('http://localhost:5000/api/users/register', {
            method: 'POST',
            body: bodyData,
            onResponseError({ response }) {
                if (response.status === 409) {
                    errorMessage.value = "Email déjà utilisé"
                } else if (response.status === 400) {
                    errorMessage.value = "Une erreur est survenue"
                }
            }
        })

        if (data.value) {
            // Inscription réussie
            isSignUp.value = !isSignUp.value
        }

    } else {
        console.log('Connexion avec :', payload.data)
        // Extraction des données
        const bodyData = payload.data as Record<string, any>

        const { data, error } = await useFetch<LoginResponse>('http://localhost:5000/api/users/login', {
            method: 'POST',
            body: bodyData,
            onResponseError({ response }) {
                if (response.status === 401) {
                    errorMessage.value = "Identiants Invalides"
                } else if (response.status === 500) {
                    errorMessage.value = "Une erreur est survenue"
                }
            }
        })

        if (data.value) {
            // Connexion réussie
            // Store
            const authStore = useAuthStore()
            
            // Extraction des données
            const { user, token } = data.value

            // Enregistrement dans le store
            authStore.setUser(user, token)
            
            navigateTo('/')
        }

    }
}
</script>