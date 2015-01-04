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
var history=document.getElementById('history');;
var his;

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
var followers=document.getElementById('num-followers');;
var fol;

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
var supporters2=document.getElementById('bsupport');;
var supporters=document.getElementById('support');;
var sup;

//Query Posts Table
var skeptics=document.getElementById('skeptics');;
var ske;

function queryUserTable(){
    console.log('QueryUserTable');
    ListItem = Parse.Object.extend("User");
    query = new Parse.Query(ListItem);
    query.equalTo("objectId", currentUser.id);
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
        
        if(object.get("type")=="neta"){
          neta=object.get("neta");

        }
        else if(object.get("type")=="teamMember"){
          var teammember=object.get("teamMember");
          neta=teammember.get("neta");
        }
        var p=neta.get("party");
        if(neta.get("mla")!=undefined){
          var mla=neta.get("mla");
          var con=mla.get("constituency");  
          ele=mla.get("name")+" "+mla.get("year")
          cs=con.get("name")+", "+"<small>("+con.get("state")+")</small>";
        }
        else{
          ele="-";
          cs="-";
        }
        if(neta.get("user").get("pic")!=undefined){
          np=neta.get("user").get("pic").url();
        }
        else{
          np="./assets/images/no_image.jpg";
        }
        nNA=neta.get("user").get("name")+"<small>("+neta.get("age").toString()+")</small>";
        edu=neta.get("education");
        ass=neta.get("assets");
        lia=neta.get("liabilities");
        cri=neta.get("criminalCases");
        pro=neta.get("profession");
        com=neta.get("numComments");
        fol=neta.get("numFollowers");
        icl=neta.get("numIsClaimed");
        ico=neta.get("numIsClosed");
        icv=neta.get("numIsValidated");
        ts=neta.get("numMembers");
        qa=neta.get("numQsAnswered");
        qat=neta.get("numQsAskedTo");
        py=p.get("name");
        queryPostTable();
      },
      error: function(error) {
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
            likes+=object.get("likes");
            dislikes+=object.get("dislikes");
            reach+=object.get("reach");
        }
        sup=likes;
        ske=dislikes;
        rea=reach;
        displayData();
      },
      error: function(error) {
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
    history.innerHTML=his;
    education.innerHTML=edu;
    assets.innerHTML=ass;
    liabilities.innerHTML=lia;
    criminalCases.innerHTML=cri;
    followers.innerHTML=fol;
    comments.innerHTML=com;
    questionsAsked.innerHTML=qa;
    questionsAnswered.innerHTML=qat;
    teamSize.innerHTML=ts;
    profession.innerHTML=pro;
    issuesClaimed.innerHTML=icl;
    issuesClosed.innerHTML=ico;
    issuesValidated.innerHTML=icv;
    reach.innerHTML=rea;
    supporters.innerHTML=sup+" supporters";
    supporters.style.width=(Math.floor((sup/(sup+ske))*99))+"%";
    supporters2.innerHTML=sup;
    skeptics.innerHTML=ske+" skeptics";
    skeptics.style.width=(Math.floor((ske/(sup+ske))*99))+"%";
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
