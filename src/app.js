//Define an angular module for our app
var sampleApp = angular.module('sampleApp', ['ngRoute']);
 
//Define Routing for app
//Uri /AddNewOrder -> template add_order.html and Controller AddOrderController
//Uri /ShowOrders -> template show_orders.html and Controller AddOrderController

sampleApp.run(function($rootScope, $location) {
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
      when('/project-uploaded', {
        templateUrl: 'src/views/projects/project-uploaded.html',
        controller: 'ProjectUploadController'
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
  $scope.title = "MOBART";

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
      //window.location.href = path;
      $location.path('finish-grading/1224'); 
    };

    $scope.go_back_to_projects = function() {
      $location.path('saved-projects'); 
    }

    $scope.visual_exmps = [
      {
        'thumbnail':'./src/resources/exmplars/visual/CE2.5_1_thumb.jpg.png',
        'id': 1,
        'exmplars': 'The artwork does not include complementary colors.',
        'source_image': './src/resources/exmplars/visual/CE2.5_1_small.jpg'
      },
      {
        'thumbnail':'./src/resources/exmplars/visual/CE2.5_2_thumb.jpg.png',
        'id': 2,
        'exmplars': 'Complementary colors are used. The choices seem random or lacking in purpose.',
        'source_image': './src/resources/exmplars/visual/CE2.5_2_small.jpg'
      },
      {
        'thumbnail':'./src/resources/exmplars/visual/CE2.5_3_thumb.jpg.png',
        'id': 3,
        'exmplars': 'Complementary colors are used and show contrast. The emphasis may not be intentional.',
        'source_image': './src/resources/exmplars/visual/CE2.5_3_small.jpg'
      },
      {
        'thumbnail':'./src/resources/exmplars/visual/CE2.5_4_thumb.jpg.png',
        'id': 4,
        'exmplars': 'Complementary colors are used to create effective emphasis through contrast.',
        'source_image': './src/resources/exmplars/visual/CE2.5_4_small.jpg'
      }
    ];
});

sampleApp.controller('ProjectUploadController', function($scope, $location) {
    $scope.go_back_to_projects = function() {
      $location.path('saved-projects'); 
    }
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
    $location.path('grade-project/22311'); 
  }; 

  $scope.go_to_grade_now = function() {
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

  $scope.colors = [
      {name:'black', shade:'dark'},
      {name:'white', shade:'light', notAnOption: true},
      {name:'red', shade:'dark'},
      {name:'blue', shade:'dark', notAnOption: true},
      {name:'yellow', shade:'light', notAnOption: false}
    ];

$scope.selected = { name: 'aSubItem' };

  $scope.project_list = [
    {
      'name':'Project - 01 (Theatre)',
      id: 1324
    },
    {
      'name':'Project - 01 (Visual Arts)',
      id: 45324
    }
  ];

  $scope.class_list = [
    {
      'name':'4th Grade Theatre - 01'
    },
    {
      'name':'4th Grade Visual Arts - 01'
    }
  ];

  $scope.student_list = [
    {
      'name': 'Abbot, Jared'
    },
    {
      'name': 'Alfaro, Adriana'
    },
    {
      'name': 'Anderson, Ashley'
    },
    {
      'name': 'Ashley, Sean'
    },
    {
      'name': 'Baggot, Erin'
    },
    {
      'name': 'Brandt, Zachary'
    },
    {
      'name': 'Cho, Joan'
    },
    {
      'name': 'Clure, Graham'
    },
    {
      'name': 'Conti, Gregory'
    },
    {
      'name': 'Dowdy, Jamin'
    },
    {
      'name': 'Eisler, Jacob'
    },
    {
      'name': 'Faller, Julie'
    },
    {
      'name': 'Foster, Chase'
    },
    {
      'name': 'Gill, Michael'
    },
    {
      'name': 'Grossman, Shelby'
    },
    {
      'name': 'Hall, Andrew'
    },
    {
      'name': 'Hinshelwood, Bradley'
    },
    {
      'name': 'Kaufman, Aaron'
    },
    {
      'name': 'Kimlee, Sungho'
    },
    {
      'name': 'Kruszewska, Dominika'
    },
    {
      'name': 'Koss, Daniel'
    },
    {
      'name': 'Lall, Ranjit'
    },
    {
      'name': 'Landeau, David'
    },
    {
      'name': 'Lastra-Anado, Carlos'
    },
    {
      'name': 'Latura, Audrey'
    },
    {
      'name': 'Lebovitz, Adam'
    },
    {
      'name': 'Lee, Boram'
    },
    {
      'name': 'Lillios, Nicholas'
    },
    {
      'name': 'Lucas, Christopher'
    },
    {
      'name': 'Luna, Joseph'
    },
    {
      'name': 'Mabud, Rakeen'
    },
    {
      'name': 'Smith, Katie'
    },
    {
      'name': 'Smith, Kevin'
    },
    {
      'name': 'Thompson, William'
    }
  ];

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
    $location.path('grade-project/1213');
  }; 

});