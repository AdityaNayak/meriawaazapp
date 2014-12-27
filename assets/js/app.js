// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs

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