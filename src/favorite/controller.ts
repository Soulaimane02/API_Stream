import express, { Request, Response } from 'express';
import { IFavoriteProprieties, SchemaBodyFavorite } from './model';
import { SerieMethodDb } from "../series/repository"; 
import { MovieMethodDb } from '../movies/repository'
import { UserMethodDb } from '../users/repository';
import IFavoriteController, { FavoriteModelBb } from './repository';

export async function getAll(req: Request, res: Response) 
{
    try
    {
        const allFavorite = await IFavoriteController.getAll();
        if(!allFavorite)
        {
            return res.status(404).json({message: "Favorites Not Found"});
        }
        return res.status(200).json({allFavorite});
    }
    catch(error)
    {
        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
}

export async function getById(req: Request, res: Response) 
{
    try
    {
        const oneFavorite = await IFavoriteController.getById(req.params.id_favorite);
        if(!oneFavorite)
        {
            return res.status(200).json({message: "Favorite Not Found"});
        }
        return res.status(200).json({oneFavorite});
    }
    catch(error)
    {
        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
}

export async function deleteById(req: Request, res: Response) 
{
    try
    {
        await IFavoriteController.deleteById(req.params.id_favorite);
        return res.status(200).json({message: "Serie delete"});
    }
    catch(error)
    {
        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
}

export async function addFavorite(req: Request, res: Response) 
{
    try 
    {
        const body_favorite = req.body;
        const { error, value } = SchemaBodyFavorite.validate(body_favorite);
        if (error)
        {
            return res.status(400).json({ error: error.details[0].message });
        }

        const ref_movie = value.ref_movie;
        const ref_serie = value.ref_serie;
        const ref_user = value.ref_user;

        if (ref_movie) 
        {
            const alreadyMovieExist = await FavoriteModelBb.findOne({ ref_movie, ref_user });
            if (alreadyMovieExist) {
                return res.status(400).json({ error: "Le film est déjà dans vos favoris" });
            }
        }

        if (ref_serie) 
        {
            const alreadySerieExist = await FavoriteModelBb.findOne({ ref_serie, ref_user });
            if (alreadySerieExist) {
                return res.status(400).json({ error: "La série est déjà dans vos favoris" });
            }
        }

        const ref_users = await UserMethodDb.findById(ref_user);
        if (!ref_users) {
            return res.status(404).json({ error: "L'utilisateur n'existe pas (L'ID)." });
        }

        const newFavorite: IFavoriteProprieties = 
        {
            ref_movie: value.ref_movie,
            ref_serie: value.ref_serie ,
            ref_user: value.ref_user,
            date_created: value.date_created || new Date() 
        };

        const addedFavorite = await IFavoriteController.addFavorite(newFavorite);
        return res.status(200).json({ addedFavorite });
    } 
    catch (error) 
    {
        //console.error("Message c : ", error);
        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
}



export async function editFavorite(req: Request, res: Response) 
{
    try
    {
        const idFavorite = req.params.id_favorite;
        const body_favorite = req.body;
        const { error, value } = SchemaBodyFavorite.validate(body_favorite);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        
       

        //const ref_movie = await MovieMethodDb.findById(value.ref_movie);
        //const ref_serie = await SerieMethodDb.findById(value.ref_serie);
        const ref_user = await UserMethodDb.findById(value.ref_user);

        if (!ref_user) {
            return res.status(404).json({ error: "Le film, la série ou l'utilisateur n'existe pas (L'ID)." });
        }

        const existingEpisode = await IFavoriteController.getById(idFavorite);
        if (!existingEpisode) {
            return res.status(404).json({ error: "Épisode non trouvé." });
        }

        const setFavortie: IFavoriteProprieties = 
        {
            ref_movie: value.ref_movie,
            ref_serie: value.ref_serie,
            ref_user: value.ref_user,
            date_created: value.date_created
        };

        
        const updatedFavorite = await IFavoriteController.editFavorite(idFavorite, setFavortie);
        return res.status(200).json({ updatedFavorite });

    } catch (error) 
    {
        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
}