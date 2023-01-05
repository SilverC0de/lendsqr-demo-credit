import { Request, Response } from "express";
import { SECRET_KEY } from "../config/index.js";
import { ServerResponse } from "../config/response.js";
import { KnexORM } from "../config/knex.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const knex = new KnexORM();

export class AuthController {
    registerUser = async (req: Request, res: Response) => {
        let {email, password, name, phone_number, account_type} = req.body;

        try { 
            //Flow
            //1. Get the email, name, account_type, phone_numbber, password
            //2. Check if email exist
            //3. Encrypt password
            //4. Save data

           
            let encrypted_password =  await bcryptjs.hash(password, 12);
 

            let token = jwt.sign(
                {
                  email,
                  iat: Math.floor(Date.now() / 1000),
                },
                SECRET_KEY,
                {
                  algorithm: 'HS512',
                  expiresIn: '4h',
                },
              );


            let d = {
                email: email,
                password: encrypted_password,
                account_type: account_type,
                name: name,
                phone_number: phone_number
            }
            await knex.saveUserInfo(d).then((data) => {
                res.status(200).json(ServerResponse.success({
                    email: email,
                    token: token
                }, 'User registered successfully'));
            }).catch((e) => {
                console.log(e.message)
                res.status(400).json(ServerResponse.clientError({}, 'Database connection error'));
            })
        } catch (e) {
            res.status(500).json(ServerResponse.serverError({}, 'Internal server error'));
        }
    }
}