var thisPolitician;
var allPoliticians;
var currentNeta;

function calculateFollowers(){
    
}

function fetchConstituencyData(c){
    
}

function populateStatus(){
    var postView=$('#posts');
    console.log("populateStatus");
    postView.html("");    
    ListItem = Parse.Object.extend("Post");
    query = new Parse.Query(ListItem);
    var pointer = new Parse.Object("Neta");
    pointer.id = currentNeta.id;
    query.descending('createdAt');
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
                        console.log("comments"+ assignee.get("user"));
                    }
                    else{
                        assignee="";
                    }
                    var pphoto1;
                    if(user.get("pic")!=undefined){
                        pphoto1=user.get("pic").url(); 
                    }
                    else{
                        pphoto1="http://placehold.it/300x300&text=user";
                    }
                    
                    if(object.get("type")=="assigned"){
                        var ass=assignee.get("user");
                        timelineView.append("<div class='panel nb'><p><strong>"+ass.get("name")+"</strong> was assigned by <strong>"+user.get("name")+"</strong> <small>"+ago+" ago</small></p></div>");                        
                    }
                    if(object.get("type")=="closed"){
                        timelineView.append("<div class='panel nb'><p><strong>"+user.get("name")+"</strong> closed the issue <small>"+ago+" ago</small></p></div>"); 
                        
                    }
                    if(object.get("type")=="comment"){
                        timelineView.append("<div class='row'><div class='small-2 columns wbg-fx wd-fx text-right'><img src='"+pphoto1+"' class='circle-img'></div><div class='small-10 columns'><div class='panel p-fx'><div class='panel-head'><strong>"+user.get("name")+"</strong> commented <small>"+ago+" ago</small></div><p>"+content+"</p></div></div></div>"); 
                    }
                    if(object.get("type")=="claim"){
                        timelineView.append("<div class='panel nb'><p><strong>"+user.get("name")+"</strong> claimed this issue <small>"+ago+" ago</small></p></div>"); 
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

function fetchComments(){
    
}

function postStatus() {
    
}

function setCurrentNeta(){
    
}

function initialize() {
    console.log("initialize");
    fetchConstituencyData();
    currentUser = CU;
    fetchConstituencyData();
    populateStatus();
}
        
initialize();
