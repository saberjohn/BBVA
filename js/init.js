/**
* Javascript for custom map 
* Copyright (c) Carlos Hugo Gonzalez Castell, http://www.caarloshugo.info
* Licensed under the MIT license
*/
L.mapbox.accessToken = 'pk.eyJ1IjoiY2Fhcmxvc2h1Z28xIiwiYSI6IklmZGNsNmMifQ.JJksWU3hBP-Vd3S9WtjFsA';
var map     = L.mapbox.map('map', 'caarloshugo1.h9bggm26').setView([19.4313054168727, -99.1347885131836], 11);
var bounds  = map.getBounds();
var baseurl = "http://bbva-api.appdata.mx";
var data    = false;
var datazipcode	= [];
var sMarker = false;

//set geojson with data state
var dataGeoJson = DFGeoJson;

/*var selected property val*/
var propertySelected = "Sum_POB1";

//Layer Groups
var polygonsGroup     = new L.LayerGroup();
var polygonsCustGroup = new L.LayerGroup();
var polylinesGroup	  = new L.LayerGroup();
var polylinesGroup2	  = new L.LayerGroup();
var markersCustZC	  = new L.LayerGroup();

//Sidebars
var leftSidebar = L.control.sidebar('sidebar-left', {
	position: 'left'
});
map.addControl(leftSidebar);

var rightSidebar = L.control.sidebar('sidebar-right', {
	position: 'right'
});
map.addControl(rightSidebar);
rightSidebar.show();

map.on('click', function () {
	leftSidebar.hide();
	rightSidebar.hide();
});
	
/*Remove layers*/
function removeLayers(drawnF) {
	drawnF = (drawnF == false) ? drawnF : true;
	
	$(".loading").show();
	
	//Layers
	polygonsGroup.clearLayers();
	polygonsCustGroup.clearLayers();
	polylinesGroup.clearLayers();
	polylinesGroup2.clearLayers();
}

/*on ready*/
$(document).ready( function () {
	//hide loading GIF
	$(".loading").hide();
	$("#banner-slide").hide();
		
	Highcharts.setOptions({
		lang: {
			months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
			weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
		}
	});
	
	printResults(dataGeoJson);
	
	$('#banner-slide').bjqs({
		height		: 400,
		width		: 500,
		automatic	: false
	});
	
	$("#graph-type").change( function () {
		if(sMarker) {
			getSeries(datazipcode[sMarker.options.ZipCode]);
		} else {
			console.log("Selecciona un código postal del mapa");
		}
	});
	
	$("#focus-city li a").click( function () {
		$('.selecciona-ciudad').toggleClass('showSC');
		$('.nav').toggleClass('showSC');

		$("#focus-city li").removeClass('active');
		$(this).parent().addClass('active');
		
		leftSidebar.hide();
		rightSidebar.hide();
		
		focusCity($(this).attr("id"));
	});
});

/*print geojson zipcodes by city*/
function printResults(d) {
	polygonsGroup.clearLayers();
	
	var zoom  = map._zoom;
	var items = [];
	jQuery.each(d.features, function(i, val) { items.push(val.properties[propertySelected]); });
	var serie = new geostats();
	serie.setSerie(items);
	var color_x = new Array('#FFD4C4', '#FF8069', '#E84E3D', '#E63629');
	var test	= serie.getClassJenks(4);
	var ranges  = serie.ranges;
   	serie.setColors(color_x);
   	
   	function getClass(val, a) {
		var separator = ' - '
		
		// return 2;
		for(var i= 0; i < a.length; i++) {
			// all classification except uniqueValues
			if(a[i].indexOf(separator) != -1) {
				var item = a[i].split(separator);
				if(val <= parseFloat(item[1])) {return i;}
			} else {
				// uniqueValues classification
				if(val == a[i]) {
					return i;
				}
			}
		}
	}
	
	var polygons = L.geoJson(d, {
		onEachFeature: onEachFeature,
		style: function(feature) { return { fillOpacity: 0.6, opacity: 0.7, weight: 1.2, color: "#fff", fillColor: color_x[getClass(feature.properties[propertySelected], ranges)] }; }
	});
	
	polygonsGroup.addLayer(polygons);
	polygonsGroup.addTo(map);
		
	function onEachFeature(feature, layer) {
		layer.on('click', function(e) {
			map.removeLayer(sMarker);	
			sMarker = L.marker([e.latlng.lat, e.latlng.lng], { ZipCode : feature.properties.ZipCode }).addTo(map);
			sMarker.bindPopup("Código postal: " + feature.properties.ZipCode)/*.openPopup()*/;
			getBasicStats(feature.properties.ZipCode);
			sMarker.on('click', function () { leftSidebar.show(); });
		});
	}

	$('.number').number(true, 2);
}

/*get zipcode from point*/
function getZipcodeFromPoint(point) {
	if(point == undefined) {
		return false;
	} else {
		var point1 = new L.LatLng(point.lat, point.lng);
	}
	
	var layer = leafletPip.pointInLayer(point1, L.geoJson(dataGeoJson), true);
	
	if(layer.length) {
		return layer[0].feature.properties.ZipCode;
	} else {
	  return false;
	}
}

/*get data from ajax api*/
function getBasicStats(zipcode, point) {
	$('.zipcode').text(zipcode);
	markersCustZC.clearLayers();
	polylinesGroup.clearLayers();
	
	if(datazipcode[zipcode] == undefined) {
		if(zipcode && zipcode != undefined) {
			$(".loading").show();
			$('#banner-slide').hide();
			
			$.ajax({
				cache: false,
				type: 'POST', 
				url: baseurl + '/basic-stats/' + zipcode + '/',
				success: function (d) {
					console.log(d);
					
					//set global array data buffer
					datazipcode[zipcode] = d;
					getSeries(d);
					$(".loading").hide();
				},
				error: function (response) {
					$(".loading").hide();
				}
			});
		}
	} else {
		//load buffer local
		getSeries(datazipcode[zipcode]);
	}
	var dataZP = false;
	
	L.geoJson(dataGeoJson, {
		filter: function (feature, layer) {
			if(zipcode == feature.properties.ZipCode) dataZP = feature.properties;
			return false;
		}
	});
	
	var listdata = $("#listdata");
	listdata.html("");
	$.each(poblacion, function(val, text) {
		if(dataZP[val] != undefined) {
			listdata.append($('<li></li>').html(text + ":" + " <span class='number'>" + dataZP[val] + "</span>"));
		}
	});
	
	$('.number').number(true, 10);
	map.setView([sMarker._latlng.lat, sMarker._latlng.lng, map._zoom]);
}

function getSeries(d) {
	$('#banner-slide ul li').remove();
	$('#banner-slide .bjqs-markers').remove();
	$('#banner-slide .bjqs-controls').remove();
				
	var graphType = $("#graph-type option:selected").val();
	
	if(d.day == undefined || d.day == false) {
		var day = false;
	} else {
		var day = [];
		jQuery.each(d.day.stats, function(i, val) {
			if(val[graphType] == undefined) {
				day.push(0);
			} else {
				day.push(val[graphType]);
			}
		});
	}
		
	var gender_distribution = false;
	
	if(d.gender_distribution == undefined || d.gender_distribution == false) {
		gender_distribution = false;
	} else {
		gender_distribution = { male : [], female : [] };
		
		jQuery.each(d.gender_distribution.stats, function(i, val) {
			if(val.histogram.length == 0) {
				gender_distribution.male.push(0);
				gender_distribution.female.push(0);
			} else {
				if(val.histogram[0][graphType] == undefined) {
					gender_distribution.male.push(0);
					gender_distribution.female.push(0);
				} else if(val.histogram.length == 1) {
					if(val.histogram[0].gender == "M") {
						gender_distribution.male.push(0);
						gender_distribution.female.push(val.histogram[0][graphType]);
					} else {
						gender_distribution.female.push(0);
						gender_distribution.male.push(val.histogram[0][graphType]);
					}
				} else if(val.histogram.length == 2) {
					if(val.histogram[0].gender == "M") {
						gender_distribution.female.push(val.histogram[0][graphType]);
					} else {
						gender_distribution.male.push(val.histogram[0][graphType]);
					}
					
					if(val.histogram[1].gender == "M") {
						gender_distribution.female.push(val.histogram[1][graphType]);
					} else {
						gender_distribution.male.push(val.histogram[1][graphType]);
					}
				}
			}
		});
	}
	
	if(gender_distribution == false && day == false) {
		console.log("No se encontraron datos por día y genero para este código postal");
	} else {
		getTimeSeriesChart(day, gender_distribution);
	}
	
	if(d.age_distribution == undefined || d.age_distribution == false) {
		console.log("No se encontraron datos rango de edades para este código postal");
		var age_distribution = false;
	} else {
		
		if(graphType == "num_cards") graphType = "num_payments";
		
		var age_distribution = { a1925 : [], a2635 : [], a3645 : [], a4655 : [], a5665 : [], am66 : [] };
		
		jQuery.each(d.age_distribution.stats, function(i, val) {
			va1925 = 0;
			va2635 = 0;
			va3645 = 0;
			va4655 = 0;
			va5665 = 0;
			vam66  = 0;
			
			jQuery.each(val.histogram, function(i2, val2) {
				if(val2.ages == "19-25") {
					va1925 = val2[graphType];
				} else if(val2.ages == "26-35") {
					va2635 = val2[graphType];
				} else if(val2.ages == "36-45") {
					va3645 = val2[graphType];
				} else if(val2.ages == "46-55") {
					va4655 = val2[graphType];
				} else if(val2.ages == "56-65") {
					va5665 = val2[graphType];
				} else if(val2.ages == ">=66") {
					vam66 = val2[graphType];
				}
			});
			
			age_distribution.a1925.push(va1925);
			age_distribution.a2635.push(va2635);
			age_distribution.a3645.push(va3645);
			age_distribution.a4655.push(va4655);
			age_distribution.a5665.push(va5665);
			age_distribution.am66.push(vam66);
		});
		
		getChartAgeDistribution(age_distribution);
	}
	
	if(d.customer_zipcodes.zcs != null) {
		setMarkers(d.customer_zipcodes, sMarker.options.ZipCode);
	} else {
		markersCustZC.clearLayers();
		polylinesGroup.clearLayers();
		console.log("No se encontraron datos de clientes para este código postal");
	}
	
	$('#banner-slide').bjqs({
		height		: 400,
		width		: 500,
		automatic	: false
	});
	
	leftSidebar.show();
}

function getChartAgeDistribution(age_distribution) {
	var graphType = $("#graph-type option:selected").val();
	
	if(graphType == "avg")			var yAxistitle = "Promedio de pago";
	if(graphType == "num_payments")	var yAxistitle = "Número de pagos";
	if(graphType == "num_cards")	var yAxistitle = "Número de pagos";
	
	$("#banner-slide ul").append('<li><div id="points-graph-age" style="min-width: 500px; height: 400px; margin: 0 auto"></div></li>');
	
	var chart = $('#points-graph-age').highcharts({
		chart: {
			zoomType: 'x'
		},
		title: {
			text: 'Rango de edades'
		},
		subtitle: {
			text: document.ontouchstart === undefined ?
					'Clic y arrastrar para hacer zoom' :
					'Clic para hacer zoom'
		},
		xAxis: {
			type: 'datetime',
			minRange: 14 * 24 * 3600000 // fourteen days
		},
		yAxis: {
			title: {
				text: yAxistitle
			},
			minRange:0.1,
			min:0
		},
		legend: {
			enabled: true
		},
		plotOptions: {
			area: {
				fillColor: {
					linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
					stops: [
						[0, Highcharts.getOptions().colors[0]],
						[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
					]
				},
				marker: {
					radius: 2
				},
				lineWidth: 1,
				states: {
					hover: {
						lineWidth: 1
					}
				},
				threshold: null
			}
		},
		series: [
			{
				name: '19-25',
				pointInterval: 24 * 3600 * 1000,
				pointStart: Date.UTC(2013, 10, 1),
				data: age_distribution.a1925
			}, {
				name: '26-35',
				pointInterval: 24 * 3600 * 1000,
				pointStart: Date.UTC(2013, 10, 1),
				data: age_distribution.a2635
			}, {
				name: '36-45',
				pointInterval: 24 * 3600 * 1000,
				pointStart: Date.UTC(2013, 10, 1),
				data: age_distribution.a3645
			}, {
				name: '46-55',
				pointInterval: 24 * 3600 * 1000,
				pointStart: Date.UTC(2013, 10, 1),
				data: age_distribution.a4655
			}, {
				name: '56-65',
				pointInterval: 24 * 3600 * 1000,
				pointStart: Date.UTC(2013, 10, 1),
				data: age_distribution.a5665
			}, {
				name: '>=66',
				pointInterval: 24 * 3600 * 1000,
				pointStart: Date.UTC(2013, 10, 1),
				data: age_distribution.am66
			}
		]
	});
	
	$("#banner-slide").show();
	$('#points-graph-age').show();
}

function getTimeSeriesChart(day, gender_distribution) {	
	var graphType = $("#graph-type option:selected").val();
	
	if(graphType == "avg")			var yAxistitle = "Promedio de pago";
	if(graphType == "num_payments")	var yAxistitle = "Número de pagos";
	if(graphType == "num_cards")	var yAxistitle = "Número de tarjetas";
	
	$("#banner-slide ul").append('<li><div id="points-graph" style="min-width: 500px; height: 400px; margin: 0 auto"></div></li>');
	
	var chart = $('#points-graph').highcharts({
		chart: {
			zoomType: 'x'
		},
		title: {
			text: 'Total y Generos'
		},
		subtitle: {
			text: document.ontouchstart === undefined ?
					'Clic y arrastrar para hacer zoom' :
					'Clic para hacer zoom'
		},
		xAxis: {
			type: 'datetime',
			minRange: 14 * 24 * 3600000 // fourteen days
		},
		yAxis: {
			title: {
				text: yAxistitle
			},
			minRange:0.1,
			min:0
		},
		legend: {
			enabled: true
		},
		plotOptions: {
			area: {
				fillColor: {
					linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
					stops: [
						[0, Highcharts.getOptions().colors[0]],
						[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
					]
				},
				marker: {
					radius: 2
				},
				lineWidth: 1,
				states: {
					hover: {
						lineWidth: 1
					}
				},
				threshold: null
			}
		},
		series: [
			{
				type: 'area',
				name: 'Por día',
				pointInterval: 24 * 3600 * 1000,
				pointStart: Date.UTC(2013, 10, 1),
				data: day
			}, {
				name: 'Genero femenino',
				pointInterval: 24 * 3600 * 1000,
				pointStart: Date.UTC(2013, 10, 1),
				data: gender_distribution.female
			} , {
				name: 'Genero masculino',
				pointInterval: 24 * 3600 * 1000,
				pointStart: Date.UTC(2013, 10, 1),
				data: gender_distribution.male
			}
		]
	});
	
	$("#banner-slide").show();
	$('#points-graph').show();
}

function focusCity(idCity) {
	if(idCity == "df") {
		dataGeoJson = DFGeoJson;
		printResults(dataGeoJson);
		map.setView([19.4313054168727, -99.1347885131836], 12);
	} else if(idCity == "jalisco") {
		dataGeoJson = jaliscoGeoJson;
		printResults(dataGeoJson);
		map.setView([20.676073446781427, -103.34898948669434], 12);
	} else if(idCity == "nl") {
		dataGeoJson = NLGeoJson;
		printResults(dataGeoJson);
		map.setView([25.677424366922754, -100.31719207763672], 12);
	}
}
