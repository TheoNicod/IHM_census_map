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
 * Récupération de la position des markers au lancement du serveur
 */
// demande à la base la pos de tous les markers
var markers = [{ id: 1, long: 0.8787, lat: 0.7676 }, { id: 2, long: 0.9999, lat: 0.11111 }];


/**
 * Routes
 */
app.put('/location', function(req, res) {
    console.log("Reçu : PUT /location");
    console.log("body=" + JSON.stringify(req.body));
    res.setHeader('Content-type', 'application/json');

    // res.json(req.body);
    let location = {
        longitude: 0.010101,
        latitude: 0.101010,
        image: "picture.png",
        description: req.body.description,
        type: req.body.type,
    }
    database.addLocation(location);

});

app.get('/location', function(req, res) { // Location des markers seulement (sans les infos "type" "url"...)
    console.log("Reçu : GET /location");
    res.setHeader('Content-type', 'application/json');

    // Récupération de toutes les position des markers
    database.getPositionMarkers().then(function(data) {
        res.json(data); 
    })
    
})

app.get('/location/:id', function(req, res) { // Location des markers seulement (sans les infos "type" "url"...)
    console.log("Reçu : GET /location");
    res.setHeader('Content-type', 'application/json');

    // demande à la base les infos d'un marker selon 1 id
    // on recup l'id avec req.params.id

    res.json(markers); // Envoi de la réponse au client
})



