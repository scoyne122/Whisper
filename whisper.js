$(document).ready(function() {


//VARIABLES
var height = $(window).height();
var width = $(window).width();
var mouseX1;
var mouseY1;
var x;
var y;
var user = Math.random();
var colors = ["red", "blue", "orange", "pink", "purple", "aqua", "green", "cyan", "gold", "DeepPink", "indigo", "LawnGreen", "Lime", "Teal", "SeaGreen", "Brown", "SlateBlue", "violet", "SpringGreen", "RoyalBlue", "MidnightBlue"];
var myColor = colors[Math.floor(Math.random()*colors.length)];
var medium = "Text";
var drawing = true;
classNum = Math.floor(Math.random()*1000);
var onDraw = false;






/*
*establish pubnub
*/
var pubnub = PUBNUB.init({
	publish_key: 'pub-c-77b6eb56-aa8e-4737-88c4-9e5912d09135',
	subscribe_key: 'sub-c-21ad3e0e-3da8-11e4-9201-02ee2ddab7fe'
});


//subscribe to channel
pubnub.subscribe({
	channel: 'channel',
	message: function(m) {
		if (m.why === "new" && m.user != user) {
			console.log("p");
			var theLeft = m.x * width;
			var theTop = m.y * height - 15;
			$("body").append('<p id='+m.id+' style="position:fixed; font-size:35pt; color:'+m.color+'; left:'+theLeft+'px; top:'+theTop+'px; font-family: "Times New Roman", Times, serif;"></p>')
		}
		else if (m.why === "edit") {
			$("#"+m.id).text(m.value)
		}
		else if (m.why === "fade") {
			$("#"+m.id).fadeOut(function() {$("#"+m.id).remove()})
		}
		else if (m.why === "dot") {
			$('#bar').after('<div class="'+m.class+'" style="height:15pt; width:15pt; border-radius:100%; position:fixed; left:'+m.x*width+'vw; top:'+m.y*height+'vh; background-color:'+m.color+'"</div>')
		}
		else if (m.why === "fadeDot") {
			$('.'+m.class).fadeOut()
		}
	}
});


//publish
function pub(mess) {
	pubnub.publish({
		channel: 'channel',
		message: mess
	})
}







//$("#the").focus();
//mouse move
document.onmousemove=function (e) {
    //mouse positions by pixels
	mouseX1 = e.offsetX;
    mouseY1 = e.offsetY;
	//percentage of screen it it at
	x = mouseX1 / width;
	y = mouseY1 / height;
};

$(document).click(function() {
	$("#the").focus();
	var id = Math.floor(Math.random()*100);
	if (y > .075 && medium === "Text") {
		pub({
			'user': user,
			'why': "new",
			'x': x,
			'y': y,
			'id': id,
			'color': myColor
		})
		makeText(x, y, id);
	}
})




function makeText(a, b, i) {
	var left = a * width;
	var topp = b * height - 15;
	var wid = width - left - 10;
	var timeLeft = 2;
	$('body').append('<input type="text" id="'+i+'" spellcheck="false" style="height:41pt; color:'+myColor+'; position:fixed; font-size:35pt; border:none; outline:none; left:'+left+'px; top:'+topp+'px; width:'+wid+'px"></input>');
	$("#"+i).focus();
	$("#"+i).keyup(function() {
		timeLeft = 2;
		pub({
			'user': user,
			'why': "edit",
			'id': i,
			'value': document.getElementById(i).value
		})
	})
	$("#"+i).keydown(function() {
		timeLeft = 20;
	})
	function checkForTime() {
		if (timeLeft > 1) {
			timeLeft -= 1;
		}
		else {
			$("#"+i).fadeOut(function(){$("#"+i).remove()});
			pub({
				'user': user,
				'why': "fade",
				'id': i
			})
			clearInterval(loopTillDone);
		}
	}
	var loopTillDone = setInterval(function() {checkForTime()},800)
}








})