# Installation

- git clone the project

# Setup the database

```sql 
CREATE DATABASE IHM

CREATE TABLE `point` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `longitude` decimal(10,6) NOT NULL,
  `latitude` decimal(10,6) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `ville` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `point` VALUES
(1,-8.008889,31.630000,'Images/incendiee.png','2023-09-16','Incendie','Marrakech',
'Incendie au centre ville, un batiment a pris feux'),
(2,-9.598107,30.427755,'Images/seisme.jpg','2023-09-16','Séisme','Agadir',
'Un séisme dévastateur qui a provoqué des éboulements'),
(3,-7.480000,31.260000,'Images/seisme.jpg','2023-09-16','Séisme','Anza',
'Un immobles s\'effondrea cause d\'un séisme'),
(4,-5.833954,35.759465,'Images/innondation.jpg','2023-09-16','Innondation','Tanger',
'Un barrage a cédé innondant la ville'),
(5,-6.849813,33.971590,'Images/incendie.jpg','2023-09-16','Incendie','Rabat',
'Le feu a ravagé le batiment'),
(65,7.752571,48.583746,'Images/1694874440445--seisme.jpg','2023-09-16','Séismes','Strasbourg',
'Un séisme dévastateur'),
(66,2.324638,48.863461,'Images/1694874468930--innondation.jpg','2023-09-16','Inondations','Paris',
'Un barrage a cédé');
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



