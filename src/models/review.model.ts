// src/models/review.model.ts
export interface ReviewModel {
    id: number;
    movieId: number;
    userId: string;
    userName: string;
    rating: boolean; // true for positive, false for negative
    comment?: string;
    date: string;
}

