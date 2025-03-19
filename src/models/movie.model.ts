
import { ActorModel } from "./actor.model";
import { GenreModel } from "./genre.model";

export interface MovieModel {
    movieId: number;
    internalId: string;
    corporateId: string;
    directorId: number;
    title: string;
    originalTitle: string;
    description: string;
    shortDescription: string;
    poster: string;
    startDate: string;
    shortUrl: string;
    runTime: number;
    createdAt: string;
    updatedAt: string | null;
    director: {
        directorId: number;
        name: string;
        createdAt: string;
    };
    movieActors: {
        movieActorId: number;
        movieId: number;
        actorId: number;
        actor: ActorModel;
    }[];
    movieGenres: {
        movieGenreId: number;
        movieId: number;
        genreId: number;
        genre: GenreModel;
    }[];
}