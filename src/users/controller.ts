import express, {Request, Response} from "express";
import { UserSchema } from "./model";
import IUserRepositoryController from "./repository";
import { convertToISODate } from "./model";
import { IPassword } from "./model";
import bcrypt from "bcrypt";
import upload from "../auth/middleware";
import { FavoriteModelBb } from "../favorite/repository";
import { HistoryModel } from "../history/repository";


export async function getAllUser(req: Request, res: Response) 
{
    try
    {
        const all_user = await IUserRepositoryController.getAll();
        return res.status(200).json({all_user});
    }
    catch(error)
    {
        return res.status(500).json({error: "Internal Server Error"})
    } 
}

export async function getUserById(req: Request, res: Response)
{
    try
    {
        const user_id = await IUserRepositoryController.getById(req.params.id_user);
        if(user_id._id === undefined)
        {
            return res.status(404).json({ error: "Not Found" });
        }
        if(user_id._id.toString() !== req.params.id_user)
        {
            return res.status(404).json({ error: "Not Found" });
        }
        return res.status(200).json({user_id});
    }
    catch(error)
    {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function delete_user(req: Request, res: Response) 
{
    try
    {
        const userId = req.params.id_user;

        // Le Cascade de SQL
        await FavoriteModelBb.deleteMany({ ref_user: userId });
        await HistoryModel.deleteMany({ ref_user: userId });

        await IUserRepositoryController.deleteById(userId);
        
        return res.status(200).json("User deleted!");
    }
    catch(error)
    {
        //console.error("Erreur supp user :", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function edit_user(req: Request, res: Response) 
{
    try
    {
        const user_update_by_id = req.params.id_user;
        const user_edit = req.body;
        
        const { error, value } = UserSchema.validate(user_edit);
        if(error)
        {
            return res.status(400).json({ error: error.details[0].message });
        }


        if (value.date_of_birth) 
        {
            value.date_of_birth = convertToISODate(value.date_of_birth);
        }

        if (value.password) 
        {
            const salt = await bcrypt.genSalt(10);
            const hashpaswd = await bcrypt.hash(value.password, salt);
            const paswd_hash: IPassword = { hash: hashpaswd, salt: salt };
            value.password = paswd_hash;
        }

        if (req.file) 
        {
            value.profile_picture = `http://192.0.0.2:3001/uploads/profile_pictures/${req.file.filename}`;
        }


        const this_todo = await IUserRepositoryController.updateUser(user_update_by_id, value);
        return res.status(200).json({ this_todo });

    }
    catch(error)
    {
        //console.error("L'erreur est :", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


