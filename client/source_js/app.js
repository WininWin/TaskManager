var app = angular.module('mp4', ['ngRoute', 'mp4Controllers', 'mp4Services',  '720kb.datepicker']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/adduser', {
    templateUrl: 'partials/adduserview.html',
    controller: 'UserListController'
  }).
  when('/addtask', {
    templateUrl: 'partials/addtaskview.html',
    controller: 'TaskListController'
  }).
  when('/settings', {
    templateUrl: 'partials/settings.html',
    controller: 'SettingsController'
  }).
  when('/userlist', {
    templateUrl: 'partials/userlist.html',
    controller: 'UserListController'
  }).
  when('/userlist/:useremail', {
    templateUrl: 'partials/userdetailsview.html',
    controller: 'UserListController'
  }).
  when('/tasklist', {
    templateUrl: 'partials/tasklist.html',
    controller: 'TaskListController'
  }).
  when('/tasklist/:taskid', {
    templateUrl: 'partials/taskdetailsview.html',
    controller: 'TaskDetailsController'
  }).
  when('/edittask/:taskid', {
    templateUrl: 'partials/taskeditview.html',
    controller: 'TaskDetailsController'
  }).
  otherwise({
    redirectTo: '/settings'
  });
}]);
