import { DB } from '../config/index.js';
import { UserInterface, TransactionInterface } from '../interfaces/knex.interface.js';
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
                knexInstance.destroy();
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
                knexInstance.destroy();
            });
        })
    }
}