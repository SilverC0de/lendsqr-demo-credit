import { Request, Response } from "express";
import { SECRET_KEY } from "../config/index.js";
import { ServerResponse } from "../config/response.js";
import { KnexORM } from "../config/knex.js";
import { UserInterface } from "../interfaces/knex.interface.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const knex = new KnexORM();

export class AuthController {
    registerUser = async (req: Request, res: Response) => {
        let email = String(req.body.email).toLowerCase();
        let {password, name, phone_number, account_type} = req.body;

        try { 
            //Flow
            //1. Get the email, name, account_type, phone_numbber, password
            //2. Check if email exist
            //3. Encrypt password
            //4. Save data


            let user_info : JSON[] = await knex.getUserInfo(email);

            console.log(user_info);

            if(user_info.length > 0){
                //user already exist
                return res.status(500).json(ServerResponse.clientError({}, 'Your account already exists'));
            }


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
                }
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
                res.status(400).json(ServerResponse.clientError({}, 'Database connection error'));
            })
        } catch (e) {
            res.status(500).json(ServerResponse.serverError({}, 'Internal server error'));
        }
    }


    login = async (req: Request, res: Response) => {
        let email = String(req.body.email).toLowerCase();
        let password = req.body.password;

        //Flow
        //1. Get the email, password
        //2. Check the password
        //3. Get account info
        //4. JWT token
            
        try {
            let user_info : JSON[] = await knex.getUserInfo(email);

            console.log(user_info) 

            if(user_info.length == 0) {
                return res.status(500).json(ServerResponse.clientError({}, 'Your email does not exist on our platform'));
            }

            const isMatch = await bcryptjs.compare(password, user_info[0].password);


            if(!isMatch){
                return res.status(500).json(ServerResponse.clientError({}, 'Incorrect email or password'));
            }

            let token = jwt.sign(
                {
                  email,
                  iat: Math.floor(Date.now() / 1000),
                },
                SECRET_KEY,
                {
                  algorithm: 'HS512',
                  expiresIn: '4h',
                }
            );


            res.status(200).json(ServerResponse.success({
                email: email,                
                token: token,
                name: user_info[0].name,
                phone_number: user_info[0].phone_number,
                wallet: user_info[0].wallet,
                account_type: user_info[0].account_type
            }, 'User signed in'));
        } catch (e) {
            res.status(500).json(ServerResponse.serverError({}, 'Internal server error'));
        }
    }

}