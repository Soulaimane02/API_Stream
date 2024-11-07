import fetch from 'node-fetch';
import * as dotenv from "dotenv";


dotenv.config();
const secret_key = process.env.SECRET_API_TMBD;
const cast_secret_key = secret_key as string;

const TMDB_API_KEY = cast_secret_key;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchSerieDetailsFromTMDB(tmdbId: string) {
    try {
        const url = `${TMDB_BASE_URL}/tv/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`;
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'accept': 'application/json' }
        });
        const data = await response.json();

        if (response.ok) {
            return {
                name: data.name,
                description: data.overview,
                img: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
                categorie: data.genres?.[0]?.name || "Unknown", // Prendre le premier genre si disponible
                rating: data.vote_average.toString() // Convertir la note en chaîne de caractères
            };
        } else {
            throw new Error(data.status_message || 'Failed to fetch data from TMDB');
        }
    } catch (error) {
        //console.error('Erreur API TMBD:', error);
        throw error;
    }
}
