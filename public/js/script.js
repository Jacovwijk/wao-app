/// <reference path="angular.min.js" />
 angular.module("myApp", ['ngRoute'])

 		.config(['$routeProvider', '$locationProvider',
			function($routeProvider, $locationProvider) {
				$routeProvider.
				when('/' , {
					templateUrl : 'views/home.html',
					controller : 'myController'
				}).when('/file/:id', {
					templateUrl : 'views/file.html',
					controller : 'myController'
				}).when('/404', {
					templateUrl : 'views/404.html',
					controller : 'myController'
				});
				//otherwise({ redirectTo : '/404'});
		}])

		.controller("myController",  function($scope, $http, $log, $routeParams){

				$scope.opslaan = function ()  {
				    $http.post('/files', angular.toJson($scope.file)).success(function () {
				    	$scope.load();
				    	$scope.file = "";
				    });
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
				    	$scope.load();
				    	$scope.onefile = "";
				    });
				 };

				$scope.verwijderen = function (id)  {
				    $http.delete("/file/" + id).success(function () {
				    	$scope.load();
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

				$scope.sortColumn = "title"; 
				$scope.reverseSort = false; 
				$scope.catSort = "";

				$scope.sortData = function (column) {
					$scope.reverseSort = ($scope.sortColumn == column) ? !$scope.reverseSort : false;

					$scope.sortColumn = column;
				}

				$scope.getSortClass = function (column) {
					if ($scope.sortColumn == column) {

						return $scope.reverseSort ? 'arrow-down' : 'arrow-up';

					}
					return '';
				}

				// filter op filetype
				$scope.filterFile = function (file) {
				 	if($scope.catSort == "") {
				 		return '' == $scope.catSort ;
				 	}
				 	return file.filetype == $scope.catSort;
			    }

			    // filter op category
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
			    } 

		});
		