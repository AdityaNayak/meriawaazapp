var currentUser;
var neta;
var constituency;
var sTable=$('#subscribers-table tbody');
var nTable=$('#netaLists');
var cTable=$('#list-campaign');
var crTable=$('#delivery-table tbody');
var tobeuploaded=0;
var currentuploaded=0;
var smallarrays=[]; 
var dirty=0;
var skip=0;
var totalReach;
var totalpages=0;
var currentListId;
var currentCampaignId;
var subscriberList=[];

var box_a=document.getElementById('a_cb');
var box_w=document.getElementById('w_cb');
var box_s=document.getElementById('s_cb');
var box_st=document.getElementById('st_cb');
var box_p=document.getElementById('p_cb');
var box_e=document.getElementById('e_cb');

function deleterecords(n){
    ListItem = Parse.Object.extend("Subscriber");
    query = new Parse.Query(ListItem);
    var pointer = new Parse.Object("Neta");
    pointer.id = n;
    query.equalTo("neta", pointer);
    query.limit(1000);
    query.find({
      success: function(obj){
        Parse.Object.destroyAll(obj, {
              success: function(objs) {                     
                  console.log("destroyAll done");
              },
              error: function(error) { 
                  //console.log("Error: "+error.message);
                  notify(error.message, "error",standardErrorDuration);
              }
          });
        console.log("success1");
      },
      error: function(error){
        //console.log("Error: "+error.message);
        notify(error.message, "error",standardErrorDuration);
      }
    });
}


function selfUpload(){
  if(dirty==1){
    console.log("Deleting Unsuccesful Uploads!");
    Parse.Cloud.run("deleteCSV", {ro: smallarrays[currentuploaded], ne: neta.id, li: currentListId},{
      success:function(results){
        NProgress.set(currentuploaded/tobeuploaded);
        var numAnim1 = new countUp("per", 0, (currentuploaded/tobeuploaded)*100);
        numAnim1.start();
        console.log("Next Batch!");
        dirty=0;
        setTimeout('selfUpload()',10000);
      },
      error:function(error){
            console.log(error);
            if(error.message.indexOf("exceed") !=-1){
              console.log("Will try after "+61+" seconds");
              dirty=1;
              setTimeout('selfUpload()',(parseInt(61*1000)));
            }
            else{
              updateCounters();
              populateSubscribers();
              pagination();
              NProgress.done();
			  notify(standardSuccessMessage, "success",standardSuccessDuration);
              $('#progress').delay(400).fadeOut(300);
            }
      }
    });
  }
  else{
      Parse.Cloud.run("uploadCSV", {ro: smallarrays[currentuploaded], ne: neta.id, li: currentListId},{
      success:function(results){
        
        if(currentuploaded==tobeuploaded-1){
          console.log("Done!");
          updateCounters();
          populateSubscribers();
          pagination();
          console.log(results);
          NProgress.done();
          tobeuploaded=0;
          currentuploaded=0;
          $('#progress').delay(400).fadeOut(300);
        }
        else{
            currentuploaded=currentuploaded+1;
            NProgress.set(currentuploaded/tobeuploaded);
            var numAnim1 = new countUp("per", 0, (currentuploaded/tobeuploaded)*100);
            numAnim1.start();
            console.log("Next Batch!");
            
            setTimeout('selfUpload()',10000);
          
          
        }
      },
      error:function(error){
        console.log(error);
        if(error.message.indexOf("exceed") !=-1){
          console.log("Will try after "+61+" seconds");
          dirty=1;
          setTimeout('selfUpload()',(parseInt(61*1000)));
        }
        else{
          updateCounters();
          populateSubscribers();
          pagination();
          NProgress.done();
		  notify(standardSuccessMessage, "success",standardSuccessDuration);
          $('#progress').delay(400).fadeOut(300);
        }
        
      }
    });
  }

}  
function newUser(u,p){
    var user = new Parse.User();
    user.set("username", u);
    user.set("password", u+"galaxy");
    user.signUp(null, {
          success: function(user) {
            notify(standardSuccessMessage, "success",standardSuccessDuration);
          },
          error: function(user, error) {
            console.log("Error: "+error.message);notify(standardErrorMessage, "error",standardErrorDuration);
          }
    });
}

function updateCounters(){
    
    var Citizens= Parse.Object.extend("Citizen");
    var Subscribers = Parse.Object.extend("Subscriber");
    var Subscribers2 = Parse.Object.extend("Subscriber");
    var Subscribers3 = Parse.Object.extend("Subscriber");
    var query1 = new Parse.Query(Citizens);
    var query2 = new Parse.Query(Subscribers);
    query2.equalTo("neta",neta);
    var query3 = new Parse.Query(Subscribers2);
    query3.notEqualTo("phone","");
    query3.equalTo("neta",neta);
    var query4 = new Parse.Query(Subscribers3);
    query4.equalTo("neta",neta);
    query4.equalTo("phone","");
    query4.notEqualTo("email","");
    

    query2.count({
      success: function(count2) {
        console.log(count2);
        var numAnim2 = new countUp("tot", 0, count2);
        numAnim2.start();
        query1.count({
              success: function(count1) {
                console.log(count1);
                var numAnim1 = new countUp("pop", 0, count2+count1+4487);
				totalReach=count1+count2+4487;
                numAnim1.start();
              },
              error: function(error) {

                console.log("Error: "+error.message);notify(standardErrorMessage, "error",standardErrorDuration);
              }
            });
      },
      error: function(error) {
        console.log("Error: "+error.message);notify(standardErrorMessage, "error",standardErrorDuration);
      }
    });

    query3.count({
      success: function(count3) {
        console.log(count3);
        var numAnim3 = new countUp("mob", 0, count3);
        numAnim3.start();
      },
      error: function(error) {
        console.log("Error: "+error.message);notify(standardErrorMessage, "error",standardErrorDuration);
      }
    });

    query4.count({
      success: function(count4) {
        console.log(count4);
        var numAnim4 = new countUp("ema", 0, count4);
        numAnim4.start();
        NProgress.done();
      },
      error: function(error) {
        console.log("Error: "+error.message);notify(standardErrorMessage, "error",standardErrorDuration);
      }
    });    
}

function changePage(s){
  skip=parseInt(s)*1000;
  populateSubscribers();
}

function setcurrentpage(s){
  for(var i=0;i<totalpages;i++){
    if(i==parseInt(s)){
      $("#page-"+i).closest("li").addClass('current');
    }
    else{
      $("#page-"+i).closest("li").removeClass('current');
    }
  }
}

function pagination(){
    $('#pages').html("");
	skip=0;
    var Subscribers = Parse.Object.extend("Subscriber");
    
    var query = new Parse.Query(Subscribers);
    
    query.equalTo("neta",neta);
	var currentList= new Parse.Object("NetaList");
	currentList.id=currentListId;
	query.equalTo("netaList",currentList);
    query.count({
      success: function(count2) {
        console.log(count2);
        if(count2%1000==0){
          var numpages=Math.floor(count2/1000);
          totalpages=numpages;
        }else{
          var numpages=Math.floor(count2/1000)+1;
          totalpages=numpages;
        }
        if(numpages>10){
          numpages=10;
        }
        for(var i=0;i<numpages;i++){
          $('#pages').append("<li ><a id='page-"+i+"'>"+(i+1).toString()+"</a></li>");
          $('#page-'+i).off();
          $('#page-'+i).click(function(event){
            event.preventDefault();
                      NProgress.start();
                      console.log(event.target.id.toString().split('-')[1]);
                      changePage(event.target.id.toString().split('-')[1]);
                      setcurrentpage(event.target.id.toString().split('-')[1]);
                });
        }
        if(numpages!=0){
          $("#page-0").closest("li").addClass('current');
        }
      },
      error: function(error) {
        console.log("Error: "+error.message);notify(standardErrorMessage, "error",standardErrorDuration);
      }
    });
}

function populateSubscribers(){
    sTable.html("");
    var Subscribers = Parse.Object.extend("Subscriber");
    var query=new Parse.Query(Subscribers);
    var pointer= new Parse.Object("Neta");
    pointer.id=neta.id;
    query.equalTo("neta",pointer);
  	var currentList= new Parse.Object("NetaList");
  	currentList.id=currentListId;
  	query.equalTo("netaList",currentList);
    query.include("puser");
    query.skip(skip);
    query.limit(1000);
    query.ascending("createdAt");
    query.find({
        success: function(result){
            console.log(result.length);
            console.log(skip);
            for(var i=0;i<result.length;i++){
                object=result[i];
                sTable.append( "<tr name="+currentList.id+"><td>"+object.get("name")+"</td><td>"+object.get("phone")+"</td><td>"+object.get("email")+"</td><td>"+object.get("age")+"</td></tr>");
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

function getStuff(){
    currentUser=CU;
    CU.fetch({
          success: function(results) {
                console.log("Size:"+results.length);
                object=CU;
                var p;
                var n;
                if(object.get("type")=="neta"){
                    var n=object.get("neta");
                    n.fetch({
                        success: function(results){
                            neta=n;
                            if(CU.get("username")!="admin"){

                                //console.log(n.get("constituency"));
                                var Election = Parse.Object.extend("Election");
								election = new Parse.Query(Election);
								election.descending('createdAt');
								var pointer = new Parse.Object("Neta");
								pointer.id = neta.id;
								election.equalTo("arrayNetas", pointer);
								election.include("constituency");
								election.find({
									success: function(results) {
										var constituency=results[0].get("constituency");
											constituency.fetch({
												success:function(results){
													updateCounters();
													showMemberLists();
												},
												error:function(error){
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
                            }                                
                        },
                        error: function(error){
                            //console.log("Error: "+error.message);
                            notify(error.message, "error",standardErrorDuration);
                            NProgress.done();
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
                                    neta=n;
                                    constituency=n.get("constituency");
                                    constituency.fetch({
                                        success:function(results){
                                          updateCounters();
                                          showMemberLists();
                                        },
                                        error:function(error){
                                            //console.log("Error: "+error.message);
                                            notify(error.message, "error",standardErrorDuration);
                                            NProgress.done();
                                        }
                                    });
                                },
                                error:function(error){
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
                }
                
            },
          error: function(error) {
                //console.log("Error: "+error.message);
                notify(error.message, "error",standardErrorDuration);
                NProgress.done();
          }
    });
}

function addMember(name,phone,email,age){
	NProgress.start();
	console.log("addMember");
	console.log(name+email+phone+age);
	list=currentListId;
	Parse.Cloud.run("addMember", {n: name, e: email, a: age, p: phone, l:list}, {
		success:function(results){
			console.log(results);
			notify("Subscriber added successfuly","success",3);
			$('#addv-row').fadeOut();
			populateSubscribers();
			pagination();			
		},
		error:function(error){
			//console.log("Error: "+error.message);
      notify(error.message, "error",standardErrorDuration);
			NProgress.done();   
		}
	}); 
}

function setupMemberForm(){
	$('#name-l').val("");
	$('#email-l').val("");
	$('#ph-l').val("");
	$('#a-l').val("");
}

function getStatusIcon(s){
	if(s=="done"){
		return 'icon-check gc';
	}
	else if(s=="pending"){
		return 'icon-process yc';
	}
	else{
		return 'icon-alert rc';
	}	
}

function getStatusWord(s){
	if(s=="done"){
		return 'Delivered';
	}
	else if(s=="pending"){
		return 'In Progress';
	}
	else{
		return 'Failed';
	}	
}

function statusCheck(m){
    console.log("StatusCheck");
    if(m.get("type")=="whatsapp"){
        if(box_w.checked || box_a.checked){
             return 1;
        }
    }
    if(m.get("type")=="sms"){
        if(box_s.checked || box_a.checked){
             return 1;
        }
    }
	if(m.get("type")=="smstrans"){
        if(box_st.checked || box_a.checked){
             return 1;
        }
    }
	if(m.get("type")=="email"){
        if(box_e.checked || box_a.checked){
             return 1;
        }
    }
	if(m.get("type")=="push"){
        if(box_p.checked || box_a.checked){
			return 0; 
		}
	}
}

function filter(){
	console.log("Filter");
	NProgress.start();
	crTable.html("");
	for(var m=0;m<subscriberList.length;m++){
		var p_timestam=String(subscriberList[m].createdAt);
		var p_timestamp=p_timestam.split(" ");
		var p_date=p_timestamp[0]+" "+p_timestamp[1]+" "+p_timestamp[2]+" "+p_timestamp[3];
		var p_time=p_timestamp[4];

		var p_number=subscriberList[m].get("subscriber").get("phone");
		var p_status=getStatusWord(subscriberList[m].get("status"));
		var p_statusicon=getStatusIcon(subscriberList[m].get("status"));

		p_statusicon=getStatusIcon(subscriberList[m].get('status'));
		p_status=getStatusWord(subscriberList[m].get('status'));

        if(statusCheck(subscriberList[m])==1){
			console.log( "<tr><td>+91 "+p_number+"</td><td>"+p_status+"</td><td>"+p_time+"</td><td>"+p_date+"</td><td><i class='"+p_statusicon+"'></i></td></tr>")
            crTable.append( "<tr><td>+91 "+p_number+"</td><td>"+p_status+"</td><td>"+p_time+"</td><td>"+p_date+"</td><td><i class='"+p_statusicon+"'></i></td></tr>");
        }        

    }     
	NProgress.done();
}

function showCampaignReport(){
	console.log("showCampaignReport");
	NProgress.start();
	crTable.html("");

	
	var CampaignReport = Parse.Object.extend("CampaignReport");
    var query=new Parse.Query(CampaignReport);
    var pointer= new Parse.Object("Campaign");
	console.log("Going to Search for:"+currentCampaignId);
    pointer.id=currentCampaignId;
    query.equalTo("campaign",pointer);
	query.include("subscriber");
	
    query.find({
		success:function(currentCampaignReport){
			console.log(currentCampaignReport.length);
			subscriberList=currentCampaignReport;
			var currentCampaign= pointer;
			currentCampaign.fetch({
				success:function(results){
					var currentPost=currentCampaign.get("post");
					currentPost.fetch({
						success:function(){
							$('#rp-content').html(currentPost.get("content"));
							$('#rp-status').html(getStatusWord(currentCampaign.get("status"))+'<i class="'+getStatusIcon(currentCampaign.get("status"))+'"></i>');
							$('#rp-sms').html(currentCampaign.get("numSuccessSMS"));
							$('#rp-smst').html(currentCampaign.get("numSuccessSMSTrans"));
							$('#rp-email').html(currentCampaign.get("numSuccessEmail"));
							$('#rp-whatsapp').html(currentCampaign.get("numSuccessWhatsapp"));
							$('#rp-push').html(currentCampaign.get("numSuccessPush"));
							$('#rp-reach').html(currentCampaign.get("numSuccessPush")+currentCampaign.get("numSuccessWhatsapp")+currentCampaign.get("numSuccessSMSTrans")+currentCampaign.get("numSuccessSMS")+currentCampaign.get("numSuccessEmail"));
							
							filter();
							NProgress.done();
						},
						error: function(){
							NProgress.done();
							console.log("Error: "+error.message);notify(standardErrorMessage, "error",standardErrorDuration);
						}
					});
				},
				error:function(error){
					NProgress.done();
					console.log("Error: "+error.message);notify(standardErrorMessage, "error",standardErrorDuration);
				}
			});
		},
		error: function(error){
			NProgress.done();
			console.log("Error: "+error.message);notify(standardErrorMessage, "error",standardErrorDuration);
		}
	});
}

function getReducedContent(s){
	if (s.length<50){
		return s;
	}
	else{
		return s.substring(0,50)+"...";
	}
	
}

function showCampaign(){
	console.log("showCampaign");
	NProgress.start();
	cTable.html("");
    var Campaign = Parse.Object.extend("Campaign");
    var query=new Parse.Query(Campaign);
    var pointer= new Parse.Object("Neta");
    pointer.id=neta.id;
    query.equalTo("neta",pointer);
	query.include("post");
	query.descending("createdAt");
	query.limit(1000);
    query.find({
		success:function(result){
			console.log(result.length);
            for(var i=0;i<result.length;i++){
                object=result[i];      
				var p_timestam=String(object.createdAt);
				var p_timestamp=p_timestam.split(" ");
				var p_date=p_timestamp[0]+" "+p_timestamp[1]+" "+p_timestamp[2]+" "+p_timestamp[3];
				var p_time=p_timestamp[4];				
				var totalSuccess=object.get("numSuccessWhatsapp")+object.get("numSuccessEmail")+object.get("numSuccessSMS")+object.get("numSuccessSMSTrans")+object.get("numSuccessPush");
				var total=object.get("numTotalWhatsapp")+object.get("numTotalEmail")+object.get("numTotalSMS")+object.get("numTotalSMSTans")+object.get("numTotalPush");
                cTable.append('<div class="row brbm cs" id="campaign-'+object.id+'"><div class="small-6 columns"><span class="secondary-color">#'+(i+1)+'</span>'+getReducedContent(object.get("post").get("content"))+'</div><div class="small-3 columns secondary secondary-color"><i class="icon-clock secondary"></i>'+p_time+'<i class="icon-calendar secondary"></i> '+p_date+'</div><div class="small-2 columns secondary secondary color"> '+totalSuccess+' <small>/'+total+'</small> </div> <div class="small-1 columns"> <i class="'+getStatusIcon(object.get("status"))+'"></i> </div> </div>');
				$('#campaign-'+object.id).click(function(){ 
							  currentCampaignId=this.id.toString().split('-')[1];
                              console.log("Setting Current:"+currentCampaignId);
                              console.log(currentCampaignId);
							  showCampaignReport();
							  $('#cmp-list-view').fadeOut();
							  $('#cmp-single-listview').delay().fadeIn();
                });
			}
            NProgress.done();
			
		},
		error:function(error){
			console.log("Error: "+error.message);notify(standardErrorMessage, "error",standardErrorDuration);
			NProgress.done();
		}
	});
}

function showMemberLists(){
	console.log("showMemberLists");
	NProgress.start();
	nTable.html("");
    var NetaLists = Parse.Object.extend("NetaList");
    var query=new Parse.Query(NetaLists);
    var pointer= new Parse.Object("Neta");
    pointer.id=neta.id;
    query.equalTo("neta",pointer);
    query.find({
        success: function(result){
            console.log(result.length);
            for(var i=0;i<result.length;i++){
                object=result[i];
                if(object.get("ranking")==1){        
                nTable.append('<div class="row brbm"><a href="#"><div class="small-7 columns" id="list-'+object.id+'"><span class="f-1-5x">'+object.get("name")+'</span></div></a><div class="small-3 columns s-ws-top">'+object.get("number")+' <span class="secondary-color">subscribers</span></div><div class="small-2 columns"><a class="button tiny nm" id="btn-'+object.id+'">Make Default</a></div></div>');
  				      }
                else{
                  nTable.append('<div class="row brbm" id="list-'+object.id+'"><a href="#"><div class="small-7 columns"><span class="f-1-5x">'+object.get("name")+'</span></div></a><div class="small-3 columns s-ws-top">'+object.get("number")+' <span class="secondary-color">subscribers</span></div><div class="small-2 columns s-ws-top"><i class="icon-check gc"></i> Default List</div></div>');
                }
				$('#btn-'+object.id).unbind("click");
                 $('#btn-'+object.id).click(function(){ 
                   currentListId2=this.id.toString().split('-')[1];
                   //currentListId2=object.id;
                   console.log(currentListId2);
                    Parse.Cloud.run("changeDefaultList", {netaID: neta.id,listID: currentListId2}, {
                      success:function(results){
                        console.log(results);
                        notify(results,"success",3);
                        showMemberLists();
                      },
                      error:function(error){
                        notify("Error: "+error.message, "alert", 3);
                        NProgress.done();   
                      }
                    });
                 });
				 $('#list-'+object.id).unbind("click");
                $('#list-'+object.id).click(function(){ 
  							  currentListId=this.id.toString().split('-')[1];
							  console.log(currentListId);
  							  populateSubscribers();
  							  pagination();
  							  $('#outreach-view').fadeOut();
  							  $('#outreach-single-listview').fadeIn();
                });
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

function showListAdditionForm(){
	console.log("showListAdditionForm");
	prepareListAdditionForm();
	$("#addList-Form").fadeIn();
}

function prepareListAdditionForm(){
	console.log("prepareListAdditionForm");
	$("#listName").val("");
}

function addNetaList(name){
	//console.log("addNetaList");    
	NProgress.start();
	//console.log(name);
	Parse.Cloud.run("addNetaList", {listName: name}, {
		success:function(results){
			console.log(results);
			notify("List created successfuly","success",3);
			showMemberLists();
			$("#addList-Form").fadeOut();
		},
		error:function(error){
			console.log("Error: "+error.message);
			NProgress.done();   
		}
	}); 
	
}

function initialize() {
    console.log("initialize");
    currentUser = CU;
    NProgress.start();
    console.log("NProgress Start");
    getStuff();
	$('#addListForm').submit(function(event){
      event.preventDefault();
      var name=$("#listName").val();
	  addNetaList(name);
  });

	$('#cancelListAddition').click(function(){
		$("#addList-Form").fadeOut();
	});
	$('#cancelVoterAddition').click(function(){
		$("#addv-row").fadeOut();
	});
    $('#addv').click(function(){
	  setupMemberForm();
      $('#addvs-row').delay(300).fadeOut();
      $('#addv-row').fadeIn();
    });
    $('#addvs').click(function(){
      $('#addv-row').delay(300).fadeOut();
      $('#addvs-row').fadeIn();
    });
    $('#list-trg').click(function(){
	  $('#addv-row').fadeOut();
	  $("#addList-Form").fadeOut();
	  $('#addvs-row').fadeOut();
      $('#cmp-view').fadeOut();
      $('#outreach-single-listview').fadeOut();
      $('#outreach-view').delay(300).fadeIn();
      $('#outreach-list-view').delay(300).fadeIn();
    });
    $('#cmp-trg').click(function(){
	  $('#addv-row').fadeOut();
	  $("#addList-Form").fadeOut();
	  $('#addvs-row').fadeOut();
      $('#outreach-view').fadeOut();
	  $('#outreach-single-listview').fadeOut();
	  $('#outreach-list-view').fadeOut();
      $('#cmp-view').fadeIn();
      $('#cmp-list-view').fadeIn();
      $('#cmp-single-listview').fadeOut();

	  showCampaign();
    });
	$('#rep-trg').click(function(){
      notready();
    });
	$('#crl-btn').click(function(){
      showListAdditionForm();
    });
	$('#seg-btn').click(function(){
      notready();
    });
	$('#com-btn').click(function(){
      notready();
    });
	$('#sgm-btn').click(function(){
      notready();
    });
	$('#ver-btn').click(function(){
      notready();
    });
	$('#voteradd-form').submit(function(event){
          event.preventDefault();
          var name=document.getElementById("name-l").value;
		  var phone=document.getElementById("ph-l").value;
		  var email=document.getElementById("email-l").value;
		  var age=document.getElementById("a-l").value;

		  if(name!="" || phone!="" || email!="" || age!=""){
			addMember(name,phone,email,age);
		  }
		  else{
			  notify("Enter Some Data", "error",standardErrorDuration);
		  }
    });
	$(function () {
          $("#uploadc").bind("click", function () {
              $('#progress').delay(400).fadeIn(300);
              var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
              if (regex.test($("#fileUpload").val().toLowerCase())) {
                  NProgress.start();
                  if (typeof (FileReader) != "undefined") {
                      var reader = new FileReader();
                      reader.onload = function (e) {
                          var table = $("<table />");
                          var rows = e.target.result.split("\n");
                          var size = 500;
                          var k=1;
                          
                          for (var i=1; i<rows.length; i+=size) {
                              var smallarray = rows.slice(i,i+Math.min(size,rows.length)+1);
                              smallarrays.push(smallarray);
                              
                          }
                          tobeuploaded=smallarrays.length;
                          selfUpload();                                                    
                      }
                      reader.readAsText($("#fileUpload")[0].files[0]);
                  } else {
                    NProgress.done();
                      alert("This browser does not support HTML5.");
                  }
              } else {
                NProgress.done();
                  alert("Please upload a valid CSV file.");
              }
          });
      });
    $(function () {
          $("#check").bind("click", function () {
              var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
              if (regex.test($("#fileUpload").val().toLowerCase())) {
                  NProgress.start();
                  
                  if (typeof (FileReader) != "undefined") {
                      var reader = new FileReader();
                      reader.onload = function (e) {
                          var table = $("<table />");
                          var rows = e.target.result.split("\n");
                          for (var i = 1; i < rows.length; i++) {
                              var row = $("<tr />");
                              
                              var cells = rows[i].split(",");
                              for (var j = 0; j < cells.length; j++) {
                                  var cell = $("<td />");
                                  
                                  if(j==0){
                                    
                                    console.log("name:"+cells[0]);
                                  }
                                  else if(j==2){
                                    
                                    console.log("email:"+cells[2]);
                                  }
                                  else if(j==1){
                                    
                                    console.log("phone:"+cells[1]);
                                  }
                                  else{
                                    
                                    console.log("age:"+parseInt(cells[3]));
                                  }
                                  cell.html(cells[j]);
                                  row.append(cell);
                              }
                                                            
                              table.append(row);
                          }
                          NProgress.done();
                          
                      }
                      reader.readAsText($("#fileUpload")[0].files[0]);
                  } else {
                    NProgress.done();
                      alert("This browser does not support HTML5.");
                  }
              } else {
                NProgress.done();
                  alert("Please upload a valid CSV file.");
              }
          });
      });
	  $('input[type=checkbox]').change(
        function(){
			NProgress.start();
			filter();
		});
}

initialize();