import joi from "joi";

export interface HistorySchemaPropriety 
{
    _id?: string; 
    date_history: Date;
    ref_user: string; 
    ref_movie?: string; 
    ref_episode?: string; 
    progress_time: number; // Temps de progression dans la vidéo (en secondes)
}

export const HistorySchemaBody = joi.object({
    date_history: joi.date().default(Date.now), 
    ref_user: joi.string().required(), 
    ref_movie: joi.string().optional(), 
    ref_episode: joi.string().optional(), 
    progress_time: joi.number().min(0).required(), 
});

