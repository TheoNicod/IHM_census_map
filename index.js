const express = require('express');
const dotenv = require('dotenv');

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


/**
 * Routes
 */
app.put('/location', function(req, res) {
    console.log("Reçu : PUT /location/" + req.params.id);
    console.log("body=" + JSON.stringify(req.body));
    res.setHeader('Content-type', 'application/json');
    res.json(req.body);

    console.log(req.body);
    // add_velo_to_list(req.params.id, req.body.cadre, req.body.options);
});