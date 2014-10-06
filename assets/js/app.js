Parse.initialize('km3gtnQr78DlhMMWqMNCwDn4L1nR6zdBcMqzkUXt', 'BS9nk6ykTKiEabLX1CwDzy4FLT1UryRR6KsdRPJI');

function addMarker(){
    ListItem = Parse.Object.extend("complaint");

        query = new Parse.Query(ListItem);
       query.descending('createdAt');
        query.find({
          success: function(results) {
            for (var i = 0; i < results.length; i++) { 
				var object = results[i];
				marker = new google.maps.Marker({
					position: {lat: object.get('location').latitude, lng: object.get('location').longitude},
					map: map,
					title: object.get('category'),
					draggable: false,
        			animation: google.maps.Animation.DROP
				});
			}
          console.log('ho gaya');
      },
      error: function(error) {
        }
    });
}
function addList(){    
    ListItem = Parse.Object.extend("complaint");
    query = new Parse.Query(ListItem);
    query.include('deviceId');
    query.include('user');
    query.descending('createdAt');
    var adminTable=$('#admin-tb tbody');
    query.limit(20);
    query.find({
      success: function(results) {
        for (var i = 0; i < results.length; i++) { 
            var object = results[i];            
            var userObjectId = object.get('deviceId').id;
            
            if ( typeof object.get('photo') !== 'undefined'){
                adminTable.append( "<tr><td>"+object.createdAt+"</td><td>"+object.get('category')+"</td><td>"+object.get('content')+"</td><td>"+object.get('location').latitude+","+object.get('location').longitude+"</td><td><a href="+object.get('photo')._url+" target='_blank'>Image</a></td><td class='clktrg' id="+userObjectId+">View</td></tr>");
                //console.log(object.get('deviceId'));
            }       
            else{
                adminTable.append( "<tr><td>"+object.createdAt+"</td><td>"+object.get('category')+"</td><td>"+object.get('content')+"</td><td>"+object.get('location').latitude+","+object.get('location').longitude+"</td><td></td><td class='clktrg' id="+userObjectId+">View</td></tr>");
            }            
        }
      console.log('ho gaya');
      $('.clktrg').on("click", onclickuser);
    },
      error: function(error) {
        }
    });
    //$('.clktrg').on("click", onclickuser);
}
function onclickuser(){
    userList = Parse.Object.extend("user");
    var query2 = new Parse.Query(userList);
    var userObjectId = this.id;
    query2.get(userObjectId, {
        success: function (object) {
        if (object.get('googleId')){
            temp3= object.get('googleId');
            alert(temp3);
        }
        else if (object.get('facebookEmail')){
            temp3 = object.get('facebookEmail');
            alert(temp3);
            
        }
        
        else{
            console.log('empty');
        }
        },

        error: function(object, error) {

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
        addMarker();
    }, i * 500);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            var geolocpoint = new google.maps.LatLng(latitude, longitude);
            map.setCenter(geolocpoint);
            map.setZoom(16);
	        var geolocation = new google.maps.Marker({
	            position: geolocpoint,
	            map: map,
	            title: 'You are here',
	            //icon: 'http://labs.google.com/ridefinder/images/mm_20_green.png'
	        });
	    });
    }
}
if($('#map').length){
    google.maps.event.addDomListener(window, 'load', initialize);
}
else if($('#admin-tb').length){
        addList();
}
else{

}