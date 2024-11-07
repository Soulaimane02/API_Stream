import mongoose, { Schema } from "mongoose";
import { IFavoriteProprieties, SchemaBodyFavorite } from "./model";

const SchemaMongooseFavorite = new mongoose.Schema({
    ref_movie: { type: Schema.Types.ObjectId, ref: "Movies", required: false }, 
    ref_serie: { type: Schema.Types.ObjectId, ref: "Series", required: false }, 
    ref_user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    date_created: { type: Date, default: Date.now },
});

export const FavoriteModelBb = mongoose.model<IFavoriteProprieties & mongoose.Document>("Favorite", SchemaMongooseFavorite);

async function getAll(): Promise<IFavoriteProprieties[]>
{

    const allFavorite = await FavoriteModelBb.find();
    if(!allFavorite) {
        throw new Error ("Favorites not found");
    }
    return allFavorite.map(favorite => favorite.toObject());
}

async function getById(idFavorite: string): Promise<IFavoriteProprieties>
{
    const oneFavorite = await FavoriteModelBb.findById(idFavorite);
    if (!oneFavorite)
    {
        throw new Error ("Favorite not Found");
    }
    return oneFavorite.toObject();
}

async function deleteById(idFavorite: string): Promise<void>
{
    const deleteFavorite = await FavoriteModelBb.findByIdAndDelete(idFavorite);
    if(!deleteFavorite)
    {
        throw new Error ("Not favorite for delete");
    }
}

async function addFavorite(favoriteObject: IFavoriteProprieties): Promise<IFavoriteProprieties>
{
    const favorite = await new FavoriteModelBb(favoriteObject).save();
    return (await favorite).toObject();
}

async function editFavorite(idFavorite: string, favoriteObject: IFavoriteProprieties): Promise<IFavoriteProprieties> 
{
    const newFavortie = await FavoriteModelBb.findByIdAndUpdate(idFavorite, favoriteObject,{ new: true }); 
    if (!newFavortie) {
        throw new Error("Favorite not found !");
    }
    return newFavortie.toObject();
}

export interface IFavoriteRepository{
    getAll(): Promise<IFavoriteProprieties[]>;
    getById(idFavorite: string): Promise<IFavoriteProprieties>;
    deleteById(idFavorite: string): Promise<void>;
    addFavorite(favoriteObject: IFavoriteProprieties): Promise<IFavoriteProprieties>;
    editFavorite(idFavorite: string, favoriteObject: IFavoriteProprieties): Promise<IFavoriteProprieties>
}

const IFavoriteController: IFavoriteRepository=
{
    getAll,
    getById,
    deleteById,
    addFavorite,
    editFavorite
}

export default IFavoriteController;