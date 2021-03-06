var currentNeta;
var EC;
var currentUser;
var currentPUser;
var file;
var filePath;
var filename;
var currentPost;
var voterViewArray=[];

function createVoterArray(){
	var VoterTable=Parse.Object.extend("NetaList");
	var votertable=new Parse.Query(VoterTable);
	votertable.equalTo("neta",currentNeta);
	votertable.find({
		success:function(results){
			for(var i=0;i<results.length;i++){
				voterViewArray.push([results[i].id,results[i].get("name")]);
			}
			var voterView="";
			for(var ik=0;ik<voterViewArray.length;ik++){
				if(results[ik].get("ranking")==0){
					voterView=voterView+"<div class='small-2 columns end s-ws-top'><label><input type='checkbox' checked=true value='"+voterViewArray[ik][0]+"' name='voter'> "+voterViewArray[ik][1]+"</label></div>";
				}
				else{
					voterView=voterView+"<div class='small-2 columns end s-ws-top'><label><input type='checkbox' value='"+voterViewArray[ik][0]+"' name='voter'> "+voterViewArray[ik][1]+"</label></div>";
				}
			}
			cf1.innerHTML=voterView;
                $('#cf1 input').change(function(){
                $('#listIcon').removeClass('bc').addClass('gc');
            })
		},
		error:function(){
			console.log("Error: "+error.message);
            notify(error.message, "error",standardErrorDuration);
		}
	});
}


function postComment(pid){
       if(file!=undefined){
            var parsefile=new Parse.File(file.name,file);
            parsefile.save().then(function(){
            //  console.log('postStatus');
                NProgress.start();
            //  console.log("NProgress Start");
            //  console.log("postStatus");

                
                console.log(pid)
                loadingButton_id("commentBtn-"+pid,10);
                NProgress.start();
             //   console.log("NProgress Start");
             //   console.log("postComment");
                var Comment = Parse.Object.extend("PostComment");
                var comment = new Comment();
                var p = new Parse.Object("Post");
                var u = new Parse.Object("_User");
                p.id = pid;
                u.id = currentUser.id;
             //   console.log("text-"+pid.toString());
                var c=document.getElementById("text-"+pid.toString()).value;
                comment.set("content", c);
                comment.set("post", p);
                comment.set("user", u);
                comment.set("file",parsefile);
                comment.save(null, {
                  success: function(comment) {
                    loadingButton_id_stop("commentBtn-"+pid,"comment");
                    updatePost(pid); 
                    document.getElementById("text-"+pid.toString()).value="";  
                    NProgress.done();
                    $('#thumbnil-'+pid).attr("src","");
                    file=undefined;
                    filename=undefined;
                    filePath=undefined;
                    notify("Comment added","success", standardErrorDuration);     
                  },
                  error: function(comment, error) {
                    $('#thumbnil-'+pid).attr("src","");
                    updatePost(pid); 
                    file=undefined;
                    filename=undefined;
                    filePath=undefined;
                    notify('Failed to Comment!' + error.message, "error", standardErrorDuration);
                    NProgress.done();
                  }
                });
            });
        }
    else{
        //  console.log('postStatus');
            NProgress.start();
        //  console.log("NProgress Start");
        //  console.log("postStatus");
            console.log(pid)
            loadingButton_id("commentBtn-"+pid,10);
            NProgress.start();
         //   console.log("NProgress Start");
         //   console.log("postComment");
            var Comment = Parse.Object.extend("PostComment");
            var comment = new Comment();
            var p = new Parse.Object("Post");
            var u = new Parse.Object("_User");
            p.id = pid;
            u.id = currentUser.id;
         //   console.log("text-"+pid.toString());
            var c=document.getElementById("text-"+pid.toString()).value;
            comment.set("content", c);
            comment.set("post", p);
            comment.set("user", u);
            comment.save(null, {
              success: function(comment) {
                loadingButton_id_stop("commentBtn-"+pid,"comment");
                updatePost(pid); 
                document.getElementById("text-"+pid.toString()).value="";  
                NProgress.done();
                notify("Comment added","success", standardErrorDuration);     
              },
              error: function(comment, error) {
                notify('Failed to Comment!' + error.message, "error", standardErrorDuration);
                NProgress.done();
              }
            });
    }
 //   console.log("postComment"+pid);
    
}

function removeComment(cid,pid){
    console.log("removeComment-"+cid);
    NProgress.start();
 //   console.log("NProgress Start");
 //   console.log("postComment");
    var Comment = Parse.Object.extend("PostComment");
    var query = new Parse.Query(Comment);
    query.equalTo("objectId", cid);
    query.first({
      success: function(object) {
         object.set("reported", 1);
         object.save(null,{
              success: function(comment) {
                updatePost(pid);  
                NProgress.done();
                notify("Comment removed","success", standardErrorDuration);     
              },
              error: function(comment, error) {
                    notify('Failed to remove Comment!' + error.message, "error", standardErrorDuration);
                    NProgress.done();
              }
         });
      },
      error: function(error) {
         notify('Failed to remove Comment!' + error.message, "error", standardErrorDuration);
         NProgress.done();
      }
    });
}

function getFileName(){
	var d=new Date();
	return currentNeta.id+d.getTime();
}

function showMyImage(fileInput) {
//		console.log("Display Thumbnail");
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

function showMyCommentImage(fileInput) {
         console.log("Display Comment Thumbnail");
        var id=event.target.id.toString().split('-')[1];
        $('#thumbnil-'+id).fadeIn();
        var files = fileInput.files;
        for (var i = 0; i < files.length; i++) {           
            var file = files[i];
            var imageType = /image.*/;     
            if (!file.type.match(imageType)) {
                continue;
            }           
            var img=document.getElementById("thumbnil-"+id);            
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
    

function updatePost(pid){
//    console.log("updatePost");
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
                var DisplayUpload;
                object= results1[0];
                d=new Date(object.createdAt);
                ago=timeSince(d);
                content=object.get("content");
                reach=object.get("reach");
                likes=object.get("numUpvotes");
                comments=object.get("numComments");
                ListItem2 = Parse.Object.extend("PostComment");
                query2 = new Parse.Query(ListItem2);
                var pointer1 = new Parse.Object("Post");
                pointer1.id = pid;
                query2.equalTo("post", pointer1);
                query2.include("post");
                query2.include("user");
                query2.include("pUser");
                query2.notEqualTo("reported",1);
                query2.ascending("createdAt");
                query2.find({
                    success: function(results2) {
                    //    console.log("lookout!");
                        var chaincomments ="";
                        object=results2[0];
                        objectId=object.id;
                        for(var j=0;j<results2.length;j++){
                        //    console.log(results2[j]);
                            var time;
                            var photo;
                            var comm;
                            var name=results2[j].get("pUser").get("username");
                            time=timeSince(new Date(results2[j].createdAt));
                            if(results2[j].get("pUser").get("pic")==undefined){
                                photo=getDefaultIcon(results2[j].get("user").get("type"));
                            }
                            else{
                                photo=results2[j].get("pUser").get("pic").url();
                            } 
                            comm=results2[j].get("content");
                            var commentId = results2[j].id;
                            if(results2[j].get("file")==undefined){
                                chaincomments+="<div class='row comment' id='comment-"+commentId+"'><div class='small-2 columns text-right s-ws-top'><img src="+photo+" class='circle-img gs hv img-h'><h6 class='tertiary secondary-color'>"+name+"</h6></div><div class='small-10 columns s-ws-top'><div class='secondary text-right'><i id='close-"+commentId+"-"+objectId+"'class='reportbtn icon-close hv cs tertiary-color'></i></div><p class='secondary nm xs-ws-top'>"+comm+"</p><div class='tertiary secondary-color'><i class='icon-clock tertiary'></i> "+time+" </div></div></div>";
                            }
                            else{
                                var comimage= '<img style="width:100%; margin-top:10px; border:none;"  src="'+results2[j].get("file").url()+'"/>';
                                chaincomments+="<div class='row comment' id='comment-"+commentId+"'><div class='small-2 columns text-right s-ws-top'><img src="+photo+" class='circle-img gs hv img-h'><h6 class='tertiary secondary-color'>"+name+"</h6></div><div class='small-10 columns s-ws-top'><div class='secondary text-right'><i id='close-"+commentId+"-"+objectId+"'class='reportbtn icon-close hv cs tertiary-color'></i></div>"+comimage+"<p class='secondary nm xs-ws-top'>"+comm+"</p><div class='tertiary secondary-color'><i class='icon-clock tertiary'></i> "+time+" </div></div></div>";
                            }
                            
                            $("#close-"+commentId+"-"+objectId).click(function(event){
                                event.preventDefault();
                                removeComment(event.target.id.toString().split('-')[1],event.target.id.toString().split('-')[2]);
                            });
                            //chaincomments+="<div class='row'><div class='small-2 columns text-right s-ws-top'><img src="+photo+" class='circle-img gs hv img-h'><h6 class='tertiary secondary-color'>"+name+"</h6></div><div class='small-10 columns s-ws-top'><div class='text-right secondary'><i class='icon-close hv cs tertiary-color'></i> </div><p class='secondary nm xs-ws-top'>"+comm+"</p><div class='tertiary secondary-color'><i class='icon-clock tertiary'></i> "+time+"</div></div></div>";
                        }
                        var thisview=$('#post-'+pid);
                        thisview.html("");  
                        if(currentPUser.get("pic")!=undefined){
                            var imige=currentPUser.get("pic").url();
                        }
                        else{
                            var imige=getDefaultIcon(currentUser.get("type"));
                        }
                        if(uploadlink==undefined){
                                    DisplayUpload=" ";
                                }
                                else{
                                    DisplayUpload="<img src='"+uploadlink.url()+"'/>";
                                }
                        var imagepreview='<img id="thumbnil-'+object.id+'" style="width:100%; margin-top:10px; border:none; display:none;"  src=""/>';
                        var fileu='<div class="small-1 columns tertiary secondary-color"><label for="fileUpload-'+object.id+'" id="imgStatus-'+object.id+'" class="icon-image-add f-2x bc" style="line-height:1;"><input id="fileUpload-'+object.id+'" type="file" name="media" multiple="1" accept="image/*" style="display:none; position:fixed; top:-9999px;"></label></div>'
                        //thisview.html("<div class='row'><div class='small-3 small-offset-6 columns text-right secondary-color s-ws-bottom'><span class='tertiary'>Reach: </span><span class='bc'>"+reach+"</span></div><div class='small-3 columns secondary-color tertiary text-right s-ws-bottom'><i class='icon-clock tertiary'></i> "+ago+"</div></div><div class='row'><div class='small-12 columns'><p class='secondary-color'>"+content+"</p></div><div class='bg2 br-fx1-top np2'><div id='expand' name='"+object.id+"' class='row expnd secondary cs'><div class='small-3 s-ws-bottom columns secondary-color secondary'>Likes "+likes+"</div><div class='small-3 s-ws-bottom columns end secondary-color secondary'>Comments "+comments+"</div><div class='small-3 columns secondary secondary-color'><i class='icon-plus dbc'></i> New Campaign</div></div><div id='comments-"+object.id+"' style='display:none;'>"+chaincomments+"<div class='row'><div class='small-2 columns text-right m-ws-top'><img src="+imige+" class='circle-img gs hv img-h'></div><div class='small-10 columns s-ws-top'><form id='form-"+object.id+"'><textarea id='text-"+object.id+"' class='secondary fx' rows='3' required></textarea><input type='submit'  value='comment' placeholder='add a comment' class='tiny button'></form></div></div></div></div></div>");
                        
                        thisview.html("<div class='panel nm br-fx-bottom'><div class='row'><div class='small-3 small-offset-6 columns text-right secondary-color s-ws-bottom'><span class='tertiary'>Reach: </span><span class='secondary-color tertiary'>coming soon</span></div><div class='small-3 columns secondary-color tertiary text-right s-ws-bottom'><i class='icon-clock tertiary'></i> "+ago+" ago</div></div><div class='row'><div class='small-12 columns s-ws-bottom'>"+DisplayUpload+"</div><div class='small-12 columns'><p class=''>"+content+"</p></div></div></div><div class='bg2 br-fx1-top np2'><div id='expand' name='"+object.id+"' class='row expnd secondary'><div class='small-3 s-ws-bottom columns secondary-color secondary'>Likes "+likes+"</div><div class='small-3 s-ws-bottom columns end secondary-color secondary cs' id='commentsclick-"+object.id+"'>Comments "+comments+"</div></div><div id='comments-"+object.id+"'>"+chaincomments+"<div class='row'><div class='small-2 columns text-right m-ws-top'><img src="+imige+" class='circle-img gs hv img-h'></div><div class='small-10 columns s-ws-top'><form id='form-"+object.id+"'><textarea class='secondary fx' rows='3' id='text-"+object.id+"' required></textarea><input id='commentBtn-"+object.id+"' type='submit' value='comment' placeholder='add a comment' class='tiny button'>"+fileu+"</form></div>"+imagepreview+"</div></div></div>");
                        $('#fileUpload-'+object.id).bind("change", function(e) {
                            showMyCommentImage(this);
                            $('#imgStatus-'+object.id).removeClass('icon-image-add bc').addClass('icon-image-accept gc');
                            var files = e.target.files || e.dataTransfer.files;
                            // Our file var now holds the selected file
                            file = files[0];
                        });
                        var url = window.location.href;    
                        if (url.indexOf('#') == -1){
                           url += '#'+pid
                        }else{
                            console.log(url);
                           url = url.split('#')[0]+'#'+pid;
                           console.log(url);
                        }
                        window.location.href = url;

                        $('#form-'+object.id).submit(function(event){
                              event.preventDefault();
                              postComment(event.target.id.toString().split('-')[1]);
                        });
                        NProgress.done();
                    //    console.log('comment row');
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
//    console.log("calculateNetaStats");
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
            notify(error.message, "error",standardErrorDuration);
            NProgress.done();
      }
    });

}

function calculateCurrentNetaStats(){
//        console.log("calculateCurrentNetaStats");
        actions=currentNeta.get("numIsClaimed")+currentNeta.get("numIsClosed");
        interactions=currentNeta.get("numPosts")+currentNeta.get("numComments")+currentNeta.get("numQsAnswered");
        followers=currentNeta.get("numLikes");
        
        document.getElementById('f').innerHTML=followers.toString();
        document.getElementById('i').innerHTML=interactions.toString();
        document.getElementById('a').innerHTML=actions.toString();
}

function fetchConstituencyData(c){
  //      console.log("fetchConstituencyData");
        $("#competitorlist").innerHTML="";
        ListItem = Parse.Object.extend("Election");
        query = new Parse.Query(ListItem);
        var pointer = new Parse.Object("Neta");
        pointer.id = currentNeta.id;
        query.equalTo("arrayNetas", pointer);
        query.include("arrayNetas");
        query.include("constituency");
        query.descending('createdAt');
        //console.log("I am here!");
        query.find({
          success: function(results) {
                if(results[0]!=undefined){
                    //console.log("I am here! 78");
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
                //console.log("Error: "+error.message);
                notify(error.message, "error",standardErrorDuration);
                NProgress.done();
            } 
          });
}

function createCampaign(id,selectedNetaLists,selectedMediums){
	var ip=false,iw=false,it=false,is=false,ie=false,ib=false;
	var post=id;
	for(var i=0;i<selectedMediums.length;i++){
		if(selectedMediums[i]==1){
			ip=true;
		}
		else if(selectedMediums[i]==2){
			is=true;
		}
		else if(selectedMediums[i]==3){
			iw=true;
		}
		else if(selectedMediums[i]==4){
			ie=true;
		}
		else if(selectedMediums[i]==5){
			ib=true;
		}
		else if(selectedMediums[i]==6){
			it=true;
		}
	}
	nl=[];
	for(var i=0;i<selectedNetaLists.length;i++){
		nl.push(selectedNetaLists[i]);
	}
	Parse.Cloud.run("createCampaign", {objectId: currentNeta.id, isPush: ip,isSMS: is, isWhatsApp: iw, isTwitter: it, isEmail: ie, isFacebook: ib, p: post, netalists: nl}, {
	  success:function(results){

	//	console.log(results);

		populateStatus();
		notify(standardSuccessMessage, "success",standardSuccessDuration);
	  },
	  error:function(error){
		console.log("Error: "+error.message);notify(standardErrorMessage, "error",standardErrorDuration);
		NProgress.done();
	  }
	}); 
	
}

function postCampaign(id){
	var selectedNetaLists = [];
	var selectedMediums = [];
	$.each($("input[name='voter-"+id+"']:checked"), function(){            
		selectedNetaLists.push($(this).val());
	});
	$.each($("input[name='medium-"+id+"']:checked"), function(){            
		selectedMediums.push($(this).val());
	});
	//alert("This post will be campaigned via: " + selectedMediums.join(", ") +" with- "+ selectedNetaLists.join(", "));
	createCampaign(id,selectedNetaLists,selectedMediums); 
}

function postCampaignFromPost(id){
	var selectedNetaLists = [];
	var selectedMediums = [];
	$.each($("input[name='voter']:checked"), function(){            
		selectedNetaLists.push($(this).val());
	});
	$.each($("input[name='medium']:checked"), function(){            
		selectedMediums.push($(this).val());
	});
	//alert("This post will be campaigned via: " + selectedMediums.join(", ") +" with- "+ selectedNetaLists.join(", "));
	createCampaign(id,selectedNetaLists,selectedMediums);
}

function populateStatus(){
    var postView=$('#posts');
//    console.log("populateStatus");
    postView.html("");    
    ListItem = Parse.Object.extend("Post");
    query = new Parse.Query(ListItem);
    var pointer = new Parse.Object("Neta");
    pointer.id = currentNeta.id;
    query.equalTo("neta", pointer);
    //console.log("I am here104!");
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
                    query2.notEqualTo("reported",1);
                    query2.include("post");
                    query2.include("pUser");
                    query2.ascending("createdAt");
                    query2.find({
                        success: function(results2) {
                            console.log("Number of comments:"+results2.length);
                            for(var i=0;i<results.length;i++){
                                var object=results[i];
                                var objectId=object.id;
                                var chaincomments ="";
                                for(var j=0;j<results2.length;j++){
                                    if(results2[j].get("post").id==object.id && results2[j].get("reported") !==1){
                                        var time;
                                        var photo;
                                        var comm;
                                        var name;
                                        //console.log("I am here!142");
                                        name=results2[j].get("pUser").get("username");
                                        time=timeSince(new Date(results2[j].createdAt));
                                        if(results2[j].get("pUser").get("pic")==undefined){
                                            photo=getDefaultIcon(results2[j].get("pUser").get("type"));
                                        }
                                        else{
                                            photo=results2[j].get("pUser").get("pic").url();
                                        } 
                                        comm=results2[j].get("content");
                                        //console.log(commentId);
                                        var commentId = results2[j].id;
                                        //console.log(commentId);
                                        if(results2[j].get("file")==undefined){
                                            chaincomments+="<div class='row comment' id='comment-"+commentId+"'><div class='small-2 columns text-right s-ws-top'><img src="+photo+" class='circle-img gs hv img-h'><h6 class='tertiary secondary-color'>"+name+"</h6></div><div class='small-10 columns s-ws-top'><div class='secondary text-right'><i id='close-"+commentId+"-"+objectId+"'class='reportbtn icon-close hv cs tertiary-color'></i></div><p class='secondary nm xs-ws-top'>"+comm+"</p><div class='tertiary secondary-color'><i class='icon-clock tertiary'></i> "+time+" </div></div></div>";
                                        }
                                        else{
                                            var comimage= '<img style="width:100%; margin-top:10px; border:none;"  src="'+results2[j].get("file").url()+'"/>';
                                            chaincomments+="<div class='row comment' id='comment-"+commentId+"'><div class='small-2 columns text-right s-ws-top'><img src="+photo+" class='circle-img gs hv img-h'><h6 class='tertiary secondary-color'>"+name+"</h6></div><div class='small-10 columns s-ws-top'><div class='secondary text-right'><i id='close-"+commentId+"-"+objectId+"'class='reportbtn icon-close hv cs tertiary-color'></i></div>"+comimage+"<p class='secondary nm xs-ws-top'>"+comm+"</p><div class='tertiary secondary-color'><i class='icon-clock tertiary'></i> "+time+" </div></div></div>";
                                        }
                                        //chaincomments+="<div class='row comment' id='comment-"+commentId+"'><div class='small-2 columns text-right s-ws-top'><img src="+photo+" class='circle-img gs hv img-h'><h6 class='tertiary secondary-color'>"+name+"</h6></div><div class='small-10 columns s-ws-top'><div class='secondary text-right'><i id='close-"+commentId+"-"+objectId+"'class='reportbtn icon-close hv cs tertiary-color'></i></div><p class='secondary nm xs-ws-top'>"+comm+"</p><div class='tertiary secondary-color'><i class='icon-clock tertiary'></i> "+time+" </div></div></div>";
                                        $("#close-"+commentId+"-"+objectId).click(function(event){
                                            event.preventDefault();
                                            removeComment(event.target.id.toString().split('-')[1],event.target.id.toString().split('-')[2]);
                                        });
                                    }
                                    // Get the element, add a click listener...
                                    // Get the element, add a click listener...
                                    //console.log(object.id);
                                    

                                }
                                
                                var d;
                                var ago;
                                var content;
                                var reach;
                                var likes;
                                var comments;
                                //console.log("I am here!120");
                                d=new Date(object.createdAt);
                                ago=timeSince(d);
                                content=object.get("content");
                                reach=object.get("reach");
                                likes=object.get("numUpvotes");
                                comments=object.get("numComments");
								uploadlink=object.get("file");
								if(uploadlink==undefined){
									DisplayUpload=" ";
								}
								else{
									DisplayUpload="<img src='"+uploadlink.url()+"'/>";
								}
								
								/*
								Define Stuff to Display the Upload Link here.
								*/
								
                                if(currentPUser.get("pic")!=undefined){
                                var imige=currentPUser.get("pic").url();
                                }
                                else{
                                    var imige=getDefaultIcon(currentUser.get("type"));
                                }
                                var voterView="";
								var flag=0;
								for(var ik=0;ik<voterViewArray.length;ik++){
									if(flag==0){
										flag=1;
										voterView=voterView+"<label><input type='checkbox' checked=true value='"+voterViewArray[ik][0]+"' name='voter-"+object.id+"'>"+voterViewArray[ik][1]+"</label>";
									}
									else{
										voterView=voterView+"<label><input type='checkbox' value='"+voterViewArray[ik][0]+"' name='voter-"+object.id+"'>"+voterViewArray[ik][1]+"</label>";
									}
								}

                                //var cpgView='<form id="campaignform-'+object.id+'" style="display:none;"><div id="cmpg-form" class="s-ws-top"><div class="row collapse"><div class="small-2 columns text-center fx3"><label for="capp" class="inline secondary-color np tertiary"><div class="f-1-5x fx4"><i class="icon-phone blc"></i> </div> <input type="checkbox" name="medium-'+object.id+'" id="capp" value="1" checked=""> Push Send </label> </div> <div class="small-2 columns text-center fx3"> <label for="csms" class="inline secondary-color np tertiary"> <div class="f-1-5x fx4"> <i class="icon-comment blc"></i> </div> <input type="checkbox" id="csms" name="medium-'+object.id+'" value="2"> SMS </label> </div> <div class="small-2 columns text-center fx3"> <label for="cwhatsapp" class="inline secondary-color np tertiary"> <div class="f-1-5x fx4"> <i class="icon-whatsapp blc"></i> </div> <input type="checkbox" id="cwhatsapp" name="medium-'+object.id+'" value="3"> WhatsApp </label> </div> <div class="small-2 columns text-center fx3"> <label for="cemail" class="inline secondary-color np tertiary"> <div class="f-1-5x fx4"> <i class="icon-mail blc"></i> </div> <input type="checkbox" id="cemail" name="medium-'+object.id+'" value="4"> Email </label> </div> <div class="small-2 columns text-center fx3"> <label for="cfb" class="inline secondary-color np tertiary"> <div class="f-1-5x fx4"> <i class="icon-facebook blc"></i> </div> <input type="checkbox" id="cfb" name="medium-'+object.id+'" value="5"> Facebook </label> </div> <div class="small-2 columns text-center fx3"> <label for="ctwt" class="inline secondary-color np tertiary"> <div class="f-1-5x fx4"> <i class="icon-twitter blc"></i> </div> <input type="checkbox" id="ctwt" name="medium-'+object.id+'" value="6"> Twitter</label> </div> </div> <div class="row"></div><div class="small-12 columns s-ws-bottom">'+voterView+' <div class="small-4 columns"> <input id="post" type="submit" id value="Send Update" class="button tiny nm fullwidth"></div></div></div></form>';
								//postView.append("<div id='post-"+object.id+"'><div class='panel nm br-fx-bottom'><div class='row'><div class='small-3 small-offset-6 columns text-right secondary-color s-ws-bottom'><span class='tertiary'>Reach: </span><span class='bc'>"+reach+"</span></div><div class='small-3 columns secondary-color tertiary text-right s-ws-bottom'><i class='icon-clock tertiary'></i> "+ago+"</div></div><div class='row'><div class='small-12 columns s-ws-bottom'>"+DisplayUpload+"</div><div class='small-12 columns'><p class='secondary-color'>"+content+"</p></div></div></div><div class='bg2 br-fx1-top np2'><div id='expand' name='"+object.id+"' class='row expnd secondary cs'>"+cpgView+"<div class='small-3 s-ws-bottom columns secondary-color secondary'>Likes "+likes+"</div><div class='small-3 s-ws-bottom columns end secondary-color secondary' id='commentsclick-"+object.id+"'>Comments "+comments+"</div><div class='small-3 columns secondary secondary-color cs' id='campaignclick-"+object.id+"'><i class='icon-plus dbc'></i> Send Campaign</div></div><div id='comments-"+object.id+"' style='display:none;'>"+chaincomments+"<div class='row'><div class='small-2 columns text-right m-ws-top'><img src="+imige+" class='circle-img gs hv img-h'></div><div class='small-10 columns s-ws-top'><form id='form-"+object.id+"'><textarea class='secondary fx' rows='3' id='text-"+object.id+"' required></textarea><input type='submit' value='comment' placeholder='add a comment' class='tiny button'></form></div></div></div></div></div>");
                                
                                var imagepreview='<img id="thumbnil-'+object.id+'" style="width:100%; margin-top:10px; border:none; display:none;"  src=""/>';
                                var fileu='<div class="small-1 columns tertiary secondary-color"><label for="fileUpload-'+object.id+'" id="imgStatus-'+object.id+'" class="icon-image-add f-2x bc" style="line-height:1;"><input id="fileUpload-'+object.id+'" type="file" name="media" multiple="1" accept="image/*" style="display:none; position:fixed; top:-9999px;"></label></div>'
                                //thisview.html("<div class='row'><div class='small-3 small-offset-6 columns text-right secondary-color s-ws-bottom'><span class='tertiary'>Reach: </span><span class='bc'>"+reach+"</span></div><div class='small-3 columns secondary-color tertiary text-right s-ws-bottom'><i class='icon-clock tertiary'></i> "+ago+"</div></div><div class='row'><div class='small-12 columns'><p class='secondary-color'>"+content+"</p></div><div class='bg2 br-fx1-top np2'><div id='expand' name='"+object.id+"' class='row expnd secondary cs'><div class='small-3 s-ws-bottom columns secondary-color secondary'>Likes "+likes+"</div><div class='small-3 s-ws-bottom columns end secondary-color secondary'>Comments "+comments+"</div><div class='small-3 columns secondary secondary-color'><i class='icon-plus dbc'></i> New Campaign</div></div><div id='comments-"+object.id+"' style='display:none;'>"+chaincomments+"<div class='row'><div class='small-2 columns text-right m-ws-top'><img src="+imige+" class='circle-img gs hv img-h'></div><div class='small-10 columns s-ws-top'><form id='form-"+object.id+"'><textarea id='text-"+object.id+"' class='secondary fx' rows='3' required></textarea><input type='submit'  value='comment' placeholder='add a comment' class='tiny button'></form></div></div></div></div></div>");
                                
                                postView.append("<div id='post-"+object.id+"'><div class='panel nm br-fx-bottom'><div class='row'><div class='small-3 small-offset-6 columns text-right secondary-color s-ws-bottom'><span class='tertiary'>Reach: </span><span class='secondary-color tertiary'>coming soon</span></div><div class='small-3 columns secondary-color tertiary text-right s-ws-bottom'><i class='icon-clock tertiary'></i> "+ago+" ago</div></div><div class='row'><div class='small-12 columns s-ws-bottom'>"+DisplayUpload+"</div><div class='small-12 columns'><p class=''>"+content+"</p></div></div></div><div class='bg2 br-fx1-top np2'><div id='expand' name='"+object.id+"' class='row expnd secondary'><div class='small-3 s-ws-bottom columns secondary-color secondary'>Likes "+likes+"</div><div class='small-3 s-ws-bottom columns end secondary-color secondary cs' id='commentsclick-"+object.id+"'>Comments "+comments+"</div></div><div id='comments-"+object.id+"'>"+chaincomments+"<div class='row'><div class='small-2 columns text-right m-ws-top'><img src="+imige+" class='circle-img gs hv img-h'></div><div class='small-10 columns s-ws-top'><form id='form-"+object.id+"'><textarea class='secondary fx' rows='3' id='text-"+object.id+"' required></textarea><input id='commentBtn-"+object.id+"' type='submit' value='comment' placeholder='add a comment' class='tiny button'>"+fileu+"</form></div>"+imagepreview+"</div></div></div>");
                                $('#fileUpload-'+object.id).bind("change", function(e) {
                                    showMyCommentImage(this);
                                    $('#imgStatus-'+object.id).removeClass('icon-image-add bc').addClass('icon-image-accept gc');
                                    var files = e.target.files || e.dataTransfer.files;
                                    // Our file var now holds the selected file
                                    file = files[0];
                                });
                                //<div class='panel nm br-fx-bottom'><div class='row'><div class='small-3 small-offset-6 columns text-right secondary-color s-ws-bottom'><span class='tertiary'>Reach: </span><span class='secondary-color tertiary'>coming soon</span></div><div class='small-3 columns secondary-color tertiary text-right s-ws-bottom'><a name="+object.id+" class='secondary-color hv'><i class='icon-clock tertiary'></i> "+ago+" ago</a></div></div><div class='row'><div class='small-12 columns s-ws-bottom'>"+DisplayUpload+"</div><div class='small-12 columns'><p class=''>"+content+"</p></div></div></div><div class='bg2 br-fx1-top np2'><div id='expand' name='"+object.id+"' class='row expnd secondary'><div class='small-3 s-ws-bottom columns secondary-color secondary'>Likes "+likes+"</div><div class='small-3 s-ws-bottom columns end secondary-color secondary cs' id='commentsclick-"+object.id+"'>Comments "+comments+"</div></div><div id='comments-"+object.id+"' style='display:none;'>"+chaincomments+"<div class='row'><div class='small-2 columns text-right m-ws-top'><img src="+imige+" class='circle-img gs hv img-h'></div><div class='small-10 columns s-ws-top'><form id='form-"+object.id+"'><textarea class='secondary fx' rows='3' id='text-"+object.id+"' required></textarea><input id='commentBtn-"+object.id+"' type='submit' value='comment' placeholder='add a comment' class='tiny button'></form></div></div></div></div></div>");
                                //console.log("form listener created for "+object.id);
                                $('#form-'+object.id).submit(function(event){
                                      event.preventDefault();
                                      postComment(event.target.id.toString().split('-')[1]);
                                });
								$('#campaignform-'+object.id).submit(function(event){
                                      event.preventDefault();
                                      postCampaign(event.target.id.toString().split('-')[1]);
                                });
								$('#commentsclick-'+object.id).click(function(){
									$('#comments-'+event.target.id.toString().split('-')[1]).slideDown();
								});
                                // $('#close-'+object.id).click(function(){
                                //     //console.log(object.id);

                                //     //console.log($('#post-'+object.id).html());
                                //     var tempObject1 = event.target.id.toString().split('-')[1];
                                //     Parse.Cloud.run("report", {objId: tempObject1, oClass: "Post", rStatus: "1"}, {
                                //       success: function(comment) {
                                //         //$('#comment-'+event.target.id.toString().split('-')[1]).slideUp();
                                //         console.log('comment clicked');
                                //       },
                                //       error: function(error) {
                                //         console.log("Error: "+error.message);
                                //         //notify(standardErrorMessage, "error",standardErrorDuration);
                                //       }
                                //     });

                                //     //notready();


                                //  });
								$('#campaignclick-'+object.id).click(function(){
									//$('#campaignform-'+event.target.id.toString().split('-')[1]).fadeIn();
                                    notready();
								});

                            }

                        },
                        error: function(error2){
                            console.log("Error2:"+error2.message);
                            NProgress.done();
                        }
                    });
                    
                    
                }
                $('#posts').click(function(e) {
                    if ( $(e.target).is('.reportbtn') ) {
                        //console.log(e.target.id);
                        $(e.target).removeClass('icon-close hv').addClass('icon-process');
                        var currentObj = e.target.id.split('-');
                        console.log(currentObj[1]);

                        Parse.Cloud.run("report", {objId: currentObj[1], oClass: "PostComment", pClass: "Post", rStatus: 1}, {
                          success: function(results) {
                            //console.log('testing'+results.id);
                            //$('#comment-'+event.target.id.toString().split('-')[1]).slideUp();
                            notify('Post reported successfully','success',standardErrorDuration);
                            //console.log(currentObj[1]);
                            console.log(results)

                            $('#comment-'+currentObj[1]).slideUp();
                          },
                          error: function(error) {
                            console.log("Error: "+error.message);
                            notify(error.message, "error",standardErrorDuration);
                            $(e.target).addClass('icon-close hv').removeClass('icon-process');
                          }
                        });

                    }
                });
                fetchConstituencyData(currentNeta.get("constituency"));
                //console.log("NProgress Stop");
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
//                             postView.append("<div id='post-"+object.id+"' class='panel nm br-fx-bottom'><div class='row'><div class='small-3 small-offset-6 columns text-right secondary-color s-ws-bottom'><span class='tertiary'>Reach: </span><span class='bc'>"+reach+"</span></div><div class='small-3 columns secondary-color tertiary text-right s-ws-bottom'><i class='icon-clock tertiary'></i> "+ago+"</div></div><div class='row'><div class='small-12 columns'><p class='secondary-color'>"+content+"</p></div></div><div class='bg2 br-fx1-top np2'><div class='row expand' name='"+object.id+"' id='expand'><div class='small-3 s-ws-bottom columns secondary-color secondary'>Likes "+likes+"</div><div class='small-3 s-ws-bottom columns end secondary-color secondary'>Comments "+comments+"</div></div><div id='comments-"+object.id+"'>"+chaincomments+"</div><div class='row'><div class='small-2 columns text-right m-ws-top'><img src="+imige+" class='circle-img gs hv img-h'></div><div class='small-10 columns s-ws-top'><form id='form-"+object.id+"'><textarea class='secondary fx' rows='3' id='text-"+object.id+"' required></textarea><input type='submit' value='comment' placeholder='add a comment' class='tiny button'></form></div></div></div></div>");
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
    if(CU.get("type")!="neta" || CU.get("subtype")!="mla"){
        notify("You do not have the required permissions","error",standardErrorDuration);
        return;
    }
    else{
        if(file!=undefined){
        var parsefile=new Parse.File(file.name,file);
        parsefile.save().then(function(){
        //  console.log('postStatus');
            NProgress.start();
        //  console.log("NProgress Start");
        //  console.log("postStatus");
            loadingButton_id("post",4);
            var Post = Parse.Object.extend("Post");
            var post = new Post();
            var u = new Parse.Object("Neta");
            u.id = currentNeta.id;
            post.set("file",parsefile);
            post.set("content", c);
            post.set("reach", 0);
            post.set("numUpvotes", 0);
            post.set("numComments", 0);
            post.set("neta",u);
            post.save(null, {
              success: function(result) {
                postCampaignFromPost(result.id);
                document.getElementById("postArea").value="";
                file=undefined;
                thumbnil.src="";
              },
              error: function(comment, error) {
                document.getElementById("postArea").value="";
                file=undefined;
                thumbnil.src="";
                alert('Failed to Post! ' + error.message);
                NProgress.done();
              }
            });
        });
    }
    else{
    //  console.log('postStatus');
        NProgress.start();
    //  console.log("NProgress Start");
    //  console.log("postStatus");
        loadingButton_id("post",4);
        var Post = Parse.Object.extend("Post");
        var post = new Post();
        var u = new Parse.Object("Neta");
        u.id = currentNeta.id;
        //post.set("file",data);
        post.set("content", c);
        post.set("reach", 0);
        post.set("numUpvotes", 0);
        post.set("numComments", 0);
        post.set("neta",u);
        post.save(null, {
          success: function(result) {
            postCampaignFromPost(result.id);
            document.getElementById("postArea").value="";
          },
          error: function(comment, error) {
            alert('Failed to Post! ' + error.message);
            NProgress.done();
          }
        });
    }
    }
	
}

function fetchECStatus(u){
  //  console.log("fetchECStatus");    
    ListItem = Parse.Object.extend("Election");
    query = new Parse.Query(ListItem);
    if(u.get("type")=="neta"){
        currentNeta=u.get("neta");
		
		var pointer = new Parse.Object("Neta");
		pointer.id = currentNeta.id;
		query.equalTo("arrayNetas", pointer);
		query.include("arrayNetas");
		query.include("constituency");
		query.descending('createdAt');
		EC={e:"",c:""};
		query.find({
			  success: function(results) {
			//		console.log("Size:"+results.length);
					if(results.length==0){
						EC.e="-";
						EC.c="-";
					}
					else{
						//Check if newer elections in this constituency have happened
                        if(results[0].get("showStatus")==true){
    						if(results[0].get("winner")==undefined){
    							EC.e=results[0].get("name")+" "+results[0].get("year").toString()+" (Candidate)";
    						}
    						else{
    							if(results[0].get("winner").id==currentNeta.id){
    								EC.e=results[0].get("name")+" "+results[0].get("year").toString()+" (Winner)";
    							}
    							else{
    								EC.e=results[0].get("name")+" "+results[0].get("year").toString()+" (Contested)";
    							}
    						}
                        }
                        else{
                            EC.e=results[0].get("name")+" "+results[0].get("year").toString()
                        }
						EC.c=results[0].get("constituency").get("name")+"<small> "+results[0].get("constituency").get("state")+"</small>";
					}
					if(u.get("type")=="neta"){
						setCurrentNeta(u);
					}
					else if(u.get("type")=="teamMember"){
						setCurrentNetaTM(currentNeta,u);
					}
			//		console.log("NProgress Stop");
			  },
			  error: function(error) {
				//	console.log("Error:"+error.message);
					NProgress.done();
			  }
		});
    }
    else{
        currentTeamMember=u.get("teamMember");
		currentTeamMember.fetch({
			success:function(results){
				currentNeta=currentTeamMember.get("neta");
				var pointer = new Parse.Object("Neta");
				pointer.id = currentNeta.id;
				query.equalTo("arrayNetas", pointer);
				query.include("arrayNetas");
				query.include("constituency");
				query.descending('createdAt');
				EC={e:"",c:""};
				query.find({
					  success: function(results) {
						//	console.log("Size:"+results.length);
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
										EC.e=results[0].get("name")+" "+results[0].get("year").toString()+" (Contested)";
									}
								}
								EC.c=results[0].get("constituency").get("name")+"<small> "+results[0].get("constituency").get("state")+"</small>";
							}
							if(u.get("type")=="neta"){
								setCurrentNeta(u);
							}
							else if(u.get("type")=="teamMember"){
								setCurrentNetaTM(currentNeta,u);
							}
						//	console.log("NProgress Stop");
					  },
					  error: function(error) {
							console.log("Error:"+error.message);
							NProgress.done();
					  }
				});
			},
			error:function(errors){
				console.log("Error: "+errors.message);
			}
		});
		
    }
    
}

function updateReach(){
    var Subscribers = Parse.Object.extend("Subscriber");
    var query2 = new Parse.Query(Subscribers);
    query2.equalTo("neta",currentNeta);
    query2.count({
      success: function(count2) {
     //   console.log(count2);
		var Election = Parse.Object.extend("Election");
		election = new Parse.Query(Election);
		election.descending('createdAt');
		var pointer = new Parse.Object("Neta");
		pointer.id = currentNeta.id;
		election.equalTo("arrayNetas", pointer);
		election.include("constituency");
		election.find({
			success: function(results) {
				var constituency=results[0].get("constituency");
				var Citizens= Parse.Object.extend("Citizen");
				var query1 = new Parse.Query(Citizens);
				query1.equalTo("constituency",constituency);
				query1.count({
				  success: function(count1) {
				//	console.log("population:"+count1);
					document.getElementById("population").innerHTML=count1+4487+count2;
				  },
				  error: function(error) {
					console.log("Error: "+error.message);notify(standardErrorMessage, "error",standardErrorDuration);
							NProgress.done();
				  }
				});
			},
			error:function(error){
				console.log("Error: "+error.message);notify(standardErrorMessage, "error",standardErrorDuration);
							NProgress.done();
			}
		});
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
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
 //   console.log('QueryUserTable');
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
function setCurrentNetaTM(n,u){
 //   console.log("setCurrentNeta");
    n.fetch({
     success: function(result){
            currentUser=u;
            currentNetaPUser=n.get("pUser");
            currentPUser=u.get("pUser");
            currentNeta=n;
            currentPUser.fetch({
                success:function(results){
                    currentNetaPUser.fetch({
                        success:function(results){
                            if(currentNetaPUser.get("pic")!=undefined){
                                  var photo=currentNetaPUser.get("pic").url();
                            }
                            else{
                                  var photo="./assets/images/neta.png";
                            }
                            
                            var name=currentNetaPUser.get("name");
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
                                    createVoterArray();
                                    populateStatus();
                               },
                               error: function(error){
                                   //console.log("Error: "+error.message);
                                   notify(error.message, "error",standardErrorDuration);
                                    NProgress.done();
                               } 
                            });
                        },
                        error: function(error){
                           //console.log("Error: "+error.message);
                           notify(error.message, "error",standardErrorDuration);
                            NProgress.done();
                        } 
                    });  
                },
                error: function(error){

                }
            });
     },
     error: function(error){
         //console.log("Error: "+error.message);
         notify(error.message, "error",standardErrorDuration);
        NProgress.done();
     }   
    });
}

//given user
function setCurrentNeta(u){
 //   console.log("setCurrentNeta");
    currentUser=u;
    currentPUser=u.get("pUser");
    currentNetaPUser=currentUser.get("pUser");
    currentNetaPUser.fetch({
        success:function(results){
        //    console.log(results);
            currentNeta=currentUser.get("neta");
            currentNeta.fetch({
               success: function(results){
                 //   console.log("I was called Neta!");
                    if(currentNetaPUser.get("pic")!=undefined){
                          var photo=currentNetaPUser.get("pic").url();
                    }
                    else{
                          var photo="./assets/images/neta.png";
                    }
                    
                    var name=currentNetaPUser.get("name");
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
                            updateReach();
                            createVoterArray();
                       } ,
                       error: function(error){
                           //console.log("Error: "+error.message);
                           notify(error.message, "error",standardErrorDuration);
                            NProgress.done();
                       }
                    });
                    
               },
               error: function(error){
                   //console.log("Error: "+error.message);
                   notify(error.message, "error",standardErrorDuration);
                        NProgress.done();
               }
            });
        },
        error:function(){
            notify(error.message, "error",standardErrorDuration);
            NProgress.done();   
        }
    });
    
}

function initialize() {
//    console.log("initialize");
	voterViewArray=[];
    NProgress.start();
    if(CU.get("type")!="neta"){
        $("#netapost").hide();
    }
    queryUserTable();

	/*$('#fileUpload').on('change',function ()
        {
			showMyImage(this);
            filePath = $(this).val();
			filename=getFileName();
			uploadname.innerHTML=filePath;
            console.log(filePath);
        });*/
	// Set an event listener on the Choose File field.
    $('#fileUpload').bind("change", function(e) {
		showMyImage(this);
        $('#imgStatus').removeClass('icon-image-add bc').addClass('icon-image-accept gc');
		var files = e.target.files || e.dataTransfer.files;
		// Our file var now holds the selected file
		file = files[0];
    });

    $('#post-form').submit(function(event){
          event.preventDefault();
          var p=document.getElementById("postArea").value;
          if (CU.get("subtype")=="mla"){
            postStatus(p);  
          }
          else{
            notify("Your profile is not public yet","error",standardErrorDuration);
          }
          
    });
    $('#postArea').focus(function(){
        $(this).animate({'height': '120px'}).removeClass('nm');
        $('#sh-ltr1').delay(800).fadeIn();
    });
    $('#listIcon').click(function(){
        $('#cf1').fadeIn();
        $(this).addClass('bc')
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
