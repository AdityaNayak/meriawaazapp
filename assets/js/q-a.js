var currquestion;
var currentUser;
var currentNeta;
var folllist=[];

function followerQuestions(){
	var qView=$('#qView');
	console.log("followerQuestions");
	qView.html("");
	var question = currentUser.relation("questions");
	question.query().find({
	  success:function(results){
	  		folllist=[];
	  		for(var i=0;i<results.length;i++){
	  			folllist.push(results[i].id);
	  		}
    		populateQuestions(3);
    	},
    	error:function(error){
    		console.log(error.message);
    	}
    });
}

function populateQuestions(val){
	var qView=$('#qView');
	console.log("populateQuestions");
	qView.html("");
    var Questions=Parse.Object.extend("Question");
    var question= new Parse.Query(Questions);
     question.include("askedTo");
	 question.include("asker");
	 question.include("pAsker");
	 question.include("lastAnswer");
	 question.include(["lastAnswer.pUser"]);
	 question.include("constituency");
	 question.equalTo("constituency",constituency);
	 question.limit(1000);
	 question.ascending("createdAt");
	 if(val==0){
	 	
	 }
	 else if(val==1){
	 	question.equalTo("askedTo",currentNeta);
	 }
	 else if(val==2){
	 	question.equalTo("status","open");
	 }
	 else if(val==3){
	 	question.containedIn("objectId",folllist);
	 }
    question.find({
    	success:function(results){
    		var addition="";
    		for(var i=0;i<results.length;i++){
    			var object=results[i];

    			if(object.get("lastAnswer")!=undefined){
    				var lastReply=object.get("lastAnswer").get("content");
    				if(object.get("lastAnswer").get("pUser").get("pic")!=undefined){
	    				var lastReplyPhoto=object.get("lastAnswer").get("pUser").get("pic").url();
	    			}
	    			else{
	    				if(object.get("lastAnswer").get("pUser").get("name")!=undefined){
		    				var lastReplyPhoto=getDefaultIcon("neta");
		    			}
		    			else{
		    				var lastReplyPhoto=getDefaultIcon("citizen");
		    			}
	    			}
    			}
    			else{
    				lastReply="No Replies Yet.";
    				var lastReplyPhoto=getDefaultIcon("citizen");
    			}
    			
    			if(object.get("pAsker").get("pic")!=undefined){
    				var askedbyPhoto=object.get("pAsker").get("pic").url();
    			}
    			else{
    				var askedbyPhoto=getDefaultIcon(object.get("pAsker").get("type"));    				
    			}
 
			    var lastActivityTime=timeSince(new Date(object.get("lastUpdated")));
			    var views=object.get("reach");
			    var comments=object.get("numAnswers");
			    var followers=object.get("numFollowers");
			    var tdate=object.createdAt;
			    var p_timestamp=tdate.toString().split(" ");
			    var date=p_timestamp[0]+" "+p_timestamp[1]+" "+p_timestamp[2]+" "+p_timestamp[3];
			    var time=p_timestamp[4];
			    var place=object.get("constituency").get("name");
			    var questionstatement=object.get("content");
			    var questionId=object.id;
			    qView.append("<div class='row list-qa'><div class='small-9 columns' ><h4 id='question-"+questionId+"'>"+questionstatement+"</h4><div class='row'><div class='small-4 columns secondary secondary-color'><i class='icon-clock'></i> "+time+"</div><div class='small-4 columns secondary secondary-color'><i class='icon-calendar'></i> "+date+"</div><div class='small-4 columns secondary secondary-color'><i class='icon-location'></i> "+place+"</div></div><p class='secondary-color s-ws-top'>"+lastReply+"</p></div><div class='small-3 columns'><div class='row'><div class='small-6 columns text-center'><img src='"+askedbyPhoto+"' class='circle-img img-h'><h5 class='secondary secondary-color'>Asked by</h5></div><div class='small-6 columns text-center'><img src='"+ lastReplyPhoto+"' class='circle-img img-h'><h5 class='secondary secondary-color'>Last reply</h5></div></div><div class='row secondary'><div class='small-6 columns text-right secondary-color'>Last actvity:</div><div class='small-6 columns'>"+lastActivityTime+"</div></div><div class='row'><div class='small-6 columns text-right secondary-color'>Views:</div><div class='small-6 columns'>"+views+"</div></div><div class='row'><div class='small-6 columns text-right secondary-color'>Comments:</div><div class='small-6 columns'>"+comments+"</div></div><div class='row'><div class='small-6 columns text-right secondary-color'>Followers:</div><div class='small-6 columns'>"+followers+"</div></div></div></div><hr>");
				$('#question-'+questionId).off();
				$('#question-'+questionId).click(function(event){
					  event.preventDefault();
                      NProgress.start();
                      console.log(event.target.id.toString().split('-')[1]);
                      singleQuestion(event.target.id.toString().split('-')[1]);

                });	
                
			}
    		NProgress.done();
    	},
    	error:function(error){
    		console.log(error.message);
    	}
    });
    
}

function singleQuestion(questionId){
	singleView();
 	console.log("singleQuestion");
 	console.log(questionId);
 	var question=new Parse.Object("Question");
 	question.id=questionId;
 	question.fetch({
 		success:function(results){
 			$('#que-view').html("");
 			currquestion=question;
 			console.log(question);
		 	var title=question.get("title");
		 	var questionstatement=question.get("content");
		 	var asked=question.get("askedTo");
		 	console.log(asked);
			if(asked!=undefined){
				asked.fetch({
					success:function(results){
						var asker=question.get("pAsker");
						asker.fetch({
							success:function(results){
								if(asker.get("pic")!=undefined){
									var askerphoto=asker.get("pic");
								}
								else{
									var askerphoto=getDefaultIcon(asker.get("type"));
								}
								var askedto=asked.get("pUser");
								if(askedto.get("pic")!=undefined){
									var askedtophoto=askedto.get("pic").url();
								}
								else{
									var askedtophoto=getDefaultIcon(askedto.get("type"));
								}

								var opento=question.get("openTo");
								var tdate=question.createdAt;
								var p_timestamp=tdate.toString().split(" ");
								var date=p_timestamp[0]+" "+p_timestamp[1]+" "+p_timestamp[2]+" "+p_timestamp[3];
								var time=p_timestamp[4];
								var place=constituency.get("name");
								var views=question.get("reach");
								var followers=question.get("numFollowers");
								var lastactivity=timeSince(new Date(question.get("lastUpdated")));
								singleAnswers(question);
								console.log(opento);

								if(opento=="neta"){
									$("#opentoarea").html("");
									$("#opentoarea").append("<img src='"+askedtophoto+"' class='circle-img'>");
								}
								else{
									populateOpenTo(constituency);
								}
								$('#que-view').append("<h3>"+title+"</h3><hr><p>"+questionstatement+"</p>");
								document.getElementById("askedtophoto").innerHTML="<img src='"+askedtophoto+"' class='circle-img'>";

								document.getElementById("askedbyphoto").innerHTML="<img src='"+askerphoto+"' class='circle-img'>";
								document.getElementById("singplace").innerHTML=place;
								document.getElementById("singtime").innerHTML=time;
								document.getElementById("singdate").innerHTML=date;
								document.getElementById("singlast").innerHTML=lastactivity;
								document.getElementById("singfollowers").innerHTML=followers;
								document.getElementById("singviews").innerHTML=views;
							},
							error:function(error){
								console.log("Error: "+error.message);notify(standardErrorMessage, "error",standardErrorDuration);
							}
						});
						
					},
					error:function(error){
						console.log("Error: "+error.message);notify(standardErrorMessage, "error",standardErrorDuration);
					}
				});
			}
			else{
				var asker=question.get("pAsker");
				asker.fetch({
					success:function(results){
						if(asker.get("pic")!=undefined){
							var askerphoto=asker.get("pic");
						}
						else{
							var askerphoto=getDefaultIcon(asker.get("type"));
						}
						var opento=question.get("openTo");
						var tdate=question.createdAt;
						var p_timestamp=tdate.toString().split(" ");
						var date=p_timestamp[0]+" "+p_timestamp[1]+" "+p_timestamp[2]+" "+p_timestamp[3];
						var time=p_timestamp[4];
						var place=constituency.get("name");
						var views=question.get("reach");
						var followers=question.get("numFollowers");
						var lastactivity=timeSince(new Date(question.get("lastUpdated")));
						singleAnswers(question);
						console.log(opento);

						if(opento=="neta"){
							$("#opentoarea").html("");
							$("#opentoarea").append("<img src='"+askedtophoto+"' class='circle-img'>");
						}
						else{
							populateOpenTo(constituency);
						}
						$('#que-view').append("<h3>"+title+"</h3><hr><p>"+questionstatement+"</p>");
						document.getElementById("askedbyphoto").innerHTML="<img src='"+askerphoto+"' class='circle-img'>";
						document.getElementById("singplace").innerHTML=place;
						document.getElementById("singtime").innerHTML=time;
						document.getElementById("singdate").innerHTML=date;
						document.getElementById("singlast").innerHTML=lastactivity;
						document.getElementById("singfollowers").innerHTML=followers;
						document.getElementById("singviews").innerHTML=views;
					},
					error:function(error){
						console.log("Error: "+error.message);notify(standardErrorMessage, "error",standardErrorDuration);
					}
				});
			}		 	
 		},
 		error:function(){
 			console.log("Error: "+error.message);notify(standardErrorMessage, "error",standardErrorDuration);
 		}
 	});
 }


function singleAnswers(question){
	console.log("singleAnswers");
 	var Answers=Parse.Object.extend("Answer");
 	var answers=new Parse.Query(Answers);
 	answers.equalTo("question",currquestion);
 	answers.ascending("createdAt");
 	answers.include("pUser");
 	
 	answers.find({
 		success:function(results){
 			$('#participants').html("");
 			$("#ans-view").html("");
 			participants=[];
 			for(var i=0;i<results.length;i++){
 				object=results[i];
 				if(object.get("pUser").get("pic")!=undefined){
 					var photo=object.get("pUser").get("pic").url();
 				}
 				else{
 					var photo=getDefaultIcon(object.get("pUser").get("type"));
 				}
 				var flag=0;
 				for(var j=0;j<participants.length;j++){
 					if(participants[j].id==object.get("pUser").id){
 						flag=1;
 						break;
 					}
 				}
 				if(flag==1){
 					//do nothing
 				}
 				else{
 					participants.push(object.get("pUser"));
 					if(object.get("pUser").get("pic")!=undefined){
 						var pphoto=object.get("pUser").get("pic").url();
 					}
 					else{
 						var pphoto=getDefaultIcon(object.get("pUser").get("type"));
 					}
 					
 					$("#participants").append("<li><img src='"+pphoto+"' class='circle-img gs hv'></li>");
 				}
 				var tdate=object.createdAt;
			    var p_timestamp=tdate.toString().split(" ");
			    var date=p_timestamp[0]+" "+p_timestamp[1]+" "+p_timestamp[2]+" "+p_timestamp[3];
			    var time=p_timestamp[4];
			    var answercontent=object.get("content");
 				var place=constituency.get("name");
 				var extratext="";
 				var extraimage="";
 				console.log(question);
 				if(object.get("pUser").id==question.get("pAsker").id){
 					extratext="<p>Added by Author</p>";
 					extraimage="<div class='small-4 columns small-offset-3 s-ws-top'><img src='./assets/images/neta.png' class='circle-img'></div>";
 				}
 				else if(object.get("pUser").type=="neta"){
 					extratext="<p>Added by Neta</p>";
 					extraimage="<div class='small-4 columns small-offset-3 s-ws-top'><img src='./assets/images/asker.png' class='circle-img'></div>";
 				}
 				$("#ans-view").append("<div class='row'><div class='small-3 columns text-right m-ws-top'><div class='row'>"+extraimage+"<div class='small-5 columns small-offset-7'><img src='"+photo+"' class='circle-img'></div></div><div class='row'><div class='small-12 columns secondary s-ws-top'><i class='icon-clock secondary-color'></i> "+time+"</div><div class='small-12 columns secondary'><i class='icon-calendar secondary-color'></i> "+date+"</div><div class='small-12 columns secondary'><i class='icon-location secondary-color'></i>"+place+"</div></div></div><div class='small-9 columns secondary-panel m-ws-top'>"+extratext+"<p>"+answercontent+"</p></div></div>");
 			}
 			NProgress.done();
 		},
 		error: function(error){
 			console.log("Error: "+error.message);notify(standardErrorMessage, "error",standardErrorDuration);
 			
 		}
 	});
 	
 }

function postAnswer(a){
	NProgress.start();
	console.log("postAnswers");
	var Answer = Parse.Object.extend("Answer");
    var answer = new Answer();
    answer.set("content", a);
    answer.set("question", currquestion);
    answer.set("user", currentUser);
    
    answer.save(null, {
      success: function(comment) {
        document.getElementById("answerbox").value="";
        singleAnswers(currquestion);        
      },
      error: function(comment, error) {
        alert('Failed to Comment! ' + error.message);
        singleAnswers(currquestion)
      }
    });
}

function populateOpenTo(constituency){
	console.log("populateOpenTo");
	var Election = Parse.Object.extend("Election");
	var election = new Parse.Query(Election);
	election.equalTo("constituency",constituency);
	election.include("arrayNetas.pUser");
	election.find({
		success:function(results){
			var opento=$('#opentoarea');
			var object=results[0];
			var Netas=object.get("arrayNetas");
			for(var i=0;i<Netas.length;i++){
				var thisone=Netas[i];
				if(thisone.get("pUser").get("pic")!=undefined){
					var photo=thisone.get('pUser').get("pic").url();
				}
				else{
					var photo=getDefaultIcon("neta");
				}
				opento.append("<img src='"+photo+"' class='circle-img'>"); 
			}
		},
		error:function(error){
			console.log("Error: "+error.message);notify(standardErrorMessage, "error",standardErrorDuration);
		}
	});
}

function singleView(){
	console.log("singleView");
	$('#list-qa-view').fadeOut(300);
    $('#single-qa-view').delay(300).fadeIn(300);
}

function initialize() {
	console.log("initiailize");
	NProgress.start();
	
	$( document ).ready(function() {
		currentUser=CU;
		if(currentUser.get("type")=="neta"){
			currentNeta=currentUser.get("neta");			
		}
		else if(currentUser.get("type")=="teamMember"){
			currentTeamMember=currentUser.get("teamMember");
			currentTeamMember.fetch({
				success:function(results){
					currentNeta=currentTeamMember.get("neta");
				},
				error:function(error){
					console.log("Error: "+error.message);notify(standardErrorMessage, "error",standardErrorDuration);
				}
			})
		}
		if(currentUser.get("pic")!=undefined){
			document.getElementById("myphoto").src=currentUser.get("pic").url();
		}
		else{
			document.getElementById("myphoto").src=getDefaultIcon(currentUser.get("type"));
		}
	    $('#open').click(function(){
	    	NProgress.start();
			populateQuestions(2);
			
		});
		$('#you').click(function(){
			NProgress.start();
			populateQuestions(1);
			
		});
		$('#all').click(function(){
			NProgress.start();
			populateQuestions(0);
			
		});
		$('#following').click(function(){
			NProgress.start();
			followerQuestions();
			
		});
		$('#answer-form').submit(function(event){
	          event.preventDefault();
	          var answer=document.getElementById("answerbox").value;
	          postAnswer(answer);
	    });
	  });
	  NProgress.done();
}


