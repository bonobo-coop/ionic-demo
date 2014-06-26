angular.module('app.services', [])

// Build map instances and manage them (requires Leafletjs library)

.service('MapService', function() {
    
    return {
        build: function (name) {
          var map = L.map(name);
          
          L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'examples.map-i86knfo3'
          }).addTo(map);

          map.on('locationfound', function(e) {
            var radius = e.accuracy / 2;
            L.marker(e.latlng).addTo(map)
             .bindPopup("You are within " + radius + " meters from this point").openPopup();
            L.circle(e.latlng, radius).addTo(map);
          });

          map.on('locationerror', function(e) {
            alert(e.message);
          });
          
          map.locate({setView: true, maxZoom: 16});
          
          return map;
        }
    };
});


