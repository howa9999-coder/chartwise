const sidebar = document.getElementById('sidebar');
        sidebar.classList.add('active'); // Make sidebar active on page load

        const toggleBtn = document.getElementById('toggle-btn');
        toggleBtn.onclick = (e) => {
            e.preventDefault();
            sidebar.classList.toggle('active');
            document.getElementById('map').style.width = sidebar.classList.contains('active') ? 'calc(100% - 250px)' : '100%';
            document.getElementById('map').style.marginLeft = sidebar.classList.contains('active') ? '250px' : '0';
        };

        // Set initial styles for map when sidebar is active
        document.getElementById('map').style.width = 'calc(100% - 250px)';
        document.getElementById('map').style.marginLeft = '250px';


//Leaflet basemap
var map = L.map('map').setView([35.9, -5.5], 9);


var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
}).addTo(map);

var nlmaps_water = L.tileLayer('https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/water/EPSG:3857/{z}/{x}/{y}.png', {
	minZoom: 6,
	maxZoom: 19,
	bounds: [[50.5, 3.25], [54, 7.6]],
	attribution: 'Kaartgegevens &copy; <a href="https://www.kadaster.nl">Kadaster</a>'
});
var OpenSeaMap = L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
});



//print map
$('.print-map').click(function(){
    window.print();
    });
//Full screen map view
var btn = document.getElementById("btn");
var mapId= document.getElementById("map");
btn.addEventListener("click", fullScreenview )
function fullScreenview(){
  mapId.requestFullscreen();

};
//Add scalebar to map
L.control.scale({metric: true, imperial: false, maxWidth: 100}).addTo(map);
/*
//GeoCoding

L.Control.geocoder().addTo(map);*/


// Ajoutez le bouton de mesure à la carte
// Create a new instance of the measurement control
var measureControl = L.control.measure({
    position: 'bottomleft'
  });
  
  // Add the measurement control to the map


  var measureControl = new L.Control.PolylineMeasure({
    position: 'topleft',
    unit: 'metres',
    showBearings: true,
    clearMeasurementsOnStop: true,
    showClearControl: true,
    showUnitControl: true,
    measureControlTitleOn: 'Turn on PolylineMeasure',
    measureControlTitleOff: 'Turn off PolylineMeasure',
    measureControlLabel: '&#8614;',
    backgroundColor: 'white',
    cursor: 'crosshair',
    clearControlTitle: 'Clear Measurements',
    unitControlTitle: {
      text: 'Change Units',
      metres: 'Meters',
      kilometres: 'Kilometers',
      feet: 'Feet',
      landmiles: 'Miles (Land)',
      nauticalmiles: 'Nautical Miles',
      yards: 'Yards',
      surveyfeet: 'Survey Feet',
      surveychains: 'Survey Chains',
      surveylinks: 'Survey Links',
      surveymiles: 'Survey Miles'
    }
  });
  
  measureControl.addTo(map);



/*//////////////////////////////////
///////////////////////////////////
/////////MOUSE COORDINATES////////
/////////////////////////////////
//////////////////////////////*/
map.on("mousemove", function(e){
    $(".map-coordinate").html("Lat: " + e.latlng.lat + "<br>Lon: " + e.latlng.lng);
});
//Mouse over effect (WFS layer)
var info = L.control();
info.update = function(prop){
    searchResults.innerHTML =  "<h5 class='side-results' >" + prop.name + "</h5> <br>" + prop.rep_m_area +"Km2" ;
};

//Function to hightlight polygon feature
function highlightFeature(e){
    var layer = e.target;
    layer.setStyle({
        weight: 2,
        color: "#666",
        dashArray: 1,
        fillColor: "White",
        fillOpacity:0.6
        });
        if(!L.Browser.ie && !L.Browser.opera){
            layer.bringToFront();
        }
        info.update(layer.feature.properties);
}
//Function to reset highlight layer
function resetHighlight(e){
    wfsPolylayer_marine.resetStyle(e.target);
    info.update();

}


///////////////////DRAW PLUG IN //////////////////////////////////////////////////////////

// Initialize the Geoman Pro plugin with all available controls
var drawControl = map.pm.addControls({
  position: 'topleft',
  drawCircle: true,
  drawRectangle: true,
  drawPolygon: true,
  drawMarker: true,
  drawCircleMarker: true,
  drawPolyline: true,
  cutPolygon: true,
  removalMode: true,
  editMode: true,
  dragMode: true,
  pinningOption: true,
  snappingOption: true,
  snapping: {
    // Configure snapping options if needed
  },
  tooltips: true,
  templineStyle: {
    color: 'green',
    dashArray: '5,5',
  },
  hintlineStyle: {
    color: 'white',
    dashArray: '1,5',
  },
  pathOptions: {
    color: 'red',
    fillColor: 'blue',
    fillOpacity: 0.4,
  },
});
// Disable drawing mode for circles and markers by default
map.pm.disableDraw('Circle');
map.pm.disableDraw('Marker');

// Create a layer group to hold the drawn shapes
var drawLayer = L.layerGroup().addTo(map);

// Control layers
var baseLayers = {
  "Google Sat": googleSat,
  "Open Street Map": osm,
};

var overlayMaps = {
  "OpenSeaMap <hr>": OpenSeaMap,
  "Dessin": drawLayer, // The drawLayer 
};

var controlLayers = L.control.layers(baseLayers, overlayMaps, {
  collapsed: true
}).addTo(map);
// Add the OpenSeaMap layer to the map by default
map.addLayer(OpenSeaMap);


///////////////////////////////////////////////////////////
//////////////Popup draw: GeoJson code + area/////////////
/////////////////////////////////////////////////////////

var drawnPolygon;

map.on('pm:create', function (e) {
  var layer = e.layer;
  drawnPolygon = layer;

  var geoJSON = layer.toGeoJSON();
  var geoJSONString = JSON.stringify(geoJSON, null, 2);

  var downloadGeoJSONLink = '<a href="data:text/json;charset=utf-8,' + encodeURIComponent(geoJSONString) + '" download="drawn_layer.geojson">Download GeoJSON</a>';
  var popupContent = "<div>" +  downloadGeoJSONLink + "</div>" ;

  layer.bindPopup(popupContent).openPopup();
});

drawLayer.on('click', function (event) {
  if (event.layer === drawnPolygon) {
    event.layer.openPopup();
  }
});

map.on('overlayremove', function (event) {
  if (event.layer === drawnPolygon) {
    event.layer.closePopup();
  }
});

///////////////////////////////////////////////////////////////////////////

var toolbar = L.toolbar();
toolbar.addTo(map);
// Style the layer control
controlLayers.getContainer().style.backgroundColor = 'C0DBEA';
controlLayers.getContainer().style.fontFamily = 'Arial, sans-serif';
controlLayers.getContainer().style.fontSize = '14px';
controlLayers.getContainer().style.border = '2px solid #ccc';
controlLayers.getContainer().style.borderRadius = '5px';


