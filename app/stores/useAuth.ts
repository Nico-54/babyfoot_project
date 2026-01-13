import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: useCookie('auth_user').value || null,
        token: useCookie('auth_token').value || null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
    },

    actions: {
        setUser(userData: any, token: string) {
            this.user = userData
            this.token = token

            // Mise à jour des cookies
            const authCookie = useCookie('auth_token')
            const userCookie = useCookie('auth_user')

            authCookie.value = token
            userCookie.value = userData
        },

        logout() {
            this.user = null
            this.token = null

            const authCookie = useCookie('auth_token')
            const userCookie = useCookie('auth_user')

            authCookie.value = null
            userCookie.value = null
            
            navigateTo('/log/sign')
        }
    }
})