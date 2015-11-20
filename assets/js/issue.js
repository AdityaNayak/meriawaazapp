Parse.initialize("km3gtnQr78DlhMMWqMNCwDn4L1nR6zdBcMqzkUXt", "BS9nk6ykTKiEabLX1CwDzy4FLT1UryRR6KsdRPJI");

function getQueryVariable(variable){
   var query = window.location.search.substring(1);
   var vars = query.split("?");
   for (var i=0;i<vars.length;i++) {
           var pair = vars[i].split("=");
           if(pair[0] == variable){return pair[1];}
   }
   return(false);
}

var issueNum;
var issueObj;

var constituencyType;
var view = 0;

var p_latitude;
var p_longitude;

var map2;
var timelineView = $('#timeline-view');

var currmarker;
var currentUser;
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

        map2.setCenter(issueObj.position);
        map2.setZoom(12);

    });

}
function timeSince(date) {

    var seconds = Math.floor(Math.abs(new Date() - date) / 1000);

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


function toTime(sec) {

    var seconds = Math.floor(Math.abs(sec) / 1000);

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
// 
function populateUpdates() {
    console.log("populateUpdates");
    timelineView.html("");
    ListItem = Parse.Object.extend("Update");
    query = new Parse.Query(ListItem);
    var pointer = new Parse.Object("Issue");
    pointer.id = issueObj.id;
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
                    timelineView.append("<div class='row'><div class='small-2 columns wbg-fx wd-fx text-right'><img src='" + pphoto1 + "' class='circle-img'>"+user.get("username")+"</div><div class='small-10 columns'><div class='panel p-fx'><div class='panel-head'><strong class='ct'>" + user.get("username") + "</strong> commented <small>" + ago + " ago</small></div><p>" + content + "</p></div></div></div>");
                }
                if (object.get("type") == "claim") {
                    timelineView.append("<div class='panel nb'><p><strong class='ct'>" + user.get("name") + "</strong> claimed this issue <small>" + ago + " ago</small></p></div>");
                }
            }
          //  NProgress.done();
           // console.log("NProgress Stop");

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
    else if (s == "review") {
        return "solved <i class='icon-solved gc'></i>"
    }
    else if (s == "closed") {
        return "verified <i class='icon-solved gc'></i>"
    }
    return s;
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
function getDefaultIcon(type){
    if(type=="neta"){
        return "./assets/images/neta.png";
    }
    else if(type=="teamMember"){
        return "./assets/images/neta.png";
    }
    else{
        return "./assets/images/user.png";
    }
}
function updateCurrentMarker(m) {
    //console.log("updateCurrentMarker");
    ListItem = Parse.Object.extend("Issue");
    query = new Parse.Query(ListItem);
    query.equalTo("issueId",parseInt(m));
    query.include('pUser');
    query.first({
        success: function(results) {
            //console.log("current marker updated: " + results.length);
            //currmarker.content.id = results.id;
            issueObj = results;
            //console.log(results.id);
            //updateContentWithCurrentMarker();
            //infowindow.open(map, currmarker);
            updateContentWithCurrentMarker()
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
    var p_timestam = String(issueObj.createdAt);
    var p_timestamp = p_timestam.split(" ");
    var p_date = p_timestamp[0] + " " + p_timestamp[1] + " " + p_timestamp[2] + " " + p_timestamp[3];
    var p_time = p_timestamp[4];
    var p_content = issueObj.get('content');
    var p_type = issueObj.get('category');

    var p_latitude = issueObj.get('location').latitude;
    var p_longitude = issueObj.get('location').longitude;
    var p_location = p_latitude.toString().substring(0, 10) + ", " + p_longitude.toString().substring(0, 10);
    // //getReverseGeocodingData(p_latitude, p_longitude);
   // var p_id = currmarker.content.id;
    var before_photo = issueObj.get('file');
    var after_photo = issueObj.get('file2');
    var p_status = issueObj.get('status');
    var p_daysLeft = issueObj.get('daysLeft');
    var p_title = issueObj.get('title');
    var p_issueId = issueObj.get('issueId').toString();
    var p_numVotes=issueObj.get('numUpvotes');
    var p_rtr= issueObj.get('pUser').get('username');
    //infowindow.setContent(p_issueId);
    //infowindow.open(map, marker);
    var status = document.getElementById('colorstatus');
    var date = document.getElementById('date');
    var daysLeft = document.getElementById('daysLeft');
    var daysTaken = document.getElementById('daysTaken');
    var time = document.getElementById('times');
    //var photo = document.getElementById('photo');
    var content = document.getElementById('content');
    var type = document.getElementById('type');
    var title = document.getElementById('ititle');
    var reporter = document.getElementById('reporter');
    //var location = document.getElementById('location');
    var beforephoto = document.getElementById('beforephoto');
    var afterphoto = document.getElementById('afterphoto');
    var numUp = document.getElementById('nvotes');
    //var detailedissue = document.getElementById('detailedissue');
    //$('#details-column').fadeOut(300);
    var myLatlng = new google.maps.LatLng(p_latitude, p_longitude);
    map2.setCenter(myLatlng);
    console.log(myLatlng);
    //singlemarker.setMap(null);
    var myicon;
    myicon = getIcon(p_type, p_status);
    marker = new google.maps.Marker({
        position: myLatlng,
        map: map2,
        icon: myicon,
        title: p_status,
        animation: google.maps.Animation.DROP
    });
    

    setTimeout(function() {

        $("#colorstatus").removeClass('yc bgc gc');
        if (p_status == "open") {
            $("#colorstatus").addClass('yc');
        } else if (p_status == "progress") {
            $("#colorstatus").addClass('bgc');
        } else if (p_status == "review") {
            $("#colorstatus").addClass('gc');
        } else {
            $("#colorstatus").addClass('gc');
        }
        status.innerHTML = appropriateStatus(p_status);
        date.innerHTML = p_date;
        time.innerHTML = p_time;
        //console.log(p_time);
        
        content.innerHTML = p_content;
        type.innerHTML = '<strong>'+p_type+'</strong>';
        title.innerHTML = "<small> #"+p_issueId + "</small> " + p_title;
        reporter.innerHTML='<strong>@'+p_rtr+'</strong>';
        numUp.innerHTML=p_numVotes;
       // location.innerHTML = p_location;
        if ((before_photo && after_photo) != undefined) {
            //console.log("photo is available");
            beforephoto.src = before_photo.url();
            afterphoto.src = after_photo.url();
            console.log('both pics');
        }

        else if (before_photo != undefined) {
            //console.log("photo is available");
            beforephoto.src = before_photo.url();
            afterphoto.src = "./assets/images/no_image.jpg";
        }
        else if(after_photo != undefined ){
            afterphoto.src = after_photo.url();
            beforephoto.src = "./assets/images/no_image.jpg";
        } else {
            //console.log("photo is unavailable");
            beforephoto.src = "./assets/images/no_image.jpg";
            afterphoto.src = "./assets/images/no_image.jpg";
        }
        
        var d = new Date(issueObj.get("createdAt"));
        if (p_daysLeft != undefined) {
             //d.setDate(d.getDate() + p_daysLeft);
             //console.log(d);
             //var ago = timeSince(d);
             //console.log(ago);
             daysLeft.innerHTML = p_daysLeft +" days";
        } else {
             daysLeft.innerHTML = "unavailable";
        }

        if(p_status=="review" || p_status=="verified"){
            ListItem = Parse.Object.extend("Update");
            query = new Parse.Query(ListItem);
            query.equalTo("issue",issueObj);
            query.equalTo("type","closed");
            query.first({
                success: function(results) {
                    //console.log("current marker updated: " + results.length);
                    //currmarker.content.id = results.id;
                    if(results!=undefined){
                        d = new Date(results.get("createdAt"));
                        ago = d - new Date(issueObj.get("createdAt"));
                        ago = toTime(ago);
                        daysTaken.innerHTML = ago ;
                    }
                    //console.log(results.id);
                    //updateContentWithCurrentMarker();
                    //infowindow.open(map, currmarker);
                },
                error: function(error) {
                    console.log("Error: " + error.message);
                    notify(standardErrorMessage, "error", standardErrorDuration);
                }
            });
        }
        else if(p_status=="progress"){
            daysTaken.innerHTML = "in progress";
        }
        else{
            daysTaken.innerHTML = "-";
        }

        populateUpdates();
        //showDetailsView();
        

    }, 300);
}

function initialize() {
    issueNum= getQueryVariable("id");
    console.log(issueNum);
    updateCurrentMarker(issueNum);
    
    //initializeMap()
    map2 = new google.maps.Map(document.getElementById('googleMap'), {
        zoom: 12,
        center: new google.maps.LatLng(28.612912, 77.22951),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

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

    
}

