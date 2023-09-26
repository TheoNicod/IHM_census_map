const express = require('express');
const dotenv = require('dotenv');
const mysql = require('mysql');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Variables environnement
dotenv.config();

// Express
const app = express();
app.use(express.json()); // Middleware


// pictures upload
const fileStorageEngine = multer.diskStorage({
  destination: function (req, file, cb){
      cb(null, './public/Images')
  },
  filename: function (req, file, cb){
    cb(null, Date.now() + "--" + file.originalname);
  },
});
const upload = multer({storage : fileStorageEngine});

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



app.post("/upload", upload.single('image'), (req, res) => {

  const { latitude, longitude, type, desc, ville } = req.body;
  
  let imgPath = "";
  if(req.file) {
    const name = req.file.filename;
    imgPath = "Images/" + name
  }

  textModeration(desc).then(r => {
    if(r == 1) {
      res.redirect('/?success=undesirable');
    }else{
      //Effectuez l'insertion dans la base de données
      db.query('INSERT INTO point (longitude, latitude, image,  date, type, ville, description) VALUES (?, ?, ?, NOW(), ?, ?, ?)', [longitude, latitude, imgPath, type, ville, desc], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'insertion en base de données :', err);
            //res.status(500).json({ error: 'Erreur lors de l\'enregistrement en base de données.' });
            res.status(500).json({ error: err.message });
  
            return;
        }
        res.redirect('/?success=true');
      });
    }
  })
});

/*FILEPOND
app.post('/upload2', upload.single('image2'), (req, res) => {
  // Vérifiez si le fichier a été téléchargé avec succès
  console.log("BEGIN /upload");
});
*/


/**
 * param{text} String
 * 
 * return -1 : error, 0: ok, 1: ko
 */
async function textModeration(text) {
  return new Promise((resolve, reject) => {
    let dataText = new FormData();
    dataText.append('lang', 'fr');
    dataText.append('mode', 'ml');
    dataText.append('api_user', process.env.SIGHTENGINE_USER_API);
    dataText.append('api_secret', process.env.SIGHTENGINE_SECRET_API);
    dataText.append('text', text);

    console.log("TXT ==", text);
    axios({
      url: 'https://api.sightengine.com/1.0/text/check.json',
      method: 'post',
      data: dataText,
      headers: dataText.getHeaders(),
    })
      .then(function (response) {
        // on success: handle response
        //console.log(response.data);

        if (
          response.data.moderation_classes.sexual > 0.2 ||
          response.data.moderation_classes.discriminatory > 0.2 ||
          response.data.moderation_classes.insulting > 0.2 ||
          response.data.moderation_classes.violent > 0.2 ||
          response.data.moderation_classes.toxic > 0.2
        ) {
          resolve(1);
        } else {
          resolve(0);
        }
      })
      .catch(function (error) {
        // handle error
        if (error.response) console.log(error.response.data);
        else console.log(error.message);
        reject(error);
      });
  });
}



async function imageModeration(url) {
  return new Promise((resolve, reject) => {
    let dataImage = new FormData();
    dataImage.append('models', 'nudity-2.0,wad,offensive,gore,tobacco');
    dataImage.append('api_user', process.env.SIGHTENGINE_USER_API);
    dataImage.append('api_secret', process.env.SIGHTENGINE_SECRET_API);
    dataImage.append('media', fs.createReadStream(`${process.cwd()}/public/${url}`));

    axios({
      method: 'post',
      url:'https://api.sightengine.com/1.0/check.json',
      data: dataImage,
      headers: dataImage.getHeaders()
    })
    .then(function (response) {
      // on success: handle response
      console.log(response.data);

      if(checkIfGreaterThanPointTwo(response.data) == 1) {
        resolve(1);
      }else{
        resolve(0);
      }
      
    })

    .catch(function (error) {
      // handle error
      if (error.response) console.log(error.response.data);
      else console.log(error.message);
      reject(error);
    });
  });
}

// Fonction pour vérifier si une valeur est > 0.2
function checkIfGreaterThanPointTwo(obj) {
  for (const key in obj) {
    if (['media', 'none', 'context', 'request', 'status'].includes(key)) {
      continue; // Ignorer ces clés
    }
    if (typeof obj[key] === 'object') {
      if (checkIfGreaterThanPointTwo(obj[key])) {
        console.log("Image indésirable");
        return 1;
      }
    } else if (typeof obj[key] === 'number' && obj[key] > 0.2) {
      console.log("Image indésirable");
      return 1;
    }
  }
  console.log("RETURN 0 IMAGE");
  return 1;
}