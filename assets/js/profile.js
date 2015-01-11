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

function queryUserTable(){
    console.log('QueryUserTable');
    ListItem = Parse.Object.extend("User");
    query = new Parse.Query(ListItem);
    query.equalTo("objectId", currentUser.id);
    query.include("neta");
    query.include(["neta.user"]);
    query.include(["neta.constituency"]);
    query.include(["neta.party"]);
    query.include("teamMember");
    query.include(["teamMember.neta"]);
    query.include(["teamMember.neta.user"]);
    query.include(["teamMember.neta.party"]);
    query.include(["teamMember.neta.constituency"]);
    
    query.find({
      success: function(results) {
        var object = results[0];
        
        if(object.get("type")=="neta"){
          neta=object.get("neta");

        }
        else if(object.get("type")=="teamMember"){
          var teammember=object.get("teamMember");
          neta=teammember.get("neta");
        }
        
        if(neta.get("user").get("pic")!=undefined){
          np=neta.get("user").get("pic").url();
        }
        else{
          np="./assets/images/neta.png";
        }


        p=neta.get("party");

        nNA=neta.get("user").get("name")+"<br><small>("+neta.get("age").toString()+")</small>";

        edu=neta.get("education");
        ass=neta.get("assets");
        lia=neta.get("liabilities");
        cri=neta.get("criminalCases");
        pro=neta.get("profession");
        com=neta.get("numComments");
        fol=neta.get("numFollowers");
        ske=neta.get("numSkeptics");
        icl=neta.get("numIsClaimed");
        ico=neta.get("numIsClosed");
        icv=neta.get("numIsValidated");
        npo=neta.get("numPosts");
        ts=neta.get("numMembers");
        qa=neta.get("numQsAnswered");
        qat=neta.get("numQsAskedTo");
        py=p.get("name");
        queryPostTable();
      },
      error: function(error) {
        console.log("Error: "+error.message);
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
        str=str+"<h5 class='secondary-color'>"+his[i].toString()+"</h5>";
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

function initialize() {
    console.log("initialize");
    currentUser = CU;
    NProgress.start();
    console.log("NProgress Start");
    queryUserTable();
}

initialize();
