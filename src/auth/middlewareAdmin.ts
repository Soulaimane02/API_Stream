import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

// ChatGPT
dotenv.config();
const secretKey = process.env.SECRET_KEY as string; // caster directement avec le as !

// Étendre l'interface Request pour inclure la propriété `user`
export interface AuthenticatedRequest extends Request {
    user?: {
        _id: string;
        isAdmin?: boolean;
        sous_compte?: number;
    };
}

// Middleware pour authentifier l'utilisateur avec JWT
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Access Denied: No Token Provided' });
    }

    try {
        const decoded = jwt.verify(token, secretKey) as { _id: string; isAdmin?: boolean };
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(400).json({ error: 'Invalid Token' });
    }
}


export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    if (req.user && req.user.isAdmin) {
        return next();
    }
    return res.status(403).json({ error: 'Access Denied: Admins Only' });
}

export async function requireSelfOrAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const userId = req.params.id_user;
    
    const sousCompteParam = Number(req.params.sous_compte); // conversion en nombre
    
    // Vérifier si l'utilisateur est l'admin, le propriétaire de ce compte, ou si c'est un sous-compte du même compte
    if ( req.user && (req.user._id === userId || req.user.isAdmin || (req.user.sous_compte && req.user.sous_compte === sousCompteParam))) 
    {
        return next();
    }

    return res.status(403).json({ error: 'Access Denied: Unauthorized Action' });
}

