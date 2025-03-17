import { OrderModel } from "./order.model"

export interface UserModel {
    email: string
    firstName: string
    lastName: string
    phone: string
    address: string
    favouriteDestination: string
    password: string
    orders: OrderModel[]
}