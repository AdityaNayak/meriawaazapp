// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();


function loadingButton_id(id){
	  var Original=document.getElementById(id).value;
	  document.getElementById(id).value = "Loading...";
	  $("#"+id).addClass('loading');
	  setTimeout(function() {
	  			$("#"+id).removeClass('loading');
		  		document.getElementById(id).value = Original;
		  }, 4000);
      console.log("Loading Button was Called!");
}

function loadingButton_ref(){
	  var Original=document.getElementById(this.id).value;
	  document.getElementById(this.id).value = "Loading...";
	  $(this).addClass('loading');
	  setTimeout(function() {
	  			$(this).removeClass('loading');
		  		document.getElementById(this.id).value = Original;
		  }, 4000);
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
		  }, 2000);
      console.log("Loading Button was Called!");
});