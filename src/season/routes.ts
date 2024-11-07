import express from "express";
import { requireAuth, requireAdmin } from "../auth/middlewareAdmin"; 
import { getAll, getById, delete_movie, addSeason, editSeason } from './controller';

const route = express.Router();

route.get('/', getAll);
route.get('/:id_season', getById);
route.delete('/delete_season/:id_season', requireAuth, requireAdmin, delete_movie); 
route.post('/add_season', requireAuth, requireAdmin, addSeason);
route.put('/edit_season/:id_season', requireAuth, requireAdmin, editSeason); 

export default route;
