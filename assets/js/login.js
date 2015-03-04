

function initialize() {
	NProgress.start();
	console.log("NProgress Start");
	$('#signin-form').submit(function(event){
		event.preventDefault();
		login();
	});
	updateCounters();
    currentUser = Parse.User.current();
    if(currentUser) {
        self.location="./dashboard.html";
        NProgress.done();
    }
}




function updateCounters(){
	
	var Issues = Parse.Object.extend("Issue");
	var Netas = Parse.Object.extend("Neta");
	var Citizens = Parse.Object.extend("Citizen");
	var query1 = new Parse.Query(Issues);
	var query3 = new Parse.Query(Netas);
	var query2 = new Parse.Query(Citizens);
	query1.count({
	  success: function(count1) {
	    var numAnim1 = new countUp("num1", 0, count1+1000);
		numAnim1.start();
	  },
	  error: function(error) {
	    alert("Error: " + error.code + " " + error.message);
	  }
	});

	query2.count({
	  success: function(count2) {
	    var numAnim2 = new countUp("num2", 0, count2+1500);
		numAnim2.start();
	  },
	  error: function(error) {
	    alert("Error: " + error.code + " " + error.message);
	  }
	});

	query3.count({
	  success: function(count3) {
		var numAnim3 = new countUp("num3", 0, count3);
		numAnim3.start();
		NProgress.done();
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

 function login(){
 	  NProgress.start();
 	  console.log("Inside Login");
 	  //loading();
 	  loadingButton_id("signin-btn",12);
 	  var form = document.getElementById("signin-form");
 	  var username = form.username.value;
 	  console.log(username);
 	  var password = form.password.value;
 	  console.log("Username used");
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
 		  	  	alert("An Error Occured!"+error.message);
 		  	  }	
 		      console.log("Error: " + error.code + " " + error.message);
 		  }
 	  });
 	  $('#signin-btn').focus(function() {
         this.blur();
       });
 	  //hide();
       return false;
 }

// function login() {
// 	  NProgress.start();
// 	  console.log("Inside Login");
// 	  //loading();
// 	  loadingButton_id("signin-btn",12);
// 	  var form = document.getElementById("signin-form")

// 	  var username = form.email.value;
// 	  console.log(username);
// 	  var password = form.password.value;
//       if(username.indexOf('@') === 1){
//       		console.log("Email used");
//       		ListItem = Parse.Object.extend("User");
// 		    query = new Parse.Query(ListItem);
// 		    query.equalTo("email", username);
// 		    query.ascending('createdAt');
// 		    query.find({
// 		          success: function(results) {
// 		          		if(results.length==0){
// 		          			NProgress.done();
// 		          			alert("An Error Occured! Username or Password are Invalid");
// 			          		}
// 		          		else{
// 		          			username=results[0].get("username");
// 		          			Parse.User.logIn(username, password, {
// 							  success: function(user) {
// 							  	  NProgress.done();	
// 						          console.log("Log In Ho Gaya!");
// 						          currentUser = Parse.User.current();
// 						          self.location="./dashboard.html";
// 						          NProgress.done();
// 						        },
// 							  error: function(user, error) {
// 							  	  NProgress.done();
// 							  	  if(error.code==101){
// 							  	  	alert("An Error Occured!"+error.message);
// 		          					}	
// 							      console.log("Error: " + error.code + " " + error.message);
// 							  }
// 						  	});
// 						  }
// 		          		},
// 				  error: function(error) {
// 				  		if(error.code==101){
// 					  	  	alert("An Error Occured!"+error.message);
// 					  	}	
// 		                console.log("Error: " + error.code + " " + error.message);
// 		          }
// 		   });		          		
//       }
//       else{
//       		Parse.User.logIn(username, password, {
// 			  success: function(user) {
// 		          console.log("Log In Ho Gaya!");
// 		          currentUser = Parse.User.current();
// 		          self.location="./dashboard.html";
// 		          NProgress.done();
// 		        },
// 			  error: function(user, error) {
// 			  	  NProgress.done();
// 			  	  if(error.code==101){
// 			  	  	alert("An Error Occured!"+error.message);
// 			  	  }	
// 			      console.log("Error: " + error.code + " " + error.message);
// 			  }
// 		  	});
//       }
 	  

// 	  //setTimeout(hide, 3000);
// 	  $('#signin-btn').focus(function() {
//         this.blur();
//       });
// 	  //hide();
//       return false;
// }

function resetPassword() {
	  console.log("Reset Password");
	  NProgress.start();
	  loading();
	  var email = prompt("Please enter your Email ID: ", "");
	  if (email != null) {
	    Parse.User.requestPasswordReset(email, {
          success:function() {
              alert("Reset instructions have been emailed to you.");
          },
          error:function(error) {
            alert("An Error Occured!"+error.message);
          }
      	});	
	  }
	  else{
	  	resetPassword();
	  	return;
	  }      
	  NProgress.done();
      //setTimeout(hide, 3000);
      //hide();
      return false;
}



