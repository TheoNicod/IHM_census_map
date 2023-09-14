document.addEventListener("DOMContentLoaded", async function() {

    function getLocation() {
        let location = {};
        location.type = document.getElementById("type").value;
        location.description = document.getElementById("desc").value;

        return location;
    }

    function addLocation() {
        console.log("hello");
        let location = getLocation();

        fetch('/location', {method: 'PUT', headers: {'Content-type': 'application/json'}, body: JSON.stringify(location)});
    }

    var map = L.map('map', {
        center: [51.505, -0.09],
        zoom: 13
    });

    // // Définir les limites de la carte (au format LatLngBounds)
    // var southWest = L.latLng(40.712, -74.227); // Coordonnée sud-ouest
    // var northEast = L.latLng(40.774, -74.125); // Coordonnée nord-est
    // var bounds = L.latLngBounds(southWest, northEast);

    // // Appliquer les limites à la carte
    // map.setMaxBounds(bounds);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.on('click', function(e) {
        // Récupérer les coordonnées (latitude et longitude) du clic
        var lat = e.latlng.lat;
        var lng = e.latlng.lng;

        // Créer un marqueur et l'ajouter à la carte à l'emplacement du clic
        var marker = L.marker([lat, lng]).addTo(map);
    });

    let response = await fetch("/location");
    if(response.status == 200) {
        let data = await response.json();
        
        for(let i = 0; i < data.length; i++) {
            L.marker([data[i].longitude, data[i].latitude])
                .on("click", function(e) {
                    openMarker(data[i], e);
                })
                .addTo(map);
        }
    }

    function openMarker(data, e) {
        e.stopPropagation();
        e.preventDefault();
        console.log("OPENED MENNN");
        document.getElementById('opened-marker').classList.remove('hide');
    }

    function closed (object) {
        object.classList.add("hide");
        console.log("hello");
    }

    let close = document.getElementById("close");
    close.addEventListener("click", function(e) {
        close.classList.add("hide");
        console.log("coucoucocuocu");
    })
});
