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


router.post('/withdraw',  [
    check('bank_holder').not().isEmpty().trim().withMessage('Enter a valid recipient name'),
    check('bank_name').not().isEmpty().trim().withMessage('Enter a valid bank'),
    check('bank_nuban').isNumeric().isLength({min : 10, max : 10}).withMessage('Invalid account number'),
    check('amount').isInt({ min: 100, max: 200000 }).withMessage('Please enter a valid amount between N100 and 200k')
], validator, authentication, transaction.externalTransfer);


router.post('/deposit',  [
    check('amount').isInt({ min: 100, max: 50000 }).withMessage('Please enter a valid amount between N100 and 50k')
], validator, authentication, transaction.deposit);


router.get('/:page', [
    check('page').isInt({ min: 1 }).withMessage('Enter a valid page number')
], validator, authentication, transaction.listTransactions)



export const TransactionRoutes: Router = router;