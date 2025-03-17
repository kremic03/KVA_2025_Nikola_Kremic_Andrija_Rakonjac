// src/models/user.model.ts
import { OrderModel } from "./order.model";

export interface UserModel {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    favoriteGenre: string;
    password: string;
    orders: OrderModel[];
}

