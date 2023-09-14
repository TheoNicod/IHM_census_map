const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

var pool = undefined;

async function connexion() {
    try {
        pool = mysql.createPool({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME
        }).promise();
    } catch (error) {
        console.error('Erreur lors de la connexion à la base de données:', error);
    }
}

async function addLocation(location) {
    const dateActuelle = new Date(); // TODO : UTC
    const annee = dateActuelle.getFullYear();
    const mois = (dateActuelle.getMonth() + 1).toString().padStart(2, '0');
    const jour = dateActuelle.getDate().toString().padStart(2, '0');
    const heure = dateActuelle.getHours().toString().padStart(2, '0');
    const minutes = dateActuelle.getMinutes().toString().padStart(2, '0');
    const secondes = dateActuelle.getSeconds().toString().padStart(2, '0');
    const date = `${annee}-${mois}-${jour} ${heure}:${minutes}:${secondes}`;
    console.log(date);

    try {
        const [rows] = await pool.query(
            `
            INSERT INTO point (longitude, latitude, image, date, description, type)
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [location.longitude, location.latitude, location.image, date, location.description, location.type]
        );
        return rows;
    } catch (error) {
        console.error('Erreur lors de l\'ajout d\'une location:', error);
        return null;
    }
}

async function getPositionMarkers() {
    try {
        const [rows] = await pool.query(
            `
            SELECT *
            FROM point
            `
        );
        return rows;
    } catch(error) {
        console.log("Erreur lors de getPositionMarkers");
        return null;
    }
}



module.exports = {
    connexion: connexion,
    addLocation: addLocation,
    getPositionMarkers: getPositionMarkers,
};