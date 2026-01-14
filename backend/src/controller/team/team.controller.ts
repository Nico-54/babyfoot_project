import { Request, Response } from 'express'
import prisma from '../../lib/prisma'             

// Méthode de création d'un tournoi
export const createTeam = async (req: Request, res: Response) => {
    const data = req.body
    const user = (req as any).user

    // Enregistrement Prisma
    try {
        const newTournament = await prisma.team.create({
            data : { 
                name: data.name,
                members: data.members,
                creatorId: user.userId,
             }
        })

        return res.status(201).json(newTournament)
    } catch(error: any) {
        if (error.code === 'P2002') {
            return res.status(409).json({ 
                message: "Une équipe avec ce nom existe déjà." 
            });
        }
        console.error("Détail de l'erreur 500 :", error);
        return res.status(500).json({ message: "Erreur lors de la création" })
    }
}

// Méthode pour récupérer tous les tournois
export const allTeam = async (req:Request, res: Response) => {
    try {
        // Récupération et conversion des paramètres
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        // Calcul combien d'enregistrement passer
        const skip = (page - 1) * limit;

        const [teams, total] = await Promise.all([
            prisma.team.findMany({
                skip: skip,
                take: limit,
                orderBy: { createdAt: 'desc' } // Du dernier créer au premier
            }),
            prisma.tournament.count()
        ]);

        return res.status(200).json({
            data: teams,
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
export const teamInfo = async (req: Request, res: Response) => {
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

// Méthode pour inscrire une équipe à un tournoi
export const registerTeamTournament = async (req: Request, res: Response) => {
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

// Méthode pour retirer une équipe d'un tournoi
export const retiredTeamTournament = async (req: Request, res: Response) => {
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