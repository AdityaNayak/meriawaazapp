$(document).foundation();
    $('#step0-trg').click(function(){
      $('#step0').fadeOut();
      $('#step1').delay(300).fadeIn();
    });
    $('#step0a-trg').click(function(){
      $('#step0a').fadeOut();
      $('#step1a').delay(300).fadeIn();
    });
    $('#mostoTrg').click(function(){
      $('#mosto').fadeIn();
      $('#pinnacle').fadeOut();
    });
    $('#pinnacleTrg').click(function(){
      $('#pinnacle').fadeIn();
      $('#mosto').fadeOut();
    });

$("#addVendor").submit(function(event){
	var creds = [];
	event.preventDefault();
	creds.push($('#un').val());
	creds.push($('#pw').val());
	var senderID = $('#si').val();
	fetchBilling(creds,senderID);
});

function fetchBilling(creds,senderID){
	Parse.Cloud.run('addVendorCreds', {Creds: creds, SenderID: senderID}, {
	  success: function(result) {
	    console.log(result);
	    notify("Vendor successfully added","success",3);
	    $('#step1a').fadeOut();
	    $('#step0a-trg').hide();
	    $('#step0a').delay(400).fadeIn();
	  },
	  error: function(error) {
	  	console.log(error);
	  }
	});
}