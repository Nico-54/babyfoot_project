import { Router } from 'express';
import { register } from '../../controller/user/user.controller';

const router = Router();

// Route de création utilisateur
router.post('/register', register);

export default router;