//var constituency;

var AllNotificationView = $('#notification-view');

var box_today = document.getElementById('today_it');
var box_yesterday = document.getElementById('yesterday_it');
var box_week = document.getElementById('week_it');

var da = new Date();
var time = ( 24 * 3600 * 1000);
var todaysDate = new Date(da.getTime()- (time)); 
console.log(todaysDate);
var oneDay = new Date(da.getTime() - (time)+2);
var twoDay = new Date(da.getTime() - (time)*3);
console.log(oneDay);
var oneWeek = new Date(da.getTime() - (time)*8);

var currentUser;

var notifications_today = [];
var notifications_yesterday = [];
var notifications_week = [];

function fetchNotifications_week(){
    console.log("fetchNotifications week");
    if(all==true){
        displayAllNotifications();  
    }
    else{
        AllNotificationView.html("");
        ListItem = Parse.Object.extend("Notification");
        query = new Parse.Query(ListItem);
        query.equalTo("constituency", constituency);
        query.greaterThanOrEqualTo( "createdAt", oneWeek );
        query.include("issue");
        query.include("post");
        if(CU.get("type")=="teamMember"){
            query.equalTo("constituency", constituency);
        }
        query.include("postComment");
        query.include("question");
        query.include("answer");
        query.include("update");
        query.limit(1000);
        query.include(["question.pAsker"]);
        query.include(["postComment.pUser"]);
        query.include(["issue.pUser"]);
        query.include(["answer.pUser"]);
        query.include(["answer.question"]);
        query.include(["update.issue"]);
        query.include(["update.pUser"]);
        query.include(["postComment.post"]);
        //query.include("pUser");
        query.descending('createdAt');
        query.find({
            success: function(results) {
                console.log("Size:" + results.length);
                notifications_week=results;
                $("#notification_n")[0].innerHTML=notifications.length;
                filter();
                updateCounters();
                NProgress.done();
                console.log("NProgress Stop");
            },
            error: function(error) {
                console.log("Error: " + error.message);
                notify(standardErrorMessage, "error", standardErrorDuration);
            }
        });
    }
}

function fetchNotifications_yesterday(){
    console.log("fetchNotifications yesterday");
    if(all==true){
        displayAllNotifications();  
    }
    else{
        AllNotificationView.html("");
        ListItem = Parse.Object.extend("Notification");
        query = new Parse.Query(ListItem);
        query.equalTo("constituency", constituency);
        query.greaterThan("createdAt", twoDay).lessThanOrEqualTo("createdAt",todaysDate);
        query.include("issue");
        query.include("post");
        if(CU.get("type")=="teamMember"){
            query.equalTo("constituency", constituency);
        }
        query.include("postComment");
        query.include("question");
        query.include("answer");
        query.include("update");
        query.limit(1000);
        query.include(["question.pAsker"]);
        query.include(["postComment.pUser"]);
        query.include(["issue.pUser"]);
        query.include(["answer.pUser"]);
        query.include(["answer.question"]);
        query.include(["update.issue"]);
        query.include(["update.pUser"]);
        query.include(["postComment.post"]);
        //query.include("pUser");
        query.descending('createdAt');
        query.find({
            success: function(results) {
                console.log("Size:" + results.length);
                notifications_yesterday=results;
                $("#notification_n")[0].innerHTML=notifications.length;
                fetchNotifications_week();
            },
            error: function(error) {
                console.log("Error: " + error.message);
                notify(standardErrorMessage, "error", standardErrorDuration);
            }
        });
    }
}

function fetchNotifications_today(){
    console.log("fetchNotifications today");
    if(all==true){
        displayAllNotifications();  
    }
    else{
        AllNotificationView.html("");
        ListItem = Parse.Object.extend("Notification");
        query = new Parse.Query(ListItem);
        query.equalTo("constituency", constituency);
        query.greaterThanOrEqualTo( "createdAt", todaysDate );
        query.include("issue");
        query.include("post");
        if(CU.get("type")=="teamMember"){
            query.equalTo("constituency", constituency);
        }
        query.include("postComment");
        query.include("question");
        query.include("answer");
        query.include("update");
        query.limit(1000);
        query.include(["question.pAsker"]);
        query.include(["postComment.pUser"]);
        query.include(["issue.pUser"]);
        query.include(["answer.pUser"]);
        query.include(["answer.question"]);
        query.include(["update.issue"]);
        query.include(["update.pUser"]);
        query.include(["postComment.post"]);
        //query.include("pUser");
        query.descending('createdAt');
        query.find({
            success: function(results) {
                console.log("Size:" + results.length);
                notifications_today=results;
                $("#notification_n")[0].innerHTML=notifications.length;
                fetchNotifications_yesterday();
            },
            error: function(error) {
                console.log("Error: " + error.message);
                notify(standardErrorMessage, "error", standardErrorDuration);
            }
        });
    }
}

function statusCounters(no, np, nr) {
    console.log("statusCounter");
    var numAnim1 = new countUp("fn1", 0, no);
    numAnim1.start();
    var numAnim2 = new countUp("fn2", 0, np);
    numAnim2.start();
    var numAnim3 = new countUp("fn3", 0, nr);
    numAnim3.start();
}


function filter() {
    console.log("filter");
    updateHistory();
    AllNotificationView.html("");
    if(box_today.checked){
        notificationsarray=notifications_today;
    }
    else if(box_yesterday.checked){
        notificationsarray=notifications_yesterday;
    }
    else{
        notificationsarray=notifications_week;
    }
    for (var m = 0; m < notificationsarray.length; m++) {
            var d = new Date(notificationsarray[m].createdAt);
            var ago = timeSince(d);
            var object = notificationsarray[m];
            // Someone asked a question
            // if (object.get("type") == "question") {
            //     console.log("notification - question");
            //     var pAsker_m=object.get("question").get("pAsker").get("username");
            //     var title_m=object.get("question").get("title");
            //     AllNotificationView.append("<li><a href='#'>"+pAsker_m+" asked a new Question titled - "+title_m+"</a></li>");
            // }

            // New Issue
            if (object.get("type") == "issue") {
                console.log("notification - issue");
                var issueid_m=object.get("issue").get("issueId");
                var issuetype_m=object.get("issue").get("category");
                var issueposter_m=object.get("issue").get("pUser").get("username");
                var issuetitle_m=object.get("issue").get("title");
                AllNotificationView.append("<div class='row'><div class='panel p-fx'><div class='panel-head'><strong class='ct'>"+ago + " ago</small></div><p><a href='./issues.html?id="+issueid_m+"'>["+issueid_m+"] New "+issuetype_m+" issue was posted:"+issuetitle_m+" by "+issueposter_m+" </a></p></div>");
            }

            // Update on an Issue
            if (object.get("type") == "update") {
                console.log("notification - update");
                var issueupdate_m=object.get("update").get("type");
                var issueid_m=object.get("update").get("issue").get("issueId");
                var issueupdater_m=object.get("update").get("pUser").get("username");
                AllNotificationView.append("<div class='row'><div class='panel p-fx'><div class='panel-head'><strong class='ct'>"+ago + " ago</small></div><p><a href='./issues.html?id="+issueid_m+"'>New update("+issueupdate_m+") on an Issue ["+issueid_m+"] by "+issueupdater_m+"</a></p></div>");

            }

            // // Someone answered a question
            // if (object.get("type") == "answer") {
            //     console.log("notification - answer");
            //     var pAsker_m=object.get("answer").get("pUser").get("username");
            //     var title_m=object.get("answer").get("question").get("title");
            //     AllNotificationView.append("<li><a href='#'>"+pAsker_m+" answered the Question titled - "+title_m+"</a></li>");
            // }

            // Someone commented on the post
            if (object.get("type") == "postComment") {
                console.log("notification - postComment");
                var posttitle_m=object.get("postComment").get("post").get("title");
                var answered_m=object.get("postComment").get("pUser").get("username");
                AllNotificationView.append("<div class='row'><div class='panel p-fx'><div class='panel-head'><strong class='ct'>"+ago + " ago</small></div><p><a href='./dashboard.html'>New comment on your Post titled - "+posttitle_m+" by "+answered_m+"</a></p></div>");
            }

    }
}


function updateCounters() {
    console.log("Update Counters");
    var no = notifications_today.length;
    var np = notifications_yesterday.length;
    var nr = notifications_week.length;
    statusCounters(no, np, nr);
}

function initializeNotifications() {
    NProgress.start();            
    console.log("initializeNotifications");
    currentUser = CU;
    currentUser.fetch({
        success:function(results){
            fetchNotifications_today();
        },
        error:function(error){
                        console.log("Error: " + error.message);
                notify(standardErrorMessage, "error", standardErrorDuration);
        }
    });
      

    $('input[type=radio]').change(
        function() {
            NProgress.start();
            console.log("NProgress Start");
            filter();
            NProgress.done();
            console.log("NProgress Stop");
        });

   
}