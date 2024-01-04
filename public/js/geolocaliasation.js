    // Sélectionnez les champs d'entrée du formulaire
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');

    // Vérifiez si le navigateur prend en charge la géolocalisation
    if ("geolocation" in navigator) {
        // Demandez la géolocalisation de l'utilisateur
        navigator.geolocation.getCurrentPosition(function(position) {
            // Obtenez les coordonnées de la position
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // Mettez les coordonnées dans les champs d'entrée du formulaire
            latitudeInput.value = latitude;
            longitudeInput.value = longitude;
        });
    } else {
        alert("Geolocation is not available in this browser.");
    }

    function viewMap()
   {
        document.querySelector('.title').classList.remove("activeCart");
        document.querySelector('.form-container').classList.add("activeCart");
        document.getElementById("formUrgence").classList.add("activeCart");
        document.querySelector('.header-bar').classList.remove("activeCart");
   }