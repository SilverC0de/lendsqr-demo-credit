import { DB } from '../config/index.js';
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
    saveUserInfo = (data : any) => {
        return new Promise<KnexORM>((resolve, reject) => {
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