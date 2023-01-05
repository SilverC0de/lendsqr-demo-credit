import { DB } from "./";
import knex from "knex";
import { UserDataType } from "../types/user";

const config = {
    client: "mysql",
    connection: {
        host: DB.HOST,
        user: DB.USER,
        password: DB.PASSWORD,
        database: DB.DATABASE
    }
};
const knexInstance = knex(config);

export class KnexORM {
    saveUserInfo = (data: UserDataType) => {
        return new Promise<UserDataType>((resolve, reject) => {
            knexInstance("users")
                .insert(data)
                .then(() => {
                    resolve(data);
                })
                .catch((e) => {
                    reject(e);
                })
                .finally(async () => {
                    await knexInstance.destroy();
                });
        });
    };
}
