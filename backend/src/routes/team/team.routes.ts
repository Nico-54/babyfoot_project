import { Router } from 'express';
import { allTeam, createTeam } from '../../controller/team/team.controller';
import { authenticateToken, isAdmin } from '../../middleware/auth';

const router = Router();

// Création de tournoi
router.get('/', allTeam);
router.post('/createTeam', authenticateToken, isAdmin, createTeam);

export default router;