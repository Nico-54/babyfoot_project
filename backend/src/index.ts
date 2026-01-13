import express from 'express';
import cors from 'cors';

// Import des routes
import userRoutes from './routes/user/user.routes'
import tournamentRoutes from './routes/tournament/tournament.routes'

const app = express();
app.use(cors()); // Autorise Nuxt à parler au Backend
app.use(express.json()); // Permet de lire le JSON envoyé

// Déclaration des routes
app.use('/api/users', userRoutes)
app.use('/api/tournaments', tournamentRoutes)

// Route pour la santé
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'L\'api répond présent'})
})

const PORT = 5000
app.listen(PORT, () => {
  console.log(`Serveur REST prêt sur http://localhost:${PORT}`)
})