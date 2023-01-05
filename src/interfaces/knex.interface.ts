export interface UserInterface {
    email: string;
    name: string;
    password: string;
    phone_number: string;
    wallet?: number;
    account_type: string;
}

export interface TransactionInterface {
    email: string;
    amount: number;
    type: string;
    status: string
}

export interface JWTInterface {
    email?: string;
}