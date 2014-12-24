// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

var count = 0 ;
  
function updateHistory()
{
	
}
  

function loadingButton_id(id){
	  var Original=document.getElementById(id).value;
	  console.log("Original: "+Original );
	  document.getElementById(id).value = "Loading...";
	  $("#"+id).addClass('loading');
	  var ref=this;
	  setTimeout(function() {
	  			$("#"+id).removeClass('loading');
	  			console.log("Changing value to "+Original);
		  		document.getElementById(id).value = Original;
		  }, 12000);
      console.log("Loading Button was Called!");
}

function loadingButton_ref(){
	  var Original=document.getElementById(this.id).value;
	  document.getElementById(this.id).value = "Loading...";
	  $(this).addClass('loading');
	  setTimeout(function() {
	  			$(this).removeClass('loading');
		  		document.getElementById(this.id).value = Original;
		  }, 12000);
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