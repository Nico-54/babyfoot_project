import { Router } from 'express';
import { registerTournament, allTournament, tournamentInfo } from '../../controller/tournament/tournament.controller';
import { authenticateToken, isAdmin } from '../../middleware/auth';

const router = Router();

// Création de tournoi
router.get('/', allTournament);
router.get('/info/:id', tournamentInfo);
router.post('/register', authenticateToken, isAdmin, registerTournament);

export default router;