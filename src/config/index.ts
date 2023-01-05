import * as dotenv from 'dotenv';
dotenv.config({path: ".env"});

export const ENVIRONMENT    = process.env.ENVIRONMENT;
export const PORT           = process.env.PORT || 2022;