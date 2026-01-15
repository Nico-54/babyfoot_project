import { Request, Response } from 'express'
import { userSchema, type UserPublic } from '../../models/user.model'
import bcrypt from 'bcrypt'
import prisma from '../../lib/prisma'             
import { Prisma } from '@prisma/client'
import jwt from 'jsonwebtoken'

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
                role: 'ADMIN'
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
        console.error("Détail de l'erreur 500 :", error);
        return res.status(500).json({ message: "Erreur lors de la création "})
    }
}

// Méthode de connexion
export const login = async (req: Request, res: Response) => {
    try {
        // Vérification existance utilisateur
        const { email, password } = req.body

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            return res.status(401).json({ message: "Identifiants invalides" })
        }

        // Vérification hash mot de passe
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return res.status(401).json({ message: "Identifiants invalides" })
        }

        // Génération du JWT
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '24h' } // expire après un jour
        )

        // Réponse succès
        return res.status(200).json({ message: "Connexion réussie", user: { id: user.id, name: user.name, email: user.email, role: user.role}, token })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Erreur serveur" })
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