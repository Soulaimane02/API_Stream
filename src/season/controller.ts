import express, { Request , Response } from 'express';
import { SeasonSchemaPropriety, SeasonSchemaBody } from './model';
import  ISeasonController from './repository';
import { SeasonModel } from './repository';
import { SerieMethodDb } from "../series/repository"; 


export async function getAll(req: Request, res: Response) 
{
    try
    {
        const allSeason = await ISeasonController.getAll();
        if(!allSeason)
        {
            res.status(404).json({ allSeason });
        }
        return res.status(200).json({ allSeason });
    }
    catch(error)
    {
        return res.status(500).json({ error : "Internal Server Error"});
    }
}

export async function getById(req: Request, res: Response) 
{
    try
    {
        const oneMovie = await ISeasonController.getById(req.params.id_season);
        return res.status(200).json({ oneMovie });
    }
    catch(error)
    {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function delete_movie(req: Request, res: Response) 
{
    try
    {
        await ISeasonController.deleteSeason(req.params.id_season);
        return res.status(200).json("Season Delete !");
    }
    catch(error)
    {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function addSeason(req: Request, res: Response) {
    try {
        const { number_saison, ref_serie, description, nb_total_episode } = req.body;

        // Vérifier que la série existe en utilisant le bon modèle
        const serie = await SerieMethodDb.findById(ref_serie); // Remplace SeasonModel par SerieModel
        if (!serie) {
            return res.status(404).json({ error: "La série spécifiée n'existe pas." });
        }

        // Créer une nouvelle saison (GPT)
        const newSeason = new SeasonModel({
            number_saison: number_saison,
            ref_series: ref_serie, // Utiliser l'ID de la série comme référence
            description: description,
            nb_total_episode: nb_total_episode
        });

        const add_season = await ISeasonController.addSeason(newSeason); 

        return res.status(201).json({ message: "Saison ajoutée avec succès", add_season });
    } catch (error) {
        //console.error("Erreur pr les saisons", error);
        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
}

export async function editSeason(req: Request, res: Response) {
    try 
    {
        const  idSeason = req.params.id_season;
        const { number_saison, ref_serie, description, nb_total_episode } = req.body;

        const serie = await SerieMethodDb.findById(ref_serie);
        if (!serie) {
            return res.status(404).json({ error: "La série spécifiée n'existe pas." });
        }

        const updatedSeasonData: SeasonSchemaPropriety = {
            number_saison,
            ref_serie, 
            description,
            nb_total_episode
        };

        const updatedSeason = await ISeasonController.editSeason(idSeason, updatedSeasonData);
        if (!updatedSeason) {
            return res.status(404).json({ error: "La saison spécifiée n'existe pas." });
        }

        return res.status(200).json({ updatedSeason });
    } catch (error) 
    {
        //console.error("Erreur saison :", error);
        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
}