import express, { Request, Response } from 'express';
import { EpisodeSchemaPropriety } from './model';
import IEpisodeController from './repository'; 
import { SerieMethodDb } from "../series/repository"; 
import { SeasonModel } from '../season/repository'

export async function getAll(req: Request, res: Response) 
{
    try 
    {
        const allEpisodes = await IEpisodeController.getAll();
        if (!allEpisodes) {
            return res.status(404).json({ message: "Not found episodes." });
        }
        return res.status(200).json({ allEpisodes });
    } catch (error) 
    {
        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
}

export async function getById(req: Request, res: Response) 
{
    try 
    {
        const oneEpisode = await IEpisodeController.getById(req.params.id_episode);
        if (!oneEpisode) {
            return res.status(404).json({ message: "Not found episode." });
        }
        return res.status(200).json({ oneEpisode });
    } catch (error) 
    {
        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
}


export async function deleteEpisode(req: Request, res: Response) 
{
    try 
    {
        await IEpisodeController.deleteEpisode(req.params.id_episode);
        return res.status(200).json({ message: "Episode Delete" });
    } catch (error) 
    {
        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
}


export async function addEpisode(req: Request, res: Response) 
{
    try 
    {
        const { numero_episode, titre, description, duration, ref_season, ref_series } = req.body;

        const saison = await SeasonModel.findById(ref_season);
        const serie = await SerieMethodDb.findById(ref_series);
        if (!saison || !serie) {
            return res.status(404).json({ error: "La saison ou la série spécifiée n'existe pas." });
        }

        const newEpisode: EpisodeSchemaPropriety = 
        {
            numero_episode,
            titre,
            description,
            duration,
            ref_season,
            ref_series,
            video: "" 
        };

        if (req.files) {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        
            if (files['video'] && files['video'][0]) {
                newEpisode.video = `http://192.0.0.2:3001/uploads/video_serie_episode/${files['video'][0].filename}`;
            } 
            else 
            {
                return res.status(400).json({ error: 'Video file is required.' });
            }
        } 
        else 
        {
            return res.status(400).json({ error: 'Video file is required.' });
        }
        

        const addedEpisode = await IEpisodeController.addEpisode(newEpisode);

        return res.status(201).json({ addedEpisode });
    } 
    catch (error) {
        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
}


export async function editEpisode(req: Request, res: Response) {
    try 
    {
        const idEpisode = req.params.id_episode;
        const { numero_episode, titre, description, duration, ref_season, ref_series } = req.body;

        const saison = await SeasonModel.findById(ref_season);
        const serie = await SerieMethodDb.findById(ref_series);
        if (!saison || !serie) {
            return res.status(404).json({ error: "La saison ou la série spécifiée n'existe pas." });
        }

        const existingEpisode = await IEpisodeController.getById(idEpisode);
        if (!existingEpisode) {
            return res.status(404).json({ error: "Épisode non trouvé." });
        }

        const updatedEpisodeData: EpisodeSchemaPropriety = {
            numero_episode,
            titre,
            description,
            duration,
            ref_season,
            ref_series,
            video: existingEpisode.video 
        };

        if (req.files) {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            if (files['video'] && files['video'][0]) {
                updatedEpisodeData.video = `http://192.0.0.2:3001/uploads/video_serie_episode/${files['video'][0].filename}`;
            }
        }

        const updatedEpisode = await IEpisodeController.editEpisode(idEpisode, updatedEpisodeData);
        return res.status(200).json({ updatedEpisode });
    } catch (error) {
        //console.error("Erreur c'est :", error);
        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
}
