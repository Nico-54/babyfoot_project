import { Router } from 'express';
import { createTournament, allTournament, tournamentInfo, registerTournament, retiredTournament, checkUserTournament, addTeams } from '../../controller/tournament/tournament.controller';
import { authenticateToken, isAdmin, isPlayer } from '../../middleware/auth';

const router = Router();

// Création de tournoi
router.get('/', allTournament);
router.get('/info/:id', tournamentInfo);
router.post('/createTournament', authenticateToken, isAdmin, createTournament);
router.post('/registerTournament/:tournamentId', authenticateToken, isPlayer, registerTournament);
router.post('/retiredTournament/:tournamentId', authenticateToken, isPlayer, retiredTournament);
// Route permettant de savoir si l'utilisateur est inscrit ou non au tournoi
router.get('/:tournamentId/check-status', authenticateToken, checkUserTournament);
router.post('/:tournamentId/add-teams', authenticateToken, isAdmin, addTeams);

export default router;