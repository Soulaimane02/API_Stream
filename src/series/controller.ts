import ISeriesController from "./repository";
import express, { Request , Response, json } from "express";
import { SerieModelForController, SerieSchema } from './model';
import { fetchSerieDetailsFromTMDB } from '../utils/tmbd';

export async function getAllSeries(req: Request, res: Response) 
{
    try
    {
        const allSeries = await ISeriesController.getAll();
        if(!allSeries)
        {
            res.status(404).json("Series Not Found !");
        }
        return res.status(200).json({allSeries});
    }
    catch(error)
    {
        return res.status(500).json({ error : "Internal Server Error"});
    }   
}

export async function getSerieById(req: Request, res: Response) 
{
    try
    {
        const theSerie = await ISeriesController.getById(req.params.id_serie);
        if(!theSerie)
        {
            res.status(404).json("Series Not Found !");
        }
        return res.status(200).json({theSerie});

    }
    catch(error)
    {
        return res.status(500).json({ error : "Internal Server Error"});
    } 
}

export async function delete_serie(req: Request, res: Response)  
{
    try
    {
        await ISeriesController.deleteSerieById(req.params.id_serie);
        return res.status(200).json(" Serie Delete !");
    }
    catch(error)
    {
        return res.status(500).json({ error : "Internal Server Error"});
    }   
}

export async function addSerie(req: Request, res: Response) {
    try {
        const { tmdbId } = req.body; 
        if (!tmdbId) 
        {
            return res.status(400).json({ error: 'TMDB ID is required.' });
        }

        // Récupérer les données de la série depuis TMDB
        const tmdbData = await fetchSerieDetailsFromTMDB(tmdbId);

        // Créer un objet série avec les données récupérées
        const serie: SerieModelForController = {
            name: tmdbData.name,
            description: tmdbData.description,
            img: tmdbData.img, // URL de l'image fournie par TMDB
            date_created: new Date(),
            categorie: tmdbData.categorie,
            rating: tmdbData.rating
        };

        const add_serie = await ISeriesController.addSerie(serie);
        return res.status(200).json({ add_serie });
    } 
    catch (error) 
    {
        //console.error('Error :', error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


export async function editSerie(req: Request, res: Response) 
{
    try 
    {
        const serie_update_by_id = req.params.id_serie;
        const serie_edit = req.body;
        
        const { error, value } = SerieSchema.validate(serie_edit);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const existingSerie = await ISeriesController.getById(serie_update_by_id);
        if (!existingSerie) {
            return res.status(404).json({ error: "Serie not found" });
        }

        const serie: SerieModelForController = {
            name: value.name,
            description: value.description,
            img: existingSerie.img,
            date_created: value.date_created || existingSerie.date_created,
            categorie: value.categorie,
            rating: existingSerie.rating
        };

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        if (files) 
        {
            if (files['img'] && files['img'][0]) {
                serie.img = `http://192.0.0.2:3001/uploads/img_series/${files['img'][0].filename}`;
            }
        }

        const updatedSerie = await ISeriesController.updateSerie(serie, serie_update_by_id);
        return res.status(200).json({ updatedSerie });
    } 
    catch (error) 
    {
        //console.error("Error :", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }  
}