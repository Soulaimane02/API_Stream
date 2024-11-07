import express, { Request, Response } from 'express';
import { getAll, getById, deleteHistory, addHistory, editHistory, deleteUserHistory } from './controller';
import { requireAuth } from '../auth/middlewareAdmin'; 
import { HistoryModel } from '../history/repository'; 
import { HistorySchemaBody } from './model';


const route = express.Router();

route.get('/', requireAuth, getAll); 
route.get('/:id_history', requireAuth, getById); 
//route.delete('/delete_history/:id_history', requireAuth, deleteHistory);
//route.post('/add_history', requireAuth, addHistory);
route.put('/edit_history/:id_history', requireAuth, editHistory);
route.delete('/clear_history/:user_id', requireAuth, deleteUserHistory);
route.post('/add_history', requireAuth, async (req: Request, res: Response) => {
    try {
        const { error, value } = HistorySchemaBody.validate(req.body);
        if (error) 
            return res.status(400).json({ message: 'Données invalides', error: error.details });

        const newHistory = new HistoryModel({
            ref_user: value.ref_user,
            ref_movie: value.ref_movie,
            ref_episode: value.ref_episode,
            progress_time: value.progress_time,
            date_history: value.date_history 
        });
    
        await newHistory.save();
        res.status(201).json({ message: 'Historique ajouté avec succès', data: newHistory });
    } catch (error) {
        //console.error("Erreur:", error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

  
export default route;
