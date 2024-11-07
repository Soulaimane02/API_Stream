import express from 'express';
import { getAllUser, getUserById, delete_user, edit_user } from './controller';
import { requireAuth, requireSelfOrAdmin } from '../auth/middlewareAdmin';
import upload from '../auth/middleware';

const route = express.Router();

route.get('/', requireAuth, getAllUser);
route.get('/:id_user', requireAuth, requireSelfOrAdmin, getUserById);
route.delete('/delete_user/:id_user', requireAuth, requireSelfOrAdmin, delete_user);
route.put('/edit_user/:id_user',requireAuth, requireSelfOrAdmin,upload, edit_user);

export default route;
