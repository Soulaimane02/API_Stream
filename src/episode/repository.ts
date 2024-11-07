import mongoose, { Schema } from "mongoose";
import { EpisodeSchemaPropriety } from "./model";

const EpisodeSchemaMongoose = new mongoose.Schema({
    numero_episode: { type: Number, required: true },
    titre: { type: String, required: true }, 
    description: { type: String, required: true },
    video: { type: String, required: false }, 
    duration: { type: Number, required: true }, 
    ref_season: { type: Schema.Types.ObjectId, ref: "Season", required: true }, 
    ref_series: { type: Schema.Types.ObjectId, ref: "Serie", required: true } 
});

export const EpisodeModel = mongoose.model<EpisodeSchemaPropriety & mongoose.Document>("Episode", EpisodeSchemaMongoose);


async function getAll(): Promise<EpisodeSchemaPropriety[]> 
{
    const allEpisodes = await EpisodeModel.find();
    if (!allEpisodes) {
        throw new Error("No episode found");
    }
    return allEpisodes.map(episode => episode.toObject());
}

async function getById(idEpisode: string): Promise<EpisodeSchemaPropriety> 
{
    const oneEpisode = await EpisodeModel.findById(idEpisode);
    if (!oneEpisode) {
        throw new Error("Episode not found");
    }
    return oneEpisode.toObject();
}

async function deleteEpisode(idEpisode: string): Promise<void> 
{
    const deletedEpisode = await EpisodeModel.findByIdAndDelete(idEpisode);
    if (!deletedEpisode) {
        throw new Error("Episode not found");
    }
}


async function addEpisode(episodeObject: EpisodeSchemaPropriety): Promise<EpisodeSchemaPropriety> 
{
    const newEpisode = await new EpisodeModel(episodeObject).save();
    return newEpisode.toObject();
}


async function editEpisode(idEpisode: string, episodeObject: EpisodeSchemaPropriety): Promise<EpisodeSchemaPropriety> 
{
    const updatedEpisode = await EpisodeModel.findByIdAndUpdate(idEpisode, episodeObject, { new: true });
    if (!updatedEpisode) {
        throw new Error("Episode not found !");
    }
    return updatedEpisode.toObject();
}


export interface IEpisodeRepository 
{
    getAll(): Promise<EpisodeSchemaPropriety[]>;
    getById(idEpisode: string): Promise<EpisodeSchemaPropriety>;
    deleteEpisode(idEpisode: string): Promise<void>;
    addEpisode(episodeObject: EpisodeSchemaPropriety): Promise<EpisodeSchemaPropriety>;
    editEpisode(idEpisode: string, episodeObject: EpisodeSchemaPropriety): Promise<EpisodeSchemaPropriety>;
}


const IEpisodeController: IEpisodeRepository = 
{
    getAll,
    getById,
    deleteEpisode,
    addEpisode,
    editEpisode
};

export default IEpisodeController;
