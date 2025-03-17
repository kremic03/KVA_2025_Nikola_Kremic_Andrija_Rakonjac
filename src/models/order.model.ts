import { AirlineModel } from "./airline.model"

export interface OrderModel {
    id: number
    flightId: number
    flightNumber: string
    airline: AirlineModel
    destination: string
    count: number
    pricePerItem: number
    status: 'ordered' | 'paid' | 'canceled',
    rating: null | boolean
}