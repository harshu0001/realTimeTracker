const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position)=>{
        const {latitude, longitude} = position.coords;
        socket.emit("send-location", {latitude, longitude});
    }, 
    (error)=> {
        console.error(error);
    },
    {
        enableHighAccuracy : true,
        timeout: 5000,
        maximumAge: 0,
        }
    );
}

// Location.map("map").setView ([0,0], 10);
const map = L.map("map").setView([0,0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Harshu"
}).addTo(map)

const markers = {};

socket.on("recieve-location", (data)=> {
    const {id, pos} = data;
    const [latitude,longitude]=[pos.latitude,pos.longitude];
    // console.log(latitude);
    // console.log(longitude);
    map.setView([latitude, longitude]);
    
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);
        // markers[id].setlatLng(latitude, longitude);
    }
    else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnected", (id) => {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }

})