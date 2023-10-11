let tableauMarqueurs = [];
        
    
// Exécutez une requête HTTP vers votre API
fetch('/getPoints')
  .then(response => response.json())
  .then(data => {
    console.log('Résultats de la requête SELECT :', data);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
          var userLat = position.coords.latitude;
          var userLng = position.coords.longitude;
          console.log(userLat);
          console.log(userLng);
          
      });
  } else {
      console.log("Geolocation is not available in this browser.");
  }
  

    // Traitement des données ici
    const villes = data;

    //On initialise la carte
    //var carte = L.map('maCarte').setView([31.630000, -8.008889], 13);

    let carte = L.map('maCarte', {
          worldCopyJump : true
    }); // Initialize the map without a center or zoom level

    // Filtres
    const filterButton = document.getElementById('filter-button');
    const filterContainer = document.getElementById('filter-container');
    let startDateFilter = null;
    let endDateFilter = null;
    let disasterTypeFilter = null;

    function updateFilters() {
      startDateFilter = document.getElementById('startDate').value;
      endDateFilter = document.getElementById('endDate').value;
      disasterTypeFilter = document.getElementById('disasterType').value;
    
      generateMarkers(data);
    }

    filterButton.addEventListener('click', function() {
        filterContainer.classList.toggle('open');
    });

    document.getElementById('applyFilters').addEventListener('click', function() {
      updateFilters();
    });

    function generateMarkers(data) {
      // On supprime tous les marqueurs de la carte
      marqueurs.clearLayers();
      carte.removeLayer(marqueurs);
    
      const filteredData = data.filter(ville => {
        const markerDate = new Date(ville.date);
        const markerType = ville.type;
    
        // Vérification des filtres
        const dateInRange = (!startDateFilter || markerDate >= new Date(startDateFilter)) && (!endDateFilter || markerDate <= new Date(endDateFilter));
        const typeMatches = disasterTypeFilter === 'All' || markerType === disasterTypeFilter;
    
        return dateInRange && typeMatches;
      });
    
      // Création des nouveaux marqueurs Leaflet avec les données filtrées
      const newMarkers = filteredData.map(ville => {
        const marker = L.marker([ville.latitude, ville.longitude]);
        marker.bindPopup("<p><strong>" + ville.ville + " </strong>(" + ville.type  + " on "+ ville.date.slice(0, -14) +")</p><p><em>" + ville.description + "</em></p>");
        return marker;
      });
    
      marqueurs.addLayers(newMarkers);
      carte.addLayer(marqueurs);
    }

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(carte);

        // Check for Geolocation support in the browser
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
          var userLat = position.coords.latitude;
          var userLng = position.coords.longitude;

          carte.setView([userLat, userLng], 13); // Center the map on the user's location with a zoom level of 13

           // Create a marker for the user's location
        var userMarker = L.marker([userLat, userLng]).addTo(carte);
        userMarker.bindPopup("Your Location").openPopup(); // Add a popup with  a label
      });
    } else {
      alert("Geolocation is not available in this browser.");
    }

    let marqueurs = L.markerClusterGroup(); 

    //On parcourt les différentes villes
    for (let ville of villes) {
        var marqueur = L.marker([ville.latitude, ville.longitude]);
        marqueur.bindPopup("<p><strong>" + ville.ville + " </strong>(" + ville.type  + " on "+ ville.date.slice(0, -14) +")</p><p><em>" + ville.description + "</em></p>");
        marqueurs.addLayer(marqueur); //On ajoute le marqueur au groupe

        //On ajoute le marqueur au tableau pour gérer le zoom par défaut
        tableauMarqueurs.push(marqueur);
    }

    //On regroupe les marqueurs dans un tableau lea let
    let groupe = new L.featureGroup(tableauMarqueurs);

    //On adapte le zoom au groupe
    carte.fitBounds(groupe.getBounds());
    carte.addLayer(marqueurs);

    // Sélectionnez les champs d'entrée du formulaire
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');
    const cityInput = document.getElementById('cityInput');

    carte.on('click', function(e) {
        lat = e.latlng.lat;
        lng = e.latlng.lng;

        latitudeInput.value = lat;
        longitudeInput.value = lng;

        // Utilisez l'API Nominatim pour rechercher la ville en fonction de la latitude et de la longitude
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
          .then(response => response.json())
          .then(data => {
            if (data.address && data.address.city) {
              let cityName = data.address.city;
              cityInput.value = cityName;
              console.log('Nom de la ville:', cityName);
            } else {
              console.log('Ville non trouvée.');
            }
          })
          .catch(error => {
            console.error('Erreur:', error);
          });

        document.querySelector('#formDisaster').classList.remove("activeCart");
        document.querySelector('.title').classList.add("activeCart");
        document.querySelector('.header-bar').classList.add("activeCart");
    });

    let searchButton = document.getElementById('search-button');
    // Ajoutez un gestionnaire d'événements "click" au bouton
    searchButton.addEventListener('click', function() {
      let query = document.getElementById('search').value;

      // Use Nominatim API to geocode the query
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
          .then(response => response.json())
          .then(data => {
              if (data.length > 0) {
                  var result = data[0]; // Get the first result
                  var lat = parseFloat(result.lat);
                  var lon = parseFloat(result.lon);
                  carte.setView([lat, lon], 13); // Center the map on the search result
              } else {
                  alert('Location not found');
              }
          })
          .catch(error => {
              console.error('Error:', error);
          });
      });

  })
  .catch(error => {
    console.error('Erreur lors de la requête :', error);
  });


  document.addEventListener('DOMContentLoaded', () => {


    // Gestion dynamique des selects
    hideDescSelect();
    document.getElementById("type").addEventListener("change", () => {
      let valueTypeSelect = document.getElementById("type").value;
      
      if(valueTypeSelect == "Flooding") {
        displayDescSelect("flooding");
        return;
      }
      if(valueTypeSelect == "Fires") {
        displayDescSelect("fires");
        return;
      }
      if(valueTypeSelect == "Earthquakes") {
        displayDescSelect("earthquakes");
        return;
      }
      if(valueTypeSelect == "Storms") {
        displayDescSelect("storms");
        return;
      }
      if(valueTypeSelect == "Volcanic eruption") {
        displayDescSelect("volcanic_eruption");
        return;
      }
      if(valueTypeSelect == "Tsunami") {
        displayDescSelect("tsunami");
      }
    });

    function hideDescSelect() {
      let descSelect = document.getElementById("desc");
      descSelect.value = "";
      descSelect.querySelectorAll("option").forEach(option => {
        option.style.display = "none";
      });
    }
  
    function displayDescSelect(type) {
      hideDescSelect();
      let descSelect = document.getElementById("desc");
      descSelect.querySelectorAll(`.${type}`).forEach(option => {
        option.style.display = "block";
      })
    }

  });


  document.getElementById("urgenceButton").addEventListener("click", () => {
      document.querySelector('#formUrgence').classList.remove("activeCart");
      document.querySelector('.title').classList.add("activeCart");
      document.querySelector('.header-bar').classList.add("activeCart");
  });

  // document.getElementById("submitUrgence").addEventListener("click", () => {
  //   let typeUrgence = document.getElementById("typeUrgence").value;
  //   console.log("typeUrgence = ", typeUrgence);
  //   await fetch('/uploadUrgence', {
  //     method: 'GET',
  //     headers: {
  //         'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({ typeUrgence: typeUrgence })
  //   })
  //   .then(response => response.json())
  //   .then(data => {
  //     console.log("if data");
  //     if (data.success) {
  //         console.log(`Point ${typeUrgence} added successfully`);
  //         // location.reload();
  //     } else {
  //         console.error(`Error add point`);
  //     }
  //   });
  // })



/* Gestion de la boite de dialogue pour l'utilisation des données */
const modal = document.getElementById("myModal");
const closeModalButton = document.getElementById("closeModal");

if(localStorage.getItem("accept") != "true") {
  modal.style.display = "block";
}else{
  modal.style.display = "none";
}

closeModalButton.addEventListener("click", () => {
  modal.style.display = "none";
  localStorage.setItem("accept", "true");
});

  
  


  

