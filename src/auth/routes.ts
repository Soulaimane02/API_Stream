import express from 'express';
import { registerUser, loginUser } from './controller';
import { requireAuth, requireAdmin } from './middlewareAdmin';
import upload from './middleware';

const route = express.Router();

route.post('/register',upload, registerUser); 
route.post('/login', loginUser);
route.get('/admin', requireAuth, requireAdmin, (req, res) => {
    res.status(200).json({ message: "Welcome, LEBOSS!" });
});

export default route;
