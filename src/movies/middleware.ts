import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from '../auth/middlewareAdmin';
import { MovieSchema } from './model';
import IMovieRepositoryForController from './repository';

export async function validateMovieData(req: Request, res: Response, next: NextFunction) {
    const { error, value } = MovieSchema.validate(req.body);
    
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    req.body = value;
    next();
}

export async function checkMovieExists(req: Request, res: Response, next: NextFunction) {
    const movieId = req.params.id_movie;
    const movie = await IMovieRepositoryForController.getById(movieId);
    
    if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
    }
    next();
}
