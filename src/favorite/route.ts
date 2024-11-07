import express from 'express';
import { getAll, getById, deleteById, addFavorite, editFavorite } from './controller';
import { requireAuth } from '../auth/middlewareAdmin'; 

const route = express.Router();

route.get('/', requireAuth, getAll);
route.get('/:id_favorite', requireAuth, getById);
route.delete('/delete_favorite/:id_favorite', requireAuth, deleteById);
route.post('/add_favorite', requireAuth, addFavorite);
route.put('/edit_favorite/:id_favorite', requireAuth, editFavorite);

export default route;
