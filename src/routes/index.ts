import { Router } from 'express';
import { AuthRoutes } from './auth.route.js';
import { TransactionRoutes } from './transaction.route.js';

const router: Router = Router();


router.use('/auth', AuthRoutes);
router.use('/transaction', TransactionRoutes);

export const AllRoutes: Router = router;