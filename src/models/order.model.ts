
export interface OrderModel {
    id: number;
    screeningId: number;
    movieTitle: string;
    date: string;
    time: string;
    hall: string;
    count: number;
    pricePerItem: number;
    status: 'reserved' | 'paid' | 'watched' | 'canceled';
    rating: null | boolean;
}
