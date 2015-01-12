// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs

var count = 0 ;
var CU;

Parse.initialize("km3gtnQr78DlhMMWqMNCwDn4L1nR6zdBcMqzkUXt", "BS9nk6ykTKiEabLX1CwDzy4FLT1UryRR6KsdRPJI");

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
		    
		    ListItem = Parse.Object.extend("User");
		    query = new Parse.Query(ListItem);
		    query.equalTo("objectId", CU.id);
		    query.include("neta");
		    query.include(["neta.party"]);
		    query.include(["neta.constituency"]);
		    query.include("teamMember");
		    query.include(["teamMember.neta"]);
		    query.include(["teamMember.neta.party"]);
		    query.include(["teamMember.neta.constituency"]);
		    query.ascending('createdAt');
		    query.find({
		          success: function(results) {

		                console.log("Size:"+results.length);
		                var plogo=document.getElementById('plogo');
		                var consti=document.getElementById('consti');
		                CU=results[0];
		                object=results[0];
		                var p;
		                if(object.get("type")=="neta"){
		                	var n=object.get("neta");
		                	p=n.get("party");	
		                	consti.innerHTML=n.get("constituency").get("name");
		                	constituency=n.get("constituency");
		                }
		                if(object.get("type")=="teamMember"){
		                	var t=object.get("teamMember");
		                	p=t.get("neta").get("party");
		                	consti.innerHTML=t.get("neta").get("constituency").get("name");
		                	constituency=t.get("neta").get("constituency");
		                }
		                if(p.get("logo").url()!=undefined){
	                		plogo.src=p.get("logo").url();
	                	}

	                	object.set("lastFetched",new Date());
	                	object.save();
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

function loadingButton_id(id,d){
	var Original=document.getElementById(id).value;
	console.log("Original: "+Original );
	document.getElementById(id).value = "Loading...";
	$("#"+id).addClass('loading');
	var ref=this;
	setTimeout(function() {
		$("#"+id).removeClass('loading');
		console.log("Changing value to "+Original);
		document.getElementById(id).value = Original;
	}, d*1000);
	console.log("Loading Button was Called!");
}

function loadingButton_ref(d){
	var Original=document.getElementById(this.id).value;
	document.getElementById(this.id).value = "Loading...";
	$(this).addClass('loading');
	setTimeout(function() {
		$(this).removeClass('loading');
		document.getElementById(this.id).value = Original;
	}, d*1000);
	console.log("Loading Button was Called!");
}

$('.interactiveLoading').click(function() {
	var Original=document.getElementById(this.id).value;
	document.getElementById(this.id).value = "Loading...";
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