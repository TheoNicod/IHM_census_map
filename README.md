# Installation

- git clone the project

# Setup the database

```sql 
-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 12 oct. 2023 à 11:15
-- Version du serveur : 8.0.31
-- Version de PHP : 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `ihm`
--

-- --------------------------------------------------------

--
-- Structure de la table `point`
--

DROP TABLE IF EXISTS `point`;
CREATE TABLE IF NOT EXISTS `point` (
  `id` int NOT NULL AUTO_INCREMENT,
  `longitude` decimal(10,6) NOT NULL,
  `latitude` decimal(10,6) NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date` date DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ville` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `point`
--

INSERT INTO `point` (`id`, `longitude`, `latitude`, `image`, `date`, `type`, `ville`, `description`) VALUES
(71, '-9.203796', '38.636174', NULL, '2023-10-08', 'Storms', 'Almada', 'Torrential rains causing severe flooding.'),
(72, '13.351135', '38.135616', NULL, '2023-10-11', 'Flooding', 'Palerme', 'River overflow causing flooding.'),
(73, '-114.082031', '36.810926', NULL, '2023-09-02', 'Fires', 'Mesquite', 'Smoke and ash covering the area.'),
(74, '-10.074463', '28.993674', NULL, '2023-10-07', 'Earthquakes', 'Guelmim', 'Earthquake'),
(75, '140.814514', '35.729753', NULL, '2023-10-11', 'Tsunami', 'Chōshi', 'Massive waves approaching coastal areas.'),
(77, '14.345398', '41.081412', NULL, '2023-09-11', 'Volcanic eruption', 'Caserte', 'Volcanic eruption with ash clouds and lava flows.'),
(78, '-43.461914', '-22.959008', NULL, '2023-10-01', 'Storms', 'Rio de Janeiro', 'Destruction of buildings and widespread power outages.'),
(79, '7.338181', '47.746241', NULL, '2023-10-12', 'Storms', 'Mulhouse', 'Torrential rains causing severe flooding.'),
(80, '7.312603', '47.741628', NULL, '2023-10-12', 'All', 'Mulhouse', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
CREATE TABLE IF NOT EXISTS `utilisateur` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom_utilisateur` varchar(255) NOT NULL,
  `mdp` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `nom_utilisateur`, `mdp`) VALUES
(1, 'admin', '$2b$10$fg/rxuKcPVWx1crdKchYPOrRkppjXtxb4odsTynf3JMEb9ktLlqIG'),
(2, 'test', '$2b$10$cQvT.Bkz3sYIdsMzEJ8Tnuxf5KVIs3HIq8Lsb/ZDbevjlLgEkbIJ2');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
```

- Edit the .env file and enter your database password.

# Setup the projetc

- cd NodeJS_ImageMapExplorer
- npm install
- npm i
- node index.js
- in your navigator type 127.0.0.1:8000

![1](https://github.com/TheoNicod/IHM_census_map/assets/120946916/65a53fd5-9dcf-4584-bd45-720543701475)

![2](https://github.com/TheoNicod/IHM_census_map/assets/120946916/f5339942-5d1b-44ba-acb7-f18650b0c7ab)


![3](https://github.com/TheoNicod/IHM_census_map/assets/120946916/0137b939-95f0-4b66-a0cd-1d68d8562810)


![4](https://github.com/TheoNicod/IHM_census_map/assets/120946916/5dc4e568-aba3-4b98-8423-451b636d77f3)

![5](https://github.com/TheoNicod/IHM_census_map/assets/120946916/ce859d46-12ef-4a1a-b2e2-c926478a9013)



