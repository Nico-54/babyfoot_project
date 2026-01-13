import { PrismaClient } from '@prisma/client'

// Debug pour voir si Docker passe bien les variables
console.log("DATABASE_URL est-il défini ?", !!process.env.DATABASE_URL)

// Prisma 7 détecte automatiquement le fichier prisma.config.ts
export const prisma = new PrismaClient()

export default prisma