import { DB } from '../config/index.js';
import { UserInterface, TransactionInterface, LoanOptionsInterface, LoanInfo } from '../interfaces/knex.interface.js';
import knex from 'knex';


const config = {
    client: 'mysql',
    connection: {
        host: DB.HOST,
        user: DB.USER,
        password: DB.PASSWORD,
        database: DB.DATABASE,
        multipleStatements: true
    }
};
const knexInstance = knex.default(config);



export class KnexORM {
    getUserInfo = (email : string) => {
        return new Promise<UserInterface>((resolve, reject) => {
            knexInstance('users').select('email', 'password', 'name', 'phone_number', 'wallet', 'account_type').where('email', email)
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

    saveUserInfo = (data : UserInterface) => {
        return new Promise<UserInterface>((resolve, reject) => {
            knexInstance('users').insert(data)
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
        return new Promise<KnexORM>((resolve, reject) => {
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
        return new Promise<KnexORM>((resolve, reject) => {
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
        return new Promise<KnexORM>((resolve, reject) => {
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
        return new Promise<KnexORM>((resolve, reject) => {
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
        return new Promise<KnexORM>((resolve, reject) => {
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

    getUserTransactionsCount = (email: string) => {
        return new Promise<KnexORM>((resolve, reject) => {
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
        return new Promise<KnexORM>((resolve, reject) => {
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


    debitAccount = (email: string, amount : number) => {
        return new Promise<TransactionInterface>((resolve, reject) => {
            //raw query for ledger transactions

            knexInstance.raw(`INSERT INTO ledger(email, amount_before, amount, amount_after, type) VALUES ('${email}', (SELECT wallet FROM users WHERE email = '${email}'), ${amount}, (SELECT wallet FROM users WHERE email = '${email}') - ${amount}, 'DEBIT');
            UPDATE users SET wallet = wallet - ${amount} WHERE email = '${email}' AND wallet >= ${amount}`) 
            .then((data) => {
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

    creditAccount = (email: string, amount : number) => {
        return new Promise<TransactionInterface>((resolve, reject) => {
            //raw query for ledger transactions

            knexInstance.raw(`INSERT INTO ledger(email, amount_before, amount, amount_after, type) VALUES ('${email}', (SELECT wallet FROM users WHERE email = '${email}'), ${amount}, (SELECT wallet FROM users WHERE email = '${email}') + ${amount}, 'CREDIT');
            UPDATE users SET wallet = wallet + ${amount} WHERE email = '${email}'`) 
            .then((data) => {
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