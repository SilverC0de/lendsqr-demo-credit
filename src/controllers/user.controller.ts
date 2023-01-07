import { Request, Response } from "express";
import { ServerResponse } from "../config/response.js";
import { UsersHelper } from "../helpers/users.js";
import { JWTInterface } from "../interfaces/jwt.interface.js";
import { UserInterface } from "../interfaces/knex.interface.js";

const usersHelper = new UsersHelper();

export class UserController {
    userInfo = async (req: Request, res: Response) => {
        let email : string = (req as JWTInterface).email!;

        try {
       
            let user_info : any = await usersHelper.getUserInfo(email);
           
            let filtered_user_info : UserInterface = {
                email: user_info[0].email,
                name: user_info[0].name,
                phone_number: user_info[0].phone_number,
                wallet: user_info[0].wallet,
                account_type: user_info[0].account_type
            }
            
            res.status(200).json(ServerResponse.success(filtered_user_info, `Profile info retrieved successfully`));
        } catch (error) {
            res.status(500).json(ServerResponse.serverError({}, 'Internal server error'));   
        }
    }
}