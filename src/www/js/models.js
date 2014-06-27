angular.module('app.models', [])
/**
 * The Projects factory handles saving and loading projects
 * from local storage, and also lets us save and load the
 * last active project index.
 */
.factory('Projects', function() {
  
  function connect(callback) {
    var request = indexedDB.open("ionic-demo"), 
        db, store, collection = 'projects';
        
    request.onupgradeneeded = function() {
      // The database did not previously exist, so create object stores and indexes.
      db = request.result;
      store = db.createObjectStore(collection, { autoIncrement: true });
      store.createIndex("by_title", "title", {unique: true});
      callback(store);
    };
    
    request.onsuccess = function() {
      db = request.result;
      var tx = db.transaction(collection, "readwrite"),
      store = tx.objectStore(collection);
      callback(store);
    };
  };
  
  return {
    create: function(title) {
      // New project
      return {
        title: title,
        tasks: []
      };
    },
    save: function(project, successCb) {
      connect(function(store) {
        var request;
        if (project.id) {
          // Update
          request = store.put({
            title: project.title, 
            tasks: project.tasks
          }, project.id);
        } else {
          // Create
          request = store.put({
            title: project.title, 
            tasks: project.tasks
          });
        }
        
        request.transaction.oncomplete = function() {
          // All requests have succeeded and the transaction has committed.
          var key = request.result;
          project.id = key;
          successCb(project);
        };
      });
    },
    get: function(id, successCb) {
      connect(function(store) {
        var request = store.get(id);
        
        request.onsuccess = function() {
          // A match was found?
          successCb(request.result);
        };
      });
    },
    all: function(succesCb) {
      connect(function(store) {
        var request = store.openCursor(),
            list = {}; // hashmap
            
        request.onsuccess = function() {
          var cursor = request.result;
          while (cursor) {
            // Called for each matching record
            cursor.value.id = cursor.key;
            list[cursor.key] = cursor.value;
            try {
              cursor.continue();              
            } catch (exception) {
              break;
            }
          }
          succesCb(list);
        };
        
        request.onerror = function () {
          succesCb(list);
        };
      });
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveProject']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveProject'] = index;
    }
  };
});