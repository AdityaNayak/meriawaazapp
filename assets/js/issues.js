//var constituency;
var file;
var filePath;
var filename;

var constituencyType;
var polyArray = [];
var poly;
var view = 0;

var specificIssue;
var specificNum;

var listView = $('#list-view tbody');
var timelineView = $('#timeline-view');
var teamView = $('#team');
var officialView = $('#officials');
var upvotesView = $('#droptop_upvotes');

var box_r = document.getElementById('road_cb');
var box_e = document.getElementById('electricity_cb');
var box_w = document.getElementById('water_cb');
var box_l = document.getElementById('law_cb');
var box_s = document.getElementById('sanitation_cb');
var box_t = document.getElementById('transport_cb');

var box_pr = document.getElementById('prog_it');
var box_rv = document.getElementById('review_it');
var box_cl = document.getElementById('closed_it');
var box_op = document.getElementById('open_it');

var infowindow;

var numcategory = 6;
var map;
var map2;

var currmarker;
var currentUser;
var team = [];
var officials = [];
var markers = [];
var singlemarker;
var geomarker1;

var iconURLPrefix = './assets/images/';
var width = 40;
var height = 40;
var anchor_left = 20;
var anchor_top = 40;
var icons_url = [
    iconURLPrefix + 'marker-1.png',
    iconURLPrefix + 'marker-2.png',
    iconURLPrefix + 'marker-3.png',
    iconURLPrefix + 'marker-4.png',
    iconURLPrefix + 'marker-5.png',
    iconURLPrefix + 'marker-6.png'
];

var icons_url_close = [
    iconURLPrefix + 'marker-1-o.png',
    iconURLPrefix + 'marker-2-o.png',
    iconURLPrefix + 'marker-3-o.png',
    iconURLPrefix + 'marker-4-o.png',
    iconURLPrefix + 'marker-5-o.png',
    iconURLPrefix + 'marker-6-o.png'
];

var icon1 = {
    url: icons_url[0], // url
    scaledSize: new google.maps.Size(width, height), // size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(anchor_left, anchor_top) // anchor 
};
var icon2 = {
    url: icons_url[1], // url
    scaledSize: new google.maps.Size(width, height), // size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(anchor_left, anchor_top) // anchor 
};
var icon3 = {
    url: icons_url[2], // url
    scaledSize: new google.maps.Size(width, height), // size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(anchor_left, anchor_top) // anchor 
};
var icon4 = {
    url: icons_url[3], // url
    scaledSize: new google.maps.Size(width, height), // size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(anchor_left, anchor_top) // anchor 
};
var icon5 = {
    url: icons_url[4], // url
    scaledSize: new google.maps.Size(width, height), // size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(anchor_left, anchor_top) // anchor 
};
var icon6 = {
    url: icons_url[5], // url
    scaledSize: new google.maps.Size(width, height), // size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(anchor_left, anchor_top) // anchor 
};

var icon1o = {
    url: icons_url_close[0], // url
    scaledSize: new google.maps.Size(width, height), // size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(anchor_left, anchor_top) // anchor 
};
var icon2o = {
    url: icons_url_close[1], // url
    scaledSize: new google.maps.Size(width, height), // size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(anchor_left, anchor_top) // anchor 
};
var icon3o = {
    url: icons_url_close[2], // url
    scaledSize: new google.maps.Size(width, height), // size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(anchor_left, anchor_top) // anchor 
};
var icon4o = {
    url: icons_url_close[3], // url
    scaledSize: new google.maps.Size(width, height), // size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(anchor_left, anchor_top) // anchor 
};
var icon5o = {
    url: icons_url_close[4], // url
    scaledSize: new google.maps.Size(width, height), // size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(anchor_left, anchor_top) // anchor 
};
var icon6o = {
    url: icons_url_close[5], // url
    scaledSize: new google.maps.Size(width, height), // size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(anchor_left, anchor_top) // anchor 
};

var icons = [
    icon1,
    icon2,
    icon3,
    icon4,
    icon5,
    icon6
];

var iconso = [
    icon1o,
    icon2o,
    icon3o,
    icon4o,
    icon5o,
    icon6o
];

function getQueryVariable(variable){
   var query = window.location.search.substring(1);
   var vars = query.split("?");
   for (var i=0;i<vars.length;i++) {
           var pair = vars[i].split("=");
           if(pair[0] == variable){return pair[1];}
   }
   return(false);
}

// Creates the Array of Constituencies
function createConstituencyArray() {
    console.log("createConstituencyArray");
    var constituencyArra = ["deoli", "tughlakabad", "okhla", "kalkaji", "sangam vihar"];
    ListItem = Parse.Object.extend("Constituency");
    query = new Parse.Query(ListItem);
    query.containedIn("name", constituencyArra);
    query.find({
        success: function(results) {
            testing = [];
            for (var i = 0; i < results.length; i++) {
                object = results[i];
                testing.push(object);
            }
            console.log(JSON.stringify(testing));
        },
        error: function(error) {
            console.log("Error: " + error.message);
            notify(standardErrorMessage, "error", standardErrorDuration);
        }
    });
}

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
    var address = "-";
    geocoder.geocode({
        'latLng': latlng
    }, function(results, status) {
        if (status !== google.maps.GeocoderStatus.OK) {
            console.log(status);
        }
        // This is checking to see if the Geoeode Status is OK before proceeding
        if (status == google.maps.GeocoderStatus.OK) {
            address = (results[0].formatted_address);
            console.log(address);
            var p_address = document.getElementById('address');
            p_address.innerHTML = address;
        }
    });

}

function getUpvotes(){
    NProgress.start();
    upvotesView.html("");
    upvotesView.html("<li class='columns brbm'><strong>Upvotes</strong></li>");
    Parse.Cloud.run("getPeople", {
        class: "Issue",
        id: currmarker.content.id,
        column: "issuesUpvoted"
    }, {
        success: function(results) {
            result=results.result;
            console.log("Upvotes Size:" + result.length);
            console.log("Upvotes:" + result);
            for(var i=0;i<result.length;i++){
                upvotesView.append("<li>"+result[i]+"</li>");
            }
            NProgress.done();
            console.log("NProgress Stop");
        },
        error: function(error) {
            notify('Failed to fetch Upvotes!' + error.message, "error", standardErrorDuration);
            NProgress.done();
        }
    });
    query.find({
        success: function(results) {
            
        },
        error: function(error) {
            console.log("Error: " + error.message);
            notify(standardErrorMessage, "error", standardErrorDuration);
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
                if (geomarker1 != undefined) {
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


function enableDetailsView() {
    $('#details-panel').children().prop('disabled', false);
}

function disableDetailsView() {
    $('#details-panel').children().prop('disabled', true);
}

// Enable CheckBoxs 
function enableCheckPoints() {
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

function disableCheckPoints(c, i) {
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

function enableCategoryIcons() {
    console.log("enableCategoryIcons");
    $("#road_cb").closest("label").toggleClass("gs", false);
    $("#electricity_cb").closest("label").toggleClass("gs", false);
    $("#water_cb").closest("label").toggleClass("gs", false);
    $("#law_cb").closest("label").toggleClass("gs", false);
    $("#sanitation_cb").closest("label").toggleClass("gs", false);
    $("#transport_cb").closest("label").toggleClass("gs", false);
}

function disbleCategoryIcons(i) {
    console.log("disableCategoryIcons");
    if (i != "road") {
        $("#road_cb").closest("label").toggleClass("gs", true);
    }
    if (i != "electricity") {
        $("#electricity_cb").closest("label").toggleClass("gs", true);
    }
    if (i != "water") {
        $("#water_cb").closest("label").toggleClass("gs", true);
    }
    if (i != "law") {
        $("#law_cb").closest("label").toggleClass("gs", true);
    }
    if (i != "sanitation") {
        $("#sanitation_cb").closest("label").toggleClass("gs", true);
    }
    if (i != "transport") {
        $("#transport_cb").closest("label").toggleClass("gs", true);
    }
}

function enableStatusIcons() {
    console.log("enableStatusIcons");
    $('#fn2').closest("label").toggleClass("gs", false);
    $('#fn3').closest("label").toggleClass("gs", false);
    $('#fn4').closest("label").toggleClass("gs", false);
    $('#fn1').closest("label").toggleClass("gs", false);
}

// Refresh Screen
// Starts NProgress
function refresh1() {
    NProgress.start();
    console.log("NProgress Start");
    if (infowindow) {
        infowindow.close();
    }
    $('#photo').delay(400).fadeIn(300);
    $('#content').delay(400).fadeIn(300);
    $('#details-button').delay(400).fadeIn(300);
    if (view == 1) {
        $('#list-view').delay(400).fadeIn(300);
        $('#map-view').delay(400).fadeOut(300);
    } else {
        $('#map-view').delay(400).fadeIn(300);
        setTimeout(function() {
            google.maps.event.trigger(map, 'resize');
            map.setZoom(map.getZoom());
        }, 700);
        $('#list-view').delay(400).fadeOut(300);
    }
    $('#details-column').delay(400).fadeOut(300);
    $('#updates-view').delay(400).fadeOut(300);
    $('#back').delay(400).fadeOut(300);
    enableCheckPoints();
    if (currentUser.get("type") == "neta") {
        populate();
    } else if (currentUser.get("type") == "teamMember") {
        populateTM();
    }
}

// Refresh Current Selected Marker
function refresh2() {
    updateCurrentMarker(currmarker);
}


function disbleStatusIcons(i) {

    console.log("disableStatusIcons" + i);
    if (i != "progress") {
        console.log("adding to progress");
        $('#fn2').closest("label").toggleClass("gs", true);
    }
    if (i != "review") {
        console.log("adding to review");
        $('#fn3').closest("label").toggleClass("gs", true);
    }
    if (i != "closed") {
        console.log("adding to closed");
        $('#fn4').closest("label").toggleClass("gs", true);
    }
    if (i != "open") {
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


function removeComment(cid,pid){
    console.log("removeComment-"+cid);
    NProgress.start();
    Parse.Cloud.run("report", {
        oClass: "Update",
        objId: cid,
        rStatus: 1
    }, {
        success: function(results) {
            console.log(results);
            updateCurrentMarker(currmarker);
            enableDetailsView();
        },
        error: function(error) {
            notify('Failed to remove Comment!' + error.message, "error", standardErrorDuration);
            NProgress.done();
        }
    });
}


// 
function populateUpdates() {
    console.log("populateUpdates");
    timelineView.html("");
    ListItem = Parse.Object.extend("Update");
    query = new Parse.Query(ListItem);
    var pointer = new Parse.Object("Issue");
    pointer.id = currmarker.content.id;
    query.equalTo("issue", pointer);
    query.include("assignee");
    query.notEqualTo("reported",1);
    query.include(["assignee.pUser"]);
    query.include("pUser");
    query.ascending('createdAt');
    query.find({
        success: function(results) {
            console.log("Size:" + results.length);
            var d;
            var ago;
            var content;
            var user;
            var assignee;
            for (var i = 0; i < results.length; i++) {
                object = results[i];
                objectId=object.id;
                d = new Date(object.createdAt);
                ago = timeSince(d);
                if (object.get("content") != undefined) {
                    content = object.get("content");
                } else {
                    content = "";
                }
                user = object.get("pUser");
                    if(user!=undefined){
                    if (object.get("assignee") != undefined) {
                        assignee = object.get("assignee");
                        console.log("comments" + assignee.get("pUser"));
                    } else {
                        assignee = "";
                    }
                    var pphoto1;
                    if (user.get("pic") != undefined) {
                        pphoto1 = user.get("pic").url();
                    } else {
                        pphoto1 = getDefaultIcon(user.get("type"));
                    }
                    if (object.get("typeCode") == TypeEnum.UNASSIGNED) {
                        console.log(assignee);
                        var ass = assignee.get("pUser");
                        timelineView.append("<div class='panel nb'><p><strong class='ct'>" + ass.get("name") + "</strong> was unassigned by <strong class='ct'>" + user.get("username") + "</strong> <small>" + ago + " ago</small></p></div>");
                    }
                    if (object.get("typeCode") == TypeEnum.ASSIGNED) {
                        var ass = assignee.get("pUser");
                        timelineView.append("<div class='panel nb'><p><strong class='ct'>" + ass.get("name") + "</strong> was assigned by <strong class='ct'>" + user.get("username") + "</strong> <small>" + ago + " ago</small></p></div>");
                    }
                    if (object.get("typeCode") == TypeEnum.CLOSED) {
                        timelineView.append("<div class='panel nb'><p><strong class='ct'>" + user.get("name") + "</strong> closed the issue <small>" + ago + " ago</small></p></div>");

                    }
                    if (object.get("typeCode") == TypeEnum.COMMENT) {
                        if(object.get("file")==undefined){
                            timelineView.append("<div class='row'><div class='small-2 columns wbg-fx wd-fx text-right'><img src='" + pphoto1 + "' class='circle-img'>"+user.get("username")+"</div><div class='small-10 columns'><div class='panel p-fx'><div class='panel-head'><strong class='ct'>" + user.get("username") + "</strong> commented <small>" + ago + " ago</small><i id='close-"+objectId+"'class='reportbtn icon-close hv cs tertiary-color' style='float:right;'></i></div><p>" + content + "</p></div></div></div>");
                        }
                        else{
                            var comimage= '<img style="width:100%; margin-top:10px; border:none;"  src="'+object.get("file").url()+'"/>';
                            timelineView.append("<div class='row'><div class='small-2 columns wbg-fx wd-fx text-right'><img src='" + pphoto1 + "' class='circle-img'>"+user.get("username")+"</div><div class='small-10 columns'><div class='panel p-fx'><div class='panel-head'><strong class='ct'>" + user.get("username") + "</strong> commented <small>" + ago + " ago</small><i id='close-"+objectId+"'class='reportbtn icon-close hv cs tertiary-color' style='float:right;'></i></div>"+comimage+"<p>" + content + "</p></div></div></div>");
                        }
                        
                    }
                    $("#close-"+objectId).click(function(event){
                        event.preventDefault();
                        removeComment(event.target.id.toString().split('-')[1],pointer.id);
                    });
                    if (object.get("typeCode") == TypeEnum.CLAIM) {
                        timelineView.append("<div class='panel nb'><p><strong class='ct'>" + user.get("name") + "</strong> claimed this issue <small>" + ago + " ago</small></p></div>");
                    }
                    if (object.get("typeCode") == TypeEnum.VERIFIED) {
                        timelineView.append("<div class='panel nb'><p><strong class='ct'>This issue was verified <small>" + ago + " ago</small></p></div>");
                    }
                    if (object.get("typeCode") == TypeEnum.WORKING) {
                        var ass = assignee.get("pUser");
                        timelineView.append("<div class='panel nb'><p><strong class='ct'>" + ass.get("name")+ "</strong> started working on this issue <small>" + ago + " ago</small></p></div>");
                    }
                    if (object.get("typeCode") == TypeEnum.FINISHED) {
                        var ass = assignee.get("pUser");
                        timelineView.append("<div class='panel nb'><p><strong class='ct'>" + ass.get("name") + "</strong> finished working on this issue <small>" + ago + " ago</small></p></div>");
                    }
                }
            }
            NProgress.done();
            console.log("NProgress Stop");

        },
        error: function(error) {
            console.log("Error: " + error.message);
            notify(standardErrorMessage, "error", standardErrorDuration);
        }
    });
}

function populateTeam() {
    console.log("populateTeam");
    teamView.html("<option selected disabled hidden value='Assign a Team Member'></option>");
    ListItem = Parse.Object.extend("TeamMember");
    query = new Parse.Query(ListItem);
    query.include("pUser");
    query.include("netaArray");
    query.equalTo("netaArray", currentUser.get("neta"));
    query.find({
        success: function(results) {
            team = [];
            for (var i = 0; i < results.length; i++) {
                object = results[i];
                team.push(object);
                teamView.append("<option value=" + object.id + ">" + object.get('pUser').get('name') + "</option>");
            }
        },
        error: function(error) {
            console.log("Error: " + error.message);
            notify(standardErrorMessage, "error", standardErrorDuration);
        }
    });

}

function populateOfficials() {
    console.log("populateOfficials");
    officialView.html("<option selected disabled hidden value='Text an Official'></option>");
    ListItem = Parse.Object.extend("GovtOfficial");
    query = new Parse.Query(ListItem);
    query.equalTo("constituency", constituency);
    query.find({
        success: function(results) {
            officials = [];
            for (var i = 0; i < results.length; i++) {
                object = results[i];
                officials.push(object);
                officialView.append("<option value=" + object.id + ">" + object.get('name') + "</option>");
            }
        },
        error: function(error) {
            console.log("Error: " + error.message);
            notify(standardErrorMessage, "error", standardErrorDuration);
        }
    });

}

function postComment(c){
       if(file!=undefined){
            var parsefile=new Parse.File(file.name,file);
            parsefile.save().then(function(){
            //  console.log('postStatus');
                NProgress.start();
            //  console.log("NProgress Start");
            //  console.log("postStatus");

                
                loadingButton_id("commit_btn", 4);
                var Comment = Parse.Object.extend("Update");
                var comment = new Comment();
                var u = new Parse.Object("_User");
                var i = new Parse.Object("Issue");
                u.id = currentUser.id;
                i.id = currmarker.content.id;
                comment.set("type", "comment");
                comment.set("content", c);
                comment.set("issue", i);
                comment.set("user", u);

                comment.set("file",parsefile);
                comment.save(null, {
                    success: function(comment) {
                        updateCurrentMarker(currmarker);
                        document.getElementById("comment").value = "";
                        $('#thumbnil').attr("src","");
                        enableDetailsView();
                        file=undefined;
                        filename=undefined;
                        filePath=undefined;

                    },
                    error: function(comment, error) {
                        alert('Failed to Comment! ' + error.message);
                        $('#thumbnil').attr("src","");
                        enableDetailsView();
                        file=undefined;
                        filename=undefined;
                        filePath=undefined;
                    }
                });
            });
        }
    else{
        //  console.log('postStatus');
            NProgress.start();
        //  console.log("NProgress Start");
        //  console.log("postStatus");
            loadingButton_id("commit_btn", 4);
            var Comment = Parse.Object.extend("Update");
            var comment = new Comment();
            var u = new Parse.Object("_User");
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
                    document.getElementById("comment").value = "";
                    enableDetailsView();

                },
                error: function(comment, error) {
                    alert('Failed to Comment! ' + error.message);
                    enableDetailsView();
                }
            });
    }
 //   console.log("postComment"+pid);
}

function showMyImage(fileInput) {
//      console.log("Display Thumbnail");
    $('#thumbnil').fadeIn();
    var files = fileInput.files;
    for (var i = 0; i < files.length; i++) {           
        var file = files[i];
        var imageType = /image.*/;     
        if (!file.type.match(imageType)) {
            continue;
        }           
        var img=document.getElementById("thumbnil");            
        img.file = file;    
        var reader = new FileReader();
        reader.onload = (function(aImg) { 
            return function(e) { 
                aImg.src = e.target.result; 
            }; 
        })(img);
        reader.readAsDataURL(file);
    }    
}



//Starts NProgress
function postClaim() {
    NProgress.start();
    console.log("NProgress Start");
    if (currentUser.get("type") != "neta") {
        alert("You do not have the required permissions");
        return;
    }
    console.log("postClaim");
    var Claim = Parse.Object.extend("Update");
    var claim = new Claim();
    var u = new Parse.Object("_User");
    var i = new Parse.Object("Issue");
    u.id = currentUser.id;
    i.id = currmarker.content.id;
    claim.set("issue", i);
    claim.set("type", "claim");
    claim.set("user", u);
    var form = document.getElementById("estimateddays");
    var days = form.time.value;
    console.log(days);
    claim.save(null, {
        success: function(claim) {
            console.log(i.id);
            Parse.Cloud.run("changeStatus", {
                objectId: i.id,
                status: "progress",
                claimDays: days
            }, {
                success: function(results) {
                    console.log(results);
                    updateCurrentMarker(currmarker);
                    enableDetailsView();
                },
                error: function(error) {
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
function reportWrong() {
    NProgress.start();
    console.log("NProgress Start");
    if (currentUser.get("type") != "neta") {
        alert("You do not have the required permissions");
        return;
    }
    console.log("postClaim");
    Parse.Cloud.run("reportWrong", {
        objectId: currmarker.content.id
    }, {
        success: function(results) {
            console.log(results);
            location.reload();
        },
        error: function(error) {
            console.log(error);
        }
    });
}

//Starts NProgress
function postClose() {
    NProgress.start();
    console.log("NProgress Start");
    if (currentUser.get("type") != "neta" && currentUser.get("type") != "teamMember") {
        alert("You do not have the required permissions");
        return;
    }
    console.log("postClose");
    var Close = Parse.Object.extend("Update");
    var close = new Close();
    var u = new Parse.Object("_User");
    var i = new Parse.Object("Issue");
    u.id = currentUser.id;
    i.id = currmarker.content.id;
    close.set("issue", i);
    close.set("type", "closed");
    close.set("user", u);

    close.save(null, {
        success: function(close) {
            Parse.Cloud.run("changeStatus", {
                objectId: i.id,
                status: "review"
            }, {
                success: function(results) {
                    console.log(results);
                    updateCurrentMarker(currmarker);
                    enableDetailsView();
                },
                error: function(error) {
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

function appropriateStatus(s) {
    if (s == StatusEnum.PROGRESS) {
        return "in progress";
    }
    if (s == StatusEnum.CLOSE) {
        return "solved"
    }
    if (s == StatusEnum.OPEN) {
        return "open";
    }
    if (s == StatusEnum.VERIFY) {
        return "verified"
    }
    return s;
}

function teamMember(id) {
    console.log("teamMember");
    console.log("Find Team Member with ID: " + id);
    var member;
    for (var i = 0; i < team.length; i++) {
        if (team[i].id == id) {
            member = team[i];
            console.log("Member Found: " + member.id);
            return member;
        }
    }
}

function official(id) {
    console.log("official");
    console.log("Find Official with ID: " + id);
    var member;
    for (var i = 0; i < officials.length; i++) {
        if (officials[i].id == id) {
            member = officials[i];
            console.log("Member Found: " + member.id);
            return member;
        }
    }
}

//Starts NProgress
function postOfficial(id) {
    NProgress.start();
    console.log("NProgress Start");
    if (currentUser.get("type") != "neta") {
        alert("You do not have the required permissions");
        return;
    }
    console.log("postOfficial");

    var Assign = Parse.Object.extend("GovtOfficialUpdate");
    var assign = new Assign();
    var u = new Parse.Object("_User");
    var i = new Parse.Object("Issue");
    var a = new Parse.Object("govtOfficial");
    var member = official(id);
    u.id = currentUser.id;
    a.id = member.id;
    i.id = currmarker.content.id;
    assign.set("issue", i);
    assign.set("netaUser", u);
    assign.set("official", a);
    assign.save(null, {
        success: function(assign) {
            notify("SMS sent!", "success",standardSuccessDuration);
            NProgress.done();
        },
        error: function(assign, error) {
            notify(standardErrorMessage, "error", standardErrorDuration);
            NProgress.done();
        }
    });
}


//Starts NProgress
function postAssignment(id) {
    NProgress.start();
    console.log("NProgress Start");
    if (currentUser.get("type") != "neta") {
        alert("You do not have the required permissions");
        return;
    }
    console.log("postAssignment");
    ListItem = Parse.Object.extend("Update");
    query = new Parse.Query(ListItem);
    var pointer = new Parse.Object("Issue");
    pointer.id = currmarker.content.id;
    var u1 = new Parse.Object("_User");
    u1.id = currentUser.id;
    query.equalTo("issue", pointer);
    query.equalTo("user", u1);
    query.equalTo("type", "assigned");
    query.find({
        success: function(results) {
            var countclaims = 0;
            console.log("People already Assigned" + results.length);
            if (results.length != 0) {
                var Assign = Parse.Object.extend("Update");
                var assign = new Assign();
                var u = new Parse.Object("_User");
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
                        var u2 = new Parse.Object("_User");
                        var i2 = new Parse.Object("Issue");
                        var a2 = new Parse.Object("TeamMember");
                        var member2 = teamMember(id);
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
            } else {
                var Assign = Parse.Object.extend("Update");
                var assign = new Assign();
                var u = new Parse.Object("_User");
                var i = new Parse.Object("Issue");
                var a = new Parse.Object("TeamMember");
                var member = teamMember(id);
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
            console.log("Error: " + error.message);
            notify(standardErrorMessage, "error", standardErrorDuration);
            
        }
    });
}


function setIssueStatusButton() {
    console.log("setIssueStatusButton");
    if (currmarker.content.get("statusCode") == StatusEnum.VERIFY || currmarker.content.get("statusCode") == StatusEnum.CLOSE) {
        $('#claim-st1').delay(400).fadeOut(300);
        $('#timebox').delay(400).fadeOut(300);
        $('#claim-st2').delay(400).fadeOut(300);
        $('#close').delay(400).fadeOut(300);
        $('#estimateddaysleft').delay(400).fadeOut(300);
        $('#team').delay(400).fadeOut(300);
        ListItem = Parse.Object.extend("Update");
        query = new Parse.Query(ListItem);
        var pointer = new Parse.Object("Issue");
        pointer.id = currmarker.content.id;
        var u = new Parse.Object("_User");
        u.id = currentUser.id;
        query.equalTo("issue", pointer);
        query.equalTo("user", u);
        query.include("assignee");
        query.include(["assignee.user"]);
        query.include("pUser");
        query.descending('createdAt');

        query.find({
            success: function(results) {
                console.log("check:" + results.length);
                var countclaims = 0;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].get("type") == "claim") {
                        countclaims += 1;
                    }
                }
                var assignedto = document.getElementById('claim-st3');
                assignedto.innerHTML = "Assigned to: <strong>No One</strong>";
                for (var i = 0; i < results.length; i++) {
                    if (results[i].get("assignee") != undefined) {
                        console.log(results[i].get("assignee"));
                        var up = results[i].get("assignee");
                        var dp = up.get("pUser");
                        assignedto.innerHTML = "Assigned to: <strong><span class='ct'>" + dp.get("name") + "</span></strong>";
                        break;
                    }
                }
            },
            error: function(error) {
                console.log("Error: " + error.message);
                notify(standardErrorMessage, "error", standardErrorDuration);
            }
        });
    } else {
        ListItem = Parse.Object.extend("Update");
        query = new Parse.Query(ListItem);
        var pointer = new Parse.Object("Issue");
        pointer.id = currmarker.content.id;
        var u = new Parse.Object("_User");
        u.id = currentUser.id;
        query.equalTo("issue", pointer);
        query.equalTo("user", u);
        query.include("assignee");
        query.include("pUser");
        query.include(["assignee.pUser"]);
        query.descending('createdAt');

        query.find({
            success: function(results) {
                var countclaims = 0;

                for (var i = 0; i < results.length; i++) {

                    if (results[i].get("type") == "claim") {
                        countclaims += 1;
                    }
                }
                var assignedto = document.getElementById('claim-st3');
                assignedto.innerHTML = "Assigned to: <strong>no one</strong>";
                for (var i = 0; i < results.length; i++) {

                    if (results[i].get("assignee") != undefined) {

                        var up = results[i].get("assignee");
                        var dp = up.get("pUser");
                        assignedto.innerHTML = "Assigned to: <strong>" + dp.get("name") + "</strong>";
                        break;
                    }
                }

                if (countclaims == 0) {
                    $('#claim-st1').delay(400).fadeIn(300);
                    $('#timebox').delay(400).fadeIn(300);
                    $('#claim-st2').delay(400).fadeOut(300);
                    $('#close').delay(400).fadeOut(300);
                    $('#estimateddaysleft').delay(400).fadeOut(300);
                    $('#team').delay(400).fadeOut(300);
                } else {
                    $('#claim-st1').delay(400).fadeOut(300);
                    $('#timebox').delay(400).fadeOut(300);
                    $('#claim-st2').delay(400).fadeIn(300);
                    $('#close').delay(400).fadeIn(300);
                    $('#estimateddaysleft').delay(400).fadeIn(300);
                    $('#team').delay(400).fadeIn(300);
                }
            },
            error: function(error) {
                console.log("Error: " + error.message);
                notify(standardErrorMessage, "error", standardErrorDuration);
            }
        });
    }
}

function setIssueStatusButtonTM() {
    console.log("setIssueStatusButton");
    if (currmarker.content.get("statusCode") == StatusEnum.VERIFY || currmarker.content.get("statusCode") == StatusEnum.CLOSE) {
        $('#close').delay(400).fadeOut(300);
        $('#estimateddaysleft').delay(400).fadeOut(300);
    } else {
        $('#close').delay(400).fadeIn(300);
        $('#estimateddaysleft').delay(400).fadeIn(300);
    }
}


function updateCurrentMarker(m) {
    console.log("updateCurrentMarker");
    ListItem = Parse.Object.extend("Issue");
    query = new Parse.Query(ListItem);
    query.equalTo("objectId", m.content.id);
    query.find({
        success: function(results) {
            //console.log("current marker updated: " + results.length);
            currmarker.content = results[0];
            for (var i = 0; i < markers.length; i++) {
                if (markers[i].content.id == currmarker.content.id) {
                    markers[i].content = results[0];
                    break;
                }
            }
            updateContentWithCurrentMarker();
            infowindow.open(map, currmarker);
        },
        error: function(error) {
            console.log("Error: " + error.message);
            notify(standardErrorMessage, "error", standardErrorDuration);
        }
    });
}

//Close NProgress
function updateContentWithCurrentMarker() {
    console.log("updateContentWithCurrentMarker");
    var p_timestam = String(currmarker.content.createdAt);
    var p_timestamp = p_timestam.split(" ");
    var p_date = p_timestamp[0] + " " + p_timestamp[1] + " " + p_timestamp[2] + " " + p_timestamp[3];
    var p_time = p_timestamp[4];
    var p_content = currmarker.content.get('content');
    var p_type = currmarker.content.get('category');

    var p_latitude = currmarker.content.get('location').latitude;
    var p_longitude = currmarker.content.get('location').longitude;
    var p_location = p_latitude.toString().substring(0, 10) + ", " + p_longitude.toString().substring(0, 10);
    getReverseGeocodingData(p_latitude, p_longitude);
    var p_id = currmarker.content.id;
    p_upvotes = currmarker.content.get('numUpvotes');
    var p_photo = currmarker.content.get('file');
    var p_name = currmarker.content.get('pUser').get("name");
    var p_username = currmarker.content.get('pUser').get("username");
    var p_userphoto = currmarker.content.get('pUser').get("pic");
    var p_status = currmarker.content.get('statusCode');
    var p_daysLeft = currmarker.content.get('daysLeft');
    var p_title = currmarker.content.get('title');
    var p_constituency = currmarker.content.get('constituency').get("name");
    var p_phone="";
    if(currmarker.content.get('PhoneNo')!=undefined){
       p_phone= currmarker.content.get('PhoneNo').toString();
    }
    var p_issueId = currmarker.content.get('issueId').toString();
    infowindow.setContent(p_issueId);
    infowindow.open(map, marker);
    var status = document.getElementById('colorstatus');
    var date = document.getElementById('date');
    var daysLeft = document.getElementById('daysLeft');
    var time = document.getElementById('times');
    var photo = document.getElementById('photo');
    var upvotes = document.getElementById('upvotes');
    var content = document.getElementById('content');
    var type = document.getElementById('type');
    var username = document.getElementById('username_i');
    var userphoto = document.getElementById('userphoto_i');
    var title = document.getElementById('ititle');
    var issue_constituency = document.getElementById('issue_constituency');
    var phone1=document.getElementById('phone1');
    var phone2=document.getElementById('phone2');
    var location = document.getElementById('location');
    var bigphoto = document.getElementById('bigphoto');
    var detailedissue = document.getElementById('detailedissue');
    $('#details-column').fadeOut(300);
    var myLatlng = new google.maps.LatLng(p_latitude, p_longitude);
    map2.setCenter(myLatlng);
    singlemarker.setMap(null);
    var myicon;
    myicon = getIcon(p_type, p_status);
    singlemarker = new google.maps.Marker({
        position: myLatlng,
        map: map2,
        icon: myicon,
        title: p_status,
        animation: google.maps.Animation.DROP
    });

    setTimeout(function() {

        $("#colorstatus").removeClass();
        if (p_status == StatusEnum.OPEN) {
            $("#colorstatus").addClass('yc');
        } else if (p_status == StatusEnum.PROGRESS) {
            $("#colorstatus").addClass('bgc');
        } else if (p_status == StatusEnum.CLOSE) {
            $("#colorstatus").addClass('bc');
        } else {
            $("#colorstatus").addClass('dbc');
        }
        status.innerHTML = '<strong>' + appropriateStatus(p_status) + '</strong>';
        date.innerHTML = p_date;
        time.innerHTML = p_time;
        if(p_name==undefined){
            username.innerHTML = p_username;
        }
        else{
            username.innerHTML = p_name;
        }
        if (p_userphoto!= undefined) {
            console.log("photo is available");
            userphoto.src = p_userphoto.url();
        } else {
            console.log("photo is unavailable");
            userphoto.src = "./assets/images/user.png";
        }
        console.log(p_time);
        phone1.innerHTML=p_phone;
        phone2.innerHTML=p_phone;
        issue_constituency.innerHTML=p_constituency;
        upvotes.innerHTML=p_upvotes;
        if (p_content.length < 50) {
            content.innerHTML = p_content;
        } else {

            content.innerHTML = p_content.substring(0, 30) + "...";
        }
        type.innerHTML = p_type;
        title.innerHTML = p_issueId + "<small> " + p_title + "</small>";
        location.innerHTML = p_location;
        if (p_photo != undefined) {
            console.log("photo is available");
            bigphoto.src = p_photo.url();
            photo.src = p_photo.url();
        } else {
            console.log("photo is unavailable");
            bigphoto.src = "./assets/images/no_image.jpg";
            photo.src = "./assets/images/no_image.jpg";
        }
        detailedissue.innerHTML = p_content;
        var d = new Date(object.updatedAt);
        console.log(d);
        if (p_daysLeft != undefined) {
            d.setDate(d.getDate() + p_daysLeft);
            console.log(d);
            var ago = timeTo(d);
            console.log(ago);
            daysLeft.innerHTML = ago;
        } else {
            daysLeft.innerHTML = "-";
        }
        populateUpdates();
        showDetailsView();
        if (currentUser.get("type") == "neta") {
            setIssueStatusButton();
        } else if (currentUser.get("type") == "teamMember") {
            setIssueStatusButtonTM();
        }
        getUpvotes();
    }, 300);
}

function showDetailsView() {
    console.log("showDetailsView");
    $('#details-column').fadeIn(300);
    $('#photo').delay(400).fadeIn(300);
    $('#content').delay(400).fadeIn(300);
    $('#details-button').delay(400).fadeIn(300);
}

function getIcon(category, status) {
    var myicon;
    if (category == "road") {
        if (status == StatusEnum.VERIFY || status == StatusEnum.CLOSE) {
            myicon = iconso[0];
        } else {
            myicon = icons[0];
        }
    } else if (category == "electricity") {
        if (status == StatusEnum.VERIFY || status == StatusEnum.CLOSE) {
            myicon = iconso[1];
        } else {
            myicon = icons[1];
        }
    } else if (category == "water") {
        if (status == StatusEnum.VERIFY || status == StatusEnum.CLOSE) {
            myicon = iconso[2];
        } else {
            myicon = icons[2];
        }
    } else if (category == "law") {
        if (status == StatusEnum.VERIFY || status == StatusEnum.CLOSE) {
            myicon = iconso[3];
        } else {
            myicon = icons[3];
        }
    } else if (category == "sanitation") {
        if (status == StatusEnum.VERIFY || status == StatusEnum.CLOSE) {
            myicon = iconso[4];
        } else {
            myicon = icons[4];
        }
    } else {
        if (status == StatusEnum.VERIFY || status == StatusEnum.CLOSE) {
            myicon = iconso[5];
        } else {
            myicon = icons[5];
        }
    }
    return myicon;
}

function plotConstituencyArray(c, n, state) {
    console.log("Lets Plot a Constituency Array");
    console.log(c);
    ListItem = Parse.Object.extend("Constituency");

    query = new Parse.Query(ListItem);
    query.equalTo("index", c);
    query.equalTo("state", state);
    query.find({
        success: function(results) {
            console.log("Starting Plotting: " + results[0].get("name"));
            var Coords = [];
            var pints = [];
            var points = results[0].get("points");
            if(points!=undefined){
                console.log(points.length);
                for (var i = 0; i < points.length; i++) {
                    Coords.push(new google.maps.LatLng(points[i].latitude, points[i].longitude));
                    pints.push({
                        x: points[i].latitude,
                        y: points[i].longitude
                    });
                }

                console.log("First:" + points[0].longitude);
                 console.log("Last:" + points[points.length - 1].longitude);
            }
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
            polyArray.push(Poly);
            Poly.setMap(map);
            var i = 0;
            console.log(n);
            if (n == 1) {

                setTimeout(function() {
                    if (currentUser.get("type") == "teamMember") {
                        populateTM();
                    } else if (currentUser.get("type") == "neta") {
                        populate();
                    }
                    populateTeam();
                    populateOfficials();
                }, i * 500);
            }
        },
        error: function(error) {
            console.log("Error: " + error.message);
            notify(standardErrorMessage, "error", standardErrorDuration);
        }
    });
}

function plotConstituency(c) {
    console.log("Lets Plot a Constituency");
    ListItem = Parse.Object.extend("Constituency");
    query = new Parse.Query(ListItem);
    query.equalTo("index", c);
    query.find({
        success: function(results) {
            console.log("Starting Plotting: " + results[0].get("name"));
            var Coords = [];
            var pints = [];
            var points = results[0].get("points");
            console.log(points.length);
            for (var i = 0; i < points.length; i++) {
                Coords.push(new google.maps.LatLng(points[i].latitude, points[i].longitude));
                pints.push({
                    x: points[i].latitude,
                    y: points[i].longitude
                });
            }
            console.log("First:" + points[0].longitude);
            console.log("Last:" + points[points.length - 1].longitude);
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
            poly = Poly;
            Poly.setMap(map);
            var i = 0;
            setTimeout(function() {
                if (currentUser.get("type") == "teamMember") {
                    populateTM();
                } else if (currentUser.get("type") == "neta") {
                    populate();
                }
                populateTeam();
                populateOfficials();
            }, i * 500);
        },
        error: function(error) {
            console.log("Error: " + error.message);
            notify(standardErrorMessage, "error", standardErrorDuration);
        }
    });
}

//Starts and Ends NProgress
function populateTM() {
    console.log("populate for Team Member");
    deleteMarkers();
    listView.html("");
    var no = 0;
    var np = 0;
    var nr = 0;
    var nc = 0;
    ListItem = Parse.Object.extend("Update");
    query = new Parse.Query(ListItem);
    query.descending('createdAt');
    var pointer = new Parse.Object("TeamMember");
    pointer.id = currentUser.get("teamMember").id;
    query.equalTo("assignee", pointer);
    query.equalTo("typeCode", TypeEnum.ASSIGNED);
    query.include("issue");
    query.include(["issue.pUser"]);
    query.include(["issue.constituency"]);
    query.limit(1000);
    query.find({
        success: function(results) {
            console.log(results);
            for (var i = 0; i < results.length; i++) {
                console.log("populate for itam");
                var object = results[i].get("issue");

                var myicon;
                if(object.get("constituency")!=undefined){
                        if(object.get("constituency").id==constituency.id){ 
                    //Set Icon
                //if(true){
                    myicon = getIcon(object.get("category"), object.get("statusCode"));


                    marker = new google.maps.Marker({
                        position: {
                            lat: object.get('location').latitude,
                            lng: object.get('location').longitude
                        },
                        map: map,
                        title: object.get('category'),
                        content: object,
                        icon: myicon,
                        draggable: false,
                        animation: google.maps.Animation.DROP
                    });

                    var d = new Date(object.createdAt);
                    var ago = timeSince(d);
                    var content = object.get("content");
                    if (object.get("content").length > 50) {
                        content = object.get("content").substring(0, 50) + "...";
                    }
                    listView.append("<tr id='" + object.id + "' class='" + getClassName(object.get('statusCode')) + "'><td width='100'>" + (object.get('constituency').get('name')).toString() + "</td><td width='100'>" + (object.get('issueId')).toString() + "</td><td width='100' class='ct'>" + object.get('category') + "</td><td class='ct'>" + content + "</td><td class='ct'>" + appropriateStatus(object.get('statusCode')) + "</td><td width='100'>" + ago + " ago</td></tr>");
                    console.log("<tr id='" + object.id + "' class='" + getClassName(object.get('statusCode')) + "'><td width='100'>" + (object.get('issueId')).toString() + "</td><td width='100' class='ct'>" + object.get('category') + "</td><td class='ct'>" + content + "</td><td class='ct'>" + appropriateStatus(object.get('statusCode')) + "</td><td width='100'>" + ago + " ago</td></tr>");
                    $('#'+object.id).click(function(){
                                    listViewClick(this.id.toString());
                    });
                    markers.push(marker);
                    if ((marker.content).get('statusCode') == StatusEnum.OPEN) {
                        no = no + 1;
                    }
                    if ((marker.content).get('statusCode') == StatusEnum.PROGRESS) {
                        np = np + 1;
                    }
                    if ((marker.content).get('statusCode') == StatusEnum.CLOSE) {
                        nr = nr + 1;
                    }
                    if ((marker.content).get('statusCode') == StatusEnum.VERIFY) {
                        nc = nc + 1;
                    }
                    google.maps.event.addListener(marker, 'click', (function(marker, object) {
                        return function() {
                            NProgress.start();
                            console.log("NProgress start");
                            if (infowindow) {
                                infowindow.close();
                            }
                            infowindow = new google.maps.InfoWindow({
                                maxWidth: 700,
                                maxHeight: 900
                            });
                            currmarker = marker;
                            updateCurrentMarker(currmarker);
                            infowindow.setContent(getClassName(currmarker.content.get('statusCode')));
                        }
                    })(marker, object));
                }
            }
            }
            statusCounters(no, np, nr, nc);
            filter();
            NProgress.done();
            console.log("NProgress Stop");
        },
        error: function(error) {}
    });
}
//Starts and Ends NProgress
function populate() {
    console.log("populate");
    deleteMarkers();
    listView.html("");
    var no = 0;
    var np = 0;
    var nr = 0;
    var nc = 0;
    ListItem = Parse.Object.extend("Issue");
    query = new Parse.Query(ListItem);
    query.descending('createdAt');
    query.include("pUser");
    query.include("constituency");
    query.limit(1000);
    query.find({
        success: function(results) {
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                var myicon;
                console.log("ABOUT TO CHECK");
                if (constituencyType != 1) {
                    console.log("YAHAN");
                    //if (google.maps.geometry.poly.containsLocation(new google.maps.LatLng(object.get('location').latitude, object.get('location').longitude), poly) == true) {
                    console.log(object.get("constituency"));
                    console.log(constituency);
                    if(object.get("constituency")!=undefined){
                        if(object.get("constituency").id==constituency.id){ 
                            //Set Icon
                            myicon = getIcon(object.get("category"), object.get("statusCode"));

                            marker = new google.maps.Marker({
                                position: {
                                    lat: object.get('location').latitude,
                                    lng: object.get('location').longitude
                                },
                                map: map,
                                title: object.get('category'),
                                content: object,
                                icon: myicon,
                                draggable: false,
                                animation: google.maps.Animation.DROP
                            });

                            var d = new Date(object.createdAt);
                            var ago = timeSince(d);
                            var content = object.get("content");
                            if (object.get("content").length > 50) {
                                content = object.get("content").substring(0, 50) + "...";
                            }
                            listView.append("<tr id='" + object.id + "' class='" + getClassName(object.get('statusCode')) + "'><td width='100'>" + (object.get('constituency').get('name')).toString() + "</td><td width='100'>" + (object.get('issueId')).toString() + "</td><td width='100' class='ct'>" + object.get('category') + "</td><td class='ct'>" + content + "</td><td class='ct'>" + appropriateStatus(object.get('statusCode')) + "</td><td width='100'>" + ago + " ago</td></tr>");
                            $('#'+object.id).click(function(){
                                        listViewClick(this.id.toString());
                            });

                            markers.push(marker);
                            if ((marker.content).get('statusCode') == StatusEnum.OPEN) {
                                no = no + 1;
                            }
                            if ((marker.content).get('statusCode') == StatusEnum.PROGRESS) {
                                np = np + 1;
                            }
                            if ((marker.content).get('statusCode') == StatusEnum.CLOSE) {
                                nr = nr + 1;
                            }
                            if ((marker.content).get('statusCode') == StatusEnum.VERIFY) {
                                nc = nc + 1;
                            }
                            google.maps.event.addListener(marker, 'click', (function(marker, object) {
                                return function() {
                                    NProgress.start();
                                    console.log("NProgress start");
                                    if (infowindow) {
                                        infowindow.close();
                                    }
                                    infowindow = new google.maps.InfoWindow({
                                        maxWidth: 700,
                                        maxHeight: 900
                                    });

                                    currmarker = marker;
                                    updateCurrentMarker(currmarker);
                                    infowindow.setContent(currmarker.content.get('statusCode'));

                                }
                            })(marker, object));
                        }
                    }
                } else {
                    console.log("WAHAN");
                    console.log(polyArray);
                    for (var j = 0; j < polyArray.length; j++) {
                        console.log("Checking:"+polyArray[j].constituency);
                            if(object.get("constituency")!=undefined){
                                if(object.get("constituency").get("name")==polyArray[j].constituency){ 
                                    
                                    myicon = getIcon(object.get("category"), object.get("statusCode"));

                                    marker = new google.maps.Marker({
                                        position: {
                                            lat: object.get('location').latitude,
                                            lng: object.get('location').longitude
                                        },
                                        map: map,
                                        title: object.get('category'),
                                        content: object,
                                        icon: myicon,
                                        draggable: false,
                                        animation: google.maps.Animation.DROP
                                    });

                                    var d = new Date(object.createdAt);
                                    var ago = timeSince(d);
                                    var content = object.get("content");
                                    if (object.get("content").length > 50) {
                                        content = object.get("content").substring(0, 50) + "...";
                                    }
                                    listView.append("<tr id='" + object.id + "' class='" + getClassName(object.get('statusCode')) + "'><td width='100'>" + (object.get('constituency').get('name')).toString() + "</td><td width='100'>" + (object.get('issueId')).toString() + "</td><td width='100' class='ct'>" + object.get('category') + "</td><td class='ct'>" + content + "</td><td class='ct'>" + appropriateStatus(object.get('statusCode')) + "</td><td width='100'>" + ago + " ago</td></tr>");
                                    $('#'+object.id).click(function(){
                                                listViewClick(this.id.toString());
                                    });
                                    markers.push(marker);
                                    if ((marker.content).get('statusCode') == StatusEnum.OPEN) {
                                        no = no + 1;
                                    }
                                    if ((marker.content).get('statusCode') == StatusEnum.PROGRESS) {
                                        np = np + 1;
                                    }
                                    if ((marker.content).get('statusCode') == StatusEnum.CLOSE) {
                                        nr = nr + 1;
                                    }
                                    if ((marker.content).get('statusCode') == StatusEnum.VERIFY) {
                                        nc = nc + 1;
                                    }
                                    google.maps.event.addListener(marker, 'click', (function(marker, object) {
                                        return function() {
                                            NProgress.start();
                                            console.log("NProgress start");
                                            if (infowindow) {
                                                infowindow.close();
                                            }
                                            infowindow = new google.maps.InfoWindow({
                                                maxWidth: 700,
                                                maxHeight: 900
                                            });

                                            currmarker = marker;
                                            updateCurrentMarker(currmarker);
                                            infowindow.setContent(getClassName(currmarker.content.get('statusCode')));

                                        }
                                    })(marker, object));
                                }
                            }
                    }
                }
            }
            statusCounters(no, np, nr, nc);
            filter();
            NProgress.done();
            console.log("NProgress Stop");
        },
        error: function(error) {
            NProgress.done();
            console.log("Error: " + error.message);
            notify(standardErrorMessage, "error", standardErrorDuration);
        }
    });
}



function categoryCheck(m) {
    console.log("CategoryCheck");
    if ((m.content).get("category") == "road") {
        if (box_r.checked) {
            return 1;
        }
    }
    if ((m.content).get("category") == "electricity") {
        if (box_e.checked) {
            return 1;
        }
    }
    if ((m.content).get("category") == "water") {
        if (box_w.checked) {
            return 1;
        }
    }
    if ((m.content).get("category") == "law") {
        if (box_l.checked) {
            return 1;
        }
    }
    if ((m.content).get("category") == "sanitation") {
        if (box_s.checked) {
            return 1;
        }
    }
    if ((m.content).get("category") == "transport") {
        if (box_t.checked) {
            return 1;
        }
    }
    return 0;
}

function dateCheck(m) {
    console.log("dateCheck");
    var combined = document.getElementById('reportrange').innerHTML;
    combined = combined.substring(36);
    combined = combined.substring(0, combined.length - 7);
    combined = combined.split(" - ");
    var startdate = moment(combined[0]).format('MMMM D, YYYY');
    var enddate = moment(combined[1]).format('MMMM D, YYYY');
    var sd = moment(startdate).unix();
    var ed = moment(enddate).unix() + 86400;
    var d = Date.parse((m.content).createdAt) / 1000
    if (d > sd && d < ed) {
        return 1;
    }
    return 0;
}



function statusCounters(no, np, nr, nc) {
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



function statusCheck(m) {
    console.log("StatusCheck");
    if ((m.content).get("status") == "open" || (m.content).get("statusCode") == StatusEnum.OPEN) {
        if (box_op.checked) {
            return 1;
        }
    }
    if ((m.content).get("status") == "progress"|| (m.content).get("statusCode") == StatusEnum.PROGRESS) {
        if (box_pr.checked) {
            return 1;
        }
    }
    if ((m.content).get("status") == "review"|| (m.content).get("statusCode") == StatusEnum.VERIFY) {
        if (box_rv.checked) {
            return 1;
        }
    }
    if ((m.content).get("status") == "closed"|| (m.content).get("statusCode") == StatusEnum.CLOSE) {
        if (box_cl.checked) {
            return 1;
        }
    }
    return 0;
}

function filter() {
    console.log("filter");
    updateHistory();
    listView.html("");
    if(specificIssue){
        openSpecific();
    }
    else{
        for (var m = 0; m < markers.length; m++) {
            if (statusCheck(markers[m]) == 1 && categoryCheck(markers[m]) == 1 && dateCheck(markers[m])==1){
                var d = new Date((markers[m].content).createdAt);
                var ago = timeSince(d);
                var content = markers[m].content.get('content');
                if (markers[m].content.get('content').length > 50) {
                    content = markers[m].content.get('content').substring(0, 50) + "...";
                }

                listView.append("<tr id='" + (markers[m].content).id + "' class='" + getClassName((markers[m].content).get('statusCode')) + "'><td width='100'>" + ((markers[m].content).get('constituency').get('name')).toString() + "</td><td width='100' class='ct'>" + ((markers[m].content).get('issueId')).toString() + "</td><td width='100' class='ct'>" + (markers[m].content).get('category') + "</td><td class='ct'>" + content + "</td><td width='100' class='ct'>" + appropriateStatus((markers[m].content).get('statusCode')) + "</td><td width='100'>" + ago + " ago</td></tr>");
                $('#'+markers[m].content.id).click(function(){
                            listViewClick(this.id.toString());
                });
                markers[m].setMap(map);
            } else {
                markers[m].setMap(null);

            }

        }
    }
}


function updateCounters() {
    var no = 0;
    var np = 0;
    var nr = 0;
    var nc = 0;
    for (var m = 0; m < markers.length; m++) {
        if (markers[m].getMap() != null) {
            if ((markers[m].content).get('statusCode') == StatusEnum.OPEN) {
                no = no + 1;
            }
            if ((markers[m].content).get('statusCode') == StatusEnum.PROGRESS) {
                np = np + 1;
            }
            if ((markers[m].content).get('statusCode') == StatusEnum.CLOSE) {
                nr = nr + 1;
            }
            if ((markers[m].content).get('statusCode') == StatusEnum.VERIFY) {
                nc = nc + 1;
            }
        }
    }
    statusCounters(no, np, nr, nc);
}

function listViewClick(p) {
    NProgress.start();
    console.log("NProgress Start");
    var trid = p;
    var marker;
    console.log("you clicked on-" + p);
    for (var i = 0; i < markers.length; i++) {
        //console.log(markers[i].content.id);
        if (markers[i].content.id == trid) {
            marker = markers[i];
            break;
        }
    }
    currmarker = marker;
    updateCurrentMarker(currmarker);
    if (infowindow) {
        infowindow.close();
    }
    infowindow = new google.maps.InfoWindow({
        maxWidth: 700,
        maxHeight: 900
    });
    infowindow.setContent(getClassName(currmarker.content.get('statusCode')));

    console.log('test');
}

function getClassName(s){
    if(s==StatusEnum.OPEN){
        return "open"; 
    }
    if(s==StatusEnum.PROGRESS){
        return "progress"; 
    }
    if(s==StatusEnum.CLOSE){
       return "review";  
    }
    if(s==StatusEnum.VERIFY){
     return "closed";   
    }
}

function openSpecific(){
    console.log("Opening Specific");
    var found=false;
    for (var m = 0; m < markers.length; m++) {
        if ((markers[m].content).get("issueId")==specificNum){
            notify("Loading your Issue", "success", standardErrorDuration);
            if (infowindow) {
                infowindow.close();
            }
            infowindow = new google.maps.InfoWindow({
                maxWidth: 700,
                maxHeight: 900
            });
            currmarker=markers[m];
            updateCurrentMarker(markers[m]);
            showDetailsView();
            $('#details-button').click();
            found=true;
            break;
        }
    }
    if(!found){
        NProgress.done();
        notify("Weird Error", "error", standardErrorDuration);
    }
}

function initializeMap() {
    //var constituency;
    if (currentUser.get("type") == "neta") {
        var n = currentUser.get("neta");
        n.fetch({
            success: function(results1) {
                //constituency=n.get("constituency");
                var Election = Parse.Object.extend("Election");
                election = new Parse.Query(Election);
                election.descending('createdAt');
                var pointer = new Parse.Object("Neta");
                pointer.id = n.id;
                election.equalTo("arrayNetas", pointer);
                election.include("[constituency.constituencyArray]");
                election.include("constituency");
                election.limit(1000);
                election.find({
                    success: function(results) {
                        constituency = results[0].get("constituency");
                        constituencyType = constituency.get("type");

                        if (constituencyType == 1) {
                            console.log("POLYGON ARRAY");
                            constituencyArray = constituency.get("constituencyArray");
                            console.log(constituencyArray);
                            polyArray = [];

                            for (var i = 0; i < constituencyArray.length; i++) {
                                miniConstituency = constituencyArray[i];

                                if (i == (constituencyArray.length - 1)) {
                                    plotConstituencyArray(miniConstituency["index"], 1, constituency.get("state"));
                                } else {
                                    plotConstituencyArray(miniConstituency["index"], 0, constituency.get("state"));
                                }
                                map.setCenter(new google.maps.LatLng(constituency.get("center").latitude, constituency.get("center").longitude));
                            }
                        } else {
                            plotConstituency(constituency.get("index"));
                            map.setCenter(new google.maps.LatLng(constituency.get("center").latitude, constituency.get("center").longitude));
                        }
                    },
                    error: function(error) {
                        NProgress.done();
                        console.log("Error: " + error.message);
                        notify(standardErrorMessage, "error", standardErrorDuration);
                    }
                });
            },
            error: function(error) {
                console.log("Error: " + error.message);
                notify(standardErrorMessage, "error", standardErrorDuration);
                NProgress.done();
            }
        });
    } else {
        var t = currentUser.get("teamMember");
        t.fetch({
            success: function() {
                var n = t.get("neta");
                n.fetch({
                    success: function(results) {
                        var Election = Parse.Object.extend("Election");
                        election = new Parse.Query(Election);
                        election.descending('createdAt');
                        var pointer = new Parse.Object("Neta");
                        pointer.id = n.id;
                        election.equalTo("arrayNetas", pointer);
                        election.include("constituency");
                        election.include("constituencyArray");
                        election.limit(1000);
                        election.find({
                            success: function(results) {
                                constituency = results[0].get("constituency");
                                console.log("yolo"+constituency.get("type"));
                                constituencyType = constituency.get("type");
                                if (constituencyType == 1) {
                                    console.log("POLYGON ARRAY");
                                    constituencyArray = constituency.get("constituencyArray");
                                     polyArray = [];

                                    for (var i = 0; i < constituencyArray.length; i++) {
                                        miniConstituency = constituencyArray[i];
                                        console.log(miniConstituency);
                                        if (i == (constituencyArray.length - 1)) {
                                            plotConstituencyArray(miniConstituency["index"], 1, constituency.get("state"));
                                        } else {
                                            plotConstituencyArray(miniConstituency["index"], 0, constituency.get("state"));
                                        }
                                        map.setCenter(new google.maps.LatLng(constituency.get("center").latitude, constituency.get("center").longitude));
                                    }
                                } else {
                                    console.log("what the fuck");
                                    plotConstituency(constituency.get("index"));
                                    map.setCenter(new google.maps.LatLng(constituency.get("center").latitude, constituency.get("center").longitude));
                                }
                            },
                            error: function(error) {
                                NProgress.done();
                                console.log("Error: " + error.message);
                                notify(standardErrorMessage, "error", standardErrorDuration);
                            }
                        });
                    },
                    error: function(error) {
                        console.log("Error: " + error.message);
                        notify(standardErrorMessage, "error", standardErrorDuration);
                        NProgress.done();
                    }
                });
            },
            error: function(error) {
                console.log("Error: " + error.message);
                notify(standardErrorMessage, "error", standardErrorDuration);
                NProgress.done();
            }
        });
    }
}

function initialize() {
    console.log("initialize");
    issueNum= getQueryVariable("id");
    console.log(issueNum);
    if(issueNum!=""){
        specificIssue=true;
        specificNum=issueNum;
    }
    else{
        specificIssue=false;
    }
    currentUser = CU;
    currentUser.fetch({
        success:function(results){
            currentPUser = currentUser.get("pUser");
            NProgress.start();
            currentPUser.fetch({
                success:function(results){
                    console.log("NProgress Start");
                        var pphoto = document.getElementById('profilepic');
                        if (currentPUser.get("pic") != undefined) {
                            pphoto.src = currentPUser.get("pic").url();
                        } else {
                            pphoto.src = getDefaultIcon(currentPUser.get("type"));
                        }

                        if (currentPUser.get("type") == "neta") {
                            console.log("Current User is a Neta");
                            document.getElementById("neta-panel").style.display = "block";

                        } else {
                            console.log("Current User is a Team Member");
                            document.getElementById("neta-panel").style.display = "none";

                        }
                },
                error:function(error){
                    console.log("Error: " + error.message);
                        notify(standardErrorMessage, "error", standardErrorDuration);
                }
            });
        },
        error:function(error){
                        console.log("Error: " + error.message);
                notify(standardErrorMessage, "error", standardErrorDuration);
        }
    });

    
    map2 = new google.maps.Map(document.getElementById('googleMap'), {
        zoom: 12,
        center: new google.maps.LatLng(28.612912, 77.22951),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: new google.maps.LatLng(28.612912, 77.22951),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    initializeMap();

    var homeControlDiv = document.createElement('div');
    var homeControl = new CurrentLocationControl(homeControlDiv, map);

    homeControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);

    singlemarker = new google.maps.Marker({
        position: new google.maps.LatLng(28.612912, 77.22951),
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

    $('#fileUpload').bind("change", function(e) {
        showMyImage(this);
        $('#imgStatus').removeClass('icon-image-add bc').addClass('icon-image-accept gc');
        var files = e.target.files || e.dataTransfer.files;
        // Our file var now holds the selected file
        file = files[0];
    });

    $('input[type=checkbox]').change(
        function() {
            updateHistory();
            NProgress.start();
            console.log("NProgress Start");
            if (infowindow) {
                infowindow.close();
            }
            filter();

            if ($(this).attr('id') == "law_cb" || $(this).attr('id') == "road_cb" || $(this).attr('id') == "electricity_cb" || $(this).attr('id') == "sanitation_cb" || $(this).attr('id') == "transport_cb" || $(this).attr('id') == "water_cb") {
                updateCounters();
            }
            $('#details-column').delay(400).fadeOut(300);
            if (view == 1) {
                $('#list-view').delay(400).fadeIn(300);
                $('#map-view').delay(400).fadeOut(300);
            } else {
                $('#map-view').delay(400).fadeIn(300);
                $('#list-view').delay(400).fadeOut(300);
                setTimeout(function() {
                    google.maps.event.trigger(map, 'resize');
                    map.setZoom(map.getZoom());
                }, 700);
            }
            $('#details-column').delay(400).fadeOut(300);
            $('#updates-view').delay(400).fadeOut(300);
            $('#back').delay(400).fadeOut(300);
            NProgress.done();
            console.log("NProgress Stop");
        });

    $('input[name=maptglgroup]').change(function() {
        NProgress.start();
        console.log("NProgress Start");
        enableCheckPoints();
        updateHistory();
        if (infowindow) {
            infowindow.close();
        }
        $('#photo').delay(400).fadeIn(300);
        $('#content').delay(400).fadeIn(300);
        $('#details-button').delay(400).fadeIn(300);
        if ($(this).is(':checked')) {
            view = 0;
            $('#map-view').delay(400).fadeIn(300);
            setTimeout(function() {
                google.maps.event.trigger(map, 'resize');
                map.setZoom(map.getZoom());
                map2.setCenter(singlemarker.getPosition());
            }, 1000);
            $('#list-view').delay(400).fadeOut(300);
            $('#updates-view').delay(400).fadeOut(300);
            $('#back').delay(400).fadeOut(300);
            $('#details-column').delay(400).fadeOut(300);
        } else {
            view = 1;
            $('#map-view').delay(400).fadeOut(300);
            $('#list-view').delay(400).fadeIn(300);
            $('#details-column').delay(400).fadeOut(300);
        }

        if (currentUser.get("type") == "teamMember") {
            populateTM();
        } else if (currentUser.get("type") == "neta") {
            populate();
        }
    });

    $('#claim-st1').click(function() {
        loadingButton_id("claim-st1", 3);
        
        if (CU.get("subtype")=="mla"){
            postClaim();    
            disableDetailsView();
        }
        else{
            notify("Your profile is not public yet","error",standardErrorDuration);
        }
        
    });

    $('#reportWrong').click(function() {
        loadingButton_id("reportWrong", 3);
        
        if (CU.get("subtype")=="mla"){
            reportWrong();
        }
        else{
            notify("Your profile is not public yet","error",standardErrorDuration);
        }
        
    });

    $('#claim-st2').click(function() {
        loadingButton_id("claim-st2", 3);
        disableDetailsView();
        var q = $('#team').val();
        if (q != null) {
            postAssignment(q);
        }
    });

    $('#reminder').click(function() {
        loadingButton_id("reminder", 3);
        var q = $('#officials').val();
        
        if (CU.get("subtype")=="mla"){
           if (q != null) {
            postOfficial(q);
            }
        }
        else{
            notify("Your profile is not public yet","error",standardErrorDuration);
        }
    });

    $('#close').click(function() {
        loadingButton_id("close", 3);
        disableDetailsView();
        postClose();
    });

    if (CU.get("subtype")=="mla" || CU.get("subtype")=="wardincharge") {
        $('#comment-form').submit(function(event) {
        event.preventDefault();
        loadingButton_id("commit_btn", 3);
        var comment = document.getElementById("comment").value;

        postComment(comment);
        });
    }
    else{
        $('#comment-view').html('<div class="scolor2 text-center">Commenting has not been enabled yet</div>');
    }
    

    $('#back').click(function() {
        window.location = "./issues.html"
        // updateHistory();
        // NProgress.start();
        // console.log("NProgress Start");
        // if (infowindow) {
        //     infowindow.close();
        // }
        // $('#photo').delay(400).fadeIn(300);
        // $('#content').delay(400).fadeIn(300);
        // $('#details-button').delay(400).fadeIn(300);
        // if (view == 1) {
        //     $('#list-view').delay(400).fadeIn(300);
        //     $('#map-view').delay(400).fadeOut(300);
        // } else {
        //     $('#map-view').delay(400).fadeIn(300);
        //     setTimeout(function() {
        //         google.maps.event.trigger(map, 'resize');
        //         map.setZoom(map.getZoom());
        //     }, 700);
        //     $('#list-view').delay(400).fadeOut(300);
        // }
        // $('#details-column').delay(400).fadeOut(300);
        // $('#updates-view').delay(400).fadeOut(300);
        // $('#back').delay(400).fadeOut(300);

        // enableCheckPoints();

        // if (currentUser.get("type") == "teamMember") {
        //     populateTM();
        // } else if (currentUser.get("type") == "neta") {
        //     populate();
        // }
    });



    $('#details-button').click(function() {
        updateHistory();
        NProgress.start();
        console.log("NProgress Start");
        disableCheckPoints(currmarker.content.get("category"), currmarker.content.get("statusCode"));
        if (infowindow) {
            infowindow.close();
        }
        $('#list-view').delay(400).fadeOut(300);
        $('#map-view').delay(400).fadeOut(300);
        $('#updates-view').delay(400).fadeIn(300);
        setTimeout(function() {
            google.maps.event.trigger(map2, 'resize');
            map2.setZoom(map2.getZoom());
            map2.setCenter(singlemarker.getPosition());
        }, 700);
        $('#photo').delay(400).fadeOut(300);
        $('#content').delay(400).fadeOut(300);
        $('#details-button').delay(400).fadeOut(300);
        $('#back').delay(400).fadeIn(300);
        NProgress.done();
        console.log("NProgress Stop");
    });


    $('#reportrange').daterangepicker({
            startDate: moment().subtract('year', 3),
            endDate: moment(),
            minDate: '01/01/2012',
            maxDate: '12/31/2016',
            dateLimit: {
                days: 60
            },
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
                'This Year': [moment().startOf('year'), moment()],
                'Everything': [moment().subtract('year', 3), moment()]
            },
            opens: 'left',
            format: 'MM/DD/YYYY',
            separator: ' to ',
            locale: {
                applyLabel: 'Submit',
                fromLabel: 'From',
                toLabel: 'To',
                customRangeLabel: 'Custom Range',
                daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                firstDay: 1
            }
        },
        function(start, end) {
            $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            filter();
            updateCounters();
        }
    );
}