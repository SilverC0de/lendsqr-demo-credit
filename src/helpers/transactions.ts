import { TransactionInterface } from '../interfaces/knex.interface.js';
import knexInstance from '../config/knex.js'


export class TransactionsHelper {
    getUserTransactionsCount = (email: string) => {
        return new Promise<TransactionInterface>((resolve, reject) => {
            knexInstance('transactions').count().where('email', email)
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


    getUserTransactions = (take : number, skip : number, email: string) => {
        return new Promise<TransactionInterface>((resolve, reject) => {
            knexInstance('transactions').select('ID', 'email', 'amount', 'recipient', 'bank_code', 'bank_name', 'bank_nuban', 'type', 'status').where('email', email).limit(take).offset(skip).orderBy('ID', 'desc')
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


    saveTransaction = (data : any) => {
        return new Promise<TransactionInterface>((resolve, reject) => {
            knexInstance('transactions').insert(data)
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
}