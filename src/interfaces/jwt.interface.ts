export interface JWTInterface {
    email?: string; 
    account_type?: string;
}

export interface JWTVerifyOptions {
    algorithm: string;
}