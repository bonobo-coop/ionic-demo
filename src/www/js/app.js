angular.module('todo', ['ionic', 'app.controllers', 'app.models', 'app.services'])

// Router

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('tab', {
      url: "/projects/:projectId",
      abstract: true,
      views: {
        'main-content': {
          templateUrl: "templates/tabs.html",
          controller: "TodoCtrl"
        },
        'main-menu': {
          templateUrl: "templates/menu.html",
          controller: "TodoCtrl"
        }
      }
    })
    .state('tab.list', {
      url: "/list",
      views: {
        'list-tab' :{
          templateUrl: "templates/tab-list.html",
          controller: "TodoCtrl"
        }
      }
    })
    .state('tab.map', {
      url: "/map",
      views: {
        'map-tab' :{
          templateUrl: "templates/tab-map.html",
          controller: "TodoCtrl"
        }
      }
    });

  $urlRouterProvider.otherwise("/projects/0/list");
});