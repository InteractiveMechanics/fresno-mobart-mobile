
//Define an angular module for our app
var sampleApp = angular.module('sampleApp', ['ngRoute', 'ngFileUpload']);

//Define Routing for app
//Uri /AddNewOrder -> template add_order.html and Controller AddOrderController
//Uri /ShowOrders -> template show_orders.html and Controller AddOrderController

sampleApp.run(function($rootScope, $location) {
    $rootScope.baseUrl = '/mobart/data';
    $rootScope.dashboard_redirect = function() {
        //var path = window.location.origin + window.location.pathname;
        //path += "#/dashboard";
        //window.location.href = path;

        $location.path('dashboard');
    };
    $rootScope.checkMimetype = function (mimetype) {
        switch (mimetype) {
            case 'video/mov':
            case 'video/mp4':
                return 'video';
                break;
            case 'image/png':
            case 'image/jpeg':
                return 'image';
                break;
            default:
                return 'no-file';
        }
    }
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
        when('/writing-uploaded', {
            templateUrl: 'src/views/projects/writing-uploaded.html',
            controller: 'WritingUploadedController'
        }).
        when('/grade-project', {
            templateUrl: 'src/views/grade/grade-now.html',
            controller: 'GradeController'
        }).
        when('/second-exemplar', {
            templateUrl: 'src/views/grade/grade-now.html',
            controller: 'SecondExemplarController'
        }).
        when('/third-exemplar', {
            templateUrl: 'src/views/grade/grade-now.html',
            controller: 'ThirdExemplarController'
        }).
        when('/finish-grading', {
            templateUrl: 'src/views/grade/finish.html',
            controller: 'FinishGradingController'
        }).
        when('/project-uploaded', {
            templateUrl: 'src/views/projects/project-uploaded.html',
            controller: 'ProjectUploadController'
        }).
        when('/logout', {
            templateUrl: 'src/views/home/login.html',
            controller: 'LogoutController'
        }).
        otherwise({
            redirectTo: '/login'
        });
    }
]);

sampleApp.controller('LogoutController', function($scope, $rootScope, $http, $location) {
    localStorage.removeItem('user_data');
    $location.path('/login');
});
sampleApp.controller('LoginController', function($scope, $rootScope, $http, $location) {
    $scope.show_error_message = false;
    $scope.forms = {};

    $scope.login = function() {
    	var username = $('input.username').val();
    	var password = $('input.password').val();
    	
    	var promise = $http.get('http://iaccessfresno.com/lib/angular-login.php?u=' + username + '&p=' + encodeURIComponent(password));
        promise.success(function(data, status, headers, config){
            if (status == 200) {
            	console.log(data.firstname);
            	var userData = {
	            	uid: data.id,
	            	firstname: data.firstname,
	            	lastname: data.lastname,
	            	pictureid: data.picture, 
	            	email: data.email
            	}            	
            	if(data.id) {
                    localStorage.setItem('user_data', JSON.stringify(userData));
	            	$location.path('dashboard');
            	} else {
            		$scope.show_error_message = true;
	            	$scope.error_message = "Invalid Username and Password!";
            	}
            	
            } else {
            	$scope.show_error_message = true;
				$scope.error_message = "Invalid Username and Password.";
            }
        });
    };

});

sampleApp.controller('DashboardController', function($scope, $location) {
	var userData = JSON.parse(localStorage.getItem('user_data'));
	console.log(userData);
	
    $scope.full_name = userData.firstname + ' ' + userData.lastname;
    $scope.title = "MOBART";
    $scope.uid = userData.uid;

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

sampleApp.controller('GradeController', function($scope, $rootScope, $http, $location, Upload) {	
	$scope.back_btn_text = "Save For Later";
	$scope.selected_item = -1;
	var item = JSON.parse(localStorage.getItem('current_item')); 
    var pid = item.pid;
	
    $scope.grade_project = function() {
    	if($scope.selected_item > 0) {
    		item.exemplar_one = $scope.selected_item;
    		localStorage.setItem('current_item', JSON.stringify(item));
    		
        	$location.path('second-exemplar');
        } else {
	        //show error
        }
    };

    $scope.go_back = function() {
    
    	if(!item.gid) {
	        var postData = {
		    	cid: item.class_id,
		    	sid: item.student_id,
		    	artworkid: item.artwork_id,
                artwork_mimetype: item.artwork_mimetype,
		    	saved: 1,
		    	incomplete: 0,
		    	ex1grade: 0,
		    	ex2grade: 0,
		    	ex3grade: 0,
		    	ex4grade: 0,
                pid: item.pid
	    	}
	    	
	    	if(item.writing_id) {
		    	postData.writingid = item.writing_id;
	    	}
	    	
	        var promise = $http.post($rootScope.baseUrl + '/api/grades', postData);
	        promise.success(function(data, status, headers, config){
	            if (status == 200) {
	            	localStorage.removeItem('current_item');
					$location.path('dashboard');
	            } else {
					alert("Unable to save later.");
	            }
	        });
        
        } else {
	        $location.path('dashboard');
        }
    }
    
    $scope.exemplar_click = function(index) {
	  	$scope.selected_item = index;  
    };
    
    $scope.artwork_mimetype = item.artwork_mimetype;
    $scope.artwork_url = item.artwork_url;
    
    
    //Json File Url
    var json_url = 'http://iaccessfresno.com/mobart/src/resources/exemplars.json';
    var promise = $http.get(json_url).then(function(response){
	    var item = JSON.parse(localStorage.getItem('current_item')); 
		var pid = item.pid;
		
		if(pid == 1) {
	        $scope.project = '3rd Grade Unit Assessment';
	        $scope.assessment = 'Physical Expression';
			$scope.exmps = response.data.project1;	
		}
		
		if(pid == 2) {
	        $scope.project = '4th Grade Unit Assessment';
	        $scope.assessment = 'Facial Expression';
			$scope.exmps = response.data.project2;	
		}
		
		if(pid == 3) {
	        $scope.project = '3rd Grade Performance Task Assessment';
	        $scope.assessment = 'Physical Expression';
			$scope.exmps = response.data.project3;	
		}
		
		if(pid == 4) {
	        $scope.project = '4th Grade Performance Task Assessment';
	        $scope.assessment = 'Facial Expression';
			$scope.exmps = response.data.project4;	
		}	
		
		if( item.exemplar_one > 0 ) {
		 	var index = item.exemplar_one - 1;
		 	$scope.exmps[index].class_value = 'active';
		 	$scope.selected_item = item.exemplar_one;
	    }	
    });
	
	/*// Assessment 1
	if(pid == 1) {
        $scope.project = '3rd Grade Unit Assessment';
        $scope.assessment = 'Physical Expression';
		$scope.exmps = [{
	        'thumbnail': './src/resources/exmplars/third/PhysicalExpression/pe_1_thumb.jpg',
	        'id': 1,
	        'source': './src/resources/exmplars/third/PhysicalExpression/pe_1.jpg',
	        'exmplars': 'The students pose is unclear or difficult to view. Student detracts from the overall effect of the tableau.',
	        'isImage': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/third/PhysicalExpression/pe_2_thumb.jpg',
	        'id': 2,
	        'source': './src/resources/exmplars/third/PhysicalExpression/pe_2.jpg',
	        'exmplars': 'The student exhibits a frozen pose. Choices about level or shape are only partially visible. Student shows some attempt at physical expression.',
	        'isImage': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/third/PhysicalExpression/pe_3_thumb.jpg',
	        'id': 3,
	        'source': './src/resources/exmplars/third/PhysicalExpression/pe_3.jpg',
	        'exmplars': 'The student exhibits a frozen pose. Choices about  level and shape are visible. The pose lacks bold, strong choices for physical expression.',
	        'isImage': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/third/PhysicalExpression/pe_4_thumb.jpg',
	        'id': 4,
	        'source': './src/resources/exmplars/third/PhysicalExpression/pe_4.jpg',
	        'exmplars': 'The student exhibits a bold, strong pose. Choices about level and body shape are effective. The student is clearly visible and the spacing is well balanced.',
	        'isImage': true,
	        'class_value': ''
	    }];	
	}

	if(pid == 2) {
        $scope.project = '4th Grade Unit Assessment';
        $scope.assessment = 'Facial Expression';
		$scope.exmps = [{
	        'thumbnail': './src/resources/exmplars/fourth/FacialExpression/fe_1_thumb.jpg',
	        'id': 1,
	        'source': './src/resources/exmplars/fourth/FacialExpression/fe_1.jpg',
	        'exmplars': 'Facial Expression does not reflect character motivations or emotions.',
	        'isImage': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/fourth/FacialExpression/fe_2_thumb.jpg',
	        'id': 2,
	        'source': './src/resources/exmplars/fourth/FacialExpression/fe_2.jpg',
	        'exmplars': 'The student makes some attempt at showing what the character is feeling through facial expression. The focal point is somewhat appropriate for the scene.',
	        'isImage': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/fourth/FacialExpression/fe_3_thumb.jpg',
	        'id': 3,
	        'source': './src/resources/exmplars/fourth/FacialExpression/fe_3.jpg',
	        'exmplars': 'The student exhibits an appropriate facial expression and focal point. The face shows some emotional expression, but the student has not made a bold, strong choice to show what the character wants or feels.',
	        'isImage': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/fourth/FacialExpression/fe_4_thumb.jpg',
	        'id': 4,
	        'source': './src/resources/exmplars/fourth/FacialExpression/fe_4.jpg',
	        'exmplars': 'The student exhibits a bold, strong facial expression with an appropriate focal point. The face clearly expresses what the character wants or feels.',
	        'isImage': true,
	        'class_value': ''
	    }];	
	}

	if(pid == 3) {
        $scope.project = '3rd Grade Performance Task Assessment';
        $scope.assessment = 'Physical Expression';
		$scope.exmps = [{
	        'thumbnail': './src/resources/exmplars/third/PhysicalExpression/pe_1_thumb.jpg',
	        'id': 1,
	        'source': './src/resources/exmplars/third/PhysicalExpression/pe_1.jpg',
	        'exmplars': 'The students pose is unclear or difficult to view. Student detracts from the overall effect of the tableau.',
	        'isImage': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/third/PhysicalExpression/pe_2_thumb.jpg',
	        'id': 2,
	        'source': './src/resources/exmplars/third/PhysicalExpression/pe_2.jpg',
	        'exmplars': 'The student exhibits a frozen pose. Choices about level or shape are only partially visible. Student shows some attempt at physical expression.',
	        'isImage': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/third/PhysicalExpression/pe_3_thumb.jpg',
	        'id': 3,
	        'source': './src/resources/exmplars/third/PhysicalExpression/pe_3.jpg',
	        'exmplars': 'The student exhibits a frozen pose. Choices about  level and shape are visible. The pose lacks bold, strong choices for physical expression.',
	        'isImage': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/third/PhysicalExpression/pe_4_thumb.jpg',
	        'id': 4,
	        'source': './src/resources/exmplars/third/PhysicalExpression/pe_4.jpg',
	        'exmplars': 'The student exhibits a bold, strong pose. Choices about level and body shape are effective. The student is clearly visible and the spacing is well balanced.',
	        'isImage': true,
	        'class_value': ''
	    }];	
	}

	if(pid == 4) {
        $scope.project = '4th Grade Performance Task Assessment';
        $scope.assessment = 'Facial Expression';
		$scope.exmps = [{
	        'thumbnail': './src/resources/exmplars/fourth/FacialExpression/fe_1_thumb.jpg',
	        'id': 1,
	        'source': './src/resources/exmplars/fourth/FacialExpression/fe_1.jpg',
	        'exmplars': 'Facial Expression does not reflect character motivations or emotions.',
	        'isImage': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/fourth/FacialExpression/fe_2_thumb.jpg',
	        'id': 2,
	        'source': './src/resources/exmplars/fourth/FacialExpression/fe_2.jpg',
	        'exmplars': 'The student makes some attempt at showing what the character is feeling through facial expression. The focal point is somewhat appropriate for the scene.',
	        'isImage': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/fourth/FacialExpression/fe_3_thumb.jpg',
	        'id': 3,
	        'source': './src/resources/exmplars/fourth/FacialExpression/fe_3.jpg',
	        'exmplars': 'The student exhibits an appropriate facial expression and focal point. The face shows some emotional expression, but the student has not made a bold, strong choice to show what the character wants or feels.',
	        'isImage': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/fourth/FacialExpression/fe_4_thumb.jpg',
	        'id': 4,
	        'source': './src/resources/exmplars/fourth/FacialExpression/fe_4.jpg',
	        'exmplars': 'The student exhibits a bold, strong facial expression with an appropriate focal point. The face clearly expresses what the character wants or feels.',
	        'isImage': true,
	        'class_value': ''
	    }];	
	}*/
    
    
});

sampleApp.controller('SecondExemplarController', function($scope, $rootScope, $http, $location) {
	$scope.back_btn_text = "Back";
	$scope.selected_item = -1;
	var item = JSON.parse(localStorage.getItem('current_item')); 
    var pid = item.pid;
	
    $scope.grade_project = function() {
    	if($scope.selected_item > 0) {
    		item.exemplar_two = $scope.selected_item;
    		localStorage.setItem('current_item', JSON.stringify(item));
    		
        	$location.path('third-exemplar');
        } else {
	        //show error
        }
    };

    $scope.go_back = function() {
        $location.path('grade-project');
    }
    
    $scope.exemplar_click = function(index) {
	  	$scope.selected_item = index;  
    };
    
    $scope.artwork_mimetype = item.artwork_mimetype;
    $scope.artwork_url = item.artwork_url;

  // Assessment 2
	if(pid == 1) {
        $scope.project = '3rd Grade Unit Assessment';
        $scope.assessment = 'Facial Expression';
		$scope.exmps = [{
	        'thumbnail': './src/resources/exmplars/third/FacialExpression/fe_1_thumb.jpg',
	        'id': 1,
	        'source': './src/resources/exmplars/third/FacialExpression/fe_1.jpg',
	        'exmplars': 'The student has very little facial expression or the facial  expression does not fit the tableau. The student looks right at the audience or camera.',
	        'isImage': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/third/FacialExpression/fe_2_thumb.jpg',
	        'id': 2,
	        'source': './src/resources/exmplars/third/FacialExpression/fe_2.jpg',
	        'exmplars': 'The student makes some attempt at showing what the character is feeling through facial expression. The focal point is somewhat appropriate for the scene.',
	        'isImage': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/third/FacialExpression/fe_3_thumb.jpg',
	        'id': 3,
	        'source': './src/resources/exmplars/third/FacialExpression/fe_3.jpg',
	        'exmplars': 'The student exhibits an appropriate facial expression and focal point. The face shows some emotional expression, but the student has not made a bold, strong choice to show what the character is feeling.',
	        'isImage': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/third/FacialExpression/fe_4_thumb.jpg',
	        'id': 4,
	        'source': './src/resources/exmplars/third/FacialExpression/fe_4.jpg',
	        'exmplars': 'The student exhibits a bold, strong facial expression with an appropriate focal point. The face clearly expresses what the character is feeling.',
	        'isImage': true,
	        'class_value': ''
	    }];	
	}

	if(pid == 2) {
        $scope.project = '4th Grade Unit Assessment';
        $scope.assessment = 'Vocal Expression';
		$scope.exmps = [{
	        'thumbnail': './src/resources/exmplars/fourth/VocalExpression/ve_1_thumb.jpg',
	        'id': 1,
	        'source': './src/resources/exmplars/fourth/VocalExpression/ve_1.mp4',
	        'exmplars': 'It is unclear what the student is saying;student mumbles lines or races through them. Tone does not match the character.',
	        'isVideo': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/fourth/VocalExpression/ve_2_thumb.jpg',
	        'id': 2,
	        'source': './src/resources/exmplars/fourth/VocalExpression/ve_2.mp4',
	        'exmplars': 'The student has some difficulty speaking with appropriate diction, pace, or volume; sometimes hard to understand what the character is saying. Student speaks in a monotone.',
	        'isVideo': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/fourth/VocalExpression/ve_3_thumb.jpg',
	        'id': 3,
	        'source': './src/resources/exmplars/fourth/VocalExpression/ve_3.mp4',
	        'exmplars': 'The student speaks with appropriate diction, pace and volume; the character can be heard and understood most of the time. The tone sometimes matches the character being portrayed.',
	        'isVideo': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/fourth/VocalExpression/ve_4_thumb.jpg',
	        'id': 4,
	        'source': './src/resources/exmplars/fourth/VocalExpression/ve_4.mp4',
	        'exmplars': 'The student speaks with clear diction, at an appropriate pace and volume; the character can easily be heard and understood. The tone matches the character being portrayed. ',
	        'isVideo': true,
	        'class_value': ''
	    }];	
	}

	if(pid == 3) {
        $scope.project = '3rd Grade Performance Task Assessment';
        $scope.assessment = 'Facial Expression';
		$scope.exmps = [{
	        'thumbnail': './src/resources/exmplars/third/FacialExpression/fe_1_thumb.jpg',
	        'id': 1,
	        'source': './src/resources/exmplars/third/FacialExpression/fe_1.jpg',
	        'exmplars': 'The student has very little facial expression or the facial  expression does not fit the tableau. The student looks right at the audience or camera.',
	        'isImage': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/third/FacialExpression/fe_2_thumb.jpg',
	        'id': 2,
	        'source': './src/resources/exmplars/third/FacialExpression/fe_2.jpg',
	        'exmplars': 'The student makes some attempt at showing what the character is feeling through facial expression. The focal point is somewhat appropriate for the scene.',
	        'isImage': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/third/FacialExpression/fe_3_thumb.jpg',
	        'id': 3,
	        'source': './src/resources/exmplars/third/FacialExpression/fe_3.jpg',
	        'exmplars': 'The student exhibits an appropriate facial expression and focal point. The face shows some emotional expression, but the student has not made a bold, strong choice to show what the character is feeling.',
	        'isImage': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/third/FacialExpression/fe_4_thumb.jpg',
	        'id': 4,
	        'source': './src/resources/exmplars/third/FacialExpression/fe_4.jpg',
	        'exmplars': 'The student exhibits a bold, strong facial expression with an appropriate focal point. The face clearly expresses what the character is feeling.',
	        'isImage': true,
	        'class_value': ''
	    }];	
	}

	if(pid == 4) {
        $scope.project = '4th Grade Performance Task Assessment';
        $scope.assessment = 'Facial Expression';
		$scope.assessment = 'Vocal Expression';
		$scope.exmps = [{
	        'thumbnail': './src/resources/exmplars/fourth/VocalExpression/ve_1_thumb.jpg',
	        'id': 1,
	        'source': './src/resources/exmplars/fourth/VocalExpression/ve_1.mp4',
	        'exmplars': 'It is unclear what the student is saying;student mumbles lines or races through them. Tone does not match the character.',
	        'isVideo': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/fourth/VocalExpression/ve_2_thumb.jpg',
	        'id': 2,
	        'source': './src/resources/exmplars/fourth/VocalExpression/ve_2.mp4',
	        'exmplars': 'The student has some difficulty speaking with appropriate diction, pace, or volume; sometimes hard to understand what the character is saying. Student speaks in a monotone.',
	        'isVideo': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/fourth/VocalExpression/ve_3_thumb.jpg',
	        'id': 3,
	        'source': './src/resources/exmplars/fourth/VocalExpression/ve_3.mp4',
	        'exmplars': 'The student speaks with appropriate diction, pace and volume; the character can be heard and understood most of the time. The tone sometimes matches the character being portrayed.',
	        'isVideo': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/fourth/VocalExpression/ve_4_thumb.jpg',
	        'id': 4,
	        'source': './src/resources/exmplars/fourth/VocalExpression/ve_4.mp4',
	        'exmplars': 'The student speaks with clear diction, at an appropriate pace and volume; the character can easily be heard and understood. The tone matches the character being portrayed. ',
	        'isVideo': true,
	        'class_value': ''
	    }];	
	}
	    
    if( item.exemplar_two > 0 ) {
	 	var index = item.exemplar_two - 1;
	 	$scope.exmps[index].class_value = 'active';
	 	$scope.selected_item = item.exemplar_two;
    }
});

sampleApp.controller('ThirdExemplarController', function($scope, $rootScope, $http, $location) {
	$scope.back_btn_text = "Back";
	$scope.selected_item = -1;
	var item = JSON.parse(localStorage.getItem('current_item')); 
    var pid = item.pid;
	
    $scope.grade_project = function() {
    	if($scope.selected_item > 0) {
    		item.exemplar_three = $scope.selected_item;
    		localStorage.setItem('current_item', JSON.stringify(item));
    		
        	$location.path('finish-grading');
        } else {
	        //show error
        }
    };

    $scope.go_back = function() {
        $location.path('second-exemplar');
    }
    
    $scope.exemplar_click = function(index) {
	  	$scope.selected_item = index;  
    };
    
    $scope.artwork_mimetype = item.artwork_mimetype;
    $scope.artwork_url = item.artwork_url;
    
    // Assessment 3
    if(pid == 1) {
        $scope.project = '3rd Grade Unit Assessment';
        $scope.assessment = 'Storytelling Through Tableau';
		$scope.exmps = [{
	        'thumbnail': './src/resources/exmplars/third/Storytelling/s_1_thumb.jpg',
	        'id': 1,
	        'source': './src/resources/exmplars/third/Storytelling/s_1.jpg',
	        'exmplars': 'It is unclear who or what the student is representing.The pose detracts from the story being told.',
	        'isImage': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/third/Storytelling/s_2_thumb.jpg',
	        'id': 2,
	        'source': './src/resources/exmplars/third/Storytelling/s_2.jpg',
	        'exmplars': 'The student makes some attempt to show who or what he represents in the story being told. The pose does not seem to be an important part of the story.',
	        'isImage': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/third/Storytelling/s_3_thumb.jpg',
	        'id': 3,
	        'source': './src/resources/exmplars/third/Storytelling/s_3.jpg',
	        'exmplars': "The students pose is part of the story being told in the tableau. Who or what the student represents in the story needs clarification.",
	        'isImage': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/third/Storytelling/s_4_thumb.jpg',
	        'id': 4,
	        'source': './src/resources/exmplars/third/Storytelling/s_4.jpg',
	        'exmplars': "The student's pose is an integral part of the story being told. It is obvious who or what the student represents.",
	        'isImage': true,
	        'class_value': ''
	    }];	
	}

	if(pid == 2) {
        $scope.project = '4th Grade Unit Assessment';
        $scope.assessment = 'Character Physicalization';
		$scope.exmps = [{
	        'thumbnail': './src/resources/exmplars/fourth/PhysicalExpression/pe_1_thumb.jpg',
	        'id': 1,
	        'source': './src/resources/exmplars/fourth/PhysicalExpression/pe_1.mp4',
	        'exmplars': 'The students physical expression is unclear or difficult to view. Gestures portray very little emotion or student breaks character.',
	        'isVideo': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/fourth/PhysicalExpression/pe_2_thumb.jpg',
	        'id': 2,
	        'source': './src/resources/exmplars/fourth/PhysicalExpression/pe_2.mp4',
	        'exmplars': 'Student shows some attempt at physical expression. Portrays emotion through a simple stereotyped gesture (such as pretend crying).',
	        'isVideo': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/fourth/PhysicalExpression/pe_3_thumb.jpg',
	        'id': 3,
	        'source': './src/resources/exmplars/fourth/PhysicalExpression/pe_3.mp4',
	        'exmplars': 'The student exhibits body shape, level, and gesture to show what the character feels. Portrays simple emotions (happiness, sadness) through gestures and action.',
	        'isVideo': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/fourth/PhysicalExpression/pe_4_thumb.jpg',
	        'id': 4,
	        'source': './src/resources/exmplars/fourth/PhysicalExpression/pe_4.mp4',
	        'exmplars': 'The student exhibits a bold, strong choice in body shape, level, and gesture to show what the character feels. Portrays nuances of emotions (confusion, excitement, anxiety, etc.) that fit the character.',
	        'isVideo': true,
	        'class_value': ''
	    }];	
	}

	if(pid == 3) {
        $scope.project = '3rd Grade Performance Task Assessment';
        $scope.assessment = 'Storytelling Through Tableau';
		$scope.exmps = [{
	        'thumbnail': './src/resources/exmplars/third/Storytelling/s_1_thumb.jpg',
	        'id': 1,
	        'source': './src/resources/exmplars/third/Storytelling/s_1.jpg',
	        'exmplars': 'It is unclear who or what the student is representing.The pose detracts from the story being told.',
	        'isImage': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/third/Storytelling/s_2_thumb.jpg',
	        'id': 2,
	        'source': './src/resources/exmplars/third/Storytelling/s_2.jpg',
	        'exmplars': 'The student makes some attempt to show who or what he represents in the story being told. The pose does not seem to be an important part of the story.',
	        'isImage': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/third/Storytelling/s_3_thumb.jpg',
	        'id': 3,
	        'source': './src/resources/exmplars/third/Storytelling/s_3.jpg',
	        'exmplars': "The students pose is part of the story being told in the tableau. Who or what the student represents in the story needs clarification.",
	        'isImage': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/third/Storytelling/s_4_thumb.jpg',
	        'id': 4,
	        'source': './src/resources/exmplars/third/Storytelling/s_4.jpg',
	        'exmplars': "The student's pose is an integral part of the story being told. It is obvious who or what the student represents.",
	        'isImage': true,
	        'class_value': ''
	    }];	
	}

	if(pid == 4) {
        $scope.project = '4th Grade Performance Task Assessment';
        $scope.assessment = 'Character Physicalization';
		$scope.exmps = [{
	        'thumbnail': './src/resources/exmplars/fourth/PhysicalExpression/pe_1_thumb.jpg',
	        'id': 1,
	        'source': './src/resources/exmplars/fourth/PhysicalExpression/pe_1.mp4',
	        'exmplars': 'The students physical expression is unclear or difficult to view. Gestures portray very little emotion or student breaks character.',
	        'isVideo': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/fourth/PhysicalExpression/pe_2_thumb.jpg',
	        'id': 2,
	        'source': './src/resources/exmplars/fourth/PhysicalExpression/pe_2.mp4',
	        'exmplars': 'Student shows some attempt at physical expression. Portrays emotion through a simple stereotyped gesture (such as pretend crying).',
	        'isVideo': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/fourth/PhysicalExpression/pe_3_thumb.jpg',
	        'id': 3,
	        'source': './src/resources/exmplars/fourth/PhysicalExpression/pe_3.mp4',
	        'exmplars': 'The student exhibits body shape, level, and gesture to show what the character feels. Portrays simple emotions (happiness, sadness) through gestures and action.',
	        'isVideo': true,
	        'class_value': ''
	    }, {
	        'thumbnail': './src/resources/exmplars/fourth/PhysicalExpression/pe_4_thumb.jpg',
	        'id': 4,
	        'source': './src/resources/exmplars/fourth/PhysicalExpression/pe_4.mp4',
	        'exmplars': 'The student exhibits a bold, strong choice in body shape, level, and gesture to show what the character feels. Portrays nuances of emotions (confusion, excitement, anxiety, etc.) that fit the character.',
	        'isVideo': true,
	        'class_value': ''
	    }];	
	}
    
    if( item.exemplar_three > 0 ) {
	 	var index = item.exemplar_three - 1;
	 	$scope.exmps[index].class_value = 'active';
	 	$scope.selected_item = item.exemplar_three;
    }
});

sampleApp.controller('ProjectUploadController', function($scope, $location) {
    $scope.go_back_to_projects = function() {
        $location.path('saved-projects');
    }
});

sampleApp.controller('FinishGradingController', function($scope, $rootScope, $http, $location) {
    $scope.back_to_grading = function() {
        $location.path('third-exemplar');
    };

    $scope.finished_grading = function() {
    	var item = JSON.parse(localStorage.getItem('current_item')); 
    	
    	var postData = {
	    	cid: parseInt(item.class_id),
	    	sid: parseInt(item.student_id),
	    	saved: 0,
	    	incomplete: 0,
	    	artworkid: parseInt(item.artwork_id),
	    	writingid: parseInt(item.writing_id),
	    	ex1grade: parseInt(item.exemplar_one),
	    	ex2grade: parseInt(item.exemplar_two),
	    	ex3grade: parseInt(item.exemplar_three),
	    	ex4grade: 0,
            pid: parseInt(item.pid)
    	}
    	
    	if(item.gid) {
	    	postData.gid = item.gid;
    	}
    	
    	if(!postData.gid) {
	        var promise = $http.post($rootScope.baseUrl + '/api/grades', postData);
	        promise.success(function(data, status, headers, config){
	            if (status == 200){
	            	localStorage.removeItem('from_saved_projects');
					localStorage.removeItem('current_item');
	            	
	            	$location.path('dashboard');
	            } else {
					alert("Unable to save later.");
	            }
	        });
		} else {
			var promise = $http.put($rootScope.baseUrl + '/api/grades/' + postData.gid, postData);
	        promise.success(function(data, status, headers, config){
	            if (status == 200){
	            	localStorage.removeItem('from_saved_projects');
					localStorage.removeItem('current_item');
	            	
	            	$location.path('dashboard');
	            } else {
					alert("Unable to save later.");
	            }
	        });
		}
    };
});

sampleApp.controller('ArtUploadedController', function($scope, $rootScope, $http, $location, Upload) {
	$scope.writing_id  = null;
	$scope.show_icon = false;
	$scope.uploading = false;
	
	$scope.upload_writing_work = function(files) {
		if (files && files.length) {
			$scope.show_icon = true;
			$scope.uploading = true;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: $rootScope.baseUrl + '/api/upload.php',
                    file: file
                }).success(function (data, status, headers, config) {
                    var fileData  = {
                       'lastModified'     : file.lastModified,
                       'lastModifiedDate' : file.lastModifiedDate,
                       'name'             : data,
                       'size'             : file.size,
                       'mimetype'         : file.type
                    };

                    var promise = $http.post($rootScope.baseUrl + '/api/files', fileData);
                    promise.success(function(data, status, headers, config){
                        if (status == 200){
            		        console.log("File added to database.");
            		        $scope.writing_id = data;
            		        
            		        var item = JSON.parse(localStorage.getItem('current_item'));
            		        item.writing_id = data;
            		        localStorage.setItem('current_item', JSON.stringify(item));
            		   
            		        $location.path('writing-uploaded');
                        } else {
            				console.log("Unable to add file to database.");
                        }
                    });
                });
            }
        }//and of writing method
	};
	
    $scope.go_to_grade_now = function() {	
        $location.path('writing-uploaded');
    };
});

sampleApp.controller('WritingUploadedController', function($scope, $location, $http, $rootScope) {
	var item = JSON.parse(localStorage.getItem('current_item'));
	
	$scope.current_item = item;
	$scope.artwork_url = '/mobart/data/files/' + item.artwork_url;
	$scope.writing_url = '';
	$scope.writing_text = 'Writing Not Uploaded!';
	
    $scope.grade_now = function() {
    	localStorage.setItem('from_saved_projects', false);
        $location.path('grade-project');
    };
    if(item.writing_id) {
    	$scope.writing_text = 'Writing Uploaded!';
	    	$http
		        .get($rootScope.baseUrl + '/api/files/' + item.writing_id)
		        .success(function(response) {
		            $scope.writing_url = '/mobart/data/files/' + response[0].filename;
                    $scope.writing_mimetype = response[0].mimetype;
                    $scope.writing_filename = response[0].filename;
		            $scope.is_uploading = false;
		            $scope.uploaded = true;
		        });
    	}
    
    $scope.grade_later = function() {
    	var postData = {
	    	cid: item.class_id,
	    	sid: item.student_id,
	    	artworkid: item.artwork_id,
	    	saved: 1,
	    	incomplete: 0,
	    	ex1grade: 0,
	    	ex2grade: 0,
	    	ex3grade: 0,
	    	ex4grade: 0,
            pid: item.pid
    	}
    	
    	if(item.writing_id) {
	    	postData.writingid = item.writing_id;
    	}
    	
        var promise = $http.post($rootScope.baseUrl + '/api/grades', postData);
        promise.success(function(data, status, headers, config){
            if (status == 200) {
            	localStorage.removeItem('current_item');
            	$location.path('dashboard');
            } else {
				alert("Unable to save later.");
            }
        });
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
        var path = window.location.origin + window.location.pathname;
        path += "#/saved-projects";

        $('.modal-backdrop').remove();
        //window.location.href = path;
        $location.path('saved-projects');
    };

    $scope.grade_now = function() {
        var path = window.location.origin + window.location.pathname;
        path += "#/grade-project/";

        $('.modal-backdrop').remove();
        //window.location.href = path;
        $location.path('grade-project');
    }
});

sampleApp.controller('NewProjectController', function($scope, $rootScope, $http, $location, Upload) {

	var test = null;
    $scope.is_uploading = false;
    $scope.uploaded = false;
    var userData = JSON.parse(localStorage.getItem('user_data'));
    $http
        .get($rootScope.baseUrl + '/api/classes')
        .success(function(response) {
        	console.log(response);
        	var arr = [];
        	for(var i = 0; i < response.length; i++) {
	        	if(response[i].tid == userData.uid) {
		        	arr.push(response[i]);
	        	}
        	}
        	
        	$scope.classes = arr;
        });

    $scope.update_students = function() {
        $http
            .get($rootScope.baseUrl + '/api/classes/' + $scope.selected_class.id + '/students')
            .success(function(response) {
                $scope.students = response;
            });
    };

    $scope.update_projects = function() {
        //todo
    }

    $scope.uploadArtwork = function(files) {
    	if (files && files.length) {
    		$scope.is_uploading = true;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: $rootScope.baseUrl + '/api/upload.php',
                    file: file
                }).success(function(data, status, headers, config) {
                    var fileData = {
                        'lastModified': file.lastModified,
                        'lastModifiedDate': file.lastModifiedDate,
                        'name': data,
                        'size': file.size,
                        'mimetype': file.type
                    };
					
                    var promise = $http.post($rootScope.baseUrl + '/api/files', fileData);
                    promise.success(function(data, status, headers, config) {
                        if (status == 200) {
                            $scope.artwork_id = data;
                            $http
						        .get($rootScope.baseUrl + '/api/files/' + data)
						        .success(function(response) {
						        	console.log(response);
						        	$scope.artwork_mimetype = response[0].mimetype;
                                    $scope.artwork_url = "/mobart/data/files/" + response[0].filename;
                                    $scope.artwork_filename = response[0].filename;
									$scope.is_uploading = false;
									$scope.uploaded = true;
						        });
                        } else {
                            console.log("Unable to add file to database.");
                        }
                    });
                });
            } //end for
        }//end if
    };

    $scope.project_list = [{
        'name': '3rd Grade Unit Assessment',
        id: 1
    }, {
        'name': '4th Grade Unit Assessment',
        id: 2
    }, {
        'name': '3rd Grade Performance Task Assessment',
        id: 3
    }, {
        'name': '4th Grade Performance Task Assessment',
        id: 4
    }];

    $scope.upload_artwork = function() {
		
		var incomplete_project = $('.checkbox').is(":checked");
		var error_str = '';
		
		var _class = $('.class-dropdown').val();
		var _student = $('.student-dropdownlist').val();
		var _project = $('.project-dropdown').val();
		
		if(_student && _class && _project) {
		
			if (incomplete_project) {
				//Post data	then dashboard
				
				var postData = {
			    	cid: _class,
			    	sid: _student,
			    	incomplete: 1,
			    	saved: 0,
			    	ex1grade: 0,
			    	ex2grade: 0,
			    	ex3grade: 0,
			    	ex4grade: 0,
			    	pid: _project
		    	}
		        var promise = $http.post($rootScope.baseUrl + '/api/grades', postData);
		        promise.success(function(data, status, headers, config){
		            if (status == 200){
		            	$location.path('dashboard');
		            } else {
						alert("Unable to save later.");
		            }
		        });		
		
			} else {
			
				if(!$scope.artwork_id) {
					error_str += "Error: No Artwork Uploaded.";
					$('p.error_message').html(error_str);
				} else {
					var post_data = {
						class_id: _class,
						student_id: _student,
						artwork_id: $scope.artwork_id,
						artwork_url: $scope.artwork_url,
                        artwork_mimetype: $scope.artwork_mimetype,
                        pid: _project
					};
					
					localStorage.setItem('current_item', JSON.stringify(post_data));
					$location.path('art-uploaded/' + post_data.artwork_id);
				}
				
			}
			
		} else {
			
			if(!_class) {
				error_str += "Error: No Class Selected. <br />";	
			}
			
			if(!_project) {
				error_str += "Error: No Project Selected. <br />";	
			}
			
			if(!_student) {
				error_str += "Error: No Student Selected. <br />";	
			}
			
			$('p.error_message').html(error_str);
			
		}
    };
});

sampleApp.controller('ProjectController', function($scope, $rootScope, $http, $location) {
	var userData = JSON.parse(localStorage.getItem('user_data'));
	var id = userData.uid;
	
	$http
        .get($rootScope.baseUrl + '/api/saved/' + id)
        .success(function(response) {
            $scope.saved_items = response;
            console.log($scope.saved_items);
        });
        
    $scope.open_saved_project = function(id) {
    	$http
        .get($rootScope.baseUrl + '/api/grades/' + id)
        .success(function(response) {
        	var postData = {
		    	class_id: response[0].cid,
		    	student_id: response[0].sid,
		    	artwork_id: response[0].artworkid,
		    	artwork_url: "/mobart/data/files/" + response[0].artworkfilepath,
                artwork_mimetype: response[0].artworkmimetype,
		    	writing_id: response[0].writingid,
		    	exemplar_one: response[0].ex1grade,
		    	exemplar_two: response[0].ex2grade,
		    	exemplar_three: response[0].ex3grade,
		    	ex4grade: 0, 
		    	gid: response[0].id,
                pid: response[0].pid
			};
			
			console.log(postData);
			
            localStorage.setItem('current_item', JSON.stringify(postData));
            $location.path('grade-project');
        });
    };

});
