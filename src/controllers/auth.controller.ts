import { Request, Response } from "express";
import { ServerResponse } from "../config/response.js"

export class AuthController {
    registerUser = async (req: Request, res: Response) => {
        let {email, password, name, phone_number, account_type} = req.body;

        try {
            //Flow
            //1. Get the email, name, account_type, phone_numbber, password
            //2. Encrypt password
            //3. Save data

            

            res.status(200).json(ServerResponse.success({}, 'User registered successfully'));
        } catch (e) {
            res.status(400).json(ServerResponse.validationError({}, (e as Error).message));
        }
    }
}