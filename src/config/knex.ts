import { DB } from '../config/index.js';
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

export default knexInstance;