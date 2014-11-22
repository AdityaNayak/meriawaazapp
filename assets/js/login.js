Parse.initialize('km3gtnQr78DlhMMWqMNCwDn4L1nR6zdBcMqzkUXt', 'BS9nk6ykTKiEabLX1CwDzy4FLT1UryRR6KsdRPJI');

function initialize() {
    currentUser = Parse.User.current();
    if(currentUser) {
        self.location="./dashboard.html";
    }
}

function setVisibility(id) {
      if(id==0){
          document.getElementById("signup").style.display = 'inline';  
          document.getElementById("signin").style.display = 'none';
      }
      else if(id==1){
          document.getElementById("signin").style.display = 'inline';  
          document.getElementById("signup").style.display = 'none';  
      }
}

function loading() {
	  console.log("I am shown!");
	  document.getElementById("load").style.display = 'inline';  
}

function hide(){
	  console.log("Lets Hide!");	
	  document.getElementById("load").style.display = 'none';
}

function signup() {
	  
	  console.log("Inside Signup");
	  loading();
      var user = new Parse.User();
	  var form = document.getElementById("signup-form")

	  var email = form.email.value;
	  var password = form.password.value;
	  var confirmation = form.confirmation.value;

	  if(confirmation != password){

	  	setTimeout(hide, 3000);
	  	//hide();
	  	alert("Passwords don't match. Please try again!");
	  	form.password.value="";
	  	form.confirmation.value="";
	  	return false;
	  }

	  user.set("username", email);
	  user.set("password", password);
	  user.set("email", email);
	  console.log(email);

 	  user.signUp(null, {
	  	  success: function(user) {
		    console.log("Sign Up Ho Gaya!");
		    alert("Account Creation Successful. A verification mail has been sent to you. Please check your inbox to verify your email address after which you can log in here.");
		    setVisibility(1);
		    
		  },
		  error: function(user, error) {
		  	
		  	alert("An Error Occured! "+error.message);
		    console.log("Error: " + error.code + " " + error.message);
		  }
	  });
	  setTimeout(hide, 3000);
	  //hide();
      return false;
}


function login() {
	  console.log("Inside Login");
	  loading();
	  var form = document.getElementById("signin-form")

	  var username = form.email.value;
	  console.log(username);
	  var password = form.password.value;
      
 	  Parse.User.logIn(username, password, {
		  success: function(user) {
	          console.log("Log In Ho Gaya!");
	          currentUser = Parse.User.current();
	          self.location="./dashboard.html";
	        },
		  error: function(user, error) {
		  	  alert("An Error Occured! "+error.message);
		      console.log("Error: " + error.code + " " + error.message);
		  }
	  });
	  setTimeout(hide, 3000);
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




