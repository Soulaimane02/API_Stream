import { number, required } from 'joi';
import { SerieModelForController, SerieSchema } from './model';
import mongoose from 'mongoose';


const SerieSchemaMongoose = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    img: { type: String, required: false},
    date_created: { type: Date, default: Date.now },
    categorie: { type: String, required: false },
    rating: { type: String, required: false }

})
export const SerieMethodDb = mongoose.model<SerieModelForController & mongoose.Document>("series", SerieSchemaMongoose);

async function getAll(): Promise<SerieModelForController[]>
{
    const allSeries = await SerieMethodDb.find();
    if(!allSeries)
    {
        throw new Error("Series not found !");
    }
    return allSeries.map(serie => serie.toObject());
}

async function getById(idSerie: string): Promise<SerieModelForController> 
{
    const oneSerie = await SerieMethodDb.findById(idSerie);
    if(!oneSerie)
    {
        throw new Error("Serie not found !");
    }
    return oneSerie.toObject();    
}

async function deleteSerieById(idSerie: string): Promise<void>
{
    const deleteSerie = await SerieMethodDb.findByIdAndDelete(idSerie);
    if(!deleteSerie)
    {
        throw new Error ("Serie not found !");
    }    
}

async function addSerie(serieObject: SerieModelForController): Promise<SerieModelForController>
{
    const theSerie = new SerieMethodDb(serieObject).save();
    return (await theSerie).toObject();
}

async function updateSerie(serieObject: SerieModelForController, idSerie: string): Promise<SerieModelForController>
{
    const setSerie = await SerieMethodDb.findByIdAndUpdate(idSerie, serieObject, { new: true });
    if(!setSerie)
    {
        throw new Error("Movie not found");
    }
    return setSerie.toObject();

}

interface ISeriesRepository
{
    getAll(): Promise<SerieModelForController[]>;
    getById(idSerie: string): Promise<SerieModelForController>;
    deleteSerieById(idSerie: string): Promise<void>;
    addSerie(serieObject: SerieModelForController): Promise<SerieModelForController>;
    updateSerie(serieObject: SerieModelForController, idSerie: string): Promise<SerieModelForController>;

}

const ISeriesController: ISeriesRepository =
{
    getAll,
    getById,
    deleteSerieById,
    addSerie,
    updateSerie
}

export default ISeriesController