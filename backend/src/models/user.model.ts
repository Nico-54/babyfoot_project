import { z } from 'zod'

// Schéma pour la validation
export const userSchema = z.object({
    name: z.string().trim().min(1, "Prénom manquant"),
    email: z.string().trim().email("Email invalide"),
    password: z.string().trim().min(8, "8 caractères minimum"),
    role: z.string().optional()
})

export type User = z.infer<typeof userSchema>

export type UserPublic = {
  id: string
  name: string
  email: string
  role: string
  createdAt: Date
  // On n'inclut PAS le password ici
}