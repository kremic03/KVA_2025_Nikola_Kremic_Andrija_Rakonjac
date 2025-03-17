// src/services/movie.service.ts
import axios from 'axios';
import { MovieModel } from '../models/movie.model';
import { ScreeningModel } from '../models/screening.model';
import { ReviewModel } from '../models/review.model';

// Interface for API responses
interface ServiceResponse<T> {
  data: T;
}

const client = axios.create({
    baseURL: 'https://movie.pequla.com/api',
    headers: {
        'Accept': 'application/json',
        'X-Client-Name': 'KVA/2025'
    },
    validateStatus: (status: number) => {
        return status === 200;
    }
});

// Mock screenings data (for prototype)
const mockScreenings: { [key: number]: ScreeningModel[] } = {
    1: [
        { id: 101, movieId: 1, date: '2025-04-15', time: '19:30', hall: 'Hall 1', price: 10.50, availableSeats: 45 },
        { id: 102, movieId: 1, date: '2025-04-15', time: '22:00', hall: 'Hall 3', price: 12.00, availableSeats: 30 },
        { id: 103, movieId: 1, date: '2025-04-16', time: '18:15', hall: 'Hall 2', price: 10.50, availableSeats: 60 }
    ],
    2: [
        { id: 201, movieId: 2, date: '2025-04-15', time: '17:00', hall: 'Hall 4', price: 10.50, availableSeats: 25 },
        { id: 202, movieId: 2, date: '2025-04-16', time: '20:30', hall: 'Hall 1', price: 12.00, availableSeats: 40 }
    ]
    // Add more mockScreenings as needed for other movie IDs
};

// Mock reviews data (for prototype)
const mockReviews: { [key: number]: ReviewModel[] } = {
    1: [
        { 
            id: 1001, 
            movieId: 1, 
            userId: 'user1@example.com', 
            userName: 'John D.', 
            rating: true, 
            comment: 'Great movie! Loved the action scenes.',
            date: '2025-04-10'
        },
        { 
            id: 1002, 
            movieId: 1, 
            userId: 'user2@example.com', 
            userName: 'Jane S.', 
            rating: false, 
            comment: 'Too long and boring in the middle.',
            date: '2025-04-09'
        }
    ],
    2: [
        { 
            id: 2001, 
            movieId: 2, 
            userId: 'user3@example.com', 
            userName: 'Mike R.', 
            rating: true, 
            comment: 'Excellent story and acting!',
            date: '2025-04-11'
        }
    ]
    // Add more mockReviews as needed for other movie IDs
};

export class MovieService {
    static async getMovies(page: number = 0, size: number = 10): Promise<ServiceResponse<MovieModel[]>> {
        return client.request({
            url: '/movie',
            method: 'GET',
            params: {
                'page': page,
                'size': size
            }
        });
    }

    static async getMovieList(searchParams?: {
        director?: string,
        actor?: string,
        search?: string,
        genre?: string
    }): Promise<ServiceResponse<MovieModel[]>> {
        return client.request({
            url: '/movie',
            method: 'GET',
            params: searchParams || {}
        });
    }

    static async getMovieById(id: number): Promise<ServiceResponse<MovieModel>> {
        return client.get(`/movie/${id}`);
    }

    static async getGenres(): Promise<ServiceResponse<string[]>> {
        // In a real implementation, this would be an API call
        // For the prototype, we'll extract genres from a sample API response
        try {
            const response = await this.getMovies();
            const movies = response.data as MovieModel[];
            
            // Extract all genres from movies
            const allGenres = movies.flatMap((movie: MovieModel) => 
                movie.movieGenres.map((genreItem: any) => genreItem.genre.name)
            );
            
            // Remove duplicates
            const uniqueGenres = [...new Set(allGenres)];
            
            return { data: uniqueGenres };
        } catch (error) {
            console.error('Error fetching genres:', error);
            return { data: [] };
        }
    }

    static async getDirectors(): Promise<ServiceResponse<string[]>> {
        // In a real implementation, this would be an API call
        // For the prototype, we'll extract directors from a sample API response
        try {
            const response = await this.getMovies();
            const movies = response.data as MovieModel[];
            
            // Extract all directors from movies
            const allDirectors = movies.map((movie: MovieModel) => movie.director.name);
            
            // Remove duplicates
            const uniqueDirectors = [...new Set(allDirectors)];
            
            return { data: uniqueDirectors };
        } catch (error) {
            console.error('Error fetching directors:', error);
            return { data: [] };
        }
    }

    static async getActors(): Promise<ServiceResponse<string[]>> {
        // In a real implementation, this would be an API call
        // For the prototype, we'll extract actors from a sample API response
        try {
            const response = await this.getMovies();
            const movies = response.data as MovieModel[];
            
            // Extract all actors from movies
            const allActors = movies.flatMap((movie: MovieModel) => 
                movie.movieActors.map((actorItem: any) => actorItem.actor.name)
            );
            
            // Remove duplicates
            const uniqueActors = [...new Set(allActors)];
            
            return { data: uniqueActors };
        } catch (error) {
            console.error('Error fetching actors:', error);
            return { data: [] };
        }
    }
    
    static async getScreeningsForMovie(movieId: number): Promise<ServiceResponse<ScreeningModel[]>> {
        // In a real implementation, this would be an API call
        // For the prototype, we'll use mock data
        return new Promise<ServiceResponse<ScreeningModel[]>>(resolve => {
            setTimeout(() => {
                resolve({ 
                    data: mockScreenings[movieId] || []
                });
            }, 300); // Simulate network delay
        });
    }

    static async getScreeningById(screeningId: number): Promise<ServiceResponse<ScreeningModel | null>> {
        // In a real implementation, this would be an API call
        // For the prototype, we'll search through mock data
        return new Promise<ServiceResponse<ScreeningModel | null>>(resolve => {
            setTimeout(() => {
                // Find the screening in mock data
                let foundScreening: ScreeningModel | null = null;
                
                Object.values(mockScreenings).forEach(screenings => {
                    const screening = screenings.find(s => s.id === screeningId);
                    if (screening) {
                        foundScreening = screening;
                    }
                });
                
                resolve({ 
                    data: foundScreening
                });
            }, 300); // Simulate network delay
        });
    }

    static async getReviewsForMovie(movieId: number): Promise<ServiceResponse<ReviewModel[]>> {
        // In a real implementation, this would be an API call
        // For the prototype, we'll use mock data
        return new Promise<ServiceResponse<ReviewModel[]>>(resolve => {
            setTimeout(() => {
                resolve({ 
                    data: mockReviews[movieId] || []
                });
            }, 300); // Simulate network delay
        });
    }

    static async addReview(review: Omit<ReviewModel, 'id' | 'date'>): Promise<ServiceResponse<ReviewModel>> {
        // In a real implementation, this would be an API call to post a new review
        // For the prototype, we'll add to mock data
        return new Promise<ServiceResponse<ReviewModel>>(resolve => {
            setTimeout(() => {
                const newReview: ReviewModel = {
                    ...review,
                    id: Math.floor(Math.random() * 10000),
                    date: new Date().toISOString().split('T')[0]
                };
                
                if (!mockReviews[review.movieId]) {
                    mockReviews[review.movieId] = [];
                }
                
                mockReviews[review.movieId].push(newReview);
                
                resolve({ 
                    data: newReview
                });
            }, 300); // Simulate network delay
        });
    }
}
