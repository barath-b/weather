var map, infoWindow, pos, wData = {};

function getIpLocation() {
    $.ajax({
        dataType: "json",
        url: "https://ipapi.co/json/",
        success: function (d) {
            pos = {};
            pos.lat = d.latitude;
            pos.lng = d.longitude;
            // console.log(pos);
            getWeatherData();
        }
    });
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        // pos: pos,
        zoom: 13
    });
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            getWeatherData();
        }, function (error) {
            // handleLocationError(true, infoWindow, map.getCenter());
            // switch (error.code) {
            //     case error.PERMISSION_DENIED:
            //         console.log("User denied the request for Geolocation.")
            //         break;
            //     case error.POSITION_UNAVAILABLE:
            //         console.log("Location information is unavailable.")
            //         break;
            //     case error.TIMEOUT:
            //         console.log("The request to get user location timed out.")
            //         break;
            //     case error.UNKNOWN_ERROR:
            //         console.log("An unknown error occurred.")
            //         break;
            // }
            getIpLocation();

        });
    } else {
        // handleLocationError(false, infoWindow, map.getCenter());
        getIpLocation();
    }
}

function getWeatherData() {
    var proxy = "https://corsan.herokuapp.com/";
    var baseUrl = "https://www.metaweather.com";
    var url = proxy + baseUrl + "/api/location/search/?lattlong=" + pos.lat + "," + pos.lng;
    var woeid = 0;
    $.ajax({
        dataType: "json",
        url: url,
        // headers: {
        //     "X-Requested-With": "XMLHttpRequest",
        // },
        success: function (data) {
            var url = proxy + baseUrl + "/api/location/" + data[0].woeid;
            $.ajax({
                dataType: "json",
                url: url,
                // headers: {
                //     "X-Requested-With": "XMLHttpRequest",
                // },
                success: function (data) {
                    wData.temp = data.consolidated_weather[0].the_temp;
                    // wData.humdity = data.consolidated_weather[0].humdity;
                    // wData.max_temp = data.consolidated_weather[0].max_temp;
                    // wData.min_temp = data.consolidated_weather[0].min_temp;
                    wData.img = baseUrl + "/static/img/weather/" + data.consolidated_weather[0].weather_state_abbr + ".svg";
                    wData.state = data.consolidated_weather[0].weather_state_name;
                    wData.loc = data.title;
                    updateLocation();
                },
            });
        },
    });
}

function updateLocation() {
    infoWindow = new google.maps.InfoWindow({
        pixelOffset: new google.maps.Size(0, -42),
        content: createSkel()
    });
    infoWindow.setPosition(pos);
    infoWindow.open(map);
    marker = new google.maps.Marker({
        position: pos,
        // animation: google.maps.Animation.BOUNCE
    });
    marker.setMap(map);
    map.setCenter(pos);
    console.log($())
}

function createSkel() {
    var parent = createDiv("id", "container");;
    var child = createDiv("id", "loc");
    child.innerHTML = wData.loc;
    parent.appendChild(child);
    child = createDiv("class", "flex");
    var img = document.createElement("img");
    img.id = "wimg";
    img.src = wData.img;
    var inChild = createDiv("id", "weather")
    inChild.innerHTML = wData.temp + "&#176;C ";
    child.appendChild(inChild);
    child.appendChild(img);
    parent.appendChild(child);
    child = createDiv("id", "state")
    child.innerHTML = wData.state
    parent.appendChild(child);
    return parent;
}

function createDiv(atr, val) {
    var div = document.createElement("div");
    div.setAttribute(atr, val);
    return div;
}

// function handleLocationError(browserHasGeolocation, infoWindow, pos) {
//     infoWindow.setPosition(pos);
//     infoWindow.setContent(browserHasGeolocation ?
//         'Error: The Geolocation service failed.' :
//         'Error: Your browser doesn\'t support geolocation.');
//     infoWindow.open(map);
// }
