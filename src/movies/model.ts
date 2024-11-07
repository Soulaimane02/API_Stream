import joi from 'joi';

export interface MovieProprietyData
{
    _id?: string;
    name: string;
    img: string;
    description: string;
    video: string;
    categorie: string;
    date_created: Date;
    ratting: string;
    duration: number;
}

export const MovieSchema = joi.object({
    name: joi.string().required(),
    img:  joi.string().optional(),
    description: joi.string(),
    video : joi.string().optional(),
    categorie: joi.string().optional(),
    date_created: joi.date().default(Date.now),
    ratting: joi.string().required(),
    duration: joi.number().min(0).required()
})

