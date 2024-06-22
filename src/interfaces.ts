export interface JWTUser {
    id: number;
    email: string;
    role: string;
}

export interface User {
    id?: number;
    createdAt?: Date;
    email: string;
    password: string;
    name: string;
}

export interface Product {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    title: string;
    price: number;
    description: string;
    color?: string;
    owner?: Admin;
    ownerId: number;
}

export interface Admin {
    id?: number;
    createdAt?: Date;
    email: string;
    password: string;
    name: string;
    products?: Product[];
}