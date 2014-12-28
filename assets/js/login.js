Parse.initialize('jlQ5tv6KHzbRWhGcI0qXLAMsCVPf45efzqHBaqOt', 'q6AfL8e41Rl1vtYrjsDOVLpdFkgxT1mAH87wkqZH');

function initialize() {
    currentUser = Parse.User.current();
    if(currentUser) {
        self.location="./dashboard.html";
    }
}

function updateCounters(){
	var Issues = Parse.Object.extend("Issue");
	var Users = Parse.Object.extend("User");
	var query1 = new Parse.Query(Issues);
	var query2 = new Parse.Query(Users);
	var a=0;
	var b=0;
	var c=0;
	query1.find({
	  success: function(results) {
	  	console.log(results.length);
	    a=results.length;
	    var numAnim1 = new countUp("num1", 0, a);
		numAnim1.start();
	  },
	  error: function(error) {
	    alert("Error: " + error.code + " " + error.message);
	  }

		
	});
	query2.find({
	  success: function(results) {
	  	console.log(results.length);
	    for(var i=0;i<results.length;i++){
	    	if(results[i].get("type")=="neta" || results[i].get("type")=="teamMember"){
	    		c+=1;
	    	}
	    	else{
	    		b+=1;
	    	}
	    }
	    var numAnim2 = new countUp("num2", 0, b);
		numAnim2.start();
		var numAnim3 = new countUp("num3", 0, c);
		numAnim3.start();
	  },
	  error: function(error) {
	    alert("Error: " + error.code + " " + error.message);
	  }
	});
	
}

function loading() {
	  console.log("I am changing the Inner Html Content");
	  //$('#signin-btn').innerHTML = "Loading...";
	  document.getElementById("signin-btn").value = "Loading...";
}

function hide(){
	  console.log("Lets changing the Inner Html Content back!");	
	  //$('#signin-btn').innerHTML = "Sign In";
	  document.getElementById("signin-btn").value = "Sign In";
}

function login() {
	  NProgress.start();
	  console.log("Inside Login");
	  //loading();
	  loadingButton_id("signin-btn",12);
	  var form = document.getElementById("signin-form")

	  var username = form.email.value;
	  console.log(username);
	  var password = form.password.value;
      if(username.indexOf('@') === -1){
      		console.log("Username used");
      		ListItem = Parse.Object.extend("User");
		    query = new Parse.Query(ListItem);
		    query.equalTo("uname", username);
		    query.ascending('createdAt');
		    query.find({
		          success: function(results) {
		          		if(results.length==0){
		          			NProgress.done();
		          			alert("An Error Occured! "+"invalid login parameters");
		          		}
		          		else{
		          			username=results[0].get("email");
		          			Parse.User.logIn(username, password, {
							  success: function(user) {
							  	  NProgress.done();	
						          console.log("Log In Ho Gaya!");
						          currentUser = Parse.User.current();
						          self.location="./dashboard.html";
						          NProgress.done();
						        },
							  error: function(user, error) {
							  	  NProgress.done();
							  	  if(error.code==101){
							  	  	alert("An Error Occured! "+error.message);
							  	  }	
							      console.log("Error: " + error.code + " " + error.message);
							  }
						  	});
						  }
		          		},
				  error: function(error) {
		                alert("An Error Occured! "+error.message);
		          }
		   });		          		
		          
      }
      else{
      		Parse.User.logIn(username, password, {
			  success: function(user) {
		          console.log("Log In Ho Gaya!");
		          currentUser = Parse.User.current();
		          self.location="./dashboard.html";
		          NProgress.done();
		        },
			  error: function(user, error) {
			  	  NProgress.done();
			  	  if(error.code==101){
			  	  	alert("An Error Occured! "+error.message);
			  	  }	
			      console.log("Error: " + error.code + " " + error.message);
			  }
		  	});
      }
 	  

	  //setTimeout(hide, 3000);
	  $('#signin-btn').focus(function() {
        this.blur();
      });
	  //hide();
      return false;
}

function resetPassword() {
	  console.log("Reset Password");
	  loading();
	  var form = document.getElementById("signin-form");
	  var email = form.email.value;
      if(email === "") {
	      alert("Looks like you have forgotten your password! Enter your email in this form itself and click this link again. We will send you a mail that will allow you to reset your password.");
	      setTimeout(hide, 3000);
	      //hide();
	      return;
	  }
      Parse.User.requestPasswordReset(email, {
          success:function() {
              alert("Reset instructions have been emailed to you.");
          },
          error:function(error) {
              alert("An Error Occured! "+error.message);
              
          }
      });
      setTimeout(hide, 3000);
      //hide();
      return false;
}



