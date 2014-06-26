angular.module('app.controllers', [])

/**
 * Projects and tasks controller
 */
.controller('TodoCtrl', function($scope, $state, $timeout, Projects, $ionicSideMenuDelegate, $ionicModal) {
  
  // Load or initialize projects
  $scope.projects = Projects.all();
  
  // Grab the last active, or the first project
  $scope.activeProjectId = Projects.getLastActiveIndex();
  $scope.activeProject = Projects.get($scope.activeProjectId);
  
  // Open projects menu
  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  
  // Select a project and close menu
  $scope.selectProject = function(project, index) {
    // Hide menu
    $ionicSideMenuDelegate.toggleLeft(false);
    
    if (index !== $scope.activeProjectId) {
      // Update current project
      $scope.activeProjectId = index;
      $scope.activeProject = project;
      Projects.setLastActiveIndex(index);
      // Refresh page
      $state.go('tab.list', {projectId: index});
    }
  };
  
  // A utility function for creating a new project
  // with the given projectTitle
  var createProject = function(projectTitle) {
    var newProject = Projects.newProject(projectTitle);
    $scope.projects.push(newProject);
    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length-1);
  };
  
  // Called to create a new project
  $scope.newProject = function(msg) {
    var projectTitle = prompt(msg);
    if (projectTitle) {
      createProject(projectTitle);
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
      title: task.title
    });
    $scope.taskModal.hide();

    // Inefficient, but save all the projects
    Projects.save($scope.projects);

    task.title = "";
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
  $timeout(function() {
    if($scope.projects.length === 0) {
      while (true) {
        if ($scope.newProject('Your first project title:')) {
          break;          
        }
      }
    }
  });
})

.controller('MapCtrl', function(MapService) {
  // Map instance
  MapService.build('map');
});