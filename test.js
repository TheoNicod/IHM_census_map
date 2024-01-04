const bcrypt = require('bcrypt');
const saltRounds = 10; // Coût du hachage (plus élevé est plus sécurisé mais prend plus de temps)

const password = 'test';
bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error('Erreur de hachage :', err);
    } else {
        console.log('Mot de passe haché :', hash);
    }
});