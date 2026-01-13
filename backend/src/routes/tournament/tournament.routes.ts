import { Router } from 'express';
import { registerTournament, allTournament } from '../../controller/tournament/tournament.controller';
import { authenticateToken, isAdmin } from '../../middleware/auth';

const router = Router();

// Création de tournoi
router.get('/', allTournament);
router.post('/register', authenticateToken, isAdmin, registerTournament);

export default router;