var currentNeta;
var EC;
var currentUser;
var currentPost;

function postComment(pid){
    console.log("postComment"+pid);
    NProgress.start();
    console.log("NProgress Start");
    console.log("postComment");
    var Comment = Parse.Object.extend("PostComment");
    var comment = new Comment();
    var p = new Parse.Object("Post");
    var u = new Parse.Object("User");
    p.id = pid;
    u.id = currentUser.id;
    console.log("text-"+pid.toString());
    var c=document.getElementById("text-"+pid.toString()).value;
    comment.set("content", c);
    comment.set("post", p);
    comment.set("user", u);
    comment.save(null, {
      success: function(comment) {
        updatePost(pid); 
        document.getElementById("text-"+pid.toString()).value="";       
      },
      error: function(comment, error) {
        alert('Failed to Comment!' + error.message);
        NProgress.done();
      }
    });
}

function updatePost(pid){
    console.log("updatePost");
    ListItem1 = Parse.Object.extend("Post");
    query1 = new Parse.Query(ListItem1);
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
                query2.ascending("createdAt");
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
                        var thisview=$('#post-'+pid);
                        thisview.html("");  
                        if(currentUser.get("pic")!=undefined){
                            var imige=currentUser.get("pic").url();
                        }
                        else{
                            var imige=getDefaultIcon(currentUser.get("pic").url());
                        }
                        thisview.html("<div class='row'><div class='small-3 small-offset-6 columns text-right secondary-color s-ws-bottom'><span class='tertiary'>Reach: </span><span class='bc'>"+reach+"</span></div><div class='small-3 columns secondary-color tertiary text-right s-ws-bottom'><i class='icon-clock tertiary'></i> "+ago+"</div></div><div class='row'><div class='small-12 columns'><p class='secondary-color'>"+content+"</p></div></div><div class='bg2 br-fx1-top'><div class='row' name='"+object.id+"' id='expand'><div class='small-3 s-ws-bottom columns secondary-color secondary'>Likes "+likes+"</div><div class='small-3 s-ws-bottom columns end secondary-color secondary'>Comments "+comments+"</div></div><div id='comments-"+object.id+"'>"+chaincomments+"</div><div class='row'><div class='small-2 columns text-right m-ws-top'><img src="+imige+" class='circle-img gs hv img-h'></div><div class='small-10 columns s-ws-top'><form id='form-"+object.id+"'><textarea id='text-"+object.id+"' class='secondary fx' rows='3' required></textarea><input type='submit'  value='comment' placeholder='add a comment' class='tiny button'></form></div></div></div>");
                        $('#form-'+object.id).submit(function(event){
                              event.preventDefault();
                              postComment(event.target.id.toString().split('-')[1]);
                        });
                        NProgress.done();
                    },
                    error: function(error2){
                        console.log("Error: "+error2.message);
                        NProgress.done();
                    }
                });
            },
          error: function(error1) {
            console.log("Error: "+error1.message);
            NProgress.done();
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
    query.include("pUser");
    query.find({
      success: function(results) {
        actions=results[0].get("numIsClaimed")+results[0].get("numIsClosed");
        interactions=results[0].get("numPosts")+results[0].get("numComments")+results[0].get("numQsAnswered");
        followers=results[0].get("numLikes");
        name=results[0].get("pUser").get("name");
        partyname=results[0].get("party").get("name");
        age=results[0].get("age");
        if(age==undefined){
            age="-";
        }
        if(results[0].get("pUser").get("pic")!=undefined){
            photo=results[0].get("pUser").get("pic").url();
        }
        else{
            photo="./assets/images/neta.png";
        }
        $("#competitorlist").append("<div class='row collapse'><div class='small-3 columns'><img src="+photo+" class='circle-img gs hv pd'></div><div class='small-9 columns ct'><h4>"+name+"<small>("+age+")</small></h4><h6>"+partyname+"</h6></div></div><div class='row tertiary'><div class='small-6 columns text-right'><span class='f-2x bgc'>"+followers+" </span>followers </div><div class='small-6 columns s-ws-top'><i class='icon-up gc'></i><span class='secondary secondary-color'>23 this week</span></div></div><div class='row tertiary'><div class='small-6 columns text-right'><span class='f-2x bc'>"+interactions+"</span>interactions </div><div class='small-6 columns s-ws-top'><i class='icon-down rc'></i><span class='secondary secondary-color'>31 this week</span></div></div><div class='row tertiary'><div class='small-6 columns text-right'><span class='f-2x dbc'>"+actions+" </span>actions </div><div class='small-6 columns s-ws-top'><i class='icon-down rc'></i><span class='secondary secondary-color'>2 this week</span></div></div><hr>");
      },
      error: function(error) {
            console.log("Error: "+error.message);
            NProgress.done();
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
                console.log("Error: "+error.message);
                NProgress.done();
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
                qpost=[];
                for (var i = 0; i < results.length; i++) {
                    var poin = new Parse.Object("Post");
                    poin.id = results[i].id;
                    qpost.push(poin);
                }
                if (qpost.length!=0){
                    ListItem2 = Parse.Object.extend("PostComment");
                    query2 = new Parse.Query(ListItem2);
                    query2.containedIn("post",qpost);
                    query2.include("post");
                    query2.include("pUser");
                    query2.ascending("createdAt");
                    query2.find({
                        success: function(results2) {
                            console.log("Number of comments:"+results2.length);
                            for(var i=0;i<results.length;i++){
                                var object=results[i];
                                var chaincomments ="";
                                for(var j=0;j<results2.length;j++){
                                    if(results2[j].get("post").id==object.id){
                                        var time;
                                        var photo;
                                        var comm;
                                        console.log("I am here!142");
                                        time=timeSince(new Date(results2[j].createdAt));
                                        if(results2[j].get("pUser").get("pic")==undefined){
                                            photo=getDefaultIcon(results2[j].get("pUser").get("type"));
                                        }
                                        else{
                                            photo=results2[j].get("pUser").get("pic").url();
                                        } 
                                        comm=results2[j].get("content");
                                        chaincomments+="<div class='row'><div class='small-2 columns text-right s-ws-top'><img src="+photo+" class='circle-img gs hv img-h'></div><div class='small-10 columns s-ws-top'><p class='secondary nm'>"+comm+"</p><div class='tertiary secondary-color'><i class='icon-clock tertiary'></i>"+time+"</div></div></div>";
                                    }
                                    
                                }
                                var d;
                                var ago;
                                var content;
                                var reach;
                                var likes;
                                var comments;
                                console.log("I am here!120");
                                d=new Date(object.createdAt);
                                ago=timeSince(d);
                                content=object.get("content");
                                reach=object.get("reach");
                                likes=object.get("likes");
                                comments=object.get("numComments");
                                if(currentUser.get("pic")!=undefined){
                                var imige=currentUser.get("pic").url();
                                }
                                else{
                                    var imige=getDefaultIcon(currentUser.get("type"));
                                }
                                postView.append("<div id='post-"+object.id+"' class='panel nm br-fx-bottom'><div class='row'><div class='small-3 small-offset-6 columns text-right secondary-color s-ws-bottom'><span class='tertiary'>Reach: </span><span class='bc'>"+reach+"</span></div><div class='small-3 columns secondary-color tertiary text-right s-ws-bottom'><i class='icon-clock tertiary'></i> "+ago+"</div></div><div class='row'><div class='small-12 columns'><p class='secondary-color'>"+content+"</p></div></div><div class='bg2 br-fx1-top'><div class='row' name='"+object.id+"' id='expand'><div class='small-3 s-ws-bottom columns secondary-color secondary'>Likes "+likes+"</div><div class='small-3 s-ws-bottom columns end secondary-color secondary'>Comments "+comments+"</div></div><div id='comments-"+object.id+"'>"+chaincomments+"</div><div class='row'><div class='small-2 columns text-right m-ws-top'><img src="+imige+" class='circle-img gs hv img-h'></div><div class='small-10 columns s-ws-top'><form id='form-"+object.id+"'><textarea class='secondary fx' rows='3' id='text-"+object.id+"' required></textarea><input type='submit' value='comment' placeholder='add a comment' class='tiny button'></form></div></div></div></div>");
                                console.log("form listener created for "+object.id);
                                $('#form-'+object.id).submit(function(event){
                                      event.preventDefault();
                                      postComment(event.target.id.toString().split('-')[1]);
                                });
                                
                            }
                            fetchConstituencyData(currentNeta.get("constituency"));
                            console.log("NProgress Stop");
                        },
                        error: function(error2){
                            console.log("Error2:"+error2.message);
                            NProgress.done();
                        }
                    });
                }
                    
          },
          error: function(error) {
                console.log("Error0:"+error.message);
                NProgress.done();
          }
    });
}

// function populateStatus(){
//     var postView=$('#posts');
//     console.log("populateStatus");
//     postView.html("");    
//     ListItem = Parse.Object.extend("Post");
//     query = new Parse.Query(ListItem);
//     var pointer = new Parse.Object("Neta");
//     pointer.id = currentNeta.id;
//     query.equalTo("neta", pointer);
//     console.log("I am here104!");
//     query.descending('createdAt');
//     query.find({
//           success: function(results) {
//                 for (var i = 0; i < results.length; i++) {
//                     var d;
//                     var ago;
//                     var content;
//                     var reach;
//                     var likes;
//                     var comments;
//                     object= results[i];
//                     console.log("I am here!120");
//                     d=new Date(object.createdAt);
//                     ago=timeSince(d);
//                     content=object.get("content");
//                     reach=object.get("reach");
//                     likes=object.get("likes");
//                     comments=object.get("numComments");
//                     ListItem2 = Parse.Object.extend("PostComment");
//                     query2 = new Parse.Query(ListItem2);
//                     var pointer1 = new Parse.Object("Post");
//                     pointer1.id = object.id;
//                     query2.equalTo("post", pointer1);
//                     query2.include("post");
//                     query2.include("user");
//                     query2.find({
//                         success: function(results2) {
//                             var chaincomments ="";
//                             console.log(object.id+"Number of comments:"+results2.length);
//                             for(var j=0;j<results2.length;j++){
//                                 var time;
//                                 var photo;
//                                 var comm;
//                                 console.log("I am here!142");
//                                 time=timeSince(new Date(results2[j].createdAt));
//                                 if(results2[j].get("user").get("pic")==undefined){
//                                     photo=getDefaultIcon(results2[j].get("user").get("type"));
//                                 }
//                                 else{
//                                     photo=results2[j].get("user").get("pic").url();
//                                 } 
//                                 comm=results2[j].get("content");
//                                 chaincomments+="<div class='row'><div class='small-2 columns text-right s-ws-top'><img src="+photo+" class='circle-img gs hv img-h'></div><div class='small-10 columns s-ws-top'><p class='secondary nm'>"+comm+"</p><div class='tertiary secondary-color'><i class='icon-clock tertiary'></i>"+time+"</div></div></div>";
//                             }
//                             if(currentUser.get("pic")!=undefined){
//                                 var imige=currentUser.get("pic").url();
//                             }
//                             else{
//                                 var imige=getDefaultIcon(currentUser.get("type"));
//                             }
//                             postView.append("<div id='post-"+object.id+"' class='panel nm br-fx-bottom'><div class='row'><div class='small-3 small-offset-6 columns text-right secondary-color s-ws-bottom'><span class='tertiary'>Reach: </span><span class='bc'>"+reach+"</span></div><div class='small-3 columns secondary-color tertiary text-right s-ws-bottom'><i class='icon-clock tertiary'></i> "+ago+"</div></div><div class='row'><div class='small-12 columns'><p class='secondary-color'>"+content+"</p></div></div><div class='bg2 br-fx1-top'><div class='row' name='"+object.id+"' id='expand'><div class='small-3 s-ws-bottom columns secondary-color secondary'>Likes "+likes+"</div><div class='small-3 s-ws-bottom columns end secondary-color secondary'>Comments "+comments+"</div></div><div id='comments-"+object.id+"'>"+chaincomments+"</div><div class='row'><div class='small-2 columns text-right m-ws-top'><img src="+imige+" class='circle-img gs hv img-h'></div><div class='small-10 columns s-ws-top'><form id='form-"+object.id+"'><textarea class='secondary fx' rows='3' id='text-"+object.id+"' required></textarea><input type='submit' value='comment' placeholder='add a comment' class='tiny button'></form></div></div></div></div>");
//                             console.log("form listener created for "+object.id);
//                             $('#form-'+object.id).submit(function(event){
//                                   event.preventDefault();
//                                   postComment(object.id);
//                             });
//                         },
//                         error: function(error2){
//                             console.log("Error2:"+error2.message);
//                             NProgress.done();
//                         }
//                     });
//                 }

//                 fetchConstituencyData(currentNeta.get("constituency"));
                
//                 console.log("NProgress Stop");
//           },
//           error: function(error) {
//                 console.log("Error0:"+error.message);
//                 NProgress.done();
//           }
//     });
// }

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
    var isSms = document.getElementById("sms").checked;
    var isApp = document.getElementById("app").checked;
    var isEmail = document.getElementById("email").checked;
    post.set("isSMS",isSms);
    post.set("isApp",isApp);
    post.set("isEmail",isEmail);
    post.save(null, {
      success: function(post) {
        populateStatus();
        document.getElementById("postArea").value="";
      },
      error: function(comment, error) {
        alert('Failed to Post! ' + error.message);
        NProgress.done();
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
                NProgress.done();
          }
    });
}

function updateReach(){
    var constituency=currentNeta.get("constituency");
    var Citizens= Parse.Object.extend("Citizen");
    var query1 = new Parse.Query(Citizens);
    query1.equalTo("constituency",constituency);
    query1.count({
      success: function(count1) {
        console.log("population:"+count1);
        document.getElementById("population").innerHTML=count1;
      },
      error: function(error) {
        console.log("Error: "+error.message);
                NProgress.done();
      }
    });
}
// function queryUserTable(){
//     console.log('QueryUserTable');
//     ListItem = Parse.Object.extend("User");
//     query = new Parse.Query(ListItem);
//     query.equalTo("objectId", CU.id);
//     query.include("neta");
//     query.include(["neta.party"]);
//     query.include(["neta.constituency"]);
//     query.include("teamMember");
//     query.include(["teamMember.neta"]);
//     query.include(["teamMember.neta.user"]);
//     query.include(["teamMember.neta.party"]);
//     query.include(["teamMember.neta.constituency"]);
//     query.find({
//       success: function(results) {
//         var object = results[0];
//         fetchECStatus(object);
//       },
//       error: function(error) {
//             console.log("Error:"+error.message);
//             NProgress.done();
//       }
//     });
// }

function queryUserTable(){
    console.log('QueryUserTable');
    CU.fetch({
      success: function(results) {
        fetchECStatus(CU);
      },
      error: function(error) {
            console.log("Error:"+error.message);
            NProgress.done();
      }
    });
}


//given neta
function setCurrentNetaTM(n){
    console.log("setCurrentNeta");
    n.fetch({
     success: function(result){
            currentUser=n.get("user");
            currentNeta=n;
            currentUser.fetch({
                success:function(results){
                    console.log("I was called Team Member!");
                    if(currentUser.get("pic")!=undefined){
                          var photo=currentUser.get("pic").url();
                    }
                    else{
                          var photo="./assets/images/neta.png";
                    }
                    
                    var name=currentUser.get("name");
                    var party=currentNeta.get("party");
                    party.fetch({
                       success:function(result){
                            var partyname=party.get("name");
                            var population=currentNeta.get("constituency").get("population");
                            var ele=EC.e;
                            var cs=EC.c;
                            document.getElementById('photo').src=photo;
                            document.getElementById('myname').innerHTML=name;
                            document.getElementById('population').innerHTML=population;
                            document.getElementById('myparty').innerHTML=partyname;
                            document.getElementById('ele').innerHTML=ele;
                            document.getElementById('cs').innerHTML=cs;
                            calculateCurrentNetaStats();
                            
                            populateStatus();
                       },
                       error: function(error){
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
     },
     error: function(error){
         console.log("Error: "+error.message);
        NProgress.done();
     }   
    });
}

//given user
function setCurrentNeta(u){
    console.log("setCurrentNeta");
    currentUser=u;
    currentNeta=currentUser.get("neta");
    currentNeta.fetch({
       success: function(results){
            console.log("I was called Neta!");
            if(currentUser.get("pic")!=undefined){
                  var photo=currentUser.get("pic").url();
            }
            else{
                  var photo="./assets/images/neta.png";
            }
            
            var name=currentUser.get("name");
            var party=currentNeta.get("party");
            party.fetch({
               success: function(result){
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
               } ,
               error: function(error){
                   console.log("Error: "+error.message);
                    NProgress.done();
               }
            });
            
       },
       error: function(error){
           console.log("Error: "+error.message);
                NProgress.done();
       }
    });
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
        $(this).animate({'height': '120px'}).removeClass('nm');
        $('#sh-ltr1').delay(800).fadeIn();
    });
    var supportOnInput = 'oninput' in document.createElement('input');

       
            var postArea = $('textarea#postArea');
            var maxLength = 140;
            var el1 = $('#chcount');
            var el2 = $("<span>" + maxLength + "</span>");
            el1.append(el2);    
            postArea.bind(supportOnInput ? 'input' : 'keyup', function() {
                var cc = postArea.val().length;
                
                el2.text(maxLength - cc);
                
                if(maxLength < cc) {
                    el1.removeClass('bgc');
                    el1.addClass('yc');
                } else {
                    el1.removeClass('yc');
                    el1.addClass('bgc');
                }
            
        });
}
        
initialize();
