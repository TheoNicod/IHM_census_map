const express = require('express');
const dotenv = require('dotenv');
const database = require('./database');

const app = express();
app.use(express.json()); // Middleware

dotenv.config();

const server = app.listen(process.env.SERVER_PORT, function() {
    console.log("En attente de connexion sur le port "+process.env.SERVER_PORT+" ...");
});

// Configuration d'express pour utiliser le répertoire "public"
app.use(express.static('public'));
 
app.get('/', function(req, res) {  
    res.sendFile(__dirname + '/public/carte.html');
});

database.connexion();

/**
 * Routes
 */
app.put('/location', function(req, res) {
    console.log("Reçu : PUT /location");
    console.log("body=" + JSON.stringify(req.body));
    res.setHeader('Content-type', 'application/json');
    
    database.addLocation(req.body);
});

app.get('/location', function(req, res) { // Location des markers seulement (sans les infos "type" "url"...)
    console.log("Reçu : GET /location");
    res.setHeader('Content-type', 'application/json');

    // Récupération de toutes les position des markers
    database.getPositionMarkers().then(function(data) {
        res.json(data); 
    })
    
})