/// <reference path="angular.min.js" />
 angular.module("myApp", ['ngRoute', 'ngCookies', 'ui.bootstrap', 'textAngular'])

 		.directive('fileModel', function ($parse) {
            return {
               restrict: 'A',
               link: function(scope, element, attrs) {
                  var model = $parse(attrs.fileModel);
                  var modelSetter = model.assign;
                  
                  element.bind('change', function(){
                     scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                     });
                  });
               }
            };
         })
      
        .service('fileUpload', ['$http', '$location', function ($http, $location) {
            this.uploadFileToUrl = function(file, uploadUrl){
               var fd = new FormData();
               for( var key in file)
               		fd.append(key, file[key]);
            	console.log(fd);
               $http.post(uploadUrl, fd, {
               	  headers: { 'Content-Type' : undefined},
                  transformRequest: angular.identity
               })
            
               .success(function(data){
               		var id = data;
               		$location.path('/file/' + id);
               })
            
               .error(function(){
               	console.log(fd);
               });
            }
         }])

 		.filter('startFrom', function() {
		    return function(input, start) {
		        if(input) {
		            start = +start; //parse to int
		            return input.slice(start);
		        }
		        return [];
		    }
		})

 		.config(['$routeProvider', '$locationProvider',
			function($routeProvider, $locationProvider) {
				$routeProvider.
				when('/' , {
					templateUrl : 'views/home.html',
					controller : 'mainCtrl'
				}).when('/file/:id', {
					templateUrl : 'views/file.html',
					controller : 'fileCtrl'
				}).when('/new-file', {
					templateUrl : 'views/new-file.html',
					controller : 'newCtrl'
				}).when('/404', {
					templateUrl : 'views/404.html'
				}).otherwise({ 
					redirectTo : '/404'
				});
		}])

		.controller("mainCtrl",  function($scope, $http, $timeout){

				$scope.load = function ()  {
				    $http.get('/files').
				     	success(function(data, status, headers, config) {
				        	$scope.files = data;
				        	$scope.currentPage = 1; //current page
					        $scope.entryLimit = 6; //max no of items to display in a page
					        $scope.filteredItems = $scope.files.length; //Initially for no filter  
					        $scope.totalItems = $scope.files.length;
				      }).
				     	error(function(data, status, headers, config) {
				       		console.log(status);
				        	console.log(data);
				     });
				};
				$scope.load();

				$scope.orderFiles = "-uploaded"

				$scope.sortBy = function (orderValue) {
					$scope.orderFiles = orderValue;
					console.log($scope.orderFiles);
				};

				$scope.catSort = "";

				$scope.filterFile = function (file) {
				 	if($scope.catSort == "") {
				 		return '' == $scope.catSort ;
				 	}
				 	return file.filetype == $scope.catSort;
			    };

			    $scope.filter = {};

			    $scope.getCategories = function () {
			        return ($scope.files || []).map(function (w) {
			            return w.category;
			        }).filter(function (w, idx, arr) {
			            return arr.indexOf(w) === idx;
			        });
			    };

			    $scope.filterByCategory = function (file) {
			        return $scope.filter[file.category] || noFilter($scope.filter);
			    };
			    
			    function noFilter(filterObj) {
			        for (var key in filterObj) {
			            if (filterObj[key]) {
			                return false;
			            }
			        }
			        return true;
			    };

			     $scope.selected = function() {
			        $timeout(function() { 
			            $scope.filteredItems = $scope.filtered.length;
			        }, 10);
			    };

			    $scope.setPage = function(pageNo) {
       			 	$scope.currentPage = pageNo;
    			};
		})
		
		.controller("fileCtrl",  function($scope, $cookies, $http, $location, $routeParams, $timeout){

				$scope.load = function ()  {
				    $http.get('/files').
				     	success(function(data, status, headers, config) {
				        	$scope.files = data;
				      }).
				     	error(function(data, status, headers, config) {
				       		console.log(status);
				        	console.log(data);
				     });
				};
				$scope.load();

				$scope.aanpassen = function (id)  {
				    $http.get("/file/" + id).
					    success(function(data, status, headers, config) {
					        $scope.onefile = data[0];
					      }).
					    error(function(data, status, headers, config) {
					        console.log(status);
					        console.log(data);
					      });
				};
				$scope.id = $routeParams.id;
				$scope.aanpassen($scope.id);

				$scope.edit = function (id)  {
				    $http.put("/file/" + id, angular.toJson($scope.onefile)).success(function () {
				    	$scope.aan = false;
				    });
				};

				$scope.verwijderen = function (id)  {
				    $http.delete("/file/" + id).success(function () {
				    	$location.path('/');
				    });
				};

				$scope.clear = function ()  {
				    $scope.onefile = "";
				};

				$scope.aan = false;
				$scope.pasaan = function () {
				 	$scope.aan = true;
				}

				$scope.cancel = function() {
				 	$scope.aan = false;
				}

				$scope.waardeer = function(id) {
					if($cookies.get("Cookie" + id) == id) {
						$scope.showGreeting = true;
				       	$timeout(function(){
				          $scope.showGreeting = false;
				       	}, 1500);
					} else {
						$http.put('/like/' + id).
							success(function() {
								console.log('liked');
								$scope.onefile.votes ++;
							})
							.error(function() {

							});
							$cookies.put("Cookie" + id, id); 
					}
				}
		})

		.controller("newCtrl",  function($scope, $http, $location, fileUpload){
				$scope.file = {};
				$scope.opslaan = function(){
	               var file = $scope.file;	                             
	               var uploadUrl = "/files";

	               fileUpload.uploadFileToUrl(file, uploadUrl);
	            };


				$scope.load = function ()  {
				    $http.get('/files').
				     	success(function(data, status, headers, config) {
				        	$scope.files = data;
				      }).
				     	error(function(data, status, headers, config) {
				       		console.log(status);
				        	console.log(data);
				     });
				};
				$scope.load();
		});