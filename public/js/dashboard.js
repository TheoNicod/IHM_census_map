fetch('/getPoints')
  .then(response => response.json())
  .then(data => {
    console.log('Résultats de la requête SELECT :', data);

    markersData = data;

    // Fonction pour générer la liste des marqueurs
    function generateMarkerList() {
        const markerList = document.querySelector(".marker-list");
        markerList.innerHTML = ""; // Efface la liste existante

        const startDate = document.getElementById('filter-startDate').value;
        const endDate = document.getElementById('filter-endDate').value;
        const disasterType = document.getElementById('filter-type').value;
        const cityFilter = document.getElementById('filter-ville').value.toLowerCase();

        let numItemsDisplayed = 0;

        markersData.forEach(marker => {
            const markerDate = new Date(marker.date);
            const dateInRange = (!startDate || markerDate >= new Date(startDate)) && (!endDate || markerDate <= new Date(endDate));
            const typeMatches = (disasterType === 'Tous' || marker.type === disasterType);
            const cityMatches = (!cityFilter || marker.ville.toLowerCase().includes(cityFilter));

            if (dateInRange && typeMatches && cityMatches) {
                const listItem = document.createElement("div");
                listItem.classList.add("marker-item");
                listItem.innerHTML = `
                    <p>Date: ${marker.date.slice(0, -14)}</p>
                    <p>City: ${marker.ville}</p>
                    <p>Type: ${marker.type}</p>
                    <button class="delete-button" data-id="${marker.id}">Remove</button>
                `;
                markerList.appendChild(listItem);
                numItemsDisplayed++;
            }
        });
        
        // Mettre à jour l'indication du nombre d'éléments affichés
        const numItemsText = document.querySelector(".num-items");
        numItemsText.textContent = `Number of items : ${numItemsDisplayed}`;

    }

    function handleDeleteMarker(event) {
        const idToDelete = parseInt(event.target.dataset.id);

        if (window.confirm("Are you sure you want to remove this ?")) {
            fetch('/deletePoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: idToDelete })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log(`Point with ID ${idToDelete} deleted successfully`);
                    location.reload();
                } else {
                    console.error(`Error deleting point with ID ${idToDelete}`);
                }
            });
        }
    }

    document.addEventListener("click", function(event) {
        if (event.target.classList.contains("delete-button")) {
            handleDeleteMarker(event);
        }
    });
    
    // Attachez un gestionnaire d'événements aux balises <select> pour les filtres
    document.querySelector("#filter-startDate").addEventListener("change", generateMarkerList);
    document.querySelector("#filter-endDate").addEventListener("change", generateMarkerList);
    document.querySelector("#filter-type").addEventListener("change", generateMarkerList);
    document.querySelector("#filter-ville").addEventListener("input", generateMarkerList); 
            
    window.addEventListener("load", generateMarkerList);
  })
  .catch(error => {
    console.error('Erreur lors de la requête :', error);
  });
