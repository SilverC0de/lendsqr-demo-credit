import { Router } from 'express';
import { AuthRoutes } from './auth.route.js';

const router: Router = Router();


router.use('/auth', AuthRoutes);

export const AllRoutes: Router = router;