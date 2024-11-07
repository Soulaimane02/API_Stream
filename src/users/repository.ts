import { UserProrietyData } from "./model";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    first_name: { type: String, required: true },
    date_of_birth: { type: Date, required: true },
    mail: { type: String, required: true },
    password: { hash: String, salt: String,},    
    sous_compte:{ type: Number, required: true },
    profile_picture: { type: String, required: false },
})

export const UserMethodDb = mongoose.model<UserProrietyData & mongoose.Document>("users", UserSchema);

async function getAll(): Promise<UserProrietyData[]>
{
    const allUsers = await UserMethodDb.find();
    if(!allUsers)
    {
        throw new Error("Users not found !"); 
    }
    return allUsers.map(user => user.toObject());
}

async function getById(id_user: string): Promise<UserProrietyData> 
{
    const userId = await UserMethodDb.findById(id_user);
    if(!userId)
    {
        throw new Error ("User not found !");
    }
    return userId.toObject();
}

async function getByMail(mail: string): Promise<UserProrietyData | undefined>
{
    const mail_user = await UserMethodDb.findOne({mail});
    return mail_user?.toObject();
}

async function getBySousCompte(sous_compte:number): Promise<UserProrietyData | undefined>
{
    const sous_compte_user = await UserMethodDb.findOne({ sous_compte });
    return sous_compte_user?.toObject();
}

async function deleteById(id_user_delete: string): Promise<void>
{
    const deleteUser = await UserMethodDb.findByIdAndDelete(id_user_delete);
    if(!deleteUser)
    {
        throw new Error ("User not found")
    } 
}

async function addUser(userAdd: UserProrietyData): Promise<UserProrietyData> 
{
    const savedUser = await new UserMethodDb(userAdd).save();
    return savedUser.toObject();
}

async function updateUser(id_user: string, userToUpdate: UserProrietyData): Promise<UserProrietyData> 
{
    const setUser = await UserMethodDb.findByIdAndUpdate(id_user, userToUpdate, { new: true });
    if(!setUser)
    {
        throw new Error("User not found");
    }
    return setUser.toObject();
    
}

export interface IUserRepository
{
    getAll(): Promise<UserProrietyData[]>;
    getById(id_user: string): Promise<UserProrietyData>;
    deleteById(id_user_delete: string): Promise<void>;
    addUser(userAdd: UserProrietyData): Promise<UserProrietyData> 
    updateUser(id_user: string, userToUpdate: UserProrietyData): Promise<UserProrietyData>;
    getByMail(email: string): Promise<UserProrietyData | undefined>,
    getBySousCompte(sous_compte:number): Promise<UserProrietyData | undefined>
}

const IUserRepositoryController: IUserRepository = 
{
    getAll,
    getById,
    deleteById,
    addUser,
    updateUser,
    getByMail,
    getBySousCompte
}

export default IUserRepositoryController;