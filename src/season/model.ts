import joi from "joi";
import { SerieModelForController } from "../series/model";

export interface SeasonSchemaPropriety {
    _id?: string;
    number_saison: number;
    ref_serie: string; 
    description: string;
    nb_total_episode: number;
}


export const SeasonSchemaBody = joi.object({
    number_saison: joi.number().required(),
    ref_serie: joi.string().required(), 
    description: joi.string().required(),
    nb_total_episode: joi.number().required()
});
