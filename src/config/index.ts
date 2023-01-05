import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const ENVIRONMENT = process.env.ENVIRONMENT;
export const PORT = process.env.PORT || 2022;
export const SECRET_KEY = process.env.SECRET_KEY || "secret";
export const DB = {
    HOST: process.env.HOST,
    USER: process.env.DBUSER,
    PASSWORD: process.env.DBPASSWORD,
    DATABASE: process.env.DATABASE
};
