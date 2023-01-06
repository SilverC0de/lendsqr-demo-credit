import { Request, Response } from "express";
import { ServerResponse } from "../config/response.js";
import { KnexORM } from "../config/knex.js";
import { JWTInterface, TransactionInterface, LoanOptionsInterface, LoanInfo } from "../interfaces/knex.interface.js";

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
                return res.status(400).json(ServerResponse.clientError({}, `No loan options found on this page`));
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


    acceptOption = async (req: Request, res: Response) => {
        let email : string = (req as JWTInterface).email!;
        let account_type : string = (req as JWTInterface).account_type!;
        let {ID, amount} = req.body;

        //Flow
        //1. Get the loan option to see if its valid
        //2. Save the loan option
        //3. Debit the lender
        //4. Credit the borrower
        //5. Check if user does not have a pending loan tho
        //6 Also check if the amouont is within what the lender specifies
        //7 Also check if the lender has money lol

        try {

            if(account_type != 'borrower'){
                return res.status(400).json(ServerResponse.clientError({}, 'You need to be a borrower to accept any loan'));
            }


            let loan_info : any = await knex.getLoanOptionInfo(ID);

            if(loan_info.length == 0){
                //loan info doesn't exist
                return res.status(400).json(ServerResponse.clientError({}, 'Loan doesn\'t exist'));
            }


            let min : number = loan_info[0].min;
            let max : number = loan_info[0].max;
            let lender = loan_info[0].email

            let user_pending_loans : any= await knex.getAllUserLoans(email, 'IN_PROGRESS')
            let lender_info : any = await knex.getUserInfo(lender);



            if(amount < min || amount > max) {
                return res.status(400).json(ServerResponse.clientError({}, `Please enter an amount within the specified loan amount of N${min} and N${max}`));
            }

            if(user_pending_loans.length > 4) {
                return res.status(400).json(ServerResponse.clientError({}, 'We cannot proceed with your request because you have over 4 active loan'));
            }

            if(lender_info[0].wallet < amount){
                //lender is broke
                return res.status(400).json(ServerResponse.clientError({}, 'Lender cannot disburse money at the moment, try later'));
            }

           
            
            let debitLender = await knex.debitAccount(lender, amount)
            let creditBorrower = await knex.creditAccount(email, amount)

            if(debitLender && creditBorrower){
                //create loan


                let transactionA : TransactionInterface = {
                    email: lender,
                    amount: amount,
                    type: 'LOAN_DISBURSEMENT',
                    status: 'successful'
                }

                let transactionB : TransactionInterface = {
                    email: email,
                    amount: amount,
                    type: 'LOAN_APPROVAL',
                    status: 'successful'
                }

                let new_loan_data : LoanInfo = {
                    borrower: email,
                    amount: amount,
                    lender: lender,
                    interest: loan_info[0].interest_per_day,
                    days: loan_info[0].days,
                }
    
                await knex.saveLoanInfo(new_loan_data); 
                await knex.saveTransaction([transactionA, transactionB]);
   

                res.status(200).json(ServerResponse.success(new_loan_data, `Loan offer accepted successfully and you have also been credited N${amount}`));
            } else {
                //unable to proceed with debits and credits
                res.status(540).json(ServerResponse.serverError({}, 'Unable to proceed with loan request, contact the adminstrator'));
            }        
        } catch (err) {
            res.status(500).json(ServerResponse.serverError({}, 'Internal server error')); 
        }
    }

    loanRepayment = async (req: Request, res: Response) => {

        let email : string = (req as JWTInterface).email!;
        let account_type : string = (req as JWTInterface).account_type!;
        let {ID, amount} = req.body;

        //Flow
      
        try {

        } catch (err) {
            res.status(500).json(ServerResponse.serverError({}, 'Internal server error')); 
        }
    }


    listLoans = async (req: Request, res: Response) => {
        let email : string = (req as JWTInterface).email!;
        let account_type : string = (req as JWTInterface).account_type!;


        //Flow
        //Just get the options

        try {

            let current_page = parseInt(req.params.page)
            let skip = (current_page - 1) * 10
            let take = 10
    



           
            let total_loans : any = await knex.getLoanCount(account_type, email)
            let total_page : number = Math.ceil(total_loans[0]['count(*)'] / take);
    
            
            if(total_page == 0) {
                return res.status(400).json(ServerResponse.clientError({}, `No loans found on this page`));
            }

            if(current_page > total_page){
                return res.status(400).json(ServerResponse.clientError({}, `Current page cannot be greater than ${total_page}`));
            }

            let loans = await knex.getLoans(take, skip, account_type, email);

            
            res.status(200).json(ServerResponse.success({
                current_page: current_page,
                total_page: total_page,
                loans: loans
            }, 'User loans fetched'));   
        } catch (err) {
            res.status(500).json(ServerResponse.serverError({}, 'Internal server error'));
        }
    }


}