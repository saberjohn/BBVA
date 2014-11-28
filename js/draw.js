//docs - https://github.com/Leaflet/Leaflet.draws
$(document).ready( function () {
	var drawControl = new L.Control.Draw({
		position: 'topleft',
		draw: {
			rectangle:false,
			polyline: false,
			polygon: false /*{
				allowIntersection: false,
				showArea: true,
				drawError: {
					color: '#b00b00',
					timeout: 1000
				},
				shapeOptions: {
					color: '#bada55'
				}
			}*/,
			circle: false,
			marker: true
		},
		edit: {
			featureGroup: drawnItems,
			remove: true
		}
	});

	map.addControl(drawControl);

	map.on('draw:created', function (e) {	
		var zoom = map._zoom;
		
		if(zoom > 1) {
			var type    = e.layerType, layer = e.layer;
			var geoJSON = layer.toGeoJSON();
			
			removeLayers();
			drawnItems.addLayer(layer);
			
			if(type == "marker") {
				var marker = layer.getLatLng();
				sMarker     = marker;
				var zipcode = getZipcodeFromPoint(marker);
				
				if(zipcode) {
					$.ajax({
						cache: false,
						type: 'POST', 
						url: baseurl + '/zipcode/' + zipcode + '/',
						success: function (d) {
							//print results
							printResults(dataGeoJson, d);
							
							//set data
							data = d;
							
							//set view marker
							map.setView([marker.lat, marker.lng], map._zoom);
							
							$(".loading").hide();
						},
						error: function (response) {
							$(".loading").hide();
						}
					});
				} else {
					console.log("no se encontro ningun registro");
					$(".loading").hide();
				}
			} else {
				$.ajax({
					cache: false,
					type: 'POST',              
					url: baseurl + '/draw/',
					dataType: 'json',
					data: { geometry : geoJSON },
					success: function (d) {
						//print results
						printResults(d, false);
						$(".loading").hide();
					},
					error: function (response) {
						$(".loading").hide();
					}
				});
			}
		} else {
			$(".loading").hide();
			return false;
		}
	});
});
