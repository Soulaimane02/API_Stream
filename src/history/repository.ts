import mongoose, { Schema } from "mongoose";
import { HistorySchemaPropriety } from "./model";

const HistorySchemaMongoose = new mongoose.Schema({
    date_history: { type: Date, default: Date.now },
    ref_user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ref_movie: { type: Schema.Types.ObjectId, ref: "Movie", required: false },
    ref_episode: { type: Schema.Types.ObjectId, ref: "Episode", required: false },
    progress_time: { type: Number, required: true, min: 0 } // Temps de progression en secondes
});

export const HistoryModel = mongoose.model<HistorySchemaPropriety & mongoose.Document>("History", HistorySchemaMongoose);

async function getAll(): Promise<HistorySchemaPropriety[]> 
{
    const allHistories = await HistoryModel.find();
    if (!allHistories) {
        throw new Error("No history found");
    }
    return allHistories.map(history => history.toObject());
}

async function getById(idHistory: string): Promise<HistorySchemaPropriety> 
{
    const oneHistory = await HistoryModel.findById(idHistory);
    if (!oneHistory) {
        throw new Error("History not found");
    }
    return oneHistory.toObject();
}

async function deleteHistory(idHistory: string): Promise<void> 
{
    const deletedHistory = await HistoryModel.findByIdAndDelete(idHistory);
    if (!deletedHistory) {
        throw new Error("History not found");
    }
}

async function addHistory(historyObject: HistorySchemaPropriety): Promise<HistorySchemaPropriety> 
{
    const newHistory = await new HistoryModel(historyObject).save();
    return newHistory.toObject();
}

async function editHistory(idHistory: string, historyObject: HistorySchemaPropriety): Promise<HistorySchemaPropriety> 
{
    const updatedHistory = await HistoryModel.findByIdAndUpdate(idHistory, historyObject, { new: true });
    if (!updatedHistory) {
        throw new Error("History not found!");
    }
    return updatedHistory.toObject();
}

async function find(arg0: { ref_user: string }): Promise<HistorySchemaPropriety[]> {
    const histories = await HistoryModel.find(arg0); // Récupération des historiques selon ref_user
    return histories.map(history => history.toObject());
}

async function deleteUserHistory(userId: string): Promise<void> {
    const result = await HistoryModel.deleteMany({ ref_user: userId });
    if (result.deletedCount === 0) {
        throw new Error("No history found for this user");
    }
}

export interface IHistoryRepository {
    find(arg0: { ref_user: string }): Promise<HistorySchemaPropriety[]>; 
    getAll(): Promise<HistorySchemaPropriety[]>;
    getById(idHistory: string): Promise<HistorySchemaPropriety>;
    deleteHistory(idHistory: string): Promise<void>;
    addHistory(historyObject: HistorySchemaPropriety): Promise<HistorySchemaPropriety>;
    editHistory(idHistory: string, historyObject: HistorySchemaPropriety): Promise<HistorySchemaPropriety>;
    deleteUserHistory(userId: string): Promise<void>;
}

const IHistoryController: IHistoryRepository = 
{
    find,
    getAll,
    getById,
    deleteHistory,
    addHistory,
    editHistory,
    deleteUserHistory
};

export default IHistoryController;
