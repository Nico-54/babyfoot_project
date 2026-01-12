import { Router } from 'express';
import { login, register } from '../../controller/user/user.controller';

const router = Router();

// Route de création utilisateur
router.post('/register', register);
router.post('/login', login);

export default router;