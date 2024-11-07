import express, { Request, Response } from 'express';
import { HistorySchemaPropriety, HistorySchemaBody } from './model';
import IHistoryController, { HistoryModel } from './repository';
import { UserMethodDb } from "../users/repository";

export async function getAll(req: Request, res: Response) 
{
    try {
        const allHistories = await IHistoryController.getAll();
        if (!allHistories) {
            return res.status(404).json({ message: "Not found histories." });
        }
        return res.status(200).json({ allHistories });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function getById(req: Request, res: Response) 
{
    try {
        const oneHistory = await IHistoryController.getById(req.params.id_history);
        if (!oneHistory) {
            return res.status(404).json({ message: "History not found." });
        }
        return res.status(200).json({ oneHistory });
    } catch (error) {
        //console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function deleteHistory(req: Request, res: Response) 
{
    try {
        await IHistoryController.deleteHistory(req.params.id_history);
        return res.status(200).json({ message: "History deleted" });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function addHistory(req: Request, res: Response) 
{
    try {
        const { date_history, ref_user, ref_movie, ref_episode, progress_time } = req.body;

        const user = await UserMethodDb.findById(ref_user);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const newHistory: HistorySchemaPropriety = {
            date_history,
            ref_user,
            ref_movie,
            ref_episode,
            progress_time
        };

        const alreadyHistoryMovieExist = await HistoryModel.findOne({ ref_movie, ref_user });
        if (alreadyHistoryMovieExist) {
            alreadyHistoryMovieExist.progress_time = progress_time;
            const updatedHistory = await alreadyHistoryMovieExist.save(); 
            return res.status(200).json({ message: "Historique mis à jour", updatedHistory });
        }

        const alreadyHistorySerieExist = await HistoryModel.findOne({ ref_episode, ref_user });
        if (alreadyHistorySerieExist) {
            alreadyHistorySerieExist.progress_time = progress_time;
            const updatedHistory = await alreadyHistorySerieExist.save(); 
            return res.status(200).json({ message: "Historique mis à jour", updatedHistory });
        }

        const addedHistory = await IHistoryController.addHistory(newHistory);
        return res.status(201).json({ addedHistory });
    } catch (error) {
        //console.error("Erreur :", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}


export async function editHistory(req: Request, res: Response) {
    try {
        const idHistory = req.params.id_history;
        const { date_history, ref_user, ref_movie, ref_episode, progress_time } = req.body;

        const user = await UserMethodDb.findById(ref_user);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const existingHistory = await IHistoryController.getById(idHistory);
        if (!existingHistory) {
            return res.status(404).json({ error: "History not found." });
        }

        const updatedHistoryData: HistorySchemaPropriety = {
            date_history,
            ref_user,
            ref_movie,
            ref_episode,
            progress_time
        };

        const updatedHistory = await IHistoryController.editHistory(idHistory, updatedHistoryData);
        return res.status(200).json({ updatedHistory });
    } catch (error) {
        //console.error("Erreur:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}


export async function deleteUserHistory(req: Request, res: Response) 
{
    const userId = req.params.user_id; 

    try 
    {
        await IHistoryController.deleteUserHistory(userId);
        return res.status(200).json({ message: "User's history deleted" });
    } 
    catch (error) 
    {
        return res.status(500).json({ error: "Internal server error" });
    }
}