const express = require('express');
const dotenv = require('dotenv');
const mysql = require('mysql');
const multer = require('multer');

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

// Créez une route pour exécuter la requête SELECT
app.get('/getUrgence', (req, res) => {
  db.query('SELECT * FROM urgence', (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête SELECT :', err);
      res.status(500).json({ error: 'Erreur lors de la requête SELECT' });
      return;
    }
    res.json(results);
  });
});

app.post("/upload", upload.none(), (req, res) => {
  const { latitude, longitude, type, desc, ville } = req.body;


  //Effectuez l'insertion dans la base de données
  db.query('INSERT INTO point (longitude, latitude, date, type, ville, description) VALUES (?, ?, NOW(), ?, ?, ?)', 
  [longitude, latitude, type, ville, desc], (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'insertion en base de données :', err);
      //res.status(500).json({ error: 'Erreur lors de l\'enregistrement en base de données.' });
      res.status(500).json({ error: err.message });
      return;
    }

    res.redirect('/?success=true');
  });
});

app.post("/uploadUrgence",upload.none(), (req, res) => {
  const { latitudeU, longitudeU, typeUrgence } = req.body;
  if(latitudeU == undefined) {
    res.redirect('/?success=false');
    return;
  }
  db.query('INSERT INTO urgence (longitude, latitude, date, type) VALUES (?, ?, NOW(), ?)', 
  [longitudeU, latitudeU, typeUrgence], (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'insertion en base de données :', err);
      //res.status(500).json({ error: 'Erreur lors de l\'enregistrement en base de données.' });
      res.status(500).json({ error: err.message });
      return;
    }
    res.redirect('/?success=true');
  });
})

// Ajoutez cette route pour gérer la suppression des points
app.post('/deletePoint', (req, res) => {
  console.log("delete ",req.body);
  const { id } = req.body;

  db.query('DELETE FROM point WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la suppression du point :', err);
      res.status(500).json({ success: false, error: 'Erreur lors de la suppression du point' });
      return;
    }

    res.json({ success: true });
  });
});
