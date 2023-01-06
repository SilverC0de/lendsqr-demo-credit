import { Request, Response } from "express";
import { ServerResponse } from "../config/response.js";
import { KnexORM } from "../config/knex.js";
import { JWTInterface, LoanOptionsInterface } from "../interfaces/knex.interface.js";

const knex = new KnexORM();

export class LoansController {
    createLoan = async (req: Request, res: Response) => {
        let email : string = (req as JWTInterface).email!;
        let account_type : string = (req as JWTInterface).account_type!;
        let { min, max, days, interest_per_day} = req.body;
       
    
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
                days: days,
                interest_per_day: interest_per_day,
            }


            await knex.createLoanOption(loan).then(() => {
                res.status(200).json(ServerResponse.success(req.body, 'Loan option created successfully'));   
            }).catch(err => {
                res.status(400).json(ServerResponse.clientError({}, 'Unable to create loan option'));   
            })
         

        } catch (error) {
            res.status(500).json(ServerResponse.serverError({}, 'Internal server error'));   
        }
    }

    listOptions = async (req: Request, res: Response) => {


        //Flow
        //Just get the options

        try {

            let current_page = parseInt(req.params.page)
            let skip = (current_page - 1) * 10
            let take = 10
    



            let total_options : any = await knex.getLoanOptinsCount()
            let total_page : number = Math.ceil(total_options[0]['count(*)'] / take);
    
            
            if(total_page == 0) {
                return res.status(400).json(ServerResponse.clientError({}, `No notifications found on this page`));
            }

            if(current_page > total_page){
                return res.status(400).json(ServerResponse.clientError({}, `Current page cannot be greater than ${total_page}`));
            }

            let loan_options = await knex.getLoanOptions(take, skip);

            
            res.status(200).json(ServerResponse.success({
                current_page: current_page,
                total_page: total_page,
                loans: loan_options
            }, 'Loan option fetched'));   
        } catch (err) {
            res.status(500).json(ServerResponse.serverError({}, 'Internal server error'));
        }
    }
}