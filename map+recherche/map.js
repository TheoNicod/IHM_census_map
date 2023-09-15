var map = L.map('map', {
    worldCopyJump : true
}); // Initialize the map without a center or zoom level

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Check for Geolocation support in the browser
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
        var userLat = position.coords.latitude;
        var userLng = position.coords.longitude;

        map.setView([userLat, userLng], 13); // Center the map on the user's location with a zoom level of 13

        // Create a marker for the user's location
        var userMarker = L.marker([userLat, userLng]).addTo(map);
        userMarker.bindPopup("Your Location").openPopup(); // Add a popup with  a label
    });
} else {
    alert("Geolocation is not available in this browser.");
}

// Function to search for a location
function searchLocation() {
    var query = document.getElementById('search').value;

    // Use Nominatim API to geocode the query
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                var result = data[0]; // Get the first result
                var lat = parseFloat(result.lat);
                var lon = parseFloat(result.lon);
                map.setView([lat, lon], 13); // Center the map on the search result
            } else {
                alert('Location not found');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Function to toggle the display of the advanced search bar
function toggleAdvancedSearch() {
    var advancedSearchDiv = document.getElementById('advanced-search');
    if (advancedSearchDiv.style.display === 'none') {
        advancedSearchDiv.style.display = 'block';
    } else {
        advancedSearchDiv.style.display = 'none';
    }
}

// Function to handle advanced search
function searchAdvancedLocation() {
    var advancedQuery = document.getElementById('advanced-search-input').value;

    // Use Nominatim API for advanced search
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${advancedQuery}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                var result = data[0]; // Get the first result
                var lat = parseFloat(result.lat);
                var lon = parseFloat(result.lon);
                map.setView([lat, lon], 13); // Center the map on the search result
            } else {
                alert('Location not found');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Create an array to store user-added markers
var userMarkers = [];
var redMarkerIcon = L.icon({
    iconUrl: 'red-marker.png', // Path to a red marker icon image (you can use your own image)
    iconSize: [25, 41],       // Size of the icon image
    iconAnchor: [12, 41],     // Anchor point of the icon (the tip of the marker)
});

// Function to add a marker at the clicked position
function addMarker(e) {
    var marker = L.marker(e.latlng, { icon: redMarkerIcon }).addTo(map);
    userMarkers.push(marker);
}

// Event listener to add a marker on map click
map.on('click', addMarker);