import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Vérifie le token
// Présence et validité
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Récupération token

    if (!token) return res.status(401).json({ message: "Accès refusé, token manquant" });

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any ) => {
        if (err) return res.status(403).json({ message: "Token invalide ou expiré" });
    
        // Ajout de l'utilisateur à la requête
        // Pour éviter de redécoder le token à chaque requête
        // Pourra être utilisé dans les controller si besoin
        (req as any).user = user;
        next();
    })
};

// Vérification du role
// Si admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (user && user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ message: "Accès interdit : privilèges supérieur requis" });
    }
}

// Vérification du role
// Si player
export const isPlayer = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (user && user.role === 'PLAYER') {
        next();
    } else {
        res.status(403).json({ message: "Accès interdit : privilèges requis" });
    }
}