


//use mapToken from show.ejs
mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/light-v10', // style URL
center: doghotel.geometry.coordinates, // starting position [lng, lat]
zoom: 8, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl(), 'top-right');

new mapboxgl.Marker()
.setLngLat(doghotel.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h3>${doghotel.title}</h3>
        <p>${doghotel.location}</p>`
    )
)
.addTo(map)


//error handling- a place that doesnt exist?