var nump;
var numc;
var candidatesAAP=[];
var candidatesBJP=[];
var candidatesCON=[];

function populateCandidates(){
	nump=3;
	numc=0;
	var Candidates= Parse.Object.extend("Neta");
	var query=new Parse.Query(Candidates);
	query.include("user");
	query.include("party");
	query.include("constituency");
	query.find({
		success:function(results){
			console.log(results.length);
			numc=results.length;
			for(var i=0;i<results.length;i++){
					console.log(results[i]);
					var neta=results[i];
					var p=neta.get("party");
					var c=neta.get("constituency");
					console.log(p.get("code"));
					var pu=neta.get("user");
					console.log(pu.get("name"));
					if(p.get("code")==3){
						if(pu.get("pic")!=undefined){
							var photo=pu.get("pic").url();
						}
						else{
							var photo=getDefaultIcon("neta");
						}
						candidatesAAP.push({0:neta.id,1:photo,2:pu.get("name"),3:c.get("name")});
					}
					else if(p.get("code")==4){
						if(pu.get("pic")!=undefined){
							var photo=pu.get("pic").url();
						}
						else{
							var photo=getDefaultIcon("neta");
						}
						candidatesBJP.push({0:neta.id,1:photo,2:pu.get("name"),3:c.get("name")});
					}
					else if(p.get("code")==2){
						if(pu.get("pic")!=undefined){
							var photo=pu.get("pic").url();
						}
						else{
							var photo=getDefaultIcon("neta");
						}
						candidatesCON.push({0:neta.id,1:photo,2:pu.get("name"),3:c.get("name")});
					}
					else{
						
					}	
				}
			displayCandidates();
		},
		error:function(error){
			console.log("Error: "+error.message);
		}
	});
	
}

 // function populateCandidates(){
 // 	nump=3;
 // 	numc=0;
 // 	var Candidates= Parse.Object.extend("Election");
 // 	var query=new Parse.Query(Candidates);
 // 	query.equalTo("code","DC15");
 // 	query.include("arrayNetas");
 // 	query.include("Neta.user");
 // 	query.include("Neta.party");
 // 	query.include("constituency");
 // 	query.find({
 // 		success:function(results){
 // 			console.log(results.length);
 // 			for(var i=0;i<results.length;i++){
 // 				console.log(results[i].get("constituency").get("name"));
 // 				var consti=results[i].get("arrayNetas");
 // 				numc+=consti.length;
 // 				for(var j=0;j<consti.length;j++){
 // 					console.log(consti[j]);
 // 					var neta=consti[j];
					
 // 					var p=neta.get("party");
 // 					console.log(p.get("code"));
 // 					var puser=neta.get("user");
	// 				if(puser.get("pic")!=undefined){
	// 					var photo=pu.get("pic").url();
	// 				}
	// 				else{
	// 					var photo=getDefaultIcon("neta");
	// 				}
 // 					if(p.get("code")==3){
 // 						candidatesAAP.push([neta.id,photo,puser.get("name"),results.get("constituency").get("name")]);
 // 					}
 // 					else if(p.get("code")==4){
 // 						candidatesBJP.push([neta.id,photo,puser.get("name"),results.get("constituency").get("name")]);
 // 					}
 // 					else if(p.get("code")==2){
 // 						candidatesCON.push([neta.id,puser.get("pic").url(),puser.get("name"),results.get("constituency").get("name")]);
 // 					}
 // 					else{
						
 // 					}
							
					
 // 				}
 // 			}
 // 			displayCandidates();
 // 		},
 // 		error:function(error){
 // 			console.log("Error: "+error.message);
 // 		}
 // 	});
	
 // }

// function populateCandidates(){
// 	nump=3;
// 	numc=0;
// 	var Candidates= Parse.Object.extend("Election");
// 	var query=new Parse.Query(Candidates);
// 	query.equalTo("code","DC15");
// 	query.include("arrayNetas");
// 	query.include("constituency");
// 	query.find({
// 		success:function(results){
// 			for(var i=0;i<results.length;i++){
// 				console.log(results[i]);
// 				var consti=results[i].get("arrayNetas");
// 				numc+=consti.length;
// 				for(var j=0;j<consti.length;j++){
// 					console.log(consti[j]);
// 					var neta=consti[j];
// 					neta.fetch({
// 						success:function(results2){
// 							var p=neta.get("party");
// 							p.fetch({
// 								success:function(results3){
// 									var puser=neta.get("user");
// 									puser.fetch({
// 										success:function(results4){
// 											if(p.get("code")==3){
// 												candidatesAAP.push([neta.id,puser.get("pic").url(),puser.get("name"),results.get("constituency").get("name")]);
// 											}
// 											else if(p.get("code")==4){
// 												candidatesBJP.push([neta.id,puser.get("pic").url(),puser.get("name"),results.get("constituency").get("name")]);
// 											}
// 											else if(p.get("code")==2){
// 												candidatesCON.push([neta.id,puser.get("pic").url(),puser.get("name"),results.get("constituency").get("name")]);
// 											}
// 											else{
												
// 											}
// 										},
// 										error:function(error){
											
// 										}
// 									});

									
// 								},
// 								error:function(error){
									
// 								}
// 							});
							
// 						},
// 						error:function(error){
							
// 						}
// 					});
					
// 				}
// 			}
// 			displayCandidates();
// 		},
// 		error:function(error){
// 			console.log("Error: "+error.message);
// 		}
// 	});
	
// }

function displayCandidates(){
	document.getElementById("numc").innerHTML = numc;
	document.getElementById("nump").innerHTML = nump;
	//Display AAP
	var AAPView=$('#AAP');
	AAPView.html("");
	var AAP="<div class='small-4 columns'>";
	for(var i=0;i<candidatesAAP.length;i++){
		if(i%4==0 && i!=0){
			AAP+="</div><div class='small-4 columns'>";
		}
		AAP+="<div class='row'><div class='small-3 columns s-ws-top'><a href='./candidate.html?id="+candidatesAAP[i][0]+"'><img src="+candidatesAAP[i][1]+" class='circle-img'></div><div class='small-9 columns s-ws-top ct'><h4>"+candidatesAAP[i][2]+"</h4><h5 class='secondary-color ct'>"+candidatesAAP[i][3]+"</h5></a></div></div>";
	}
	AAP+="</div>";
	console.log(AAP);
	AAPView.append(AAP);
	//Display BJP
	var BJPView=$('#BJP');
	BJPView.html("");
	var BJP="<div class='small-4 columns'>";
	for(var i=0;i<candidatesBJP.length;i++){
		if(i%4==0 && i!=0){
			BJP+="</div><div class='small-4 columns'>";
		}
		BJP+="<div class='row'><div class='small-3 columns s-ws-top'><a href='./candidate.html?id="+candidatesBJP[i][0]+"'><img src="+candidatesBJP[i][1]+" class='circle-img'></div><div class='small-9 columns s-ws-top ct'><h4>"+candidatesBJP[i][2]+"</h4><h5 class='secondary-color ct'>"+candidatesBJP[i][3]+"</h5></a></div></div>";
	}
	BJP+="</div>";
	BJPView.append(BJP);
	console.log(BJP);
	//Display Coongress
	var CONView=$('#CON');
	CONView.html("");
	var CON="<div class='small-4 columns'>";
	for(var i=0;i<candidatesCON.length;i++){
		if(i%4==0 && i!=0){
			CON+="</div><div class='small-4 columns'>";
		}
		CON+="<div class='row'><div class='small-3 columns s-ws-top'><a href='./candidate.html?id="+candidatesCON[i][0]+"'><img src="+candidatesCON[i][1]+" class='circle-img'></div><div class='small-9 columns s-ws-top ct'><h4>"+candidatesCON[i][2]+"</h4><h5 class='secondary-color ct'>"+candidatesCON[i][3]+"</h5></a></div></div>";
	}
	CON+="</div>";
	CONView.append(CON);

	NProgress.done();
}

function getDefaultIcon(type){
    if(type=="neta"){
        return "./../assets/images/neta.png";
    }
    else if(type=="teamMember"){
        return "./../assets/images/neta.png";
    }
    else{
        return "./../assets/images/user.png";
    }
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

function initialize(){
	  Parse.initialize("km3gtnQr78DlhMMWqMNCwDn4L1nR6zdBcMqzkUXt", "BS9nk6ykTKiEabLX1CwDzy4FLT1UryRR6KsdRPJI");
	  icon_bg();
	  icon_bg();
	  icon_bg();
	  icon_bg();
	  icon_bg();
	  icon_bg();
	  icon_bg();
	  icon_bg();
	  icon_bg();
	  $('#countdown').countdown('2015/2/7').on('update.countdown', function(event) {
	    var $this = $(this).html(event.strftime(''
	     + '<span class="s-ws-side"><span class="f-4x">%-w</span> week%!w</span>'
	     + '<span class="s-ws-side"><span class="f-4x yc">%-d</span> day%!d</span>'
	     + '<span class="s-ws-side"><span class="f-4x bgc">%H</span> hours</span>'
	     + '<span class="s-ws-side"><span class="f-4x bc">%M</span> mins</span>'
	     + '<span class="s-ws-side"><span class="f-4x dbc">%S</span> sec</span>'));
	  });
	NProgress.start();
	populateCandidates();
}

