import { Request, Response } from 'express'
import { tournamentSchema } from '../../models/tournament.model'
import prisma from '../../lib/prisma'             

// Méthode de création d'un tournoi
export const registerTournament = async (req: Request, res: Response) => {
    // Validation Zod
    const result = tournamentSchema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten().fieldErrors })
    }

    const validatedData = result.data
    const user = (req as any).user

    // Enregistrement Prisma
    try {
        const newTournament = await prisma.tournament.create({
            data : { 
                name: validatedData.name,
                date: new Date(validatedData.date), // Conversion si ton schéma Prisma utilise DateTime
                time: validatedData.time,
                localisation: validatedData.localisation,
                creatorId: user.userId,
             }
        })

        return res.status(201).json(newTournament)
    } catch(error: unknown) {
        console.error("Détail de l'erreur 500 :", error);
        return res.status(500).json({ message: "Erreur lors de la création" })
    }
}

// Méthode pour récupérer tous les tournois
export const allTournament = async (req:Request, res: Response) => {
    try {
        // Récupération et conversion des paramètres
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        // Calcul combien d'enregistrement passer
        const skip = (page - 1) * limit;

        const [tournaments, total] = await Promise.all([
            prisma.tournament.findMany({
                skip: skip,
                take: limit,
                orderBy: { createdAt: 'desc' } // Du dernier créer au premier
            }),
            prisma.tournament.count()
        ]);

        return res.status(200).json({
            data: tournaments,
            pagination: {
                total,
                page,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error: unknown) {
        console.error("Détails de l'erreur 500 :", error)
        return res.status(500).json({ message: "Erreur lors de la récupération" })
    }
}