function populateQuestions(){
    
}


function filter(val){
    
}


function initialize() {
    currentUser = Parse.User.current();
    if(!currentUser) {
        alert("You need to sign in ");
        self.location="./login.html";
    }
    else{
        console.log('ho gaya');
        hello.innerHTML = "Hi "+currentUser.get("username");
          map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: new google.maps.LatLng(28.612912,77.22951),
        mapTypeId: google.maps.MapTypeId.ROADMAP
        });
          var i=0;
          setTimeout( function() {
            addMarker();
            populateList();
        }, i * 500);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                var geolocpoint = new google.maps.LatLng(latitude, longitude);
                map.setCenter(geolocpoint);
                map.setZoom(16);
                var iconURLPrefix = './assets/images/';
                var geoicon = {
                     url: iconURLPrefix + 'record.png', // url
                     scaledSize: new google.maps.Size(40, 40), // size
                     origin: new google.maps.Point(0,0), // origin
                     anchor: new google.maps.Point(0,0) // anchor 
                };
                var geolocation = new google.maps.Marker({
                    position: geolocpoint,
                    map: map,
                    title: 'You are here',
                    
                });
            });
        }
    }
}

initialize();
