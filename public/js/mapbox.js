/* eslint-disable */

export const displayMap = (location) => {
  // Initialize map with specified center and zoom level
  var map = L.map('map', { zoomControl: false });

  // Add OpenStreetMap base layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    crossOrigin: '',
  }).addTo(map);

  const points = [];
  locations.forEach((loc) => {
    // Add coordinates to array for calculating bounds later
    console.log(loc.coordinates);
    points.push([loc.coordinates[1], loc.coordinates[0]]);

    // Add marker to map with popup for each location
    L.marker([loc.coordinates[1], loc.coordinates[0]])
      .addTo(map)
      .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
        autoClose: false,
      })
      .openPopup();
  });

  // Fit the map to the bounds of the given locations
  const bounds = L.latLngBounds(points).pad(0.5);
  map.fitBounds(bounds);

  map.scrollWheelZoom.disable();
};
