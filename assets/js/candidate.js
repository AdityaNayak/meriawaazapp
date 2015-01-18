var currentUser;
var neta;

//Query User -> Neta Table
var netaPhoto=document.getElementById('photo');
var np;

var netaNameAge=document.getElementById('nameage');
var nNA;

//Query User -> Neta  Table
var party=document.getElementById('party');;
var py;

//Query User -> Neta Table
var cstate=document.getElementById('cstate');;
var cs;

//Query Assembly Table
var histor=document.getElementById('history2');;
var his=[];

//Query User -> Neta Table
var education=document.getElementById('education');;
var edu;

//Query User -> Neta Table
var assets=document.getElementById('assets');;
var ass;

//Query User -> Neta Table
var liabilities=document.getElementById('liabilities');;
var lia;

//Query User -> Neta Table
var criminalCases=document.getElementById('ccases');;
var cri;

//Query User -> Neta Table
var newFollowers=document.getElementById('num-followers');;
var nfol;

//Query User -> Neta Table
var comments=document.getElementById('num-comments');;
var com;

//Query User -> Neta Table
var questionsAsked=document.getElementById('num-qat');;
var qa;

//Query User -> Neta Table
var questionsAnswered=document.getElementById('num-qa');;
var qat;

var profession=document.getElementById('profession');;
var pro;

//Query User -> Neta Table
var teamSize=document.getElementById('teamsize');;
var ts;

//Query User -> Neta Table
var issuesClaimed=document.getElementById('num-iclaimed');;
var icl;

//Query User -> Neta Table
var numPosts=document.getElementById('num-posts');;
var npo;

//Query User -> Neta Table
var issuesClosed=document.getElementById('num-iclosed');;
var ico;

//Query User -> Neta Table
var election=document.getElementById('election');;
var ele;

//Query User -> Neta Table
var issuesValidated=document.getElementById('num-ivalidated');;
var icv;

//Query Posts Table
var reach=document.getElementById('num-reach');;
var rea;

//Query Posts Table
var followers2=document.getElementById('bsupport');;
var followers=document.getElementById('support');;

//Query Posts Table
var skeptics=document.getElementById('skeptics');;
var ske;

var profilelink=document.getElementById('profilelink');
var prol;

function queryUserTable(){
      console.log('QueryUserTable');
      neta.fetch({
          success:function(results){
                object=neta.get("pUser");
                object.fetch({
                    success:function(results){
                        if(object.get("pic")!=undefined){
                          np=object.get("pic").url();
                        }
                        else{
                          np="./../assets/images/neta.png";
                        }
                        p=neta.get("party");
                        p.fetch({
                            success:function(reuslts){
                                py=p.get("name");
                                if(neta.get("age")!=undefined){
                                    nNA=object.get("name")+"<br><small>("+neta.get("age").toString()+")</small>";
                                }
                                else{
                                    nNA=object.get("name");
                                }
                                edu=neta.get("education");
                                ass=neta.get("assets");
                                lia=neta.get("liabilities");
                                cri=neta.get("criminalCases");
                                pro=neta.get("profession");
                                com=neta.get("numComments");
                                fol=neta.get("numLikes");
                                ske=neta.get("numDislikes");
                                icl=neta.get("numIsClaimed");
                                ico=neta.get("numIsClosed");
                                icv=neta.get("numIsValidated");
                                npo=neta.get("numPosts");
                                ts=neta.get("numMembers");
                                qa=neta.get("numQsAnswered");
                                qat=neta.get("numQsAskedTo");
                                if(neta.get("link")!=undefined){
                                    prol="Details verified from <a href='"+neta.get("link")+"'>profile</a>";
                                }
                                else{
                                    prol="Details verified from <a href='#'>profile</a>";
                                }
                                
                                
                                queryPostTable();
                            },
                            error:function(error){
                                console.log("Error: "+error.message);
                                NProgress.done();
                            }
                        });
                    },
                    error:function(error){
                        
                    }
                });

                
          },
          error:function(error){
              console.log("Error: "+error.message);
                        NProgress.done();
          }
      });    
}


function queryPostTable(){
    console.log('QueryPostTable');
    ListItem = Parse.Object.extend("Post");
    query = new Parse.Query(ListItem);
    var pointer = new Parse.Object("Neta");
    pointer.id = neta.id;
    query.equalTo("neta", pointer);
    query.descending('createdAt');
    query.find({
      success: function(results) {
        var likes=0;
        var dislikes=0;
        var reach=0;
        for (var i = 0; i < results.length; i++) { 
            var object = results[i];
            reach+=object.get("reach");
        }
        rea=reach;
        queryFollowerTable();
      },
      error: function(error) {
        console.log("Error: "+error.message);
      }
    });
}

//for New Followers
function queryFollowerTable(){
    console.log('QueryFollowerTable');
    ListItem = Parse.Object.extend("Follower");
    query = new Parse.Query(ListItem);
    var pointer = new Parse.Object("Neta");
    pointer.id = neta.id;
    query.equalTo("neta", pointer);
    query.equalTo("type", "like");
    var date=new Date(currentUser.get("lastFetched"));
    var d = new Date(date.getTime());
    //query.greaterThan("createdAt", d);
    query.find({
      success: function(results) {
        nfol=results.length;
        queryElectionTable();
      },
      error: function(error) {
        console.log("Error: "+error.message);
      }
    });
}

//Election History
function queryElectionTable(){
    console.log("queryElectionTable");    
    ListItem = Parse.Object.extend("Election");
    query = new Parse.Query(ListItem);
    var pointer = new Parse.Object("Neta");
    pointer.id = neta.id;
    query.equalTo("arrayNetas", pointer);
    query.include("arrayNetas");
    query.include("constituency");
    query.descending('createdAt');
    his=[];
    query.find({
          success: function(results) {
                console.log("Size:"+results.length);
                if(results.length==0){
                    ele="-";
                    cs="-";
                }
                else{
                    //Check if some new election has held in this constituency before
                    if(results[0].get("winner")==undefined){
                        ele=results[0].get("name")+" "+results[0].get("year").toString()+" (Candidate)";
                    }
                    else{
                        if(results[0].get("winner").id==currentNeta.id){
                            ele=results[0].get("name")+" "+results[0].get("year").toString()+" (Winner)";
                        }
                        else{
                            ele=results[0].get("name")+" "+results[0].get("year").toString()+" (Contested)";
                        }
                    }
                    cs=results[0].get("constituency").get("name")+"<small> "+results[0].get("constituency").get("state")+"</small>";
                    var chp;
                    for(var i=1;i<results.length;i++){
                        if(results[i].get("winner").id==neta.id){
                            chp=results[i].get("name")+" "+results[0].get("year").toString()+" (Winner)";
                        }
                        else{
                            chp=results[i].get("name")+" "+results[0].get("year").toString()+" (Contested)";
                        }
                        his.push(chp);
                    }
                }
                displayData();
          },
          error: function(error) {
                console.log("Error:"+error.message);
          }
    });
}

function displayData(){
    console.log('QueryUpdateTable');
    netaPhoto.src=np;
    netaNameAge.innerHTML=nNA;
    party.innerHTML=py;
    election.innerHTML=ele;
    cstate.innerHTML=cs;
    histor.innerHTML="";
    var str="";
    for(var i=0;i<his.length;i++){
        str=str+"<h5 class='secondary-color ct'>"+his[i].toString()+"</h5>";
        console.log(str);
    }
    histor.innerHTML=str;
    education.innerHTML=edu;
    assets.innerHTML=ass;
    liabilities.innerHTML=lia;
    criminalCases.innerHTML=cri;
    newFollowers.innerHTML=nfol;
    comments.innerHTML=com;
    questionsAsked.innerHTML=qa;
    numPosts.innerHTML=npo;
    questionsAnswered.innerHTML=qat;
    teamSize.innerHTML=ts;
    profession.innerHTML=pro;
    profilelink.innnerHTML=prol;
    issuesClaimed.innerHTML=icl;
    issuesClosed.innerHTML=ico;
    issuesValidated.innerHTML=icv;
    reach.innerHTML=rea;
    followers.innerHTML=fol+" followers";
    followers.style.width=(Math.floor((fol/(fol+ske))*99))+"%";
    followers2.innerHTML=fol;
    skeptics.innerHTML=ske+" skeptics";
    skeptics.style.width=(Math.floor((ske/(fol+ske))*99))+"%";
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

function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

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

function S_GET(id){
    var a = new RegExp(id+"=([^&#=]*)");
    return decodeURIComponent(a.exec(window.location.search)[1]);
}

function getNeta(id){
    NProgress.start();
    console.log("NProgress Start");
    ListItem = Parse.Object.extend("Neta");
    query = new Parse.Query(ListItem);
    query.include("pUser");
    query.include(["neta.party"]);
    query.include(["neta.constituency"]);
    query.equalTo("objectId", id);
    query.find({
          success: function(results) {
                if(results.length==0){
                    alert("404 Not Found!");
                    self.location="./..";
                }
                else{
                    neta = results[0];
                    currentUser = results[0].get("pUser");
                    document.title = currentUser.get("name")+' | Delhi Elections 2015 | Meri Awaaz';
                    queryUserTable();
                }

            },
          error: function(error) {
                console.log("Error: "+error.message);
                        NProgress.done();
          }
    });   
    
}

function initialize() {
    console.log("initialize");
    Parse.initialize("km3gtnQr78DlhMMWqMNCwDn4L1nR6zdBcMqzkUXt", "BS9nk6ykTKiEabLX1CwDzy4FLT1UryRR6KsdRPJI");
    icon_bg();
    icon_bg();
    var id=S_GET("id");
    getNeta(id);
}

initialize();
