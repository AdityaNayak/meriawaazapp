Parse.initialize('km3gtnQr78DlhMMWqMNCwDn4L1nR6zdBcMqzkUXt', 'BS9nk6ykTKiEabLX1CwDzy4FLT1UryRR6KsdRPJI');
var infowindow;
var markers=[];
var numProps=6;
var map;

function addMarker(){
       console.log('Add Marker!');
       ListItem = Parse.Object.extend("complaint");
       query = new Parse.Query(ListItem);
       var iconURLPrefix = 'http://maps.google.com/mapfiles/ms/icons/';
          
       var icons = [
                iconURLPrefix + 'red-dot.png',
                iconURLPrefix + 'blue-dot.png',
                iconURLPrefix + 'yellow-dot.png',
                iconURLPrefix + 'green-dot.png',
                iconURLPrefix + 'purple-dot.png',
                iconURLPrefix + 'pink-dot.png', 
       ]
       
       var legend = document.getElementById('legend');
                for (var i=0;i<6;i++) {
                    var name;
                    var icon;
                    if (i==0){
                        name="sanitation";
                        icon=icons[0]; 
                    }
                    else if(i==1){
                        name="law";
                        icon=icons[1]; 
                    }
                    else if(i==2){
                        name="road";
                        icon=icons[2]; 
                    }
                    else if(i==3){
                        name="electricity";
                        icon=icons[3]; 
                    }
                    else if(i==4){
                        name="water";
                        icon=icons[4]; 
                    }
                    else{
                        name="transport";
                        icon=icons[5]; 
                    }
                  
                  //var div = document.createElement('div');
                  //div.innerHTML = '<img src="' + icon + '"> ' + name;
                  //legend.appendChild(div);
                }
       query.descending('createdAt');
        query.find({
          success: function(results) {
            for (var i = 0; i < results.length; i++) { 
				var object = results[i];
                var myicon;
                var mycategory;
                if (object.get('category')=="sanitation"){
                    myicon=icons[0];
                    mycategory=0; 
                }
                else if(object.get('category')=="law"){
                    myicon=icons[1];
                    mycategory=1;
                }
                else if(object.get('category')=="road"){
                    myicon=icons[2];
                    mycategory=2;
                }
                else if(object.get('category')=="electricity"){
                    myicon=icons[3];
                    mycategory=3;
                }
                else if(object.get('category')=="water"){
                    myicon=icons[4];
                    mycategory=4;
                }
                else{
                    myicon=icons[5];
                    mycategory=5;
                }
                
                
				marker = new google.maps.Marker({
					position: {lat: object.get('location').latitude, lng: object.get('location').longitude},
					map: map,
                    props: mycategory,
					title: object.get('category'),
                    content: object,
                    icon : myicon,
					draggable: false,
        			animation: google.maps.Animation.DROP
				});

                markers.push(marker);
                google.maps.event.addListener(marker, 'click', (function(marker,object) {
                    return function() {
                        if(infowindow) {
                          infowindow.close();
                        }
                        infowindow = new google.maps.InfoWindow({
                            maxWidth: 700,
                            maxHeight: 900
                        });
                        var line="<h3>Issue Details</h3><ul style='list-style: none;'><li><b>Created at: </b>"+object.createdAt+"</li><li><b>Category: </b>"+object.get('category')+"</li><li><b>Content: </b>"+object.get('content')+"</li><li><b>Location: </b>"+object.get('location').latitude+","+object.get('location').longitude+"</li><li><b>Uploads: </b><a href="+"'#'"+" target='_blank'>Image</a></li><li><b>Content: </b>"+object.get('googleId')+"</li></ul>";
                        infowindow.setContent(line);
                        infowindow.open(map, marker);
                        console.log("Ye Mila:");
                        console.log(object.get('category'));
                        var data = document.getElementById('data');
                        var division = document.createElement('div');
                        data.innerHTML = line;
                        
                    }
                })(marker,object));
			}
          console.log('ho gaya');
      },
      error: function(error) {
        }
    });
}

function logout(){
    Parse.User.logOut();
    currentUser = null;
    self.location="./login.html";
}

function filter(){
    var box_s=document.getElementById('sanitation');
    var box_l=document.getElementById('law');
    var box_r=document.getElementById('road');
    var box_e=document.getElementById('electricity');
    var box_w=document.getElementById('water');
    var box_t=document.getElementById('transportation');
            
            for(var m=0;m<markers.length;m++){
                console.log("Marker Value "+markers[m].props);
                if(markers[m].props==0){
                    if(box_s.checked){
                        markers[m].setMap(map);
                    }else{
                        markers[m].setMap(null);
                    }
                }
                if(markers[m].props==1){
                    if(box_l.checked){
                        markers[m].setMap(map);
                    }else{
                        markers[m].setMap(null);
                    }
                }
                if(markers[m].props==2){
                    if(box_r.checked){
                        markers[m].setMap(map);
                    }else{
                        markers[m].setMap(null);
                    }
                }
                if(markers[m].props==3){
                    if(box_e.checked){
                        markers[m].setMap(map);
                    }else{
                        markers[m].setMap(null);
                    }
                }
                if(markers[m].props==4){
                    if(box_w.checked){
                        markers[m].setMap(map);
                    }else{
                        markers[m].setMap(null);
                    }
                }
                if(markers[m].props==5){
                    if(box_t.checked){
                        markers[m].setMap(map);
                    }else{
                        markers[m].setMap(null);
                    }
                }

            }
      }  


function initialize() {
    currentUser = Parse.User.current();
    if(!currentUser) {
        alert("You need to sign in ");
        self.location="./login.html";
    }
    else{
        hello.innerHTML = "Hi "+currentUser.get("username");
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
        //map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('legend'));
    }
}
