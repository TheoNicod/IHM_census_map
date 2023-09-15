document.addEventListener("DOMContentLoaded", async function() {

    var myLat = undefined;
    var myLng = undefined;

    var atMyPosition = false;

    // Création de la map
    var map = L.map('map', {
        center: [51.505, -0.09],
        zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Gestion de la géolocalisation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            myLat = position.coords.latitude;
            myLng = position.coords.longitude;
            map.setView([myLat, myLng], 12);
        });
    } else {
        // La géolocalisation n'est pas prise en charge par le navigateur
        alert("La géolocalisation n'est pas prise en charge par votre navigateur.");
    }

    // Demande toutes les localisations au serveur et les affiches sur le map (TODO optimisations : ne pas charger toutes les localisations en même temps (trop lourd s'il y beaucoup de points))
    let response = await fetch("/location");
    if(response.status == 200) {
        let data = await response.json();
        for(let i = 0; i < data.length; i++) {
            L.marker([data[i].latitude, data[i].longitude])
                .on("click", function(e) {
                    openMarker(data[i]);
                })
                .addTo(map);
        }
    }

    var lat = 0;
    var lng = 0;
    // Récupération de la position au clique sur la map
    map.on('click', function(e) {
        lat = e.latlng.lat;
        lng = e.latlng.lng;

        document.getElementById("form").classList.remove("hide"); // TODO : désactiver les evenements sur la map lorque le form est ouvert
        atMyPosition = false;
    });

    // Gère le bouton "Add to my position"
    document.getElementById("add-my-position").addEventListener("click", function() {
        if(myLat == undefined || myLng == undefined) {
            alert("Veuillez autoriser ce site à accéder à votre géolocation");
        }else{
            document.getElementById("form").classList.remove("hide");
            atMyPosition = true;
        }
    })
    
    // Gère le bouton add du formulaire
    document.getElementById("submit-form").addEventListener("click", function(event) {
        event.preventDefault();
        event.stopPropagation();

        let location = getLocation();

        if(atMyPosition) {
            location.longitude = myLng;
            location.latitude = myLat;
        }else{
            location.longitude = lng;
            location.latitude = lat;
        }
        
        // Envoie les infos au serveur
        fetch('/location', {method: 'PUT', headers: {'Content-type': 'application/json'}, body: JSON.stringify(location)});

        // Ajout du markers sur la map
        L.marker([lat, lng])
        .on("click", function(e) { // Ajout d'une fonction au clique sur un marker
            openMarker(location);
        })
        .addTo(map);
        document.getElementById("form").classList.add("hide");
    })

    // Gère la fermeture des fenêtres
    let close = document.getElementsByClassName("close");
    for (let i = 0; i < close.length; i++) {
        let cl = close[i];
        cl.addEventListener("click", function() {
            cl.parentNode.classList.add("hide");
        });
    }

    /** Récupère les informations du formulaire 
     * 
     * @returns Object location
     */
    function getLocation() {
        let location = {};
        location.type = document.getElementById("type").value;
        location.description = document.getElementById("desc").value;
        location.image = "";

        return location;
    }

    /** Ouvre la fenêtre d'informations sur la position cliquée et affiche les infos
     * 
     * @param {*} data Les infos à afficher
     */
    function openMarker(data) {
        document.getElementById('opened-marker').classList.remove('hide');
        document.getElementById("type-info").textContent = data.type;
        // document.getElementById("image-info").textContent = data.type;
        document.getElementById("desc-info").textContent = data.description;
    }
});
