import { required } from 'joi';
import { MovieProprietyData } from './model';
import mongoose from 'mongoose';
import { SerieMethodDb } from '../series/repository';
import { SerieModelForController } from '../series/model';

const MovieSchemaMongoose = new mongoose.Schema({
    name: { type: String, required: true },
    img: { type: String, required: false },
    description: { type:String, required: true },
    video: { type:String, required: false },
    categorie: { type:String, required: false },
    date_created: { type: Date, default: Date.now },
    ratting: { type: String, required: true },
    duration: { type: Number, required: true, min: 0 } // Temps de progression en secondes

})

export const MovieMethodDb = mongoose.model<MovieProprietyData & mongoose.Document>("movies", MovieSchemaMongoose);

async function getAll(): Promise<MovieProprietyData[]> 
{
    const allMovies = await MovieMethodDb.find();
    if(!allMovies)
        throw new Error("Movies Not Found !");

    return allMovies.map(movie => movie.toObject());
}

async function getAllContentStar(): Promise<{ allMovies: MovieProprietyData[], allSeries: SerieModelForController[] }> {
    const allMovies = await MovieMethodDb.find(); 
    const allSeries = await SerieMethodDb.find();

    return { allMovies, allSeries }; 
}


async function getById(idMovie: string): Promise<MovieProprietyData> 
{
    const thisMovie = await MovieMethodDb.findById(idMovie);
    if(!thisMovie)
        throw new Error("Movie not found !");

    return thisMovie.toObject();    
}

async function addMovie(oneMovie: MovieProprietyData): Promise<MovieProprietyData> 
{
    const theMovie = await new MovieMethodDb(oneMovie).save();
    return theMovie.toObject();
    
}

async function deleteById(idMovie: string): Promise<void> 
{
    const theMovieDelete = await MovieMethodDb.findByIdAndDelete(idMovie);
    if(!theMovieDelete)
    {
        throw new Error("Movie not found and delete !");
    }  
}

async function updateMovie(idMovie: string, movieToUpdate: MovieProprietyData): Promise<MovieProprietyData> 
{
    const setMovie = await MovieMethodDb.findByIdAndUpdate(idMovie, movieToUpdate, { new: true });
    if(!setMovie)
    {
        throw new Error("Movie not found");
    }
    return setMovie.toObject();
}

export interface IMovieRepository
{
    getAll(): Promise<MovieProprietyData[]>,
    getById(idMovie: string): Promise<MovieProprietyData>,
    addMovie(oneMovie: MovieProprietyData): Promise<MovieProprietyData>,
    deleteById(idMovie: string): Promise<void>,
    updateMovie(idMovie: string, movieToUpdate: MovieProprietyData): Promise<MovieProprietyData>,
    getAllContentStar(): Promise<{ allMovies: MovieProprietyData[], allSeries: SerieModelForController[] }>
}

const IMovieRepositoryForController: IMovieRepository=
{
    getAll,
    getById,
    addMovie,
    deleteById,
    updateMovie,
    getAllContentStar
}

export default IMovieRepositoryForController;