 
 mapboxgl.accessToken =mapToken;
  const map = new mapboxgl.Map({
   container: 'map', // container ID
   style: "mapbox://styles/mapbox/streets-v12",
   center: listing.geometry.coordinates, // starting position [longitude, latitude]. Note that lat must be set between -90 and 90
   zoom: 9, // starting zoom
    });

    console.log(listing.geometry.coordinates);

       const marker = new mapboxgl.Marker({ color: "red "})
        .setLngLat(listing.geometry.coordinates)  //Listing.geometry.coordinates
        .setPopup(new mapboxgl.Popup({offset: 25})
        .setHTML(`<h4>${listing.location}</h4><P>Exact location will be provided after booking</p>`))
        .addTo(map);
                

// mapboxgl.accessToken = mapToken;

// const map = new mapboxgl.Map({
//     container: 'map',
//     style: "mapbox://styles/mapbox/streets-v12",
//     center: coordinates,
//     zoom: 9,
// });

// console.log(coordinates);

// // Create a custom marker element
// const markerElement = document.createElement("div");

// // Original marker icon (red location pin)
// markerElement.innerHTML = `
//     <i class="fa-solid fa-location-dot"></i>
// `;

// // Add CSS class
// markerElement.className = "custom-marker";

// // Create Mapbox marker
// const marker = new mapboxgl.Marker({
//     element: markerElement,
//     anchor: "bottom"
// })
// .setLngLat(coordinates)
// .addTo(map);

// // When mouse enters the marker
// markerElement.addEventListener("mouseenter", () => {

//     // Change marker into a house icon
//     markerElement.innerHTML = `
//         <i class="fa-brands fa-airbnb"></i>
//     `;

//     markerElement.classList.add("hover-marker");

// });

// // When mouse leaves the marker
// markerElement.addEventListener("mouseleave", () => {

//     // Restore original location icon
//     markerElement.innerHTML = `
//         <i class="fa-solid fa-location-dot"></i>
//     `;

//     markerElement.classList.remove("hover-marker");

// });
