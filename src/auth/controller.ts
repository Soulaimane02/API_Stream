import  jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { IPassword, UserProrietyData } from "../users/model";
import { UserSchema } from "../users/model";
import express, {Request, Response} from "express";
import IUserRepositoryController from "../users/repository";
import { convertToISODate } from "../users/model";
import { AuthenticatedRequest }  from '../auth/middlewareAdmin';

dotenv.config();
const zlkejfhkjsdhcjkfbsdn = process.env.SECRET_KEY;
const cast_zlkejfhkjsdhcjkfbsdn = zlkejfhkjsdhcjkfbsdn as string;

const zlendkzendjdzLaim = process.env.SECRET_KEY_LAIM
const cast_zlendkzendjdzLaim = zlendkzendjdzLaim as string;

const ehjedzjkzjdsjkPdm = process.env.SECRET_KEY_PDM
const cast_ehjedzjkzjdsjkPdm = ehjedzjkzjdsjkPdm as string;

export async function registerUser(req: AuthenticatedRequest, res: Response) {
    try {
        const body_user = req.body;
        const { error, value } = UserSchema.validate(body_user);
        
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        
        if (value.date_of_birth) {
            value.date_of_birth = convertToISODate(value.date_of_birth);
        }

        const email_verif = await IUserRepositoryController.getByMail(value.mail);
        if (email_verif) {
            return res.status(401).json({ error: "Mail already exist!" });
        }

        // Pour la gestion des sous-comptes
        let sous_compte_number = value.sous_compte;
        if (req.user) {
            sous_compte_number = req.user.sous_compte; 
        }

        const salt = await bcrypt.genSalt(10);
        const hashpaswd = await bcrypt.hash(value.password, salt);
        const paswd_hash: IPassword = { hash: hashpaswd, salt: salt };

        const user: UserProrietyData = {
            name: value.name,
            first_name: value.first_name,
            date_of_birth: value.date_of_birth,
            mail: value.mail,
            password: paswd_hash,
            sous_compte: sous_compte_number, 
            profile_picture: value.profile_picture,
        };

        if (req.file) {
            user.profile_picture = `http://192.0.0.2:3001/uploads/profile_pictures/${req.file.filename}`;
        }

        const add_user = await IUserRepositoryController.addUser(user);
        
        const token = jwt.sign(
            { 
                _id: add_user._id, 
                name: add_user.name, 
                first_name: add_user.first_name, 
                date_of_birth: add_user.date_of_birth, 
                mail: add_user.mail, 
                sous_compte: add_user.sous_compte, 
                profile_picture: add_user.profile_picture 
            }, 
            cast_zlkejfhkjsdhcjkfbsdn, 
            { expiresIn: '72h' }
        );

        return res.status(200).json({ token });

    } catch (error) {
        //console.error("L'erreur est :", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}



export async function loginUser(req: Request, res: Response) {
    try {
        const { mail, password } = req.body;
        const email_user = await IUserRepositoryController.getByMail(mail);

        if (!email_user) {
            return res.status(400).json("User does not exist");
        }

        const isValidPassword = await bcrypt.compare(password, email_user.password.hash);
        if (!isValidPassword) {
            return res.status(400).json("Invalid password");
        }

        const isAdmin = mail === cast_zlendkzendjdzLaim && password === cast_ehjedzjkzjdsjkPdm;

        const token = jwt.sign(
            {
                _id: email_user._id,
                name: email_user.name,
                first_name: email_user.first_name,
                date_of_birth: email_user.date_of_birth,
                mail: email_user.mail,
                sous_compte: email_user.sous_compte,
                profile_picture: email_user.profile_picture,
                isAdmin 
            },
            cast_zlkejfhkjsdhcjkfbsdn,
            { expiresIn: '72h' }
        );

        return res.status(200).json({ token });
    } catch (error) {
        //console.error("Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
