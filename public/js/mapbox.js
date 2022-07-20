const locationData = document.getElementById('map')

if(locationData) {
  let locations = locationData.dataset.locations
  locations = JSON.parse(locations)
  
  mapboxgl.accessToken =
    'pk.eyJ1Ijoic2lsYXMtODciLCJhIjoiY2t5YXozeThwMDg4cTJ2cW9kampiMmYyNiJ9.h6RLv6vWwshzP3-N9X9m7A';
  
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/silas-87/cl5p6ja22001q14ofygtrhaxn',
    scrollZoom: false
  });
  
  
  
  const bounds = new mapboxgl.LngLatBounds()
  
  locations.forEach(loc => {
      const marker = document.createElement('div')
      marker.className = 'marker'
  
      new mapboxgl.Marker({
          element: marker,
          anchor: 'bottom'
      }).setLngLat(loc.coordinates).addTo(map)
      
      const day = loc.day > 1 ? 'days' : 'day'
      new mapboxgl.Popup({offset: 30}).setLngLat(loc.coordinates).setHTML(`<p>${loc.day} ${day} ${loc.description}</p>`).addTo(map)
  
      bounds.extend(loc.coordinates)
  })
  
  map.fitBounds(bounds, {
      padding: {
          top: 200,
          bottom: 150,
          left: 100,
          right: 100
      }
  })
}
