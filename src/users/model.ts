import joi from 'joi';

export interface UserProrietyData
{
    _id?: string;
    name: string;
    first_name: string;
    date_of_birth: Date;
    mail: string;
    password: IPassword;
    sous_compte: number;
    profile_picture: string;
}

export interface IPassword
{
    hash: string;
    salt: string;
}

// CHATGPT
export function convertToISODate(dateString: string): Date {
    const [day, month, year] = dateString.split('/');
    const isoDate = `${year}-${month}-${day}`;
    
    // Validation simple pour s'assurer que la date est correcte
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) {
        throw new Error("Date invalide");
    }

    return date; // Retourne un objet Date
}

export const UserSchema = joi.object({
    name: joi.string().required(),
    first_name: joi.string().required(),
    date_of_birth: joi.string().required(),
    mail: joi.string().email().required(),
    password: joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/).required(),
    sous_compte: joi.number().default(() => Math.floor(Math.random() * 10000000)),
    profile_picture: joi.string().optional() 
});
