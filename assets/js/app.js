 Parse.initialize('km3gtnQr78DlhMMWqMNCwDn4L1nR6zdBcMqzkUXt', 'BS9nk6ykTKiEabLX1CwDzy4FLT1UryRR6KsdRPJI');

function addMarker(){
    //Once again, we extend the Parse.Object class to make the ListItem class
    ListItem = Parse.Object.extend("complaint");
    

        //This time, we use Parse.Query to generate a new query, specifically querying the ListItem table.
        query = new Parse.Query(ListItem);

        //We set constraints on the query.
       // query.limit = 10;
       query.descending('createdAt');

        //We submit the query and pass in callback functions.
        query.find({
          success: function(results) {
            //Success callback
//            console.log("Total: "+results.length);
//Create a single infowindow that will be shared by all markers
    
    
    
        

            for (var i = 0; i < results.length; i++) { 
				var object = results[i];
				//myLatlng = new google.maps.LatLng(object.get('location').latitude+','+object.get('location').longitude);
				//console.log(object.get('location').latitude)
				//console.log(myLatlng);
				marker = new google.maps.Marker({
				//	position: myLatlng,
					position: {lat: object.get('location').latitude, lng: object.get('location').longitude},
					map: map,
					title: object.get('category'),
					draggable: false,
        			animation: google.maps.Animation.DROP
				});
				/*var infowindow = new google.maps.InfoWindow({
				    content: object.get('category'),
				});
				google.maps.event.addListener(marker, 'click', function() {
				   infowindow.open(map,marker);
				}); */
//				console.log(marker);
			//           console.log(object.id + ' - ' + object.get('category')+ '-'+JSON.stringify(object.get('location').latitude)+','+JSON.stringify(object.get('location').longitude));
			}
          console.log('ho gaya');
      },
      error: function(error) {
            //Error Callback
        }
    });


}

            
function initialize() {

	map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: new google.maps.LatLng(28.612912,77.22951),
    mapTypeId: google.maps.MapTypeId.ROADMAP
});
	var i=0;
	setTimeout( function() {
            //i can't be passed through because, by the time setTimeout executes, i == locations.length
        addMarker();
    }, i * 500); //Execute addMarker every 500ms

	
    // Check if user support geo-location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var latitude = position.coords.latitude;
            //console.log(latitude);
            var longitude = position.coords.longitude;
            //console.log(longitude);
            var geolocpoint = new google.maps.LatLng(latitude, longitude);
            //console.log(geolocpoint);
            map.setCenter(geolocpoint);
            map.setZoom(16);

            /*var mapOptions = {
                zoom: 12,
                center: geolocpoint,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }*/
	        // Place a marker
	        var geolocation = new google.maps.Marker({
	            position: geolocpoint,
	            map: map,
	            title: 'You are here',
	            //icon: 'http://labs.google.com/ridefinder/images/mm_20_green.png'
	        });
	    });
    }
}
google.maps.event.addDomListener(window, 'load', initialize);
