// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs

var count = 0 ;
var CU;
var constituency;
standardErrorMessage="Oops! There seems to be some problem. Please try again later.";
standardErrorDuration=2;
standardSuccessMessage="Operation Successful!";
standardSuccessDuration=2;

Parse.initialize("km3gtnQr78DlhMMWqMNCwDn4L1nR6zdBcMqzkUXt", "BS9nk6ykTKiEabLX1CwDzy4FLT1UryRR6KsdRPJI");
internet();

function updateHistory()
{
	
}
var a=location.pathname.split('/').slice(-1)[0];
console.log(a);
if(a.length==0){
	
}
else{
	if(a=="login.html"){
		CU = Parse.User.current();
		if(!CU) {  
		    
		}
		else{
		    self.location="./dashboard.html";
		}
	}
	if(a!="login.html"){
		CU = Parse.User.current();
		if(!CU) {
		    alert("You need to sign in ");
		    self.location="./login.html";
		}
		else{
			if(CU.get("username")!=undefined){
				hello.innerHTML = "Namaskar "+CU.get("username");
			}
			else{
				hello.innerHTML = "Namaskar "+CU.get("name");
			}
		    
		    CU.fetch({
		          success: function(results) {
		                console.log("Size:"+results.length);
		                var plogo=document.getElementById('plogo');
		                var consti=document.getElementById('consti');
		                object=CU;
		                var p;
		                var n;
		                if(object.get("type")=="neta"){
		                	var n=object.get("neta");
		                	n.fetch({
		                		success: function(results){
		                			p=n.get("party");	
		                			p.fetch({
		                				success: function(results){
		                					if(CU.get("username")!="admin"){
						                		/*
												console.log(n.get("constituency"));
						                		
						                		constituency=n.get("constituency");
						                		constituency.fetch({
						                			success:function(results){
						                				consti.innerHTML=n.get("constituency").get("name");
						                				if(a=="q-a.html"){
						                					populateQuestions(0);
						                				}

						                			},
						                			error:function(error){
						                				
						                			}
						                		});*/
												var Election = Parse.Object.extend("Election");
												election = new Parse.Query(Election);
												election.descending('createdAt');
												var pointer = new Parse.Object("Neta");
												pointer.id = CU.get("neta").id;
												election.equalTo("arrayNetas", pointer);
												election.include("constituency");
												election.find({
												  success: function(results) {
														constituency=results[0].get("constituency");
														consti.innerHTML=constituency.get("name");
														if(a=="q-a.html"){
						                					populateQuestions(0);
						                				}
													},
													error: function(error){
														console.log("Error: "+error.message);
													}													
												});
						                	}	
						                	if(p.get("logo")!=undefined){
						                		plogo.src=p.get("logo").url();
						                	}

						                	object.set("lastFetched",new Date());
						                	object.save();
		                				},
		                				error: function(error){
		                					
		                				}
		                			});
		                		},
		                		error: function(results){
		                			
		                		}
		                	});
		                }
		                if(object.get("type")=="teamMember"){
		                	var t=object.get("teamMember");
		                	t.fetch({
		                		success:function(results){
		                			n=t.get("neta");
		                			n.fetch({
		                				success:function(results){
		                					p=n.get("party");
						                	p.fetch({
						                		success:function(results){
						                			constituency=n.get("constituency");
						                			constituency.fetch({
						                				success:function(results){
						                					//consti.innerHTML=t.get("neta").get("constituency").get("name");
															var Election = Parse.Object.extend("Election");
															election = new Parse.Query(Election);
															election.descending('createdAt');
															var pointer = new Parse.Object("Neta");
															pointer.id = t.get("neta").id;
															election.equalTo("arrayNetas", pointer);
															election.include("constituency");
															election.find({
															  success: function(results) {
																	constituency=results[0].get("constituency");
																	consti.innerHTML=constituency.get("name");
																	if(a=="q-a.html"){
																		populateQuestions(0);
																	}
																},
																error: function(error){
																	console.log("Error: "+error.message);
																}													
															});
															
										                	if(p.get("logo")!=undefined){
										                		plogo.src=p.get("logo").url();
										                	}

										                	object.set("lastFetched",new Date());
										                	object.save();
						                				},
						                				error:function(error){
						                					
						                				}
						                			});
						                		},
						                		error:function(error){
						                			
						                		}
						                	});
						                	
		                				},
		                				error:function(error){
		                					
		                				}
		                			});
		                		},
		                		error: function(error){
		                			
		                		}
		                	});
		                }
		                
		            },
		          error: function(error) {
		                console.log("Error:"+error.message);
		          }
		    });
		}
	}
}

function logout(){
    console.log("Logout");
    NProgress.start();
    console.log("NProgress Start");
    Parse.User.logOut();

    CU = null;
    NProgress.done();
    console.log("NProgress Stop");
    self.location="./login.html";
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

function timeTo(date) {

    var seconds = Math.floor(Math.abs(date - new Date()) / 1000);

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



function loadingButton_id(id,d){
	var Original=document.getElementById(id).value;
	console.log("Original: "+Original );
	document.getElementById(id).value = "Processing...";
	$("#"+id).addClass('loading');
	var ref=this;
	setTimeout(function() {
		$("#"+id).removeClass('loading');
		console.log("Changing value to "+Original);
		document.getElementById(id).value = Original;
	}, d*1000);
	console.log("Loading Button was Called!");
}
function loadingButton_id_stop(id,value){
	var Original=value;
	$("#"+id).removeClass('loading');
	document.getElementById(id).value = Original;
}

function loadingButton_ref(d){
	var Original=document.getElementById(this.id).value;
	document.getElementById(this.id).value = "Processing...";
	$(this).addClass('loading');
	setTimeout(function() {
		$(this).removeClass('loading');
		document.getElementById(this.id).value = Original;
	}, d*1000);
	console.log("Loading Button was Called!");
}

$('.interactiveLoading').click(function() {
	var Original=document.getElementById(this.id).value;
	document.getElementById(this.id).value = "Processing...";
	$(this).addClass('loading');
	var ref=this;
	setTimeout(function() {
		$(ref).removeClass('loading');
		document.getElementById(ref.id).value = Original;
	}, 12000);
	console.log("Loading Button was Called!");
});

$('#logout').click(function() {
	logout();
});

function notready(){
	notify("The feature is not ready yet, but coming soon. Stay Tuned", "warning",2);
}

function notify(text,type,duration){

	$('.alert-box').fadeIn().addClass(type).removeClass('alert').html(text + '<a href="#" class="close">&times;</a>');
	//Types are: alert, success, warning, info 
	setTimeout(function() {
		$('.alert-box').fadeOut().html('loading <a href="#" class="close">&times;</a>');
	}, duration*1000);
	$(document).on('close.alert', function(event) {
  $('#alert-hook').html('<div data-alert id="alert-box" class="alert-box-wrapper alert-box alert radius" style="display:none;"> Loading... <a href="#" class="close">&times;</a> </div>');
});
}
function internet(){
	//console.log('connectivty being monitored');
	window.addEventListener("offline", function(e) {
		notify('Internet connectivty lost. Please check your connection.', 'error', 0);
	}, false);

	window.addEventListener("online", function(e) {
		notify('Internet connectivty restored', 'success', 3);
	}, false);
}
function icon_bg(){
	var iconBg = $('.icon-bg');
	var iconArray = ['calendar','clock',
	'location',
	'phone',
	'trophy',
	'alert',
	'broadcast',
	'organization',
	'network',
	'comments',
	'comment',
	'map-streamline-user',
	'check',
	'person',
	'milestone',
	'android',
	'share',
	'data-science',
	'help',
	'voice',
	'bulb',
	'like',
	'tweak',
	'map'

	];
	var arraySize=iconArray.length;
	for (i = 1; i < arraySize; i++) { 
		var randomNumber = Math.floor(Math.random()*arraySize);
		iconBg.append('<i class="icon-'+iconArray[randomNumber]+'" style="font-size:'+Math.floor((Math.random() * 3) + 1.75)+'em; padding-top:'+Math.floor((Math.random() * 2) + 0.25)+'em;"></i>');
		iconArray.splice(randomNumber, 1);
	}
	console.log('success');
}