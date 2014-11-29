/*---------  Map -------*/
var bbva_results = [
		"avg",
		"date",
		"max",
		"min",
		"mode",
		"num_cards",
		"num_merchants",
		"num_payments",
		"peak_payments_day",
		"peak_payments_hour",
		"std",
		"valley_payments_day",
		"valley_payments_hour"
];

var poblacion = {
	"0":"Selecciona una opción",
	"Sum_POB1":"Población total",
	"Sum_POB8":"Población de 0 a 14 años",
	"Sum_POB11":"Población de 15 a 29 años",
	"Sum_POB13":"Población de 18 a 24 años",
	"Sum_POB14":"Población de 30 a 49 años",
	"Sum_POB15":"Población de 50 a 59 años",
	"Sum_POB21":"Población de 18 años y más",
	"Sum_POB23":"Población de 60 años y más",
	"Sum_POB31":"Población femenina",
	"Sum_POB38":"Población femenina de 0 a 14 años",
	"Sum_POB41":"Población femenina de 5 a 29 años",
	"Sum_POB44":"Población femenina de 8 a 24 años",
	"Sum_POB45":"Población femenina de 0 a 49 años",
	"Sum_POB46":"Población femenina de 0 a 59 años",
	"Sum_POB52":"Población femenina de 18 años y más",
	"Sum_POB54":"Población femenina de 60 años y más",
	"Sum_POB57":"Población masculina",
	"Sum_POB64":"Población masculina de 0 a 14 años",
	"Sum_POB67":"Población masculina de 5 a 29 años",
	"Sum_POB69":"Población masculina de 8 a 24 años",
	"Sum_POB70":"Población masculina de 0 a 49 años",
	"Sum_POB71":"Población masculina de 0 a 59 años",
	"Sum_POB77":"Población masculina de 18 años y más",
	"Sum_POB79":"Población masculina de 60 años y más",
	"Sum_MIG7":"Población nacida en otro país"
};

var vivienda = {
	"0":"Selecciona una opción",
	"Sum_VIV1":"Total de viviendas habitadas",
	"Sum_VIV28":"Viviendas particulares habitadas que disponen de automóvil o camioneta",
	"Sum_VIV33":"Viviendas particulares habitadas que disponen de computadora",
	"Sum_VIV36":"Viviendas particulares habitadas que disponen de internet"
};

var economico = {
	"0":"Selecciona una opción",
	"Sum_ECO4":"Población ocupada",
	"Sum_ECO5":"Población femenina ocupada",
	"Sum_ECO6":"Población masculina ocupada"
}

var educacion = {
	"0":"Selecciona una opción",
	"Sum_EDU40":"Población de 15 años y más con educación pos-básica.",
	"Sum_EDU43":"Población de 18 años y más con al menos un grado aprobado en educación media superior",
	"Sum_EDU46":"Población de 25 años y más con al menos un grado aprobado en educación superior"
}

var unidadeseconomicas = {
	"0":"Selecciona una opción",
	"Sum_SCONY1":"Población soltera o nunca unida de 12 años y más",
	"Sum_SCONY4":"Población casada o unida de 12 años y más"
}

$(function() {
	$('.openSC').click(function(event) {
		$('.selecciona-ciudad').toggleClass('showSC');
		$('.nav').toggleClass('showSC');
	});
});

$(document).ready(function() {
	/* ----------- Datos BBVA ----------------------------*/
	/*$.each(bbva_results, function(val, text) {
		$('.response_bbva').append( $('<tr><td>'+val+'</td></tr>'));
	});
	*/
	
	var firstSelect = $("#first-select");
	var secondSelect = $("#second-select");
	
	firstSelect.change(function(event) {
		event.preventDefault();
		inegi($(this).val());
	});
	
	inegi("Sum_POB1");
	$("#second-select option:nth-child(2)").attr("selected", "selected");
	
	secondSelect.change(function(event) {
		event.preventDefault();
		propertySelected = $(this).val();
		if(propertySelected != "0") {
			printResults(dataGeoJson);
		}
	});
});

function inegi(value) {
	var firstSelect = $("#first-select");
	var secondSelect = $("#second-select");
	
	var firstValue = value;
		
	switch (firstValue) {
		case "Sum_POB1":
			secondSelect.children('option').remove();
			$.each(poblacion, function(val, text) {
				secondSelect.append( $('<option></option>').val(val).html(text));
			});
	    break;
    	case "Sum_VIV1":
    		secondSelect.children('option').remove();
    		$.each(vivienda, function(val, text) {
    			secondSelect.append( $('<option></option>').val(val).html(text));
    		});
        break;
    	case "Sum_ECO4":
    		secondSelect.children('option').remove();
    		$.each(economico, function(val, text) {
    			secondSelect.append( $('<option></option>').val(val).html(text));
    		});
        break;
		case "Educa":
			secondSelect.children('option').remove();
			$.each(educacion, function(val, text) {
				secondSelect.append( $('<option></option>').val(val).html(text));
			});
		break;
		case "Conyugal":
			secondSelect.children('option').remove();
			$.each(conyugal, function(val, text) {
				secondSelect.append( $('<option></option>').val(val).html(text));
			});
		break;
		case "Unidades":
			secondSelect.children('option').remove();
			$.each(conyugal, function(val, text) {
				secondSelect.append( $('<option></option>').val(val).html(text));
			});
		break;
	}
}

/*----------------------------------------------------------------------------------------------------*/



/*---------  Backstretch -------*/

$(function() {
$.backstretch("img/background.png");
});

/*---------  Video Hover and Popup -------*/

$(function() {
	$(".video ")
	.find("span")
	.hide()
	.end()
	.hover(function() {
		$(this).find("span").stop(true, true).fadeIn();
		
	}, function() {
		$(this).find("span").stop(true, true).fadeOut();
	});
});
 

/*--------- Subscriber Fixed nav -------*/
 
$(document).ready(function() {
	var s = $(".sub-wrap");
	var pos = s.position();
	console.log(pos);               
	$(window).scroll(function() {
		var windowpos = $(window).scrollTop();
		console.log(windowpos);
		console.log(pos);
		
		if (windowpos >= pos) {
			s.addClass("stick");
			$("#subscriber").addClass("suby", "0");			 
			$(".main-content").addClass("suby2");			 
		 
		} else {
			s.removeClass("stick");
			$("#subscriber").removeClass("suby", "0");
			 $(".main-content").removeClass("suby2");			 			 

		}
	});
});


/*--------- Features Hover  -------*/

$(document).ready(function(){
$(".featu").hover(
function() {
$(".icon", this).toggleClass("icon-hover", 300);
$(this).toggleClass("featu-hover", 300);

},
function() {
$(".icon", this).toggleClass("icon-hover", 300);
$(this).toggleClass("featu-hover", 300);
});

});


/*--------- Tabbed Section  -------*/

$(function() {$( "#tabs" ).tabs({ fx: {
			opacity:'toggle'   
		} , active: 0 });});
		
$(function() {$( "#tabs2" ).tabs({ fx: {
			opacity:'toggle'   
		} , active: 0 });});
		
/*--------- Screenshots  -------*/
		
$(document).ready(function(){
$("img.b").hover(
function() {
$(this).stop().animate({"opacity": "1","-ms-filter":"progid:DXImageTransform.Microsoft.Alpha(opacity=100)"}, "800");
},
function() {
$(this).stop().animate({"opacity": "0","-ms-filter":"progid:DXImageTransform.Microsoft.Alpha(opacity=0)"}, "fast");
});

});


/*--------- Partners Hover  -------*/

$(document).ready(function(){
$(".prt").hover(
function() {
$(this).toggleClass("prt-active", 300);
 

},
function() {
$(this).toggleClass("prt-active", 300); 
});

});



/*--------- Video Popup  -------*/
$(document).ready(function(){


var ifra;
$(".video").click(function(){
if ( ifra ) {
ifra.appendTo("body");
ifra = null;
}  
$("#overlay_form").fadeIn(1000);
 $("#popi-bg").css({
"opacity": "0.7"
}); 
$("#popi-bg").fadeIn("slow");
positionPopup();
});




$("#close2, #popi-bg").click(function(){
 

$("#overlay_form").fadeOut(500);
 
$("#popi-bg").fadeOut("slow");
if ( ifra ) {
ifra.appendTo("body");
ifra = null;
} else {
ifra = $("#overlay_form").detach();
}

});
 
});

function positionPopup(){
if(!$("#overlay_form").is(':visible')){
return;
}
$("#overlay_form").css({
left: ($(window).width() - $('#overlay_form').width()) / 2.2,
top: ($(window).width() - $('#overlay_form').width()) / 7,
position:'absolute'
});
}
$(window).bind('resize',positionPopup);

/*--------- Scroll Top  -------*/
$(document).ready(function(){
$(".scroll-top a").click(function() {
  $('html,body').animate({scrollTop: $("#htop").offset().top},
		"9000");
  return false;
});
});

/*---------	Contact Form  -------*/
 
 $(document).ready(function(){
 
$('#send').click(function(){
 
$.post("mailer.php", $("#contactform").serialize(),  function(response) {
$('#success').html(response);
//$('#success').hide('slow');
});
return false;
 
});
 
});
