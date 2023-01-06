import { Router } from 'express';
import { check } from 'express-validator'
import { LoansController } from '../controllers/loans.controller.js'; 
import validator from '../middlewares/validator.js';
import authentication from '../middlewares/authentication.js';

const loans      : LoansController = new LoansController;
const router    : Router = Router();

router.post('/create',  [
    check('min').isInt({ min: 1000 }).withMessage('Min amount should be more than N1000'),
    check('max').isInt({ max: 200000 }).withMessage('Min amount should be less than N200k'),
    check('days').isInt({ min: 1, max: 365 }).withMessage('Soecify a tenure between 1 day and a year'),
    check('interest_per_day').isInt({ min: 1, max: 20 }).withMessage('Interest per day should be between 1% and 20%')
], validator, authentication, loans.createLoan);

router.get('/options/:page', [
    check('page').isInt({ min: 1 }).withMessage('Enter a valid page number')
], validator, authentication, loans.listOptions)


export const LoansRoutes: Router = router;