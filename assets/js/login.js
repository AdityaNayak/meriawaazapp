Parse.initialize('jlQ5tv6KHzbRWhGcI0qXLAMsCVPf45efzqHBaqOt', 'q6AfL8e41Rl1vtYrjsDOVLpdFkgxT1mAH87wkqZH');

function initialize() {
    currentUser = Parse.User.current();
    if(currentUser) {
        self.location="./dashboard.html";
    }
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



