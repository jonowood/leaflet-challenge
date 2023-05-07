// Initialize the map
function initMap() {
    const map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    return map;
  }
  
  // Get the color based on earthquake depth
  function getColor(depth) {
    return depth > 90 ? '#800026' :
           depth > 70 ? '#BD0026' :
           depth > 50 ? '#E31A1C' :
           depth > 30 ? '#FC4E2A' :
           depth > 10 ? '#FD8D3C' :
                        '#FED976';
  }
  
  // Create a custom marker style based on magnitude and depth
  function createMarkerStyle(feature) {
    const magnitude = feature.properties.mag;
    const depth = feature.geometry.coordinates[2];
    return {
      radius: magnitude * 2,
      fillColor: getColor(depth),
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
  }
  
  // Add earthquake markers to the map
  function addEarthquakeMarkers(data, map) {
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, createMarkerStyle(feature));
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p><p>Date: ${new Date(feature.properties.time).toLocaleString()}</p>`);
      }
    }).addTo(map);
  }
  
// Create a legend for the map
function createLegend(map) {
    const legend = L.control({ position: 'bottomright' });
  
    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'info legend');
      const depths = [-10, 10, 30, 50, 70, 90];
      const labels = [];
  
      for (let i = 0; i < depths.length; i++) {
        labels.push(
          '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
          depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km' : '+ km')
        );
      }
      div.innerHTML = labels.join('<br>');
      return div;
    };
    
    legend.addTo(map);
  }
  // Load the earthquake data and plot it on the map
  function loadEarthquakeData(map) {
    const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
    fetch(url)
      .then(response => response.json())
      .then(data => addEarthquakeMarkers(data, map));
  }
  
  // Main function to execute the above functions
  function main() {
    const map = initMap();
    loadEarthquakeData(map);
    createLegend(map);
  }
  
  // Execute the main function
  main();
  