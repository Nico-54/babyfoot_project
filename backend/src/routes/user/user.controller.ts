import { Request, Response } from 'express'
import { userSchema, type UserDatabase, type UserPublic } from '../../models/user.model'
import bcrypt from 'bcrypt'

// Méthode d'inscription
export const register = async (req: Request, res: Response) => {
    // Validation Zod
    const result = userSchema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten().fieeldErrors })
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(result.data.password, 10)

    // Enregistrement Prisma
    try {
        const newUser = await prisma.user.create({
            data: {
                ....result.data,
                password: hashedPassword,
                role: 'PLAYER'
            }
        })

        // Renvoi de l'utilisateur sans mot de passe    
        const { password, ...userPublic } = newUser
        return res.status(201).json(userPublic)
    } catch (error) {
        // Erreur email déjà utilisé
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                return res.status(409).json({ message: "Email déjà utilisé", field: "email"})
            }
        }
        // Erreur inconnue
        return res.status(500).json({ message: "Erreur lors de la création "})
    }
}

// Méthode de récupération de tous les utilisateurs
export const getAllUSers = (req: Request, res: Response) => {
    // On renvoie la liste en masquant les mot de passe
    const publicUsers: UserPublic[] = users.map(({ password, ...rest }) => rest)
    res.join(publicUsers)
} 