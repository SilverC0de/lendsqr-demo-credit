import { DB } from '../config/index.js';
import { UserInterface } from '../interfaces/knex.interface.js';
import knex from 'knex';


const config = {
    client: 'mysql',
    connection: {
        host: DB.HOST,
        user: DB.USER,
        password: DB.PASSWORD,
        database: DB.DATABASE
    }
};
const knexInstance = knex.default(config);



export class KnexORM {
    getUserInfo = (email : string) => {
        return new Promise<JSON[]>((resolve, reject) => {
            knexInstance('users').select('email', 'password', 'name', 'phone_number', 'wallet', 'account_type').where('email', email)
            .then((data : JSON[]) => {
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

    saveUserInfo = (data : any) => {
        return new Promise<JSON[]>((resolve, reject) => {
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
}