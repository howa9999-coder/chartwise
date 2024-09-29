
// Declare global variables to store the layers
var layerDep = L.geoJSON();
var layerDest = L.geoJSON();

function clearDestinationPoint(event){
  var latInput = document.getElementById('latitude1').value = "";
  var lngInput = document.getElementById('longitude1').value = "";
  var distInput = document.getElementById('distance').value = "";
  var bearInput = document.getElementById('bearing').value = "";
  // Clear existing Turf layer/result
  if (layerDep) map.removeLayer(layerDep);
  if (layerDest) map.removeLayer(layerDest);
  // Zoom to original extent
  map.setView(centerBounds, 5);
  event.preventDefault();
}

function destinationPoint(){
 event.preventDefault();
  // Clear existing Turf layer/result
  if (layerDep) map.removeLayer(layerDep);
  if (layerDest) map.removeLayer(layerDest); 
  
  // Get value from input box
  var latInput = document.getElementById('latitude1').value;
  var lngInput = document.getElementById('longitude1').value;
  var distInput = document.getElementById('distance').value;
  var bearInput = document.getElementById('bearing').value;
  var unitSelect = document.getElementById('units').value;
    
  if(!latInput || !lngInput || !distInput || !bearInput || !unitSelect){
    alert("Please enter a valid input!"); 
   event.preventDefault();
   return false;
  }
    
  // Draw Start Point
  var pointDep = turf.point([lngInput, latInput]);
  layerDep = L.geoJSON(pointDep, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        color: 'red',
        fillColor: 'red',
        fillOpacity: 1,
        radius: 8
      });
    }
  }).addTo(map);
  // Popup layerDep
  layerDep.eachLayer(function(layer) {
    layer.bindPopup('Point A');
  });

  // Draw Destination
  var distance = distInput;
  var bearing = bearInput;
  var options = {units: unitSelect};
    
  var pointDest = turf.destination(pointDep, distance, bearing, options);
  layerDest = L.geoJSON(pointDest, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        color: 'green',
        fillColor: '#0f3',
        fillOpacity: 1,
        radius: 8
      });
    }
  }).addTo(map);
// Popup layerDest
layerDest.eachLayer(function(layer) {
  var latlng = layer.getLatLng();
  layer.bindPopup( `
        <div>
            <p>Point B: </br> </br> Latitude: ${latlng.lat} </br> Longitude: ${latlng.lng}</p>
    `
   
  );


 

});


  

  // Zoom to circle bounds
  var bounds = L.latLngBounds([layerDest.getBounds(), layerDep.getBounds()]);
  map.fitBounds(bounds);

  event.preventDefault();
  return false;
}

