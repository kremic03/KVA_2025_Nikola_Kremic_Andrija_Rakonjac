
export interface ReviewModel {
    id: number;
    movieId: number;
    userId: string;
    userName: string;
    rating: boolean; 
    comment?: string;
    date: string;
}

