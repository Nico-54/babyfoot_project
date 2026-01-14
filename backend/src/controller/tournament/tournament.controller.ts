import { Request, Response } from 'express'
import { tournamentSchema } from '../../models/tournament.model'
import prisma from '../../lib/prisma'             
import { connect } from 'node:http2'

// Méthode de création d'un tournoi
export const createTournament = async (req: Request, res: Response) => {
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
                description: validatedData.description,
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

// Méthode de récupération 
export const tournamentInfo = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        
        const tournamentInfo = await prisma.tournament.findUnique({
            where: {
                id
            },
            include: {
                _count: { select: { players: true } }
            },
        });

        
        if (!tournamentInfo) {
            return res.status(404).json({ message: "Tournoi non trouvé" });
        }


        return res.status(200).json(tournamentInfo);
    } catch (error: unknown) {
        console.error("Détail de l'erreur 500 :", error);
        return res.status(500).json({ message: "Erreur lors de la récupération "})
    }
}

// Méthode pour s'inscrire à un tournoi
export const registerTournament = async (req: Request, res: Response) => {
    try{

        // Récupération de l'id du tournoi
        const { tournamentId } = req.params;

        // Récupération de l'id de l'utilisateur
        // Récupérable ainsi puisqu'il provient du token
        const userId = (req as any).user.userId;

        // Vérification de la présence des données
        if (!tournamentId || !userId) {
            return res.status(400).json({ message: "Données manquantes" });
        }

        // Mise à jour du tournoi en rajoutant l'utilisateur
        const updatedTournament = await prisma.tournament.update({
            where: {
                id: tournamentId,
            },
            data: {
                players: {
                    // connect permet à Prisma de créer le lien
                    connect: { id: userId },
                },
            },
            include: {
                _count: { select: { players: true } }
            }
        });

        return res.status(200).json({
            message: "Inscription réussie",
            totalInscrits: updatedTournament._count.players
        });

    } catch (error: unknown) {
        console.log(error);

        if (error instanceof Error) {
        console.log(error.message);
        };
    }
}

// Méthode pour se retirer d'un tournoi
export const retiredTournament = async (req: Request, res: Response) => {
    try{

        // Récupération de l'id du tournoi
        const { tournamentId } = req.params;

        // Récupération de l'id de l'utilisateur
        // Récupérable ainsi puisqu'il provient du token
        const userId = (req as any).user.userId;

        // Vérification de la présence des données
        if (!tournamentId || !userId) {
            return res.status(400).json({ message: "Données manquantes" });
        }

        // Mise à jour du tournoi en rajoutant l'utilisateur
        const updatedTournament = await prisma.tournament.update({
            where: {
                id: tournamentId,
            },
            data: {
                players: {
                    // disconnect permet à Prisma de créer le lien
                    disconnect: { id: userId },
                },
            },
            include: {
                _count: { select: { players: true } }
            }
        });

        return res.status(200).json({
            message: "Inscription réussie",
            totalInscrits: updatedTournament._count.players
        });

    } catch (error: unknown) {
        console.log(error);

        if (error instanceof Error) {
        console.log(error.message);
        };
    }
}

// Méthode vérifiant si l'utilisateur est inscrit au tournoi ou non
export const checkUserTournament = async (req: Request, res: Response) => {
    try {

        // Récupération de l'id de tournoi
        const tournamentId = req.params.tournamentId;

        // Récupération de l'id de l'utilisateur
        const userId = (req as any).user.userId;


        const isRegistered = await prisma.tournament.findFirst({
            where: {
                id: tournamentId,
                players: {
                    some: {
                        id: userId
                    }
                }
            }
        });

        // Retourne un booléen pour le front
        return res.status(200).json({ registered: !!isRegistered});
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la vérification' });
    }
}