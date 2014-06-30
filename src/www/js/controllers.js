angular.module('app.controllers', [])

/**
 * Projects and tasks controller
 */
.controller('TodoCtrl', function($scope, $state, $timeout, Projects, $ionicSideMenuDelegate, $ionicModal, SettingsService) {
  
  Projects.all(function(projects){

    // Load or initialize projects
    $scope.projects = projects;
    
    // Grab the last active, or the first project
    $scope.activeProjectId = Projects.getLastActiveIndex();
    $scope.activeProject = projects[$scope.activeProjectId];

    // Open projects menu
    $scope.toggleProjects = function() {
      $ionicSideMenuDelegate.toggleLeft();
    };

    // Select a project and close menu
    $scope.selectProject = function(project) {
      // Hide menu
      $ionicSideMenuDelegate.toggleLeft(false);

      if (project.id !== $scope.activeProjectId) {
        // Update current project
        $scope.activeProjectId = project.id;
        $scope.activeProject = project;
        Projects.setLastActiveIndex(project.id);
        // Refresh page
        $state.go('tab.list', {projectId: project.id});
      }
    };

    // A utility function for creating a new project
    // with the given projectTitle
    $scope.newProject = function(msg) {
      var projectTitle = prompt(msg);
      if (projectTitle) {
        var newProject = Projects.create(projectTitle);
        Projects.save(newProject, function(savedProject){
          $scope.projects[savedProject.id] = savedProject;
          $scope.selectProject(savedProject);
        });
        return true;
      }
      return false;
    };

    // Create our modal
    $ionicModal.fromTemplateUrl('../templates/new-task.html', function(modal) {
      $scope.taskModal = modal;
    }, {
      scope: $scope
    });

    $scope.createTask = function(task) {
      if(!$scope.activeProject || !task) {
        return;
      }
      $scope.activeProject.tasks.push({
        title: task.title,
        address: task.address
      });
      Projects.save($scope.activeProject, function(){
        // Hide modal
        $scope.taskModal.hide();
        // Add new item to list
        var list = document.getElementById('tasks-list');        
        angular.element(list.childNodes[0]).append(
          '<ion-item class="item ng-binding">' + task.title + '</ion-item>'
        );
        // Reset model
        task.title = "";
        task.address = "";
      });
    };

    $scope.newTask = function() {
      $scope.taskModal.show();
    };

    $scope.closeNewTask = function() {
      $scope.taskModal.hide();
    };
    
    // Try to create the first project, make sure to defer
    // this by using $timeout so everything is initialized
    // properly
    var init = SettingsService.get('init');
    
    if (!init) {
      $timeout(function() {
        if (Object.keys($scope.projects).length === 0) {
          SettingsService.set('init', true);
          while (true) {
            if ($scope.newProject('Your first project title:')) {
              break;
            }
          }
        }
      });      
    }
  });
})

.controller('MapCtrl', function(MapService, Projects) {
  // Map instance
  MapService.build('map');
  // Get project tasks locations
  Projects.get(Projects.getLastActiveIndex(), function(project) {
    // Add listener
    var markers = [];
    var callback = function(marker){
      // Store marker
      markers.push(marker);
      // Last one?
      if (markers.length === project.tasks.length) {
        // Add markers and center map
        MapService.add(markers, true, 16);
      }
    };
    // Add points
    for (var i in project.tasks) {
      MapService.geosearch(
        project.tasks[i].address, 
        project.tasks[i].title, 
        callback
      );
    }
  });
});