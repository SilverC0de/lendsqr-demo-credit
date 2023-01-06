import { Router } from 'express';
import { check } from 'express-validator'
import { UserController } from '../controllers/user.controller.js'; 
import validator from '../middlewares/validator.js';
import authentication from '../middlewares/authentication.js';

const user      : UserController = new UserController;
const router    : Router = Router();

router.get('/', authentication, user.userInfo)


export const UserRoutes: Router = router;