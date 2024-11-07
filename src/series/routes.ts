import express from "express";
import { uploadSerieImg } from '../auth/middleware'; 
import { getAllSeries, getSerieById, delete_serie, addSerie, editSerie } from './controller';
import { validateSerieData, checkSerieExists } from './middleware'; 
import { requireAuth, requireAdmin } from "../auth/middlewareAdmin"; 

const route = express.Router();

route.get('/', getAllSeries);
route.get('/:id_serie', getSerieById);
route.post('/add_serie', uploadSerieImg, requireAuth, requireAdmin, addSerie); 
route.put('/edit_serie/:id_serie', uploadSerieImg, requireAuth, requireAdmin, validateSerieData, checkSerieExists, editSerie); 
route.delete('/delete_serie/:id_serie', requireAuth, requireAdmin, checkSerieExists, delete_serie); 

export default route;
