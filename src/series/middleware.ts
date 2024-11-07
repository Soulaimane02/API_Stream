// middleware.ts
import { Request, Response, NextFunction } from "express";
import { SerieSchema } from './model';
import ISeriesController from './repository';

// Middleware pour valider les données de la série (BON c'est ChatGPT) 
export async function validateSerieData(req: Request, res: Response, next: NextFunction) {
    const { error, value } = SerieSchema.validate(req.body);
    
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    req.body = value;
    next();
}

export async function checkSerieExists(req: Request, res: Response, next: NextFunction) {
    const serieId = req.params.id_serie;
    const serie = await ISeriesController.getById(serieId);
    
    if (!serie) {
        return res.status(404).json({ error: "Serie not found" });
    }
    next();
}
