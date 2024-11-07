import joi from 'joi';

export interface IFavoriteProprieties {
    _id?: string;
    ref_movie: string;
    ref_serie: string;
    ref_user: string;
    date_created: Date;   
}

export const SchemaBodyFavorite = joi.object({
    ref_movie: joi.string().optional(),
    ref_serie: joi.string().optional(),
    ref_user: joi.string().required(),
    date_created: joi.date().default(Date.now)
});
