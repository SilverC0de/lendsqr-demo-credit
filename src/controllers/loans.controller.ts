import { Request, Response } from "express";
import { ServerResponse } from "../config/response.js";
import { KnexORM } from "../config/knex.js";
import { JWTInterface, LoanOptionsInterface } from "../interfaces/knex.interface.js";

const knex = new KnexORM();

export class LoansController {
    createLoan = async (req: Request, res: Response) => {
        let email : string = (req as JWTInterface).email!;
        let account_type : string = (req as JWTInterface).account_type!;
        let { min, max, interest_per_day} = req.body;
       
    
        //Flow
        //Just save loan information if the user is a lender

        try {
            
            if(account_type != 'lender'){
                return res.status(400).json(ServerResponse.clientError({}, 'You need to be a lender to create a loan'));   
            }


            let loan : LoanOptionsInterface = {
                email: email,
                min: min,
                max: max,
                interest_per_day: interest_per_day,
            }


            await knex.createLoan(loan).then(() => {
                res.status(200).json(ServerResponse.success(req.body, 'Loan option created successfully'));   
            }).catch(err => {
                res.status(400).json(ServerResponse.clientError({}, 'Unable to create loan option'));   
            })
         

        } catch (error) {
            res.status(500).json(ServerResponse.serverError({}, 'Internal server error'));   
        }
    }
}