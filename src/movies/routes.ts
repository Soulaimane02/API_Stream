import express from "express";
import { uploadMovie } from "../auth/middleware";
import { getAllMovies, getMovieById, addAMovie, editMovie, delete_movie, bestAllSeriesMovies} from './controller';
import { validateMovieData, checkMovieExists } from './middleware';
import { requireAdmin, requireAuth } from "../auth/middlewareAdmin";
import { getMovieByIdFilm } from "./controller";


const route = express.Router();

route.get("/", getAllMovies);
route.get("/:id_movie", getMovieById);
route.post("/add_movie", uploadMovie, requireAuth, requireAdmin, validateMovieData, addAMovie); 
route.put("/edit_movie/:id_movie", uploadMovie, requireAuth, requireAdmin, validateMovieData, checkMovieExists, editMovie); 
route.delete("/delete_movie/:id_movie", requireAuth, requireAdmin, checkMovieExists, delete_movie);
route.get('/content/stars', bestAllSeriesMovies);
route.get('/trailer/:id', async (req, res) => {
    const movieId = req.params.id;
    try {
        const movie = await getMovieByIdFilm(movieId); 
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        return res.status(200).json(movie);
    } catch (error) {
        //console.error('Erreur:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default route;
