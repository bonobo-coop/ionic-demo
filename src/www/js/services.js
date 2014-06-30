angular.module('app.services', [])

// Shared data from settings needed by different controllers

.service('SettingsService', function() {
  var _vars = {};
  
  return {
    get: function(key) {
      return (typeof _vars[key] !== 'undefined') ? _vars[key] : null;
    },
    set: function(key, value) {
      _vars[key] = value;
    }
  };
})

// Build map instances and manage them (requires Leafletjs library)

.service('MapService', function($http) {
    
    var map;
    
    return {
        build: function (name) {
          map = L.map(name);
          
          L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'examples.map-i86knfo3'
          }).addTo(map);

          map.on('locationfound', function(e) {
            var radius = e.accuracy / 2;
            L.circle(e.latlng, radius).addTo(map)
             .bindPopup("You are within " + radius + " meters from this point").openPopup();
          });

          map.on('locationerror', function(e) {
            alert(e.message);
          });
          
          map.locate({setView: true, maxZoom: 16});
          
          return map;
        },
        geosearch: function (address, title, successCb) {
          // See http://wiki.openstreetmap.org/wiki/Nominatim
          var url = 'http://nominatim.openstreetmap.org/search' + L.Util.getParamString({
            q: address,
            format: 'json'
          }), self = this;
          
          // REST service (using JSON)
          $http({method: 'GET', url: url})
            .success(function (response) {
              if (response instanceof Array && response.length) {
                var first = response[0];
                if (title) {
                  first.display_name = title;
                }
                successCb(first);
              }
            })
            .error(function() {
              alert("Address not found: " + address);
            });
        },
        add: function (results, zoom) {
          if (map && results.length > 0) {
            var i, ltmin, lngmin, ltmax, lngmax;
            for (i in results) {
              // Add marker
              var bbox = results[i].boundingbox;
              L.marker([bbox[0], bbox[2]]).addTo(map)
               .bindPopup(results[i].display_name);
              // Calculate center?
              if (zoom) {
                var bbox = results[i].boundingbox;
                if (!ltmin || bbox[0] < ltmin) {
                  ltmin = bbox[0];
                }
                if (!ltmax || bbox[1] > ltmax) {
                  ltmax = bbox[1];
                }
                if (!lngmin || bbox[2] < lngmin) {
                  lngmin = bbox[2];
                }
                if (!lngmax || bbox[3] > lngmax) {
                  lngmax = bbox[3];
                }
              }
            }
            // Center map?
            if (zoom) {
              this.center(ltmin, lngmin, ltmax, lngmax, zoom);
            }
          }
        },
        center: function (lt1, lng1, lt2, lng2, zoom) {
          map.fitBounds(new L.LatLngBounds([
            new L.LatLng(lt1, lng1),
            new L.LatLng(lt2 ? lt2 : lt1, lng2 ? lng2 : lng1)
          ]), {
            maxZoom: zoom
          });
        }
    };
});


