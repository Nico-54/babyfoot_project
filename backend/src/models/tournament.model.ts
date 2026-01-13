import { z } from 'zod'

// Schéma pour la validation
export const tournamentSchema = z.object({
    name: z.string().trim().min(1, "Nom du tournoi manquant"),
    date: z.string().min(1, "La date est manquante").regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide"),
    time: z.string().min(1, "L'heure est manquante"),
    localisation: z.string().min(1, 'Lieu manquant')
})

export type Tournament = z.infer<typeof tournamentSchema>