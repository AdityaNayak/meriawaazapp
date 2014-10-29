Parse.initialize('km3gtnQr78DlhMMWqMNCwDn4L1nR6zdBcMqzkUXt', 'BS9nk6ykTKiEabLX1CwDzy4FLT1UryRR6KsdRPJI');



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

	  user.set("username", email);
	  user.set("password", password);
	  console.log(email);

 	  user.signUp(null, {
	  	  success: function(user) {
		    console.log("Sign Up Ho Gaya!");
		  },
		  error: function(user, error) {
		    console.log("Error: " + error.code + " " + error.message);
		  }
	  });
      return false;
}


function login() {
	  console.log("Inside Login");
	  var form = document.getElementById("login-form")

	  var email = form.email.value;
	  console.log(email);
	  var password = form.password.value;
	  
	  var user = new Parse.User();

 	  user.logIn(email, password, {
		  success: function(user) {
	          console.log("Log In Ho Gaya!");
	        },
		  error: function(user, error) {
		      console.log("Error: " + error.code + " " + error.message);
		  }
	  });
      return false;
}




