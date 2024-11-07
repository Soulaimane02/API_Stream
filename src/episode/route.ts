import express from "express";
import {  getAll,  getById, deleteEpisode, addEpisode, editEpisode } from './controller'; 
import { uploadEpisodeVideo } from '../auth/middleware'; 


const route = express.Router();

route.get('/', getAll);
route.get('/:id_episode', getById);
route.delete('/delete_episode/:id_episode', deleteEpisode);
route.post('/add_episode', uploadEpisodeVideo, addEpisode);
route.put('/edit_episode/:id_episode', uploadEpisodeVideo, editEpisode);

export default route;
