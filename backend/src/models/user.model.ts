import { z } from 'zod'

// Schéma pour la validation
export const userSchema = z.object({
    name: z.string().trim().min(1, "Prénom manquant"),
    email: z.string().trim().email("Email invalide"),
    password: z.string().trim().min(8, "8 caractères minimum"),
    role: z.string().default('PLAYER')
})

export type User = z.infer<typeof userSchema>

export interface UserDocument extends User {
    id: string
    createdAt: Date
}