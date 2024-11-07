import joi from "joi";

export interface EpisodeSchemaPropriety {
    _id?: string; 
    numero_episode: number; 
    titre: string; 
    description: string; 
    video: string; 
    duration: number; 
    ref_season: string; 
    ref_series: string; 
}

export const EpisodeSchemaBody = joi.object({
    numero_episode: joi.number().required(),
    titre: joi.string().required(), 
    description: joi.string().required(), 
    video: joi.string().optional(), 
    duration: joi.number().required(), 
    ref_season: joi.string().required(), 
    ref_series: joi.string().required() 
});

