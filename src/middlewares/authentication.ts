import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/index.js';
import { ServerResponse } from "../config/response.js"
import { JWTInterface } from '../interfaces/jwt.interface.js';


export default (req: Request, res: Response, next: NextFunction) => {
    let auth = req.headers.authorization;
    if (!auth || auth == null || auth == undefined) {
        return res.status(401).json(ServerResponse.validationError({}, 'Authorization is required'));
    }

    let token : string = auth!.split(' ')[1];
  
    const JWT_OPS : any = {
        algorithm: 'RS256'
    };
    
    
    jwt.verify(token, SECRET_KEY!, JWT_OPS, (error : any, decoded : any) => {
        if (error) {
            res.status(401).json(ServerResponse.validationError({}, 'Invalid authentication token'));
        }

        (req as JWTInterface).email = decoded.email;
        (req as JWTInterface).account_type = decoded.account_type;
        next();
    })
}