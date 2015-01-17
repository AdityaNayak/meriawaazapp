var nump;
var numc;
var candidatesAAP=[];
var candidatesBJP=[];
var candidatesCON=[];
function populateCandidates(){
	var Candidates= Parse.Object.extend("Election");
	var query=new Parse.Query(Candidates);
	query.equalTo("code","DC15");
	query.include("neta");
	query.include(["neta.party"]);
	query.include(["neta.user"]);
	query.find(){
		success:function(results){
			for(var i=0;i<results.length;i++){
				var consti=results[i].get("arrayNetas");
				for(var j=0;j<consti.length;j++){
					var neta=consti[j];
					if(neta.get("party").get("code")==3){
						candidatesAAP.push(neta);
					}
					else if(neta.get("party").get("code")==4){
						candidatesBJP.push(neta);
					}
					else if(neta.get("party").get("code")==2){
						candidatesCON.push(neta);
					}
					else{
						
					}
				}
			}
			displayCandidates();
		},
		error:function(error){
			console.log("Error: "+error.message);
		}
	}
	NProgress.done();
}

function displayCandidates(){
	
}

function initialize(){
	NProgress.start();
	populateCandaidates();
}

initialize();