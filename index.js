const express = require('express');
const dotenv = require('dotenv');
const mysql = require('mysql');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Variables environnement
dotenv.config({ path: '.env.local' });

// Express
const app = express();
app.use(express.json()); // Middleware

const upload = multer();

// Configuration de la connexion à la base de données
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connectez-vous à la base de données
db.connect(err => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('Connecté à la base de données MySQL');
});


const server = app.listen(process.env.SERVER_PORT, function() {
    console.log("En attente de connexion sur le port "+process.env.SERVER_PORT+" ...");
});

// Configuration d'express pour utiliser le répertoire "public"
app.use(express.static('public'));

app.get('/', function(req, res) {  
    res.sendFile(__dirname + '/public/carte.html');
});

/**
 * Routes
 */
// app.put('/location', function(req, res) {
//     console.log("Reçu : PUT /location/" + req.params.id);
//     console.log("body=" + JSON.stringify(req.body));
//     res.setHeader('Content-type', 'application/json');
//     res.json(req.body);

//     console.log(req.body);
// });


// Créez une route pour exécuter la requête SELECT
app.get('/getPoints', (req, res) => {
    db.query('SELECT * FROM point', (err, results) => {
      if (err) {
        console.error('Erreur lors de l\'exécution de la requête SELECT :', err);
        res.status(500).json({ error: 'Erreur lors de la requête SELECT' });
        return;
      }
      res.json(results);
    });
  });



  app.post("/upload", upload.none(), (req, res) => {

    const { latitude, longitude, type,  ville } = req.body;
    //const name = req.file.filename;
    //const imgPath = "Images/" + name
  
    //Effectuez l'insertion dans la base de données
    db.query('INSERT INTO point (longitude, latitude, date, type, ville) VALUES (?, ?, NOW(), ?, ?)', 
    [longitude, latitude, type, ville], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'insertion en base de données :', err);
            //res.status(500).json({ error: 'Erreur lors de l\'enregistrement en base de données.' });
            res.status(500).json({ error: err.message });
  
            return;
        }
        res.redirect('/?success=true');
    });
  });