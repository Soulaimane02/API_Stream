import express, { Request , Response } from "express";
import { MovieProprietyData, MovieSchema } from "./model";
import IMovieRepositoryForController from "./repository";
import upload from "../auth/middleware";
import { MovieMethodDb } from "./repository";
import { SerieModelForController } from "../series/model";

export async function getAllMovies(req: Request, res: Response) 
{
    try
    {
        const allMovies = await IMovieRepositoryForController.getAll();
        return res.status(200).json({ allMovies });
    }  
    catch(error)
    {
        return res.status(500).json({ error : "Internal Server Error"});
    }  
}

export async function getMovieById(req: Request, res: Response) 
{
    try
    {
        const oneMovie = await IMovieRepositoryForController.getById(req.params.id_movie);
        return res.status(200).json({ oneMovie });
        
    }
    catch(error)
    {
        return res.status(500).json({ error: "Internal Server Error" });
    }
    
}

export async function addAMovie(req: Request, res: Response) {
    try {
        const body_movie = req.body;
        const { error, value } = MovieSchema.validate(body_movie);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const movie: MovieProprietyData = {
            name: value.name,
            description: value.description,
            categorie: value.categorie,
            date_created: value.date_created || new Date(),
            img: "", // Initialiser img CHATGPT
            video: "", // Initialiser video CHATGPT
            ratting: value.ratting,
            duration: value.duration
        };

        // Vérifier les fichiers téléchargés via Multer CHATGPT
        if (req.files) {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            // Assigner l'image si elle est présente
            if (files['img'] && files['img'][0]) {
                movie.img = `http://192.0.0.2:3001/uploads/img_movie/${files['img'][0].filename}`;
            } else {
                return res.status(400).json({ error: 'Image file is required.' });
            }

            // Assigner la vidéo si elle est présente
            if (files['video'] && files['video'][0]) {
                movie.video = `http://192.0.0.2:3001/uploads/video_movie/${files['video'][0].filename}`;
            } else {
                return res.status(400).json({ error: 'Video file is required.' });
            }
        } else {
            return res.status(400).json({ error: 'Image and video files are required.' });
        }

        const add_movie = await IMovieRepositoryForController.addMovie(movie);
        return res.status(200).json({ add_movie });
    } 
    catch (error) 
    {
        //console.error("Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}



export async function editMovie(req: Request, res: Response) {
    try 
    {
        const movie_update_by_id = req.params.id_movie;
        const movie_edit = req.body;
        
        const { error, value } = MovieSchema.validate(movie_edit);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const existingMovie = await IMovieRepositoryForController.getById(movie_update_by_id);
        if (!existingMovie) {
            return res.status(404).json({ error: "Movie not found" });
        }

        const movie: MovieProprietyData = {
            name: value.name,
            description: value.description,
            date_created: value.date_created || existingMovie.date_created,
            categorie: value.categorie,
            img: existingMovie.img, 
            video: existingMovie.video, 
            ratting: value.rating,
            duration: value.duration
        };

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        if (files) 
        {
            if (files['img'] && files['img'][0]) {
                movie.img = `http://192.0.0.2:3001/uploads/img_movie/${files['img'][0].filename}`;
            }

            if (files['video'] && files['video'][0]) {
                movie.video = `http://192.0.0.2:3001/uploads/video_movie/${files['video'][0].filename}`;
            }
        }

        const updatedMovie = await IMovieRepositoryForController.updateMovie(movie_update_by_id, movie);
        return res.status(200).json({ updatedMovie });
    } 
    catch (error) 
    {
        //console.error("Error :", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


export async function delete_movie(req: Request, res: Response) 
{
    try
    {
        await IMovieRepositoryForController.deleteById(req.params.id_movie);
        return res.status(200).json("Movie Delete !");
    }
    catch(error)
    {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getMovieByIdFilm(id: string)
{
    try 
    {
        const movie = await MovieMethodDb.findById(id); 
        return movie;
    } 
    catch (error) 
    {
        //console.error( error);
        throw error; 
    }
}

export async function bestAllSeriesMovies(req: Request, res: Response) {
    try 
    {
        const { allMovies, allSeries }: { allMovies: MovieProprietyData[]; allSeries: SerieModelForController[] } = await IMovieRepositoryForController.getAllContentStar();
                
        // Avec GPT ça !
        const sortedMovies = allMovies.sort((a, b) => {
            const ratingA = parseFloat(a.ratting);
            const ratingB = parseFloat(b.ratting);
            return ratingA - ratingB;
        });
        const sortedSeries = allSeries.sort((a, b) => {
            const ratingA = parseFloat(a.rating);
            const ratingB = parseFloat(b.rating);
            return ratingA - ratingB;
        });

        return res.status(200).json({ movies: sortedMovies, series: sortedSeries });
    } 
    catch (error) 
    {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

