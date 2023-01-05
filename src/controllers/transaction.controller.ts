import { Request, Response } from "express";
import { SECRET_KEY } from "../config/index.js";
import { ServerResponse } from "../config/response.js";
import { KnexORM } from "../config/knex.js";
import { JWTInterface, TransactionInterface } from "../interfaces/knex.interface.js";

const knex = new KnexORM();

export class TransactionController {
    internalTransfer = async (req: Request, res: Response) => {
        let email : string = (req as JWTInterface).email!;
        let to : string = String(req.body.to).toLowerCase();
        let amount : number = req.body.amount

    
    
        //Flow
        //Check recipient
        //Check user balance
        //Update ledger
        //Record transaction

        try {
       
            let user_info : any = await knex.getUserInfo(email);
            let recipient_info : any = await knex.getUserInfo(to);



            if(email == to){
                return res.status(400).json(ServerResponse.clientError({}, 'Sender cannot be same as recipient'));
            }

            if(user_info[0].wallet < amount){
                return res.status(400).json(ServerResponse.clientError({}, 'Insufficient funds'));
            }


            if(recipient_info.length == 0){
                return res.status(400).json(ServerResponse.clientError({}, 'Recipient email does not exist'));
            }


            let transactionA : TransactionInterface = {
                email: email,
                amount: amount,
                type: 'INTERNAL_TRANSFER_OUT',
                status: 'successful'
            }

            let transactionB : TransactionInterface = {
                email: to,
                amount: amount,
                type: 'INTERNAL_TRANSFER_IN',
                status: 'successful'
            }


            let debitSender = await knex.debitAccount(email, amount)
            let creditReceiver = await knex.creditAccount(to, amount)


            if(debitSender && creditReceiver){
                await knex.saveTransaction([transactionA, transactionB]).then((data) => {
                    res.status(200).json(ServerResponse.success({}, `N${amount} has been successfully transfered to ${recipient_info[0].name}`));
                }).catch((e) => {
                    console.log(e)
                    res.status(400).json(ServerResponse.clientError({}, 'Database connection error'));
                })
            } else {
                res.status(400).json(ServerResponse.clientError({}, 'Internal error, contact the administrator'));
            }
        } catch (error) {
            res.status(500).json(ServerResponse.serverError({}, 'Internal server error'));   
        }
    }
}