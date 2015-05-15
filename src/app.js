//Define an angular module for our app
var sampleApp = angular.module('sampleApp', ['ngRoute']);
 
//Define Routing for app
//Uri /AddNewOrder -> template add_order.html and Controller AddOrderController
//Uri /ShowOrders -> template show_orders.html and Controller AddOrderController

sampleApp.run(function($rootScope) {
  $rootScope.dashboard_redirect = function() {
    //var path = window.location.origin + window.location.pathname;
    //path += "#/dashboard";
    //window.location.href = path;

    $location.path('dashboard');
  };
});

sampleApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: 'src/views/home/login.html',
        controller: 'LoginController'
      }).
      when('/dashboard', {
        templateUrl: 'src/views/home/dashboard.html',
        controller: 'DashboardController'
      }).
      when('/new-projects', {
        templateUrl: 'src/views/projects/new.html',
        controller: 'NewProjectController'
      }).
      when('/saved-projects', {
        templateUrl: 'src/views/projects/saved.html',
        controller: 'ProjectController'
      }).
      when('/project-detail/:id', {
        templateUrl: 'src/views/projects/detail.html',
        controller: 'ProjectDetailController'
      }).
      when('/art-uploaded/:id', {
        templateUrl: 'src/views/projects/art-uploaded.html',
        controller: 'ArtUploadedController'
      }).
      when('/writing-uploaded/:id', {
        templateUrl: 'src/views/projects/writing-uploaded.html',
        controller: 'WritingUploadedController'
      }).
      when('/writing-uploaded/:id', {
        templateUrl: 'src/views/projects/writing-uploaded.html',
        controller: 'WritingUploadedController'
      }).
      when('/grade-project/:id', {
        templateUrl: 'src/views/grade/grade-now.html',
        controller: 'GradeController'
      }).
      when('/finish-grading/:id', {
        templateUrl: 'src/views/grade/finish.html',
        controller: 'FinishGradingController'
      }).
      otherwise({
        redirectTo: '/login'
      });
}]);

sampleApp.controller('LoginController', function($scope, $location) {
  $scope.show_error_message = false;
  $scope.forms = {};

  $scope.login = function() {
    //$scope.show_error_message = true;
    //$scope.error_message = 'Error';
    //var path = window.location.origin + window.location.pathname;
    //path += "#/dashboard";
    //window.location.href = path;

    $location.path('dashboard');
  };

}); 

sampleApp.controller('DashboardController', function($scope, $location) {
  $scope.full_name = 'Max Power';

  $scope.new_project = function() {
    var path = window.location.origin + window.location.pathname;
    path += "#/new-projects";

    $('.modal-backdrop').remove();
    //window.location.href = path; 
    $location.path('new-projects');
  };

  $scope.saved_projects = function() {
    var path = window.location.origin + window.location.pathname;
    path += "#/saved-projects";

    $('.modal-backdrop').remove();
    //window.location.href = path; 
    $location.path('saved-projects');
  };
}); 

sampleApp.controller('GradeController', function($scope, $location) {
    $scope.grade_project = function() {
      var path = window.location.origin + window.location.pathname;
      path += "#/finish-grading/" + 13243;

      $('.modal-backdrop').remove();
      //window.location.href = path;
      $location.path('finish-grading/1224'); 
    };
}); 

sampleApp.controller('FinishGradingController', function($scope, $location) {
  $scope.back_to_grading = function() {
    var path = window.location.origin + window.location.pathname;
    path += "#/grade-project/" + 12324;

    $('.modal-backdrop').remove();
    //window.location.href = path;
    $location.path('grade-project/12421');
  };

  $scope.finished_grading = function() {
    var path = window.location.origin + window.location.pathname;
    path += "#/dashboard";

    $('.modal-backdrop').remove();
    //window.location.href = path;
    $location.path('dashboard');
  };
}); 

sampleApp.controller('ArtUploadedController', function($scope, $location) {
  $scope.upload_writing = function() {
    $('.upload-form').hide();
    $('.to-do-replace').hide();
    $('.dashboard-btns').hide();
    $('.uploading-area').show();

    var path = window.location.origin + window.location.pathname;
    path += "#/writing-uploaded/" + 13243;

    $('.modal-backdrop').remove();
    //window.location.href = path;
    $location.path('writing-uploaded/12131'); 
  };  
}); 

sampleApp.controller('WritingUploadedController', function($scope, $location) {
  $scope.grade_now = function() {
    var path = window.location.origin + window.location.pathname;
    path += "#/grade-project/" + 12324;

    $('.modal-backdrop').remove();
    //window.location.href = path;
    $location.path('grade-project/22311');
  };
}); 

sampleApp.controller('ProjectDetailController', function($scope, $location) {
    $scope.project = {
      'image_url': 'http://i.imgur.com/JLxuCgr.jpg',
      'writing_url': '',
      'class_name': '4th Grade Theatre - 03',
      'name': 'Hun Batz',
      'id': 1321
    };

    $scope.delete_project = function(id) {
      alert('Project Deleted');

      var path = window.location.origin + window.location.pathname;
      path += "#/saved-projects";

      $('.modal-backdrop').remove();
      //window.location.href = path;
      $location.path('saved-projects');
    };

    $scope.grade_now = function() {
      var path = window.location.origin + window.location.pathname;
      path += "#/grade-project/" + 12324;

      $('.modal-backdrop').remove();
      //window.location.href = path;
      $location.path('grade-project/1213');
    }
}); 

sampleApp.controller('NewProjectController', function($scope, $location) {
  $scope.upload_artwork = function() {
    $('.upload-form').hide();
    $('.to-do-replace').hide();
    $('.dashboard-btns').hide();
    $('.uploading-area').show();

    var path = window.location.origin + window.location.pathname;
    path += "#/art-uploaded/" + 13243;

    $('.modal-backdrop').remove();
    //window.location.href = path; 
    $location.path('art-uploaded/124');
  };
});
 
sampleApp.controller('ProjectController', function($scope, $location) {
  $scope.saved_projects = [
    {
      'student_name': 'Katie Smith',
      'studnet_id': 12345,
      'class_name': '4th Grade Theatre - 03',
      'class_id': 1234,
      'project_name': 'Tableau 1',
      'project_id': 4532
    },
    {
      'student_name': 'Jane Wilson',
      'studnet_id': 12345,
      'class_name': '4th Grade Theatre - 03',
      'class_id': 1234,
      'project_name': 'Tableau 1',
      'project_id': 4532
    },
    {
      'student_name': 'Roy Coba',
      'studnet_id': 12345,
      'class_name': '4th Grade Theatre - 03',
      'class_id': 1234,
      'project_name': 'Tableau 1',
      'project_id': 4532
    },
    {
      'student_name': 'Tammy Taffy',
      'studnet_id': 12345,
      'class_name': '4th Grade Theatre - 03',
      'class_id': 1234,
      'project_name': 'Tableau 1',
      'project_id': 4532
    },
    {
      'student_name': 'Freddie Jones',
      'studnet_id': 12345,
      'class_name': '4th Grade Theatre - 03',
      'class_id': 1234,
      'project_name': 'Tableau 1',
      'project_id': 4532
    },
    {
      'student_name': 'Larry Sminchers',
      'studnet_id': 12345,
      'class_name': '4th Grade Theatre - 03',
      'class_id': 1234,
      'project_name': 'Tableau 1',
      'project_id': 4532
    }
  ];

  $scope.open_saved_project = function(id) {
    var path = window.location.origin + window.location.pathname;
    path += "#/project-detail/" + id;

    $('.modal-backdrop').remove();
    //window.location.href = path;
    $location.path('project-detail/1231');
  }; 

});