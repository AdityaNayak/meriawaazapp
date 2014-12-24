Parse.initialize('jlQ5tv6KHzbRWhGcI0qXLAMsCVPf45efzqHBaqOt', 'q6AfL8e41Rl1vtYrjsDOVLpdFkgxT1mAH87wkqZH');

var view=0;

var listView=$('#list-view tbody');
var timelineView=$('#timeline-view');
var teamView=$('#team');

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

var numcategory=6;
var map;
var map2;

var issuelocation;
var currmarker;
var currentUser;
var team=[];
var markers=[];

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

function getReverseGeocodingData(lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);
    // This is making the Geocode request
    var geocoder = new google.maps.Geocoder();
    var address="-";
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status !== google.maps.GeocoderStatus.OK) {
            console.log(status);
        }
        // This is checking to see if the Geoeode Status is OK before proceeding
        if (status == google.maps.GeocoderStatus.OK) {
            address = (results[0].formatted_address);
            console.log(address);
            var p_address=document.getElementById('address');
            p_address.innerHTML = address;
        }
    });
    
}

function CurrentLocationControl(controlDiv, map) {

  // Set CSS styles for the DIV containing the control
  // Setting padding to 5 px will offset the control
  // from the edge of the map
  controlDiv.style.padding = '5px';

  // Set CSS for the control border
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = 'white';
  controlUI.style.borderStyle = 'solid';
  controlUI.style.borderWidth = '2px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to set the map to Current Location';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior
  var controlText = document.createElement('div');
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '12px';
  controlText.style.paddingLeft = '4px';
  controlText.style.paddingRight = '4px';
  controlText.innerHTML = '<b>Current Location</b>';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to
  // Chicago
  google.maps.event.addDomListener(controlUI, 'click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                var geolocpoint = new google.maps.LatLng(latitude, longitude);
                map.setCenter(geolocpoint);
                map.setZoom(16);
                marker = new google.maps.Marker({
                    position: geolocpoint,
                    map: map,
                    title: 'Current Location',
                    draggable: false,
                    animation: google.maps.Animation.DROP
                });
            });
            
        }

  });

}
function FixedLocationControl(controlDiv, map, location) {

  // Set CSS styles for the DIV containing the control
  // Setting padding to 5 px will offset the control
  // from the edge of the map
  controlDiv.style.padding = '5px';

  // Set CSS for the control border
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = 'white';
  controlUI.style.borderStyle = 'solid';
  controlUI.style.borderWidth = '2px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to set the map Back to Issue Location';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior
  var controlText = document.createElement('div');
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '12px';
  controlText.style.paddingLeft = '4px';
  controlText.style.paddingRight = '4px';
  controlText.innerHTML = '<b>Issue Location</b>';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to
  // Chicago
  google.maps.event.addDomListener(controlUI, 'click', function() {
    map.setCenter(issuelocation);
  });

}

function populateUpdates(){
    timelineView.html("");    
    ListItem = Parse.Object.extend("Update");
    query = new Parse.Query(ListItem);
    var pointer = new Parse.Object("Issue");
    pointer.id = currmarker.content.id;
    query.equalTo("issue", pointer);
    query.include("assignee");
    query.include("user");
    query.ascending('createdAt');
    query.find({
          success: function(results) {
                console.log("Size:"+results.length);
                var d;
                var ago;
                var content;
                var user;
                var assignee;
                for (var i = 0; i < results.length; i++) { 
                    object= results[i];
                    d=new Date(object.createdAt);
                    ago=timeSince(d);
                    if(object.get("content")!=undefined){
                        content=object.get("content");    
                    }
                    else{
                        content="";
                    }
                    user=object.get("user");
                    if(object.get("assignee")!=undefined){
                        assignee=object.get("assignee");
                    }
                    else{
                        assignee="";
                    }
                    
                    if(object.get("type")=="assigned"){
                        timelineView.append("<div class='panel nb'><p><strong>"+assignee.get("name")+"</strong> was assigned by <strong>"+user.get("username")+"</strong> <small>"+ago+" ago</small></p></div>");                        
                    }
                    if(object.get("type")=="closed"){
                        timelineView.append("<div class='panel nb'><p><strong>"+user.get("username")+"</strong> closed the issue <small>"+ago+" ago</small></p></div>"); 
                        
                    }
                    if(object.get("type")=="comment"){timelineView.append("<div class='row'><div class='small-2 columns wbg-fx'><img src='http://placehold.it/300x300&text=user' class='circle-img'></div><div class='small-10 columns'><div class='panel p-fx'><div class='panel-head'><strong>"+user.get("username")+"</strong> commented <small>"+ago+" ago</small></div><p>"+content+"</p></div></div></div>"); 
                    }
                    if(object.get("type")=="claim"){timelineView.append("<div class='panel nb'><p><strong>"+user.get("username")+"</strong> claimed this issue <small>"+ago+" ago</small></p></div>"); 
                    }
                }

            },
          error: function(error) {
                console.log("Error:"+error.message);
          }
    });
}

function populateTeam(){
    teamView.html("");    
    ListItem = Parse.Object.extend("TeamMember");
    query = new Parse.Query(ListItem);
    query.include("user");
    query.include("neta");
    query.equalTo("neta", currentUser.get("neta"));
    query.find({
          success: function(results) {
                console.log("Size:"+results.length);
                team=[];
                for (var i = 0; i < results.length; i++) { 
                    object= results[i];
                    team.push(object);
                    teamView.append("<option id="+object.get('user').get('email')+" value="+object.get('name')+">"+object.get('name')+"</option>");
                }

            },
          error: function(error) {
                console.log("Error:"+error.message);
          }
    });
    
}

function postComment(c){
    var Comment = Parse.Object.extend("Update");
    var comment = new Comment();
    var u = new Parse.Object("User");
    var i = new Parse.Object("Issue");
    u.id = currentUser.id;
    i.id = currmarker.content.id;
    comment.set("type", "comment");
    comment.set("content", c);
    comment.set("issue", i);
    comment.set("user", u);
    
    comment.save(null, {
      success: function(comment) {
        populateUpdates();
      },
      error: function(comment, error) {
        alert('Failed to Comment! ' + error.message);
      }
    });
}


function postClaim(){
    var Claim = Parse.Object.extend("Update");
    var claim = new Claim();
    var u = new Parse.Object("User");
    var i = new Parse.Object("Issue");
    u.id = currentUser.id;
    i.id = currmarker.content.id;
    claim.set("type", "claim");
    claim.set("issue", i);
    claim.set("user", u);
    
    claim.save(null, {
      success: function(claim) {
        populateUpdates();
      },
      error: function(claim, error) {
        console.log('Failed to Comment! ' + error.message);
      }
    });
}

function teamMember(email){
    console.log("Find Team Member with email ID: "+email);
    var member;
    for (var i = 0; i < team.length; i++) { 
        if(team[i].get('user').get('email')==email){
            member=team[i];
            console.log("Member Found: "+member.id);
            return member;
        }
    }
}

function postAssignment(id){
    var Assign = Parse.Object.extend("Update");
    var assign = new Assign();
    var u = new Parse.Object("User");
    var i = new Parse.Object("Issue");
    var a = new Parse.Object("TeamMember");
    var member=teamMember(id);
    u.id = currentUser.id;
    a.id = member.id; 
    i.id = currmarker.content.id;
    assign.set("type", "assigned");
    assign.set("issue", i);
    assign.set("user", u);
    assign.set("assignee", a);
    
    assign.save(null, {
      success: function(assign) {
        populateUpdates();
      },
      error: function(assign, error) {
        alert('Failed to Comment! ' + error.message);
      }
    });
}


function IssueStatusButton(){
    
}

function populate(){
        var no=0;
        var np=0;
        var nr=0;
        var nc=0;
        console.log('Populate!');
        ListItem = Parse.Object.extend("Issue");
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
                var content=object.get("content");
                if(object.get("content").length > 30){
                    content=object.get("content").substring(0,30)+"...";
                    console.log(content);
                }
                listView.append( "<tr class='"+object.get('status')+"'><td>"+object.get('category')+"</td><td>"+content+"</td><td>"+object.get('status')+"</td><td width='100'>"+"object.get('Assignee')"+"</td><td>"+ago+" ago</td></tr>");                        
                markers.push(marker);
                if((marker.content).get('status')=="open"){
                no=no+1;
                }
                if((marker.content).get('status')=="progress"){
                    np=np+1;
                }
                if((marker.content).get('status')=="review"){
                    nr=nr+1;
                }
                if((marker.content).get('status')=="closed"){
                    nc=nc+1;
                }
                google.maps.event.addListener(marker, 'click', (function(marker,object) {
                    return function() {
                        if(infowindow) {
                            infowindow.close();
                        }
                        infowindow = new google.maps.InfoWindow({
                            maxWidth: 700,
                            maxHeight: 900
                        });
                        NProgress.start();
                        currmarker=marker;
                        var p_timestam=String(object.createdAt);
                        var p_timestamp=p_timestam.split(" ");
                        var p_date=p_timestamp[0]+" "+p_timestamp[1]+" "+p_timestamp[2]+" "+p_timestamp[3];
                        var p_time=p_timestamp[4];
                        var p_content=object.get('content');
                        var p_type=object.get('category');
                        
                        var p_latitude=object.get('location').latitude;
                        var p_longitude=object.get('location').longitude;
                        var p_location=p_latitude+","+p_longitude;
                        getReverseGeocodingData(p_latitude, p_longitude);
                        var p_id=object.id;
                        var p_photo=object.get('photo');
                        var p_status=object.get('status');
                        infowindow.setContent(p_status);
                        
                        
                        console.log("Effect Starts");
                        
                        infowindow.open(map, marker);
                        console.log("Ye Mila:");
                        console.log(object.get('category'));
                        var status=document.getElementById('colorstatus');
                        var date=document.getElementById('date');
                        var time=document.getElementById('time');
                        var photo=document.getElementById('photo');
                        var content=document.getElementById('content');
                        var type=document.getElementById('type');
                        var location=document.getElementById('location');
                        var bigphoto=document.getElementById('bigphoto');
                        var detailedissue=document.getElementById('detailedissue');
                        $('#details-column').fadeOut(300);
                        var myLatlng = new google.maps.LatLng(p_latitude,p_longitude); 
                        issuelocation=myLatlng;
                        map2.setCenter(myLatlng);
                        var Singlemarker = new google.maps.Marker({ 
                            position: myLatlng, 
                            map: map2, 
                            icon: marker.get("icon"),
                            title: p_status,
                            animation: google.maps.Animation.DROP
                        });
                        
                        setTimeout(function(){
                                
                                $("#colorstatus").removeClass();
                                if(p_status=="open"){
                                    $("#colorstatus").addClass('yc');
                                }
                                else if(p_status=="progress"){
                                    $("#colorstatus").addClass('bgc');
                                }
                                else if(p_status=="review"){
                                    $("#colorstatus").addClass('bc');
                                }
                                else{
                                    $("#colorstatus").addClass('dbc');
                                }
                                status.innerHTML = '<strong>'+p_status+'</strong>';
                                date.innerHTML = p_date;
                                time.innerHTML = p_time;
                                if(p_content.length<50){
                                    content.innerHTML = p_content;
                                }
                                else{

                                    content.innerHTML = p_content.substring(0,30)+"...";
                                }
                                type.innerHTML = p_type;
                                location.innerHTML = p_location;
                                console.log(p_photo);
                                if(p_photo!=undefined){
                                    bigphoto.src=p_photo.url();
                                    photo.src=p_photo.url(); 
                                }
                                else{
                                    bigphoto.src="./assets/images/no_image.jpg";
                                    photo.src="./assets/images/no_image.jpg"; 
                                }
                                detailedissue.innerHTML=p_content;
                                console.log("find comments for:"+object.id);  
                                populateUpdates();
                                $('#details-column').fadeIn(300);
                                $('#photo').delay(400).fadeIn(300);
                                $('#content').delay(400).fadeIn(300);
                                $('#details-button').delay(400).fadeIn(300);
                        },300); 
                        NProgress.done();
                    }
                })(marker,object));
             } 
          statusCounters(no,np,nr,nc);;
          },
          error: function(error) {
          }
        });
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
    NProgress.start();
    Parse.User.logOut();
    currentUser = null;
    NProgress.done();
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
    if((m.content).get("category")=="transport"){
        if(box_t.checked){
             return 1;
        }
    }
    return 0;    
}

function dateCheck(m){
    var combined=document.getElementById('reportrange').innerHTML;
    combined=combined.substring(36);
    combined=combined.substring(0,combined.length-7);
    combined=combined.split(" - ");
    var startdate = moment(combined[0]).format('MMMM D, YYYY');
    var enddate = moment(combined[1]).format('MMMM D, YYYY');
    var sd=moment(startdate).unix();
    var ed=moment(enddate).unix()+86400;
    var d=Date.parse((m.content).createdAt)/1000
    if(d>sd && d<ed){
        return 1;
    }
    return 0;
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

function statusCounters(no,np,nr,nc){
    var numAnim1 = new countUp("fn1", 0, no);
    numAnim1.start();
    var numAnim2 = new countUp("fn2", 0, np);
    numAnim2.start();
    var numAnim3 = new countUp("fn3", 0, nr);
    numAnim3.start();  
    var numAnim4 = new countUp("fn4", 0, nc);
    numAnim4.start();
}

function filter(){
    updateHistory();
    var no=0;
    var np=0;
    var nr=0;
    var nc=0;
    var hide=0;
    var show=0;
    listView.html("");
    for(var m=0;m<markers.length;m++){
        if(statusCheck(markers[m])==1 && categoryCheck(markers[m])==1 && dateCheck(markers[m])==1){
            var d=new Date((markers[m].content).createdAt);
            var ago=timeSince(d);
            var content=markers[m].content.get('content');
            if(markers[m].content.get('content').length > 30){
                    content=markers[m].content.get('content').substring(0,30)+"...";
            }
            listView.append( "<tr class='"+(markers[m].content).get('status')+"'><td width='100'>"+(markers[m].content).get('category')+"</td><td width='100'>"+content+"</td><td width='100'>"+(markers[m].content).get('status')+"</td><td width='100'>"+"object.get('Assignee')"+"</td><td width='100'>"+ago+" ago</td></tr>");                        
            markers[m].setMap(map);
            show+=1;
            console.log(show.toString()+" showing:"+markers[m].content.get('content'));
            if((markers[m].content).get('status')=="open"){
                no=no+1;
            }
            if((markers[m].content).get('status')=="progress"){
                np=np+1;
            }
            if((markers[m].content).get('status')=="review"){
                nr=nr+1;
            }
            if((markers[m].content).get('status')=="closed"){
                nc=nc+1;
            }
        }else{
            markers[m].setMap(null);
            hide+=1;
            console.log(hide.toString()+" hiding:"+markers[m].content.get('content'));
        }
        
    }         
    statusCounters(no,np,nr,nc);
}  

$('input[type=checkbox]').change(
    function(){
        updateHistory();
        NProgress.start();
        if(infowindow) {
            infowindow.close();
        }
        filter();
        $('#details-column').delay(400).fadeOut(300);
        if(view==1){
            $('#list-view').delay(400).fadeIn(300);
            $('#map-view').delay(400).fadeOut(300);
        }
        else{
            $('#map-view').delay(400).fadeIn(300);
            $('#list-view').delay(400).fadeOut(300);
            setTimeout(function(){
                google.maps.event.trigger(map, 'resize');
                map.setZoom( map.getZoom() );
            },700);
        }
        $('#details-column').delay(400).fadeOut(300);
        $('#updates-view').delay(400).fadeOut(300);
        $('#back').delay(400).fadeOut(300);
        NProgress.done();
    });

$('input[name=maptglgroup]').change(function(){
    NProgress.start();
    updateHistory();
    if(infowindow) {
        infowindow.close();
    }
    $('#photo').delay(400).fadeIn(300);
    $('#content').delay(400).fadeIn(300);
    $('#details-button').delay(400).fadeIn(300);
    if($(this).is(':checked'))
    {
        view=0;
        $('#map-view').delay(400).fadeIn(300);
        setTimeout(function(){
            google.maps.event.trigger(map, 'resize');
            map.setZoom( map.getZoom() );
        },700);
        $('#list-view').delay(400).fadeOut(300);
        $('#updates-view').delay(400).fadeOut(300);
        $('#back').delay(400).fadeOut(300);
        $('#details-column').delay(400).fadeOut(300);
    }
    else
    {
        view=1;
        $('#map-view').delay(400).fadeOut(300);
        $('#list-view').delay(400).fadeIn(300);
        $('#details-column').delay(400).fadeOut(300);
    }    
    NProgress.done();
});

$('#claim-st1').click(function(){
    postClaim();
    $('#claim-st1').delay(400).fadeOut(300);
    $('#claim-st2').delay(400).fadeIn(300);
});


$('#back').click(function(){
    updateHistory();
    NProgress.start();
    if(infowindow) {
        infowindow.close();
    }
    $('#photo').delay(400).fadeIn(300);
    $('#content').delay(400).fadeIn(300);
    $('#details-button').delay(400).fadeIn(300);
    if(view==1){
        $('#list-view').delay(400).fadeIn(300);
        $('#map-view').delay(400).fadeOut(300);
    }
    else{
        $('#map-view').delay(400).fadeIn(300);
        setTimeout(function(){
            google.maps.event.trigger(map, 'resize');
            map.setZoom( map.getZoom() );
        },700);
        $('#list-view').delay(400).fadeOut(300);
    }
        $('#details-column').delay(400).fadeOut(300);
        $('#updates-view').delay(400).fadeOut(300);
        $('#back').delay(400).fadeOut(300);
        NProgress.done();
});



$('#details-button').click(function(){
    updateHistory();
    NProgress.start();
    if(infowindow) {
        infowindow.close();
    }
    $('#list-view').delay(400).fadeOut(300);
    $('#map-view').delay(400).fadeOut(300);
    $('#updates-view').delay(400).fadeIn(300);
    setTimeout(function(){
        google.maps.event.trigger(map2, 'resize');
        map2.setZoom( map2.getZoom() );
    },700);
    $('#photo').delay(400).fadeOut(300);
    $('#content').delay(400).fadeOut(300);
    $('#details-button').delay(400).fadeOut(300);
    $('#back').delay(400).fadeIn(300);
    NProgress.done();
});

$('.list-table tbody tr').click(function() {
    $('.hod').delay(400).fadeOut(300);
});

$('#reportrange').daterangepicker(
    {
        startDate: moment().subtract('days', 29),
        endDate: moment(),
        minDate: '01/01/2012',
        maxDate: '12/31/2015',
        dateLimit: { days: 60 },
        showDropdowns: true,
        showWeekNumbers: false,
        timePicker: false,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
            'Last 7 Days': [moment().subtract('days', 6), moment()],
            'Last 30 Days': [moment().subtract('days', 29), moment()],
            'This Month': [moment().startOf('month'), moment()],
            'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')],
            'This Year': [moment().startOf('year'), moment()]
        },
        opens: 'left',
        format: 'MM/DD/YYYY',
        separator: ' to ',
        locale: {
            applyLabel: 'Submit',
            fromLabel: 'From',
            toLabel: 'To',
            customRangeLabel: 'Custom Range',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            firstDay: 1
            }
    },
    function(start, end) {
        console.log("Callback has been called!");
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        filter();
    }
);


function initialize() {
    currentUser = Parse.User.current();
    if(!currentUser) {
        alert("You need to sign in ");
        self.location="./login.html";
    }
    else{
        console.log('ho gaya');
        hello.innerHTML = "Hi "+currentUser.get("username");
        
        map2 = new google.maps.Map(document.getElementById('googleMap'), {
            zoom: 12,
            center: new google.maps.LatLng(28.612912,77.22951),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: new google.maps.LatLng(28.612912,77.22951),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        
        var homeControlDiv = document.createElement('div');
        var homeControl = new CurrentLocationControl(homeControlDiv, map);

        homeControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);

        var homeControlDiv2 = document.createElement('div');
        var homeControl2 = new FixedLocationControl(homeControlDiv2, map2);

        issuelocation=new google.maps.LatLng(28.612912,77.22951);

        homeControlDiv2.index = 1;
        map2.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv2);


        var i=0;
        setTimeout( function() {
            populate();
            populateTeam();
        }, i * 500);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                var geolocpoint = new google.maps.LatLng(latitude, longitude);
                map.setCenter(geolocpoint);
                map.setZoom(16);
                var iconURLPrefix = './assets/images/';
                marker = new google.maps.Marker({
                    position: geolocpoint,
                    map: map,
                    title: 'Current Location',
                    draggable: false,
                    animation: google.maps.Animation.DROP
                });
            });
            
        }            
    }
}
