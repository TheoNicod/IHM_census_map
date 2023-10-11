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
                listItem.classList.add("col-md-3");
                listItem.classList.add("col-sm-6");
                listItem.classList.add("text-center");
                listItem.innerHTML = `
                    <p><b>Date:</b> ${marker.date.slice(0, -14)}</p>
                    <p><b>City:</b> ${marker.ville}</p>
                    <p><b>Type:</b> ${marker.type}</p>
                    <button class="btn btn-danger delete-button" data-id="${marker.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                        </svg> Remove
                    </button>
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
