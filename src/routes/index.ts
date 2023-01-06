import { Router } from 'express';
import { AuthRoutes } from './auth.route.js';
import { LoansRoutes } from './loans.route.js';
import { TransactionRoutes } from './transaction.route.js';
import { UserRoutes } from './user.route.js';

const router: Router = Router();


router.use('/auth', AuthRoutes);
router.use('/transaction', TransactionRoutes);
router.use('/loans', LoansRoutes);
router.use('/user', UserRoutes);

export const AllRoutes: Router = router;