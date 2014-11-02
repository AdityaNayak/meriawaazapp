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
          document.getElementById("login").style.display = 'none';
      }
      else if(id==1){
          document.getElementById("login").style.display = 'inline';  
          document.getElementById("signup").style.display = 'none';  
      }
}


function signup() {
	  console.log("Inside Signup");
      var user = new Parse.User();
	  var form = document.getElementById("signup-form")

	  var email = form.email.value;
	  var password = form.password.value;
	  var confirmation = form.confirmation.value;

	  if(confirmation != password){
	  	alert("Passwords don't match. Please try again!");
	  	return false;
	  }

	  user.set("username", email);
	  user.set("password", password);
	  user.set("email", email);
	  console.log(email);

 	  user.signUp(null, {
	  	  success: function(user) {
		    console.log("Sign Up Ho Gaya!");
		    alert("Account Creation Successful. A verification mail has been sent to you. Please check your inbox to verify your email address.");
		    setVisibility(1);
		  },
		  error: function(user, error) {
		  	alert("An Error Occured! "+error.message);
		    console.log("Error: " + error.code + " " + error.message);
		  }
	  });
      return false;
}


function login() {
	  console.log("Inside Login");
	  var form = document.getElementById("login-form")

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
		      console.log("Error: " + error.code + " " + error.message);
		  }
	  });
      return false;
}

function resetPassword() {
	  var form = document.getElementById("login-form")
	  console.log("Reset Password");
	  var email = form.email.value;
      if(email === "") {
	      alert("Looks like you have forgotten your password! Enter your email in this form itself and click this link again. We will send you a mail that will allow you to reset your password.");
	      return;
	  }
	  else{
	  	  
	  	  alert("We are sending you a mail on "+email+" that will allow you to reset your password. Please follow the instruction in the mail.");
	  }
      Parse.User.requestPasswordReset(email, {
          success:function() {
              alert("Reset instructions have been emailed to you.");
          },
          error:function(error) {
              alert("An Error Occured! "+error.message);
          }
      });
      return false;
}




