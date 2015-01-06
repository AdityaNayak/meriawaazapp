var currentNeta;
var EC;
var currentUser;
var currentPost;

function fetchComments(){
    
}

function calculateNetaStats(n){
    
}

function fetchConstituencyData(c){
    
}

function updateCurrentPost(p){
    
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
    query.descending('createdAt');
    query.find({
          success: function(results) {
                console.log("Size:"+results.length);
                var d;
                var ago;
                var content;
                var reach;
                var likes;
                var comments;
                for (var i = 0; i < results.length; i++) { 
                    object= results[i];
                    d=new Date(object.createdAt);
                    ago=timeSince(d);
                    content=object.get("content");
                    reach=object.get("reach");
                    likes=object.get("likes");
                    comments=object.get("numComments");
                    postView.append("<div class='panel'><div class='row'><div class='small-9 columns'><p class='secondary-color'>"+content+"</p></div><div class='small-3 columns secondary-color'><div class='row'><div class='small-12 columns secondary-color tertiary text-right'>"+ago+"</div></div><hr><div class='row'><div class='small-8 columns text-right tertiary'>Reach</div><div class='small-4 columns secondary'>"+reach+"</div></div><div class='row'><div class='small-8 columns text-right tertiary'>Likes</div><div class='small-4 columns secondary'>"+likes+"</div></div><div class='row'><div class='small-8 columns text-right tertiary'>Comments</div><div class='small-4 columns secondary'>"+comments+"</div></div></div><div class='row'><br><div name="+object.id+" id='expand' class='f-1-3x' align='center'>Expand</div></div></div></div>");
                }
                NProgress.done();
                console.log("NProgress Stop");
          },
          error: function(error) {
                console.log("Error:"+error.message);
          }
    });
}

function postStatus(c) {
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
    currentNeta=u.get("neta");
    var pointer = new Parse.Object("Neta");
    pointer.id = currentNeta.id;
    query.equalTo("arrayCandidates", pointer);
    query.include("arrayCandidates");
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
                setCurrentNeta(u);
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
    query.include(["neta.mla"]);
    query.include(["neta.user"]);
    query.include(["neta.mla.constituency"]);
    query.include(["neta.party"]);
    query.include("teamMember");
    query.include(["teamMember.neta"]);
    query.include(["teamMember.neta.user"]);
    query.include(["teamMember.neta.mla"]);
    query.include(["teamMember.neta.party"]);
    query.include(["teamMember.neta.mla.constituency"]);
    
    query.find({
      success: function(results) {
        var object = results[0];
        fetchECStatus(object);
      },
      error: function(error) {

      }
    });
}

function setCurrentNeta(u){
    console.log("setCurrentNeta");
    currentUser=u;
    if(currentUser.get("type")=="neta"){
        currentNeta=currentUser.get("neta");
        console.log("I was called Neta!");
    }
    else if(currentUser.get("type")=="teamMember"){
        var tm= currentUser.get("teamMember");
        var currentNeta= tm.get("neta");
        console.log("I was called!");
    }
    if(currentUser.get("pic")!=undefined){
          var photo=currentUser.get("pic").url();
    }
    else{
          var photo="./assets/images/no_image.jpg";
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
    populateStatus();
}

function initialize() {
    console.log("initialize");
    NProgress.start();
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
