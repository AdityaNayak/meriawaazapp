Parse.initialize('jlQ5tv6KHzbRWhGcI0qXLAMsCVPf45efzqHBaqOt', 'q6AfL8e41Rl1vtYrjsDOVLpdFkgxT1mAH87wkqZH');

var listView=$('#list-view tbody');

var box_r=document.getElementById('road_cb');
var box_e=document.getElementById('electricity_cb');
var box_w=document.getElementById('water_cb');
var box_l=document.getElementById('law_cb');
var box_s=document.getElementById('sanitation_cb');
var box_t=document.getElementById('transport_cb');

var box_pr=document.getElementById('prog_it');
var box_rv=document.getElementById('review_it');
var box_cl=document.getElementById('closed_it');
var box_op=document.getElementById('open_it');

var infowindow;
var markers=[];

var numcategory=6;
var map;

var iconURLPrefix = './assets/images/';
var width=40;
var height=40;
var anchor_left=0;
var anchor_top=0;
var icons_url = [
    iconURLPrefix + 'marker-1.png',
    iconURLPrefix + 'marker-2.png',
    iconURLPrefix + 'marker-3.png',
    iconURLPrefix + 'marker-4.png',
    iconURLPrefix + 'marker-5.png',
    iconURLPrefix + 'marker-6.png', 
]

var icon1 = {
    url: icons_url[0], // url
    scaledSize: new google.maps.Size(width, height), // size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(anchor_left, anchor_top) // anchor 
};
var icon2 = {
    url: icons_url[1], // url
    scaledSize: new google.maps.Size(width, height), // size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(anchor_left, anchor_top) // anchor 
};
var icon3 = {
    url: icons_url[2], // url
    scaledSize: new google.maps.Size(width, height), // size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(anchor_left, anchor_top) // anchor 
};
var icon4 = {
    url: icons_url[3], // url
    scaledSize: new google.maps.Size(width, height), // size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(anchor_left, anchor_top) // anchor 
};
var icon5 = {
    url: icons_url[4], // url
    scaledSize: new google.maps.Size(width, height), // size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(anchor_left, anchor_top) // anchor 
};
var icon6 = {
    url: icons_url[5], // url
    scaledSize: new google.maps.Size(width, height), // size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(anchor_left, anchor_top) // anchor 
}; 

var icons = [
    icon1,
    icon2,
    icon3,
    icon4,
    icon5,
    icon6, 
];


function populate(){
        console.log('Add Marker!');
        ListItem = Parse.Object.extend("complaint");
        query = new Parse.Query(ListItem);
        
        query.descending('createdAt');
        query.find({
          success: function(results) {
            for (var i = 0; i < results.length; i++) { 
                var object = results[i];
                var myicon;
                               
                //Set Icon
                if (object.get('category')=="road"){
                    myicon=icons[0];
                }
                else if(object.get('category')=="electricity"){
                    myicon=icons[1];
                }
                else if(object.get('category')=="water"){
                    myicon=icons[2];
                }
                else if(object.get('category')=="law"){
                    myicon=icons[3];
                }
                else if(object.get('category')=="sanitation"){
                    myicon=icons[4];
                }
                else{
                    myicon=icons[5];
                }

                
                marker = new google.maps.Marker({
                    position: {lat: object.get('location').latitude, lng: object.get('location').longitude},
                    map: map,
                    title: object.get('category'),
                    content: object,
                    icon : myicon,
                    draggable: false,
                    animation: google.maps.Animation.DROP
                });

                var d=new Date(object.createdAt);
                var ago=timeSince(d);
                listView.append( "<tr class='"+object.get('status')+"'><td width='100'>"+object.get('category')+"</td><td width='100'>"+object.get('content')+"</td><td width='100'>"+object.get('status')+"</td><td width='100'>"+"object.get('Assignee')"+"</td><td width='100'>"+ago+" ago</td></tr>");                        
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

                        var p_timestam=String(object.createdAt);
                        var p_timestamp=p_timestam.split(" ");
                        var p_date=p_timestamp[0]+" "+p_timestamp[1]+" "+p_timestamp[2]+" "+p_timestamp[3];
                        var p_time=p_timestamp[4];
                        var p_content=object.get('content');
                        var p_type=object.get('category');
                        var p_location=object.get('location').latitude+","+object.get('location').longitude;
                        var p_email=object.get('googleId');
                        var p_photo=object.get('photo');
                        infowindow.setContent("You Clicked me!");
                        DetailsColumn();
                        infowindow.open(map, marker);
                        console.log("Ye Mila:");
                        console.log(object.get('category'));
                        var date=document.getElementById('date');
                        var time=document.getElementById('time');
                        var content=document.getElementById('content');
                        var type=document.getElementById('type');
                        var location=document.getElementById('location');
                        var email=document.getElementById('email');
                        var photo=document.getElementById('photo');
                        
                        photo.src="http://placehold.it/400x225&text=No+Image";
                        setTimeout(function(){
                                date.innerHTML = p_date;
                                time.innerHTML = p_time;
                                content.innerHTML = p_content;
                                type.innerHTML = p_type;
                                location.innerHTML = p_location;
                                email.innerHTML = p_email;
                                photo.src=p_photo.url(); 
                        },300); 
                    }
                })(marker,object));
             } 
          },
          error: function(error) {
          }
        });
}

function DetailsColumn(){
    console.log("Effect Starts");
    $('#details-column').delay(400).fadeOut(300);
    $('#details-column').delay(400).fadeIn(300);
}

function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}

function logout(){
    Parse.User.logOut();
    currentUser = null;
    self.location="./login.html";
}

function categoryCheck(m){
    if((m.content).get("category")=="road"){
        if(box_r.checked){
             return 1;
        }
    }
    if((m.content).get("category")=="electricity"){
        if(box_e.checked){
             return 1;
        }
    }
    if((m.content).get("category")=="water"){
        if(box_w.checked){
             return 1;
        }
    }
    if((m.content).get("category")=="law"){
        if(box_l.checked){
             return 1;
        }
    }
    if((m.content).get("category")=="sanitation"){
        if(box_s.checked){
             return 1;
        }
    }
    if((m.content).get("category")=="transportation"){
        if(box_t.checked){
             return 1;
        }
    }
    return 0;    
}

function dateCheck(m){
    return 1;
}

function statusCheck(m){
    if((m.content).get("status")=="open"){
        if(box_op.checked){
             return 1;
        }
    }
    if((m.content).get("status")=="progress"){
        if(box_pr.checked){
             return 1;
        }
    }
    if((m.content).get("status")=="review"){
        if(box_rv.checked){
             return 1;
        }
    }
    if((m.content).get("status")=="closed"){
        if(box_cl.checked){
             return 1;
        }
    }
    return 0; 
}

function filter(){
    listView.html("");
    for(var m=0;m<markers.length;m++){
        console.log("Marker Value Category: "+markers[m].category);
        console.log("Marker Value Status: "+markers[m].status);
        if(statusCheck(markers[m])==1 && categoryCheck(markers[m])==1 && dateCheck(markers[m])==1){
            var d=new Date((markers[m].content).createdAt);
            var ago=timeSince(d);
            listView.append( "<tr class='"+(markers[m].content).get('status')+"'><td width='100'>"+(markers[m].content).get('category')+"</td><td width='100'>"+(markers[m].content).get('content')+"</td><td width='100'>"+(markers[m].content).get('status')+"</td><td width='100'>"+"object.get('Assignee')"+"</td><td width='100'>"+ago+" ago</td></tr>");                        
            markers[m].setMap(map);
        }else{
            markers[m].setMap(null);
        }
    }         
}  

$('input[type=checkbox]').change(
    function(){
        filter();
    });


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
            populate();
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
