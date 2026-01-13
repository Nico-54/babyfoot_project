import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as any | null,
        token: useCookie('auth_token').value || null,
    }),

    getters: {
        isAuthentificated: (state) => !!state.token,
    },

    actions: {
        setUser(userData: any, token: string) {
            this.user = userData
            this.token = token

            // Mise à jour du cookie
            const authCookie = useCookie('auth_token')
            authCookie.value = token
        },

        logout() {
            this.user = null
            this.token = null
            const authCookie = useCookie('auth_token')
            authCookie.value = null
            navigateTo('/log/sign')
        }
    }
})