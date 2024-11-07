import joi from 'joi';
import { now } from 'mongoose';

export interface SerieModelForController
{
    _id?: string;
    name: string;
    description: string;
    img: string;
    date_created: Date;
    categorie: string;
    rating: string;
}

export const SerieSchema = joi.object({
    name: joi.string().required(),
    description: joi.string().required(),
    img: joi.string().optional(),
    date_created: joi.date().default(Date.now),
    categorie: joi.string().optional(),
    rating: joi.string().optional(),
})