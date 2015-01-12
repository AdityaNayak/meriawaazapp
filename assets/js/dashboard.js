var currentNeta;
var EC;
var currentUser;
var currentPost;

function postComment(pid){
    console.log("postComment");
    NProgress.start();
    console.log("NProgress Start");
    console.log("postComment");
    var Comment = Parse.Object.extend("postComment");
    var comment = new Comment();
    var p = new Parse.Object("Post");
    var u = new Parse.Object("User");
    p.id = pid;
    u.id = currentUser.id;
    var c=document.getElementById("text-"+pid).value;
    comment.set("content", c);
    comment.set("post", p);
    comment.set("user", u);
    comment.save(null, {
      success: function(comment) {
        updatePost(pid);        
      },
      error: function(comment, error) {
        alert('Failed to Comment!' + error.message);
      }
    });
}

function updatePost(pid){
    console.log("updatePost");
    ListItem1 = Parse.Object.extend("Post");
    query1 = new Parse.Query(ListItem);
    query1.equalTo("objectId", pid);
    query1.find({
          success: function(results1) {
                var d;
                var ago;
                var content;
                var reach;
                var likes;
                var comments;
                object= results1[0];
                d=new Date(object.createdAt);
                ago=timeSince(d);
                content=object.get("content");
                reach=object.get("reach");
                likes=object.get("likes");
                comments=object.get("numComments");
                ListItem2 = Parse.Object.extend("PostComment");
                query2 = new Parse.Query(ListItem2);
                var pointer1 = new Parse.Object("Post");
                pointer1.id = pid;
                query2.equalTo("post", pointer1);
                query2.include("post");
                query2.include("user");
                query2.find({
                    success: function(results2) {
                        var chaincomments ="";
                        object=results2[0];
                        for(var j=0;j<results2.length;j++){
                            var time;
                            var photo;
                            var comm;
                            time=timeSince(new Date(results2[j].createdAt));
                            if(results2[j].get("user").get("pic")==undefined){
                                photo=getDefaultIcon(results2[j].get("user").get("type"));
                            }
                            else{
                                photo=results2[j].get("user").get("pic").url();
                            } 
                            comm=results2[j].get("content");
                            chaincomments+="<div class='row'><div class='small-2 columns text-right s-ws-top'><img src="+photo+" class='circle-img gs hv img-h'></div><div class='small-10 columns s-ws-top'><p class='secondary nm'>"+comm+"</p><div class='tertiary secondary-color'><i class='icon-clock tertiary'></i>"+time+"</div></div></div>";
                        }
                        var thisview=document.getElementById("post-"+pid);
                        thisview.innerHTML="<div class='row'><div class='small-3 small-offset-6 columns text-right secondary-color s-ws-bottom'><span class='tertiary'>Reach: </span><span class='bc'>"+reach+"</span></div><div class='small-3 columns secondary-color tertiary text-right s-ws-bottom'><i class='icon-clock tertiary'></i> "+ago+"</div></div><div class='row'><div class='small-12 columns'><p class='secondary-color'>"+content+"</p></div></div></div><div class='bg2 br-fx1-top'><div class='row' name='"+object.id+"' id='expand'><div class='small-3 s-ws-bottom columns secondary-color secondary'>Likes "+likes+"</div><div class='small-3 s-ws-bottom columns end secondary-color secondary'>Comments "+comments+"</div></div><div id='comments-"+object.id+"'>"+chaincomments+"</div><div class='row'><div class='small-2 columns text-right m-ws-top'><img src='"+getDefaultIcon(currentUser.get('type'))+"' class='circle-img gs hv img-h'></div><div class='small-10 columns s-ws-top'><form onSubmit='postComment"+"('"+object.id+"')'"+"><textarea id='text-"+object.id+"' class='secondary' rows='3'></textarea><input type='submit' value='comment' placeholder='add a comment' class='tiny right'></form></div></div>";
                        NProgress.done();
                    },
                    error: function(error2){
                        console.log("Error2:"+error2.message);
                    }
                });
            },
          error: function(error1) {
            console.log("Error1:"+error1.message);
          }
    });
}

function calculateNetaStats(n){
    console.log("calculateNetaStats");
    var actions;
    var interactions;
    var followers;
    var photo;
    var partyname;
    var name;
    var age;

    ListItem = Parse.Object.extend("Neta");
    query = new Parse.Query(ListItem);
    query.equalTo("objectId", n.id);
    query.include("party");
    query.include("user");
    query.find({
      success: function(results) {
        actions=results[0].get("numIsClaimed")+results[0].get("numIsClosed");
        interactions=results[0].get("numPosts")+results[0].get("numComments")+results[0].get("numQsAnswered");
        followers=results[0].get("numLikes");
        name=results[0].get("user").get("name");
        partyname=results[0].get("party").get("name");
        age=results[0].get("age");
        if(results[0].get("user").get("pic")!=undefined){
            photo=results[0].get("user").get("pic").url();
        }
        else{
            photo="./assets/images/neta.png";
        }
        $("#competitorlist").append("<div class='row collapse'><div class='small-3 columns'><img src="+photo+" class='circle-img gs hv pd'></div><div class='small-9 columns'><h4>"+name+"<small>("+age+")</small></h4><h6>"+partyname+"</h6></div></div><div class='row tertiary'><div class='small-6 columns text-right'><span class='f-2x bgc'>"+followers+" </span>followers </div><div class='small-6 columns s-ws-top'><i class='icon-up gc'></i><span class='secondary secondary-color'>23 this week</span></div></div><div class='row tertiary'><div class='small-6 columns text-right'><span class='f-2x bc'>"+interactions+"</span>interactions </div><div class='small-6 columns s-ws-top'><i class='icon-down rc'></i><span class='secondary secondary-color'>31 this week</span></div></div><div class='row tertiary'><div class='small-6 columns text-right'><span class='f-2x dbc'>"+actions+" </span>actions </div><div class='small-6 columns s-ws-top'><i class='icon-down rc'></i><span class='secondary secondary-color'>2 this week</span></div></div><hr>");
      },
      error: function(error) {

      }
    });

}

function calculateCurrentNetaStats(){
        console.log("calculateCurrentNetaStats");
        actions=currentNeta.get("numIsClaimed")+currentNeta.get("numIsClosed");
        interactions=currentNeta.get("numPosts")+currentNeta.get("numComments")+currentNeta.get("numQsAnswered");
        followers=currentNeta.get("numLikes");
        
        document.getElementById('f').innerHTML=followers.toString();
        document.getElementById('i').innerHTML=interactions.toString();
        document.getElementById('a').innerHTML=actions.toString();
}

function fetchConstituencyData(c){
        console.log("fetchConstituencyData");
        $("#competitorlist").innerHTML="";
        ListItem = Parse.Object.extend("Election");
        query = new Parse.Query(ListItem);
        var pointer = new Parse.Object("Neta");
        pointer.id = currentNeta.id;
        query.equalTo("arrayNetas", pointer);
        query.include("arrayNetas");
        query.include("constituency");
        query.descending('createdAt');
        console.log("I am here!");
        query.find({
          success: function(results) {
                if(results[0]!=undefined){
                    console.log("I am here! 78");
                    netas=results[0].get("arrayNetas");
                    for(var i=0;i<netas.length;i++){
                        if(netas[i].id!=currentNeta.id){
                            calculateNetaStats(netas[i]);
                        }
                    }
                }
                
                NProgress.done();
            },
          error: function(error){
                console.log("Error99: "+error.message);
            } 
          });
}

function populateStatus(){
    var postView=$('#posts');
    console.log("populateStatus");
    postView.html("");    
    ListItem = Parse.Object.extend("Post");
    query = new Parse.Query(ListItem);
    var pointer = new Parse.Object("Neta");
    pointer.id = currentNeta.id;
    query.equalTo("neta", pointer);
    console.log("I am here104!");
    query.descending('createdAt');
    query.find({
          success: function(results) {
                for (var i = 0; i < results.length; i++) {
                    ListItem1 = Parse.Object.extend("Post");
                    query1 = new Parse.Query(ListItem);
                    query1.equalTo("objectId", results[i].id);
                    query1.find({
                          success: function(results1) {
                                var d;
                                var ago;
                                var content;
                                var reach;
                                var likes;
                                var comments;
                                object= results1[0];
                                console.log("I am here!120");
                                d=new Date(object.createdAt);
                                ago=timeSince(d);
                                content=object.get("content");
                                reach=object.get("reach");
                                likes=object.get("likes");
                                comments=object.get("numComments");
                                ListItem2 = Parse.Object.extend("PostComment");
                                query2 = new Parse.Query(ListItem2);
                                var pointer1 = new Parse.Object("Post");
                                pointer1.id = object.id;
                                query2.equalTo("post", pointer1);
                                query2.include("post");
                                query2.include("user");
                                query2.find({
                                    success: function(results2) {
                                        var chaincomments ="";
                                        for(var j=0;j<results2.length;j++){
                                            var time;
                                            var photo;
                                            var comm;
                                            console.log("I am here!142");
                                            time=timeSince(new Date(results2[j].createdAt));
                                            if(results2[j].get("user").get("pic")==undefined){
                                                photo=getDefaultIcon(results2[j].get("user").get("type"));
                                            }
                                            else{
                                                photo=results2[j].get("user").get("pic").url();
                                            } 
                                            comm=results2[j].get("content");
                                            chaincomments+="<div class='row'><div class='small-2 columns text-right s-ws-top'><img src="+photo+" class='circle-img gs hv img-h'></div><div class='small-10 columns s-ws-top'><p class='secondary nm'>"+comm+"</p><div class='tertiary secondary-color'><i class='icon-clock tertiary'></i>"+time+"</div></div></div>";
                                        }
                                        postView.append("<div id='post-"+object.id+"' class='panel nm br-fx-bottom'><div class='row'><div class='small-3 small-offset-6 columns text-right secondary-color s-ws-bottom'><span class='tertiary'>Reach: </span><span class='bc'>"+reach+"</span></div><div class='small-3 columns secondary-color tertiary text-right s-ws-bottom'><i class='icon-clock tertiary'></i> "+ago+"</div></div><div class='row'><div class='small-12 columns'><p class='secondary-color'>"+content+"</p></div></div></div><div class='bg2 br-fx1-top'><div class='row' name='"+object.id+"' id='expand'><div class='small-3 s-ws-bottom columns secondary-color secondary'>Likes "+likes+"</div><div class='small-3 s-ws-bottom columns end secondary-color secondary'>Comments "+comments+"</div></div><div id='comments-"+object.id+"'>"+chaincomments+"</div><div class='row'><div class='small-2 columns text-right m-ws-top'><img src='"+getDefaultIcon(currentUser.get('type'))+"' class='circle-img gs hv img-h'></div><div class='small-10 columns s-ws-top'><form onSubmit='postComment('"+object.id+"')'><textarea class='secondary' rows='3' required></textarea><input type='submit' id='text-"+object.id+"' value='comment' placeholder='add a comment' class='tiny right'></form></div></div></div>");
                                    },
                                    error: function(error2){
                                        console.log("Error2:"+error2.message);
                                    }
                                });
                            },
                          error: function(error1) {
                            console.log("Error1:"+error1.message);
                          }
                    });
                    
                }

                fetchConstituencyData(currentNeta.get("constituency"));
                
                console.log("NProgress Stop");
          },
          error: function(error) {
                console.log("Error0:"+error.message);
          }
    });
}

function postStatus(c) {
    if(CU.get("type")!="neta"){
        alert("You do not have the required permissions");
        return;
    }
    console.log('postStatus');
    NProgress.start();
    console.log("NProgress Start");
    console.log("postStatus");
    loadingButton_id("post",4);
    var Post = Parse.Object.extend("Post");
    var post = new Post();
    var u = new Parse.Object("Neta");
    u.id = currentNeta.id;
    post.set("content", c);
    post.set("reach", 0);
    post.set("likes", 0);
    post.set("numComments", 0);
    post.set("neta",u);
    
    post.save(null, {
      success: function(post) {
        populateStatus();
        document.getElementById("postArea").value="";
      },
      error: function(comment, error) {
        alert('Failed to Post! ' + error.message);
      }
    });
}

function fetchECStatus(u){
    console.log("fetchECStatus");    
    ListItem = Parse.Object.extend("Election");
    query = new Parse.Query(ListItem);
    if(u.get("type")=="neta"){
        currentNeta=u.get("neta");
    }
    else{
        currentNeta=u.get("teamMember").get("neta");
    }
    
    var pointer = new Parse.Object("Neta");
    pointer.id = currentNeta.id;
    query.equalTo("arrayNetas", pointer);
    query.include("arrayNetas");
    query.include("constituency");
    query.descending('createdAt');
    EC={e:"",c:""};
    query.find({
          success: function(results) {
                console.log("Size:"+results.length);
                if(results.length==0){
                    EC.e="-";
                    EC.c="-";
                }
                else{
                    //Check if newer elections in this constituency have happened
                    if(results[0].get("winner")==undefined){
                        EC.e=results[0].get("name")+" "+results[0].get("year").toString()+" (Candidate)";
                    }
                    else{
                        if(results[0].get("winner").id==currentNeta.id){
                            EC.e=results[0].get("name")+" "+results[0].get("year").toString()+" (Winner)";
                        }
                        else{
                            EC.e=results[0].get("name")+" "+results[0].get("year").toString()+" (Candidate)";
                        }
                    }
                    EC.c=results[0].get("constituency").get("name")+"<small> "+results[0].get("constituency").get("state")+"</small>";
                }
                if(u.get("type")=="neta"){
                    setCurrentNeta(u);
                }
                else if(u.get("type")=="teamMember"){
                    setCurrentNetaTM(currentNeta);
                }
                console.log("NProgress Stop");
          },
          error: function(error) {
                console.log("Error:"+error.message);
          }
    });
}

function queryUserTable(){
    console.log('QueryUserTable');
    ListItem = Parse.Object.extend("User");
    query = new Parse.Query(ListItem);
    query.equalTo("objectId", CU.id);
    query.include("neta");
    query.include(["neta.party"]);
    query.include(["neta.constituency"]);
    query.include("teamMember");
    query.include(["teamMember.neta"]);
    query.include(["teamMember.neta.user"]);
    query.include(["teamMember.neta.party"]);
    query.include(["teamMember.neta.constituency"]);
    query.find({
      success: function(results) {
        var object = results[0];
        fetchECStatus(object);
      },
      error: function(error) {

      }
    });
}


//given neta
function setCurrentNetaTM(n){
    console.log("setCurrentNeta");
    currentUser=n.get("user");
    currentNeta=n;
    console.log("I was called Team Member!");
    if(currentUser.get("pic")!=undefined){
          var photo=currentUser.get("pic").url();
    }
    else{
          var photo="./assets/images/neta.png";
    }
    
    var name=currentUser.get("name");
    var party=currentNeta.get("party");
    var partyname=party.get("name");
    var ele=EC.e;
    var cs=EC.c;
    document.getElementById('photo').src=photo;
    document.getElementById('myname').innerHTML=name;
    document.getElementById('myparty').innerHTML=partyname;
    document.getElementById('ele').innerHTML=ele;
    document.getElementById('cs').innerHTML=cs;
    calculateCurrentNetaStats();
    
    populateStatus();
}

//given user
function setCurrentNeta(u){
    console.log("setCurrentNeta");
    currentUser=u;
    currentNeta=currentUser.get("neta");
    console.log("I was called Neta!");
    if(currentUser.get("pic")!=undefined){
          var photo=currentUser.get("pic").url();
    }
    else{
          var photo="./assets/images/neta.png";
    }
    
    var name=currentUser.get("name");
    var party=currentNeta.get("party");
    var partyname=party.get("name");
    var ele=EC.e;
    var cs=EC.c;
    document.getElementById('photo').src=photo;
    document.getElementById('myname').innerHTML=name;
    document.getElementById('myparty').innerHTML=partyname;
    document.getElementById('ele').innerHTML=ele;
    document.getElementById('cs').innerHTML=cs;
    calculateCurrentNetaStats();

    populateStatus();
}

function initialize() {
    console.log("initialize");
    NProgress.start();
    if(CU.get("type")!="neta"){
        $("#netapost").fadeOut();
    }
    queryUserTable();

    $('#post-form').submit(function(event){
          event.preventDefault();
          var p=document.getElementById("postArea").value;
          postStatus(p);
    });
    $('#postArea').focus(function(){
        $(this).animate({'height': '160px'}).removeClass('nm');
        $('#sh-ltr1').delay(800).fadeIn();
    });
}
        
initialize();
