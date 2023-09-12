
function getLocation() {
    let location = {};
    location.title = document.getElementById("title").value;
    location.type = document.getElementById("type").value;
    location.desc = document.getElementById("desc").value;

    return location;
}

function addLocation() {

    let location = getLocation();

    fetch('/location', {method: 'PUT', headers: {'Content-type': 'application/json'}, body: JSON.stringify(location)});
}