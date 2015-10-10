Parse.initialize("km3gtnQr78DlhMMWqMNCwDn4L1nR6zdBcMqzkUXt", "BS9nk6ykTKiEabLX1CwDzy4FLT1UryRR6KsdRPJI");
function getQueryVariable(variable)
{
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i=0;i<vars.length;i++) {
           var pair = vars[i].split("=");
           if(pair[0] == variable){return pair[1];}
   }
   return(false);
}

var issueNum = getQueryVariable("id");

var constituency;

var constituencyType;
var polyArray = [];
var poly;
var view = 0;

var listView = $('#list-view tbody');
var timelineView = $('#timeline-view');
var teamView = $('#team');

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
function populateUpdates(numID) {
    //console.log("populateUpdates");
    timelineView.html("");
    ListItem = Parse.Object.extend("Update");
    query = new Parse.Query(ListItem);
    var pointer = new Parse.Object("Issue");
    // var query2 = new Parse.Query(pointer);
    // query2.equalTo("issueId", numID);
    // query2.first({
    //   success: function(object) {
    //     console.log(object.id)
    //   },
    //   error: function(error) {
    //     alert("Error: " + error.code + " " + error.message);
    //   }
    // });

    query.equalTo("issue", pointer);
    query.include("assignee");
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
                d = new Date(object.createdAt);
                ago = timeSince(d);
                if (object.get("content") != undefined) {
                    content = object.get("content");
                } else {
                    content = "";
                }
                user = object.get("pUser");
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
                if (object.get("type") == "unassigned") {
                    console.log(assignee);
                    var ass = assignee.get("pUser");
                    timelineView.append("<div class='panel nb'><p><strong class='ct'>" + ass.get("name") + "</strong> was unassigned by <strong class='ct'>" + user.get("username") + "</strong> <small>" + ago + " ago</small></p></div>");
                }
                if (object.get("type") == "assigned") {
                    var ass = assignee.get("pUser");
                    timelineView.append("<div class='panel nb'><p><strong class='ct'>" + ass.get("name") + "</strong> was assigned by <strong class='ct'>" + user.get("username") + "</strong> <small>" + ago + " ago</small></p></div>");
                }
                if (object.get("type") == "closed") {
                    timelineView.append("<div class='panel nb'><p><strong class='ct'>" + user.get("name") + "</strong> closed the issue <small>" + ago + " ago</small></p></div>");

                }
                if (object.get("type") == "comment") {
                    timelineView.append("<div class='row'><div class='small-2 columns wbg-fx wd-fx text-right'><img src='" + pphoto1 + "' class='circle-img'>"+user.get("username")+"</div><div class='small-10 columns'><div class='panel p-fx'><div class='panel-head'><strong class='ct'>" + user.get("username") + "</strong> commented <small>" + ago + " ago</small><i class='icon-close tertiary-color cs hv right'></i></div><p>" + content + "</p></div></div></div>");
                }
                if (object.get("type") == "claim") {
                    timelineView.append("<div class='panel nb'><p><strong class='ct'>" + user.get("name") + "</strong> claimed this issue <small>" + ago + " ago</small></p></div>");
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

function appropriateStatus(s) {
    if (s == "progress") {
        return "in progress";
    }
    if (s == "review") {
        return "under review"
    }
    return s;
}


function updateCurrentMarker(m) {
    //console.log("updateCurrentMarker");
    ListItem = Parse.Object.extend("Issue");
    query = new Parse.Query(ListItem);
    query.equalTo("issueId", m);
    query.first({
        success: function(results) {
            //console.log("current marker updated: " + results.length);
            currmarker.content = results;
            console.log(results.get('title'));
            //updateContentWithCurrentMarker();
            //infowindow.open(map, currmarker);
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
    var p_photo = currmarker.content.get('file');
    var p_status = currmarker.content.get('status');
    var p_daysLeft = currmarker.content.get('daysLeft');
    var p_title = currmarker.content.get('title');
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
    var content = document.getElementById('content');
    var type = document.getElementById('type');
    var title = document.getElementById('ititle');
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
        if (p_status == "open") {
            $("#colorstatus").addClass('yc');
        } else if (p_status == "progress") {
            $("#colorstatus").addClass('bgc');
        } else if (p_status == "review") {
            $("#colorstatus").addClass('bc');
        } else {
            $("#colorstatus").addClass('dbc');
        }
        status.innerHTML = '<strong>' + appropriateStatus(p_status) + '</strong>';
        date.innerHTML = p_date;
        time.innerHTML = p_time;
        console.log(p_time);
        phone1.innerHTML=p_phone;
        phone2.innerHTML=p_phone;
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
        if (status == "closed" || status == "review") {
            myicon = iconso[0];
        } else {
            myicon = icons[0];
        }
    } else if (category == "electricity") {
        if (status == "closed" || status == "review") {
            myicon = iconso[1];
        } else {
            myicon = icons[1];
        }
    } else if (category == "water") {
        if (status == "closed" || status == "review") {
            myicon = iconso[2];
        } else {
            myicon = icons[2];
        }
    } else if (category == "law") {
        if (status == "closed" || status == "review") {
            myicon = iconso[3];
        } else {
            myicon = icons[3];
        }
    } else if (category == "sanitation") {
        if (status == "closed" || status == "review") {
            myicon = iconso[4];
        } else {
            myicon = icons[4];
        }
    } else {
        if (status == "closed" || status == "review") {
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
                }, i * 500);
            }
        },
        error: function(error) {
            console.log("Error: " + error.message);
            notify(standardErrorMessage, "error", standardErrorDuration);
        }
    });
}


function updateCounters() {
    var no = 0;
    var np = 0;
    var nr = 0;
    var nc = 0;
    for (var m = 0; m < markers.length; m++) {
        if (markers[m].getMap() != null) {
            if ((markers[m].content).get('status') == "open") {
                no = no + 1;
            }
            if ((markers[m].content).get('status') == "progress") {
                np = np + 1;
            }
            if ((markers[m].content).get('status') == "review") {
                nr = nr + 1;
            }
            if ((markers[m].content).get('status') == "closed") {
                nc = nc + 1;
            }
        }
    }
    statusCounters(no, np, nr, nc);
}

function initialize() {
    console.log("initialize");
    currentUser = CU;
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
        disableDetailsView();
        postClaim();
    });

    $('#claim-st2').click(function() {
        loadingButton_id("claim-st2", 3);
        disableDetailsView();
        var q = $('#team').val();
        if (q != null) {
            postAssignment(q);
        }
    });

    $('#close').click(function() {
        loadingButton_id("close", 3);
        disableDetailsView();
        postClose();
    });

    $('#comment-form').submit(function(event) {
        event.preventDefault();
        loadingButton_id("commit_btn", 3);
        var comment = document.getElementById("comment").value;

        postComment(comment);
    });

    $('#back').click(function() {
        updateHistory();
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

        if (currentUser.get("type") == "teamMember") {
            populateTM();
        } else if (currentUser.get("type") == "neta") {
            populate();
        }
    });



    $('#details-button').click(function() {
        updateHistory();
        NProgress.start();
        console.log("NProgress Start");
        disableCheckPoints(currmarker.content.get("category"), currmarker.content.get("status"));
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
            maxDate: '12/31/2015',
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