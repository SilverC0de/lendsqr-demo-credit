export interface UserInterface {
    email: string;
    name: string;
    password?: string;
    phone_number: string;
    wallet?: number;
    account_type: string;
}

export interface LoanOptionsInterface {
    ID?: number;
    email: string;
    min: number;
    max: number;
    days: number;
    interest_per_day: string;
}

export interface TransactionInterface {
    email: string;
    amount: number;
    type: string;
    status: string
    recipient?: string;
    bank_holder?: string;
    bank_nuban?: string;
    bank_name?: string;
}

export interface JWTInterface {
    email?: string; 
    account_type?: string;
}

export interface LoanInfo {
    borrower: string;
    lender: string;
    amount: number;
    interest: number;
    days: number;
    status?: string;
    created_at?: string;
    updated_at?: string;
}