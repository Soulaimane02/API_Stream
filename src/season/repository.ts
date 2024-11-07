import mongoose, { Schema } from "mongoose";
import { SeasonSchemaPropriety } from "./model";

const SeasonSchemaMongoose = new mongoose.Schema({
    number_saison: { type: Number, required: true },
    ref_series: { type: Schema.Types.ObjectId, ref: "Serie", required: true }, // Référence à une série
    description: { type: String, required: true },
    nb_total_episode: { type: Number, required: true }
});

export const SeasonModel =  mongoose.model<SeasonSchemaPropriety & mongoose.Document>("Season", SeasonSchemaMongoose);

async function getAll(): Promise<SeasonSchemaPropriety[]> 
{
    const allSeason = await SeasonModel.find();
    if (!allSeason)
    {
        throw new Error("Season For Series not found");
    }
    return allSeason.map(season => season.toObject());
}

async function getById(idSeason: string): Promise<SeasonSchemaPropriety>
{
    const oneSeason = await SeasonModel.findById(idSeason);
    if (!oneSeason)
    {
        throw new Error("Season Not Found");
    }
    return oneSeason.toObject();
}

async function deleteSeason(idSeason: string): Promise<void>
{
    const deleteSeason = await SeasonModel.findByIdAndDelete(idSeason);
    if(!deleteSeason)
    {
        throw new Error("Season not found");
    }
}

async function addSeason(seasonObject: SeasonSchemaPropriety): Promise<SeasonSchemaPropriety>
{
    const addSeason = await new SeasonModel(seasonObject).save();
    return addSeason.toObject();
}

async function editSeason(idSeason: string, seasonObject: SeasonSchemaPropriety): Promise<SeasonSchemaPropriety> {
    const editSeason = await SeasonModel.findByIdAndUpdate(idSeason, seasonObject, { new: true });
    if (!editSeason) {
        throw new Error("Season not found !");
    }
    return editSeason.toObject();
}


export interface ISeasonRepository
{
    getAll(): Promise<SeasonSchemaPropriety[]>;
    getById(idSeason: string): Promise<SeasonSchemaPropriety>;
    deleteSeason(idSeason: string): Promise<void>;
    addSeason(seasonObject: SeasonSchemaPropriety): Promise<SeasonSchemaPropriety>;
    editSeason(idSeason: string, seasonObject: SeasonSchemaPropriety): Promise<SeasonSchemaPropriety | null>;
}

const ISeasonController: ISeasonRepository= {
    getAll,
    getById,
    deleteSeason,
    addSeason,
    editSeason
}

export default ISeasonController;