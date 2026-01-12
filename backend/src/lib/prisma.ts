import { PrismaClient } from '@prisma/client'

// Prisma 7 détecte automatiquement le fichier prisma.config.ts
export const prisma = new PrismaClient()

export default prisma