var constituency;
var poly;
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

var currmarker;
var currentUser;
var team=[];
var markers=[];
var singlemarker;
var geomarker1;

var iconURLPrefix = './assets/images/';
var width=40;
var height=40;
var anchor_left=20;
var anchor_top=40;
var icons_url = [
    iconURLPrefix + 'marker-1.png',
    iconURLPrefix + 'marker-2.png',
    iconURLPrefix + 'marker-3.png',
    iconURLPrefix + 'marker-4.png',
    iconURLPrefix + 'marker-5.png',
    iconURLPrefix + 'marker-6.png', 
]

var icons_url_close = [
    iconURLPrefix + 'marker-1-o.png',
    iconURLPrefix + 'marker-2-o.png',
    iconURLPrefix + 'marker-3-o.png',
    iconURLPrefix + 'marker-4-o.png',
    iconURLPrefix + 'marker-5-o.png',
    iconURLPrefix + 'marker-6-o.png', 
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

var icon1o = {
    url: icons_url_close[0], // url
    scaledSize: new google.maps.Size(width, height), // size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(anchor_left, anchor_top) // anchor 
};
var icon2o = {
    url: icons_url_close[1], // url
    scaledSize: new google.maps.Size(width, height), // size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(anchor_left, anchor_top) // anchor 
};
var icon3o = {
    url: icons_url_close[2], // url
    scaledSize: new google.maps.Size(width, height), // size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(anchor_left, anchor_top) // anchor 
};
var icon4o = {
    url: icons_url_close[3], // url
    scaledSize: new google.maps.Size(width, height), // size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(anchor_left, anchor_top) // anchor 
};
var icon5o = {
    url: icons_url_close[4], // url
    scaledSize: new google.maps.Size(width, height), // size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(anchor_left, anchor_top) // anchor 
};
var icon6o = {
    url: icons_url_close[5], // url
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

var iconso = [
    icon1o,
    icon2o,
    icon3o,
    icon4o,
    icon5o,
    icon6o, 
];

// Sets the map on all markers in the array.
function setAllMap(map) {
  console.log("setAllMap");
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  console.log("clearMarkers");
  setAllMap(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  console.log("showMarkers");
  setAllMap(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  console.log("deleteMarkers");
  clearMarkers();
  markers = [];
}

// Returns Address given the Latitude and Longitude
function getReverseGeocodingData(lat, lng) {
    console.log("getReverseGeocodingData");
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

// On Click Listener to Current Location on Map
function CurrentLocationControl(controlDiv, map) {
  console.log("CurrentLocationControl");
  // Set CSS styles for the DIV containing the control
  // Setting padding to 5 px will offset the control
  // from the edge of the map
  controlDiv.style.padding = '5px';

  // Set CSS for the control border
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = 'white';
  controlUI.style.borderStyle = 'solid';
  controlUI.style.borderWidth = '2px';
  controlUI.style.borderColor = '#dedede';
  controlUI.style.borderRadius = '50%';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to set the map to Current Location';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior
  var controlText = document.createElement('div');
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '18px';
  controlText.style.paddingLeft = '8px';
  controlText.style.paddingRight = '8px';
  controlText.style.paddingTop = '7px';
  controlText.innerHTML = '<i class="icon-pin"></i>';
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
                map.setZoom(12);
                if(geomarker1!=undefined){
                  geomarker1.setMap(null);
                }
                geomarker1 = new google.maps.Marker({
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


function enableDetailsView(){
  $('#details-panel').children().prop('disabled',false);
}

function disableDetailsView(){
  $('#details-panel').children().prop('disabled',true);
}

// Enable CheckBoxs 
function enableCheckPoints(){
  console.log("enableCheckPoints");
  enableCategoryIcons();
  enableStatusIcons();
  box_r.disabled = false;
  box_e.disabled = false;
  box_w.disabled = false;
  box_l.disabled = false;
  box_s.disabled = false;
  box_t.disabled = false;
  box_pr.disabled = false;
  box_rv.disabled = false;
  box_cl.disabled = false;
  box_op.disabled = false;
}

function disableCheckPoints(c,i){
  console.log("disableCheckPoints");
  disbleCategoryIcons(c);
  disbleStatusIcons(i);
  box_r.disabled = true;
  box_e.disabled = true;
  box_w.disabled = true;
  box_l.disabled = true;
  box_s.disabled = true;
  box_t.disabled = true;
  box_pr.disabled = true;
  box_rv.disabled = true;
  box_cl.disabled = true;
  box_op.disabled = true;
}

function enableCategoryIcons(){
  console.log("enableCategoryIcons");
  $("#road_cb").closest("label").toggleClass("gs", false); 
  $("#electricity_cb").closest("label").toggleClass("gs", false); 
  $("#water_cb").closest("label").toggleClass("gs", false); 
  $("#law_cb").closest("label").toggleClass("gs", false); 
  $("#sanitation_cb").closest("label").toggleClass("gs", false); 
  $("#transport_cb").closest("label").toggleClass("gs", false); 
}

function disbleCategoryIcons(i){
  console.log("disableCategoryIcons");
  if(i!="road"){
    $("#road_cb").closest("label").toggleClass("gs", true); 
  }
  if(i!="electricity"){
    $("#electricity_cb").closest("label").toggleClass("gs", true); 
  }
  if(i!="water"){
    $("#water_cb").closest("label").toggleClass("gs", true); 
  }
  if(i!="law"){
    $("#law_cb").closest("label").toggleClass("gs", true); 
  }
  if(i!="sanitation"){
    $("#sanitation_cb").closest("label").toggleClass("gs", true); 
  }
  if(i!="transport"){
    $("#transport_cb").closest("label").toggleClass("gs", true); 
  }
}

function enableStatusIcons(){
  console.log("enableStatusIcons");
  $('#fn2').closest("label").toggleClass("gs", false); 
  $('#fn3').closest("label").toggleClass("gs", false); 
  $('#fn4').closest("label").toggleClass("gs", false); 
  $('#fn1').closest("label").toggleClass("gs", false); 
}

// Refresh Screen
// Starts NProgress
function refresh1(){
  NProgress.start();
  console.log("NProgress Start");
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
  enableCheckPoints();
  if(currentUser.get("type")=="neta"){
    populate();
  }
  else if(currentUser.get("type")=="teamMember"){
    populateTM();
  }
}

// Refresh Current Selected Marker
function refresh2(){
  updateCurrentMarker(currmarker);
}


function disbleStatusIcons(i){

  console.log("disableStatusIcons"+i);
  if(i!="progress"){
    console.log("adding to progress");
    $('#fn2').closest("label").toggleClass("gs", true); 
  }
  if(i!="review"){
    console.log("adding to review");
    $('#fn3').closest("label").toggleClass("gs", true); 
  }
  if(i!="closed"){
    console.log("adding to closed");
    $('#fn4').closest("label").toggleClass("gs", true); 
  }
  if(i!="open"){
    console.log("adding to open");
    $('#fn1').closest("label").toggleClass("gs", true); 
  }
}

// OnClick Listener for Specific Issue Map 
function FixedLocationControl(controlDiv, map) {
  console.log("FixedLocationControl");
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

    map2.setCenter(currmarker.position);
    map2.setZoom(12);

  });

}

// 
function populateUpdates(){
    console.log("populateUpdates");
    timelineView.html("");    
    ListItem = Parse.Object.extend("Update");
    query = new Parse.Query(ListItem);
    var pointer = new Parse.Object("Issue");
    pointer.id = currmarker.content.id;
    query.equalTo("issue", pointer);
    query.include("assignee");
    query.include(["assignee.pUser"]);
    query.include("pUser");
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
                    user=object.get("pUser");
                    if(object.get("assignee")!=undefined){
                        assignee=object.get("assignee");
                        console.log("comments"+ assignee.get("pUser"));
                    }
                    else{
                        assignee="";
                    }
                    var pphoto1;
                    if(user.get("pic")!=undefined){
                        pphoto1=user.get("pic").url(); 
                    }
                    else{
                        pphoto1=getDefaultIcon(user.get("type"));
                    }
                    if(object.get("type")=="unassigned"){
                       console.log(assignee);
                         var ass=assignee.get("pUser");
                         timelineView.append("<div class='panel nb'><p><strong class='ct'>"+ass.get("name")+"</strong> was unassigned by <strong class='ct'>"+user.get("name")+"</strong> <small>"+ago+" ago</small></p></div>");                        
                    }
                    if(object.get("type")=="assigned"){
                        var ass=assignee.get("pUser");
                        timelineView.append("<div class='panel nb'><p><strong class='ct'>"+ass.get("name")+"</strong> was assigned by <strong class='ct'>"+user.get("name")+"</strong> <small>"+ago+" ago</small></p></div>");                        
                    }
                    if(object.get("type")=="closed"){
                        timelineView.append("<div class='panel nb'><p><strong class='ct'>"+user.get("name")+"</strong> closed the issue <small>"+ago+" ago</small></p></div>"); 
                        
                    }
                    if(object.get("type")=="comment"){
                        timelineView.append("<div class='row'><div class='small-2 columns wbg-fx wd-fx text-right'><img src='"+pphoto1+"' class='circle-img'></div><div class='small-10 columns'><div class='panel p-fx'><div class='panel-head'><strong class='ct'>"+user.get("name")+"</strong> commented <small>"+ago+" ago</small></div><p>"+content+"</p></div></div></div>"); 
                    }
                    if(object.get("type")=="claim"){
                        timelineView.append("<div class='panel nb'><p><strong class='ct'>"+user.get("name")+"</strong> claimed this issue <small>"+ago+" ago</small></p></div>"); 
                    }
                }
                NProgress.done();
                console.log("NProgress Stop");

            },
          error: function(error) {
                console.log("Error:"+error.message);
          }
    });
}

function populateTeam(){
    console.log("populateTeam");
    teamView.html("<option selected disabled hidden value='Assign a Team Member'></option>");    
    ListItem = Parse.Object.extend("TeamMember");
    query = new Parse.Query(ListItem);
    query.include("pUser");
    query.include("neta");
    query.equalTo("neta", currentUser.get("neta"));
    query.find({
          success: function(results) {
                team=[];
                for (var i = 0; i < results.length; i++) { 
                    object= results[i];
                    team.push(object);
                    teamView.append("<option value="+object.id+">"+object.get('pUser').get('name')+"</option>");
                }
            },
          error: function(error) {
                console.log("Error:"+error.message);
          }
    });
    
}

//Starts NProgress
function postComment(c){
    NProgress.start();
    console.log("NProgress Start");
    console.log("postComment");
    loadingButton_id("commit_btn",4);
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
        updateCurrentMarker(currmarker);
        document.getElementById("comment").value="";
        enableDetailsView();
        
      },
      error: function(comment, error) {
        alert('Failed to Comment! ' + error.message);
        enableDetailsView();
      }
    });
}



//Starts NProgress
function postClaim(){
    NProgress.start();
    console.log("NProgress Start");
    if(currentUser.get("type")!="neta"){
      alert("You do not have the required permissions");
      return;
    }
    console.log("postClaim");
    var Claim = Parse.Object.extend("Update");
    var claim = new Claim();
    var u = new Parse.Object("User");
    var i = new Parse.Object("Issue");
    u.id = currentUser.id;
    i.id = currmarker.content.id;
    claim.set("issue",i);
    claim.set("type", "claim");
    claim.set("user", u);
    var form = document.getElementById("estimateddays");
 	var days = form.time.value;
    claim.save(null, {
      success: function(claim) {
        console.log(i.id);
        Parse.Cloud.run("changeStatus", {objectId: i.id, status: "progress", claimDays: days}, {
          success:function(results){
            console.log(results);
            updateCurrentMarker(currmarker);
            enableDetailsView();
          },
          error:function(error){
            console.log(error);
          }
        });   
          
      },
      error: function(claim, error) {
        console.log('Failed to Claim! ' + error.message);
        enableDetailsView();
      }
    });
}

//Starts NProgress
function postClose(){
    NProgress.start();
    console.log("NProgress Start");
    if(currentUser.get("type")!="neta" && currentUser.get("type")!="teamMember"){
      alert("You do not have the required permissions");
      return;
    }
    console.log("postClose");
    var Close = Parse.Object.extend("Update");
    var close = new Close();
    var u = new Parse.Object("User");
    var i = new Parse.Object("Issue");
    u.id = currentUser.id;
    i.id = currmarker.content.id;
    close.set("issue",i);
    close.set("type", "closed");
    close.set("user", u);
    
    close.save(null, {
      success: function(close) {
        Parse.Cloud.run("changeStatus", {objectId: i.id, status: "review"}, {
          success:function(results){
            console.log(results);
            updateCurrentMarker(currmarker);
            enableDetailsView();
          },
          error:function(error){
            console.log(error);
          }
        });        
      },
      error: function(close, error) {
        console.log('Failed to Close! ' + error.message);
        enableDetailsView();
      }
    });
}

function appropriateStatus(s){
    if(s=="progress"){
      return "in progress";
    }
    if(s=="review"){
      return "under review"
    }
    return s;
}

function teamMember(id){
    console.log("teamMember");
    console.log("Find Team Member with ID: "+id);
    var member;
    for (var i = 0; i < team.length; i++) { 
        if(team[i].id==id){
            member=team[i];
            console.log("Member Found: "+member.id);
            return member;
        }
    }
}

//Starts NProgress
function postAssignment(id){   
    NProgress.start();
    console.log("NProgress Start");
    if(currentUser.get("type")!="neta"){
      alert("You do not have the required permissions");
      return;
    }
    console.log("postAssignment");
    ListItem = Parse.Object.extend("Update");
    query = new Parse.Query(ListItem);
    var pointer = new Parse.Object("Issue");
    pointer.id = currmarker.content.id;
    var u1 = new Parse.Object("User");
    u1.id = currentUser.id;
    query.equalTo("issue", pointer);
    query.equalTo("user",u1);
    query.equalTo("type","assigned");
    query.find({
          success: function(results) {
                 var countclaims=0;
                 console.log("People already Assigned"+results.length);
                 if(results.length!=0){
                     var Assign = Parse.Object.extend("Update");
                     var assign = new Assign();
                     var u = new Parse.Object("User");
                     var i = new Parse.Object("Issue");
                     var a = new Parse.Object("TeamMember");
                     u.id = currentUser.id;
                     a.id = results[0].get("assignee").id; 
                     i.id = currmarker.content.id;
                     assign.set("type", "unassigned");
                     assign.set("issue", i);
                     assign.set("user", u);
                     assign.set("assignee", a);
                     assign.save(null, {
						success: function(assign) {
                             var Assign2 = Parse.Object.extend("Update");
                             var assign2 = new Assign2();
                             var u2 = new Parse.Object("User");
                             var i2 = new Parse.Object("Issue");
                             var a2 = new Parse.Object("TeamMember");
                             var member2=teamMember(id);
                             u2.id = currentUser.id;
                             a2.id = member2.id; 
                             i2.id = currmarker.content.id;
                             assign2.set("type", "assigned");
                             assign2.set("issue", i2);
                             assign2.set("user", u2);
                             assign2.set("assignee", a2);
                             assign2.save(null, {
                             success: function(assign2) {
								updateCurrentMarker(currmarker);
                                enableDetailsView();
                                
                             },
                             error: function(assign2, error) {
                                alert('Failed to Assign! ' + error.message);
                                enableDetailsView();
                             }
                             });
                        },
                        error: function(assign, error) {
							alert('Failed to Assign! ' + error.message);
							enableDetailsView();
                        }
					});
                 }
                else{
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
                        updateCurrentMarker(currmarker);
                        enableDetailsView();
                        
                      },
                      error: function(assign, error) {
                        alert('Failed to Assign! ' + error.message);
                        enableDetailsView();
                      }
                    });
                }
                
            },
          error: function(error) {
                console.log("Error:"+error.message);

          }
    });  
}


function setIssueStatusButton(){
    console.log("setIssueStatusButton");
    if(currmarker.content.get("status")=="closed" || currmarker.content.get("status")=="review"){
        $('#claim-st1').delay(400).fadeOut(300);
		$('#timebox').delay(400).fadeOut(300);
        $('#claim-st2').delay(400).fadeOut(300);
        $('#close').delay(400).fadeOut(300);
        $('#team').delay(400).fadeOut(300);
        ListItem = Parse.Object.extend("Update");
        query = new Parse.Query(ListItem);
        var pointer = new Parse.Object("Issue");
        pointer.id = currmarker.content.id;
        var u = new Parse.Object("User");
        u.id = currentUser.id;
        query.equalTo("issue", pointer);
        query.equalTo("user",u);
        query.include("assignee");
        query.include(["assignee.user"]);
        query.include("pUser");
        query.descending('createdAt');

        query.find({
              success: function(results) {
                    console.log("check:"+results.length);
                    var countclaims=0;
                    for (var i = 0; i < results.length; i++) {
                        if(results[i].get("type")=="claim"){
                            countclaims+=1;
                        }
                    }
                    var assignedto=document.getElementById('claim-st3');
                    assignedto.innerHTML="Assigned to: <strong>No One</strong>";
                    for (var i = 0; i < results.length; i++) {
                        if(results[i].get("assignee")!=undefined){
                            console.log(results[i].get("assignee"));
                            var up=results[i].get("assignee");
                            var dp=up.get("pUser");
                            assignedto.innerHTML="Assigned to: <strong><span class='ct'>"+dp.get("name")+"</span></strong>";
                            break;
                        }
                    } 
                },
              error: function(error) {
                    console.log("Error:"+error.message);
              }
        });   
    }
    else{
        ListItem = Parse.Object.extend("Update");
        query = new Parse.Query(ListItem);
        var pointer = new Parse.Object("Issue");
        pointer.id = currmarker.content.id;
        var u = new Parse.Object("User");
        u.id = currentUser.id;
        query.equalTo("issue", pointer);
        query.equalTo("user",u);
        query.include("assignee");
        query.include("pUser");
        query.include(["assignee.pUser"]);
        query.descending('createdAt');

        query.find({
              success: function(results) {
                    var countclaims=0;
                    
                    for (var i = 0; i < results.length; i++) {
                        
                        if(results[i].get("type")=="claim"){
                            countclaims+=1;
                        }
                    }
                    var assignedto=document.getElementById('claim-st3');
                    assignedto.innerHTML="Assigned to: <strong>no one</strong>";
                    for (var i = 0; i < results.length; i++) {
                        
                        if(results[i].get("assignee")!=undefined){
                            
                            var up=results[i].get("assignee");
                            var dp=up.get("pUser");
                            assignedto.innerHTML="Assigned to: <strong>"+dp.get("name")+"</strong>";
                            break;
                        }
                    } 
                    
                    if(countclaims==0){
                        $('#claim-st1').delay(400).fadeIn(300);
						$('#timebox').delay(400).fadeIn(300);
                        $('#claim-st2').delay(400).fadeOut(300);
                        $('#close').delay(400).fadeOut(300);
                        $('#team').delay(400).fadeOut(300);
                    }
                    else{
                        $('#claim-st1').delay(400).fadeOut(300);
						$('#timebox').delay(400).fadeOut(300);
                        $('#claim-st2').delay(400).fadeIn(300);
                        $('#close').delay(400).fadeIn(300);
                        $('#team').delay(400).fadeIn(300);
                    }
                },
              error: function(error) {
                    console.log("Error:"+error.message);
              }
        });   
    }
}

function setIssueStatusButtonTM(){
    console.log("setIssueStatusButton");
    if(currmarker.content.get("status")=="closed" || currmarker.content.get("status")=="review"){
        $('#close').delay(400).fadeOut(300);  
    }
    else{
        $('#close').delay(400).fadeIn(300);  
    }
}


function updateCurrentMarker(m){
  console.log("updateCurrentMarker");
    ListItem = Parse.Object.extend("Issue");
    query = new Parse.Query(ListItem);
    query.equalTo("objectId", m.content.id);
    query.find({
      success: function(results) {
        console.log("current marker updated: "+results.length);
            currmarker.content = results[0];
            for(var i=0;i<markers.length;i++){
              if(markers[i].content.id==currmarker.content.id){
                markers[i].content=results[0];
                break;
              }
            }
            updateContentWithCurrentMarker();
            infowindow.open(map, currmarker);
        },
      error: function(error) {
            console.log("Error:"+error.message);
        }
    }); 
}

//Close NProgress
function updateContentWithCurrentMarker(){
    console.log("updateContentWithCurrentMarker");
    var p_timestam=String(currmarker.content.createdAt);
    var p_timestamp=p_timestam.split(" ");
    var p_date=p_timestamp[0]+" "+p_timestamp[1]+" "+p_timestamp[2]+" "+p_timestamp[3];
    var p_time=p_timestamp[4];
    var p_content=currmarker.content.get('content');
    var p_type=currmarker.content.get('category');
    
    var p_latitude=currmarker.content.get('location').latitude;
    var p_longitude=currmarker.content.get('location').longitude;
    var p_location=p_latitude.toString().substring(0, 10)+", "+p_longitude.toString().substring(0, 10);
    getReverseGeocodingData(p_latitude, p_longitude);
    var p_id=currmarker.content.id;
    var p_photo=currmarker.content.get('file');
    var p_status=currmarker.content.get('status');
	var p_daysLeft=currmarker.content.get('daysLeft');
    var p_title=currmarker.content.get('title');
    var p_issueId=currmarker.content.get('issueId').toString();
    infowindow.setContent(p_issueId);
    infowindow.open(map, marker);
    var status=document.getElementById('colorstatus');
    var date=document.getElementById('date');
	var daysLeft=document.getElementById('daysLeft');
    var time=document.getElementById('time');
    var photo=document.getElementById('photo');
    var content=document.getElementById('content');
    var type=document.getElementById('type');
    var title=document.getElementById('ititle');
    
    var location=document.getElementById('location');
    var bigphoto=document.getElementById('bigphoto');
    var detailedissue=document.getElementById('detailedissue');
    $('#details-column').fadeOut(300);
    var myLatlng = new google.maps.LatLng(p_latitude,p_longitude); 
    map2.setCenter(myLatlng);
    singlemarker.setMap(null);
    var myicon;
    myicon=getIcon(p_type,p_status);
    singlemarker = new google.maps.Marker({ 
        position: myLatlng, 
        map: map2, 
        icon: myicon,
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
            status.innerHTML = '<strong>'+appropriateStatus(p_status)+'</strong>';
            date.innerHTML = p_date;
            time.innerHTML = p_time;
            if(p_content.length<50){
                content.innerHTML = p_content;
            }
            else{

                content.innerHTML = p_content.substring(0,30)+"...";
            }
            type.innerHTML = p_type;
            title.innerHTML = p_issueId+"<small> "+p_title+"</small>";
            location.innerHTML = p_location;
            if(p_photo!=undefined){
                console.log("photo is available");
                bigphoto.src=p_photo.url();
                photo.src=p_photo.url(); 
            }
            else{
                console.log("photo is unavailable");
                bigphoto.src="./assets/images/no_image.jpg";
                photo.src="./assets/images/no_image.jpg"; 
            }
            detailedissue.innerHTML=p_content; 
			daysLeft.innerHTML=p_daysLeft;
            populateUpdates();
            showDetailsView();
            if(currentUser.get("type")=="neta"){
                setIssueStatusButton();
            }
            else if(currentUser.get("type")=="teamMember"){
                setIssueStatusButtonTM();
            }
            
    },300); 
}

function showDetailsView(){
        console.log("showDetailsView");
        $('#details-column').fadeIn(300);
        $('#photo').delay(400).fadeIn(300);
        $('#content').delay(400).fadeIn(300);
        $('#details-button').delay(400).fadeIn(300);
}

function getIcon(category,status){
  var myicon;
  if (category=="road"){
        if(status=="closed" || status=="review"){
          myicon=iconso[0];
        }
        else{
          myicon=icons[0];
        }
    }
    else if(category=="electricity"){
        if(status=="closed" || status=="review"){
          myicon=iconso[1];
        }
        else{
          myicon=icons[1];
        }
    }
    else if(category=="water"){
        if(status=="closed" || status=="review"){
          myicon=iconso[2];
        }
        else{
          myicon=icons[2];
        }
    }
    else if(category=="law"){
        if(status=="closed" || status=="review"){
          myicon=iconso[3];
        }
        else{
          myicon=icons[3];
        }
    }
    else if(category=="sanitation"){
        if(status=="closed" || status=="review"){
          myicon=iconso[4];
        }
        else{
          myicon=icons[4];
        }
    }
    else{
        if(status=="closed" || status=="review"){
          myicon=iconso[5];
        }
        else{
          myicon=icons[5];
        }
    }
    return myicon;
}

function plotConstituency(c){
      console.log("Lets Plot a Constituency");
      ListItem = Parse.Object.extend("Constituency");
      query = new Parse.Query(ListItem);
      query.equalTo("index", c);    
      query.find({
            success: function(results) {
                  console.log("Starting Plotting: "+results[0].get("name"));
                  var Coords=[];
                  var pints=[];
                  var points=results[0].get("points");
                  console.log(points.length);
                  for (var i = 0; i < points.length; i++) { 
                      Coords.push(new google.maps.LatLng(points[i].latitude,points[i].longitude));
                      pints.push({x:points[i].latitude,y:points[i].longitude});
                  }
                  console.log("First:"+points[0].longitude);
                  console.log("Last:"+points[points.length-1].longitude);
                  Poly = new google.maps.Polygon({
                    paths: Coords,
                    strokeColor: '#0E629B',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    constituency: results[0].get("name"),
                    fillColor: '#0071BC',
                    fillOpacity: 0.35
                  });
                  console.log("Polygon Created!");
                  poly=Poly;
                  Poly.setMap(map);   
                  var i=0;
                  setTimeout( function() {
                      if(currentUser.get("type")=="teamMember"){
                        populateTM();
                      }
                      else if(currentUser.get("type")=="neta"){
                        populate();
                      }
                      populateTeam();
                  }, i * 500);                
              },
            error: function(error) {
                  console.log("Error:"+error.message);
            }
      });
  }

//Starts and Ends NProgress
function populateTM(){
        console.log("populate for Team Member");
        deleteMarkers();
        listView.html("");
        var no=0;
        var np=0;
        var nr=0;
        var nc=0;
        ListItem = Parse.Object.extend("Update");
        query = new Parse.Query(ListItem);
        query.descending('createdAt');
        var pointer = new Parse.Object("TeamMember");
        pointer.id = currentUser.get("teamMember").id;
        query.equalTo("assignee", pointer);
        query.equalTo("type", "assigned");
        query.include("issue");
        query.find({
          success: function(results) {
            for (var i = 0; i < results.length; i++) { 
                var object = results[i].get("issue");

                var myicon;
                if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(object.get('location').latitude, object.get('location').longitude), poly)==true){
                    //Set Icon
                    myicon=getIcon(object.get("category"),object.get("status"));
					
                                  
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
                    if(object.get("content").length > 50){
                        content=object.get("content").substring(0,50)+"...";
                    }
                    listView.append( "<tr id='"+object.id+"' class='"+object.get('status')+"' onClick='listViewClick("+object.id.toString()+");'><td width='100'>"+(object.get('issueId')).toString()+"</td><td width='100' class='ct'>"+object.get('category')+"</td><td class='ct'>"+content+"</td><td class='ct'>"+appropriateStatus(object.get('status'))+"</td><td width='100'>"+ago+" ago</td></tr>");                        
                    console.log("<tr id='"+object.id+"' class='"+object.get('status')+"' onClick='listViewClick("+object.id.toString()+");'><td width='100'>"+(object.get('issueId')).toString()+"</td><td width='100' class='ct'>"+object.get('category')+"</td><td class='ct'>"+content+"</td><td class='ct'>"+appropriateStatus(object.get('status'))+"</td><td width='100'>"+ago+" ago</td></tr>");                        
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
                            NProgress.start();
                            console.log("NProgress start");
                            if(infowindow) {
                                infowindow.close();
                            }
                            infowindow = new google.maps.InfoWindow({
                                maxWidth: 700,
                                maxHeight: 900
                            });
                            currmarker=marker;
                            updateCurrentMarker(currmarker);                        
                            infowindow.setContent(currmarker.content.get('status'));
                        }
                    })(marker,object));
                }
             } 
          statusCounters(no,np,nr,nc);
          filter();
          NProgress.done();
          console.log("NProgress Stop");
          },
          error: function(error) {
          }
        });
}
//Starts and Ends NProgress
function populate(){
        console.log("populate");
        deleteMarkers();
        listView.html("");
        var no=0;
        var np=0;
        var nr=0;
        var nc=0;
        ListItem = Parse.Object.extend("Issue");
        query = new Parse.Query(ListItem);
        query.descending('createdAt');
        query.find({
          success: function(results) {
            for (var i = 0; i < results.length; i++) { 
                var object = results[i];
                var myicon;
                if(currentUser.get("username")=="admin"){
                    //Set Icon
                    myicon=getIcon(object.get("category"),object.get("status"));
                                  
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
                    if(object.get("content").length > 50){
                        content=object.get("content").substring(0,50)+"...";
                    }
                    listView.append( "<tr id='"+object.id+"' class='"+object.get('status')+"' onClick='listViewClick("+object.id.toString()+");'><td width='100'>"+(object.get('issueId')).toString()+"</td><td width='100' class='ct'>"+object.get('category')+"</td><td class='ct'>"+content+"</td><td class='ct'>"+appropriateStatus(object.get('status'))+"</td><td width='100'>"+ago+" ago</td></tr>");                        
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
                            NProgress.start();
                            console.log("NProgress start");
                            if(infowindow) {
                                infowindow.close();
                            }
                            infowindow = new google.maps.InfoWindow({
                                maxWidth: 700,
                                maxHeight: 900
                            });
                            
                            currmarker=marker;
                            updateCurrentMarker(currmarker);                        
                            infowindow.setContent(currmarker.content.get('status'));
                            
                        }
                    })(marker,object));
                }
                else{
                    if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(object.get('location').latitude, object.get('location').longitude), poly)==true){
                        //Set Icon
                        myicon=getIcon(object.get("category"),object.get("status"));
                                      
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
                        if(object.get("content").length > 50){
                            content=object.get("content").substring(0,50)+"...";
                        }
                        listView.append( "<tr id='"+object.id+"' class='"+object.get('status')+"' onClick='listViewClick("+object.id.toString()+");'><td width='100'>"+(object.get('issueId')).toString()+"</td><td width='100' class='ct'>"+object.get('category')+"</td><td class='ct'>"+content+"</td><td class='ct'>"+appropriateStatus(object.get('status'))+"</td><td width='100'>"+ago+" ago</td></tr>");                        
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
                                NProgress.start();
                                console.log("NProgress start");
                                if(infowindow) {
                                    infowindow.close();
                                }
                                infowindow = new google.maps.InfoWindow({
                                    maxWidth: 700,
                                    maxHeight: 900
                                });
                                
                                currmarker=marker;
                                updateCurrentMarker(currmarker);                        
                                infowindow.setContent(currmarker.content.get('status'));
                                
                            }
                        })(marker,object));
                    }
                }
                
             } 
          statusCounters(no,np,nr,nc);
          filter();
          NProgress.done();
          console.log("NProgress Stop");
          },
          error: function(error) {
			  NProgress.done();
			  console.log("Error: "+error.message);
          }
        });
}



function categoryCheck(m){
    console.log("CategoryCheck");
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
    console.log("dateCheck");
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
    console.log("StatusCheck");
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
    console.log("statusCounter");
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
    console.log("filter");
    updateHistory();
    listView.html("");
    for(var m=0;m<markers.length;m++){
        if(statusCheck(markers[m])==1 && categoryCheck(markers[m])==1){// && dateCheck(markers[m])==1){
            var d=new Date((markers[m].content).createdAt);
            var ago=timeSince(d);
            var content=markers[m].content.get('content');
            if(markers[m].content.get('content').length > 50){
                    content=markers[m].content.get('content').substring(0,50)+"...";
            }

            listView.append( "<tr id='"+(markers[m].content).id+"' class='"+(markers[m].content).get('status')+"' onClick='listViewClick("+(markers[m].content).id.toString()+");'><td width='100' class='ct'>"+((markers[m].content).get('issueId')).toString()+"</td><td width='100' class='ct'>"+(markers[m].content).get('category')+"</td><td class='ct'>"+content+"</td><td width='100' class='ct'>"+appropriateStatus((markers[m].content).get('status'))+"</td><td width='100'>"+ago+" ago</td></tr>");                        
            markers[m].setMap(map);
        }else{
            markers[m].setMap(null);
          
        }
        
    }         
}  


function updateCounters(){
    var no=0;
    var np=0;
    var nr=0;
    var nc=0;
    for(var m=0;m<markers.length;m++){
        if(markers[m].getMap()!=null){
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
        }
    }  
    statusCounters(no,np,nr,nc);
}

function listViewClick(p) {
         NProgress.start();
         console.log("NProgress Start");
         var trid = p.id;
         var marker;
         console.log("you clicked on-"+p.id);
         for (var i = 0; i < markers.length; i++) { 
            console.log(markers[i].content.id);
            if(markers[i].content.id==trid){
              marker=markers[i];
              break;
            }
         }
         currmarker=marker;
         updateCurrentMarker(currmarker);   
         if(infowindow) {
            infowindow.close();
        }
        infowindow = new google.maps.InfoWindow({
            maxWidth: 700,
            maxHeight: 900
        });                     
         infowindow.setContent(currmarker.content.get('status'));
          
         console.log('test');
}

function initializeMap(){
  var constituency;
  if (currentUser.get("type")=="neta"){
      if(currentUser.get("username")!="admin"){
        var n=currentUser.get("neta");
        n.fetch({
          success:function(results1){
            //constituency=n.get("constituency");
			var Election = Parse.Object.extend("Election");
			election = new Parse.Query(Election);
			election.descending('createdAt');
			var pointer = new Parse.Object("Neta");
			pointer.id = n.id;
			election.equalTo("arrayNetas", pointer);
			election.include("constituency");
			election.find({
				success: function(results) {
					constituency=results[0].get("constituency");
					plotConstituency(constituency.get("index"));
					map.setCenter(new google.maps.LatLng(constituency.get("center").latitude, constituency.get("center").longitude));
				},
				error: function(error){
					NProgress.done();
					console.log("Error: "+error.message);
				}													
			});
            /*
			constituency.fetch({
              success:function(results2){
                plotConstituency(constituency.get("index"));
                map.setCenter(new google.maps.LatLng(constituency.get("center").latitude, constituency.get("center").longitude));
              },
              error:function(error){
                console.log("Error: "+error.message);
                NProgress.done();
              }
            });
			*/
          },
          error:function(error){
            console.log("Error: "+error.message);
            NProgress.done();
          }
        });
      }  
      else{
        populate();
        populateTeam();
      }
  }
  else{  
      var t=currentUser.get("teamMember");
      t.fetch({
        success:function(){
          var n=t.get("neta");
          n.fetch({
            success:function(results){
              /*constituency=n.get("constituency");
              constituency.fetch({
                success:function(results){
                  plotConstituency(constituency.get("index"));
                  map.setCenter(new google.maps.LatLng(constituency.get("center").latitude, constituency.get("center").longitude));
                },
                error:function(error){
                  console.log("Error: "+error.message);
                  NProgress.done();
                }
              });*/
				var Election = Parse.Object.extend("Election");
				election = new Parse.Query(Election);
				election.descending('createdAt');
				var pointer = new Parse.Object("Neta");
				pointer.id = n.id;
				election.equalTo("arrayNetas", pointer);
				election.include("constituency");
				election.find({
					success: function(results) {
						constituency=results[0].get("constituency");
						plotConstituency(constituency.get("index"));
						map.setCenter(new google.maps.LatLng(constituency.get("center").latitude, constituency.get("center").longitude));
					},
					error: function(error){
						NProgress.done();
						console.log("Error: "+error.message);
					}													
				});
            },
            error:function(error){
                console.log("Error: "+error.message);
                NProgress.done();
            }
          });
        },
        error:function(error){
            console.log("Error: "+error.message);
            NProgress.done();         
        }
      });
  }
}

// function initializeMap(){
//   var constituency;
//   if (currentUser.get("type")=="neta"){
//         ListItem = Parse.Object.extend("User");
//         query = new Parse.Query(ListItem);
//         query.equalTo("objectId", CU.id);
//         query.include("neta");
//         query.include(["neta.party"]);
//         query.include(["neta.constituency"]);
//         query.ascending('createdAt');
//         query.find({
//               success: function(results) {
//                 if(currentUser.get("username")!="admin"){
//                   console.log(results[0].get("neta").get("constituency"));
//                   constituency=results[0].get("neta").get("constituency");
//                   plotConstituency(constituency.get("index"));
//                   map.setCenter(new google.maps.LatLng(constituency.get("center").latitude, constituency.get("center").longitude));
//                 }  
//                 else{
//                   populate();
//                   populateTeam();
//                 }
//               },
//               error: function(error){
//                 console.log("Error: "+error.message); 
//               }
//         });
//   }
//   else{
//         ListItem = Parse.Object.extend("User");
//         query = new Parse.Query(ListItem);
//         query.equalTo("objectId", CU.id);
//         query.include("teamMember");
//         query.include(["teamMember.neta"]);
//         query.include(["teamMember.neta.party"]);
//         query.include(["teamMember.neta.constituency"]);
//         query.ascending('createdAt');
//         query.find({
//               success: function(results) {
//                 constituency=results[0].get("teamMember").get("neta").get("constituency");
//                 plotConstituency(constituency.get("index"));
//                 map.setCenter(new google.maps.LatLng(constituency.get("center").latitude, constituency.get("center").longitude));
//               },
//               error: function(error){
//                 console.log("Error: "+error.message);
//               }
//         });
      
//   }
// }


function initialize() {
    console.log("initialize");
    currentUser = CU;
    NProgress.start();
    console.log("NProgress Start");
    var pphoto=document.getElementById('profilepic');
    if(currentUser.get("pic")!=undefined){
      pphoto.src=currentUser.get("pic").url(); 
    }
    else{
      pphoto.src=getDefaultIcon(currentUser.get("type"));
    }

    if (currentUser.get("type")=="neta"){
        console.log("Current User is a Neta");
        document.getElementById("neta-panel").style.display="block";

    }
    else{
        console.log("Current User is a Team Member");
        document.getElementById("neta-panel").style.display="none";

    }
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

    initializeMap();
    
    var homeControlDiv = document.createElement('div');
    var homeControl = new CurrentLocationControl(homeControlDiv, map);

    homeControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);

    singlemarker= new google.maps.Marker({
                position: new google.maps.LatLng(28.612912,77.22951),
                map: map2,
                title: 'Current Location',
                draggable: false,
                animation: google.maps.Animation.DROP
            });

    var homeControlDiv2 = document.createElement('div');
    var homeControl2 = new FixedLocationControl(homeControlDiv2, map2);

    homeControlDiv2.index = 1;
    map2.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv2);

    // if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(function(position) {
    //         var latitude = position.coords.latitude;
    //         var longitude = position.coords.longitude;
    //         var geolocpoint = new google.maps.LatLng(latitude, longitude);
    //         map.setCenter(geolocpoint);
    //         map.setZoom(12);
    //         var iconURLPrefix = './assets/images/';
    //         if(geomarker1!=undefined){
    //           geomarker1.setMap(null);
    //         }
    //         geomarker1 = new google.maps.Marker({
    //             position: geolocpoint,
    //             map: map,
    //             title: 'Current Location',
    //             draggable: false,
    //             animation: google.maps.Animation.DROP
    //         });
    //     });
        
    // }            

    $('input[type=checkbox]').change(
        function(){
            updateHistory();
            NProgress.start();
            console.log("NProgress Start");
            if(infowindow) {
                infowindow.close();
            }
            filter();
            
            if ($(this).attr('id')=="law_cb" || $(this).attr('id')=="road_cb" || $(this).attr('id')=="electricity_cb" || $(this).attr('id')=="sanitation_cb" || $(this).attr('id')=="transport_cb" || $(this).attr('id')=="water_cb"){
                updateCounters();
            }
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
            console.log("NProgress Stop");
        });

    $('input[name=maptglgroup]').change(function(){
        NProgress.start();
        console.log("NProgress Start");
        enableCheckPoints();
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
                map2.setCenter(singlemarker.getPosition());
            },1000);
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
        
        if(currentUser.get("type")=="teamMember"){
          populateTM();
        }
        else if(currentUser.get("type")=="neta"){
          populate();
        }
    });

    $('#claim-st1').click(function(){
        disableDetailsView();
        postClaim();
    });

    $('#claim-st2').click(function(){
        disableDetailsView();
        var q= $('#team').val();
        if(q!=null){
          postAssignment(q);
        }
    });

    $('#close').click(function(){
        disableDetailsView();
        postClose();
    });

    $('#comment-form').submit(function(event){
          event.preventDefault();
          var comment=document.getElementById("comment").value;
          postComment(comment);
    });

    $('#back').click(function(){
        updateHistory();
        NProgress.start();
        console.log("NProgress Start");
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
        
        enableCheckPoints();
        
        if(currentUser.get("type")=="teamMember"){
          populateTM();
        }
        else if(currentUser.get("type")=="neta"){
          populate();
        }
    });



    $('#details-button').click(function(){
        updateHistory();
        NProgress.start();
        console.log("NProgress Start");
        disableCheckPoints(currmarker.content.get("category"),currmarker.content.get("status"));
        if(infowindow) {
            infowindow.close();
        }
        $('#list-view').delay(400).fadeOut(300);
        $('#map-view').delay(400).fadeOut(300);
        $('#updates-view').delay(400).fadeIn(300);
        setTimeout(function(){
            google.maps.event.trigger(map2, 'resize');
            map2.setZoom( map2.getZoom() );
            map2.setCenter(singlemarker.getPosition());
        },700);
        $('#photo').delay(400).fadeOut(300);
        $('#content').delay(400).fadeOut(300);
        $('#details-button').delay(400).fadeOut(300);
        $('#back').delay(400).fadeIn(300);
        NProgress.done();
        console.log("NProgress Stop");
    });


   /* $('#reportrange').daterangepicker(
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
            $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            filter();
            updateCounters();
        }
    ); */
}
