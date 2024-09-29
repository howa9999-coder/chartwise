
  var place; // Declare the variable outside the function

function placeS() {
  event.preventDefault();

  //Clear existing Turf layer/result
  if (place != null) {
    map.removeLayer(place);
  }

  latPoint = document.getElementById("placeLat").value;
  lngPoint = document.getElementById("placeLong").value;
  if (document.getElementById("placeLat").value == "" || document.getElementById("placeLong").value == "") {

    alert("Please enter a valid input!");
    return false;

  }
  event.preventDefault();

  // Create a point feature using Turf.js
  var point = turf.point([lngPoint, latPoint]);

  // Add a marker at the specified location
  place = L.geoJSON(point).addTo(map);

  // Add a popup to the marker
  place.bindPopup("Delete this marker?").openPopup();

  //Zoom to circle bounds
  var bounds = place.getBounds();

  var options = {
    maxZoom: 11,
    minZoom: 11
  };

  map.fitBounds(bounds, options);

  // Attach a listener to the popup close button
  place.getPopup().on('remove', function () {
    map.removeLayer(place);
  });
}

  