import { LoanOptionsInterface } from '../interfaces/knex.interface.js';
import knexInstance from '../config/knex.js'


export class LoanOptionsHelper {

    createLoanOption = (data : LoanOptionsInterface) => {
        return new Promise<LoanOptionsInterface>((resolve, reject) => {
            knexInstance('loan_options').insert(data)
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

    getLoanOptinsCount = () => {
        return new Promise<LoanOptionsInterface>((resolve, reject) => {
            knexInstance('loan_options').count()
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


    getLoanOptions = (take : number, skip : number) => {
        return new Promise<LoanOptionsInterface>((resolve, reject) => {
            knexInstance('loan_options').select('ID', 'email', 'min', 'max', 'days', 'interest_per_day').limit(take).offset(skip).orderBy('ID', 'desc')
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

    getLoanOptionInfo = (ID : string) => {
        return new Promise<LoanOptionsInterface>((resolve, reject) => {
            knexInstance('loan_options').select('*').where('ID', ID)
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