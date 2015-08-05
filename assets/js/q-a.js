var currquestion;
var currentUser;
var currentPUser;
var currentNeta;
var folllist=[];
var mylist=[];

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

function myQuestions(){
	var qView=$('#qView');
	console.log("myQuestions");
	qView.html("");
	var Questions=Parse.Object.extend("Question");
    var question= new Parse.Query(Questions);
    question.equalTo("asker",currentUser);
	question.find({
	  success:function(results){
	  		mylist=[];
	  		for(var i=0;i<results.length;i++){
	  			mylist.push(results[i].id);
	  		}
    		populateQuestions(4);
    	},
    	error:function(error){
    		console.log(error.message);
    	}
    });
}

function getAllConstituencies(){
	var Constituency=Parse.Object.extend("Constituency");
    var con= new Parse.Query(Constituency);
	con.limit(1000);
	AC=[];
	con.find({
    	success:function(results){
			for(var i=0;i<results.length;i++){
				var temp=new Constituency();
				temp.id=results[i].id;
				temp.set("index",results[i].get("index"));
				AC.push(temp);
			}
			console.log(JSON.stringify(AC));
		},
		error:function(error){
			console.log(error.message);
		}
	});
}

function populateQuestions(val){
	NProgress.start();
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
		 if(constituency.get("type")==1){
			 constituencyArray=constituency.get("constituencyArray");
			 console.log(constituencyArray);
			 var Constituency = Parse.Object.extend("Constituency");
			 pointerArray=[];
			 for(var i=0;i<constituencyArray.length;i++){
				 
				 var con = new Constituency();
				 con.id=constituencyArray[i]["objectId"];
				 pointerArray.push(con);
			 }
			 console.log(pointerArray);
			 question.containedIn("constituency", pointerArray);
		 }
		 else{
			 question.equalTo("constituency",constituency);
		 }
	 
	 question.include("constituency");
	 question.limit(1000);
	 question.descending("createdAt");
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
	 else if(val==4){
	 	question.containedIn("objectId",mylist);
	 }
    question.find({
    	success:function(results){
    		var addition="";
    		for(var i=0;i<results.length;i++){
    			var object=results[i];
				console.log(object);
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
					var lastreplyName=object.get("lastAnswer").get("pUser").get("username");
    			}
    			else{
    				lastReply="No Replies Yet.";
    				var lastReplyPhoto=getDefaultIcon("citizen");
					var lastreplyName="-";
    			}
    			
    			if(object.get("pAsker").get("pic")!=undefined){
    				var askedbyPhoto=object.get("pAsker").get("pic").url();
    			}
    			else{
    				var askedbyPhoto=getDefaultIcon(object.get("pAsker").get("type"));    				
    			}
				var askedbyName=object.get("pAsker").get("username");
				
			    var lastActivityTime=timeSince(new Date(object.get("lastUpdated")));
			    var views=object.get("reach");
			    var comments=object.get("numAnswers");
			    var followers=object.get("numFollowers");
			    var tdate=object.createdAt;
			    var p_timestamp=tdate.toString().split(" ");
			    var date=p_timestamp[0]+" "+p_timestamp[1]+" "+p_timestamp[2]+" "+p_timestamp[3];
			    var time=p_timestamp[4];
			    var place=object.get("constituency").get("name");
			    var questionstatement=object.get("title");
			    var questiondetails=object.get("content");
			    var questionId=object.id;
			    qView.append("<div class='row list-qa'><div class='small-9 columns' ><h4 id='question-"+questionId+"'>"+questionstatement+"</h4><div class='row'><div class='small-4 columns secondary secondary-color'><i class='icon-clock secondary'></i> "+time+"</div><div class='small-4 columns secondary secondary-color'><i class='icon-calendar secondary'></i> "+date+"</div><div class='small-4 columns secondary secondary-color'><i class='icon-location secondary'></i> "+place+"</div></div><p class='s-ws-top'>"+questiondetails+"</p><p class='secondary-color secondary s-ws-top'> <strong>Last Reply: </strong>"+lastReply+"</p></div><div class='small-3 columns'><div class='row'><div class='small-6 columns text-center'><img src='"+askedbyPhoto+"' class='circle-img img-h'><h5 class='secondary secondary-color'>Asked by <span>"+askedbyName+"</span></h5></div><div class='small-6 columns text-center'><img src='"+ lastReplyPhoto+"' class='circle-img img-h'><h5 class='secondary secondary-color'>Last reply <span>"+lastreplyName+"</span></h5></div></div><div class='row secondary'><div class='small-6 columns text-right secondary-color'>Last actvity:</div><div class='small-6 columns secondary'>"+lastActivityTime+"</div></div><div class='row'><div class='small-6 columns text-right secondary-color'>Views:</div><div class='small-6 columns'>"+views+"</div></div><div class='row'><div class='small-6 columns text-right secondary-color'>Comments:</div><div class='small-6 columns'>"+comments+"</div></div><div class='row'><div class='small-6 columns text-right secondary-color'>Followers:</div><div class='small-6 columns'>"+followers+"</div></div></div></div><hr>");
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
									var askerphoto=asker.get("pic").url();
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

								/*if(opento=="neta"){
									$("#opentoarea").html("");
									$("#opentoarea").append("<img src='"+askedtophoto+"' class='circle-img'>");
								}
								else{
									populateOpenTo(constituency);
								}*/
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

 function followQuestion(){
	NProgress.start();
	console.log("followQuestion");
	var question = currentUser.relation("questions");
	question.query().find({
	  success:function(results){
	  		alreadyFollowed=false;
	  		for(var i=0;i<results.length;i++){
	  			if(results[i].id==currquestion.id){
					alreadyFollowed=true;
					break;
				}
	  		}
			if(alreadyFollowed==false){
				var relation = currentUser.relation("questions");
				relation.add(currquestion);
				currentUser.save(null, {
				  success: function(result) {      
				  },
				  error: function(error) {
					console.log("Error: "+error.message);notify(standardErrorMessage, "error",standardErrorDuration);
				  }
				});
			}
      	},
    	error:function(error){
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

		followQuestion();
        singleAnswers(currquestion);        
      },
      error: function(comment, error) {
        singleAnswers(currquestion);
		console.log("Error: "+error.message);notify(standardErrorMessage, "error",standardErrorDuration);

      }
    });
}

function postQuestion(q,t){
	NProgress.start();
	console.log("postQuestion");
	Parse.Cloud.run("addQuestion", {constituency: constituency.id, title: t, content: q}, {
	  success: function(comment) {
		document.getElementById("questionbox").value="";
		document.getElementById("questiontitle").value="";        
		NProgress.done();
	  },
	  error: function(error) {
		console.log("Error: "+error.message);notify(standardErrorMessage, "error",standardErrorDuration);
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
		currentPUser=currentUser.get("pUser");
		currentPUser.fetch({
			success:function(results){
				if(currentPUser.get("pic")!=undefined){
					document.getElementById("myphoto").src=currentPUser.get("pic").url();
				}
				else{
					document.getElementById("myphoto").src=getDefaultIcon(currentPUser.get("type"));
				}
			},
			error:function(error){
					console.log("Error: "+error.message);notify(standardErrorMessage, "error",standardErrorDuration);

			}
		});
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
		$('#my').click(function(){
			NProgress.start();
			myQuestions();
			
		});
    $('#ask-trg').click(function(event){
      event.preventDefault();
      $('#ask').slideDown();
      $('#ask-trg').html('Cancel').addClass('secondary ask-cancel');
      $('.ask-cancel').click(function(e){
        e.preventDefault();
        $('#ask').slideUp();
        $('#ask-trg').html('Ask a question').removeClass('secondary ask-cancel');
      });
    });
		$('#answer-form').submit(function(event){
	          event.preventDefault();
			  loadingButton_id("commit_btn",3);
	          var answer=document.getElementById("answerbox").value;
	          postAnswer(answer);
	    });
		$('#question-form').submit(function(event){
	          event.preventDefault();
			  loadingButton_id("commit_btn2",3);
	          var question=document.getElementById("questionbox").value;
			  var title=document.getElementById("questiontitle").value;
	          postQuestion(question,title);
	    });
		$('#back').click(function(){
			console.log("NProgress Start");
			console.log("singleView");
			$('#list-qa-view').delay(300).fadeIn(300);
			$('#single-qa-view').fadeOut(300);
		});
	  });
	  NProgress.done();
}


