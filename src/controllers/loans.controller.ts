import { Request, Response } from "express";
import { ServerResponse } from "../config/response.js";
import { LoansHelper } from "../helpers/loans.js";
import { LoanOptionsHelper } from "../helpers/loan_options.js";
import { UsersHelper } from "../helpers/users.js";
import { TransactionsHelper } from "../helpers/transactions.js";
import { JWTInterface } from "../interfaces/jwt.interface.js";
import { TransactionInterface, LoanOptionsInterface, LoanInfo } from "../interfaces/knex.interface.js";

const loansHelper = new LoansHelper();
const loanOptionsHelper = new LoanOptionsHelper();
const usersHelper = new UsersHelper();
const transactionsHelper = new TransactionsHelper();

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


            await loanOptionsHelper.createLoanOption(loan).then(() => {
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
    



            let total_options : any = await loanOptionsHelper.getLoanOptinsCount()
            let total_page : number = Math.ceil(total_options[0]['count(*)'] / take);
    
            
            if(total_page == 0) {
                return res.status(400).json(ServerResponse.clientError({}, `No loan options found on this page`));
            }

            if(current_page > total_page){
                return res.status(400).json(ServerResponse.clientError({}, `Current page cannot be greater than ${total_page}`));
            }

            let loan_options = await loanOptionsHelper.getLoanOptions(take, skip);

            
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


            let loan_info : any = await loanOptionsHelper.getLoanOptionInfo(ID);

            if(loan_info.length == 0){
                //loan info doesn't exist
                return res.status(400).json(ServerResponse.clientError({}, 'Loan doesn\'t exist'));
            }


            let min : number = loan_info[0].min;
            let max : number = loan_info[0].max;
            let lender = loan_info[0].email

            let user_pending_loans : any= await loansHelper.getAllUserLoans(email, 'IN_PROGRESS')
            let lender_info : any = await usersHelper.getUserInfo(lender);



            if(amount < min || amount > max) {
                return res.status(400).json(ServerResponse.clientError({}, `Please enter an amount within the specified loan amount of N${min} and N${max}`));
            }

            if(user_pending_loans.length > 4) {
                return res.status(400).json(ServerResponse.clientError({}, 'We cannot proceed with your request because you have over 4 active loan'));
            }

            if(lender_info[0].wallet < amount){
                //lender is broke
                return res.status(400).json(ServerResponse.clientError({}, 'Lender does not have up to requested amount for disbursement at the momnent'));
            }

           
            
            let debit_lender = await usersHelper.debitAccount(lender, amount)
            let credit_borrower = await usersHelper.creditAccount(email, amount)

            if(debit_lender && credit_borrower){
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
    
                await loansHelper.saveLoanInfo(new_loan_data); 
                await transactionsHelper.saveTransaction([transactionA, transactionB]);
   

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
        let {ID} = req.body;

        //Flow
        //1. Make sure the loan is still IN_PROGRESS
        //2. Calculate how much needs to be paid back
        //3. Check borrower's amount
      
        try {
            let single_loan : any = await loansHelper.getSingleLoan(email, ID);
            let user_info : any = await usersHelper.getUserInfo(email);


            if(single_loan == 0){
                return res.status(400).json(ServerResponse.clientError({}, 'Invalid loan ID')); 
            }


            let amount : number = parseInt(single_loan[0].amount);
            let status : string = single_loan[0].status;
            let interest : number = single_loan[0].interest;
            let days : number = single_loan[0].days;
            let lender : string = single_loan[0].lender;
            
        
            if(status != 'IN_PROGRESS'){
                return res.status(400).json(ServerResponse.clientError({}, 'Loan status must be IN_PROGRESS before you can make repayments')); 
            }


            let repayment_amount : any = amount + ((amount * (interest / 100)) * days);


            
            if(user_info[0].wallet < repayment_amount){
                //borrower is still broke
                return res.status(400).json(ServerResponse.clientError({}, `Please credit your account with up to N${repayment_amount} to proceed`));
            }



            let debit_borrower = await usersHelper.debitAccount(lender, repayment_amount)
            let credit_lender = await usersHelper.creditAccount(lender, repayment_amount)


            if(debit_borrower && credit_lender){
                //save transactions and update loan status


                let transactionA : TransactionInterface = {
                    email: lender,
                    amount: repayment_amount,
                    type: 'LOAN_REPAYMENT_CREDIT',
                    status: 'successful'
                }

                let transactionB : TransactionInterface = {
                    email: email,
                    amount: repayment_amount,
                    type: 'LOAN_REPAYMENT_DEBIT',
                    status: 'successful'
                }

               
    
                await loansHelper.updateLoanStatus(ID, 'COMPLETED'); 
                await transactionsHelper.saveTransaction([transactionA, transactionB]);
   
                res.status(200).json(ServerResponse.success(single_loan, `Loan repayment of N${repayment_amount} has been processed successfully`));
            } else {
                return res.status(400).json(ServerResponse.clientError({}, `Unable to complete repayment request`));
            }
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
    



           
            let total_loans : any = await loansHelper.getLoanCount(account_type, email)
            let total_page : number = Math.ceil(total_loans[0]['count(*)'] / take);
    
            
            if(total_page == 0) {
                return res.status(400).json(ServerResponse.clientError({}, `No loans found on this page`));
            }

            if(current_page > total_page){
                return res.status(400).json(ServerResponse.clientError({}, `Current page cannot be greater than ${total_page}`));
            }

            let loans = await loansHelper.getLoans(take, skip, account_type, email);

            
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