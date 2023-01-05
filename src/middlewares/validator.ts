import { NextFunction, Request, Response, Router } from 'express';
import { validationResult} from 'express-validator'
import { ServerResponse } from "../config/response.js"


export default (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(422).json(ServerResponse.validationError(errors, 'One or more errors were encountered'));
    } else next();
}