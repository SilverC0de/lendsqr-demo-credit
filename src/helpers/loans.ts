import { LoanInfo } from '../interfaces/knex.interface.js';
import knexInstance from '../config/knex.js'


export class LoansHelper {
    getSingleLoan = (email: string, ID : number) => {
        return new Promise<LoanInfo>((resolve, reject) => {
            knexInstance('loans').select('ID', 'borrower', 'lender', 'amount', 'interest', 'days', 'status', 'created_at').where('ID', ID).andWhere('borrower', email)
            .then((data : any) => {
                resolve(data)
            })
            .catch((e) => { 
                reject(e)
            })
            .finally(() => {
                //knexInstance.destroy();
            });
        })
    }

    getAllUserLoans = (email : string, status: string) => {
        return new Promise<LoanInfo>((resolve, reject) => {
            knexInstance('loans').select('*').where('borrower', email).andWhere('status', status)
            .then((data : any) => {
                resolve(data)
            })
            .catch((e) => { 
                reject(e)
            })
            .finally(() => {
                //knexInstance.destroy();
            });
        })
    }

    saveLoanInfo = (data : LoanInfo) => {
        return new Promise<LoanInfo>((resolve, reject) => {
            knexInstance('loans').insert(data)
            .then(() => {
                resolve(data)
            })
            .catch((e) => { 
                reject(e)
            })
            .finally(() => {
                //knexInstance.destroy();
            });
        })
    }

    updateLoanStatus = (ID : number, status: string) => {
        return new Promise<LoanInfo>((resolve, reject) => {
            knexInstance('loans').update('status', status).where('ID', ID)
            .then((data : any) => {
                resolve(data)
            })
            .catch((e) => { 
                reject(e)
            })
            .finally(() => {
                //knexInstance.destroy();
            });
        })
    }


    getLoanCount = (account_type: string, email: string) => {
        return new Promise<LoanInfo>((resolve, reject) => {
            knexInstance('loans').count().where(account_type, email)
            .then((data : any) => {
                resolve(data)
            })
            .catch((e) => { 
                reject(e)
            })
            .finally(() => {
                //knexInstance.destroy();
            });
        })
    }


    getLoans = (take : number, skip : number, account_type: string, email: string) => {
        return new Promise<LoanInfo>((resolve, reject) => {
            knexInstance('loans').select('ID', 'borrower', 'lender', 'amount', 'interest', 'days', 'status', 'created_at').where(account_type, email).limit(take).offset(skip).orderBy('ID', 'desc')
            .then((data : any) => {
                resolve(data)
            })
            .catch((e) => { 
                reject(e)
            })
            .finally(() => {
                //knexInstance.destroy();
            });
        })
    }

}