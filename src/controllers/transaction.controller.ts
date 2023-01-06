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
                    res.status(200).json(ServerResponse.success({ from: transactionA, to : transactionB }, `N${amount} has been successfully transfered to ${recipient_info[0].name}`));
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

    externalTransfer = async (req: Request, res: Response) => {
        let email : string = (req as JWTInterface).email!;
        let { amount, bank_name, bank_holder, bank_nuban} = req.body;


        //Flow
        //1. Check the balance
        //2. Debit the account
        //3. Log it

        try {

            let user_info : any = await knex.getUserInfo(email);


            if(user_info[0].wallet < amount){
                return res.status(400).json(ServerResponse.clientError({}, 'Insufficient funds'));
            }



            let debitUser = await knex.debitAccount(email, amount)


            if(debitUser){
                //log the transaction details

                let transaction_data : TransactionInterface = {
                    email: email,
                    amount: amount,
                    recipient: bank_holder,
                    bank_name: bank_name,
                    bank_nuban: bank_nuban,
                    type: 'WITHDRAWAL',
                    status: 'pending'
                }
    

                await knex.saveTransaction(transaction_data)

                res.status(200).json(ServerResponse.success(transaction_data, `N${amount} withdrawal be processed by our agent shortly`));
            } else {
                res.status(400).json(ServerResponse.clientError({}, 'Unable to process withdrawal'));
            }
        } catch (error) {
            res.status(500).json(ServerResponse.serverError({}, 'Internal server error'));   
        }
    }


    deposit = async (req: Request, res: Response) => {
        let email : string = (req as JWTInterface).email!;
        let { amount } = req.body;


        try {
            let creditUser = await knex.creditAccount(email, amount)


            if(creditUser){
                //log the transaction details

                let transaction_data : TransactionInterface = {
                    email: email,
                    amount: amount,
                    type: 'DEPOSIT',
                    status: 'successful'
                }
    

                await knex.saveTransaction(transaction_data)

                res.status(200).json(ServerResponse.success(transaction_data, `N${amount} deposit has been made to your account`));
            } else {
                res.status(400).json(ServerResponse.clientError({}, 'Unable to process deposit'));
            }
        } catch (error) {
            console.log(error)
            res.status(500).json(ServerResponse.serverError({}, 'Internal server error'));   
        }
    }
}