/**
* Javascript for custom map
* Copyright (c) Carlos Hugo Gonzalez Castell, http://caarloshugo.info
* Licensed under the MIT license
*/
function setMarkers(d, ZipCode) {
	var graphType = $("#graph-type option:selected").val();
	if(graphType == "avg") graphType = "incomes";
	
	var point1 = new L.LatLng(sMarker._latlng.lat, sMarker._latlng.lng);
	
	var items = [];
	jQuery.each(d.zcs, function(i, val) { items.push(val[graphType]); });
	
	if(items.length == 1) {
		items.push(0);
		items.push(0);
		items.push(0);
		items.push(0);
	} else if(items.length == 2) {
		items.push(0);
		items.push(0);
		items.push(0);
	} else if(items.length == 3) {
		items.push(0);
		items.push(0);
	} else if(items.length == 4) {
		items.push(0);
	}
	
	var serie = new geostats();
	serie.setSerie(items);
	var color_x = new Array('#B6EDF0', '#5CA3E6', '#2259C7', '#0A0A91');
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
	
	jQuery.each(d.zcs, function(zp, data) {
		var lat = 0;
		var lng = 0;
		
		L.geoJson(dataGeoJson , {
			filter: function(feature, layer) {
				if(feature.properties.ZipCode == zp) {
					lat = feature.properties.Lat;
					lng = feature.properties.Lon;
					
					return feature.properties.ZipCode;
				}
			}
		});
		
		if(lat != 0) {
			marker = L.circle([lat, lng], 200, { data : data, zp : zp, fillOpacity: 0.7, opacity: 0.7, weight: 1.2, color: "#223346", fillColor: color_x[getClass(data[graphType], ranges)] });
			
			//Create custom popup content
			popupContent  =  '<p><strong>Ingresos</strong><br/><span class="number">' + data.incomes + '</span></p>';
			popupContent +=  '<p><strong>Número de tarjetas</strong><br/><span class="number">' + data.num_cards + '</span></p>';
			popupContent +=  '<p><strong>Número de pagos</strong><br/><span class="number">' + data.num_payments + '</span></p>';
			marker.bindPopup(popupContent);
			
			point2	  = new L.LatLng(lat, lng);
			pointList = [point1, point2];
			polyLine = new L.Polyline(pointList, { color: '#72954A', weight: 1, opacity: 0.6, smoothFactor: 1, clickable: true });

			polyLine.on('mouseover', function(e) {
				var layer = e.target;
				layer.setStyle({ color: '#5B7141', opacity: 0.8, weight: 1 });
			});
			
			polyLine.on('mouseout', function(e) {
				var layer = e.target;
				layer.setStyle({ color: '#72954A', weight: 1, opacity: 0.6, smoothFactor: 1, clickable: true });
			});
			
			marker.on('click', function(e) { $('.number').number(true, 2); });
			
			polylinesGroup.addLayer(polyLine);
			markersCustZC.addLayer(marker);
		}
	});
	
	markersCustZC.addTo(map);
	polylinesGroup.addTo(map);
	$('.number').number(true, 2);
}
