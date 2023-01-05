import { Router } from 'express';
import { check } from 'express-validator'
import { TransactionController } from '../controllers/transaction.controller.js'; 
import validator from '../middlewares/validator.js';
import authentication from '../middlewares/authentication.js';

const transaction      : TransactionController = new TransactionController;
const router    : Router = Router();

router.post('/internal',  [
    check('to').isEmail().withMessage('Enter a valid email address'),
    check('amount').isInt({ min: 100, max: 200000 }).withMessage('Please enter a valid amount between N100 and 200k')
], validator, authentication, transaction.internalTransfer);



export const TransactionRoutes: Router = router;