# Application de gestion de tournois de baby-foot

## Contexte
Test technique réalisé dans le cadre d’un processus de recrutement.

Le temps estimé du test était d’environ 2h.
J’ai volontairement dépassé cette estimation afin de proposer une base fonctionnelle,
structurée et exploitable, en priorisant la qualité du code et l’architecture.

## Fonctionnalités implémentées
- Création de tournois (admin)
- Création d’équipes (admin)
- Association d’équipes à un tournoi (admin)

## Fonctionnalités partiellement implémentées
- Début d’un système d’authentification (pensé initialement pour des utilisateurs non-admin)

## Fonctionnalités non implémentées
- Génération automatique des matchs
- Saisie des scores
- Classement
- Gestion des rôles (admin / utilisateur)
- Tests unitaires / e2e

### Note
Des commentaires `// TODO` sont présents dans le code pour identifier les évolutions fonctionnelles et techniques prévues.

## Améliorations futures
- Ouverture de l’inscription aux tournois pour des utilisateurs non-admin
- Sécurisation de l’API
- Validation avancée des données

## Choix techniques
- Frontend : vueJs/nuxt
- Backend : nodeJs/Express avec ORM Prisma
- Base de données : PostgreSQL
- Documentations Nuxt, TailwindCSS, Prisma
- Utilisation d'IA : Gemini, Claude, ChatGpt

## Temps passé
Environ 3 jours (temps dépassant volontairement l’estimation initiale).

## Setup
Cloner le projet

```bash
git clone <url_projet>
```

Installation des dépendances (à la racine du projet et dans le dossier backend)

```bash
# npm
npm install
```

Initialisation le client Nuxt : utile afin d'éviter que votre terminal VSCode affiche de nombreux problèmes liés à Nuxt

```bash
npx nuxi prepare
```

Génération du client Prisma (dossier backend) : utile afin d'éviter que votre terminal VSCode affiche de nombreux problèmes liés à Prisma 

```bash
npx prisma generate 
```

Créer un fichier .env dans le dossier backend et copier coller le contenu du .env.example
Vous aurez la strucutre de votre '.env'. Pensez à remplacer les informations par les données trouvable dans le fichier docker-copose.yml

Pour 'JWT_SECRET', il vous servira à signer le token lors de la connexion.

## Lancement de Docker
Afin de pouvoir accéder au siteweb, lancer vos conteneurs Docker

```bash
docker compose up --build -d
```

Pour stopper les conteneurs et les supprimer

```bash
docker compose down
```

## Modifications Prisma
Au seins du dossier `backend/prisma`, vous trouverez un fichier nommé 'schema.prisma'.
Ce dernier représente tout le schéma de la base de données.
Vousd trouverez égalemment le dossier 'migration' qui permet de suivre l'évolution de la base de donnée.
Note : Pensez à bien lancer vos conteneurs Docker avant cette commande.

Afin de reconstuire la base de donnée dans votre conteneur Docker,
```bash
docker compose exec backend npx prisma migrate dev --name <nom_migration>
```

Note : Si vous aviez des données dans la base, elles risque d'être supprimées.


Si vous souhaitez modifier le fichier 'schema.prisma', pensez à générer une migration

```bash
npx prisma migrate dev --name <nom_migration>
```

Et appliquer la migration dans le conteneur sans suppression de données
```bash
docker compose exec backend npx prisma db push
```

## Visualisation des données
Prisma offre un outil pratique afin de consulter les données présente dans la base : Prisma Studio.
Il est accessible via cette commande :

```bash
docker compose exec backend npx prisma studio
```