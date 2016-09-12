
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
    $rootScope.clearCurrentItem = function () {
        localStorage.removeItem('current_item');
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
        when('/next-student', {
            templateUrl: 'src/views/grade/next-student.html',
            controller: 'NextStudentController'
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
    $rootScope.clearCurrentItem();
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
	    	console.log($scope.selected_item);
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
    var json_url = $rootScope.baseUrl + '/api/assessment1';//'http://iaccessfresno.com/mobart/src/resources/assessment1.json';
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

		if(pid == 5) {
	        $scope.project = '3rd Grade Unit Assessment';
	        $scope.assessment = 'Resources Based on Observation';
			$scope.exmps = response.data.project5;	
		}
		
		if(pid == 6) {
	        $scope.project = '4th Grade Unit Assessment';
	        $scope.assessment = 'Facial Proportions';
			$scope.exmps = response.data.project6;	
		}
		
		if(pid == 7) {
	        $scope.project = '3rd Grade Performance Task Assessment';
	        $scope.assessment = 'Resources Based on Observation';
			$scope.exmps = response.data.project7;	
		}
		
		if(pid == 8) {
	        $scope.project = '4th Grade Performance Task Assessment';
	        $scope.assessment = 'Facial Proportions';
			$scope.exmps = response.data.project8;	
		}

		if(pid == 9) {
	        $scope.project = '3rd Grade Theatre';
	        $scope.assessment = 'Facial Expression';
			$scope.exmps = response.data.project9;	
		}

		if(pid == 10) {
	        $scope.project = '3rd Grade Visual Arts';
	        $scope.assessment = 'Illusion of Space';
			$scope.exmps = response.data.project10;	
		}

		if(pid == 11) {
	        $scope.project = '4th Grade Theatre';
	        $scope.assessment = 'Facial Expression';
			$scope.exmps = response.data.project11;	
		}

		if(pid == 12) {
	        $scope.project = '4th Grade Visual Arts';
	        $scope.assessment = 'Expression';
			$scope.exmps = response.data.project12;	
		}

		if(pid == 13) {
	        $scope.project = '5TH Grade Theatre Performance Task';
	        $scope.assessment = 'Theatrical Skills';
			$scope.exmps = response.data.project13;	
		}

		if(pid == 14) {
	        $scope.project = '5TH Grade Theatre Unit AssessmenT';
	        $scope.assessment = 'Theatrical Skills';
			$scope.exmps = response.data.project14;	
		}

		if(pid == 15) {
	        $scope.project = '6TH Grade Theatre Performance Task';
	        $scope.assessment = 'Theatrical Skills';
			$scope.exmps = response.data.project15;	
		}

		if(pid == 16) {
	        $scope.project = '6TH Grade Theatre Unit Assessment';
	        $scope.assessment = 'Theatrical Skills';
			$scope.exmps = response.data.project16;	
		}
		
		if( item.exemplar_one > 0 ) {
			console.log(item);
		 	var index = item.exemplar_one - 1;
		 	$scope.exmps[index].class_value = 'active';
		 	$scope.selected_item = item.exemplar_one;
	    }
    });
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
	var json_url = $rootScope.baseUrl + '/api/assessment2';//'http://iaccessfresno.com/mobart/src/resources/assessment2.json';
    var promise = $http.get(json_url).then(function(response){
	    var item = JSON.parse(localStorage.getItem('current_item')); 
		var pid = item.pid;
		
		if(pid == 1) {
	        $scope.project = '3rd Grade Unit Assessment';
	        $scope.assessment = 'Facial Expression';
			$scope.exmps = response.data.project1;	
		}
		
		if(pid == 2) {
	        $scope.project = '4th Grade Unit Assessment';
	        $scope.assessment = 'Vocal Expression';
			$scope.exmps = response.data.project2;	
		}
		
		if(pid == 3) {
	        $scope.project = '3rd Grade Performance Task Assessment';
	        $scope.assessment = 'Facial Expression';
			$scope.exmps = response.data.project3;	
		}
		
		if(pid == 4) {
	        $scope.project = '4th Grade Performance Task Assessment';
	        $scope.assessment = 'Vocal Expression';
			$scope.exmps = response.data.project4;	
		}	

		if(pid == 5) {
	        $scope.project = '3rd Grade Unit Assessment';
	        $scope.assessment = 'Illusion Of Space';
			$scope.exmps = response.data.project5;	
		}
		
		if(pid == 6) {
	        $scope.project = '4th Grade Unit Assessment';
	        $scope.assessment = 'Expression';
			$scope.exmps = response.data.project6;	
		}
		
		if(pid == 7) {
	        $scope.project = '3rd Grade Performance Task Assessment';
	        $scope.assessment = 'Illusion Of Space';
			$scope.exmps = response.data.project7;	
		}
		
		if(pid == 8) {
	        $scope.project = '4th Grade Performance Task Assessment';
	        $scope.assessment = 'Expression';
			$scope.exmps = response.data.project8;	
		}

		if(pid == 9) {
	        $scope.project = '3rd Grade Theatre';
	        $scope.assessment = 'Physical Expression';
			$scope.exmps = response.data.project9;	
		}

		if(pid == 10) {
	        $scope.project = '3rd Grade Visual Arts';
	        $scope.assessment = 'Resources Based on Observation';
			$scope.exmps = response.data.project10;	
		}

		if(pid == 11) {
	        $scope.project = '4th Grade Theatre';
	        $scope.assessment = 'Physical Expression';
			$scope.exmps = response.data.project11;	
		}

		if(pid == 12) {
	        $scope.project = '4th Grade Visual Arts';
	        $scope.assessment = 'Historical Details';
			$scope.exmps = response.data.project12;	
		}

		if(pid == 13) {
	        $scope.project = '5TH Grade Theatre Performance Task';
	        $scope.assessment = 'Improvisation';
			$scope.exmps = response.data.project13;	
		}

		if(pid == 14) {
	        $scope.project = '5TH Grade Theatre Unit AssessmenT';
	        $scope.assessment = 'Improvisation';
			$scope.exmps = response.data.project14;	
		}

		if(pid == 15) {
	        $scope.project = '6TH Grade Theatre Performance Task';
	        $scope.assessment = 'Improvisation';
			$scope.exmps = response.data.project15;	
		}

		if(pid == 16) {
	        $scope.project = '6TH Grade Theatre Unit Assessment';
	        $scope.assessment = 'Improvisation';
			$scope.exmps = response.data.project16;	
		}
		
		if( item.exemplar_two > 0 ) {
		 	var index = item.exemplar_two - 1;
		 	$scope.exmps[index].class_value = 'active';
		 	$scope.selected_item = item.exemplar_two;
	    }	
    });
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
	var json_url = $rootScope.baseUrl + '/api/assessment3';//http://iaccessfresno.com/mobart/src/resources/assessment3.json';
    var promise = $http.get(json_url).then(function(response){
	    var item = JSON.parse(localStorage.getItem('current_item')); 
		var pid = item.pid;
		
		if(pid == 1) {
	        $scope.project = '3rd Grade Unit Assessment';
	        $scope.assessment = 'Storytelling Through Tableau';
			$scope.exmps = response.data.project1;	
		}
		
		if(pid == 2) {
	        $scope.project = '4th Grade Unit Assessment';
	        $scope.assessment = 'Character Physicalization';
			$scope.exmps = response.data.project2;	
		}
		
		if(pid == 3) {
	        $scope.project = '3rd Grade Performance Task Assessment';
	        $scope.assessment = 'Storytelling Through Tableau';
			$scope.exmps = response.data.project3;	
		}
		
		if(pid == 4) {
	        $scope.project = '4th Grade Performance Task Assessment';
	        $scope.assessment = 'Character Physicalization';
			$scope.exmps = response.data.project4;	
		}	

		if(pid == 5) {
	        $scope.project = '3rd Grade Unit Assessment';
	        $scope.assessment = 'Creating Tints, Shades and Neutral Colors.';
			$scope.exmps = response.data.project5;	
		}
		
		if(pid == 6) {
	        $scope.project = '4th Grade Unit Assessment';
	        $scope.assessment = 'Historical Details';
			$scope.exmps = response.data.project6;	
		}
		
		if(pid == 7) {
	        $scope.project = '3rd Grade Performance Task Assessment';
	        $scope.assessment = 'Creating Tints, Shades and Neutral Colors.';
			$scope.exmps = response.data.project7;	
		}
		
		if(pid == 8) {
	        $scope.project = '4th Grade Performance Task Assessment';
	        $scope.assessment = 'Historical Details';
			$scope.exmps = response.data.project8;	
		}

		if(pid == 9) {
	        $scope.project = '3rd Grade Theatre';
	        $scope.assessment = 'Storytelling';
			$scope.exmps = response.data.project9;	
		}

		if(pid == 10) {
	        $scope.project = '3rd Grade Visual Art';
	        $scope.assessment = 'Creating Tints, Shades and Neutral Colors';
			$scope.exmps = response.data.project10;	
		}

		if(pid == 11) {
	        $scope.project = '4th Grade Theatre';
	        $scope.assessment = 'Vocal Expression';
			$scope.exmps = response.data.project11;	
		}

		if(pid == 12) {
	        $scope.project = '4th Grade Visual Art';
	        $scope.assessment = 'Proportion';
			$scope.exmps = response.data.project12;	
		}

		if(pid == 13) {
	        $scope.project = '5TH Grade Theatre Performance Task';
	        $scope.assessment = 'Blocking';
			$scope.exmps = response.data.project13;	
		}

		if(pid == 14) {
	        $scope.project = '5TH Grade Theatre Unit AssessmenT';
	        $scope.assessment = 'Blocking';
			$scope.exmps = response.data.project13;	
		}

		if(pid == 15) {
	        $scope.project = '6TH Grade Theatre Performance Task';
	        $scope.assessment = 'Script Writing';
			$scope.exmps = response.data.project13;	
		}

		if(pid == 16) {
	        $scope.project = '6TH Grade Theatre Unit Assessment';
	        $scope.assessment = 'Script Writing';
			$scope.exmps = response.data.project13;	
		}
		
		if( item.exemplar_three > 0 ) {
		 	var index = item.exemplar_three - 1;
		 	$scope.exmps[index].class_value = 'active';
		 	$scope.selected_item = item.exemplar_three;
	    }	
    });
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
	            	$location.path('next-student');
	            } else {
					alert("Unable to save. Try again.");
	            }
	        });
		} else {
			var promise = $http.put($rootScope.baseUrl + '/api/grades/' + postData.gid, postData);
	        promise.success(function(data, status, headers, config){
	            if (status == 200){
	            	localStorage.removeItem('from_saved_projects');            	
	            	$location.path('next-student');
	            } else {
					alert("Unable to save. Try again.");
	            }
	        });
		}
    };
});

sampleApp.controller('NextStudentController', function($scope, $rootScope, $http, $location) {
    $scope.grade_next_student = function() {
        $location.path('new-projects');
    };

    $scope.back_to_home = function() {
    	$location.path('dashboard');
        $rootScope.clearCurrentItem();
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
            	$location.path('next-student');
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
    var currentItem = JSON.parse(localStorage.getItem('current_item'));
    $http
        .get($rootScope.baseUrl + '/api/classes')
        .success(function(response) {
        	var arr = [];
        	for(var i = 0; i < response.length; i++) {
	        	if(response[i].tid == userData.uid) {
		        	arr.push(response[i]);
	        	}
        	}
            if (currentItem) {
            	if (currentItem.class_id) {
                    $scope.selected_class = [];
                    $scope.selected_class.id = currentItem.class_id;
                    $scope.update_students();
                }
                if (currentItem.pid) {
                    $scope.selected_project = [];
                    $scope.selected_project.id = parseInt(currentItem.pid);
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

    $scope.project_list = [
    /*
    {
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
    },{
        'name': 'Third Grade Visual Art Unit Assessment',
        id: 5
    }, {
        'name': 'Fourth Grade Visual Art Unit Assessment',
        id: 6
    }, {
        'name': 'Third Grade Visual Art Perf Task Assessment',
        id: 7
    }, {
        'name': 'Fourth Grade Visual Art Perf Task Assessment',
        id: 8
    },*/{
        'name': 'Third Grade Theatre',
        id: 9
    }, {
        'name': 'Third Grade Visual Art',
        id: 10
    }, {
        'name': 'Fourth Grade Theatre',
        id: 11
    }, {
        'name': 'Fourth Grade Visual Art',
        id: 12
    }, {
        'name': 'Fifth Grade Theatre Performance Task',
        id: 13
    }, {
        'name': 'Fifth Grade Theatre Unit Assessment',
        id: 14
    }, {
        'name': 'Sixth Grade Theatre Performance Task',
        id: 15
    }, {
        'name': 'Sixth Grade Theatre Unit Assessment',
        id: 16
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