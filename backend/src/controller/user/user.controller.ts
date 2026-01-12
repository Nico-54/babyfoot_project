import { Request, Response } from 'express'
import { userSchema, type UserPublic } from '../../models/user.model'
import bcrypt from 'bcrypt'
import prisma from '../../lib/prisma'             
import { Prisma } from '@prisma/client'

// Méthode d'inscription
export const register = async (req: Request, res: Response) => {
    // Validation Zod
    const result = userSchema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten().fieldErrors })
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(result.data.password, 10)

    // Enregistrement Prisma
    try {
        const newUser = await prisma.user.create({
            data: {
                ...result.data,
                password: hashedPassword,
                role: 'PLAYER'
            }
        })

        // Renvoi de l'utilisateur sans mot de passe    
        const { password, ...userPublic } = newUser
        return res.status(201).json(userPublic)

    } catch (error: unknown) {
        // Erreur email déjà utilisé
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            const prismaError = error as Prisma.PrismaClientKnownRequestError;
            if (prismaError.code === 'P2002') {
                return res.status(409).json({ message: "Email déjà utilisé", field: "email"})
            }
        }
        // Erreur inconnue
        return res.status(500).json({ message: "Erreur lors de la création "})
    }
}

// Méthode de récupération de tous les utilisateurs
export const getAllUSers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany()
        
        const publicUsers: UserPublic[] = users.map(({ ...rest }) => rest)
        return res.status(200).json(publicUsers)
    } catch (error) {
        return res.status(500).json({ message: "Impossible de récupérer les utilisateurs" })
    }
} 