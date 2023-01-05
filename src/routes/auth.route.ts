import { Router } from 'express';
import { check } from 'express-validator'
import validator from '../middlewares/validator.js';
import { AuthController } from '../controllers/auth.controller.js';

const auth      : AuthController = new AuthController;
const router    : Router = Router();

router.post('/register',  [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('name').isString().isLength({ min: 2, max: 40}).withMessage('Enter a valid name'),
    check('password').isStrongPassword({
        minLength: 6,
        minLowercase: 0,
        minUppercase: 0,
        minNumbers: 0,
        minSymbols: 0,
      }).withMessage('Enter a valid password more than 6 characters'),
    check('phone_number').isLength({min : 10, max: 14}).withMessage('Enter a valid phone number'),
    check('account_type').notEmpty().isIn(['borrower', 'lender']).withMessage('Account type must be borrower or lender')
], validator, auth.registerUser);


export const AuthRoutes: Router = router;