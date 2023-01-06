import { NextFunction, Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/index.js';
import { ServerResponse } from "../config/response.js"
import { JWTInterface } from '../interfaces/knex.interface.js';



export interface JWTVerifyOptions {
    algorithm: string;
}

export default (req: Request, res: Response, next: NextFunction) => {
    let auth = req.headers.authorization;
    if (!auth) {
        res.status(401).json(ServerResponse.validationError({}, 'Authorization is required'));
    }

    let token : string = auth!.split(' ')[1];
  

    const options: JWTVerifyOptions = {
        algorithm: 'RS256'
    };
    
    
    jwt.verify(token, SECRET_KEY!, options, (error : Error, decoded : JWTInterface) => {
        if (error) {
            res.status(401).json(ServerResponse.validationError({}, 'Invalid authentication token'));
        }

        (req as JWTInterface).email = decoded.email;
        (req as JWTInterface).account_type = decoded.account_type;
        next();
    })
}